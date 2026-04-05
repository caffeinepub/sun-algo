import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertTriangle,
  Award,
  BarChart2,
  Target,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PositionSide } from "../backend.d";
import MetricCard from "../components/MetricCard";
import { usePerformanceMetrics, useTrades } from "../hooks/useQueries";

const MOCK_TRADES = Array.from({ length: 12 }, (_, i) => ({
  id: `t${i}`,
  instrumentSymbol: ["RELIANCE", "TCS", "BTC/USD", "HDFCBANK", "INFY", "GOLD"][
    i % 6
  ],
  side: i % 3 === 0 ? PositionSide.short_ : PositionSide.long_,
  quantity: Math.floor(Math.random() * 50 + 5),
  entryPrice: 2800 + i * 80,
  exitPrice: 2800 + i * 80 + (Math.random() - 0.3) * 200,
  pnl: (Math.random() - 0.3) * 5000,
  strategyName: ["EMA Crossover", "BB Squeeze", "VWAP Scalp"][i % 3],
  openedAt: BigInt(Date.now() - i * 86400000),
  closedAt: BigInt(Date.now() - i * 82000000),
}));

const MOCK_METRICS = {
  winRate: 0.68,
  avgRR: 2.3,
  profitFactor: 1.85,
  maxDrawdown: 0.062,
  totalTrades: BigInt(47),
  totalPnl: 38750,
};

const MONTHLY_RETURNS = {
  2024: [3.2, -1.8, 8.4, 4.1, 2.2, -0.8, 1.4, 3.1, 5.2, 2.8, -0.6, 1.9],
  2025: [5.1, 2.4, -1.2, 9.8, 3.4, 1.1, 2.7, -0.4, 4.2, 3.6, 1.8, 6.1],
};
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const STRATEGY_PERF = [
  { name: "EMA Crossover", trades: 82, winPct: 74, avgPnl: 1.8, total: 28400 },
  { name: "RSI Reversal", trades: 45, winPct: 68, avgPnl: 2.1, total: 18200 },
  { name: "VWAP Bounce", trades: 38, winPct: 71, avgPnl: 1.4, total: 12800 },
  { name: "Bollinger Break", trades: 29, winPct: 62, avgPnl: 0.9, total: 6200 },
  { name: "F&O Momentum", trades: 28, winPct: 82, avgPnl: 4.2, total: 26400 },
];

const PSYCH_WARNINGS = [
  {
    title: "Revenge Trading Detected",
    detail:
      "After 3 consecutive losses, you tend to overtrade (avg 4.2 extra trades). These revenge trades have -68% win rate.",
    recommendation: "After 3 losses, take a 1-hour break.",
  },
  {
    title: "Overtrading Alert",
    detail: "On days you place 8+ trades, your win rate drops from 74% to 51%.",
    recommendation: "Max 6 trades per day recommended for you.",
  },
  {
    title: "FOMO Pattern Detected",
    detail:
      "You enter positions after large moves (when already up 3%+). These have -22% P&L average.",
    recommendation: "Wait for pullback entries instead.",
  },
];

// SVG Donut Chart
function DonutChart({
  value,
  label,
  color,
}: { value: number; label: string; color: string }) {
  const r = 40;
  const cx = 60;
  const cy = 60;
  const circumference = 2 * Math.PI * r;
  const filled = circumference * value;
  const gap = circumference - filled;

  return (
    <div className="flex flex-col items-center">
      <svg width="120" height="120" role="img" aria-label="Donut chart">
        <title>Performance Donut</title>
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="#24344F"
          strokeWidth="10"
        />
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeDasharray={`${filled} ${gap}`}
          strokeLinecap="round"
          transform={`rotate(-90 ${cx} ${cy})`}
        />
        <text
          x={cx}
          y={cy - 6}
          textAnchor="middle"
          fill="#EAF0FF"
          fontSize="16"
          fontWeight="bold"
        >
          {(value * 100).toFixed(0)}%
        </text>
        <text
          x={cx}
          y={cy + 12}
          textAnchor="middle"
          fill="#9AA8C1"
          fontSize="9"
        >
          {label}
        </text>
      </svg>
    </div>
  );
}

function EquityCurve() {
  const points = useMemo(() => {
    let equity = 1000000;
    return Array.from({ length: 30 }, (_, i) => {
      equity += (Math.random() - 0.35) * 8000;
      return { x: i, y: equity };
    });
  }, []);

  const minVal = Math.min(...points.map((p) => p.y));
  const maxVal = Math.max(...points.map((p) => p.y));
  const range = maxVal - minVal || 1;
  const W = 600;
  const H = 120;
  const toX = (i: number) => (i / (points.length - 1)) * W;
  const toY = (v: number) => H - ((v - minVal) / range) * (H - 20) - 10;
  const pathD = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${toX(i)} ${toY(p.y)}`)
    .join(" ");
  const areaD = `${pathD} L ${W} ${H} L 0 ${H} Z`;
  const lastY = points[points.length - 1].y;
  const firstY = points[0].y;
  const isUp = lastY >= firstY;
  const color = isUp ? "#2ED47A" : "#FF5A5F";

  return (
    <div
      className="w-full rounded-lg overflow-hidden"
      style={{ background: "#0B1424" }}
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        style={{ height: "120px" }}
        role="img"
        aria-label="Equity curve chart"
      >
        <title>Equity Curve</title>
        <defs>
          <linearGradient id="eq-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75, 1.0].map((frac) => (
          <line
            key={frac}
            x1="0"
            x2={W}
            y1={H * frac + 10}
            y2={H * frac + 10}
            stroke="#1F2B3F"
            strokeWidth="0.5"
          />
        ))}
        <path d={areaD} fill="url(#eq-grad)" />
        <path d={pathD} stroke={color} strokeWidth="1.5" fill="none" />
        <circle
          cx={toX(points.length - 1)}
          cy={toY(lastY)}
          r="3"
          fill={color}
        />
      </svg>
    </div>
  );
}

function DailyPnlChart() {
  const data = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        day: i + 1,
        pnl: (Math.random() - 0.35) * 6000,
      })),
    [],
  );
  const maxAbs = Math.max(...data.map((d) => Math.abs(d.pnl)));
  const W = 600;
  const H = 100;
  const barW = W / data.length - 2;
  return (
    <div
      className="w-full rounded-lg overflow-hidden"
      style={{ background: "#0B1424" }}
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        style={{ height: "100px" }}
        role="img"
        aria-label="Daily P&L chart"
      >
        <title>Daily P&L</title>
        <line
          x1="0"
          x2={W}
          y1={H / 2}
          y2={H / 2}
          stroke="#24344F"
          strokeWidth="0.5"
        />
        {data.map((d, i) => {
          const isPos = d.pnl >= 0;
          const barH = (Math.abs(d.pnl) / maxAbs) * (H / 2 - 5);
          const x = i * (W / data.length) + 1;
          const y = isPos ? H / 2 - barH : H / 2;
          return (
            <rect
              key={d.day}
              x={x}
              y={y}
              width={barW}
              height={barH}
              fill={isPos ? "#2ED47A" : "#FF5A5F"}
              opacity="0.8"
              rx="1"
            />
          );
        })}
      </svg>
    </div>
  );
}

function MonthlyHeatmap() {
  const getColor = (val: number) => {
    if (val > 8) return { bg: "#065F46", text: "#34D399" };
    if (val > 4) return { bg: "#064E3B", text: "#6EE7B7" };
    if (val > 1) return { bg: "#052E16", text: "#A7F3D0" };
    if (val > -1) return { bg: "#1F2937", text: "#9AA8C1" };
    if (val > -4) return { bg: "#450A0A", text: "#FCA5A5" };
    return { bg: "#7F1D1D", text: "#FCA5A5" };
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="text-[10px] text-[#9AA8C1] w-12 text-right pr-2">
              Year
            </th>
            {MONTHS.map((m) => (
              <th
                key={m}
                className="text-[9px] text-[#9AA8C1] text-center pb-1"
              >
                {m}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {([2024, 2025] as const).map((year) => (
            <tr key={year}>
              <td className="text-[10px] font-bold text-[#9AA8C1] text-right pr-2 py-0.5">
                {year}
              </td>
              {MONTHLY_RETURNS[year].map((val, mi) => {
                const colors = getColor(val);
                return (
                  <td key={MONTHS[mi]} className="p-0.5">
                    <div
                      className="rounded text-center py-1.5 px-1 min-w-[42px]"
                      style={{ background: colors.bg }}
                    >
                      <div
                        className="text-[8px] font-bold"
                        style={{ color: colors.text }}
                      >
                        {val > 0 ? "+" : ""}
                        {val.toFixed(1)}%
                      </div>
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Enhanced equity curve with recharts
function EnhancedEquityCurve() {
  const [zoom, setZoom] = useState("1Y");
  const equityData = useMemo(() => {
    let equity = 500000;
    let nifty = 20000;
    let fd = 500000;
    return Array.from({ length: 365 }, (_, i) => {
      equity += (Math.random() - 0.42) * 2500;
      nifty += (Math.random() - 0.48) * 150;
      fd += (500000 * 0.07) / 365;
      const date = new Date(2025, 0, 1);
      date.setDate(date.getDate() + i);
      return {
        date: `${date.getMonth() + 1}/${date.getDate()}`,
        equity: Math.round(equity),
        nifty: Math.round(nifty),
        fd: Math.round(fd),
      };
    });
  }, []);

  const zoomMap: Record<string, number> = {
    "1W": 7,
    "1M": 30,
    "3M": 90,
    "6M": 180,
    "1Y": 365,
    All: 365,
  };
  const sliced = equityData.slice(-zoomMap[zoom]);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-[#EAF0FF]">
          Equity Curve vs Benchmarks
        </span>
        <div className="flex gap-1">
          {["1W", "1M", "3M", "6M", "1Y", "All"].map((z) => (
            <button
              key={z}
              type="button"
              onClick={() => setZoom(z)}
              className="px-2 py-0.5 rounded text-[9px] font-bold"
              style={{
                background: zoom === z ? "#F2C94C" : "rgba(255,255,255,0.05)",
                color: zoom === z ? "#0B1424" : "#9AA8C1",
              }}
            >
              {z}
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart
          data={sliced}
          margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#1E2C44" />
          <XAxis
            dataKey="date"
            tick={{ fill: "#9AA8C1", fontSize: 8 }}
            interval={Math.floor(sliced.length / 6)}
          />
          <YAxis tick={{ fill: "#9AA8C1", fontSize: 8 }} />
          <Tooltip
            contentStyle={{
              background: "#111E33",
              border: "1px solid #24344F",
              fontSize: 10,
            }}
            formatter={(v: number, name: string) => [
              `Rs${v.toLocaleString()}`,
              name,
            ]}
          />
          <Legend wrapperStyle={{ fontSize: 9, color: "#9AA8C1" }} />
          <Line
            type="monotone"
            dataKey="equity"
            stroke="#10B981"
            strokeWidth={2}
            dot={false}
            name="Portfolio"
          />
          <Line
            type="monotone"
            dataKey="nifty"
            stroke="#F59E0B"
            strokeWidth={1.5}
            strokeDasharray="4 4"
            dot={false}
            name="NIFTY 50"
          />
          <Line
            type="monotone"
            dataKey="fd"
            stroke="#9AA8C1"
            strokeWidth={1}
            strokeDasharray="2 6"
            dot={false}
            name="FD 7%"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// Trade distribution histogram
function TradeDistribution() {
  const bins = [
    "-5",
    "-4",
    "-3",
    "-2",
    "-1",
    "0",
    "+1",
    "+2",
    "+3",
    "+4",
    "+5",
  ];
  const counts = [2, 3, 5, 8, 14, 7, 22, 18, 12, 7, 3];
  const data = bins.map((b, i) => ({
    bin: b,
    count: counts[i],
    isPos: Number(b) >= 0,
  }));
  return (
    <ResponsiveContainer width="100%" height={120}>
      <BarChart data={data} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
        <XAxis dataKey="bin" tick={{ fill: "#9AA8C1", fontSize: 9 }} />
        <YAxis tick={{ fill: "#9AA8C1", fontSize: 9 }} />
        <Tooltip
          contentStyle={{
            background: "#111E33",
            border: "1px solid #24344F",
            fontSize: 10,
          }}
          formatter={(v: number) => [v, "Trades"]}
        />
        <Bar dataKey="count" radius={[3, 3, 0, 0]}>
          {data.map((entry, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: recharts Cell
            <Cell key={i} fill={entry.isPos ? "#10B981" : "#EF4444"} />
          ))}
        </Bar>
        <ReferenceLine x="0" stroke="#9AA8C1" strokeDasharray="3 3" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default function Analytics() {
  const { data: metricsData } = usePerformanceMetrics();
  const { data: tradesData } = useTrades();

  const metrics = metricsData ?? MOCK_METRICS;
  const trades = (
    tradesData && tradesData.length > 0 ? tradesData : MOCK_TRADES
  ).slice(0, 10);
  const totalPnl =
    typeof metrics.totalPnl === "number"
      ? metrics.totalPnl
      : MOCK_METRICS.totalPnl;
  const winRate =
    typeof metrics.winRate === "number"
      ? metrics.winRate
      : MOCK_METRICS.winRate;
  const avgRR =
    typeof metrics.avgRR === "number" ? metrics.avgRR : MOCK_METRICS.avgRR;
  const profitFactor =
    typeof metrics.profitFactor === "number"
      ? metrics.profitFactor
      : MOCK_METRICS.profitFactor;
  const maxDrawdown =
    typeof metrics.maxDrawdown === "number"
      ? metrics.maxDrawdown
      : MOCK_METRICS.maxDrawdown;
  const totalTrades = metrics.totalTrades ?? MOCK_METRICS.totalTrades;

  return (
    <div
      className="px-4 lg:px-6 max-w-[1600px] mx-auto space-y-6"
      data-ocid="analytics.page"
    >
      <h1 className="text-lg font-bold text-[#EAF0FF]">
        Analytics & Performance
      </h1>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <MetricCard
          index={1}
          title="Win Rate"
          value={`${(winRate * 100).toFixed(1)}%`}
          valueColor="#2ED47A"
          icon={<Award className="w-4 h-4" />}
          trend="up"
          trendValue="+2.3% vs last week"
        />
        <MetricCard
          index={2}
          title="Avg R:R"
          value={`${avgRR.toFixed(2)}x`}
          icon={<Target className="w-4 h-4" />}
          trend="up"
          trendValue="+0.1x"
        />
        <MetricCard
          index={3}
          title="Profit Factor"
          value={profitFactor.toFixed(2)}
          valueColor="#F2C94C"
          icon={<BarChart2 className="w-4 h-4" />}
        />
        <MetricCard
          index={4}
          title="Max Drawdown"
          value={`${(maxDrawdown * 100).toFixed(1)}%`}
          valueColor="#FF5A5F"
          icon={<AlertTriangle className="w-4 h-4" />}
          trend="down"
        />
        <MetricCard
          index={5}
          title="Total Trades"
          value={totalTrades.toString()}
          icon={<TrendingUp className="w-4 h-4" />}
        />
        <MetricCard
          index={6}
          title="Total P&L"
          value={`Rs${Math.abs(totalPnl).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`}
          valueColor={totalPnl >= 0 ? "#2ED47A" : "#FF5A5F"}
          trend={totalPnl >= 0 ? "up" : "down"}
          trendValue={totalPnl >= 0 ? "Profitable" : "In Loss"}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 trading-card p-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#EAF0FF] mb-3">
            Equity Curve
          </h2>
          <EquityCurve />
        </div>
        <div className="trading-card p-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#EAF0FF] mb-3">
            Performance Breakdown
          </h2>
          <div className="flex justify-around">
            <DonutChart value={winRate} label="Win Rate" color="#2ED47A" />
            <DonutChart
              value={Math.min(1, maxDrawdown * 10)}
              label="Drawdown"
              color="#FF5A5F"
            />
          </div>
        </div>
      </div>

      {/* Daily P&L */}
      <div className="trading-card p-4">
        <h2 className="text-xs font-bold uppercase tracking-widest text-[#EAF0FF] mb-3">
          Daily P&L (Last 20 Days)
        </h2>
        <DailyPnlChart />
      </div>

      {/* Trade History */}
      <div className="trading-card p-4" data-ocid="trades.panel">
        <h2 className="text-xs font-bold uppercase tracking-widest text-[#EAF0FF] mb-3">
          Trade History
        </h2>
        <Table>
          <TableHeader>
            <TableRow style={{ borderColor: "#24344F" }}>
              {[
                "Symbol",
                "Side",
                "Qty",
                "Entry",
                "Exit",
                "P&L",
                "Strategy",
                "Date",
              ].map((h) => (
                <TableHead
                  key={h}
                  className="text-[#9AA8C1] text-[10px] uppercase"
                >
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {trades.map((trade, i) => {
              const isProfit = trade.pnl >= 0;
              return (
                <TableRow
                  key={trade.id}
                  data-ocid={`trades.row.${i + 1}`}
                  style={{ borderColor: "#1E2C44" }}
                  className="hover:bg-white/5"
                >
                  <TableCell className="font-bold text-xs text-[#EAF0FF]">
                    {trade.instrumentSymbol}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className="text-[9px] py-0"
                      style={{
                        background:
                          trade.side === PositionSide.long_
                            ? "rgba(46,212,122,0.1)"
                            : "rgba(255,90,95,0.1)",
                        color:
                          trade.side === PositionSide.long_
                            ? "#2ED47A"
                            : "#FF5A5F",
                        border:
                          trade.side === PositionSide.long_
                            ? "1px solid #2ED47A44"
                            : "1px solid #FF5A5F44",
                      }}
                    >
                      {trade.side === PositionSide.long_ ? "LONG" : "SHORT"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-[#9AA8C1]">
                    {trade.quantity}
                  </TableCell>
                  <TableCell className="text-xs tabular-nums text-[#EAF0FF]">
                    Rs{trade.entryPrice.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-xs tabular-nums text-[#EAF0FF]">
                    Rs{trade.exitPrice.toLocaleString()}
                  </TableCell>
                  <TableCell
                    className="text-xs font-bold tabular-nums"
                    style={{ color: isProfit ? "#2ED47A" : "#FF5A5F" }}
                  >
                    {isProfit ? "+" : ""}Rs{trade.pnl.toFixed(0)}
                  </TableCell>
                  <TableCell className="text-[10px] text-[#9AA8C1]">
                    {trade.strategyName}
                  </TableCell>
                  <TableCell className="text-[10px] text-[#9AA8C1]">
                    {new Date(Number(trade.openedAt)).toLocaleDateString(
                      "en-IN",
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* === NEW SECTIONS BELOW === */}

      {/* Enhanced Equity Curve */}
      <div className="trading-card p-4">
        <EnhancedEquityCurve />
      </div>

      {/* Monthly Returns Heatmap */}
      <div className="trading-card p-4">
        <h2 className="text-xs font-bold uppercase tracking-widest text-[#EAF0FF] mb-3">
          Monthly Returns Heatmap
        </h2>
        <MonthlyHeatmap />
      </div>

      {/* Trade Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="trading-card p-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#EAF0FF] mb-3">
            P&L Distribution Histogram
          </h2>
          <TradeDistribution />
          <p className="text-[10px] text-[#9AA8C1] mt-2">
            Distribution of individual trade returns (%)
          </p>
        </div>
        <div className="trading-card p-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#EAF0FF] mb-3">
            Day of Week Analysis
          </h2>
          <div className="space-y-2">
            {[
              { day: "Monday", avg: 2.1, trades: 18, color: "#10B981" },
              { day: "Tuesday", avg: 0.8, trades: 22, color: "#34D399" },
              { day: "Wednesday", avg: 1.9, trades: 20, color: "#10B981" },
              { day: "Thursday", avg: -0.4, trades: 15, color: "#EF4444" },
              { day: "Friday", avg: 1.2, trades: 17, color: "#34D399" },
            ].map((d) => (
              <div key={d.day} className="flex items-center gap-3">
                <span className="text-[10px] text-[#9AA8C1] w-20">{d.day}</span>
                <div
                  className="flex-1 h-2 rounded-full"
                  style={{ background: "#1E2C44" }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.abs(d.avg) * 20}%`,
                      background: d.avg >= 0 ? "#10B981" : "#EF4444",
                    }}
                  />
                </div>
                <span
                  className="text-[10px] font-bold tabular-nums w-12 text-right"
                  style={{ color: d.avg >= 0 ? "#10B981" : "#EF4444" }}
                >
                  {d.avg >= 0 ? "+" : ""}
                  {d.avg.toFixed(1)}%
                </span>
                <span className="text-[9px] text-[#9AA8C1]">{d.trades}t</span>
              </div>
            ))}
          </div>
          <p className="text-[9px] text-[#F59E0B] mt-2">
            Thursday is historically your weakest day
          </p>
        </div>
      </div>

      {/* Strategy Performance */}
      <div className="trading-card p-4">
        <h2 className="text-xs font-bold uppercase tracking-widest text-[#EAF0FF] mb-3">
          Strategy Performance Breakdown
        </h2>
        <Table>
          <TableHeader>
            <TableRow style={{ borderColor: "#24344F" }}>
              {[
                "Strategy",
                "Trades",
                "Win %",
                "Avg P&L",
                "Total P&L",
                "Action",
              ].map((h) => (
                <TableHead
                  key={h}
                  className="text-[#9AA8C1] text-[9px] uppercase"
                >
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {STRATEGY_PERF.map((s) => {
              const winColor =
                s.winPct >= 70
                  ? "#10B981"
                  : s.winPct >= 60
                    ? "#F59E0B"
                    : "#EF4444";
              return (
                <TableRow
                  key={s.name}
                  style={{ borderColor: "#1E2C44" }}
                  className="hover:bg-white/5"
                >
                  <TableCell className="text-xs font-bold text-[#EAF0FF]">
                    {s.name}
                  </TableCell>
                  <TableCell className="text-xs text-[#9AA8C1]">
                    {s.trades}
                  </TableCell>
                  <TableCell
                    className="text-xs font-bold"
                    style={{ color: winColor }}
                  >
                    {s.winPct}%
                  </TableCell>
                  <TableCell className="text-xs" style={{ color: "#10B981" }}>
                    +{s.avgPnl.toFixed(1)}%
                  </TableCell>
                  <TableCell className="text-xs font-bold text-[#10B981]">
                    +Rs{s.total.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        className="h-5 text-[8px] px-1.5"
                        style={{
                          background: "rgba(16,185,129,0.15)",
                          color: "#10B981",
                          border: "1px solid #10B98133",
                        }}
                      >
                        Enable
                      </Button>
                      <Button
                        className="h-5 text-[8px] px-1.5"
                        style={{
                          background: "rgba(239,68,68,0.1)",
                          color: "#EF4444",
                          border: "1px solid #EF444422",
                        }}
                      >
                        Disable
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Psychology Tracker */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-widest text-[#EAF0FF] mb-3">
          Psychology Tracker
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PSYCH_WARNINGS.map((warn) => (
            <div
              key={warn.title}
              className="trading-card p-4"
              style={{
                border: "1px solid rgba(245,158,11,0.3)",
                background: "rgba(245,158,11,0.04)",
              }}
            >
              <div className="flex items-start gap-2 mb-2">
                <AlertTriangle
                  className="w-4 h-4 mt-0.5 flex-shrink-0"
                  style={{ color: "#F59E0B" }}
                />
                <span
                  className="text-xs font-bold"
                  style={{ color: "#F59E0B" }}
                >
                  {warn.title}
                </span>
              </div>
              <p className="text-xs text-[#9AA8C1] mb-2">{warn.detail}</p>
              <p className="text-xs" style={{ color: "#10B981" }}>
                Recommendation: {warn.recommendation}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
