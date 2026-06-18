<script>
	import { ArrowDown, ArrowUp, CheckCircle, FileSearch, LockKeyhole, Route } from "@lucide/svelte";
	import { CHAPTER_TIMELINE_EVENTS, INITIAL_TIMELINE_ORDER, sortTimelineEvents } from "$lib/game/timeline";
	import { t } from "$lib/i18n";

	let {
		events = [],
		totalEvents = CHAPTER_TIMELINE_EVENTS.length,
		preferredOrder = INITIAL_TIMELINE_ORDER,
		timelineState = {},
		onSetTimelineOrder = () => {},
		onValidateTimeline = () => ({})
	} = $props();

	let validationHint = $state("");
	let localOrder = $state(/** @type {string[]} */ ([]));
	let syncedOrderKey = $state("");
	const unlockedEvents = $derived(events.filter((event) => event.unlocked));
	const lockedEvents = $derived(events.filter((event) => !event.unlocked));
	const storedOrder = $derived(Array.isArray(timelineState?.order) ? timelineState.order : []);
	const unlockedEventIds = $derived(unlockedEvents.map((event) => event.id));
	const timelineSyncKey = $derived(`${storedOrder.join("|")}::${unlockedEventIds.join("|")}`);
	const orderedEvents = $derived(eventsForOrder(localOrder));
	const allEventsUnlocked = $derived(unlockedEvents.length === totalEvents);
	const timelineCompleted = $derived(Boolean(timelineState?.completed));
	const canValidate = $derived(allEventsUnlocked && orderedEvents.length === totalEvents && !timelineCompleted);

	$effect(() => {
		if (timelineSyncKey === syncedOrderKey) return;

		localOrder = normalizedTimelineOrder(storedOrder, unlockedEvents);
		syncedOrderKey = timelineSyncKey;
	});

	/** @param {Record<string, any>} event */
	function eventClass(event) {
		if (timelineCompleted) return "rounded border border-emerald-300/30 bg-emerald-300/10 p-3";
		if (event.unlocked) return "rounded border border-white/10 bg-black/25 p-3";
		return "rounded border border-white/10 bg-black/20 p-3 opacity-55";
	}

	/** @param {string[]} order */
	function eventsForOrder(order) {
		const byId = new Map(unlockedEvents.map((event) => [event.id, event]));

		return normalizedTimelineOrder(order, unlockedEvents).flatMap((eventId) => {
			const event = byId.get(eventId);
			return event ? [event] : [];
		});
	}

	/**
	 * @param {string[]} order
	 * @param {Array<Record<string, any>>} availableEvents
	 */
	function normalizedTimelineOrder(order, availableEvents) {
		const availableIds = sortTimelineEvents(availableEvents, preferredOrder).map((event) => event.id);
		const availableIdSet = new Set(availableIds);
		const cleanOrder = Array.from(new Set(order.map((eventId) => String(eventId).trim()).filter(Boolean))).filter((eventId) =>
			availableIdSet.has(eventId)
		);
		const baseOrder = cleanOrder.length ? cleanOrder : availableIds;
		const missingIds = availableIds.filter((eventId) => !baseOrder.includes(eventId));

		return [...baseOrder, ...missingIds];
	}

	/**
	 * @param {string} eventId
	 * @param {-1 | 1} direction
	 */
	function moveEvent(eventId, direction) {
		if (timelineCompleted) return;

		const currentOrder = orderedEvents.map((event) => event.id);
		const currentIndex = currentOrder.indexOf(eventId);
		const nextIndex = currentIndex + direction;

		if (currentIndex < 0 || nextIndex < 0 || nextIndex >= currentOrder.length) return;

		const nextOrder = [...currentOrder];
		const [item] = nextOrder.splice(currentIndex, 1);
		nextOrder.splice(nextIndex, 0, item);
		validationHint = "";
		localOrder = nextOrder;
		const savedOrder = onSetTimelineOrder(nextOrder);
		if (Array.isArray(savedOrder)) localOrder = normalizedTimelineOrder(savedOrder, unlockedEvents);
	}

	function validateTimeline() {
		if (!canValidate) return;

		const result = onValidateTimeline(orderedEvents.map((event) => event.id));
		if (Array.isArray(result?.order)) localOrder = normalizedTimelineOrder(result.order, unlockedEvents);
		validationHint = result?.accepted ? "" : "timeline.validation.rejectedHint";
	}
</script>

<section class="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
	<div class="grid gap-4">
		<div class="rounded border border-cyan-300/15 bg-black/25 p-4">
			<div class="flex flex-wrap items-start justify-between gap-4">
				<div class="min-w-0">
					<div class="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-white/40">
						<Route size={13} />
						<span>{$t("timeline.title")}</span>
					</div>
					<h3 class="mt-2 text-lg font-semibold text-white">{$t("timeline.heading")}</h3>
					<p class="mt-2 max-w-3xl text-sm leading-6 text-white/60">{$t("timeline.body")}</p>
				</div>
				<div class="min-w-[180px] rounded border border-cyan-300/15 bg-cyan-300/5 p-3 text-[10px] uppercase tracking-[0.14em] text-white/45">
					<p>{$t("timeline.progress")}</p>
					<p class="mt-1 text-sm font-semibold text-cyan-50">{unlockedEvents.length}/{totalEvents}</p>
				</div>
			</div>
		</div>

		<div class="rounded border border-white/10 bg-black/25 p-3">
			<div class="flex flex-wrap items-center justify-between gap-3">
				<p class="text-[10px] uppercase tracking-[0.18em] text-white/40">{$t("timeline.unlockedTitle")}</p>
				{#if timelineCompleted}
					<p class="flex items-center gap-2 text-[10px] uppercase tracking-[0.14em] text-emerald-100">
						<CheckCircle size={13} />
						{$t("timeline.validation.completed")}
					</p>
				{/if}
			</div>

			<div class="mt-3 grid gap-2">
				{#each orderedEvents as event, index (event.id)}
					<article class={eventClass(event)}>
						<div class="grid gap-3 sm:grid-cols-[2rem_1fr_auto] sm:items-center">
							<div class="flex h-8 w-8 items-center justify-center rounded border border-cyan-300/20 bg-cyan-300/5 text-xs font-semibold text-cyan-50">
								{index + 1}
							</div>
							<div class="min-w-0">
								<div class="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.14em] text-white/35">
									<FileSearch size={12} />
									<span>{$t(event.sourceKey)}</span>
								</div>
								<h3 class="mt-1 text-sm font-semibold leading-5 text-white">{$t(event.titleKey)}</h3>
								<p class="mt-1 text-xs leading-5 text-white/55">{$t(event.descriptionKey)}</p>
							</div>
							<div class="flex items-center gap-2">
								<button
									type="button"
									class="flex h-8 w-8 items-center justify-center rounded border border-white/10 bg-white/[0.03] text-white/60 hover:border-cyan-300/25 hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
									aria-label={$t("timeline.actions.moveUp")}
									disabled={timelineCompleted || index === 0}
									onclick={() => moveEvent(event.id, -1)}
								>
									<ArrowUp size={14} />
								</button>
								<button
									type="button"
									class="flex h-8 w-8 items-center justify-center rounded border border-white/10 bg-white/[0.03] text-white/60 hover:border-cyan-300/25 hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
									aria-label={$t("timeline.actions.moveDown")}
									disabled={timelineCompleted || index === orderedEvents.length - 1}
									onclick={() => moveEvent(event.id, 1)}
								>
									<ArrowDown size={14} />
								</button>
							</div>
						</div>
					</article>
				{:else}
					<div class="grid min-h-[180px] place-items-center rounded border border-white/10 bg-black/25 p-6 text-center">
						<div>
							<div class="mx-auto flex h-12 w-12 items-center justify-center rounded border border-cyan-300/25 bg-cyan-300/10 text-cyan-50">
								<LockKeyhole size={20} />
							</div>
							<h3 class="mt-4 text-sm font-semibold uppercase tracking-[0.16em] text-white">{$t("timeline.empty")}</h3>
							<p class="mt-3 max-w-md text-xs leading-5 text-white/50">{$t("timeline.emptyHint")}</p>
						</div>
					</div>
				{/each}
			</div>

			{#if validationHint}
				<p class="mt-3 rounded border border-red-300/35 bg-red-500/10 px-3 py-2 text-xs leading-5 text-red-50">
					{$t(validationHint)}
				</p>
			{/if}

			<div class="mt-3 flex flex-wrap items-center justify-between gap-3">
				<p class="text-[10px] uppercase tracking-[0.14em] text-white/40">
					{allEventsUnlocked ? $t("timeline.validation.ready") : $t("timeline.validation.locked")}
				</p>
				<button
					type="button"
					class="flex h-10 items-center justify-center gap-2 rounded border border-emerald-300/30 bg-emerald-300/10 px-3 text-xs uppercase tracking-[0.14em] text-emerald-50 hover:border-emerald-200/60 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:border-emerald-300/30"
					disabled={!canValidate}
					onclick={validateTimeline}
				>
					<CheckCircle size={14} />
					{$t("timeline.actions.validate")}
				</button>
			</div>
		</div>
	</div>

	<aside class="grid content-start gap-3">
		<div class="rounded border border-white/10 bg-black/25 p-3">
			<p class="text-[10px] uppercase tracking-[0.18em] text-white/40">{$t("timeline.lockedTitle")}</p>
			<div class="mt-3 grid gap-2">
				{#each lockedEvents as event}
					<div class="rounded border border-white/10 bg-white/[0.03] p-2">
						<p class="flex items-center gap-2 text-[10px] uppercase tracking-[0.14em] text-white/35">
							<LockKeyhole size={12} />
							{$t("timeline.status.locked")}
						</p>
						<p class="mt-1 text-xs font-semibold leading-5 text-white/50">{$t(event.titleKey)}</p>
						<p class="mt-1 text-[11px] leading-4 text-white/35">{$t(event.sourceKey)}</p>
					</div>
				{:else}
					<p class="text-xs leading-5 text-white/45">{$t("timeline.allUnlocked")}</p>
				{/each}
			</div>
		</div>
	</aside>
</section>
