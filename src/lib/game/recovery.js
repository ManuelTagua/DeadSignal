export const MAINTENANCE_REPORT_ID = "power-relay-maintenance-report";

export const RECOVERY_CORRUPTED_DOCUMENTS = [
	{
		virtualId: "relay-cache-damaged",
		titleKey: "recovery.documents.relayCache.title",
		title: "Relay Cache Index",
		category: "Recovered",
		classification: "Recovered",
		author: "DeadSignal Recovery Lab",
		contentKey: "recovery.documents.relayCache.content",
		damagedContentKey: "recovery.documents.relayCache.damagedContent",
		tags: "corrupted,damaged,partial,relay",
		createdAt: "2041-10-09T03:48:00.000Z",
		recoveredAt: "2041-10-09T03:51:22.000Z",
		recoveryOriginKey: "recovery.origins.uplinkCache",
		corruptionLevelKey: "recovery.corruptionLevels.severe",
		integrity: 31,
		isCorrupted: true,
		isFlagged: true,
		corruptionBadges: ["corrupted", "damaged", "partial"],
		evidenceTags: ["recovery-cache"]
	}
];

export const RECOVERY_FRAGMENTS = [
	{
		id: "file_12",
		fragmentId: "fragment-12",
		titleKey: "recovery.fragments.file12.title",
		contentKey: "recovery.fragments.file12.content",
		sequence: 1,
		method: "scan",
		integrity: 46,
		corruptionLevelKey: "recovery.corruptionLevels.high",
		recoveryOriginKey: "recovery.origins.relayShadow",
		recoveredAt: "2041-10-09T03:55:12.000Z",
		evidenceTags: ["recovered-fragment"]
	},
	{
		id: "file_18",
		fragmentId: "fragment-18",
		titleKey: "recovery.fragments.file18.title",
		contentKey: "recovery.fragments.file18.content",
		sequence: 2,
		method: "repair",
		requires: ["file_12"],
		integrity: 63,
		corruptionLevelKey: "recovery.corruptionLevels.moderate",
		recoveryOriginKey: "recovery.origins.maintenanceMirror",
		recoveredAt: "2041-10-09T03:57:40.000Z",
		evidenceTags: ["recovered-fragment"]
	},
	{
		id: "file_21",
		fragmentId: "fragment-21",
		titleKey: "recovery.fragments.file21.title",
		contentKey: "recovery.fragments.file21.content",
		sequence: 3,
		method: "deep-recovery",
		requires: ["file_12", "file_18"],
		integrity: 71,
		corruptionLevelKey: "recovery.corruptionLevels.partial",
		recoveryOriginKey: "recovery.origins.deepCache",
		recoveredAt: "2041-10-09T04:01:03.000Z",
		evidenceTags: ["recovered-fragment"]
	}
];

export const RECOVERY_RECONSTRUCTED_DOCUMENTS = [
	{
		virtualId: MAINTENANCE_REPORT_ID,
		titleKey: "recovery.documents.maintenanceReport.title",
		title: "Power Relay Maintenance Report",
		category: "Report",
		classification: "Restricted",
		author: "Helix Facilities / Power Relay Unit",
		contentKey: "recovery.documents.maintenanceReport.content",
		tags: "relay,maintenance,blackout,recovered",
		createdAt: "2041-10-08T21:40:00.000Z",
		recoveredAt: "2041-10-09T04:03:18.000Z",
		recoveryOriginKey: "recovery.origins.reconstructedFragments",
		corruptionLevelKey: "recovery.corruptionLevels.reconstructed",
		integrity: 94,
		isRecovered: true,
		isFlagged: true,
		evidenceTags: ["power-relay-maintenance-report", "blackout-maintenance"]
	}
];

export const MAINTENANCE_ASSEMBLY_ORDER = ["file_12", "file_18", "file_21"];

/** @param {string} fragmentId */
export function recoveryFragmentFor(fragmentId) {
	return RECOVERY_FRAGMENTS.find((fragment) => fragment.id === fragmentId) ?? null;
}

/** @param {string[]} order */
export function isCorrectMaintenanceOrder(order) {
	return order.join("|") === MAINTENANCE_ASSEMBLY_ORDER.join("|");
}

/** @param {Record<string, any>} recoveryState */
export function discoveredRecoveryFragments(recoveryState) {
	return RECOVERY_FRAGMENTS.filter((fragment) => recoveryState.fragments?.[fragment.id]);
}

/** @param {Record<string, any>} recoveryState */
export function hasAllMaintenanceFragments(recoveryState) {
	return MAINTENANCE_ASSEMBLY_ORDER.every((fragmentId) => recoveryState.fragments?.[fragmentId]);
}

/** @param {Record<string, any>} recoveryState */
export function isMaintenanceReportReconstructed(recoveryState) {
	return Boolean(recoveryState.reconstructedDocuments?.[MAINTENANCE_REPORT_ID]);
}

/** @param {Record<string, any>} recoveryState */
export function reconstructedRecoveryDocuments(recoveryState) {
	return RECOVERY_RECONSTRUCTED_DOCUMENTS.filter((document) => recoveryState.reconstructedDocuments?.[document.virtualId]);
}
