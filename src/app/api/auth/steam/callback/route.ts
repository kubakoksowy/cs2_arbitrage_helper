import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const origin = `${url.protocol}//${url.host}`;

  try {
    const params = url.searchParams;

    if (params.get("openid.mode") !== "id_res") {
      return new NextResponse(
        `<html><body><script>window.location.href="/?error=cancelled"</script></body></html>`,
        { headers: { "Content-Type": "text/html" } }
      );
    }

    // Verify with Steam
    const verifyParams = new URLSearchParams();
    for (const [key, value] of params.entries()) {
      verifyParams.set(key, value);
    }
    verifyParams.set("openid.mode", "check_authentication");

    const verifyRes = await fetch("https://steamcommunity.com/openid/login", {
      method: "POST",
      body: verifyParams.toString(),
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    const verifyText = await verifyRes.text();
    if (!verifyText.includes("is_valid:true")) {
      return new NextResponse(
        `<html><body><script>window.location.href="/?error=invalid"</script></body></html>`,
        { headers: { "Content-Type": "text/html" } }
      );
    }

    // Extract Steam ID
    const claimedId = params.get("openid.claimed_id") || "";
    const steamIdMatch = claimedId.match(/\/id\/(\d+)$/);
    if (!steamIdMatch) {
      return new NextResponse(
        `<html><body><script>window.location.href="/?error=noid"</script></body></html>`,
        { headers: { "Content-Type": "text/html" } }
      );
    }

    const steamId = steamIdMatch[1];
    let steamName = `Steam_${steamId}`;
    let steamAvatar = `https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/fe/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg`;

    // Fetch Steam profile from XML API (no key needed)
    try {
      const xmlRes = await fetch(`https://steamcommunity.com/profiles/${steamId}/?xml=1`);
      const xmlText = await xmlRes.text();

      const nameMatch = xmlText.match(/<steamID><!\[CDATA\[(.+?)\]\]><\/steamID>/);
      if (nameMatch) steamName = nameMatch[1];

      const avatarMatch = xmlText.match(/<avatarFull><!\[CDATA\[(.+?)\]\]><\/avatarFull>/);
      if (avatarMatch) steamAvatar = avatarMatch[1];
    } catch { /* use defaults */ }

    // Find or create user
    const existing = await db.select().from(users).where(eq(users.username, steamName));
    let userId: number;
    if (existing.length > 0) {
      userId = existing[0].id;
    } else {
      const inserted = await db.insert(users).values({
        username: steamName,
        passwordHash: `steam_${steamId}`,
      }).returning({ id: users.id });
      userId = inserted[0].id;
    }

    // Return HTML that saves session and redirects
    const sessionData = JSON.stringify({ id: userId, username: steamName, avatar: steamAvatar });
    const encodedSession = Buffer.from(sessionData).toString("base64");
    const html = `<!DOCTYPE html>
<html><head><title>Logging in...</title></head>
<body style="background:#09090b;color:#a1a1aa;display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;">
<p>Logging in via Steam...</p>
<script>
try {
  localStorage.setItem("session", ${JSON.stringify(sessionData)});
} catch(e) {}
window.location.href = "/?session=${encodedSession}";
</script>
</body></html>`;

    return new NextResponse(html, { headers: { "Content-Type": "text/html" } });

  } catch {
    return new NextResponse(
      `<html><body><script>window.location.href="/?error=steam"</script></body></html>`,
      { headers: { "Content-Type": "text/html" } }
    );
  }
}
