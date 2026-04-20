import { NextResponse } from "next/server";
import { db } from "@/db";
import { history } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = Number(searchParams.get("userId"));
    if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

    await db.delete(history).where(eq(history.userId, userId));

    return NextResponse.json({ ok: true, message: "Historia została całkowicie usunięta" });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Unknown error" }, { status: 500 });
  }
}
