'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n';

interface MarketPrice {
  name: string;
  price: number;
  url: string;
  type: string;
  success: boolean;
  fee: number;
}

export default function SkinPage() {
  const params = useParams();
  const skinName = decodeURIComponent(params.name as string);
  const [prices, setPrices] = useState<MarketPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const pricesRes = await fetch(`/api/skin-prices/${encodeURIComponent(skinName)}`);
        const pricesData = await pricesRes.json();
        
        setPrices(pricesData.markets || []);
      } catch (err) {
        console.error("Failed to load prices", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
  }, [skinName]);

  const { lowestPrice, avgPrice, validPrices } = useMemo(() => {
    const valid = prices.filter(p => p.success && p.price > 0);
    const lowest = valid.length > 0 ? Math.min(...valid.map(p => p.price)) : 0;
    const avg = valid.length > 0 ? valid.reduce((sum, p) => sum + p.price, 0) / valid.length : 0;
    return { lowestPrice: lowest, avgPrice: avg, validPrices: valid };
  }, [prices]);

  return (
    <div className="min-h-screen bg-[#0d1117] text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-[#161b22]">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg" style={{ background: "linear-gradient(135deg, #06b6d433, #0891b233)", border: "1px solid rgba(6,182,212,0.2)" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                <line x1="12" y1="22.08" x2="12" y2="12"/>
              </svg>
            </div>
            <span className="text-cyan-400 text-sm hover:underline">← {t.back}</span>
          </Link>
          
          <div className="mt-6 flex items-center gap-8">
            <div>
              <h1 className="text-3xl font-bold">{skinName}</h1>
              <div className="flex gap-6 mt-3">
                <div>
                  <div className="text-gray-400 text-xs">{t.lowestPrice}</div>
                  <div className="text-2xl font-bold text-green-400">
                    {lowestPrice > 0 ? `$${lowestPrice.toFixed(2)}` : '-'}
                  </div>
                </div>
                <div>
                  <div className="text-gray-400 text-xs">{t.averagePrice}</div>
                  <div className="text-2xl font-bold text-blue-400">
                    {avgPrice > 0 ? `$${avgPrice.toFixed(2)}` : '-'}
                  </div>
                </div>
                <div>
                  <div className="text-gray-400 text-xs">{t.availableMarkets}</div>
                  <div className="text-2xl font-bold">{validPrices.length}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Price Table */}
      <div className="max-w-7xl mx-auto px-6 py-8">
          {loading ? (
          <div className="text-center py-20 text-gray-400">
            <div className="animate-pulse">{t.loadingPrices}</div>
          </div>
        ) : (
          <div className="bg-[#161b22] rounded-xl border border-gray-800 overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-12 px-6 py-4 border-b border-gray-800 text-gray-400 text-xs font-semibold uppercase tracking-wider">
              <div className="col-span-4">{t.market}</div>
              <div className="col-span-2 text-right">{t.price}</div>
              <div className="col-span-2 text-right">{t.fee}</div>
              <div className="col-span-2 text-right">{t.afterFee}</div>
              <div className="col-span-2 text-right">{t.difference}</div>
            </div>

            {/* Market Rows */}
            {prices.map((market, i) => {
              const isLowest = market.price === lowestPrice && market.success;
              const diff = market.price ? ((market.price - lowestPrice) / lowestPrice * 100) : 0;

              return (
                <a
                  key={i}
                  href={market.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`grid grid-cols-12 px-6 py-4 border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors cursor-pointer ${isLowest ? 'bg-green-900/10' : ''}`}
                >
                  <div className="col-span-4 flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${isLowest ? 'bg-green-400' : 'bg-gray-600'}`}></div>
                    <span className="font-medium">{market.name}</span>
                    {isLowest && <span className="text-xs bg-green-400 text-black px-2 py-0.5 rounded font-bold">{t.lowest}</span>}
                  </div>
                  
                  <div className="col-span-2 text-right font-bold text-lg">
                    {market.success && market.price ? `$${market.price.toFixed(2)}` : <span className="text-gray-500">—</span>}
                  </div>

                  <div className="col-span-2 text-right text-gray-400">
                    {market.fee ? `${(market.fee * 100).toFixed(0)}%` : '-'}
                  </div>

                  <div className="col-span-2 text-right font-medium">
                    {market.price && market.fee ? `$${(market.price * (1 - market.fee)).toFixed(2)}` : '-'}
                  </div>

                  <div className="col-span-2 text-right">
                    {market.price && diff !== 0 && (
                      <span className={diff > 0 ? 'text-red-400' : 'text-green-400'}>
                        {diff > 0 ? '+' : ''}{diff.toFixed(1)}%
                      </span>
                    )}
                    {diff === 0 && market.price && <span className="text-gray-400">0%</span>}
                  </div>
                </a>
              );
            })}
          </div>
        )}

        <div className="mt-6 text-center text-gray-500 text-sm">
          {t.pricesAutoUpdate}
        </div>
      </div>
    </div>
  );
}
