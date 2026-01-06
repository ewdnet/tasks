import type { PageServerLoad } from './$types';
import { idSchema } from '$lib/valibot/index';
import { valibot } from 'sveltekit-superforms/adapters';
import { db } from '$lib/server/db';
import { category, task } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { fail, superValidate } from 'sveltekit-superforms';

export const load = (async () => {
	const getCategories = async () => {
		const categories = await db.query.category.findMany({
			with: {
				tasks: {
					columns: {
						id: true,
						progress: true
					}
				}
			},
			orderBy: (category, { asc }) => [asc(category.name)]
		});
		return categories;
	};

	const getTasks = async () => {
		const tasks = await db.query.task.findMany({
			orderBy: (task, { desc }) => [desc(task.updatedAt)]
		});
		return tasks;
	};

	return {
		categories: await getCategories(),
		tasks: await getTasks()
	};
}) satisfies PageServerLoad;

export const actions = {
	category: async (event) => {
		const formData = await event.request.formData();
		const id = crypto.randomUUID() as string;
		const name = formData.get('name') as string;

		if (name) {
			await db.insert(category).values({ id, name });
		}

		return { success: true };
	},
	categorydelete: async (event) => {
		const formData = await event.request.formData();

		const form = await superValidate(formData, valibot(idSchema));
		const { id } = form.data;

		if (!form.valid) return fail(400, { form });

		try {
			await db.delete(category).where(eq(category.id, id));
		} catch (error) {
			return fail(500, {
				form,
				message: 'An error has occurred while deleting the category.',
				error: String(error)
			});
		}
	},
	task: async (event) => {
		const formData = await event.request.formData();
		const id = crypto.randomUUID() as string;
		const title = formData.get('title') as string;
		const content = formData.get('content') as string;
		const categoryId = formData.get('categoryId') as string;
		const createdAt = new Date();

		if (title && categoryId) {
			await db
				.insert(task)
				.values({ id, title, content, categoryId, createdAt, updatedAt: createdAt });
		}

		return { success: true };
	},
	taskedit: async (event) => {
		const formData = await event.request.formData();
		const id = formData.get('id') as string;
		const categoryId = formData.get('categoryId') as string;
		const title = formData.get('title') as string;
		const content = formData.get('content') as string;
		const progressValue = formData.get('progress');
		const progress =
			typeof progressValue === 'string' && progressValue.trim() !== '' ? Number(progressValue) : 0;
		const updatedAt = new Date();

		if (id && title) {
			await db
				.update(task)
				.set({ title, categoryId, content, progress, updatedAt })
				.where(eq(task.id, id));
		}

		return { success: true };
	},
	taskdelete: async (event) => {
		const formData = await event.request.formData();

		const form = await superValidate(formData, valibot(idSchema));
		const { id } = form.data;

		if (!form.valid) return fail(400, { form });

		try {
			await db.delete(task).where(eq(task.id, id));
		} catch (error) {
			return fail(500, {
				form,
				message: 'An error has occurred while deleting the task.',
				error: String(error)
			});
		}
	}
};
