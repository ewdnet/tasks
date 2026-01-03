<script lang="ts">
	import { categoryStatus } from '$lib/stores.svelte';
	import type { CategoryItem } from '$lib/types';
	import { Portal, Tooltip } from '@skeletonlabs/skeleton-svelte';

	let { scopeCategories } = $props<{ scopeCategories: CategoryItem[] }>();

	// Empty Categories
	function emptyCategories() {
		return scopeCategories.filter((category: CategoryItem) => category.tasks.length === 0).length;
	}
	// Categories in Progress
	function inprogressCategories() {
		return scopeCategories.filter((category: CategoryItem) => {
			const total = category.tasks.length;
			const completed = category.tasks.filter((task) => task.progress === 100).length;
			return total > 0 && completed < total;
		}).length;
	}
	// Completed Categories
	function completedCategories() {
		return scopeCategories.filter((category: CategoryItem) => {
			const total = category.tasks.length;
			const completed = category.tasks.filter((task) => task.progress === 100).length;
			return total > 0 && total === completed;
		}).length;
	}
</script>

<ul class="flex items-center gap-2">
	<li>
		<Tooltip positioning={{ placement: 'top' }}>
			<Tooltip.Trigger>
				<button
					onclick={() =>
						(categoryStatus.value =
							categoryStatus.value === 'emptycategories' ? '' : 'emptycategories')}
					disabled={emptyCategories() === 0}
					class="btn-icon btn btn-icon-sm rounded-full border border-error-500 bg-error-500/15"
				>
					{emptyCategories()}
				</button>
			</Tooltip.Trigger>
			<Portal>
				<Tooltip.Positioner>
					<Tooltip.Content class="card preset-filled-error-800-200 p-2">
						<span
							>{categoryStatus.value === 'emptycategories'
								? 'Reset the Filter'
								: 'Show the empty Categories'}</span
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
	</li>
	<li>
		<Tooltip positioning={{ placement: 'top' }}>
			<Tooltip.Trigger>
				<button
					onclick={() =>
						(categoryStatus.value =
							categoryStatus.value === 'inprogresscategories' ? '' : 'inprogresscategories')}
					disabled={inprogressCategories() === 0}
					class="btn-icon btn btn-icon-sm rounded-full border border-warning-500 bg-warning-500/15"
				>
					{inprogressCategories()}
				</button>
			</Tooltip.Trigger>
			<Portal>
				<Tooltip.Positioner>
					<Tooltip.Content class="card preset-filled-warning-800-200 p-2">
						<span
							>{categoryStatus.value === 'inprogresscategories'
								? 'Reset the Filter'
								: 'Show the Categories in Progress'}</span
						>
						<Tooltip.Arrow
							class="[--arrow-background:var(--color-warning-800-200)] [--arrow-size:--spacing(2)]"
						>
							<Tooltip.ArrowTip />
						</Tooltip.Arrow>
					</Tooltip.Content>
				</Tooltip.Positioner>
			</Portal>
		</Tooltip>
	</li>
	<li>
		<Tooltip positioning={{ placement: 'top' }}>
			<Tooltip.Trigger>
				<button
					onclick={() =>
						(categoryStatus.value =
							categoryStatus.value === 'completedcategories' ? '' : 'completedcategories')}
					disabled={completedCategories() === 0}
					class="btn-icon btn btn-icon-sm rounded-full border border-success-500 bg-success-500/15"
				>
					{completedCategories()}
				</button>
			</Tooltip.Trigger>
			<Portal>
				<Tooltip.Positioner>
					<Tooltip.Content class="card preset-filled-success-800-200 p-2">
						<span
							>{categoryStatus.value === 'completedcategories'
								? 'Reset the Filter'
								: 'Show the completed Categories'}</span
						>
						<Tooltip.Arrow
							class="[--arrow-background:var(--color-success-800-200)] [--arrow-size:--spacing(2)]"
						>
							<Tooltip.ArrowTip />
						</Tooltip.Arrow>
					</Tooltip.Content>
				</Tooltip.Positioner>
			</Portal>
		</Tooltip>
	</li>
</ul>
