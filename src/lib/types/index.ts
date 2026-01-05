export type CategoryItem = {
	id: string;
	name: string;
	tasks: {
		id: string;
		progress: number;
	}[];
};
export type TaskItem = {
	id: string;
	title: string;
	content: string | null;
	progress: number;
	categoryId: string;
	createdAt: Date;
	updatedAt: Date;
};
