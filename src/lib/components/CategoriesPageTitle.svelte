<script lang="ts">
	import { categoryStatus, searchTerm } from '$lib/stores.svelte';
</script>

<span>
	{#if searchTerm.value !== ''}
		Search "{searchTerm.value}" in
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
		Categories
	{/if}
</span>
