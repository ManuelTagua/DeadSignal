<script>
	import { CheckCircle, ClipboardCheck, LockKeyhole, Send, ShieldAlert } from "@lucide/svelte";
	import { FINAL_REPORT_DECISION_ID, FINAL_REPORT_QUESTIONS } from "$lib/game/caseReview";
	import { CASE_DECISION_MAX_ATTEMPTS } from "$lib/stores/InvestigationStore";
	import { t } from "$lib/i18n";

	let {
		decisionAttempts = {},
		completedDecisions = {},
		decisionId = /** @type {string} */ (FINAL_REPORT_DECISION_ID),
		questions = FINAL_REPORT_QUESTIONS,
		copyKeyPrefix = "caseReview",
		onSubmitFinalReport = () => ({})
	} = $props();

	let selectedChoices = $state(/** @type {Record<string, string>} */ ({}));
	let feedbackKey = $state("");
	let feedbackTone = $state(/** @type {"accepted" | "rejected" | ""} */ (""));
	let syncedDecisionId = $state("");

	const attemptsUsed = $derived(decisionAttempts[decisionId] ?? 0);
	const attemptsRemaining = $derived(Math.max(0, CASE_DECISION_MAX_ATTEMPTS - attemptsUsed));
	const completed = $derived(Boolean(completedDecisions[decisionId]));
	const exhausted = $derived(!completed && attemptsUsed >= CASE_DECISION_MAX_ATTEMPTS);
	const answeredCount = $derived(questions.filter((question) => Boolean(selectedChoices[question.id])).length);
	const allAnswered = $derived(answeredCount >= questions.length);

	$effect(() => {
		if (syncedDecisionId === decisionId) return;
		selectedChoices = {};
		feedbackKey = "";
		feedbackTone = "";
		syncedDecisionId = decisionId;
	});

	/**
	 * @param {string} questionId
	 * @param {string} choiceId
	 */
	function selectChoice(questionId, choiceId) {
		if (completed || exhausted) return;

		selectedChoices = {
			...selectedChoices,
			[questionId]: choiceId
		};
		feedbackKey = "";
		feedbackTone = "";
	}

	function submitReport() {
		if (!allAnswered || completed || exhausted) return;

		const result = onSubmitFinalReport(selectedChoices);

		if (result?.accepted) {
			feedbackKey = `${copyKeyPrefix}.feedback.accepted`;
			feedbackTone = "accepted";
			return;
		}

		feedbackKey = result?.blocked ? `${copyKeyPrefix}.feedback.exhausted` : `${copyKeyPrefix}.feedback.rejected`;
		feedbackTone = "rejected";

		if (!result?.blocked) {
			selectedChoices = {};
		}
	}

	/**
	 * @param {Record<string, any>} question
	 * @param {string} choiceId
	 */
	function choiceClass(question, choiceId) {
		const selected = selectedChoices[question.id] === choiceId;
		const acceptedAfterCompletion = completed && question.correctChoiceIds.includes(choiceId);

		if (selected || acceptedAfterCompletion) {
			return "rounded border border-emerald-300/35 bg-emerald-300/10 p-3 text-left text-sm leading-6 text-emerald-50";
		}

		return "rounded border border-white/10 bg-black/30 p-3 text-left text-sm leading-6 text-white/70 hover:border-cyan-300/30 hover:bg-cyan-300/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-50";
	}

	function panelClass() {
		if (completed) return "rounded border border-emerald-300/35 bg-emerald-300/10 p-4";
		if (exhausted) return "rounded border border-cyan-100/35 bg-cyan-100/[0.06] p-4";
		return "rounded border border-cyan-300/15 bg-black/25 p-4";
	}
</script>

<section class="grid gap-4">
	<div class={panelClass()}>
		<div class="flex flex-wrap items-start justify-between gap-4">
			<div class="min-w-0">
				<div class="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-white/40">
					<ClipboardCheck size={13} />
					<span>{$t(`${copyKeyPrefix}.title`)}</span>
				</div>
				<h3 class="mt-2 text-lg font-semibold text-white">{$t(`${copyKeyPrefix}.heading`)}</h3>
				<p class="mt-2 max-w-3xl text-sm leading-6 text-white/60">{$t(`${copyKeyPrefix}.body`)}</p>
			</div>
			<div class="min-w-[180px] rounded border border-cyan-300/15 bg-cyan-300/5 p-3 text-[10px] uppercase tracking-[0.14em] text-white/45">
				<p>{$t("caseReview.progress")}</p>
				<p class="mt-1 text-sm font-semibold text-cyan-50">
					{answeredCount}/{questions.length}
				</p>
			</div>
		</div>
	</div>

	<div class="grid gap-3 xl:grid-cols-2">
		{#each questions as question, index}
			<article class="rounded border border-white/10 bg-black/25 p-4">
				<div class="flex items-start justify-between gap-3">
					<div class="min-w-0">
						<p class="flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-white/35">
							{#if completed}
								<CheckCircle size={13} />
								{$t("caseReview.status.accepted")}
							{:else if exhausted}
								<LockKeyhole size={13} />
								{$t("caseReview.status.locked")}
							{:else}
								<ShieldAlert size={13} />
								{$t("caseReview.status.pending")}
							{/if}
						</p>
						<h3 class="mt-2 text-base font-semibold leading-6 text-white">
							{$t("caseReview.questionLabel", { number: index + 1 })} {$t(question.titleKey)}
						</h3>
					</div>
				</div>

				<div class="mt-4 grid gap-2">
					{#each question.choices as choice}
						<button
							type="button"
							class={choiceClass(question, choice.id)}
							disabled={completed || exhausted}
							aria-pressed={selectedChoices[question.id] === choice.id}
							onclick={() => selectChoice(question.id, choice.id)}
						>
							{$t(choice.labelKey)}
						</button>
					{/each}
				</div>
			</article>
		{/each}
	</div>

	<div class="rounded border border-white/10 bg-white/[0.03] p-4">
		<div class="flex flex-wrap items-center justify-between gap-3">
			<div>
				<p class="text-[10px] uppercase tracking-[0.14em] text-white/40">
					{#if completed}
						{$t("caseReview.attempts.resolved")}
					{:else if exhausted}
						{$t("caseReview.attempts.exhausted")}
					{:else}
						{$t("caseReview.attempts.remaining", {
							remaining: attemptsRemaining,
							max: CASE_DECISION_MAX_ATTEMPTS
						})}
					{/if}
				</p>
				{#if feedbackKey}
					<p class={feedbackTone === "accepted" ? "mt-2 text-sm leading-6 text-emerald-50" : "mt-2 text-sm leading-6 text-cyan-50"}>
						{$t(feedbackKey)}
					</p>
				{/if}
			</div>
			<button
				type="button"
				class="flex h-10 items-center justify-center gap-2 rounded border border-emerald-300/30 bg-emerald-300/10 px-3 text-xs uppercase tracking-[0.14em] text-emerald-50 hover:border-emerald-200/60 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:border-emerald-300/30"
				disabled={!allAnswered || completed || exhausted}
				onclick={submitReport}
			>
				<Send size={13} />
				{$t("caseReview.actions.submit")}
			</button>
		</div>
	</div>
</section>
