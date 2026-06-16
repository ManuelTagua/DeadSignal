<script>
	import { Camera, Flag, Image } from "@lucide/svelte";
	import { dataText, t } from "$lib/i18n";
	import { formatTimestamp } from "$lib/utils/format";

	let { media = null } = $props();
</script>

{#if media}
	<article class="flex h-full min-h-0 flex-col">
		<div class="border-b border-cyan-300/10 p-4">
			<div class="flex flex-wrap items-start justify-between gap-3">
				<div>
					<div class="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-white/40">
						<Image size={13} />
						<span>{$t(`values.mediaTypes.${media.type}`)}</span>
					</div>
					<h3 class="mt-2 text-xl font-semibold text-white">{$dataText(media.title)}</h3>
				</div>
				{#if media.isFlagged}
					<span class="flex items-center gap-1 rounded border border-cyan-300/30 bg-cyan-300/10 px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-cyan-50">
						<Flag size={12} />
						{$t("badges.flagged")}
					</span>
				{/if}
			</div>
		</div>

		<div class="grid min-h-0 flex-1 gap-4 overflow-y-auto p-4 xl:grid-cols-[minmax(0,1fr)_280px]">
			<div class="flex min-h-[320px] items-center justify-center rounded border border-cyan-300/15 bg-black/35 p-3">
				<img class="max-h-[62vh] w-full max-w-4xl rounded object-contain" src={media.url} alt={$dataText(media.title)} />
			</div>

			<div class="rounded border border-white/10 bg-black/25 p-3">
				<div class="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-white/40">
					<Camera size={13} />
					<span>{$t("labels.captureMetadata")}</span>
				</div>
				<dl class="mt-3 space-y-3 text-xs">
					<div>
						<dt class="uppercase tracking-[0.14em] text-white/35">{$t("labels.source")}</dt>
						<dd class="mt-1 text-white/70">{$dataText(media.source)}</dd>
					</div>
					<div>
						<dt class="uppercase tracking-[0.14em] text-white/35">{$t("labels.captured")}</dt>
						<dd class="mt-1 text-white/70">{formatTimestamp(media.capturedAt)}</dd>
					</div>
					<div>
						<dt class="uppercase tracking-[0.14em] text-white/35">{$t("labels.caption")}</dt>
						<dd class="mt-1 leading-5 text-white/65">{$dataText(media.caption)}</dd>
					</div>
				</dl>
			</div>
		</div>
	</article>
{:else}
	<p class="p-4 text-sm text-white/45">{$t("empty.media")}</p>
{/if}
