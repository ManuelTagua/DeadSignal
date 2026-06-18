<script>
	import { CircleQuestionMark, RotateCcw, ShieldAlert } from "@lucide/svelte";
	import { t } from "$lib/i18n";

	let { open = false, onRestart = () => {}, onHelp = () => {} } = $props();
</script>

{#if open}
	<div class="fixed inset-0 z-[70] grid place-items-center bg-black/80 p-4 backdrop-blur-sm">
		<div
			class="dead-panel w-full max-w-3xl overflow-hidden rounded border-cyan-100/35"
			role="dialog"
			aria-modal="true"
			aria-labelledby="case-failure-title"
		>
			<div class="border-b border-cyan-100/20 p-5">
				<p class="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-cyan-50">
					<ShieldAlert size={14} />
					{$t("caseIntegrity.modal.kicker")}
				</p>
				<h2 id="case-failure-title" class="mt-3 text-3xl font-semibold leading-10 text-white">
					{$t("caseIntegrity.modal.title")}
				</h2>
			</div>

			<div class="grid gap-5 p-5">
				<p class="max-w-2xl text-base leading-7 text-white/72">{$t("caseIntegrity.modal.body")}</p>
				<div class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
					<button
						type="button"
						class="flex h-10 items-center justify-center gap-2 rounded border border-white/10 bg-black/30 px-3 text-xs uppercase tracking-[0.14em] text-white/60 hover:border-cyan-300/25 hover:text-white"
						onclick={() => onHelp()}
					>
						<CircleQuestionMark size={14} />
						{$t("caseIntegrity.modal.actions.help")}
					</button>
					<button
						type="button"
						class="flex h-10 items-center justify-center gap-2 rounded border border-cyan-100/45 bg-cyan-100/10 px-3 text-xs uppercase tracking-[0.14em] text-cyan-50 hover:border-cyan-100/70"
						onclick={() => onRestart()}
					>
						<RotateCcw size={14} />
						{$t("caseIntegrity.modal.actions.restart")}
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}
