import { browser } from "$app/environment";
import { derived, writable } from "svelte/store";
import en from "./en.json";
import es from "./es.json";

const STORAGE_KEY = "deadsignal.language";
const DEFAULT_LANGUAGE = "en";

/** @type {Record<string, Record<string, any>>} */
const dictionaries = {
	en,
	es
};

export const SUPPORTED_LANGUAGES = [
	{ code: "en", labelKey: "language.en" },
	{ code: "es", labelKey: "language.es" }
];

export const currentLanguage = writable(DEFAULT_LANGUAGE);

export const t = derived(currentLanguage, (language) => {
	/**
	 * @param {string} key
	 * @param {Record<string, string | number>} params
	 */
	return (key, params = {}) => translateKey(language, key, params);
});

export const dataText = derived(currentLanguage, (language) => {
	/** @param {string | null | undefined} value */
	return (value) => translateDataText(language, value);
});

export function initLanguage() {
	if (!browser) return;

	const savedLanguage = normalizeLanguage(localStorage.getItem(STORAGE_KEY));
	currentLanguage.set(savedLanguage);
	document.documentElement.lang = savedLanguage;
}

/** @param {string} language */
export function setLanguage(language) {
	const nextLanguage = normalizeLanguage(language);
	currentLanguage.set(nextLanguage);

	if (browser) {
		localStorage.setItem(STORAGE_KEY, nextLanguage);
		document.documentElement.lang = nextLanguage;
	}
}

/**
 * @param {string | null | undefined} language
 * @returns {string}
 */
function normalizeLanguage(language) {
	return language && dictionaries[language] ? language : DEFAULT_LANGUAGE;
}

/**
 * @param {string} language
 * @param {string} key
 * @param {Record<string, string | number>} params
 */
function translateKey(language, key, params) {
	const dictionary = dictionaries[normalizeLanguage(language)];
	const value = resolvePath(dictionary, key) ?? resolvePath(en, key) ?? key;

	if (typeof value !== "string") {
		return key;
	}

	return value.replace(/\{(\w+)\}/g, (_match, paramName) => String(params[paramName] ?? ""));
}

/**
 * @param {string} language
 * @param {string | null | undefined} value
 */
function translateDataText(language, value) {
	if (!value) return "";

	const dictionary = dictionaries[normalizeLanguage(language)];
	const localizedValues = /** @type {Record<string, string>} */ (dictionary.dataTexts ?? {});
	const fallbackValues = /** @type {Record<string, string>} */ (en.dataTexts ?? {});
	return localizedValues[value] ?? fallbackValues[value] ?? value;
}

/**
 * @param {Record<string, any>} dictionary
 * @param {string} key
 * @returns {any}
 */
function resolvePath(dictionary, key) {
	return key.split(".").reduce((value, segment) => value?.[segment], dictionary);
}
