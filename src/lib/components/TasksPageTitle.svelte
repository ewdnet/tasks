<script lang="ts">
	import type { CategoryItem } from '$lib/types';
	import { categorySelected, searchTerm, taskStatus } from '$lib/stores.svelte';
	import { RefreshCcwIcon } from '@lucide/svelte';

	let { categories } = $props<{ categories: CategoryItem[] }>();

	let categoryName: string = $state('');
	$effect(() => {
		if (categorySelected.value === '') return;
		categoryName = categories.filter((cat: CategoryItem) => cat.id == categorySelected.value)[0]
			.name;
	});
</script>

<span>
	{#if searchTerm.value !== ''}
		Search "{searchTerm.value}" in
	{/if}
</span>
<span>
	{#if taskStatus.value === 'new'}
		New Tasks
	{:else if taskStatus.value === 'current'}
		Tasks in Progress
	{:else if taskStatus.value === 'completed'}
		Completed Tasks
	{:else}
		All Tasks
	{/if}
</span>
{#if categorySelected.value !== ''}
	<span>in the Category "{categoryName}"</span>
	<button
		onclick={() => (categorySelected.value = '')}
		class="btn-icon btn btn-icon-sm rounded-full preset-outlined-primary-500 bg-primary-500/15"
	>
		<RefreshCcwIcon size={16} />
	</button>
{/if}
