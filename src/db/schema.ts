import { pgTable, text, timestamp, uuid, pgEnum } from "drizzle-orm/pg-core";

// 1. Enum pour le type de ressource
export const resourceTypeEnum = pgEnum('resource_type', ['PDF', 'LINK']);

// 2. Table des Ressources (Ce que le prof crée)
export const resources = pgTable('resources', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  type: resourceTypeEnum('type').notNull(), // 'PDF' ou 'LINK'
  url: text('url').notNull(), // URL du fichier ou lien externe
  createdAt: timestamp('created_at').defaultNow(),
});

// 3. Table des Soumissions (Ce que les élèves rendent)
export const submissions = pgTable('submissions', {
  id: uuid('id').defaultRandom().primaryKey(),
  resourceId: uuid('resource_id').references(() => resources.id).notNull(),
  studentName: text('student_name').notNull(),
  fileUrl: text('file_url').notNull(),
  submittedAt: timestamp('submitted_at').defaultNow(),
});