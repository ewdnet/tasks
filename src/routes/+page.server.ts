import type { PageServerLoad } from './$types';
import { categoryCreate, idSchema, taskCreate, taskSchema } from '$lib/valibot/index';
import { valibot } from 'sveltekit-superforms/adapters';
import { setFlash } from 'sveltekit-flash-message/server';
import { db } from '$lib/server/db';
import { category, task } from '$lib/server/db/schema';
import { and, eq, not } from 'drizzle-orm';
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
	category_create: async (event) => {
		const formData = await event.request.formData();
		const form = await superValidate(formData, valibot(categoryCreate));

		if (!form.valid) {
			setFlash({ type: 'error', message: form.errors.name }, event.cookies);
			return fail(400, { form });
		}

		const existingName = await db.query.category.findFirst({
			where: eq(category.name, form.data.name)
		});

		if (existingName) {
			setFlash({ type: 'error', message: 'Category name already exists.' }, event.cookies);
			return fail(400, { form });
		}

		const { name } = form.data;
		const id = crypto.randomUUID() as string;

		try {
			await db.insert(category).values({ id, name });
		} catch (error) {
			return fail(500, {
				form,
				message: 'An error has occurred while creating the category.',
				error: String(error)
			});
		}

		setFlash({ type: 'success', message: 'Category created successfully.' }, event.cookies);
	},
	category_delete: async (event) => {
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

		setFlash({ type: 'success', message: 'Category deleted successfully.' }, event.cookies);
	},
	task_create: async (event) => {
		const formData = await event.request.formData();
		const form = await superValidate(formData, valibot(taskCreate));

		if (!form.valid) {
			const errors = Object.values(form.errors).join(' ');
			setFlash({ type: 'error', message: errors }, event.cookies);
			return fail(400, { form });
		}

		const existingTitle = await db.query.task.findFirst({
			where: eq(task.title, form.data.title)
		});

		if (existingTitle) {
			setFlash({ type: 'error', message: 'Task title already exists.' }, event.cookies);
			return fail(400, { form });
		}

		const id = crypto.randomUUID() as string;
		const createdAt = new Date();
		const { title, content, categoryId } = form.data;

		try {
			await db
				.insert(task)
				.values({ id, title, content, categoryId, createdAt, updatedAt: createdAt });
		} catch (error) {
			return fail(500, {
				form,
				message: 'An error has occurred while creating the task.',
				error: String(error)
			});
		}

		setFlash({ type: 'success', message: 'Task created successfully.' }, event.cookies);
	},
	task_update: async (event) => {
		const formData = await event.request.formData();
		const form = await superValidate(formData, valibot(taskSchema));

		if (!form.valid) {
			const errors = Object.values(form.errors).join(' ');
			setFlash({ type: 'error', message: errors }, event.cookies);
			return fail(400, { form });
		}

		const existingTitle = await db.query.task.findFirst({
			where: and(eq(task.title, form.data.title), not(eq(task.id, form.data.id)))
		});

		if (existingTitle) {
			setFlash({ type: 'error', message: 'Task title already exists.' }, event.cookies);
			return fail(400, { form });
		}

		const { id, title, content, progress, categoryId } = form.data;
		const updatedAt = new Date();

		try {
			await db
				.update(task)
				.set({ title, content, progress, categoryId, updatedAt })
				.where(eq(task.id, id));
		} catch (error) {
			return fail(500, {
				form,
				message: 'An error has occurred while updating the task.',
				error: String(error)
			});
		}

		setFlash({ type: 'success', message: 'Task updated successfully.' }, event.cookies);
	},
	task_delete: async (event) => {
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

		setFlash({ type: 'success', message: 'Task deleted successfully.' }, event.cookies);
	}
};
