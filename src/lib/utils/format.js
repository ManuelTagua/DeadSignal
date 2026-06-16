/** @param {string | Date | null | undefined} value */
export function formatTimestamp(value) {
	if (!value) return "--";

	return new Intl.DateTimeFormat("en-US", {
		month: "2-digit",
		day: "2-digit",
		year: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		hour12: false,
		timeZone: "UTC"
	})
		.format(new Date(value))
		.replace(",", "");
}

/** @param {string | Date | null | undefined} value */
export function formatTime(value) {
	if (!value) return "--:--";

	return new Intl.DateTimeFormat("en-US", {
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		hour12: false,
		timeZone: "UTC"
	}).format(new Date(value));
}

/** @param {string} level */
export function severityClass(level) {
	const normalized = level.toLowerCase();

	if (normalized === "critical") return "border-cyan-200/50 text-cyan-50 bg-cyan-300/10";
	if (normalized === "error") return "border-cyan-300/30 text-cyan-100 bg-cyan-400/10";
	if (normalized === "warn") return "border-emerald-300/30 text-emerald-100 bg-emerald-400/10";
	return "border-white/10 text-white/70 bg-white/[0.03]";
}

/** @param {string} value */
export function compactPath(value) {
	return value.replace("/cases/helix", "~");
}
