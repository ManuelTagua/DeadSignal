<script>
	import {
		ArrowDown,
		ArrowUp,
		CheckCircle,
		FileWarning,
		LockKeyhole,
		RotateCcw,
		ScanLine,
		Wrench,
		Zap
	} from "@lucide/svelte";
	import {
		MAINTENANCE_ASSEMBLY_ORDER,
		RECOVERY_CORRUPTED_DOCUMENTS,
		RECOVERY_FRAGMENTS,
		RECOVERY_RECONSTRUCTED_DOCUMENTS,
		hasAllMaintenanceFragments,
		isMaintenanceReportReconstructed
	} from "$lib/game/recovery";
	import { t } from "$lib/i18n";
	import { formatTimestamp } from "$lib/utils/format";

	let {
		recoveryState = {},
		onScan = () => {},
		onRepair = () => {},
		onDeepRecovery = () => {},
		onSetAssemblyOrder = () => {},
		onAssemble = () => {}
	} = $props();

	const discoveredFragments = $derived(RECOVERY_FRAGMENTS.filter((fragment) => recoveryState.fragments?.[fragment.id]));
	const hasAllFragments = $derived(hasAllMaintenanceFragments(recoveryState));
	const reportReconstructed = $derived(isMaintenanceReportReconstructed(recoveryState));
	const reconstructedDocument = $derived(RECOVERY_RECONSTRUCTED_DOCUMENTS[0]);
	const averageIntegrity = $derived(
		discoveredFragments.length
			? Math.round(discoveredFragments.reduce((total, fragment) => total + fragment.integrity, 0) / discoveredFragments.length)
			: RECOVERY_CORRUPTED_DOCUMENTS[0].integrity
	);
	const assemblyOrder = $derived(recoveryState.assemblyOrder ?? MAINTENANCE_ASSEMBLY_ORDER);
	const visibleActionLog = $derived((recoveryState.actionLog ?? []).slice(0, 5));

	/**
	 * @param {string} fragmentId
	 * @param {-1 | 1} direction
	 */
	function moveFragment(fragmentId, direction) {
		const currentIndex = assemblyOrder.indexOf(fragmentId);
		const nextIndex = currentIndex + direction;
		if (currentIndex < 0 || nextIndex < 0 || nextIndex >= assemblyOrder.length) return;

		const nextOrder = [...assemblyOrder];
		const [item] = nextOrder.splice(currentIndex, 1);
		nextOrder.splice(nextIndex, 0, item);
		onSetAssemblyOrder(nextOrder);
	}

	/** @param {string} fragmentId */
	function isRecovered(fragmentId) {
		return Boolean(recoveryState.fragments?.[fragmentId]);
	}
</script>

<article class="flex h-full min-h-0 flex-col">
	<div class="border-b border-cyan-300/10 p-4">
		<div class="flex flex-wrap items-start justify-between gap-4">
			<div class="min-w-0">
				<div class="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-white/40">
					<Wrench size={13} class="soft-glitch" />
					<span>{$t("recovery.title")}</span>
				</div>
				<p class="mt-2 max-w-3xl text-sm leading-6 text-white/60">{$t("recovery.subtitle")}</p>
			</div>
			<div class="grid min-w-[220px] gap-2 text-[10px] uppercase tracking-[0.14em] text-white/45 sm:grid-cols-3 sm:min-w-[520px]">
				<div class="rounded border border-emerald-300/15 bg-emerald-300/5 p-2">
					<p>{$t("recovery.labels.integrity")}</p>
					<div class="mt-2 h-1.5 overflow-hidden rounded bg-black/40">
						<div class="h-full bg-emerald-300/70" style={`width: ${averageIntegrity}%`}></div>
					</div>
					<p class="mt-1 text-sm font-semibold text-emerald-50">{averageIntegrity}%</p>
				</div>
				<div class="rounded border border-cyan-300/15 bg-cyan-300/5 p-2">
					<p>{$t("recovery.labels.fragments")}</p>
					<p class="mt-1 text-sm font-semibold text-cyan-50">{discoveredFragments.length}/{RECOVERY_FRAGMENTS.length}</p>
				</div>
				<div class="rounded border border-white/10 bg-white/[0.03] p-2">
					<p>{$t("recovery.labels.corruptionLevel")}</p>
					<p class="mt-1 text-sm font-semibold text-cyan-50">
						{$t(reportReconstructed ? "recovery.corruptionLevels.reconstructed" : "recovery.corruptionLevels.severe")}
					</p>
				</div>
			</div>
		</div>
	</div>

	<div class="min-h-0 flex-1 overflow-y-auto p-4">
		<div class="grid gap-4">
			<section class="grid gap-3 rounded border border-cyan-300/15 bg-black/25 p-3">
				<div class="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-white/40">
					<ScanLine size={13} />
					<span>{$t("recovery.methods.title")}</span>
				</div>
				<div class="grid gap-2 sm:grid-cols-3">
					<button
						type="button"
						class="flex h-11 items-center justify-center gap-2 rounded border border-cyan-300/25 bg-cyan-300/10 px-3 text-xs uppercase tracking-[0.14em] text-cyan-50 hover:border-cyan-200/60 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:border-cyan-300/25"
						disabled={isRecovered("file_12")}
						onclick={() => onScan("relay")}
					>
						<ScanLine size={14} />
						{isRecovered("file_12") ? $t("recovery.methods.alreadyRecovered") : $t("recovery.methods.scan")}
					</button>
					<button
						type="button"
						class="flex h-11 items-center justify-center gap-2 rounded border border-emerald-300/25 bg-emerald-300/10 px-3 text-xs uppercase tracking-[0.14em] text-emerald-50 hover:border-emerald-200/60 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:border-emerald-300/25"
						disabled={isRecovered("file_18")}
						onclick={() => onRepair("file_12")}
					>
						<Wrench size={14} />
						{isRecovered("file_18") ? $t("recovery.methods.alreadyRecovered") : $t("recovery.methods.repair")}
					</button>
					<button
						type="button"
						class="flex h-11 items-center justify-center gap-2 rounded border border-white/10 bg-white/[0.03] px-3 text-xs uppercase tracking-[0.14em] text-white/70 hover:border-cyan-300/25 hover:text-white disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:border-white/10 disabled:hover:text-white/70"
						disabled={isRecovered("file_21")}
						onclick={() => onDeepRecovery("relay")}
					>
						<Zap size={14} />
						{isRecovered("file_21") ? $t("recovery.methods.alreadyRecovered") : $t("recovery.methods.deepRecovery")}
					</button>
				</div>
			</section>

			<section class="grid gap-3 xl:grid-cols-[minmax(0,1fr)_320px]">
				<div class="rounded border border-white/10 bg-black/25 p-3">
					<div class="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-white/40">
						<FileWarning size={13} />
						<span>{$t("recovery.corruptedFile")}</span>
					</div>
					<h3 class="mt-2 text-lg font-semibold text-white">{$t(RECOVERY_CORRUPTED_DOCUMENTS[0].titleKey)}</h3>
					<pre class="corrupted-document mt-3 whitespace-pre-wrap rounded border border-emerald-300/20 p-3 text-sm leading-6 text-white/70">{$t(RECOVERY_CORRUPTED_DOCUMENTS[0].damagedContentKey)}</pre>
					<div class="mt-3 grid gap-2 text-xs sm:grid-cols-3">
						<div class="rounded border border-white/10 bg-white/[0.03] p-2">
							<p class="text-[10px] uppercase tracking-[0.14em] text-white/35">{$t("recovery.labels.recoveredAt")}</p>
							<p class="mt-1 text-white/65">{formatTimestamp(RECOVERY_CORRUPTED_DOCUMENTS[0].recoveredAt)}</p>
						</div>
						<div class="rounded border border-white/10 bg-white/[0.03] p-2">
							<p class="text-[10px] uppercase tracking-[0.14em] text-white/35">{$t("recovery.labels.recoveryOrigin")}</p>
							<p class="mt-1 text-white/65">{$t(RECOVERY_CORRUPTED_DOCUMENTS[0].recoveryOriginKey)}</p>
						</div>
						<div class="rounded border border-white/10 bg-white/[0.03] p-2">
							<p class="text-[10px] uppercase tracking-[0.14em] text-white/35">{$t("recovery.labels.integrity")}</p>
							<p class="mt-1 text-white/65">{RECOVERY_CORRUPTED_DOCUMENTS[0].integrity}%</p>
						</div>
					</div>
				</div>

				<aside class="rounded border border-white/10 bg-black/25 p-3">
					<p class="text-[10px] uppercase tracking-[0.18em] text-white/40">{$t("recovery.results")}</p>
					<div class="mt-3 grid gap-2">
						{#each visibleActionLog as action (action.id)}
							<div class="rounded border border-white/10 bg-white/[0.03] p-2">
								<div class="flex items-center justify-between gap-2">
									<span class="text-[10px] uppercase tracking-[0.12em] text-white/35">{formatTimestamp(action.createdAt)}</span>
									<span class="text-[10px] uppercase tracking-[0.12em] text-cyan-100">{$t(`recovery.methodLabels.${action.method}`)}</span>
								</div>
								<p class="mt-1 text-xs leading-5 text-white/60">{$t(`recovery.resultStatuses.${action.status}`)}</p>
							</div>
						{:else}
							<p class="text-xs leading-5 text-white/45">{$t("recovery.noResults")}</p>
						{/each}
					</div>
				</aside>
			</section>

			<section class="grid gap-3">
				<div class="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-white/40">
					<RotateCcw size={13} />
					<span>{$t("recovery.fragments.title")}</span>
				</div>
				<div class="grid gap-3 lg:grid-cols-3">
					{#each RECOVERY_FRAGMENTS as fragment}
						<article
							class={isRecovered(fragment.id)
								? "rounded border border-emerald-300/30 bg-emerald-300/10 p-3"
								: "rounded border border-white/10 bg-black/25 p-3 opacity-60"}
						>
							<div class="flex items-start justify-between gap-3">
								<div>
									<p class="text-[10px] uppercase tracking-[0.16em] text-white/35">{$t("recovery.evidenceType.recoveredFragment")}</p>
									<h3 class="mt-1 text-sm font-semibold text-white">{$t(fragment.titleKey)}</h3>
								</div>
								{#if isRecovered(fragment.id)}
									<CheckCircle size={16} class="text-emerald-100" />
								{:else}
									<LockKeyhole size={16} class="text-white/35" />
								{/if}
							</div>
							{#if isRecovered(fragment.id)}
								<p class="mt-3 text-xs leading-5 text-white/65">{$t(fragment.contentKey)}</p>
								<div class="mt-3 grid gap-2 text-[10px] uppercase tracking-[0.12em] text-white/40">
									<span>{$t("recovery.labels.integrity")}: {fragment.integrity}%</span>
									<span>{$t("recovery.labels.recoveryOrigin")}: {$t(fragment.recoveryOriginKey)}</span>
								</div>
							{:else}
								<p class="mt-3 text-xs leading-5 text-white/45">{$t("recovery.fragments.locked")}</p>
							{/if}
						</article>
					{/each}
				</div>
			</section>

			{#if hasAllFragments && !reportReconstructed}
				<section class="rounded border border-cyan-300/20 bg-cyan-300/5 p-3">
					<div class="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-white/40">
						<RotateCcw size={13} />
						<span>{$t("recovery.assembly.title")}</span>
					</div>
					<p class="mt-2 text-sm leading-6 text-white/60">{$t("recovery.assembly.hint")}</p>
					<div class="mt-3 grid gap-2">
						{#each assemblyOrder as fragmentId, index}
							{@const fragment = RECOVERY_FRAGMENTS.find((entry) => entry.id === fragmentId)}
							<div class="grid gap-2 rounded border border-white/10 bg-black/25 p-2 sm:grid-cols-[1fr_auto] sm:items-center">
								<span class="text-sm text-white/75">{index + 1}. {fragment ? $t(fragment.titleKey) : fragmentId}</span>
								<div class="flex items-center gap-2">
									<button
										type="button"
										class="flex h-8 w-8 items-center justify-center rounded border border-white/10 bg-white/[0.03] text-white/60 hover:border-cyan-300/25 hover:text-white"
										aria-label={$t("recovery.assembly.moveUp")}
										onclick={() => moveFragment(fragmentId, -1)}
									>
										<ArrowUp size={14} />
									</button>
									<button
										type="button"
										class="flex h-8 w-8 items-center justify-center rounded border border-white/10 bg-white/[0.03] text-white/60 hover:border-cyan-300/25 hover:text-white"
										aria-label={$t("recovery.assembly.moveDown")}
										onclick={() => moveFragment(fragmentId, 1)}
									>
										<ArrowDown size={14} />
									</button>
								</div>
							</div>
						{/each}
					</div>
					<button
						type="button"
						class="mt-3 flex h-10 items-center justify-center gap-2 rounded border border-emerald-300/30 bg-emerald-300/10 px-3 text-xs uppercase tracking-[0.14em] text-emerald-50 hover:border-emerald-200/60"
						onclick={() => onAssemble()}
					>
						<CheckCircle size={14} />
						{$t("recovery.assembly.submit")}
					</button>
				</section>
			{/if}

			{#if reportReconstructed}
				<section class="reconstruction-pulse rounded border border-emerald-300/30 bg-emerald-300/10 p-4">
					<div class="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-emerald-100/75">
						<CheckCircle size={13} />
						<span>{$t("recovery.assembly.reconstructed")}</span>
					</div>
					<h3 class="mt-2 text-lg font-semibold text-white">{$t(reconstructedDocument.titleKey)}</h3>
					<pre class="mt-3 whitespace-pre-wrap text-sm leading-7 text-white/75">{$t(reconstructedDocument.contentKey)}</pre>
				</section>
			{/if}
		</div>
	</div>
</article>
