<script lang="ts">
	import ProgressOverall from '$lib/components/ProgressOverall.svelte';
	import {
		accordionCollapsed,
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

	let searchHasContent = $state(false);
	$effect(() => {
		const hasContent = searchTerm.value.length > 0;
		if (hasContent && !searchHasContent) {
			accordionCollapsed.value += 1;
		}
		searchHasContent = hasContent;
	});
</script>

<ProgressOverall />
<div class="flex-auto">
	<div class="flex justify-end pb-4">
		<div class="input-group w-fit grid-cols-[1fr_auto]">
			<input
				value={searchTerm.value}
				class="ig-input max-w-xs text-xs"
				name="q"
				type="search"
				placeholder="Search ..."
				oninput={(event) =>
					(searchTerm.value = (event.currentTarget as HTMLInputElement).value.toLowerCase())}
			/>
			<div class="ig-btn preset-tonal">
				{#if !searchTerm.value.length}
					<SearchIcon size={iconSize} />
				{:else}
					<XIcon
						size={iconSize}
						onclick={() => {
							searchTerm.value = '';
							accordionCollapsed.value += 1;
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
			value={activeTab.value}
			class="flex flex-row-reverse"
		>
			<Tabs.List>
				<Tabs.Trigger
					onclick={() => (
						(searchTerm.value = ''),
						(taskStatus.value = ''),
						(categorySelected.value = ''),
						(paginatorReset.value = 1),
						(activeTab.value = 'tasks')
					)}
					value="tasks"
					class="preset-tonal text-xs sm:text-sm"
				>
					<ListChecksIcon size={iconSize} />
					Tasks
				</Tabs.Trigger>
				<Tabs.Trigger
					onclick={() => (
						(searchTerm.value = ''),
						(categoryStatus.value = ''),
						(paginatorReset.value = 1),
						(activeTab.value = 'categories')
					)}
					value="categories"
					class="preset-tonal text-xs sm:text-sm"
				>
					<TagsIcon size={iconSize} />
					Categories
				</Tabs.Trigger>
				<Tabs.Indicator />
			</Tabs.List>
		</Tabs>
	</nav>
</div>
