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
  Calendar,
  Download,
  FileText,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

const PERIODS = ["Today", "This Week", "This Month", "3 Months"];

const STRATEGY_REPORT = [
  {
    name: "EMA Crossover + RSI",
    trades: 18,
    winRate: 72,
    totalPnl: 18450,
    profitFactor: 2.1,
    maxDD: 3.2,
  },
  {
    name: "Bollinger Band Squeeze",
    trades: 12,
    winRate: 67,
    totalPnl: 9870,
    profitFactor: 1.85,
    maxDD: 4.8,
  },
  {
    name: "VWAP Scalping",
    trades: 32,
    winRate: 61,
    totalPnl: 7240,
    profitFactor: 1.62,
    maxDD: 2.1,
  },
  {
    name: "Supertrend Breakout",
    trades: 9,
    winRate: 78,
    totalPnl: 12540,
    profitFactor: 2.4,
    maxDD: 5.6,
  },
  {
    name: "Swing + Multi-TF",
    trades: 6,
    winRate: 83,
    totalPnl: 15200,
    profitFactor: 3.1,
    maxDD: 7.2,
  },
];

// SVG Daily P&L bar chart
function DailyPnlChart({ period }: { period: string }) {
  const data = useMemo(() => {
    const days =
      period === "Today"
        ? 1
        : period === "This Week"
          ? 5
          : period === "This Month"
            ? 20
            : 60;
    return Array.from({ length: days }, (_, i) => ({
      day: i + 1,
      pnl: (Math.random() - 0.35) * 6000,
    }));
  }, [period]);

  const maxAbs = Math.max(...data.map((d) => Math.abs(d.pnl)), 1);
  const W = 600;
  const H = 100;
  const barW = Math.max(2, W / data.length - 2);

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
              height={Math.max(1, barH)}
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

// Max Drawdown chart
function MaxDrawdownChart() {
  const points = useMemo(() => {
    let val = 0;
    return Array.from({ length: 30 }, (_, i) => {
      val = Math.min(
        0,
        val - Math.random() * 0.5 + (Math.random() > 0.4 ? 0.4 : 0),
      );
      return { x: i, y: val };
    });
  }, []);

  const minVal = Math.min(...points.map((p) => p.y));
  const W = 600;
  const H = 80;
  const toX = (i: number) => (i / (points.length - 1)) * W;
  const toY = (v: number) => ((v - 0) / (minVal - 0)) * (H - 10) + 5;
  const pathD = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${toX(i)} ${toY(p.y)}`)
    .join(" ");

  return (
    <div
      className="w-full rounded-lg overflow-hidden"
      style={{ background: "#0B1424" }}
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        style={{ height: "80px" }}
        role="img"
        aria-label="Max drawdown chart"
      >
        <title>Max Drawdown</title>
        <path
          d={`${pathD} L ${W} ${H} L 0 ${H} Z`}
          fill="rgba(255,90,95,0.15)"
        />
        <path d={pathD} stroke="#FF5A5F" strokeWidth="1.5" fill="none" />
      </svg>
    </div>
  );
}

export default function Reports() {
  const [period, setPeriod] = useState("This Month");

  const totalPnl = 63300;
  const totalTrades = 77;
  const winRate = 71;

  return (
    <div
      className="px-4 lg:px-6 max-w-[1600px] mx-auto space-y-6"
      data-ocid="reports.page"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-[#EAF0FF]">
          Reports & Analytics
        </h1>
        <div className="flex items-center gap-2">
          {/* Period Selector */}
          <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1">
            {PERIODS.map((p) => (
              <button
                key={p}
                type="button"
                data-ocid="reports.tab"
                onClick={() => setPeriod(p)}
                className="px-3 py-1 rounded text-[10px] font-semibold transition-colors"
                style={{
                  background: period === p ? "#F2C94C" : "transparent",
                  color: period === p ? "#0B1424" : "#9AA8C1",
                }}
              >
                {p}
              </button>
            ))}
          </div>
          {/* Export Buttons */}
          <Button
            data-ocid="reports.secondary_button"
            onClick={() => toast.info("Export feature coming soon")}
            variant="outline"
            className="h-8 text-xs gap-1.5 border-[#24344F] bg-transparent text-[#9AA8C1] hover:text-white"
          >
            <FileText className="w-3.5 h-3.5" /> PDF
          </Button>
          <Button
            data-ocid="reports.secondary_button"
            onClick={() => toast.info("Export feature coming soon")}
            variant="outline"
            className="h-8 text-xs gap-1.5 border-[#24344F] bg-transparent text-[#9AA8C1] hover:text-white"
          >
            <Download className="w-3.5 h-3.5" /> Excel
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="trading-card p-4">
          <div className="text-[10px] text-[#9AA8C1] uppercase tracking-wider mb-1">
            Period
          </div>
          <div
            className="text-lg font-bold flex items-center gap-1.5"
            style={{ color: "#F2C94C" }}
          >
            <Calendar className="w-4 h-4" /> {period}
          </div>
        </div>
        <div className="trading-card p-4">
          <div className="text-[10px] text-[#9AA8C1] uppercase tracking-wider mb-1">
            Total P&L
          </div>
          <div
            className="text-lg font-bold tabular-nums"
            style={{ color: totalPnl >= 0 ? "#2ED47A" : "#FF5A5F" }}
          >
            +₹{totalPnl.toLocaleString("en-IN")}
          </div>
          <div className="text-[10px]" style={{ color: "#2ED47A" }}>
            +6.33% on capital
          </div>
        </div>
        <div className="trading-card p-4">
          <div className="text-[10px] text-[#9AA8C1] uppercase tracking-wider mb-1">
            Total Trades
          </div>
          <div className="text-lg font-bold text-[#EAF0FF]">{totalTrades}</div>
          <div className="text-[10px] text-[#9AA8C1]">
            {Math.round((totalTrades * winRate) / 100)} wins /{" "}
            {Math.round(totalTrades * (1 - winRate / 100))} losses
          </div>
        </div>
        <div className="trading-card p-4">
          <div className="text-[10px] text-[#9AA8C1] uppercase tracking-wider mb-1">
            Win Rate
          </div>
          <div className="text-lg font-bold" style={{ color: "#2ED47A" }}>
            {winRate}%
          </div>
          <div
            className="flex items-center gap-1 text-[10px]"
            style={{ color: "#2ED47A" }}
          >
            <TrendingUp className="w-3 h-3" /> +3% vs last period
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="trading-card p-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#EAF0FF] mb-3">
            Daily P&L Breakdown
          </h2>
          <DailyPnlChart period={period} />
        </div>
        <div className="trading-card p-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#EAF0FF] mb-3">
            Max Drawdown
          </h2>
          <MaxDrawdownChart />
          <div className="flex justify-between text-xs mt-2">
            <span className="text-[#9AA8C1]">Max DD: -6.2%</span>
            <span
              className="flex items-center gap-1"
              style={{ color: "#2ED47A" }}
            >
              <TrendingDown className="w-3 h-3" /> Current: -1.8%
            </span>
          </div>
        </div>
      </div>

      {/* Strategy Performance Table */}
      <div className="trading-card p-4">
        <h2 className="text-xs font-bold uppercase tracking-widest text-[#EAF0FF] mb-3">
          Strategy Performance
        </h2>
        <Table>
          <TableHeader>
            <TableRow style={{ borderColor: "#24344F" }}>
              {[
                "Strategy",
                "Trades",
                "Win Rate",
                "Total P&L",
                "Profit Factor",
                "Max DD",
                "Status",
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
            {STRATEGY_REPORT.map((strat, i) => (
              <TableRow
                key={strat.name}
                data-ocid={`reports.row.${i + 1}`}
                style={{ borderColor: "#1E2C44" }}
                className="hover:bg-white/5"
              >
                <TableCell className="font-semibold text-xs text-[#EAF0FF]">
                  {strat.name}
                </TableCell>
                <TableCell className="text-xs text-[#9AA8C1]">
                  {strat.trades}
                </TableCell>
                <TableCell>
                  <span
                    className="text-xs font-semibold"
                    style={{
                      color:
                        strat.winRate >= 70
                          ? "#2ED47A"
                          : strat.winRate >= 55
                            ? "#E7D27C"
                            : "#FF5A5F",
                    }}
                  >
                    {strat.winRate}%
                  </span>
                </TableCell>
                <TableCell>
                  <span
                    className="text-xs font-bold tabular-nums"
                    style={{
                      color: strat.totalPnl >= 0 ? "#2ED47A" : "#FF5A5F",
                    }}
                  >
                    +₹{strat.totalPnl.toLocaleString()}
                  </span>
                </TableCell>
                <TableCell
                  className="text-xs font-semibold"
                  style={{ color: "#F2C94C" }}
                >
                  {strat.profitFactor}x
                </TableCell>
                <TableCell className="text-xs" style={{ color: "#FF5A5F" }}>
                  -{strat.maxDD}%
                </TableCell>
                <TableCell>
                  <Badge
                    className="text-[9px]"
                    style={{
                      background: "rgba(46,212,122,0.1)",
                      color: "#2ED47A",
                      border: "1px solid #2ED47A44",
                    }}
                  >
                    Active
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
