import { CASE_INTEGRITY_PENALTIES } from "$lib/stores/InvestigationStore";
import { HELIX_INCIDENT_SOLUTION } from "$lib/cases/helixIncidentSolution";
import { MIRROR_PROJECT_SOLUTION } from "$lib/cases/mirrorProjectSolution";
import { REFLECTION_CORE_SOLUTION } from "$lib/cases/reflectionCoreSolution";
import { CHAPTER_1_ID, CHAPTER_2_ID, CHAPTER_3_ID } from "$lib/game/chapters";

export const FINAL_REPORT_DECISION_ID = "chapter-1-final-report";
export const MIRROR_FINAL_REPORT_DECISION_ID = "chapter-2-final-report";
export const REFLECTION_FINAL_REPORT_DECISION_ID = "chapter-3-final-report";

export const FINAL_REPORT_DECISION = {
	id: FINAL_REPORT_DECISION_ID,
	type: "finalReport",
	penalty: CASE_INTEGRITY_PENALTIES.finalReport
};

export const MIRROR_FINAL_REPORT_DECISION = {
	id: MIRROR_FINAL_REPORT_DECISION_ID,
	type: "finalReport",
	penalty: CASE_INTEGRITY_PENALTIES.finalReport
};

export const REFLECTION_FINAL_REPORT_DECISION = {
	id: REFLECTION_FINAL_REPORT_DECISION_ID,
	type: "finalReport",
	penalty: CASE_INTEGRITY_PENALTIES.finalReport
};

export const FINAL_REPORT_QUESTIONS = [
	{
		id: "blackout-cause",
		titleKey: "caseReview.questions.blackoutCause.title",
		correctChoiceIds: correctFinalReportChoices("blackout-cause", CHAPTER_1_ID),
		choices: [
			{
				id: "tower-failure",
				labelKey: "caseReview.questions.blackoutCause.choices.towerFailure"
			},
			{
				id: "maintenance-relay-manipulation",
				labelKey: "caseReview.questions.blackoutCause.choices.maintenanceRelayManipulation"
			},
			{
				id: "camera-corruption",
				labelKey: "caseReview.questions.blackoutCause.choices.cameraCorruption"
			}
		]
	},
	{
		id: "key-zone",
		titleKey: "caseReview.questions.keyZone.title",
		correctChoiceIds: correctFinalReportChoices("key-zone", CHAPTER_1_ID),
		choices: [
			{
				id: "sublevel-c",
				labelKey: "caseReview.questions.keyZone.choices.sublevelC"
			},
			{
				id: "east-archive-server-room",
				labelKey: "caseReview.questions.keyZone.choices.eastArchiveServerRoom"
			},
			{
				id: "external-relay",
				labelKey: "caseReview.questions.keyZone.choices.externalRelay"
			}
		]
	},
	{
		id: "suspicious-credential",
		titleKey: "caseReview.questions.suspiciousCredential.title",
		correctChoiceIds: correctFinalReportChoices("suspicious-credential", CHAPTER_1_ID),
		choices: [
			{
				id: "signal-000",
				labelKey: "caseReview.questions.suspiciousCredential.choices.signal000"
			},
			{
				id: "n-kade-17",
				labelKey: "caseReview.questions.suspiciousCredential.choices.nKade17"
			},
			{
				id: "i-rourke",
				labelKey: "caseReview.questions.suspiciousCredential.choices.iRourke"
			}
		]
	},
	{
		id: "internal-access-proof",
		titleKey: "caseReview.questions.internalAccessProof.title",
		correctChoiceIds: correctFinalReportChoices("internal-access-proof", CHAPTER_1_ID),
		choices: [
			{
				id: "camera-static",
				labelKey: "caseReview.questions.internalAccessProof.choices.cameraStatic"
			},
			{
				id: "duplicate-credential-login-anomaly",
				labelKey: "caseReview.questions.internalAccessProof.choices.duplicateCredentialLoginAnomaly"
			},
			{
				id: "door-conflict-only",
				labelKey: "caseReview.questions.internalAccessProof.choices.doorConflictOnly"
			}
		]
	},
	{
		id: "incident-intent",
		titleKey: "caseReview.questions.incidentIntent.title",
		correctChoiceIds: correctFinalReportChoices("incident-intent", CHAPTER_1_ID),
		choices: [
			{
				id: "accidental",
				labelKey: "caseReview.questions.incidentIntent.choices.accidental"
			},
			{
				id: "deliberate",
				labelKey: "caseReview.questions.incidentIntent.choices.deliberate"
			},
			{
				id: "undetermined",
				labelKey: "caseReview.questions.incidentIntent.choices.undetermined"
			}
		]
	}
];

export const MIRROR_FINAL_REPORT_QUESTIONS = [
	{
		id: "mirror-real-function",
		titleKey: "caseReview.questions.mirrorRealFunction.title",
		correctChoiceIds: correctFinalReportChoices("mirror-real-function", CHAPTER_2_ID),
		choices: [
			{
				id: "archival-deduplication",
				labelKey: "caseReview.questions.mirrorRealFunction.choices.archivalDeduplication"
			},
			{
				id: "live-behavioral-employee-profiles",
				labelKey: "caseReview.questions.mirrorRealFunction.choices.liveBehavioralEmployeeProfiles"
			},
			{
				id: "anonymous-power-diagnostics",
				labelKey: "caseReview.questions.mirrorRealFunction.choices.anonymousPowerDiagnostics"
			}
		]
	},
	{
		id: "hidden-operation",
		titleKey: "caseReview.questions.hiddenOperation.title",
		correctChoiceIds: correctFinalReportChoices("hidden-operation", CHAPTER_2_ID),
		choices: [
			{
				id: "mirror-export-r7-and-index-purge",
				labelKey: "caseReview.questions.hiddenOperation.choices.mirrorExportR7AndIndexPurge"
			},
			{
				id: "camera-rollback-only",
				labelKey: "caseReview.questions.hiddenOperation.choices.cameraRollbackOnly"
			},
			{
				id: "audit-hold-release",
				labelKey: "caseReview.questions.hiddenOperation.choices.auditHoldRelease"
			}
		]
	},
	{
		id: "direct-purge-actor",
		titleKey: "caseReview.questions.directPurgeActor.title",
		correctChoiceIds: correctFinalReportChoices("direct-purge-actor", CHAPTER_2_ID),
		choices: [
			{
				id: "elias-ren-mirror-114",
				labelKey: "caseReview.questions.directPurgeActor.choices.eliasRenMirror114"
			},
			{
				id: "mara-voss-mvoss-01",
				labelKey: "caseReview.questions.directPurgeActor.choices.maraVossMvoss01"
			},
			{
				id: "noah-kade-decoy-017",
				labelKey: "caseReview.questions.directPurgeActor.choices.noahKadeDecoy017"
			}
		]
	},
	{
		id: "n-kade-decoy-proof",
		titleKey: "caseReview.questions.nKadeDecoyProof.title",
		correctChoiceIds: correctFinalReportChoices("n-kade-decoy-proof", CHAPTER_2_ID),
		choices: [
			{
				id: "clone-record-offsite-statement",
				labelKey: "caseReview.questions.nKadeDecoyProof.choices.cloneRecordOffsiteStatement"
			},
			{
				id: "roster-delta-auth102",
				labelKey: "caseReview.questions.nKadeDecoyProof.choices.rosterDeltaAuth102"
			},
			{
				id: "access-map-door441",
				labelKey: "caseReview.questions.nKadeDecoyProof.choices.accessMapDoor441"
			}
		]
	},
	{
		id: "mirror-continuation-site",
		titleKey: "caseReview.questions.mirrorContinuationSite.title",
		correctChoiceIds: correctFinalReportChoices("mirror-continuation-site", CHAPTER_2_ID),
		choices: [
			{
				id: "east-archive-only",
				labelKey: "caseReview.questions.mirrorContinuationSite.choices.eastArchiveOnly"
			},
			{
				id: "reflection-lab-r7",
				labelKey: "caseReview.questions.mirrorContinuationSite.choices.reflectionLabR7"
			},
			{
				id: "external-relay-core",
				labelKey: "caseReview.questions.mirrorContinuationSite.choices.externalRelayCore"
			}
		]
	},
	{
		id: "data-destruction-classification",
		titleKey: "caseReview.questions.dataDestructionClassification.title",
		correctChoiceIds: correctFinalReportChoices("data-destruction-classification", CHAPTER_2_ID),
		choices: [
			{
				id: "routine-retention-cleanup",
				labelKey: "caseReview.questions.dataDestructionClassification.choices.routineRetentionCleanup"
			},
			{
				id: "deliberate-coverup",
				labelKey: "caseReview.questions.dataDestructionClassification.choices.deliberateCoverup"
			},
			{
				id: "accidental-index-corruption",
				labelKey: "caseReview.questions.dataDestructionClassification.choices.accidentalIndexCorruption"
			}
		]
	}
];

export const REFLECTION_FINAL_REPORT_QUESTIONS = [
	{
		id: "mirror-final-form",
		titleKey: "caseReview.questions.mirrorFinalForm.title",
		correctChoiceIds: correctFinalReportChoices("mirror-final-form", CHAPTER_3_ID),
		choices: [
			{
				id: "employee-scheduling-tool",
				labelKey: "caseReview.questions.mirrorFinalForm.choices.employeeSchedulingTool"
			},
			{
				id: "behavioral-decision-replicas",
				labelKey: "caseReview.questions.mirrorFinalForm.choices.behavioralDecisionReplicas"
			},
			{
				id: "relay-diagnostics-suite",
				labelKey: "caseReview.questions.mirrorFinalForm.choices.relayDiagnosticsSuite"
			}
		]
	},
	{
		id: "helix-project-role",
		titleKey: "caseReview.questions.helixProjectRole.title",
		correctChoiceIds: correctFinalReportChoices("helix-project-role", CHAPTER_3_ID),
		choices: [
			{
				id: "true-research-core",
				labelKey: "caseReview.questions.helixProjectRole.choices.trueResearchCore"
			},
			{
				id: "operational-facade",
				labelKey: "caseReview.questions.helixProjectRole.choices.operationalFacade"
			},
			{
				id: "unrelated-outage-site",
				labelKey: "caseReview.questions.helixProjectRole.choices.unrelatedOutageSite"
			}
		]
	},
	{
		id: "true-core-site",
		titleKey: "caseReview.questions.trueCoreSite.title",
		correctChoiceIds: correctFinalReportChoices("true-core-site", CHAPTER_3_ID),
		choices: [
			{
				id: "east-archive",
				labelKey: "caseReview.questions.trueCoreSite.choices.eastArchive"
			},
			{
				id: "reflection-lab-r7",
				labelKey: "caseReview.questions.trueCoreSite.choices.reflectionLabR7"
			},
			{
				id: "sublevel-c-camera-grid",
				labelKey: "caseReview.questions.trueCoreSite.choices.sublevelCCameraGrid"
			}
		]
	},
	{
		id: "blackout-strategic-purpose",
		titleKey: "caseReview.questions.blackoutStrategicPurpose.title",
		correctChoiceIds: correctFinalReportChoices("blackout-strategic-purpose", CHAPTER_3_ID),
		choices: [
			{
				id: "accidental-relay-overload",
				labelKey: "caseReview.questions.blackoutStrategicPurpose.choices.accidentalRelayOverload"
			},
			{
				id: "isolate-audit-cover-transfer",
				labelKey: "caseReview.questions.blackoutStrategicPurpose.choices.isolateAuditCoverTransfer"
			},
			{
				id: "stop-mirror-prime",
				labelKey: "caseReview.questions.blackoutStrategicPurpose.choices.stopMirrorPrime"
			}
		]
	},
	{
		id: "exported-package-fate",
		titleKey: "caseReview.questions.exportedPackageFate.title",
		correctChoiceIds: correctFinalReportChoices("exported-package-fate", CHAPTER_3_ID),
		choices: [
			{
				id: "destroyed-by-purge",
				labelKey: "caseReview.questions.exportedPackageFate.choices.destroyedByPurge"
			},
			{
				id: "merged-into-mirror-prime",
				labelKey: "caseReview.questions.exportedPackageFate.choices.mergedIntoMirrorPrime"
			},
			{
				id: "lost-in-relay-cache",
				labelKey: "caseReview.questions.exportedPackageFate.choices.lostInRelayCache"
			}
		]
	},
	{
		id: "final-decision-maker",
		titleKey: "caseReview.questions.finalDecisionMaker.title",
		correctChoiceIds: correctFinalReportChoices("final-decision-maker", CHAPTER_3_ID),
		choices: [
			{
				id: "mara-voss-alone",
				labelKey: "caseReview.questions.finalDecisionMaker.choices.maraVossAlone"
			},
			{
				id: "continuity-board",
				labelKey: "caseReview.questions.finalDecisionMaker.choices.continuityBoard"
			},
			{
				id: "mirror-prime-alone",
				labelKey: "caseReview.questions.finalDecisionMaker.choices.mirrorPrimeAlone"
			}
		]
	},
	{
		id: "case-classification",
		titleKey: "caseReview.questions.caseClassification.title",
		correctChoiceIds: correctFinalReportChoices("case-classification", CHAPTER_3_ID),
		choices: [
			{
				id: "routine-continuity-plan",
				labelKey: "caseReview.questions.caseClassification.choices.routineContinuityPlan"
			},
			{
				id: "deliberate-human-coverup",
				labelKey: "caseReview.questions.caseClassification.choices.deliberateHumanCoverup"
			},
			{
				id: "unsolved-system-failure",
				labelKey: "caseReview.questions.caseClassification.choices.unsolvedSystemFailure"
			}
		]
	}
];

/** @param {string} chapterId */
export function finalReportDecisionIdForChapter(chapterId = CHAPTER_1_ID) {
	if (chapterId === CHAPTER_3_ID) return REFLECTION_FINAL_REPORT_DECISION_ID;
	return chapterId === CHAPTER_2_ID ? MIRROR_FINAL_REPORT_DECISION_ID : FINAL_REPORT_DECISION_ID;
}

/** @param {string} chapterId */
export function finalReportDecisionForChapter(chapterId = CHAPTER_1_ID) {
	if (chapterId === CHAPTER_3_ID) return REFLECTION_FINAL_REPORT_DECISION;
	return chapterId === CHAPTER_2_ID ? MIRROR_FINAL_REPORT_DECISION : FINAL_REPORT_DECISION;
}

/** @param {string} chapterId */
export function finalReportQuestionsForChapter(chapterId = CHAPTER_1_ID) {
	if (chapterId === CHAPTER_3_ID) return REFLECTION_FINAL_REPORT_QUESTIONS;
	return chapterId === CHAPTER_2_ID ? MIRROR_FINAL_REPORT_QUESTIONS : FINAL_REPORT_QUESTIONS;
}

/**
 * @param {Record<string, string>} answers
 * @param {string} chapterId
 */
export function finalReportIsCorrect(answers = {}, chapterId = CHAPTER_1_ID) {
	return finalReportQuestionsForChapter(chapterId).every((question) =>
		correctFinalReportChoices(question.id, chapterId).includes(answers[question.id] ?? "")
	);
}

/**
 * @param {Record<string, string>} answers
 * @param {string} chapterId
 */
export function countFinalReportAnswers(answers = {}, chapterId = CHAPTER_1_ID) {
	return finalReportQuestionsForChapter(chapterId).filter((question) => Boolean(answers[question.id])).length;
}

/**
 * @param {string} questionId
 * @param {string} chapterId
 */
function correctFinalReportChoices(questionId, chapterId = CHAPTER_1_ID) {
	const answers = /** @type {Record<string, string[]>} */ (
		chapterId === CHAPTER_3_ID
			? REFLECTION_CORE_SOLUTION.finalReportAnswers
			: chapterId === CHAPTER_2_ID
				? MIRROR_PROJECT_SOLUTION.finalReportAnswers
				: HELIX_INCIDENT_SOLUTION.finalReportAnswers
	);
	return answers[questionId] ?? [];
}
