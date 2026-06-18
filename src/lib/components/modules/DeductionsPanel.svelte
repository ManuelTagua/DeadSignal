<script>
	import { CheckCircle, Lightbulb, LockKeyhole } from "@lucide/svelte";
	import { DEDUCTION_DEFINITIONS } from "$lib/game/deductions";
	import { t } from "$lib/i18n";

	let { unlockedDeductions = {}, evidenceTitles = {}, deductionDefinitions = DEDUCTION_DEFINITIONS } = $props();

	/** @param {string} deductionId */
	function isUnlocked(deductionId) {
		return Boolean(unlockedDeductions[deductionId]);
	}
</script>

<section class="grid gap-3">
	<div class="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-white/40">
		<Lightbulb size={13} />
		<span>{$t("deductions.title")}</span>
	</div>

	<div class="grid gap-3 xl:grid-cols-2">
		{#each deductionDefinitions as deduction}
			<article
				class={isUnlocked(deduction.id)
					? "rounded border border-emerald-300/35 bg-emerald-300/10 p-4"
					: "rounded border border-white/10 bg-black/25 p-4 opacity-65"}
			>
				<div class="flex items-start justify-between gap-3">
					<div class="min-w-0">
						<p class="flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-white/35">
							{#if isUnlocked(deduction.id)}
								<CheckCircle size={13} />
								{$t("deductions.unlocked")}
							{:else}
								<LockKeyhole size={13} />
								{$t("deductions.locked")}
							{/if}
						</p>
						<h3 class="mt-2 text-base font-semibold text-white">
							{isUnlocked(deduction.id) ? $t(deduction.titleKey) : $t("deductions.lockedTitle")}
						</h3>
					</div>
				</div>

				<p class="mt-3 text-sm leading-6 text-white/60">
					{isUnlocked(deduction.id) ? $t(deduction.descriptionKey) : $t("deductions.lockedDescription")}
				</p>

				<div class="mt-4 grid gap-2">
					{#each deduction.evidenceIds as evidenceId}
						<div class="rounded border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-white/60">
							{evidenceTitles[evidenceId] ?? $t("deductions.unknownEvidence")}
						</div>
					{/each}
				</div>
			</article>
		{/each}
	</div>
</section>
