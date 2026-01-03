<script lang="ts" module>
	const PAGE_SIZE = 5;
</script>

<script lang="ts">
	import { Accordion } from '@skeletonlabs/skeleton-svelte';

	type CategoryItem = {
		id: string;
		name: string;
		// present because the server load includes it; used elsewhere
		tasks?: { id: string; progress: number }[];
	};

	let { categories } = $props<{ categories: CategoryItem[] }>();

	// Pagination
	import { ArrowLeftIcon, ArrowRightIcon } from '@lucide/svelte';
	import { Pagination } from '@skeletonlabs/skeleton-svelte';
	import Category from './Category.svelte';
	import { fade } from 'svelte/transition';

	let page = $state(1);

	const start = $derived((page - 1) * PAGE_SIZE);
	const end = $derived(start + PAGE_SIZE);
	const paginatedCategories = $derived(categories.slice(start, end));
</script>

{#if categories.length}
	<Accordion collapsible>
		{#key page}
			<ul class="space-y-2 pb-4" in:fade>
				{#each paginatedCategories as category (category.id)}
					<Category {category} />
				{/each}
			</ul>
		{/key}
	</Accordion>
	<div class="flex items-center justify-between">
		<ul class="flex items-center gap-2">
			<li>
				<strong>Total Categories:</strong>
				{categories.length}
			</li>
		</ul>
		{#if categories.length > PAGE_SIZE}
			<Pagination
				count={categories.length}
				pageSize={PAGE_SIZE}
				{page}
				onPageChange={(event: { page: number }) => (page = event.page)}
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
		{/if}
	</div>
{:else}
	<p class="py-4 text-center">No Categories found.</p>
{/if}
