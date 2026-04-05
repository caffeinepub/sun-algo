import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Lock,
  Shield,
  TrendingUp,
  Unlock,
  XCircle,
  Zap,
} from "lucide-react";
import { useState } from "react";
import {
  Cell,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";

const HEALTH_METRICS = [
  { label: "Daily P&L", value: "+₹4,230 (+2.1%)", status: "green" },
  { label: "Daily Risk Used", value: "1.2% of 2.0%", status: "green" },
  { label: "Open Positions", value: "4 of 10 max", status: "green" },
  { label: "Portfolio Beta", value: "1.12", status: "yellow" },
  { label: "Max Drawdown", value: "-3.2% (month)", status: "green" },
  { label: "Win Rate (30d)", value: "71%", status: "green" },
  { label: "Profit Factor", value: "2.3", status: "green" },
  { label: "Sharpe Ratio", value: "1.8", status: "green" },
  { label: "Correlation Risk", value: "LOW", status: "green" },
];

const PRE_TRADE_CHECKS = {
  capital: [
    { pass: true, label: "Available margin sufficient" },
    { pass: true, label: "Position size within daily limit" },
    { pass: true, label: "Sector concentration < 25%" },
    { pass: true, label: "Single stock exposure < 10%" },
    { pass: true, label: "Total open positions < maximum" },
    { pass: true, label: "Correlation with existing < 0.7" },
  ],
  market: [
    { pass: true, label: "Market open & not in circuit" },
    { pass: true, label: "Instrument not in ban period" },
    { pass: true, label: "No major news event (next 30m)" },
    {
      pass: false,
      label: "VIX within acceptable range",
      warn: "VIX at 21.4 — above target",
    },
    { pass: true, label: "Liquidity sufficient (bid-ask spread)" },
  ],
  strategy: [
    { pass: true, label: "Strategy not in drawdown pause mode" },
    { pass: true, label: "Daily loss limit not breached" },
    { pass: true, label: "Weekly loss limit not breached" },
    { pass: true, label: "Max consecutive losses not reached" },
    { pass: true, label: "Signal confidence above minimum" },
  ],
};

const OPEN_POSITIONS = [
  {
    symbol: "RELIANCE",
    entry: 2810,
    current: 2847,
    pnl: 1.32,
    atr: 28.4,
    sl: 2790,
    trailStatus: "Trailing (2x ATR)",
    timeOpen: "1h 45m",
    pct: 1.32,
  },
  {
    symbol: "HDFCBANK",
    entry: 1720,
    current: 1723,
    pnl: 0.17,
    atr: 18.2,
    sl: 1702,
    trailStatus: "Breakeven",
    timeOpen: "0h 52m",
    pct: 0.17,
  },
  {
    symbol: "TCS",
    entry: 3960,
    current: 3945,
    pnl: -0.38,
    atr: 42.1,
    sl: 3920,
    trailStatus: "Entry SL",
    timeOpen: "2h 15m",
    pct: -0.38,
  },
  {
    symbol: "BANKNIFTY CE",
    entry: 280,
    current: 312,
    pnl: 11.43,
    atr: 14.3,
    sl: 265,
    trailStatus: "Trailing (3x ATR)",
    timeOpen: "3h 02m",
    pct: 11.43,
  },
];

const CORRELATION_STOCKS = ["HDFCBANK", "ICICIBANK", "SBIN", "RELIANCE"];
const CORRELATION_MATRIX = [
  [1.0, 0.87, 0.71, 0.34],
  [0.87, 1.0, 0.79, 0.41],
  [0.71, 0.79, 1.0, 0.28],
  [0.34, 0.41, 0.28, 1.0],
];

const PRE_EVENTS = [
  {
    date: "Apr 09, 2026",
    event: "RBI Policy Decision",
    action: "Reduce F&O by 30%",
    color: "#F59E0B",
  },
  {
    date: "Apr 12, 2026",
    event: "HDFC Bank Earnings",
    action: "Avoid HDFCBANK 1 day before",
    color: "#EF4444",
  },
  {
    date: "Apr 30, 2026",
    event: "US Fed Meeting",
    action: "Reduce US stock exposure",
    color: "#8B5CF6",
  },
  {
    date: "May 01, 2026",
    event: "Union Budget Session",
    action: "Close intraday before event",
    color: "#EF4444",
  },
];

const radarData = [
  { metric: "Win Rate", value: 71 },
  { metric: "Sharpe", value: 72 },
  { metric: "Prof Factor", value: 76 },
  { metric: "Risk Mgmt", value: 82 },
  { metric: "Consistency", value: 68 },
  { metric: "Drawdown", value: 88 },
];

function StatusDot({ status }: { status: "green" | "yellow" | "red" }) {
  const color =
    status === "green"
      ? "#10B981"
      : status === "yellow"
        ? "#F59E0B"
        : "#EF4444";
  return (
    <span
      className="inline-block w-2 h-2 rounded-full"
      style={{ background: color }}
    />
  );
}

function CorrelationCell({ value }: { value: number }) {
  const getColor = (v: number) => {
    if (v >= 0.8) return { bg: "rgba(239,68,68,0.2)", text: "#EF4444" };
    if (v >= 0.6) return { bg: "rgba(245,158,11,0.2)", text: "#F59E0B" };
    return { bg: "rgba(16,185,129,0.15)", text: "#10B981" };
  };
  const c = getColor(value);
  return (
    <td
      className="text-center text-xs font-bold py-2 px-3"
      style={{ background: c.bg, color: c.text }}
    >
      {value.toFixed(2)}
    </td>
  );
}

export default function RiskManagement() {
  const [tradingLocked, setTradingLocked] = useState(false);
  const allClear = Object.values(PRE_TRADE_CHECKS)
    .flat()
    .every((c) => c.pass);

  return (
    <div
      className="px-4 lg:px-6 max-w-[1600px] mx-auto space-y-6 pb-6"
      data-ocid="risk.page"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-[#EAF0FF] flex items-center gap-2">
          <Shield className="w-5 h-5" style={{ color: "#F2C94C" }} />
          Risk Management
        </h1>
        <Badge
          style={{
            background: "rgba(16,185,129,0.15)",
            color: "#10B981",
            border: "1px solid #10B98133",
          }}
          className="text-xs"
        >
          MILITARY-GRADE PROTECTION
        </Badge>
      </div>

      {/* Portfolio Health Score */}
      <div
        className="trading-card p-5"
        style={{
          border: "1px solid rgba(16,185,129,0.3)",
          boxShadow: "0 0 20px rgba(16,185,129,0.08)",
        }}
      >
        <div className="flex flex-col lg:flex-row items-center gap-6">
          <div className="text-center">
            <div className="text-[10px] uppercase tracking-widest text-[#9AA8C1] mb-1">
              Portfolio Health Score
            </div>
            <div className="text-6xl font-black" style={{ color: "#10B981" }}>
              82
            </div>
            <div className="text-sm text-[#9AA8C1]">/100 🟢</div>
            <div className="mt-2">
              <ResponsiveContainer width={140} height={120}>
                <RadarChart data={radarData} cx="50%" cy="50%" outerRadius={45}>
                  <PolarGrid stroke="#1E2C44" />
                  <PolarAngleAxis
                    dataKey="metric"
                    tick={{ fill: "#9AA8C1", fontSize: 8 }}
                  />
                  <Radar
                    dataKey="value"
                    stroke="#10B981"
                    fill="#10B981"
                    fillOpacity={0.2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3 flex-1">
            {HEALTH_METRICS.map((m) => (
              <div
                key={m.label}
                className="rounded-lg p-3"
                style={{ background: "#0D1117", border: "1px solid #1E2C44" }}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <StatusDot status={m.status as "green" | "yellow" | "red"} />
                  <span className="text-[9px] uppercase tracking-wider text-[#9AA8C1]">
                    {m.label}
                  </span>
                </div>
                <div className="text-sm font-bold text-[#EAF0FF]">
                  {m.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Risk Layer Tabs */}
      <Tabs defaultValue="pretrade">
        <TabsList
          className="bg-white/5 border border-[#24344F] h-9 flex-wrap"
          style={{ height: "auto" }}
        >
          {[
            { value: "pretrade", label: "Pre-Trade Checks" },
            { value: "sizing", label: "Position Sizing" },
            { value: "monitor", label: "Position Monitor" },
            { value: "account", label: "Account Controls" },
            { value: "portfolio", label: "Portfolio Risk" },
            { value: "blackswan", label: "Black Swan" },
          ].map((t) => (
            <TabsTrigger
              key={t.value}
              value={t.value}
              data-ocid="risk.tab"
              className="text-[10px] data-[state=active]:bg-[#F2C94C] data-[state=active]:text-[#0B1424]"
            >
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Tab 1: Pre-Trade Checks */}
        <TabsContent value="pretrade" className="space-y-4 mt-4">
          <div
            className={`p-3 rounded-xl flex items-center gap-3 ${
              allClear
                ? "bg-[rgba(16,185,129,0.1)] border border-[#10B98133]"
                : "bg-[rgba(239,68,68,0.1)] border border-[#EF444433]"
            }`}
          >
            {allClear ? (
              <CheckCircle2 className="w-5 h-5" style={{ color: "#10B981" }} />
            ) : (
              <XCircle className="w-5 h-5" style={{ color: "#EF4444" }} />
            )}
            <span
              className="font-bold text-sm"
              style={{ color: allClear ? "#10B981" : "#EF4444" }}
            >
              {allClear
                ? "ALL CLEAR — Order may proceed"
                : "ORDER BLOCKED — Check failed"}
            </span>
            {!allClear && (
              <span className="text-xs text-[#EF4444] ml-2">
                ⚠️ VIX above acceptable range
              </span>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(
              [
                { title: "Capital Checks", checks: PRE_TRADE_CHECKS.capital },
                { title: "Market Checks", checks: PRE_TRADE_CHECKS.market },
                { title: "Strategy Checks", checks: PRE_TRADE_CHECKS.strategy },
              ] as const
            ).map((section) => (
              <div key={section.title} className="trading-card p-4">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#9AA8C1] mb-3">
                  {section.title}
                </h3>
                <div className="space-y-2">
                  {section.checks.map((check) => (
                    <div key={check.label} className="flex items-start gap-2">
                      {check.pass ? (
                        <CheckCircle2
                          className="w-3.5 h-3.5 mt-0.5 flex-shrink-0"
                          style={{ color: "#10B981" }}
                        />
                      ) : (
                        <XCircle
                          className="w-3.5 h-3.5 mt-0.5 flex-shrink-0"
                          style={{ color: "#EF4444" }}
                        />
                      )}
                      <div>
                        <span
                          className="text-xs"
                          style={{ color: check.pass ? "#EAF0FF" : "#EF4444" }}
                        >
                          {check.label}
                        </span>
                        {!check.pass && "warn" in check && check.warn && (
                          <div className="text-[9px] text-[#F59E0B]">
                            {check.warn}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Tab 2: Position Sizing */}
        <TabsContent value="sizing" className="space-y-4 mt-4">
          <div
            className="trading-card p-3 flex items-center gap-3"
            style={{
              background: "rgba(16,185,129,0.06)",
              border: "1px solid #10B98133",
            }}
          >
            <Zap className="w-4 h-4" style={{ color: "#10B981" }} />
            <span className="text-xs text-[#EAF0FF]">
              <strong style={{ color: "#10B981" }}>
                Auto-selected: ATR-Based
              </strong>{" "}
              — Market is ranging, volatility is moderate
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                name: "Fixed % Risk",
                active: false,
                formula: "risk = account × 1.5%\nsize = risk / (entry - SL)",
                result: "142 shares",
              },
              {
                name: "Kelly Criterion",
                active: false,
                formula: "k = win% - (loss%/RR)\nsize = account × (k × 0.5)",
                result: "118 shares",
              },
              {
                name: "ATR-Based",
                active: true,
                formula: "atr = ATR(14)\nsize = (acct×risk%) / (2×atr)",
                result: "137 shares ✓",
              },
              {
                name: "Volatility Adj.",
                active: false,
                formula: "scalar = 1/(IV/hist_vol)\nsize = base × scalar",
                result: "124 shares",
              },
            ].map((method) => (
              <div
                key={method.name}
                className="trading-card p-4"
                style={{
                  border: method.active ? "1px solid #F2C94C44" : undefined,
                  background: method.active
                    ? "rgba(242,201,76,0.05)"
                    : undefined,
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#EAF0FF]">
                    {method.name}
                  </span>
                  {method.active && (
                    <Badge
                      className="text-[9px]"
                      style={{
                        background: "rgba(242,201,76,0.2)",
                        color: "#F2C94C",
                        border: "1px solid #F2C94C44",
                      }}
                    >
                      ACTIVE
                    </Badge>
                  )}
                </div>
                <pre
                  className="text-[9px] p-2 rounded mb-2 whitespace-pre-wrap"
                  style={{
                    background: "#0D1117",
                    color: "#60AFFF",
                    fontFamily: "monospace",
                  }}
                >
                  {method.formula}
                </pre>
                <div
                  className="text-xs font-bold text-center py-1.5 rounded"
                  style={{
                    color: method.active ? "#F2C94C" : "#9AA8C1",
                    background: method.active
                      ? "rgba(242,201,76,0.08)"
                      : "#1E2C44",
                  }}
                >
                  {method.result}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Tab 3: Position Monitor */}
        <TabsContent value="monitor" className="mt-4">
          <div className="trading-card overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr
                  style={{
                    background: "#0D1117",
                    borderBottom: "1px solid #24344F",
                  }}
                >
                  {[
                    "Symbol",
                    "Entry",
                    "Current",
                    "P&L",
                    "ATR",
                    "SL Level",
                    "Trail Status",
                    "Time Open",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-2 text-[#9AA8C1] uppercase tracking-wider text-[9px]"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {OPEN_POSITIONS.map((pos, i) => {
                  const isLong = pos.pct >= 0;
                  const isOld =
                    pos.timeOpen.startsWith("2h") ||
                    pos.timeOpen.startsWith("3h");
                  return (
                    <tr
                      key={pos.symbol}
                      data-ocid={`risk.row.${i + 1}`}
                      style={{
                        borderBottom: "1px solid #1E2C44",
                        background:
                          isOld && !isLong
                            ? "rgba(239,68,68,0.05)"
                            : "transparent",
                      }}
                      className="hover:bg-white/5"
                    >
                      <td className="px-4 py-3 font-bold text-[#EAF0FF]">
                        {pos.symbol}
                      </td>
                      <td className="px-4 py-3 text-[#9AA8C1] tabular-nums">
                        {pos.entry.toLocaleString()}
                      </td>
                      <td
                        className="px-4 py-3 tabular-nums"
                        style={{ color: isLong ? "#10B981" : "#EF4444" }}
                      >
                        {pos.current.toLocaleString()}
                      </td>
                      <td
                        className="px-4 py-3 font-bold tabular-nums"
                        style={{ color: isLong ? "#10B981" : "#EF4444" }}
                      >
                        {isLong ? "+" : ""}
                        {pos.pct.toFixed(2)}%
                      </td>
                      <td className="px-4 py-3 text-[#9AA8C1] tabular-nums">
                        {pos.atr}
                      </td>
                      <td
                        className="px-4 py-3 tabular-nums"
                        style={{ color: "#EF4444" }}
                      >
                        {pos.sl.toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          className="text-[9px]"
                          style={{
                            background: "rgba(59,130,246,0.15)",
                            color: "#60AFFF",
                            border: "1px solid #3B82F633",
                          }}
                        >
                          {pos.trailStatus}
                        </Badge>
                      </td>
                      <td
                        className="px-4 py-3"
                        style={{ color: isOld ? "#F59E0B" : "#9AA8C1" }}
                      >
                        {pos.timeOpen}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* Tab 4: Account Controls */}
        <TabsContent value="account" className="space-y-4 mt-4">
          {tradingLocked && (
            <div
              className="p-4 rounded-xl flex items-center gap-3"
              style={{
                background: "rgba(239,68,68,0.12)",
                border: "1px solid #EF444455",
              }}
            >
              <Lock className="w-5 h-5 text-[#EF4444]" />
              <div className="flex-1">
                <div className="font-bold text-sm text-[#EF4444]">
                  Trading Locked
                </div>
                <div className="text-xs text-[#9AA8C1]">
                  Daily loss limit reached. Trading locked until tomorrow.
                </div>
              </div>
              <Button
                onClick={() => setTradingLocked(false)}
                data-ocid="risk.secondary_button"
                className="h-8 text-xs"
                style={{
                  background: "rgba(239,68,68,0.2)",
                  color: "#EF4444",
                  border: "1px solid #EF444433",
                }}
              >
                <Unlock className="w-3 h-3 mr-1" /> Unlock
              </Button>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                label: "Daily Loss Limit",
                used: 1.2,
                max: 2.0,
                color: "#10B981",
                consecutive: null,
              },
              {
                label: "Weekly Loss Limit",
                used: 2.1,
                max: 5.0,
                color: "#10B981",
                consecutive: null,
              },
              {
                label: "Monthly Drawdown",
                used: 3.2,
                max: 10.0,
                color: "#F59E0B",
                consecutive: null,
              },
              {
                label: "Consecutive Losses",
                used: 2,
                max: 5,
                color: "#10B981",
                consecutive: 2,
              },
            ].map((ctrl) => (
              <div key={ctrl.label} className="trading-card p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#EAF0FF]">
                    {ctrl.label}
                  </span>
                  <span
                    className="text-xs font-bold"
                    style={{ color: ctrl.color }}
                  >
                    {ctrl.consecutive !== null
                      ? `${ctrl.used} of ${ctrl.max} max`
                      : `${ctrl.used}% of ${ctrl.max}%`}
                  </span>
                </div>
                <Progress
                  value={(ctrl.used / ctrl.max) * 100}
                  className="h-2"
                />
                <div className="flex justify-between mt-1">
                  <span className="text-[9px] text-[#9AA8C1]">
                    {((ctrl.used / ctrl.max) * 100).toFixed(0)}% used
                  </span>
                  <span className="text-[9px] text-[#9AA8C1]">
                    {ctrl.max - ctrl.used}
                    {ctrl.consecutive !== null ? " remaining" : "% remaining"}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <Button
            onClick={() => setTradingLocked(true)}
            data-ocid="risk.delete_button"
            className="w-full h-10 font-bold text-sm"
            style={{
              background: "rgba(239,68,68,0.15)",
              color: "#EF4444",
              border: "1px solid #EF444433",
            }}
          >
            <Lock className="w-4 h-4 mr-2" /> Emergency Lock Trading
          </Button>
        </TabsContent>

        {/* Tab 5: Portfolio Risk */}
        <TabsContent value="portfolio" className="space-y-4 mt-4">
          <div
            className="trading-card p-3 flex items-center gap-3"
            style={{
              background: "rgba(239,68,68,0.06)",
              border: "1px solid #EF444433",
            }}
          >
            <AlertTriangle className="w-4 h-4 text-[#EF4444]" />
            <span className="text-xs text-[#EF4444]">
              ⚠️ HIGH CORRELATION: HDFC Bank + ICICI Bank = 0.87 correlation —
              You are doubling risk in banking sector
            </span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="trading-card p-4">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#9AA8C1] mb-3">
                Correlation Matrix (30-day rolling)
              </h3>
              <table className="w-full rounded-lg overflow-hidden">
                <thead>
                  <tr>
                    <th className="text-[9px] text-[#9AA8C1] p-2" />
                    {CORRELATION_STOCKS.map((s) => (
                      <th key={s} className="text-[9px] text-[#9AA8C1] p-2">
                        {s.slice(0, 6)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {CORRELATION_STOCKS.map((stock, i) => (
                    <tr key={stock}>
                      <td className="text-[9px] font-bold text-[#9AA8C1] px-2 py-1">
                        {stock.slice(0, 6)}
                      </td>
                      {CORRELATION_MATRIX[i].map((val, j) => (
                        // biome-ignore lint/suspicious/noArrayIndexKey: matrix cell
                        <CorrelationCell key={j} value={val} />
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="trading-card p-4 space-y-4">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#9AA8C1]">
                Portfolio Beta
              </h3>
              <div className="flex items-center gap-4">
                <div
                  className="text-4xl font-black"
                  style={{ color: "#F59E0B" }}
                >
                  1.12
                </div>
                <div>
                  <div className="text-xs text-[#EAF0FF]">vs NIFTY 50</div>
                  <Badge
                    style={{
                      background: "rgba(245,158,11,0.15)",
                      color: "#F59E0B",
                      border: "1px solid #F59E0B33",
                    }}
                    className="text-[9px] mt-1"
                  >
                    MODERATE RISK
                  </Badge>
                </div>
              </div>
              <Progress value={112 / 2} className="h-2" />
              <p className="text-xs text-[#9AA8C1]">
                Beta {">"} 1.5 would trigger hedge suggestion (NIFTY PUT
                options). Current exposure is moderate.
              </p>
            </div>
          </div>
        </TabsContent>

        {/* Tab 6: Black Swan Protection */}
        <TabsContent value="blackswan" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="trading-card p-4">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#9AA8C1] mb-4">
                India VIX Monitor
              </h3>
              <div className="flex items-center gap-4 mb-4">
                <div
                  className="text-5xl font-black"
                  style={{ color: "#F59E0B" }}
                >
                  18.2
                </div>
                <div>
                  <Badge
                    style={{
                      background: "rgba(16,185,129,0.15)",
                      color: "#10B981",
                      border: "1px solid #10B98133",
                    }}
                    className="text-[9px]"
                  >
                    NORMAL RANGE
                  </Badge>
                  <div className="text-xs text-[#9AA8C1] mt-1">
                    Auto-hedge: Not triggered (VIX &lt; 25)
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                {[
                  {
                    label: "VIX < 20",
                    status: "Normal",
                    color: "#10B981",
                    active: true,
                  },
                  {
                    label: "VIX 20-25",
                    status: "Caution",
                    color: "#F59E0B",
                    active: false,
                  },
                  {
                    label: "VIX 25-35",
                    status: "High Risk — reduce F&O by 40%",
                    color: "#F97316",
                    active: false,
                  },
                  {
                    label: "VIX > 35",
                    status: "Emergency — close short-term",
                    color: "#EF4444",
                    active: false,
                  },
                ].map((tier) => (
                  <div
                    key={tier.label}
                    className="flex items-center justify-between rounded-lg p-2"
                    style={{
                      background: tier.active ? `${tier.color}22` : "#0D1117",
                      border: `1px solid ${tier.active ? `${tier.color}44` : "#1E2C44"}`,
                    }}
                  >
                    <span
                      className="text-[10px] font-semibold"
                      style={{ color: tier.active ? tier.color : "#4B5563" }}
                    >
                      {tier.label}
                    </span>
                    <span
                      className="text-[10px]"
                      style={{ color: tier.active ? tier.color : "#374151" }}
                    >
                      {tier.status}
                    </span>
                    {tier.active && (
                      <CheckCircle2
                        className="w-3 h-3"
                        style={{ color: tier.color }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="trading-card p-4">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#9AA8C1] mb-3 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                Pre-Event Protection Calendar
              </h3>
              <div className="space-y-2">
                {PRE_EVENTS.map((evt) => (
                  <div
                    key={evt.date}
                    className="rounded-lg p-3"
                    style={{
                      background: `${evt.color}11`,
                      border: `1px solid ${evt.color}33`,
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div
                          className="text-xs font-bold"
                          style={{ color: evt.color }}
                        >
                          {evt.event}
                        </div>
                        <div className="text-[10px] text-[#9AA8C1] mt-0.5">
                          {evt.action}
                        </div>
                      </div>
                      <span className="text-[9px]" style={{ color: evt.color }}>
                        {evt.date}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div
                className="mt-3 p-3 rounded-lg text-xs text-[#9AA8C1]"
                style={{ background: "#0D1117", border: "1px solid #1E2C44" }}
              >
                <TrendingUp className="w-3 h-3 inline mr-1 text-[#F2C94C]" />
                Black Swan protection auto-activates when VIX spikes or NIFTY
                drops &gt;3% intraday.
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
