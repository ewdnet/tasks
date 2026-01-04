<script lang="ts">
	import type { CategoryItem, TaskItem } from '$lib/types';
	import { enhance } from '$app/forms';
	import { categorySelected } from '$lib/stores.svelte';
	import { Accordion, Progress } from '@skeletonlabs/skeleton-svelte';
	import { slide } from 'svelte/transition';
	import {
		ChevronDownIcon,
		CircleCheckBigIcon,
		CircleDashedIcon,
		CircleOffIcon
	} from '@lucide/svelte';
	const iconSize = 16;

	let { task, categories } = $props<{ task: TaskItem; categories: CategoryItem[] }>();

	let value = $derived(task.progress);
</script>

<li>
	<Accordion.Item value={task.id} class="preset-outlined-primary-500">
		<h3 class="relative">
			<Accordion.ItemTrigger class="flex items-center justify-between gap-2 font-bold">
				<div class="flex items-center gap-2">
					<span>
						{#if task.progress === 100}
							<CircleCheckBigIcon size={iconSize} class="text-success-500" />
						{:else if task.progress > 0 && task.progress < 100}
							<CircleDashedIcon size={iconSize} class="text-warning-500" />
						{:else}
							<CircleOffIcon size={iconSize} class="text-error-500" />
						{/if}
					</span>
					<span>{task.title}</span>
				</div>
				<Accordion.ItemIndicator class="group">
					<ChevronDownIcon class="h-5 w-5 transition group-data-[state=open]:rotate-180" />
				</Accordion.ItemIndicator>
			</Accordion.ItemTrigger>
			<div class="absolute bottom-0.5 left-0 -z-10 w-full px-4">
				<Progress {value} class="">
					<Progress.Track class="h-0.5 bg-transparent">
						<Progress.Range
							class={task.progress === 100 ? 'bg-success-500/50' : 'bg-warning-500/50'}
						/>
					</Progress.Track>
				</Progress>
			</div>
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
								<small>Category:</small>
								{#if task.categoryId === categorySelected.value}
									<small
										>{categories.find((c: CategoryItem) => c.id === task.categoryId)?.name}</small
									>
								{:else}
									<button
										onclick={() => (categorySelected.value = task.categoryId)}
										class="btn btn-sm"
										>{categories.find((c: CategoryItem) => c.id === task.categoryId)?.name}</button
									>
								{/if}
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
