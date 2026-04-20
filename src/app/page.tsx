"use client";

import { useMemo, useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import dayjs, { Dayjs } from "dayjs";
import { LanguageProvider, useLanguage, langLabels, Lang } from "@/lib/i18n";

// ---------- KONFIGURACJA ----------
// Markets loaded from API, fallback defaults
interface MarketOption {
  name: string;
  sellFee: number;
  buyFee: number;
  url: string;
  info: string;
  type: "p2p" | "swap" | "bot" | "onlybuy";
}

const defaultMarkets: MarketOption[] = [
  { name: "Buff163", sellFee: 0.025, buyFee: 0, url: "https://buff.163.com", info: "Największy rynek CS2 w Chinach.", type: "p2p" },
  { name: "CSFloat", sellFee: 0.02, buyFee: 0, url: "https://csfloat.com", info: "Popularny rynek z inspektorem.", type: "p2p" },
  { name: "DMarket", sellFee: 0.10, buyFee: 0, url: "https://dmarket.com", info: "Popularny rynek z wieloma grami.", type: "bot" },
];

let markets: MarketOption[] = defaultMarkets;

const weapons: Record<string, string[]> = {
  Pistol: ["Desert Eagle","Glock-18","P250","USP-S","Five-SeveN","CZ75-Auto","R8 Revolver","Tec-9"],
  Rifle: ["AK-47","M4A4","M4A1-S","FAMAS","Galil AR","AUG","SG 553"],
  SMG: ["MP9","MP7","MAC-10","UMP-45","P90","PP-Bizon"],
  Heavy: ["Nova","XM1014","Sawed-Off","MAG-7","M249","Negev"],
  Sniper: ["AWP","SSG 08","G3SG1","SCAR-20"],
  Knife: ["Karambit","Butterfly Knife","M9 Bayonet","Bayonet","Flip Knife","Gut Knife","Huntsman Knife","Shadow Daggers","Talon Knife","Ursus Knife","Navaja Knife","Stiletto Knife","Paracord Knife","Skeleton Knife"],
  Gloves: ["Driver Gloves","Sport Gloves","Specialist Gloves","Hand Wraps"]
};

const wears = [
  { label: "Factory New", short: "FN" },
  { label: "Minimal Wear", short: "MW" },
  { label: "Field-Tested", short: "FT" },
  { label: "Well-Worn", short: "WW" },
  { label: "Battle-Scarred", short: "BS" }
];

const otherTypes = ["Container","Patch","Collectible","Sticker","Charm","Agent"];
const allWeaponModels = Object.values(weapons).flat();

// ---------- DOPPLER PHASES ----------
const dopplerPhases = [
  { label: "Phase 1", color: "#a855f7" },
  { label: "Phase 2", color: "#ec4899" },
  { label: "Phase 3", color: "#3b82f6" },
  { label: "Phase 4", color: "#6366f1" },
  { label: "Ruby", color: "#ef4444" },
  { label: "Sapphire", color: "#2563eb" },
  { label: "Black Pearl", color: "#8b5cf6" },
];
const gammaDopplerPhases = [
  { label: "Phase 1", color: "#22c55e" },
  { label: "Phase 2", color: "#16a34a" },
  { label: "Phase 3", color: "#15803d" },
  { label: "Phase 4", color: "#166534" },
  { label: "Emerald", color: "#00ff7f" },
];

const getDopplerPhaseInfo = (name: string, phaseLabel: string): { color: string } | null => {
  const lower = name.toLowerCase();
  if (!lower.includes("doppler")) return null;
  const isGamma = lower.includes("gamma");
  const list = isGamma ? gammaDopplerPhases : dopplerPhases;
  const found = list.find(p => p.label === phaseLabel);
  return found ? { color: found.color } : null;
};

// ---------- PATTERN → PHASE MAPPING ----------
const gammaEmeraldPatterns = [6,12,16,17,22,33,37,47,52,73,76,92,94,100,113,152,154,191,210,212,227,242,268,276,282,285,288,293,302,324,336,361,362,391,392,408,416,424,430,433,442,446,452,455,456,458,487,500,505,509,513,534,538,564,581,586,587,612,687,698,719,762,782,790,811,815,860,863,875,878,887,898,910,911,915,953,960,961,979];

function detectGammaDopplerPhase(pattern: number): string | null {
  if (gammaEmeraldPatterns.includes(pattern)) return "Emerald";
  if (pattern < 160) return "Phase 1";
  if (pattern < 360) return "Phase 2";
  if (pattern < 560) return "Phase 3";
  return "Phase 4";
}

function detectDopplerPhase(pattern: number): string | null {
  // Regular Doppler phases (approximate ranges)
  const rubyPatterns = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100];
  const sapphirePatterns = [101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,144,145,146,147,148,149,150,151,152,153,154,155,156,157,158,159,160,161,162,163,164,165,166,167,168,169,170,171,172,173,174,175,176,177,178,179,180,181,182,183,184,185,186,187,188,189,190,191,192,193,194,195,196,197,198,199,200];
  const blackPearlPatterns = [201,202,203,204,205,206,207,208,209,210,211,212,213,214,215,216,217,218,219,220,221,222,223,224,225,226,227,228,229,230,231,232,233,234,235,236,237,238,239,240,241,242,243,244,245,246,247,248,249,250,251,252,253,254,255,256,257,258,259,260,261,262,263,264,265,266,267,268,269,270,271,272,273,274,275,276,277,278,279,280,281,282,283,284,285,286,287,288,289,290,291,292,293,294,295,296,297,298,299,300];
  if (rubyPatterns.includes(pattern)) return "Ruby";
  if (sapphirePatterns.includes(pattern)) return "Sapphire";
  if (blackPearlPatterns.includes(pattern)) return "Black Pearl";
  if (pattern < 250) return "Phase 1";
  if (pattern < 500) return "Phase 2";
  if (pattern < 750) return "Phase 3";
  return "Phase 4";
}

function detectPhaseFromPattern(name: string, pattern: number): string | null {
  const lower = name.toLowerCase();
  if (!lower.includes("doppler")) return null;
  if (lower.includes("gamma")) return detectGammaDopplerPhase(pattern);
  return detectDopplerPhase(pattern);
}

// ---------- TYPY ----------
interface Item {
  name: string;
  type: string;
  weaponCategory: string;
  weaponModel: string;
  wear: string;
  rarity: string;
  isST: boolean;
  isSouvenir: boolean;
  buyPlace: string;
  buy: number;
  sellPlace: string;
  sell: number;
  status: string;
  tradeBanDate: string | null;
  image: string;
  pattern?: string;
  dopplerPhase?: string;
  chTier?: string;
}

interface ItemWithCalc extends Item {
  netBuy: number;
  netSell: number;
  profit: number;
  roi: number;
  tradeBanEnd: Dayjs | null;
}

interface BuffSuggestion {
  name: string;
  iconUrl: string;
  rarity: string;
  rarityColor: string;
  dopplerPhase?: string | null;
}

// ---------- SKINS DATABASE AUTOCOMPLETE ----------
async function fetchBuffSuggestions(query: string): Promise<BuffSuggestion[]> {
  try {
    const res = await fetch(
      `/api/skins-db?q=${encodeURIComponent(query)}`
    );
    if (!res.ok) return [];
    const json = await res.json() as { suggestions: BuffSuggestion[] };
    return json.suggestions ?? [];
  } catch {
    return [];
  }
}

// ---------- KOMPONENT GŁÓWNY ----------
export default function App() {
  return (
    <LanguageProvider>
      <AppInner />
    </LanguageProvider>
  );
}

function AppInner() {
  const { t, lang, setLang } = useLanguage();
  const [user, setUser] = useState<{ id: number; username: string; avatar?: string } | null>(null);
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [loginMode, setLoginMode] = useState<"login" | "register">("login");
  const [rememberMe, setRememberMe] = useState(false);
  const [deleteConfirmIndex, setDeleteConfirmIndex] = useState<number | null>(null);
  const [soldConfirmIndex, setSoldConfirmIndex] = useState<number | null>(null);
  const [sellMode, setSellMode] = useState<Record<string, "price" | "roi">>({});
  const [roiInputs, setRoiInputs] = useState<Record<string, string>>({});
  const [showImport, setShowImport] = useState(false);
  const [showMarkets, setShowMarkets] = useState(false);
  const [importLink, setImportLink] = useState("");
  const [importing, setImporting] = useState(false);
  const [importPreview, setImportPreview] = useState<{ name: string; image: string; rarity: string; wear: string; isST: boolean; isSouvenir: boolean; tradable: boolean; marketable: boolean }[]>([]);
  const [showProfile, setShowProfile] = useState(false);
  const [history, setHistory] = useState<{ date: string; action: string; name: string; snapshot?: string | null }[]>([]);
  const [cumulativeStats, setCumulativeStats] = useState({ totalItemsAdded: 0, totalInvested: 0, totalProfitSold: 0, totalSold: 0 });
  const [showFullHistory, setShowFullHistory] = useState(false);
  const [historyDetail, setHistoryDetail] = useState<Item | null>(null);

  const [data, setData] = useState<Item[]>([]);
  const [gridCols, setGridCols] = useState<3 | 4 | 5>(4);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("tbAsc");
  const [typeFilter, setTypeFilter] = useState("All Items");
  const [weaponCategoryFilter, setWeaponCategoryFilter] = useState("");
  const [weaponModelFilter, setWeaponModelFilter] = useState("");
  const [stFilter, setSTFilter] = useState(false);
  const [souvenirFilter, setSouvenirFilter] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [searchResults, setSearchResults] = useState<BuffSuggestion[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [customTradeBanDays, setCustomTradeBanDays] = useState(7);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingTB, setEditingTB] = useState<number | null>(null);
  const [showMoreMarkets, setShowMoreMarkets] = useState<Record<number, boolean>>({});
  const [tempTBDays, setTempTBDays] = useState(7);
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    if (!value.trim()) {
      setSearchResults([]);
      return;
    }
    setSearchLoading(true);
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(async () => {
      const suggestions = await fetchBuffSuggestions(value);
      setSearchResults(suggestions.slice(0, 8));
      setSearchLoading(false);
    }, 300);
  };

  const [showFilters, setShowFilters] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [now, setNow] = useState(dayjs());
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);

  // Tutorial on first visit
  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem("hasSeenTutorial");
    if (!hasSeenTutorial) {
      setTimeout(() => setShowTutorial(true), 1000);
    }
  }, []);

  const completeTutorial = () => {
    setShowTutorial(false);
    localStorage.setItem("hasSeenTutorial", "true");
  };

  const tutorialSteps = [
    { title: t.welcomeTitle, content: t.welcomeContent },
    { title: t.addingSkinsTitle, content: t.addingSkinsContent },
    { title: t.searchTitle, content: t.searchContent },
    { title: t.fillPricesTitle, content: t.fillPricesContent },
    { title: t.readyTitle, content: t.readyContent }
  ];

  // ---------- STAN FORMULARZA DODAWANIA ----------
  // Krok 1: wybór modelu broni (opcjonalnie)
  const [formCategory, setFormCategory] = useState("");
  const [formModel, setFormModel] = useState("");
  // Krok 2: wpisanie nazwy skina z podpowiedziami
  const [formSkinQuery, setFormSkinQuery] = useState("");
  const [skinSuggestions, setSkinSuggestions] = useState<BuffSuggestion[]>([]);
  const [skinSelectedIndex, setSkinSelectedIndex] = useState(0);
  const [skinLoading, setSkinLoading] = useState(false);
  const [selectedSkin, setSelectedSkin] = useState<BuffSuggestion | null>(null);
  // Krok 3: wear, ST, souvenir, ceny, status
  const [formWear, setFormWear] = useState("FN");
  const [formIsST, setFormIsST] = useState(false);
  const [formIsSouvenir, setFormIsSouvenir] = useState(false);
  const [formBuyPlace, setFormBuyPlace] = useState("Buff163");
  const [formBuy, setFormBuy] = useState<number>(0);
  const [formSellPlace, setFormSellPlace] = useState("Buff163");
  const [formSell, setFormSell] = useState<number>(0);
  const [formStatus, setFormStatus] = useState("Kupione");
  const [formPattern, setFormPattern] = useState("");
  const [formDopplerPhase, setFormDopplerPhase] = useState("");
  const [formChTier, setFormChTier] = useState("");

  // Markets from API
  const [availableMarkets, setAvailableMarkets] = useState<MarketOption[]>([]);

  // model suggestions (lokalne, gdy nie wybrano jeszcze skina)
  const [modelSuggestions, setModelSuggestions] = useState<string[]>([]);
  const [modelSelectedIndex, setModelSelectedIndex] = useState(0);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Fetch markets from API
  useEffect(() => {
    fetch("/api/markets")
      .then(res => res.json())
      .then(data => {
        const apiMarkets = (data.markets || []) as MarketOption[];
        if (apiMarkets.length > 0) {
          setAvailableMarkets(apiMarkets);
        }
      })
      .catch(() => {});
  }, []);

  // ---------- AUTO-LOGIN Z SESSION ----------
  useEffect(() => {
    // Check for Steam session cookie
    const cookies = document.cookie.split(";");
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split("=");
      if (name === "steam_session" && value) {
        try {
          const userData = JSON.parse(decodeURIComponent(value)) as { id: number; username: string; avatar?: string };
          setUser(userData);
          localStorage.setItem("session", JSON.stringify(userData));
          loadUserData(userData.id);
          document.cookie = "steam_session=; path=/; max-age=0";
          return;
        } catch { /* skip */ }
      }
    }

    // Check for Steam callback session in URL hash
    const hash = window.location.hash;
    if (hash.startsWith("#steam=")) {
      try {
        const encoded = hash.replace("#steam=", "");
        const sessionJson = atob(encoded);
        const userData = JSON.parse(sessionJson) as { id: number; username: string; avatar?: string };
        setUser(userData);
        localStorage.setItem("session", JSON.stringify(userData));
        loadUserData(userData.id);
        window.history.replaceState({}, "", window.location.pathname);
        return;
      } catch { /* skip */ }
    }

    // Check for Steam callback session in URL query param
    const urlParams = new URLSearchParams(window.location.search);
    const sessionParam = urlParams.get("session");
    if (sessionParam) {
      try {
        const sessionJson = Buffer.from(sessionParam, "base64").toString("utf-8");
        const userData = JSON.parse(sessionJson) as { id: number; username: string; avatar?: string };
        setUser(userData);
        localStorage.setItem("session", JSON.stringify(userData));
        loadUserData(userData.id);
        window.history.replaceState({}, "", window.location.pathname);
        return;
      } catch { /* skip */ }
    }

    const session = localStorage.getItem("session");
    if (session) {
      try {
        const userData = JSON.parse(session) as { id: number; username: string; avatar?: string };
        setUser(userData);
        loadUserData(userData.id);
        return;
      } catch { /* skip */ }
    }
    const remembered = localStorage.getItem("rememberedUser");
    if (remembered) {
      setUsernameInput(remembered);
      setRememberMe(true);
    }
  }, []);

  // ---------- ŁADOWANIE / ZAPISYWANIE DANYCH ----------
  const loadUserData = async (userId: number) => {
    try {
      const itemsRes = await fetch(`/api/items?userId=${userId}`);
      const itemsJson = await itemsRes.json() as { items: Item[] };
      setData(itemsJson.items || []);

      const historyRes = await fetch(`/api/history?userId=${userId}`);
      const historyJson = await historyRes.json() as { history: { date: string; action: string; name: string; snapshot?: string | null }[] };
      setHistory(historyJson.history || []);

      const statsRes = await fetch(`/api/stats?userId=${userId}`);
      const statsJson = await statsRes.json() as { stats?: { totalItemsAdded: number; totalInvested: number; totalProfitSold: number; totalSold: number }; error?: string };
      setCumulativeStats(statsJson.stats || { totalItemsAdded: 0, totalInvested: 0, totalProfitSold: 0, totalSold: 0 });
    } catch {
      setData([]);
      setHistory([]);
    }
  };

  const addHistory = async (action: string, name: string, snapshot?: Item) => {
    if (!user) return;
    const snapshotStr = snapshot ? JSON.stringify(snapshot) : null;
    const entry = { date: new Date().toISOString(), action, name, snapshot: snapshotStr };
    setHistory(prev => [entry, ...prev].slice(0, 500));
    try {
      await fetch("/api/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, name, action, snapshot: snapshotStr }),
      });
    } catch { /* skip */ }
  };

  const importInventory = async () => {
    if (!importLink.trim()) return;
    setImporting(true);
    setImportPreview([]);

    // Extract Steam ID from trade link, profile URL, or direct ID
    let steamId = "";
    const input = importLink.trim();
    if (/^\d{17}$/.test(input)) {
      steamId = input;
    } else {
      const profileMatch = input.match(/steamcommunity\.com\/profiles\/(\d{17})/);
      if (profileMatch) {
        steamId = profileMatch[1];
      } else {
        const tradeMatch = input.match(/steamcommunity\.com\/tradeoffer\/new\/?\?partner=(\d+)/);
        if (tradeMatch) {
          steamId = (parseInt(tradeMatch[1], 10) + 76561197960265728).toString();
        } else {
          const customMatch = input.match(/steamcommunity\.com\/id\/([a-zA-Z0-9_-]+)/);
          if (customMatch) {
            try {
              const resolveRes = await fetch(`https://steamcommunity.com/id/${customMatch[1]}?xml=1`);
              const xmlText = await resolveRes.text();
              const steamId64Match = xmlText.match(/<steamID64>(.+?)<\/steamID64>/);
              if (steamId64Match) steamId = steamId64Match[1];
            } catch { /* skip */ }
          }
        }
      }
    }

    if (!steamId) {
      alert("Invalid input. Use trade link, profile URL, or Steam ID.");
      setImporting(false);
      return;
    }

    try {
      const res = await fetch(`/api/steam-inventory?steamId=${steamId}`);
      const data = await res.json();

      const inventoryData = data.contents || data;
      if (!inventoryData.descriptions?.length) {
        alert(data.error || "Could not fetch inventory. Profile may be private or Steam is blocking the request.");
        return;
      }

      interface SteamInventoryResponse {
        assets?: { classid: string; instanceid: string }[];
        descriptions?: { classid: string; instanceid: string; market_hash_name: string; icon_url: string; type: string; tradable: number; marketable: number; tags?: { category: string; name: string }[] }[];
      }

      const descMap = new Map<string, typeof inventoryData.descriptions[0]>();
      for (const desc of inventoryData.descriptions) {
        descMap.set(`${desc.classid}_${desc.instanceid}`, desc);
      }

      const wearMap: Record<string, string> = { "Factory New": "FN", "Minimal Wear": "MW", "Field-Tested": "FT", "Well-Worn": "WW", "Battle-Scarred": "BS" };
      const items: { name: string; image: string; rarity: string; wear: string; isST: boolean; isSouvenir: boolean; tradable: boolean; marketable: boolean }[] = [];
      const seen = new Set<string>();

      for (const asset of (inventoryData.assets || [])) {
        const desc = descMap.get(`${asset.classid}_${asset.instanceid}`);
        if (!desc || seen.has(desc.market_hash_name)) continue;
        seen.add(desc.market_hash_name);

        const tags = desc.tags || [];
        const rarityTag = tags.find((t: { category: string; name: string }) => t.category === "Rarity");
        const exteriorTag = tags.find((t: { category: string; name: string }) => t.category === "Exterior");
        const rarity = rarityTag?.name || "";
        const exterior = exteriorTag?.name || "";

        items.push({
          name: desc.market_hash_name,
          image: `https://steamcdn-a.akamaihd.net/apps/730/icons/${desc.icon_url}`,
          rarity,
          wear: wearMap[exterior] || "",
          isST: desc.market_hash_name.includes("StatTrak"),
          isSouvenir: desc.market_hash_name.includes("Souvenir"),
          tradable: desc.tradable === 1,
          marketable: desc.marketable === 1,
        });
      }

      if (!items.length) {
        alert("No items found.");
        return;
      }

      setImportPreview(items);
    } catch (err) {
      alert(`Error: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setImporting(false);
    }
  };

  const confirmImport = async () => {
    const newItems: Item[] = [];
    for (const steamItem of importPreview) {
      if (data.some(d => d.name === steamItem.name)) continue;
      newItems.push({
        name: steamItem.name,
        type: "Weapon",
        weaponCategory: "",
        weaponModel: "",
        wear: steamItem.wear,
        rarity: steamItem.rarity || "Unknown",
        isST: steamItem.isST,
        isSouvenir: steamItem.isSouvenir,
        buyPlace: "Steam",
        buy: 0,
        sellPlace: "Steam",
        sell: 0,
        status: "Wolne",
        tradeBanDate: steamItem.tradable ? null : (() => {
  const now = dayjs();
  // Correct calculation:
  // Current UTC time: 14:11
  // Target: 9:00 PL = 7:00 UTC next day
  // Hours left: (24 - 14) + 7 = 17 hours
  const hoursToTarget = (24 - now.hour()) + 7;
  return now.add(hoursToTarget, "hour").add(customTradeBanDays - 1, "day").minute(0).second(0).toISOString();
})(),
        image: steamItem.image || "/placeholder.png",
      });
    }
    if (newItems.length === 0) {
      alert("All items already in inventory");
      return;
    }
    for (const item of newItems) {
      if (user) {
        await fetch("/api/items", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id, ...item }),
        }).catch(() => {});
      }
    }
    setData(prev => [...newItems, ...prev]);
    addHistory(`Imported ${newItems.length} from Steam`, "Import");
    setImportPreview([]);
    setShowImport(false);
    alert(`Imported ${newItems.length} items`);
  };

  const migrateRarityFromDb = async (items: Item[]) => {
    const updated = [...items];
    let changed = false;

    for (let idx = 0; idx < updated.length; idx++) {
      const item = updated[idx];
      try {
        const res = await fetch(`/api/skins-db?q=${encodeURIComponent(item.name)}`);
        if (!res.ok) continue;
        const json = await res.json() as { suggestions: BuffSuggestion[] };
        if (!json.suggestions?.length) continue;
        // Try exact match first, then prefix match, then use first result
        const match = json.suggestions.find(s => s.name === item.name)
          || json.suggestions.find(s => s.name.startsWith(item.name + " (") || item.name.startsWith(s.name.replace(/ \(.+\)$/, "")))
          || json.suggestions[0];
        if (match && (match.rarity !== item.rarity || match.iconUrl !== item.image || match.dopplerPhase !== item.dopplerPhase)) {
          updated[idx] = { ...item, rarity: match.rarity, image: match.iconUrl || item.image, dopplerPhase: match.dopplerPhase || item.dopplerPhase };
          changed = true;
        }
      } catch { /* skip */ }
    }
    if (changed) setData(updated);
  };

  // No sync useEffect needed - CRUD operations call API directly

  // ---------- LIVE COUNTDOWN + AUTO-TRANSITION ----------
  useEffect(() => {
    const interval = setInterval(() => {
      const current = dayjs();
      setNow(current);

      // auto-transition: Kupione → Wolne when TB ends
      setData(prev => {
        let changed = false;
        const updated = prev.map(item => {
          if (item.status === "Kupione" && item.tradeBanDate) {
            const tbEnd = getTradeBanEnd(item);
            if (tbEnd && current.isAfter(tbEnd)) {
              changed = true;
              return { ...item, status: "Wolne" };
            }
          }
          return item;
        });
        return changed ? updated : prev;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // ---------- DELETE ITEM ----------
  const findDataIndex = (item: ItemWithCalc): number => {
    return data.findIndex(d =>
      d.name === item.name && d.buy === item.buy && d.sell === item.sell &&
      d.buyPlace === item.buyPlace && d.sellPlace === item.sellPlace &&
      d.status === item.status && d.tradeBanDate === item.tradeBanDate
    );
  };

  const deleteItem = async (item: ItemWithCalc) => {
    const idx = findDataIndex(item);
    if (idx !== -1) {
      addHistory(t.deleteItem, item.name, item);
      
      // Update stats if item was sold or had investment
      if (user && (item.status === "Sprzedane" || item.buy > 0)) {
        try {
          const profit = item.sell - item.buy;
          await fetch("/api/stats", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: user.id, field: "totalItemsAdded", amount: -1 }),
          });
          if (item.status === "Sprzedane") {
            await fetch("/api/stats", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ userId: user.id, field: "totalSold", amount: -1 }),
            });
            await fetch("/api/stats", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ userId: user.id, field: "totalInvested", amount: -item.buy }),
            });
            await fetch("/api/stats", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ userId: user.id, field: "totalProfitSold", amount: profit < 0 ? Math.abs(profit) : +profit }),
            });
          }
          const statsRes = await fetch(`/api/stats?userId=${user.id}`);
          const statsJson = await statsRes.json() as { stats?: { totalItemsAdded: number; totalInvested: number; totalProfitSold: number; totalSold: number } };
          if (statsJson.stats) setCumulativeStats(statsJson.stats);
        } catch { /* skip */ }
      }
      
      setData(prev => prev.filter((_, i) => i !== idx));
      if (user) {
        try {
          await fetch(`/api/items?name=${encodeURIComponent(item.name)}&userId=${user.id}`, { method: "DELETE" });
        } catch { /* skip */ }
      }
    }
  };

  // ---------- CHANGE ITEM STATUS ----------
  const changeItemStatus = async (item: ItemWithCalc, newStatus: string) => {
    const idx = findDataIndex(item);
    if (idx === -1) return;
    addHistory(`${item.status} → ${newStatus}`, item.name, { ...item, status: newStatus });
    setData(prev => prev.map((it, i) => {
      if (i !== idx) return it;
      return { ...it, status: newStatus };
    }));
    // Update on server
    if (user) {
      try {
        await fetch("/api/items", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: item.name, userId: user.id, status: newStatus }),
        });
        // Track cumulative stats when sold
        if (newStatus === "Sprzedane") {
          const profit = item.netSell - item.netBuy;
          await fetch("/api/stats", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: user.id, field: "totalProfitSold", amount: profit }),
          });
          await fetch("/api/stats", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: user.id, field: "totalSold", amount: 1 }),
          });
          setCumulativeStats(prev => ({ ...prev, totalProfitSold: prev.totalProfitSold + profit, totalSold: prev.totalSold + 1 }));
          
          // ✅ DODAJ PRZEDMIOT DO HISTORII PRZY ZMIANIE STATUSU NA SPRZEDANE!
          addHistory("Sprzedane", item.name, item);
        }
      } catch { /* skip */ }
    }
  };

  // ---------- RESET FORMULARZA ----------
  const resetForm = useCallback(() => {
    setFormCategory("");
    setFormModel("");
    setFormSkinQuery("");
    setSkinSuggestions([]);
    setSkinSelectedIndex(0);
    setSelectedSkin(null);
    setFormWear("FN");
    setFormIsST(false);
    setFormIsSouvenir(false);
    setFormBuyPlace("Buff163");
    setFormBuy(0);
    setFormSellPlace("Buff163");
    setFormSell(0);
    setFormStatus("Kupione");
    setFormPattern("");
    setFormDopplerPhase("");
    setFormChTier("");
    setModelSuggestions([]);
    setModelSelectedIndex(0);
    setEditingIndex(null);
  }, []);

  // ---------- LOGOWANIE / REJESTRACJA ----------
  const [authError, setAuthError] = useState("");

  const handleAuth = async () => {
    setAuthError("");
    if (!usernameInput || !passwordInput) {
      setAuthError(t.enterCredentials);
      return;
    }
    try {
      const endpoint = loginMode === "register" ? "/api/auth/register" : "/api/auth/login";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: usernameInput, password: passwordInput }),
      });

      const json = await res.json() as { id?: number; username?: string; error?: string };

      if (!res.ok || json.error) {
        if (loginMode === "register") {
          setAuthError(json.error === "User already exists" ? t.userExists : (t.loginError + (json.error || "")));
        } else {
          setAuthError(t.invalidCredentials);
        }
        return;
      }

      if (rememberMe) {
        localStorage.setItem("rememberedUser", usernameInput);
      } else {
        localStorage.removeItem("rememberedUser");
      }

      const userData = { id: json.id!, username: json.username! };
      setUser(userData);
      localStorage.setItem("session", JSON.stringify(userData));
      loadUserData(userData.id);
    } catch (err) {
      setAuthError(t.loginError + (err instanceof Error ? err.message : "nieznany"));
    }
  };

  // ---------- FUNKCJE APLIKACJI ----------
  const detectType = (name: string): { type: string; weaponCategory: string; weaponModel: string } => {
    for (const [cat, models] of Object.entries(weapons)) {
      for (const model of models) {
        if (name.toLowerCase().includes(model.toLowerCase())) {
          return {
            type: cat === "Gloves" ? "Gloves" : "Weapon",
            weaponCategory: cat === "Gloves" ? "Gloves" : cat,
            weaponModel: model
          };
        }
      }
    }
    for (const t of otherTypes) {
      if (name.toLowerCase().includes(t.toLowerCase())) {
        return { type: t, weaponCategory: "", weaponModel: "" };
      }
    }
    return { type: "Other", weaponCategory: "", weaponModel: "" };
  };

  const detectRarity = (name: string, weaponCategory: string): string => {
    const lower = name.toLowerCase();
    if (weaponCategory === "Gloves") return "Covert";
    if (weaponCategory === "Knife") return "Covert";
    if (!lower.includes("|")) return "Consumer";
    if (otherTypes.some(t => lower.includes(t.toLowerCase()))) return "Contraband";
    if (lower.includes("souvenir")) return "Mil-Spec";
    if (weaponCategory === "Rifle" || weaponCategory === "Sniper") return "Restricted";
    if (weaponCategory === "Pistol" || weaponCategory === "SMG" || weaponCategory === "Heavy") return "Mil-Spec";
    return "Mil-Spec";
  };

  const getTradeBanEnd = (item: Item): Dayjs | null => {
    if (!item.tradeBanDate) return null;
    // tradeBanDate already contains the calculated end date (7 days + hours to 9AM)
    return dayjs(item.tradeBanDate);
  };

  const getColorROI = (roi: number): string => {
    if (roi >= 25) return "text-yellow-400";
    if (roi >= 20) return "text-red-400";
    if (roi >= 15) return "text-pink-400";
    if (roi >= 10) return "text-purple-400";
    if (roi >= 5) return "text-blue-400";
    return "text-gray-400";
  };

  const getCountdown = (tbEnd: Dayjs | null): string => {
    if (!tbEnd) return "";
    const diff = tbEnd.diff(now, "second");
    if (diff <= 0) return "00:00:00";
    const days = Math.floor(diff / 86400);
    const hours = Math.floor((diff % 86400) / 3600);
    const minutes = Math.floor((diff % 3600) / 60);
    const seconds = diff % 60;
    const pad = (n: number) => n.toString().padStart(2, "0");
    if (days > 0) return `${days}d ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    if (hours > 0) return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    return `${pad(minutes)}:${pad(seconds)}`;
  };

  // ---------- PODPOWIEDZI MODELU (lokalne) ----------
  const updateModelSuggestions = (value: string) => {
    if (!value) { setModelSuggestions([]); return; }
    const filtered = allWeaponModels
      .filter(m => m.toLowerCase().includes(value.toLowerCase()))
      .slice(0, 6);
    setModelSuggestions(filtered);
    setModelSelectedIndex(0);
  };

  // ---------- PODPOWIEDZI SKINA (z bazy danych) ----------
  const fetchSkinSuggestions = useCallback((query: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query || query.length < 1) { setSkinSuggestions([]); return; }
    setSkinLoading(true);
    debounceRef.current = setTimeout(async () => {
      const results = await fetchBuffSuggestions(query);
      setSkinSuggestions(results);
      setSkinSelectedIndex(0);
      setSkinLoading(false);
    }, 200);
  }, []);

  // gdy wybrano model broni, prefill query
  useEffect(() => {
    if (formModel && !selectedSkin) {
      const prefix = formIsST ? `StatTrak™ ${formModel}` : formModel;
      setFormSkinQuery(prefix + " ");
      fetchSkinSuggestions(prefix + " ");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formModel, formIsST]);

  const handleSkinQueryChange = (value: string) => {
    setFormSkinQuery(value);
    setSelectedSkin(null);
    updateModelSuggestions(value);
    fetchSkinSuggestions(value);

    // auto-detect ST / Souvenir z wpisywanej nazwy
    if (value.includes("StatTrak")) setFormIsST(true);
    if (value.includes("Souvenir")) setFormIsSouvenir(true);

    // auto-detect wear z wpisywanej nazwy
    const wearMap: Record<string, string> = {
      "Factory New": "FN", "Minimal Wear": "MW",
      "Field-Tested": "FT", "Well-Worn": "WW", "Battle-Scarred": "BS"
    };
    for (const [full, short] of Object.entries(wearMap)) {
      if (value.includes(full)) { setFormWear(short); break; }
    }

    // auto-detect kategorię i model broni
    const det = detectType(value);
    if (det.weaponCategory) setFormCategory(det.weaponCategory);
    if (det.weaponModel) setFormModel(det.weaponModel);
  };

  const selectSkin = (s: BuffSuggestion) => {
    setSelectedSkin(s);
    setFormSkinQuery(s.name);
    setSkinSuggestions([]);
    setModelSuggestions([]);

    // auto-detect ST / Souvenir z nazwy
    if (s.name.includes("StatTrak")) setFormIsST(true);
    if (s.name.includes("Souvenir")) setFormIsSouvenir(true);

    // auto-detect wear z nazwy
    const wearMap: Record<string, string> = {
      "Factory New": "FN", "Minimal Wear": "MW",
      "Field-Tested": "FT", "Well-Worn": "WW", "Battle-Scarred": "BS"
    };
    for (const [full, short] of Object.entries(wearMap)) {
      if (s.name.includes(full)) { setFormWear(short); break; }
    }

    // auto-detect model z nazwy
    const det = detectType(s.name);
    if (det.weaponCategory) setFormCategory(det.weaponCategory);
    if (det.weaponModel) setFormModel(det.weaponModel);

    // auto-detect doppler phase from database
    if (s.dopplerPhase) setFormDopplerPhase(s.dopplerPhase);
  };

  const handleSkinKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const list = skinSuggestions.length > 0 ? skinSuggestions : [];
    if (e.key === "ArrowDown") { e.preventDefault(); setSkinSelectedIndex(prev => Math.min(prev + 1, list.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setSkinSelectedIndex(prev => Math.max(prev - 1, 0)); }
    else if (e.key === "Enter" && list[skinSelectedIndex]) { selectSkin(list[skinSelectedIndex]); }
    else if (e.key === "Escape") { setSkinSuggestions([]); setModelSuggestions([]); }
  };

  // model-only suggestions keyboard
  const handleModelQueryKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (modelSuggestions.length === 0) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setModelSelectedIndex(prev => Math.min(prev + 1, modelSuggestions.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setModelSelectedIndex(prev => Math.max(prev - 1, 0)); }
    else if (e.key === "Enter" && modelSuggestions[modelSelectedIndex]) {
      const m = modelSuggestions[modelSelectedIndex];
      setFormModel(m);
      const prefix = formIsST ? `StatTrak™ ${m}` : m;
      setFormSkinQuery(prefix + " ");
      setModelSuggestions([]);
    }
  };

  // ---------- PEŁNA NAZWA SKINA ----------
  const buildFullName = (): string => {
    if (selectedSkin) return selectedSkin.name;
    return formSkinQuery.trim();
  };

  // ---------- LIVE ROI PREVIEW ----------
  // Helper to get all markets (API + defaults, with deduplication by name)
  const allMarkets = useMemo(() => {
    const map = new Map<string, MarketOption>();
    defaultMarkets.forEach(m => map.set(m.name, m));
    availableMarkets.forEach(m => map.set(m.name, m));
    return Array.from(map.values());
  }, [availableMarkets]);

  const liveRoi = useMemo(() => {
    if (formBuy <= 0 || formSell <= 0) return null;
    const sellFee = allMarkets.find(m => m.name === formSellPlace)?.sellFee || 0;
    const netBuy = formBuy;
    const netSell = formSell * (1 - sellFee);
    const profit = netSell - netBuy;
    const roi = (profit / formBuy) * 100;
    return { profit, roi };
  }, [formBuy, formSell, formBuyPlace, formSellPlace, allMarkets]);

  // ---------- DODAWANIE PRZEDMIOTU ----------
  const lookupRarityFromDb = async (name: string): Promise<{ rarity: string; iconUrl: string; dopplerPhase?: string | null } | null> => {
    try {
      const res = await fetch(`/api/skins-db?q=${encodeURIComponent(name)}`);
      if (!res.ok) return null;
      const json = await res.json() as { suggestions: BuffSuggestion[] };
      if (!json.suggestions?.length) return null;
      const match = json.suggestions.find(s => s.name === name)
        || json.suggestions.find(s => s.name.startsWith(name + " (") || name.startsWith(s.name.replace(/ \(.+\)$/, "")))
        || json.suggestions[0];
      if (match) return { rarity: match.rarity, iconUrl: match.iconUrl, dopplerPhase: match.dopplerPhase };
    } catch { /* ignore */ }
    return null;
  };

  const handleAddItem = async () => {
    const fullName = buildFullName();
    if (!fullName || formBuy <= 0 || formSell <= 0) {
      alert(t.fillRequired);
      return;
    }

    const detection = detectType(fullName);

    // Get rarity: from selected skin, or lookup from database
    let rarity = selectedSkin?.rarity;
    let iconUrl = selectedSkin?.iconUrl;
    let dopplerPhase = selectedSkin?.dopplerPhase || formDopplerPhase || undefined;
    if (!rarity) {
      const lookup = await lookupRarityFromDb(fullName);
      if (lookup) {
        rarity = lookup.rarity;
        iconUrl = iconUrl || lookup.iconUrl;
        dopplerPhase = dopplerPhase || lookup.dopplerPhase || undefined;
      } else {
        rarity = detectRarity(fullName, detection.weaponCategory);
      }
    }

    let tradeBan: string | null;
    if (formStatus === "Wystawiony") {
      tradeBan = null;
    } else {
      const now = dayjs();
      // Automatycznie obliczamy 7 dni + godziny do 9:00
      let hoursTo9: number;
      if (now.hour() < 9) {
        hoursTo9 = 9 - now.hour();
      } else {
        hoursTo9 = 24 - now.hour() + 9;
      }
      // 7 dni + godziny do 9:00
      tradeBan = now.add(7, "day").add(hoursTo9, "hour").toISOString();
    }
    const item: Item = {
      name: fullName,
      ...detection,
      rarity,
      wear: formWear,
      isST: formIsST,
      isSouvenir: formIsSouvenir,
      buyPlace: formBuyPlace,
      buy: formBuy,
      sellPlace: formSellPlace,
      sell: formSell,
      status: formStatus,
      tradeBanDate: tradeBan,
      image: iconUrl || "/placeholder.png",
      pattern: formPattern || undefined,
      dopplerPhase: dopplerPhase,
      chTier: formChTier || undefined
    };

    // Save to server
    if (user) {
      try {
        await fetch("/api/items", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id, ...item }),
        });
        // Update cumulative stats
        const buyFee = markets.find(m => m.name === item.buyPlace)?.buyFee || 0;
        const netBuy = item.buy * (1 + buyFee);
        await fetch("/api/stats", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id, field: "totalItemsAdded", amount: 1 }),
        });
        await fetch("/api/stats", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id, field: "totalInvested", amount: netBuy }),
        });
        setCumulativeStats(prev => ({ ...prev, totalItemsAdded: prev.totalItemsAdded + 1, totalInvested: prev.totalInvested + netBuy }));
      } catch { /* skip */ }
    }

    if (editingIndex !== null) {
      setData(prev => prev.map((it, idx) => idx === editingIndex ? item : it));
      addHistory("Updated", fullName, item);
    } else {
      setData(prev => [item, ...prev]);
      addHistory("Added", fullName, item);
    }
    resetForm();
    setShowAdd(false);
    setEditingIndex(null);
  };

  // ---------- FILTRY I SORTOWANIE ----------
  const statusOrder = (status: string): number => {
    switch (status) {
      case "Wystawiony": return 1;
      case "Kupione": return 2;
      case "Wolne": return 3;
      case "Sprzedane": return 4;
      default: return 5;
    }
  };

  const filteredData = useMemo((): ItemWithCalc[] => {
    return data
      .filter(d => {
        if (search) {
          const q = search.toLowerCase();
          const match = d.name.toLowerCase().includes(q)
            || d.weaponCategory.toLowerCase().includes(q)
            || d.weaponModel.toLowerCase().includes(q)
            || d.buyPlace.toLowerCase().includes(q)
            || d.sellPlace.toLowerCase().includes(q)
            || d.status.toLowerCase().includes(q)
            || d.type.toLowerCase().includes(q)
            || d.wear.toLowerCase().includes(q)
            || String(d.buy).includes(q)
            || String(d.sell).includes(q);
          if (!match) return false;
        }
        if (typeFilter !== "All Items" && typeFilter && d.type !== typeFilter) return false;
        if (typeFilter === "Weapon" && weaponCategoryFilter && d.weaponCategory !== weaponCategoryFilter) return false;
        if (weaponCategoryFilter && weaponModelFilter && d.weaponModel !== weaponModelFilter) return false;
        if (stFilter && !d.isST) return false;
        if (souvenirFilter && !d.isSouvenir) return false;
        if (statusFilter && d.status.toLowerCase() !== statusFilter.toLowerCase()) return false;
        return true;
      })
      .map(d => {
        const sellFee = allMarkets.find(m => m.name === d.sellPlace)?.sellFee || 0;
        const netBuy = d.buy;
        const netSell = d.sell * (1 - sellFee);
        const profit = netSell - netBuy;
        const roi = (profit / netBuy) * 100;
        return { ...d, netBuy, netSell, profit, roi, tradeBanEnd: getTradeBanEnd(d) };
      })
        .sort((a, b) => {
          // DIRECT SORTING FOR PRICE / ROI
          if (sort === "priceAsc") return a.buy - b.buy;
          if (sort === "priceDesc") return b.buy - a.buy;
          if (sort === "roiAsc") return a.roi - b.roi;
          if (sort === "roiDesc") return b.roi - a.roi;

          // DIRECT SORTING FOR TB
          if (sort === "tbDesc") {
            // TB DESC: NEWEST expiring first (largest number of hours remaining)
            const aActive = a.tradeBanEnd && a.tradeBanEnd.isAfter(dayjs());
            const bActive = b.tradeBanEnd && b.tradeBanEnd.isAfter(dayjs());
            if (!aActive && !bActive) return statusOrder(a.status) - statusOrder(b.status);
            if (!aActive) return 1;
            if (!bActive) return -1;
            return b.tradeBanEnd!.diff(a.tradeBanEnd!);
            return a.tradeBanEnd!.diff(b.tradeBanEnd!);
          }
          if (sort === "tbAsc") {
            // TB ASC: OLDEST expiring first (smallest number of hours remaining)
            const aActive = a.tradeBanEnd && a.tradeBanEnd.isAfter(dayjs());
            const bActive = b.tradeBanEnd && b.tradeBanEnd.isAfter(dayjs());
            if (!aActive && !bActive) return statusOrder(a.status) - statusOrder(b.status);
            if (!aActive) return 1;
            if (!bActive) return -1;
            return a.tradeBanEnd!.diff(b.tradeBanEnd!);
            return b.tradeBanEnd!.diff(a.tradeBanEnd!);
          }
          const aHasActiveTB = a.tradeBanEnd && a.tradeBanEnd.isAfter(now);
          const bHasActiveTB = b.tradeBanEnd && b.tradeBanEnd.isAfter(now);
          
          if (aHasActiveTB && !bHasActiveTB) return -1;
          if (!aHasActiveTB && bHasActiveTB) return 1;
          
          if (aHasActiveTB && bHasActiveTB && a.tradeBanEnd && b.tradeBanEnd) {
            return a.tradeBanEnd.diff(b.tradeBanEnd);
          }

          return statusOrder(a.status) - statusOrder(b.status);
      });
  }, [data, search, typeFilter, weaponCategoryFilter, weaponModelFilter, stFilter, souvenirFilter, statusFilter, sort]);

  // ---------- STATS ----------
  const stats = useMemo(() => {
    const totalItems = data.length;
    let totalInvested = 0;
    let soldInvested = 0;
    let totalProfit = 0;
    let allProfit = 0;
    let targetProfit = 0;
    data.forEach(d => {
      const buyFee = allMarkets.find(m => m.name === d.buyPlace)?.buyFee || 0;
      const sellFee = allMarkets.find(m => m.name === d.sellPlace)?.sellFee || 0;
      const netBuy = d.buy * (1 + buyFee);
      const netSell = d.sell * (1 - sellFee);
      totalInvested += netBuy;
      allProfit += netSell - netBuy;
      if (d.status === "Sprzedane") {
        totalProfit += netSell - netBuy;
        soldInvested += netBuy;
      } else if (d.status === "Kupione" || d.status === "Wolne" || d.status === "Wystawiony") {
        targetProfit += netSell - netBuy;
      }
    });
    const avgRoi = soldInvested > 0 ? (totalProfit / soldInvested) * 100 : 0;
    const allRoi = totalInvested > 0 ? (allProfit / totalInvested) * 100 : 0;
    return { totalItems, totalInvested, totalProfit, targetProfit, avgRoi, allRoi };
  }, [data]);

  const getWearColor = (wear: string): string => {
    const w = wear.toLowerCase();
    if (w.includes("factory new") || w === "fn") return "#22c55e";
    if (w.includes("minimal wear") || w === "mw") return "#4ade80";
    if (w.includes("field-tested") || w === "ft") return "#fbbf24";
    if (w.includes("well-worn") || w === "ww") return "#f97316";
    if (w.includes("battle-scarred") || w === "bs") return "#ef4444";
    return "var(--text-secondary)";
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "kupione": return "badge-kupione";
      case "wolne": return "badge-wolne";
      case "wystawiony": return "badge-wystawiony";
      case "sprzedane": return "badge-sprzedane";
      default: return "badge-kupione";
    }
  };

  const rarityColors: Record<string, string> = {
    Consumer: "#b0b0b0", Industrial: "#5e98d9", "Mil-Spec": "#4b69ff",
    Restricted: "#8947ff", Classified: "#d32e82", Covert: "#eb4b4b", Contraband: "#e4ae38"
  };

  const getRarityCol = (rarity: string): string => rarityColors[rarity] || "#b0b0b0";

  // ---------- RENDER: LOGIN ----------
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4" style={{ background: "var(--bg-primary)" }}>
        <div className="w-full max-w-sm animate-fade-in">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4" style={{ background: "linear-gradient(135deg, #06b6d422, #3b82f622)", border: "1px solid var(--border-color)" }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                <line x1="12" y1="22.08" x2="12" y2="12"/>
              </svg>
            </div>
            <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Skin Tracker</h1>
            <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>Track your CS2 investments</p>
          </div>

          {/* Card */}
          <div className="rounded-xl p-6" style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)" }}>
            <h2 className="text-lg font-semibold mb-5" style={{ color: "var(--text-primary)" }}>
              {loginMode === "login" ? t.login : t.createAccount}
            </h2>

            <div className="flex flex-col gap-3 mb-4">
              <input
                className="input-dark"
                placeholder={t.username}
                value={usernameInput}
                onChange={e => setUsernameInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") handleAuth(); }}
              />
              <input
                type="password"
                className="input-dark"
                placeholder={t.password}
                value={passwordInput}
                onChange={e => setPasswordInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") handleAuth(); }}
              />
            </div>

            <label className="flex items-center gap-2 mb-4 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded cursor-pointer"
              />
              <span className="text-sm" style={{ color: "var(--text-muted)" }}>{t.rememberMe}</span>
            </label>

            {authError && (
              <div className="flex items-center gap-2 text-sm mb-4 px-3 py-2 rounded-lg" style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)", color: "#f87171" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                {authError}
              </div>
            )}

            <button type="button" className="btn-primary w-full mb-4" onClick={handleAuth}>
              {loginMode === "login" ? t.signIn : t.register}
            </button>

            <div className="text-center">
              <button
                type="button"
                className="text-sm transition-colors cursor-pointer"
                style={{ color: "var(--text-muted)", background: "none", border: "none" }}
                onMouseEnter={e => (e.target as HTMLButtonElement).style.color = "var(--accent)"}
                onMouseLeave={e => (e.target as HTMLButtonElement).style.color = "var(--text-muted)"}
                onClick={() => { setLoginMode(loginMode === "login" ? "register" : "login"); setAuthError(""); }}
              >
                {loginMode === "login" ? t.noAccount : t.hasAccount}
              </button>

              {/* Steam login */}
              <div className="flex items-center gap-3 mt-4">
                <div className="flex-1 h-px" style={{ background: "var(--border-color)" }} />
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>{t.or}</span>
                <div className="flex-1 h-px" style={{ background: "var(--border-color)" }} />
              </div>
              <a
                href="/api/auth/steam"
                className="flex items-center justify-center gap-2 w-full mt-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "var(--text-primary)" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489l1.077-3.407A5.947 5.947 0 0 1 8.5 15c0-3.314 2.686-6 6-6s6 2.686 6 6-2.686 6-6 6c-.924 0-1.8-.213-2.579-.598l-1.077 3.407C12.691 21.928 14.281 22 16 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"/>
                </svg>
                {t.steamLogin}
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const showSuggestions = skinSuggestions.length > 0 || (modelSuggestions.length > 0 && !selectedSkin);

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
      {/* HEADER */}
      <header className="sticky top-0 z-40 glass" style={{ borderBottom: "1px solid var(--border-color)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg" style={{ background: "linear-gradient(135deg, #06b6d433, #0891b233)", border: "1px solid rgba(6,182,212,0.2)" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                <line x1="12" y1="22.08" x2="12" y2="12"/>
              </svg>
            </div>
            <h1 className="text-base font-bold leading-tight" style={{ color: "var(--text-primary)" }}>Track your CS2 investments</h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Stats mini */}
            <div className="hidden md:flex items-center gap-5 text-sm">
              <div className="text-right">
                <div className="text-xs" style={{ color: "var(--text-muted)" }}>{t.items}</div>
                <div className="font-semibold" style={{ color: "var(--text-primary)" }}>{stats.totalItems}</div>
              </div>
              <div className="text-right">
                <div className="text-xs" style={{ color: "var(--text-muted)" }}>{t.invested}</div>
                <div className="font-semibold" style={{ color: "var(--text-primary)" }}>${stats.totalInvested.toFixed(0)}</div>
              </div>
              <div className="text-right">
                <div className="text-xs" style={{ color: "var(--text-muted)" }}>{t.profit}</div>
                <div className={`font-semibold ${stats.totalProfit >= 0 ? "" : ""}`} style={{ color: stats.totalProfit >= 0 ? "#4ade80" : "#f87171" }}>
                  {stats.totalProfit >= 0 ? "+" : ""}${stats.totalProfit.toFixed(2)}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs" style={{ color: "var(--text-muted)" }}>{t.targetProfit}</div>
                <div className="font-semibold" style={{ color: stats.targetProfit >= 0 ? "#38bdf8" : "#f87171" }}>
                  {stats.targetProfit >= 0 ? "+" : ""}${stats.targetProfit.toFixed(2)}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs" style={{ color: "var(--text-muted)" }}>ROI</div>
                <div className={`font-semibold ${getColorROI(stats.avgRoi)}`}>{stats.avgRoi.toFixed(1)}% <span style={{ color: "var(--text-muted)" }}>({stats.allRoi.toFixed(1)}%)</span></div>
              </div>
            </div>

            {/* User */}
<div className="flex items-center gap-2">
            <Link
              href="/market-info"
              className="btn-secondary flex items-center gap-1.5"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
              <span className="hidden sm:inline">{t.marketInfo}</span>
            </Link>
            <a
              href="https://steamcommunity.com/tradeoffer/new/?partner=264795144&token=Loc8zqB8"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary flex items-center gap-1.5"
              title="Support Developer"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              <span className="hidden sm:inline">Support</span>
            </a>
            <a
              href="mailto:csskintracker@gmail.com?subject=Feedback"
              className="btn-secondary flex items-center gap-1.5"
              title="Feedback"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              <span className="hidden sm:inline">Feedback</span>
            </a>
              <button
                type="button"
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all hover:ring-2 hover:ring-cyan-500/50 cursor-pointer"
                style={{ background: "linear-gradient(135deg, #06b6d4, #0891b2)", color: "#000" }}
                onClick={() => setShowProfile(true)}
                title={t.profile}
              >
                {user.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.avatar} alt={user.username} className="w-full h-full rounded-full object-cover" />
                ) : (
                  user.username.charAt(0).toUpperCase()
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* MOBILE STATS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 md:hidden">
          <div className="rounded-lg p-3" style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)" }}>
            <div className="text-xs" style={{ color: "var(--text-muted)" }}>{t.items}</div>
            <div className="text-lg font-bold mt-0.5" style={{ color: "var(--text-primary)" }}>{stats.totalItems}</div>
          </div>
          <div className="rounded-lg p-3" style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)" }}>
            <div className="text-xs" style={{ color: "var(--text-muted)" }}>{t.invested}</div>
            <div className="text-lg font-bold mt-0.5" style={{ color: "var(--text-primary)" }}>${stats.totalInvested.toFixed(0)}</div>
          </div>
          <div className="rounded-lg p-3" style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)" }}>
            <div className="text-xs" style={{ color: "var(--text-muted)" }}>{t.profit}</div>
            <div className="text-lg font-bold mt-0.5" style={{ color: stats.totalProfit >= 0 ? "#4ade80" : "#f87171" }}>
              {stats.totalProfit >= 0 ? "+" : ""}${stats.totalProfit.toFixed(2)}
            </div>
          </div>
          <div className="rounded-lg p-3" style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)" }}>
            <div className="text-xs" style={{ color: "var(--text-muted)" }}>{t.targetProfit}</div>
            <div className="text-lg font-bold mt-0.5" style={{ color: stats.targetProfit >= 0 ? "#38bdf8" : "#f87171" }}>
              {stats.targetProfit >= 0 ? "+" : ""}${stats.targetProfit.toFixed(2)}
            </div>
          </div>
          <div className="rounded-lg p-3" style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)" }}>
            <div className="text-xs" style={{ color: "var(--text-muted)" }}>ROI</div>
            <div className={`text-lg font-bold mt-0.5 ${getColorROI(stats.avgRoi)}`}>{stats.avgRoi.toFixed(1)}% <span className="text-xs font-normal" style={{ color: "var(--text-muted)" }}>({stats.allRoi.toFixed(1)}%)</span></div>
          </div>
        </div>

        {/* TOOLBAR */}
        <div className="rounded-xl mb-6" style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)" }}>
          {/* Search row - always visible */}
          <div className="flex items-center gap-2 p-3">
            <div className="relative flex-1">
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#71717a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                className="input-dark pr-9"
                placeholder={t.searchPlaceholder}
                value={search}
                onChange={e => handleSearchChange(e.target.value)}
              />
              {searchLoading && (
                <span className="absolute right-10 top-1/2 -translate-y-1/2">
                  <span className="inline-block w-3 h-3 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "var(--accent)", borderTopColor: "transparent" }} />
                </span>
              )}
              {search && !searchLoading && (
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded"
                  style={{ color: "var(--text-muted)" }}
                  onClick={() => { setSearch(""); setSearchResults([]); }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              )}
              {searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 z-30 mt-1 max-h-64 overflow-auto rounded-lg shadow-2xl" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-color)" }}>
                  {searchResults.map((s, idx) => (
                    <div
                      key={s.name}
                      className="flex items-center gap-2.5 px-3 py-2 cursor-pointer text-sm transition-colors"
                      style={{ background: "transparent" }}
                      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = "var(--border-color)"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = "transparent"; }}
                      onClick={() => { setSearch(s.name); setSearchResults([]); }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={s.iconUrl} alt="" className="w-8 h-6 object-contain flex-shrink-0 rounded" />
                      <span style={{ color: "var(--text-primary)" }}>{s.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              className={`btn-secondary flex items-center gap-1.5 relative ${showFilters ? "!border-cyan-500/40 !text-cyan-400" : ""}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
              </svg>
              <span className="hidden sm:inline">{t.filters}</span>
              {(typeFilter !== "All Items" || statusFilter || stFilter || souvenirFilter || weaponCategoryFilter) && (
                <span className="w-2 h-2 rounded-full" style={{ background: "var(--accent)" }} />
              )}
            </button>

            <button type="button" className="btn-primary flex items-center gap-1.5" onClick={() => { setShowAdd(!showAdd); if (showAdd) resetForm(); }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              <span className="hidden sm:inline">{showAdd ? t.close : t.add}</span>
            </button>



            <div className="flex rounded-lg overflow-hidden flex-shrink-0" style={{ border: "1px solid var(--border-color)" }}>
              {([3, 4, 5] as const).map(n => (
                <button
                  key={n}
                  type="button"
                  className="text-xs px-2 py-1 font-medium transition-all"
                  style={{
                    background: gridCols === n ? "rgba(6,182,212,0.15)" : "transparent",
                    color: gridCols === n ? "#06b6d4" : "var(--text-muted)"
                  }}
                  onClick={() => setGridCols(n)}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Collapsible filters */}
          {showFilters && (
            <div className="px-3 pb-3 pt-0 animate-slide-down" style={{ borderTop: "1px solid var(--border-color)" }}>
              <div className="flex flex-wrap items-center gap-2 pt-3">
                <select className="input-dark select-dark w-auto min-w-[120px]" value={typeFilter} onChange={e => {
                  setTypeFilter(e.target.value);
                  setWeaponCategoryFilter("");
                  setWeaponModelFilter("");
                }}>
                  {["All Items","Weapon","Gloves","Container","Patch","Collectible","Sticker","Charm","Agent","Other"].map(ty => (
                    <option key={ty} value={ty}>{ty}</option>
                  ))}
                </select>

                {typeFilter === "Weapon" && (
                  <select className="input-dark select-dark w-auto min-w-[120px]" value={weaponCategoryFilter} onChange={e => {
                    setWeaponCategoryFilter(e.target.value);
                    setWeaponModelFilter("");
                  }}>
                    <option value="">{t.category}</option>
                    {Object.keys(weapons).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                )}

                {weaponCategoryFilter && (
                  <select className="input-dark select-dark w-auto min-w-[120px]" value={weaponModelFilter} onChange={e => setWeaponModelFilter(e.target.value)}>
                    <option value="">{t.model}</option>
                    {(weapons[weaponCategoryFilter] ?? []).map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                )}

                <select className="input-dark select-dark w-auto min-w-[120px]" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                  <option value="">{t.status}</option>
                  <option value="Kupione">{t.kupione}</option>
                  <option value="Wolne">{t.wolne}</option>
                  <option value="Wystawiony">{t.wystawiony}</option>
                  <option value="Sprzedane">{t.sprzedane}</option>
                </select>

                <select className="input-dark select-dark w-auto min-w-[100px]" value={sort} onChange={e => setSort(e.target.value)}>
                  <option value="tbDesc">{t.sortByTBDesc}</option>
                  <option value="tbAsc">{t.sortByTBAsc}</option>
                  <option value="priceDesc">{t.priceDesc}</option>
                  <option value="priceAsc">{t.priceAsc}</option>
                  <option value="roiDesc">ROI ↓</option>
                  <option value="roiAsc">ROI ↑</option>
                </select>

                <button type="button" className={`pill-toggle ${stFilter ? "active" : ""}`} onClick={() => setSTFilter(!stFilter)}>
                  StatTrak™
                </button>
                <button type="button" className={`pill-toggle ${souvenirFilter ? "active" : ""}`} onClick={() => setSouvenirFilter(!souvenirFilter)}>
                  Souvenir
                </button>

                {/* Reset filters */}
                {(typeFilter !== "All Items" || statusFilter || stFilter || souvenirFilter || weaponCategoryFilter || weaponModelFilter || sort !== "tbDesc") && (
                  <button
                    type="button"
                    className="text-xs px-2 py-1 rounded transition-colors"
                    style={{ color: "#f87171", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}
                    onClick={() => {
                      setTypeFilter("All Items");
                      setWeaponCategoryFilter("");
                      setWeaponModelFilter("");
                      setStatusFilter("");
                      setSTFilter(false);
                      setSouvenirFilter(false);
                      setSort("tbDesc");
                    }}
                  >{t.reset}</button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* PANEL DODAWANIA */}
        {showAdd && (
          <div className="rounded-xl p-5 mb-6 animate-slide-down relative" style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)" }}>
            {/* Step indicators */}
            <div className="flex items-center gap-2 mb-5">
              {[1, 2].map(step => (
                <div key={step} className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{
                    background: "var(--bg-elevated)",
                    border: "1px solid var(--border-color)",
                    color: "var(--text-muted)"
                  }}>{step}</div>
                  <span className="text-xs hidden sm:inline" style={{ color: "var(--text-muted)" }}>
                    {step === 1 ? "Skin" : t.details}
                  </span>
                  {step < 2 && <div className="w-8 h-px" style={{ background: "var(--border-color)" }} />}
                </div>
              ))}
            </div>

            {/* KROK 1: Nazwa skina + ST/Souvenir */}
            <div className="mb-4">
              <p className="text-xs mb-2 font-medium uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>{t.skinName}</p>
              <div className="relative" ref={suggestionsRef}>
                <div className="flex gap-2 items-center">
                  <input
                    className={`input-dark flex-1 ${selectedSkin ? "!border-green-500 !shadow-[0_0_0_2px_rgba(34,197,94,0.15)]" : ""}`}
                    placeholder={formModel ? `${t.searchSkin.split("(")[0].trim()} ${formModel}…` : t.searchSkin}
                    value={formSkinQuery}
                    onChange={e => handleSkinQueryChange(e.target.value)}
                    onKeyDown={e => { handleSkinKeyDown(e); handleModelQueryKeyDown(e); }}
                    autoComplete="off"
                  />
                  {skinLoading && (
                    <span className="text-xs whitespace-nowrap flex items-center gap-1" style={{ color: "var(--text-muted)" }}>
                      <span className="inline-block w-3 h-3 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "var(--accent)", borderTopColor: "transparent" }} />
                      {t.searching}
                    </span>
                  )}
                  {selectedSkin && (
                    <button
                      type="button"
                      className="text-xs whitespace-nowrap px-2 py-1 rounded transition-colors"
                      style={{ color: "#f87171", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}
                      onClick={() => { setSelectedSkin(null); setFormSkinQuery(""); }}
                    >{t.clear}</button>
                  )}
                </div>

                {/* Skin suggestions from database */}
                {skinSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 z-30 max-h-64 overflow-auto rounded-b-lg shadow-2xl" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-color)", borderTop: "none" }}>
                    {skinSuggestions.map((s, idx) => (
                      <div
                        key={s.name}
                        className="flex items-center gap-2.5 px-3 py-2 cursor-pointer text-sm transition-colors"
                        style={{ background: idx === skinSelectedIndex ? "var(--border-color)" : "transparent" }}
                        onMouseEnter={e => { setSkinSelectedIndex(idx); (e.currentTarget as HTMLDivElement).style.background = "var(--border-color)"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = "transparent"; }}
                        onClick={() => selectSkin(s)}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={s.iconUrl} alt="" className="w-10 h-8 object-contain flex-shrink-0 rounded" />
                        <span style={{ color: "var(--text-primary)" }}>
                          {s.name}
                          {s.dopplerPhase && (() => {
                            const info = getDopplerPhaseInfo(s.name, s.dopplerPhase);
                            const col = info?.color || "#a855f7";
                            return <span className="ml-1 text-xs font-semibold" style={{ color: col }}>({s.dopplerPhase})</span>;
                          })()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Model suggestions */}
                {modelSuggestions.length > 0 && skinSuggestions.length === 0 && !selectedSkin && (
                  <div className="absolute top-full left-0 right-0 z-30 max-h-48 overflow-auto rounded-b-lg shadow-2xl" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-color)", borderTop: "none" }}>
                    <div className="px-3 pt-2 pb-1 text-xs font-medium" style={{ color: "var(--text-muted)" }}>{t.weaponModels}</div>
                    {modelSuggestions.map((m, idx) => (
                      <div
                        key={m}
                        className="px-3 py-2 cursor-pointer text-sm transition-colors"
                        style={{ background: idx === modelSelectedIndex ? "var(--border-color)" : "transparent", color: "var(--text-primary)" }}
                        onMouseEnter={e => { setModelSelectedIndex(idx); (e.currentTarget as HTMLDivElement).style.background = "var(--border-color)"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = "transparent"; }}
                        onClick={() => {
                          setFormModel(m);
                          const prefix = formIsST ? `StatTrak™ ${m}` : m;
                          setFormSkinQuery(prefix + " ");
                          setModelSuggestions([]);
                          fetchSkinSuggestions(prefix + " ");
                        }}
                      >{m}</div>
                    ))}
                  </div>
                )}
              </div>

              {/* Selected skin preview */}
              {selectedSkin && (
                <div className="mt-3 flex items-center gap-3 rounded-lg p-3 animate-fade-in" style={{ background: "rgba(34,197,94,0.05)", border: "1px solid rgba(34,197,94,0.2)" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={selectedSkin.iconUrl} alt={selectedSkin.name} className="h-12 object-contain rounded" />
                  <div>
                    <div className="text-xs font-semibold flex items-center gap-1" style={{ color: "#4ade80" }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                      {t.found}
                    </div>
                    <div className="text-sm mt-0.5" style={{ color: "var(--text-primary)" }}>{selectedSkin.name}</div>
                  </div>
                </div>
              )}

              {/* ST / Souvenir pills */}
            </div>

            {/* KROK 2: Szczegóły transakcji */}
            <div className="mb-4">
              <p className="text-xs mb-2 font-medium uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>{t.details}</p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs" style={{ color: "var(--text-muted)" }}>{t.status}</label>
                  <select className="input-dark select-dark" value={formStatus} onChange={e => setFormStatus(e.target.value)}>
                    <option value="Kupione">{t.kupione}</option>
                    <option value="Wolne">{t.wolne}</option>
                    <option value="Wystawiony">{t.wystawiony}</option>
                    <option value="Sprzedane">{t.sprzedane}</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs" style={{ color: "var(--text-muted)" }}>{t.buyMarket}</label>
                  <select className="input-dark select-dark" value={formBuyPlace} onChange={e => setFormBuyPlace(e.target.value)}>
                    {allMarkets.filter(m => m.type === "p2p" || m.type === "bot" || m.type === "onlybuy").map(m => <option key={m.name} value={m.name}>{m.name}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs" style={{ color: "var(--text-muted)" }}>{t.buyPrice}</label>
                  <input type="number" min={0} step="0.01" className="input-dark" value={formBuy || ""} placeholder="0.00" onChange={e => setFormBuy(Number(e.target.value))} />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs" style={{ color: "var(--text-muted)" }}>{t.sellMarket}</label>
                  <select className="input-dark select-dark" value={formSellPlace} onChange={e => setFormSellPlace(e.target.value)}>
                    {allMarkets.filter(m => m.type === "p2p" || m.type === "bot").map(m => <option key={m.name} value={m.name}>{m.name}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs" style={{ color: "var(--text-muted)" }}>{t.sellPrice}</label>
                  <input type="number" min={0} step="0.01" className="input-dark" value={formSell || ""} placeholder="0.00" onChange={e => setFormSell(Number(e.target.value))} />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs" style={{ color: "var(--text-muted)" }}>{t.patternSeed}</label>
                  <input type="number" min={0} max={1000} className="input-dark" placeholder="np. 568" value={formPattern} onChange={e => {
                    setFormPattern(e.target.value);
                    const patternNum = Number(e.target.value);
                    if (patternNum > 0 && patternNum <= 1000) {
                      const fullName = buildFullName();
                      const detected = detectPhaseFromPattern(fullName, patternNum);
                      if (detected) setFormDopplerPhase(detected);
                      //const chDetected = detectChTier(fullName, patternNum);
                      //if (chDetected) setFormChTier(chDetected);
                    }
                  }} />
                </div>
                
                
              </div>

              {/* Live ROI preview */}
              {liveRoi && (
                <div className="mt-3 flex items-center gap-6 rounded-lg p-3 animate-fade-in" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-color)" }}>
                  <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>{t.roiPreview}</span>
                  <span className="text-sm font-semibold">ROI: <span className={getColorROI(liveRoi.roi)}>{liveRoi.roi.toFixed(1)}%</span></span>
                  <span className={`text-sm font-semibold ${liveRoi.profit >= 0 ? "" : ""}`} style={{ color: liveRoi.profit >= 0 ? "#4ade80" : "#f87171" }}>
                    {liveRoi.profit >= 0 ? "+" : ""}{liveRoi.profit.toFixed(2)} $
                  </span>
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                className="btn-primary flex-1 flex items-center justify-center gap-2"
                onClick={handleAddItem}
                disabled={!buildFullName() || formBuy <= 0 || formSell <= 0}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                {t.addItem}
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => { resetForm(); setShowAdd(false); }}
              >
                {t.cancel}
              </button>
            </div>
          </div>
        )}

        {/* SAMOUCZEK ONBOARDING */}
        {showTutorial && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in" style={{ background: "rgba(0, 0, 0, 0.75)", backdropFilter: "blur(4px)" }}>
            <div className="rounded-xl max-w-lg w-full animate-slide-up" style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)" }}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>{tutorialSteps[tutorialStep].title}</h2>
                  <span className="text-xs font-medium px-2 py-1 rounded" style={{ background: "var(--bg-elevated)", color: "var(--text-muted)" }}>
                    {tutorialStep + 1} / {tutorialSteps.length}
                  </span>
                </div>
                <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>{tutorialSteps[tutorialStep].content}</p>
                
                <div className="flex gap-2 mb-5">
                  {tutorialSteps.map((_, i) => (
                    <div key={i} className="h-1 flex-1 rounded-full" style={{
                      background: i <= tutorialStep ? "#06b6d4" : "var(--border-color)"
                    }} />
                  ))}
                </div>

                <div className="flex gap-3">
                  <button 
                    type="button" 
                    className="btn-secondary" 
                    onClick={completeTutorial}
                  >
                    {t.skip}
                  </button>
                  {tutorialStep < tutorialSteps.length - 1 ? (
                    <button 
                      type="button" 
                      className="btn-primary flex-1" 
                      onClick={() => setTutorialStep(prev => prev + 1)}
                    >
                      {t.next}
                    </button>
                  ) : (
                    <button 
                      type="button" 
                      className="btn-primary flex-1" 
                      onClick={completeTutorial}
                    >
                      {t.letsGo}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODAL POMOCY */}
        {showHelp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in" style={{ background: "rgba(0, 0, 0, 0.75)", backdropFilter: "blur(4px)" }} onClick={() => setShowHelp(false)}>
            <div className="rounded-xl max-w-2xl w-full max-h-[85vh] overflow-auto animate-slide-up" style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)" }} onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between p-5" style={{ borderBottom: "1px solid var(--border-color)" }}>
                <h2 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>{t.helpTitle}</h2>
                <button type="button" className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors" style={{ background: "var(--bg-elevated)" }} onClick={() => setShowHelp(false)}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
              <div className="p-5 space-y-4" style={{ color: "var(--text-primary)" }}>
                <div className="space-y-3">
                  <h3 className="font-semibold text-sm uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>{t.addingSkins}</h3>
                  <ul className="text-sm space-y-1.5 list-disc pl-5">
                    <li><span className="font-medium text-cyan-400">{t.clickAddItem}</span></li>
                    <li>{t.enterSkinName}</li>
                    <li>{t.fillPrices}</li>
                    <li>{t.enterSeed}</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold text-sm uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>{t.dopplerPhasesAndTiers}</h3>
                  <ul className="text-sm space-y-1.5 list-disc pl-5">
                    <li>{t.systemDetects}</li>
                    <li>{t.seedFromSteam}</li>
                    <li>{t.phaseInfo}</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold text-sm uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>{t.tradeBan}</h3>
                  <ul className="text-sm space-y-1.5 list-disc pl-5">
                    <li>{t.defaultSevenDays}</li>
                    <li>{t.counterCountsDown}</li>
                    <li>{t.whenEndsStatus}</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold text-sm uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>{t.usefulFeatures}</h3>
                  <ul className="text-sm space-y-1.5 list-disc pl-5">
                    <li><span className="font-medium text-cyan-400">{t.priceCheckButton}</span></li>
                    <li>{t.clickToEdit}</li>
                    <li>{t.useFilters}</li>
                    <li>{t.switchMode}</li>
                  </ul>
                </div>
              </div>
              <div className="p-5 flex gap-3" style={{ borderTop: "1px solid var(--border-color)" }}>
                <button type="button" className="btn-primary flex-1" onClick={() => setShowHelp(false)}>{t.iUnderstand}</button>
                <button type="button" className="btn-secondary" onClick={() => { setShowHelp(false); window.open("/INSTRUKCJE.md", "_blank"); }}>{t.fullInstructions}</button>
              </div>
            </div>
          </div>
        )}

        {/* LISTA PRZEDMIOTÓW */}
        {filteredData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)" }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#71717a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>
              </svg>
            </div>
            <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>{t.noItems}</p>
            <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{t.noItemsHint}</p>
          </div>
        ) : (
          <div className={`grid ${gridCols === 3 ? "grid-cols-1 sm:grid-cols-3 md:grid-cols-3" : gridCols === 4 ? "grid-cols-2 sm:grid-cols-4 md:grid-cols-4" : "grid-cols-2 sm:grid-cols-5 md:grid-cols-5"} gap-3`}>
            {filteredData.map((item, i) => (
              <div key={i} className={`rounded-lg overflow-hidden card-hover animate-fade-in rarity-${item.rarity || "Mil-Spec"}`} style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)" }}>
                {/* Image area */}
                <div className="relative flex items-center justify-center p-2" style={{ background: "var(--bg-secondary)", minHeight: "100px" }}>
                  {/* Rarity glow overlay */}
                  <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at top left, ${getRarityCol(item.rarity)}18, transparent 70%)` }} />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.image} alt={item.name} className="max-h-20 object-contain drop-shadow-lg relative z-[1]" />

                  {/* Delete button - always visible */}
                  <button
                    type="button"
                    className="absolute top-2 w-7 h-7 rounded-full flex items-center justify-center transition-all z-[2]"
                    style={{
                      right: "0.5rem",
                      background: deleteConfirmIndex === i ? "rgba(239,68,68,0.3)" : "rgba(239,68,68,0.1)",
                      border: `1px solid ${deleteConfirmIndex === i ? "rgba(239,68,68,0.5)" : "rgba(239,68,68,0.3)"}`,
                      color: "#f87171"
                    }}
                    onClick={() => setDeleteConfirmIndex(deleteConfirmIndex === i ? null : i)}
                    title={t.deleteItem}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
                    </svg>
                  </button>

                  {/* Delete confirmation overlay */}
                  {deleteConfirmIndex === i && (
                    <div className="absolute inset-0 z-[3] flex flex-col items-center justify-center animate-fade-in" style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(4px)" }}>
                      <p className="text-sm font-semibold mb-3" style={{ color: "#f87171" }}>{t.deleteConfirm}</p>
                      <p className="text-xs mb-4 px-4 text-center truncate max-w-full" style={{ color: "var(--text-secondary)" }}>{item.name}</p>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          className="text-xs px-4 py-1.5 rounded font-medium transition-all"
                          style={{ background: "rgba(239,68,68,0.2)", border: "1px solid rgba(239,68,68,0.4)", color: "#f87171" }}
                          onClick={() => { deleteItem(item); setDeleteConfirmIndex(null); }}
                        >
                          {t.delete}
                        </button>
                        <button
                          type="button"
                          className="text-xs px-4 py-1.5 rounded font-medium transition-all"
                          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "var(--text-secondary)" }}
                          onClick={() => setDeleteConfirmIndex(null)}
                        >
                          {t.cancel}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Status badge */}
                  <div className="absolute top-3 right-12 z-[2]" style={{ right: (item.status === "Sprzedane" && item.tradeBanEnd && now.isAfter(item.tradeBanEnd)) ? "3rem" : "2.5rem" }}>
                    <span className={`status-badge ${getStatusBadge(item.status)}`}>{item.status.toLowerCase() === "kupione" ? t.kupione : item.status.toLowerCase() === "wolne" ? t.wolne : item.status.toLowerCase() === "wystawiony" ? t.wystawiony : item.status.toLowerCase() === "sprzedane" ? t.sprzedane : item.status}</span>
                  </div>
                  {/* Tags */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1 z-[2]">
                    <div className="flex gap-1">
                      {(() => {
                        const r = item.rarity || "Unknown";
                        const col = getRarityCol(r);
                        return <span className="status-badge" style={{ background: `${col}22`, color: col, border: `1px solid ${col}55`, fontSize: "0.7rem", padding: "0.2rem 0.6rem" }}>{r}</span>;
                      })()}
                      {item.wear && <span className="status-badge" style={{ background: `${getWearColor(item.wear)}15`, color: getWearColor(item.wear), border: `1px solid ${getWearColor(item.wear)}44` }}>{item.wear}</span>}
                    </div>
                    {item.isST && <span className="status-badge" style={{ background: "rgba(249,115,22,0.15)", color: "#f97316", border: "1px solid rgba(249,115,22,0.3)", fontSize: "0.7rem", padding: "0.2rem 0.6rem", width: "fit-content" }}>{t.statTrak}</span>}
                    {item.isSouvenir && <span className="status-badge" style={{ background: "rgba(250,204,21,0.2)", color: "#eab308", border: "1px solid rgba(250,204,21,0.4)", fontSize: "0.7rem", padding: "0.2rem 0.6rem", width: "fit-content" }}>{t.souvenir}</span>}
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="text-sm font-semibold truncate flex-1" style={{ color: "var(--text-primary)" }} title={item.name}>{item.name}</h3>
                  {(() => {
                    const parts = item.name.split(" | ");
                    let weaponName = parts[0].toLowerCase().replace(/ /g, "-").replace(/™/g, "").replace(/★/g, "").replace(/-+/g, "-").replace(/^-+|-+$/g, "").replace(/[^\x00-\x7F]/g, "").trim();
                    let variantPart = (parts[1] || "field-tested").toLowerCase();
                    variantPart = variantPart.replace("(", "").replace(")", "").replace(/™/g, "").trim();
                    
                    if (weaponName.includes("\u2764") || weaponName.includes("\ufe0f")) {
                      weaponName = weaponName.replace(/\u2764/g, "").replace(/\ufe0f/g, "");
                    }
                    if (variantPart.includes("\u2764") || variantPart.includes("\ufe0f")) {
                      variantPart = variantPart.replace(/\u2764/g, "").replace(/\ufe0f/g, "");
                    }
                    
let statTrak = "";
                    if (variantPart.includes("stattrak")) {
                      statTrak = "stattrak-";
                      variantPart = variantPart.replace("stattrak", "").trim();
                    } else if (weaponName.includes("stattrak")) {
                      statTrak = "stattrak-";
                      weaponName = weaponName.replace("stattrak", "").replace(/-+/g, "-").replace(/^-+|-+$/g, "");
                    }
                    
                    let souvenir = "";
                    if (variantPart.includes("souvenir")) {
                      souvenir = "souvenir-";
                      variantPart = variantPart.replace("souvenir", "").trim();
                    } else if (weaponName.includes("souvenir")) {
                      souvenir = "souvenir-";
                      weaponName = weaponName.replace("souvenir", "").replace(/-+/g, "-").replace(/^-+|-+$/g, "");
                    }
                    
const wearTypes = ["factory-new", "field-tested", "minimal-wear", "battle-scarred", "well-worn"];
                    let wear = "field-tested";
                    let pattern = "";
                    
                    let addedNum = "";
                    const allChars = parts[1] || "";
                    if (allChars.indexOf("弐") > -1) addedNum = "2";
                    else if (allChars.indexOf("灣") > -1) addedNum = "2";
                    else if (allChars.indexOf("貳") > -1) addedNum = "2";
                    else if (allChars.indexOf("二") > -1) addedNum = "2";
                    
// Dopasuj wear - przed usunięciem nawiasów
                    const originalVariant = (parts[1] || "").toLowerCase();
                    if (originalVariant.includes("factory-new") || originalVariant.includes("factory new") || originalVariant.includes("fn")) wear = "factory-new";
                    else if (originalVariant.includes("field-tested") || originalVariant.includes("field tested") || originalVariant.includes("ft")) wear = "field-tested";
                    else if (originalVariant.includes("minimal-wear") || originalVariant.includes("minimal wear") || originalVariant.includes("mw")) wear = "minimal-wear";
                    else if (originalVariant.includes("well-worn") || originalVariant.includes("well worn") || originalVariant.includes("ww")) wear = "well-worn";
                    else if (originalVariant.includes("battle-scarred") || originalVariant.includes("battle scarred") || originalVariant.includes("bs")) wear = "battle-scarred";
                    
// Wyciągnij pattern - usuń wszystkie formy wear
                    let fullVariant = variantPart.replace(/ /g, "-");
                    fullVariant = fullVariant.replace(/-factory-new-/gi, "-").replace(/-field-tested-/gi, "-").replace(/-minimal-wear-/gi, "-").replace(/-well-worn-/gi, "-").replace(/-battle-scarred-/gi, "-");
                    fullVariant = fullVariant.replace(/factory-new/gi, "").replace(/field-tested/gi, "").replace(/minimal-wear/gi, "").replace(/well-worn/gi, "").replace(/battle-scarred/gi, "");
                    
// Wyczyść pattern - usuń non-ASCII i oczyść z podwójnych myślników
                    let variantPartClean = fullVariant.replace(/[^\x00-\x7F]/g, "").replace(/[()]/g, "").replace(/-+/g, "-").replace(/^-+|-+$/g, "");
                    
                    pattern = variantPartClean;
                    
                    const finalPattern = pattern ? (addedNum ? pattern + "-" + addedNum : pattern) : addedNum;
                    
                    const isGlove = weaponName.includes("glove") || weaponName.includes("sport");
                    const itemType = isGlove ? "glove" : "skin";

                    return (
                      <a
                        href={`https://pricempire.com/cs2-items/${itemType}/${weaponName}${finalPattern ? "-" + finalPattern : ""}?variant=${statTrak}${souvenir}${wear}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs mb-2 block hover:underline"
                        style={{ color: "#06b6d4" }}
                      >
                        {t.priceCheck}
                      </a>
                    );
                  })()}
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex-1"></div>
                    {item.status === "Wystawiony" && (
                      <div className="flex-shrink-0 flex rounded-lg overflow-hidden" style={{ border: "1px solid var(--border-color)" }}>
                        <button
                          type="button"
                          className="text-xs px-2 py-0.5 font-medium transition-all"
                          style={{
                            background: (sellMode[item.name] || "price") === "price" ? "rgba(6,182,212,0.15)" : "transparent",
                            color: (sellMode[item.name] || "price") === "price" ? "#06b6d4" : "var(--text-muted)"
                          }}
                          onClick={() => {
                            setSellMode(prev => ({ ...prev, [item.name]: "price" }));
                            if (sellMode[item.name] === "roi" && item.sell > 0) {
                              const rounded = Math.round(item.sell * 100) / 100;
                              setData(prev => prev.map(it => it.name === item.name ? { ...it, sell: rounded } : it));
                              if (user) {
                                fetch("/api/items", {
                                  method: "PUT",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({ name: item.name, userId: user.id, sell: rounded }),
                                }).catch(() => {});
                              }
                            }
                          }}
                        >Price</button>
                        <button
                          type="button"
                          className="text-xs px-2 py-0.5 font-medium transition-all"
                          style={{
                            background: sellMode[item.name] === "roi" ? "rgba(6,182,212,0.15)" : "transparent",
                            color: sellMode[item.name] === "roi" ? "#06b6d4" : "var(--text-muted)"
                          }}
                          onClick={() => setSellMode(prev => ({ ...prev, [item.name]: "roi" }))}
                        >ROI</button>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {item.pattern && (
                      <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: "rgba(255,255,255,0.06)", color: "var(--text-secondary)", border: "1px solid rgba(255,255,255,0.1)" }}>
                        #{item.pattern}
                      </span>
                    )}
                    {item.dopplerPhase && (() => {
                      const info = getDopplerPhaseInfo(item.name, item.dopplerPhase);
                      const col = info?.color || "#a855f7";
                      return <span className="text-xs px-1.5 py-0.5 rounded font-semibold" style={{ background: `${col}22`, color: col, border: `1px solid ${col}55` }}>{item.dopplerPhase}</span>;
                    })()}
                  </div>

                  {/* Buy / Sell */}
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="rounded-lg p-2.5" style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.12)" }}>
                      <div className="text-xs mb-0.5" style={{ color: "#f87171" }}>{t.buy}</div>
                      <div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>${item.buy.toFixed(2)}</div>
                      <div className="text-xs" style={{ color: "var(--text-muted)" }}>{item.buyPlace}</div>
                    </div>
                    <div className="rounded-lg p-2.5" style={{ background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.12)" }}>
                      <div className="text-xs mb-0.5" style={{ color: "#4ade80" }}>{item.status === "Kupione" ? t.targetSell : item.status === "Sprzedane" ? t.sold : item.status === "Wystawiony" && sellMode[item.name] === "roi" ? t.roi : t.sell}</div>
                      {item.status === "Wystawiony" ? (
                        <div className="flex flex-col gap-1">
                          <div className="flex gap-1">
                            <select
                              className="input-dark select-dark text-xs py-1 px-1.5"
                              style={{ fontSize: "0.7rem", minWidth: 0 }}
                              value={item.sellPlace}
                              onChange={e => {
                                const newPlace = e.target.value;
                                setData(prev => prev.map(it => it.name === item.name ? { ...it, sellPlace: newPlace } : it));
                                if (user) {
                                  fetch("/api/items", {
                                    method: "PUT",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ name: item.name, userId: user.id, sellPlace: newPlace }),
                                  }).catch(() => {});
                                }
                              }}
                            >
                              {/* Show more markets for listed items */}
                              {(item.status === "Wystawiony" ? allMarkets.filter(m => m.type === "p2p" || m.type === "bot") : markets).map(m => <option key={m.name} value={m.name}>{m.name}</option>)}
                            </select>
                          </div>
                          {sellMode[item.name] === "roi" ? (
                            <div className="flex flex-col gap-1">
                              <input
                                type="text"
                                inputMode="decimal"
                                className="input-dark text-xs py-1 px-1.5"
                                style={{ fontSize: "0.75rem" }}
                                value={roiInputs[item.name] ?? ""}
                                placeholder="np. 7.1"
                                onChange={e => {
                                  let val = e.target.value.replace(",", ".");
                                  const regex = new RegExp("^-?\\d*\\.?\\d?$");
                                  if (regex.test(val) || val === "" || val === "-") {
                                    setRoiInputs(prev => ({ ...prev, [item.name]: val }));
                                     const roi = Number(val) || 0;
                                     const sellFee = allMarkets.find(m => m.name === item.sellPlace)?.sellFee || 0;
                                     const netSell = item.buy * (1 + roi / 100);
                                     const newSell = netSell / (1 - sellFee);
                                    setData(prev => prev.map(it => it.name === item.name ? { ...it, sell: Math.max(0, newSell) } : it));
                                    if (user) {
                                      fetch("/api/items", {
                                        method: "PUT",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify({ name: item.name, userId: user.id, sell: Math.max(0, newSell) }),
                                      }).catch(() => {});
                                    }
                                  }
                                }}
                              />
                              {item.sell > 0 && (
                                <div className="text-xs font-medium" style={{ color: "#fbbf24" }}>{t.sellFor} : ${item.sell.toFixed(2)}</div>
                              )}
                            </div>
                          ) : (
                            <input
                              type="number"
                              min={0}
                              step="0.01"
                              className="input-dark text-xs py-1 px-1.5"
                              style={{ fontSize: "0.75rem" }}
                              value={item.sell || ""}
                              placeholder="0.00"
                              onChange={e => {
                                const newSell = Number(e.target.value);
                                setData(prev => prev.map(it => it.name === item.name ? { ...it, sell: newSell } : it));
                                if (user) {
                                  fetch("/api/items", {
                                    method: "PUT",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ name: item.name, userId: user.id, sell: newSell }),
                                  }).catch(() => {});
                                }
                              }}
                            />
                          )}
                        </div>
                      ) : (
                        <>
                          <div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>${item.sell.toFixed(2)}</div>
                          <div className="text-xs" style={{ color: "var(--text-muted)" }}>{item.sellPlace}</div>
                        </>
                      )}
                    </div>
                  </div>

{/* ROI / Profit */}
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <span className="text-xs" style={{ color: "var(--text-muted)" }}>ROI</span>
                        <span className={`text-sm font-bold ${getColorROI(item.roi)}`}>{item.roi.toFixed(1)}%</span>
                      </div>
                      <div className="text-sm font-bold" style={{ color: item.profit >= 0 ? "#4ade80" : "#f87171" }}>
                        {item.profit >= 0 ? "+" : ""}${item.profit.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  {/* Bottom section */}
                  <div className="mt-2 pt-2" style={{ borderTop: "1px solid var(--border-color)" }}>
                    {item.status === "Kupione" && item.tradeBanEnd && !now.isAfter(item.tradeBanEnd) && (
                      <div className="flex items-center gap-1 mb-1">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#71717a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                        </svg>
                        {editingTB === i ? (
                          <>
                            <button
                              type="button"
                              className="w-5 h-5 rounded flex items-center justify-center text-xs"
                              style={{ background: "rgba(255,255,255,0.1)", color: "var(--text-muted)" }}
                              onClick={() => {
                                const newDate = dayjs(item.tradeBanDate).subtract(1, "day").toISOString();
                                setData(prev => prev.map(it => it.name === item.name ? { ...it, tradeBanDate: newDate } : it));
                                if (user) {
                                  fetch("/api/items", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId: user.id, name: item.name, tradeBanDate: newDate }) });
                                }
                              }}
                            >-</button>
                            <span className="text-xs" style={{ color: "var(--text-muted)" }} onClick={() => setEditingTB(null)}>
                              TB: {getCountdown(item.tradeBanEnd)}
                            </span>
                            <button
                              type="button"
                              className="w-5 h-5 rounded flex items-center justify-center text-xs"
                              style={{ background: "rgba(255,255,255,0.1)", color: "var(--text-muted)" }}
                              onClick={() => {
                                const newDate = dayjs(item.tradeBanDate).add(1, "day").toISOString();
                                setData(prev => prev.map(it => it.name === item.name ? { ...it, tradeBanDate: newDate } : it));
                                if (user) {
                                  fetch("/api/items", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId: user.id, name: item.name, tradeBanDate: newDate }) });
                                }
                              }}
                            >+</button>
                          </>
                        ) : (
                          <span className="text-xs cursor-pointer" style={{ color: "#71717a" }} onClick={() => setEditingTB(i)}>TB: {getCountdown(item.tradeBanEnd)}</span>
                        )}
                      </div>
                    )}
                    {/* Wolne: action buttons */}
                    {item.status === "Wolne" && (
                      <div className="flex gap-2">
                        <button
                          type="button"
                          className="flex-1 text-xs px-2 py-1.5 rounded font-medium transition-all"
                          style={{ background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.3)", color: "#c084fc" }}
                          onClick={() => changeItemStatus(item, "Wystawiony")}
                        >
                          {t.list}
                        </button>
                        <div className="relative flex-1">
                          <button
                            type="button"
                            className="w-full text-xs px-2 py-1.5 rounded font-medium transition-all"
                            style={{ background: soldConfirmIndex === i ? "rgba(250,204,21,0.2)" : "rgba(250,204,21,0.1)", border: `1px solid ${soldConfirmIndex === i ? "rgba(250,204,21,0.5)" : "rgba(250,204,21,0.3)"}`, color: "#fbbf24" }}
                            onClick={() => setSoldConfirmIndex(soldConfirmIndex === i ? null : i)}
                          >
                            {t.sprzedane}
                          </button>
                          {soldConfirmIndex === i && (
                            <div className="absolute inset-0 z-[3] flex flex-col items-center justify-center animate-fade-in" style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(4px)", borderRadius: "0.5rem" }}>
                              <p className="text-sm font-semibold mb-3" style={{ color: "#fbbf24" }}>{t.markSold}?</p>
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  className="text-xs px-4 py-1.5 rounded font-medium transition-all"
                                  style={{ background: "rgba(250,204,21,0.2)", border: "1px solid rgba(250,204,21,0.4)", color: "#fbbf24" }}
                                  onClick={() => { changeItemStatus(item, "Sprzedane"); setSoldConfirmIndex(null); }}
                                >
                                  {t.markSold}
                                </button>
                                <button
                                  type="button"
                                  className="text-xs px-4 py-1.5 rounded font-medium transition-all"
                                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "var(--text-secondary)" }}
                                  onClick={() => setSoldConfirmIndex(null)}
                                >
                                  {t.cancel}
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Wystawiony: mark as sold */}
                    {item.status === "Wystawiony" && (
                      <div className="relative">
                        <button
                          type="button"
                          className="w-full text-xs px-2 py-1.5 rounded font-medium transition-all"
                          style={{ background: soldConfirmIndex === i ? "rgba(250,204,21,0.2)" : "rgba(250,204,21,0.1)", border: `1px solid ${soldConfirmIndex === i ? "rgba(250,204,21,0.5)" : "rgba(250,204,21,0.3)"}`, color: "#fbbf24" }}
                          onClick={() => setSoldConfirmIndex(soldConfirmIndex === i ? null : i)}
                        >
                          {t.markSold}
                        </button>
                        {soldConfirmIndex === i && (
                          <div className="absolute inset-0 z-[3] flex flex-col items-center justify-center animate-fade-in" style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(4px)", borderRadius: "0.5rem" }}>
                            <p className="text-sm font-semibold mb-3" style={{ color: "#fbbf24" }}>{t.markSold}?</p>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                className="text-xs px-4 py-1.5 rounded font-medium transition-all"
                                style={{ background: "rgba(250,204,21,0.2)", border: "1px solid rgba(250,204,21,0.4)", color: "#fbbf24" }}
                                onClick={() => { changeItemStatus(item, "Sprzedane"); setSoldConfirmIndex(null); }}
                              >
                                {t.markSold}
                              </button>
                              <button
                                type="button"
                                className="text-xs px-4 py-1.5 rounded font-medium transition-all"
                                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "var(--text-secondary)" }}
                                onClick={() => setSoldConfirmIndex(null)}
                              >
                                {t.cancel}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Sprzedane: show TB info */}
                    {item.status === "Sprzedane" && item.tradeBanEnd && !now.isAfter(item.tradeBanEnd) && (
                      <div className="flex items-center gap-1">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#71717a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                        </svg>
                        {editingTB === i ? (
                          <>
                            <button
                              type="button"
                              className="w-5 h-5 rounded flex items-center justify-center text-xs"
                              style={{ background: "rgba(255,255,255,0.1)", color: "var(--text-muted)" }}
                              onClick={() => {
                                const newDate = dayjs(item.tradeBanDate).subtract(1, "day").toISOString();
                                setData(prev => prev.map(it => it.name === item.name ? { ...it, tradeBanDate: newDate } : it));
                                if (user) {
                                  fetch("/api/items", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId: user.id, name: item.name, tradeBanDate: newDate }) });
                                }
                              }}
                            >-</button>
                            <span className="text-xs" style={{ color: "var(--text-muted)" }} onClick={() => setEditingTB(null)}>
                              TB: {getCountdown(item.tradeBanEnd)}
                            </span>
                            <button
                              type="button"
                              className="w-5 h-5 rounded flex items-center justify-center text-xs"
                              style={{ background: "rgba(255,255,255,0.1)", color: "var(--text-muted)" }}
                              onClick={() => {
                                const newDate = dayjs(item.tradeBanDate).add(1, "day").toISOString();
                                setData(prev => prev.map(it => it.name === item.name ? { ...it, tradeBanDate: newDate } : it));
                                if (user) {
                                  fetch("/api/items", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId: user.id, name: item.name, tradeBanDate: newDate }) });
                                }
                              }}
                            >+</button>
                          </>
                        ) : (
                          <span 
                            className="text-xs cursor-pointer hover:text-cyan-400" 
                            style={{ color: "var(--text-muted)" }}
                            onClick={() => setEditingTB(i)}
                          >
                            TB: {getCountdown(item.tradeBanEnd)}
                          </span>
                        )}
                      </div>
                    )}
                    {item.status === "Sprzedane" && item.tradeBanEnd && now.isAfter(item.tradeBanEnd) && (
                      <div className="flex items-center gap-1.5">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        <span className="text-xs" style={{ color: "#4ade80" }}>{t.readyToRemove}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* PROFILE PANEL */}
      {showProfile && (
        <>
          <div className="fixed inset-0 z-50" style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }} onClick={() => setShowProfile(false)} />
          <div className="fixed top-0 right-0 h-full w-full max-w-sm z-50 animate-slide-down flex flex-col" style={{ background: "var(--bg-card)", borderLeft: "1px solid var(--border-color)" }}>
            {/* Header */}
            <div className="flex items-center justify-between p-5" style={{ borderBottom: "1px solid var(--border-color)" }}>
              <h2 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>{t.profile}</h2>
              <button type="button" className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--bg-elevated)", color: "var(--text-muted)" }} onClick={() => setShowProfile(false)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            <div className="flex-1 overflow-auto p-5">
              {/* Avatar & Name */}
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold overflow-hidden" style={{ background: "linear-gradient(135deg, #06b6d4, #0891b2)", color: "#000" }}>
                  {user.avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                  ) : (
                    user.username.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="flex-1">
                  <div className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>{user.username}</div>
                  <div className="text-xs" style={{ color: "var(--text-muted)" }}>{t.localAccount}</div>
                </div>
              </div>

              {/* Stats */}
             <div className="grid grid-cols-2 gap-3">
  {/* Profit */}
  <div className="rounded-lg p-3" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-color)" }}>
    <div className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>{t.profit}</div>
    <div className="text-lg font-bold" style={{ color: cumulativeStats.totalProfitSold >= 0 ? "#4ade80" : "#f87171" }}>
      {cumulativeStats.totalProfitSold >= 0 ? "+" : ""}${cumulativeStats.totalProfitSold.toFixed(2)}
    </div>
  </div>

  {/* Sold */}
  <div className="rounded-lg p-3" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-color)" }}>
    <div className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>{t.soldCount}</div>
    <div className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>{Math.max(0, cumulativeStats.totalSold)}</div>
  </div>
</div>
              {/* Status breakdown */}
              <div className="mb-6">
                <p className="text-xs mb-3 font-medium uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>{t.itemStatus}</p>
                <div className="flex flex-col gap-2">
                  {[
                    { label: t.kupione, color: "#fbbf24", count: data.filter(d => d.status === "Kupione").length },
                    { label: t.wolne, color: "#a78bfa", count: data.filter(d => d.status === "Wolne").length },
                    { label: t.wystawiony, color: "#38bdf8", count: data.filter(d => d.status === "Wystawiony").length },
                    { label: t.sprzedane, color: "#fbbf24", count: data.filter(d => d.status === "Sprzedane").length },
                  ].map(s => (
                    <div key={s.label} className="flex items-center justify-between rounded-lg px-3 py-2" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-color)" }}>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                        <span className="text-sm" style={{ color: "var(--text-secondary)" }}>{s.label}</span>
                      </div>
                      <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{s.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* History - sold items */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>{t.history} ({history.filter(h => h.action.includes("Sprzedane")).length})</p>
                  {history.filter(h => h.action.includes("Sprzedane")).length > 3 && (
                    <button
                      type="button"
                      className="text-xs font-medium px-2 py-1 rounded transition-all"
                      style={{ color: "#06b6d4" }}
                      onClick={() => setShowFullHistory(true)}
                    >
                      {t.viewAll}
                    </button>
                  )}
                </div>
                {history.filter(h => h.action.includes("Sprzedane")).length === 0 ? (
                  <p className="text-xs py-4 text-center" style={{ color: "var(--text-muted)" }}>{t.noHistory}</p>
                ) : (
                  <div className="flex flex-col gap-1.5 max-h-64 overflow-auto">
                    {history.filter(h => h.action.includes("Sprzedane")).slice(0, 3).map((h, i) => (
                      <div key={i} className="flex items-start gap-2 rounded-lg px-3 py-2" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-color)" }}>
                        <div className="flex-shrink-0 mt-0.5">
                          <div className="w-2 h-2 rounded-full" style={{ background: "#4ade80" }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-medium truncate" style={{ color: "var(--text-primary)" }}>{h.name}</div>
                          <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                            {h.action
                              .replace(/Kupione/gi, t.kupione)
                              .replace(/Wolne/gi, t.wolne)
                              .replace(/Wystawiony/gi, t.wystawiony)
                              .replace(/Sprzedane/gi, t.sprzedane)} · {new Date(h.date).toLocaleDateString("pl-PL", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-5" style={{ borderTop: "1px solid var(--border-color)" }}>
              {/* Language selector */}
              <div className="mb-4">
                <p className="text-xs mb-2 font-medium uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Language / Język</p>
                <div className="flex gap-2">
                  {(Object.keys(langLabels) as Lang[]).map(l => (
                    <button
                      key={l}
                      type="button"
                      className="flex-1 text-xs px-3 py-2 rounded-lg font-medium transition-all"
                      style={{
                        background: lang === l ? "rgba(6,182,212,0.15)" : "var(--bg-elevated)",
                        border: `1px solid ${lang === l ? "rgba(6,182,212,0.4)" : "var(--border-color)"}`,
                        color: lang === l ? "#06b6d4" : "var(--text-secondary)"
                      }}
                      onClick={() => setLang(l)}
                    >
                      {langLabels[l]}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                className="w-full text-sm px-4 py-2.5 rounded-lg font-medium transition-all"
                style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171" }}
                onClick={() => { setUser(null); setShowProfile(false); localStorage.removeItem("session"); }}
              >
                {t.logout}
              </button>
            </div>
          </div>
        </>
      )}

      {/* MARKETS PANEL */}
      {showMarkets && (
        <>
          <div className="fixed inset-0 z-50" style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }} onClick={() => setShowMarkets(false)} />
          <div className="fixed top-0 right-0 h-full w-full max-w-sm z-50 animate-slide-down flex flex-col" style={{ background: "var(--bg-card)", borderLeft: "1px solid var(--border-color)" }}>
            {/* Header */}
            <div className="flex items-center justify-between p-5" style={{ borderBottom: "1px solid var(--border-color)" }}>
              <h2 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>Markets</h2>
              <button type="button" className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--bg-elevated)", color: "var(--text-muted)" }} onClick={() => setShowMarkets(false)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            <div className="flex-1 overflow-auto p-5">
              <div className="flex flex-col gap-3">
                {markets.map(m => (
                  <a
                    key={m.name}
                    href={m.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-lg p-4 transition-all hover:ring-2 hover:ring-cyan-500/50"
                    style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-color)" }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold" style={{ color: "var(--text-primary)" }}>{m.name}</span>
                    </div>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>{m.info}</p>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Full History Overlay */}
      {showFullHistory && (
        <div className="fixed inset-0 z-50 flex flex-col" style={{ background: "var(--bg-primary)" }}>
          <div className="flex items-center justify-between p-4" style={{ borderBottom: "1px solid var(--border-color)" }}>
            <h2 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>{t.history}</h2>
            <button
              type="button"
              className="p-2 rounded-lg transition-all"
              style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-color)", color: "var(--text-secondary)" }}
              onClick={() => { setShowFullHistory(false); setHistoryDetail(null); }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          <div className="flex-1 overflow-auto p-4">
            {historyDetail ? (
              /* Item detail card */
              <div>
                <button
                  type="button"
                  className="flex items-center gap-1 text-xs font-medium mb-4 px-2 py-1 rounded"
                  style={{ color: "#06b6d4" }}
                  onClick={() => setHistoryDetail(null)}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
                  {t.history}
                </button>
                <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)" }}>
                  <div className="flex items-center gap-3 mb-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={historyDetail.image || "/placeholder.png"} alt={historyDetail.name} className="h-16 object-contain rounded" />
                    <div>
                      <div className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{historyDetail.name}</div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="status-badge badge-sprzedane">{t.sprzedane}</span>
                        {historyDetail.rarity && <span className="text-xs" style={{ color: rarityColors[historyDetail.rarity] || "var(--text-muted)" }}>{historyDetail.rarity}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg p-2.5" style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.12)" }}>
                      <div className="text-xs mb-0.5" style={{ color: "#f87171" }}>{t.buy}</div>
                      <div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>${(historyDetail.buy || 0).toFixed(2)}</div>
                      <div className="text-xs" style={{ color: "var(--text-muted)" }}>{historyDetail.buyPlace}</div>
                    </div>
                    <div className="rounded-lg p-2.5" style={{ background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.12)" }}>
                      <div className="text-xs mb-0.5" style={{ color: "#4ade80" }}>{t.sold}</div>
                      <div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>${(historyDetail.sell || 0).toFixed(2)}</div>
                      <div className="text-xs" style={{ color: "var(--text-muted)" }}>{historyDetail.sellPlace}</div>
                    </div>
                    {(() => {
                      const sellFee = allMarkets.find(m => m.name === historyDetail.sellPlace)?.sellFee || 0;
                      const netSell = historyDetail.sell * (1 - sellFee);
                      const profit = netSell - historyDetail.buy;
                      const roi = historyDetail.buy > 0 ? (profit / historyDetail.buy) * 100 : 0;
                    
                      return (
                        <>
                          <div className="rounded-lg p-2.5" style={{ background: profit >= 0 ? "rgba(34,197,94,0.06)" : "rgba(239,68,68,0.06)", border: profit >= 0 ? "1px solid rgba(34,197,94,0.12)" : "1px solid rgba(239,68,68,0.12)" }}>
                            <div className="text-xs mb-0.5" style={{ color: profit >= 0 ? "#4ade80" : "#f87171" }}>Profit (netto)</div>
                            <div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                              {profit >= 0 ? '+' : ''}${profit.toFixed(2)}
                            </div>
                          </div>
                          <div className="rounded-lg p-2.5" style={{ background: roi >= 0 ? "rgba(34,197,94,0.06)" : "rgba(239,68,68,0.06)", border: roi >= 0 ? "1px solid rgba(34,197,94,0.12)" : "1px solid rgba(239,68,68,0.12)" }}>
                            <div className="text-xs mb-0.5" style={{ color: roi >= 0 ? "#4ade80" : "#f87171" }}>ROI (netto)</div>
                            <div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                              {roi >= 0 ? '+' : ''}{roi.toFixed(1)}%
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                  {historyDetail.dopplerPhase && (() => {
                    const info = getDopplerPhaseInfo(historyDetail.name, historyDetail.dopplerPhase);
                    const col = info?.color || "#6b7280";
                    return <div className="mt-3"><span className="text-xs px-1.5 py-0.5 rounded font-semibold" style={{ background: `${col}22`, color: col, border: `1px solid ${col}55` }}>{historyDetail.dopplerPhase}</span></div>;
                  })()}
                  {historyDetail.pattern && (
                    <div className="mt-2 text-xs" style={{ color: "var(--text-muted)" }}>{t.pattern}: {historyDetail.pattern}</div>
                  )}
                </div>
              </div>
            ) : (
              /* History list - only sold items */
              (() => {
                const soldHistory = history.filter(h => h.action.includes("Sprzedane"));
                return soldHistory.length === 0 ? (
                  <p className="text-sm py-8 text-center" style={{ color: "var(--text-muted)" }}>{t.noHistory}</p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {soldHistory.map((h, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 rounded-lg px-4 py-3 cursor-pointer transition-all"
                        style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)" }}
                        onClick={() => {
                          if (h.snapshot) {
                            try {
                              setHistoryDetail(JSON.parse(h.snapshot) as Item);
                            } catch { /* skip */ }
                          }
                        }}
                      >
                        <div className="flex-shrink-0 mt-1">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#4ade80" }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{h.name}</div>
                          <div className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                            {h.action
                              .replace(/Kupione/gi, t.kupione)
                              .replace(/Wolne/gi, t.wolne)
                              .replace(/Wystawiony/gi, t.wystawiony)
                              .replace(/Sprzedane/gi, t.sprzedane)
                            } · {new Date(h.date).toLocaleDateString(lang === "pl" ? "pl-PL" : lang === "ru" ? "ru-RU" : lang === "zh" ? "zh-CN" : "en-US", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                          </div>
                        </div>
                        {h.snapshot && (
                          <div className="flex-shrink-0 mt-1">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                );
              })()
            )}
          </div>
        </div>
      )}
    </div>
  );
}

