<script lang="ts" module>
	const PAGE_SIZE = 5;
</script>

<script lang="ts">
	import type { CategoryItem, TaskItem } from '$lib/types';
	import { paginatorReset } from '$lib/stores.svelte';
	import Task from './Task.svelte';
	import { Accordion, Pagination } from '@skeletonlabs/skeleton-svelte';
	import { fade } from 'svelte/transition';
	import { ArrowLeftIcon, ArrowRightIcon } from '@lucide/svelte';
	import TaskStatus from './TaskStatus.svelte';

	let { categories, tasks, scopeTasks } = $props<{
		categories: CategoryItem[];
		tasks: TaskItem[];
		scopeTasks: TaskItem[];
	}>();

	// Pagination
	const page = $derived(paginatorReset.value ?? 1);
	const start = $derived((page - 1) * PAGE_SIZE);
	const end = $derived(start + PAGE_SIZE);
	const paginatedTasks = $derived(tasks.slice(start, end));
</script>

{#if tasks.length}
	<Accordion collapsible>
		{#key page}
			<ul class="space-y-2 pb-4" in:fade>
				{#each paginatedTasks as task (task.id)}
					<Task {task} {categories} />
				{/each}
			</ul>
		{/key}
	</Accordion>
	<div class="flex items-center justify-between">
		<TaskStatus {scopeTasks} />
		{#if tasks.length > PAGE_SIZE}
			<Pagination
				defaultPage={1}
				count={tasks.length}
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
	</div>
{:else}
	<p class="text-center">No Tasks found.</p>
{/if}
