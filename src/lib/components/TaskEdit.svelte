<script lang="ts">
	import type { CategoryItem, TaskItem } from '$lib/types';
	import { Dialog, Portal } from '@skeletonlabs/skeleton-svelte';
	import { applyAction, enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { pageView, paginatorReset } from '$lib/stores.svelte';
	import { CheckIcon, PencilIcon, XIcon } from '@lucide/svelte';
	const iconSize = 16;

	let { categories, task } = $props<{ categories: CategoryItem[]; task: TaskItem }>();

	let title = $state('');
	let progress = $state(0);
	let content = $state<string | null>(null);
	let categoryId = $state('');

	$effect(() => {
		void task.id;
		title = task.title;
		progress = task.progress;
		content = task.content;
		categoryId = task.categoryId;
	});
	let open = $state(false);
</script>

<Dialog {open} onOpenChange={(details: { open: boolean }) => (open = details.open)}>
	<Dialog.Trigger class="btn preset-tonal btn-sm" disabled={categories.length === 0}>
		<PencilIcon size={iconSize} />
		Edit Task
	</Dialog.Trigger>
	<Portal>
		<Dialog.Backdrop class="fixed inset-0 z-50 bg-surface-50-950/50" />
		<Dialog.Positioner class="fixed inset-0 z-50 flex items-center justify-center">
			<Dialog.Content class="w-md space-y-2 card bg-surface-100-900 p-4 shadow-xl">
				<Dialog.Title class="text-2xl font-bold">Edit Task</Dialog.Title>
				<Dialog.Description>
					<form
						class="space-y-4 card preset-filled-surface-300-700 p-4"
						method="post"
						action="?/taskedit"
						use:enhance={() => {
							return async ({ result, update }) => {
								await update();
								if (result.type === 'success') {
									open = false;
									await invalidateAll();
									pageView.value = 'tasks';
									paginatorReset.value = 1;
								}
								await applyAction(result);
							};
						}}
					>
						<fieldset>
							<input type="hidden" name="id" value={task.id} />
							<label class="label" for="title">
								<span class="label-text">Title</span>
								<input
									type="text"
									id="title"
									name="title"
									class="input w-full"
									bind:value={title}
									required
								/>
							</label>
							<label class="label flex-auto" for="progress">
								<span class="label-text">Progress {progress}%</span>
								<input
									type="range"
									id="progress"
									name="progress"
									min="0"
									max="100"
									step="1"
									value={progress}
									oninput={(event) => {
										progress = (event.currentTarget as HTMLInputElement).valueAsNumber;
									}}
									class="range w-full"
								/>
							</label>
							<label class="label" for="content">
								<span class="label-text">Content</span>
								<textarea
									id="content"
									name="content"
									class="input h-32 w-full"
									value={content ?? ''}
									oninput={(event) => {
										const v = (event.currentTarget as HTMLTextAreaElement).value;
										content = v === '' ? null : v;
									}}
								></textarea>
							</label>
							<label class="label" for="categoryId">
								<span class="label-text">Category</span>
								<select id="categoryId" name="categoryId" class="select" bind:value={categoryId}>
									{#each categories as category (category.id)}
										<option value={category.id}>{category.name}</option>
									{/each}
								</select>
							</label>
						</fieldset>
						<div class="flex items-center justify-center gap-8">
							<Dialog.CloseTrigger class="btn preset-tonal btn-sm">
								<XIcon size={iconSize} />
								Cancel
							</Dialog.CloseTrigger>
							<button type="submit" class="btn preset-filled-success-500 btn-sm">
								<CheckIcon size={iconSize} />
								Save Task
							</button>
						</div>
					</form>
				</Dialog.Description>
			</Dialog.Content>
		</Dialog.Positioner>
	</Portal>
</Dialog>
