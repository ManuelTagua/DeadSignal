<script>
	import { CornerDownLeft, TerminalSquare } from "@lucide/svelte";
	import { t } from "$lib/i18n";

	let {
		evidences = [],
		recoveryFragments = [],
		onUnlock = () => false,
		onScan = () => false,
		onRecover = () => ({}),
		onRepair = () => ({}),
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
		onCommand(name);

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
			addOutput("terminal.help.scan");
			addOutput("terminal.help.evidence");
			addOutput("terminal.help.unlock");
			addOutput("terminal.help.recover");
			addOutput("terminal.help.fragments");
			addOutput("terminal.help.repair");
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
