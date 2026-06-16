<script>
	import { KeyRound, LockKeyhole, X } from "@lucide/svelte";
	import { dataText, t } from "$lib/i18n";

	let { item = null, error = false, onSubmit = () => {}, onCancel = () => {} } = $props();

	let password = $state("");
	const itemTitle = $derived(item?.titleKey ? $t(item.titleKey) : $dataText(item?.title));

	$effect(() => {
		if (item) password = "";
	});

	/** @param {SubmitEvent} event */
	function submitPassword(event) {
		event.preventDefault();
		onSubmit(password);
	}
</script>

{#if item}
	<div class="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm">
		<section class="dead-panel w-full max-w-md overflow-hidden rounded">
			<div class="flex items-start justify-between gap-3 border-b border-cyan-300/10 p-4">
				<div class="min-w-0">
					<p class="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-cyan-50">
						<LockKeyhole size={13} />
						{$t("access.title")}
					</p>
					<h2 class="mt-2 text-lg font-semibold leading-6 text-white">{itemTitle}</h2>
					<p class="mt-2 text-xs leading-5 text-white/55">{$t("access.subtitle")}</p>
				</div>
				<button
					type="button"
					class="flex h-8 w-8 shrink-0 items-center justify-center rounded border border-white/10 bg-black/30 text-white/45 hover:border-cyan-300/25 hover:text-white"
					aria-label={$t("access.cancel")}
					onclick={() => onCancel()}
				>
					<X size={14} />
				</button>
			</div>

			<form class="grid gap-3 p-4" onsubmit={submitPassword}>
				<label class="grid gap-2">
					<span class="text-[10px] uppercase tracking-[0.16em] text-white/40">{$t("access.prompt")}</span>
					<input
						class={error
							? "h-10 rounded border border-cyan-100/60 bg-black/45 px-3 text-sm text-white outline-none"
							: "h-10 rounded border border-cyan-300/20 bg-black/45 px-3 text-sm text-white outline-none focus:border-cyan-200/70"}
						type="password"
						bind:value={password}
						autocomplete="off"
					/>
				</label>

				{#if error}
					<p class="rounded border border-cyan-100/35 bg-cyan-100/10 px-3 py-2 text-xs text-cyan-50">{$t("access.error")}</p>
				{/if}

				<p class="rounded border border-white/10 bg-white/[0.03] px-3 py-2 text-xs leading-5 text-white/50">{$t("access.hint")}</p>

				<div class="flex items-center justify-end gap-2 pt-1">
					<button
						type="button"
						class="h-9 rounded border border-white/10 bg-black/30 px-3 text-xs uppercase tracking-[0.14em] text-white/55 hover:border-cyan-300/25 hover:text-white"
						onclick={() => onCancel()}
					>
						{$t("access.cancel")}
					</button>
					<button
						type="submit"
						class="flex h-9 items-center gap-2 rounded border border-emerald-300/35 bg-emerald-300/10 px-3 text-xs uppercase tracking-[0.14em] text-emerald-50 hover:border-emerald-200/60"
					>
						<KeyRound size={13} />
						{$t("access.submit")}
					</button>
				</div>
			</form>
		</section>
	</div>
{/if}
