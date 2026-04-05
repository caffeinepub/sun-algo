import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertTriangle,
  BarChart2,
  Clock,
  Flame,
  TrendingDown,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const SPOT = 22480;
const EXPIRY = "24 Apr 2026";

const OPTION_CHAIN = [
  {
    strike: 22000,
    callOI: 45.2,
    callChng: 12,
    callLTP: 512,
    callIV: 18,
    putOI: 12.4,
    putChng: -8,
    putLTP: 28,
    putIV: 14,
  },
  {
    strike: 22200,
    callOI: 38.1,
    callChng: 8,
    callLTP: 328,
    callIV: 16,
    putOI: 18.2,
    putChng: -5,
    putLTP: 48,
    putIV: 15,
  },
  {
    strike: 22400,
    callOI: 52.4,
    callChng: 22,
    callLTP: 162,
    callIV: 15,
    putOI: 28.4,
    putChng: 4,
    putLTP: 82,
    putIV: 16,
  },
  {
    strike: 22500,
    callOI: 68.2,
    callChng: 18,
    callLTP: 112,
    callIV: 17,
    putOI: 42.1,
    putChng: 12,
    putLTP: 118,
    putIV: 17,
    atm: true,
  },
  {
    strike: 22600,
    callOI: 58.4,
    callChng: -4,
    callLTP: 72,
    callIV: 16,
    putOI: 38.4,
    putChng: 8,
    putLTP: 162,
    putIV: 18,
  },
  {
    strike: 22800,
    callOI: 28.2,
    callChng: -5,
    callLTP: 35,
    callIV: 17,
    putOI: 52.1,
    putChng: 15,
    putLTP: 248,
    putIV: 18,
  },
  {
    strike: 23000,
    callOI: 18.4,
    callChng: -8,
    callLTP: 14,
    callIV: 19,
    putOI: 62.3,
    putChng: 22,
    putLTP: 412,
    putIV: 19,
  },
];

const PCR_TREND = [
  { day: "Mon", pcr: 0.92 },
  { day: "Tue", pcr: 0.88 },
  { day: "Wed", pcr: 0.84 },
  { day: "Thu", pcr: 0.79 },
  { day: "Fri", pcr: 0.82 },
];

const MAX_PAIN_DATA = OPTION_CHAIN.map((r) => ({
  strike: r.strike,
  pain: Math.abs(r.strike - 22400) * (r.callOI + r.putOI) * 0.1,
}));

const IV_HISTORY = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  iv: 12 + Math.random() * 8,
}));

export default function OptionsIntelligence() {
  const [marketView, setMarketView] = useState("bullish");
  const [timeframe, setTimeframe] = useState("7days");
  const [ivEnv, setIvEnv] = useState("low");
  const [showStrategy, setShowStrategy] = useState(false);

  const pcr = 0.82;
  const getPCRInterpretation = (v: number) => {
    if (v < 0.7) return { label: "Extremely Bullish", color: "#10B981" };
    if (v < 1.0) return { label: "Bullish", color: "#34D399" };
    if (v < 1.3) return { label: "Bearish", color: "#F87171" };
    return { label: "Extremely Bearish", color: "#EF4444" };
  };
  const pcrInfo = getPCRInterpretation(pcr);

  return (
    <div
      className="px-4 lg:px-6 max-w-[1600px] mx-auto space-y-5 pb-6"
      data-ocid="options.page"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-[#EAF0FF] flex items-center gap-2">
          <BarChart2 className="w-5 h-5" style={{ color: "#F2C94C" }} />
          Options Intelligence
        </h1>
        <div
          className="px-3 py-1.5 rounded-lg flex items-center gap-3 text-xs"
          style={{ background: "#0D1117", border: "1px solid #24344F" }}
        >
          <span className="text-[#9AA8C1]">NIFTY 50</span>
          <span className="font-bold text-[#EAF0FF]">
            {SPOT.toLocaleString()}
          </span>
          <Badge
            style={{
              background: "rgba(16,185,129,0.15)",
              color: "#10B981",
              border: "1px solid #10B98133",
            }}
            className="text-[9px]"
          >
            +0.42%
          </Badge>
          <span className="text-[#9AA8C1]">Expiry: {EXPIRY}</span>
        </div>
      </div>

      {/* Expiry day alert */}
      <div
        className="p-3 rounded-xl flex items-center gap-3"
        style={{
          background: "rgba(245,158,11,0.08)",
          border: "1px solid #F59E0B33",
        }}
      >
        <AlertTriangle className="w-4 h-4 text-[#F59E0B]" />
        <div className="flex-1">
          <span className="text-xs font-bold text-[#F59E0B]">
            EXPIRY DAY ALERTS{" "}
          </span>
          <span className="text-xs text-[#9AA8C1]">
            Weekly expiry: Thursday 24 Apr{" "}
          </span>
          <span className="text-xs font-bold" style={{ color: "#F2C94C" }}>
            Auto square-off at 3:20 PM enabled
          </span>
        </div>
        <div
          className="flex items-center gap-1 text-xs font-mono font-bold"
          style={{ color: "#EF4444" }}
        >
          <Clock className="w-3.5 h-3.5" />
          04:22:18
        </div>
      </div>

      {/* Option Chain */}
      <div className="trading-card overflow-hidden">
        <div
          className="px-4 py-3"
          style={{ borderBottom: "1px solid #1E2C44" }}
        >
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-[#9AA8C1]">
            Option Chain — NIFTY 50
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr style={{ background: "#0D1117" }}>
                <th
                  colSpan={4}
                  className="text-center py-2 text-[10px] text-[#10B981] font-bold uppercase tracking-wider border-r"
                  style={{ borderColor: "#1E2C44" }}
                >
                  CALLS
                </th>
                <th className="py-2 text-center text-[10px] text-[#F2C94C] font-bold uppercase tracking-wider">
                  STRIKE
                </th>
                <th
                  colSpan={4}
                  className="text-center py-2 text-[10px] text-[#EF4444] font-bold uppercase tracking-wider border-l"
                  style={{ borderColor: "#1E2C44" }}
                >
                  PUTS
                </th>
              </tr>
              <tr
                style={{
                  background: "#0D1117",
                  borderBottom: "1px solid #1E2C44",
                }}
              >
                {["OI", "Chng", "LTP", "IV"].map((h) => (
                  <th
                    key={`c-${h}`}
                    className="text-[9px] text-[#9AA8C1] py-1.5 px-3 text-right"
                  >
                    {h}
                  </th>
                ))}
                <th className="text-[9px] text-[#9AA8C1] py-1.5 px-3 text-center">
                  Strike
                </th>
                {["IV", "LTP", "Chng", "OI"].map((h) => (
                  <th
                    key={`p-${h}`}
                    className="text-[9px] text-[#9AA8C1] py-1.5 px-3 text-left"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {OPTION_CHAIN.map((row) => {
                const isITM = row.strike < SPOT;
                const isATM = row.atm;
                return (
                  <tr
                    key={row.strike}
                    style={{
                      background: isATM
                        ? "rgba(245,158,11,0.12)"
                        : isITM
                          ? "rgba(59,130,246,0.06)"
                          : "transparent",
                      borderBottom: "1px solid #1E2C44",
                    }}
                    className="hover:bg-white/5"
                  >
                    <td className="px-3 py-2 text-right tabular-nums text-[#10B981]">
                      {row.callOI}L
                    </td>
                    <td
                      className="px-3 py-2 text-right tabular-nums text-xs"
                      style={{
                        color: row.callChng >= 0 ? "#10B981" : "#EF4444",
                      }}
                    >
                      {row.callChng >= 0 ? "+" : ""}
                      {row.callChng}%
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums font-bold text-[#EAF0FF]">
                      {row.callLTP}
                    </td>
                    <td
                      className="px-3 py-2 text-right tabular-nums text-[#9AA8C1] border-r"
                      style={{ borderColor: "#1E2C44" }}
                    >
                      {row.callIV}%
                    </td>
                    <td
                      className="px-3 py-2 text-center font-black text-sm"
                      style={{
                        color: isATM
                          ? "#F2C94C"
                          : isITM
                            ? "#60AFFF"
                            : "#EAF0FF",
                        background: isATM ? "rgba(242,201,76,0.1)" : undefined,
                      }}
                    >
                      {row.strike.toLocaleString()}
                      {isATM && (
                        <span className="text-[8px] ml-1 text-[#F59E0B]">
                          ATM
                        </span>
                      )}
                      {row.callOI > 60 && (
                        <Flame className="w-3 h-3 inline ml-1 text-[#F97316]" />
                      )}
                    </td>
                    <td
                      className="px-3 py-2 text-left tabular-nums text-[#9AA8C1] border-l"
                      style={{ borderColor: "#1E2C44" }}
                    >
                      {row.putIV}%
                    </td>
                    <td className="px-3 py-2 text-left tabular-nums font-bold text-[#EAF0FF]">
                      {row.putLTP}
                    </td>
                    <td
                      className="px-3 py-2 text-left tabular-nums text-xs"
                      style={{
                        color: row.putChng >= 0 ? "#10B981" : "#EF4444",
                      }}
                    >
                      {row.putChng >= 0 ? "+" : ""}
                      {row.putChng}%
                    </td>
                    <td className="px-3 py-2 text-left tabular-nums text-[#EF4444]">
                      {row.putOI}L
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="maxpain">
        <TabsList className="bg-white/5 border border-[#24344F]">
          {[
            { value: "maxpain", label: "MAX PAIN" },
            { value: "pcr", label: "PCR" },
            { value: "greeks", label: "GREEKS" },
            { value: "ivrank", label: "IV RANK" },
            { value: "strategy", label: "STRATEGY" },
          ].map((t) => (
            <TabsTrigger
              key={t.value}
              value={t.value}
              data-ocid="options.tab"
              className="text-[10px] data-[state=active]:bg-[#F2C94C] data-[state=active]:text-[#0B1424]"
            >
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Max Pain */}
        <TabsContent value="maxpain" className="mt-4">
          <div className="trading-card p-5">
            <div className="flex items-center gap-4 mb-4">
              <div>
                <div className="text-[10px] text-[#9AA8C1] uppercase tracking-wider">
                  Max Pain Strike
                </div>
                <div
                  className="text-4xl font-black"
                  style={{ color: "#F2C94C" }}
                >
                  22,400
                </div>
              </div>
              <div className="text-xs text-[#9AA8C1] max-w-xs">
                Price tends to gravitate toward max pain at expiry. Current spot
                ({SPOT.toLocaleString()}) is +80 points above max pain.
              </div>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={MAX_PAIN_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E2C44" />
                <XAxis
                  dataKey="strike"
                  tick={{ fill: "#9AA8C1", fontSize: 9 }}
                />
                <YAxis tick={{ fill: "#9AA8C1", fontSize: 9 }} hide />
                <Tooltip
                  contentStyle={{
                    background: "#111E33",
                    border: "1px solid #24344F",
                    fontSize: 11,
                  }}
                  formatter={(v: number) => [v.toFixed(0), "Pain"]}
                />
                <Bar dataKey="pain" radius={[4, 4, 0, 0]}>
                  {MAX_PAIN_DATA.map((entry) => (
                    <Cell
                      key={entry.strike}
                      fill={entry.strike === 22400 ? "#F2C94C" : "#3B82F666"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>

        {/* PCR */}
        <TabsContent value="pcr" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="trading-card p-5">
              <div className="text-[10px] text-[#9AA8C1] uppercase tracking-wider mb-2">
                Put-Call Ratio
              </div>
              <div className="flex items-center gap-4 mb-4">
                <div
                  className="text-5xl font-black"
                  style={{ color: pcrInfo.color }}
                >
                  {pcr}
                </div>
                <div>
                  <Badge
                    style={{
                      background: `${pcrInfo.color}22`,
                      color: pcrInfo.color,
                      border: `1px solid ${pcrInfo.color}44`,
                    }}
                  >
                    {pcrInfo.label}
                  </Badge>
                  <div className="text-[10px] text-[#9AA8C1] mt-1">
                    Range: 0.7-1.0 = Bullish
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                {[
                  {
                    label: "PCR < 0.7",
                    desc: "Extremely bullish",
                    color: "#10B981",
                    active: false,
                  },
                  {
                    label: "PCR 0.7 - 1.0",
                    desc: "Bullish",
                    color: "#34D399",
                    active: true,
                  },
                  {
                    label: "PCR 1.0 - 1.3",
                    desc: "Bearish",
                    color: "#F87171",
                    active: false,
                  },
                  {
                    label: "PCR > 1.3",
                    desc: "Extremely bearish",
                    color: "#EF4444",
                    active: false,
                  },
                ].map((tier) => (
                  <div
                    key={tier.label}
                    className="flex justify-between items-center px-3 py-1.5 rounded-lg"
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
                      {tier.desc}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="trading-card p-5">
              <div className="text-[10px] text-[#9AA8C1] uppercase tracking-wider mb-3">
                5-Day PCR Trend
              </div>
              <ResponsiveContainer width="100%" height={160}>
                <LineChart data={PCR_TREND}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E2C44" />
                  <XAxis
                    dataKey="day"
                    tick={{ fill: "#9AA8C1", fontSize: 10 }}
                  />
                  <YAxis
                    tick={{ fill: "#9AA8C1", fontSize: 10 }}
                    domain={[0.6, 1.1]}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#111E33",
                      border: "1px solid #24344F",
                      fontSize: 11,
                    }}
                    formatter={(v: number) => [v.toFixed(2), "PCR"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="pcr"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    dot={{ fill: "#3B82F6" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </TabsContent>

        {/* Greeks */}
        <TabsContent value="greeks" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="trading-card p-5">
              <div className="text-[10px] text-[#9AA8C1] uppercase tracking-wider mb-3">
                ATM Option Greeks — NIFTY 22500 CE
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    name: "Delta",
                    value: "0.45",
                    desc: "Per Rs1 move",
                    color: "#3B82F6",
                  },
                  {
                    name: "Gamma",
                    value: "0.008",
                    desc: "Delta change speed",
                    color: "#8B5CF6",
                  },
                  {
                    name: "Theta",
                    value: "-12.4",
                    desc: "Time decay/day Rs",
                    color: "#EF4444",
                  },
                  {
                    name: "Vega",
                    value: "0.18",
                    desc: "IV sensitivity",
                    color: "#10B981",
                  },
                ].map((g) => (
                  <div
                    key={g.name}
                    className="rounded-xl p-4 text-center"
                    style={{
                      background: `${g.color}11`,
                      border: `1px solid ${g.color}33`,
                    }}
                  >
                    <div className="text-[9px] text-[#9AA8C1] uppercase tracking-wider">
                      {g.name}
                    </div>
                    <div
                      className="text-2xl font-black mt-1"
                      style={{ color: g.color }}
                    >
                      {g.value}
                    </div>
                    <div className="text-[9px] text-[#9AA8C1] mt-0.5">
                      {g.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="trading-card p-5">
              <div className="text-[10px] text-[#9AA8C1] uppercase tracking-wider mb-3">
                Portfolio Greeks (All Positions)
              </div>
              <div className="space-y-3">
                {[
                  {
                    name: "Net Delta",
                    value: "+2,400",
                    desc: "Equiv NIFTY exposure",
                    color: "#3B82F6",
                  },
                  {
                    name: "Net Theta",
                    value: "-Rs840/day",
                    desc: "Time decay cost",
                    color: "#EF4444",
                  },
                  {
                    name: "Net Vega",
                    value: "+Rs1,240",
                    desc: "Per 1% IV change",
                    color: "#10B981",
                  },
                  {
                    name: "Net Gamma",
                    value: "+0.024",
                    desc: "Delta change",
                    color: "#8B5CF6",
                  },
                ].map((g) => (
                  <div
                    key={g.name}
                    className="flex items-center justify-between p-3 rounded-lg"
                    style={{
                      background: "#0D1117",
                      border: "1px solid #1E2C44",
                    }}
                  >
                    <div>
                      <div className="text-xs font-bold text-[#EAF0FF]">
                        {g.name}
                      </div>
                      <div className="text-[9px] text-[#9AA8C1]">{g.desc}</div>
                    </div>
                    <div
                      className="text-sm font-black"
                      style={{ color: g.color }}
                    >
                      {g.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* IV Rank */}
        <TabsContent value="ivrank" className="mt-4">
          <div className="trading-card p-5">
            <div className="grid grid-cols-3 gap-4 mb-5">
              {[
                {
                  label: "Current IV",
                  value: "18%",
                  desc: "Implied Volatility",
                },
                { label: "IV Rank", value: "34", desc: "Out of 100 (low)" },
                {
                  label: "IV Percentile",
                  value: "28%",
                  desc: "Historical position",
                },
              ].map((m) => (
                <div
                  key={m.label}
                  className="text-center rounded-xl p-4"
                  style={{ background: "#0D1117", border: "1px solid #1E2C44" }}
                >
                  <div className="text-[9px] text-[#9AA8C1] uppercase tracking-wider">
                    {m.label}
                  </div>
                  <div className="text-3xl font-black text-[#F2C94C] my-1">
                    {m.value}
                  </div>
                  <div className="text-[9px] text-[#9AA8C1]">{m.desc}</div>
                </div>
              ))}
            </div>
            <div
              className="p-4 rounded-xl mb-4"
              style={{
                background: "rgba(16,185,129,0.08)",
                border: "1px solid #10B98133",
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-[#10B981]" />
                <span className="text-sm font-bold text-[#10B981]">
                  IV is LOW (28th percentile)
                </span>
              </div>
              <p className="text-xs text-[#9AA8C1]">
                Preferred strategy:{" "}
                <strong className="text-[#EAF0FF]">
                  BUY options (calls/puts)
                </strong>
                . Avoid selling options when IV is this low.
              </p>
            </div>
            <div className="text-[10px] text-[#9AA8C1] uppercase tracking-wider mb-2">
              30-Day IV History
            </div>
            <ResponsiveContainer width="100%" height={120}>
              <LineChart data={IV_HISTORY}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E2C44" />
                <XAxis
                  dataKey="day"
                  tick={{ fill: "#9AA8C1", fontSize: 8 }}
                  interval={6}
                />
                <YAxis
                  tick={{ fill: "#9AA8C1", fontSize: 8 }}
                  domain={[10, 22]}
                />
                <Tooltip
                  contentStyle={{
                    background: "#111E33",
                    border: "1px solid #24344F",
                    fontSize: 11,
                  }}
                  formatter={(v: number) => [`${v.toFixed(1)}%`, "IV"]}
                />
                <Line
                  type="monotone"
                  dataKey="iv"
                  stroke="#8B5CF6"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>

        {/* Strategy Suggester */}
        <TabsContent value="strategy" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="trading-card p-5 space-y-4">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#9AA8C1]">
                Strategy Suggester
              </h3>
              <div>
                <Label className="text-[10px] text-[#9AA8C1] uppercase tracking-wider">
                  Market View
                </Label>
                <Select value={marketView} onValueChange={setMarketView}>
                  <SelectTrigger
                    data-ocid="options.select"
                    className="mt-1 bg-white/5 border-[#24344F] text-[#EAF0FF] h-9"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent
                    style={{
                      background: "#111E33",
                      border: "1px solid #24344F",
                    }}
                  >
                    {[
                      ["bullish", "Bullish"],
                      ["bearish", "Bearish"],
                      ["neutral", "Neutral"],
                    ].map(([v, l]) => (
                      <SelectItem
                        key={v}
                        value={v}
                        className="text-[#EAF0FF] text-xs"
                      >
                        {l}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-[10px] text-[#9AA8C1] uppercase tracking-wider">
                  Timeframe
                </Label>
                <Select value={timeframe} onValueChange={setTimeframe}>
                  <SelectTrigger
                    data-ocid="options.select"
                    className="mt-1 bg-white/5 border-[#24344F] text-[#EAF0FF] h-9"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent
                    style={{
                      background: "#111E33",
                      border: "1px solid #24344F",
                    }}
                  >
                    {[
                      ["7days", "7 Days"],
                      ["14days", "14 Days"],
                      ["30days", "30 Days"],
                    ].map(([v, l]) => (
                      <SelectItem
                        key={v}
                        value={v}
                        className="text-[#EAF0FF] text-xs"
                      >
                        {l}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-[10px] text-[#9AA8C1] uppercase tracking-wider">
                  IV Environment
                </Label>
                <Select value={ivEnv} onValueChange={setIvEnv}>
                  <SelectTrigger
                    data-ocid="options.select"
                    className="mt-1 bg-white/5 border-[#24344F] text-[#EAF0FF] h-9"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent
                    style={{
                      background: "#111E33",
                      border: "1px solid #24344F",
                    }}
                  >
                    {[
                      ["low", "Low IV"],
                      ["normal", "Normal IV"],
                      ["high", "High IV"],
                    ].map(([v, l]) => (
                      <SelectItem
                        key={v}
                        value={v}
                        className="text-[#EAF0FF] text-xs"
                      >
                        {l}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                data-ocid="options.primary_button"
                onClick={() => setShowStrategy(true)}
                className="w-full h-9 font-bold text-sm"
                style={{ background: "#F2C94C", color: "#0B1424" }}
              >
                <Zap className="w-4 h-4 mr-1" /> Get Strategy
              </Button>
            </div>

            {showStrategy && (
              <div className="trading-card p-5 space-y-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#10B981]" />
                  <span className="text-xs font-bold text-[#EAF0FF]">
                    RECOMMENDED: BULL CALL SPREAD
                  </span>
                </div>
                <div
                  className="rounded-xl p-4 space-y-2"
                  style={{
                    background: "#0D1117",
                    border: "1px solid #1E2C44",
                    fontFamily: "monospace",
                  }}
                >
                  <div className="text-xs text-[#10B981]">
                    BUY NIFTY 22,500 CE @ Rs135
                  </div>
                  <div className="text-xs text-[#EF4444]">
                    SELL NIFTY 22,800 CE @ Rs48
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "Net Cost", value: "Rs87/lot" },
                    { label: "Max Profit", value: "Rs213/lot" },
                    { label: "Max Loss", value: "Rs87/lot" },
                    { label: "Break-even", value: "22,587" },
                    { label: "R:R Ratio", value: "1:2.45" },
                    { label: "Total Cost", value: "Rs6,525" },
                  ].map((m) => (
                    <div
                      key={m.label}
                      className="rounded-lg p-2"
                      style={{
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid #1E2C44",
                      }}
                    >
                      <div className="text-[9px] text-[#9AA8C1]">{m.label}</div>
                      <div className="text-xs font-bold text-[#EAF0FF]">
                        {m.value}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button
                    data-ocid="options.primary_button"
                    className="flex-1 h-8 text-xs font-bold"
                    style={{ background: "#10B981", color: "#fff" }}
                  >
                    Place Strategy
                  </Button>
                  <Button
                    data-ocid="options.secondary_button"
                    className="flex-1 h-8 text-xs"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      color: "#9AA8C1",
                      border: "1px solid #24344F",
                    }}
                  >
                    Paper Trade
                  </Button>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
