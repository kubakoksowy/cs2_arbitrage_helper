import { NextResponse } from "next/server";

interface Market {
  name: string;
  sellFee: number;
  buyFee: number;
  depositFee: number;
  withdrawFee: number;
  url: string;
  info: string;
  type: "p2p" | "swap" | "bot" | "onlybuy";
}

const markets: Market[] = [
  // P2P - User to User trading
  { name: "CSFloat", sellFee: 0.02, buyFee: 0, depositFee: 0.028, withdrawFee: 0.005, url: "https://csfloat.com", info: "Lowest fee 2%. Advanced float tools.", type: "p2p" },
  { name: "CSMoney", sellFee: 0.05, buyFee: 0, depositFee: 0.01, withdrawFee: 0, url: "https://cs.money/pl/market/buy", info: "P2P marketplace. 5%, 1% dep.", type: "p2p" },
  { name: "MarketCSGO", sellFee: 0.05, buyFee: 0, depositFee: 0, withdrawFee: 0, url: "https://market.csgo.com", info: "Russian market with trade. 10+ years. 5% fee.", type: "p2p" },
  { name: "Skinport", sellFee: 0.08, buyFee: 0, depositFee: 0, withdrawFee: 0, url: "https://skinport.com", info: "Bot market - instant trading. 8% fee.", type: "bot" },
  { name: "Waxpeer", sellFee: 0.06, buyFee: 0, depositFee: 0, withdrawFee: 0, url: "https://waxpeer.com", info: "P2P + instant trading. 6% fee.", type: "p2p" },
  { name: "Gamerpay", sellFee: 0.03, buyFee: 0.035, depositFee: 0, withdrawFee: 0.025, url: "https://gamerpay.gg", info: "Danish company (EU regulated). 3% sell, 3.5% buy, 2.5% withdraw.", type: "p2p" },
  { name: "WhiteMarket", sellFee: 0.05, buyFee: 0, depositFee: 0, withdrawFee: 0, url: "https://whitemarket.gg", info: "Spanish CS2 market. 5%.", type: "p2p" },
  { name: "SkinFlow", sellFee: 0.05, buyFee: 0, depositFee: 0, withdrawFee: 0, url: "https://www.skinflow.gg", info: "Skin-to-skin exchange. 5%. Rating 4.6.", type: "swap" },
  { name: "RapidSkins", sellFee: 0.05, buyFee: 0, depositFee: 0, withdrawFee: 0, url: "https://rapidskins.com/a/Azro", info: "Skin-to-skin exchange. 5%.", type: "swap" },
  { name: "Steam", sellFee: 0.15, buyFee: 0, depositFee: 0, withdrawFee: 0, url: "https://steamcommunity.com/market", info: "Official Steam market. Highest security. 15%.", type: "p2p" },
  { name: "Buff163", sellFee: 0.025, buyFee: 0, depositFee: 0, withdrawFee: 0, url: "https://buff.163.com", info: "Largest CS2 market in the world. 2M+ listings. 2.5% sell, 0% buy/withdraw.", type: "p2p" },
  { name: "BuffMarket", sellFee: 0.025, buyFee: 0.025, depositFee: 0.035, withdrawFee: 0.01, url: "https://buff.market", info: "International Buff.163 alternative. 2.5% sell, 3.5% dep, 1% withdraw.", type: "p2p" },
  { name: "YouPin898", sellFee: 0.01, buyFee: 0, depositFee: 0, withdrawFee: 0, url: "https://youpin898.com", info: "Chinese CS2 market. 1% sell. Low rating.", type: "p2p" },
  { name: "Ecosteam", sellFee: 0.05, buyFee: 0, depositFee: 0, withdrawFee: 0, url: "https://www.ecosteam.cn", info: "CS2 + Dota2. 5% sell fee.", type: "p2p" },
  { name: "HaloSkins", sellFee: 0.03, buyFee: 0, depositFee: 0.02, withdrawFee: 0.005, url: "https://haloskins.com", info: "P2P marketplace. 3% sell, 0% buy, crypto withdrawals.", type: "p2p" },

  // Swap - Skin to Skin exchange
  { name: "CS Money Bot", sellFee: 0.05, buyFee: 0, depositFee: 0, withdrawFee: 0, url: "https://cs.money", info: "Bot exchange - skin for skin. Popular in EU.", type: "swap" },
  { name: "SwapGG", sellFee: 0.035, buyFee: 0, depositFee: 0, withdrawFee: 0, url: "https://swap.gg/?ref=Azro", info: "Bot exchange - skin for skin.", type: "swap" },
  { name: "PirateSwap", sellFee: 0.05, buyFee: 0, depositFee: 0, withdrawFee: 0, url: "https://pirateswap.com/?ref=azro", info: "Bot exchange - skin for skin.", type: "swap" },
  { name: "LootFarm", sellFee: 0.03, buyFee: 0, depositFee: 0, withdrawFee: 0, url: "https://loot.farm", info: "Bot exchange - skin for skin.", type: "swap" },
  { name: "Tradeit", sellFee: 0.06, buyFee: 0, depositFee: 0, withdrawFee: 0, url: "https://tradeit.gg", info: "Bot exchange - skin for skin.", type: "swap" },
  { name: "SkinsMonkey", sellFee: 0.05, buyFee: 0, depositFee: 0, withdrawFee: 0, url: "https://skinsmonkey.com", info: "Bot exchange - skin for skin.", type: "swap" },
  { name: "iTradeGG", sellFee: 0.05, buyFee: 0, depositFee: 0, withdrawFee: 0, url: "https://itrade.gg/?ref=Azro", info: "Bot exchange - skin for skin. Rating 4.9.", type: "swap" },
  { name: "Skinswap", sellFee: 0, buyFee: 0, depositFee: 0, withdrawFee: 0, url: "https://skinswap.com/r/azro", info: "Bot exchange - skin for skin.", type: "swap" },
  { name: "CSTrade", sellFee: 0.05, buyFee: 0, depositFee: 0, withdrawFee: 0, url: "https://cs.trade", info: "Bot exchange - skin for skin.", type: "swap" },

  // Bot - Instant bot trading / Web Sell
  { name: "DMarket", sellFee: 0.10, buyFee: 0, depositFee: 0, withdrawFee: 0, url: "https://dmarket.com", info: "Bot market - 10% fee items under $5, 2% over $5.", type: "bot" },
  { name: "ShadowPay", sellFee: 0.10, buyFee: 0, depositFee: 0, withdrawFee: 0.05, url: "https://shadowpay.com", info: "P2P - web sell. 10% sell, 5% withdraw.", type: "p2p" },
  { name: "SkinBaron", sellFee: 0.15, buyFee: 0.05, depositFee: 0, withdrawFee: 0, url: "https://skinbaron.com", info: "Bot market - 15% sell, 5% buy fee. German regulation.", type: "bot" },
  { name: "Bitskins", sellFee: 0.05, buyFee: 0, depositFee: 0, withdrawFee: 0.01, url: "https://bitskins.com", info: "Bot market - since 2015. 5% sell, 1%+ withdraw.", type: "bot" },

  // Only Buy
  { name: "Skins.com", sellFee: 0, buyFee: 0, depositFee: 0, withdrawFee: 0, url: "https://skins.com", info: "Buy only - instant sell. 0% buy fees.", type: "onlybuy" },
  { name: "UUSkins", sellFee: 0, buyFee: 0, depositFee: 0.01, withdrawFee: 0, url: "https://www.uuskins.com", info: "Buy only. 1% deposit fee. Chinese market.", type: "onlybuy" },
  { name: "LisSkins", sellFee: 0, buyFee: 0, depositFee: 0, withdrawFee: 0.015, url: "https://lisskins.com", info: "Buy only. 1.5% withdraw fee.", type: "onlybuy" },
  { name: "Skinswap China", sellFee: 0, buyFee: 0.02, depositFee: 0.01, withdrawFee: 0, url: "https://skinswap.com/buy", info: "Buy only - Chinese market. 1% dep, 2% buy.", type: "onlybuy" },
];

export async function GET() {
  return NextResponse.json({ markets });
}
