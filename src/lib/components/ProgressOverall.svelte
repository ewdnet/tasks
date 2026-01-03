<script lang="ts">
	import { progressOverall } from '$lib/stores.svelte';
	import { Progress } from '@skeletonlabs/skeleton-svelte';
	let value = $derived(progressOverall.value);
</script>

<Progress class="relative w-fit" {value} defaultValue={null}>
	<div class="absolute inset-0 flex items-center justify-center">
		<Progress.ValueText />
	</div>
	<Progress.Circle>
		<Progress.CircleTrack />
		<Progress.CircleRange />
	</Progress.Circle>
</Progress>
