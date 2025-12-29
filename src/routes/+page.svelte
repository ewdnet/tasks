<script lang="ts">
	import { enhance } from '$app/forms';
	import { Trash } from '@lucide/svelte';
	import type { PageProps } from './$types';

	const { data } = $props() as PageProps;
	let { categories, tasks } = $derived(data);
</script>

<h1 class="text-right h4">Tasks</h1>
<ul class="space-y-4 card border border-primary-500 p-4 pb-4">
	{#each tasks as task}
		<li class="flex items-start gap-4">
			<form class="flex-auto space-y-4 pb-4" method="post" action="?/edittask" use:enhance>
				<input type="hidden" name="id" value={task.id} />
				<label class="label">
					<input bind:value={task.title} name="title" type="text" class="input" />
				</label>
				<label class="label">
					<textarea bind:value={task.content} name="content" class="textarea"></textarea>
				</label>
				<div class="flex items-center justify-between gap-4">
					<p>
						<small>Cat.: {categories.find((c) => c.id === task.categoryId)?.name}</small>
					</p>
					<p class="flex flex-col items-end">
						{#if Number(task.updatedAt) > Number(task.createdAt) + 1000 * 60 * 60}
							<small>Updated at {task.updatedAt.toLocaleDateString('en-en')}</small>
						{/if}
						<small>Created at {task.createdAt.toLocaleDateString('en-en')}</small>
					</p>
				</div>
				<div class="text-center">
					<button type="submit" class="btn preset-filled-primary-500 btn-sm">Update Task</button>
				</div>
			</form>
			<form action="?/deltask" method="post" use:enhance>
				<input type="hidden" name="id" value={task.id} />
				<button class="btn preset-filled-error-200-800 btn-sm">
					<Trash size={16} />
				</button>
			</form>
		</li>
	{/each}
</ul>
<div class="card border border-primary-500 p-4 pb-4">
	<h2 class="text-right h5">New Category</h2>
	<form class="space-y-4" method="post" action="?/catg" use:enhance>
		<label for="name" class="label">
			<input class="input" name="name" />
		</label>
		<div class="text-center">
			<button type="submit" class="btn preset-filled-primary-500 btn-sm">Add Category</button>
		</div>
	</form>
</div>
<div class="card border border-primary-500 p-4 pb-4">
	<h2 class="text-right h5">Categories</h2>
	<ul class="space-y-2 pb-4">
		{#each categories as category}
			<li class="flex items-center gap-4">
				<div class="flex-auto">{category.name}</div>
				<form action="?/delcatg" method="post" use:enhance>
					<input type="hidden" name="id" value={category.id} />
					<button class="btn preset-filled-error-200-800 btn-sm">
						<Trash size={16} />
					</button>
				</form>
			</li>
		{/each}
	</ul>
</div>
<div class="card border border-primary-500 p-4 pb-4">
	<h2 class="text-right h5">New Task</h2>
	<form class="space-y-4" method="post" action="?/task" use:enhance>
		<label for="categoryId" class="label">
			<span class="label-text">Category</span>
			<select class="input" name="categoryId">
				{#each categories as category}
					<option value={category.id}>{category.name}</option>
				{/each}
			</select>
		</label>
		<label for="title" class="label">
			<span class="label-text">Title</span>
			<input class="input" name="title" />
		</label>
		<label for="content" class="label">
			<span class="label-text">Content</span>
			<textarea class="textarea" name="content"></textarea>
		</label>
		<div class="text-center">
			<button type="submit" class="btn preset-filled-primary-500 btn-sm">Add Task</button>
		</div>
	</form>
</div>
