<script>
	import { RotateCcw, TerminalSquare } from "@lucide/svelte";
	import { t } from "$lib/i18n";

	let {
		open = false,
		caseIntegrityPercent = 100,
		onNewInvestigation = () => {},
		onBackToMenu = () => {}
	} = $props();

	const completedCases = ["helix", "mirror", "reflection"];

	/** @param {number} value */
	function boundedPercent(value) {
		return Math.max(0, Math.min(100, Math.round(value)));
	}
</script>

{#if open}
	<div class="fixed inset-0 z-50 overflow-y-auto bg-black/85 p-4 backdrop-blur-sm">
		<section class="mx-auto my-6 grid w-full max-w-4xl gap-5">
			<div class="dead-panel overflow-hidden rounded border-cyan-300/25">
				<div class="border-b border-cyan-300/10 p-5">
					<p class="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-cyan-100/75">
						<TerminalSquare size={14} />
						{$t("finalArchive.eyebrow")}
					</p>
					<h2 class="mt-3 text-3xl font-semibold uppercase tracking-[0.16em] text-white">{$t("finalArchive.title")}</h2>
					<p class="mt-3 max-w-3xl text-sm leading-6 text-white/60">{$t("finalArchive.subtitle")}</p>
				</div>

				<div class="grid gap-4 p-5">
					<div class="grid gap-3 md:grid-cols-[220px_minmax(0,1fr)]">
						<div class="rounded border border-emerald-300/20 bg-emerald-300/5 p-4">
							<p class="text-[10px] uppercase tracking-[0.16em] text-white/35">{$t("finalArchive.integrity")}</p>
							<p class="mt-2 text-3xl font-semibold text-emerald-50">{boundedPercent(caseIntegrityPercent)}%</p>
						</div>
						<div class="rounded border border-white/10 bg-white/[0.03] p-4">
							<p class="text-[10px] uppercase tracking-[0.16em] text-white/35">{$t("finalArchive.casesTitle")}</p>
							<div class="mt-3 grid gap-2 sm:grid-cols-3">
								{#each completedCases as caseId}
									<div class="rounded border border-emerald-300/20 bg-black/25 px-3 py-2 text-sm font-semibold leading-6 text-emerald-50">
										{$t(`finalArchive.cases.${caseId}`)}
									</div>
								{/each}
							</div>
						</div>
					</div>

					<div class="rounded border border-white/10 bg-black/25 p-4">
						<p class="text-[10px] uppercase tracking-[0.16em] text-white/35">{$t("finalArchive.conclusionTitle")}</p>
						<p class="mt-3 whitespace-pre-line text-sm leading-7 text-white/70">{$t("finalArchive.conclusion")}</p>
					</div>

					<div class="rounded border border-cyan-300/15 bg-cyan-300/[0.06] p-4">
						<p class="text-[10px] uppercase tracking-[0.16em] text-cyan-50/70">{$t("finalArchive.creditsTitle")}</p>
						<p class="mt-3 whitespace-pre-line text-sm leading-7 text-cyan-50/85">{$t("finalArchive.credits")}</p>
					</div>

					<div class="flex flex-wrap items-center justify-end gap-2">
						<button
							type="button"
							class="flex h-10 items-center gap-2 rounded border border-emerald-300/35 bg-emerald-300/10 px-3 text-xs uppercase tracking-[0.14em] text-emerald-50 hover:border-emerald-200/60"
							onclick={() => onNewInvestigation()}
						>
							<RotateCcw size={13} />
							{$t("finalArchive.actions.newInvestigation")}
						</button>
						<button
							type="button"
							class="flex h-10 items-center gap-2 rounded border border-cyan-300/30 bg-cyan-300/10 px-3 text-xs uppercase tracking-[0.14em] text-cyan-50 hover:border-cyan-200/60"
							onclick={() => onBackToMenu()}
						>
							<TerminalSquare size={13} />
							{$t("finalArchive.actions.backToMenu")}
						</button>
					</div>
				</div>
			</div>
		</section>
	</div>
{/if}
