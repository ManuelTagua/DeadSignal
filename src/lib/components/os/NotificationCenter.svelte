<script>
	import { BadgeCheck, CircleX, Info, Target, TriangleAlert } from "@lucide/svelte";
	import { t } from "$lib/i18n";
	import { notifications, removeNotification } from "$lib/stores/NotificationStore";

	/** @param {string} type */
	function notificationClass(type) {
		if (type === "evidence" || type === "objective") return "border-emerald-300/40 bg-emerald-300/10 shadow-[0_0_30px_rgba(52,211,153,0.1)]";
		if (type === "warning") return "border-amber-300/45 bg-amber-300/10 shadow-[0_0_30px_rgba(251,191,36,0.1)]";
		if (type === "error") return "border-red-400/55 bg-red-500/15 shadow-[0_0_30px_rgba(248,113,113,0.14)]";
		if (type === "info") return "border-cyan-300/35 bg-cyan-300/10 shadow-[0_0_30px_rgba(34,211,238,0.08)]";
		return "border-white/10 bg-black/70 shadow-[0_0_30px_rgba(34,211,238,0.08)]";
	}

	/** @param {string} type */
	function iconClass(type) {
		if (type === "evidence" || type === "objective") return "border-emerald-300/20 text-emerald-100";
		if (type === "warning") return "border-amber-300/25 text-amber-100";
		if (type === "error") return "border-red-300/30 text-red-100";
		return "border-cyan-300/20 text-cyan-50";
	}
</script>

<div class="pointer-events-none fixed right-3 top-16 z-40 grid w-[min(360px,calc(100vw-24px))] gap-2">
	{#each $notifications as notification (notification.id)}
		<div class={`pointer-events-auto grid grid-cols-[auto_1fr_auto] gap-3 rounded border p-3 backdrop-blur notification-enter ${notificationClass(notification.type)}`}>
			<div class={`mt-0.5 flex h-8 w-8 items-center justify-center rounded border bg-black/35 ${iconClass(notification.type)}`}>
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
