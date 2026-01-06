<script lang="ts">
	import { progressOverall } from '$lib/stores.svelte';
	import { Progress } from '@skeletonlabs/skeleton-svelte';
	let value = $derived(progressOverall.value);

	let rangeClass: string = $state('');
	$effect(() => {
		if (value === null || value <= 33) {
			rangeClass = 'stroke-error-500/60';
		} else if (value > 33 && value <= 66) {
			rangeClass = 'stroke-warning-500/60';
		} else if (value > 66) {
			rangeClass = 'stroke-success-500/60';
		}
	});
</script>

<Progress class="relative w-fit" {value} defaultValue={null}>
	<div class="absolute inset-0 flex items-center justify-center">
		<Progress.ValueText />
	</div>
	<Progress.Circle>
		<Progress.CircleTrack />
		<Progress.CircleRange class={rangeClass} />
	</Progress.Circle>
</Progress>
