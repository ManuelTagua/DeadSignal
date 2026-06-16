<script>
	import { onMount } from "svelte";
	import { DatabaseZap, Fingerprint, GitBranch, KeyRound, Lightbulb, RadioReceiver, Route, Wrench } from "@lucide/svelte";
	import { FOLDERS } from "$lib/config/folders";
	import {
		REQUIRED_CHAPTER_CONNECTION_IDS,
		REQUIRED_CHAPTER_DEDUCTION_IDS,
		countCorrectConnections,
		countRequiredChapterConnections,
		unlockableDeductions
	} from "$lib/game/deductions";
	import { EVIDENCE_DEFINITIONS, unlockedEvidence } from "$lib/game/evidence";
	import { PASSWORD_FRAGMENT_CODE, PASSWORD_FRAGMENT_ID, VIRTUAL_CHATS, VIRTUAL_DOCUMENTS } from "$lib/game/files";
	import {
		MAINTENANCE_REPORT_ID,
		RECOVERY_CORRUPTED_DOCUMENTS,
		RECOVERY_FRAGMENTS,
		discoveredRecoveryFragments,
		isMaintenanceReportReconstructed,
		reconstructedRecoveryDocuments,
		recoveryFragmentFor
	} from "$lib/game/recovery";
	import AccessModal from "$lib/components/modules/AccessModal.svelte";
	import ChapterSummaryModal from "$lib/components/modules/ChapterSummaryModal.svelte";
	import FileExplorer from "$lib/components/os/FileExplorer.svelte";
	import HelpModal from "$lib/components/os/HelpModal.svelte";
	import MainWindow from "$lib/components/os/MainWindow.svelte";
	import NotificationCenter from "$lib/components/os/NotificationCenter.svelte";
	import ObjectivesPanel from "$lib/components/os/ObjectivesPanel.svelte";
	import SystemLogs from "$lib/components/os/SystemLogs.svelte";
	import TopBar from "$lib/components/os/TopBar.svelte";
	import { t } from "$lib/i18n";
	import {
		addConnection,
		investigation,
		markMilestone,
		resetInvestigation,
		unlockDeduction
	} from "$lib/stores/InvestigationStore";
	import { clearNotifications, pushNotification } from "$lib/stores/NotificationStore";
	import {
		countReadImportantByCategory,
		hasReadEvidenceTag,
		isFileUnlocked,
		markEvidenceTagsDiscovered,
		markItemRead,
		progress,
		resetProgress,
		unlockFile
	} from "$lib/stores/ProgressStore";
	import {
		assembleMaintenanceReport,
		deepRecoverTarget,
		recovery,
		repairRecoveryFile,
		resetRecovery,
		scanRecoveryTarget,
		setAssemblyOrder
	} from "$lib/stores/RecoveryStore";
	import { addSessionLog, clearSessionLogs, sessionLogs } from "$lib/stores/SessionLogStore";

	let { data } = $props();

	const IMPORTANT_LOG_REQUIREMENT = 3;
	const HELP_SEEN_KEY = "deadsignal.help.seen.v1";
	const caseFile = $derived(data.caseFile);
	let selectedModule = $state("Documents");
	/** @type {string | null} */
	let selectedItemId = $state(null);
	/** @type {string | null} */
	let recentItemId = $state(null);
	/** @type {string | null} */
	let recentEvidenceId = $state(null);
	/** @type {string | null} */
	let recentObjectiveId = $state(null);
	/** @type {Record<string, any> | null} */
	let accessItem = $state(null);
	let accessError = $state(false);
	let hiddenRelayRecovered = $state(false);
	let helpOpen = $state(false);
	let chapterSummaryOpen = $state(false);

	const evidenceItems = $derived(unlockedEvidence($progress));
	const importantLogsRead = $derived(countReadImportantByCategory($progress, "System"));
	const duplicateCredentialUnlocked = $derived(evidenceItems.some(hasDuplicateCredentialEvidence));
	const eastArchiveCompleted = $derived(hasReadEvidenceTag($progress, "east-archive-breach"));
	const eastArchiveAccessMapUnlocked = $derived(hasReadEvidenceTag($progress, "access-map"));
	const encryptedFragmentUnlocked = $derived(isFileUnlocked($progress, PASSWORD_FRAGMENT_ID));
	const encryptedFragmentHintUnlocked = $derived(hasReadEvidenceTag($progress, "server-room-knock-pattern"));
	const verifiedConnectionCount = $derived(countCorrectConnections($investigation.connections));
	const requiredVerifiedConnectionCount = $derived(countRequiredChapterConnections($investigation.connections));
	const requiredDeductionsCount = $derived(countRequiredDeductions($investigation.unlockedDeductions));
	const accessPhraseDeductionUnlocked = $derived(Boolean($investigation.unlockedDeductions?.["access-phrase"]));
	const internalInvolvementDeductionUnlocked = $derived(Boolean($investigation.unlockedDeductions?.["internal-involvement"]));
	const recoveredFragments = $derived(discoveredRecoveryFragments($recovery));
	const maintenanceReportRecovered = $derived(isMaintenanceReportReconstructed($recovery));
	const maintenanceRecordsAvailable = $derived(importantLogsRead >= 1 || selectedModule === "RecoveryLab" || recoveredFragments.length > 0);
	const chapter1Criteria = $derived([
		encryptedFragmentUnlocked,
		eastArchiveCompleted,
		requiredVerifiedConnectionCount >= REQUIRED_CHAPTER_CONNECTION_IDS.length,
		requiredDeductionsCount >= REQUIRED_CHAPTER_DEDUCTION_IDS.length
	]);
	const chapter1Complete = $derived(chapter1Criteria.every(Boolean));
	const chapterProgressPercent = $derived((chapter1Criteria.filter(Boolean).length / chapter1Criteria.length) * 100);
	const caseCompletionPercent = $derived(calculateCaseCompletion());
	const chapterSummaryUnlocked = $derived(chapter1Complete || Boolean($investigation.milestones?.["chapter-1-summary"]));
	const caseStats = $derived({
		evidenceDiscovered: evidenceItems.length,
		evidenceTotal: EVIDENCE_DEFINITIONS.length,
		caseCompletionPercent,
		chapterProgressPercent
	});
	const systemLogItems = $derived([...(hiddenRelayRecovered ? [hiddenRelayLog()] : []), ...(caseFile?.logs ?? [])]);
	const recoveryDocuments = $derived([
		...RECOVERY_CORRUPTED_DOCUMENTS,
		...reconstructedRecoveryDocuments($recovery)
	]);
	const recoveryLabItems = $derived([
		...RECOVERY_CORRUPTED_DOCUMENTS.map((item) => ({ ...item, kind: "corrupted" })),
		...RECOVERY_FRAGMENTS.filter((fragment) => $recovery.fragments?.[fragment.id]).map((fragment) => ({
			...fragment,
			kind: "fragment",
			title: fragment.id,
			category: "Recovered Fragment"
		})),
		...reconstructedRecoveryDocuments($recovery).map((item) => ({ ...item, kind: "document" }))
	].map(enrichRecoveryItem));

	onMount(() => {
		if (!localStorage.getItem(HELP_SEEN_KEY)) {
			helpOpen = true;
			localStorage.setItem(HELP_SEEN_KEY, "true");
		}
	});

	const collections = $derived({
		Documents: [
			...(caseFile?.documents ?? []),
			...VIRTUAL_DOCUMENTS.map(prepareVirtualDocument),
			...recoveryDocuments.map(prepareRecoveryDocument)
		].map(enrichDocument),
		Emails: (caseFile?.emails ?? []).map(enrichEmail),
		Chats: [...groupChats(caseFile?.chats ?? []), ...VIRTUAL_CHATS.map(prepareVirtualChat)].map(enrichChat),
		Media: (caseFile?.media ?? []).map(enrichMedia),
		System: systemLogItems.map(enrichLog),
		RecoveryLab: recoveryLabItems,
		EvidenceBoard: evidenceItems,
		Terminal: []
	});

	const folders = $derived(
		FOLDERS.map((folder) => ({
			...folder,
			count: collectionFor(folder.id).length
		}))
	);

	const moduleItems = $derived(collectionFor(selectedModule));
	const activeItem = $derived(selectedItemId ? (moduleItems.find(isSelectedItem) ?? null) : null);
	const activeItemId = $derived(activeItem?.id ?? null);

	const objectives = $derived([
		{
			id: "blackout-timeline",
			labelKey: "objectives.blackout.label",
			metaKey: "objectives.blackout.meta",
			metaParams: { count: importantLogsRead, required: IMPORTANT_LOG_REQUIREMENT },
			icon: Route,
			state: importantLogsRead >= IMPORTANT_LOG_REQUIREMENT ? "completed" : selectedModule === "System" ? "active" : "open"
		},
		{
			id: "duplicate-credential",
			labelKey: "objectives.credential.label",
			metaKey: "objectives.credential.meta",
			metaParams: { count: 0 },
			icon: Fingerprint,
			state: duplicateCredentialUnlocked ? "active" : "locked"
		},
		{
			id: "east-archive-breach",
			labelKey: "objectives.archive.label",
			metaKey: "objectives.archive.meta",
			metaParams: { count: evidenceItems.length },
			icon: KeyRound,
			state: eastArchiveCompleted ? "completed" : selectedModule === "Documents" ? "active" : "open"
		},
		{
			id: "encrypted-fragment",
			labelKey: "objectives.fragment.label",
			metaKey: "objectives.fragment.meta",
			metaParams: {
				status: encryptedFragmentUnlocked
					? $t("objectives.meta.fragmentCompleted")
					: encryptedFragmentHintUnlocked
						? $t("objectives.meta.fragmentOpen")
						: $t("objectives.meta.fragmentLocked")
			},
			icon: RadioReceiver,
			state: encryptedFragmentUnlocked ? "completed" : encryptedFragmentHintUnlocked ? "active" : "locked"
		},
		{
			id: "connect-related-evidence",
			labelKey: "objectives.connectEvidence.label",
			metaKey: "objectives.connectEvidence.meta",
			metaParams: { count: verifiedConnectionCount, required: REQUIRED_CHAPTER_CONNECTION_IDS.length },
			icon: GitBranch,
			state:
				verifiedConnectionCount >= REQUIRED_CHAPTER_CONNECTION_IDS.length
					? "completed"
					: evidenceItems.length >= 2 && selectedModule === "EvidenceBoard"
						? "active"
						: evidenceItems.length >= 2
							? "open"
							: "locked"
		},
		{
			id: "prove-access-phrase",
			labelKey: "objectives.accessPhrase.label",
			metaKey: "objectives.accessPhrase.meta",
			metaParams: {},
			icon: Lightbulb,
			state: accessPhraseDeductionUnlocked
				? "completed"
				: encryptedFragmentUnlocked && encryptedFragmentHintUnlocked && selectedModule === "EvidenceBoard"
					? "active"
					: encryptedFragmentUnlocked && encryptedFragmentHintUnlocked
						? "open"
						: "locked"
		},
		{
			id: "identify-internal-involvement",
			labelKey: "objectives.internalInvolvement.label",
			metaKey: "objectives.internalInvolvement.meta",
			metaParams: {},
			icon: Fingerprint,
			state: internalInvolvementDeductionUnlocked
				? "completed"
				: eastArchiveAccessMapUnlocked && eastArchiveCompleted && selectedModule === "EvidenceBoard"
					? "active"
					: eastArchiveAccessMapUnlocked && eastArchiveCompleted
						? "open"
						: "locked"
		},
		{
			id: "reconstruct-blackout-sequence",
			labelKey: "objectives.reconstructBlackout.label",
			metaKey: "objectives.reconstructBlackout.meta",
			metaParams: {
				connections: requiredVerifiedConnectionCount,
				requiredConnections: REQUIRED_CHAPTER_CONNECTION_IDS.length,
				deductions: requiredDeductionsCount,
				requiredDeductions: REQUIRED_CHAPTER_DEDUCTION_IDS.length,
				fragment: encryptedFragmentUnlocked
					? $t("objectives.meta.fragmentCompleted")
					: $t("objectives.meta.fragmentPending")
			},
			icon: Route,
			state: chapter1Complete
				? "completed"
				: encryptedFragmentUnlocked && eastArchiveCompleted && selectedModule === "EvidenceBoard"
					? "active"
					: encryptedFragmentUnlocked && eastArchiveCompleted
						? "open"
						: "locked"
		},
		{
			id: "recover-maintenance-records",
			labelKey: "objectives.recoverMaintenance.label",
			metaKey: "objectives.recoverMaintenance.meta",
			metaParams: { count: recoveredFragments.length, required: RECOVERY_FRAGMENTS.length },
			icon: Wrench,
			state: maintenanceReportRecovered
				? "completed"
				: selectedModule === "RecoveryLab" && recoveredFragments.length > 0
					? "active"
					: maintenanceRecordsAvailable
						? "open"
						: "locked"
		},
		...(encryptedFragmentUnlocked
			? [
					{
						id: "trace-blackout-source",
						labelKey: "objectives.traceBlackout.label",
						metaKey: "objectives.traceBlackout.meta",
						metaParams: {},
						icon: Route,
						state: hiddenRelayRecovered ? "active" : "open"
					}
				]
			: [])
	]);

	$effect(() => {
		if (!activeItem || selectedModule === "EvidenceBoard") return;
		if (activeItem.locked) return;
		if (activeItem.read) return;

		if (selectedModule === "RecoveryLab") {
			markActiveItemRead();
			return;
		}

		const newEvidenceDefinitions = activeItem.evidenceTags
			.map(evidenceDefinitionForTag)
			.filter(Boolean)
			.filter(isNewEvidenceDefinition);

		const completesBlackout =
			selectedModule === "System" &&
			activeItem.important &&
			importantLogsRead < IMPORTANT_LOG_REQUIREMENT &&
			importantLogsRead + 1 >= IMPORTANT_LOG_REQUIREMENT;
		const completesEastArchive = activeItem.evidenceTags.includes("east-archive-breach");
		const updatesDuplicateCredential = activeItem.evidenceTags.includes("duplicate-credential");
		const hasAccessAnomaly = selectedModule === "System" && activeItem.important;

		setTransient("item", activeItem.id);

		for (const evidence of newEvidenceDefinitions) {
			const evidenceId = `EvidenceBoard:${evidence.id}`;
			setTransient("evidence", evidenceId);
		}

		if (completesBlackout) {
			setTransient("objective", "blackout-timeline");
		}

		const recoveredFiles = notifyRecoveredFilesFor(activeItem, completesBlackout);

		if (completesEastArchive) {
			setTransient("objective", "east-archive-breach");
		}

		pushNotification({
			type: notificationTypeForAnalysis({
				hasAccessAnomaly,
				hasEvidence: newEvidenceDefinitions.length > 0,
				hasObjective: updatesDuplicateCredential || completesBlackout || completesEastArchive
			}),
			titleKey: "notifications.fileAnalyzed.title",
			messageKey: "notifications.fileAnalyzed.message",
			params: {
				details: analysisSummaryFor({
					hasAccessAnomaly,
					evidenceCount: newEvidenceDefinitions.length,
					hasObjectiveUpdate: updatesDuplicateCredential,
					hasObjectiveCompleted: completesBlackout || completesEastArchive,
					recoveredFileCount: recoveredFiles.length
				})
			}
		});

		markActiveItemRead();
	});

	$effect(() => {
		const deductions = unlockableDeductions($investigation.connections, $investigation.unlockedDeductions);

		for (const deduction of deductions) {
			if (!unlockDeduction(deduction.id)) continue;

			const objectiveId =
				deduction.id === "access-phrase"
					? "prove-access-phrase"
					: deduction.id === "maintenance-reroute"
						? "recover-maintenance-records"
						: "identify-internal-involvement";
			setTransient("objective", objectiveId);
			pushNotification({
				type: "objective",
				titleKey: "notifications.deductionUnlocked.title",
				messageKey: "notifications.deductionUnlocked.message",
				params: { deduction: $t(deduction.titleKey) }
			});
			addSessionLog({
				level: "INFO",
				source: "deduction-engine",
				code: "DED-210",
				messageKey: deduction.descriptionKey
			});
		}
	});

	$effect(() => {
		if (!chapter1Complete) return;
		if (!markMilestone("chapter-1-summary")) return;

		chapterSummaryOpen = true;
		setTransient("objective", "reconstruct-blackout-sequence");
		pushNotification({
			type: "objective",
			titleKey: "notifications.chapterSummaryUnlocked.title",
			messageKey: "notifications.chapterSummaryUnlocked.message"
		});
		addSessionLog({
			level: "WARN",
			source: "deduction-engine",
			code: "CH-101",
			messageKey: "logs.messages.CH-101"
		});
	});

	/** @param {string} moduleId */
	function selectModule(moduleId) {
		selectedModule = moduleId;
		selectedItemId = null;
		accessItem = null;
		accessError = false;
	}

	/** @param {string} itemId */
	function selectItem(itemId) {
		const item = moduleItems.find(/** @param {Record<string, any>} entry */ (entry) => entry.id === itemId);

		if (item?.locked) {
			if (item.passwordProtected) {
				accessItem = item;
				accessError = false;
				return;
			}

			pushNotification({
				type: "warning",
				titleKey: "notifications.fileLocked.title",
				messageKey: "notifications.fileLocked.message"
			});
			return;
		}

		selectedItemId = itemId;
	}

	/** @param {string} moduleId */
	function collectionFor(moduleId) {
		if (moduleId === "Emails") return collections.Emails;
		if (moduleId === "Chats") return collections.Chats;
		if (moduleId === "Media") return collections.Media;
		if (moduleId === "System") return collections.System;
		if (moduleId === "RecoveryLab") return collections.RecoveryLab;
		if (moduleId === "EvidenceBoard") return collections.EvidenceBoard;
		if (moduleId === "Terminal") return collections.Terminal;
		return collections.Documents;
	}

	function calculateCaseCompletion() {
		const checkpoints = [
			Math.min(importantLogsRead / IMPORTANT_LOG_REQUIREMENT, 1),
			EVIDENCE_DEFINITIONS.length ? evidenceItems.length / EVIDENCE_DEFINITIONS.length : 0,
			encryptedFragmentUnlocked ? 1 : 0,
			eastArchiveCompleted ? 1 : 0,
			Math.min(requiredVerifiedConnectionCount / REQUIRED_CHAPTER_CONNECTION_IDS.length, 1),
			Math.min(requiredDeductionsCount / REQUIRED_CHAPTER_DEDUCTION_IDS.length, 1),
			chapter1Complete ? 1 : 0,
			Math.min(recoveredFragments.length / RECOVERY_FRAGMENTS.length, 1),
			maintenanceReportRecovered ? 1 : 0
		];

		return (checkpoints.reduce((total, value) => total + value, 0) / checkpoints.length) * 100;
	}

	/** @param {Record<string, boolean>} unlockedDeductions */
	function countRequiredDeductions(unlockedDeductions) {
		return REQUIRED_CHAPTER_DEDUCTION_IDS.filter((deductionId) => unlockedDeductions?.[deductionId]).length;
	}

	/** @param {Record<string, any>} item */
	function isSelectedItem(item) {
		return item.id === selectedItemId;
	}

	/** @param {Record<string, any>} evidence */
	function hasDuplicateCredentialEvidence(evidence) {
		return evidence.evidenceId === "duplicate-credential";
	}

	/** @param {string} tag */
	function evidenceDefinitionForTag(tag) {
		return EVIDENCE_DEFINITIONS.find((evidence) => evidence.unlockTag === tag) ?? null;
	}

	/** @param {Record<string, any>} evidence */
	function isNewEvidenceDefinition(evidence) {
		return !hasReadEvidenceTag($progress, evidence.unlockTag);
	}

	/**
	 * @param {"item" | "evidence" | "objective"} kind
	 * @param {string} id
	 */
	function setTransient(kind, id) {
		if (kind === "item") recentItemId = id;
		if (kind === "evidence") recentEvidenceId = id;
		if (kind === "objective") recentObjectiveId = id;

		setTimeout(() => {
			if (kind === "item" && recentItemId === id) recentItemId = null;
			if (kind === "evidence" && recentEvidenceId === id) recentEvidenceId = null;
			if (kind === "objective" && recentObjectiveId === id) recentObjectiveId = null;
		}, 2400);
	}

	function markActiveItemRead() {
		if (!activeItem) return;

		markItemRead({
			id: activeItem.id,
			title: activeItem.title,
			category: activeItem.category,
			important: activeItem.important,
			evidenceTags: activeItem.evidenceTags
		});
	}

	/**
	 * @param {{
	 * 	hasAccessAnomaly: boolean,
	 * 	hasEvidence: boolean,
	 * 	hasObjective: boolean
	 * }} state
	 */
	function notificationTypeForAnalysis(state) {
		if (state.hasObjective) return "objective";
		if (state.hasEvidence) return "evidence";
		if (state.hasAccessAnomaly) return "warning";
		return "info";
	}

	/**
	 * @param {{
	 * 	hasAccessAnomaly: boolean,
	 * 	evidenceCount: number,
	 * 	hasObjectiveUpdate: boolean,
	 * 	hasObjectiveCompleted: boolean,
	 * 	recoveredFileCount: number
	 * }} state
	 */
	function analysisSummaryFor(state) {
		const parts = [];

		if (state.hasAccessAnomaly) parts.push($t("notifications.fileAnalyzed.parts.anomaly"));
		if (state.evidenceCount === 1) parts.push($t("notifications.fileAnalyzed.parts.evidence"));
		if (state.evidenceCount > 1) {
			parts.push($t("notifications.fileAnalyzed.parts.evidenceMany", { count: state.evidenceCount }));
		}
		if (state.hasObjectiveCompleted) parts.push($t("notifications.fileAnalyzed.parts.objectiveCompleted"));
		else if (state.hasObjectiveUpdate) parts.push($t("notifications.fileAnalyzed.parts.objectiveUpdated"));
		if (state.recoveredFileCount === 1) parts.push($t("notifications.fileAnalyzed.parts.file"));
		if (state.recoveredFileCount > 1) {
			parts.push($t("notifications.fileAnalyzed.parts.files", { count: state.recoveredFileCount }));
		}
		if (!parts.length) parts.push($t("notifications.fileAnalyzed.parts.indexed"));

		return localizedList(parts);
	}

	/** @param {string[]} parts */
	function localizedList(parts) {
		if (parts.length <= 1) return parts[0] ?? "";
		if (parts.length === 2) return `${parts[0]} ${$t("common.and")} ${parts[1]}`;

		return `${parts.slice(0, -1).join(", ")} ${$t("common.and")} ${parts.at(-1)}`;
	}

	/** @param {Record<string, any>} item */
	function prepareVirtualDocument(item) {
		return {
			...item,
			id: item.virtualId,
			locked: !isVirtualDocumentUnlocked(item)
		};
	}

	/** @param {Record<string, any>} item */
	function prepareRecoveryDocument(item) {
		return {
			...item,
			id: item.virtualId,
			locked: false
		};
	}

	/** @param {Record<string, any>} item */
	function prepareVirtualChat(item) {
		return {
			...item,
			id: item.virtualId,
			locked: item.passwordProtected ? !encryptedFragmentUnlocked : Boolean(item.locked)
		};
	}

	/** @param {Record<string, any>} item */
	function isVirtualDocumentUnlocked(item) {
		if (item.unlockTag) return hasReadEvidenceTag($progress, item.unlockTag);
		if (item.unlockAfterImportantLogs) return importantLogsRead >= item.unlockAfterImportantLogs;
		return true;
	}

	/** @param {Record<string, any>} item */
	function enrichDocument(item) {
		return enrichItem(item, "Documents");
	}

	/** @param {Record<string, any>} item */
	function enrichEmail(item) {
		return enrichItem(item, "Emails");
	}

	/** @param {Record<string, any>} item */
	function enrichChat(item) {
		return enrichItem(item, "Chats");
	}

	/** @param {Record<string, any>} item */
	function enrichMedia(item) {
		return enrichItem(item, "Media");
	}

	/** @param {Record<string, any>} item */
	function enrichLog(item) {
		return enrichItem(item, "System");
	}

	/** @param {Record<string, any>} item */
	function enrichRecoveryItem(item) {
		return enrichItem(item, "RecoveryLab");
	}

	/**
	 * @param {Record<string, any>} item
	 * @param {string} moduleId
	 */
	function enrichItem(item, moduleId) {
		const record = progressRecordFor(item, moduleId);
		const stored = $progress.items[record.id];

		return {
			...item,
			...record,
			sourceId: item.id,
			contentCategory: item.category,
			locked: Boolean(item.locked),
			passwordProtected: Boolean(item.passwordProtected),
			read: Boolean(stored?.read)
		};
	}

	/**
	 * @param {Record<string, any>} item
	 * @param {string} moduleId
	 */
	function progressRecordFor(item, moduleId) {
		const itemKey = item.virtualId ?? item.id;

		return {
			id: `${moduleId}:${moduleId === "Chats" ? (item.channel ?? itemKey) : itemKey}`,
			title: titleForItem(item, moduleId),
			category: moduleId,
			important: importantForItem(item, moduleId),
			evidenceTags: evidenceTagsForItem(item, moduleId)
		};
	}

	/**
	 * @param {Record<string, any>} item
	 * @param {string} moduleId
	 */
	function titleForItem(item, moduleId) {
		if (moduleId === "Emails") return item.subject;
		if (moduleId === "Chats") return item.title ?? `#${item.channel}`;
		if (moduleId === "System") return item.code;
		return item.title;
	}

	/**
	 * @param {Record<string, any>} item
	 * @param {string} moduleId
	 */
	function importantForItem(item, moduleId) {
		if (moduleId === "Chats") return Boolean(item.isEncrypted);
		if (moduleId === "System") return item.level !== "INFO";
		return Boolean(item.isFlagged);
	}

	/**
	 * @param {Record<string, any>} item
	 * @param {string} moduleId
	 */
	function evidenceTagsForItem(item, moduleId) {
		const tags = [];

		if (Array.isArray(item.evidenceTags)) {
			tags.push(...item.evidenceTags);
		}

		if (moduleId === "Documents" && item.tags) {
			tags.push(...item.tags.split(",").map(trimTag).filter(Boolean));
		}

		if (moduleId === "Documents" && item.title === "Recovered Sticky Note") {
			tags.push("server-room-knock-pattern");
		}

		if (moduleId === "Documents" && item.title === "Security Note: East Archive") {
			tags.push("east-archive-breach");
		}

		if (moduleId === "System" && item.level !== "INFO") {
			tags.push("blackout-timeline");
		}

		if (moduleId === "System" && item.code === "AUTH-102") {
			tags.push("duplicate-credential");
		}

		return Array.from(new Set(tags));
	}

	/**
	 * @param {Record<string, any>} item
	 * @param {boolean} completesBlackout
	 */
	function notifyRecoveredFilesFor(item, completesBlackout) {
		const files = [];

		if (item.title === "Recovered Sticky Note") {
			files.push(VIRTUAL_DOCUMENTS.find((file) => file.virtualId === "server-room-audio-transcript"));
		}

		if (item.title === "Security Note: East Archive") {
			files.push(VIRTUAL_DOCUMENTS.find((file) => file.virtualId === "east-archive-access-map"));
		}

		if (completesBlackout) {
			files.push(VIRTUAL_DOCUMENTS.find((file) => file.virtualId === "relay-failure-report"));
		}

		for (const file of files) {
			if (!file) continue;

			const fileId = `Documents:${file.virtualId}`;
			setTransient("item", fileId);
			addSessionLog({
				level: "INFO",
				source: "file-indexer",
				code: "FILE-201",
				messageKey: "logs.messages.FILE-201",
				params: { title: $t(file.titleKey) }
			});
		}

		return files.filter(Boolean);
	}

	/** @param {string} password */
	function attemptUnlock(password) {
		const normalizedPassword = password.trim().toUpperCase();

		if (normalizedPassword !== PASSWORD_FRAGMENT_CODE) {
			accessError = true;
			pushNotification({
				type: "error",
				titleKey: "notifications.passwordFailure.title",
				messageKey: "notifications.passwordFailure.message"
			});
			addSessionLog({
				level: "ERROR",
				source: "cipher-gate",
				code: "AUTH-403"
			});
			return false;
		}

		const wasUnlocked = encryptedFragmentUnlocked;
		unlockFile(PASSWORD_FRAGMENT_ID);
		accessItem = null;
		accessError = false;
		selectedModule = "Chats";
		selectedItemId = PASSWORD_FRAGMENT_ID;
		setTransient("item", PASSWORD_FRAGMENT_ID);
		setTransient("objective", "encrypted-fragment");
		pushNotification({
			type: "evidence",
			titleKey: "notifications.passwordSuccess.title",
			messageKey: "notifications.passwordSuccess.message"
		});
		addSessionLog({
			level: "INFO",
			source: "cipher-gate",
			code: "AUTH-200"
		});

		if (!wasUnlocked) {
			pushNotification({
				type: "objective",
				titleKey: "notifications.objectiveCompleted.title",
				messageKey: "notifications.objectiveCompleted.message"
			});
		}

		return true;
	}

	function closeAccessGate() {
		accessItem = null;
		accessError = false;
	}

	function openHelp() {
		helpOpen = true;
	}

	function closeChapterSummary() {
		chapterSummaryOpen = false;
	}

	function closeHelp() {
		helpOpen = false;
		localStorage.setItem(HELP_SEEN_KEY, "true");
	}

	function resetInvestigationState() {
		resetProgress();
		resetInvestigation();
		resetRecovery();
		clearSessionLogs();
		clearNotifications();
		selectedModule = "Documents";
		selectedItemId = null;
		recentItemId = null;
		recentEvidenceId = null;
		recentObjectiveId = null;
		accessItem = null;
		accessError = false;
		hiddenRelayRecovered = false;
		chapterSummaryOpen = false;
		localStorage.setItem(HELP_SEEN_KEY, "true");
	}

	/**
	 * @param {string} firstEvidenceId
	 * @param {string} secondEvidenceId
	 * @param {string} justificationId
	 */
	function handleCreateConnection(firstEvidenceId, secondEvidenceId, justificationId) {
		const result = addConnection(firstEvidenceId, secondEvidenceId, justificationId);

		if (result.reason === "duplicate") {
			pushNotification({
				type: "warning",
				titleKey: "notifications.connectionDuplicate.title",
				messageKey: "notifications.connectionDuplicate.message"
			});
			return result;
		}

		if (!result.accepted) {
			const speculationDiscarded = Boolean("speculationDiscarded" in result && result.speculationDiscarded);
			pushNotification({
				type: "warning",
				titleKey: speculationDiscarded
					? "notifications.speculativeConnectionsDiscarded.title"
					: "notifications.connectionRejected.title",
				messageKey: speculationDiscarded
					? "notifications.speculativeConnectionsDiscarded.message"
					: "notifications.connectionRejected.message"
			});
			addSessionLog({
				level: "WARN",
				source: "connection-board",
				code: speculationDiscarded ? "CON-429" : "CON-422",
				messageKey: speculationDiscarded ? "logs.messages.CON-429" : "logs.messages.CON-422"
			});
			return result;
		}

		pushNotification({
			type: "evidence",
			titleKey: "notifications.connectionCreated.title",
			messageKey: "notifications.connectionCreated.message"
		});
		addSessionLog({
			level: "INFO",
			source: "connection-board",
			code: "CON-101",
			messageKey: "logs.messages.CON-101"
		});

		if (verifiedConnectionCount + 1 >= REQUIRED_CHAPTER_CONNECTION_IDS.length && markMilestone("connect-related-evidence")) {
			setTransient("objective", "connect-related-evidence");
			pushNotification({
				type: "objective",
				titleKey: "notifications.objectiveCompleted.title",
				messageKey: "notifications.objectiveCompleted.message"
			});
		}

		return result;
	}

	/** @param {string} target */
	function handleRecoveryScan(target = "relay") {
		return processRecoveryResult(scanRecoveryTarget(target));
	}

	/** @param {string} fileId */
	function handleRecoveryRepair(fileId = "file_12") {
		return processRecoveryResult(repairRecoveryFile(fileId));
	}

	/** @param {string} target */
	function handleRecoveryDeepRecovery(target = "relay") {
		return processRecoveryResult(deepRecoverTarget(target));
	}

	/** @param {string[]} order */
	function handleRecoverySetAssemblyOrder(order) {
		setAssemblyOrder(order);
	}

	function handleRecoveryAssemble() {
		return processRecoveryResult(assembleMaintenanceReport());
	}

	/** @param {Record<string, any>} result */
	function processRecoveryResult(result) {
		if (result.status === "fragment-recovered") {
			const fragment = recoveryFragmentFor(result.fragmentId);
			if (fragment) {
				markEvidenceTagsDiscovered(fragment.evidenceTags);
				setTransient("evidence", "EvidenceBoard:recovered-fragment-set");
				setTransient("objective", "recover-maintenance-records");
				pushNotification({
					type: "evidence",
					titleKey: "notifications.fragmentRecovered.title",
					messageKey: "notifications.fragmentRecovered.message",
					params: { fragment: $t(fragment.titleKey) }
				});
				addSessionLog({
					level: "INFO",
					source: "recovery-lab",
					code: "REC-120",
					messageKey: "logs.messages.REC-120"
				});
			}
		} else if (result.status === "reconstructed") {
			const document = reconstructedRecoveryDocuments({
				reconstructedDocuments: { [MAINTENANCE_REPORT_ID]: true }
			})[0];
			markEvidenceTagsDiscovered(document?.evidenceTags ?? ["power-relay-maintenance-report"]);
			setTransient("item", `Documents:${MAINTENANCE_REPORT_ID}`);
			setTransient("evidence", "EvidenceBoard:power-relay-maintenance-report");
			setTransient("objective", "recover-maintenance-records");
			pushNotification({
				type: "objective",
				titleKey: "notifications.documentReconstructed.title",
				messageKey: "notifications.documentReconstructed.message"
			});
			addSessionLog({
				level: "WARN",
				source: "recovery-lab",
				code: "REC-500",
				messageKey: "logs.messages.REC-500"
			});
		} else if (result.status === "wrong-order") {
			pushNotification({
				type: "warning",
				titleKey: "notifications.recoveryBlocked.title",
				messageKey: "notifications.recoveryBlocked.message"
			});
			addSessionLog({
				level: "WARN",
				source: "recovery-lab",
				code: "REC-409",
				messageKey: "logs.messages.REC-409"
			});
		} else if (!["already-recovered", "already-reconstructed"].includes(result.status)) {
			pushNotification({
				type: "warning",
				titleKey: "notifications.recoveryBlocked.title",
				messageKey: "notifications.recoveryBlocked.message"
			});
			addSessionLog({
				level: "WARN",
				source: "recovery-lab",
				code: "REC-404",
				messageKey: "logs.messages.REC-404"
			});
		}

		return {
			key: `terminal.recovery.results.${result.status}`,
			params: result.fragmentId ? { file: result.fragmentId } : { target: result.target },
			tone: result.status === "fragment-recovered" || result.status === "reconstructed" ? "evidence" : "warning"
		};
	}

	/** @param {string} command */
	function handleTerminalCommand(command) {
		pushNotification({
			type: "info",
			titleKey: "notifications.commandExecuted.title",
			messageKey: "notifications.commandExecuted.message",
			params: { command }
		});
		addSessionLog({
			level: "INFO",
			source: "terminal",
			code: "TERM-001",
			messageKey: "logs.messages.terminalCommand",
			params: { command }
		});
	}

	function handleTerminalScan() {
		if (hiddenRelayRecovered) return false;

		hiddenRelayRecovered = true;
		setTransient("objective", "trace-blackout-source");
		pushNotification({
			type: "warning",
			titleKey: "notifications.scanComplete.title",
			messageKey: "notifications.scanComplete.message"
		});
		addSessionLog({
			level: "WARN",
			source: "terminal",
			code: "SCAN-778"
		});
		return true;
	}

	/** @param {string} tag */
	function trimTag(tag) {
		return tag.trim();
	}

	/** @param {Array<Record<string, any>>} chats */
	function groupChats(chats) {
		const threads = new Map();

		for (const chat of chats) {
			if (!threads.has(chat.channel)) {
				threads.set(chat.channel, {
					id: chat.channel,
					channel: chat.channel,
					messages: [],
					sentAt: chat.sentAt,
					isEncrypted: false
				});
			}

			const thread = threads.get(chat.channel);
			thread.messages.push(chat);
			thread.sentAt = chat.sentAt;
			thread.isEncrypted = thread.isEncrypted || chat.isEncrypted;
		}

		return Array.from(threads.values());
	}

	function hiddenRelayLog() {
		return {
			id: "hidden-relay-diagnostic",
			level: "WARN",
			source: "uplink-core",
			code: "SCAN-778",
			occurredAt: "2041-10-09T03:44:19.000Z",
			isFlagged: true
		};
	}

	/** @param {string} evidenceId */
	function selectEvidence(evidenceId) {
		selectedItemId = evidenceId;
	}
</script>

<svelte:head>
	<title>{$t("meta.title")}</title>
	<meta
		name="description"
		content={$t("meta.description")}
	/>
</svelte:head>

{#if caseFile}
	<div class="dead-shell relative min-h-dvh overflow-x-hidden bg-[#050708] text-white">
		<div class="scanline pointer-events-none fixed inset-0 z-20"></div>
		<NotificationCenter />
		<TopBar title={$t("brand.name")} status={caseFile.status} caseTitle={caseFile.title} onOpenHelp={openHelp} />

		<main class="grid gap-px bg-cyan-300/10 p-px lg:h-[calc(100dvh-3rem)] lg:grid-rows-[minmax(0,1fr)_180px]">
			<section class="grid gap-px bg-cyan-300/10 lg:min-h-0 lg:grid-cols-[280px_minmax(0,1fr)_320px]">
				<FileExplorer
					{folders}
					{selectedModule}
					{activeItemId}
					{recentItemId}
					{recentEvidenceId}
					items={moduleItems}
					onSelectModule={selectModule}
					onSelectItem={selectItem}
				/>
				<MainWindow
					{selectedModule}
					{activeItem}
					items={moduleItems}
					{caseFile}
					{recentEvidenceId}
					connections={$investigation.connections}
					notes={$investigation.notes}
					unlockedDeductions={$investigation.unlockedDeductions}
					{caseStats}
					{chapterSummaryUnlocked}
					recoveryState={$recovery}
					terminalEvidences={evidenceItems}
					onSelectEvidence={selectEvidence}
					onCreateConnection={handleCreateConnection}
					onRecoveryScan={handleRecoveryScan}
					onRecoveryRepair={handleRecoveryRepair}
					onRecoveryDeepRecovery={handleRecoveryDeepRecovery}
					onRecoverySetAssemblyOrder={handleRecoverySetAssemblyOrder}
					onRecoveryAssemble={handleRecoveryAssemble}
					onTerminalUnlock={attemptUnlock}
					onTerminalScan={handleTerminalScan}
					onTerminalRecover={handleRecoveryScan}
					onTerminalRepair={handleRecoveryRepair}
					recoveryFragments={recoveredFragments}
					onTerminalCommand={handleTerminalCommand}
				/>
				<ObjectivesPanel {caseFile} {objectives} {recentObjectiveId} />
			</section>

			<SystemLogs logs={caseFile.logs} dynamicLogs={$sessionLogs} />
		</main>
		<ChapterSummaryModal
			open={chapterSummaryOpen}
			caseCompletionPercent={caseCompletionPercent}
			onClose={closeChapterSummary}
		/>
		<AccessModal item={accessItem} error={accessError} onSubmit={attemptUnlock} onCancel={closeAccessGate} />
		<HelpModal open={helpOpen} onClose={closeHelp} onReset={resetInvestigationState} />
	</div>
{:else}
	<main class="grid min-h-dvh place-items-center bg-[#050708] p-6 text-white">
		<div class="dead-panel max-w-lg p-6 text-center">
			<div class="mx-auto flex h-12 w-12 items-center justify-center rounded border border-cyan-300/30 bg-cyan-300/10 text-cyan-50">
				<DatabaseZap size={22} />
			</div>
			<h1 class="mt-4 text-lg font-semibold uppercase tracking-[0.16em]">{$t("brand.name")}</h1>
			<p class="mt-3 text-sm leading-6 text-white/55">{$t("case.missing")}</p>
		</div>
	</main>
{/if}
