<script>
	import { onMount } from 'svelte';
	import { initLanguage } from '$lib/i18n';
	import { initInvestigation } from '$lib/stores/InvestigationStore';
	import { initProgress } from '$lib/stores/ProgressStore';
	import { initRecovery } from '$lib/stores/RecoveryStore';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();

	onMount(() => {
		initLanguage();
		initInvestigation();
		initProgress();
		initRecovery();
	});
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
{@render children()}
