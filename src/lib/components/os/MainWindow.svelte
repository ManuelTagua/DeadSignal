<script>
	import ChatViewer from "$lib/components/modules/ChatViewer.svelte";
	import DocumentViewer from "$lib/components/modules/DocumentViewer.svelte";
	import EmailViewer from "$lib/components/modules/EmailViewer.svelte";
	import EvidenceBoard from "$lib/components/modules/EvidenceBoard.svelte";
	import MediaViewer from "$lib/components/modules/MediaViewer.svelte";
	import RecoveryLab from "$lib/components/modules/RecoveryLab.svelte";
	import SystemViewer from "$lib/components/modules/SystemViewer.svelte";
	import Terminal from "$lib/components/modules/Terminal.svelte";
	import { dataText, t } from "$lib/i18n";

	let {
		selectedModule = "Documents",
		activeItem = null,
		items = [],
		caseFile = null,
		recentEvidenceId = null,
		connections = [],
		notes = [],
		unlockedDeductions = {},
		caseStats = {},
		chapterSummaryUnlocked = false,
		recoveryState = {},
		terminalEvidences = [],
		onSelectEvidence = () => {},
		onCreateConnection = () => {},
		onRecoveryScan = () => {},
		onRecoveryRepair = () => {},
		onRecoveryDeepRecovery = () => {},
		onRecoverySetAssemblyOrder = () => {},
		onRecoveryAssemble = () => {},
		onTerminalUnlock = () => false,
		onTerminalScan = () => false,
		onTerminalRecover = () => ({}),
		onTerminalRepair = () => ({}),
		recoveryFragments = [],
		onTerminalCommand = () => {}
	} = $props();

	const windowSubtitleKey = $derived(`mainWindow.subtitles.${selectedModule}`);
</script>

<section class="dead-panel flex min-h-[520px] flex-col overflow-hidden lg:min-h-0">
	<div class="flex min-h-12 items-center justify-between gap-3 border-b border-cyan-300/10 px-3 py-2">
		<div class="min-w-0">
			<p class="text-[10px] uppercase leading-4 tracking-[0.2em] text-white/35">{caseFile?.title ? $dataText(caseFile.title) : ""}</p>
			<h2 class="truncate text-sm font-semibold uppercase tracking-[0.16em] text-white">{$t(`folders.${selectedModule}`)}</h2>
		</div>
		<p class="hidden text-[11px] uppercase tracking-[0.14em] text-white/40 sm:block">{$t(windowSubtitleKey)}</p>
	</div>

	<div class="min-h-0 flex-1">
		{#if selectedModule === "Emails"}
			<EmailViewer email={activeItem} />
		{:else if selectedModule === "Chats"}
			<ChatViewer thread={activeItem} />
		{:else if selectedModule === "Media"}
			<MediaViewer media={activeItem} />
		{:else if selectedModule === "System"}
			<SystemViewer log={activeItem} logs={items} />
		{:else if selectedModule === "RecoveryLab"}
			<RecoveryLab
				{recoveryState}
				onScan={onRecoveryScan}
				onRepair={onRecoveryRepair}
				onDeepRecovery={onRecoveryDeepRecovery}
				onSetAssemblyOrder={onRecoverySetAssemblyOrder}
				onAssemble={onRecoveryAssemble}
			/>
		{:else if selectedModule === "EvidenceBoard"}
			<EvidenceBoard
				evidences={items}
				activeEvidenceId={activeItem?.id}
				{recentEvidenceId}
				{connections}
				{notes}
				{unlockedDeductions}
				{caseStats}
				{chapterSummaryUnlocked}
				{onSelectEvidence}
				{onCreateConnection}
			/>
		{:else if selectedModule === "Terminal"}
			<Terminal
				evidences={terminalEvidences}
				{recoveryFragments}
				onUnlock={onTerminalUnlock}
				onScan={onTerminalScan}
				onRecover={onTerminalRecover}
				onRepair={onTerminalRepair}
				onCommand={onTerminalCommand}
			/>
		{:else}
			<DocumentViewer document={activeItem} />
		{/if}
	</div>
</section>
