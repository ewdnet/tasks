<script lang="ts">
	import type { TaskItem } from '$lib/types';
	import { enhance } from '$app/forms';
	import { categorySelected, pageView } from '$lib/stores.svelte';
	import { Accordion, Progress } from '@skeletonlabs/skeleton-svelte';
	import { slide } from 'svelte/transition';
	import {
		ChevronDownIcon,
		CircleCheckBigIcon,
		CircleDashedIcon,
		CircleOffIcon,
		TrashIcon
	} from '@lucide/svelte';
	const iconSize = 16;

	let { category } = $props();

	const categoryProgress = (): number => {
		const total = category.tasks?.length ?? 0;
		if (total === 0) return 0;

		const sum = category.tasks?.reduce((acc: number, e: TaskItem) => acc + e.progress, 0) ?? 0;

		return Math.round(sum / total);
	};
</script>

<li class="overflow-hidden card preset-filled-surface-50-950">
	<Accordion.Item value={category.id}>
		<h3 class="relative">
			<Accordion.ItemTrigger class="flex items-center justify-between gap-2 font-bold">
				<div class="flex items-center gap-2">
					<span>
						{#if categoryProgress() === 100}
							<CircleCheckBigIcon size={iconSize} class="text-success-500/50" />
						{:else if categoryProgress() > 0 && categoryProgress() < 100}
							<CircleDashedIcon size={iconSize} class="text-warning-500/50" />
						{:else}
							<CircleOffIcon size={iconSize} class="text-error-500/50" />
						{/if}
					</span>
					<span>{category.name}</span>
				</div>
				<Accordion.ItemIndicator class="group">
					<ChevronDownIcon class="h-5 w-5 transition group-data-[state=open]:rotate-180" />
				</Accordion.ItemIndicator>
			</Accordion.ItemTrigger>
			<div class="absolute bottom-0 left-0 w-full px-4">
				<Progress value={categoryProgress()} class="">
					<Progress.Track class="h-0.5 bg-error-500/20">
						<Progress.Range
							class={categoryProgress() === 100 ? 'bg-success-500/40' : 'bg-warning-500/50'}
						/>
					</Progress.Track>
				</Progress>
			</div>
		</h3>
		<Accordion.ItemContent>
			{#snippet element(attributes)}
				{#if !attributes.hidden}
					<div class="pb-4" {...attributes} transition:slide={{ duration: 200 }}>
						<div class="pb-4">
							{#if category.tasks?.length}
								<button
									onclick={() => (
										(categorySelected.value = category.id),
										(pageView.value = 'tasks')
									)}
									class="btn btn-sm">Show all Tasks in the Category {category.name}</button
								>
							{:else}
								<small>No Tasks in this Category.</small>
							{/if}
						</div>
						<div>
							<form method="post" action="?/categorydelete" use:enhance>
								<input type="hidden" name="id" value={category.id} />
								<div class="text-center">
									<button
										type="submit"
										class="btn preset-outlined-error-200-800 btn-sm text-error-500"
									>
										<TrashIcon size={iconSize} />
										Delete
									</button>
								</div>
							</form>
						</div>
					</div>
				{/if}
			{/snippet}
		</Accordion.ItemContent>
	</Accordion.Item>
</li>
