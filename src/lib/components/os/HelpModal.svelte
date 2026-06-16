<script>
	import { CircleQuestionMark, RotateCcw, X } from "@lucide/svelte";
	import { t } from "$lib/i18n";

	let { open = false, onClose = () => {}, onReset = () => {} } = $props();

	let confirmingReset = $state(false);

	$effect(() => {
		if (!open) confirmingReset = false;
	});

	function close() {
		confirmingReset = false;
		onClose();
	}

	function confirmReset() {
		onReset();
		confirmingReset = false;
	}

	/** @param {KeyboardEvent} event */
	function handleKeydown(event) {
		if (open && event.key === "Escape") close();
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if open}
	<div class="fixed inset-0 z-50 grid place-items-center bg-black/75 p-3 backdrop-blur-sm sm:p-4" role="presentation">
		<div
			class="dead-panel w-full max-w-3xl overflow-hidden rounded"
			role="dialog"
			aria-modal="true"
			aria-labelledby="help-modal-title"
		>
			<div class="flex items-start justify-between gap-3 border-b border-cyan-300/10 p-4">
				<div class="min-w-0">
					<p class="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-cyan-50">
						<CircleQuestionMark size={13} />
						{$t("help.kicker")}
					</p>
					<h2 id="help-modal-title" class="mt-2 text-lg font-semibold leading-6 text-white">{$t("help.title")}</h2>
					<p class="mt-2 text-xs leading-5 text-white/55">{$t("help.subtitle")}</p>
				</div>
				<button
					type="button"
					class="flex h-8 w-8 shrink-0 items-center justify-center rounded border border-white/10 bg-black/30 text-white/45 hover:border-cyan-300/25 hover:text-white"
					aria-label={$t("help.actions.close")}
					onclick={close}
				>
					<X size={14} />
				</button>
			</div>

			<div class="max-h-[calc(100dvh-12rem)] overflow-y-auto p-4">
				<div class="grid gap-4">
					<div class="rounded border border-cyan-300/15 bg-cyan-300/[0.04] p-3">
						<p class="text-sm leading-6 text-white/72">{$t("help.intro.copyOne")}</p>
						<p class="mt-3 text-sm leading-6 text-white/72">{$t("help.intro.copyTwo")}</p>
						<p class="mt-3 text-sm leading-6 text-white/72">{$t("help.intro.copyThree")}</p>
					</div>

					<div>
						<h3 class="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-50">{$t("help.howToPlay.title")}</h3>
						<ol class="mt-3 grid gap-2 text-sm leading-6 text-white/70">
							{#each Array.from({ length: 8 }, (_, index) => index + 1) as step}
								<li class="grid grid-cols-[2rem_1fr] gap-2">
									<span class="flex h-7 w-7 items-center justify-center rounded border border-emerald-300/20 bg-emerald-300/10 text-[11px] text-emerald-50">
										{step}
									</span>
									<span>{$t(`help.howToPlay.steps.${step}`)}</span>
								</li>
							{/each}
						</ol>
					</div>

					<div class="grid gap-3 sm:grid-cols-2">
						<div class="rounded border border-white/10 bg-white/[0.03] p-3">
							<p class="text-[10px] uppercase tracking-[0.16em] text-white/40">{$t("help.currentObjective.title")}</p>
							<p class="mt-2 text-sm leading-6 text-white/70">{$t("help.currentObjective.body")}</p>
						</div>
						<div class="rounded border border-emerald-300/15 bg-emerald-300/[0.04] p-3">
							<p class="text-[10px] uppercase tracking-[0.16em] text-emerald-50/75">{$t("help.tip.title")}</p>
							<p class="mt-2 text-sm leading-6 text-white/70">{$t("help.tip.body")}</p>
						</div>
					</div>

					{#if confirmingReset}
						<div class="rounded border border-cyan-100/30 bg-cyan-100/[0.06] p-3">
							<p class="text-sm leading-6 text-cyan-50">{$t("help.reset.confirm")}</p>
							<div class="mt-3 flex flex-wrap justify-end gap-2">
								<button
									type="button"
									class="h-9 rounded border border-white/10 bg-black/30 px-3 text-xs uppercase tracking-[0.14em] text-white/55 hover:border-cyan-300/25 hover:text-white"
									onclick={() => (confirmingReset = false)}
								>
									{$t("help.actions.cancelReset")}
								</button>
								<button
									type="button"
									class="flex h-9 items-center gap-2 rounded border border-cyan-100/45 bg-cyan-100/10 px-3 text-xs uppercase tracking-[0.14em] text-cyan-50 hover:border-cyan-100/70"
									onclick={confirmReset}
								>
									<RotateCcw size={13} />
									{$t("help.actions.confirmReset")}
								</button>
							</div>
						</div>
					{/if}
				</div>
			</div>

			<div class="flex flex-col-reverse gap-2 border-t border-cyan-300/10 p-4 sm:flex-row sm:items-center sm:justify-between">
				<button
					type="button"
					class="flex h-9 items-center justify-center gap-2 rounded border border-white/10 bg-black/30 px-3 text-xs uppercase tracking-[0.14em] text-white/55 hover:border-cyan-300/25 hover:text-white"
					onclick={() => (confirmingReset = true)}
				>
					<RotateCcw size={13} />
					{$t("help.actions.reset")}
				</button>
				<button
					type="button"
					class="h-10 rounded border border-emerald-300/35 bg-emerald-300/10 px-4 text-xs uppercase tracking-[0.14em] text-emerald-50 hover:border-emerald-200/60"
					onclick={close}
				>
					{$t("help.actions.understood")}
				</button>
			</div>
		</div>
	</div>
{/if}
