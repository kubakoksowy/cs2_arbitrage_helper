import { NextRequest, NextResponse } from "next/server";

const STEAM_CDN = "https://community.cloudflare.steamstatic.com/economy/image/";

interface SteamResult {
  hash_name?: string;
  name?: string;
  asset_description?: {
    icon_url?: string;
  };
}

interface SteamSearchResponse {
  success: boolean;
  results?: SteamResult[];
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");
  if (!q || q.trim().length < 2) {
    return NextResponse.json({ suggestions: [] });
  }

  try {
    const url =
      `https://steamcommunity.com/market/search/render/?query=${encodeURIComponent(q.trim())}&appid=730&norender=1&count=10&start=0`;

    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Accept": "application/json",
        "Accept-Language": "en-US,en;q=0.9"
      },
      next: { revalidate: 30 }
    });

    if (!res.ok) {
      return NextResponse.json({ suggestions: [] });
    }

    const json = await res.json() as SteamSearchResponse;
    if (!json.success || !json.results) {
      return NextResponse.json({ suggestions: [] });
    }

    const suggestions = json.results
      .filter(r => r.asset_description?.icon_url)
      .map(r => ({
        name: r.hash_name ?? r.name ?? "",
        iconUrl: `${STEAM_CDN}${r.asset_description!.icon_url!}`
      }))
      .filter(s => s.name);

    return NextResponse.json({ suggestions });
  } catch {
    return NextResponse.json({ suggestions: [] });
  }
}
