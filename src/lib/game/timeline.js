import { CASE_INTEGRITY_PENALTIES } from "$lib/stores/InvestigationStore";
import { HELIX_INCIDENT_SOLUTION } from "$lib/cases/helixIncidentSolution";
import { MIRROR_PROJECT_SOLUTION } from "$lib/cases/mirrorProjectSolution";
import { REFLECTION_CORE_SOLUTION } from "$lib/cases/reflectionCoreSolution";
import { CHAPTER_1_ID, CHAPTER_2_ID, CHAPTER_3_ID } from "$lib/game/chapters";

export const TIMELINE_DEDUCTION_ID = HELIX_INCIDENT_SOLUTION.timeline.deductionId;
export const TIMELINE_PENALTY = CASE_INTEGRITY_PENALTIES.repeatedPuzzleMistake;

export const CHAPTER_TIMELINE_EVENTS = [
	{
		id: "maintenance-window-prepared",
		titleKey: "timeline.events.maintenanceWindowPrepared.title",
		timeKey: "timeline.events.maintenanceWindowPrepared.time",
		sourceKey: "timeline.events.maintenanceWindowPrepared.source",
		descriptionKey: "timeline.events.maintenanceWindowPrepared.description",
		unlock: { moduleId: "Emails", subject: "Network maintenance window" }
	},
	{
		id: "sublevel-c-occupancy-spike",
		titleKey: "timeline.events.sublevelCOccupancySpike.title",
		timeKey: "timeline.events.sublevelCOccupancySpike.time",
		sourceKey: "timeline.events.sublevelCOccupancySpike.source",
		descriptionKey: "timeline.events.sublevelCOccupancySpike.description",
		unlock: { moduleId: "System", code: "OCC-204" }
	},
	{
		id: "east-archive-contradictory-access",
		titleKey: "timeline.events.eastArchiveContradictoryAccess.title",
		timeKey: "timeline.events.eastArchiveContradictoryAccess.time",
		sourceKey: "timeline.events.eastArchiveContradictoryAccess.source",
		descriptionKey: "timeline.events.eastArchiveContradictoryAccess.description",
		unlock: { moduleId: "System", code: "DOOR-441" }
	},
	{
		id: "n-kade-login-c17",
		titleKey: "timeline.events.nKadeLoginC17.title",
		timeKey: "timeline.events.nKadeLoginC17.time",
		sourceKey: "timeline.events.nKadeLoginC17.source",
		descriptionKey: "timeline.events.nKadeLoginC17.description",
		unlock: { moduleId: "System", code: "AUTH-102" }
	},
	{
		id: "camera-integrity-failure",
		titleKey: "timeline.events.cameraIntegrityFailure.title",
		timeKey: "timeline.events.cameraIntegrityFailure.time",
		sourceKey: "timeline.events.cameraIntegrityFailure.source",
		descriptionKey: "timeline.events.cameraIntegrityFailure.description",
		unlock: { moduleId: "System", code: "CAM-500" }
	},
	{
		id: "external-relay-connection-loss",
		titleKey: "timeline.events.externalRelayConnectionLoss.title",
		timeKey: "timeline.events.externalRelayConnectionLoss.time",
		sourceKey: "timeline.events.externalRelayConnectionLoss.source",
		descriptionKey: "timeline.events.externalRelayConnectionLoss.description",
		unlock: { moduleId: "System", code: "NET-900" }
	}
];

export const MIRROR_TIMELINE_EVENTS = [
	{
		id: "mirror-audit-hold-active",
		titleKey: "timeline.events.mirrorAuditHoldActive.title",
		sourceKey: "timeline.events.mirrorAuditHoldActive.source",
		descriptionKey: "timeline.events.mirrorAuditHoldActive.description",
		unlock: { moduleId: "Documents", title: "Audit Retention Notice" }
	},
	{
		id: "mirror-live-profile-sync",
		titleKey: "timeline.events.mirrorLiveProfileSync.title",
		sourceKey: "timeline.events.mirrorLiveProfileSync.source",
		descriptionKey: "timeline.events.mirrorLiveProfileSync.description",
		unlock: { moduleId: "System", code: "MIRROR-114" }
	},
	{
		id: "mvoss-purge-window-authorized",
		titleKey: "timeline.events.mvossPurgeWindowAuthorized.title",
		sourceKey: "timeline.events.mvossPurgeWindowAuthorized.source",
		descriptionKey: "timeline.events.mvossPurgeWindowAuthorized.description",
		unlock: { moduleId: "System", code: "PURGE-771" }
	},
	{
		id: "mirror-package-exported-r7",
		titleKey: "timeline.events.mirrorPackageExportedR7.title",
		sourceKey: "timeline.events.mirrorPackageExportedR7.source",
		descriptionKey: "timeline.events.mirrorPackageExportedR7.description",
		unlock: { moduleId: "System", code: "EXPORT-332" }
	},
	{
		id: "n-kade-17-decoy-cloned",
		titleKey: "timeline.events.nKade17DecoyCloned.title",
		sourceKey: "timeline.events.nKade17DecoyCloned.source",
		descriptionKey: "timeline.events.nKade17DecoyCloned.description",
		unlock: { moduleId: "System", code: "DECOY-017" }
	},
	{
		id: "mirror-audited-index-purged",
		titleKey: "timeline.events.mirrorAuditedIndexPurged.title",
		sourceKey: "timeline.events.mirrorAuditedIndexPurged.source",
		descriptionKey: "timeline.events.mirrorAuditedIndexPurged.description",
		unlock: { moduleId: "System", code: "PURGE-771" }
	}
];

export const REFLECTION_TIMELINE_EVENTS = [
	{
		id: "audit-consent-chain-requested",
		titleKey: "timeline.events.auditConsentChainRequested.title",
		sourceKey: "timeline.events.auditConsentChainRequested.source",
		descriptionKey: "timeline.events.auditConsentChainRequested.description",
		unlock: { moduleId: "System", code: "AUDIT-310" }
	},
	{
		id: "arendt-warns-individual-simulation",
		titleKey: "timeline.events.arendtWarnsIndividualSimulation.title",
		sourceKey: "timeline.events.arendtWarnsIndividualSimulation.source",
		descriptionKey: "timeline.events.arendtWarnsIndividualSimulation.description",
		unlock: { moduleId: "Documents", title: "Sealed Statement of Dr. Selene Arendt" }
	},
	{
		id: "mirror-prime-prediction-reliable",
		titleKey: "timeline.events.mirrorPrimePredictionReliable.title",
		sourceKey: "timeline.events.mirrorPrimePredictionReliable.source",
		descriptionKey: "timeline.events.mirrorPrimePredictionReliable.description",
		unlock: { moduleId: "System", code: "PRIME-617" }
	},
	{
		id: "omega-7-authorized",
		titleKey: "timeline.events.omega7Authorized.title",
		sourceKey: "timeline.events.omega7Authorized.source",
		descriptionKey: "timeline.events.omega7Authorized.description",
		unlock: { moduleId: "System", code: "BOARD-000" }
	},
	{
		id: "helix-isolated-blackout-relay",
		titleKey: "timeline.events.helixIsolatedBlackoutRelay.title",
		sourceKey: "timeline.events.helixIsolatedBlackoutRelay.source",
		descriptionKey: "timeline.events.helixIsolatedBlackoutRelay.description",
		unlock: { moduleId: "System", code: "RELAY-OMEGA" }
	},
	{
		id: "mirror-package-merged-r7",
		titleKey: "timeline.events.mirrorPackageMergedR7.title",
		sourceKey: "timeline.events.mirrorPackageMergedR7.source",
		descriptionKey: "timeline.events.mirrorPackageMergedR7.description",
		unlock: { moduleId: "System", code: "MERGE-909" }
	},
	{
		id: "helix-local-index-eliminated",
		titleKey: "timeline.events.helixLocalIndexEliminated.title",
		sourceKey: "timeline.events.helixLocalIndexEliminated.source",
		descriptionKey: "timeline.events.helixLocalIndexEliminated.description",
		unlock: { moduleId: "Emails", subject: "Helix can burn, R-7 cannot" }
	},
	{
		id: "mirror-prime-locks-core",
		titleKey: "timeline.events.mirrorPrimeLocksCore.title",
		sourceKey: "timeline.events.mirrorPrimeLocksCore.source",
		descriptionKey: "timeline.events.mirrorPrimeLocksCore.description",
		unlock: { moduleId: "System", code: "LOCK-777" }
	}
];

export const CORRECT_TIMELINE_ORDER = HELIX_INCIDENT_SOLUTION.timeline.correctOrder;

export const INITIAL_TIMELINE_ORDER = [
	"n-kade-login-c17",
	"maintenance-window-prepared",
	"camera-integrity-failure",
	"east-archive-contradictory-access",
	"external-relay-connection-loss",
	"sublevel-c-occupancy-spike"
];

export const TERMINAL_TIMELINE_ORDER = [
	"camera-integrity-failure",
	"east-archive-contradictory-access",
	"external-relay-connection-loss",
	"maintenance-window-prepared",
	"n-kade-login-c17",
	"sublevel-c-occupancy-spike"
];

export const MIRROR_INITIAL_TIMELINE_ORDER = [
	"n-kade-17-decoy-cloned",
	"mirror-audit-hold-active",
	"mirror-audited-index-purged",
	"mirror-live-profile-sync",
	"mirror-package-exported-r7",
	"mvoss-purge-window-authorized"
];

export const MIRROR_TERMINAL_TIMELINE_ORDER = [
	"mirror-live-profile-sync",
	"mirror-audit-hold-active",
	"mirror-package-exported-r7",
	"n-kade-17-decoy-cloned",
	"mvoss-purge-window-authorized",
	"mirror-audited-index-purged"
];

export const REFLECTION_INITIAL_TIMELINE_ORDER = [
	"mirror-prime-locks-core",
	"audit-consent-chain-requested",
	"mirror-package-merged-r7",
	"arendt-warns-individual-simulation",
	"helix-local-index-eliminated",
	"omega-7-authorized",
	"mirror-prime-prediction-reliable",
	"helix-isolated-blackout-relay"
];

export const REFLECTION_TERMINAL_TIMELINE_ORDER = [
	"mirror-prime-prediction-reliable",
	"audit-consent-chain-requested",
	"omega-7-authorized",
	"arendt-warns-individual-simulation",
	"helix-isolated-blackout-relay",
	"mirror-package-merged-r7",
	"mirror-prime-locks-core",
	"helix-local-index-eliminated"
];

/** @param {string} chapterId */
export function timelineEventsForChapter(chapterId = CHAPTER_1_ID) {
	if (chapterId === CHAPTER_3_ID) return REFLECTION_TIMELINE_EVENTS;
	return chapterId === CHAPTER_2_ID ? MIRROR_TIMELINE_EVENTS : CHAPTER_TIMELINE_EVENTS;
}

/** @param {string} chapterId */
export function correctTimelineOrderForChapter(chapterId = CHAPTER_1_ID) {
	if (chapterId === CHAPTER_3_ID) return REFLECTION_CORE_SOLUTION.timeline.correctOrder;
	return chapterId === CHAPTER_2_ID ? MIRROR_PROJECT_SOLUTION.timeline.correctOrder : HELIX_INCIDENT_SOLUTION.timeline.correctOrder;
}

/** @param {string} chapterId */
export function timelineDeductionIdForChapter(chapterId = CHAPTER_1_ID) {
	if (chapterId === CHAPTER_3_ID) return REFLECTION_CORE_SOLUTION.timeline.deductionId;
	return chapterId === CHAPTER_2_ID ? MIRROR_PROJECT_SOLUTION.timeline.deductionId : HELIX_INCIDENT_SOLUTION.timeline.deductionId;
}

/** @param {string} chapterId */
export function initialTimelineOrderForChapter(chapterId = CHAPTER_1_ID) {
	if (chapterId === CHAPTER_3_ID) return REFLECTION_INITIAL_TIMELINE_ORDER;
	return chapterId === CHAPTER_2_ID ? MIRROR_INITIAL_TIMELINE_ORDER : INITIAL_TIMELINE_ORDER;
}

/** @param {string} chapterId */
export function terminalTimelineOrderForChapter(chapterId = CHAPTER_1_ID) {
	if (chapterId === CHAPTER_3_ID) return REFLECTION_TERMINAL_TIMELINE_ORDER;
	return chapterId === CHAPTER_2_ID ? MIRROR_TERMINAL_TIMELINE_ORDER : TERMINAL_TIMELINE_ORDER;
}

/**
 * @param {string[]} order
 * @param {string} chapterId
 */
export function isCorrectTimelineOrder(order, chapterId = CHAPTER_1_ID) {
	const correctOrder = correctTimelineOrderForChapter(chapterId);
	return correctOrder.length === order.length && correctOrder.every((eventId, index) => order[index] === eventId);
}

/**
 * @param {Array<Record<string, any>>} events
 * @param {string[]} preferredOrder
 * @returns {Array<Record<string, any>>}
 */
export function sortTimelineEvents(events, preferredOrder = INITIAL_TIMELINE_ORDER) {
	const byId = new Map(events.map((event) => [event.id, event]));
	const sorted = preferredOrder.flatMap((eventId) => {
		const event = byId.get(eventId);
		return event ? [event] : [];
	});
	const missing = events.filter((event) => !preferredOrder.includes(event.id));

	return [...sorted, ...missing];
}
