import { NextRequest, NextResponse } from "next/server";
import skinsData from "@/data/skins.json";

interface SkinRaw {
  n: string;
  mh: string;
  u: string;
  r: string;
  c: string;
  w: string;
  cat: string;
  we: string;
  st: boolean;
  su: boolean;
  pi: number | null;
  ph: string | null;
}

const skins = skinsData as SkinRaw[];

const gammaDopplerPhases = [
  { label: "Phase 1", color: "#22c55e" },
  { label: "Phase 2", color: "#16a34a" },
  { label: "Phase 3", color: "#15803d" },
  { label: "Phase 4", color: "#166534" },
  { label: "Emerald", color: "#00ff7f" },
];

const dopplerPhases = [
  { label: "Phase 1", color: "#a855f7" },
  { label: "Phase 2", color: "#ec4899" },
  { label: "Phase 3", color: "#3b82f6" },
  { label: "Phase 4", color: "#6366f1" },
  { label: "Ruby", color: "#ef4444" },
  { label: "Sapphire", color: "#2563eb" },
  { label: "Black Pearl", color: "#8b5cf6" },
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");
  if (!q || q.trim().length < 1) {
    return NextResponse.json({ suggestions: [] });
  }

  const query = q.trim().toLowerCase();
  const queryTerms = query.split(/\s+/);
  const suggestions: {
    name: string;
    iconUrl: string;
    rarity: string;
    rarityColor: string;
    dopplerPhase: string | null;
  }[] = [];
  const seenNames = new Set<string>();

  for (const skin of skins) {
    if (suggestions.length >= 20) break;
    const phase = skin.ph ? ` ${skin.ph.toLowerCase().replace("phase ", "p")}` : "";
    // Add phase names to searchable for doppler/gamma doppler items
    let phaseNames = "";
    if (!skin.ph && skin.n.toLowerCase().includes("doppler")) {
      const isGamma = skin.n.toLowerCase().includes("gamma");
      const phases = isGamma ? gammaDopplerPhases : dopplerPhases;
      phaseNames = " " + phases.map(p => p.label.toLowerCase()).join(" ");
    }
    const searchable = `${skin.n} ${skin.mh} ${skin.w}${phase}${phaseNames}`.toLowerCase().replace(/[|™★]/g, "");
    if (queryTerms.every(term => searchable.includes(term))) {
      // If skin has no phase but is a doppler/gamma doppler, generate phase entries
      if (!skin.ph && skin.n.toLowerCase().includes("doppler")) {
        const isGamma = skin.n.toLowerCase().includes("gamma");
        const phases = isGamma ? gammaDopplerPhases : dopplerPhases;
        for (const p of phases) {
          const phaseName = `${skin.mh} (${p.label})`;
          if (!seenNames.has(phaseName)) {
            seenNames.add(phaseName);
            suggestions.push({
              name: phaseName,
              iconUrl: skin.u,
              rarity: skin.r,
              rarityColor: skin.c,
              dopplerPhase: p.label,
            });
          }
        }
      } else if (!seenNames.has(skin.mh)) {
        seenNames.add(skin.mh);
        suggestions.push({
          name: skin.mh,
          iconUrl: skin.u,
          rarity: skin.r,
          rarityColor: skin.c,
          dopplerPhase: skin.ph,
        });
      }
    }
  }

  return NextResponse.json({ suggestions: suggestions.slice(0, 20) });
}
