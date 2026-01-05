<script lang="ts">
	import type { TaskItem } from '$lib/types';
	import { applyAction, enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { pageView, paginatorReset, taskDelete } from '$lib/stores.svelte';
	import { TrashIcon, XIcon } from '@lucide/svelte';

	let { task } = $props<{ task: TaskItem }>();

	const iconSize = 16;
</script>

<div class="space-y-8 py-4">
	<p class="text-center text-lg text-warning-500">Really delete the task?</p>
	<form
		class="flex-auto"
		method="post"
		action="?/taskdelete"
		use:enhance={() => {
			return async ({ result, update }) => {
				await update();
				if (result.type === 'success') {
					await invalidateAll();
					pageView.value = 'tasks';
					paginatorReset.value = 1;
				}
				await applyAction(result);
			};
		}}
	>
		<input type="hidden" name="id" value={task.id} />
		<div class="flex items-center justify-center gap-4">
			<button
				onclick={(event) => {
					event.preventDefault();
					taskDelete.value = '';
				}}
				class="btn preset-filled-surface-200-800 btn-sm"
			>
				<XIcon size={iconSize} />
				Cancel
			</button>
			<button type="submit" class="btn preset-filled-error-200-800 btn-sm">
				<TrashIcon size={iconSize} />
				Delete
			</button>
		</div>
	</form>
</div>
