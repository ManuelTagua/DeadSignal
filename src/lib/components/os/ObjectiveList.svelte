<script>
	import { CheckCircle, LockKeyhole } from "@lucide/svelte";
	import { t } from "$lib/i18n";

	let { objectives = [], recentObjectiveId = null } = $props();

	/** @param {string} state */
	function objectiveClass(state) {
		if (state === "completed") return "mb-2 grid grid-cols-[auto_1fr] gap-2 rounded border border-emerald-300/35 bg-emerald-300/10 p-2";
		if (state === "active") return "mb-2 grid grid-cols-[auto_1fr] gap-2 rounded border border-cyan-300/30 bg-cyan-300/10 p-2";
		if (state === "locked") return "mb-2 grid grid-cols-[auto_1fr] gap-2 rounded border border-white/10 bg-black/20 p-2 opacity-55";
		return "mb-2 grid grid-cols-[auto_1fr] gap-2 rounded border border-white/10 bg-black/20 p-2";
	}
</script>

<div class="min-h-0 flex-1 overflow-y-auto p-2">
	{#each objectives as objective}
		{@const Icon = objective.icon}
		<div class={`${objectiveClass(objective.state)} ${recentObjectiveId === objective.id ? "objective-complete" : ""}`}>
			<div class="flex h-8 w-8 items-center justify-center rounded border border-white/10 bg-black/30 text-white/70">
				{#if objective.state === "locked"}
					<LockKeyhole size={15} />
				{:else if objective.state === "completed"}
					<CheckCircle size={15} />
				{:else}
					<Icon size={15} />
				{/if}
			</div>
			<div class="min-w-0">
				<p class="text-xs font-medium leading-5 text-white">{$t(objective.labelKey)}</p>
				<p class="mt-1 text-[11px] leading-4 text-white/45">{$t(objective.metaKey, objective.metaParams)}</p>
				<p class="mt-2 text-[10px] uppercase tracking-[0.14em] text-emerald-100">{$t(`objectives.states.${objective.state}`)}</p>
			</div>
		</div>
	{/each}
</div>
