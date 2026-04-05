import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Activity,
  ArrowDown,
  ArrowUp,
  BookOpen,
  Clock,
  Gauge,
  ShoppingCart,
  Timer,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { OrderType } from "../backend.d";

const ORDER_TYPES = [
  { id: OrderType.bracket, label: "BRACKET" },
  { id: OrderType.cover, label: "COVER" },
  { id: OrderType.iceberg, label: "ICEBERG" },
  { id: OrderType.twap, label: "TWAP" },
  { id: OrderType.vwap, label: "VWAP" },
  { id: OrderType.smartEntry, label: "SMART ENTRY" },
  { id: OrderType.scaleIn, label: "SCALE-IN" },
  { id: OrderType.scaleOut, label: "SCALE-OUT" },
  { id: OrderType.oco, label: "OCO" },
  { id: OrderType.conditional, label: "CONDITIONAL" },
];

const MOCK_ORDERS = [
  {
    time: "10:32:14",
    symbol: "RELIANCE",
    type: "BRACKET",
    qty: 50,
    expected: 2844.0,
    fill: 2845.2,
    slippage: 1.2,
    slippagePct: 0.04,
    status: "filled",
    latency: 42,
  },
  {
    time: "10:28:07",
    symbol: "HDFCBANK",
    type: "SMART ENTRY",
    qty: 100,
    expected: 1720.0,
    fill: 1720.35,
    slippage: 0.35,
    slippagePct: 0.02,
    status: "filled",
    latency: 38,
  },
  {
    time: "10:15:32",
    symbol: "TCS",
    type: "TWAP",
    qty: 200,
    expected: 3962.0,
    fill: 3963.1,
    slippage: 1.1,
    slippagePct: 0.03,
    status: "filled",
    latency: 56,
  },
  {
    time: "10:10:44",
    symbol: "NIFTY CE",
    type: "OCO",
    qty: 75,
    expected: 135.0,
    fill: 0,
    slippage: 0,
    slippagePct: 0,
    status: "pending",
    latency: 0,
  },
  {
    time: "09:45:12",
    symbol: "INFY",
    type: "COVER",
    qty: 30,
    expected: 1852.0,
    fill: 1852.0,
    slippage: 0.0,
    slippagePct: 0.0,
    status: "rejected",
    latency: 12,
  },
];

type BidAsk = { price: number; qty: number };

function generateOrderBook(basePrice: number): {
  bids: BidAsk[];
  asks: BidAsk[];
} {
  const bids = Array.from({ length: 5 }, (_, i) => ({
    price: basePrice - (i + 1) * 0.5,
    qty: Math.floor(Math.random() * 800 + 100),
  }));
  const asks = Array.from({ length: 5 }, (_, i) => ({
    price: basePrice + (i + 1) * 0.5,
    qty: Math.floor(Math.random() * 800 + 100),
  }));
  return { bids, asks };
}

function getStatusColor(status: string): string {
  if (status === "filled") return "#10B981";
  if (status === "pending") return "#F59E0B";
  if (status === "rejected") return "#EF4444";
  return "#9AA8C1";
}

export default function OrderExecution() {
  const [selectedType, setSelectedType] = useState<string>(OrderType.bracket);
  const [symbol, setSymbol] = useState("RELIANCE");
  const [orderBook, setOrderBook] = useState(() => generateOrderBook(2847));

  useEffect(() => {
    const iv = setInterval(() => {
      setOrderBook(generateOrderBook(2847 + (Math.random() - 0.5) * 4));
    }, 3000);
    return () => clearInterval(iv);
  }, []);

  return (
    <div
      className="px-4 lg:px-6 max-w-[1600px] mx-auto space-y-5 pb-6"
      data-ocid="orders.page"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-[#EAF0FF] flex items-center gap-2">
          <ShoppingCart className="w-5 h-5" style={{ color: "#F2C94C" }} />
          Order Execution
        </h1>
        <Badge
          style={{
            background: "rgba(16,185,129,0.15)",
            color: "#10B981",
            border: "1px solid #10B98133",
          }}
          className="text-xs"
        >
          SMART ROUTING ACTIVE
        </Badge>
      </div>

      {/* Order Type Selector */}
      <div className="overflow-x-auto">
        <div className="flex gap-2 min-w-max pb-1">
          {ORDER_TYPES.map((ot) => (
            <button
              key={ot.id}
              type="button"
              data-ocid="orders.tab"
              onClick={() => setSelectedType(ot.id)}
              className="px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap"
              style={{
                background:
                  selectedType === ot.id ? "#F2C94C" : "rgba(255,255,255,0.05)",
                color: selectedType === ot.id ? "#0B1424" : "#9AA8C1",
                border:
                  selectedType === ot.id
                    ? "1px solid #F2C94C"
                    : "1px solid #24344F",
              }}
            >
              {ot.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Order Form */}
        <div className="lg:col-span-2 space-y-4">
          <div className="trading-card p-5">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-[#9AA8C1] mb-4">
              {ORDER_TYPES.find((t) => t.id === selectedType)?.label} Order
            </h2>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <Label className="text-[10px] text-[#9AA8C1] uppercase tracking-wider">
                  Symbol
                </Label>
                <Select value={symbol} onValueChange={setSymbol}>
                  <SelectTrigger
                    data-ocid="orders.select"
                    className="mt-1 bg-white/5 border-[#24344F] text-[#EAF0FF] h-9 text-sm"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent
                    style={{
                      background: "#111E33",
                      border: "1px solid #24344F",
                    }}
                  >
                    {["RELIANCE", "HDFCBANK", "TCS", "INFY", "BANKNIFTY"].map(
                      (s) => (
                        <SelectItem
                          key={s}
                          value={s}
                          className="text-[#EAF0FF] text-xs"
                        >
                          {s}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-[10px] text-[#9AA8C1] uppercase tracking-wider">
                  Quantity
                </Label>
                <Input
                  data-ocid="orders.input"
                  defaultValue="50"
                  className="mt-1 bg-white/5 border-[#24344F] text-[#EAF0FF] h-9"
                />
              </div>
            </div>

            {/* Bracket order form */}
            {selectedType === OrderType.bracket && (
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Entry Price", val: "2847.00" },
                  { label: "Target Price", val: "2900.00" },
                  { label: "Stop Loss", val: "2812.00" },
                ].map((f) => (
                  <div key={f.label}>
                    <Label className="text-[10px] text-[#9AA8C1] uppercase tracking-wider">
                      {f.label}
                    </Label>
                    <Input
                      data-ocid="orders.input"
                      defaultValue={f.val}
                      className="mt-1 bg-white/5 border-[#24344F] text-[#EAF0FF] h-9"
                    />
                  </div>
                ))}
                <div
                  className="col-span-3 mt-2 p-2 rounded-lg text-xs text-[#9AA8C1]"
                  style={{
                    background: "rgba(242,201,76,0.06)",
                    border: "1px solid #F2C94C22",
                  }}
                >
                  Bracket order places 3 simultaneous orders. Target and SL
                  auto-cancel each other.
                </div>
              </div>
            )}

            {/* Iceberg order */}
            {selectedType === OrderType.iceberg && (
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Total Quantity", val: "10000" },
                  { label: "Show Quantity", val: "500" },
                  { label: "Chunk Size", val: "500" },
                ].map((f) => (
                  <div key={f.label}>
                    <Label className="text-[10px] text-[#9AA8C1] uppercase tracking-wider">
                      {f.label}
                    </Label>
                    <Input
                      data-ocid="orders.input"
                      defaultValue={f.val}
                      className="mt-1 bg-white/5 border-[#24344F] text-[#EAF0FF] h-9"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* TWAP order */}
            {selectedType === OrderType.twap && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Total Quantity", val: "1000" },
                    { label: "Duration (minutes)", val: "30" },
                  ].map((f) => (
                    <div key={f.label}>
                      <Label className="text-[10px] text-[#9AA8C1] uppercase tracking-wider">
                        {f.label}
                      </Label>
                      <Input
                        data-ocid="orders.input"
                        defaultValue={f.val}
                        className="mt-1 bg-white/5 border-[#24344F] text-[#EAF0FF] h-9"
                      />
                    </div>
                  ))}
                </div>
                <div
                  className="p-3 rounded-lg flex items-center gap-2"
                  style={{
                    background: "rgba(16,185,129,0.06)",
                    border: "1px solid #10B98133",
                  }}
                >
                  <Timer className="w-4 h-4 text-[#10B981]" />
                  <span className="text-xs text-[#EAF0FF]">
                    Places{" "}
                    <strong style={{ color: "#10B981" }}>
                      33 shares every 1 minute
                    </strong>{" "}
                    over 30 minutes.
                  </span>
                </div>
              </div>
            )}

            {/* Scale-In order */}
            {selectedType === OrderType.scaleIn && (
              <div className="space-y-2">
                {[
                  {
                    label: "Tranche 1 (40%)",
                    trigger: "Breakout confirmation",
                  },
                  { label: "Tranche 2 (30%)", trigger: "First pullback" },
                  { label: "Tranche 3 (30%)", trigger: "Second confirmation" },
                ].map((t) => (
                  <div
                    key={t.label}
                    className="flex items-center gap-3 p-2 rounded-lg"
                    style={{
                      background: "#0D1117",
                      border: "1px solid #1E2C44",
                    }}
                  >
                    <span className="text-xs font-bold text-[#F2C94C] w-28 flex-shrink-0">
                      {t.label}
                    </span>
                    <Input
                      data-ocid="orders.input"
                      defaultValue={t.trigger}
                      className="bg-white/5 border-[#24344F] text-[#EAF0FF] h-8 text-xs"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* OCO order */}
            {selectedType === OrderType.oco && (
              <div className="space-y-3">
                <div
                  className="p-3 rounded-lg"
                  style={{
                    background: "rgba(59,130,246,0.06)",
                    border: "1px solid #3B82F622",
                  }}
                >
                  <div className="text-xs font-bold text-[#60AFFF] mb-2">
                    Order A: Breakout Above
                  </div>
                  <Input
                    data-ocid="orders.input"
                    defaultValue="Buy RELIANCE above 2870"
                    className="bg-white/5 border-[#24344F] text-[#EAF0FF] h-8 text-xs"
                  />
                </div>
                <div className="text-center text-[10px] text-[#9AA8C1] font-bold">
                  WHICHEVER TRIGGERS FIRST CANCELS THE OTHER
                </div>
                <div
                  className="p-3 rounded-lg"
                  style={{
                    background: "rgba(239,68,68,0.06)",
                    border: "1px solid #EF444422",
                  }}
                >
                  <div className="text-xs font-bold text-[#EF4444] mb-2">
                    Order B: Breakdown Below
                  </div>
                  <Input
                    data-ocid="orders.input"
                    defaultValue="Sell RELIANCE below 2820"
                    className="bg-white/5 border-[#24344F] text-[#EAF0FF] h-8 text-xs"
                  />
                </div>
              </div>
            )}

            {/* Conditional order */}
            {selectedType === OrderType.conditional && (
              <div className="space-y-3">
                <div
                  className="p-3 rounded-lg"
                  style={{ background: "#0D1117", border: "1px solid #24344F" }}
                >
                  <div className="text-[10px] uppercase tracking-wider text-[#9AA8C1] mb-2">
                    Place buy order ONLY IF:
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <Select defaultValue="NIFTY50">
                      <SelectTrigger className="bg-white/5 border-[#24344F] text-[#EAF0FF] h-8 text-xs w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent
                        style={{
                          background: "#111E33",
                          border: "1px solid #24344F",
                        }}
                      >
                        {["NIFTY50", "USDINR", "BANKNIFTY", "VIX"].map((s) => (
                          <SelectItem
                            key={s}
                            value={s}
                            className="text-[#EAF0FF] text-xs"
                          >
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select defaultValue="gt">
                      <SelectTrigger className="bg-white/5 border-[#24344F] text-[#EAF0FF] h-8 text-xs w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent
                        style={{
                          background: "#111E33",
                          border: "1px solid #24344F",
                        }}
                      >
                        <SelectItem
                          value="gt"
                          className="text-[#EAF0FF] text-xs"
                        >
                          {">"}
                        </SelectItem>
                        <SelectItem
                          value="lt"
                          className="text-[#EAF0FF] text-xs"
                        >
                          {"<"}
                        </SelectItem>
                        <SelectItem
                          value="eq"
                          className="text-[#EAF0FF] text-xs"
                        >
                          =
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      data-ocid="orders.input"
                      defaultValue="22500"
                      className="bg-white/5 border-[#24344F] text-[#EAF0FF] h-8 text-xs w-28"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Default cover/vwap/smartEntry/scaleOut forms */}
            {[
              OrderType.cover,
              OrderType.vwap,
              OrderType.smartEntry,
              OrderType.scaleOut,
            ].includes(selectedType as OrderType) && (
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Entry Price", val: "2847.00" },
                  { label: "Stop Loss", val: "2812.00" },
                ].map((f) => (
                  <div key={f.label}>
                    <Label className="text-[10px] text-[#9AA8C1] uppercase tracking-wider">
                      {f.label}
                    </Label>
                    <Input
                      data-ocid="orders.input"
                      defaultValue={f.val}
                      className="mt-1 bg-white/5 border-[#24344F] text-[#EAF0FF] h-9"
                    />
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 flex gap-3">
              <Button
                data-ocid="orders.primary_button"
                className="flex-1 h-10 font-bold text-sm"
                style={{ background: "#10B981", color: "#fff" }}
              >
                <ArrowUp className="w-4 h-4 mr-1" /> Place BUY
              </Button>
              <Button
                data-ocid="orders.secondary_button"
                className="flex-1 h-10 font-bold text-sm"
                style={{
                  background: "rgba(239,68,68,0.15)",
                  color: "#EF4444",
                  border: "1px solid #EF444433",
                }}
              >
                <ArrowDown className="w-4 h-4 mr-1" /> Place SELL
              </Button>
            </div>
          </div>

          {/* Smart Order Router */}
          <div className="trading-card p-4">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-[#9AA8C1] mb-3 flex items-center gap-1">
              <Gauge className="w-3.5 h-3.5" /> Smart Order Router
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {[
                {
                  icon: <Activity className="w-3.5 h-3.5" />,
                  label: "Market Depth",
                  value: "Spread 0.12% — Limit Order",
                  ok: true,
                },
                {
                  icon: <Zap className="w-3.5 h-3.5" />,
                  label: "Liquidity",
                  value: "Avg Vol 12.4M — Direct exec",
                  ok: true,
                },
                {
                  icon: <Clock className="w-3.5 h-3.5" />,
                  label: "Time Check",
                  value: "10:32 AM — OK (not first/last)",
                  ok: true,
                },
                {
                  icon: <BookOpen className="w-3.5 h-3.5" />,
                  label: "Circuit Check",
                  value: "Price safe — not near circuit",
                  ok: true,
                },
              ].map((check) => (
                <div
                  key={check.label}
                  className="flex items-start gap-2 p-2 rounded-lg"
                  style={{
                    background: check.ok
                      ? "rgba(16,185,129,0.06)"
                      : "rgba(239,68,68,0.06)",
                    border: `1px solid ${check.ok ? "#10B98122" : "#EF444422"}`,
                  }}
                >
                  <span style={{ color: check.ok ? "#10B981" : "#EF4444" }}>
                    {check.icon}
                  </span>
                  <div>
                    <div
                      className="text-[9px] uppercase tracking-wider"
                      style={{ color: check.ok ? "#10B981" : "#EF4444" }}
                    >
                      {check.label}
                    </div>
                    <div className="text-[10px] text-[#9AA8C1]">
                      {check.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Order Book + Execution Analytics */}
        <div className="space-y-4">
          <div className="trading-card p-4">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-[#9AA8C1] mb-3">
              Level 2 Order Book — {symbol}
            </h2>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="text-[9px] uppercase tracking-wider text-[#10B981] mb-1">
                  BID
                </div>
                {orderBook.bids.map((b, i) => (
                  <div
                    key={b.price}
                    className="flex justify-between text-[10px] py-0.5 px-1 rounded"
                    style={{
                      background: `rgba(16,185,129,${0.04 + (5 - i) * 0.02})`,
                    }}
                  >
                    <span style={{ color: "#10B981" }}>
                      {b.price.toFixed(1)}
                    </span>
                    <span className="text-[#9AA8C1]">{b.qty}</span>
                  </div>
                ))}
              </div>
              <div>
                <div className="text-[9px] uppercase tracking-wider text-[#EF4444] mb-1">
                  ASK
                </div>
                {orderBook.asks.map((a, i) => (
                  <div
                    key={a.price}
                    className="flex justify-between text-[10px] py-0.5 px-1 rounded"
                    style={{
                      background: `rgba(239,68,68,${0.04 + (5 - i) * 0.02})`,
                    }}
                  >
                    <span style={{ color: "#EF4444" }}>
                      {a.price.toFixed(1)}
                    </span>
                    <span className="text-[#9AA8C1]">{a.qty}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="trading-card p-4">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-[#9AA8C1] mb-3">
              Execution Quality
            </h2>
            <div className="space-y-2">
              {[
                { label: "Avg slippage", value: "Rs0.23/order" },
                { label: "Best execution", value: "HDFC Bank (-0.02%)" },
                { label: "Worst execution", value: "Small caps (-0.8%)" },
                { label: "Total slippage (month)", value: "Rs1,240" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="flex justify-between items-center py-1"
                  style={{ borderBottom: "1px solid #1E2C44" }}
                >
                  <span className="text-[10px] text-[#9AA8C1]">
                    {stat.label}
                  </span>
                  <span className="text-[10px] font-bold text-[#EAF0FF]">
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="trading-card overflow-hidden">
        <div
          className="px-4 py-3"
          style={{ borderBottom: "1px solid #1E2C44" }}
        >
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-[#9AA8C1]">
            Recent Orders
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr style={{ background: "#0D1117" }}>
                {[
                  "Time",
                  "Symbol",
                  "Type",
                  "Qty",
                  "Expected",
                  "Fill Price",
                  "Slippage",
                  "Status",
                  "Latency",
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
              {MOCK_ORDERS.map((o, i) => (
                <tr
                  key={o.time + o.symbol}
                  data-ocid={`orders.row.${i + 1}`}
                  style={{ borderBottom: "1px solid #1E2C44" }}
                  className="hover:bg-white/5"
                >
                  <td className="px-4 py-2.5 font-mono text-[#9AA8C1]">
                    {o.time}
                  </td>
                  <td className="px-4 py-2.5 font-bold text-[#EAF0FF]">
                    {o.symbol}
                  </td>
                  <td className="px-4 py-2.5">
                    <Badge
                      className="text-[9px]"
                      style={{
                        background: "rgba(99,102,241,0.15)",
                        color: "#A5B4FC",
                        border: "1px solid #6366F133",
                      }}
                    >
                      {o.type}
                    </Badge>
                  </td>
                  <td className="px-4 py-2.5 text-[#9AA8C1]">{o.qty}</td>
                  <td className="px-4 py-2.5 tabular-nums text-[#EAF0FF]">
                    {o.expected.toFixed(2)}
                  </td>
                  <td
                    className="px-4 py-2.5 tabular-nums"
                    style={{
                      color: o.status === "filled" ? "#10B981" : "#9AA8C1",
                    }}
                  >
                    {o.fill > 0 ? o.fill.toFixed(2) : "--"}
                  </td>
                  <td
                    className="px-4 py-2.5 tabular-nums"
                    style={{ color: o.slippage > 0.5 ? "#EF4444" : "#9AA8C1" }}
                  >
                    {o.fill > 0
                      ? `${o.slippage.toFixed(2)} (${o.slippagePct.toFixed(2)}%)`
                      : "--"}
                  </td>
                  <td className="px-4 py-2.5">
                    <Badge
                      className="text-[9px]"
                      style={{
                        background: `${getStatusColor(o.status)}22`,
                        color: getStatusColor(o.status),
                        border: `1px solid ${getStatusColor(o.status)}44`,
                      }}
                    >
                      {o.status.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="px-4 py-2.5 tabular-nums text-[#9AA8C1]">
                    {o.latency > 0 ? `${o.latency}ms` : "--"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
