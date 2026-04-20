import { NextResponse } from "next/server";
import { db } from "@/db";
import { items } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = Number(searchParams.get("userId"));
    if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

    const userItems = await db.select().from(items).where(eq(items.userId, userId));
    return NextResponse.json({ items: userItems });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Unknown error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const b = await request.json() as Record<string, unknown>;
    if (!b.userId || !b.name) return NextResponse.json({ error: "userId and name required" }, { status: 400 });

    let tradeBanDate: string | null = null;
    const status = String(b.status || "Wolne");
    if (status === "Kupione" || status === "Sprzedane") {
      const now = Date.now();
      
      // Next 9:00 Polish time = 7:00 UTC
      const target = new Date(now);
      target.setUTCHours(7, 0, 0, target.getUTCMilliseconds());
      
      // If 7:00 UTC already passed, move to tomorrow
      if (target.getTime() <= now) {
        target.setUTCDate(target.getUTCDate() + 1);
      }
      
      // Exact milliseconds from now until next 9:00 Polish (7:00 UTC)
      const msUntil9 = target.getTime() - now;
      
      // Add exactly 7 days
      const totalMs = (7 * 24 * 60 * 60 * 1000) + msUntil9;
      const tbDate = new Date(now + totalMs);
      
      tradeBanDate = tbDate.toISOString();
    }

    await db.insert(items).values({
      userId: Number(b.userId), name: String(b.name), type: String(b.type || "Weapon"),
      weaponCategory: String(b.weaponCategory || ""), weaponModel: String(b.weaponModel || ""),
      wear: String(b.wear || ""), rarity: String(b.rarity || ""),
      isST: Boolean(b.isST), isSouvenir: Boolean(b.isSouvenir),
      buyPlace: String(b.buyPlace || ""), buy: Number(b.buy || 0),
      sellPlace: String(b.sellPlace || ""), sell: Number(b.sell || 0),
      status: status,
      tradeBanDate: tradeBanDate,
      image: String(b.image || "/placeholder.png"), pattern: b.pattern ? String(b.pattern) : null,
      dopplerPhase: b.dopplerPhase ? String(b.dopplerPhase) : null, chTier: b.chTier ? String(b.chTier) : null,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Unknown error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const b = await request.json() as Record<string, unknown>;
    if (!b.userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

    const updateData: Record<string, unknown> = {};
    if (b.status !== undefined) {
      const newStatus = String(b.status);
      updateData.status = newStatus;
        if (newStatus === "Kupione" || newStatus === "Sprzedane") {
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
          
          updateData.tradeBanDate = tbDate.toISOString();
        } else {
          updateData.tradeBanDate = null;
        }
    }
    if (b.sellPlace !== undefined) updateData.sellPlace = String(b.sellPlace);
    if (b.sell !== undefined) updateData.sell = Number(b.sell);
    if (b.buyPlace !== undefined) updateData.buyPlace = String(b.buyPlace);
    if (b.buy !== undefined) updateData.buy = Number(b.buy);
    if (b.image !== undefined) updateData.image = String(b.image);
    if (b.pattern !== undefined) updateData.pattern = b.pattern ? String(b.pattern) : null;
    if (b.dopplerPhase !== undefined) updateData.dopplerPhase = b.dopplerPhase ? String(b.dopplerPhase) : null;
    if (b.chTier !== undefined) updateData.chTier = b.chTier ? String(b.chTier) : null;
    if (b.tradeBanDate !== undefined) {
      updateData.tradeBanDate = b.tradeBanDate ? String(b.tradeBanDate) : null;
    }

    if (b.id) {
      await db.update(items).set(updateData).where(and(eq(items.id, Number(b.id)), eq(items.userId, Number(b.userId))));
    } else if (b.name) {
      await db.update(items).set(updateData).where(and(eq(items.name, String(b.name)), eq(items.userId, Number(b.userId))));
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Unknown error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const name = searchParams.get("name");
    const userId = Number(searchParams.get("userId"));
    if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

    if (id) {
      await db.delete(items).where(and(eq(items.id, Number(id)), eq(items.userId, userId)));
    } else if (name) {
      await db.delete(items).where(and(eq(items.name, name), eq(items.userId, userId)));
    } else {
      return NextResponse.json({ error: "id or name required" }, { status: 400 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Unknown error" }, { status: 500 });
  }
}