import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const enPath = path.join(root, "src/lib/i18n/en.json");
const esPath = path.join(root, "src/lib/i18n/es.json");
const sourceRoots = [path.join(root, "src")];

const enText = fs.readFileSync(enPath, "utf8");
const esText = fs.readFileSync(esPath, "utf8");
const en = JSON.parse(enText);
const es = JSON.parse(esText);

const failures = [];

for (const issue of [...duplicateKeys(enText, "en.json"), ...duplicateKeys(esText, "es.json")]) {
	failures.push(issue);
}

const enKeys = new Set(flattenKeys(en));
const esKeys = new Set(flattenKeys(es));
const missingEs = [...enKeys].filter((key) => !esKeys.has(key));
const missingEn = [...esKeys].filter((key) => !enKeys.has(key));

for (const key of missingEs) failures.push(`Missing ES key: ${key}`);
for (const key of missingEn) failures.push(`Missing EN key: ${key}`);

for (const key of usedTranslationKeys()) {
	if (!enKeys.has(key)) failures.push(`Missing literal i18n key in EN: ${key}`);
	if (!esKeys.has(key)) failures.push(`Missing literal i18n key in ES: ${key}`);
}

for (const issue of forbiddenSpanishValues(es)) {
	failures.push(issue);
}

if (failures.length) {
	console.error(failures.join("\n"));
	process.exit(1);
}

console.log("i18n QA passed");

function flattenKeys(value, prefix = "") {
	if (!value || typeof value !== "object" || Array.isArray(value)) return [prefix];

	return Object.entries(value).flatMap(([key, child]) => flattenKeys(child, prefix ? `${prefix}.${key}` : key));
}

function duplicateKeys(text, label) {
	const issues = [];
	const scopes = [];

	for (const [index, line] of text.split(/\r?\n/).entries()) {
		const match = line.match(/^(\t*)\"([^"]+)\":/);
		if (!match) continue;

		const depth = match[1].length;
		const key = match[2];
		scopes.length = depth + 1;
		scopes[depth] ??= new Set();

		if (scopes[depth].has(key)) {
			issues.push(`Duplicate key in ${label}:${index + 1}: ${key}`);
		}

		scopes[depth].add(key);
	}

	return issues;
}

function usedTranslationKeys() {
	const keys = new Set();

	for (const file of sourceFiles()) {
		const content = fs.readFileSync(file, "utf8");
		for (const match of content.matchAll(/\$t\(\s*["']([^"'`$]+)["']/g)) {
			keys.add(match[1]);
		}
	}

	return keys;
}

function sourceFiles() {
	const files = [];

	for (const sourceRoot of sourceRoots) {
		walk(sourceRoot, files);
	}

	return files.filter((file) => /\.(svelte|js)$/.test(file));
}

function walk(directory, files) {
	for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
		const entryPath = path.join(directory, entry.name);
		if (entry.isDirectory()) {
			walk(entryPath, files);
		} else {
			files.push(entryPath);
		}
	}
}

function forbiddenSpanishValues(dictionary) {
	const forbidden = [
		["The Helix Incident", /The Helix Incident/],
		["East Archive", /East Archive/],
		["Encrypted Fragment", /Encrypted Fragment/],
		["Recovered Fragment", /Recovered Fragment/],
		["Recovery Fragment", /Recovery Fragment/],
		["Power Relay Maintenance Report", /Power Relay Maintenance Report/],
		["Deep Recovery", /Deep Recovery/],
		["Corrupted", /Corrupted/],
		["Damaged", /Damaged/],
		["Partial", /Partial/],
		["anad", /\banad/i],
		["contrasena", /\bcontrasena(s)?\b/i],
		["capitulo", /\bcapitulo(s)?\b/i],
		["conexion", /\bconexion\b/i],
		["recuperacion", /\brecuperacion\b/i],
		["investigacion", /\binvestigacion\b/i],
		["contrase?", /contrase\?/i],
		["cap?tulo", /cap\?tulo/i],
		["conexi?", /conexi\?/i],
		["recuperaci?", /recuperaci\?/i],
		["investigaci?", /investigaci\?/i]
	];
	const issues = [];

	for (const [key, value] of Object.entries(flattenValues(dictionary))) {
		for (const [label, pattern] of forbidden) {
			if (pattern.test(value)) {
				issues.push(`Forbidden ES phrase at ${key}: ${label}`);
			}
		}
	}

	return issues;
}

function flattenValues(value, prefix = "") {
	if (!value || typeof value !== "object" || Array.isArray(value)) return { [prefix]: String(value ?? "") };

	return Object.fromEntries(
		Object.entries(value).flatMap(([key, child]) => Object.entries(flattenValues(child, prefix ? `${prefix}.${key}` : key)))
	);
}
