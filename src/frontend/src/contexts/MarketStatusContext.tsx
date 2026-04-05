import { createContext, useContext, useEffect, useRef } from "react";
import type {
  MarketStatusInfo,
  MarketStatusType,
} from "../hooks/useMarketStatus";
import { useMarketStatus } from "../hooks/useMarketStatus";

interface MarketStatusContextValue {
  markets: MarketStatusInfo[];
  nseStatus: MarketStatusInfo;
  dominantStatus: MarketStatusType;
  isNSEOpen: boolean;
  isAnyIndianMarketOpen: boolean;
  getMarketById: (id: string) => MarketStatusInfo | undefined;
  themeVars: Record<string, string>;
  marketStateClass: string;
}

const MarketStatusContext = createContext<MarketStatusContextValue | null>(
  null,
);

function getThemeVars(status: MarketStatusType): Record<string, string> {
  switch (status) {
    case "OPEN":
      return {
        "--opacity-global": "1",
        "--text-primary-market": "#FFFFFF",
        "--accent-gold-market": "#F59E0B",
        "--signal-buy-market": "#10B981",
        "--signal-sell-market": "#EF4444",
        "--card-filter": "grayscale(0%) brightness(1)",
      };
    case "CLOSING":
      return {
        "--opacity-global": "0.85",
        "--text-primary-market": "#E5E7EB",
        "--accent-gold-market": "#D97706",
        "--signal-buy-market": "#10B981",
        "--signal-sell-market": "#EF4444",
        "--card-filter": "grayscale(0%) brightness(0.85)",
      };
    case "PRE_OPEN":
      return {
        "--opacity-global": "0.70",
        "--text-primary-market": "#9CA3AF",
        "--accent-gold-market": "#B45309",
        "--signal-buy-market": "#059669",
        "--signal-sell-market": "#DC2626",
        "--card-filter": "grayscale(20%) brightness(0.7)",
      };
    case "CLOSED":
      return {
        "--opacity-global": "0.45",
        "--text-primary-market": "#4B5563",
        "--accent-gold-market": "#78540A",
        "--signal-buy-market": "#064E3B",
        "--signal-sell-market": "#7F1D1D",
        "--card-filter": "grayscale(60%) brightness(0.45)",
      };
    case "HOLIDAY":
      return {
        "--opacity-global": "0.35",
        "--text-primary-market": "#374151",
        "--accent-gold-market": "#5C3A0A",
        "--signal-buy-market": "#052E1A",
        "--signal-sell-market": "#5E1313",
        "--card-filter": "grayscale(80%) brightness(0.35)",
      };
    case "HALTED":
      return {
        "--opacity-global": "0.6",
        "--text-primary-market": "#9CA3AF",
        "--accent-gold-market": "#92400E",
        "--signal-buy-market": "#065F46",
        "--signal-sell-market": "#991B1B",
        "--card-filter": "grayscale(0%) brightness(0.6)",
      };
    case "AMO_WINDOW":
      return {
        "--opacity-global": "0.7",
        "--text-primary-market": "#C4B5FD",
        "--accent-gold-market": "#7C3AED",
        "--signal-buy-market": "#065F46",
        "--signal-sell-market": "#991B1B",
        "--card-filter": "grayscale(30%) brightness(0.7)",
      };
    default:
      return {
        "--opacity-global": "1",
        "--text-primary-market": "#FFFFFF",
        "--accent-gold-market": "#F59E0B",
        "--signal-buy-market": "#10B981",
        "--signal-sell-market": "#EF4444",
        "--card-filter": "grayscale(0%) brightness(1)",
      };
  }
}

function getMarketStateClass(status: MarketStatusType): string {
  switch (status) {
    case "OPEN":
      return "market-open";
    case "CLOSING":
      return "market-closing";
    case "PRE_OPEN":
      return "market-pre-open";
    case "CLOSED":
      return "market-closed";
    case "HOLIDAY":
      return "market-holiday";
    case "HALTED":
      return "market-halted";
    case "AMO_WINDOW":
      return "market-amo";
    default:
      return "market-closed";
  }
}

export function MarketStatusProvider({
  children,
}: { children: React.ReactNode }) {
  const {
    markets,
    dominantStatus,
    nseStatus,
    isAnyIndianMarketOpen,
    isNSEOpen,
  } = useMarketStatus();

  const themeVars = getThemeVars(dominantStatus);
  const marketStateClass = getMarketStateClass(dominantStatus);

  const prevStatus = useRef<MarketStatusType>(dominantStatus);

  // Apply CSS variables to root with transition
  useEffect(() => {
    const root = document.documentElement;
    // Set transition on root for smooth state changes
    root.style.transition = "opacity 2s ease-in-out, filter 2s ease-in-out";
    for (const [key, value] of Object.entries(themeVars)) {
      root.style.setProperty(key, value);
    }
    prevStatus.current = dominantStatus;
  }, [dominantStatus, themeVars]);

  const getMarketById = (id: string) => markets.find((m) => m.id === id);

  const value: MarketStatusContextValue = {
    markets,
    nseStatus,
    dominantStatus,
    isNSEOpen,
    isAnyIndianMarketOpen,
    getMarketById,
    themeVars,
    marketStateClass,
  };

  return (
    <MarketStatusContext.Provider value={value}>
      {children}
    </MarketStatusContext.Provider>
  );
}

export function useMarketStatusContext(): MarketStatusContextValue {
  const ctx = useContext(MarketStatusContext);
  if (!ctx) {
    throw new Error(
      "useMarketStatusContext must be used within MarketStatusProvider",
    );
  }
  return ctx;
}
