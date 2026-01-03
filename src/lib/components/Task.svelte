<script lang="ts">
	import type { CategoryItem, TaskItem } from '$lib/types';
	import { enhance } from '$app/forms';
	import { categorySelected } from '$lib/stores.svelte';
	import { ChevronDownIcon } from '@lucide/svelte';
	import { Accordion } from '@skeletonlabs/skeleton-svelte';
	import { slide } from 'svelte/transition';

	let { task, categories } = $props<{ task: TaskItem; categories: CategoryItem[] }>();
</script>

<li class="border border-primary-500">
	<Accordion.Item value={task.id}>
		<h3>
			<Accordion.ItemTrigger class="flex items-center justify-between gap-2 font-bold">
				{task.title}
				<Accordion.ItemIndicator class="group">
					<ChevronDownIcon class="h-5 w-5 transition group-data-[state=open]:rotate-180" />
				</Accordion.ItemIndicator>
			</Accordion.ItemTrigger>
		</h3>
		<Accordion.ItemContent>
			{#snippet element(attributes)}
				{#if !attributes.hidden}
					<div class="pb-4" {...attributes} transition:slide={{ duration: 200 }}>
						<div>{task.content}</div>
						<div>
							<form method="post" action="?/deltask" use:enhance>
								<input type="hidden" name="id" value={task.id} />
								<div class="text-center">
									<button type="submit" class="btn preset-filled-error-200-800 btn-sm"
										>Delete Task</button
									>
								</div>
							</form>
						</div>
						<footer class="flex items-center justify-between gap-4">
							<p>
								<button
									onclick={() => (categorySelected.value = task.categoryId)}
									class="btn btn-sm"
									>Category: {categories.find((c: CategoryItem) => c.id === task.categoryId)
										?.name}</button
								>
							</p>
							<p class="flex flex-col flex-wrap items-end gap-1 text-right">
								{#if Number(task.updatedAt) > Number(task.createdAt) + 1000 * 60 * 60}
									<small>Updated at {task.updatedAt.toLocaleDateString('en-en')}</small>
								{/if}
								<small>Created at {task.createdAt.toLocaleDateString('en-en')}</small>
							</p>
						</footer>
					</div>
				{/if}
			{/snippet}
		</Accordion.ItemContent>
	</Accordion.Item>
</li>
