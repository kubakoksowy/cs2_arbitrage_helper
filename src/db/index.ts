import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

let dbInstance: ReturnType<typeof drizzle> | null = null;

const getDb = () => {
  if (dbInstance) return dbInstance;
  
  const connectionString = process.env.DATABASE_URL || process.env.DB_URL || "";
  if (!connectionString) {
    throw new Error("DATABASE_URL is required");
  }

  const client = postgres(connectionString, { prepare: false });
  dbInstance = drizzle(client, { schema });
  return dbInstance;
};

export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(_target, prop) {
    return getDb()[prop as keyof ReturnType<typeof drizzle>];
  }
});