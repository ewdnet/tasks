<script lang="ts" module>
	const PAGE_SIZE = 5;
</script>

<script lang="ts">
	import type { CategoryItem } from '$lib/types';
	import { Accordion, Pagination } from '@skeletonlabs/skeleton-svelte';
	import Category from '$lib/components/Category.svelte';
	import CategoriesDeleting from '$lib/components/CategoriesDeleting.svelte';
	import { ArrowLeftIcon, ArrowRightIcon } from '@lucide/svelte';
	import { fade } from 'svelte/transition';
	import {
		accordionCollapsed,
		categoryStatus,
		paginatorReset,
		searchTerm
	} from '$lib/stores.svelte';

	let { categories } = $props<{ categories: CategoryItem[] }>();

	// Pagination
	const page = $derived(paginatorReset.value ?? 1);
	const start = $derived((page - 1) * PAGE_SIZE);
	const end = $derived(start + PAGE_SIZE);
	const paginatedCategories = $derived(categories.slice(start, end));
</script>

{#if categories.length}
	{#key accordionCollapsed.value}
		<Accordion collapsible>
			{#key categoryStatus.value || paginatorReset.value}
				<ul class="space-y-2 pb-4" in:fade>
					{#each paginatedCategories as category (category.id)}
						<Category {category} />
					{/each}
				</ul>
			{/key}
		</Accordion>
	{/key}
	<footer class="flex justify-between gap-8">
		<div class="flex items-center gap-2">
			<small>
				{#if categoryStatus.value !== '' || searchTerm.value !== ''}
					Filtered Categories:
				{:else}
					Total Categories:
				{/if}
				{categories.length}
			</small>
			{#if categories.length > 1}
				<CategoriesDeleting {categories} />
			{/if}
		</div>
		{#if categories.length > PAGE_SIZE}
			<Pagination
				defaultPage={1}
				count={categories.length}
				pageSize={PAGE_SIZE}
				{page}
				onPageChange={(event: { page: number }) => {
					paginatorReset.value = event.page;
				}}
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
	</footer>
{:else}
	<p class="py-4 text-center">No Categories found.</p>
{/if}
