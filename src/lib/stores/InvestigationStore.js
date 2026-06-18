import { browser } from "$app/environment";
import { CHAPTER_1_ID } from "$lib/game/chapters";
import { connectionKey, correctConnectionFor, validateConnectionAttempt } from "$lib/game/deductions";
import { get, writable } from "svelte/store";

const STORAGE_KEY = "deadsignal.investigation.v1";
const SIMULATED_START = Date.parse("2041-10-09T03:46:00.000Z");
export const CASE_INTEGRITY_MAX = 100;
export const CASE_DECISION_MAX_ATTEMPTS = 2;
export const CASE_INTEGRITY_PENALTIES = {
	invalidConnection: 8,
	wrongJustification: 10,
	contradiction: 16,
	suspectAccusation: 20,
	finalReport: 20,
	repeatedPuzzleMistake: 10
};

export function createDefaultChapterInvestigation() {
	return {
		connections: [],
		notes: [],
		unlockedDeductions: {},
		milestones: {},
		failedConnectionStreak: 0,
		caseIntegrity: createDefaultCaseIntegrity(),
		decisionAttempts: {},
		completedDecisions: {},
		puzzleMistakes: {},
		confirmedContradictions: {},
		timeline: createDefaultTimeline(),
		suspectAccusation: createDefaultSuspectAccusation()
	};
}

function createDefaultInvestigation() {
	return {
		version: 1,
		...createDefaultChapterInvestigation(),
		chapters: {}
	};
}

export const investigation = writable(/** @type {Record<string, any>} */ (browser ? loadInvestigation() : createDefaultInvestigation()));

if (browser) {
	investigation.subscribe((state) => {
		saveInvestigation(state);
	});
}

export function initInvestigation() {
	if (!browser) return;
	investigation.set(loadInvestigation());
}

export function resetInvestigation() {
	investigation.set(createDefaultInvestigation());
}

export function createDefaultCaseIntegrity() {
	return {
		value: CASE_INTEGRITY_MAX,
		failures: 0,
		lastReason: null,
		lastChangedAt: null
	};
}

export function createDefaultTimeline() {
	return {
		order: [],
		completed: false,
		completedAt: null,
		attempts: 0
	};
}

export function createDefaultSuspectAccusation() {
	return {
		suspectId: null,
		reasonId: null,
		accepted: false,
		acceptedAt: null,
		attempts: 0,
		lastRejectedReason: null,
		history: []
	};
}

/** @param {number} value */
export function caseIntegrityStatus(value) {
	if (value <= 0) return "failed";
	if (value <= 39) return "critical";
	if (value <= 74) return "compromised";
	return "stable";
}

/**
 * @param {Record<string, any>} state
 * @param {string} chapterId
 */
export function investigationForChapter(state, chapterId = CHAPTER_1_ID) {
	if (chapterId === CHAPTER_1_ID) return normalizeChapterInvestigation(state, chapterId);
	return normalizeChapterInvestigation(state?.chapters?.[chapterId], chapterId);
}

/**
 * @param {string} decisionId
 * @param {number} penalty
 * @param {string} chapterId
 */
export function recordDecisionFailure(decisionId, penalty, chapterId = CHAPTER_1_ID) {
	const rootState = get(investigation);
	const chapterState = investigationForChapter(rootState, chapterId);
	const attempts = chapterState.decisionAttempts?.[decisionId] ?? 0;

	if (chapterState.completedDecisions?.[decisionId]) {
		return {
			accepted: false,
			blocked: true,
			reason: "already-completed",
			attempts,
			attemptsRemaining: 0,
			integrityLoss: null
		};
	}

	if (attempts >= CASE_DECISION_MAX_ATTEMPTS) {
		return {
			accepted: false,
			blocked: true,
			reason: "attempts-exhausted",
			attempts,
			attemptsRemaining: 0,
			integrityLoss: null
		};
	}

	const nextAttempts = attempts + 1;
	const integrityResult = applyIntegrityLoss(chapterState, penalty, `decision:${decisionId}`);
	const nextChapterState = {
		...chapterState,
		...integrityResult.state,
		decisionAttempts: {
			...(chapterState.decisionAttempts ?? {}),
			[decisionId]: nextAttempts
		}
	};

	investigation.set(setInvestigationForChapter(rootState, chapterId, nextChapterState));

	return {
		accepted: false,
		blocked: false,
		reason: "rejected",
		attempts: nextAttempts,
		attemptsRemaining: Math.max(0, CASE_DECISION_MAX_ATTEMPTS - nextAttempts),
		integrityLoss: integrityResult.loss
	};
}

/**
 * @param {string} decisionId
 * @param {string} chapterId
 */
export function recordDecisionSuccess(decisionId, chapterId = CHAPTER_1_ID) {
	const rootState = get(investigation);
	const chapterState = investigationForChapter(rootState, chapterId);

	if (chapterState.completedDecisions?.[decisionId]) {
		return { accepted: true, created: false, attempts: chapterState.decisionAttempts?.[decisionId] ?? 0 };
	}

	const nextChapterState = {
		...chapterState,
		completedDecisions: {
			...(chapterState.completedDecisions ?? {}),
			[decisionId]: true
		}
	};

	investigation.set(setInvestigationForChapter(rootState, chapterId, nextChapterState));

	return { accepted: true, created: true, attempts: chapterState.decisionAttempts?.[decisionId] ?? 0 };
}

/**
 * @param {string} puzzleId
 * @param {number} threshold
 * @param {string} chapterId
 */
export function recordPuzzleMistake(puzzleId, threshold = 3, chapterId = CHAPTER_1_ID) {
	const rootState = get(investigation);
	const chapterState = investigationForChapter(rootState, chapterId);
	const mistakes = (chapterState.puzzleMistakes?.[puzzleId] ?? 0) + 1;
	const shouldPenalize = mistakes > 0 && mistakes % threshold === 0;
	const integrityResult = shouldPenalize
		? applyIntegrityLoss(chapterState, CASE_INTEGRITY_PENALTIES.repeatedPuzzleMistake, `puzzle:${puzzleId}`)
		: { state: {}, loss: null };
	const nextChapterState = {
		...chapterState,
		...integrityResult.state,
		puzzleMistakes: {
			...(chapterState.puzzleMistakes ?? {}),
			[puzzleId]: mistakes
		}
	};

	investigation.set(setInvestigationForChapter(rootState, chapterId, nextChapterState));

	return { mistakes, penalized: shouldPenalize, integrityLoss: integrityResult.loss };
}

/**
 * @param {string} puzzleId
 * @param {string} chapterId
 */
export function clearPuzzleMistakes(puzzleId, chapterId = CHAPTER_1_ID) {
	const rootState = get(investigation);
	const chapterState = investigationForChapter(rootState, chapterId);

	if (!chapterState.puzzleMistakes?.[puzzleId]) return false;

	const nextChapterState = {
		...chapterState,
		puzzleMistakes: {
			...(chapterState.puzzleMistakes ?? {}),
			[puzzleId]: 0
		}
	};

	investigation.set(setInvestigationForChapter(rootState, chapterId, nextChapterState));

	return true;
}

/**
 * @param {string} contradictionId
 * @param {string} deductionId
 * @param {string} chapterId
 */
export function confirmContradiction(contradictionId, deductionId, chapterId = CHAPTER_1_ID) {
	const rootState = get(investigation);
	const chapterState = investigationForChapter(rootState, chapterId);
	const existing = chapterState.confirmedContradictions?.[contradictionId];

	if (existing) {
		return { accepted: true, created: false, contradiction: existing };
	}

	const confirmedCount = Object.keys(chapterState.confirmedContradictions ?? {}).length;
	const contradiction = {
		id: contradictionId,
		deductionId,
		confirmedAt: simulatedTimestamp(chapterState.connections.length + chapterState.notes.length + confirmedCount)
	};
	const nextChapterState = {
		...chapterState,
		confirmedContradictions: {
			...(chapterState.confirmedContradictions ?? {}),
			[contradictionId]: contradiction
		},
		unlockedDeductions: {
			...(chapterState.unlockedDeductions ?? {}),
			[deductionId]: true
		}
	};

	investigation.set(setInvestigationForChapter(rootState, chapterId, nextChapterState));

	return { accepted: true, created: true, contradiction };
}

/**
 * @param {string} reason
 * @param {number} penalty
 * @param {string} chapterId
 */
export function rejectContradiction(reason, penalty, chapterId = CHAPTER_1_ID) {
	const rootState = get(investigation);
	const chapterState = investigationForChapter(rootState, chapterId);
	const integrityResult = applyIntegrityLoss(chapterState, penalty, `contradiction:${reason}`);
	const nextChapterState = {
		...chapterState,
		...integrityResult.state
	};

	investigation.set(setInvestigationForChapter(rootState, chapterId, nextChapterState));

	return {
		accepted: false,
		reason,
		integrityLoss: integrityResult.loss
	};
}

/**
 * @param {string[]} order
 * @param {string} chapterId
 */
export function setTimelineOrder(order, chapterId = CHAPTER_1_ID) {
	const rootState = get(investigation);
	const chapterState = investigationForChapter(rootState, chapterId);
	const sanitizedOrder = normalizeIdList(order);
	const nextChapterState = {
		...chapterState,
		timeline: {
			...normalizeTimeline(chapterState.timeline),
			order: sanitizedOrder
		}
	};

	investigation.set(setInvestigationForChapter(rootState, chapterId, nextChapterState));

	return sanitizedOrder;
}

/**
 * @param {string} deductionId
 * @param {string} chapterId
 */
export function completeTimeline(deductionId, chapterId = CHAPTER_1_ID) {
	const rootState = get(investigation);
	const chapterState = investigationForChapter(rootState, chapterId);
	const timeline = normalizeTimeline(chapterState.timeline);

	if (timeline.completed) {
		return { accepted: true, created: false, timeline };
	}

	const completedTimeline = {
		...timeline,
		completed: true,
		completedAt: simulatedTimestamp(
			chapterState.connections.length + chapterState.notes.length + Object.keys(chapterState.confirmedContradictions ?? {}).length
		)
	};
	const nextChapterState = {
		...chapterState,
		timeline: completedTimeline,
		unlockedDeductions: {
			...(chapterState.unlockedDeductions ?? {}),
			[deductionId]: true
		}
	};

	investigation.set(setInvestigationForChapter(rootState, chapterId, nextChapterState));

	return { accepted: true, created: true, timeline: completedTimeline };
}

/**
 * @param {string} reason
 * @param {number} penalty
 * @param {string} chapterId
 */
export function rejectTimeline(reason, penalty, chapterId = CHAPTER_1_ID) {
	const rootState = get(investigation);
	const chapterState = investigationForChapter(rootState, chapterId);
	const timeline = normalizeTimeline(chapterState.timeline);
	const integrityResult = applyIntegrityLoss(chapterState, penalty, `timeline:${reason}`);
	const nextChapterState = {
		...chapterState,
		...integrityResult.state,
		timeline: {
			...timeline,
			attempts: timeline.attempts + 1
		}
	};

	investigation.set(setInvestigationForChapter(rootState, chapterId, nextChapterState));

	return {
		accepted: false,
		reason,
		integrityLoss: integrityResult.loss
	};
}

/**
 * @param {string} suspectId
 * @param {string} reasonId
 * @param {string} deductionId
 * @param {string} decisionId
 * @param {string} chapterId
 */
export function acceptSuspectAccusation(suspectId, reasonId, deductionId, decisionId = "suspect", chapterId = CHAPTER_1_ID) {
	const rootState = get(investigation);
	const chapterState = investigationForChapter(rootState, chapterId);
	const accusation = normalizeSuspectAccusation(chapterState.suspectAccusation);

	if (accusation.accepted) {
		return { accepted: true, created: false, blocked: false, accusation };
	}

	if (accusation.attempts >= CASE_DECISION_MAX_ATTEMPTS) {
		return {
			accepted: false,
			created: false,
			blocked: true,
			reason: "attempts-exhausted",
			attempts: accusation.attempts,
			attemptsRemaining: 0,
			integrityLoss: null
		};
	}

	const nextAttempts = accusation.attempts + 1;
	const acceptedAt = simulatedTimestamp(
		chapterState.connections.length + chapterState.notes.length + Object.keys(chapterState.confirmedContradictions ?? {}).length + nextAttempts
	);
	const acceptedAccusation = {
		...accusation,
		suspectId,
		reasonId,
		accepted: true,
		acceptedAt,
		attempts: nextAttempts,
		lastRejectedReason: null,
		history: [
			...accusation.history,
			{
				suspectId,
				reasonId,
				accepted: true,
				reason: "accepted",
				attemptedAt: acceptedAt
			}
		].slice(-6)
	};
	const nextChapterState = {
		...chapterState,
		suspectAccusation: acceptedAccusation,
		unlockedDeductions: {
			...(chapterState.unlockedDeductions ?? {}),
			[deductionId]: true
		},
		decisionAttempts: {
			...(chapterState.decisionAttempts ?? {}),
			[decisionId]: nextAttempts
		},
		completedDecisions: {
			...(chapterState.completedDecisions ?? {}),
			[decisionId]: true
		}
	};

	investigation.set(setInvestigationForChapter(rootState, chapterId, nextChapterState));

	return {
		accepted: true,
		created: true,
		blocked: false,
		accusation: acceptedAccusation,
		attempts: nextAttempts,
		attemptsRemaining: Math.max(0, CASE_DECISION_MAX_ATTEMPTS - nextAttempts)
	};
}

/**
 * @param {string} suspectId
 * @param {string} reasonId
 * @param {string} reason
 * @param {number} penalty
 * @param {string} decisionId
 * @param {string} chapterId
 */
export function rejectSuspectAccusation(suspectId, reasonId, reason, penalty, decisionId = "suspect", chapterId = CHAPTER_1_ID) {
	const rootState = get(investigation);
	const chapterState = investigationForChapter(rootState, chapterId);
	const accusation = normalizeSuspectAccusation(chapterState.suspectAccusation);

	if (accusation.accepted) {
		return {
			accepted: false,
			blocked: true,
			reason: "already-accepted",
			attempts: accusation.attempts,
			attemptsRemaining: 0,
			integrityLoss: null
		};
	}

	if (accusation.attempts >= CASE_DECISION_MAX_ATTEMPTS) {
		return {
			accepted: false,
			blocked: true,
			reason: "attempts-exhausted",
			attempts: accusation.attempts,
			attemptsRemaining: 0,
			integrityLoss: null
		};
	}

	const nextAttempts = accusation.attempts + 1;
	const attemptedAt = simulatedTimestamp(
		chapterState.connections.length + chapterState.notes.length + Object.keys(chapterState.confirmedContradictions ?? {}).length + nextAttempts
	);
	const integrityResult = applyIntegrityLoss(chapterState, penalty, `suspect:${reason}`);
	const nextChapterState = {
		...chapterState,
		...integrityResult.state,
		suspectAccusation: {
			...accusation,
			suspectId,
			reasonId,
			accepted: false,
			attempts: nextAttempts,
			lastRejectedReason: reason,
			history: [
				...accusation.history,
				{
					suspectId,
					reasonId,
					accepted: false,
					reason,
					attemptedAt
				}
			].slice(-6)
		},
		decisionAttempts: {
			...(chapterState.decisionAttempts ?? {}),
			[decisionId]: nextAttempts
		}
	};

	investigation.set(setInvestigationForChapter(rootState, chapterId, nextChapterState));

	return {
		accepted: false,
		blocked: false,
		reason,
		attempts: nextAttempts,
		attemptsRemaining: Math.max(0, CASE_DECISION_MAX_ATTEMPTS - nextAttempts),
		integrityLoss: integrityResult.loss
	};
}

/**
 * @param {string} firstEvidenceId
 * @param {string} secondEvidenceId
 * @param {string} justificationId
 * @param {string} chapterId
 */
export function addConnection(firstEvidenceId, secondEvidenceId, justificationId = "", chapterId = CHAPTER_1_ID) {
	const normalizedFirst = normalizeEvidenceId(firstEvidenceId);
	const normalizedSecond = normalizeEvidenceId(secondEvidenceId);

	if (!normalizedFirst || !normalizedSecond || normalizedFirst === normalizedSecond) {
		return recordConnectionFailure("invalid", chapterId);
	}

	const rootState = get(investigation);
	const chapterState = investigationForChapter(rootState, chapterId);
	const key = connectionKey(normalizedFirst, normalizedSecond);
	const currentConnections = verifiedConnections(chapterState.connections, chapterId);
	const existing = currentConnections.find(
		/** @param {Record<string, any>} connection */ (connection) => connection.key === key
	);

	if (existing) {
		return {
			accepted: false,
			created: false,
			reason: "duplicate",
			connection: existing,
			failedConnectionStreak: chapterState.failedConnectionStreak ?? 0
		};
	}

	const validation = validateConnectionAttempt(normalizedFirst, normalizedSecond, justificationId, chapterId);

	if (!validation.accepted || !validation.rule) {
		return recordConnectionFailure(validation.reason, chapterId);
	}

	const connection = {
		id: `connection-${key}`,
		key,
		evidenceIds: [normalizedFirst, normalizedSecond],
		createdAt: simulatedTimestamp(chapterState.connections.length + chapterState.notes.length),
		correct: true,
		verified: true,
		connectionRuleId: validation.rule.id,
		deductionId: validation.rule.deductionId,
		reasonKey: validation.rule.reasonKey,
		justificationId
	};
	const nextChapterState = {
		...chapterState,
		failedConnectionStreak: 0,
		connections: [...currentConnections, connection]
	};

	investigation.set(setInvestigationForChapter(rootState, chapterId, nextChapterState));

	return { accepted: true, created: true, connection };
}

/**
 * @param {{ body: string, tags?: string[] }} note
 * @param {string} chapterId
 */
export function createNote(note, chapterId = CHAPTER_1_ID) {
	const rootState = get(investigation);
	const chapterState = investigationForChapter(rootState, chapterId);
	const cleanBody = note.body.trim();

	if (!cleanBody) return null;

	const createdAt = simulatedTimestamp(chapterState.notes.length + chapterState.connections.length);
	const item = {
		id: `note-${Date.now().toString(36)}-${chapterState.notes.length + 1}`,
		body: cleanBody,
		tags: normalizeTags(note.tags ?? []),
		createdAt,
		updatedAt: createdAt
	};
	const nextChapterState = {
		...chapterState,
		notes: [item, ...chapterState.notes]
	};

	investigation.set(setInvestigationForChapter(rootState, chapterId, nextChapterState));

	return item;
}

/**
 * @param {string} noteId
 * @param {{ body: string, tags?: string[] }} updates
 * @param {string} chapterId
 */
export function updateNote(noteId, updates, chapterId = CHAPTER_1_ID) {
	const rootState = get(investigation);
	const chapterState = investigationForChapter(rootState, chapterId);
	const cleanBody = updates.body.trim();

	if (!cleanBody) return false;

	let changed = false;
	const notes = chapterState.notes.map(/** @param {Record<string, any>} note */ (note) => {
		if (note.id !== noteId) return note;
		changed = true;
		return {
			...note,
			body: cleanBody,
			tags: normalizeTags(updates.tags ?? []),
			updatedAt: simulatedTimestamp(chapterState.notes.length + chapterState.connections.length + 1)
		};
	});

	if (!changed) return false;

	investigation.set(setInvestigationForChapter(rootState, chapterId, { ...chapterState, notes }));

	return true;
}

/**
 * @param {string} noteId
 * @param {string} chapterId
 */
export function deleteNote(noteId, chapterId = CHAPTER_1_ID) {
	const rootState = get(investigation);
	const chapterState = investigationForChapter(rootState, chapterId);
	const notes = chapterState.notes.filter(/** @param {Record<string, any>} note */ (note) => note.id !== noteId);

	if (notes.length === chapterState.notes.length) return false;

	investigation.set(setInvestigationForChapter(rootState, chapterId, { ...chapterState, notes }));

	return true;
}

/**
 * @param {string} deductionId
 * @param {string} chapterId
 */
export function unlockDeduction(deductionId, chapterId = CHAPTER_1_ID) {
	const rootState = get(investigation);
	const chapterState = investigationForChapter(rootState, chapterId);

	if (chapterState.unlockedDeductions[deductionId]) return false;

	const nextChapterState = {
		...chapterState,
		unlockedDeductions: {
			...chapterState.unlockedDeductions,
			[deductionId]: true
		}
	};

	investigation.set(setInvestigationForChapter(rootState, chapterId, nextChapterState));

	return true;
}

/**
 * @param {string} milestoneId
 * @param {string} chapterId
 */
export function markMilestone(milestoneId, chapterId = CHAPTER_1_ID) {
	const rootState = get(investigation);
	const chapterState = investigationForChapter(rootState, chapterId);

	if (chapterState.milestones[milestoneId]) return false;

	const nextChapterState = {
		...chapterState,
		milestones: {
			...chapterState.milestones,
			[milestoneId]: true
		}
	};

	investigation.set(setInvestigationForChapter(rootState, chapterId, nextChapterState));

	return true;
}

/**
 * @param {string} reason
 * @param {string} chapterId
 */
function recordConnectionFailure(reason, chapterId = CHAPTER_1_ID) {
	const rootState = get(investigation);
	const chapterState = investigationForChapter(rootState, chapterId);
	const failedConnectionStreak = (chapterState.failedConnectionStreak ?? 0) + 1;
	const speculationDiscarded = failedConnectionStreak >= 3;
	const integrityResult = connectionFailurePenalty(reason)
		? applyIntegrityLoss(chapterState, connectionFailurePenalty(reason), `connection:${reason}`)
		: { state: {}, loss: null };
	const nextChapterState = {
		...chapterState,
		...integrityResult.state,
		failedConnectionStreak: speculationDiscarded ? 0 : failedConnectionStreak,
		connections: verifiedConnections(chapterState.connections, chapterId)
	};

	investigation.set(setInvestigationForChapter(rootState, chapterId, nextChapterState));

	return {
		accepted: false,
		created: false,
		reason,
		failedConnectionStreak,
		speculationDiscarded,
		integrityLoss: integrityResult.loss
	};
}

/** @param {string} evidenceId */
function normalizeEvidenceId(evidenceId) {
	return evidenceId.replace(/^EvidenceBoard:/, "").trim();
}

/** @param {string[]} tags */
function normalizeTags(tags) {
	return Array.from(new Set(tags.map((tag) => tag.trim()).filter(Boolean)));
}

/** @param {number} offset */
function simulatedTimestamp(offset) {
	return new Date(SIMULATED_START + offset * 73_000).toISOString();
}

function loadInvestigation() {
	try {
		const rawInvestigation = localStorage.getItem(STORAGE_KEY);
		const parsed = rawInvestigation ? JSON.parse(rawInvestigation) : createDefaultInvestigation();
		const rootChapter = normalizeChapterInvestigation(parsed, CHAPTER_1_ID);

		return {
			version: 1,
			...rootChapter,
			chapters: normalizeChapters(parsed.chapters)
		};
	} catch {
		return createDefaultInvestigation();
	}
}

/** @param {Record<string, any> | null | undefined} chapters */
function normalizeChapters(chapters) {
	if (!chapters || typeof chapters !== "object") return {};

	return Object.fromEntries(
		Object.entries(chapters).map(([chapterId, chapterState]) => [
			chapterId,
			normalizeChapterInvestigation(chapterState, chapterId)
		])
	);
}

/**
 * @param {Record<string, any> | null | undefined} chapterState
 * @param {string} chapterId
 */
function normalizeChapterInvestigation(chapterState, chapterId = CHAPTER_1_ID) {
	const fallback = createDefaultChapterInvestigation();
	const parsed = chapterState && typeof chapterState === "object" ? chapterState : {};

	return {
		connections: Array.isArray(parsed.connections) ? normalizeConnections(parsed.connections, chapterId) : [],
		notes: Array.isArray(parsed.notes) ? parsed.notes : [],
		unlockedDeductions: parsed.unlockedDeductions ?? fallback.unlockedDeductions,
		milestones: parsed.milestones ?? fallback.milestones,
		failedConnectionStreak: parsed.failedConnectionStreak ?? fallback.failedConnectionStreak,
		caseIntegrity: normalizeCaseIntegrity(parsed.caseIntegrity),
		decisionAttempts: parsed.decisionAttempts ?? fallback.decisionAttempts,
		completedDecisions: parsed.completedDecisions ?? fallback.completedDecisions,
		puzzleMistakes: parsed.puzzleMistakes ?? fallback.puzzleMistakes,
		confirmedContradictions: normalizeConfirmedContradictions(parsed.confirmedContradictions),
		timeline: normalizeTimeline(parsed.timeline),
		suspectAccusation: normalizeSuspectAccusation(parsed.suspectAccusation)
	};
}

/**
 * @param {Record<string, any>} state
 * @param {string} chapterId
 * @param {Record<string, any>} chapterState
 * @returns {Record<string, any>}
 */
function setInvestigationForChapter(state, chapterId, chapterState) {
	const normalizedChapter = normalizeChapterInvestigation(chapterState, chapterId);
	const chapters = normalizeChapters(state.chapters);
	const rootState = {
		version: state.version ?? 1,
		...state
	};

	if (chapterId === CHAPTER_1_ID) {
		return {
			...rootState,
			...normalizedChapter,
			chapters
		};
	}

	return {
		...rootState,
		chapters: {
			...chapters,
			[chapterId]: normalizedChapter
		}
	};
}

/** @param {Record<string, any> | null | undefined} caseIntegrity */
function normalizeCaseIntegrity(caseIntegrity) {
	const fallback = createDefaultCaseIntegrity();
	const rawValue = Number(caseIntegrity?.value ?? CASE_INTEGRITY_MAX);
	const value = Number.isFinite(rawValue) ? Math.max(0, Math.min(CASE_INTEGRITY_MAX, Math.round(rawValue))) : CASE_INTEGRITY_MAX;

	return {
		...fallback,
		...(caseIntegrity ?? {}),
		value,
		failures: Number.isFinite(Number(caseIntegrity?.failures)) ? Number(caseIntegrity?.failures) : fallback.failures,
		lastReason: caseIntegrity?.lastReason ?? fallback.lastReason,
		lastChangedAt: caseIntegrity?.lastChangedAt ?? fallback.lastChangedAt
	};
}

/** @param {Record<string, any> | null | undefined} confirmedContradictions */
function normalizeConfirmedContradictions(confirmedContradictions) {
	if (!confirmedContradictions || typeof confirmedContradictions !== "object") return {};

	/** @type {Record<string, any>} */
	const normalized = {};

	for (const [contradictionId, value] of Object.entries(confirmedContradictions)) {
		if (value === true) {
			normalized[contradictionId] = { id: contradictionId, deductionId: "", confirmedAt: null };
			continue;
		}

		if (!value || typeof value !== "object") continue;

		normalized[contradictionId] = {
			id: value.id ?? contradictionId,
			deductionId: value.deductionId ?? "",
			confirmedAt: value.confirmedAt ?? null
		};
	}

	return normalized;
}

/** @param {Record<string, any> | null | undefined} timeline */
function normalizeTimeline(timeline) {
	const fallback = createDefaultTimeline();

	if (!timeline || typeof timeline !== "object") return fallback;

	return {
		...fallback,
		...timeline,
		order: Array.isArray(timeline.order) ? normalizeIdList(timeline.order) : [],
		completed: Boolean(timeline.completed),
		completedAt: timeline.completedAt ?? null,
		attempts: Number.isFinite(Number(timeline.attempts)) ? Number(timeline.attempts) : 0
	};
}

/** @param {Record<string, any> | null | undefined} accusation */
function normalizeSuspectAccusation(accusation) {
	const fallback = createDefaultSuspectAccusation();

	if (!accusation || typeof accusation !== "object") return fallback;

	return {
		...fallback,
		...accusation,
		suspectId: accusation.suspectId ? String(accusation.suspectId) : null,
		reasonId: accusation.reasonId ? String(accusation.reasonId) : null,
		accepted: Boolean(accusation.accepted),
		acceptedAt: accusation.acceptedAt ?? null,
		attempts: Number.isFinite(Number(accusation.attempts)) ? Number(accusation.attempts) : 0,
		lastRejectedReason: accusation.lastRejectedReason ?? null,
		history: Array.isArray(accusation.history) ? normalizeAccusationHistory(accusation.history) : []
	};
}

/** @param {Array<Record<string, any>>} history */
function normalizeAccusationHistory(history) {
	return history
		.filter((attempt) => attempt && typeof attempt === "object")
		.map((attempt) => ({
			suspectId: attempt.suspectId ? String(attempt.suspectId) : "",
			reasonId: attempt.reasonId ? String(attempt.reasonId) : "",
			accepted: Boolean(attempt.accepted),
			reason: attempt.reason ? String(attempt.reason) : "",
			attemptedAt: attempt.attemptedAt ?? null
		}))
		.slice(-6);
}

/** @param {string[]} ids */
function normalizeIdList(ids) {
	return Array.from(new Set(ids.map((id) => String(id).trim()).filter(Boolean)));
}

/** @param {string} reason */
function connectionFailurePenalty(reason) {
	if (reason === "wrong-justification") return CASE_INTEGRITY_PENALTIES.wrongJustification;
	if (reason === "invalid-pair") return CASE_INTEGRITY_PENALTIES.invalidConnection;
	return 0;
}

/**
 * @param {Record<string, any>} chapterState
 * @param {number} amount
 * @param {string} reason
 */
function applyIntegrityLoss(chapterState, amount, reason) {
	const current = normalizeCaseIntegrity(chapterState.caseIntegrity);
	const boundedAmount = Math.max(0, Math.round(amount));
	const nextValue = Math.max(0, current.value - boundedAmount);
	const lost = current.value - nextValue;
	const nextIntegrity = {
		...current,
		value: nextValue,
		failures: lost > 0 ? current.failures + 1 : current.failures,
		lastReason: lost > 0 ? reason : current.lastReason,
		lastChangedAt: lost > 0 ? new Date().toISOString() : current.lastChangedAt
	};

	return {
		state: {
			caseIntegrity: nextIntegrity
		},
		loss:
			lost > 0
				? {
						reason,
						amount: lost,
						value: nextValue,
						status: caseIntegrityStatus(nextValue),
						failed: nextValue <= 0
					}
				: null
	};
}

/**
 * @param {Array<Record<string, any>>} connections
 * @param {string} chapterId
 */
function normalizeConnections(connections, chapterId = CHAPTER_1_ID) {
	const normalized = [];

	for (const connection of connections) {
		const item = normalizeConnection(connection, chapterId);
		if (item) normalized.push(item);
	}

	return normalized;
}

/**
 * @param {Record<string, any>} connection
 * @param {string} chapterId
 */
function normalizeConnection(connection, chapterId = CHAPTER_1_ID) {
	const first = normalizeEvidenceId(connection.evidenceIds?.[0] ?? "");
	const second = normalizeEvidenceId(connection.evidenceIds?.[1] ?? "");
	const rule = correctConnectionFor(first, second, chapterId);

	if (!rule || !(connection.verified || connection.correct)) return null;

	return {
		...connection,
		id: connection.id ?? `connection-${connectionKey(first, second)}`,
		key: connection.key ?? connectionKey(first, second),
		evidenceIds: [first, second],
		correct: true,
		verified: true,
		connectionRuleId: connection.connectionRuleId ?? rule.id,
		deductionId: connection.deductionId ?? rule.deductionId,
		reasonKey: connection.reasonKey ?? rule.reasonKey,
		justificationId: connection.justificationId ?? rule.correctJustificationId
	};
}

/**
 * @param {Array<Record<string, any>>} connections
 * @param {string} chapterId
 */
function verifiedConnections(connections, chapterId = CHAPTER_1_ID) {
	return normalizeConnections(connections, chapterId);
}

/** @param {Record<string, any>} state */
function saveInvestigation(state) {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
	} catch {
		// Investigation persistence is best-effort; the case remains playable without storage.
	}
}
