<script lang="ts">
	import { categoryStatus, searchTerm } from '$lib/stores.svelte';
</script>

<span>
	{#if searchTerm.value !== ''}
		"{searchTerm.value}" in
	{/if}
</span>
<span>
	{#if categoryStatus.value === 'emptycategories'}
		New (empty) Categories
	{:else if categoryStatus.value === 'inprogresscategories'}
		Categories in Progress
	{:else if categoryStatus.value === 'completedcategories'}
		Completed Categories
	{:else}
		All Categories
	{/if}
</span>
