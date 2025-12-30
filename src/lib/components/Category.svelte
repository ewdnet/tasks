<script lang="ts">
	import { enhance } from '$app/forms';
	import { ChevronDownIcon } from '@lucide/svelte';
	import { Accordion } from '@skeletonlabs/skeleton-svelte';
	import { slide } from 'svelte/transition';
	let { category } = $props();
</script>

<li class="border border-primary-500">
	<Accordion.Item value={category.id}>
		<h3>
			<Accordion.ItemTrigger class="flex items-center justify-between gap-2 font-bold">
				{category.name}
				<Accordion.ItemIndicator class="group">
					<ChevronDownIcon class="h-5 w-5 transition group-data-[state=open]:rotate-180" />
				</Accordion.ItemIndicator>
			</Accordion.ItemTrigger>
		</h3>
		<Accordion.ItemContent>
			{#snippet element(attributes)}
				{#if !attributes.hidden}
					<div class="pb-4" {...attributes} transition:slide={{ duration: 200 }}>
						<div>
							<form method="post" action="?/delcatg" use:enhance>
								<input type="hidden" name="id" value={category.id} />
								<div class="text-center">
									<button type="submit" class="btn preset-filled-error-200-800 btn-sm"
										>Delete Category</button
									>
								</div>
							</form>
						</div>
					</div>
				{/if}
			{/snippet}
		</Accordion.ItemContent>
	</Accordion.Item>
</li>
