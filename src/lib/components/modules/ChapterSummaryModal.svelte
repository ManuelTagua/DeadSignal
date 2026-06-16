<script>
	import { RadioTower, X } from "@lucide/svelte";
	import { t } from "$lib/i18n";

	let { open = false, caseCompletionPercent = 0, onClose = () => {} } = $props();

	/** @param {number} value */
	function boundedPercent(value) {
		return Math.max(0, Math.min(100, Math.round(value)));
	}
</script>

{#if open}
	<div class="fixed inset-0 z-50 grid place-items-center bg-black/75 p-4 backdrop-blur-sm">
		<section class="dead-panel w-full max-w-3xl overflow-hidden rounded">
			<div class="flex items-start justify-between gap-3 border-b border-cyan-300/10 p-5">
				<div class="min-w-0">
					<p class="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-emerald-100/75">
						<RadioTower size={14} />
						{$t("chapterSummary.eyebrow")}
					</p>
					<h2 class="mt-2 text-2xl font-semibold leading-8 text-white">{$t("chapterSummary.title")}</h2>
				</div>
				<button
					type="button"
					class="flex h-8 w-8 shrink-0 items-center justify-center rounded border border-white/10 bg-black/30 text-white/45 hover:border-cyan-300/25 hover:text-white"
					aria-label={$t("chapterSummary.actions.close")}
					onclick={() => onClose()}
				>
					<X size={14} />
				</button>
			</div>

			<div class="grid gap-4 p-5">
				<div class="grid gap-2 text-sm leading-6 text-white/70 sm:grid-cols-2">
					{#each ["communication", "unauthorized", "serverRoom", "deliberate", "internal"] as item}
						<div class="rounded border border-white/10 bg-black/25 px-3 py-2">
							{$t(`chapterSummary.points.${item}`)}
						</div>
					{/each}
				</div>

				<div class="rounded border border-emerald-300/20 bg-emerald-300/5 p-3">
					<div class="flex items-center justify-between gap-3 text-[10px] uppercase tracking-[0.16em] text-white/45">
						<span>{$t("caseProgress.caseCompletion")}</span>
						<span class="text-emerald-50">{boundedPercent(caseCompletionPercent)}%</span>
					</div>
					<div class="mt-2 h-1.5 overflow-hidden rounded bg-black/40">
						<div class="h-full bg-emerald-300/70" style={`width: ${boundedPercent(caseCompletionPercent)}%`}></div>
					</div>
				</div>

				<p class="text-sm leading-6 text-emerald-50/80">{$t("chapterSummary.hook")}</p>
				<p class="rounded border border-white/10 bg-white/[0.03] px-3 py-2 text-xs leading-5 text-white/50">
					{$t("chapterSummary.chapterTwoUnavailable")}
				</p>

				<div class="flex flex-wrap items-center justify-end gap-2 pt-1">
					<button
						type="button"
						class="h-10 rounded border border-white/10 bg-black/30 px-3 text-xs uppercase tracking-[0.14em] text-white/55 opacity-50"
						disabled
					>
						{$t("chapterSummary.actions.chapterTwo")}
					</button>
					<button
						type="button"
						class="h-10 rounded border border-emerald-300/35 bg-emerald-300/10 px-3 text-xs uppercase tracking-[0.14em] text-emerald-50 hover:border-emerald-200/60"
						onclick={() => onClose()}
					>
						{$t("chapterSummary.actions.continue")}
					</button>
				</div>
			</div>
		</section>
	</div>
{/if}
