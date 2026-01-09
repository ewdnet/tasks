<script lang="ts">
	import ProgressOverall from '$lib/components/ProgressOverall.svelte';
	import {
		activeTab,
		categorySelected,
		categoryStatus,
		paginatorReset,
		searchTerm,
		taskStatus
	} from '$lib/stores.svelte';
	import { ListChecksIcon, SearchIcon, TagsIcon, XIcon } from '@lucide/svelte';
	import { Tabs } from '@skeletonlabs/skeleton-svelte';
	const iconSize = 16;

	let searchValue = $state('');
	$effect(() => {
		searchTerm.value = searchValue.toLowerCase();
	});
</script>

<ProgressOverall />
<div class="flex-auto">
	<div class="flex justify-end pb-4">
		<div class="input-group w-fit grid-cols-[1fr_auto]">
			<input
				bind:value={searchValue}
				class="ig-input max-w-xs text-xs"
				name="q"
				type="search"
				placeholder="Search ..."
			/>
			<div class="ig-btn preset-tonal">
				{#if !searchValue.length}
					<SearchIcon size={iconSize} />
				{:else}
					<XIcon
						size={iconSize}
						onclick={() => {
							searchValue = '';
							searchTerm.value = '';
						}}
					/>
				{/if}
			</div>
		</div>
	</div>
	<nav class="flex flex-row-reverse gap-2 border-t border-t-primary-200-800 pt-4">
		<Tabs
			defaultValue="tasks"
			onValueChange={(event: { value: string }) => {
				activeTab.value = event.value;
			}}
		>
			<Tabs.List class="flex w-full flex-row-reverse">
				<Tabs.Trigger
					onclick={() => (
						(searchTerm.value = ''),
						(searchValue = ''),
						(taskStatus.value = ''),
						(categorySelected.value = ''),
						(paginatorReset.value = 1),
						(activeTab.value = 'tasks')
					)}
					value="tasks">Tasks</Tabs.Trigger
				>
				<Tabs.Trigger
					onclick={() => (
						(searchTerm.value = ''),
						(searchValue = ''),
						(categoryStatus.value = ''),
						(paginatorReset.value = 1),
						(activeTab.value = 'categories')
					)}
					value="categories">Categories</Tabs.Trigger
				>
				<Tabs.Indicator />
			</Tabs.List>
		</Tabs>
	</nav>
</div>
