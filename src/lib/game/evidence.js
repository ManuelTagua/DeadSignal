import { CHAPTER_1_ID, CHAPTER_2_ID, CHAPTER_3_ID } from "$lib/game/chapters";
import { PASSWORD_FRAGMENT_ID } from "$lib/game/files";
import { hasReadEvidenceTag, isFileUnlocked } from "$lib/stores/ProgressStore";

export const EVIDENCE_DEFINITIONS = [
	{
		id: "server-room-knock-pattern",
		titleKey: "evidence.items.serverRoomKnockPattern.title",
		descriptionKey: "evidence.items.serverRoomKnockPattern.description",
		longDescriptionKey: "evidence.items.serverRoomKnockPattern.longDescription",
		sourceKey: "evidence.items.serverRoomKnockPattern.source",
		forensicNotesKey: "evidence.items.serverRoomKnockPattern.forensicNotes",
		relatedFileKeys: [
			"evidence.items.serverRoomKnockPattern.relatedFiles.stickyNote",
			"evidence.items.serverRoomKnockPattern.relatedFiles.sublevelCamera"
		],
		statusKey: "evidence.status.unverified",
		unlockTag: "server-room-knock-pattern",
		tagKeys: ["evidence.tags.serverRoom", "evidence.tags.pattern", "evidence.tags.audio"]
	},
	{
		id: "east-archive-breach",
		titleKey: "evidence.items.eastArchiveBreach.title",
		descriptionKey: "evidence.items.eastArchiveBreach.description",
		longDescriptionKey: "evidence.items.eastArchiveBreach.longDescription",
		sourceKey: "evidence.items.eastArchiveBreach.source",
		forensicNotesKey: "evidence.items.eastArchiveBreach.forensicNotes",
		relatedFileKeys: [
			"evidence.items.eastArchiveBreach.relatedFiles.securityNote",
			"evidence.items.eastArchiveBreach.relatedFiles.doorLog",
			"evidence.items.eastArchiveBreach.relatedFiles.archiveStill"
		],
		statusKey: "evidence.status.corroborated",
		unlockTag: "east-archive-breach",
		tagKeys: ["evidence.tags.eastArchive", "evidence.tags.biometrics", "evidence.tags.access"]
	},
	{
		id: "duplicate-credential",
		titleKey: "evidence.items.duplicateCredential.title",
		descriptionKey: "evidence.items.duplicateCredential.description",
		longDescriptionKey: "evidence.items.duplicateCredential.longDescription",
		sourceKey: "evidence.items.duplicateCredential.source",
		forensicNotesKey: "evidence.items.duplicateCredential.forensicNotes",
		relatedFileKeys: [
			"evidence.items.duplicateCredential.relatedFiles.authLog",
			"evidence.items.duplicateCredential.relatedFiles.kadeEmail",
			"evidence.items.duplicateCredential.relatedFiles.roster"
		],
		statusKey: "evidence.status.found",
		unlockTag: "duplicate-credential",
		tagKeys: ["evidence.tags.credential", "evidence.tags.auth", "evidence.tags.nKade17"]
	},
	{
		id: "login-anomaly-n-kade-17",
		titleKey: "evidence.items.loginAnomalyNKade17.title",
		descriptionKey: "evidence.items.loginAnomalyNKade17.description",
		longDescriptionKey: "evidence.items.loginAnomalyNKade17.longDescription",
		sourceKey: "evidence.items.loginAnomalyNKade17.source",
		forensicNotesKey: "evidence.items.loginAnomalyNKade17.forensicNotes",
		relatedFileKeys: [
			"evidence.items.loginAnomalyNKade17.relatedFiles.authLog",
			"evidence.items.loginAnomalyNKade17.relatedFiles.credential"
		],
		statusKey: "evidence.status.found",
		unlockTag: "duplicate-credential",
		tagKeys: ["evidence.tags.auth", "evidence.tags.nKade17", "evidence.tags.terminal"]
	},
	{
		id: "encrypted-fragment-01",
		titleKey: "evidence.items.encryptedFragment01.title",
		descriptionKey: "evidence.items.encryptedFragment01.description",
		longDescriptionKey: "evidence.items.encryptedFragment01.longDescription",
		sourceKey: "evidence.items.encryptedFragment01.source",
		forensicNotesKey: "evidence.items.encryptedFragment01.forensicNotes",
		relatedFileKeys: [
			"evidence.items.encryptedFragment01.relatedFiles.fragment",
			"evidence.items.encryptedFragment01.relatedFiles.stickyNote"
		],
		statusKey: "evidence.status.found",
		unlockFileId: PASSWORD_FRAGMENT_ID,
		tagKeys: ["evidence.tags.encrypted", "evidence.tags.fragment", "evidence.tags.blackout"]
	},
	{
		id: "east-archive-access-map",
		titleKey: "evidence.items.eastArchiveAccessMap.title",
		descriptionKey: "evidence.items.eastArchiveAccessMap.description",
		longDescriptionKey: "evidence.items.eastArchiveAccessMap.longDescription",
		sourceKey: "evidence.items.eastArchiveAccessMap.source",
		forensicNotesKey: "evidence.items.eastArchiveAccessMap.forensicNotes",
		relatedFileKeys: [
			"evidence.items.eastArchiveAccessMap.relatedFiles.map",
			"evidence.items.eastArchiveAccessMap.relatedFiles.breach"
		],
		statusKey: "evidence.status.corroborated",
		unlockTag: "access-map",
		tagKeys: ["evidence.tags.eastArchive", "evidence.tags.map", "evidence.tags.access"]
	},
	{
		id: "relay-failure-report",
		titleKey: "evidence.items.relayFailureReport.title",
		descriptionKey: "evidence.items.relayFailureReport.description",
		longDescriptionKey: "evidence.items.relayFailureReport.longDescription",
		sourceKey: "evidence.items.relayFailureReport.source",
		forensicNotesKey: "evidence.items.relayFailureReport.forensicNotes",
		relatedFileKeys: [
			"evidence.items.relayFailureReport.relatedFiles.report",
			"evidence.items.relayFailureReport.relatedFiles.netLog"
		],
		statusKey: "evidence.status.unverified",
		unlockTag: "relay-failure",
		tagKeys: ["evidence.tags.relay", "evidence.tags.blackout", "evidence.tags.internal"]
	},
	{
		id: "recovered-fragment-set",
		titleKey: "evidence.items.recoveredFragmentSet.title",
		descriptionKey: "evidence.items.recoveredFragmentSet.description",
		longDescriptionKey: "evidence.items.recoveredFragmentSet.longDescription",
		sourceKey: "evidence.items.recoveredFragmentSet.source",
		forensicNotesKey: "evidence.items.recoveredFragmentSet.forensicNotes",
		relatedFileKeys: [
			"evidence.items.recoveredFragmentSet.relatedFiles.file12",
			"evidence.items.recoveredFragmentSet.relatedFiles.file18",
			"evidence.items.recoveredFragmentSet.relatedFiles.file21"
		],
		statusKey: "evidence.status.partial",
		unlockTag: "recovered-fragment",
		tagKeys: ["evidence.tags.recoveredFragment", "evidence.tags.partial", "evidence.tags.recovery"]
	},
	{
		id: "power-relay-maintenance-report",
		titleKey: "evidence.items.powerRelayMaintenanceReport.title",
		descriptionKey: "evidence.items.powerRelayMaintenanceReport.description",
		longDescriptionKey: "evidence.items.powerRelayMaintenanceReport.longDescription",
		sourceKey: "evidence.items.powerRelayMaintenanceReport.source",
		forensicNotesKey: "evidence.items.powerRelayMaintenanceReport.forensicNotes",
		relatedFileKeys: [
			"evidence.items.powerRelayMaintenanceReport.relatedFiles.report",
			"evidence.items.powerRelayMaintenanceReport.relatedFiles.fragments"
		],
		statusKey: "evidence.status.corroborated",
		unlockTag: "power-relay-maintenance-report",
		tagKeys: ["evidence.tags.relay", "evidence.tags.maintenance", "evidence.tags.blackout"]
	},
	{
		id: "mirror-manifest-core",
		chapterId: CHAPTER_2_ID,
		titleKey: "evidence.items.mirrorManifestCore.title",
		descriptionKey: "evidence.items.mirrorManifestCore.description",
		longDescriptionKey: "evidence.items.mirrorManifestCore.longDescription",
		sourceKey: "evidence.items.mirrorManifestCore.source",
		forensicNotesKey: "evidence.items.mirrorManifestCore.forensicNotes",
		relatedFileKeys: [
			"evidence.items.mirrorManifestCore.relatedFiles.charter",
			"evidence.items.mirrorManifestCore.relatedFiles.renThread"
		],
		statusKey: "evidence.status.found",
		unlockTag: "mirror-manifest-core",
		tagKeys: ["evidence.tags.mirror", "evidence.tags.manifest", "evidence.tags.profile"]
	},
	{
		id: "mirror-admin-token",
		chapterId: CHAPTER_2_ID,
		titleKey: "evidence.items.mirrorAdminToken.title",
		descriptionKey: "evidence.items.mirrorAdminToken.description",
		longDescriptionKey: "evidence.items.mirrorAdminToken.longDescription",
		sourceKey: "evidence.items.mirrorAdminToken.source",
		forensicNotesKey: "evidence.items.mirrorAdminToken.forensicNotes",
		relatedFileKeys: [
			"evidence.items.mirrorAdminToken.relatedFiles.purge",
			"evidence.items.mirrorAdminToken.relatedFiles.containment"
		],
		statusKey: "evidence.status.corroborated",
		unlockTag: "mirror-admin-token",
		tagKeys: ["evidence.tags.mirror", "evidence.tags.admin", "evidence.tags.purge"]
	},
	{
		id: "mirror-behavioral-subject-map",
		chapterId: CHAPTER_2_ID,
		titleKey: "evidence.items.mirrorBehavioralSubjectMap.title",
		descriptionKey: "evidence.items.mirrorBehavioralSubjectMap.description",
		longDescriptionKey: "evidence.items.mirrorBehavioralSubjectMap.longDescription",
		sourceKey: "evidence.items.mirrorBehavioralSubjectMap.source",
		forensicNotesKey: "evidence.items.mirrorBehavioralSubjectMap.forensicNotes",
		relatedFileKeys: [
			"evidence.items.mirrorBehavioralSubjectMap.relatedFiles.subjectMap",
			"evidence.items.mirrorBehavioralSubjectMap.relatedFiles.mirror114"
		],
		statusKey: "evidence.status.found",
		unlockTag: "mirror-subject-map",
		tagKeys: ["evidence.tags.subjects", "evidence.tags.profile", "evidence.tags.map"]
	},
	{
		id: "reflection-lab-access-trace",
		chapterId: CHAPTER_2_ID,
		titleKey: "evidence.items.reflectionLabAccessTrace.title",
		descriptionKey: "evidence.items.reflectionLabAccessTrace.description",
		longDescriptionKey: "evidence.items.reflectionLabAccessTrace.longDescription",
		sourceKey: "evidence.items.reflectionLabAccessTrace.source",
		forensicNotesKey: "evidence.items.reflectionLabAccessTrace.forensicNotes",
		relatedFileKeys: [
			"evidence.items.reflectionLabAccessTrace.relatedFiles.access509",
			"evidence.items.reflectionLabAccessTrace.relatedFiles.r7Manifest"
		],
		statusKey: "evidence.status.corroborated",
		unlockTag: "reflection-lab-access-trace",
		tagKeys: ["evidence.tags.reflectionLab", "evidence.tags.r7", "evidence.tags.access"]
	},
	{
		id: "n-kade-17-clone-record",
		chapterId: CHAPTER_2_ID,
		titleKey: "evidence.items.nKade17CloneRecord.title",
		descriptionKey: "evidence.items.nKade17CloneRecord.description",
		longDescriptionKey: "evidence.items.nKade17CloneRecord.longDescription",
		sourceKey: "evidence.items.nKade17CloneRecord.source",
		forensicNotesKey: "evidence.items.nKade17CloneRecord.forensicNotes",
		relatedFileKeys: [
			"evidence.items.nKade17CloneRecord.relatedFiles.decoy017",
			"evidence.items.nKade17CloneRecord.relatedFiles.kadeStatement"
		],
		statusKey: "evidence.status.found",
		unlockTag: "n-kade-17-clone-record",
		tagKeys: ["evidence.tags.credential", "evidence.tags.decoy", "evidence.tags.nKade17"]
	},
	{
		id: "mirror-export-package",
		chapterId: CHAPTER_2_ID,
		titleKey: "evidence.items.mirrorExportPackage.title",
		descriptionKey: "evidence.items.mirrorExportPackage.description",
		longDescriptionKey: "evidence.items.mirrorExportPackage.longDescription",
		sourceKey: "evidence.items.mirrorExportPackage.source",
		forensicNotesKey: "evidence.items.mirrorExportPackage.forensicNotes",
		relatedFileKeys: [
			"evidence.items.mirrorExportPackage.relatedFiles.export332",
			"evidence.items.mirrorExportPackage.relatedFiles.r7Manifest"
		],
		statusKey: "evidence.status.corroborated",
		unlockTag: "mirror-export-package",
		tagKeys: ["evidence.tags.export", "evidence.tags.mirror", "evidence.tags.r7"]
	},
	{
		id: "r7-transfer-manifest",
		chapterId: CHAPTER_2_ID,
		titleKey: "evidence.items.r7TransferManifest.title",
		descriptionKey: "evidence.items.r7TransferManifest.description",
		longDescriptionKey: "evidence.items.r7TransferManifest.longDescription",
		sourceKey: "evidence.items.r7TransferManifest.source",
		forensicNotesKey: "evidence.items.r7TransferManifest.forensicNotes",
		relatedFileKeys: [
			"evidence.items.r7TransferManifest.relatedFiles.manifest",
			"evidence.items.r7TransferManifest.relatedFiles.export332"
		],
		statusKey: "evidence.status.corroborated",
		unlockTag: "r7-transfer-manifest",
		tagKeys: ["evidence.tags.manifest", "evidence.tags.reflectionLab", "evidence.tags.r7"]
	},
	{
		id: "mirror-purge-record",
		chapterId: CHAPTER_2_ID,
		titleKey: "evidence.items.mirrorPurgeRecord.title",
		descriptionKey: "evidence.items.mirrorPurgeRecord.description",
		longDescriptionKey: "evidence.items.mirrorPurgeRecord.longDescription",
		sourceKey: "evidence.items.mirrorPurgeRecord.source",
		forensicNotesKey: "evidence.items.mirrorPurgeRecord.forensicNotes",
		relatedFileKeys: [
			"evidence.items.mirrorPurgeRecord.relatedFiles.purge771",
			"evidence.items.mirrorPurgeRecord.relatedFiles.auditHold"
		],
		statusKey: "evidence.status.corroborated",
		unlockTag: "mirror-purge-record",
		tagKeys: ["evidence.tags.purge", "evidence.tags.audit", "evidence.tags.mirror"]
	},
	{
		id: "n-kade-offsite-statement",
		chapterId: CHAPTER_2_ID,
		titleKey: "evidence.items.nKadeOffsiteStatement.title",
		descriptionKey: "evidence.items.nKadeOffsiteStatement.description",
		longDescriptionKey: "evidence.items.nKadeOffsiteStatement.longDescription",
		sourceKey: "evidence.items.nKadeOffsiteStatement.source",
		forensicNotesKey: "evidence.items.nKadeOffsiteStatement.forensicNotes",
		relatedFileKeys: [
			"evidence.items.nKadeOffsiteStatement.relatedFiles.statement",
			"evidence.items.nKadeOffsiteStatement.relatedFiles.decoy017"
		],
		statusKey: "evidence.status.found",
		unlockTag: "n-kade-offsite-statement",
		tagKeys: ["evidence.tags.nKade17", "evidence.tags.decoy", "evidence.tags.statement"]
	},
	{
		id: "audit-retention-order",
		chapterId: CHAPTER_2_ID,
		titleKey: "evidence.items.auditRetentionOrder.title",
		descriptionKey: "evidence.items.auditRetentionOrder.description",
		longDescriptionKey: "evidence.items.auditRetentionOrder.longDescription",
		sourceKey: "evidence.items.auditRetentionOrder.source",
		forensicNotesKey: "evidence.items.auditRetentionOrder.forensicNotes",
		relatedFileKeys: [
			"evidence.items.auditRetentionOrder.relatedFiles.auditHold",
			"evidence.items.auditRetentionOrder.relatedFiles.hold208"
		],
		statusKey: "evidence.status.found",
		unlockTag: "audit-retention-order",
		tagKeys: ["evidence.tags.audit", "evidence.tags.retention", "evidence.tags.mirror"]
	},
	{
		id: "omega-7-directive",
		chapterId: CHAPTER_3_ID,
		titleKey: "evidence.items.omega7Directive.title",
		descriptionKey: "evidence.items.omega7Directive.description",
		longDescriptionKey: "evidence.items.omega7Directive.longDescription",
		sourceKey: "evidence.items.omega7Directive.source",
		forensicNotesKey: "evidence.items.omega7Directive.forensicNotes",
		relatedFileKeys: [
			"evidence.items.omega7Directive.relatedFiles.protocol",
			"evidence.items.omega7Directive.relatedFiles.board000"
		],
		statusKey: "evidence.status.corroborated",
		unlockTag: "omega-7-directive",
		tagKeys: ["evidence.tags.omega7", "evidence.tags.board", "evidence.tags.blackout"]
	},
	{
		id: "board-000-signature",
		chapterId: CHAPTER_3_ID,
		titleKey: "evidence.items.board000Signature.title",
		descriptionKey: "evidence.items.board000Signature.description",
		longDescriptionKey: "evidence.items.board000Signature.longDescription",
		sourceKey: "evidence.items.board000Signature.source",
		forensicNotesKey: "evidence.items.board000Signature.forensicNotes",
		relatedFileKeys: [
			"evidence.items.board000Signature.relatedFiles.boardMinutes",
			"evidence.items.board000Signature.relatedFiles.board000"
		],
		statusKey: "evidence.status.corroborated",
		unlockTag: "board-000-signature",
		tagKeys: ["evidence.tags.board", "evidence.tags.signature", "evidence.tags.omega7"]
	},
	{
		id: "mirror-prime-core",
		chapterId: CHAPTER_3_ID,
		titleKey: "evidence.items.mirrorPrimeCore.title",
		descriptionKey: "evidence.items.mirrorPrimeCore.description",
		longDescriptionKey: "evidence.items.mirrorPrimeCore.longDescription",
		sourceKey: "evidence.items.mirrorPrimeCore.source",
		forensicNotesKey: "evidence.items.mirrorPrimeCore.forensicNotes",
		relatedFileKeys: [
			"evidence.items.mirrorPrimeCore.relatedFiles.prime617",
			"evidence.items.mirrorPrimeCore.relatedFiles.merge909"
		],
		statusKey: "evidence.status.found",
		unlockTag: "mirror-prime-core",
		tagKeys: ["evidence.tags.mirror", "evidence.tags.prime", "evidence.tags.core"]
	},
	{
		id: "behavioral-replica-map",
		chapterId: CHAPTER_3_ID,
		titleKey: "evidence.items.behavioralReplicaMap.title",
		descriptionKey: "evidence.items.behavioralReplicaMap.description",
		longDescriptionKey: "evidence.items.behavioralReplicaMap.longDescription",
		sourceKey: "evidence.items.behavioralReplicaMap.source",
		forensicNotesKey: "evidence.items.behavioralReplicaMap.forensicNotes",
		relatedFileKeys: [
			"evidence.items.behavioralReplicaMap.relatedFiles.replicaReport",
			"evidence.items.behavioralReplicaMap.relatedFiles.arendtStatement"
		],
		statusKey: "evidence.status.found",
		unlockTag: "behavioral-replica-map",
		tagKeys: ["evidence.tags.replicas", "evidence.tags.profile", "evidence.tags.prediction"]
	},
	{
		id: "reflection-lab-blueprint",
		chapterId: CHAPTER_3_ID,
		titleKey: "evidence.items.reflectionLabBlueprint.title",
		descriptionKey: "evidence.items.reflectionLabBlueprint.description",
		longDescriptionKey: "evidence.items.reflectionLabBlueprint.longDescription",
		sourceKey: "evidence.items.reflectionLabBlueprint.source",
		forensicNotesKey: "evidence.items.reflectionLabBlueprint.forensicNotes",
		relatedFileKeys: [
			"evidence.items.reflectionLabBlueprint.relatedFiles.blueprint",
			"evidence.items.reflectionLabBlueprint.relatedFiles.r7Core404"
		],
		statusKey: "evidence.status.corroborated",
		unlockTag: "reflection-lab-blueprint",
		tagKeys: ["evidence.tags.reflectionLab", "evidence.tags.r7", "evidence.tags.core"]
	},
	{
		id: "merge-909-export-trace",
		chapterId: CHAPTER_3_ID,
		titleKey: "evidence.items.merge909ExportTrace.title",
		descriptionKey: "evidence.items.merge909ExportTrace.description",
		longDescriptionKey: "evidence.items.merge909ExportTrace.longDescription",
		sourceKey: "evidence.items.merge909ExportTrace.source",
		forensicNotesKey: "evidence.items.merge909ExportTrace.forensicNotes",
		relatedFileKeys: [
			"evidence.items.merge909ExportTrace.relatedFiles.merge909",
			"evidence.items.merge909ExportTrace.relatedFiles.primeCore"
		],
		statusKey: "evidence.status.corroborated",
		unlockTag: "merge-909-export-trace",
		tagKeys: ["evidence.tags.export", "evidence.tags.merge", "evidence.tags.r7"]
	},
	{
		id: "selene-arendt-statement",
		chapterId: CHAPTER_3_ID,
		titleKey: "evidence.items.seleneArendtStatement.title",
		descriptionKey: "evidence.items.seleneArendtStatement.description",
		longDescriptionKey: "evidence.items.seleneArendtStatement.longDescription",
		sourceKey: "evidence.items.seleneArendtStatement.source",
		forensicNotesKey: "evidence.items.seleneArendtStatement.forensicNotes",
		relatedFileKeys: [
			"evidence.items.seleneArendtStatement.relatedFiles.statement",
			"evidence.items.seleneArendtStatement.relatedFiles.predictionEmail"
		],
		statusKey: "evidence.status.found",
		unlockTag: "selene-arendt-statement",
		tagKeys: ["evidence.tags.arendt", "evidence.tags.replicas", "evidence.tags.warning"]
	},
	{
		id: "lock-777-record",
		chapterId: CHAPTER_3_ID,
		titleKey: "evidence.items.lock777Record.title",
		descriptionKey: "evidence.items.lock777Record.description",
		longDescriptionKey: "evidence.items.lock777Record.longDescription",
		sourceKey: "evidence.items.lock777Record.source",
		forensicNotesKey: "evidence.items.lock777Record.forensicNotes",
		relatedFileKeys: [
			"evidence.items.lock777Record.relatedFiles.lock777",
			"evidence.items.lock777Record.relatedFiles.securityR7"
		],
		statusKey: "evidence.status.found",
		unlockTag: "lock-777-record",
		tagKeys: ["evidence.tags.lock", "evidence.tags.mirror", "evidence.tags.core"]
	},
	{
		id: "replica-integrity-report",
		chapterId: CHAPTER_3_ID,
		titleKey: "evidence.items.replicaIntegrityReport.title",
		descriptionKey: "evidence.items.replicaIntegrityReport.description",
		longDescriptionKey: "evidence.items.replicaIntegrityReport.longDescription",
		sourceKey: "evidence.items.replicaIntegrityReport.source",
		forensicNotesKey: "evidence.items.replicaIntegrityReport.forensicNotes",
		relatedFileKeys: [
			"evidence.items.replicaIntegrityReport.relatedFiles.report",
			"evidence.items.replicaIntegrityReport.relatedFiles.prime617"
		],
		statusKey: "evidence.status.corroborated",
		unlockTag: "replica-integrity-report",
		tagKeys: ["evidence.tags.replicas", "evidence.tags.integrity", "evidence.tags.prediction"]
	},
	{
		id: "r7-core-activity-log",
		chapterId: CHAPTER_3_ID,
		titleKey: "evidence.items.r7CoreActivityLog.title",
		descriptionKey: "evidence.items.r7CoreActivityLog.description",
		longDescriptionKey: "evidence.items.r7CoreActivityLog.longDescription",
		sourceKey: "evidence.items.r7CoreActivityLog.source",
		forensicNotesKey: "evidence.items.r7CoreActivityLog.forensicNotes",
		relatedFileKeys: [
			"evidence.items.r7CoreActivityLog.relatedFiles.r7Core404",
			"evidence.items.r7CoreActivityLog.relatedFiles.blueprint"
		],
		statusKey: "evidence.status.corroborated",
		unlockTag: "r7-core-activity-log",
		tagKeys: ["evidence.tags.r7", "evidence.tags.core", "evidence.tags.compute"]
	},
	{
		id: "relay-omega-isolation-log",
		chapterId: CHAPTER_3_ID,
		titleKey: "evidence.items.relayOmegaIsolationLog.title",
		descriptionKey: "evidence.items.relayOmegaIsolationLog.description",
		longDescriptionKey: "evidence.items.relayOmegaIsolationLog.longDescription",
		sourceKey: "evidence.items.relayOmegaIsolationLog.source",
		forensicNotesKey: "evidence.items.relayOmegaIsolationLog.forensicNotes",
		relatedFileKeys: [
			"evidence.items.relayOmegaIsolationLog.relatedFiles.relayOmega",
			"evidence.items.relayOmegaIsolationLog.relatedFiles.omega7"
		],
		statusKey: "evidence.status.corroborated",
		unlockTag: "relay-omega-isolation-log",
		tagKeys: ["evidence.tags.relay", "evidence.tags.omega7", "evidence.tags.blackout"]
	},
	{
		id: "continuity-board-minutes",
		chapterId: CHAPTER_3_ID,
		titleKey: "evidence.items.continuityBoardMinutes.title",
		descriptionKey: "evidence.items.continuityBoardMinutes.description",
		longDescriptionKey: "evidence.items.continuityBoardMinutes.longDescription",
		sourceKey: "evidence.items.continuityBoardMinutes.source",
		forensicNotesKey: "evidence.items.continuityBoardMinutes.forensicNotes",
		relatedFileKeys: [
			"evidence.items.continuityBoardMinutes.relatedFiles.minutes",
			"evidence.items.continuityBoardMinutes.relatedFiles.board000"
		],
		statusKey: "evidence.status.corroborated",
		unlockTag: "continuity-board-minutes",
		tagKeys: ["evidence.tags.board", "evidence.tags.continuity", "evidence.tags.omega7"]
	},
	{
		id: "mvoss-01-admin-token",
		chapterId: CHAPTER_3_ID,
		titleKey: "evidence.items.mvoss01AdminToken.title",
		descriptionKey: "evidence.items.mvoss01AdminToken.description",
		longDescriptionKey: "evidence.items.mvoss01AdminToken.longDescription",
		sourceKey: "evidence.items.mvoss01AdminToken.source",
		forensicNotesKey: "evidence.items.mvoss01AdminToken.forensicNotes",
		relatedFileKeys: [
			"evidence.items.mvoss01AdminToken.relatedFiles.omega7",
			"evidence.items.mvoss01AdminToken.relatedFiles.helixBurn"
		],
		statusKey: "evidence.status.found",
		unlockTag: "mvoss-01-admin-token",
		tagKeys: ["evidence.tags.admin", "evidence.tags.mvoss01", "evidence.tags.purge"]
	},
	{
		id: "audit-consent-chain",
		chapterId: CHAPTER_3_ID,
		titleKey: "evidence.items.auditConsentChain.title",
		descriptionKey: "evidence.items.auditConsentChain.description",
		longDescriptionKey: "evidence.items.auditConsentChain.longDescription",
		sourceKey: "evidence.items.auditConsentChain.source",
		forensicNotesKey: "evidence.items.auditConsentChain.forensicNotes",
		relatedFileKeys: [
			"evidence.items.auditConsentChain.relatedFiles.audit310",
			"evidence.items.auditConsentChain.relatedFiles.consentEmail"
		],
		statusKey: "evidence.status.found",
		unlockTag: "audit-consent-chain",
		tagKeys: ["evidence.tags.audit", "evidence.tags.consent", "evidence.tags.replicas"]
	}
];

/**
 * @param {Record<string, any>} progressState
 * @param {string} chapterId
 */
export function unlockedEvidence(progressState, chapterId = CHAPTER_1_ID) {
	return evidenceDefinitionsForChapter(chapterId).filter((evidence) => isEvidenceUnlocked(progressState, evidence, chapterId)).map(
		(evidence) => ({
			...evidence,
			id: `EvidenceBoard:${evidence.id}`,
			evidenceId: evidence.id,
			category: "EvidenceBoard",
			read: true,
			important: true,
			evidenceTags: [evidence.unlockTag].filter(Boolean)
		})
	);
}

/** @param {string} chapterId */
export function evidenceDefinitionsForChapter(chapterId = CHAPTER_1_ID) {
	return EVIDENCE_DEFINITIONS.filter((evidence) => (evidence.chapterId ?? CHAPTER_1_ID) === chapterId);
}

/**
 * @param {Record<string, any>} progressState
 * @param {Record<string, any>} evidence
 * @param {string} chapterId
 */
function isEvidenceUnlocked(progressState, evidence, chapterId = CHAPTER_1_ID) {
	if (evidence.unlockFileId && isFileUnlocked(progressState, evidence.unlockFileId)) return true;
	if (evidence.unlockTag && hasReadEvidenceTag(progressState, evidence.unlockTag, chapterId)) return true;
	return false;
}
