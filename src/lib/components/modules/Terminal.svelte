<script>
	import { CornerDownLeft, TerminalSquare } from "@lucide/svelte";
	import { contradictionSourceForId } from "$lib/game/contradictions";
	import { t } from "$lib/i18n";

	let {
		evidences = [],
		timelineEvents = [],
		confirmedContradictions = [],
		suspects = [],
		searchItems = [],
		hiddenCommands = {},
		recoveryFragments = [],
		onUnlock = () => false,
		onScan = () => false,
		onRecover = () => ({}),
		onRepair = () => ({}),
		onTrace = () => ({}),
		onDecrypt = () => ({}),
		onCommand = () => {}
	} = $props();

	let command = $state("");
	let lineCounter = 1;
	/** @type {HTMLDivElement | undefined} */
	let outputNode;
	/**
	 * @typedef {{
	 * 	id: string,
	 * 	kind: "input" | "output",
	 * 	tone: string,
	 * 	key?: string,
	 * 	text?: string,
	 * 	params?: Record<string, string | number>
	 * }} TerminalLine
	 */
	let lines = $state(
		/** @type {TerminalLine[]} */ ([
		{ id: "terminal-line-0", kind: "output", key: "terminal.status", tone: "system" }
		])
	);

	$effect(() => {
		lines.length;
		if (outputNode) outputNode.scrollTo({ top: outputNode.scrollHeight });
	});

	/** @param {SubmitEvent} event */
	function submitCommand(event) {
		event.preventDefault();

		const rawCommand = command.trim();
		if (!rawCommand) return;

		command = "";
		addInput(rawCommand);
		executeCommand(rawCommand);
	}

	/** @param {string} rawCommand */
	function executeCommand(rawCommand) {
		const [rawName, ...args] = rawCommand.split(/\s+/);
		const name = rawName.toLowerCase();
		onCommand(rawCommand);

		if (name === "clear") {
			lines = [];
			addOutput("terminal.cleared");
			return;
		}

		if (name === "help") {
			addOutput("terminal.help.header");
			addOutput("terminal.help.help");
			addOutput("terminal.help.clear");
			addOutput("terminal.help.status");
			addOutput("terminal.help.search");
			addOutput("terminal.help.evidence");
			addOutput("terminal.help.timeline");
			addOutput("terminal.help.suspects");
			if (hiddenCommands.traceCredential) addOutput("terminal.help.traceCredential");
			if (hiddenCommands.decryptFragment) addOutput("terminal.help.decryptFragment");
			return;
		}

		if (name === "status") {
			addOutput("terminal.status");
			return;
		}

		if (name === "scan") {
			addOutput(onScan() ? "terminal.scan" : "terminal.scanRepeat", {}, "warning");
			return;
		}

		if (name === "search" || name === "buscar") {
			const query = args.join(" ").trim();
			if (!query) {
				addOutput("terminal.search.usage", {}, "warning");
				return;
			}

			const results = searchTerminalItems(query);
			if (!results.length) {
				addOutput("terminal.search.noMatches", { query }, "warning");
				return;
			}

			addOutput("terminal.search.header", { query, count: results.length });
			for (const result of results) {
				addOutput("terminal.search.item", result, "evidence");
			}
			return;
		}

		if (name === "evidence") {
			if (!evidences.length) {
				addOutput("terminal.evidenceEmpty");
				return;
			}

			addOutput("terminal.evidenceHeader");
			for (const evidence of evidences) {
				addOutput(evidence.titleKey, {}, "evidence");
			}
			return;
		}

		if (name === "timeline" || name === "cronologia") {
			if (!timelineEvents.length) {
				addOutput("terminal.timeline.empty");
				return;
			}

			addOutput("terminal.timeline.header");
			for (const event of timelineEvents) {
				addOutput("terminal.timeline.item", timelineEventParams(event), "evidence");
			}
			return;
		}

		if (name === "contradictions" || name === "contradicciones") {
			if (!confirmedContradictions.length) {
				addOutput("terminal.contradictions.empty");
				return;
			}

			addOutput("terminal.contradictions.header");
			for (const contradiction of confirmedContradictions) {
				addOutput("terminal.contradictions.item", sourcePairParams(contradiction), "evidence");
			}
			return;
		}

		if (name === "suspects" || name === "sospechosos") {
			if (!suspects.length) {
				addOutput("terminal.suspects.empty");
				return;
			}

			addOutput("terminal.suspects.header");
			for (const suspect of suspects) {
				addOutput("terminal.suspects.item", suspectParams(suspect), "evidence");
			}
			return;
		}

		if (name === "trace") {
			addTerminalResult(onTrace(args.join(" ")));
			return;
		}

		if (name === "decrypt") {
			addTerminalResult(onDecrypt(args.join(" ")));
			return;
		}

		if (name === "recover") {
			const result = onRecover(args.join(" "));
			addTerminalResult(result);
			return;
		}

		if (name === "fragments") {
			if (!recoveryFragments.length) {
				addOutput("terminal.recovery.fragmentsEmpty");
				return;
			}

			addOutput("terminal.recovery.fragmentsHeader");
			for (const fragment of recoveryFragments) {
				addOutput(fragment.titleKey, {}, "evidence");
			}
			return;
		}

		if (name === "repair") {
			const result = onRepair(args.join(" "));
			addTerminalResult(result);
			return;
		}

		if (name === "unlock") {
			addOutput(onUnlock(args.join(" ")) ? "terminal.unlockedOutput" : "terminal.lockedOutput", {}, "warning");
			return;
		}

		addOutput("terminal.unknown", {}, "error");
	}

	/** @param {string} text */
	function addInput(text) {
		lines = [...lines, { id: nextLineId(), kind: "input", text, tone: "input" }];
	}

	/**
	 * @param {string} key
	 * @param {Record<string, string | number>} params
	 * @param {string} tone
	 */
	function addOutput(key, params = {}, tone = "system") {
		lines = [...lines, { id: nextLineId(), kind: "output", key, params, tone }];
	}

	function nextLineId() {
		return `terminal-line-${lineCounter++}`;
	}

	/** @param {Record<string, any>} event */
	function timelineEventParams(event) {
		return {
			title: $t(event.titleKey),
			source: $t(event.sourceKey)
		};
	}

	/** @param {Record<string, any>} contradiction */
	function sourcePairParams(contradiction) {
		const [firstId, secondId] = contradiction.sourceIds ?? [];
		const first = contradictionSourceForId(firstId);
		const second = contradictionSourceForId(secondId);

		return {
			title: $t(contradiction.titleKey),
			first: first ? $t(first.shortLabelKey) : (firstId ?? ""),
			second: second ? $t(second.shortLabelKey) : (secondId ?? "")
		};
	}

	/** @param {Record<string, any>} suspect */
	function suspectParams(suspect) {
		const facts = suspect.knownFacts?.length
			? suspect.knownFacts.map(/** @param {Record<string, any>} fact */ (fact) => $t(fact.labelKey)).join("; ")
			: $t("terminal.suspects.noFacts");

		return {
			name: $t(suspect.nameKey),
			role: $t(suspect.roleKey),
			facts
		};
	}

	/** @param {string} query */
	function searchTerminalItems(query) {
		const normalizedQuery = normalizeSearch(query);

		return searchItems
			.flatMap(/** @param {Record<string, any>} item */ (item) => {
				const haystack = normalizeSearch(`${item.title} ${item.type} ${item.text}`);
				if (!haystack.includes(normalizedQuery)) return [];

				return [
					{
						title: item.title,
						type: item.type,
						fragment: fragmentFor(item.text || item.title, query)
					}
				];
			})
			.slice(0, 8);
	}

	/** @param {string} value */
	function normalizeSearch(value) {
		return value
			.toLowerCase()
			.normalize("NFD")
			.replace(/[\u0300-\u036f]/g, "");
	}

	/**
	 * @param {string} value
	 * @param {string} query
	 */
	function fragmentFor(value, query) {
		const text = String(value ?? "").replace(/\s+/g, " ").trim();
		if (!text) return "";

		const index = text.toLowerCase().indexOf(query.toLowerCase());
		const safeIndex = index >= 0 ? index : 0;
		const start = Math.max(0, safeIndex - 44);
		const end = Math.min(text.length, safeIndex + query.length + 88);
		const prefix = start > 0 ? "... " : "";
		const suffix = end < text.length ? " ..." : "";

		return `${prefix}${text.slice(start, end)}${suffix}`;
	}

	/** @param {{ key?: string, params?: Record<string, string | number>, tone?: string }} result */
	function addTerminalResult(result) {
		if (!result?.key) {
			addOutput("terminal.recovery.results.unknown-target", {}, "warning");
			return;
		}

		addOutput(result.key, result.params ?? {}, result.tone ?? "system");
	}

	/** @param {string} tone */
	function lineClass(tone) {
		if (tone === "input") return "text-cyan-50";
		if (tone === "warning") return "text-emerald-100";
		if (tone === "evidence") return "text-cyan-100";
		if (tone === "error") return "text-cyan-50";
		return "text-white/65";
	}
</script>

<article class="flex h-full min-h-0 flex-col bg-black/20">
	<div class="border-b border-cyan-300/10 p-4">
		<div class="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-white/40">
			<TerminalSquare size={13} />
			<span>{$t("terminal.title")}</span>
		</div>
	</div>

	<div bind:this={outputNode} class="min-h-0 flex-1 overflow-y-auto p-4">
		<div class="grid gap-2 text-sm leading-6">
			{#each lines as line (line.id)}
				<div class={`grid gap-2 sm:grid-cols-[150px_1fr] ${lineClass(line.tone)}`}>
					<span class="text-[10px] uppercase tracking-[0.16em] text-white/35">
						{#if line.kind === "input"}
							{$t("terminal.investigatorPrompt")}
						{:else}
							{$t("terminal.systemPrompt")}
						{/if}
					</span>
					<span class="break-words">
						{#if line.kind === "input"}
							{line.text}
						{:else}
							{$t(line.key ?? "", line.params ?? {})}
						{/if}
					</span>
				</div>
			{/each}
		</div>
	</div>

	<form class="grid gap-2 border-t border-cyan-300/10 p-3 sm:grid-cols-[1fr_auto]" onsubmit={submitCommand}>
		<label class="sr-only" for="terminal-command">{$t("terminal.inputLabel")}</label>
		<input
			id="terminal-command"
			class="h-10 rounded border border-cyan-300/20 bg-black/45 px-3 text-sm text-cyan-50 outline-none placeholder:text-white/30 focus:border-cyan-200/70"
			bind:value={command}
			placeholder={$t("terminal.placeholder")}
			autocomplete="off"
		/>
		<button
			type="submit"
			class="flex h-10 items-center justify-center gap-2 rounded border border-emerald-300/30 bg-emerald-300/10 px-3 text-xs uppercase tracking-[0.14em] text-emerald-50 hover:border-emerald-200/60"
		>
			<CornerDownLeft size={14} />
			{$t("terminal.run")}
		</button>
	</form>
</article>
