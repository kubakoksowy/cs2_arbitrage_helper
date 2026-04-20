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

    await db.update(userStats).set({
      totalItemsAdded: 0,
      totalInvested: 0,
      totalProfitSold: 0,
      totalSold: 0
    }).where(eq(userStats.userId, userId));

    return NextResponse.json({ ok: true, message: "Statystyki zostały zresetowane" });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Unknown error" }, { status: 500 });
  }
}
