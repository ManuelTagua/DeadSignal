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
	}
];

/** @param {Record<string, any>} progressState */
export function unlockedEvidence(progressState) {
	return EVIDENCE_DEFINITIONS.filter((evidence) => isEvidenceUnlocked(progressState, evidence)).map(
		(evidence) => ({
			...evidence,
			id: `EvidenceBoard:${evidence.id}`,
			evidenceId: evidence.id,
			category: "EvidenceBoard",
			read: true,
			important: true,
			evidenceTags: [evidence.unlockTag]
		})
	);
}

/**
 * @param {Record<string, any>} progressState
 * @param {Record<string, any>} evidence
 */
function isEvidenceUnlocked(progressState, evidence) {
	if (evidence.unlockFileId && isFileUnlocked(progressState, evidence.unlockFileId)) return true;
	if (evidence.unlockTag && hasReadEvidenceTag(progressState, evidence.unlockTag)) return true;
	return false;
}
