<script>
	import { BadgeCheck, CircleX, Info, Target, TriangleAlert } from "@lucide/svelte";
	import { t } from "$lib/i18n";
	import { notifications, removeNotification } from "$lib/stores/NotificationStore";

	/** @param {string} type */
	function notificationClass(type) {
		if (type === "evidence") return "border-emerald-300/35 bg-emerald-300/10";
		if (type === "objective") return "border-cyan-300/35 bg-cyan-300/10";
		if (type === "warning") return "border-emerald-200/25 bg-emerald-200/5";
		if (type === "error") return "border-cyan-100/45 bg-cyan-100/10";
		return "border-white/10 bg-black/70";
	}
</script>

<div class="pointer-events-none fixed right-3 top-16 z-40 grid w-[min(360px,calc(100vw-24px))] gap-2">
	{#each $notifications as notification (notification.id)}
		<div class={`pointer-events-auto grid grid-cols-[auto_1fr_auto] gap-3 rounded border p-3 shadow-[0_0_30px_rgba(34,211,238,0.08)] backdrop-blur notification-enter ${notificationClass(notification.type)}`}>
			<div class="mt-0.5 flex h-8 w-8 items-center justify-center rounded border border-white/10 bg-black/35 text-cyan-50">
				{#if notification.type === "evidence"}
					<BadgeCheck size={15} />
				{:else if notification.type === "objective"}
					<Target size={15} />
				{:else if notification.type === "warning"}
					<TriangleAlert size={15} />
				{:else if notification.type === "error"}
					<CircleX size={15} />
				{:else}
					<Info size={15} />
				{/if}
			</div>
			<div class="min-w-0">
				<p class="text-xs font-semibold uppercase tracking-[0.16em] text-white">{$t(notification.titleKey)}</p>
				<p class="mt-1 text-xs leading-5 text-white/60">{$t(notification.messageKey, notification.params)}</p>
			</div>
			<button
				type="button"
				class="flex h-7 w-7 items-center justify-center rounded border border-white/10 bg-black/30 text-white/45 hover:border-cyan-300/25 hover:text-white"
				aria-label={$t("notifications.dismiss")}
				onclick={() => removeNotification(notification.id)}
			>
				<CircleX size={13} />
			</button>
		</div>
	{/each}
</div>
