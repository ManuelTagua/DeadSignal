<script>
	import { RadioTower, X } from "@lucide/svelte";
	import { t } from "$lib/i18n";

	let { open = false, summaryKey = "chapterSummary", caseIntegrityPercent = 100, onClose = () => {} } = $props();

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
						{$t(`${summaryKey}.eyebrow`)}
					</p>
					<h2 class="mt-2 text-2xl font-semibold leading-8 text-white">{$t(`${summaryKey}.title`)}</h2>
					<p class="mt-2 inline-flex rounded border border-emerald-300/25 bg-emerald-300/10 px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-emerald-50">
						{$t(`${summaryKey}.status`)}
					</p>
				</div>
				<button
					type="button"
					class="flex h-8 w-8 shrink-0 items-center justify-center rounded border border-white/10 bg-black/30 text-white/45 hover:border-cyan-300/25 hover:text-white"
					aria-label={$t(`${summaryKey}.actions.close`)}
					onclick={() => onClose()}
				>
					<X size={14} />
				</button>
			</div>

			<div class="grid gap-4 p-5">
				<div class="rounded border border-white/10 bg-white/[0.03] p-4">
					<p class="text-[10px] uppercase tracking-[0.16em] text-white/35">{$t(`${summaryKey}.fields.summary`)}</p>
					<p class="mt-2 text-sm leading-6 text-white/70">{$t(`${summaryKey}.summary`)}</p>
				</div>

				<div class="grid gap-3 sm:grid-cols-3">
					<div class="rounded border border-white/10 bg-black/25 p-3">
						<p class="text-[10px] uppercase tracking-[0.16em] text-white/35">{$t(`${summaryKey}.fields.suspect`)}</p>
						<p class="mt-2 text-sm font-semibold leading-6 text-white">{$t(`${summaryKey}.values.suspect`)}</p>
					</div>
					<div class="rounded border border-white/10 bg-black/25 p-3">
						<p class="text-[10px] uppercase tracking-[0.16em] text-white/35">{$t(`${summaryKey}.fields.cause`)}</p>
						<p class="mt-2 text-sm font-semibold leading-6 text-white">{$t(`${summaryKey}.values.cause`)}</p>
					</div>
					<div class="rounded border border-emerald-300/20 bg-emerald-300/5 p-3">
						<p class="text-[10px] uppercase tracking-[0.16em] text-white/35">{$t(`${summaryKey}.fields.integrity`)}</p>
						<p class="mt-2 text-sm font-semibold leading-6 text-emerald-50">{boundedPercent(caseIntegrityPercent)}%</p>
					</div>
				</div>

				<div class="flex flex-wrap items-center justify-end gap-2 pt-1">
					<button
						type="button"
						class="h-10 rounded border border-emerald-300/35 bg-emerald-300/10 px-3 text-xs uppercase tracking-[0.14em] text-emerald-50 hover:border-emerald-200/60"
						onclick={() => onClose()}
					>
						{$t(`${summaryKey}.actions.continue`)}
					</button>
				</div>
			</div>
		</section>
	</div>
{/if}
