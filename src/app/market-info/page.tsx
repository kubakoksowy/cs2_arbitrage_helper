"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n";

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

export default function MarketInfo() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"p2p" | "swap" | "bot" | "onlybuy">("p2p");
  const [markets, setMarkets] = useState<Market[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/markets")
      .then(res => res.json())
      .then(data => {
        setMarkets(data.markets || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
      <header className="sticky top-0 z-40" style={{ background: "var(--bg-card)", borderBottom: "1px solid var(--border-color)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                  <line x1="12" y1="22.08" x2="12" y2="12"/>
                </svg>
                <span className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>CS Tracker</span>
              </Link>
            </div>
            <Link href="/" className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>
              ← {t.back}
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl font-bold mb-6" style={{ color: "var(--text-primary)" }}>{t.marketInfo || "Market Info"}</h1>

        <div className="flex gap-2 mb-6 flex-wrap">
          <button
            type="button"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all`}
            style={{
              background: activeTab === "p2p" ? "rgba(6,182,212,0.15)" : "var(--bg-card)",
              border: `1px solid ${activeTab === "p2p" ? "rgba(6,182,212,0.4)" : "var(--border-color)"}`,
              color: activeTab === "p2p" ? "#06b6d4" : "var(--text-secondary)",
            }}
            onClick={() => setActiveTab("p2p")}
          >
            P2P
          </button>
          <button
            type="button"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all`}
            style={{
              background: activeTab === "swap" ? "rgba(6,182,212,0.15)" : "var(--bg-card)",
              border: `1px solid ${activeTab === "swap" ? "rgba(6,182,212,0.4)" : "var(--border-color)"}`,
              color: activeTab === "swap" ? "#06b6d4" : "var(--text-secondary)",
            }}
            onClick={() => setActiveTab("swap")}
          >
            Swap
          </button>
          <button
            type="button"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all`}
            style={{
              background: activeTab === "bot" ? "rgba(6,182,212,0.15)" : "var(--bg-card)",
              border: `1px solid ${activeTab === "bot" ? "rgba(6,182,212,0.4)" : "var(--border-color)"}`,
              color: activeTab === "bot" ? "#06b6d4" : "var(--text-secondary)",
            }}
            onClick={() => setActiveTab("bot")}
          >
            Bot
          </button>
          <button
            type="button"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all`}
            style={{
              background: activeTab === "onlybuy" ? "rgba(6,182,212,0.15)" : "var(--bg-card)",
              border: `1px solid ${activeTab === "onlybuy" ? "rgba(6,182,212,0.4)" : "var(--border-color)"}`,
              color: activeTab === "onlybuy" ? "#06b6d4" : "var(--text-secondary)",
            }}
            onClick={() => setActiveTab("onlybuy")}
          >
            Only Buy
          </button>
        </div>

        <div className="rounded-xl p-6" style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)" }}>
          {loading ? (
            <div className="text-center py-12" style={{ color: "var(--text-muted)" }}>
              <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p>Loading...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
                    {activeTab === "swap" ? (
                      <>
                        <th className="text-left py-3 px-4 text-sm font-medium" style={{ color: "var(--text-muted)" }}>Market</th>
                        <th className="text-right py-3 px-4 text-sm font-medium" style={{ color: "var(--text-muted)" }}></th>
                      </>
                    ) : activeTab === "onlybuy" ? (
                      <>
                        <th className="text-left py-3 px-4 text-sm font-medium" style={{ color: "var(--text-muted)" }}>Market</th>
                        <th className="text-center py-3 px-4 text-sm font-medium" style={{ color: "var(--text-muted)" }}>{t.buyFee}</th>
                        <th className="text-center py-3 px-4 text-sm font-medium" style={{ color: "var(--text-muted)" }}>{t.depositFee}</th>
                        <th className="text-right py-3 px-4 text-sm font-medium" style={{ color: "var(--text-muted)" }}></th>
                      </>
                    ) : (
                      <>
                        <th className="text-left py-3 px-4 text-sm font-medium" style={{ color: "var(--text-muted)" }}>Market</th>
                        <th className="text-center py-3 px-4 text-sm font-medium" style={{ color: "var(--text-muted)" }}>{t.sellFee}</th>
                        <th className="text-center py-3 px-4 text-sm font-medium" style={{ color: "var(--text-muted)" }}>{t.buyFee}</th>
                        <th className="text-center py-3 px-4 text-sm font-medium" style={{ color: "var(--text-muted)" }}>{t.depositFee}</th>
                        <th className="text-center py-3 px-4 text-sm font-medium" style={{ color: "var(--text-muted)" }}>{t.withdrawFee}</th>
                        <th className="text-right py-3 px-4 text-sm font-medium" style={{ color: "var(--text-muted)" }}></th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {markets.filter(m => m.type === activeTab).map((market) => (
                    <tr key={market.name} style={{ borderBottom: "1px solid var(--border-color)" }}>
                      {activeTab === "swap" ? (
                        <>
                          <td className="py-3 px-4">
                            <a href={market.url} target="_blank" rel="noopener noreferrer" className="font-semibold hover:text-cyan-400" style={{ color: "var(--text-primary)" }}>
                              {market.name}
                            </a>
                            <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{market.info}</p>
                          </td>
                          <td className="text-right py-3 px-4">
                            <a href={market.url} target="_blank" rel="noopener noreferrer" className="text-xs inline-flex items-center gap-1 hover:text-cyan-400" style={{ color: "var(--text-muted)" }}>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                                <polyline points="15 3 21 3 21 9"/>
                                <line x1="10" y1="14" x2="21" y2="3"/>
                              </svg>
                            </a>
                          </td>
                        </>
                      ) : activeTab === "onlybuy" ? (
                        <>
                          <td className="py-3 px-4">
                            <a href={market.url} target="_blank" rel="noopener noreferrer" className="font-semibold hover:text-cyan-400" style={{ color: "var(--text-primary)" }}>
                              {market.name}
                            </a>
                            <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{market.info}</p>
                          </td>
                          <td className="text-center py-3 px-4">
                            <span className="text-xs px-2 py-0.5 rounded" style={{ background: "rgba(168,85,247,0.1)", color: "#c084fc" }}>
                              {(market.buyFee * 100).toFixed(1)}%
                            </span>
                          </td>
                          <td className="text-center py-3 px-4">
                            <span className="text-xs px-2 py-0.5 rounded" style={{ background: "rgba(34,197,94,0.1)", color: "#4ade80" }}>
                              {(market.depositFee * 100).toFixed(1)}%
                            </span>
                          </td>
                          <td className="text-right py-3 px-4">
                            <a href={market.url} target="_blank" rel="noopener noreferrer" className="text-xs inline-flex items-center gap-1 hover:text-cyan-400" style={{ color: "var(--text-muted)" }}>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                                <polyline points="15 3 21 3 21 9"/>
                                <line x1="10" y1="14" x2="21" y2="3"/>
                              </svg>
                            </a>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="py-3 px-4">
                            <a href={market.url} target="_blank" rel="noopener noreferrer" className="font-semibold hover:text-cyan-400" style={{ color: "var(--text-primary)" }}>
                              {market.name}
                            </a>
                            <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{market.info}</p>
                          </td>
                          <td className="text-center py-3 px-4">
                            <span className="text-xs px-2 py-0.5 rounded" style={{ background: "rgba(6,182,212,0.1)", color: "#06b6d4" }}>
                              {(market.sellFee * 100).toFixed(1)}%
                            </span>
                          </td>
                          <td className="text-center py-3 px-4">
                            <span className="text-xs px-2 py-0.5 rounded" style={{ background: "rgba(168,85,247,0.1)", color: "#c084fc" }}>
                              {(market.buyFee * 100).toFixed(1)}%
                            </span>
                          </td>
                          <td className="text-center py-3 px-4">
                            <span className="text-xs px-2 py-0.5 rounded" style={{ background: "rgba(34,197,94,0.1)", color: "#4ade80" }}>
                              {(market.depositFee * 100).toFixed(1)}%
                            </span>
                          </td>
                          <td className="text-center py-3 px-4">
                            <span className="text-xs px-2 py-0.5 rounded" style={{ background: "rgba(250,204,21,0.1)", color: "#fbbf24" }}>
                              {(market.withdrawFee * 100).toFixed(1)}%
                            </span>
                          </td>
                          <td className="text-right py-3 px-4">
                            <a href={market.url} target="_blank" rel="noopener noreferrer" className="text-xs inline-flex items-center gap-1 hover:text-cyan-400" style={{ color: "var(--text-muted)" }}>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                                <polyline points="15 3 21 3 21 9"/>
                                <line x1="10" y1="14" x2="21" y2="3"/>
                              </svg>
                            </a>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}