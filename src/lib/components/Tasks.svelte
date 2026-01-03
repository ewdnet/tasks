<script lang="ts" module>
	const PAGE_SIZE = 5;
</script>

<script lang="ts">
	import { Accordion } from '@skeletonlabs/skeleton-svelte';
	import Task from './Task.svelte';
	import { taskStatus, paginatorReset } from '$lib/stores.svelte';

	type CategoryItem = {
		id: string;
		name: string;
	};
	type TaskItem = {
		id: string;
		progress: number;
		categoryId: string;
		title: string;
		content?: string | null;
		createdAt: Date;
		updatedAt: Date;
	};

	let { categories, tasks } = $props<{ categories: CategoryItem[]; tasks: TaskItem[] }>();

	// Pagination
	import { ArrowLeftIcon, ArrowRightIcon } from '@lucide/svelte';
	import { Pagination } from '@skeletonlabs/skeleton-svelte';
	import { fade } from 'svelte/transition';

	const page = $derived(paginatorReset.value ?? 1);

	const start = $derived((page - 1) * PAGE_SIZE);
	const end = $derived(start + PAGE_SIZE);
	const paginatedTasks = $derived(tasks.slice(start, end));

	// New Tasks
	function newTasks() {
		return tasks.filter((task: TaskItem) => task.progress === 0).length;
	}
	// In Progress Tasks
	function inprogressTasks() {
		return tasks.filter((task: TaskItem) => task.progress > 0 && task.progress < 100).length;
	}
	// In Progress Tasks
	function completedTasks() {
		return tasks.filter((task: TaskItem) => task.progress === 100).length;
	}
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
		<ul class="flex items-center gap-2">
			<li>
				<strong>Total Tasks:</strong>
				{tasks.length}
			</li>
			{#if newTasks()}
				<li>
					<button
						onclick={() => (taskStatus.value = 'new')}
						disabled={newTasks() === 0}
						class="btn-icon btn btn-icon-sm rounded-full preset-outlined-error-200-800"
					>
						{newTasks()}
					</button>
				</li>
			{/if}
			{#if inprogressTasks()}
				<li>
					<button
						onclick={() => (taskStatus.value = 'current')}
						disabled={inprogressTasks() === 0}
						class="btn-icon btn btn-icon-sm rounded-full preset-outlined-warning-200-800"
					>
						{inprogressTasks()}
					</button>
				</li>
			{/if}
			{#if completedTasks()}
				<li>
					<button
						onclick={() => (taskStatus.value = 'completed')}
						disabled={completedTasks() === 0}
						class="btn-icon btn btn-icon-sm rounded-full preset-outlined-success-200-800"
					>
						{completedTasks()}
					</button>
				</li>
			{/if}
		</ul>
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
