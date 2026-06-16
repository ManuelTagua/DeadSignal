import { writable } from "svelte/store";

const DEFAULT_DURATION = 4200;
const MAX_VISIBLE_NOTIFICATIONS = 2;
let nextId = 1;

/**
 * @typedef {{
 * 	id: string,
 * 	type: "info" | "warning" | "evidence" | "objective" | "error",
 * 	titleKey: string,
 * 	messageKey: string,
 * 	params: Record<string, string | number>,
 * 	duration?: number
 * }} Notification
 */

/** @type {import("svelte/store").Writable<Notification[]>} */
export const notifications = writable([]);

/**
 * @param {{
 * 	type: "info" | "warning" | "evidence" | "objective" | "error",
 * 	titleKey: string,
 * 	messageKey: string,
 * 	params?: Record<string, string | number>,
 * 	duration?: number
 * }} notification
 */
export function pushNotification(notification) {
	const id = `notification-${nextId++}`;
	const duration = notification.duration ?? DEFAULT_DURATION;
	const entry = { ...notification, id, params: notification.params ?? {} };

	notifications.update((items) => [...items, entry].slice(-MAX_VISIBLE_NOTIFICATIONS));

	setTimeout(() => {
		removeNotification(id);
	}, duration);
}

/** @param {string} id */
export function removeNotification(id) {
	notifications.update((items) => items.filter((item) => item.id !== id));
}

export function clearNotifications() {
	nextId = 1;
	notifications.set([]);
}
