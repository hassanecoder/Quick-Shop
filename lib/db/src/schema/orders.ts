import { pgTable, serial, varchar, integer, decimal, boolean, timestamp, text, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const ordersTable = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: varchar("order_number", { length: 50 }).notNull().unique(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }).notNull(),
  regionId: integer("region_id").notNull(),
  cityId: integer("city_id"),
  address: text("address"),
  status: varchar("status", { length: 50 }).default("pending").notNull(),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  isInstant: boolean("is_instant").default(false),
  notes: text("notes"),
  items: jsonb("items").$type<Array<{productId: number; quantity: number; price: number}>>().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const favoritesTable = pgTable("favorites", {
  id: serial("id").primaryKey(),
  sessionId: varchar("session_id", { length: 255 }).notNull(),
  productId: integer("product_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertOrderSchema = createInsertSchema(ordersTable).omit({ id: true, createdAt: true });
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof ordersTable.$inferSelect;

export const insertFavoriteSchema = createInsertSchema(favoritesTable).omit({ id: true, createdAt: true });
export type InsertFavorite = z.infer<typeof insertFavoriteSchema>;
export type Favorite = typeof favoritesTable.$inferSelect;
