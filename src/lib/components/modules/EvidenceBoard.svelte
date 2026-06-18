<script>
	import { ClipboardCheck, ClipboardList, GitBranch, GitCompareArrows, Lightbulb, LockKeyhole, NotebookText, Route, Users } from "@lucide/svelte";
	import { t } from "$lib/i18n";
	import CaseReviewPanel from "$lib/components/modules/CaseReviewPanel.svelte";
	import ConnectionBoard from "$lib/components/modules/ConnectionBoard.svelte";
	import ContradictionsPanel from "$lib/components/modules/ContradictionsPanel.svelte";
	import DeductionsPanel from "$lib/components/modules/DeductionsPanel.svelte";
	import EvidenceCard from "$lib/components/modules/EvidenceCard.svelte";
	import EvidenceDetail from "$lib/components/modules/EvidenceDetail.svelte";
	import InvestigatorNotes from "$lib/components/modules/InvestigatorNotes.svelte";
	import SuspectsPanel from "$lib/components/modules/SuspectsPanel.svelte";
	import TimelinePanel from "$lib/components/modules/TimelinePanel.svelte";

	let {
		evidences = [],
		activeEvidenceId = null,
		recentEvidenceId = null,
		connections = [],
		notes = [],
		unlockedDeductions = {},
		deductionDefinitions = [],
		timelineEvents = [],
		totalTimelineEvents = 0,
		timelinePreferredOrder = [],
		timelineState = {},
		contradictionSources = [],
		contradictions = [],
		requiredContradictionIds = [],
		contradictionForSelectedSources = /** @type {(sourceIds: string[]) => Record<string, any> | null} */ (() => null),
		contradictionSourceForId = /** @type {(sourceId: string) => Record<string, any> | null} */ (() => null),
		confirmedContradictions = {},
		suspects = [],
		suspectAccusation = {},
		decisionAttempts = {},
		completedDecisions = {},
		finalReportDecisionId = /** @type {string} */ ("chapter-1-final-report"),
		finalReportQuestions = [],
		finalReportCopyKeyPrefix = "caseReview",
		activeChapterId = "chapter-1",
		caseStats = {
			evidenceDiscovered: 0,
			evidenceTotal: 0,
			caseCompletionPercent: 0,
			chapterProgressPercent: 0
		},
		mechanicsEnabled = true,
		finalReportUnlocked = false,
		chapter1Resolved = false,
		onSelectEvidence = () => {},
		onCreateConnection = () => {},
		onSetTimelineOrder = () => {},
		onValidateTimeline = () => {},
		onSubmitContradiction = () => {},
		onSubmitAccusation = () => {},
		onSubmitFinalReport = () => {}
	} = $props();

	let activeView = $state("files");
	const activeEvidence = $derived(evidences.find(isActiveEvidence) ?? null);
	const evidenceTitles = $derived(
		Object.fromEntries(evidences.map((evidence) => [evidence.evidenceId, $t(evidence.titleKey)]))
	);
	const fileView = { id: "files", labelKey: "evidence.views.files", icon: ClipboardList };
	const mechanicViews = [
		{ id: "files", labelKey: "evidence.views.files", icon: ClipboardList },
		{ id: "timeline", labelKey: "evidence.views.timeline", icon: Route },
		{ id: "contradictions", labelKey: "evidence.views.contradictions", icon: GitCompareArrows },
		{ id: "suspects", labelKey: "evidence.views.suspects", icon: Users },
		{ id: "connections", labelKey: "evidence.views.connections", icon: GitBranch },
		{ id: "notes", labelKey: "evidence.views.notes", icon: NotebookText },
		{ id: "deductions", labelKey: "evidence.views.deductions", icon: Lightbulb }
	];
	const baseViews = $derived(mechanicsEnabled ? mechanicViews : [fileView]);
	const views = $derived(
		mechanicsEnabled && (finalReportUnlocked || chapter1Resolved)
			? [
					...baseViews,
					...(finalReportUnlocked ? [{ id: "review", labelKey: "evidence.views.review", icon: ClipboardCheck }] : [])
				]
			: baseViews
	);

	/** @param {Record<string, any>} evidence */
	function isActiveEvidence(evidence) {
		return evidence.id === activeEvidenceId;
	}

	$effect(() => {
		if (!mechanicsEnabled && activeView !== "files") {
			activeView = "files";
		}
	});

	/** @param {number} value */
	function boundedPercent(value) {
		return Math.max(0, Math.min(100, Math.round(value)));
	}
</script>

<article class="flex h-full min-h-0 flex-col">
	<div class="border-b border-cyan-300/10 p-4">
		<div class="flex flex-wrap items-start justify-between gap-4">
			<div class="min-w-0">
				<div class="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-white/40">
					<ClipboardList size={13} class="soft-glitch" />
					<span>{$t("evidence.title")}</span>
				</div>
				<p class="mt-2 max-w-3xl text-sm leading-6 text-white/60">{$t("evidence.subtitle")}</p>
			</div>
			<div class="grid min-w-[220px] gap-2 text-[10px] uppercase tracking-[0.14em] text-white/45 sm:grid-cols-3 sm:min-w-[520px]">
				<div class="rounded border border-cyan-300/15 bg-cyan-300/5 p-2">
					<p>{$t("caseProgress.evidenceDiscovered")}</p>
					<p class="mt-1 text-sm font-semibold text-cyan-50">
						{caseStats.evidenceDiscovered}/{caseStats.evidenceTotal}
					</p>
				</div>
				<div class="rounded border border-emerald-300/15 bg-emerald-300/5 p-2">
					<p>{$t("caseProgress.caseCompletion")}</p>
					<div class="mt-2 h-1.5 overflow-hidden rounded bg-black/40">
						<div class="h-full bg-emerald-300/70" style={`width: ${boundedPercent(caseStats.caseCompletionPercent)}%`}></div>
					</div>
					<p class="mt-1 text-sm font-semibold text-emerald-50">{boundedPercent(caseStats.caseCompletionPercent)}%</p>
				</div>
				<div class="rounded border border-white/10 bg-white/[0.03] p-2">
					<p>{$t("caseProgress.chapterProgress")}</p>
					<div class="mt-2 h-1.5 overflow-hidden rounded bg-black/40">
						<div class="h-full bg-cyan-300/70" style={`width: ${boundedPercent(caseStats.chapterProgressPercent)}%`}></div>
					</div>
					<p class="mt-1 text-sm font-semibold text-cyan-50">{boundedPercent(caseStats.chapterProgressPercent)}%</p>
				</div>
			</div>
		</div>

		<div class="mt-4 flex flex-wrap gap-2">
			{#each views as view}
				{@const Icon = view.icon}
				<button
					type="button"
					class={activeView === view.id
						? "flex h-9 items-center gap-2 rounded border border-cyan-300/35 bg-cyan-300/10 px-3 text-[10px] uppercase tracking-[0.14em] text-cyan-50"
						: "flex h-9 items-center gap-2 rounded border border-white/10 bg-black/25 px-3 text-[10px] uppercase tracking-[0.14em] text-white/50 hover:border-cyan-300/25 hover:text-white"}
					aria-pressed={activeView === view.id}
					onclick={() => (activeView = view.id)}
				>
					<Icon size={13} />
					{$t(view.labelKey)}
				</button>
			{/each}
		</div>
	</div>

	<div class="min-h-0 flex-1 overflow-y-auto p-4">
		<div class="grid gap-4">
			{#if activeView === "connections"}
				<ConnectionBoard {evidences} {connections} {deductionDefinitions} {onCreateConnection} />
			{:else if activeView === "timeline"}
				<TimelinePanel
					events={timelineEvents}
					totalEvents={totalTimelineEvents}
					preferredOrder={timelinePreferredOrder}
					{timelineState}
					{onSetTimelineOrder}
					{onValidateTimeline}
				/>
			{:else if activeView === "contradictions"}
				<ContradictionsPanel
					sources={contradictionSources}
					{contradictions}
					{requiredContradictionIds}
					{contradictionForSelectedSources}
					sourceForId={contradictionSourceForId}
					{confirmedContradictions}
					{onSubmitContradiction}
				/>
			{:else if activeView === "suspects"}
				<SuspectsPanel {suspects} accusationState={suspectAccusation} {onSubmitAccusation} />
			{:else if activeView === "notes"}
				<InvestigatorNotes {notes} chapterId={activeChapterId} />
			{:else if activeView === "deductions"}
				<DeductionsPanel {unlockedDeductions} {evidenceTitles} {deductionDefinitions} />
			{:else if activeView === "review" && finalReportUnlocked}
				<CaseReviewPanel
					{decisionAttempts}
					{completedDecisions}
					decisionId={finalReportDecisionId}
					questions={finalReportQuestions}
					copyKeyPrefix={finalReportCopyKeyPrefix}
					{onSubmitFinalReport}
				/>
			{:else if evidences.length}
				<div class="grid gap-4 2xl:grid-cols-[360px_minmax(0,1fr)]">
					<div class="grid content-start gap-3">
						{#each evidences as evidence}
							<EvidenceCard
								evidence={evidence}
								active={activeEvidenceId === evidence.id}
								isNew={recentEvidenceId === evidence.id}
								onSelect={onSelectEvidence}
							/>
						{/each}
					</div>
					<EvidenceDetail evidence={activeEvidence} />
				</div>
			{:else}
				<div class="grid min-h-[320px] place-items-center rounded border border-white/10 bg-black/25 p-6 text-center">
					<div>
						<div class="mx-auto flex h-12 w-12 items-center justify-center rounded border border-cyan-300/25 bg-cyan-300/10 text-cyan-50">
							<LockKeyhole size={20} />
						</div>
						<h3 class="mt-4 text-sm font-semibold uppercase tracking-[0.16em] text-white">{$t("evidence.empty")}</h3>
						<p class="mt-3 max-w-md text-xs leading-5 text-white/50">{$t("evidence.lockedHint")}</p>
					</div>
				</div>
			{/if}
		</div>
	</div>
</article>
