import { browser } from "$app/environment";
import { writable } from "svelte/store";
import { CHAPTER_1_ID, CHAPTERS } from "$lib/game/chapters";

const STORAGE_KEY = "deadsignal.activeChapter.v1";
const SELECTABLE_CHAPTER_IDS = new Set(CHAPTERS.filter((chapter) => !chapter.comingSoon).map((chapter) => chapter.id));

export const activeChapterId = writable(/** @type {string} */ (browser ? loadActiveChapterId() : CHAPTER_1_ID));

if (browser) {
	activeChapterId.subscribe((chapterId) => {
		saveActiveChapterId(chapterId);
	});
}

export function initChapter() {
	if (!browser) return;
	activeChapterId.set(loadActiveChapterId());
}

/** @param {string} chapterId */
export function setActiveChapter(chapterId) {
	activeChapterId.set(SELECTABLE_CHAPTER_IDS.has(chapterId) ? chapterId : CHAPTER_1_ID);
}

function loadActiveChapterId() {
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		return stored && SELECTABLE_CHAPTER_IDS.has(stored) ? stored : CHAPTER_1_ID;
	} catch {
		return CHAPTER_1_ID;
	}
}

/** @param {string} chapterId */
function saveActiveChapterId(chapterId) {
	try {
		localStorage.setItem(STORAGE_KEY, SELECTABLE_CHAPTER_IDS.has(chapterId) ? chapterId : CHAPTER_1_ID);
	} catch {
		// Chapter persistence is best-effort; the shell defaults to Chapter 1.
	}
}
