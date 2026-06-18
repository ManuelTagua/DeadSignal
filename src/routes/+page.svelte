<script>
	import { onMount } from "svelte";
	import { ClipboardCheck, DatabaseZap, Fingerprint, GitBranch, GitCompareArrows, KeyRound, Lightbulb, RadioReceiver, Route, Users, Wrench } from "@lucide/svelte";
	import { FOLDERS } from "$lib/config/folders";
	import { CHAPTERS, CHAPTER_1_ID, CHAPTER_2_ID, caseFileForChapter, casePathSlug, chapterIsUnlocked } from "$lib/game/chapters";
	import {
		contradictionForSources,
		contradictionSourceDefinitionsForChapter,
		contradictionSourceForId,
		contradictionsForChapter,
		countConfirmedContradictions,
		requiredContradictionIdsForChapter,
		validateContradictionAttempt
	} from "$lib/game/contradictions";
	import {
		countCorrectConnections,
		countRequiredChapterConnections,
		deductionDefinitionsForChapter,
		requiredConnectionIdsForChapter,
		requiredDeductionIdsForChapter,
		unlockableDeductions
	} from "$lib/game/deductions";
	import { evidenceDefinitionsForChapter, unlockedEvidence } from "$lib/game/evidence";
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
	import {
		TIMELINE_PENALTY,
		correctTimelineOrderForChapter,
		initialTimelineOrderForChapter,
		isCorrectTimelineOrder,
		sortTimelineEvents,
		terminalTimelineOrderForChapter,
		timelineDeductionIdForChapter,
		timelineEventsForChapter
	} from "$lib/game/timeline";
	import {
		SUSPECT_ACCUSATION_PENALTY,
		suspectAccusationDecisionIdForChapter,
		suspectAccusationDeductionIdForChapter,
		suspectsForChapter,
		validateSuspectAccusation
	} from "$lib/game/suspects";
	import {
		FINAL_REPORT_DECISION_ID,
		finalReportDecisionForChapter,
		finalReportDecisionIdForChapter,
		finalReportIsCorrect,
		finalReportQuestionsForChapter
	} from "$lib/game/caseReview";
	import AccessModal from "$lib/components/modules/AccessModal.svelte";
	import ChapterSummaryModal from "$lib/components/modules/ChapterSummaryModal.svelte";
	import CaseFailureModal from "$lib/components/os/CaseFailureModal.svelte";
	import ChapterSwitcher from "$lib/components/os/ChapterSwitcher.svelte";
	import FileExplorer from "$lib/components/os/FileExplorer.svelte";
	import HelpModal from "$lib/components/os/HelpModal.svelte";
	import MainWindow from "$lib/components/os/MainWindow.svelte";
	import NotificationCenter from "$lib/components/os/NotificationCenter.svelte";
	import ObjectivesPanel from "$lib/components/os/ObjectivesPanel.svelte";
	import SystemLogs from "$lib/components/os/SystemLogs.svelte";
	import TopBar from "$lib/components/os/TopBar.svelte";
	import { dataText, t } from "$lib/i18n";
	import { activeChapterId, setActiveChapter } from "$lib/stores/ChapterStore";
	import {
		CASE_DECISION_MAX_ATTEMPTS,
		CASE_INTEGRITY_PENALTIES,
		acceptSuspectAccusation,
		addConnection,
		caseIntegrityStatus,
		clearPuzzleMistakes,
		confirmContradiction,
		completeTimeline,
		investigation,
		investigationForChapter,
		markMilestone,
		recordDecisionFailure,
		recordDecisionSuccess,
		recordPuzzleMistake,
		rejectContradiction,
		rejectSuspectAccusation,
		rejectTimeline,
		resetInvestigation,
		setTimelineOrder,
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
	const baseCaseFile = $derived(data.caseFile);
	const caseFile = $derived(caseFileForChapter(baseCaseFile, $activeChapterId));
	const activeChapterIsHelix = $derived($activeChapterId === CHAPTER_1_ID);
	const activeChapterIsMirror = $derived($activeChapterId === CHAPTER_2_ID);
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
	let chapterSummaryKey = $state("chapterSummary");

	const activeInvestigation = $derived(investigationForChapter($investigation, $activeChapterId));
	const helixInvestigation = $derived(investigationForChapter($investigation, CHAPTER_1_ID));
	const mirrorInvestigation = $derived(investigationForChapter($investigation, CHAPTER_2_ID));
	const chapterEvidenceDefinitions = $derived(evidenceDefinitionsForChapter($activeChapterId));
	const evidenceItems = $derived(unlockedEvidence($progress, $activeChapterId));
	const importantLogsRead = $derived(countReadImportantByCategory($progress, "System", $activeChapterId));
	const duplicateCredentialUnlocked = $derived(evidenceItems.some(hasDuplicateCredentialEvidence));
	const duplicateCredentialTraced = $derived(Boolean(helixInvestigation.milestones?.["duplicate-credential-traced"]));
	const eastArchiveCompleted = $derived(hasReadEvidenceTag($progress, "east-archive-breach"));
	const encryptedFragmentUnlocked = $derived(isFileUnlocked($progress, PASSWORD_FRAGMENT_ID));
	const encryptedFragmentHintUnlocked = $derived(hasReadEvidenceTag($progress, "server-room-knock-pattern"));
	const timelineEventDefinitions = $derived(timelineEventsForChapter($activeChapterId));
	const totalTimelineEvents = $derived(timelineEventDefinitions.length);
	const timelinePreferredOrder = $derived(initialTimelineOrderForChapter($activeChapterId));
	const terminalPreferredTimelineOrder = $derived(terminalTimelineOrderForChapter($activeChapterId));
	const correctTimelineOrder = $derived(correctTimelineOrderForChapter($activeChapterId));
	const activeTimelineDeductionId = $derived(timelineDeductionIdForChapter($activeChapterId));
	const contradictionDefinitions = $derived(contradictionsForChapter($activeChapterId));
	const contradictionSourceDefinitions = $derived(contradictionSourceDefinitionsForChapter($activeChapterId));
	const requiredContradictionIds = $derived(requiredContradictionIdsForChapter($activeChapterId));
	const deductionDefinitions = $derived(deductionDefinitionsForChapter($activeChapterId));
	const requiredConnectionIds = $derived(requiredConnectionIdsForChapter($activeChapterId));
	const requiredDeductionIds = $derived(requiredDeductionIdsForChapter($activeChapterId));
	const suspectAccusationDecisionId = $derived(suspectAccusationDecisionIdForChapter($activeChapterId));
	const suspectAccusationDeductionId = $derived(suspectAccusationDeductionIdForChapter($activeChapterId));
	const finalReportDecisionId = $derived(finalReportDecisionIdForChapter($activeChapterId));
	const finalReportDecision = $derived(finalReportDecisionForChapter($activeChapterId));
	const finalReportQuestions = $derived(finalReportQuestionsForChapter($activeChapterId));
	const finalReportCopyKeyPrefix = $derived(activeChapterIsMirror ? "caseReviewMirror" : "caseReview");
	const verifiedConnectionCount = $derived(countCorrectConnections(activeInvestigation.connections, $activeChapterId));
	const requiredVerifiedConnectionCount = $derived(countRequiredChapterConnections(activeInvestigation.connections, $activeChapterId));
	const requiredDeductionsCount = $derived(countRequiredDeductions(activeInvestigation.unlockedDeductions));
	const confirmedContradictionCount = $derived(countConfirmedContradictions(activeInvestigation.confirmedContradictions, $activeChapterId));
	const timelineCompleted = $derived(Boolean(activeInvestigation.timeline?.completed));
	const accessPhraseDeductionUnlocked = $derived(Boolean(helixInvestigation.unlockedDeductions?.["access-phrase"]));
	const suspectAccusationAccepted = $derived(Boolean(activeInvestigation.suspectAccusation?.accepted));
	const recoveredFragments = $derived(discoveredRecoveryFragments($recovery));
	const maintenanceReportRecovered = $derived(isMaintenanceReportReconstructed($recovery));
	const maintenanceRecordsAvailable = $derived(importantLogsRead >= 1 || selectedModule === "RecoveryLab" || recoveredFragments.length > 0);
	const finalReportCriteria = $derived([
		timelineCompleted,
		suspectAccusationAccepted,
		confirmedContradictionCount >= requiredContradictionIds.length,
		requiredVerifiedConnectionCount >= requiredConnectionIds.length,
		activeChapterIsHelix ? encryptedFragmentUnlocked : true
	]);
	const chapter1Resolved = $derived(
		Boolean(helixInvestigation.completedDecisions?.[FINAL_REPORT_DECISION_ID] || helixInvestigation.milestones?.["chapter-1-completed"])
	);
	const chapter2Resolved = $derived(
		Boolean(mirrorInvestigation.completedDecisions?.["chapter-2-final-report"] || mirrorInvestigation.milestones?.["chapter-2-completed"])
	);
	const activeChapterResolved = $derived(activeChapterIsMirror ? chapter2Resolved : chapter1Resolved);
	const finalReportUnlocked = $derived(activeChapterResolved || finalReportCriteria.every(Boolean));
	const chapterProgressCriteria = $derived([...finalReportCriteria, activeChapterResolved]);
	const chapterProgressPercent = $derived(
		(chapterProgressCriteria.filter(Boolean).length / chapterProgressCriteria.length) * 100
	);
	const caseCompletionPercent = $derived(calculateCaseCompletion());
	const caseStats = $derived({
		evidenceDiscovered: evidenceItems.length,
		evidenceTotal: chapterEvidenceDefinitions.length,
		caseCompletionPercent,
		chapterProgressPercent
	});
	const caseIntegrity = $derived(caseIntegrityFor(activeInvestigation.caseIntegrity));
	const caseFailureModalOpen = $derived(caseIntegrity.value <= 0 && !helpOpen);
	const systemLogItems = $derived([...(activeChapterIsHelix && hiddenRelayRecovered ? [hiddenRelayLog()] : []), ...(caseFile?.logs ?? [])]);
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
			...(activeChapterIsHelix ? VIRTUAL_DOCUMENTS.map(prepareVirtualDocument) : []),
			...(activeChapterIsHelix ? recoveryDocuments.map(prepareRecoveryDocument) : [])
		].map(enrichDocument),
		Emails: (caseFile?.emails ?? []).map(enrichEmail),
		Chats: [
			...groupChats(caseFile?.chats ?? []),
			...(activeChapterIsHelix ? VIRTUAL_CHATS.map(prepareVirtualChat) : [])
		].map(enrichChat),
		Media: (caseFile?.media ?? []).map(enrichMedia),
		System: systemLogItems.map(enrichLog),
		RecoveryLab: activeChapterIsHelix ? recoveryLabItems : [],
		EvidenceBoard: evidenceItems,
		Terminal: []
	});
	const timelineEvents = $derived(availableTimelineEvents());
	const terminalTimelineEvents = $derived(
		sortTimelineEvents(
			timelineEvents.filter((event) => event.unlocked),
			terminalPreferredTimelineOrder
		)
	);
	const contradictionSources = $derived(availableContradictionSources());
	const terminalContradictions = $derived(
		contradictionDefinitions.filter((contradiction) => activeInvestigation.confirmedContradictions?.[contradiction.id])
	);
	const suspects = $derived(availableSuspects());
	const terminalSuspects = $derived(suspects.filter((suspect) => suspect.discovered));
	const terminalSearchItems = $derived(buildTerminalSearchItems());
	const terminalHiddenCommands = $derived({
		traceCredential: activeChapterIsHelix && hasReadEvidenceTag($progress, "terminal-trace-credential"),
		decryptFragment: activeChapterIsHelix && hasReadEvidenceTag($progress, "terminal-decrypt-fragment")
	});
	const activeConnections = $derived(activeInvestigation.connections);
	const activeNotes = $derived(activeInvestigation.notes);
	const activeUnlockedDeductions = $derived(activeInvestigation.unlockedDeductions);
	const activeTimelineState = $derived(activeInvestigation.timeline);
	const activeConfirmedContradictions = $derived(activeInvestigation.confirmedContradictions);
	const activeSuspectAccusation = $derived(activeInvestigation.suspectAccusation);
	const activeDecisionAttempts = $derived(activeInvestigation.decisionAttempts);
	const activeCompletedDecisions = $derived(activeInvestigation.completedDecisions);
	const chapters = $derived(
		CHAPTERS.map((chapter) => ({
			...chapter,
			unlocked: chapterIsUnlocked(chapter.id, { chapter1Resolved, chapter2Resolved })
		}))
	);

	$effect(() => {
		if (chapterIsUnlocked($activeChapterId, { chapter1Resolved, chapter2Resolved })) return;
		setActiveChapter(CHAPTER_1_ID);
		selectedModule = "Documents";
		selectedItemId = null;
	});

	const folders = $derived(
		FOLDERS.map((folder) => ({
			...folder,
			path: folder.path.replace("/cases/helix", `/cases/${casePathSlug($activeChapterId)}`),
			count: collectionFor(folder.id).length
		}))
	);

	const moduleItems = $derived(collectionFor(selectedModule));
	const activeItem = $derived(selectedItemId ? (moduleItems.find(isSelectedItem) ?? null) : null);
	const activeItemId = $derived(activeItem?.id ?? null);
	const finalReportMeta = $derived({
		timeline: timelineCompleted ? $t("objectives.meta.confirmed") : $t("objectives.meta.pending"),
		suspect: suspectAccusationAccepted ? $t("objectives.meta.confirmed") : $t("objectives.meta.pending"),
		contradiction:
			confirmedContradictionCount >= requiredContradictionIds.length
				? $t("objectives.meta.confirmed")
				: $t("objectives.meta.pending"),
		connections:
			requiredVerifiedConnectionCount >= requiredConnectionIds.length
				? $t("objectives.meta.confirmed")
				: $t("objectives.meta.pending"),
		fragment: encryptedFragmentUnlocked ? $t("objectives.meta.confirmed") : $t("objectives.meta.pending")
	});

	const objectives = $derived(activeChapterIsMirror ? mirrorObjectives() : [
		{
			id: "blackout-timeline",
			labelKey: "objectives.blackout.label",
			metaKey: "objectives.blackout.meta",
			metaParams: {
				count: timelineEvents.filter((event) => event.unlocked).length,
				required: totalTimelineEvents
			},
			icon: Route,
			state: timelineCompleted
				? "completed"
				: selectedModule === "EvidenceBoard" && timelineEvents.some((event) => event.unlocked)
					? "active"
					: timelineEvents.some((event) => event.unlocked)
						? "open"
						: "locked"
		},
		{
			id: "duplicate-credential",
			labelKey: "objectives.credential.label",
			metaKey: "objectives.credential.meta",
			metaParams: { count: 0 },
			icon: Fingerprint,
			state: duplicateCredentialTraced ? "completed" : duplicateCredentialUnlocked ? "active" : "locked"
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
			metaParams: { count: requiredVerifiedConnectionCount, required: requiredConnectionIds.length },
			icon: GitBranch,
			state:
				requiredVerifiedConnectionCount >= requiredConnectionIds.length
					? "completed"
					: evidenceItems.length >= 2 && selectedModule === "EvidenceBoard"
						? "active"
						: evidenceItems.length >= 2
							? "open"
							: "locked"
		},
		{
			id: "detect-case-contradictions",
			labelKey: "objectives.contradictions.label",
			metaKey: "objectives.contradictions.meta",
			metaParams: { count: confirmedContradictionCount, required: requiredContradictionIds.length },
			icon: GitCompareArrows,
			state:
				confirmedContradictionCount >= requiredContradictionIds.length
					? "completed"
					: selectedModule === "EvidenceBoard" && contradictionSources.length >= 2
						? "active"
						: contradictionSources.length >= 2
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
			metaParams: {
				count: suspectAccusationAccepted ? 1 : 0,
				required: 1
			},
			icon: Users,
			state: suspectAccusationAccepted
				? "completed"
				: suspects.some((suspect) => suspect.discovered) && selectedModule === "EvidenceBoard"
					? "active"
					: suspects.some((suspect) => suspect.discovered)
						? "open"
						: "locked"
		},
		{
			id: "reconstruct-blackout-sequence",
			labelKey: "objectives.reconstructBlackout.label",
			metaKey: "objectives.reconstructBlackout.meta",
			metaParams: {
				connections: requiredVerifiedConnectionCount,
				requiredConnections: requiredConnectionIds.length,
				deductions: requiredDeductionsCount,
				requiredDeductions: requiredDeductionIds.length,
				fragment: encryptedFragmentUnlocked
					? $t("objectives.meta.fragmentCompleted")
					: $t("objectives.meta.fragmentPending")
			},
			icon: Route,
			state: finalReportUnlocked
				? "completed"
				: encryptedFragmentUnlocked && eastArchiveCompleted && selectedModule === "EvidenceBoard"
					? "active"
					: encryptedFragmentUnlocked && eastArchiveCompleted
						? "open"
						: "locked"
		},
		{
			id: "present-final-report",
			labelKey: "objectives.finalReport.label",
			metaKey: "objectives.finalReport.meta",
			metaParams: finalReportMeta,
			icon: ClipboardCheck,
			state: chapter1Resolved
				? "completed"
				: finalReportUnlocked && selectedModule === "EvidenceBoard"
					? "active"
					: finalReportUnlocked
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

		const unlocksRelayReport =
			activeChapterIsHelix &&
			selectedModule === "System" &&
			activeItem.important &&
			importantLogsRead < IMPORTANT_LOG_REQUIREMENT &&
			importantLogsRead + 1 >= IMPORTANT_LOG_REQUIREMENT;
		const completesEastArchive = activeItem.evidenceTags.includes("east-archive-breach");
		const updatesDuplicateCredential = activeItem.evidenceTags.includes("duplicate-credential");
		const hasAccessAnomaly = activeChapterIsHelix && selectedModule === "System" && activeItem.important;

		setTransient("item", activeItem.id);

		for (const evidence of newEvidenceDefinitions) {
			const evidenceId = `EvidenceBoard:${evidence.id}`;
			setTransient("evidence", evidenceId);
		}

		const recoveredFiles = notifyRecoveredFilesFor(activeItem, unlocksRelayReport);

		if (completesEastArchive) {
			setTransient("objective", "east-archive-breach");
		}

		pushNotification({
			type: notificationTypeForAnalysis({
				hasAccessAnomaly,
				hasEvidence: newEvidenceDefinitions.length > 0,
				hasObjective: updatesDuplicateCredential || completesEastArchive
			}),
			titleKey: "notifications.fileAnalyzed.title",
			messageKey: "notifications.fileAnalyzed.message",
			params: {
				details: analysisSummaryFor({
					hasAccessAnomaly,
					evidenceCount: newEvidenceDefinitions.length,
					hasObjectiveUpdate: updatesDuplicateCredential,
					hasObjectiveCompleted: completesEastArchive,
					recoveredFileCount: recoveredFiles.length
				})
			}
		});

		markActiveItemRead();
	});

	$effect(() => {
		const deductions = unlockableDeductions(activeInvestigation.connections, activeInvestigation.unlockedDeductions, $activeChapterId);

		for (const deduction of deductions) {
			if (!unlockDeduction(deduction.id, $activeChapterId)) continue;

			const objectiveId =
				deduction.id === "access-phrase"
					? "prove-access-phrase"
					: deduction.id === "maintenance-reroute"
						? "recover-maintenance-records"
						: deduction.id === "archive-route-access"
							? "connect-related-evidence"
							: activeChapterIsMirror
								? "mirror-connect-evidence"
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
		if (!finalReportUnlocked || activeChapterResolved) return;
		const milestoneId = activeChapterIsMirror ? "chapter-2-final-report-unlocked" : "chapter-1-final-report-unlocked";
		if (!markMilestone(milestoneId, $activeChapterId)) return;

		setTransient("objective", activeChapterIsMirror ? "mirror-final-report" : "present-final-report");
		pushNotification({
			type: "objective",
			titleKey: "notifications.finalReportUnlocked.title",
			messageKey: activeChapterIsMirror ? "notifications.finalReportUnlocked.mirrorMessage" : "notifications.finalReportUnlocked.message"
		});
		addSessionLog({
			level: "WARN",
			source: "deduction-engine",
			code: "CH-101",
			messageKey: activeChapterIsMirror ? "logs.messages.CH2-101" : "logs.messages.CH-101"
		});
	});

	/** @param {string} moduleId */
	function selectModule(moduleId) {
		selectedModule = moduleId;
		selectedItemId = null;
		accessItem = null;
		accessError = false;
	}

	/** @param {string} chapterId */
	function selectChapter(chapterId) {
		const chapter = CHAPTERS.find((item) => item.id === chapterId);

		if (!chapterIsUnlocked(chapterId, { chapter1Resolved, chapter2Resolved })) {
			pushNotification({
				type: "warning",
				titleKey: "notifications.chapterLocked.title",
				messageKey: "notifications.chapterLocked.message"
			});
			return;
		}

		if (chapter?.comingSoon) {
			pushNotification({
				type: "info",
				titleKey: "notifications.chapterComingSoon.title",
				messageKey: "notifications.chapterComingSoon.message"
			});
			return;
		}

		if ($activeChapterId === chapterId) return;

		setActiveChapter(chapterId);
		selectedModule = "Documents";
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

	function buildTerminalSearchItems() {
		return [
			...collectionFor("Documents")
				.filter(searchableItem)
				.map(/** @param {Record<string, any>} item */ (item) =>
					terminalSearchItem(item, "terminal.search.types.document", documentSearchText(item))
				),
			...collectionFor("Emails")
				.filter(searchableItem)
				.map(/** @param {Record<string, any>} item */ (item) =>
					terminalSearchItem(item, "terminal.search.types.email", emailSearchText(item))
				),
			...collectionFor("Chats")
				.filter(searchableItem)
				.map(/** @param {Record<string, any>} item */ (item) =>
					terminalSearchItem(item, "terminal.search.types.chat", chatSearchText(item))
				),
			...collectionFor("System")
				.filter(searchableItem)
				.map(/** @param {Record<string, any>} item */ (item) =>
					terminalSearchItem(item, "terminal.search.types.log", logSearchText(item))
				),
			...evidenceItems.map(/** @param {Record<string, any>} item */ (item) =>
				terminalSearchItem(item, "terminal.search.types.evidence", evidenceSearchText(item))
			)
		];
	}

	/** @param {Record<string, any>} item */
	function searchableItem(item) {
		return !item.locked;
	}

	/**
	 * @param {Record<string, any>} item
	 * @param {string} typeKey
	 * @param {string} text
	 */
	function terminalSearchItem(item, typeKey, text) {
		return {
			id: item.id,
			title: localizedTitleForItem(item),
			type: $t(typeKey),
			text
		};
	}

	/** @param {Record<string, any>} item */
	function localizedTitleForItem(item) {
		if (item.titleKey) return $t(item.titleKey);
		if (item.subjectKey) return $t(item.subjectKey);
		return $dataText(item.title ?? item.subject ?? item.code ?? item.channel ?? item.id);
	}

	/** @param {Record<string, any>} item */
	function documentSearchText(item) {
		const content =
			item.isCorrupted && item.damagedContentKey
				? $t(item.damagedContentKey)
				: item.contentKey
					? $t(item.contentKey)
					: $dataText(item.content);

		return [
			localizedTitleForItem(item),
			$t(`values.documentCategories.${item.contentCategory ?? item.category}`),
			$dataText(item.author),
			content,
			$dataText(item.tags ?? "")
		].join(" ");
	}

	/** @param {Record<string, any>} item */
	function emailSearchText(item) {
		return [
			item.subjectKey ? $t(item.subjectKey) : $dataText(item.subject),
			item.fromNameKey ? $t(item.fromNameKey) : $dataText(item.fromName),
			item.toNameKey ? $t(item.toNameKey) : $dataText(item.toName),
			item.fromEmail,
			item.toEmail,
			item.bodyKey ? $t(item.bodyKey) : $dataText(item.body)
		].join(" ");
	}

	/** @param {Record<string, any>} item */
	function chatSearchText(item) {
		const messages = (item.messages ?? [])
			.map(
				/** @param {Record<string, any>} message */
				(message) => [message.sender, message.handle, message.messageKey ? $t(message.messageKey) : $dataText(message.message)].join(" ")
			)
			.join(" ");

		return [localizedTitleForItem(item), item.channel, messages].join(" ");
	}

	/** @param {Record<string, any>} item */
	function logSearchText(item) {
		return [
			item.code,
			$t(`logs.titles.${item.code}`),
			$t(`logs.sources.${item.source}`),
			item.messageKey ? $t(item.messageKey, item.params ?? {}) : $dataText(item.message)
		].join(" ");
	}

	/** @param {Record<string, any>} item */
	function evidenceSearchText(item) {
		return [
			$t(item.titleKey),
			$t(item.descriptionKey),
			$t(item.longDescriptionKey),
			$t(item.sourceKey),
			$t(item.forensicNotesKey),
			...(item.relatedFileKeys ?? []).map(
				/** @param {string} key */
				(key) => $t(key)
			)
		].join(" ");
	}

	function calculateCaseCompletion() {
		if (activeChapterIsMirror) return calculateMirrorProgress();

		const checkpoints = [
			timelineCompleted ? 1 : 0,
			chapterEvidenceDefinitions.length ? evidenceItems.length / chapterEvidenceDefinitions.length : 0,
			encryptedFragmentUnlocked ? 1 : 0,
			eastArchiveCompleted ? 1 : 0,
			suspectAccusationAccepted ? 1 : 0,
			Math.min(requiredVerifiedConnectionCount / requiredConnectionIds.length, 1),
			Math.min(confirmedContradictionCount / requiredContradictionIds.length, 1),
			Math.min(requiredDeductionsCount / requiredDeductionIds.length, 1),
			finalReportUnlocked ? 1 : 0,
			chapter1Resolved ? 1 : 0,
			Math.min(recoveredFragments.length / RECOVERY_FRAGMENTS.length, 1),
			maintenanceReportRecovered ? 1 : 0
		];

		return (checkpoints.reduce((total, value) => total + value, 0) / checkpoints.length) * 100;
	}

	function calculateMirrorProgress() {
		if (chapter2Resolved) return 100;

		const checkpoints = [
			timelineCompleted ? 1 : 0,
			suspectAccusationAccepted ? 1 : 0,
			Math.min(confirmedContradictionCount / requiredContradictionIds.length, 1),
			Math.min(requiredVerifiedConnectionCount / requiredConnectionIds.length, 1),
			Math.min(requiredDeductionsCount / requiredDeductionIds.length, 1),
			finalReportUnlocked ? 1 : 0
		];

		return (checkpoints.reduce((total, value) => total + value, 0) / checkpoints.length) * 100;
	}

	function mirrorObjectives() {
		return [
			{
				id: "mirror-timeline",
				labelKey: "objectives.mirrorTimeline.label",
				metaKey: "objectives.mirrorTimeline.meta",
				metaParams: {
					count: timelineEvents.filter((event) => event.unlocked).length,
					required: totalTimelineEvents
				},
				icon: Route,
				state: timelineCompleted
					? "completed"
					: selectedModule === "EvidenceBoard" && timelineEvents.some((event) => event.unlocked)
						? "active"
						: timelineEvents.some((event) => event.unlocked)
							? "open"
							: "locked"
			},
			{
				id: "mirror-contradictions",
				labelKey: "objectives.mirrorContradictions.label",
				metaKey: "objectives.mirrorContradictions.meta",
				metaParams: { count: confirmedContradictionCount, required: requiredContradictionIds.length },
				icon: GitCompareArrows,
				state:
					confirmedContradictionCount >= requiredContradictionIds.length
						? "completed"
						: selectedModule === "EvidenceBoard" && contradictionSources.length >= 2
							? "active"
							: contradictionSources.length >= 2
								? "open"
								: "locked"
			},
			{
				id: "mirror-connect-evidence",
				labelKey: "objectives.mirrorConnections.label",
				metaKey: "objectives.mirrorConnections.meta",
				metaParams: { count: requiredVerifiedConnectionCount, required: requiredConnectionIds.length },
				icon: GitBranch,
				state:
					requiredVerifiedConnectionCount >= requiredConnectionIds.length
						? "completed"
						: evidenceItems.length >= 2 && selectedModule === "EvidenceBoard"
							? "active"
							: evidenceItems.length >= 2
								? "open"
								: "locked"
			},
			{
				id: "mirror-identify-suspect",
				labelKey: "objectives.mirrorSuspect.label",
				metaKey: "objectives.mirrorSuspect.meta",
				metaParams: { count: suspectAccusationAccepted ? 1 : 0, required: 1 },
				icon: Users,
				state: suspectAccusationAccepted
					? "completed"
					: suspects.some((suspect) => suspect.discovered) && selectedModule === "EvidenceBoard"
						? "active"
						: suspects.some((suspect) => suspect.discovered)
							? "open"
							: "locked"
			},
			{
				id: "mirror-final-report",
				labelKey: "objectives.mirrorFinalReport.label",
				metaKey: "objectives.mirrorFinalReport.meta",
				metaParams: finalReportMeta,
				icon: ClipboardCheck,
				state: chapter2Resolved
					? "completed"
					: finalReportUnlocked && selectedModule === "EvidenceBoard"
						? "active"
						: finalReportUnlocked
							? "open"
							: "locked"
			}
		];
	}

	/** @param {Record<string, any> | null | undefined} integrity */
	function caseIntegrityFor(integrity) {
		const value = Math.max(0, Math.min(100, Math.round(Number(integrity?.value ?? 100))));

		return {
			value,
			status: caseIntegrityStatus(value)
		};
	}

	function availableContradictionSources() {
		return contradictionSourceDefinitions.filter(sourceIsAvailable);
	}

	/** @param {string[]} sourceIds */
	function activeContradictionForSources(sourceIds) {
		return contradictionForSources(sourceIds, $activeChapterId);
	}

	/** @param {string} sourceId */
	function activeContradictionSourceForId(sourceId) {
		return contradictionSourceForId(sourceId, $activeChapterId);
	}

	function availableTimelineEvents() {
		return timelineEventDefinitions.map((event) => ({
			...event,
			unlocked: timelineEventIsUnlocked(event)
		}));
	}

	function availableSuspects() {
		return suspectsForChapter($activeChapterId).map((suspect) => {
			const facts = suspect.facts.map((fact) => ({
				...fact,
				unlocked: suspectFactIsUnlocked(fact)
			}));
			const knownFacts = facts.filter((fact) => fact.unlocked);

			return {
				...suspect,
				facts,
				knownFacts,
				discovered: knownFacts.length > 0
			};
		});
	}

	/** @param {Record<string, any>} fact */
	function suspectFactIsUnlocked(fact) {
		const unlocks = fact.unlock?.anyOf ?? [fact.unlock];

		return unlocks.filter(Boolean).some(/** @param {Record<string, any>} unlock */ (unlock) => {
			if (unlock.moduleId === "EvidenceBoard") {
				return evidenceItems.some((item) => item.evidenceId === unlock.evidenceId);
			}

			return collectionFor(unlock.moduleId).some(
				/** @param {Record<string, any>} item */
				(item) => suspectFactMatchesItem(unlock, item) && item.read && !item.locked
			);
		});
	}

	/**
	 * @param {Record<string, any>} unlock
	 * @param {Record<string, any>} item
	 */
	function suspectFactMatchesItem(unlock, item) {
		if (unlock.subject && item.subject === unlock.subject) return true;
		if (unlock.title && item.title === unlock.title) return true;
		if (unlock.code && item.code === unlock.code) return true;
		if (unlock.evidenceId && item.evidenceId === unlock.evidenceId) return true;
		if (unlock.channel && item.channel === unlock.channel) return true;
		return false;
	}

	/** @param {Record<string, any>} event */
	function timelineEventIsUnlocked(event) {
		const sourceItems = collectionFor(event.unlock.moduleId);

		return sourceItems.some(
			/** @param {Record<string, any>} item */
			(item) => timelineEventMatchesItem(event, item) && item.read && !item.locked
		);
	}

	/**
	 * @param {Record<string, any>} event
	 * @param {Record<string, any>} item
	 */
	function timelineEventMatchesItem(event, item) {
		if (event.unlock?.subject && item.subject === event.unlock.subject) return true;
		if (event.unlock?.title && item.title === event.unlock.title) return true;
		if (event.unlock?.code && item.code === event.unlock.code) return true;
		return false;
	}

	/** @param {Record<string, any>} source */
	function sourceIsAvailable(source) {
		if (source.moduleId === "EvidenceBoard") {
			return evidenceItems.some((item) => item.evidenceId === source.match?.evidenceId);
		}

		return collectionFor(source.moduleId).some(
			/** @param {Record<string, any>} item */
			(item) => sourceMatchesItem(source, item) && item.read && !item.locked
		);
	}

	/**
	 * @param {Record<string, any>} source
	 * @param {Record<string, any>} item
	 */
	function sourceMatchesItem(source, item) {
		if (source.match?.title && item.title === source.match.title) return true;
		if (source.match?.code && item.code === source.match.code) return true;
		if (source.match?.evidenceId && item.evidenceId === source.match.evidenceId) return true;
		return false;
	}

	/** @param {Record<string, boolean>} unlockedDeductions */
	function countRequiredDeductions(unlockedDeductions) {
		return requiredDeductionIds.filter((deductionId) => unlockedDeductions?.[deductionId]).length;
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
		return chapterEvidenceDefinitions.find((evidence) => evidence.unlockTag === tag) ?? null;
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
			evidenceTags: activeItem.evidenceTags,
			chapterId: $activeChapterId
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
		if (moduleId === "Emails") return item.subjectKey ? $t(item.subjectKey) : item.subject;
		if (moduleId === "Chats") return item.titleKey ? $t(item.titleKey) : (item.title ?? `#${item.channel}`);
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

		if (moduleId === "Documents" && item.title === "Initial Incident Brief") {
			tags.push("terminal-trace-credential");
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
			const mistakeResult = recordPuzzleMistake("encrypted-fragment-unlock", 3);
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
			if (mistakeResult.penalized) {
				recordIntegrityLossFeedback(mistakeResult.integrityLoss, "logs.messages.INT-PUZ", {
					titleKey: "notifications.caseIntegrityReduced.title",
					messageKey: "notifications.caseIntegrityReduced.message"
				});
			}
			return false;
		}

		const wasUnlocked = encryptedFragmentUnlocked;
		clearPuzzleMistakes("encrypted-fragment-unlock");
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
		setActiveChapter(CHAPTER_1_ID);
		selectedModule = "Documents";
		selectedItemId = null;
		recentItemId = null;
		recentEvidenceId = null;
		recentObjectiveId = null;
		accessItem = null;
		accessError = false;
		hiddenRelayRecovered = false;
		chapterSummaryOpen = false;
		chapterSummaryKey = "chapterSummary";
		localStorage.setItem(HELP_SEEN_KEY, "true");
	}

	/**
	 * @param {Record<string, any> | null | undefined} loss
	 * @param {string} logKey
	 * @param {{ titleKey?: string, messageKey?: string }} notification
	 */
	function recordIntegrityLossFeedback(loss, logKey = "logs.messages.INT-422", notification = {}) {
		if (!loss) return;

		pushNotification({
			type: "error",
			titleKey: notification.titleKey ?? "notifications.conclusionRejected.title",
			messageKey: notification.messageKey ?? "notifications.conclusionRejected.integrityMessage",
			params: { amount: loss.amount, integrity: loss.value }
		});
		addSessionLog({
			level: loss.failed ? "CRITICAL" : "WARN",
			source: "case-integrity",
			code: loss.failed ? "INT-000" : "INT-422",
			messageKey: loss.failed ? "logs.messages.INT-000" : logKey,
			params: { amount: loss.amount, integrity: loss.value }
		});
	}

	/** @param {string[]} order */
	function handleSetTimelineOrder(order) {
		return setTimelineOrder(normalizeTimelineOrderForUnlockedEvents(order), $activeChapterId);
	}

	/** @param {string[]} order */
	function handleValidateTimeline(order) {
		const unlockedEventIds = new Set(timelineEvents.filter((event) => event.unlocked).map((event) => event.id));
		const hasAllEvents = correctTimelineOrder.every((eventId) => unlockedEventIds.has(eventId));
		const cleanOrder = normalizeTimelineOrderForUnlockedEvents(order);

		setTimelineOrder(cleanOrder, $activeChapterId);

		if (!hasAllEvents || !isCorrectTimelineOrder(cleanOrder, $activeChapterId)) {
			const result = rejectTimeline("wrong-order", TIMELINE_PENALTY, $activeChapterId);
			recordIntegrityLossFeedback(result.integrityLoss, "logs.messages.TIME-422", {
				titleKey: "notifications.timelineRejected.title",
				messageKey: "notifications.timelineRejected.message"
			});
			return { ...result, order: cleanOrder };
		}

		const result = completeTimeline(activeTimelineDeductionId, $activeChapterId);
		if (!result.created) return { ...result, order: cleanOrder };

		setTransient("objective", activeChapterIsMirror ? "mirror-timeline" : "blackout-timeline");
		pushNotification({
			type: "objective",
			titleKey: "notifications.timelineConfirmed.title",
			messageKey: "notifications.timelineConfirmed.message"
		});
		pushNotification({
			type: "objective",
			titleKey: "notifications.objectiveCompleted.title",
			messageKey: "notifications.objectiveCompleted.message"
		});
		addSessionLog({
			level: "INFO",
			source: "timeline-engine",
			code: "TIME-200",
			messageKey: activeChapterIsMirror ? "logs.messages.TIME-MIRROR-200" : "logs.messages.TIME-200"
		});
		addSessionLog({
			level: "INFO",
			source: "deduction-engine",
			code: "DED-210",
			messageKey: "logs.messages.DED-210"
		});

		return { ...result, order: cleanOrder };
	}

	/** @param {string[]} order */
	function normalizeTimelineOrderForUnlockedEvents(order) {
		const rawOrder = Array.isArray(order) ? order : [];
		const unlockedEvents = sortTimelineEvents(timelineEvents.filter((event) => event.unlocked), timelinePreferredOrder);
		const unlockedEventIds = unlockedEvents.map((event) => event.id);
		const unlockedEventIdSet = new Set(unlockedEventIds);
		const cleanOrder = Array.from(new Set(rawOrder.map((eventId) => String(eventId).trim()).filter(Boolean))).filter((eventId) =>
			unlockedEventIdSet.has(eventId)
		);
		const missingIds = unlockedEventIds.filter((eventId) => !cleanOrder.includes(eventId));

		return [...cleanOrder, ...missingIds];
	}

	/**
	 * @param {string[]} sourceIds
	 * @param {string} explanationId
	 */
	function handleSubmitContradiction(sourceIds, explanationId) {
		const availableSourceIds = new Set(contradictionSources.map((source) => source.id));

		if (sourceIds.length !== 2 || sourceIds.some((sourceId) => !availableSourceIds.has(sourceId))) {
			const result = rejectContradiction("unavailable-sources", CASE_INTEGRITY_PENALTIES.contradiction, $activeChapterId);
			recordIntegrityLossFeedback(result.integrityLoss, "logs.messages.CONTRA-422", {
				titleKey: "notifications.contradictionRejected.title",
				messageKey: "notifications.contradictionRejected.message"
			});
			return result;
		}

		const validation = validateContradictionAttempt(sourceIds, explanationId, $activeChapterId);

		if (!validation.accepted || !validation.contradiction) {
			const result = rejectContradiction(
				validation.reason,
				validation.contradiction?.penalty ?? CASE_INTEGRITY_PENALTIES.contradiction,
				$activeChapterId
			);
			recordIntegrityLossFeedback(result.integrityLoss, "logs.messages.CONTRA-422", {
				titleKey: "notifications.contradictionRejected.title",
				messageKey: "notifications.contradictionRejected.message"
			});
			return result;
		}

		const result = confirmContradiction(validation.contradiction.id, validation.contradiction.deductionId, $activeChapterId);
		if (!result.created) return result;

		const nextContradictionCount = confirmedContradictionCount + 1;
		pushNotification({
			type: "objective",
			titleKey: "notifications.contradictionConfirmed.title",
			messageKey: "notifications.contradictionConfirmed.message",
			params: { contradiction: $t(validation.contradiction.titleKey) }
		});
		addSessionLog({
			level: "INFO",
			source: "contradiction-engine",
			code: "CONTRA-200",
			messageKey: "logs.messages.CONTRA-200",
			params: { contradiction: $t(validation.contradiction.titleKey) }
		});
		addSessionLog({
			level: "INFO",
			source: "deduction-engine",
			code: "DED-210",
			messageKey: "logs.messages.DED-210"
		});

		setTransient("objective", activeChapterIsMirror ? "mirror-contradictions" : "detect-case-contradictions");

		if (nextContradictionCount >= requiredContradictionIds.length) {
			pushNotification({
				type: "objective",
				titleKey: "notifications.objectiveCompleted.title",
				messageKey: "notifications.objectiveCompleted.message"
			});
		}

		return result;
	}

	/**
	 * @param {string} suspectId
	 * @param {string} reasonId
	 */
	function handleSubmitSuspectAccusation(suspectId, reasonId) {
		const suspect = suspects.find((item) => item.id === suspectId);
		const knownFactIds = suspect?.knownFacts?.map((fact) => fact.id) ?? [];
		const validation = validateSuspectAccusation(suspectId, reasonId, knownFactIds, $activeChapterId);

		if (!validation.accepted) {
			const result = rejectSuspectAccusation(
				suspectId,
				reasonId,
				validation.reason,
				SUSPECT_ACCUSATION_PENALTY,
				suspectAccusationDecisionId,
				$activeChapterId
			);

			if (result.blocked) {
				pushNotification({
					type: "warning",
					titleKey: "notifications.decisionLocked.title",
					messageKey: "notifications.decisionLocked.message"
				});
				return { ...result, hintKey: "suspects.feedback.exhausted" };
			}

			recordIntegrityLossFeedback(result.integrityLoss, "logs.messages.SUS-422", {
				titleKey: "notifications.suspectRejected.title",
				messageKey: "notifications.suspectRejected.message"
			});

			return { ...result, hintKey: validation.hintKey };
		}

		const result = acceptSuspectAccusation(
			suspectId,
			reasonId,
			suspectAccusationDeductionId,
			suspectAccusationDecisionId,
			$activeChapterId
		);

		if (result.blocked) {
			pushNotification({
				type: "warning",
				titleKey: "notifications.decisionLocked.title",
				messageKey: "notifications.decisionLocked.message"
			});
			return { ...result, hintKey: "suspects.feedback.exhausted" };
		}

		if (!result.created) return { ...result, hintKey: validation.hintKey };

		setTransient("objective", activeChapterIsMirror ? "mirror-identify-suspect" : "identify-internal-involvement");
		pushNotification({
			type: "objective",
			titleKey: "notifications.suspectAccepted.title",
			messageKey: "notifications.suspectAccepted.message"
		});
		pushNotification({
			type: "objective",
			titleKey: "notifications.objectiveCompleted.title",
			messageKey: "notifications.objectiveCompleted.message"
		});
		addSessionLog({
			level: "INFO",
			source: "suspect-board",
			code: "SUS-200",
			messageKey: activeChapterIsMirror ? "logs.messages.SUS-MIRROR-200" : "logs.messages.SUS-200"
		});
		addSessionLog({
			level: "INFO",
			source: "deduction-engine",
			code: "DED-210",
			messageKey: "logs.messages.DED-210"
		});

		return { ...result, hintKey: validation.hintKey };
	}

	/** @param {Record<string, string>} answers */
	function handleSubmitFinalReport(answers) {
		if (!finalReportUnlocked) {
			pushNotification({
				type: "warning",
				titleKey: "notifications.finalReportLocked.title",
				messageKey: activeChapterIsMirror ? "notifications.finalReportLocked.mirrorMessage" : "notifications.finalReportLocked.message"
			});

			return { accepted: false, blocked: true, reason: "final-report-locked" };
		}

		if (finalReportAttemptsExhausted() && !activeChapterResolved) {
			pushNotification({
				type: "warning",
				titleKey: "notifications.decisionLocked.title",
				messageKey: "notifications.decisionLocked.message"
			});
			return { accepted: false, blocked: true, reason: "attempts-exhausted" };
		}

		if (finalReportIsCorrect(answers, $activeChapterId)) {
			const result = recordDecisionSuccess(finalReportDecisionId, $activeChapterId);

			if (result.created) {
				const milestoneId = activeChapterIsMirror ? "chapter-2-completed" : "chapter-1-completed";
				markMilestone(milestoneId, $activeChapterId);
				chapterSummaryKey = activeChapterIsMirror ? "chapterSummaryMirror" : "chapterSummary";
				chapterSummaryOpen = true;
				setTransient("objective", activeChapterIsMirror ? "mirror-final-report" : "present-final-report");
				pushNotification({
					type: "objective",
					titleKey: activeChapterIsMirror ? "notifications.chapter2Resolved.title" : "notifications.chapterResolved.title",
					messageKey: activeChapterIsMirror ? "notifications.chapter2Resolved.message" : "notifications.chapterResolved.message"
				});
				pushNotification({
					type: "objective",
					titleKey: "notifications.objectiveCompleted.title",
					messageKey: "notifications.objectiveCompleted.message"
				});
				addSessionLog({
					level: "INFO",
					source: "case-review",
					code: activeChapterIsMirror ? "CH2-200" : "CH-200",
					messageKey: activeChapterIsMirror ? "logs.messages.CH2-200" : "logs.messages.CH-200"
				});
			}

			return result;
		}

		const result = recordDecisionFailure(finalReportDecision.id, finalReportDecision.penalty, $activeChapterId);

		if (result.blocked) {
			pushNotification({
				type: "warning",
				titleKey: "notifications.decisionLocked.title",
				messageKey: "notifications.decisionLocked.message"
			});
			return result;
		}

		recordIntegrityLossFeedback(result.integrityLoss, "logs.messages.INT-FIN", {
			titleKey: "notifications.finalReportRejected.title",
			messageKey: "notifications.finalReportRejected.integrityMessage"
		});

		return result;
	}

	function finalReportAttemptsExhausted() {
		return (activeInvestigation.decisionAttempts?.[finalReportDecisionId] ?? 0) >= CASE_DECISION_MAX_ATTEMPTS;
	}

	/**
	 * @param {string} firstEvidenceId
	 * @param {string} secondEvidenceId
	 * @param {string} justificationId
	 */
	function handleCreateConnection(firstEvidenceId, secondEvidenceId, justificationId) {
		const result = addConnection(firstEvidenceId, secondEvidenceId, justificationId, $activeChapterId);

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
			const integrityLoss = "integrityLoss" in result ? result.integrityLoss : null;

			if (integrityLoss) {
				recordIntegrityLossFeedback(
					integrityLoss,
					speculationDiscarded ? "logs.messages.CON-429" : "logs.messages.INT-422"
				);
			} else {
				pushNotification({
					type: "error",
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
			}

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

		if (
			verifiedConnectionCount + 1 >= requiredConnectionIds.length &&
			markMilestone(activeChapterIsMirror ? "mirror-connect-evidence" : "connect-related-evidence", $activeChapterId)
		) {
			setTransient("objective", activeChapterIsMirror ? "mirror-connect-evidence" : "connect-related-evidence");
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
			clearPuzzleMistakes("maintenance-assembly");
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
			const mistakeResult = recordPuzzleMistake("maintenance-assembly", 2);
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
			if (mistakeResult.penalized) {
				recordIntegrityLossFeedback(mistakeResult.integrityLoss, "logs.messages.INT-PUZ", {
					titleKey: "notifications.caseIntegrityReduced.title",
					messageKey: "notifications.caseIntegrityReduced.message"
				});
			}
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

	/** @param {string} args */
	function handleTerminalTrace(args) {
		const normalizedArgs = args.trim().replace(/\s+/g, " ").toUpperCase();

		if (normalizedArgs !== "CREDENTIAL N-KADE-17") {
			return {
				key: "terminal.hidden.traceUsage",
				tone: "warning"
			};
		}

		if (helixInvestigation.milestones?.["duplicate-credential-traced"]) {
			return {
				key: "terminal.hidden.traceRepeat",
				tone: "evidence"
			};
		}

		markEvidenceTagsDiscovered(["duplicate-credential", "terminal-trace-credential"]);
		markMilestone("duplicate-credential-traced");
		setTransient("objective", "duplicate-credential");
		setTransient("evidence", "EvidenceBoard:duplicate-credential");
		pushNotification({
			type: "objective",
			titleKey: "notifications.credentialTraceComplete.title",
			messageKey: "notifications.credentialTraceComplete.message"
		});
		addSessionLog({
			level: "INFO",
			source: "credential-trace",
			code: "TRACE-200",
			messageKey: "logs.messages.TRACE-200"
		});

		return {
			key: "terminal.hidden.traceAccepted",
			tone: "evidence"
		};
	}

	/** @param {string} args */
	function handleTerminalDecrypt(args) {
		const parts = args.trim().split(/\s+/);
		const [targetType, targetId, ...passwordParts] = parts;
		const password = passwordParts.join(" ");

		if ((targetType ?? "").toLowerCase() !== "fragment" || targetId !== "01" || !password) {
			return {
				key: "terminal.hidden.decryptUsage",
				tone: "warning"
			};
		}

		if (encryptedFragmentUnlocked) {
			return {
				key: "terminal.hidden.decryptAlreadyUnlocked",
				tone: "evidence"
			};
		}

		if (!attemptUnlock(password)) {
			return {
				key: "terminal.hidden.decryptRejected",
				tone: "warning"
			};
		}

		markEvidenceTagsDiscovered(["terminal-decrypt-fragment"]);

		return {
			key: "terminal.hidden.decryptAccepted",
			tone: "evidence"
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
					titleKey: chat.threadTitleKey,
					messages: [],
					sentAt: chat.sentAt,
					isEncrypted: false,
					evidenceTags: []
				});
			}

			const thread = threads.get(chat.channel);
			thread.messages.push(chat);
			thread.sentAt = chat.sentAt;
			thread.isEncrypted = thread.isEncrypted || chat.isEncrypted;
			thread.titleKey = thread.titleKey ?? chat.threadTitleKey;
			thread.evidenceTags = Array.from(new Set([...(thread.evidenceTags ?? []), ...(chat.evidenceTags ?? [])]));
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
		<TopBar
			title={$t("brand.name")}
			status={caseFile.status}
			caseTitle={caseFile.title}
			{caseIntegrity}
			onOpenHelp={openHelp}
		/>

		<main class="grid gap-px bg-cyan-300/10 p-px lg:h-[calc(100dvh-3rem)] lg:grid-rows-[auto_minmax(0,1fr)_180px]">
			<ChapterSwitcher {chapters} activeChapterId={$activeChapterId} onSelectChapter={selectChapter} />
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
					connections={activeConnections}
					notes={activeNotes}
					unlockedDeductions={activeUnlockedDeductions}
					{deductionDefinitions}
					{timelineEvents}
					{totalTimelineEvents}
					{timelinePreferredOrder}
					timelineState={activeTimelineState}
					{contradictionSources}
					contradictions={contradictionDefinitions}
					{requiredContradictionIds}
					contradictionForSelectedSources={activeContradictionForSources}
					contradictionSourceForId={activeContradictionSourceForId}
					confirmedContradictions={activeConfirmedContradictions}
					{suspects}
					suspectAccusation={activeSuspectAccusation}
					decisionAttempts={activeDecisionAttempts}
					completedDecisions={activeCompletedDecisions}
					{finalReportDecisionId}
					{finalReportQuestions}
					{finalReportCopyKeyPrefix}
					activeChapterId={$activeChapterId}
					{caseStats}
					mechanicsEnabled={activeChapterIsHelix || activeChapterIsMirror}
					{finalReportUnlocked}
					chapter1Resolved={activeChapterResolved}
					recoveryState={$recovery}
					terminalEvidences={evidenceItems}
					{terminalTimelineEvents}
					{terminalContradictions}
					{terminalSuspects}
					{terminalSearchItems}
					terminalHiddenCommands={terminalHiddenCommands}
					onSelectEvidence={selectEvidence}
					onCreateConnection={handleCreateConnection}
					onSetTimelineOrder={handleSetTimelineOrder}
					onValidateTimeline={handleValidateTimeline}
					onSubmitContradiction={handleSubmitContradiction}
					onSubmitAccusation={handleSubmitSuspectAccusation}
					onRecoveryScan={handleRecoveryScan}
					onRecoveryRepair={handleRecoveryRepair}
					onRecoveryDeepRecovery={handleRecoveryDeepRecovery}
					onRecoverySetAssemblyOrder={handleRecoverySetAssemblyOrder}
					onRecoveryAssemble={handleRecoveryAssemble}
					onTerminalUnlock={activeChapterIsHelix ? attemptUnlock : () => false}
					onTerminalScan={activeChapterIsHelix ? handleTerminalScan : () => false}
					onTerminalRecover={activeChapterIsHelix ? handleRecoveryScan : () => ({})}
					onTerminalRepair={activeChapterIsHelix ? handleRecoveryRepair : () => ({})}
					onTerminalTrace={activeChapterIsHelix ? handleTerminalTrace : () => ({})}
					onTerminalDecrypt={activeChapterIsHelix ? handleTerminalDecrypt : () => ({})}
					recoveryFragments={recoveredFragments}
					onTerminalCommand={handleTerminalCommand}
					onSubmitFinalReport={handleSubmitFinalReport}
				/>
				<ObjectivesPanel {caseFile} {objectives} {recentObjectiveId} {caseIntegrity} />
			</section>

			<SystemLogs logs={systemLogItems} dynamicLogs={$sessionLogs} />
		</main>
		<ChapterSummaryModal
			open={chapterSummaryOpen}
			summaryKey={chapterSummaryKey}
			caseIntegrityPercent={caseIntegrity.value}
			onClose={closeChapterSummary}
		/>
		<AccessModal item={accessItem} error={accessError} onSubmit={attemptUnlock} onCancel={closeAccessGate} />
		<HelpModal open={helpOpen} onClose={closeHelp} onReset={resetInvestigationState} />
		<CaseFailureModal open={caseFailureModalOpen} onRestart={resetInvestigationState} onHelp={openHelp} />
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
