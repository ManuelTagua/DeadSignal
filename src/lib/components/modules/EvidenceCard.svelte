<script>
	import { BadgeCheck, Link2 } from "@lucide/svelte";
	import { t } from "$lib/i18n";

	let { evidence, active = false, isNew = false, onSelect = () => {} } = $props();
</script>

<button
	type="button"
	class={active
		? `grid h-full w-full gap-3 rounded border border-emerald-300/35 bg-emerald-300/10 p-3 text-left ${isNew ? "unlock-pulse" : ""}`
		: `grid h-full w-full gap-3 rounded border border-white/10 bg-black/25 p-3 text-left hover:border-cyan-300/30 hover:bg-cyan-300/5 ${isNew ? "unlock-pulse" : ""}`}
	aria-pressed={active}
	onclick={() => onSelect(evidence.id)}
>
	<div class="flex items-start justify-between gap-3">
		<div class="min-w-0">
			<p class="text-[10px] uppercase tracking-[0.18em] text-white/35">{$t("labels.evidenceStatus")}</p>
			<h3 class="mt-1 text-sm font-semibold text-white">{$t(evidence.titleKey)}</h3>
		</div>
		<span class="flex shrink-0 items-center gap-1 rounded border border-cyan-300/30 bg-cyan-300/10 px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-cyan-50">
			<BadgeCheck size={12} />
			{$t(evidence.statusKey)}
		</span>
	</div>

	<p class="text-xs leading-5 text-white/60">{$t(evidence.descriptionKey)}</p>

	<div class="grid gap-2">
		<div class="flex items-center gap-2 text-[11px] text-white/45">
			<Link2 size={13} />
			<span class="leading-4">{$t("labels.evidenceSource")}: {$t(evidence.sourceKey)}</span>
		</div>
		<div class="flex flex-wrap gap-1.5">
			{#each evidence.tagKeys as tagKey}
				<span class="rounded border border-white/10 bg-white/[0.03] px-2 py-1 text-[10px] uppercase tracking-[0.12em] text-white/45">
					{$t(tagKey)}
				</span>
			{/each}
		</div>
	</div>
</button>
