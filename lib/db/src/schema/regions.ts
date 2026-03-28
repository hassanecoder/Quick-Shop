import { pgTable, serial, varchar, integer, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const regionsTable = pgTable("regions", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 10 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  nameAr: varchar("name_ar", { length: 255 }).notNull(),
  nameFr: varchar("name_fr", { length: 255 }).notNull(),
  deliveryDays: integer("delivery_days").default(3).notNull(),
  deliveryFee: decimal("delivery_fee", { precision: 10, scale: 2 }).default("500").notNull(),
});

export const citiesTable = pgTable("cities", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  nameAr: varchar("name_ar", { length: 255 }).notNull(),
  regionId: integer("region_id").notNull(),
});

export const insertRegionSchema = createInsertSchema(regionsTable).omit({ id: true });
export type InsertRegion = z.infer<typeof insertRegionSchema>;
export type Region = typeof regionsTable.$inferSelect;

export const insertCitySchema = createInsertSchema(citiesTable).omit({ id: true });
export type InsertCity = z.infer<typeof insertCitySchema>;
export type City = typeof citiesTable.$inferSelect;
