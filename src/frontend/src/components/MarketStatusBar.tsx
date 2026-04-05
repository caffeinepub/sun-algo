import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useMarketModeContext } from "../contexts/MarketModeContext";
import { useMarketStatusContext } from "../contexts/MarketStatusContext";
import type { MarketStatusType } from "../hooks/useMarketStatus";
import { useBrokerStatuses } from "../hooks/useMarketStatus";

function LiveClock({
  timezone,
  label,
  flag,
}: { timezone: string; label: string; flag: string }) {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const formatted = new Intl.DateTimeFormat("en-US", {
        timeZone: timezone,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).format(now);
      setTime(formatted);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [timezone]);

  return (
    <span className="inline-flex items-center gap-1 text-[10px] text-[#9AA8C1] whitespace-nowrap flex-shrink-0">
      <span>{flag}</span>
      <span className="font-semibold text-[#6B7280]">{label}</span>
      <span
        className="countdown-timer"
        style={{ fontSize: "10px", letterSpacing: "0.3px" }}
      >
        {time}
      </span>
    </span>
  );
}

function formatCountdownDisplay(seconds: number): string {
  if (seconds <= 0) return "00:00:00";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return [
    String(h).padStart(2, "0"),
    String(m).padStart(2, "0"),
    String(s).padStart(2, "0"),
  ].join(":");
}

function getChipClass(status: MarketStatusType): string {
  switch (status) {
    case "OPEN":
      return "market-chip chip-open";
    case "PRE_OPEN":
      return "market-chip chip-preopen";
    case "CLOSING":
      return "market-chip chip-closing";
    case "CLOSED":
      return "market-chip chip-closed";
    case "HOLIDAY":
      return "market-chip chip-closed";
    case "HALTED":
      return "market-chip chip-halted";
    case "AMO_WINDOW":
      return "market-chip chip-amo";
    default:
      return "market-chip chip-closed";
  }
}

function getDotClass(status: MarketStatusType): string {
  switch (status) {
    case "OPEN":
      return "live-dot";
    case "PRE_OPEN":
      return "yellow-dot";
    case "CLOSING":
      return "live-dot";
    case "AMO_WINDOW":
      return "purple-dot";
    case "HALTED":
      return "red-dot";
    default:
      return "dead-dot";
  }
}

function getBrokerDotClass(status: string, connected: boolean): string {
  if (!connected) return "red-dot";
  switch (status) {
    case "OPEN":
      return "live-dot";
    case "PRE_OPEN":
      return "yellow-dot";
    case "AMO_WINDOW":
      return "purple-dot";
    default:
      return "dead-dot";
  }
}

/** Returns a subtle golden highlight style when the chip is relevant to the active market mode */
function getModeHighlightStyle(
  marketId: string,
  mode: string,
): React.CSSProperties {
  const indianIds = ["NSE", "MCX", "CDS"];
  const forexCryptoIds = ["CRYPTO", "FOREX"];
  const globalIds = ["NYSE"];

  const isRelevant =
    (mode === "indian" && indianIds.includes(marketId)) ||
    (mode === "forex_crypto" && forexCryptoIds.includes(marketId)) ||
    (mode === "global" && globalIds.includes(marketId));

  if (!isRelevant) return {};

  return {
    outline: "1px solid rgba(242,201,76,0.45)",
    outlineOffset: "1px",
  };
}

export default function MarketStatusBar() {
  const { markets, nseStatus, isAnyIndianMarketOpen } =
    useMarketStatusContext();
  const brokerStatuses = useBrokerStatuses();
  const { marketMode } = useMarketModeContext();
  const lastToastStatus = useRef<MarketStatusType | null>(null);

  // Toast notifications on market state transitions
  useEffect(() => {
    if (!lastToastStatus.current) {
      lastToastStatus.current = nseStatus.status;
      return;
    }
    const prev = lastToastStatus.current;
    const curr = nseStatus.status;

    if (prev !== curr) {
      if (curr === "OPEN" && (prev === "CLOSED" || prev === "PRE_OPEN")) {
        toast.success("🟢 NSE Market is OPEN! Strategies resuming...", {
          duration: 5000,
          description: "Live signals are now active. Good luck!",
        });
      } else if (curr === "CLOSING" && prev === "OPEN") {
        toast.warning("⚠️ NSE closes in 15 minutes. Review open positions!", {
          duration: 6000,
        });
      } else if (curr === "CLOSED" && (prev === "OPEN" || prev === "CLOSING")) {
        toast.info("🔴 NSE Market CLOSED for today.", {
          duration: 5000,
          description:
            "Strategy engine paused. Next session tomorrow at 09:15 AM IST.",
        });
      }
      lastToastStatus.current = curr;
    }
  }, [nseStatus.status]);

  const barClass = isAnyIndianMarketOpen
    ? "market-status-bar market-open-bar"
    : nseStatus.status === "PRE_OPEN"
      ? "market-status-bar market-pre-open-bar"
      : nseStatus.status === "HOLIDAY"
        ? "market-status-bar"
        : "market-status-bar market-closed-bar";

  // Only show a subset of markets to avoid overflow
  const primaryMarkets = markets.filter((m) =>
    ["NSE", "MCX", "CDS", "NYSE", "CRYPTO", "FOREX"].includes(m.id),
  );

  return (
    <div
      data-ocid="market_status.panel"
      className={barClass}
      style={{
        background: "#0D1117",
        borderTop: isAnyIndianMarketOpen
          ? "1px solid #10B981"
          : nseStatus.status === "PRE_OPEN"
            ? "1px solid #F59E0B"
            : "1px solid #374151",
        ...(isAnyIndianMarketOpen
          ? { boxShadow: "0 -2px 20px rgba(16,185,129,0.15)" }
          : {}),
      }}
    >
      {/* Broker chips — left */}
      <div className="flex items-center gap-1.5 flex-shrink-0 border-r border-[#1F2937] pr-2 mr-1">
        {brokerStatuses.slice(0, 4).map((broker, idx) => (
          <span
            key={broker.id}
            data-ocid={`broker_status.item.${idx + 1}`}
            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold"
            style={{
              background: broker.connected
                ? broker.status === "OPEN"
                  ? "rgba(16,185,129,0.1)"
                  : broker.status === "AMO_WINDOW"
                    ? "rgba(99,102,241,0.1)"
                    : "rgba(55,65,81,0.2)"
                : "rgba(239,68,68,0.1)",
              color: broker.connected
                ? broker.status === "OPEN"
                  ? "#34D399"
                  : broker.status === "AMO_WINDOW"
                    ? "#A5B4FC"
                    : "#6B7280"
                : "#EF4444",
              border: `1px solid ${
                broker.connected
                  ? broker.status === "OPEN"
                    ? "rgba(16,185,129,0.3)"
                    : broker.status === "AMO_WINDOW"
                      ? "rgba(99,102,241,0.3)"
                      : "rgba(55,65,81,0.4)"
                  : "rgba(239,68,68,0.3)"
              }`,
            }}
          >
            <span
              className={getBrokerDotClass(broker.status, broker.connected)}
            />
            {broker.name}
          </span>
        ))}
      </div>

      {/* Market chips — center scrollable */}
      <div
        className="flex items-center gap-1.5 flex-1 overflow-x-auto"
        style={{ scrollbarWidth: "none" }}
      >
        {primaryMarkets.map((market, idx) => (
          <span
            key={market.id}
            data-ocid={`market_chip.item.${idx + 1}`}
            className={getChipClass(market.status)}
            style={getModeHighlightStyle(market.id, marketMode)}
          >
            <span className={getDotClass(market.status)} />
            <span>{market.name}</span>
            {market.id !== "CRYPTO" && market.id !== "FOREX" && (
              <span className="text-[8px] opacity-60 hidden sm:inline">
                {market.sessionTime}
              </span>
            )}
            <span
              className={`countdown-timer${
                market.status === "CLOSING" ? " closing-soon" : ""
              }`}
              style={{ fontSize: "9px" }}
            >
              {market.status === "OPEN" || market.status === "CLOSING"
                ? formatCountdownDisplay(market.secondsToNextEvent)
                : market.status === "PRE_OPEN"
                  ? `↑${formatCountdownDisplay(market.secondsToNextEvent)}`
                  : market.id === "CRYPTO"
                    ? "24/7"
                    : market.isOpen
                      ? formatCountdownDisplay(market.secondsToNextEvent)
                      : ""}
            </span>
          </span>
        ))}
      </div>

      {/* Timezone clocks — right */}
      <div className="flex items-center gap-3 flex-shrink-0 border-l border-[#1F2937] pl-2 ml-1">
        <LiveClock timezone="Asia/Kolkata" label="IST" flag="🇮🇳" />
        <LiveClock timezone="America/New_York" label="EST" flag="🇺🇸" />
        <LiveClock timezone="Europe/London" label="GMT" flag="🇬🇧" />
        <span className="hidden xl:inline-flex">
          <LiveClock timezone="UTC" label="UTC" flag="🌐" />
        </span>
      </div>
    </div>
  );
}
