import type { PageServerLoad } from './$types';
import type { RequestEvent } from '@sveltejs/kit';
import {
	categoryCreate,
	idMultipleSchema,
	idSchema,
	taskCreate,
	taskSchema
} from '$lib/valibot/index';
import { valibot } from 'sveltekit-superforms/adapters';
import { setFlash } from 'sveltekit-flash-message/server';
import { db } from '$lib/server/db';
import { category, task } from '$lib/server/db/schema';
import { and, eq, inArray, not } from 'drizzle-orm';
import { fail, superValidate } from 'sveltekit-superforms';

type FlashType = 'error' | 'warning' | 'success' | 'info';

function flashAndFail(
	event: RequestEvent,
	type: FlashType,
	message: string,
	form: unknown,
	status = 400
) {
	setFlash({ type, message }, event.cookies);
	return fail(status, { form });
}

function parseIds(raw: string) {
	return raw
		.split(',')
		.map((id) => id.trim())
		.filter(Boolean);
}

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
		const form = await superValidate(event, valibot(categoryCreate));

		if (!form.valid) {
			const message = Array.isArray(form.errors.name)
				? form.errors.name.join(' ')
				: (form.errors.name ?? 'Invalid category name.');
			return flashAndFail(event, 'error', message, form);
		}

		const existingName = await db.query.category.findFirst({
			where: eq(category.name, form.data.name)
		});

		if (existingName) {
			return flashAndFail(event, 'error', 'Category name already exists.', form);
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
		const form = await superValidate(event, valibot(idSchema));
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
	category_delete_multiple: async (event) => {
		const form = await superValidate(event, valibot(idMultipleSchema));

		if (!form.valid) {
			const msg = Array.isArray(form.errors.id) ? form.errors.id.join(' ') : form.errors.id;
			return flashAndFail(event, 'error', msg ?? 'No categories selected.', form);
		}

		const ids = parseIds(form.data.id);
		if (ids.length === 0) {
			return flashAndFail(event, 'error', 'No categories selected.', form);
		}

		try {
			await db.delete(category).where(inArray(category.id, ids));
		} catch (error) {
			return fail(500, {
				form,
				message: 'An error has occurred while deleting the categories.',
				error: String(error)
			});
		}

		setFlash(
			{ type: 'success', message: 'Categories and Tasks deleted successfully.' },
			event.cookies
		);
	},
	task_create: async (event) => {
		const form = await superValidate(event, valibot(taskCreate));

		if (!form.valid) {
			const errors = Object.values(form.errors).join(' ');
			return flashAndFail(event, 'error', errors, form);
		}

		const existingTitle = await db.query.task.findFirst({
			where: eq(task.title, form.data.title)
		});

		if (existingTitle) {
			return flashAndFail(event, 'error', 'Task title already exists.', form);
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
		const form = await superValidate(event, valibot(taskSchema));

		if (!form.valid) {
			const errors = Object.values(form.errors).join(' ');
			return flashAndFail(event, 'error', errors, form);
		}

		const existingTitle = await db.query.task.findFirst({
			where: and(eq(task.title, form.data.title), not(eq(task.id, form.data.id)))
		});

		if (existingTitle) {
			return flashAndFail(event, 'error', 'Task title already exists.', form);
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
		const form = await superValidate(event, valibot(idSchema));

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
	},
	task_delete_multiple: async (event) => {
		const form = await superValidate(event, valibot(idMultipleSchema));

		if (!form.valid) {
			const msg = Array.isArray(form.errors.id) ? form.errors.id.join(' ') : form.errors.id;
			return flashAndFail(event, 'error', msg ?? 'No tasks selected.', form);
		}

		const ids = parseIds(form.data.id);
		if (ids.length === 0) {
			return flashAndFail(event, 'error', 'No tasks selected.', form);
		}

		try {
			await db.delete(task).where(inArray(task.id, ids));
		} catch (error) {
			return fail(500, {
				form,
				message: 'An error has occurred while deleting the tasks.',
				error: String(error)
			});
		}

		setFlash({ type: 'success', message: 'Tasks deleted successfully.' }, event.cookies);
	}
};
