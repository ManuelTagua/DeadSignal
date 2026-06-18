import { browser } from "$app/environment";
import { CHAPTER_1_ID } from "$lib/game/chapters";
import { writable } from "svelte/store";

const STORAGE_KEY = "deadsignal.progress.v1";

function createDefaultProgress() {
	return {
		version: 1,
		items: {},
		discoveredTags: {},
		unlockedFiles: {}
	};
}

export const progress = writable(browser ? loadProgress() : createDefaultProgress());

if (browser) {
	progress.subscribe((state) => {
		saveProgress(state);
	});
}

export function initProgress() {
	if (!browser) return;
	progress.set(loadProgress());
}

export function resetProgress() {
	progress.set(createDefaultProgress());
}

/** @param {{ id: string, title: string, category: string, important: boolean, evidenceTags: string[], chapterId?: string }} item */
export function markItemRead(item) {
	progress.update((state) => {
		const existing = state.items[item.id];
		const chapterId = item.chapterId ?? null;
		const discoveredTags = {
			...(state.discoveredTags ?? {}),
			...tagsRecord(item.evidenceTags, chapterId)
		};

		if (existing?.read && itemMatchesChapter(existing, chapterId)) {
			return {
				...state,
				discoveredTags
			};
		}

		return {
			...state,
			discoveredTags,
			items: {
				...state.items,
				[item.id]: {
					...existing,
					...item,
					read: true
				}
			}
		};
	});
}

/**
 * @param {string[]} tags
 * @param {string | null} chapterId
 */
export function markEvidenceTagsDiscovered(tags, chapterId = null) {
	progress.update((state) => ({
		...state,
		discoveredTags: {
			...(state.discoveredTags ?? {}),
			...tagsRecord(tags, chapterId)
		}
	}));
}

/** @param {Record<string, any>} state */
export function readItems(state) {
	return Object.values(state.items ?? {}).filter((item) => item.read);
}

/**
 * @param {Record<string, any>} state
 * @param {string} tag
 * @param {string | null} chapterId
 */
export function hasReadEvidenceTag(state, tag, chapterId = null) {
	if (!tag) return false;

	if (chapterId && state.discoveredTags?.[scopedTagKey(chapterId, tag)]) return true;
	if (!chapterId && state.discoveredTags?.[tag]) return true;

	return readItems(state).some((item) => itemMatchesChapter(item, chapterId) && item.evidenceTags?.includes(tag));
}

/**
 * @param {Record<string, any>} state
 * @param {string} category
 * @param {string | null} chapterId
 */
export function countReadImportantByCategory(state, category, chapterId = null) {
	return readItems(state).filter((item) => item.category === category && item.important && itemMatchesChapter(item, chapterId)).length;
}

function loadProgress() {
	try {
		const rawProgress = localStorage.getItem(STORAGE_KEY);
		const parsed = rawProgress ? JSON.parse(rawProgress) : createDefaultProgress();

		return {
			...createDefaultProgress(),
			...parsed,
			items: parsed.items ?? {},
			discoveredTags: parsed.discoveredTags ?? {},
			unlockedFiles: parsed.unlockedFiles ?? {}
		};
	} catch {
		return createDefaultProgress();
	}
}

/** @param {string} fileId */
export function unlockFile(fileId) {
	progress.update((state) => ({
		...state,
		unlockedFiles: {
			...(state.unlockedFiles ?? {}),
			[fileId]: true
		}
	}));
}

/**
 * @param {Record<string, any>} state
 * @param {string} fileId
 */
export function isFileUnlocked(state, fileId) {
	return Boolean(state.unlockedFiles?.[fileId]);
}

/**
 * @param {string[]} tags
 * @param {string | null} chapterId
 */
function tagsRecord(tags = [], chapterId = null) {
	const entries = tags.map((tag) => [tag, true]);

	if (chapterId) {
		entries.push(...tags.map((tag) => [scopedTagKey(chapterId, tag), true]));
	}

	return Object.fromEntries(entries);
}

/**
 * @param {string} chapterId
 * @param {string} tag
 */
function scopedTagKey(chapterId, tag) {
	return `${chapterId}:${tag}`;
}

/**
 * @param {Record<string, any>} item
 * @param {string | null} chapterId
 */
function itemMatchesChapter(item, chapterId) {
	if (!chapterId) return true;
	return (item.chapterId ?? CHAPTER_1_ID) === chapterId;
}

/** @param {Record<string, any>} state */
function saveProgress(state) {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
	} catch {
		// Progress persistence is best-effort; the shell stays usable without storage.
	}
}
