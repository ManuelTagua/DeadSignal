<script>
	import { CheckCircle, GitCompareArrows, LockKeyhole, X } from "@lucide/svelte";
	import {
		CHAPTER_CONTRADICTIONS,
		GENERIC_CONTRADICTION_EXPLANATIONS,
		REQUIRED_CHAPTER_CONTRADICTION_IDS,
		contradictionForSources,
		contradictionSourceForId
	} from "$lib/game/contradictions";
	import { t } from "$lib/i18n";
	import { formatTimestamp } from "$lib/utils/format";

	let {
		sources = [],
		contradictions = /** @type {Array<Record<string, any>>} */ (CHAPTER_CONTRADICTIONS),
		requiredContradictionIds = REQUIRED_CHAPTER_CONTRADICTION_IDS,
		genericExplanations = GENERIC_CONTRADICTION_EXPLANATIONS,
		contradictionForSelectedSources = contradictionForSources,
		sourceForId = contradictionSourceForId,
		confirmedContradictions = {},
		onSubmitContradiction = () => ({})
	} = $props();

	let selectedSourceIds = $state(/** @type {string[]} */ ([]));
	let selectedExplanationId = $state("");
	const confirmedCount = $derived(
		requiredContradictionIds.filter((contradictionId) => confirmedContradictions?.[contradictionId]).length
	);
	const selectedContradiction = $derived(
		selectedSourceIds.length === 2 ? contradictionForSelectedSources(selectedSourceIds) : null
	);
	const explanationOptions = $derived(selectedContradiction?.explanations ?? genericExplanations);
	const confirmedItems = $derived(
		contradictions.filter(/** @param {Record<string, any>} contradiction */ (contradiction) => confirmedContradictions?.[contradiction.id]).map(/** @param {Record<string, any>} contradiction */ (contradiction) => ({
			...contradiction,
			record: confirmedContradictions[contradiction.id]
		}))
	);

	/** @param {Record<string, any>} source */
	function toggleSource(source) {
		if (selectedSourceIds.includes(source.id)) {
			selectedSourceIds = selectedSourceIds.filter((sourceId) => sourceId !== source.id);
			selectedExplanationId = "";
			return;
		}

		selectedSourceIds =
			selectedSourceIds.length >= 2 ? [selectedSourceIds[1], source.id] : [...selectedSourceIds, source.id];
		selectedExplanationId = "";
	}

	/** @param {string} sourceId */
	function sourceIsSelected(sourceId) {
		return selectedSourceIds.includes(sourceId);
	}

	function clearSelection() {
		selectedSourceIds = [];
		selectedExplanationId = "";
	}

	function submitContradiction() {
		if (selectedSourceIds.length !== 2 || !selectedExplanationId) return;

		const result = onSubmitContradiction(selectedSourceIds, selectedExplanationId);
		if (result?.accepted) clearSelection();
	}

	/** @param {string} sourceId */
	function visibleSourceForId(sourceId) {
		return sources.find((source) => source.id === sourceId) ?? sourceForId(sourceId);
	}

	/** @param {Record<string, any>} contradiction */
	function sourcePairLabel(contradiction) {
		const [firstId, secondId] = contradiction.sourceIds;
		const first = sourceForId(firstId);
		const second = sourceForId(secondId);

		return `${first ? $t(first.shortLabelKey) : firstId} + ${second ? $t(second.shortLabelKey) : secondId}`;
	}
</script>

<section class="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
	<div class="grid gap-4">
		<div class="rounded border border-cyan-300/15 bg-black/25 p-4">
			<div class="flex flex-wrap items-start justify-between gap-4">
				<div class="min-w-0">
					<div class="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-white/40">
						<GitCompareArrows size={13} />
						<span>{$t("contradictions.title")}</span>
					</div>
					<h3 class="mt-2 text-lg font-semibold text-white">{$t("contradictions.heading")}</h3>
					<p class="mt-2 max-w-3xl text-sm leading-6 text-white/60">{$t("contradictions.body")}</p>
				</div>
				<div class="min-w-[180px] rounded border border-cyan-300/15 bg-cyan-300/5 p-3 text-[10px] uppercase tracking-[0.14em] text-white/45">
					<p>{$t("contradictions.progress")}</p>
					<p class="mt-1 text-sm font-semibold text-cyan-50">
						{confirmedCount}/{requiredContradictionIds.length}
					</p>
				</div>
			</div>
		</div>

		<div class="rounded border border-white/10 bg-black/25 p-3">
			<div class="flex flex-wrap items-center justify-between gap-3">
				<p class="text-[10px] uppercase tracking-[0.18em] text-white/40">{$t("contradictions.sources.title")}</p>
				{#if selectedSourceIds.length}
					<button
						type="button"
						class="flex h-8 items-center gap-2 rounded border border-white/10 bg-white/[0.03] px-2 text-[10px] uppercase tracking-[0.14em] text-white/55 hover:border-cyan-300/25 hover:text-white"
						onclick={clearSelection}
					>
						<X size={13} />
						{$t("contradictions.actions.clear")}
					</button>
				{/if}
			</div>

			<div class="mt-3 grid gap-2 md:grid-cols-2">
				{#each sources as source}
					<button
						type="button"
						class={sourceIsSelected(source.id)
							? "rounded border border-emerald-300/40 bg-emerald-300/10 p-3 text-left"
							: "rounded border border-white/10 bg-white/[0.03] p-3 text-left hover:border-cyan-300/30 hover:bg-cyan-300/5"}
						aria-pressed={sourceIsSelected(source.id)}
						onclick={() => toggleSource(source)}
					>
						<p class="text-[10px] uppercase tracking-[0.14em] text-white/35">{$t(`contradictions.sourceTypes.${source.type}`)}</p>
						<p class="mt-1 text-sm font-semibold leading-5 text-white">{$t(source.titleKey)}</p>
						<p class="mt-2 text-xs leading-5 text-white/55">{$t(source.datumKey)}</p>
					</button>
				{:else}
					<div class="grid min-h-[180px] place-items-center rounded border border-white/10 bg-black/25 p-6 text-center md:col-span-2">
						<div>
							<div class="mx-auto flex h-12 w-12 items-center justify-center rounded border border-cyan-300/25 bg-cyan-300/10 text-cyan-50">
								<LockKeyhole size={20} />
							</div>
							<h3 class="mt-4 text-sm font-semibold uppercase tracking-[0.16em] text-white">{$t("contradictions.sources.empty")}</h3>
							<p class="mt-3 max-w-md text-xs leading-5 text-white/50">{$t("contradictions.sources.emptyHint")}</p>
						</div>
					</div>
				{/each}
			</div>
		</div>

		<div class="rounded border border-cyan-300/15 bg-cyan-300/5 p-4">
			<div class="flex flex-wrap items-start justify-between gap-3">
				<div class="min-w-0">
					<p class="text-[10px] uppercase tracking-[0.18em] text-white/40">{$t("contradictions.review.title")}</p>
					<h3 class="mt-2 text-base font-semibold text-white">
						{#if selectedSourceIds.length === 2}
							{selectedContradiction ? $t(selectedContradiction.questionKey) : $t("contradictions.review.genericQuestion")}
						{:else}
							{$t("contradictions.review.selectTwo")}
						{/if}
					</h3>
				</div>
			</div>

			{#if selectedSourceIds.length}
				<div class="mt-3 grid gap-2 sm:grid-cols-2">
					{#each selectedSourceIds as sourceId}
						{@const source = visibleSourceForId(sourceId)}
						<div class="rounded border border-white/10 bg-black/25 p-3">
							<p class="text-[10px] uppercase tracking-[0.14em] text-white/35">
								{$t(selectedSourceIds[0] === sourceId ? "contradictions.labels.sourceA" : "contradictions.labels.sourceB")}
							</p>
							<p class="mt-1 text-sm font-semibold text-white">{source ? $t(source.titleKey) : sourceId}</p>
							{#if source}
								<p class="mt-2 text-xs leading-5 text-white/55">{$t(source.datumKey)}</p>
							{/if}
						</div>
					{/each}
				</div>
			{/if}

			{#if selectedSourceIds.length === 2}
				<div class="mt-4 grid gap-2">
					{#each explanationOptions as explanation}
						<button
							type="button"
							class={selectedExplanationId === explanation.id
								? "rounded border border-emerald-300/35 bg-emerald-300/10 p-3 text-left text-sm leading-6 text-emerald-50"
								: "rounded border border-white/10 bg-black/30 p-3 text-left text-sm leading-6 text-white/70 hover:border-cyan-300/30 hover:bg-cyan-300/5 hover:text-white"}
							aria-pressed={selectedExplanationId === explanation.id}
							onclick={() => (selectedExplanationId = explanation.id)}
						>
							{$t(explanation.labelKey)}
						</button>
					{/each}
				</div>

				<button
					type="button"
					class="mt-4 flex h-10 items-center justify-center gap-2 rounded border border-emerald-300/30 bg-emerald-300/10 px-3 text-xs uppercase tracking-[0.14em] text-emerald-50 hover:border-emerald-200/60 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:border-emerald-300/30"
					disabled={!selectedExplanationId}
					onclick={submitContradiction}
				>
					<CheckCircle size={14} />
					{$t("contradictions.actions.submit")}
				</button>
			{/if}
		</div>
	</div>

	<aside class="grid content-start gap-3">
		<div class="rounded border border-white/10 bg-black/25 p-3">
			<p class="text-[10px] uppercase tracking-[0.18em] text-white/40">{$t("contradictions.confirmed.title")}</p>
			<div class="mt-3 grid gap-2">
				{#each confirmedItems as contradiction}
					<div class="rounded border border-emerald-300/25 bg-emerald-300/10 p-3">
						<div class="flex items-center justify-between gap-2">
							<p class="text-[10px] uppercase tracking-[0.12em] text-emerald-100/75">
								{contradiction.record?.confirmedAt ? formatTimestamp(contradiction.record.confirmedAt) : $t("contradictions.confirmed.persisted")}
							</p>
							<CheckCircle size={13} class="text-emerald-100" />
						</div>
						<p class="mt-2 text-sm font-semibold leading-5 text-white">{$t(contradiction.titleKey)}</p>
						<p class="mt-2 text-xs leading-5 text-white/60">{sourcePairLabel(contradiction)}</p>
					</div>
				{:else}
					<p class="text-xs leading-5 text-white/45">{$t("contradictions.confirmed.empty")}</p>
				{/each}
			</div>
		</div>
	</aside>
</section>
