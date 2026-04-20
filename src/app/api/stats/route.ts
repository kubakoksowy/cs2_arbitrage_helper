import { NextResponse } from "next/server";
import { db } from "@/db";
import { userStats } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = Number(searchParams.get("userId"));
    if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

    const stats = await db.select().from(userStats).where(eq(userStats.userId, userId));
    if (stats.length === 0) {
      return NextResponse.json({ stats: { totalItemsAdded: 0, totalInvested: 0, totalProfitSold: 0, totalSold: 0 } });
    }
    return NextResponse.json({ stats: stats[0] });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Unknown error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as { userId: number; field: string; amount: number };
    const { userId, field, amount } = body;
    if (!userId || !field) return NextResponse.json({ error: "userId and field required" }, { status: 400 });

    const existing = await db.select().from(userStats).where(eq(userStats.userId, userId));
    if (existing.length === 0) {
      await db.insert(userStats).values({ userId, totalItemsAdded: 0, totalInvested: 0, totalProfitSold: 0, totalSold: 0 });
    }

    const current = await db.select().from(userStats).where(eq(userStats.userId, userId));
    const row = current[0];
    const updates: Record<string, number> = {};
    switch (field) {
      case "totalItemsAdded": updates.totalItemsAdded = (row.totalItemsAdded || 0) + amount; break;
      case "totalInvested": updates.totalInvested = (row.totalInvested || 0) + amount; break;
      case "totalProfitSold": updates.totalProfitSold = (row.totalProfitSold || 0) + amount; break;
      case "totalSold": updates.totalSold = (row.totalSold || 0) + amount; break;
    }

    await db.update(userStats).set(updates).where(eq(userStats.userId, userId));
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Unknown error" }, { status: 500 });
  }
}