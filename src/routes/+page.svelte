<script lang="ts">
	import type { PageProps } from './$types';
	import type { CategoryItem, TaskItem } from '$lib/types';
	import {
		categoryStatus,
		categorySelected,
		taskStatus,
		pageView,
		progressOverall,
		paginatorReset
	} from '$lib/stores.svelte';
	import Tasks from '$lib/components/Tasks.svelte';
	import Categories from '$lib/components/Categories.svelte';
	import NewTask from '$lib/components/NewTask.svelte';
	import NewCategory from '$lib/components/NewCategory.svelte';
	import { scale } from 'svelte/transition';

	const { data } = $props() as PageProps;
	let { categories, tasks } = $derived(data);

	type CategoryTaskItem = CategoryItem extends { tasks: Array<infer T> } ? T : never;

	let filteredCategories = $state<typeof data.categories>([]);
	let filteredTasks = $state<typeof data.tasks>([]);

	const pageTitle = $derived(pageView.value.charAt(0).toUpperCase() + pageView.value.slice(1));

	$effect(() => {
		categories = data.categories;
		tasks = data.tasks;
	});

	$effect(() => {
		let progress: number = 0;
		progressOverall.value = null;
		setTimeout(() => {
			if (tasks.length > 0) {
				tasks.map((e: TaskItem) => (progress += e.progress));
				progressOverall.value = Math.round(progress / tasks.length);
			}
		}, 400);
	});

	// Filtering
	$effect(() => {
		// Reset pagination when filters change
		void categorySelected.value;
		void taskStatus.value;
		paginatorReset.value = 1;
	});

	// filteredCategories
	$effect(() => {
		if (categoryStatus.value === '') {
			filteredCategories = categories;
		} else {
			if (categoryStatus.value === 'emptycategories')
				filteredCategories = categories.filter(
					(category: CategoryItem) => category.tasks.length === 0
				);
			if (categoryStatus.value === 'inprogresscategories')
				filteredCategories = categories.filter(
					(category: CategoryItem) =>
						category.tasks.length > 0 &&
						category.tasks.length >
							category.tasks.filter((task: CategoryTaskItem) => task.progress === 100).length
				);
			if (categoryStatus.value === 'completedcategories')
				filteredCategories = categories.filter(
					(category: CategoryItem) =>
						category.tasks.length !== 0 &&
						category.tasks.length ===
							category.tasks.filter((task: CategoryTaskItem) => task.progress === 100).length
				);
		}
	});
	// filteredTasks
	$effect(() => {
		if (categorySelected.value === '') {
			if (taskStatus.value === '') {
				filteredTasks = tasks;
			} else {
				if (taskStatus.value === 'new')
					filteredTasks = tasks.filter((task: TaskItem) => task.progress === 0);
				if (taskStatus.value === 'current')
					filteredTasks = tasks.filter(
						(task: TaskItem) => task.progress > 0 && task.progress < 100
					);
				if (taskStatus.value === 'completed')
					filteredTasks = tasks.filter((task: TaskItem) => task.progress === 100);
			}
		} else {
			if (taskStatus.value === '') {
				filteredTasks = tasks.filter(
					(task: TaskItem) => task.categoryId === categorySelected.value
				);
			} else {
				if (taskStatus.value === 'new')
					filteredTasks = tasks
						.filter((task: TaskItem) => task.categoryId === categorySelected.value)
						.filter((task: TaskItem) => task.progress === 0);
				if (taskStatus.value === 'current')
					filteredTasks = tasks
						.filter((task: TaskItem) => task.categoryId === categorySelected.value)
						.filter((task: TaskItem) => task.progress > 0 && task.progress < 100);
				if (taskStatus.value === 'completed')
					filteredTasks = tasks
						.filter((task: TaskItem) => task.categoryId === categorySelected.value)
						.filter((task: TaskItem) => task.progress === 100);
			}
		}
	});
</script>

<svelte:head>
	<title>{pageTitle}</title>
</svelte:head>

{#key pageView.value}
	<header class="flex items-center justify-between gap-4" in:scale={{ duration: 200 }}>
		<h1 class="flex-auto h4">{pageTitle}</h1>
		{#if pageView.value === 'tasks'}
			<NewTask {categories} />
		{:else if pageView.value === 'categories'}
			<NewCategory />
		{/if}
	</header>
	<div in:scale={{ duration: 200 }}>
		{#if pageView.value === 'tasks'}
			<Tasks {categories} tasks={filteredTasks} />
		{:else if pageView.value === 'categories'}
			<Categories categories={filteredCategories} />
		{/if}
	</div>
{/key}
