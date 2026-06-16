import { writable } from "svelte/store";

let nextId = 1;

/**
 * @typedef {{
 * 	id: string,
 * 	occurredAt: string,
 * 	level: string,
 * 	source: string,
 * 	code: string,
 * 	messageKey?: string,
 * 	params?: Record<string, string | number>
 * }} SessionLog
 */

/** @type {import("svelte/store").Writable<SessionLog[]>} */
export const sessionLogs = writable([]);

/**
 * @param {{
 * 	level: string,
 * 	source: string,
 * 	code: string,
 * 	messageKey?: string,
 * 	params?: Record<string, string | number>
 * }} log
 */
export function addSessionLog(log) {
	sessionLogs.update((logs) => [
		{
			id: `session-log-${nextId++}`,
			occurredAt: new Date().toISOString(),
			...log
		},
		...logs
	]);
}

export function clearSessionLogs() {
	nextId = 1;
	sessionLogs.set([]);
}
