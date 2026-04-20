import { NextRequest, NextResponse } from "next/server";
import { getPaintIndex } from "../../../../lib/skins-db";

const priceCache = new Map<string, { timestamp: number; prices: any[] }>();
const CACHE_TTL = 60 * 1000;

const API_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
  "Accept": "application/json, text/plain, */*",
  "Accept-Language": "pl-PL,pl;q=0.9,en-US;q=0.8,en;q=0.7",
  "Accept-Encoding": "gzip, deflate, br",
  "Referer": "https://www.google.com/",
  "DNT": "1",
  "Connection": "keep-alive",
  "Upgrade-Insecure-Requests": "1",
  "Sec-Fetch-Dest": "empty",
  "Sec-Fetch-Mode": "cors",
  "Sec-Fetch-Site": "cross-site"
};

const FETCH_TIMEOUT = 8000;

const PROXY_LIST = [
  `https://api.allorigins.win/raw?url=`,
  `https://corsproxy.io/?`,
  `https://api.codetabs.com/v1/proxy?quest=`,
  ""
];

async function safeFetch(url: string, options?: RequestInit): Promise<Response | null> {
  for (const proxy of PROXY_LIST) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

      const targetUrl = proxy ? `${proxy}${encodeURIComponent(url)}` : url;
      
      const res = await fetch(targetUrl, {
        ...options,
        headers: { ...API_HEADERS, ...options?.headers },
        signal: controller.signal,
        next: { revalidate: 60 }
      });
      
      clearTimeout(timeoutId);
      
      if (res.ok) {
        return res;
      }
    } catch {
      continue;
    }
  }
  
  return null;
}

const marketFetchers: Record<string, (skinName: string, paintIndex: number | null) => Promise<number | null>> = {
  "CSFloat": async (skinName, paintIndex) => {
    try {
      if (!paintIndex) return null;
      const url = `https://csfloat.com/api/v1/listings?paint_index=${paintIndex}&category=1&limit=1`;
      const res = await safeFetch(url);
      if (!res) return null;
      const data = await res.json();
      return data?.data?.[0]?.price ? data.data[0].price / 100 : null;
    } catch { return null; }
  },

  "Steam": async (skinName, paintIndex) => {
    try {
      const url = `https://steamcommunity.com/market/priceoverview/?currency=1&appid=730&market_hash_name=${encodeURIComponent(skinName)}`;
      const res = await safeFetch(url);
      if (!res) return null;
      const data = await res.json();
      return data?.lowest_price ? parseFloat(data.lowest_price.replace("$", "")) : null;
    } catch { return null; }
  },

  "Skinport": async (skinName, paintIndex) => {
    try {
      const url = `https://api.skinport.com/v1/items?app_id=730&market_hash_name=${encodeURIComponent(skinName)}`;
      const res = await safeFetch(url);
      if (!res) return null;
      const data = await res.json();
      return data?.[0]?.min_price ? data[0].min_price / 100 : null;
    } catch { return null; }
  },

  "DMarket": async (skinName, paintIndex) => {
    try {
      const url = `https://api.dmarket.com/marketplace/v1/items?limit=1&title=${encodeURIComponent(skinName)}`;
      const res = await safeFetch(url);
      if (!res) return null;
      const data = await res.json();
      return data?.objects?.[0]?.price?.USD ? parseFloat(data.objects[0].price.USD) : null;
    } catch { return null; }
  },

  "Bitskins": async (skinName, paintIndex) => {
    try {
      const url = `https://api.bitskins.com/market/search/v2?appid=730&market_hash_name=${encodeURIComponent(skinName)}`;
      const res = await safeFetch(url);
      if (!res) return null;
      const data = await res.json();
      return data?.data?.items?.[0]?.price ? data.data.items[0].price / 100 : null;
    } catch { return null; }
  },

  "SkinBaron": async (skinName, paintIndex) => {
    try {
      const url = `https://api.skinbaron.de/SearchPrice?appid=730&search=${encodeURIComponent(skinName)}`;
      const res = await safeFetch(url);
      if (!res) return null;
      const data = await res.json();
      return data?.lowest_price ? parseFloat(data.lowest_price) : null;
    } catch { return null; }
  },

  "ShadowPay": async (skinName, paintIndex) => {
    try {
      const url = `https://api.shadowpay.com/api/v2/items?name=${encodeURIComponent(skinName)}`;
      const res = await safeFetch(url);
      if (!res) return null;
      const data = await res.json();
      return data?.data?.items?.[0]?.price ? data.data.items[0].price / 100 : null;
    } catch { return null; }
  },

  "Gamerpay": async (skinName, paintIndex) => {
    try {
      const url = `https://api.gamerpay.gg/v2/market/items?name=${encodeURIComponent(skinName)}&limit=1`;
      const res = await safeFetch(url);
      if (!res) return null;
      const data = await res.json();
      return data?.items?.[0]?.price ? data.items[0].price / 100 : null;
    } catch { return null; }
  },

  "CSMoney": async (skinName, paintIndex) => {
    try {
      const url = `https://cs.money/api/v2/items?market_hash_name=${encodeURIComponent(skinName)}`;
      const res = await safeFetch(url);
      if (!res) return null;
      const data = await res.json();
      return data?.items?.[0]?.price ? parseFloat(data.items[0].price) : null;
    } catch { return null; }
  },

  "MarketCSGO": async (skinName, paintIndex) => {
    try {
      const url = `https://market.csgo.com/api/v2/search-listings/?market_hash_name=${encodeURIComponent(skinName)}`;
      const res = await safeFetch(url);
      if (!res) return null;
      const data = await res.json();
      return data?.items?.[0]?.price ? data.items[0].price / 100 : null;
    } catch { return null; }
  },

  "Waxpeer": async (skinName, paintIndex) => {
    try {
      const url = `https://api.waxpeer.com/v1/prices?name=${encodeURIComponent(skinName)}`;
      const res = await safeFetch(url);
      if (!res) return null;
      const data = await res.json();
      return data?.items?.[0]?.price ? data.items[0].price / 1000 : null;
    } catch { return null; }
  },

  "WhiteMarket": async (skinName, paintIndex) => {
    try {
      const url = `https://api.whitemarket.gg/v1/prices?market_hash_name=${encodeURIComponent(skinName)}`;
      const res = await safeFetch(url);
      if (!res) return null;
      const data = await res.json();
      return data?.[0]?.price ? parseFloat(data[0].price) : null;
    } catch { return null; }
  },

  "BuffMarket": async (skinName, paintIndex) => {
    try {
      const url = `https://buff.market/api/market/search?q=${encodeURIComponent(skinName)}`;
      const res = await safeFetch(url);
      if (!res) return null;
      const data = await res.json();
      return data?.items?.[0]?.min_price ? parseFloat(data.items[0].min_price) : null;
    } catch { return null; }
  },

  "Buff163": async (skinName, paintIndex) => {
    try {
      const url = `https://buff.163.com/api/market/goods?game=csgo&page_num=1&page_size=1&search=${encodeURIComponent(skinName)}`;
      const res = await safeFetch(url);
      if (!res) return null;
      const data = await res.json();
      return data?.data?.items?.[0]?.sell_min_price ? parseFloat(data.data.items[0].sell_min_price) : null;
    } catch { return null; }
  },

  "Ecosteam": async (skinName, paintIndex) => {
    try {
      const url = `https://api.ecosteam.cn/v1/items?market_hash_name=${encodeURIComponent(skinName)}`;
      const res = await safeFetch(url);
      if (!res) return null;
      const data = await res.json();
      return data?.data?.[0]?.price ? data.data[0].price / 100 : null;
    } catch { return null; }
  },

  "YouPin898": async (skinName, paintIndex) => {
    return null;
  },

  "Skins.com": async (skinName, paintIndex) => {
    return null;
  },

  "UUSkins": async (skinName, paintIndex) => {
    return null;
  },

  "LisSkins": async (skinName, paintIndex) => {
    return null;
  },

  "Skinswap China": async (skinName, paintIndex) => {
    return null;
  }
};

export async function GET(req: NextRequest, context: { params: Promise<{ name: string }> }) {
  const { name } = await context.params;
  const skinName = decodeURIComponent(name);
  const cacheKey = skinName.toLowerCase();

  const cached = priceCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return NextResponse.json({ markets: cached.prices, cached: true });
  }

  try {
    const paintIndex = getPaintIndex(skinName);

    const marketsData = { markets: [
      { name: "Buff163", sellFee: 0.025, url: "https://buff.163.com", type: "p2p" },
      { name: "YouPin898", sellFee: 0.01, url: "https://youpin898.com", type: "p2p" },
      { name: "Ecosteam", sellFee: 0.05, url: "https://www.ecosteam.cn", type: "p2p" },
      { name: "CSFloat", sellFee: 0.02, url: "https://csfloat.com", type: "p2p" },
      { name: "CSMoney", sellFee: 0.05, url: "https://cs.money/pl/market/buy", type: "p2p" },
      { name: "MarketCSGO", sellFee: 0.05, url: "https://market.csgo.com", type: "p2p" },
      { name: "Waxpeer", sellFee: 0.06, url: "https://waxpeer.com", type: "p2p" },
      { name: "Gamerpay", sellFee: 0.03, url: "https://gamerpay.gg", type: "p2p" },
      { name: "WhiteMarket", sellFee: 0.05, url: "https://whitemarket.gg", type: "p2p" },
      { name: "BuffMarket", sellFee: 0.025, url: "https://buff.market", type: "p2p" },
      { name: "ShadowPay", sellFee: 0.10, url: "https://shadowpay.com", type: "p2p" },
      { name: "Steam", sellFee: 0.15, url: "https://steamcommunity.com/market", type: "p2p" },
      { name: "DMarket", sellFee: 0.10, url: "https://dmarket.com", type: "bot" },
      { name: "Bitskins", sellFee: 0.05, url: "https://bitskins.com", type: "bot" },
      { name: "Skinport", sellFee: 0.08, url: "https://skinport.com", type: "bot" },
      { name: "SkinBaron", sellFee: 0.15, url: "https://skinbaron.com", type: "bot" },
      { name: "Skins.com", sellFee: 0, url: "https://skins.com", type: "onlybuy" },
      { name: "UUSkins", sellFee: 0, url: "https://www.uuskins.com", type: "onlybuy" },
      { name: "LisSkins", sellFee: 0, url: "https://lisskins.com", type: "onlybuy" },
      { name: "Skinswap China", sellFee: 0, url: "https://skinswap.com/buy", type: "onlybuy" }
    ]};

    const validMarkets = (marketsData.markets || []).filter((m: any) => m.type !== "swap");

    const priceResults = await Promise.allSettled(
      validMarkets.map(async (market: any) => {
        try {
          const fetcher = marketFetchers[market.name];
          if (!fetcher) {
            return { name: market.name, url: market.url, type: market.type, price: null, success: false };
          }
          const price = await fetcher(skinName, paintIndex);
          return { name: market.name, url: market.url, type: market.type, price, success: price !== null };
        } catch {
          return { name: market.name, url: market.url, type: market.type, price: null, success: false };
        }
      })
    );

    const results = priceResults
      .map((p: any) => p.status === "fulfilled" ? p.value : { name: "Unknown", price: null, success: false, url: "" })
      .sort((a: any, b: any) => {
        if (a.price && b.price) return a.price - b.price;
        if (a.price) return -1;
        if (b.price) return 1;
        return a.name.localeCompare(b.name);
      });

    priceCache.set(cacheKey, { timestamp: Date.now(), prices: results });

    return NextResponse.json({ 
      success: true,
      skinName,
      paintIndex,
      markets: results,
      source: "individual-apis"
    });

  } catch (err) {
    return NextResponse.json({ markets: [], error: "Failed to fetch prices" }, { status: 500 });
  }
}