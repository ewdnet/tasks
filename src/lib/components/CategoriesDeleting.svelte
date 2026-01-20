<script lang="ts">
	import type { CategoryItem, TooltipTriggerAttrs } from '$lib/types';
	import { applyAction, enhance } from '$app/forms';
	import { Dialog, Portal, Tooltip } from '@skeletonlabs/skeleton-svelte';
	import { invalidateAll } from '$app/navigation';
	import {
		categorySelected,
		categoryStatus,
		activeTab,
		paginatorReset,
		searchTerm
	} from '$lib/stores.svelte';
	import { animation } from '$lib/animationCss';
	import { TrashIcon, XIcon } from '@lucide/svelte';
	const iconSize = 16;

	let { categories } = $props<{ categories: CategoryItem[] }>();

	let categoryItems: string[] = $derived(categories.map((category: CategoryItem) => category.id));

	let open = $state(false);
</script>

{#snippet tooltipTrigger(attrs: TooltipTriggerAttrs)}
	<Dialog.Trigger
		class="btn-icon btn btn-icon-sm rounded-full preset-outlined-error-200-800 text-error-500"
		{...attrs}
	>
		<TrashIcon size={iconSize} />
	</Dialog.Trigger>
{/snippet}

<Dialog {open} onOpenChange={(details: { open: boolean }) => (open = details.open)}>
	<Tooltip positioning={{ placement: 'top' }}>
		<Tooltip.Trigger element={tooltipTrigger} />
		<Portal>
			<Tooltip.Positioner>
				<Tooltip.Content class="card preset-filled-error-800-200 p-2">
					<span
						>Delete {searchTerm.value || categoryStatus.value || categorySelected.value
							? 'Filtered '
							: 'All'} categories.</span
					>
					<Tooltip.Arrow
						class="[--arrow-background:var(--color-error-800-200)] [--arrow-size:--spacing(2)]"
					>
						<Tooltip.ArrowTip />
					</Tooltip.Arrow>
				</Tooltip.Content>
			</Tooltip.Positioner>
		</Portal>
	</Tooltip>

	<Portal>
		<Dialog.Backdrop class="fixed inset-0 z-50 bg-surface-50-950/50" />
		<Dialog.Positioner class="fixed inset-0 z-50 flex items-center justify-center">
			<Dialog.Content class="w-md space-y-2 card bg-surface-100-900 p-4 shadow-xl {animation}">
				<Dialog.Title class="text-center text-2xl font-bold"
					>Realy delete the {searchTerm.value || categoryStatus.value || categorySelected.value
						? `${categories.length} filtered `
						: 'all'} Categories?</Dialog.Title
				>
				<Dialog.Description>
					<p class="pb-8 text-center text-warning-500">
						All tasks {searchTerm.value || categoryStatus.value || categorySelected.value
							? 'in the filtered categories'
							: ''} are also deleted.
					</p>
					<form
						method="post"
						action="?/category_delete_multiple"
						use:enhance={() => {
							return async ({ result, update }) => {
								await update();
								if (result.type === 'success') {
									open = false;
									await invalidateAll();
									searchTerm.value = '';
									categoryStatus.value = '';
									activeTab.value = 'categories';
									paginatorReset.value = 1;
								}
								await applyAction(result);
							};
						}}
					>
						<input type="hidden" name="id" bind:value={categoryItems} />
						<div class="flex items-center justify-center gap-8">
							<Dialog.CloseTrigger class="btn preset-tonal btn-sm">
								<XIcon size={iconSize} />
								Cancel
							</Dialog.CloseTrigger>
							<button type="submit" class="btn preset-filled-error-200-800 btn-sm">
								<TrashIcon size={iconSize} />
								Delete Categories
							</button>
						</div>
					</form>
				</Dialog.Description>
			</Dialog.Content>
		</Dialog.Positioner>
	</Portal>
</Dialog>
