import { CASE_INTEGRITY_PENALTIES } from "$lib/stores/InvestigationStore";
import { HELIX_INCIDENT_SOLUTION } from "$lib/cases/helixIncidentSolution";
import { MIRROR_PROJECT_SOLUTION } from "$lib/cases/mirrorProjectSolution";
import { REFLECTION_CORE_SOLUTION } from "$lib/cases/reflectionCoreSolution";
import { CHAPTER_1_ID, CHAPTER_2_ID, CHAPTER_3_ID } from "$lib/game/chapters";

export const REQUIRED_CHAPTER_CONTRADICTION_IDS = HELIX_INCIDENT_SOLUTION.contradictions.map((contradiction) => contradiction.id);

export const CONTRADICTION_SOURCE_DEFINITIONS = [
	{
		id: "document:initial-incident-brief",
		type: "document",
		moduleId: "Documents",
		match: { title: "Initial Incident Brief" },
		titleKey: "contradictions.sources.initialIncidentBrief.title",
		shortLabelKey: "contradictions.sources.initialIncidentBrief.shortLabel",
		datumKey: "contradictions.sources.initialIncidentBrief.datum"
	},
	{
		id: "system:NET-900",
		type: "log",
		moduleId: "System",
		match: { code: "NET-900" },
		titleKey: "contradictions.sources.net900.title",
		shortLabelKey: "contradictions.sources.net900.shortLabel",
		datumKey: "contradictions.sources.net900.datum"
	},
	{
		id: "document:employee-roster-delta",
		type: "document",
		moduleId: "Documents",
		match: { title: "Employee Roster Delta" },
		titleKey: "contradictions.sources.employeeRosterDelta.title",
		shortLabelKey: "contradictions.sources.employeeRosterDelta.shortLabel",
		datumKey: "contradictions.sources.employeeRosterDelta.datum"
	},
	{
		id: "evidence:login-anomaly-n-kade-17",
		type: "evidence",
		moduleId: "EvidenceBoard",
		match: { evidenceId: "login-anomaly-n-kade-17" },
		titleKey: "contradictions.sources.loginAnomalyNKade17.title",
		shortLabelKey: "contradictions.sources.loginAnomalyNKade17.shortLabel",
		datumKey: "contradictions.sources.loginAnomalyNKade17.datum"
	}
];

export const MIRROR_CONTRADICTION_SOURCE_DEFINITIONS = [
	{
		id: "document:mirror-charter-fragment",
		type: "document",
		moduleId: "Documents",
		match: { title: "MIRROR Charter Fragment" },
		titleKey: "contradictions.sources.mirrorCharter.title",
		shortLabelKey: "contradictions.sources.mirrorCharter.shortLabel",
		datumKey: "contradictions.sources.mirrorCharter.datum"
	},
	{
		id: "system:MIRROR-114",
		type: "log",
		moduleId: "System",
		match: { code: "MIRROR-114" },
		titleKey: "contradictions.sources.mirror114.title",
		shortLabelKey: "contradictions.sources.mirror114.shortLabel",
		datumKey: "contradictions.sources.mirror114.datum"
	},
	{
		id: "document:mirror-audit-hold",
		type: "document",
		moduleId: "Documents",
		match: { title: "Audit Retention Notice" },
		titleKey: "contradictions.sources.mirrorAuditHold.title",
		shortLabelKey: "contradictions.sources.mirrorAuditHold.shortLabel",
		datumKey: "contradictions.sources.mirrorAuditHold.datum"
	},
	{
		id: "system:PURGE-771",
		type: "log",
		moduleId: "System",
		match: { code: "PURGE-771" },
		titleKey: "contradictions.sources.purge771.title",
		shortLabelKey: "contradictions.sources.purge771.shortLabel",
		datumKey: "contradictions.sources.purge771.datum"
	},
	{
		id: "document:noah-kade-offsite-statement",
		type: "document",
		moduleId: "Documents",
		match: { title: "Noah Kade Offsite Statement" },
		titleKey: "contradictions.sources.kadeOffsiteStatement.title",
		shortLabelKey: "contradictions.sources.kadeOffsiteStatement.shortLabel",
		datumKey: "contradictions.sources.kadeOffsiteStatement.datum"
	},
	{
		id: "system:DECOY-017",
		type: "log",
		moduleId: "System",
		match: { code: "DECOY-017" },
		titleKey: "contradictions.sources.decoy017.title",
		shortLabelKey: "contradictions.sources.decoy017.shortLabel",
		datumKey: "contradictions.sources.decoy017.datum"
	}
];

export const REFLECTION_CONTRADICTION_SOURCE_DEFINITIONS = [
	{
		id: "document:reflection-prime-statute",
		type: "document",
		moduleId: "Documents",
		match: { title: "MIRROR PRIME Final Charter" },
		titleKey: "contradictions.sources.reflectionPrimeStatute.title",
		shortLabelKey: "contradictions.sources.reflectionPrimeStatute.shortLabel",
		datumKey: "contradictions.sources.reflectionPrimeStatute.datum"
	},
	{
		id: "document:replica-integrity-report",
		type: "document",
		moduleId: "Documents",
		match: { title: "Behavioral Replica Integrity Report" },
		titleKey: "contradictions.sources.replicaIntegrityReport.title",
		shortLabelKey: "contradictions.sources.replicaIntegrityReport.shortLabel",
		datumKey: "contradictions.sources.replicaIntegrityReport.datum"
	},
	{
		id: "document:reflection-lab-blueprint",
		type: "document",
		moduleId: "Documents",
		match: { title: "Reflection Lab / Sublevel R-7 Blueprint" },
		titleKey: "contradictions.sources.reflectionLabBlueprint.title",
		shortLabelKey: "contradictions.sources.reflectionLabBlueprint.shortLabel",
		datumKey: "contradictions.sources.reflectionLabBlueprint.datum"
	},
	{
		id: "system:R7-CORE-404",
		type: "log",
		moduleId: "System",
		match: { code: "R7-CORE-404" },
		titleKey: "contradictions.sources.r7Core404.title",
		shortLabelKey: "contradictions.sources.r7Core404.shortLabel",
		datumKey: "contradictions.sources.r7Core404.datum"
	},
	{
		id: "document:continuity-board-minutes",
		type: "document",
		moduleId: "Documents",
		match: { title: "Continuity Board Minutes" },
		titleKey: "contradictions.sources.continuityBoardMinutes.title",
		shortLabelKey: "contradictions.sources.continuityBoardMinutes.shortLabel",
		datumKey: "contradictions.sources.continuityBoardMinutes.datum"
	},
	{
		id: "system:RELAY-OMEGA",
		type: "log",
		moduleId: "System",
		match: { code: "RELAY-OMEGA" },
		titleKey: "contradictions.sources.relayOmega.title",
		shortLabelKey: "contradictions.sources.relayOmega.shortLabel",
		datumKey: "contradictions.sources.relayOmega.datum"
	},
	{
		id: "email:mara-helix-can-burn",
		type: "email",
		moduleId: "Emails",
		match: { subject: "Helix can burn, R-7 cannot" },
		titleKey: "contradictions.sources.maraHelixBurn.title",
		shortLabelKey: "contradictions.sources.maraHelixBurn.shortLabel",
		datumKey: "contradictions.sources.maraHelixBurn.datum"
	},
	{
		id: "system:MERGE-909",
		type: "log",
		moduleId: "System",
		match: { code: "MERGE-909" },
		titleKey: "contradictions.sources.merge909.title",
		shortLabelKey: "contradictions.sources.merge909.shortLabel",
		datumKey: "contradictions.sources.merge909.datum"
	}
];

/** @type {Record<string, { titleKey: string, questionKey: string, explanations: Array<{ id: string, labelKey: string }> }>} */
const CONTRADICTION_DETAILS = {
	"maintenance-window-overrun": {
		titleKey: "contradictions.items.maintenanceWindowOverrun.title",
		questionKey: "contradictions.items.maintenanceWindowOverrun.question",
		explanations: [
			{
				id: "same-minute",
				labelKey: "contradictions.items.maintenanceWindowOverrun.explanations.sameMinute"
			},
			{
				id: "after-official-window",
				labelKey: "contradictions.items.maintenanceWindowOverrun.explanations.afterOfficialWindow"
			},
			{
				id: "normal-retry",
				labelKey: "contradictions.items.maintenanceWindowOverrun.explanations.normalRetry"
			}
		]
	},
	"kade-credential-active": {
		titleKey: "contradictions.items.kadeCredentialActive.title",
		questionKey: "contradictions.items.kadeCredentialActive.question",
		explanations: [
			{
				id: "active-offshift",
				labelKey: "contradictions.items.kadeCredentialActive.explanations.activeOffshift"
			},
			{
				id: "roster-typo",
				labelKey: "contradictions.items.kadeCredentialActive.explanations.rosterTypo"
			},
			{
				id: "same-building",
				labelKey: "contradictions.items.kadeCredentialActive.explanations.sameBuilding"
			}
		]
	},
	"mirror-anonymized-live-sync": {
		titleKey: "contradictions.items.mirrorAnonymizedLiveSync.title",
		questionKey: "contradictions.items.mirrorAnonymizedLiveSync.question",
		explanations: [
			{
				id: "charter-vs-live-profiles",
				labelKey: "contradictions.items.mirrorAnonymizedLiveSync.explanations.charterVsLiveProfiles"
			},
			{
				id: "same-data-owner",
				labelKey: "contradictions.items.mirrorAnonymizedLiveSync.explanations.sameDataOwner"
			},
			{
				id: "archival-index-only",
				labelKey: "contradictions.items.mirrorAnonymizedLiveSync.explanations.archivalIndexOnly"
			}
		]
	},
	"audit-hold-purge-conflict": {
		titleKey: "contradictions.items.auditHoldPurgeConflict.title",
		questionKey: "contradictions.items.auditHoldPurgeConflict.question",
		explanations: [
			{
				id: "hold-forbids-purge",
				labelKey: "contradictions.items.auditHoldPurgeConflict.explanations.holdForbidsPurge"
			},
			{
				id: "hold-expired-first",
				labelKey: "contradictions.items.auditHoldPurgeConflict.explanations.holdExpiredFirst"
			},
			{
				id: "purge-was-backup",
				labelKey: "contradictions.items.auditHoldPurgeConflict.explanations.purgeWasBackup"
			}
		]
	},
	"kade-offsite-decoy-conflict": {
		titleKey: "contradictions.items.kadeOffsiteDecoyConflict.title",
		questionKey: "contradictions.items.kadeOffsiteDecoyConflict.question",
		explanations: [
			{
				id: "offsite-vs-cloned-credential",
				labelKey: "contradictions.items.kadeOffsiteDecoyConflict.explanations.offsiteVsClonedCredential"
			},
			{
				id: "noah-authorized-purge",
				labelKey: "contradictions.items.kadeOffsiteDecoyConflict.explanations.noahAuthorizedPurge"
			},
			{
				id: "statement-proves-login",
				labelKey: "contradictions.items.kadeOffsiteDecoyConflict.explanations.statementProvesLogin"
			}
		]
	},
	"prime-continuity-identified-replicas": {
		titleKey: "contradictions.items.primeContinuityIdentifiedReplicas.title",
		questionKey: "contradictions.items.primeContinuityIdentifiedReplicas.question",
		explanations: [
			{
				id: "aggregate-vs-identified-replicas",
				labelKey:
					"contradictions.items.primeContinuityIdentifiedReplicas.explanations.aggregateVsIdentifiedReplicas"
			},
			{
				id: "continuity-is-archive",
				labelKey: "contradictions.items.primeContinuityIdentifiedReplicas.explanations.continuityIsArchive"
			},
			{
				id: "employees-are-anonymous",
				labelKey: "contradictions.items.primeContinuityIdentifiedReplicas.explanations.employeesAreAnonymous"
			}
		]
	},
	"r7-archive-active-core": {
		titleKey: "contradictions.items.r7ArchiveActiveCore.title",
		questionKey: "contradictions.items.r7ArchiveActiveCore.question",
		explanations: [
			{
				id: "r7-was-active-core",
				labelKey: "contradictions.items.r7ArchiveActiveCore.explanations.r7WasActiveCore"
			},
			{
				id: "r7-was-storage",
				labelKey: "contradictions.items.r7ArchiveActiveCore.explanations.r7WasStorage"
			},
			{
				id: "blueprint-was-old",
				labelKey: "contradictions.items.r7ArchiveActiveCore.explanations.blueprintWasOld"
			}
		]
	},
	"board-minutes-relay-omega": {
		titleKey: "contradictions.items.boardMinutesRelayOmega.title",
		questionKey: "contradictions.items.boardMinutesRelayOmega.question",
		explanations: [
			{
				id: "planned-isolation",
				labelKey: "contradictions.items.boardMinutesRelayOmega.explanations.plannedIsolation"
			},
			{
				id: "relay-random-failure",
				labelKey: "contradictions.items.boardMinutesRelayOmega.explanations.relayRandomFailure"
			},
			{
				id: "minutes-clear-the-board",
				labelKey: "contradictions.items.boardMinutesRelayOmega.explanations.minutesClearTheBoard"
			}
		]
	},
	"helix-burn-merge-survival": {
		titleKey: "contradictions.items.helixBurnMergeSurvival.title",
		questionKey: "contradictions.items.helixBurnMergeSurvival.question",
		explanations: [
			{
				id: "purge-preserved-core",
				labelKey: "contradictions.items.helixBurnMergeSurvival.explanations.purgePreservedCore"
			},
			{
				id: "merge-was-destruction",
				labelKey: "contradictions.items.helixBurnMergeSurvival.explanations.mergeWasDestruction"
			},
			{
				id: "mara-stopped-r7",
				labelKey: "contradictions.items.helixBurnMergeSurvival.explanations.maraStoppedR7"
			}
		]
	}
};

export const CHAPTER_CONTRADICTIONS = withContradictionDetails(HELIX_INCIDENT_SOLUTION.contradictions);
export const MIRROR_CONTRADICTIONS = withContradictionDetails(MIRROR_PROJECT_SOLUTION.contradictions);
export const REFLECTION_CONTRADICTIONS = withContradictionDetails(REFLECTION_CORE_SOLUTION.contradictions);

export const GENERIC_CONTRADICTION_EXPLANATIONS = [
	{
		id: "timing-conflict",
		labelKey: "contradictions.generic.explanations.timingConflict"
	},
	{
		id: "identity-conflict",
		labelKey: "contradictions.generic.explanations.identityConflict"
	},
	{
		id: "system-fault",
		labelKey: "contradictions.generic.explanations.systemFault"
	}
];

/** @param {string} chapterId */
export function contradictionSourceDefinitionsForChapter(chapterId = CHAPTER_1_ID) {
	if (chapterId === CHAPTER_3_ID) return REFLECTION_CONTRADICTION_SOURCE_DEFINITIONS;
	return chapterId === CHAPTER_2_ID ? MIRROR_CONTRADICTION_SOURCE_DEFINITIONS : CONTRADICTION_SOURCE_DEFINITIONS;
}

/** @param {string} chapterId */
export function contradictionsForChapter(chapterId = CHAPTER_1_ID) {
	if (chapterId === CHAPTER_3_ID) return REFLECTION_CONTRADICTIONS;
	return chapterId === CHAPTER_2_ID ? MIRROR_CONTRADICTIONS : CHAPTER_CONTRADICTIONS;
}

/** @param {string} chapterId */
export function requiredContradictionIdsForChapter(chapterId = CHAPTER_1_ID) {
	return contradictionsForChapter(chapterId).map((contradiction) => contradiction.id);
}

/**
 * @param {string[]} sourceIds
 * @param {string} chapterId
 */
export function contradictionForSources(sourceIds, chapterId = CHAPTER_1_ID) {
	const normalizedKey = contradictionSourceKey(sourceIds);

	return (
		contradictionsForChapter(chapterId).find((contradiction) => contradictionSourceKey(contradiction.sourceIds) === normalizedKey) ?? null
	);
}

/**
 * @param {string[]} sourceIds
 * @param {string} explanationId
 * @param {string} chapterId
 */
export function validateContradictionAttempt(sourceIds, explanationId, chapterId = CHAPTER_1_ID) {
	const contradiction = contradictionForSources(sourceIds, chapterId);

	if (!contradiction) {
		return { accepted: false, reason: "invalid-sources", contradiction: null };
	}

	if (contradiction.correctExplanationId !== explanationId) {
		return { accepted: false, reason: "wrong-explanation", contradiction };
	}

	return { accepted: true, reason: "accepted", contradiction };
}

/**
 * @param {string} sourceId
 * @param {string} chapterId
 */
export function contradictionSourceForId(sourceId, chapterId = CHAPTER_1_ID) {
	return contradictionSourceDefinitionsForChapter(chapterId).find((source) => source.id === sourceId) ?? null;
}

/**
 * @param {Record<string, boolean | Record<string, any>>} confirmedContradictions
 * @param {string} chapterId
 */
export function countConfirmedContradictions(confirmedContradictions = {}, chapterId = CHAPTER_1_ID) {
	return requiredContradictionIdsForChapter(chapterId).filter((contradictionId) => Boolean(confirmedContradictions?.[contradictionId])).length;
}

/**
 * @param {Array<Record<string, any>>} contradictions
 * @returns {Array<Record<string, any>>}
 */
function withContradictionDetails(contradictions) {
	return contradictions.map((contradiction) => ({
		...contradiction,
		...CONTRADICTION_DETAILS[contradiction.id],
		penalty: CASE_INTEGRITY_PENALTIES.contradiction
	}));
}

/** @param {string[]} sourceIds */
function contradictionSourceKey(sourceIds) {
	return [...sourceIds].sort().join("__");
}
