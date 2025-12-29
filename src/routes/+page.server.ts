import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { category, task } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load = (async () => {
	const getCategories = async () => {
		const categories = await db.query.category.findMany();
		return categories;
	};

	const getTasks = async () => {
		const tasks = await db.query.task.findMany();
		return tasks;
	};

	return {
		categories: await getCategories(),
		tasks: await getTasks()
	};
}) satisfies PageServerLoad;

export const actions = {
	catg: async (event) => {
		const formData = await event.request.formData();
		const id = crypto.randomUUID() as string;
		const name = formData.get('name') as string;

		if (name) {
			await db.insert(category).values({ id, name });
		}

		return { success: true };
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
	edittask: async (event) => {
		const formData = await event.request.formData();
		const id = formData.get('id') as string;
		const title = formData.get('title') as string;
		const content = formData.get('content') as string;
		const updatedAt = new Date();

		if (id && title) {
			await db.update(task).set({ title, content, updatedAt }).where(eq(task.id, id));
		}

		return { success: true };
	},
	delcatg: async (event) => {
		const formData = await event.request.formData();
		const id = formData.get('id') as string;

		if (id) {
			await db.delete(category).where(eq(category.id, id));
		}

		return { success: true };
	},
	deltask: async (event) => {
		const formData = await event.request.formData();
		const id = formData.get('id') as string;

		if (id) {
			await db.delete(task).where(eq(task.id, id));
		}

		return { success: true };
	}
};
