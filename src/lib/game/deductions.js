export const CORRECT_CONNECTIONS = [
	{
		id: "access-phrase-link",
		evidenceIds: ["server-room-knock-pattern", "encrypted-fragment-01"],
		deductionId: "access-phrase",
		reasonKey: "connections.reasons.accessPhrase",
		correctJustificationId: "shared-clue"
	},
	{
		id: "duplicate-login-link",
		evidenceIds: ["duplicate-credential", "login-anomaly-n-kade-17"],
		reasonKey: "connections.reasons.duplicateLogin",
		correctJustificationId: "shared-clue"
	},
	{
		id: "archive-route-link",
		evidenceIds: ["east-archive-breach", "east-archive-access-map"],
		deductionId: "internal-involvement",
		reasonKey: "connections.reasons.archiveRoute",
		correctJustificationId: "shared-clue"
	},
	{
		id: "maintenance-relay-link",
		evidenceIds: ["power-relay-maintenance-report", "relay-failure-report"],
		deductionId: "maintenance-reroute",
		reasonKey: "connections.reasons.maintenanceRelay",
		correctJustificationId: "shared-clue"
	}
];

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

export const REQUIRED_CHAPTER_CONNECTION_IDS = ["access-phrase-link", "maintenance-relay-link"];
export const REQUIRED_CHAPTER_DEDUCTION_IDS = ["access-phrase", "maintenance-reroute"];

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
		evidenceIds: ["east-archive-breach", "east-archive-access-map"]
	},
	{
		id: "maintenance-reroute",
		titleKey: "deductions.items.maintenanceReroute.title",
		descriptionKey: "deductions.items.maintenanceReroute.description",
		evidenceIds: ["power-relay-maintenance-report", "relay-failure-report"]
	}
];

/**
 * @param {string} firstEvidenceId
 * @param {string} secondEvidenceId
 */
export function connectionKey(firstEvidenceId, secondEvidenceId) {
	return [firstEvidenceId, secondEvidenceId].sort().join("__");
}

/**
 * @param {string} firstEvidenceId
 * @param {string} secondEvidenceId
 */
export function correctConnectionFor(firstEvidenceId, secondEvidenceId) {
	const key = connectionKey(firstEvidenceId, secondEvidenceId);
	return CORRECT_CONNECTIONS.find((connection) => connectionKey(connection.evidenceIds[0], connection.evidenceIds[1]) === key) ?? null;
}

/**
 * @param {string} firstEvidenceId
 * @param {string} secondEvidenceId
 */
export function isCorrectConnection(firstEvidenceId, secondEvidenceId) {
	return Boolean(correctConnectionFor(firstEvidenceId, secondEvidenceId));
}

/**
 * @param {string} firstEvidenceId
 * @param {string} secondEvidenceId
 * @param {string} justificationId
 */
export function validateConnectionAttempt(firstEvidenceId, secondEvidenceId, justificationId) {
	const rule = correctConnectionFor(firstEvidenceId, secondEvidenceId);

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
 */
export function countCorrectConnections(connections) {
	return connections.filter((connection) => isVerifiedConnection(connection))
		.length;
}

/**
 * @param {Array<{ connectionRuleId?: string, verified?: boolean }>} connections
 */
export function countRequiredChapterConnections(connections) {
	return connections.filter(
		(connection) => connection.verified && REQUIRED_CHAPTER_CONNECTION_IDS.includes(connection.connectionRuleId ?? "")
	).length;
}

/** @param {Record<string, any>} connection */
export function isVerifiedConnection(connection) {
	return Boolean(connection.verified && correctConnectionFor(connection.evidenceIds[0], connection.evidenceIds[1]));
}

/**
 * @param {Array<{ evidenceIds: string[], verified?: boolean, deductionId?: string }>} connections
 * @param {Record<string, boolean>} unlockedDeductions
 */
export function unlockableDeductions(connections, unlockedDeductions = {}) {
	return DEDUCTION_DEFINITIONS.filter((deduction) => {
		if (unlockedDeductions[deduction.id]) return false;

		return connections.some((connection) => connection.verified && connection.deductionId === deduction.id);
	});
}
