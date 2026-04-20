import { NextResponse } from "next/server";
import { db } from "@/db";
import { history } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = Number(searchParams.get("userId"));
    if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

    const userHistory = await db.select().from(history).where(eq(history.userId, userId)).orderBy(desc(history.date));
    return NextResponse.json({ history: userHistory });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Unknown error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as { userId?: number; name?: string; action?: string; snapshot?: string };
    const { userId, name, action, snapshot } = body;
    if (!userId || !name || !action) return NextResponse.json({ error: "userId, name, action required" }, { status: 400 });

    await db.insert(history).values({ userId, name, action, snapshot: snapshot || null });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Unknown error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = Number(searchParams.get("userId"));
    if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

    await db.delete(history).where(eq(history.userId, userId));
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Unknown error" }, { status: 500 });
  }
}