import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import type { StrategyConfig, StrategyType } from "../backend.d";

interface StrategyCardProps {
  strategy: StrategyConfig;
  index?: number;
  onToggle?: (id: string, enabled: boolean) => void;
}

function getStrategyTypeConfig(type: StrategyType) {
  switch (type) {
    case "trendFollowing":
      return { label: "Trend Following", color: "#2ED47A" };
    case "meanReversion":
      return { label: "Mean Reversion", color: "#F2C94C" };
    case "scalping":
      return { label: "Scalping", color: "#60AFFF" };
    case "breakout":
      return { label: "Breakout", color: "#FF8C42" };
    case "arbitrage":
      return { label: "Arbitrage", color: "#C77DFF" };
    case "marketMaking":
      return { label: "Market Making", color: "#FF5A5F" };
    default:
      return { label: type, color: "#9AA8C1" };
  }
}

// Simulated mini sparkline chart
function MiniChart({ color }: { color: string }) {
  const points = Array.from({ length: 10 }, (_, i) => {
    const noise = Math.sin(i * 0.8) * 15 + Math.random() * 10;
    return { x: i * 28, y: 30 - noise };
  });
  const pathD = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  return (
    <svg
      width="100%"
      height="40"
      viewBox="0 0 252 40"
      preserveAspectRatio="none"
      className="mt-2"
      aria-label="Strategy performance chart"
      role="img"
    >
      <title>Performance Chart</title>
      <defs>
        <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${pathD} L 252 40 L 0 40 Z`} fill={`url(#grad-${color})`} />
      <path d={pathD} stroke={color} strokeWidth="1.5" fill="none" />
    </svg>
  );
}

export default function StrategyCard({
  strategy,
  index = 1,
  onToggle,
}: StrategyCardProps) {
  const typeConfig = getStrategyTypeConfig(
    strategy.strategyType as StrategyType,
  );

  return (
    <div
      data-ocid={`strategies.item.${index}`}
      className="trading-card p-4 hover:shadow-card transition-shadow"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-bold text-sm text-[#EAF0FF] mb-1">
            {strategy.name}
          </h3>
          <Badge
            className="text-[9px] py-0 px-1.5"
            style={{
              background: `${typeConfig.color}22`,
              color: typeConfig.color,
              border: `1px solid ${typeConfig.color}44`,
            }}
          >
            {typeConfig.label}
          </Badge>
        </div>
        <Switch
          data-ocid={`strategies.switch.${index}`}
          checked={strategy.enabled}
          onCheckedChange={(checked) => onToggle?.(strategy.id, checked)}
          style={strategy.enabled ? { background: "#2ED47A" } : {}}
        />
      </div>

      <MiniChart color={typeConfig.color} />

      <div className="grid grid-cols-2 gap-2 mt-3">
        <div className="bg-white/5 rounded-lg p-2">
          <div className="text-[9px] text-[#9AA8C1] mb-0.5">
            Daily Loss Limit
          </div>
          <div className="text-sm font-bold" style={{ color: "#F2C94C" }}>
            {strategy.riskSettings.dailyLossLimitPct}%
          </div>
        </div>
        <div className="bg-white/5 rounded-lg p-2">
          <div className="text-[9px] text-[#9AA8C1] mb-0.5">Stop Loss</div>
          <div className="text-sm font-bold text-[#EAF0FF]">
            {strategy.riskSettings.perTradeStopLossPct}%
          </div>
        </div>
        <div className="bg-white/5 rounded-lg p-2">
          <div className="text-[9px] text-[#9AA8C1] mb-0.5">Max Positions</div>
          <div className="text-sm font-bold text-[#EAF0FF]">
            {strategy.riskSettings.maxPositions.toString()}
          </div>
        </div>
        <div className="bg-white/5 rounded-lg p-2">
          <div className="text-[9px] text-[#9AA8C1] mb-0.5">Position Size</div>
          <div className="text-sm font-bold text-[#EAF0FF]">
            {strategy.riskSettings.positionSizePct}%
          </div>
        </div>
      </div>
    </div>
  );
}
