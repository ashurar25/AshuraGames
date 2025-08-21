import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Assuming nanoid is installed and imported if you were using the original nanoid logic
// import { nanoid } from "nanoid"; 

export const games = pgTable("games", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  thumbnail: text("thumbnail").notNull(),
  gameUrl: text("game_url").notNull(),
  gameFile: text("game_file"), // สำหรับเก็บ path ของไฟล์เกมที่อัพโหลด
  isEmbedded: boolean("is_embedded").default(true).notNull(), // true = embed URL, false = uploaded file
  category: text("category").notNull(),
  plays: integer("plays").notNull().default(0),
  rating: integer("rating").notNull().default(0), // out of 5, stored as integer (45 = 4.5)
  isNew: boolean("is_new").notNull().default(false),
  isTrending: boolean("is_trending").notNull().default(false),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const insertGameSchema = createInsertSchema(games).omit({
  id: true,
  plays: true,
  createdAt: true,
});

export type InsertGame = z.infer<typeof insertGameSchema>;
export type Game = typeof games.$inferSelect;

// Categories enum for consistency
export const GAME_CATEGORIES = [
  "action",
  "adventure", 
  "puzzle",
  "sports",
  "racing",
  "strategy",
  "arcade",
  "casual",
] as const;

export type GameCategory = typeof GAME_CATEGORIES[number];

export const GAME_CATEGORIES_TH = [
  'แอคชั่น',
  'ปริศนา', 
  'รถแข่ง',
  'ผู้เล่นหลายคน',
  '.IO',
  'กลยุทธ์'
] as const;

export type GameCategoryTH = typeof GAME_CATEGORIES_TH[number];