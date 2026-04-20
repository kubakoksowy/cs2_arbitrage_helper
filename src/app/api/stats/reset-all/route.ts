import { NextResponse } from "next/server";
import { db } from "@/db";
import { userStats } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Reset wszystkich statystyk graczy do 0
    const result = await db.update(userStats).set({
      totalItemsAdded: 0,
      totalInvested: 0,
      totalProfitSold: 0,
      totalSold: 0,
    });

    return NextResponse.json({ 
      ok: true, 
      message: `Wszystkie statystyki zostały zresetowane`,
      affectedRows: result.count
    });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Unknown error" }, { status: 500 });
  }
}
