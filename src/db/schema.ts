import { pgTable, serial, text, integer, real, boolean, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const items = pgTable("items", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  type: text("type").notNull(),
  weaponCategory: text("weapon_category").notNull(),
  weaponModel: text("weapon_model").notNull(),
  wear: text("wear").notNull(),
  rarity: text("rarity").notNull(),
  isST: boolean("is_st").notNull().default(false),
  isSouvenir: boolean("is_souvenir").notNull().default(false),
  buyPlace: text("buy_place").notNull(),
  buy: real("buy").notNull(),
  sellPlace: text("sell_place").notNull(),
  sell: real("sell").notNull(),
  status: text("status").notNull(),
  tradeBanDate: text("trade_ban_date"),
  image: text("image").notNull(),
  pattern: text("pattern"),
  dopplerPhase: text("doppler_phase"),
  chTier: text("ch_tier"),
});

export const history = pgTable("history", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  action: text("action").notNull(),
  snapshot: text("snapshot"),
  date: timestamp("date").notNull().defaultNow(),
});

export const userStats = pgTable("user_stats", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().unique().references(() => users.id),
  totalItemsAdded: integer("total_items_added").notNull().default(0),
  totalInvested: real("total_invested").notNull().default(0),
  totalProfitSold: real("total_profit_sold").notNull().default(0),
  totalSold: integer("total_sold").notNull().default(0),
});