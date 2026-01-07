<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { Dialog, Portal } from '@skeletonlabs/skeleton-svelte';
	import { invalidateAll } from '$app/navigation';
	import { pageView, paginatorReset } from '$lib/stores.svelte';
	import { TrashIcon, XIcon } from '@lucide/svelte';

	let { category } = $props<{ category: { id: string; name: string } }>();

	const iconSize = 16;
	let open = $state(false);
</script>

<Dialog {open} onOpenChange={(details: { open: boolean }) => (open = details.open)}>
	<Dialog.Trigger class="btn preset-outlined-error-200-800 btn-sm text-error-500">
		<TrashIcon size={iconSize} />
		Delete
	</Dialog.Trigger>
	<Portal>
		<Dialog.Backdrop class="fixed inset-0 z-50 bg-surface-50-950/50" />
		<Dialog.Positioner class="fixed inset-0 z-50 flex items-center justify-center">
			<Dialog.Content class="w-md space-y-2 card bg-surface-100-900 p-4 shadow-xl">
				<Dialog.Title class="text-center text-2xl font-bold"
					>Realy delete the Category?</Dialog.Title
				>
				<Dialog.Description>
					<p class="pb-8 text-center">All tasks in the category are also deleted.</p>
					<form
						method="post"
						action="?/categorydelete"
						use:enhance={() => {
							return async ({ result, update }) => {
								await update();
								if (result.type === 'success') {
									open = false;
									await invalidateAll();
									pageView.value = 'categories';
									paginatorReset.value = 1;
								}
								await applyAction(result);
							};
						}}
					>
						<input type="hidden" name="id" value={category.id} />
						<div class="flex items-center justify-center gap-8">
							<Dialog.CloseTrigger class="btn preset-tonal btn-sm">
								<XIcon size={iconSize} />
								Cancel
							</Dialog.CloseTrigger>
							<button type="submit" class="btn preset-filled-error-200-800 btn-sm">
								<TrashIcon size={iconSize} />
								Delete Category
							</button>
						</div>
					</form>
				</Dialog.Description>
			</Dialog.Content>
		</Dialog.Positioner>
	</Portal>
</Dialog>
