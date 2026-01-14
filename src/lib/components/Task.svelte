<script lang="ts">
	import type { CategoryItem, TaskItem } from '$lib/types';
	import { Accordion, Progress } from '@skeletonlabs/skeleton-svelte';
	import TaskContent from '$lib/components/TaskContent.svelte';
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

<li class="overflow-hidden card bg-surface-50-950/70">
	<Accordion.Item value={task.id}>
		<h2 class="relative h4">
			<Accordion.ItemTrigger class="flex items-center justify-between gap-2 font-bold">
				<div class="flex items-center gap-2">
					<span>
						{#if task.progress === 100}
							<CircleCheckBigIcon size={iconSize} class="text-success-500/50" />
						{:else if task.progress > 0 && task.progress < 100}
							<CircleDashedIcon size={iconSize} class="text-warning-500/50" />
						{:else}
							<CircleOffIcon size={iconSize} class="text-error-500/50" />
						{/if}
					</span>
					<span>{task.title}</span>
				</div>
				<Accordion.ItemIndicator class="group">
					<ChevronDownIcon class="h-5 w-5 transition group-data-[state=open]:rotate-180" />
				</Accordion.ItemIndicator>
			</Accordion.ItemTrigger>
			<div class="absolute bottom-0 left-0 w-full px-4">
				<Progress {value} class="">
					<Progress.Track class="h-0.5 bg-error-500/20">
						<Progress.Range
							class={task.progress === 100 ? 'bg-success-500/40' : 'bg-warning-500/50'}
						/>
					</Progress.Track>
				</Progress>
			</div>
		</h2>
		<Accordion.ItemContent>
			{#snippet element(attributes)}
				{#if !attributes.hidden}
					<div class="pb-4" {...attributes} transition:slide={{ duration: 200 }}>
						<TaskContent {task} {categories} />
					</div>
				{/if}
			{/snippet}
		</Accordion.ItemContent>
	</Accordion.Item>
</li>
