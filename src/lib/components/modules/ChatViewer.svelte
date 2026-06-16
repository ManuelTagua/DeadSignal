<script>
	import { LockKeyhole, MessageSquareText } from "@lucide/svelte";
	import { dataText, t } from "$lib/i18n";
	import { formatTime } from "$lib/utils/format";

	let { thread = null } = $props();

	const messages = $derived(thread?.messages ?? []);
	const threadTitle = $derived(thread?.titleKey ? $t(thread.titleKey) : $dataText(`#${thread?.channel ?? ""}`));

	/** @param {Record<string, any>} message */
	function isEncrypted(message) {
		return Boolean(message.isEncrypted);
	}
</script>

{#if thread}
	<article class="flex h-full min-h-0 flex-col">
		<div class="border-b border-cyan-300/10 p-4">
			<div class="flex flex-wrap items-start justify-between gap-3">
				<div>
					<div class="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-white/40">
						<MessageSquareText size={13} />
						<span>{$t("labels.chatChannel")}</span>
					</div>
					<h3 class="mt-2 text-xl font-semibold text-white">{threadTitle}</h3>
				</div>
				{#if messages.some(isEncrypted)}
					<span class="flex items-center gap-1 rounded border border-cyan-300/30 bg-cyan-300/10 px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-cyan-50">
						<LockKeyhole size={12} />
						{$t("badges.encryptedFragment")}
					</span>
				{/if}
			</div>
		</div>

		<div class="min-h-0 flex-1 overflow-y-auto p-4">
			<div class="mx-auto flex max-w-3xl flex-col gap-3">
				{#each messages as message}
					<div class={message.sender === "Unknown" ? "flex justify-end" : "flex justify-start"}>
						<div
							class={message.sender === "Unknown"
								? "max-w-[82%] rounded border border-cyan-300/30 bg-cyan-300/10 p-3"
								: "max-w-[82%] rounded border border-white/10 bg-black/30 p-3"}
						>
							<div class="mb-2 flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.14em] text-white/40">
								<span class="font-semibold text-white/70">{$dataText(message.sender)}</span>
								<span>@{message.handle}</span>
								<span>{formatTime(message.sentAt)}</span>
								{#if message.isEncrypted}
									<LockKeyhole size={12} class="text-cyan-100" />
								{/if}
							</div>
							<p class="text-sm leading-6 text-white/75">{message.messageKey ? $t(message.messageKey) : $dataText(message.message)}</p>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</article>
{:else}
	<p class="p-4 text-sm text-white/45">{$t("empty.chat")}</p>
{/if}
