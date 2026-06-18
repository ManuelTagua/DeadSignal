<script>
	import { Activity, CircleQuestionMark, Clock3, RadioTower, ShieldAlert } from "@lucide/svelte";
	import { SUPPORTED_LANGUAGES, currentLanguage, dataText, setLanguage, t } from "$lib/i18n";
	import { formatTime } from "$lib/utils/format";

	let {
		title = "DeadSignal",
		status = "DEGRADED",
		caseTitle = "",
		caseIntegrity = { value: 100, status: "stable" },
		onOpenHelp = () => {}
	} = $props();

	let simulatedClock = $state(new Date("2041-10-09T03:12:00.000Z"));
	const clockLabel = $derived(formatTime(simulatedClock));
	const integrityValue = $derived(Math.max(0, Math.min(100, Math.round(caseIntegrity?.value ?? 100))));
	const integrityStatus = $derived(caseIntegrity?.status ?? "stable");

	$effect(() => {
		const timer = setInterval(() => {
			simulatedClock = new Date(simulatedClock.getTime() + 1000);
		}, 1000);

		return () => clearInterval(timer);
	});

	/** @param {string} state */
	function integrityClass(state) {
		if (state === "failed") return "border-cyan-100/45 bg-cyan-100/10 text-cyan-50";
		if (state === "critical") return "border-cyan-100/35 bg-cyan-100/[0.07] text-cyan-50";
		if (state === "compromised") return "border-cyan-300/25 bg-cyan-300/10 text-cyan-50";
		return "border-emerald-300/20 bg-black/30 text-white/60";
	}
</script>

<header class="dead-panel grid min-h-12 grid-cols-1 gap-2 border-x-0 border-t-0 px-3 py-2 sm:grid-cols-[1fr_auto] sm:items-center lg:px-4">
	<div class="flex min-w-0 items-center gap-3">
		<div class="flex h-8 w-8 shrink-0 items-center justify-center rounded border border-emerald-300/30 bg-emerald-300/10 text-emerald-200">
			<RadioTower size={16} />
		</div>
		<div class="min-w-0">
			<div class="flex items-center gap-2">
				<h1 class="truncate text-sm font-semibold uppercase tracking-[0.22em] text-white">{title}</h1>
				<span class="hidden rounded border border-cyan-300/30 px-1.5 py-0.5 text-[10px] uppercase tracking-[0.18em] text-cyan-100 sm:inline">{$t("topBar.forensicShell")}</span>
			</div>
			<p class="text-[11px] uppercase leading-4 tracking-[0.16em] text-white/45">{$dataText(caseTitle)}</p>
		</div>
	</div>

	<div class="grid grid-cols-2 gap-2 text-[10px] uppercase tracking-[0.14em] text-white/60 sm:flex sm:items-center">
		<button
			type="button"
			class="flex h-8 items-center justify-center gap-2 rounded border border-cyan-300/25 bg-cyan-300/10 px-2 text-cyan-50 hover:border-cyan-200/60 hover:text-white"
			aria-label={$t("help.open")}
			onclick={() => onOpenHelp()}
		>
			<CircleQuestionMark size={13} />
			<span class="hidden sm:inline">{$t("help.shortLabel")}</span>
		</button>
		<div class="flex items-center rounded border border-white/10 bg-black/30 p-0.5" aria-label={$t("language.selector")}>
			{#each SUPPORTED_LANGUAGES as language}
				<button
					type="button"
					class={$currentLanguage === language.code
						? "h-7 rounded border border-emerald-300/35 bg-emerald-300/10 px-2 text-emerald-50"
						: "h-7 rounded border border-transparent px-2 text-white/50 hover:border-cyan-300/20 hover:text-white"}
					aria-pressed={$currentLanguage === language.code}
					onclick={() => setLanguage(language.code)}
				>
					{$t(language.labelKey)}
				</button>
			{/each}
		</div>
		<div class="flex items-center gap-2 rounded border border-emerald-300/20 bg-black/30 px-2 py-1">
			<Activity size={13} class="text-emerald-200" />
			<span>{$t(`status.${status}`)}</span>
		</div>
		<div class={`flex items-center gap-2 rounded border px-2 py-1 ${integrityClass(integrityStatus)}`}>
			<ShieldAlert size={13} class={integrityStatus === "stable" ? "text-emerald-200" : "text-cyan-50"} />
			<span>{integrityValue}% / {$t(`caseIntegrity.states.${integrityStatus}`)}</span>
		</div>
		<div class="flex items-center gap-2 rounded border border-cyan-300/20 bg-black/30 px-2 py-1">
			<ShieldAlert size={13} class="text-cyan-100" />
			<span>{$t("status.READ_ONLY")}</span>
		</div>
		<div class="flex items-center gap-2 rounded border border-white/10 bg-black/30 px-2 py-1">
			<Clock3 size={13} class="text-white/70" />
			<span>{clockLabel} {$t("topBar.utc")}</span>
		</div>
	</div>
</header>
