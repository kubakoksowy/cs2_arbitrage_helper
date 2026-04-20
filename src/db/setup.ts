import postgres from "postgres";

const client = postgres(process.env.DATABASE_URL || "");

async function setup() {
  await client.unsafe(`CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    )`);

    await client.unsafe(`CREATE TABLE IF NOT EXISTS items (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id),
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      weapon_category TEXT NOT NULL,
      weapon_model TEXT NOT NULL,
      wear TEXT NOT NULL,
      rarity TEXT NOT NULL,
      is_st BOOLEAN NOT NULL DEFAULT false,
      is_souvenir BOOLEAN NOT NULL DEFAULT false,
      buy_place TEXT NOT NULL,
      buy REAL NOT NULL,
      sell_place TEXT NOT NULL,
      sell REAL NOT NULL,
      status TEXT NOT NULL,
      trade_ban_date TEXT,
      image TEXT NOT NULL,
      pattern TEXT,
      doppler_phase TEXT,
      ch_tier TEXT
    )`);

    await client.unsafe(`CREATE TABLE IF NOT EXISTS history (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id),
      name TEXT NOT NULL,
      action TEXT NOT NULL,
      snapshot TEXT,
      date TIMESTAMP NOT NULL DEFAULT NOW()
    )`);

    await client.unsafe(`CREATE TABLE IF NOT EXISTS user_stats (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL UNIQUE REFERENCES users(id),
      total_items_added INTEGER NOT NULL DEFAULT 0,
      total_invested REAL NOT NULL DEFAULT 0,
      total_profit_sold REAL NOT NULL DEFAULT 0,
      total_sold INTEGER NOT NULL DEFAULT 0
    )`);

    console.log("Tables created successfully");
    await client.end();
}

await setup();
