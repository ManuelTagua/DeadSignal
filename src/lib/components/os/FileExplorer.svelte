<script>
	import {
		ChevronRight,
		ClipboardList,
		FileText,
		Flag,
		Folder,
		Image,
		LockKeyhole,
		Mail,
		MessageSquareText,
		Search,
		Server,
		Terminal,
		Wrench
	} from "@lucide/svelte";
	import { dataText, t } from "$lib/i18n";
	import { compactPath, formatTimestamp } from "$lib/utils/format";

	let {
		folders = [],
		selectedModule = "Documents",
		activeItemId = null,
		recentItemId = null,
		recentEvidenceId = null,
		items = [],
		onSelectModule = () => {},
		onSelectItem = () => {}
	} = $props();

	/** @param {Record<string, any>} item */
	function itemTitle(item) {
		if (item.titleKey) return $t(item.titleKey);
		if (selectedModule === "EvidenceBoard") return $t(item.titleKey);
		if (selectedModule === "RecoveryLab") return item.titleKey ? $t(item.titleKey) : $dataText(item.title);
		if (selectedModule === "Emails") return item.subjectKey ? $t(item.subjectKey) : $dataText(item.subject);
		if (selectedModule === "Chats") return $dataText(`#${item.channel}`);
		if (selectedModule === "System") return $t(`logs.titles.${item.code}`);
		return $dataText(item.title);
	}

	/** @param {Record<string, any>} item */
	function itemMeta(item) {
		if (selectedModule === "EvidenceBoard") return `${$t(item.sourceKey)} / ${$t(item.statusKey)}`;
		if (selectedModule === "RecoveryLab") {
			if (item.kind === "fragment") return `${$t("recovery.labels.fragment")} / ${item.integrity}%`;
			if (item.kind === "document") return `${$t("recovery.labels.reconstructed")} / ${item.integrity}%`;
			return `${$t("recovery.labels.corrupted")} / ${item.integrity}%`;
		}
		if (selectedModule === "Emails") {
			const fromName = item.fromNameKey ? $t(item.fromNameKey) : $dataText(item.fromName);
			const toName = item.toNameKey ? $t(item.toNameKey) : $dataText(item.toName);
			return `${fromName} -> ${toName}`;
		}
		if (selectedModule === "Chats" && (item.contentCategory ?? item.category) === "Encrypted Chat") {
			return $t("values.chatTypes.Encrypted Chat");
		}
		if (selectedModule === "Chats") return $t("counts.messages", { count: item.messages.length });
		if (selectedModule === "System") return `${$t(`logs.sources.${item.source}`)} / ${$t(`logs.levels.${item.level}`)}`;
		if (selectedModule === "Documents") {
			return `${$t(`values.documentCategories.${item.contentCategory ?? item.category}`)} / ${$t(`values.classifications.${item.classification}`)}`;
		}
		if (selectedModule === "Terminal") return $t("terminal.title");
		return `${$t(`values.mediaTypes.${item.type}`)} / ${$dataText(item.source)}`;
	}

	/** @param {Record<string, any>} item */
	function itemTime(item) {
		return item.sentAt ?? item.createdAt ?? item.capturedAt ?? item.occurredAt ?? item.updatedAt ?? item.recoveredAt;
	}

	/** @param {Record<string, any>} message */
	function isEncryptedMessage(message) {
		return Boolean(message.isEncrypted);
	}

	/** @param {Record<string, any>} item */
	function isSensitive(item) {
		return Boolean(item.locked || item.passwordProtected || item.isFlagged || item.isEncrypted || item.messages?.some(isEncryptedMessage));
	}

	/** @param {Record<string, any>} item */
	function isUnread(item) {
		return selectedModule !== "EvidenceBoard" && !item.locked && !item.read;
	}

	/** @param {Record<string, any>} item */
	function isLocked(item) {
		return Boolean(item.locked);
	}

	/** @param {Record<string, any>} item */
	function itemClass(item) {
		if (activeItemId === item.id) {
			return `mb-2 grid w-full grid-cols-[auto_1fr] gap-2 rounded border border-emerald-300/30 bg-emerald-300/10 p-2 text-left ${recentItemId === item.id ? "clue-highlight" : ""}`;
		}

		if (isLocked(item)) {
			return `mb-2 grid w-full grid-cols-[auto_1fr] gap-2 rounded border border-white/10 bg-black/20 p-2 text-left opacity-55 hover:border-cyan-300/20 ${recentItemId === item.id ? "clue-highlight" : ""}`;
		}

		if (isUnread(item)) {
			return `mb-2 grid w-full grid-cols-[auto_1fr] gap-2 rounded border border-cyan-300/45 bg-cyan-300/10 p-2 text-left hover:border-cyan-200/60 ${recentItemId === item.id ? "clue-highlight" : ""}`;
		}

		return `mb-2 grid w-full grid-cols-[auto_1fr] gap-2 rounded border border-white/10 bg-black/20 p-2 text-left hover:border-cyan-300/25 hover:bg-cyan-300/5 ${recentItemId === item.id ? "clue-highlight" : ""}`;
	}

	/** @param {Record<string, any>} folder */
	function folderClass(folder) {
		const base =
			selectedModule === folder.id
				? "flex h-10 w-full items-center gap-2 rounded border border-cyan-300/30 bg-cyan-300/10 px-2 text-left text-cyan-50"
				: "flex h-10 w-full items-center gap-2 rounded border border-transparent px-2 text-left text-white/65 hover:border-white/10 hover:bg-white/[0.03] hover:text-white";

		return `${base} ${folder.id === "EvidenceBoard" && recentEvidenceId ? "unlock-pulse" : ""}`;
	}
</script>

<aside class="dead-panel flex min-h-[360px] flex-col overflow-hidden lg:min-h-0">
	<div class="border-b border-cyan-300/10 px-3 py-3">
		<div class="flex items-center justify-between gap-3">
			<div>
				<p class="text-[10px] uppercase tracking-[0.2em] text-white/40">{$t("explorer.title")}</p>
				<h2 class="text-sm font-semibold text-white">{$t("explorer.volume")}</h2>
			</div>
			<div class="flex h-8 w-8 items-center justify-center rounded border border-white/10 bg-white/[0.03] text-white/60">
				<Search size={14} />
			</div>
		</div>
	</div>

	<nav class="border-b border-cyan-300/10 p-2">
		{#each folders as folder}
			<button
				type="button"
				class={folderClass(folder)}
				aria-pressed={selectedModule === folder.id}
				onclick={() => onSelectModule(folder.id)}
			>
				{#if folder.id === "Documents"}
					<FileText size={15} />
				{:else if folder.id === "Emails"}
					<Mail size={15} />
				{:else if folder.id === "Chats"}
					<MessageSquareText size={15} />
				{:else if folder.id === "Media"}
					<Image size={15} />
				{:else if folder.id === "System"}
					<Server size={15} />
				{:else if folder.id === "Terminal"}
					<Terminal size={15} />
				{:else if folder.id === "RecoveryLab"}
					<Wrench size={15} />
				{:else}
					<ClipboardList size={15} />
				{/if}
				<span class="min-w-0 flex-1 truncate text-xs uppercase tracking-[0.14em]">{$t(`folders.${folder.id}`)}</span>
				<span class="rounded border border-white/10 px-1.5 py-0.5 text-[10px] text-white/50">{folder.count}</span>
			</button>
		{/each}
	</nav>

	<div class="flex min-h-0 flex-1 flex-col">
		<div class="flex items-center gap-2 border-b border-cyan-300/10 px-3 py-2 text-[10px] uppercase tracking-[0.16em] text-white/45">
			<Folder size={13} />
			<span class="truncate">{compactPath(folders.find((folder) => folder.id === selectedModule)?.path ?? "/")}</span>
		</div>

		<div class="min-h-0 flex-1 overflow-y-auto p-2">
			{#each items as item}
				<button
					type="button"
					class={itemClass(item)}
					aria-pressed={activeItemId === item.id}
					onclick={() => onSelectItem(item.id)}
				>
					<div class="mt-0.5 flex items-center gap-1">
						{#if isUnread(item)}
							<span class="h-2 w-2 rounded-full bg-cyan-200 shadow-[0_0_10px_rgba(103,232,249,0.75)]"></span>
						{:else if isLocked(item)}
							<LockKeyhole size={12} class="text-white/35" />
						{/if}
						<ChevronRight size={14} class={activeItemId === item.id ? "text-emerald-100" : "text-white/35"} />
					</div>
					<span class="min-w-0">
						<span class="flex min-w-0 items-center gap-2">
							<span class="text-xs font-medium leading-4 text-white">{itemTitle(item)}</span>
							{#if isUnread(item)}
								<span class="shrink-0 rounded border border-cyan-300/40 bg-cyan-300/10 px-1.5 py-0.5 text-[9px] uppercase tracking-[0.14em] text-cyan-50">
									{$t("progress.new")}
								</span>
							{:else if isLocked(item)}
								<span class="shrink-0 rounded border border-white/10 bg-white/[0.03] px-1.5 py-0.5 text-[9px] uppercase tracking-[0.14em] text-white/45">
									{item.passwordProtected ? $t("progress.protected") : $t("progress.locked")}
								</span>
							{/if}
							{#if isSensitive(item)}
								<span class="shrink-0 text-cyan-100">
									{#if selectedModule === "Chats"}
										<LockKeyhole size={12} />
									{:else}
										<Flag size={12} />
									{/if}
								</span>
							{/if}
						</span>
						<span class="mt-1 block text-[11px] leading-4 text-white/45">{itemMeta(item)}</span>
						<span class="mt-1 block text-[10px] uppercase tracking-[0.12em] text-white/35">{formatTimestamp(itemTime(item))}</span>
					</span>
				</button>
			{:else}
				<p class="rounded border border-white/10 p-3 text-xs text-white/45">{$t("explorer.empty")}</p>
			{/each}
		</div>
	</div>
</aside>
