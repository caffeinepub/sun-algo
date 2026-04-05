import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  BarChart2,
  ChevronDown,
  Layers,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const TIMEFRAMES = ["5m", "15m", "1H", "1D", "1W"];

const SYMBOLS = [
  "NIFTY50",
  "RELIANCE",
  "HDFCBANK",
  "TCS",
  "BANKNIFTY",
  "INFY",
  "SBIN",
];

const NIFTY_STOCKS = [
  { symbol: "RELIANCE", change: 2.34, sector: "Energy" },
  { symbol: "TCS", change: -0.56, sector: "IT" },
  { symbol: "HDFCBANK", change: 0.51, sector: "Banking" },
  { symbol: "INFY", change: -1.12, sector: "IT" },
  { symbol: "ICICIBANK", change: 1.87, sector: "Banking" },
  { symbol: "HINDUNILVR", change: 0.32, sector: "FMCG" },
  { symbol: "ITC", change: 1.45, sector: "FMCG" },
  { symbol: "SBIN", change: 2.81, sector: "Banking" },
  { symbol: "BAJFINANCE", change: -2.14, sector: "Finance" },
  { symbol: "LT", change: 1.22, sector: "Infra" },
  { symbol: "AXISBANK", change: 0.98, sector: "Banking" },
  { symbol: "WIPRO", change: -0.87, sector: "IT" },
  { symbol: "ASIANPAINT", change: -1.34, sector: "Consumer" },
  { symbol: "MARUTI", change: 3.12, sector: "Auto" },
  { symbol: "SUNPHARMA", change: 0.67, sector: "Pharma" },
  { symbol: "TATAMOTORS", change: 4.82, sector: "Auto" },
  { symbol: "M&M", change: 1.54, sector: "Auto" },
  { symbol: "NTPC", change: 5.14, sector: "Power" },
  { symbol: "POWERGRID", change: 2.23, sector: "Power" },
  { symbol: "BHARTIARTL", change: 0.44, sector: "Telecom" },
];

const PATTERNS = [
  {
    name: "Bullish Engulfing",
    timeframe: "15min",
    bullish: true,
    successRate: 72,
    confidence: 84,
  },
  {
    name: "Ascending Triangle",
    timeframe: "1H",
    bullish: true,
    successRate: 68,
    confidence: 78,
  },
  {
    name: "Hammer at Support",
    timeframe: "5min",
    bullish: true,
    successRate: 71,
    confidence: 81,
  },
  {
    name: "Evening Star",
    timeframe: "1D",
    bullish: false,
    successRate: 69,
    confidence: 76,
  },
];

const MTF_FRAMES = [
  { tf: "5 MIN", trend: "bullish", signal: "BUY" },
  { tf: "15 MIN", trend: "bullish", signal: "BUY" },
  { tf: "1 HOUR", trend: "bearish", signal: "WAIT" },
  { tf: "1 DAY", trend: "bullish", signal: "BUY" },
];

type IndicatorToggle = {
  key: string;
  label: string;
  desc: string;
  color: string;
};

const INDICATORS: IndicatorToggle[] = [
  {
    key: "superSignal",
    label: "SA_SuperSignal",
    desc: "EMA+RSI+Vol+ATR",
    color: "#F2C94C",
  },
  {
    key: "smartSR",
    label: "SA_SmartSR",
    desc: "Support/Resistance",
    color: "#3B82F6",
  },
  {
    key: "volumeProfile",
    label: "SA_VolumeProfile",
    desc: "Volume at price",
    color: "#8B5CF6",
  },
  {
    key: "marketStructure",
    label: "SA_MarketStructure",
    desc: "HH/HL/LH/LL",
    color: "#10B981",
  },
  {
    key: "fibonacci",
    label: "SA_FibonacciAuto",
    desc: "23.6-78.6% levels",
    color: "#EC4899",
  },
  {
    key: "smartMoney",
    label: "SA_SmartMoney",
    desc: "Institutional flow",
    color: "#F97316",
  },
];

function generateCandleData(numCandles: number) {
  let price = 2847;
  return Array.from({ length: numCandles }, (_, i) => {
    const open = price;
    const change = (Math.random() - 0.48) * 20;
    const close = open + change;
    const high = Math.max(open, close) + Math.random() * 8;
    const low = Math.min(open, close) - Math.random() * 8;
    const volume = Math.floor(Math.random() * 5000000 + 1000000);
    price = close;
    return {
      idx: i,
      open: Number(open.toFixed(2)),
      close: Number(close.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      volume,
      label: `${9 + Math.floor(i / 4)}:${(i % 4) * 15 || "00"}`,
    };
  });
}

function getHeatColor(change: number): string {
  if (change > 4) return "#059669";
  if (change > 2) return "#10B981";
  if (change > 0.5) return "#34D399";
  if (change > -0.5) return "#6B7280";
  if (change > -2) return "#F87171";
  if (change > -4) return "#EF4444";
  return "#991B1B";
}

export default function AdvancedCharts() {
  const [symbol, setSymbol] = useState("NIFTY50");
  const [timeframe, setTimeframe] = useState("15m");
  const [indicators, setIndicators] = useState<Record<string, boolean>>({});
  const [selectedHeat, setSelectedHeat] = useState<string | null>(null);

  const candleData = useMemo(() => {
    void symbol;
    void timeframe;
    return generateCandleData(40);
  }, [symbol, timeframe]);

  const toggleIndicator = (key: string) => {
    setIndicators((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const bullishCount = MTF_FRAMES.filter((f) => f.trend === "bullish").length;

  // reference lines for indicators
  const srLevels = [2810, 2840, 2870, 2900];
  const fibLevels = [
    2847 * 0.764,
    2847 * 0.854,
    2847 * 0.9,
    2847 * 0.938,
    2847 * 0.964,
  ];

  return (
    <div
      className="px-4 lg:px-6 max-w-[1600px] mx-auto space-y-5 pb-6"
      data-ocid="charts.page"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-lg font-bold text-[#EAF0FF] flex items-center gap-2">
          <BarChart2 className="w-5 h-5" style={{ color: "#F2C94C" }} />
          Advanced Charts
        </h1>
        <div className="flex items-center gap-2 ml-auto">
          {/* Symbol selector */}
          <div className="relative">
            <select
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              className="appearance-none pl-3 pr-7 py-1.5 rounded-lg text-xs font-semibold text-[#EAF0FF]"
              style={{ background: "#111E33", border: "1px solid #24344F" }}
            >
              {SYMBOLS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-[#9AA8C1] pointer-events-none" />
          </div>
          {/* Timeframe */}
          <div className="flex gap-1">
            {TIMEFRAMES.map((tf) => (
              <button
                key={tf}
                type="button"
                onClick={() => setTimeframe(tf)}
                className="px-2.5 py-1 rounded text-[10px] font-bold uppercase transition-all"
                style={{
                  background:
                    timeframe === tf ? "#F2C94C" : "rgba(255,255,255,0.05)",
                  color: timeframe === tf ? "#0B1424" : "#9AA8C1",
                }}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-5">
        {/* Main Chart */}
        <div className="flex-1 space-y-4">
          <div className="trading-card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#EAF0FF]">
                {symbol} — {timeframe} Chart
              </span>
              <div className="flex items-center gap-2">
                <span
                  className="text-xs font-bold"
                  style={{ color: "#10B981" }}
                >
                  2,847.50
                </span>
                <Badge
                  style={{
                    background: "rgba(16,185,129,0.15)",
                    color: "#10B981",
                    border: "1px solid #10B98133",
                  }}
                  className="text-[9px]"
                >
                  +0.65%
                </Badge>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <ComposedChart
                data={candleData}
                margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1E2C44" />
                <XAxis
                  dataKey="label"
                  tick={{ fill: "#9AA8C1", fontSize: 9 }}
                  interval={7}
                />
                <YAxis
                  tick={{ fill: "#9AA8C1", fontSize: 9 }}
                  domain={["auto", "auto"]}
                />
                <Tooltip
                  contentStyle={{
                    background: "#111E33",
                    border: "1px solid #24344F",
                    fontSize: 11,
                  }}
                  labelStyle={{ color: "#EAF0FF" }}
                />
                {/* Candlestick approximation using bars */}
                <Bar dataKey="high" fill="transparent" />
                <Bar dataKey="close" barSize={6}>
                  {candleData.map((entry) => (
                    <Cell
                      key={entry.idx}
                      fill={entry.close >= entry.open ? "#10B981" : "#EF4444"}
                    />
                  ))}
                </Bar>
                {/* Support/Resistance lines */}
                {indicators.smartSR &&
                  srLevels.map((level) => (
                    <ReferenceLine
                      key={level}
                      y={level}
                      stroke="#3B82F6"
                      strokeDasharray="4 4"
                      label={{
                        value: `SR ${level}`,
                        fill: "#3B82F6",
                        fontSize: 9,
                      }}
                    />
                  ))}
                {/* Fibonacci levels */}
                {indicators.fibonacci &&
                  fibLevels.map((level) => (
                    <ReferenceLine
                      key={level.toFixed(2)}
                      y={level}
                      stroke="#EC4899"
                      strokeDasharray="2 6"
                    />
                  ))}
              </ComposedChart>
            </ResponsiveContainer>

            {/* Volume bars */}
            <ResponsiveContainer width="100%" height={60}>
              <ComposedChart
                data={candleData}
                margin={{ top: 0, right: 5, bottom: 0, left: 5 }}
              >
                <XAxis dataKey="label" hide />
                <YAxis hide />
                <Bar dataKey="volume" barSize={4}>
                  {candleData.map((entry) => (
                    <Cell
                      key={entry.idx}
                      fill={
                        entry.close >= entry.open
                          ? "rgba(16,185,129,0.5)"
                          : "rgba(239,68,68,0.5)"
                      }
                    />
                  ))}
                </Bar>
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* MTF Panel */}
          <div className="trading-card p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-[#9AA8C1] flex items-center gap-1">
                <Layers className="w-3.5 h-3.5" /> Multi-Timeframe Analysis
              </h2>
              <Badge
                style={{
                  background:
                    bullishCount >= 3
                      ? "rgba(16,185,129,0.2)"
                      : "rgba(245,158,11,0.2)",
                  color: bullishCount >= 3 ? "#10B981" : "#F59E0B",
                  border: `1px solid ${bullishCount >= 3 ? "#10B98144" : "#F59E0B44"}`,
                }}
                className="text-[10px]"
              >
                {bullishCount}/4 bullish —{" "}
                {bullishCount >= 3
                  ? "STRONG BUY"
                  : bullishCount >= 2
                    ? "MODERATE"
                    : "WAIT"}
              </Badge>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {MTF_FRAMES.map((frame) => (
                <div
                  key={frame.tf}
                  className="rounded-xl p-3 text-center"
                  style={{
                    border: `2px solid ${frame.trend === "bullish" ? "#10B98166" : "#EF444466"}`,
                    background:
                      frame.trend === "bullish"
                        ? "rgba(16,185,129,0.06)"
                        : "rgba(239,68,68,0.06)",
                  }}
                >
                  <div className="text-[10px] font-bold text-[#9AA8C1] mb-2">
                    {frame.tf}
                  </div>
                  <div className="h-12 flex items-center justify-center">
                    {frame.trend === "bullish" ? (
                      <TrendingUp
                        className="w-6 h-6"
                        style={{ color: "#10B981" }}
                      />
                    ) : (
                      <TrendingDown
                        className="w-6 h-6"
                        style={{ color: "#EF4444" }}
                      />
                    )}
                  </div>
                  <Badge
                    className="text-[9px]"
                    style={{
                      background:
                        frame.trend === "bullish"
                          ? "rgba(16,185,129,0.2)"
                          : "rgba(239,68,68,0.2)",
                      color: frame.trend === "bullish" ? "#10B981" : "#EF4444",
                    }}
                  >
                    {frame.signal}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Pattern Recognition */}
          <div className="trading-card p-4">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-[#9AA8C1] mb-3">
              Pattern Recognition
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {PATTERNS.map((pat) => (
                <div
                  key={pat.name}
                  className="flex items-center justify-between p-3 rounded-lg"
                  style={{
                    background: pat.bullish
                      ? "rgba(16,185,129,0.06)"
                      : "rgba(239,68,68,0.06)",
                    border: `1px solid ${pat.bullish ? "#10B98133" : "#EF444433"}`,
                  }}
                >
                  <div className="flex items-center gap-2">
                    {pat.bullish ? (
                      <TrendingUp
                        className="w-4 h-4"
                        style={{ color: "#10B981" }}
                      />
                    ) : (
                      <TrendingDown
                        className="w-4 h-4"
                        style={{ color: "#EF4444" }}
                      />
                    )}
                    <div>
                      <div
                        className="text-xs font-bold"
                        style={{ color: pat.bullish ? "#10B981" : "#EF4444" }}
                      >
                        {pat.name}
                      </div>
                      <div className="text-[9px] text-[#9AA8C1]">
                        {pat.timeframe} chart — {pat.successRate}% success rate
                      </div>
                    </div>
                  </div>
                  <Badge
                    className="text-[9px]"
                    style={{
                      background: "rgba(242,201,76,0.15)",
                      color: "#F2C94C",
                      border: "1px solid #F2C94C33",
                    }}
                  >
                    {pat.confidence}%
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* NIFTY 50 Heatmap */}
          <div className="trading-card p-4">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-[#9AA8C1] mb-3">
              NIFTY 50 Market Heatmap
            </h2>
            <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-10 gap-1">
              {NIFTY_STOCKS.map((stock) => (
                <button
                  key={stock.symbol}
                  type="button"
                  onClick={() => {
                    setSelectedHeat(stock.symbol);
                    setSymbol(stock.symbol.split("&")[0]);
                  }}
                  title={`${stock.symbol}: ${stock.change > 0 ? "+" : ""}${stock.change.toFixed(2)}%`}
                  className="rounded-lg p-2 flex flex-col items-center justify-center transition-transform hover:scale-105"
                  style={{
                    background: getHeatColor(stock.change),
                    opacity:
                      selectedHeat && selectedHeat !== stock.symbol ? 0.7 : 1,
                    border:
                      selectedHeat === stock.symbol
                        ? "2px solid #F2C94C"
                        : "1px solid transparent",
                    minHeight: "48px",
                  }}
                >
                  <div className="text-[8px] font-bold text-white truncate w-full text-center">
                    {stock.symbol.slice(0, 6)}
                  </div>
                  <div className="text-[8px] text-white/80">
                    {stock.change > 0 ? "+" : ""}
                    {stock.change.toFixed(1)}%
                  </div>
                </button>
              ))}
            </div>
            <div className="mt-2 flex items-center gap-2 text-[9px] text-[#9AA8C1]">
              <span>Click any stock to load chart</span>
              {selectedHeat && (
                <span style={{ color: "#F2C94C" }}>
                  Selected: {selectedHeat}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Indicator Sidebar */}
        <div className="lg:w-52 space-y-2">
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-[#9AA8C1]">
            Proprietary Indicators
          </h2>
          {INDICATORS.map((ind) => (
            <div
              key={ind.key}
              className="trading-card p-3"
              style={{
                border: indicators[ind.key]
                  ? `1px solid ${ind.color}55`
                  : undefined,
              }}
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  className="text-[10px] font-bold"
                  style={{ color: indicators[ind.key] ? ind.color : "#9AA8C1" }}
                >
                  {ind.label}
                </span>
                <Switch
                  checked={!!indicators[ind.key]}
                  onCheckedChange={() => toggleIndicator(ind.key)}
                  data-ocid="charts.toggle"
                />
              </div>
              <div className="text-[9px] text-[#6B7280]">{ind.desc}</div>
              {indicators[ind.key] && (
                <div
                  className="mt-1.5 w-full h-0.5 rounded-full"
                  style={{ background: ind.color }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
