import { useEffect, useRef, useState } from "react";
import { useMarketModeContext } from "../contexts/MarketModeContext";
import { getNSEOpenStatus } from "./useMarketStatus";

export interface MarketPrice {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePct: number;
  currency: string;
}

const BASE_PRICES: MarketPrice[] = [
  {
    symbol: "NIFTY50",
    name: "NIFTY 50",
    price: 24850.3,
    change: 104.57,
    changePct: 0.42,
    currency: "₹",
  },
  {
    symbol: "SENSEX",
    name: "SENSEX",
    price: 82134.61,
    change: 311.11,
    changePct: 0.38,
    currency: "₹",
  },
  {
    symbol: "BANKNIFTY",
    name: "BANK NIFTY",
    price: 52445.75,
    change: 318.91,
    changePct: 0.61,
    currency: "₹",
  },
  {
    symbol: "RELIANCE",
    name: "RELIANCE",
    price: 2847.5,
    change: 18.3,
    changePct: 0.65,
    currency: "₹",
  },
  {
    symbol: "TCS",
    name: "TCS",
    price: 3945.2,
    change: -22.1,
    changePct: -0.56,
    currency: "₹",
  },
  {
    symbol: "HDFCBANK",
    name: "HDFC BANK",
    price: 1723.4,
    change: 8.7,
    changePct: 0.51,
    currency: "₹",
  },
  {
    symbol: "INFY",
    name: "INFOSYS",
    price: 1847.25,
    change: -14.55,
    changePct: -0.78,
    currency: "₹",
  },
  {
    symbol: "BTC/USD",
    name: "BTC/USD",
    price: 67234.5,
    change: 824.1,
    changePct: 1.24,
    currency: "$",
  },
  {
    symbol: "ETH/USD",
    name: "ETH/USD",
    price: 3456.8,
    change: -6.22,
    changePct: -0.18,
    currency: "$",
  },
  {
    symbol: "SOL/USD",
    name: "SOL/USD",
    price: 178.45,
    change: 3.21,
    changePct: 1.83,
    currency: "$",
  },
  {
    symbol: "GOLD",
    name: "GOLD",
    price: 2330.0,
    change: 8.4,
    changePct: 0.36,
    currency: "$",
  },
  {
    symbol: "CRUDE",
    name: "CRUDE OIL",
    price: 87.34,
    change: 0.48,
    changePct: 0.55,
    currency: "$",
  },
  {
    symbol: "USDINR",
    name: "USD/INR",
    price: 83.47,
    change: -0.04,
    changePct: -0.05,
    currency: "₹",
  },
  {
    symbol: "EURUSD",
    name: "EUR/USD",
    price: 1.0834,
    change: 0.0012,
    changePct: 0.11,
    currency: "$",
  },
  {
    symbol: "GBPUSD",
    name: "GBP/USD",
    price: 1.2645,
    change: -0.0008,
    changePct: -0.06,
    currency: "$",
  },
  {
    symbol: "AAPL",
    name: "APPLE",
    price: 189.45,
    change: 1.23,
    changePct: 0.65,
    currency: "$",
  },
  {
    symbol: "MSFT",
    name: "MICROSOFT",
    price: 415.23,
    change: -2.34,
    changePct: -0.56,
    currency: "$",
  },
];

function getNYSEOpenStatus(): boolean {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
    weekday: "short",
  });
  const parts = formatter.formatToParts(now);
  let hour = 0;
  let minute = 0;
  let weekday = "";
  for (const part of parts) {
    if (part.type === "hour") hour = Number.parseInt(part.value, 10);
    else if (part.type === "minute") minute = Number.parseInt(part.value, 10);
    else if (part.type === "weekday") weekday = part.value;
  }
  const weekdayMap: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };
  const dow = weekdayMap[weekday] ?? new Date().getDay();
  const currentMin = hour * 60 + minute;
  return (
    dow >= 1 && dow <= 5 && currentMin >= 9 * 60 + 30 && currentMin <= 16 * 60
  );
}

// Per-asset volatility: how much it can move per 3-second tick
function getVolatility(symbol: string): number {
  if (["BTC/USD", "ETH/USD", "SOL/USD"].includes(symbol)) return 0.018; // 1.8% crypto
  if (["EURUSD", "GBPUSD", "USDINR"].includes(symbol)) return 0.0003; // 0.03% forex
  if (["NIFTY50", "SENSEX", "BANKNIFTY"].includes(symbol)) return 0.004; // 0.4% indices
  if (["GOLD", "CRUDE"].includes(symbol)) return 0.006; // 0.6% commodities
  return 0.008; // 0.8% equities
}

export function useMarketData() {
  const [prices, setPrices] = useState<MarketPrice[]>(BASE_PRICES);
  const [flashState, setFlashState] = useState<
    Record<string, "up" | "down" | null>
  >({});
  const [isLive, setIsLive] = useState(false);
  const basePricesRef = useRef<MarketPrice[]>(BASE_PRICES);

  const { marketMode } = useMarketModeContext();

  useEffect(() => {
    const interval = setInterval(() => {
      let shouldBeLive = false;
      if (marketMode === "forex_crypto") {
        shouldBeLive = true;
      } else if (marketMode === "global") {
        shouldBeLive = getNYSEOpenStatus();
      } else {
        shouldBeLive = getNSEOpenStatus();
      }

      setIsLive(shouldBeLive);

      // In forex_crypto mode, always update ALL prices
      // In other modes, always show live prices for forex/crypto symbols, apply market hours to others
      const forceUpdateSymbols = [
        "BTC/USD",
        "ETH/USD",
        "SOL/USD",
        "EURUSD",
        "GBPUSD",
        "USDINR",
        "CRUDE",
        "GOLD",
      ];
      const shouldUpdate = shouldBeLive || marketMode === "forex_crypto";

      if (!shouldUpdate && marketMode === "indian") return;

      setPrices((prev) => {
        const newFlash: Record<string, "up" | "down" | null> = {};
        const updated = prev.map((item, idx) => {
          const base = basePricesRef.current[idx];
          // In Indian mode, still update forex/crypto prices 24/7
          const isForexCrypto = forceUpdateSymbols.includes(item.symbol);
          if (!shouldUpdate && !isForexCrypto) {
            return item; // Don't update Indian stocks when market closed
          }
          const vol = getVolatility(item.symbol);
          const fluctPct = (Math.random() - 0.5) * vol;
          const decimals =
            item.price < 2
              ? 5
              : item.price < 10
                ? 4
                : item.price > 10000
                  ? 2
                  : 2;
          const newPrice = Number.parseFloat(
            (item.price * (1 + fluctPct)).toFixed(decimals),
          );
          const changeFromBase = newPrice - base.price;
          const changePct = Number.parseFloat(
            ((changeFromBase / base.price) * 100).toFixed(2),
          );
          newFlash[item.symbol] = newPrice > item.price ? "up" : "down";
          return {
            ...item,
            price: newPrice,
            change: Number.parseFloat(changeFromBase.toFixed(decimals)),
            changePct,
          };
        });

        setTimeout(() => setFlashState({}), 300);
        setFlashState(newFlash);
        return updated;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [marketMode]);

  const getPrice = (symbol: string): MarketPrice | undefined =>
    prices.find((p) => p.symbol === symbol);

  return { prices, getPrice, flashState, isLive };
}
