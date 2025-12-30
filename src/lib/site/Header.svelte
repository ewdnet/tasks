<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import { pageView } from '$lib/stores.svelte';
	import { ListChecksIcon, TagsIcon } from '@lucide/svelte';
</script>

<nav class="flex items-center justify-between gap-4">
	<h1 class="h3">
		<img src={favicon} alt="" width="32" height="32" />
	</h1>
	<div class="btn-group">
		<button
			onclick={() => (pageView.value = 'tasks')}
			class="btn preset-filled-surface-200-800 btn-sm"
		>
			<ListChecksIcon size={16} />
			Tasks
		</button>
		<button
			onclick={() => (pageView.value = 'categories')}
			class="btn preset-filled-surface-200-800 btn-sm"
		>
			<TagsIcon size={16} />
			Categories
		</button>
	</div>
</nav>
