import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const games = pgTable("games", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  thumbnail: text("thumbnail").notNull(),
  gameUrl: text("game_url").notNull(),
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
  "puzzle", 
  "racing",
  "multiplayer",
  "io",
  "strategy"
] as const;

export type GameCategory = typeof GAME_CATEGORIES[number];
