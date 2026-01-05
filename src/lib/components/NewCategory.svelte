<script lang="ts">
	import { enhance } from '$app/forms';
	import { TagIcon } from '@lucide/svelte';
	import { Dialog, Portal } from '@skeletonlabs/skeleton-svelte';
</script>

<Dialog>
	<Dialog.Trigger class="btn preset-tonal btn-sm">
		<TagIcon size={16} />
		New Category
	</Dialog.Trigger>
	<Portal>
		<Dialog.Backdrop class="fixed inset-0 z-50 bg-surface-50-950/50" />
		<Dialog.Positioner class="fixed inset-0 z-50 flex items-center justify-center">
			<Dialog.Content class="w-md space-y-2 card bg-surface-100-900 p-4 shadow-xl">
				<Dialog.Title class="text-2xl font-bold">Add New Category</Dialog.Title>
				<Dialog.Description>
					<form class="space-y-4" method="post" action="?/category" use:enhance>
						<label for="name" class="label">
							<input class="input" name="name" />
						</label>
						<div class="text-center">
							<button type="submit" class="btn preset-filled-primary-500 btn-sm"
								>Add Category</button
							>
						</div>
					</form>
				</Dialog.Description>
				<Dialog.CloseTrigger class="btn preset-tonal">Close</Dialog.CloseTrigger>
			</Dialog.Content>
		</Dialog.Positioner>
	</Portal>
</Dialog>
