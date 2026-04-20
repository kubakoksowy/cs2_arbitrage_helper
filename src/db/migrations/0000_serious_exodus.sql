CREATE TABLE "history" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"name" text NOT NULL,
	"action" text NOT NULL,
	"snapshot" text,
	"date" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "items" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"weapon_category" text NOT NULL,
	"weapon_model" text NOT NULL,
	"wear" text NOT NULL,
	"rarity" text NOT NULL,
	"is_st" boolean DEFAULT false NOT NULL,
	"is_souvenir" boolean DEFAULT false NOT NULL,
	"buy_place" text NOT NULL,
	"buy" real NOT NULL,
	"sell_place" text NOT NULL,
	"sell" real NOT NULL,
	"status" text NOT NULL,
	"trade_ban_date" text,
	"image" text NOT NULL,
	"pattern" text,
	"doppler_phase" text,
	"ch_tier" text
);
--> statement-breakpoint
CREATE TABLE "user_stats" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"total_items_added" integer DEFAULT 0 NOT NULL,
	"total_invested" real DEFAULT 0 NOT NULL,
	"total_profit_sold" real DEFAULT 0 NOT NULL,
	"total_sold" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "user_stats_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"password_hash" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
ALTER TABLE "history" ADD CONSTRAINT "history_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "items" ADD CONSTRAINT "items_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_stats" ADD CONSTRAINT "user_stats_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;