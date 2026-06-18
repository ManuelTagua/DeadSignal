<script>
	import { CheckCircle, LockKeyhole, ShieldAlert, UserRound, Users } from "@lucide/svelte";
	import { CASE_DECISION_MAX_ATTEMPTS } from "$lib/stores/InvestigationStore";
	import { t } from "$lib/i18n";

	let {
		suspects = [],
		accusationState = {},
		onSubmitAccusation = () => ({})
	} = $props();

	let selectedSuspectId = $state("");
	let selectedReasonId = $state("");
	let feedbackKey = $state("");
	let feedbackAccepted = $state(false);

	const accepted = $derived(Boolean(accusationState?.accepted));
	const attemptsUsed = $derived(Math.max(0, Number(accusationState?.attempts ?? 0)));
	const attemptsRemaining = $derived(Math.max(0, CASE_DECISION_MAX_ATTEMPTS - attemptsUsed));
	const exhausted = $derived(!accepted && attemptsUsed >= CASE_DECISION_MAX_ATTEMPTS);
	const selectedSuspect = $derived(
		suspects.find((suspect) => suspect.id === selectedSuspectId) ??
			suspects.find((suspect) => suspect.discovered) ??
			suspects[0] ??
			null
	);
	const acceptedSuspect = $derived(suspects.find((suspect) => suspect.id === accusationState?.suspectId) ?? null);
	const acceptedReason = $derived(
		acceptedSuspect?.reasons?.find(/** @param {Record<string, any>} reason */ (reason) => reason.id === accusationState?.reasonId) ?? null
	);
	const canSubmit = $derived(Boolean(selectedSuspect?.discovered && selectedReasonId && !accepted && !exhausted));

	/** @param {Record<string, any>} suspect */
	function knownFacts(suspect) {
		return suspect.facts.filter(/** @param {Record<string, any>} fact */ (fact) => fact.unlocked);
	}

	/** @param {Record<string, any>} suspect */
	function suspectClass(suspect) {
		if (accepted && accusationState?.suspectId === suspect.id) return "rounded border border-emerald-300/35 bg-emerald-300/10 p-3 text-left";
		if (selectedSuspect?.id === suspect.id) return "rounded border border-cyan-300/35 bg-cyan-300/10 p-3 text-left";
		return "rounded border border-white/10 bg-black/25 p-3 text-left hover:border-cyan-300/25 hover:bg-cyan-300/5";
	}

	/** @param {Record<string, any>} suspect */
	function selectSuspect(suspect) {
		if (accepted || exhausted) return;
		selectedSuspectId = suspect.id;
		selectedReasonId = "";
		feedbackKey = "";
		feedbackAccepted = false;
	}

	/** @param {string} reasonId */
	function selectReason(reasonId) {
		if (accepted || exhausted) return;
		selectedReasonId = reasonId;
		feedbackKey = "";
		feedbackAccepted = false;
	}

	function submitAccusation() {
		if (!canSubmit || !selectedSuspect) return;

		const result = onSubmitAccusation(selectedSuspect.id, selectedReasonId);
		feedbackKey = result?.hintKey ?? (result?.accepted ? "suspects.feedback.accepted" : "suspects.feedback.rejected");
		feedbackAccepted = Boolean(result?.accepted);
	}
</script>

<section class="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
	<div class="grid gap-4">
		<div class="rounded border border-cyan-300/15 bg-black/25 p-4">
			<div class="flex flex-wrap items-start justify-between gap-4">
				<div class="min-w-0">
					<div class="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-white/40">
						<Users size={13} />
						<span>{$t("suspects.title")}</span>
					</div>
					<h3 class="mt-2 text-lg font-semibold text-white">{$t("suspects.heading")}</h3>
					<p class="mt-2 max-w-3xl text-sm leading-6 text-white/60">{$t("suspects.body")}</p>
				</div>
				<div class="min-w-[180px] rounded border border-cyan-300/15 bg-cyan-300/5 p-3 text-[10px] uppercase tracking-[0.14em] text-white/45">
					<p>{$t("suspects.progress")}</p>
					<p class="mt-1 text-sm font-semibold text-cyan-50">{attemptsRemaining}/{CASE_DECISION_MAX_ATTEMPTS}</p>
				</div>
			</div>
		</div>

		<div class="grid gap-3 2xl:grid-cols-2">
			{#each suspects as suspect}
				<button
					type="button"
					class={suspectClass(suspect)}
					aria-pressed={selectedSuspect?.id === suspect.id}
					disabled={accepted || exhausted}
					onclick={() => selectSuspect(suspect)}
				>
					<div class="flex items-start justify-between gap-3">
						<div class="min-w-0">
							<p class="flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-white/35">
								<UserRound size={13} />
								{suspect.discovered ? $t("suspects.status.discovered") : $t("suspects.status.undiscovered")}
							</p>
							<h3 class="mt-2 text-base font-semibold leading-6 text-white">{$t(suspect.nameKey)}</h3>
							<p class="mt-1 text-xs uppercase tracking-[0.12em] text-cyan-100/65">{$t(suspect.roleKey)}</p>
						</div>
						{#if accepted && accusationState?.suspectId === suspect.id}
							<CheckCircle size={16} class="text-emerald-100" />
						{/if}
					</div>

					<div class="mt-3 grid gap-2">
						{#each suspect.facts as fact}
							<div class="rounded border border-white/10 bg-black/20 p-2">
								{#if fact.unlocked}
									<p class="text-xs leading-5 text-white/70">{$t(fact.labelKey)}</p>
									<p class="mt-1 text-[10px] uppercase tracking-[0.12em] text-white/35">{$t(fact.sourceKey)}</p>
								{:else}
									<p class="flex items-center gap-2 text-xs leading-5 text-white/35">
										<LockKeyhole size={12} />
										{$t("suspects.lockedFact")}
									</p>
								{/if}
							</div>
						{/each}
					</div>
				</button>
			{/each}
		</div>
	</div>

	<aside class="grid content-start gap-3">
		<div class="rounded border border-white/10 bg-black/25 p-4">
			<div class="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-white/40">
				<ShieldAlert size={13} />
				{$t("suspects.accusation.title")}
			</div>

			{#if accepted && acceptedSuspect}
				<div class="mt-4 rounded border border-emerald-300/30 bg-emerald-300/10 p-3">
					<p class="flex items-center gap-2 text-[10px] uppercase tracking-[0.14em] text-emerald-100">
						<CheckCircle size={13} />
						{$t("suspects.feedback.acceptedTitle")}
					</p>
					<h3 class="mt-2 text-sm font-semibold leading-6 text-white">{$t(acceptedSuspect.nameKey)}</h3>
					{#if acceptedReason}
						<p class="mt-2 text-xs leading-5 text-emerald-50/80">{$t(acceptedReason.labelKey)}</p>
					{/if}
				</div>
			{:else if selectedSuspect}
				<p class="mt-3 text-sm font-semibold leading-6 text-white">{$t(selectedSuspect.questionKey)}</p>
				<p class="mt-2 text-xs leading-5 text-white/50">
					{#if selectedSuspect.discovered}
						{$t("suspects.accusation.chooseReason", { count: knownFacts(selectedSuspect).length })}
					{:else}
						{$t("suspects.accusation.needsFacts")}
					{/if}
				</p>

				<div class="mt-4 grid gap-2">
					{#each selectedSuspect.reasons as reason}
						<button
							type="button"
							class={selectedReasonId === reason.id
								? "rounded border border-emerald-300/35 bg-emerald-300/10 p-3 text-left text-sm leading-6 text-emerald-50"
								: "rounded border border-white/10 bg-black/30 p-3 text-left text-sm leading-6 text-white/70 hover:border-cyan-300/30 hover:bg-cyan-300/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"}
							disabled={!selectedSuspect.discovered || exhausted}
							aria-pressed={selectedReasonId === reason.id}
							onclick={() => selectReason(reason.id)}
						>
							{$t(reason.labelKey)}
						</button>
					{/each}
				</div>

				<div class="mt-4 flex flex-wrap items-center justify-between gap-2">
					<p class="text-[10px] uppercase tracking-[0.14em] text-white/40">
						{#if exhausted}
							{$t("suspects.attempts.exhausted")}
						{:else}
							{$t("suspects.attempts.remaining", { remaining: attemptsRemaining, max: CASE_DECISION_MAX_ATTEMPTS })}
						{/if}
					</p>
					<button
						type="button"
						class="flex h-9 items-center justify-center gap-2 rounded border border-emerald-300/30 bg-emerald-300/10 px-3 text-xs uppercase tracking-[0.14em] text-emerald-50 hover:border-emerald-200/60 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:border-emerald-300/30"
						disabled={!canSubmit}
						onclick={submitAccusation}
					>
						<CheckCircle size={13} />
						{$t("suspects.actions.submit")}
					</button>
				</div>
			{/if}

			{#if feedbackKey}
				<p class={feedbackAccepted
					? "mt-3 rounded border border-emerald-300/25 bg-emerald-300/[0.08] px-3 py-2 text-xs leading-5 text-emerald-50"
					: "mt-3 rounded border border-cyan-100/25 bg-cyan-100/[0.06] px-3 py-2 text-xs leading-5 text-cyan-50"}
				>
					{$t(feedbackKey)}
				</p>
			{:else if exhausted}
				<p class="mt-3 rounded border border-cyan-100/25 bg-cyan-100/[0.06] px-3 py-2 text-xs leading-5 text-cyan-50">
					{$t("suspects.feedback.exhausted")}
				</p>
			{/if}
		</div>
	</aside>
</section>
