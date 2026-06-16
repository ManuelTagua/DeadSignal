<script>
	import { CheckCircle, GitBranch, Link2, LockKeyhole, X } from "@lucide/svelte";
	import { CONNECTION_JUSTIFICATION_OPTIONS, DEDUCTION_DEFINITIONS } from "$lib/game/deductions";
	import { t } from "$lib/i18n";
	import { formatTimestamp } from "$lib/utils/format";

	let { evidences = [], connections = [], onCreateConnection = () => {} } = $props();

	let selectedEvidenceIds = $state(/** @type {string[]} */ ([]));
	let pendingConnection = $state(/** @type {{ firstEvidenceId: string, secondEvidenceId: string } | null} */ (null));
	let connectionCooldown = $state(false);

	const evidenceById = $derived(new Map(evidences.map((evidence) => [baseEvidenceId(evidence), evidence])));
	const deductionById = $derived(new Map(DEDUCTION_DEFINITIONS.map((deduction) => [deduction.id, deduction])));
	const positionsById = $derived(
		new Map(evidences.map((evidence, index) => [baseEvidenceId(evidence), positionForIndex(index)]))
	);
	const visibleConnections = $derived(
		connections.filter(
			(connection) =>
				connection.verified && evidenceById.has(connection.evidenceIds[0]) && evidenceById.has(connection.evidenceIds[1])
		)
	);
	const canCreateConnection = $derived(selectedEvidenceIds.length === 2 && !connectionCooldown);

	/** @param {Record<string, any>} evidence */
	function toggleEvidence(evidence) {
		const evidenceId = baseEvidenceId(evidence);

		if (selectedEvidenceIds.includes(evidenceId)) {
			selectedEvidenceIds = selectedEvidenceIds.filter((id) => id !== evidenceId);
			return;
		}

		selectedEvidenceIds =
			selectedEvidenceIds.length >= 2 ? [selectedEvidenceIds[1], evidenceId] : [...selectedEvidenceIds, evidenceId];
	}

	function createConnection() {
		if (!canCreateConnection) return;
		pendingConnection = {
			firstEvidenceId: selectedEvidenceIds[0],
			secondEvidenceId: selectedEvidenceIds[1]
		};
	}

	/** @param {string} justificationId */
	function justifyConnection(justificationId) {
		if (!pendingConnection) return;

		const result = onCreateConnection(
			pendingConnection.firstEvidenceId,
			pendingConnection.secondEvidenceId,
			justificationId
		);
		pendingConnection = null;
		selectedEvidenceIds = [];

		if (!result?.accepted) {
			connectionCooldown = true;
			setTimeout(() => {
				connectionCooldown = false;
			}, 2000);
		}
	}

	function clearSelection() {
		selectedEvidenceIds = [];
	}

	function closeJustification() {
		pendingConnection = null;
	}

	/** @param {Record<string, any>} evidence */
	function baseEvidenceId(evidence) {
		return evidence.evidenceId ?? evidence.id.replace(/^EvidenceBoard:/, "");
	}

	/** @param {Record<string, any>} evidence */
	function isSelected(evidence) {
		return selectedEvidenceIds.includes(baseEvidenceId(evidence));
	}

	/** @param {Record<string, any>} connection */
	function connectionIsCorrect(connection) {
		return Boolean(connection.verified);
	}

	/** @param {Record<string, any>} connection */
	function connectionDeduction(connection) {
		return connection.deductionId ? deductionById.get(connection.deductionId) : null;
	}

	/** @param {Record<string, any>} connection */
	function lineForConnection(connection) {
		const first = positionsById.get(connection.evidenceIds[0]);
		const second = positionsById.get(connection.evidenceIds[1]);
		if (!first || !second) return null;
		return { first, second };
	}

	/** @param {number} index */
	function positionForIndex(index) {
		const positions = [
			{ x: 18, y: 22 },
			{ x: 55, y: 16 },
			{ x: 82, y: 36 },
			{ x: 64, y: 72 },
			{ x: 24, y: 76 },
			{ x: 38, y: 48 },
			{ x: 74, y: 55 },
			{ x: 46, y: 84 }
		];

		if (positions[index]) return positions[index];

		return {
			x: 18 + ((index * 23) % 64),
			y: 18 + ((index * 31) % 64)
		};
	}
</script>

<section class="grid gap-4 xl:grid-cols-[minmax(0,1fr)_280px]">
	<div class="rounded border border-cyan-300/15 bg-black/25">
		<div class="flex flex-wrap items-center justify-between gap-3 border-b border-cyan-300/10 p-3">
			<div class="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-white/40">
				<GitBranch size={13} />
				<span>{$t("connections.title")}</span>
			</div>
			<div class="flex items-center gap-2">
				{#if selectedEvidenceIds.length}
					<button
						type="button"
						class="flex h-8 items-center justify-center rounded border border-white/10 bg-white/[0.03] px-2 text-white/55 hover:border-cyan-300/25 hover:text-white"
						aria-label={$t("connections.clearSelection")}
						onclick={clearSelection}
					>
						<X size={14} />
					</button>
				{/if}
				<button
					type="button"
					class={canCreateConnection
						? "flex h-8 items-center gap-2 rounded border border-emerald-300/35 bg-emerald-300/10 px-3 text-[10px] uppercase tracking-[0.14em] text-emerald-50 hover:border-emerald-200/60"
						: "flex h-8 items-center gap-2 rounded border border-white/10 bg-white/[0.03] px-3 text-[10px] uppercase tracking-[0.14em] text-white/35"}
					disabled={!canCreateConnection}
					onclick={createConnection}
				>
					<Link2 size={13} />
					{connectionCooldown ? $t("connections.cooldown") : $t("connections.create")}
				</button>
			</div>
		</div>

		<div class="relative min-h-[520px] overflow-hidden p-4 investigation-detail">
			<svg class="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
				{#each visibleConnections as connection (connection.id)}
					{@const line = lineForConnection(connection)}
					{#if line}
						<line
							x1={line.first.x}
							y1={line.first.y}
							x2={line.second.x}
							y2={line.second.y}
							class={connectionIsCorrect(connection) ? "stroke-emerald-200/60" : "stroke-cyan-200/35"}
							stroke-width={connectionIsCorrect(connection) ? "0.55" : "0.35"}
							stroke-dasharray={connectionIsCorrect(connection) ? "0" : "2 2"}
						/>
					{/if}
				{/each}
			</svg>

			{#if evidences.length}
				{#each evidences as evidence, index (evidence.id)}
					{@const position = positionForIndex(index)}
					<button
						type="button"
						class={isSelected(evidence)
							? "absolute grid w-[190px] -translate-x-1/2 -translate-y-1/2 gap-2 rounded border border-emerald-300/45 bg-emerald-300/10 p-3 text-left shadow-[0_0_24px_rgba(52,211,153,0.12)]"
							: "absolute grid w-[190px] -translate-x-1/2 -translate-y-1/2 gap-2 rounded border border-cyan-300/20 bg-[#050708]/95 p-3 text-left hover:border-cyan-200/50 hover:bg-cyan-300/5"}
						style={`left: ${position.x}%; top: ${position.y}%`}
						aria-pressed={isSelected(evidence)}
						onclick={() => toggleEvidence(evidence)}
					>
						<span class="text-[9px] uppercase tracking-[0.16em] text-white/35">{$t("labels.evidenceStatus")}</span>
						<span class="text-xs font-semibold leading-4 text-white">{$t(evidence.titleKey)}</span>
						<span class="truncate text-[10px] uppercase tracking-[0.12em] text-cyan-100/70">{$t(evidence.sourceKey)}</span>
					</button>
				{/each}
			{:else}
				<div class="grid min-h-[420px] place-items-center text-center">
					<div>
						<div class="mx-auto flex h-12 w-12 items-center justify-center rounded border border-cyan-300/25 bg-cyan-300/10 text-cyan-50">
							<LockKeyhole size={20} />
						</div>
						<h3 class="mt-4 text-sm font-semibold uppercase tracking-[0.16em] text-white">{$t("evidence.empty")}</h3>
						<p class="mt-3 max-w-md text-xs leading-5 text-white/50">{$t("evidence.lockedHint")}</p>
					</div>
				</div>
			{/if}
		</div>
	</div>

	<aside class="grid content-start gap-3">
		<div class="rounded border border-white/10 bg-black/25 p-3">
			<p class="text-[10px] uppercase tracking-[0.16em] text-white/35">{$t("connections.selection")}</p>
			<div class="mt-3 grid gap-2">
				{#each selectedEvidenceIds as evidenceId}
					{@const evidence = evidenceById.get(evidenceId)}
					<div class="rounded border border-emerald-300/20 bg-emerald-300/5 px-2 py-1.5 text-xs text-emerald-50">
						{evidence ? $t(evidence.titleKey) : evidenceId}
					</div>
				{:else}
					<p class="text-xs leading-5 text-white/45">{$t("connections.noSelection")}</p>
				{/each}
			</div>
		</div>

		<div class="rounded border border-white/10 bg-black/25 p-3">
			<p class="text-[10px] uppercase tracking-[0.16em] text-white/35">{$t("connections.saved")}</p>
			<div class="mt-3 grid gap-2">
				{#each visibleConnections as connection (connection.id)}
					{@const firstEvidence = evidenceById.get(connection.evidenceIds[0])}
					{@const secondEvidence = evidenceById.get(connection.evidenceIds[1])}
					{@const deduction = connectionDeduction(connection)}
					<div class="rounded border border-white/10 bg-white/[0.03] p-2">
						<div class="flex items-center justify-between gap-2">
							<span class="text-[10px] uppercase tracking-[0.12em] text-white/35">{formatTimestamp(connection.createdAt)}</span>
							<span class="flex items-center gap-1 text-[10px] uppercase tracking-[0.12em] text-emerald-100">
								<CheckCircle size={11} />
								{$t("connections.verified")}
							</span>
						</div>
						<p class="mt-2 text-xs leading-5 text-white/65">
							{firstEvidence ? $t(firstEvidence.titleKey) : connection.evidenceIds[0]}
							<span class="text-white/35"> + </span>
							{secondEvidence ? $t(secondEvidence.titleKey) : connection.evidenceIds[1]}
						</p>
						<p class="mt-2 text-xs leading-5 text-white/55">
							<span class="text-white/35">{$t("connections.reasonLabel")}:</span>
							{connection.reasonKey ? $t(connection.reasonKey) : $t("connections.reasonUnknown")}
						</p>
						{#if deduction}
							<p class="mt-2 rounded border border-emerald-300/20 bg-emerald-300/5 px-2 py-1.5 text-xs leading-5 text-emerald-50/80">
								<span class="text-emerald-100/55">{$t("connections.deductionLabel")}:</span>
								{$t(deduction.titleKey)}
							</p>
						{/if}
					</div>
				{:else}
					<p class="text-xs leading-5 text-white/45">{$t("connections.empty")}</p>
				{/each}
			</div>
		</div>
	</aside>
</section>

{#if pendingConnection}
	<div class="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm">
		<section class="dead-panel w-full max-w-lg overflow-hidden rounded">
			<div class="flex items-start justify-between gap-3 border-b border-cyan-300/10 p-4">
				<div class="min-w-0">
					<p class="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-cyan-50">
						<Link2 size={13} />
						{$t("connections.justificationTitle")}
					</p>
					<h2 class="mt-2 text-lg font-semibold leading-6 text-white">{$t("connections.justificationQuestion")}</h2>
				</div>
				<button
					type="button"
					class="flex h-8 w-8 shrink-0 items-center justify-center rounded border border-white/10 bg-black/30 text-white/45 hover:border-cyan-300/25 hover:text-white"
					aria-label={$t("connections.cancelJustification")}
					onclick={closeJustification}
				>
					<X size={14} />
				</button>
			</div>

			<div class="grid gap-3 p-4">
				<div class="grid gap-2 rounded border border-white/10 bg-white/[0.03] p-3 text-xs leading-5 text-white/65">
					<p>{evidenceById.get(pendingConnection.firstEvidenceId) ? $t(evidenceById.get(pendingConnection.firstEvidenceId).titleKey) : pendingConnection.firstEvidenceId}</p>
					<p class="text-white/35">+</p>
					<p>{evidenceById.get(pendingConnection.secondEvidenceId) ? $t(evidenceById.get(pendingConnection.secondEvidenceId).titleKey) : pendingConnection.secondEvidenceId}</p>
				</div>

				<div class="grid gap-2">
					{#each CONNECTION_JUSTIFICATION_OPTIONS as option, index}
						<button
							type="button"
							class="rounded border border-white/10 bg-black/30 p-3 text-left text-sm leading-6 text-white/70 hover:border-cyan-300/30 hover:bg-cyan-300/5 hover:text-white"
							onclick={() => justifyConnection(option.id)}
						>
							<span class="mr-2 text-[10px] uppercase tracking-[0.16em] text-cyan-100/65">
								{String.fromCharCode(65 + index)})
							</span>
							{$t(option.labelKey)}
						</button>
					{/each}
				</div>
			</div>
		</section>
	</div>
{/if}
