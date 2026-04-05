import type { Signal, SignalType } from "../backend.d";

interface SignalCardProps {
  signal: Signal;
  index?: number;
  marketClosed?: boolean;
  nextOpenTime?: string;
}

function getSignalConfig(type: SignalType) {
  switch (type) {
    case "strongBuy":
      return {
        label: "🟢 STRONG BUY",
        color: "#2ED47A",
        bg: "rgba(46,212,122,0.1)",
        borderClass: "signal-strong-buy",
      };
    case "buy":
      return {
        label: "🔵 BUY",
        color: "#2ED47A",
        bg: "rgba(46,212,122,0.07)",
        borderClass: "signal-buy",
      };
    case "sell":
      return {
        label: "🔴 SELL",
        color: "#FF5A5F",
        bg: "rgba(255,90,95,0.07)",
        borderClass: "signal-sell",
      };
    case "strongSell":
      return {
        label: "🔴 STRONG SELL",
        color: "#FF5A5F",
        bg: "rgba(255,90,95,0.1)",
        borderClass: "signal-strong-sell",
      };
    default:
      return {
        label: "⚪ NEUTRAL",
        color: "#E7D27C",
        bg: "rgba(231,210,124,0.07)",
        borderClass: "signal-neutral",
      };
  }
}

export default function SignalCard({
  signal,
  index = 1,
  marketClosed = false,
  nextOpenTime,
}: SignalCardProps) {
  const config = getSignalConfig(signal.signalType as SignalType);
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

  return (
    <div
      data-ocid={`signals.item.${index}`}
      className={`trading-card market-dim-card relative p-3 ${config.borderClass} hover:shadow-card transition-shadow`}
      style={{ background: config.bg }}
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
          className="text-[10px] font-bold px-2 py-0.5 rounded-full"
          style={{ color: config.color, background: `${config.color}22` }}
        >
          {config.label}
        </span>
      </div>

      <div className="space-y-1 mb-2">
        <div className="flex justify-between text-[11px]">
          <span className="text-[#9AA8C1]">Entry</span>
          <span className="font-semibold text-[#EAF0FF]">
            ₹{signal.entryPrice.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between text-[11px]">
          <span className="text-[#9AA8C1]">Target</span>
          <span className="font-semibold" style={{ color: "#2ED47A" }}>
            ₹{signal.targetPrice.toLocaleString()}{" "}
            <span className="text-[9px]">+{gainPct}%</span>
          </span>
        </div>
        <div className="flex justify-between text-[11px]">
          <span className="text-[#9AA8C1]">Stop Loss</span>
          <span className="font-semibold" style={{ color: "#FF5A5F" }}>
            ₹{signal.stopLoss.toLocaleString()}{" "}
            <span className="text-[9px]">-{slPct}%</span>
          </span>
        </div>
      </div>

      <div
        className="flex items-center justify-between border-t pt-2"
        style={{ borderColor: "#24344F" }}
      >
        <span className="text-[9px] text-[#9AA8C1] truncate max-w-[60%]">
          {signal.strategyName}
        </span>
        <div className="flex items-center gap-1">
          <span className="text-[9px] text-[#9AA8C1]">Conf.</span>
          <span
            className="text-[10px] font-bold"
            style={{ color: config.color }}
          >
            {(signal.confidence * 100).toFixed(0)}%
          </span>
        </div>
      </div>
    </div>
  );
}
