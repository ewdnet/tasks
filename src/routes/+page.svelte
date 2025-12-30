<script lang="ts">
	import type { PageProps } from './$types';
	import { pageView } from '$lib/stores.svelte';
	import Tasks from '$lib/components/Tasks.svelte';
	import Categories from '$lib/components/Categories.svelte';
	import NewTask from '$lib/components/NewTask.svelte';
	import NewCategory from '$lib/components/NewCategory.svelte';
	import { scale } from 'svelte/transition';
	import { ListFilterPlusIcon, TagIcon } from '@lucide/svelte';

	const { data } = $props() as PageProps;

	let categories = $state<typeof data.categories>([]);
	let tasks = $state<typeof data.tasks>([]);

	$effect(() => {
		tasks = data.tasks;
		categories = data.categories;
	});

	let pageTitle: string = $state('');

	$effect(() => {
		switch (pageView.value) {
			case 'tasks':
				pageTitle = 'Tasks';
				break;
			case 'categories':
				pageTitle = 'Categories';
				break;
			case 'new-task':
				pageTitle = 'Create new Task';
				break;
			case 'new-category':
				pageTitle = 'Create new category';
				break;
		}
	});
</script>

<svelte:head>
	<title>{pageTitle}</title>
</svelte:head>

{#key pageView.value}
	<header class="flex items-center justify-between gap-4" in:scale={{ duration: 200 }}>
		<h1 class="flex-auto">{pageTitle}</h1>
		{#if pageView.value === 'tasks'}
			<button
				onclick={() => (pageView.value = 'new-task')}
				class="btn preset-filled-surface-200-800 btn-sm"
			>
				<ListFilterPlusIcon size={16} />
				New Task
			</button>
		{:else if pageView.value === 'categories'}
			<button
				onclick={() => (pageView.value = 'new-category')}
				class="btn preset-filled-surface-200-800 btn-sm"
			>
				<TagIcon size={16} />
				New Category
			</button>
		{/if}
	</header>
	<div in:scale={{ duration: 200 }}>
		{#if pageView.value === 'tasks'}
			<Tasks {categories} {tasks} />
		{:else if pageView.value === 'categories'}
			<Categories {categories} />
		{:else if pageView.value === 'new-task'}
			<NewTask {categories} />
		{:else if pageView.value === 'new-category'}
			<NewCategory />
		{/if}
	</div>
{/key}
