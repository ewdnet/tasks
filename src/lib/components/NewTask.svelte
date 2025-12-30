<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { pageView } from '$lib/stores.svelte';

	let { categories } = $props();
</script>

<form
	class="space-y-4 card preset-filled-surface-300-700 p-4"
	method="post"
	action="?/task"
	use:enhance={() => {
		return async ({ result, update }) => {
			// keep SvelteKit's default behavior (updates form, etc.)
			await update();

			if (result.type === 'success') {
				// your previous onSuccess logic here
				// e.g. close modal, show toast, navigate, etc.
				await invalidateAll();
				pageView.value = 'tasks';
			}

			// ensures action result is applied (redirects, errors, etc.)
			await applyAction(result);
		};
	}}
>
	<label for="categoryId" class="label">
		<span class="label-text">Category</span>
		<select class="select" name="categoryId">
			<option value="" disabled selected>Select a category</option>
			{#each categories as category}
				<option value={category.id}>{category.name}</option>
			{/each}
		</select>
	</label>
	<label for="title" class="label">
		<span class="label-text">Title</span>
		<input class="input" name="title" />
	</label>
	<label for="content" class="label">
		<span class="label-text">Content</span>
		<textarea class="textarea" name="content"></textarea>
	</label>
	<div class="flex items-center justify-center gap-8">
		<button
			onclick={(event) => (event.preventDefault(), (pageView.value = 'tasks'))}
			class="btn preset-filled-surface-500 btn-sm">Cancel</button
		>
		<button type="submit" class="btn preset-filled-primary-500 btn-sm">Add Task</button>
	</div>
</form>
