<script>
	import { RadioTower } from "@lucide/svelte";
	import { t } from "$lib/i18n";
</script>

<section class="soft-glitch rounded border border-emerald-300/30 bg-emerald-300/10 p-4">
	<div class="flex items-start gap-3">
		<div class="flex h-10 w-10 shrink-0 items-center justify-center rounded border border-emerald-300/35 bg-black/30 text-emerald-100">
			<RadioTower size={18} />
		</div>
		<div class="min-w-0">
			<p class="text-[10px] uppercase tracking-[0.2em] text-emerald-100/75">{$t("chapterSummary.eyebrow")}</p>
			<h3 class="mt-1 text-lg font-semibold text-white">{$t("chapterSummary.title")}</h3>
			<p class="mt-2 inline-flex rounded border border-emerald-300/25 bg-emerald-300/10 px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-emerald-50">
				{$t("chapterSummary.status")}
			</p>
			<div class="mt-3 grid gap-2 text-sm leading-6 text-white/70 sm:grid-cols-2">
				{#each ["communication", "unauthorized", "serverRoom", "deliberate", "internal"] as item}
					<div class="rounded border border-white/10 bg-black/25 px-3 py-2">
						{$t(`chapterSummary.points.${item}`)}
					</div>
				{/each}
			</div>
			<p class="mt-4 text-sm leading-6 text-emerald-50/80">{$t("chapterSummary.hook")}</p>
		</div>
	</div>
</section>
