import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useMarketStatusContext } from "./MarketStatusContext";

export type MarketMode = "indian" | "forex_crypto" | "global";

interface MarketModeContextValue {
  marketMode: MarketMode;
  setMarketMode: (mode: MarketMode) => void;
  isMarketOpen: boolean;
  modeLabel: string;
  modeDescription: string;
}

const MarketModeContext = createContext<MarketModeContextValue | null>(null);

const MODE_LABELS: Record<MarketMode, string> = {
  indian: "Indian Market",
  forex_crypto: "Forex & Crypto",
  global: "Global Markets",
};

const MODE_DESCRIPTIONS: Record<MarketMode, string> = {
  indian: "NSE/BSE Mon–Fri 9:15–15:30 IST",
  forex_crypto: "24/7 – Always Open",
  global: "NYSE/NASDAQ Mon–Fri 9:30–16:00 ET",
};

const STORAGE_KEY = "sun_algo_market_mode";

export function MarketModeProvider({
  children,
}: { children: React.ReactNode }) {
  const [marketMode, setMarketModeState] = useState<MarketMode>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (
        stored === "indian" ||
        stored === "forex_crypto" ||
        stored === "global"
      ) {
        return stored;
      }
    } catch {
      // ignore
    }
    return "indian";
  });

  const { isNSEOpen, getMarketById } = useMarketStatusContext();

  const setMarketMode = (mode: MarketMode) => {
    setMarketModeState(mode);
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      // ignore
    }
  };

  const isMarketOpen = useMemo(() => {
    switch (marketMode) {
      case "indian":
        return isNSEOpen;
      case "forex_crypto":
        return true;
      case "global": {
        const nyse = getMarketById("NYSE");
        return nyse?.isOpen ?? false;
      }
      default:
        return false;
    }
  }, [marketMode, isNSEOpen, getMarketById]);

  const value: MarketModeContextValue = {
    marketMode,
    setMarketMode,
    isMarketOpen,
    modeLabel: MODE_LABELS[marketMode],
    modeDescription: MODE_DESCRIPTIONS[marketMode],
  };

  return (
    <MarketModeContext.Provider value={value}>
      {children}
    </MarketModeContext.Provider>
  );
}

export function useMarketModeContext(): MarketModeContextValue {
  const ctx = useContext(MarketModeContext);
  if (!ctx) {
    throw new Error(
      "useMarketModeContext must be used within MarketModeProvider",
    );
  }
  return ctx;
}
