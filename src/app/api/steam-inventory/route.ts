import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const steamId = searchParams.get("steamId");

  if (!steamId) {
    return NextResponse.json({ error: "steamId required" }, { status: 400 });
  }

  const steamUrl = `https://steamcommunity.com/inventory/${steamId}/730/2?l=english&count=5000`;

  const proxies = [
    `https://api.allorigins.win/get?url=${encodeURIComponent(steamUrl)}`,
    `https://corsproxy.io/?${encodeURIComponent(steamUrl)}`,
    `https://corsproxy.org/?${encodeURIComponent(steamUrl)}`,
    `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(steamUrl)}`,
  ];

  let data = null;
  let lastError = "";

  for (const proxyUrl of proxies) {
    try {
      const res = await fetch(proxyUrl, {
        headers: { "Accept": "application/json" },
      });

      if (res.ok) {
        const text = await res.text();
        let json;
        try {
          json = JSON.parse(text);
        } catch {
          json = null;
        }

        if (json) {
          if (json.contents) {
            data = json.contents;
          } else if (json.descriptions?.length) {
            data = json;
          }
          if (data) break;
        }
      } else {
        lastError = `Proxy returned ${res.status}`;
      }
    } catch (e) {
      lastError = `Error: ${e}`;
    }
  }

  if (!data) {
    return NextResponse.json({ 
      error: "Failed to fetch inventory",
      details: lastError
    }, { status: 500 });
  }

  return NextResponse.json(data);
}