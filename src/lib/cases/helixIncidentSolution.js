export const DEBUG_CASE = true;

export const HELIX_INCIDENT_SOLUTION = {
	id: "the-helix-incident",
	title: "The Helix Incident",
	timeline: {
		deductionId: "blackout-timeline-reconstructed",
		correctOrder: [
			"maintenance-window-prepared",
			"sublevel-c-occupancy-spike",
			"east-archive-contradictory-access",
			"n-kade-login-c17",
			"camera-integrity-failure",
			"external-relay-connection-loss"
		]
	},
	contradictions: [
		{
			id: "kade-credential-active",
			sourceIds: ["document:employee-roster-delta", "evidence:login-anomaly-n-kade-17"],
			correctExplanationId: "active-offshift",
			deductionId: "credential-operational-mismatch",
			result: "The credential is active while the employee was off shift."
		},
		{
			id: "maintenance-window-overrun",
			sourceIds: ["document:initial-incident-brief", "system:NET-900"],
			correctExplanationId: "after-official-window",
			deductionId: "maintenance-window-overrun",
			result: "The relay drops after the official maintenance window."
		}
	],
	connections: [
		{
			id: "access-phrase-link",
			evidenceIds: ["server-room-knock-pattern", "encrypted-fragment-01"],
			deductionId: "access-phrase",
			correctJustificationId: "shared-clue",
			requiredForChapter: true,
			result: "KNOCK-3 was an access phrase."
		},
		{
			id: "archive-route-link",
			evidenceIds: ["east-archive-breach", "east-archive-access-map"],
			deductionId: "archive-route-access",
			correctJustificationId: "shared-clue",
			requiredForChapter: true,
			result: "An alternate physical route existed toward the East Archive."
		},
		{
			id: "duplicate-login-link",
			evidenceIds: ["duplicate-credential", "login-anomaly-n-kade-17"],
			correctJustificationId: "shared-clue",
			requiredForChapter: true,
			result: "The same credential is linked to an impossible session."
		},
		{
			id: "maintenance-relay-link",
			evidenceIds: ["relay-failure-report", "power-relay-maintenance-report"],
			deductionId: "maintenance-reroute",
			correctJustificationId: "shared-clue",
			requiredForChapter: true,
			result: "The failure coincides with manipulation during maintenance."
		}
	],
	requiredDeductions: ["access-phrase", "maintenance-reroute"],
	suspect: {
		id: "n-kade-17",
		reasonId: "credential-offshift-terminal",
		deductionId: "internal-involvement",
		requiredFactIds: ["duplicate-credential", "terminal-c17", "off-shift"],
		motive: "The credential appears active outside duty context from a relevant terminal."
	},
	finalReportAnswers: {
		"blackout-cause": ["maintenance-relay-manipulation"],
		"key-zone": ["east-archive-server-room"],
		"suspicious-credential": ["n-kade-17"],
		"internal-access-proof": ["duplicate-credential-login-anomaly"],
		"incident-intent": ["deliberate"]
	}
};

const DEBUG_CASE_ENABLED = DEBUG_CASE && Boolean(import.meta.env?.DEV);

if (DEBUG_CASE_ENABLED && typeof console !== "undefined") {
	console.info("[DeadSignal debug] Helix Incident case bible", {
		correctTimeline: HELIX_INCIDENT_SOLUTION.timeline.correctOrder,
		validContradictions: HELIX_INCIDENT_SOLUTION.contradictions.map((contradiction) => ({
			id: contradiction.id,
			sourceIds: contradiction.sourceIds,
			result: contradiction.result
		})),
		validConnections: HELIX_INCIDENT_SOLUTION.connections.map((connection) => ({
			id: connection.id,
			evidenceIds: connection.evidenceIds,
			result: connection.result
		})),
		correctSuspect: {
			id: HELIX_INCIDENT_SOLUTION.suspect.id,
			reasonId: HELIX_INCIDENT_SOLUTION.suspect.reasonId,
			motive: HELIX_INCIDENT_SOLUTION.suspect.motive
		},
		finalReportAnswers: HELIX_INCIDENT_SOLUTION.finalReportAnswers
	});
}
