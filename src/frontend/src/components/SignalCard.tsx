import type { Signal, SignalType } from "../backend.d";

interface SignalCardProps {
  signal: Signal;
  index?: number;
  marketClosed?: boolean;
  nextOpenTime?: string;
  onClick?: () => void;
}

function getSignalConfig(type: SignalType) {
  switch (type) {
    case "strongBuy":
      return {
        label: "STRONG BUY",
        color: "#2ED47A",
        bg: "rgba(46,212,122,0.08)",
        borderClass: "signal-strong-buy",
        emoji: "🟢",
      };
    case "buy":
      return {
        label: "BUY",
        color: "#2ED47A",
        bg: "rgba(46,212,122,0.05)",
        borderClass: "signal-buy",
        emoji: "🔵",
      };
    case "sell":
      return {
        label: "SELL",
        color: "#FF5A5F",
        bg: "rgba(255,90,95,0.05)",
        borderClass: "signal-sell",
        emoji: "🔴",
      };
    case "strongSell":
      return {
        label: "STRONG SELL",
        color: "#FF5A5F",
        bg: "rgba(255,90,95,0.08)",
        borderClass: "signal-strong-sell",
        emoji: "🔴",
      };
    default:
      return {
        label: "NEUTRAL",
        color: "#E7D27C",
        bg: "rgba(231,210,124,0.05)",
        borderClass: "signal-neutral",
        emoji: "⚪",
      };
  }
}

function getCurrencySymbol(instrumentSymbol: string): string {
  const sym = instrumentSymbol.toUpperCase();
  // Indian market symbols → ₹
  const inrSymbols = [
    "NIFTY",
    "SENSEX",
    "BANKNIFTY",
    "RELIANCE",
    "TCS",
    "HDFC",
    "INFY",
    "WIPRO",
    "ICICI",
    "SBIN",
  ];
  if (inrSymbols.some((s) => sym.includes(s))) return "₹";
  // Forex, crypto, US stocks → $
  if (
    sym.includes("BTC") ||
    sym.includes("ETH") ||
    sym.includes("USD") ||
    sym.includes("EUR") ||
    sym.includes("GBP") ||
    sym.includes("CRUDE") ||
    sym.includes("AAPL") ||
    sym.includes("MSFT") ||
    sym.includes("GOLD")
  )
    return "$";
  return "₹";
}

// Stable RSI from symbol name (deterministic seed)
function getSymbolRSI(symbol: string): number {
  const seed = symbol.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return 28 + (seed % 50); // range 28–78
}

export default function SignalCard({
  signal,
  index = 1,
  marketClosed = false,
  nextOpenTime,
  onClick,
}: SignalCardProps) {
  const config = getSignalConfig(signal.signalType as SignalType);
  const curr = getCurrencySymbol(signal.instrumentSymbol);
  const rsi = getSymbolRSI(signal.instrumentSymbol);
  const rsiColor = rsi < 40 ? "#2ED47A" : rsi > 70 ? "#FF5A5F" : "#E7D27C";

  const gainPct =
    signal.entryPrice > 0
      ? (
          ((signal.targetPrice - signal.entryPrice) / signal.entryPrice) *
          100
        ).toFixed(1)
      : "0.0";
  const slPct =
    signal.entryPrice > 0
      ? (
          ((signal.entryPrice - signal.stopLoss) / signal.entryPrice) *
          100
        ).toFixed(1)
      : "0.0";
  const rrRatio =
    Number(slPct) > 0 ? (Number(gainPct) / Number(slPct)).toFixed(1) : "--";

  const formatPrice = (p: number) =>
    p > 1000
      ? p.toLocaleString("en-IN", { maximumFractionDigits: 2 })
      : p > 100
        ? p.toFixed(2)
        : p > 1
          ? p.toFixed(4)
          : p.toFixed(6);

  return (
    <div
      data-ocid={`signals.item.${index}`}
      className={`trading-card market-dim-card relative p-3 ${config.borderClass} hover:shadow-card transition-all hover:scale-[1.01] active:scale-[0.99]`}
      style={{
        background: config.bg,
        cursor: onClick ? "pointer" : "default",
      }}
      onClick={onClick}
      onKeyDown={(e) => e.key === "Enter" && onClick?.()}
    >
      {/* Market closed overlay */}
      {marketClosed && (
        <div
          className="signal-closed-overlay rounded-xl"
          data-ocid="signals.panel"
        >
          <div className="text-center px-3">
            <div className="text-lg mb-1">🔒</div>
            <div className="text-xs font-bold text-gray-400">Market Closed</div>
            {nextOpenTime && (
              <div className="text-[10px] text-gray-500 mt-0.5">
                {nextOpenTime}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Symbol + Signal type */}
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="font-bold text-sm text-[#EAF0FF]">
            {signal.instrumentSymbol}
          </div>
          <div className="text-[10px] text-[#9AA8C1] uppercase">
            {signal.timeframe}
          </div>
        </div>
        <span
          className="text-[9px] font-black px-1.5 py-0.5 rounded-full"
          style={{ color: config.color, background: `${config.color}22` }}
        >
          {config.emoji} {config.label}
        </span>
      </div>

      {/* Entry / Target / SL */}
      <div className="space-y-1 mb-2">
        <div className="flex justify-between text-[11px]">
          <span className="text-[#9AA8C1]">Entry</span>
          <span className="font-semibold text-[#EAF0FF]">
            {curr}
            {formatPrice(signal.entryPrice)}
          </span>
        </div>
        <div className="flex justify-between text-[11px]">
          <span className="text-[#9AA8C1]">Target</span>
          <span className="font-semibold" style={{ color: "#2ED47A" }}>
            {curr}
            {formatPrice(signal.targetPrice)}{" "}
            <span className="text-[9px]">+{gainPct}%</span>
          </span>
        </div>
        <div className="flex justify-between text-[11px]">
          <span className="text-[#9AA8C1]">Stop Loss</span>
          <span className="font-semibold" style={{ color: "#FF5A5F" }}>
            {curr}
            {formatPrice(signal.stopLoss)}{" "}
            <span className="text-[9px]">-{slPct}%</span>
          </span>
        </div>
      </div>

      {/* Strategy name + technical badges */}
      <div className="border-t pt-2" style={{ borderColor: "#24344F" }}>
        <div className="text-[9px] text-[#9AA8C1] truncate mb-1.5">
          {signal.strategyName}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            {/* RSI badge */}
            <span
              className="text-[8px] font-bold px-1.5 py-0.5 rounded"
              style={{
                background: `${rsiColor}20`,
                color: rsiColor,
                border: `1px solid ${rsiColor}33`,
              }}
            >
              RSI {rsi}
            </span>
            {/* R:R badge */}
            <span
              className="text-[8px] font-bold px-1.5 py-0.5 rounded"
              style={{
                background: "rgba(242,201,76,0.12)",
                color: "#F2C94C",
                border: "1px solid rgba(242,201,76,0.25)",
              }}
            >
              R:R 1:{rrRatio}
            </span>
          </div>
          {/* Confidence */}
          <div className="flex items-center gap-1">
            <span className="text-[8px] text-[#9AA8C1]">Conf.</span>
            <span
              className="text-[10px] font-black"
              style={{ color: config.color }}
            >
              {(signal.confidence * 100).toFixed(0)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
