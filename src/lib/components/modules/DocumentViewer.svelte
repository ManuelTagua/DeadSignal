<script>
	import { AlertTriangle, FileText, Flag, Shield, Tags } from "@lucide/svelte";
	import { dataText, t } from "$lib/i18n";
	import { formatTimestamp } from "$lib/utils/format";

	let { document = null } = $props();

	const documentTitle = $derived(document?.titleKey ? $t(document.titleKey) : $dataText(document?.title));
	const documentCategory = $derived(document?.contentCategory ?? document?.category);
	const documentContent = $derived(
		document?.isCorrupted && document?.damagedContentKey
			? $t(document.damagedContentKey)
			: document?.contentKey
				? $t(document.contentKey)
				: $dataText(document?.content)
	);
	const documentTags = $derived(
		(document?.tags ?? "")
			.split(",")
			.map(/** @param {string} tag */ (tag) => tag.trim())
			.filter(Boolean)
	);
</script>

{#if document}
	<article class="flex h-full min-h-0 flex-col">
		<div class="border-b border-cyan-300/10 p-4">
			<div class="flex flex-wrap items-start justify-between gap-3">
				<div class="min-w-0">
					<div class="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-white/40">
						<FileText size={13} />
						<span>{$t(`values.documentCategories.${documentCategory}`)}</span>
					</div>
					<h3 class="mt-2 text-xl font-semibold leading-tight text-white">{documentTitle}</h3>
				</div>
				{#if document.isFlagged}
					<span class="flex items-center gap-1 rounded border border-cyan-300/30 bg-cyan-300/10 px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-cyan-50">
						<Flag size={12} />
						{$t("badges.flagged")}
					</span>
				{/if}
				{#if document.isCorrupted}
					<span class="soft-glitch flex items-center gap-1 rounded border border-emerald-300/30 bg-emerald-300/10 px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-emerald-50">
						<AlertTriangle size={12} />
						{$t("recovery.badges.corrupted")}
					</span>
				{/if}
			</div>

			<div class="mt-4 grid gap-2 text-xs sm:grid-cols-3">
				<div class="rounded border border-white/10 bg-black/25 p-2">
					<p class="text-[10px] uppercase tracking-[0.15em] text-white/35">{$t("labels.author")}</p>
					<p class="mt-1 text-white/70">{document.author ? $dataText(document.author) : ""}</p>
				</div>
				<div class="rounded border border-white/10 bg-black/25 p-2">
					<p class="flex items-center gap-1 text-[10px] uppercase tracking-[0.15em] text-white/35">
						<Shield size={11} />
						{$t("labels.class")}
					</p>
					<p class="mt-1 truncate text-white/70">{$t(`values.classifications.${document.classification}`)}</p>
				</div>
				<div class="rounded border border-white/10 bg-black/25 p-2">
					<p class="text-[10px] uppercase tracking-[0.15em] text-white/35">{$t("labels.created")}</p>
					<p class="mt-1 truncate text-white/70">{formatTimestamp(document.createdAt)}</p>
				</div>
			</div>

			{#if document.isCorrupted || document.isRecovered}
				<div class="mt-3 grid gap-2 text-xs sm:grid-cols-4">
					<div class="rounded border border-emerald-300/15 bg-emerald-300/5 p-2">
						<p class="text-[10px] uppercase tracking-[0.15em] text-white/35">{$t("recovery.labels.integrity")}</p>
						<div class="mt-2 h-1.5 overflow-hidden rounded bg-black/40">
							<div class="h-full bg-emerald-300/70" style={`width: ${document.integrity ?? 0}%`}></div>
						</div>
						<p class="mt-1 text-white/70">{document.integrity ?? 0}%</p>
					</div>
					<div class="rounded border border-white/10 bg-black/25 p-2">
						<p class="text-[10px] uppercase tracking-[0.15em] text-white/35">{$t("recovery.labels.corruptionLevel")}</p>
						<p class="mt-1 truncate text-white/70">{$t(document.corruptionLevelKey)}</p>
					</div>
					<div class="rounded border border-white/10 bg-black/25 p-2">
						<p class="text-[10px] uppercase tracking-[0.15em] text-white/35">{$t("recovery.labels.recoveredAt")}</p>
						<p class="mt-1 truncate text-white/70">{formatTimestamp(document.recoveredAt)}</p>
					</div>
					<div class="rounded border border-white/10 bg-black/25 p-2">
						<p class="text-[10px] uppercase tracking-[0.15em] text-white/35">{$t("recovery.labels.recoveryOrigin")}</p>
						<p class="mt-1 truncate text-white/70">{$t(document.recoveryOriginKey)}</p>
					</div>
				</div>
			{/if}
		</div>

		<div class="min-h-0 flex-1 overflow-y-auto p-4">
			<pre class={document.isCorrupted
				? "corrupted-document whitespace-pre-wrap rounded border border-emerald-300/20 bg-black/25 p-4 text-sm leading-7 text-white/75"
				: "whitespace-pre-wrap text-sm leading-7 text-white/75"}>{documentContent}</pre>

			{#if documentTags.length}
				<div class="mt-6 flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.12em] text-white/40">
					<Tags size={13} />
					{#each documentTags as tag}
						<span class="rounded border border-white/10 bg-white/[0.03] px-2 py-1">{$dataText(tag)}</span>
					{/each}
				</div>
			{/if}

			{#if document.corruptionBadges?.length}
				<div class="mt-4 flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.12em] text-emerald-100/75">
					{#each document.corruptionBadges as badge}
						<span class="rounded border border-emerald-300/20 bg-emerald-300/5 px-2 py-1">{$t(`recovery.badges.${badge}`)}</span>
					{/each}
				</div>
			{/if}
		</div>
	</article>
{:else}
	<p class="p-4 text-sm text-white/45">{$t("empty.document")}</p>
{/if}
