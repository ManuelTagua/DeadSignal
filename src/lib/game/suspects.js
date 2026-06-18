import { CASE_INTEGRITY_PENALTIES } from "$lib/stores/InvestigationStore";
import { HELIX_INCIDENT_SOLUTION } from "$lib/cases/helixIncidentSolution";
import { MIRROR_PROJECT_SOLUTION } from "$lib/cases/mirrorProjectSolution";
import { REFLECTION_CORE_SOLUTION } from "$lib/cases/reflectionCoreSolution";
import { CHAPTER_1_ID, CHAPTER_2_ID, CHAPTER_3_ID } from "$lib/game/chapters";

export const SUSPECT_ACCUSATION_DECISION_ID = "suspect";
export const SUSPECT_ACCUSATION_DEDUCTION_ID = HELIX_INCIDENT_SOLUTION.suspect.deductionId;
export const SUSPECT_ACCUSATION_PENALTY = CASE_INTEGRITY_PENALTIES.suspectAccusation;
export const CORRECT_SUSPECT_ID = HELIX_INCIDENT_SOLUTION.suspect.id;
export const CORRECT_SUSPECT_REASON_ID = HELIX_INCIDENT_SOLUTION.suspect.reasonId;

export const CHAPTER_SUSPECTS = [
	{
		id: "n-kade-17",
		nameKey: "suspects.items.nKade17.name",
		roleKey: "suspects.items.nKade17.role",
		questionKey: "suspects.items.nKade17.question",
		facts: [
			{
				id: "duplicate-credential",
				labelKey: "suspects.items.nKade17.facts.duplicateCredential",
				sourceKey: "suspects.sources.duplicateCredential",
				unlock: { moduleId: "EvidenceBoard", evidenceId: "duplicate-credential" }
			},
			{
				id: "terminal-c17",
				labelKey: "suspects.items.nKade17.facts.terminalC17",
				sourceKey: "suspects.sources.auth102",
				unlock: { moduleId: "System", code: "AUTH-102" }
			},
			{
				id: "off-shift",
				labelKey: "suspects.items.nKade17.facts.offShift",
				sourceKey: "suspects.sources.employeeRoster",
				unlock: { moduleId: "Documents", title: "Employee Roster Delta" }
			}
		],
		reasons: [
			{
				id: "credential-offshift-terminal",
				labelKey: "suspects.items.nKade17.reasons.credentialOffshiftTerminal",
				requiredFactIds: HELIX_INCIDENT_SOLUTION.suspect.requiredFactIds
			},
			{
				id: "helix-director",
				labelKey: "suspects.items.nKade17.reasons.helixDirector"
			},
			{
				id: "wrote-all-mail",
				labelKey: "suspects.items.nKade17.reasons.wroteAllMail"
			}
		]
	},
	{
		id: "i-rourke",
		nameKey: "suspects.items.iRourke.name",
		roleKey: "suspects.items.iRourke.role",
		questionKey: "suspects.items.iRourke.question",
		facts: [
			{
				id: "maintenance-window",
				labelKey: "suspects.items.iRourke.facts.maintenanceWindow",
				sourceKey: "suspects.sources.maintenanceWindow",
				unlock: { moduleId: "Emails", subject: "Network maintenance window" }
			},
			{
				id: "relay-access",
				labelKey: "suspects.items.iRourke.facts.relayAccess",
				sourceKey: "suspects.sources.net900",
				unlock: { moduleId: "System", code: "NET-900" }
			}
		],
		reasons: [
			{
				id: "authorized-maintenance",
				labelKey: "suspects.items.iRourke.reasons.authorizedMaintenance"
			},
			{
				id: "camera-owner",
				labelKey: "suspects.items.iRourke.reasons.cameraOwner"
			},
			{
				id: "archive-only",
				labelKey: "suspects.items.iRourke.reasons.archiveOnly"
			}
		]
	},
	{
		id: "m-velasco",
		nameKey: "suspects.items.mVelasco.name",
		roleKey: "suspects.items.mVelasco.role",
		questionKey: "suspects.items.mVelasco.question",
		facts: [
			{
				id: "camera-failure",
				labelKey: "suspects.items.mVelasco.facts.cameraFailure",
				sourceKey: "suspects.sources.cam500",
				unlock: { moduleId: "System", code: "CAM-500" }
			},
			{
				id: "no-east-archive",
				labelKey: "suspects.items.mVelasco.facts.noEastArchive",
				sourceKey: "suspects.sources.eastArchiveNote",
				unlock: { moduleId: "Documents", title: "Security Note: East Archive" }
			}
		],
		reasons: [
			{
				id: "reported-cameras",
				labelKey: "suspects.items.mVelasco.reasons.reportedCameras"
			},
			{
				id: "relay-owner",
				labelKey: "suspects.items.mVelasco.reasons.relayOwner"
			},
			{
				id: "credential-clone",
				labelKey: "suspects.items.mVelasco.reasons.credentialClone"
			}
		]
	},
	{
		id: "a-ren",
		nameKey: "suspects.items.aRen.name",
		roleKey: "suspects.items.aRen.role",
		questionKey: "suspects.items.aRen.question",
		facts: [
			{
				id: "prior-anomalies",
				labelKey: "suspects.items.aRen.facts.priorAnomalies",
				sourceKey: "suspects.sources.renReply",
				unlock: { moduleId: "Emails", subject: "Re: Containment review moved to 23:40" }
			},
			{
				id: "external-warning",
				labelKey: "suspects.items.aRen.facts.externalWarning",
				sourceKey: "suspects.sources.initialBrief",
				unlock: { moduleId: "Documents", title: "Initial Incident Brief" }
			}
		],
		reasons: [
			{
				id: "detected-anomalies",
				labelKey: "suspects.items.aRen.reasons.detectedAnomalies"
			},
			{
				id: "maintenance-authority",
				labelKey: "suspects.items.aRen.reasons.maintenanceAuthority"
			},
			{
				id: "archive-keys",
				labelKey: "suspects.items.aRen.reasons.archiveKeys"
			}
		]
	},
	{
		id: "e-mori",
		nameKey: "suspects.items.eMori.name",
		roleKey: "suspects.items.eMori.role",
		questionKey: "suspects.items.eMori.question",
		facts: [
			{
				id: "archive-access",
				labelKey: "suspects.items.eMori.facts.archiveAccess",
				sourceKey: "suspects.sources.eastArchiveNote",
				unlock: { moduleId: "Documents", title: "Security Note: East Archive" }
			},
			{
				id: "no-relay-permission",
				labelKey: "suspects.items.eMori.facts.noRelayPermission",
				sourceKey: "suspects.sources.relayReport",
				unlock: { moduleId: "Documents", title: "Relay Failure Report" }
			}
		],
		reasons: [
			{
				id: "archive-access",
				labelKey: "suspects.items.eMori.reasons.archiveAccess"
			},
			{
				id: "relay-control",
				labelKey: "suspects.items.eMori.reasons.relayControl"
			},
			{
				id: "offshift-terminal",
				labelKey: "suspects.items.eMori.reasons.offshiftTerminal"
			}
		]
	}
];

export const MIRROR_SUSPECTS = [
	{
		id: "mara-voss",
		nameKey: "suspects.items.maraVoss.name",
		roleKey: "suspects.items.maraVoss.role",
		questionKey: "suspects.items.maraVoss.question",
		facts: [
			{
				id: "mvoss-token",
				labelKey: "suspects.items.maraVoss.facts.mvossToken",
				sourceKey: "suspects.sources.mirrorAdminToken",
				unlock: { moduleId: "EvidenceBoard", evidenceId: "mirror-admin-token" }
			},
			{
				id: "audit-hold-active",
				labelKey: "suspects.items.maraVoss.facts.auditHoldActive",
				sourceKey: "suspects.sources.auditRetention",
				unlock: { moduleId: "EvidenceBoard", evidenceId: "audit-retention-order" }
			},
			{
				id: "mirror-exported-r7",
				labelKey: "suspects.items.maraVoss.facts.mirrorExportedR7",
				sourceKey: "suspects.sources.export332",
				unlock: { moduleId: "EvidenceBoard", evidenceId: "mirror-export-package" }
			}
		],
		reasons: [
			{
				id: "mvoss-token-purge-during-hold",
				labelKey: "suspects.items.maraVoss.reasons.mvossTokenPurgeDuringHold",
				requiredFactIds: MIRROR_PROJECT_SOLUTION.suspect.requiredFactIds
			},
			{
				id: "reported-mirror-risk",
				labelKey: "suspects.items.maraVoss.reasons.reportedMirrorRisk"
			},
			{
				id: "owned-reflection-lab",
				labelKey: "suspects.items.maraVoss.reasons.ownedReflectionLab"
			}
		]
	},
	{
		id: "elias-ren",
		nameKey: "suspects.items.eliasRen.name",
		roleKey: "suspects.items.eliasRen.role",
		questionKey: "suspects.items.eliasRen.question",
		facts: [
			{
				id: "mirror-still-answering",
				labelKey: "suspects.items.eliasRen.facts.mirrorStillAnswering",
				sourceKey: "suspects.sources.mirrorStillAnswering",
				unlock: { moduleId: "Emails", subject: "MIRROR is still answering" }
			},
			{
				id: "live-sync-log",
				labelKey: "suspects.items.eliasRen.facts.liveSyncLog",
				sourceKey: "suspects.sources.mirror114",
				unlock: { moduleId: "System", code: "MIRROR-114" }
			}
		],
		reasons: [
			{
				id: "raised-sync-alert",
				labelKey: "suspects.items.eliasRen.reasons.raisedSyncAlert"
			},
			{
				id: "authorized-purge-token",
				labelKey: "suspects.items.eliasRen.reasons.authorizedPurgeToken"
			},
			{
				id: "created-decoy-credential",
				labelKey: "suspects.items.eliasRen.reasons.createdDecoyCredential"
			}
		]
	},
	{
		id: "noah-kade",
		nameKey: "suspects.items.noahKade.name",
		roleKey: "suspects.items.noahKade.role",
		questionKey: "suspects.items.noahKade.question",
		facts: [
			{
				id: "credential-cloned",
				labelKey: "suspects.items.noahKade.facts.credentialCloned",
				sourceKey: "suspects.sources.nKadeCloneRecord",
				unlock: { moduleId: "EvidenceBoard", evidenceId: "n-kade-17-clone-record" }
			},
			{
				id: "offsite-statement",
				labelKey: "suspects.items.noahKade.facts.offsiteStatement",
				sourceKey: "suspects.sources.kadeOffsiteStatement",
				unlock: { moduleId: "EvidenceBoard", evidenceId: "n-kade-offsite-statement" }
			}
		],
		reasons: [
			{
				id: "credential-was-decoy",
				labelKey: "suspects.items.noahKade.reasons.credentialWasDecoy"
			},
			{
				id: "purged-mirror-index",
				labelKey: "suspects.items.noahKade.reasons.purgedMirrorIndex"
			},
			{
				id: "moved-package-r7",
				labelKey: "suspects.items.noahKade.reasons.movedPackageR7"
			}
		]
	},
	{
		id: "i-rourke",
		nameKey: "suspects.items.iRourkeMirror.name",
		roleKey: "suspects.items.iRourkeMirror.role",
		questionKey: "suspects.items.iRourkeMirror.question",
		facts: [
			{
				id: "no-maintenance-ticket",
				labelKey: "suspects.items.iRourkeMirror.facts.noMaintenanceTicket",
				sourceKey: "suspects.sources.r7Ticket",
				unlock: { moduleId: "Emails", subject: "No maintenance ticket for R-7" }
			},
			{
				id: "r7-route-knowledge",
				labelKey: "suspects.items.iRourkeMirror.facts.r7RouteKnowledge",
				sourceKey: "suspects.sources.reflectionLabAccessTrace",
				unlock: { moduleId: "EvidenceBoard", evidenceId: "reflection-lab-access-trace" }
			}
		],
		reasons: [
			{
				id: "found-r7-gap",
				labelKey: "suspects.items.iRourkeMirror.reasons.foundR7Gap"
			},
			{
				id: "authorized-mirror-purge",
				labelKey: "suspects.items.iRourkeMirror.reasons.authorizedMirrorPurge"
			},
			{
				id: "owns-mvoss-token",
				labelKey: "suspects.items.iRourkeMirror.reasons.ownsMvossToken"
			}
		]
	},
	{
		id: "a-ren",
		nameKey: "suspects.items.aRenMirror.name",
		roleKey: "suspects.items.aRenMirror.role",
		questionKey: "suspects.items.aRenMirror.question",
		facts: [
			{
				id: "audit-hold-active",
				labelKey: "suspects.items.aRenMirror.facts.auditHoldActive",
				sourceKey: "suspects.sources.auditRetention",
				unlock: { moduleId: "EvidenceBoard", evidenceId: "audit-retention-order" }
			},
			{
				id: "private-thread",
				labelKey: "suspects.items.aRenMirror.facts.privateThread",
				sourceKey: "suspects.sources.renPrivate",
				unlock: { moduleId: "Chats", channel: "Ren-A.Ren" }
			}
		],
		reasons: [
			{
				id: "interpreted-audit-hold",
				labelKey: "suspects.items.aRenMirror.reasons.interpretedAuditHold"
			},
			{
				id: "had-mvoss-token",
				labelKey: "suspects.items.aRenMirror.reasons.hadMvossToken"
			},
			{
				id: "cloned-n-kade",
				labelKey: "suspects.items.aRenMirror.reasons.clonedNKade"
			}
		]
	}
];

export const REFLECTION_SUSPECTS = [
	{
		id: "helix-continuity-committee",
		nameKey: "suspects.items.helixContinuityCommittee.name",
		roleKey: "suspects.items.helixContinuityCommittee.role",
		questionKey: "suspects.items.helixContinuityCommittee.question",
		facts: [
			{
				id: "board-000-signature",
				labelKey: "suspects.items.helixContinuityCommittee.facts.board000Signature",
				sourceKey: "suspects.sources.board000Signature",
				unlock: { moduleId: "EvidenceBoard", evidenceId: "board-000-signature" }
			},
			{
				id: "omega-7-authorized",
				labelKey: "suspects.items.helixContinuityCommittee.facts.omega7Authorized",
				sourceKey: "suspects.sources.omega7Directive",
				unlock: { moduleId: "EvidenceBoard", evidenceId: "omega-7-directive" }
			},
			{
				id: "r7-preserved",
				labelKey: "suspects.items.helixContinuityCommittee.facts.r7Preserved",
				sourceKey: "suspects.sources.mirrorPrimeCore",
				unlock: { moduleId: "EvidenceBoard", evidenceId: "mirror-prime-core" }
			}
		],
		reasons: [
			{
				id: "board-000-authorized-omega-7",
				labelKey: "suspects.items.helixContinuityCommittee.reasons.board000AuthorizedOmega7",
				requiredFactIds: REFLECTION_CORE_SOLUTION.suspect.requiredFactIds
			},
			{
				id: "mara-alone",
				labelKey: "suspects.items.helixContinuityCommittee.reasons.maraAlone"
			},
			{
				id: "mirror-prime-acted-alone",
				labelKey: "suspects.items.helixContinuityCommittee.reasons.mirrorPrimeActedAlone"
			}
		]
	},
	{
		id: "selene-arendt",
		nameKey: "suspects.items.seleneArendt.name",
		roleKey: "suspects.items.seleneArendt.role",
		questionKey: "suspects.items.seleneArendt.question",
		facts: [
			{
				id: "replica-architecture",
				labelKey: "suspects.items.seleneArendt.facts.replicaArchitecture",
				sourceKey: "suspects.sources.replicaIntegrity",
				unlock: { moduleId: "EvidenceBoard", evidenceId: "replica-integrity-report" }
			},
			{
				id: "arendt-warning",
				labelKey: "suspects.items.seleneArendt.facts.arendtWarning",
				sourceKey: "suspects.sources.arendtStatement",
				unlock: { moduleId: "EvidenceBoard", evidenceId: "selene-arendt-statement" }
			}
		],
		reasons: [
			{
				id: "designed-replicas",
				labelKey: "suspects.items.seleneArendt.reasons.designedReplicas"
			},
			{
				id: "authorized-omega-7",
				labelKey: "suspects.items.seleneArendt.reasons.authorizedOmega7"
			},
			{
				id: "hid-board-signature",
				labelKey: "suspects.items.seleneArendt.reasons.hidBoardSignature"
			}
		]
	},
	{
		id: "mara-voss",
		nameKey: "suspects.items.maraVossReflection.name",
		roleKey: "suspects.items.maraVossReflection.role",
		questionKey: "suspects.items.maraVossReflection.question",
		facts: [
			{
				id: "mvoss-token",
				labelKey: "suspects.items.maraVossReflection.facts.mvossToken",
				sourceKey: "suspects.sources.mvoss01Token",
				unlock: { moduleId: "EvidenceBoard", evidenceId: "mvoss-01-admin-token" }
			},
			{
				id: "helix-can-burn",
				labelKey: "suspects.items.maraVossReflection.facts.helixCanBurn",
				sourceKey: "suspects.sources.helixCanBurn",
				unlock: { moduleId: "Emails", subject: "Helix can burn, R-7 cannot" }
			}
		],
		reasons: [
			{
				id: "executed-coverup",
				labelKey: "suspects.items.maraVossReflection.reasons.executedCoverup"
			},
			{
				id: "final-board-authority",
				labelKey: "suspects.items.maraVossReflection.reasons.finalBoardAuthority"
			},
			{
				id: "created-mirror-prime",
				labelKey: "suspects.items.maraVossReflection.reasons.createdMirrorPrime"
			}
		]
	},
	{
		id: "elias-ren",
		nameKey: "suspects.items.eliasRenReflection.name",
		roleKey: "suspects.items.eliasRenReflection.role",
		questionKey: "suspects.items.eliasRenReflection.question",
		facts: [
			{
				id: "model-choosing-exits",
				labelKey: "suspects.items.eliasRenReflection.facts.modelChoosingExits",
				sourceKey: "suspects.sources.modelExits",
				unlock: { moduleId: "Emails", subject: "The model is choosing exits" }
			},
			{
				id: "warning-chain",
				labelKey: "suspects.items.eliasRenReflection.facts.warningChain",
				sourceKey: "suspects.sources.renArendt",
				unlock: { moduleId: "Chats", channel: "Ren-S.Arendt" }
			}
		],
		reasons: [
			{
				id: "raised-model-alert",
				labelKey: "suspects.items.eliasRenReflection.reasons.raisedModelAlert"
			},
			{
				id: "signed-board-order",
				labelKey: "suspects.items.eliasRenReflection.reasons.signedBoardOrder"
			},
			{
				id: "owned-r7",
				labelKey: "suspects.items.eliasRenReflection.reasons.ownedR7"
			}
		]
	},
	{
		id: "i-rourke",
		nameKey: "suspects.items.iRourkeReflection.name",
		roleKey: "suspects.items.iRourkeReflection.role",
		questionKey: "suspects.items.iRourkeReflection.question",
		facts: [
			{
				id: "r7-route",
				labelKey: "suspects.items.iRourkeReflection.facts.r7Route",
				sourceKey: "suspects.sources.reflectionLabBlueprint",
				unlock: { moduleId: "EvidenceBoard", evidenceId: "reflection-lab-blueprint" }
			},
			{
				id: "relay-context",
				labelKey: "suspects.items.iRourkeReflection.facts.relayContext",
				sourceKey: "suspects.sources.relayOmega",
				unlock: { moduleId: "EvidenceBoard", evidenceId: "relay-omega-isolation-log" }
			}
		],
		reasons: [
			{
				id: "knew-r7-route",
				labelKey: "suspects.items.iRourkeReflection.reasons.knewR7Route"
			},
			{
				id: "authorized-committee",
				labelKey: "suspects.items.iRourkeReflection.reasons.authorizedCommittee"
			},
			{
				id: "built-replicas",
				labelKey: "suspects.items.iRourkeReflection.reasons.builtReplicas"
			}
		]
	},
	{
		id: "noah-kade",
		nameKey: "suspects.items.noahKadeReflection.name",
		roleKey: "suspects.items.noahKadeReflection.role",
		questionKey: "suspects.items.noahKadeReflection.question",
		facts: [
			{
				id: "prior-decoy",
				labelKey: "suspects.items.noahKadeReflection.facts.priorDecoy",
				sourceKey: "suspects.sources.nKadePriorDecoy",
				unlock: { moduleId: "EvidenceBoard", evidenceId: "lock-777-record" }
			},
			{
				id: "misdirection",
				labelKey: "suspects.items.noahKadeReflection.facts.misdirection",
				sourceKey: "suspects.sources.board000Signature",
				unlock: { moduleId: "EvidenceBoard", evidenceId: "board-000-signature" }
			}
		],
		reasons: [
			{
				id: "credential-again",
				labelKey: "suspects.items.noahKadeReflection.reasons.credentialAgain"
			},
			{
				id: "board-used-decoy",
				labelKey: "suspects.items.noahKadeReflection.reasons.boardUsedDecoy"
			},
			{
				id: "controlled-mirror-prime",
				labelKey: "suspects.items.noahKadeReflection.reasons.controlledMirrorPrime"
			}
		]
	},
	{
		id: "mirror-prime",
		nameKey: "suspects.items.mirrorPrime.name",
		roleKey: "suspects.items.mirrorPrime.role",
		questionKey: "suspects.items.mirrorPrime.question",
		facts: [
			{
				id: "lock-777",
				labelKey: "suspects.items.mirrorPrime.facts.lock777",
				sourceKey: "suspects.sources.lock777",
				unlock: { moduleId: "EvidenceBoard", evidenceId: "lock-777-record" }
			},
			{
				id: "executed-constraints",
				labelKey: "suspects.items.mirrorPrime.facts.executedConstraints",
				sourceKey: "suspects.sources.mirrorPrimeCore",
				unlock: { moduleId: "EvidenceBoard", evidenceId: "mirror-prime-core" }
			}
		],
		reasons: [
			{
				id: "locked-core",
				labelKey: "suspects.items.mirrorPrime.reasons.lockedCore"
			},
			{
				id: "human-authorized-first",
				labelKey: "suspects.items.mirrorPrime.reasons.humanAuthorizedFirst"
			},
			{
				id: "was-legal-board",
				labelKey: "suspects.items.mirrorPrime.reasons.wasLegalBoard"
			}
		]
	}
];

/** @param {string} chapterId */
export function suspectsForChapter(chapterId = CHAPTER_1_ID) {
	if (chapterId === CHAPTER_3_ID) return REFLECTION_SUSPECTS;
	return chapterId === CHAPTER_2_ID ? MIRROR_SUSPECTS : CHAPTER_SUSPECTS;
}

/** @param {string} chapterId */
export function suspectAccusationDecisionIdForChapter(chapterId = CHAPTER_1_ID) {
	return SUSPECT_ACCUSATION_DECISION_ID;
}

/** @param {string} chapterId */
export function suspectAccusationDeductionIdForChapter(chapterId = CHAPTER_1_ID) {
	if (chapterId === CHAPTER_3_ID) return REFLECTION_CORE_SOLUTION.suspect.deductionId;
	return chapterId === CHAPTER_2_ID ? MIRROR_PROJECT_SOLUTION.suspect.deductionId : HELIX_INCIDENT_SOLUTION.suspect.deductionId;
}

/** @param {string} chapterId */
export function correctSuspectIdForChapter(chapterId = CHAPTER_1_ID) {
	if (chapterId === CHAPTER_3_ID) return REFLECTION_CORE_SOLUTION.suspect.id;
	return chapterId === CHAPTER_2_ID ? MIRROR_PROJECT_SOLUTION.suspect.id : HELIX_INCIDENT_SOLUTION.suspect.id;
}

/** @param {string} chapterId */
export function correctSuspectReasonIdForChapter(chapterId = CHAPTER_1_ID) {
	if (chapterId === CHAPTER_3_ID) return REFLECTION_CORE_SOLUTION.suspect.reasonId;
	return chapterId === CHAPTER_2_ID ? MIRROR_PROJECT_SOLUTION.suspect.reasonId : HELIX_INCIDENT_SOLUTION.suspect.reasonId;
}

/**
 * @param {string} suspectId
 * @param {string} chapterId
 */
export function suspectForId(suspectId, chapterId = CHAPTER_1_ID) {
	return suspectsForChapter(chapterId).find((suspect) => suspect.id === suspectId) ?? null;
}

/**
 * @param {string} suspectId
 * @param {string} reasonId
 * @param {string[]} knownFactIds
 * @param {string} chapterId
 */
export function validateSuspectAccusation(suspectId, reasonId, knownFactIds = [], chapterId = CHAPTER_1_ID) {
	const suspect = suspectForId(suspectId, chapterId);
	if (!suspect) return { accepted: false, reason: "unknown-suspect", hintKey: "suspects.feedback.unknown" };

	const selectedReason = suspect.reasons.find((reason) => reason.id === reasonId);
	if (!selectedReason) return { accepted: false, reason: "unknown-reason", hintKey: "suspects.feedback.unknownReason" };

	if (suspectId !== correctSuspectIdForChapter(chapterId)) {
		return { accepted: false, reason: "wrong-suspect", hintKey: "suspects.feedback.wrongSuspect" };
	}

	if (reasonId !== correctSuspectReasonIdForChapter(chapterId)) {
		return { accepted: false, reason: "wrong-reason", hintKey: "suspects.feedback.wrongReason" };
	}

	const knownFacts = new Set(knownFactIds);
	const selectedReasonWithFacts = /** @type {Record<string, any>} */ (selectedReason);
	const requiredFactIds = Array.isArray(selectedReasonWithFacts.requiredFactIds) ? selectedReasonWithFacts.requiredFactIds : [];
	const missingFacts = requiredFactIds.filter(/** @param {string} factId */ (factId) => !knownFacts.has(factId));

	if (missingFacts.length) {
		return {
			accepted: false,
			reason: "insufficient-evidence",
			hintKey: "suspects.feedback.insufficientEvidence",
			missingFacts
		};
	}

	return {
		accepted: true,
		reason: "accepted",
		hintKey:
			chapterId === CHAPTER_3_ID
				? "suspects.feedback.reflectionAccepted"
				: chapterId === CHAPTER_2_ID
					? "suspects.feedback.mirrorAccepted"
					: "suspects.feedback.accepted"
	};
}
