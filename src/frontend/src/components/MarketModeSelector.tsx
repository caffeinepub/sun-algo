import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { MarketMode } from "../contexts/MarketModeContext";
import { useMarketModeContext } from "../contexts/MarketModeContext";

const MODES: {
  mode: MarketMode;
  label: string;
  icon: string;
  tooltip: string;
  hours: string;
}[] = [
  {
    mode: "indian",
    label: "India",
    icon: "🇮🇳",
    tooltip: "Indian Market",
    hours: "NSE/BSE Mon–Fri 9:15–15:30 IST",
  },
  {
    mode: "forex_crypto",
    label: "Forex/Crypto",
    icon: "💱",
    tooltip: "Forex & Crypto",
    hours: "24/7 – Always Open",
  },
  {
    mode: "global",
    label: "Global",
    icon: "🌐",
    tooltip: "Global Markets",
    hours: "NYSE/NASDAQ Mon–Fri 9:30–16:00 ET",
  },
];

export default function MarketModeSelector() {
  const { marketMode, setMarketMode, isMarketOpen } = useMarketModeContext();

  return (
    <TooltipProvider delayDuration={300}>
      <div
        data-ocid="market_mode.panel"
        className="flex items-center rounded-md overflow-hidden flex-shrink-0"
        style={{
          background: "#111E33",
          border: "1px solid #1E2C44",
        }}
      >
        {MODES.map((item, idx) => {
          const isActive = marketMode === item.mode;
          return (
            <Tooltip key={item.mode}>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  data-ocid="market_mode.tab"
                  onClick={() => setMarketMode(item.mode)}
                  className="relative flex items-center gap-0.5 transition-all duration-200 focus-visible:outline-none"
                  style={{
                    padding: "3px 6px",
                    background: isActive ? "#F2C94C" : "transparent",
                    color: isActive ? "#0B1424" : "#9AA8C1",
                    borderRight:
                      idx < MODES.length - 1 ? "1px solid #1E2C44" : undefined,
                    fontWeight: isActive ? 700 : 500,
                    fontSize: "9px",
                    letterSpacing: "0.04em",
                    whiteSpace: "nowrap",
                    lineHeight: 1.4,
                  }}
                  aria-pressed={isActive}
                  aria-label={`${item.tooltip}: ${item.hours}`}
                >
                  <span style={{ fontSize: "10px" }}>{item.icon}</span>
                  <span className="hidden sm:inline" style={{ marginLeft: 2 }}>
                    {item.label}
                  </span>
                  {/* Active indicator dot for 24/7 forex/crypto mode */}
                  {isActive && item.mode === "forex_crypto" && (
                    <span
                      className="absolute top-0.5 right-0.5 w-1 h-1 rounded-full"
                      style={{ background: "#10B981" }}
                    />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent
                side="bottom"
                sideOffset={6}
                style={{
                  background: "#111E33",
                  border: "1px solid #24344F",
                  color: "#EAF0FF",
                  fontSize: "10px",
                  padding: "4px 8px",
                }}
              >
                <div className="font-semibold">{item.tooltip}</div>
                <div
                  style={{ color: "#9AA8C1", fontSize: "9px", marginTop: 1 }}
                >
                  {item.hours}
                </div>
              </TooltipContent>
            </Tooltip>
          );
        })}

        {/* Live status dot for current mode */}
        <div
          className="flex items-center px-1.5"
          style={{ borderLeft: "1px solid #1E2C44" }}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${isMarketOpen ? "pulse-green" : ""}`}
            style={{ background: isMarketOpen ? "#2ED47A" : "#FF5A5F" }}
          />
        </div>
      </div>
    </TooltipProvider>
  );
}
