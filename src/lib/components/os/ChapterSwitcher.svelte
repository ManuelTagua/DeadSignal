<script>
	import { LockKeyhole, RadioTower } from "@lucide/svelte";
	import { t } from "$lib/i18n";

	let {
		chapters = [],
		activeChapterId = "chapter-1",
		onSelectChapter = () => {}
	} = $props();

	/** @param {Record<string, any>} chapter */
	function chapterClass(chapter) {
		if (!chapter.unlocked) {
			return "flex min-h-12 min-w-0 items-center gap-3 rounded border border-white/10 bg-black/20 px-3 py-2 text-left text-white/35";
		}

		return activeChapterId === chapter.id
			? "flex min-h-12 min-w-0 items-center gap-3 rounded border border-cyan-300/35 bg-cyan-300/10 px-3 py-2 text-left text-cyan-50"
			: "flex min-h-12 min-w-0 items-center gap-3 rounded border border-white/10 bg-black/25 px-3 py-2 text-left text-white/60 hover:border-cyan-300/25 hover:text-white";
	}
</script>

<section class="dead-panel border-x-0 border-t-0 px-3 py-2 lg:px-4">
	<div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
		<div class="min-w-0">
			<p class="text-[10px] uppercase tracking-[0.2em] text-white/40">{$t("chapters.title")}</p>
			<p class="text-xs leading-5 text-white/55">{$t("chapters.subtitle")}</p>
		</div>

		<div class="grid gap-2 sm:min-w-[640px] sm:grid-cols-3">
			{#each chapters as chapter}
				<button
					type="button"
					class={chapterClass(chapter)}
					aria-pressed={activeChapterId === chapter.id}
					disabled={!chapter.unlocked}
					onclick={() => onSelectChapter(chapter.id)}
				>
					<span class="flex h-8 w-8 shrink-0 items-center justify-center rounded border border-white/10 bg-white/[0.03]">
						{#if chapter.unlocked}
							<RadioTower size={15} />
						{:else}
							<LockKeyhole size={15} />
						{/if}
					</span>
					<span class="min-w-0">
						<span class="block truncate text-xs font-semibold uppercase tracking-[0.14em]">{$t(chapter.titleKey)}</span>
						<span class="mt-0.5 block truncate text-[11px] leading-4 text-white/45">
							{activeChapterId === chapter.id
								? $t("chapters.status.active")
								: chapter.comingSoon && chapter.unlocked
									? $t("chapters.status.comingSoon")
								: chapter.unlocked
									? $t("chapters.status.available")
									: $t("chapters.status.locked")}
						</span>
					</span>
				</button>
			{/each}
		</div>
	</div>
</section>
