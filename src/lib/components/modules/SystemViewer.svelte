<script>
	import { Activity, Database, Server } from "@lucide/svelte";
	import { t } from "$lib/i18n";
	import { formatTimestamp, severityClass } from "$lib/utils/format";

	let { log = null, logs = [] } = $props();

	/** @param {Record<string, any>} entry */
	function logMessage(entry) {
		return entry.messageKey ? $t(entry.messageKey, entry.params ?? {}) : $t(`logs.messages.${entry.code}`);
	}
</script>

<article class="grid h-full min-h-0 gap-px bg-cyan-300/10 lg:grid-cols-[minmax(0,1fr)_320px]">
	<section class="min-h-0 overflow-y-auto bg-[#050708]/95 p-4">
		{#if log}
			<div class="flex flex-wrap items-start justify-between gap-3">
				<div>
					<div class="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-white/40">
						<Server size={13} />
						<span>{$t(`logs.sources.${log.source}`)}</span>
					</div>
					<h3 class="mt-2 text-2xl font-semibold text-white">{log.code}</h3>
				</div>
				<span class={`rounded border px-2 py-1 text-[10px] uppercase tracking-[0.14em] ${severityClass(log.level)}`}>
					{$t(`logs.levels.${log.level}`)}
				</span>
			</div>

			<div class="mt-5 rounded border border-white/10 bg-black/30 p-4">
				<p class="text-[10px] uppercase tracking-[0.16em] text-white/35">{$t("labels.eventMessage")}</p>
				<p class="mt-2 text-base leading-7 text-white/75">{logMessage(log)}</p>
			</div>

			<div class="mt-4 grid gap-2 sm:grid-cols-2">
				<div class="rounded border border-white/10 bg-black/25 p-3">
					<p class="text-[10px] uppercase tracking-[0.15em] text-white/35">{$t("labels.occurred")}</p>
					<p class="mt-1 text-sm text-white/70">{formatTimestamp(log.occurredAt)}</p>
				</div>
				<div class="rounded border border-white/10 bg-black/25 p-3">
					<p class="text-[10px] uppercase tracking-[0.15em] text-white/35">{$t("labels.sourceSubsystem")}</p>
					<p class="mt-1 text-sm text-white/70">{$t(`logs.sources.${log.source}`)}</p>
				</div>
			</div>
		{:else}
			<p class="text-sm text-white/45">{$t("empty.log")}</p>
		{/if}
	</section>

	<aside class="min-h-0 overflow-y-auto bg-[#050708]/95 p-3">
		<div class="mb-3 flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-white/40">
			<Activity size={13} />
			<span>{$t("labels.eventTimeline")}</span>
		</div>
		<div class="space-y-2">
			{#each logs as entry}
				<div class="rounded border border-white/10 bg-black/25 p-2">
					<div class="flex items-center justify-between gap-2">
						<span class="text-xs font-medium text-white">{entry.code}</span>
						<span class={`rounded border px-1.5 py-0.5 text-[9px] uppercase tracking-[0.12em] ${severityClass(entry.level)}`}>
							{$t(`logs.levels.${entry.level}`)}
						</span>
					</div>
					<p class="mt-1 text-[11px] leading-4 text-white/50">{logMessage(entry)}</p>
				</div>
			{/each}
		</div>
		<div class="mt-3 flex items-center gap-2 rounded border border-emerald-300/20 bg-emerald-300/5 p-2 text-[11px] text-emerald-50">
			<Database size={13} />
			<span>{$t("logs.entriesRecovered", { count: logs.length })}</span>
		</div>
	</aside>
</article>
