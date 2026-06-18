import { HELIX_INCIDENT_SOLUTION } from "$lib/cases/helixIncidentSolution";
import { MIRROR_PROJECT_SOLUTION } from "$lib/cases/mirrorProjectSolution";
import { REFLECTION_CORE_SOLUTION } from "$lib/cases/reflectionCoreSolution";
import { CHAPTER_1_ID, CHAPTER_2_ID, CHAPTER_3_ID } from "$lib/game/chapters";

/** @type {Record<string, string>} */
const CONNECTION_REASON_KEYS = {
	"access-phrase-link": "connections.reasons.accessPhrase",
	"duplicate-login-link": "connections.reasons.duplicateLogin",
	"archive-route-link": "connections.reasons.archiveRoute",
	"maintenance-relay-link": "connections.reasons.maintenanceRelay",
	"mirror-profile-map-link": "connections.reasons.mirrorProfileMap",
	"audit-hold-purge-link": "connections.reasons.auditHoldPurge",
	"r7-export-link": "connections.reasons.r7Export",
	"mvoss-token-purge-link": "connections.reasons.mvossTokenPurge",
	"n-kade-decoy-link": "connections.reasons.nKadeDecoy",
	"replica-decision-link": "connections.reasons.replicaDecision",
	"r7-core-link": "connections.reasons.r7Core",
	"omega-relay-link": "connections.reasons.omegaRelay",
	"mirror-prime-merge-link": "connections.reasons.mirrorPrimeMerge",
	"board-signature-link": "connections.reasons.boardSignature",
	"mvoss-subordinate-link": "connections.reasons.mvossSubordinate"
};

export const CORRECT_CONNECTIONS = withConnectionReasonKeys(HELIX_INCIDENT_SOLUTION.connections);
export const MIRROR_CORRECT_CONNECTIONS = withConnectionReasonKeys(MIRROR_PROJECT_SOLUTION.connections);
export const REFLECTION_CORRECT_CONNECTIONS = withConnectionReasonKeys(REFLECTION_CORE_SOLUTION.connections);

export const CONNECTION_JUSTIFICATION_OPTIONS = [
	{
		id: "shared-clue",
		labelKey: "connections.justifications.sharedClue"
	},
	{
		id: "same-author",
		labelKey: "connections.justifications.sameAuthor"
	},
	{
		id: "same-file-type",
		labelKey: "connections.justifications.sameFileType"
	}
];

export const REQUIRED_CHAPTER_CONNECTION_IDS = HELIX_INCIDENT_SOLUTION.connections
	.filter((connection) => connection.requiredForChapter)
	.map((connection) => connection.id);
export const REQUIRED_CHAPTER_DEDUCTION_IDS = HELIX_INCIDENT_SOLUTION.requiredDeductions;

export const DEDUCTION_DEFINITIONS = [
	{
		id: "access-phrase",
		titleKey: "deductions.items.accessPhrase.title",
		descriptionKey: "deductions.items.accessPhrase.description",
		evidenceIds: ["server-room-knock-pattern", "encrypted-fragment-01"]
	},
	{
		id: "internal-involvement",
		titleKey: "deductions.items.internalInvolvement.title",
		descriptionKey: "deductions.items.internalInvolvement.description",
		evidenceIds: ["duplicate-credential", "login-anomaly-n-kade-17"]
	},
	{
		id: "archive-route-access",
		titleKey: "deductions.items.archiveRouteAccess.title",
		descriptionKey: "deductions.items.archiveRouteAccess.description",
		evidenceIds: ["east-archive-breach", "east-archive-access-map"]
	},
	{
		id: "maintenance-reroute",
		titleKey: "deductions.items.maintenanceReroute.title",
		descriptionKey: "deductions.items.maintenanceReroute.description",
		evidenceIds: ["power-relay-maintenance-report", "relay-failure-report"]
	},
	{
		id: "maintenance-window-overrun",
		titleKey: "deductions.items.maintenanceWindowOverrun.title",
		descriptionKey: "deductions.items.maintenanceWindowOverrun.description",
		evidenceIds: ["relay-failure-report"]
	},
	{
		id: "credential-operational-mismatch",
		titleKey: "deductions.items.credentialOperationalMismatch.title",
		descriptionKey: "deductions.items.credentialOperationalMismatch.description",
		evidenceIds: ["duplicate-credential", "login-anomaly-n-kade-17"]
	},
	{
		id: "blackout-timeline-reconstructed",
		titleKey: "deductions.items.blackoutTimelineReconstructed.title",
		descriptionKey: "deductions.items.blackoutTimelineReconstructed.description",
		evidenceIds: ["relay-failure-report", "login-anomaly-n-kade-17", "east-archive-breach"]
	}
];

export const MIRROR_DEDUCTION_DEFINITIONS = [
	{
		id: "mirror-built-employee-behavioral-profiles",
		titleKey: "deductions.items.mirrorBuiltEmployeeBehavioralProfiles.title",
		descriptionKey: "deductions.items.mirrorBuiltEmployeeBehavioralProfiles.description",
		evidenceIds: ["mirror-manifest-core", "mirror-behavioral-subject-map"]
	},
	{
		id: "audit-protected-evidence-destroyed",
		titleKey: "deductions.items.auditProtectedEvidenceDestroyed.title",
		descriptionKey: "deductions.items.auditProtectedEvidenceDestroyed.description",
		evidenceIds: ["audit-retention-order", "mirror-purge-record"]
	},
	{
		id: "mirror-moved-to-reflection-lab",
		titleKey: "deductions.items.mirrorMovedToReflectionLab.title",
		descriptionKey: "deductions.items.mirrorMovedToReflectionLab.description",
		evidenceIds: ["r7-transfer-manifest", "mirror-export-package"]
	},
	{
		id: "mara-voss-authorized-purge",
		titleKey: "deductions.items.maraVossAuthorizedPurge.title",
		descriptionKey: "deductions.items.maraVossAuthorizedPurge.description",
		evidenceIds: ["mirror-admin-token", "mirror-purge-record"]
	},
	{
		id: "n-kade-17-decoy-trail",
		titleKey: "deductions.items.nKade17DecoyTrail.title",
		descriptionKey: "deductions.items.nKade17DecoyTrail.description",
		evidenceIds: ["n-kade-17-clone-record", "n-kade-offsite-statement"]
	},
	{
		id: "mirror-used-live-profiles",
		titleKey: "deductions.items.mirrorUsedLiveProfiles.title",
		descriptionKey: "deductions.items.mirrorUsedLiveProfiles.description",
		evidenceIds: ["mirror-manifest-core"]
	},
	{
		id: "protected-evidence-was-destroyed",
		titleKey: "deductions.items.protectedEvidenceWasDestroyed.title",
		descriptionKey: "deductions.items.protectedEvidenceWasDestroyed.description",
		evidenceIds: ["audit-retention-order", "mirror-purge-record"]
	},
	{
		id: "n-kade-17-was-decoy",
		titleKey: "deductions.items.nKade17WasDecoy.title",
		descriptionKey: "deductions.items.nKade17WasDecoy.description",
		evidenceIds: ["n-kade-17-clone-record", "n-kade-offsite-statement"]
	},
	{
		id: "mirror-sequence-reconstructed",
		titleKey: "deductions.items.mirrorSequenceReconstructed.title",
		descriptionKey: "deductions.items.mirrorSequenceReconstructed.description",
		evidenceIds: ["audit-retention-order", "mirror-export-package", "mirror-purge-record"]
	},
	{
		id: "mirror-coverup-author",
		titleKey: "deductions.items.mirrorCoverupAuthor.title",
		descriptionKey: "deductions.items.mirrorCoverupAuthor.description",
		evidenceIds: ["mirror-admin-token", "audit-retention-order", "mirror-purge-record"]
	}
];

export const REFLECTION_DEDUCTION_DEFINITIONS = [
	{
		id: "mirror-built-human-decision-replicas",
		titleKey: "deductions.items.mirrorBuiltHumanDecisionReplicas.title",
		descriptionKey: "deductions.items.mirrorBuiltHumanDecisionReplicas.description",
		evidenceIds: ["replica-integrity-report", "behavioral-replica-map"]
	},
	{
		id: "reflection-lab-was-true-core",
		titleKey: "deductions.items.reflectionLabWasTrueCore.title",
		descriptionKey: "deductions.items.reflectionLabWasTrueCore.description",
		evidenceIds: ["reflection-lab-blueprint", "r7-core-activity-log"]
	},
	{
		id: "omega-7-caused-blackout",
		titleKey: "deductions.items.omega7CausedBlackout.title",
		descriptionKey: "deductions.items.omega7CausedBlackout.description",
		evidenceIds: ["omega-7-directive", "relay-omega-isolation-log"]
	},
	{
		id: "mirror-data-survived",
		titleKey: "deductions.items.mirrorDataSurvived.title",
		descriptionKey: "deductions.items.mirrorDataSurvived.description",
		evidenceIds: ["merge-909-export-trace", "mirror-prime-core"]
	},
	{
		id: "continuity-board-final-decision",
		titleKey: "deductions.items.continuityBoardFinalDecision.title",
		descriptionKey: "deductions.items.continuityBoardFinalDecision.description",
		evidenceIds: ["continuity-board-minutes", "board-000-signature"]
	},
	{
		id: "mara-voss-executed-board-coverup",
		titleKey: "deductions.items.maraVossExecutedBoardCoverup.title",
		descriptionKey: "deductions.items.maraVossExecutedBoardCoverup.description",
		evidenceIds: ["mvoss-01-admin-token", "omega-7-directive"]
	},
	{
		id: "mirror-survived-in-r7",
		titleKey: "deductions.items.mirrorSurvivedInR7.title",
		descriptionKey: "deductions.items.mirrorSurvivedInR7.description",
		evidenceIds: ["merge-909-export-trace", "mirror-prime-core"]
	},
	{
		id: "reflection-sequence-reconstructed",
		titleKey: "deductions.items.reflectionSequenceReconstructed.title",
		descriptionKey: "deductions.items.reflectionSequenceReconstructed.description",
		evidenceIds: ["omega-7-directive", "merge-909-export-trace", "lock-777-record"]
	},
	{
		id: "continuity-board-authorized-reflection-core",
		titleKey: "deductions.items.continuityBoardAuthorizedReflectionCore.title",
		descriptionKey: "deductions.items.continuityBoardAuthorizedReflectionCore.description",
		evidenceIds: ["board-000-signature", "omega-7-directive", "mirror-prime-core"]
	}
];

/**
 * @param {string} firstEvidenceId
 * @param {string} secondEvidenceId
 */
export function connectionKey(firstEvidenceId, secondEvidenceId) {
	return [firstEvidenceId, secondEvidenceId].sort().join("__");
}

/** @param {string} chapterId */
export function correctConnectionsForChapter(chapterId = CHAPTER_1_ID) {
	if (chapterId === CHAPTER_3_ID) return REFLECTION_CORRECT_CONNECTIONS;
	return chapterId === CHAPTER_2_ID ? MIRROR_CORRECT_CONNECTIONS : CORRECT_CONNECTIONS;
}

/** @param {string} chapterId */
export function deductionDefinitionsForChapter(chapterId = CHAPTER_1_ID) {
	if (chapterId === CHAPTER_3_ID) return REFLECTION_DEDUCTION_DEFINITIONS;
	return chapterId === CHAPTER_2_ID ? MIRROR_DEDUCTION_DEFINITIONS : DEDUCTION_DEFINITIONS;
}

/** @param {string} chapterId */
export function requiredConnectionIdsForChapter(chapterId = CHAPTER_1_ID) {
	return correctConnectionsForChapter(chapterId)
		.filter((connection) => connection.requiredForChapter)
		.map((connection) => connection.id);
}

/** @param {string} chapterId */
export function requiredDeductionIdsForChapter(chapterId = CHAPTER_1_ID) {
	if (chapterId === CHAPTER_3_ID) return REFLECTION_CORE_SOLUTION.requiredDeductions;
	return chapterId === CHAPTER_2_ID ? MIRROR_PROJECT_SOLUTION.requiredDeductions : HELIX_INCIDENT_SOLUTION.requiredDeductions;
}

/**
 * @param {string} firstEvidenceId
 * @param {string} secondEvidenceId
 * @param {string} chapterId
 */
export function correctConnectionFor(firstEvidenceId, secondEvidenceId, chapterId = CHAPTER_1_ID) {
	const key = connectionKey(firstEvidenceId, secondEvidenceId);
	return (
		correctConnectionsForChapter(chapterId).find((connection) => connectionKey(connection.evidenceIds[0], connection.evidenceIds[1]) === key) ??
		null
	);
}

/**
 * @param {string} firstEvidenceId
 * @param {string} secondEvidenceId
 * @param {string} chapterId
 */
export function isCorrectConnection(firstEvidenceId, secondEvidenceId, chapterId = CHAPTER_1_ID) {
	return Boolean(correctConnectionFor(firstEvidenceId, secondEvidenceId, chapterId));
}

/**
 * @param {string} firstEvidenceId
 * @param {string} secondEvidenceId
 * @param {string} justificationId
 * @param {string} chapterId
 */
export function validateConnectionAttempt(firstEvidenceId, secondEvidenceId, justificationId, chapterId = CHAPTER_1_ID) {
	const rule = correctConnectionFor(firstEvidenceId, secondEvidenceId, chapterId);

	if (!rule) {
		return { accepted: false, reason: "invalid-pair", rule: null };
	}

	if (rule.correctJustificationId !== justificationId) {
		return { accepted: false, reason: "wrong-justification", rule };
	}

	return { accepted: true, reason: "accepted", rule };
}

/**
 * @param {Array<{ evidenceIds: string[], verified?: boolean }>} connections
 * @param {string} chapterId
 */
export function countCorrectConnections(connections = [], chapterId = CHAPTER_1_ID) {
	return connections.filter((connection) => isVerifiedConnection(connection, chapterId)).length;
}

/**
 * @param {Array<{ connectionRuleId?: string, verified?: boolean }>} connections
 * @param {string} chapterId
 */
export function countRequiredChapterConnections(connections = [], chapterId = CHAPTER_1_ID) {
	const requiredIds = requiredConnectionIdsForChapter(chapterId);
	return connections.filter((connection) => connection.verified && requiredIds.includes(connection.connectionRuleId ?? "")).length;
}

/**
 * @param {Record<string, any>} connection
 * @param {string} chapterId
 */
export function isVerifiedConnection(connection, chapterId = CHAPTER_1_ID) {
	return Boolean(connection.verified && correctConnectionFor(connection.evidenceIds[0], connection.evidenceIds[1], chapterId));
}

/**
 * @param {Array<{ evidenceIds: string[], verified?: boolean, deductionId?: string }>} connections
 * @param {Record<string, boolean>} unlockedDeductions
 * @param {string} chapterId
 */
export function unlockableDeductions(connections = [], unlockedDeductions = {}, chapterId = CHAPTER_1_ID) {
	return deductionDefinitionsForChapter(chapterId).filter((deduction) => {
		if (unlockedDeductions[deduction.id]) return false;

		return connections.some((connection) => connection.verified && connection.deductionId === deduction.id);
	});
}

/**
 * @param {Array<Record<string, any>>} connections
 * @returns {Array<Record<string, any>>}
 */
function withConnectionReasonKeys(connections) {
	return connections.map((connection) => ({
		...connection,
		reasonKey: CONNECTION_REASON_KEYS[connection.id] ?? "connections.reasonUnknown"
	}));
}
