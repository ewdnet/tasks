<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import Footer from '$lib/site/Footer.svelte';
	import Header from '$lib/site/Header.svelte';

	let { children } = $props();

	const outer = 'px-2 sm:py-4';
	const inner = 'w-full max-w-xl mx-auto  py-4 space-y-4';
	const border_t = 'border-t border-t-primary-200-800';
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<header class={outer}>
	<div class="{inner} flex items-center justify-between gap-4">
		<Header />
	</div>
</header>
<main class="flex-auto {outer}">
	<article class={inner}>
		{@render children()}
	</article>
</main>
<footer class={outer}>
	<div class="{inner} {border_t}">
		<Footer />
	</div>
</footer>
