<script lang="ts">
	import { enhance } from '$app/forms';
</script>

<form class="space-y-4" method="post" action="?/catg" use:enhance>
	<label for="name" class="label">
		<input class="input" name="name" />
	</label>
	<div class="text-center">
		<button type="submit" class="btn preset-filled-primary-500 btn-sm">Add Category</button>
	</div>
</form>
