<script lang="ts">
	import type { CategoryItem, TaskItem } from '$lib/types';
	import { categorySelected, taskDelete, taskEdit } from '$lib/stores.svelte';
	import { PencilIcon, TrashIcon } from '@lucide/svelte';
	const iconSize = 16;

	let { categories, task } = $props<{ categories: CategoryItem[]; task: TaskItem }>();
</script>

<p class="text-right">
	<small>Category:</small>
	{#if task.categoryId === categorySelected.value}
		<small>{categories.find((c: CategoryItem) => c.id === task.categoryId)?.name}</small>
	{:else}
		<button onclick={() => (categorySelected.value = task.categoryId)} class="btn btn-sm"
			>{categories.find((c: CategoryItem) => c.id === task.categoryId)?.name}</button
		>
	{/if}
</p>
<div class="py-4">{task.content}</div>
<footer>
	<p class="flex flex-row-reverse items-center justify-between gap-4">
		<small>Created at {task.createdAt.toLocaleDateString('en-en')}</small>
		{#if Number(task.updatedAt) > Number(task.createdAt) + 1000 * 60 * 60}
			<small>Updated at {task.updatedAt.toLocaleDateString('en-en')}</small>
		{/if}
	</p>
	<div class="mt-2 flex items-center justify-between gap-4 border-t border-t-primary-200-800 pt-4">
		<button
			onclick={() => (taskDelete.value = task.id)}
			class="btn preset-outlined-error-200-800 btn-sm text-error-500"
		>
			<TrashIcon size={iconSize} />
			Delete
		</button>
		<button
			onclick={() => (taskEdit.value = task.id)}
			class="btn preset-outlined-primary-200-800 btn-sm"
		>
			<PencilIcon size={iconSize} />
			Edit
		</button>
	</div>
</footer>
