import { maxLength, minLength, number, object, optional, pipe, string } from 'valibot';

export const categoryCreate = object({
	name: pipe(
		string(),
		minLength(2, 'Name must be at least 2 characters long'),
		maxLength(20, 'Name must be at most 20 characters long')
	)
});

export const categoryDelete = object({
	id: string()
});

export const taskCreate = object({
	title: pipe(
		string(),
		minLength(2, 'Title must be at least 2 characters long'),
		maxLength(20, 'Title must be at most 20 characters long')
	),
	content: optional(string()),
	categoryId: string()
});

export const taskUpdate = object({
	id: string(),
	title: string(),
	progress: optional(number()),
	content: optional(string()),
	categoryId: optional(string())
});

export const taskDelete = object({
	id: string()
});
