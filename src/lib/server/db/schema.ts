import { relations } from 'drizzle-orm/relations';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const category = sqliteTable('category', {
	id: text().primaryKey().notNull(),
	name: text().notNull()
});

export const task = sqliteTable('task', {
	id: text().primaryKey().notNull(),
	progress: integer().default(0).notNull(),
	title: text().notNull(),
	content: text(),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
	categoryId: text()
		.notNull()
		.references(() => category.id, { onDelete: 'cascade', onUpdate: 'cascade' })
});

export const taskRelations = relations(task, ({ one }) => ({
	category: one(category, {
		fields: [task.categoryId],
		references: [category.id]
	})
}));

export const categoryRelations = relations(category, ({ many }) => ({
	tasks: many(task)
}));
