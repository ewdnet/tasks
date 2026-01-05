<script lang="ts">
	import type { CategoryItem, TaskItem } from '$lib/types';
	import { applyAction, enhance } from '$app/forms';
	import { pageView, paginatorReset, taskEdit } from '$lib/stores.svelte';
	import { CheckIcon, XIcon } from '@lucide/svelte';
	import { invalidateAll } from '$app/navigation';
	const iconSize = 16;

	let { categories, task } = $props<{ categories: CategoryItem[]; task: TaskItem }>();
</script>

<form
	method="post"
	action="?/taskedit"
	use:enhance={() => {
		return async ({ result, update }) => {
			await update();
			if (result.type === 'success') {
				await invalidateAll();
				taskEdit.value = '';
				pageView.value = 'tasks';
				paginatorReset.value = 1;
			}
			await applyAction(result);
		};
	}}
>
	<input type="hidden" name="id" value={task.id} />
	<div class="space-y-4">
		<div>
			<label class="label" for="title">
				<span class="label-text">Title</span>
				<input
					type="text"
					id="title"
					name="title"
					class="input w-full"
					bind:value={task.title}
					required
				/>
			</label>
		</div>
		<div class="flex items-end-safe gap-1">
			<label class="label flex-auto" for="progress">
				<span class="label-text">Progress {task.progress}%</span>
				<input
					type="range"
					id="progress"
					name="progress"
					min="0"
					max="100"
					step="1"
					bind:value={task.progress}
					class="range w-full"
				/>
			</label>
		</div>
		<div>
			<label class="label" for="content">
				<span class="label-text">Content</span>
				<textarea id="content" name="content" class="input h-32 w-full" bind:value={task.content}
				></textarea>
			</label>
		</div>
		<div>
			<label class="label" for="categoryId">
				<span class="label-text">Category</span>
				<select id="categoryId" name="categoryId" class="select" bind:value={task.categoryId}>
					{#each categories as category (category.id)}
						<option value={category.id}>{category.name}</option>
					{/each}
				</select>
			</label>
		</div>
		<div class="flex items-center justify-center gap-4">
			<button
				onclick={(event) => (event.preventDefault(), (taskEdit.value = ''))}
				class="btn preset-filled-surface-200-800 btn-sm"
			>
				<XIcon size={iconSize} />
				Cancel
			</button>
			<button type="submit" class="btn preset-filled-success-200-800 btn-sm">
				<CheckIcon size={iconSize} />
				Save
			</button>
		</div>
	</div>
</form>
