<script>
	import { ShieldAlert, Target } from "@lucide/svelte";
	import { dataText, t } from "$lib/i18n";
	import ObjectiveList from "$lib/components/os/ObjectiveList.svelte";

	let {
		caseFile = null,
		objectives = [],
		recentObjectiveId = null,
		caseIntegrity = { value: 100, status: "stable" }
	} = $props();

	const integrityValue = $derived(Math.max(0, Math.min(100, Math.round(caseIntegrity?.value ?? 100))));
	const integrityStatus = $derived(caseIntegrity?.status ?? "stable");

	/** @param {string} state */
	function integrityBarClass(state) {
		if (state === "failed" || state === "critical") return "bg-cyan-100/80";
		if (state === "compromised") return "bg-cyan-300/75";
		return "bg-emerald-300/70";
	}
</script>

<aside class="dead-panel flex min-h-[320px] flex-col overflow-hidden lg:min-h-0">
	<div class="border-b border-cyan-300/10 px-3 py-3">
		<div class="flex items-center gap-2">
			<Target size={16} class="text-emerald-100" />
			<div>
				<p class="text-[10px] uppercase tracking-[0.2em] text-white/40">{$t("objectives.title")}</p>
				<h2 class="text-sm font-semibold leading-5 text-white">{caseFile?.title ? $dataText(caseFile.title) : $t("case.noCaseMounted")}</h2>
			</div>
		</div>
	</div>

	<div class="border-b border-cyan-300/10 p-3">
		<p class="text-xs leading-5 text-white/60">{caseFile?.description ? $dataText(caseFile.description) : ""}</p>
		<p class="mt-3 rounded border border-white/10 bg-white/[0.03] px-3 py-2 text-xs leading-5 text-white/58">
			{$t("objectives.guidance")}
		</p>
		<div class="mt-3 grid grid-cols-2 gap-2">
			<div class="rounded border border-cyan-300/15 bg-cyan-300/5 p-2">
				<p class="text-[10px] uppercase tracking-[0.15em] text-white/35">{$t("labels.status")}</p>
				<p class="mt-1 text-xs font-semibold text-cyan-50">{$t(`status.${caseFile?.status}`)}</p>
			</div>
			<div class="rounded border border-emerald-300/15 bg-emerald-300/5 p-2">
				<p class="text-[10px] uppercase tracking-[0.15em] text-white/35">{$t("labels.threat")}</p>
				<p class="mt-1 text-xs font-semibold text-emerald-50">{$t(`status.${caseFile?.threatLevel}`)}</p>
			</div>
		</div>
		<div class="mt-3 rounded border border-white/10 bg-white/[0.03] p-3">
			<div class="flex items-center justify-between gap-3">
				<p class="flex items-center gap-2 text-[10px] uppercase tracking-[0.15em] text-white/35">
					<ShieldAlert size={13} />
					{$t("caseIntegrity.title")}
				</p>
				<p class="text-xs font-semibold text-cyan-50">{integrityValue}%</p>
			</div>
			<div class="mt-2 h-1.5 overflow-hidden rounded bg-black/40">
				<div class={`h-full ${integrityBarClass(integrityStatus)}`} style={`width: ${integrityValue}%`}></div>
			</div>
			<p class="mt-2 text-[10px] uppercase tracking-[0.14em] text-white/45">
				{$t(`caseIntegrity.states.${integrityStatus}`)}
			</p>
		</div>
	</div>

	<ObjectiveList {objectives} {recentObjectiveId} />
</aside>
