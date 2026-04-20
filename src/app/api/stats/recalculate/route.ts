import { NextResponse } from "next/server";
import { db } from "@/db";
import { history, userStats } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = Number(searchParams.get("userId"));
    if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

    // ✅ STATYSTYKI BAZOWANE NA HISTORII SPRZEDAŻY!
    // ✅ TYLKO ZAKOŃCZONE ZAMKNIĘTE TRANSAKCJE SPRZEDAŻY
    const allHistory = await db.select()
      .from(history)
      .where(eq(history.userId, userId))
      .orderBy(desc(history.date));
    
    let totalInvested = 0;
    let totalProfitSold = 0;
    let totalSold = 0;

    // MARKET FEES CONFIG - same as frontend
    const marketFees: Record<string, number> = {
      "Steam": 0.13,
      "Buff163": 0.025,
      "Skinport": 0.06,
      "Bitskins": 0.05,
      "DMarket": 0.07,
      "CS2.Market": 0.045,
      "Waxpeer": 0.05,
      "Lis-Skins": 0.03,
      "Bot": 0,
      "P2P": 0
    };

    const processedItems = new Set<string>();
    
    allHistory.forEach(entry => {
      try {
        if (entry.snapshot) {
          const item = JSON.parse(entry.snapshot);
          
          // ✅ TYLKO SPRZEDANE PRZEDMIOTY - BEZ DUPLIKATÓW
          if (item.buy > 0 && item.sell > 0 && item.status === "Sprzedane" && !processedItems.has(item.id || item.name + item.createdAt)) {
            processedItems.add(item.id || item.name + item.createdAt);
            
            const sellFee = marketFees[item.sellPlace] || 0;
            const netSell = item.sell * (1 - sellFee);
            
            totalInvested += item.buy;
            totalProfitSold += (netSell - item.buy);
            totalSold++;
          }
        }
      } catch {
        // skip invalid entries
      }
    });

    // ✅ Zaktualizuj statystyki w bazie
    await db.update(userStats).set({
      totalInvested,
      totalProfitSold,
      totalSold
    }).where(eq(userStats.userId, userId));

    return NextResponse.json({
      ok: true,
      message: "Statystyki przeliczone poprawnie z HISTORII SPRZEDAŻY",
      recalculated: {
        totalInvested,
        totalProfitSold,
        totalSold,
        transactionsFound: allHistory.length
      }
    });

  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Unknown error" }, { status: 500 });
  }
}
