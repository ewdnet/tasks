<script lang="ts">
	import type { TaskItem } from '$lib/types';
	import { categorySelected, activeTab } from '$lib/stores.svelte';
	import { Accordion, Progress } from '@skeletonlabs/skeleton-svelte';
	import { slide } from 'svelte/transition';
	import {
		ChevronDownIcon,
		CircleCheckBigIcon,
		CircleDashedIcon,
		CircleOffIcon
	} from '@lucide/svelte';
	import CategoryDelete from './CategoryDelete.svelte';
	const iconSize = 16;

	let { category } = $props();

	const categoryProgress = (): number => {
		const total = category.tasks?.length ?? 0;
		if (total === 0) return 0;
		const sum = category.tasks?.reduce((acc: number, e: TaskItem) => acc + e.progress, 0) ?? 0;
		return Math.round(sum / total);
	};
</script>

{#snippet complCat()}
	<span class="flex items-center gap-2 text-xs text-success-500/50">
		<CircleCheckBigIcon size={iconSize} class="text-success-500/50" />
		<span class="btn-icon btn btn-icon-sm rounded-full border border-success-500 bg-success-500/15"
			>{category.tasks.length}</span
		>
	</span>
{/snippet}

{#snippet progrCat()}
	<span class="flex items-center gap-2 text-xs text-warning-500/50">
		<CircleDashedIcon size={iconSize} class="text-warning-500/50" />
		<span class="btn-icon btn btn-icon-sm rounded-full border border-warning-500 bg-warning-500/15"
			>{category.tasks.length}</span
		>
	</span>
{/snippet}

{#snippet emptyCat()}
	<span class="flex items-center gap-2 text-xs text-error-500/50">
		<CircleOffIcon size={iconSize} class="text-error-500/50" />
		<span class="btn-icon btn btn-icon-sm rounded-full border border-error-500 bg-error-500/15"
			>{category.tasks.length}</span
		>
	</span>
{/snippet}

<li class="overflow-hidden card preset-filled-surface-50-950">
	<Accordion.Item value={category.id}>
		<h2 class="relative h4">
			<Accordion.ItemTrigger class="flex items-center justify-between gap-2 font-bold">
				<div class="flex items-center gap-2">
					<span>
						{#if categoryProgress() === 100}
							{@render complCat()}
						{:else if categoryProgress() > 0 && categoryProgress() < 100}
							{@render progrCat()}
						{:else}
							{@render emptyCat()}
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
		</h2>
		<Accordion.ItemContent>
			{#snippet element(attributes)}
				{#if !attributes.hidden}
					<div class="pb-4" {...attributes} transition:slide={{ duration: 200 }}>
						<p class="pb-8 text-center">
							{#if category.tasks?.length}
								<button
									onclick={() => (
										(categorySelected.value = category.id),
										(activeTab.value = 'tasks')
									)}
									class="anchor text-xs">Show all Tasks in the Category {category.name}</button
								>
							{:else}
								<small>No Tasks in this Category.</small>
							{/if}
						</p>
						<div class="flex justify-center">
							<CategoryDelete {category} />
						</div>
					</div>
				{/if}
			{/snippet}
		</Accordion.ItemContent>
	</Accordion.Item>
</li>
