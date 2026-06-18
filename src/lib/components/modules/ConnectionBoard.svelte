<script>
	import { onMount } from "svelte";
	import { CheckCircle, GitBranch, Link2, LockKeyhole, X } from "@lucide/svelte";
	import { CONNECTION_JUSTIFICATION_OPTIONS, DEDUCTION_DEFINITIONS } from "$lib/game/deductions";
	import { t } from "$lib/i18n";
	import { formatTimestamp } from "$lib/utils/format";

	let { evidences = [], connections = [], deductionDefinitions = DEDUCTION_DEFINITIONS, onCreateConnection = () => {} } = $props();

	let selectedEvidenceIds = $state(/** @type {string[]} */ ([]));
	let pendingConnection = $state(/** @type {{ firstEvidenceId: string, secondEvidenceId: string } | null} */ (null));
	let connectionCooldown = $state(false);
	let connectionLines = $state(/** @type {Array<{ id: string, x1: number, y1: number, x2: number, y2: number, correct: boolean }>} */ ([]));
	let lineCanvas = $state({ width: 1, height: 1 });
	/** @type {HTMLElement | null} */
	let boardContent = null;
	/** @type {ResizeObserver | null} */
	let lineObserver = null;
	/** @type {number} */
	let lineFrame = 0;

	const evidenceById = $derived(new Map(evidences.map((evidence) => [baseEvidenceId(evidence), evidence])));
	const deductionById = $derived(new Map(deductionDefinitions.map((deduction) => [deduction.id, deduction])));
	const visibleConnections = $derived(
		connections.filter(
			(connection) =>
				connection.verified && evidenceById.has(connection.evidenceIds[0]) && evidenceById.has(connection.evidenceIds[1])
		)
	);
	const canCreateConnection = $derived(selectedEvidenceIds.length === 2 && !connectionCooldown);
	const lineRefreshKey = $derived(
		`${evidences.map(baseEvidenceId).join("|")}::${visibleConnections
			.map((connection) => `${connection.id}:${connection.evidenceIds.join("+")}:${connection.verified}`)
			.join("|")}`
	);
	const evidenceNodes = new Map();

	onMount(() => {
		lineObserver = new ResizeObserver(scheduleLineUpdate);

		if (boardContent) {
			lineObserver.observe(boardContent);
		}

		for (const node of evidenceNodes.values()) {
			lineObserver.observe(node);
		}

		window.addEventListener("resize", scheduleLineUpdate);
		scheduleLineUpdate();

		return () => {
			window.removeEventListener("resize", scheduleLineUpdate);
			lineObserver?.disconnect();
			lineObserver = null;

			if (lineFrame) {
				cancelAnimationFrame(lineFrame);
				lineFrame = 0;
			}
		};
	});

	$effect(() => {
		lineRefreshKey;
		scheduleLineUpdate();
	});

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

	function scheduleLineUpdate() {
		if (typeof requestAnimationFrame !== "function" || lineFrame) return;

		lineFrame = requestAnimationFrame(() => {
			lineFrame = 0;
			updateConnectionLines();
		});
	}

	function updateConnectionLines() {
		if (!boardContent) {
			connectionLines = [];
			return;
		}

		const boardRect = boardContent.getBoundingClientRect();
		const nextCanvas = {
			width: Math.max(1, boardContent.scrollWidth, boardRect.width),
			height: Math.max(1, boardContent.scrollHeight, boardRect.height)
		};
		const nextLines = [];

		for (const connection of visibleConnections) {
			const firstNode = evidenceNodes.get(connection.evidenceIds[0]);
			const secondNode = evidenceNodes.get(connection.evidenceIds[1]);

			if (!firstNode || !secondNode) continue;

			const firstRect = firstNode.getBoundingClientRect();
			const secondRect = secondNode.getBoundingClientRect();

			nextLines.push({
				id: connection.id,
				x1: firstRect.left - boardRect.left + firstRect.width / 2,
				y1: firstRect.top - boardRect.top + firstRect.height / 2,
				x2: secondRect.left - boardRect.left + secondRect.width / 2,
				y2: secondRect.top - boardRect.top + secondRect.height / 2,
				correct: connectionIsCorrect(connection)
			});
		}

		lineCanvas = nextCanvas;
		connectionLines = nextLines;
	}

	/**
	 * @param {HTMLElement} node
	 * @param {string} evidenceId
	 */
	function registerEvidenceNode(node, evidenceId) {
		evidenceNodes.set(evidenceId, node);
		lineObserver?.observe(node);
		scheduleLineUpdate();

		return {
			/** @param {string} nextEvidenceId */
			update(nextEvidenceId) {
				if (nextEvidenceId === evidenceId) return;
				evidenceNodes.delete(evidenceId);
				evidenceId = nextEvidenceId;
				evidenceNodes.set(evidenceId, node);
				scheduleLineUpdate();
			},
			destroy() {
				lineObserver?.unobserve(node);
				evidenceNodes.delete(evidenceId);
				scheduleLineUpdate();
			}
		};
	}
</script>

<section class="connection-board-shell grid min-h-0 gap-4 2xl:grid-cols-[minmax(0,1fr)_320px]">
	<div class="rounded border border-cyan-300/15 bg-black/25">
		<div class="flex flex-wrap items-center justify-between gap-3 border-b border-cyan-300/10 p-3">
			<div class="min-w-0">
				<div class="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-white/40">
					<GitBranch size={13} />
					<span>{$t("connections.title")}</span>
				</div>
				<p class="mt-2 max-w-2xl text-xs leading-5 text-white/55">{$t("connections.body")}</p>
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

		<div class="connection-board-scroll investigation-detail">
			<div class="connection-board-content" bind:this={boardContent}>
				{#if connectionLines.length}
					<svg
						class="pointer-events-none absolute left-0 top-0 z-0"
						width={lineCanvas.width}
						height={lineCanvas.height}
						viewBox={`0 0 ${lineCanvas.width} ${lineCanvas.height}`}
						aria-hidden="true"
					>
						{#each connectionLines as line (line.id)}
						<line
							x1={line.x1}
							y1={line.y1}
							x2={line.x2}
							y2={line.y2}
							class={line.correct ? "stroke-emerald-200/60" : "stroke-cyan-200/35"}
							stroke-width={line.correct ? "2" : "1.5"}
							stroke-dasharray={line.correct ? "0" : "6 6"}
						/>
						{/each}
					</svg>
				{/if}

				{#if evidences.length}
					<div class="connection-node-grid">
						{#each evidences as evidence (evidence.id)}
							{@const evidenceId = baseEvidenceId(evidence)}
							<button
								type="button"
								use:registerEvidenceNode={evidenceId}
								class={isSelected(evidence)
									? "connection-node selected"
									: "connection-node"}
								aria-pressed={isSelected(evidence)}
								title={`${$t(evidence.titleKey)} / ${$t(evidence.sourceKey)}`}
								onclick={() => toggleEvidence(evidence)}
							>
								<span class="text-[9px] uppercase tracking-[0.16em] text-white/35">{$t("labels.evidenceStatus")}</span>
								<span class="text-xs font-semibold leading-5 text-white">{$t(evidence.titleKey)}</span>
								<span class="text-[10px] uppercase leading-4 tracking-[0.08em] text-cyan-100/70">{$t(evidence.sourceKey)}</span>
							</button>
						{/each}
					</div>
				{:else}
					<div class="relative z-10 grid min-h-[420px] place-items-center text-center">
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

<style>
	.connection-board-scroll {
		max-height: clamp(520px, 64dvh, 780px);
		min-height: 520px;
		overflow: auto;
		padding: 1.25rem;
	}

	.connection-board-content {
		position: relative;
		min-height: 480px;
		min-width: 0;
	}

	.connection-node-grid {
		position: relative;
		z-index: 1;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(100%, 250px), 1fr));
		gap: 1.35rem 1.5rem;
		align-items: stretch;
	}

	.connection-node {
		position: relative;
		z-index: 1;
		display: grid;
		min-width: 0;
		min-height: 128px;
		align-content: start;
		gap: 0.5rem;
		overflow-wrap: break-word;
		white-space: normal;
		border-radius: 0.25rem;
		border: 1px solid rgba(103, 232, 249, 0.2);
		background: rgba(5, 7, 8, 0.96);
		padding: 0.85rem;
		text-align: left;
		transition:
			background-color 160ms ease,
			border-color 160ms ease,
			box-shadow 160ms ease;
	}

	.connection-node:hover {
		border-color: rgba(165, 243, 252, 0.5);
		background: rgba(103, 232, 249, 0.05);
	}

	.connection-node.selected {
		border-color: rgba(110, 231, 183, 0.45);
		background: rgba(52, 211, 153, 0.1);
		box-shadow: 0 0 24px rgba(52, 211, 153, 0.12);
	}

	@media (max-width: 640px) {
		.connection-board-scroll {
			max-height: 66dvh;
			min-height: 420px;
			padding: 0.85rem;
		}

		.connection-board-content {
			min-height: 380px;
		}

		.connection-node-grid {
			gap: 1rem;
		}
	}
</style>
