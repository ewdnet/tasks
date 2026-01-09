<script lang="ts">
	import { categoryStatus, searchTerm } from '$lib/stores.svelte';
	import { TagsIcon } from '@lucide/svelte';
</script>

<TagsIcon size={24} class="mr-1 mb-1 inline" />
<span>
	{#if searchTerm.value !== ''}
		Search "{searchTerm.value}" in
	{/if}
</span>
<span>
	{#if categoryStatus.value === 'emptycategories'}
		Empty (no Tasks) Categories
	{:else if categoryStatus.value === 'inprogresscategories'}
		Categories in Progress
	{:else if categoryStatus.value === 'completedcategories'}
		Completed Categories
	{:else}
		Categories
	{/if}
</span>
