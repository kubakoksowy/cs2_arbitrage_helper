import { NextResponse } from "next/server";
import { db } from "@/db";
import { history } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const result = await db.delete(history);
    return NextResponse.json({ 
      ok: true, 
      message: `Cała historia została usunięta`,
      deletedRows: result.count
    });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Unknown error" }, { status: 500 });
  }
}
