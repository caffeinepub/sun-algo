import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import {
  CheckCircle2,
  Copy,
  DollarSign,
  TrendingDown,
  TrendingUp,
  Users,
  XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { TradingStyle } from "../backend.d";

const MASTER_TRADERS = [
  {
    id: "t1",
    name: "Rahul Sharma",
    initials: "RS",
    color: "#3B82F6",
    badge: "VERIFIED",
    style: TradingStyle.intraday,
    markets: "NSE / F&O",
    totalReturn: 142,
    winRate: 74,
    maxDrawdown: -9.2,
    sharpe: 2.4,
    avgTrades: 18,
    avgHold: "4.2 hours",
    subscribers: 1240,
    fee: 1999,
    monthlyReturns: [
      3.2, 5.1, -1.8, 8.4, 4.1, 2.2, 6.3, 3.8, 5.9, 2.1, 7.2, 4.5,
    ],
  },
  {
    id: "t2",
    name: "Priya Nair",
    initials: "PN",
    color: "#EC4899",
    badge: "SEBI REGISTERED",
    style: TradingStyle.swing,
    markets: "NSE / BSE / Crypto",
    totalReturn: 89,
    winRate: 68,
    maxDrawdown: -7.4,
    sharpe: 1.9,
    avgTrades: 8,
    avgHold: "2.3 days",
    subscribers: 842,
    fee: 1499,
    monthlyReturns: [
      2.1, 4.3, 1.8, -2.4, 6.2, 3.1, 5.4, 2.8, 4.1, 3.7, 2.4, 1.9,
    ],
  },
  {
    id: "t3",
    name: "Arjun Mehta",
    initials: "AM",
    color: "#10B981",
    badge: "ELITE",
    style: TradingStyle.positional,
    markets: "NSE / F&O / US",
    totalReturn: 218,
    winRate: 71,
    maxDrawdown: -12.1,
    sharpe: 2.8,
    avgTrades: 5,
    avgHold: "14 days",
    subscribers: 2180,
    fee: 3499,
    monthlyReturns: [
      4.8, 7.2, 3.1, 9.4, 5.2, -1.8, 8.1, 6.3, 4.7, 11.2, 3.9, 5.8,
    ],
  },
];

const RECENT_TRADES = [
  { symbol: "HDFC Bank", side: "BUY", result: "WIN", pnl: 2.1 },
  { symbol: "NIFTY CE", side: "BUY", result: "WIN", pnl: 18.4 },
  { symbol: "INFY", side: "SELL", result: "LOSS", pnl: -1.2 },
  { symbol: "BANKNIFTY PE", side: "BUY", result: "WIN", pnl: 11.7 },
  { symbol: "TCS", side: "BUY", result: "WIN", pnl: 1.8 },
];

function MonthlyReturnChart({ data }: { data: number[] }) {
  const chartData = data.map((v, i) => ({
    month: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"][i],
    value: v,
  }));
  return (
    <ResponsiveContainer width="100%" height={60}>
      <BarChart
        data={chartData}
        margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
      >
        <XAxis dataKey="month" tick={{ fill: "#6B7280", fontSize: 8 }} />
        <YAxis hide />
        <Tooltip
          contentStyle={{
            background: "#0D1117",
            border: "1px solid #24344F",
            fontSize: 10,
          }}
          formatter={(v: number) => [`${v > 0 ? "+" : ""}${v}%`, "Return"]}
        />
        <Bar dataKey="value" radius={[2, 2, 0, 0]}>
          {chartData.map((entry) => (
            <Cell
              key={entry.month}
              fill={entry.value >= 0 ? "#10B981" : "#EF4444"}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export default function CopyTrading() {
  const [copyingTrader, setCopyingTrader] = useState<string | null>(null);
  const [openSheet, setOpenSheet] = useState<string | null>(null);
  const [copyRatio, setCopyRatio] = useState([100]);

  const activeTrader = MASTER_TRADERS.find((t) => t.id === "t1");

  return (
    <div
      className="px-4 lg:px-6 max-w-[1600px] mx-auto space-y-6 pb-6"
      data-ocid="copy-trading.page"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-[#EAF0FF] flex items-center gap-2">
          <Copy className="w-5 h-5" style={{ color: "#F2C94C" }} />
          Copy Trading
        </h1>
        <Badge
          style={{
            background: "rgba(16,185,129,0.15)",
            color: "#10B981",
            border: "1px solid #10B98133",
          }}
          className="text-xs"
        >
          1 ACTIVE COPY
        </Badge>
      </div>

      {/* Master Traders */}
      <div>
        <h2 className="text-[10px] font-bold uppercase tracking-widest text-[#9AA8C1] mb-3">
          Verified Master Traders
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {MASTER_TRADERS.map((trader, i) => (
            <div
              key={trader.id}
              data-ocid={`copy-trading.item.${i + 1}`}
              className="trading-card p-5 space-y-4"
              style={{
                border:
                  copyingTrader === trader.id
                    ? `1px solid ${trader.color}55`
                    : undefined,
              }}
            >
              {/* Trader Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback
                      className="text-sm font-bold"
                      style={{
                        background: `${trader.color}22`,
                        color: trader.color,
                      }}
                    >
                      {trader.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-[#EAF0FF]">
                        {trader.name}
                      </span>
                      <CheckCircle2
                        className="w-3.5 h-3.5"
                        style={{ color: trader.color }}
                      />
                    </div>
                    <Badge
                      className="text-[8px] mt-0.5"
                      style={{
                        background: `${trader.color}22`,
                        color: trader.color,
                        border: `1px solid ${trader.color}44`,
                      }}
                    >
                      {trader.badge}
                    </Badge>
                  </div>
                </div>
                <Badge
                  className="text-[9px]"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    color: "#9AA8C1",
                    border: "1px solid #24344F",
                  }}
                >
                  {trader.style.toUpperCase()}
                </Badge>
              </div>

              {/* Track Record */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  {
                    label: "Total Return",
                    value: `+${trader.totalReturn}%`,
                    color: "#10B981",
                  },
                  {
                    label: "Win Rate",
                    value: `${trader.winRate}%`,
                    color: "#10B981",
                  },
                  {
                    label: "Max Drawdown",
                    value: `${trader.maxDrawdown}%`,
                    color: "#EF4444",
                  },
                  {
                    label: "Sharpe Ratio",
                    value: trader.sharpe.toFixed(1),
                    color: "#F2C94C",
                  },
                ].map((m) => (
                  <div
                    key={m.label}
                    className="rounded-lg p-2"
                    style={{
                      background: "#0D1117",
                      border: "1px solid #1E2C44",
                    }}
                  >
                    <div className="text-[9px] text-[#9AA8C1]">{m.label}</div>
                    <div
                      className="text-sm font-bold"
                      style={{ color: m.color }}
                    >
                      {m.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Monthly returns chart */}
              <div>
                <div className="text-[9px] text-[#9AA8C1] uppercase tracking-wider mb-1">
                  Monthly Returns (12m)
                </div>
                <MonthlyReturnChart data={trader.monthlyReturns} />
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-[10px] text-[#9AA8C1]">
                  <Users className="w-3 h-3" />
                  {trader.subscribers.toLocaleString()} followers
                </div>
                <div
                  className="text-[10px] font-bold"
                  style={{ color: "#F2C94C" }}
                >
                  Rs{trader.fee.toLocaleString()}/mo
                </div>
              </div>

              <Button
                data-ocid="copy-trading.primary_button"
                onClick={() => setOpenSheet(trader.id)}
                className="w-full h-9 text-xs font-bold"
                style={{
                  background:
                    copyingTrader === trader.id
                      ? `${trader.color}22`
                      : "rgba(242,201,76,0.15)",
                  color: copyingTrader === trader.id ? trader.color : "#F2C94C",
                  border: `1px solid ${copyingTrader === trader.id ? `${trader.color}44` : "#F2C94C33"}`,
                }}
              >
                {copyingTrader === trader.id
                  ? "Currently Copying"
                  : "Copy This Trader"}
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Active Copy Dashboard */}
      {activeTrader && (
        <div className="trading-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-[#9AA8C1]">
              Active Copy Dashboard
            </h2>
            <Badge
              style={{
                background: "rgba(16,185,129,0.15)",
                color: "#10B981",
                border: "1px solid #10B98133",
              }}
              className="text-[9px]"
            >
              LIVE
            </Badge>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarFallback
                    style={{
                      background: "rgba(59,130,246,0.2)",
                      color: "#3B82F6",
                    }}
                    className="font-bold"
                  >
                    RS
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-sm font-bold text-[#EAF0FF]">
                    {activeTrader.name}
                  </div>
                  <div className="text-[10px] text-[#9AA8C1]">
                    Started: 15 Jan 2026
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  {
                    label: "Total Invested",
                    value: "Rs50,000",
                    color: "#EAF0FF",
                  },
                  {
                    label: "Current Value",
                    value: "Rs57,340",
                    color: "#10B981",
                  },
                  { label: "Return", value: "+14.7%", color: "#10B981" },
                  { label: "Total P&L", value: "+Rs7,340", color: "#10B981" },
                ].map((m) => (
                  <div
                    key={m.label}
                    className="rounded-lg p-2"
                    style={{
                      background: "#0D1117",
                      border: "1px solid #1E2C44",
                    }}
                  >
                    <div className="text-[9px] text-[#9AA8C1]">{m.label}</div>
                    <div
                      className="text-xs font-bold"
                      style={{ color: m.color }}
                    >
                      {m.value}
                    </div>
                  </div>
                ))}
              </div>
              <div
                className="p-3 rounded-lg"
                style={{
                  background: "rgba(16,185,129,0.06)",
                  border: "1px solid #10B98133",
                }}
              >
                <div className="text-[10px] text-[#9AA8C1] mb-1">Today</div>
                <div className="text-xs text-[#EAF0FF]">
                  3 trades copied | P&L:{" "}
                  <span style={{ color: "#10B981" }}>+Rs840</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="text-[10px] text-[#9AA8C1] uppercase tracking-wider mb-2">
                Recent Copied Trades
              </div>
              <table className="w-full text-xs">
                <thead>
                  <tr style={{ borderBottom: "1px solid #24344F" }}>
                    {["Symbol", "Side", "Result", "P&L"].map((h) => (
                      <th
                        key={h}
                        className="text-left py-1.5 px-2 text-[9px] text-[#9AA8C1] uppercase"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {RECENT_TRADES.map((trade, i) => (
                    <tr
                      key={trade.symbol}
                      data-ocid={`copy-trading.row.${i + 1}`}
                      style={{ borderBottom: "1px solid #1E2C44" }}
                      className="hover:bg-white/5"
                    >
                      <td className="py-2 px-2 font-medium text-[#EAF0FF]">
                        {trade.symbol}
                      </td>
                      <td className="py-2 px-2">
                        <Badge
                          className="text-[9px]"
                          style={{
                            background:
                              trade.side === "BUY"
                                ? "rgba(16,185,129,0.15)"
                                : "rgba(239,68,68,0.15)",
                            color: trade.side === "BUY" ? "#10B981" : "#EF4444",
                          }}
                        >
                          {trade.side}
                        </Badge>
                      </td>
                      <td className="py-2 px-2">
                        {trade.result === "WIN" ? (
                          <CheckCircle2
                            className="w-4 h-4"
                            style={{ color: "#10B981" }}
                          />
                        ) : (
                          <XCircle
                            className="w-4 h-4"
                            style={{ color: "#EF4444" }}
                          />
                        )}
                      </td>
                      <td
                        className="py-2 px-2 font-bold tabular-nums"
                        style={{
                          color: trade.pnl >= 0 ? "#10B981" : "#EF4444",
                        }}
                      >
                        {trade.pnl >= 0 ? "+" : ""}
                        {trade.pnl.toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Master Trader Earnings */}
      <div className="trading-card p-5">
        <h2 className="text-[10px] font-bold uppercase tracking-widest text-[#9AA8C1] mb-4">
          Master Trader Earnings Dashboard
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            {
              label: "Total Followers",
              value: "1,240",
              icon: <Users className="w-4 h-4" />,
              color: "#3B82F6",
            },
            {
              label: "Total AUM Copying",
              value: "Rs4.2 Cr",
              icon: <DollarSign className="w-4 h-4" />,
              color: "#10B981",
            },
            {
              label: "Monthly Revenue",
              value: "Rs1,24,000",
              icon: <TrendingUp className="w-4 h-4" />,
              color: "#F2C94C",
            },
            {
              label: "Revenue Share",
              value: "20%",
              icon: <TrendingDown className="w-4 h-4" />,
              color: "#8B5CF6",
            },
          ].map((m) => (
            <div
              key={m.label}
              className="rounded-xl p-4 flex items-start gap-3"
              style={{
                background: `${m.color}11`,
                border: `1px solid ${m.color}33`,
              }}
            >
              <span style={{ color: m.color }}>{m.icon}</span>
              <div>
                <div className="text-[9px] text-[#9AA8C1]">{m.label}</div>
                <div className="text-sm font-bold" style={{ color: m.color }}>
                  {m.value}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 text-[10px] text-[#9AA8C1]">
          Payout: Every 1st of month via UPI/Bank transfer
        </div>
      </div>

      {/* Copy Settings Sheet */}
      <Sheet open={openSheet !== null} onOpenChange={() => setOpenSheet(null)}>
        <SheetContent
          style={{ background: "#111E33", border: "1px solid #24344F" }}
          data-ocid="copy-trading.sheet"
        >
          <SheetHeader>
            <SheetTitle className="text-[#EAF0FF]">
              Copy Settings —{" "}
              {MASTER_TRADERS.find((t) => t.id === openSheet)?.name}
            </SheetTitle>
          </SheetHeader>
          <div className="mt-6 space-y-5">
            <div>
              <Label className="text-[10px] text-[#9AA8C1] uppercase tracking-wider">
                Copy Ratio: {copyRatio[0]}%
              </Label>
              <Slider
                value={copyRatio}
                onValueChange={setCopyRatio}
                min={25}
                max={200}
                step={25}
                className="mt-3"
                data-ocid="copy-trading.input"
              />
              <div className="flex justify-between text-[9px] text-[#9AA8C1] mt-1">
                <span>25%</span>
                <span>100% (same %)</span>
                <span>200%</span>
              </div>
            </div>
            {[
              { label: "Max Capital to Allocate", placeholder: "50000" },
              { label: "Max Trades Per Day", placeholder: "5" },
              { label: "Stop Copy if Drawdown Hits (%)", placeholder: "5" },
            ].map((f) => (
              <div key={f.label}>
                <Label className="text-[10px] text-[#9AA8C1] uppercase tracking-wider">
                  {f.label}
                </Label>
                <Input
                  data-ocid="copy-trading.input"
                  placeholder={f.placeholder}
                  className="mt-1 bg-white/5 border-[#24344F] text-[#EAF0FF]"
                />
              </div>
            ))}
            <div className="space-y-2">
              <Label className="text-[10px] text-[#9AA8C1] uppercase tracking-wider">
                Instrument Filter
              </Label>
              {[
                { id: "equity", label: "Copy equity trades", checked: true },
                { id: "fo", label: "Copy F&O trades", checked: true },
                { id: "crypto", label: "Copy crypto trades", checked: false },
                {
                  id: "after2",
                  label: "Allow trades after 2 PM",
                  checked: false,
                },
              ].map((cb) => (
                <div key={cb.id} className="flex items-center gap-2">
                  <Checkbox
                    id={cb.id}
                    defaultChecked={cb.checked}
                    data-ocid="copy-trading.checkbox"
                  />
                  <Label
                    htmlFor={cb.id}
                    className="text-xs text-[#EAF0FF] cursor-pointer"
                  >
                    {cb.label}
                  </Label>
                </div>
              ))}
            </div>
            <Button
              data-ocid="copy-trading.submit_button"
              onClick={() => {
                setCopyingTrader(openSheet);
                setOpenSheet(null);
              }}
              className="w-full h-10 font-bold"
              style={{ background: "#F2C94C", color: "#0B1424" }}
            >
              Start Copy Trading
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
