<script>
	import { Flag, Mail, Send } from "@lucide/svelte";
	import { dataText, t } from "$lib/i18n";
	import { formatTimestamp } from "$lib/utils/format";

	let { email = null } = $props();

	const emailSubject = $derived(email?.subjectKey ? $t(email.subjectKey) : $dataText(email?.subject));
	const emailBody = $derived(email?.bodyKey ? $t(email.bodyKey) : $dataText(email?.body));
	const emailFromName = $derived(email?.fromNameKey ? $t(email.fromNameKey) : $dataText(email?.fromName));
	const emailToName = $derived(email?.toNameKey ? $t(email.toNameKey) : $dataText(email?.toName));
</script>

{#if email}
	<article class="flex h-full min-h-0 flex-col">
		<div class="border-b border-cyan-300/10 p-4">
			<div class="flex flex-wrap items-start justify-between gap-3">
				<div class="min-w-0">
					<div class="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-white/40">
						<Mail size={13} />
						<span>{$t(`values.emailFolders.${email.folder}`)}</span>
					</div>
					<h3 class="mt-2 text-xl font-semibold leading-tight text-white">{emailSubject}</h3>
				</div>
				{#if email.isFlagged}
					<span class="flex items-center gap-1 rounded border border-cyan-300/30 bg-cyan-300/10 px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-cyan-50">
						<Flag size={12} />
						{$t("badges.flagged")}
					</span>
				{/if}
			</div>

			<div class="mt-4 grid gap-2 text-xs text-white/60 sm:grid-cols-2">
				<div class="rounded border border-white/10 bg-black/25 p-2">
					<p class="text-[10px] uppercase tracking-[0.15em] text-white/35">{$t("labels.from")}</p>
					<p class="mt-1 text-white">{emailFromName}</p>
					<p class="truncate text-white/45">{email.fromEmail}</p>
				</div>
				<div class="rounded border border-white/10 bg-black/25 p-2">
					<p class="text-[10px] uppercase tracking-[0.15em] text-white/35">{$t("labels.to")}</p>
					<p class="mt-1 text-white">{emailToName}</p>
					<p class="truncate text-white/45">{email.toEmail}</p>
				</div>
			</div>

			<p class="mt-3 flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-white/40">
				<Send size={12} />
				{formatTimestamp(email.sentAt)}
			</p>
		</div>

		<div class="min-h-0 flex-1 overflow-y-auto p-4">
			<pre class="whitespace-pre-wrap text-sm leading-7 text-white/75">{emailBody}</pre>
		</div>
	</article>
{:else}
	<p class="p-4 text-sm text-white/45">{$t("empty.email")}</p>
{/if}
