import { MIRROR_PROJECT_CASE_FILE } from "$lib/cases/mirrorProjectContent";
import { MIRROR_PROJECT_SOLUTION } from "$lib/cases/mirrorProjectSolution";

export const CHAPTER_1_ID = "chapter-1";
export const CHAPTER_2_ID = "chapter-2";
export const CHAPTER_3_ID = "chapter-3";

export const CHAPTERS = [
	{
		id: CHAPTER_1_ID,
		caseId: "the-helix-incident",
		order: 1,
		titleKey: "chapters.items.helix.title",
		subtitleKey: "chapters.items.helix.subtitle",
		statusKey: "chapters.status.available"
	},
	{
		id: CHAPTER_2_ID,
		caseId: MIRROR_PROJECT_SOLUTION.id,
		order: 2,
		titleKey: "chapters.items.mirror.title",
		subtitleKey: "chapters.items.mirror.subtitle",
		statusKey: "chapters.status.locked"
	},
	{
		id: CHAPTER_3_ID,
		caseId: "future-chapter-3",
		order: 3,
		titleKey: "chapters.items.chapter3.title",
		subtitleKey: "chapters.items.chapter3.subtitle",
		statusKey: "chapters.status.comingSoon",
		comingSoon: true
	}
];

/**
 * @param {string} chapterId
 * @param {{ chapter1Resolved?: boolean, chapter2Resolved?: boolean }} state
 */
export function chapterIsUnlocked(chapterId, state = {}) {
	if (chapterId === CHAPTER_1_ID) return true;
	if (chapterId === CHAPTER_2_ID) return Boolean(state.chapter1Resolved);
	if (chapterId === CHAPTER_3_ID) return Boolean(state.chapter2Resolved);
	return false;
}

/**
 * @param {Record<string, any> | null | undefined} helixCaseFile
 * @param {string} chapterId
 */
export function caseFileForChapter(helixCaseFile, chapterId) {
	if (chapterId === CHAPTER_2_ID) return MIRROR_PROJECT_CASE_FILE;
	if (chapterId === CHAPTER_3_ID) return null;
	return helixCaseFile;
}

/**
 * @param {string} chapterId
 */
export function casePathSlug(chapterId) {
	if (chapterId === CHAPTER_3_ID) return "chapter-3";
	return chapterId === CHAPTER_2_ID ? "mirror" : "helix";
}
