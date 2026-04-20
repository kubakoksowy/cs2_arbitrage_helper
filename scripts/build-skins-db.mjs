import fs from "fs";
import https from "https";

const CSGO_API_URL = "https://raw.githubusercontent.com/ByMykel/CSGO-API/main/public/api/en/skins_not_grouped.json";
const CACHE_PATH = "/tmp/skins_raw.json";

async function downloadJson(url, path) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return downloadJson(res.headers.location, path).then(resolve).catch(reject);
      }
      const file = fs.createWriteStream(path);
      res.pipe(file);
      file.on("finish", () => { file.close(); resolve(); });
    }).on("error", reject);
  });
}

// Download if not cached
if (!fs.existsSync(CACHE_PATH)) {
  console.log("Downloading skins data from CSGO-API...");
  await downloadJson(CSGO_API_URL, CACHE_PATH);
  console.log("Downloaded.");
}

const data = JSON.parse(fs.readFileSync(CACHE_PATH, "utf-8"));
console.log(`Loaded ${data.length} entries from CSGO-API`);

const weaponCategories = ["Pistols", "Rifles", "SMGs", "Heavy", "Knives", "Gloves"];
const skins = data.filter(d =>
  d.category?.name && weaponCategories.includes(d.category.name) && d.image
);

const rarityMap = {
  "Consumer Grade": "Consumer",
  "Industrial Grade": "Industrial",
  "Mil-Spec Grade": "Mil-Spec",
  "Restricted": "Restricted",
  "Classified": "Classified",
  "Covert": "Covert",
  "Contraband": "Contraband",
  "Extraordinary": "Extraordinary"
};

const dopplerPhaseMap = {
  415: "Ruby", 416: "Sapphire", 417: "Black Pearl",
  418: "Phase 1", 419: "Phase 2", 420: "Phase 3", 421: "Phase 4",
  617: "Phase 1", 618: "Phase 2", 619: "Phase 3",
  852: "Phase 1", 853: "Phase 2", 854: "Phase 3", 855: "Phase 4",
  568: "Phase 1", 569: "Phase 2", 570: "Phase 3", 571: "Phase 4", 572: "Emerald",
};

const db = skins.map(s => {
  const pi = s.paint_index;
  let phase = null;
  if (s.market_hash_name && s.market_hash_name.includes("Doppler") && pi) {
    phase = dopplerPhaseMap[pi] || null;
  }
  return {
    n: s.name,
    mh: s.market_hash_name,
    u: s.image,
    r: rarityMap[s.rarity?.name] || s.rarity?.name || "Unknown",
    c: s.rarity?.color || "#b0b0b0",
    w: s.weapon?.name || "",
    cat: s.category?.name || "",
    we: s.wear?.name || "",
    st: s.stattrak || false,
    su: s.souvenir || false,
    pi: pi || null,
    ph: phase,
  };
});

console.log(`Total weapon skins: ${db.length}`);
const dopplersWithPhase = db.filter(s => s.ph);
console.log(`Doppler entries with phase: ${dopplersWithPhase.length}`);

fs.writeFileSync("src/data/skins.json", JSON.stringify(db));
console.log(`Generated src/data/skins.json (${(fs.statSync("src/data/skins.json").size / 1024).toFixed(0)} KB)`);
