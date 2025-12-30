<script lang="ts">
	import { Accordion } from '@skeletonlabs/skeleton-svelte';
	let { categories } = $props();

	// Pagination
	import { ArrowLeftIcon, ArrowRightIcon } from '@lucide/svelte';
	import { Pagination } from '@skeletonlabs/skeleton-svelte';
	import Category from './Category.svelte';
	import { fade } from 'svelte/transition';

	let page = $state(1);

	const start = $derived((page - 1) * 5);
	const end = $derived(start + 5);
	const paginatedCategories = $derived(categories.slice(start, end));
</script>

<Accordion collapsible>
	{#key page}
		<ul class="space-y-2 pb-4" in:fade>
			{#each paginatedCategories as category}
				<Category {category} />
			{/each}
		</ul>
	{/key}
</Accordion>
<Pagination
	count={categories.length}
	pageSize={5}
	{page}
	onPageChange={(event) => (page = event.page)}
>
	<Pagination.PrevTrigger>
		<ArrowLeftIcon class="size-4" />
	</Pagination.PrevTrigger>
	<Pagination.Context>
		{#snippet children(pagination)}
			{#each pagination().pages as page, index (page)}
				{#if page.type === 'page'}
					<Pagination.Item {...page}>
						{page.value}
					</Pagination.Item>
				{:else}
					<Pagination.Ellipsis {index}>&#8230;</Pagination.Ellipsis>
				{/if}
			{/each}
		{/snippet}
	</Pagination.Context>
	<Pagination.NextTrigger>
		<ArrowRightIcon class="size-4" />
	</Pagination.NextTrigger>
</Pagination>
