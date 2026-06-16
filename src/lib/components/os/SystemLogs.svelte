<script>
	import { Activity, TerminalSquare } from "@lucide/svelte";
	import { t } from "$lib/i18n";
	import { formatTime, severityClass } from "$lib/utils/format";

	let { logs = [], dynamicLogs = [] } = $props();

	let activityIndex = $state(0);
	const activityMessages = ["relay", "indexer", "watchdog", "evidence"];
	const activeActivity = $derived(activityMessages[activityIndex % activityMessages.length]);
	const renderedLogs = $derived([...dynamicLogs, ...logs].slice(0, 6));

	$effect(() => {
		const timer = setInterval(() => {
			activityIndex += 1;
		}, 4800);

		return () => clearInterval(timer);
	});
</script>

<section class="dead-panel flex min-h-[180px] flex-col overflow-hidden border-x-0 border-b-0 lg:min-h-0">
	<div class="flex items-center justify-between border-b border-cyan-300/10 px-3 py-2">
		<div class="flex items-center gap-2">
			<TerminalSquare size={15} class="text-emerald-100" />
			<h2 class="text-xs font-semibold uppercase tracking-[0.18em] text-white">{$t("logs.title")}</h2>
		</div>
		<span class="text-[10px] uppercase tracking-[0.16em] text-white/35">{$t("logs.tail")}</span>
	</div>

	<div class="grid gap-2 border-b border-cyan-300/10 px-3 py-2 text-[10px] uppercase tracking-[0.14em] text-white/45 sm:grid-cols-[auto_1fr] sm:items-center">
		<div class="flex items-center gap-2 text-emerald-50">
			<Activity size={13} />
			<span>{$t("logs.activity.title")}</span>
		</div>
		<div class="grid gap-1 sm:grid-cols-3">
			<div class="rounded border border-emerald-300/20 bg-emerald-300/5 px-2 py-1">
				{$t("logs.activity.relay")}
			</div>
			<div class="rounded border border-cyan-300/20 bg-cyan-300/5 px-2 py-1">
				{$t("logs.activity.indexer")}
			</div>
			<div class="rounded border border-white/10 bg-white/[0.03] px-2 py-1 text-white/55">
				{$t(`logs.activity.messages.${activeActivity}`)}
			</div>
		</div>
	</div>

	<div class="min-h-0 flex-1 overflow-hidden px-2 py-2">
		<div class="grid gap-1.5 lg:grid-cols-2 xl:grid-cols-3">
			{#each renderedLogs as log}
				<div class="grid grid-cols-[72px_86px_1fr] items-start gap-2 rounded border border-white/10 bg-black/25 px-2 py-1.5 text-[11px]">
					<span class="text-white/35">{formatTime(log.occurredAt)}</span>
					<span class={`rounded border px-1.5 py-0.5 text-center text-[10px] uppercase tracking-[0.12em] ${severityClass(log.level)}`}>
						{$t(`logs.levels.${log.level}`)}
					</span>
					<span class="min-w-0 leading-4 text-white/65">{log.messageKey ? $t(log.messageKey, log.params ?? {}) : $t(`logs.messages.${log.code}`)}</span>
				</div>
			{/each}
		</div>
	</div>
</section>
