<script lang="ts">
	import ProgressOverall from '$lib/components/ProgressOverall.svelte';
	import { pageView, searchTerm } from '$lib/stores.svelte';
	import { ListChecksIcon, SearchIcon, TagsIcon } from '@lucide/svelte';

	let searchValue = $state('');

	$effect(() => {
		searchTerm.value = searchValue.toLowerCase();
	});
</script>

<ProgressOverall />
<div class="flex-auto">
	<div class="flex justify-end pb-4">
		<!-- <div class="input-group w-fit grid-cols-[auto_1fr_auto]">
			<div class="ig-cell"><SearchIcon size={16} /></div>
			<input bind:value={searchValue} class="ig-input max-w-xs text-xs" type="search" placeholder="Search ..." />
		</div> -->
		<div class="input-group w-fit grid-cols-[1fr_auto]">
			<input
				bind:value={searchValue}
				class="ig-input max-w-xs text-xs"
				type="search"
				placeholder="Search ..."
			/>
			<div class="ig-btn preset-tonal"><SearchIcon size={16} /></div>
		</div>
	</div>
	<nav class="flex flex-row-reverse gap-2 border-t border-t-primary-200-800 pt-4">
		<button
			onclick={() => (pageView.value = 'tasks')}
			class="btn preset-filled-surface-200-800 btn-sm"
			aria-current={pageView.value === 'tasks'}
		>
			<ListChecksIcon size={16} />
			Tasks
		</button>
		<button
			onclick={() => (pageView.value = 'categories')}
			class="btn preset-filled-surface-200-800 btn-sm"
			aria-current={pageView.value === 'categories'}
		>
			<TagsIcon size={16} />
			Categories
		</button>
	</nav>
</div>
