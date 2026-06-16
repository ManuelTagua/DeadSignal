<script>
	import { ClipboardCheck, FileSearch, NotebookText, Tags } from "@lucide/svelte";
	import { t } from "$lib/i18n";

	let { evidence = null } = $props();
</script>

{#if evidence}
	<section class="grid min-h-[360px] gap-4 rounded border border-cyan-300/20 bg-black/25 p-4 investigation-detail">
		<div class="flex flex-wrap items-start justify-between gap-3 border-b border-cyan-300/10 pb-4">
			<div class="min-w-0">
				<p class="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-white/40">
					<ClipboardCheck size={13} />
					{$t("evidence.detailTitle")}
				</p>
				<h3 class="mt-2 text-2xl font-semibold leading-tight text-white">{$t(evidence.titleKey)}</h3>
				<p class="mt-2 max-w-3xl text-sm leading-6 text-white/60">{$t(evidence.longDescriptionKey)}</p>
			</div>
			<span class="rounded border border-emerald-300/35 bg-emerald-300/10 px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-emerald-50">
				{$t(evidence.statusKey)}
			</span>
		</div>

		<div class="grid gap-3 xl:grid-cols-[minmax(0,1fr)_280px]">
			<div class="grid gap-3">
				<div class="rounded border border-white/10 bg-black/25 p-3">
					<p class="flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-white/35">
						<NotebookText size={13} />
						{$t("evidence.forensicNotes")}
					</p>
					<p class="mt-2 text-sm leading-6 text-white/65">{$t(evidence.forensicNotesKey)}</p>
				</div>

				<div class="rounded border border-white/10 bg-black/25 p-3">
					<p class="flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-white/35">
						<FileSearch size={13} />
						{$t("evidence.relatedFiles")}
					</p>
					<div class="mt-3 grid gap-2">
						{#each evidence.relatedFileKeys as fileKey}
							<div class="rounded border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-white/65">
								{$t(fileKey)}
							</div>
						{/each}
					</div>
				</div>
			</div>

			<aside class="rounded border border-white/10 bg-black/25 p-3">
				<dl class="grid gap-4 text-xs">
					<div>
						<dt class="uppercase tracking-[0.14em] text-white/35">{$t("labels.evidenceSource")}</dt>
						<dd class="mt-1 text-white/70">{$t(evidence.sourceKey)}</dd>
					</div>
					<div>
						<dt class="uppercase tracking-[0.14em] text-white/35">{$t("labels.evidenceStatus")}</dt>
						<dd class="mt-1 text-white/70">{$t(evidence.statusKey)}</dd>
					</div>
					<div>
						<dt class="flex items-center gap-2 uppercase tracking-[0.14em] text-white/35">
							<Tags size={13} />
							{$t("labels.evidenceTags")}
						</dt>
						<dd class="mt-2 flex flex-wrap gap-1.5">
							{#each evidence.tagKeys as tagKey}
								<span class="rounded border border-cyan-300/20 bg-cyan-300/5 px-2 py-1 text-[10px] uppercase tracking-[0.12em] text-cyan-50">
									{$t(tagKey)}
								</span>
							{/each}
						</dd>
					</div>
				</dl>
			</aside>
		</div>
	</section>
{:else}
	<section class="grid min-h-[320px] place-items-center rounded border border-white/10 bg-black/25 p-6 text-center">
		<div>
			<div class="mx-auto flex h-12 w-12 items-center justify-center rounded border border-cyan-300/25 bg-cyan-300/10 text-cyan-50">
				<FileSearch size={20} />
			</div>
			<h3 class="mt-4 text-sm font-semibold uppercase tracking-[0.16em] text-white">{$t("evidence.selectPrompt")}</h3>
			<p class="mt-3 max-w-md text-xs leading-5 text-white/50">{$t("evidence.selectHint")}</p>
		</div>
	</section>
{/if}
