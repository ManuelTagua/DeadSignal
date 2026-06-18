export const DEBUG_CASE = true;

export const MIRROR_PROJECT_SOLUTION = {
	id: "project-mirror",
	title: "Proyecto MIRROR",
	timeline: {
		deductionId: "mirror-sequence-reconstructed",
		correctOrder: [
			"mirror-audit-hold-active",
			"mirror-live-profile-sync",
			"mvoss-purge-window-authorized",
			"mirror-package-exported-r7",
			"n-kade-17-decoy-cloned",
			"mirror-audited-index-purged"
		]
	},
	contradictions: [
		{
			id: "mirror-anonymized-live-sync",
			sourceIds: ["document:mirror-charter-fragment", "system:MIRROR-114"],
			correctExplanationId: "charter-vs-live-profiles",
			deductionId: "mirror-used-live-profiles",
			result:
				"The charter describes MIRROR as anonymized analysis, but the log proves live synchronization of personal profiles."
		},
		{
			id: "audit-hold-purge-conflict",
			sourceIds: ["document:mirror-audit-hold", "system:PURGE-771"],
			correctExplanationId: "hold-forbids-purge",
			deductionId: "protected-evidence-was-destroyed",
			result: "The audit hold forbade deletion, but the audited MIRROR index was removed while the hold remained active."
		},
		{
			id: "kade-offsite-decoy-conflict",
			sourceIds: ["document:noah-kade-offsite-statement", "system:DECOY-017"],
			correctExplanationId: "offsite-vs-cloned-credential",
			deductionId: "n-kade-17-was-decoy",
			result:
				"Noah Kade could not have started the operation from Helix, but his credential was cloned temporarily to create a false trail."
		}
	],
	connections: [
		{
			id: "mirror-profile-map-link",
			sourceIds: ["document:mirror-charter-fragment", "document:mirror-subject-map"],
			evidenceIds: ["mirror-manifest-core", "mirror-behavioral-subject-map"],
			deductionId: "mirror-built-employee-behavioral-profiles",
			correctJustificationId: "shared-clue",
			requiredForChapter: true,
			result: "MIRROR built behavioral profiles of real employees."
		},
		{
			id: "audit-hold-purge-link",
			sourceIds: ["document:mirror-audit-hold", "system:PURGE-771"],
			evidenceIds: ["audit-retention-order", "mirror-purge-record"],
			deductionId: "audit-protected-evidence-destroyed",
			correctJustificationId: "shared-clue",
			requiredForChapter: true,
			result: "Someone deleted evidence protected by audit hold."
		},
		{
			id: "r7-export-link",
			sourceIds: ["document:mirror-r7-transfer-manifest", "system:EXPORT-332"],
			evidenceIds: ["r7-transfer-manifest", "mirror-export-package"],
			deductionId: "mirror-moved-to-reflection-lab",
			correctJustificationId: "shared-clue",
			requiredForChapter: true,
			result: "The MIRROR package was transferred to Reflection Lab / Sublevel R-7."
		},
		{
			id: "mvoss-token-purge-link",
			sourceIds: ["evidence:mirror-admin-token", "system:PURGE-771"],
			evidenceIds: ["mirror-admin-token", "mirror-purge-record"],
			deductionId: "mara-voss-authorized-purge",
			correctJustificationId: "shared-clue",
			requiredForChapter: true,
			result: "The purge is linked to Mara Voss's administrative authorization."
		},
		{
			id: "n-kade-decoy-link",
			sourceIds: ["evidence:n-kade-17-clone-record", "document:noah-kade-offsite-statement"],
			evidenceIds: ["n-kade-17-clone-record", "n-kade-offsite-statement"],
			deductionId: "n-kade-17-decoy-trail",
			correctJustificationId: "shared-clue",
			requiredForChapter: true,
			result: "The N-KADE-17 credential acted as a decoy, not sufficient proof against Noah Kade."
		}
	],
	requiredDeductions: [
		"mirror-built-employee-behavioral-profiles",
		"audit-protected-evidence-destroyed",
		"mirror-moved-to-reflection-lab",
		"mara-voss-authorized-purge",
		"n-kade-17-decoy-trail"
	],
	suspect: {
		id: "mara-voss",
		reasonId: "mvoss-token-purge-during-hold",
		deductionId: "mirror-coverup-author",
		requiredFactIds: ["mvoss-token", "audit-hold-active", "mirror-exported-r7"],
		motive:
			"Her MVOSS-01 administrative token authorized the MIRROR index purge while the audit hold was active, after the package had already been exported to Reflection Lab."
	},
	suspects: [
		{
			id: "mara-voss",
			name: "Dr. Mara Voss",
			role: "Helix Labs operations director",
			reading: "Primary suspect.",
			factIds: ["mvoss-token", "containment-email", "reflection-lab-authority"]
		},
		{
			id: "elias-ren",
			name: "Elias Ren",
			role: "Systems analyst",
			reading: "Technical witness and alert source, not purge author.",
			factIds: ["mirror-still-answering", "not-a-backup", "recoverable-fragments"]
		},
		{
			id: "noah-kade",
			name: "Noah Kade / N-KADE-17",
			role: "Access technician",
			reading: "Operational decoy, not Chapter 2 principal suspect.",
			factIds: ["credential-cloned", "offsite-statement", "late-decoy-marker"]
		},
		{
			id: "i-rourke",
			name: "I. Rourke",
			role: "Maintenance supervision",
			reading: "Hidden-installation context source, not purge executor.",
			factIds: ["r7-route-knowledge", "no-maintenance-ticket", "no-purge-signature"]
		},
		{
			id: "a-ren",
			name: "A. Ren",
			role: "Internal audit / systems",
			reading: "Helps interpret the audit hold contradiction.",
			factIds: ["private-thread", "audit-hold-active", "no-global-purge-token"]
		}
	],
	finalReportAnswers: {
		"mirror-real-function": ["live-behavioral-employee-profiles"],
		"hidden-operation": ["mirror-export-r7-and-index-purge"],
		"direct-purge-actor": ["mara-voss-mvoss-01"],
		"n-kade-decoy-proof": ["clone-record-offsite-statement"],
		"mirror-continuation-site": ["reflection-lab-r7"],
		"data-destruction-classification": ["deliberate-coverup"]
	}
};

const DEBUG_CASE_ENABLED = DEBUG_CASE && Boolean(import.meta.env?.DEV);

if (DEBUG_CASE_ENABLED && typeof console !== "undefined") {
	console.info("[DeadSignal debug] Proyecto MIRROR case bible", {
		correctTimeline: MIRROR_PROJECT_SOLUTION.timeline.correctOrder,
		validContradictions: MIRROR_PROJECT_SOLUTION.contradictions.map((contradiction) => ({
			id: contradiction.id,
			sourceIds: contradiction.sourceIds,
			result: contradiction.result
		})),
		validConnections: MIRROR_PROJECT_SOLUTION.connections.map((connection) => ({
			id: connection.id,
			evidenceIds: connection.evidenceIds,
			result: connection.result
		})),
		correctSuspect: {
			id: MIRROR_PROJECT_SOLUTION.suspect.id,
			reasonId: MIRROR_PROJECT_SOLUTION.suspect.reasonId,
			motive: MIRROR_PROJECT_SOLUTION.suspect.motive
		},
		finalReportAnswers: MIRROR_PROJECT_SOLUTION.finalReportAnswers
	});
}
