import { NextResponse } from "next/server";
import { db } from "@/db";
import { items } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = Number(searchParams.get("userId"));
    if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

    const allItems = await db.select().from(items)
      .where(eq(items.userId, userId));

    let updatedCount = 0;

    for (const item of allItems) {
      if (item.status === 'Kupione' || item.status === 'Sprzedane') {
        const now = Date.now();
        
        // Next 9:00 Polish time = 7:00 UTC
        const target = new Date(now);
        target.setUTCHours(7, 0, 0, target.getUTCMilliseconds());
        
        // If 7:00 UTC already passed, move to tomorrow
        if (target.getTime() <= now) {
          target.setUTCDate(target.getUTCDate() + 1);
        }
        
        // Exact milliseconds from now until next 9:00 Polish
        const msUntil9 = target.getTime() - now;
        
        // Add exactly 7 days
        const totalMs = (7 * 24 * 60 * 60 * 1000) + msUntil9;
        const tbDate = new Date(now + totalMs);

        await db.update(items)
          .set({ tradeBanDate: tbDate.toISOString() })
          .where(eq(items.id, item.id));
        
        updatedCount++;
      }
    }

    return NextResponse.json({ ok: true, updated: updatedCount, message: `Poprawiono ${updatedCount} przedmiotów` });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Unknown error" }, { status: 500 });
  }
}
