export const DEBUG_CASE = true;

export const REFLECTION_CORE_SOLUTION = {
	id: "reflection-core",
	title: "Reflection Core",
	timeline: {
		deductionId: "reflection-sequence-reconstructed",
		correctOrder: [
			"audit-consent-chain-requested",
			"arendt-warns-individual-simulation",
			"mirror-prime-prediction-reliable",
			"omega-7-authorized",
			"helix-isolated-blackout-relay",
			"mirror-package-merged-r7",
			"helix-local-index-eliminated",
			"mirror-prime-locks-core"
		]
	},
	contradictions: [
		{
			id: "prime-continuity-identified-replicas",
			sourceIds: ["document:reflection-prime-statute", "document:replica-integrity-report"],
			correctExplanationId: "aggregate-vs-identified-replicas",
			deductionId: "mirror-built-human-decision-replicas",
			result:
				"The statute describes MIRROR PRIME as institutional continuity, but the integrity report proves identified employee decision replicas."
		},
		{
			id: "r7-archive-active-core",
			sourceIds: ["document:reflection-lab-blueprint", "system:R7-CORE-404"],
			correctExplanationId: "r7-was-active-core",
			deductionId: "reflection-lab-was-true-core",
			result: "The official blueprint presents R-7 as retention space, but the log proves active core compute during the blackout."
		},
		{
			id: "board-minutes-relay-omega",
			sourceIds: ["document:continuity-board-minutes", "system:RELAY-OMEGA"],
			correctExplanationId: "planned-isolation",
			deductionId: "omega-7-caused-blackout",
			result:
				"The minutes avoid naming a direct blackout action, but RELAY-OMEGA records a planned isolation sequence under OMEGA-7."
		},
		{
			id: "helix-burn-merge-survival",
			sourceIds: ["email:mara-helix-can-burn", "system:MERGE-909"],
			correctExplanationId: "purge-preserved-core",
			deductionId: "mirror-survived-in-r7",
			result:
				"Mara frames Helix loss as local containment, but MERGE-909 proves the MIRROR package survived and merged into Reflection Lab."
		}
	],
	connections: [
		{
			id: "replica-decision-link",
			evidenceIds: ["replica-integrity-report", "behavioral-replica-map"],
			deductionId: "mirror-built-human-decision-replicas",
			correctJustificationId: "shared-clue",
			requiredForChapter: true,
			result: "MIRROR modeled real employees precisely enough to anticipate decisions."
		},
		{
			id: "r7-core-link",
			evidenceIds: ["reflection-lab-blueprint", "r7-core-activity-log"],
			deductionId: "reflection-lab-was-true-core",
			correctJustificationId: "shared-clue",
			requiredForChapter: true,
			result: "Reflection Lab maintained core activity during the Helix blackout."
		},
		{
			id: "omega-relay-link",
			evidenceIds: ["omega-7-directive", "relay-omega-isolation-log"],
			deductionId: "omega-7-caused-blackout",
			correctJustificationId: "shared-clue",
			requiredForChapter: true,
			result: "The relay manipulation matches the OMEGA-7 isolation order."
		},
		{
			id: "mirror-prime-merge-link",
			evidenceIds: ["merge-909-export-trace", "mirror-prime-core"],
			deductionId: "mirror-data-survived",
			correctJustificationId: "shared-clue",
			requiredForChapter: true,
			result: "The exported package was integrated into MIRROR PRIME."
		},
		{
			id: "board-signature-link",
			evidenceIds: ["continuity-board-minutes", "board-000-signature"],
			deductionId: "continuity-board-final-decision",
			correctJustificationId: "shared-clue",
			requiredForChapter: true,
			result: "OMEGA-7 authorization is tied to the Continuity Board."
		},
		{
			id: "mvoss-subordinate-link",
			evidenceIds: ["mvoss-01-admin-token", "omega-7-directive"],
			deductionId: "mara-voss-executed-board-coverup",
			correctJustificationId: "shared-clue",
			requiredForChapter: true,
			result: "Mara Voss's purge fits as a subordinate phase of the board-approved protocol."
		}
	],
	requiredDeductions: [
		"mirror-built-human-decision-replicas",
		"reflection-lab-was-true-core",
		"omega-7-caused-blackout",
		"mirror-data-survived",
		"continuity-board-final-decision",
		"mara-voss-executed-board-coverup"
	],
	suspect: {
		id: "helix-continuity-committee",
		reasonId: "board-000-authorized-omega-7",
		deductionId: "continuity-board-authorized-reflection-core",
		requiredFactIds: ["board-000-signature", "omega-7-authorized", "r7-preserved"],
		motive:
			"The Continuity Board authorized OMEGA-7 through BOARD-000, preserving Reflection Lab, sacrificing Helix Labs, and allowing MIRROR PRIME to absorb the exported package."
	},
	suspects: [
		{
			id: "helix-continuity-committee",
			name: "Helix Continuity Board",
			role: "Executive authority",
			reading: "Canonical final decision maker.",
			factIds: ["board-000-signature", "omega-7-authorized", "r7-preserved"]
		},
		{
			id: "selene-arendt",
			name: "Dr. Selene Arendt",
			role: "Behavioral replica architect",
			reading: "Scientific architect who warned the project had crossed into individual simulation.",
			factIds: ["replica-architecture", "arendt-warning", "no-omega-signature"]
		},
		{
			id: "mara-voss",
			name: "Dr. Mara Voss",
			role: "Helix operations director",
			reading: "Operational cover-up executor, not sole final authority.",
			factIds: ["mvoss-token", "helix-can-burn", "subordinate-phase"]
		},
		{
			id: "elias-ren",
			name: "Elias Ren",
			role: "Systems analyst",
			reading: "Technical witness who flagged MIRROR PRIME behavior.",
			factIds: ["model-choosing-exits", "warning-chain", "no-board-signature"]
		},
		{
			id: "i-rourke",
			name: "I. Rourke",
			role: "Infrastructure supervisor",
			reading: "R-7 route witness, not executive decision maker.",
			factIds: ["r7-route", "relay-context", "no-omega-authority"]
		},
		{
			id: "noah-kade",
			name: "Noah Kade / N-KADE-17",
			role: "Credential decoy victim",
			reading: "Confirmed decoy from Chapter 2.",
			factIds: ["prior-decoy", "no-final-access", "misdirection"]
		},
		{
			id: "mirror-prime",
			name: "MIRROR PRIME",
			role: "Predictive system",
			reading: "Active system that locked the core after human authorization.",
			factIds: ["lock-777", "executed-constraints", "not-human-authority"]
		}
	],
	finalReportAnswers: {
		"mirror-final-form": ["behavioral-decision-replicas"],
		"helix-project-role": ["operational-facade"],
		"true-core-site": ["reflection-lab-r7"],
		"blackout-strategic-purpose": ["isolate-audit-cover-transfer"],
		"exported-package-fate": ["merged-into-mirror-prime"],
		"final-decision-maker": ["continuity-board"],
		"case-classification": ["deliberate-human-coverup"]
	}
};

const DEBUG_CASE_ENABLED = DEBUG_CASE && Boolean(import.meta.env?.DEV);

if (DEBUG_CASE_ENABLED && typeof console !== "undefined") {
	console.info("[DeadSignal debug] Reflection Core case bible", {
		correctTimeline: REFLECTION_CORE_SOLUTION.timeline.correctOrder,
		validContradictions: REFLECTION_CORE_SOLUTION.contradictions.map((contradiction) => ({
			id: contradiction.id,
			sourceIds: contradiction.sourceIds,
			result: contradiction.result
		})),
		validConnections: REFLECTION_CORE_SOLUTION.connections.map((connection) => ({
			id: connection.id,
			evidenceIds: connection.evidenceIds,
			result: connection.result
		})),
		correctSuspect: {
			id: REFLECTION_CORE_SOLUTION.suspect.id,
			reasonId: REFLECTION_CORE_SOLUTION.suspect.reasonId,
			motive: REFLECTION_CORE_SOLUTION.suspect.motive
		},
		finalReportAnswers: REFLECTION_CORE_SOLUTION.finalReportAnswers
	});
}
