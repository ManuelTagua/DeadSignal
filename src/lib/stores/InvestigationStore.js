import { browser } from "$app/environment";
import { connectionKey, correctConnectionFor, validateConnectionAttempt } from "$lib/game/deductions";
import { get, writable } from "svelte/store";

const STORAGE_KEY = "deadsignal.investigation.v1";
const SIMULATED_START = Date.parse("2041-10-09T03:46:00.000Z");

function createDefaultInvestigation() {
	return {
		version: 1,
		connections: [],
		notes: [],
		unlockedDeductions: {},
		milestones: {},
		failedConnectionStreak: 0
	};
}

export const investigation = writable(browser ? loadInvestigation() : createDefaultInvestigation());

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

/**
 * @param {string} firstEvidenceId
 * @param {string} secondEvidenceId
 */
export function addConnection(firstEvidenceId, secondEvidenceId, justificationId = "") {
	const normalizedFirst = normalizeEvidenceId(firstEvidenceId);
	const normalizedSecond = normalizeEvidenceId(secondEvidenceId);

	if (!normalizedFirst || !normalizedSecond || normalizedFirst === normalizedSecond) {
		return recordConnectionFailure("invalid");
	}

	const state = get(investigation);
	const key = connectionKey(normalizedFirst, normalizedSecond);
	const existing = verifiedConnections(state.connections).find(
		/** @param {Record<string, any>} connection */ (connection) => connection.key === key
	);

	if (existing) {
		return { accepted: false, created: false, reason: "duplicate", connection: existing, failedConnectionStreak: state.failedConnectionStreak ?? 0 };
	}

	const validation = validateConnectionAttempt(normalizedFirst, normalizedSecond, justificationId);

	if (!validation.accepted || !validation.rule) {
		return recordConnectionFailure(validation.reason);
	}

	const connection = {
		id: `connection-${key}`,
		key,
		evidenceIds: [normalizedFirst, normalizedSecond],
		createdAt: simulatedTimestamp(state.connections.length + state.notes.length),
		correct: true,
		verified: true,
		connectionRuleId: validation.rule.id,
		deductionId: validation.rule.deductionId,
		reasonKey: validation.rule.reasonKey,
		justificationId
	};

	investigation.set({
		...state,
		failedConnectionStreak: 0,
		connections: [...verifiedConnections(state.connections), connection]
	});

	return { accepted: true, created: true, connection };
}

/** @param {string} reason */
function recordConnectionFailure(reason) {
	const state = get(investigation);
	const failedConnectionStreak = (state.failedConnectionStreak ?? 0) + 1;
	const speculationDiscarded = failedConnectionStreak >= 3;

	investigation.set({
		...state,
		failedConnectionStreak: speculationDiscarded ? 0 : failedConnectionStreak,
		connections: speculationDiscarded ? verifiedConnections(state.connections) : state.connections
	});

	return {
		accepted: false,
		created: false,
		reason,
		failedConnectionStreak,
		speculationDiscarded
	};
}

/**
 * @param {{ body: string, tags?: string[] }} note
 */
export function createNote(note) {
	const state = get(investigation);
	const cleanBody = note.body.trim();

	if (!cleanBody) return null;

	const createdAt = simulatedTimestamp(state.notes.length + state.connections.length);
	const item = {
		id: `note-${Date.now().toString(36)}-${state.notes.length + 1}`,
		body: cleanBody,
		tags: normalizeTags(note.tags ?? []),
		createdAt,
		updatedAt: createdAt
	};

	investigation.set({
		...state,
		notes: [item, ...state.notes]
	});

	return item;
}

/**
 * @param {string} noteId
 * @param {{ body: string, tags?: string[] }} updates
 */
export function updateNote(noteId, updates) {
	const state = get(investigation);
	const cleanBody = updates.body.trim();

	if (!cleanBody) return false;

	let changed = false;
	const notes = state.notes.map(/** @param {Record<string, any>} note */ (note) => {
		if (note.id !== noteId) return note;
		changed = true;
		return {
			...note,
			body: cleanBody,
			tags: normalizeTags(updates.tags ?? []),
			updatedAt: simulatedTimestamp(state.notes.length + state.connections.length + 1)
		};
	});

	if (!changed) return false;

	investigation.set({
		...state,
		notes
	});

	return true;
}

/** @param {string} noteId */
export function deleteNote(noteId) {
	const state = get(investigation);
	const notes = state.notes.filter(/** @param {Record<string, any>} note */ (note) => note.id !== noteId);

	if (notes.length === state.notes.length) return false;

	investigation.set({
		...state,
		notes
	});

	return true;
}

/** @param {string} deductionId */
export function unlockDeduction(deductionId) {
	const state = get(investigation);

	if (state.unlockedDeductions[deductionId]) return false;

	investigation.set({
		...state,
		unlockedDeductions: {
			...state.unlockedDeductions,
			[deductionId]: true
		}
	});

	return true;
}

/** @param {string} milestoneId */
export function markMilestone(milestoneId) {
	const state = get(investigation);

	if (state.milestones[milestoneId]) return false;

	investigation.set({
		...state,
		milestones: {
			...state.milestones,
			[milestoneId]: true
		}
	});

	return true;
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

		return {
			...createDefaultInvestigation(),
			...parsed,
			connections: Array.isArray(parsed.connections) ? normalizeConnections(parsed.connections) : [],
			notes: Array.isArray(parsed.notes) ? parsed.notes : [],
			unlockedDeductions: parsed.unlockedDeductions ?? {},
			milestones: parsed.milestones ?? {},
			failedConnectionStreak: parsed.failedConnectionStreak ?? 0
		};
	} catch {
		return createDefaultInvestigation();
	}
}

/** @param {Array<Record<string, any>>} connections */
function normalizeConnections(connections) {
	const normalized = [];

	for (const connection of connections) {
		const item = normalizeConnection(connection);
		if (item) normalized.push(item);
	}

	return normalized;
}

/** @param {Record<string, any>} connection */
function normalizeConnection(connection) {
	const first = normalizeEvidenceId(connection.evidenceIds?.[0] ?? "");
	const second = normalizeEvidenceId(connection.evidenceIds?.[1] ?? "");
	const rule = correctConnectionFor(first, second);

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

/** @param {Array<Record<string, any>>} connections */
function verifiedConnections(connections) {
	return normalizeConnections(connections);
}

/** @param {Record<string, any>} state */
function saveInvestigation(state) {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
	} catch {
		// Investigation persistence is best-effort; the case remains playable without storage.
	}
}
