import { browser } from "$app/environment";
import { MAINTENANCE_ASSEMBLY_ORDER, MAINTENANCE_REPORT_ID, isCorrectMaintenanceOrder } from "$lib/game/recovery";
import { get, writable } from "svelte/store";

const STORAGE_KEY = "deadsignal.recovery.v1";
const SIMULATED_START = Date.parse("2041-10-09T03:54:00.000Z");

function createDefaultRecovery() {
	return {
		version: 1,
		fragments: {},
		reconstructedDocuments: {},
		assemblyOrder: ["file_18", "file_12", "file_21"],
		actionLog: [],
		lastResult: null
	};
}

export const recovery = writable(browser ? loadRecovery() : createDefaultRecovery());

if (browser) {
	recovery.subscribe((state) => {
		saveRecovery(state);
	});
}

export function initRecovery() {
	if (!browser) return;
	recovery.set(loadRecovery());
}

export function resetRecovery() {
	recovery.set(createDefaultRecovery());
}

/** @param {string} target */
export function scanRecoveryTarget(target = "relay") {
	const normalizedTarget = normalizeTarget(target);
	if (normalizedTarget !== "relay") return recordBlocked("scan", normalizedTarget, "unknown-target");

	return unlockFragment("scan", normalizedTarget, "file_12");
}

/** @param {string} fileId */
export function repairRecoveryFile(fileId = "file_12") {
	const normalizedFileId = fileId.trim().toLowerCase();
	const state = get(recovery);

	if (normalizedFileId !== "file_12") return recordBlocked("repair", normalizedFileId, "unknown-file");
	if (!state.fragments.file_12) return recordBlocked("repair", normalizedFileId, "missing-scan");

	return unlockFragment("repair", normalizedFileId, "file_18");
}

/** @param {string} target */
export function deepRecoverTarget(target = "relay") {
	const normalizedTarget = normalizeTarget(target);
	const state = get(recovery);

	if (normalizedTarget !== "relay") return recordBlocked("deep-recovery", normalizedTarget, "unknown-target");
	if (!state.fragments.file_12 || !state.fragments.file_18) {
		return recordBlocked("deep-recovery", normalizedTarget, "missing-repair");
	}

	return unlockFragment("deep-recovery", normalizedTarget, "file_21");
}

/** @param {string[]} order */
export function setAssemblyOrder(order) {
	const sanitized = order.filter((fragmentId) => MAINTENANCE_ASSEMBLY_ORDER.includes(fragmentId));
	if (sanitized.length !== MAINTENANCE_ASSEMBLY_ORDER.length) return false;

	recovery.update((state) => ({
		...state,
		assemblyOrder: sanitized
	}));

	return true;
}

export function assembleMaintenanceReport() {
	const state = get(recovery);
	const hasFragments = MAINTENANCE_ASSEMBLY_ORDER.every((fragmentId) => state.fragments[fragmentId]);

	if (!hasFragments) return recordBlocked("assemble", MAINTENANCE_REPORT_ID, "missing-fragments");
	if (!isCorrectMaintenanceOrder(state.assemblyOrder)) return recordBlocked("assemble", MAINTENANCE_REPORT_ID, "wrong-order");
	if (state.reconstructedDocuments[MAINTENANCE_REPORT_ID]) {
		return recordBlocked("assemble", MAINTENANCE_REPORT_ID, "already-reconstructed");
	}

	const result = makeResult("assemble", MAINTENANCE_REPORT_ID, "reconstructed", {
		documentId: MAINTENANCE_REPORT_ID
	});

	recovery.set({
		...state,
		reconstructedDocuments: {
			...state.reconstructedDocuments,
			[MAINTENANCE_REPORT_ID]: true
		},
		actionLog: [result.action, ...state.actionLog],
		lastResult: result
	});

	return result;
}

/**
 * @param {string} method
 * @param {string} target
 * @param {string} fragmentId
 */
function unlockFragment(method, target, fragmentId) {
	const state = get(recovery);

	if (state.fragments[fragmentId]) {
		return recordBlocked(method, target, "already-recovered", { fragmentId });
	}

	const result = makeResult(method, target, "fragment-recovered", { fragmentId });

	recovery.set({
		...state,
		fragments: {
			...state.fragments,
			[fragmentId]: true
		},
		actionLog: [result.action, ...state.actionLog],
		lastResult: result
	});

	return result;
}

/**
 * @param {string} method
 * @param {string} target
 * @param {string} reason
 * @param {Record<string, string>} details
 */
function recordBlocked(method, target, reason, details = {}) {
	const state = get(recovery);
	const result = makeResult(method, target, reason, details);
	const actionLog = shouldCollapseAction(state.actionLog, result.action)
		? state.actionLog
		: [result.action, ...state.actionLog];

	recovery.set({
		...state,
		actionLog,
		lastResult: result
	});

	return result;
}

/**
 * @param {Array<Record<string, any>>} actionLog
 * @param {Record<string, any>} action
 */
function shouldCollapseAction(actionLog, action) {
	if (!["already-recovered", "already-reconstructed"].includes(action.status)) return false;

	return actionLog.some(
		(entry) =>
			entry.method === action.method &&
			entry.target === action.target &&
			entry.status === action.status &&
			entry.fragmentId === action.fragmentId &&
			entry.documentId === action.documentId
	);
}

/**
 * @param {string} method
 * @param {string} target
 * @param {string} status
 * @param {Record<string, string>} details
 */
function makeResult(method, target, status, details = {}) {
	const state = get(recovery);
	const action = {
		id: `recovery-action-${Date.now().toString(36)}-${state.actionLog.length + 1}`,
		method,
		target,
		status,
		createdAt: simulatedTimestamp(state.actionLog.length),
		...details
	};

	return {
		method,
		target,
		status,
		action,
		...details
	};
}

/** @param {string} target */
function normalizeTarget(target) {
	const normalized = target.trim().toLowerCase();
	return normalized || "relay";
}

/** @param {number} offset */
function simulatedTimestamp(offset) {
	return new Date(SIMULATED_START + offset * 61_000).toISOString();
}

function loadRecovery() {
	try {
		const rawRecovery = localStorage.getItem(STORAGE_KEY);
		const fallback = createDefaultRecovery();
		const parsed = rawRecovery ? JSON.parse(rawRecovery) : fallback;

		return {
			...fallback,
			...parsed,
			fragments: parsed.fragments ?? {},
			reconstructedDocuments: parsed.reconstructedDocuments ?? {},
			assemblyOrder: Array.isArray(parsed.assemblyOrder) ? parsed.assemblyOrder : fallback.assemblyOrder,
			actionLog: Array.isArray(parsed.actionLog) ? parsed.actionLog : [],
			lastResult: parsed.lastResult ?? null
		};
	} catch {
		return createDefaultRecovery();
	}
}

/** @param {Record<string, any>} state */
function saveRecovery(state) {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
	} catch {
		// Recovery persistence is best-effort; the rest of the shell remains usable.
	}
}
