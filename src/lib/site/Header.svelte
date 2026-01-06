<script lang="ts">
	import ProgressOverall from '$lib/components/ProgressOverall.svelte';
	import {
		categorySelected,
		categoryStatus,
		pageView,
		paginatorReset,
		searchTerm,
		taskStatus
	} from '$lib/stores.svelte';
	import { ListChecksIcon, SearchIcon, TagsIcon, XIcon } from '@lucide/svelte';
	const iconSize = 16;

	let searchValue = $state('');
	$effect(() => {
		searchTerm.value = searchValue.toLowerCase();
	});
</script>

<ProgressOverall />
<div class="flex-auto">
	<div class="flex justify-end pb-4">
		<!-- <div class="input-group w-fit grid-cols-[auto_1fr_auto]">
			<div class="ig-cell"><SearchIcon size={iconSize} /></div>
			<input bind:value={searchValue} class="ig-input max-w-xs text-xs" type="search" placeholder="Search ..." />
		</div> -->
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
		<button
			onclick={() => (
				(searchTerm.value = ''),
				(searchValue = ''),
				(taskStatus.value = ''),
				(categorySelected.value = ''),
				(paginatorReset.value = 1),
				(pageView.value = 'tasks')
			)}
			class="btn preset-filled-surface-200-800 btn-sm"
			aria-current={pageView.value === 'tasks'}
		>
			<ListChecksIcon size={iconSize} />
			Tasks
		</button>
		<button
			onclick={() => (
				(searchTerm.value = ''),
				(searchValue = ''),
				(categoryStatus.value = ''),
				(paginatorReset.value = 1),
				(pageView.value = 'categories')
			)}
			class="btn preset-filled-surface-200-800 btn-sm"
			aria-current={pageView.value === 'categories'}
		>
			<TagsIcon size={iconSize} />
			Categories
		</button>
	</nav>
</div>
