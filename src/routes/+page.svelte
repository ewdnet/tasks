<script lang="ts">
	import type { PageProps } from './$types';
	import type { CategoryItem, TaskItem } from '$lib/types';
	import Tasks from '$lib/components/Tasks.svelte';
	import Categories from '$lib/components/Categories.svelte';
	import NewTask from '$lib/components/NewTask.svelte';
	import NewCategory from '$lib/components/NewCategory.svelte';
	import TasksPageTitle from '$lib/components/TasksPageTitle.svelte';
	import CategoriesPageTitle from '$lib/components/CategoriesPageTitle.svelte';
	import TaskStatus from '$lib/components/TaskStatus.svelte';
	import CategoryStatus from '$lib/components/CategoryStatus.svelte';
	import { scale } from 'svelte/transition';
	import {
		categoryStatus,
		categorySelected,
		taskStatus,
		pageView,
		progressOverall,
		paginatorReset,
		searchTerm
	} from '$lib/stores.svelte';

	const { data } = $props() as PageProps;
	let categories = $state<CategoryItem[]>([]);
	let tasks = $state<TaskItem[]>([]);

	type CategoryTaskItem = CategoryItem extends { tasks: Array<infer T> } ? T : never;

	let filteredCategories = $state<typeof data.categories>([]);
	let filteredTasks = $state<typeof data.tasks>([]);

	$effect(() => {
		categories = data.categories;
		tasks = data.tasks;
	});

	$effect(() => {
		const total = tasks.length;
		if (total === 0) {
			progressOverall.value = null;
			return;
		}

		let sum = 0;
		for (const task of tasks) sum += task.progress;
		progressOverall.value = Math.round(sum / total);
	});

	// Filtering
	$effect(() => {
		// Reset pagination when filters change
		void pageView.value;
		void searchTerm.value;
		void taskStatus.value;
		void categoryStatus.value;
		void categorySelected.value;
		paginatorReset.value = 1;
	});

	// filteredCategories (deterministic)
	$effect(() => {
		let result = categories;

		if (pageView.value === 'categories' && searchTerm.value.length > 0) {
			const q = searchTerm.value.toLowerCase();
			result = result.filter((category: CategoryItem) => category.name.toLowerCase().includes(q));
		}

		if (categoryStatus.value === 'emptycategories') {
			result = result.filter((category: CategoryItem) => category.tasks.length === 0);
		} else if (categoryStatus.value === 'inprogresscategories') {
			result = result.filter(
				(category: CategoryItem) =>
					category.tasks.length > 0 &&
					category.tasks.length >
						category.tasks.filter((task: CategoryTaskItem) => task.progress === 100).length
			);
		} else if (categoryStatus.value === 'completedcategories') {
			result = result.filter(
				(category: CategoryItem) =>
					category.tasks.length > 0 &&
					category.tasks.length ===
						category.tasks.filter((task: CategoryTaskItem) => task.progress === 100).length
			);
		}

		filteredCategories = result;
	});

	// filteredTasks (deterministic)
	$effect(() => {
		let result = tasks;

		if (categorySelected.value !== '') {
			result = result.filter((task: TaskItem) => task.categoryId === categorySelected.value);
		}

		if (pageView.value === 'tasks' && searchTerm.value.length > 0) {
			const q = searchTerm.value.toLowerCase();
			result = result.filter(
				(task: TaskItem) =>
					task.title.toLowerCase().includes(q) || task.content?.toLowerCase().includes(q)
			);
		}

		if (taskStatus.value === 'new') {
			result = result.filter((task: TaskItem) => task.progress === 0);
		} else if (taskStatus.value === 'current') {
			result = result.filter((task: TaskItem) => task.progress > 0 && task.progress < 100);
		} else if (taskStatus.value === 'completed') {
			result = result.filter((task: TaskItem) => task.progress === 100);
		}

		filteredTasks = result;
	});
</script>

{#key pageView.value}
	<header in:scale={{ duration: 200 }}>
		{#if pageView.value === 'tasks'}
			<h1 class="pb-4 h4"><TasksPageTitle {categories} /></h1>
			<div class="flex flex-row-reverse items-center justify-between gap-4">
				<NewTask {categories} />
				<TaskStatus {tasks} />
			</div>
		{:else if pageView.value === 'categories'}
			<h1 class="pb-4 h4"><CategoriesPageTitle /></h1>
			<div class="flex flex-row-reverse items-center justify-between gap-4">
				<NewCategory />
				<CategoryStatus {categories} />
			</div>
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
