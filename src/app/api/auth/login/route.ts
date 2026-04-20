import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as { username?: string; password?: string };
    const { username, password } = body;
    if (!username || !password) return NextResponse.json({ error: "Username and password required" }, { status: 400 });

    const found = await db.select().from(users).where(eq(users.username, username));
    if (found.length === 0) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    const passwordHash = await hashPassword(password);
    if (found[0].passwordHash !== passwordHash) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    return NextResponse.json({ id: found[0].id, username: found[0].username });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Unknown error" }, { status: 500 });
  }
}
