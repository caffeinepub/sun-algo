import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  AlertTriangle,
  ArrowDown,
  ArrowRight,
  Bell,
  BookOpen,
  CheckCircle2,
  Clock,
  GitBranch,
  Play,
  Plus,
  RefreshCw,
  Rocket,
  Save,
  X,
  Zap,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type BlockType = "trigger" | "condition" | "action";

interface StrategyBlock {
  id: string;
  type: BlockType;
  label: string;
  param?: string;
  icon: React.ReactNode;
}

const DEFAULT_BLOCKS: StrategyBlock[] = [
  {
    id: "b1",
    type: "trigger",
    label: "Market Open?",
    icon: <Clock className="w-3.5 h-3.5" />,
  },
  {
    id: "b2",
    type: "condition",
    label: "RSI > 60?",
    param: "RSI(14) > 60",
    icon: <GitBranch className="w-3.5 h-3.5" />,
  },
  {
    id: "b3",
    type: "condition",
    label: "EMA9 > EMA21?",
    param: "EMA(9) > EMA(21)",
    icon: <GitBranch className="w-3.5 h-3.5" />,
  },
  {
    id: "b4",
    type: "condition",
    label: "Volume > 2x avg?",
    param: "Vol > 2x 20D avg",
    icon: <GitBranch className="w-3.5 h-3.5" />,
  },
  {
    id: "b5",
    type: "action",
    label: "PLACE BUY ORDER",
    param: "Market order, 2% capital",
    icon: <Zap className="w-3.5 h-3.5" />,
  },
  {
    id: "b6",
    type: "action",
    label: "SET STOP LOSS",
    param: "-1.5% from entry",
    icon: <AlertTriangle className="w-3.5 h-3.5" />,
  },
  {
    id: "b7",
    type: "action",
    label: "SET TARGET",
    param: "+3% from entry",
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
  },
  {
    id: "b8",
    type: "action",
    label: "SEND ALERT",
    param: "Telegram + Push",
    icon: <Bell className="w-3.5 h-3.5" />,
  },
];

const LIBRARY_ITEMS = {
  indicators: ["RSI", "EMA", "MACD", "Volume", "Bollinger", "ATR", "VWAP"],
  candles: ["Bullish Engulfing", "Hammer", "Doji", "Shooting Star", "Marubozu"],
  triggers: ["Market Open", "Time Trigger", "Price Cross", "Volume Spike"],
  conditions: ["RSI above/below", "Price vs EMA", "MACD Crossover", "Day/Time"],
  actions: [
    "Place Buy/Sell",
    "Set SL",
    "Set Target",
    "Trail SL",
    "Send Alert",
    "Wait",
    "Exit All",
  ],
};

const TEMPLATES = [
  { name: "EMA Crossover", desc: "EMA9 crosses above EMA21", accuracy: 68 },
  { name: "RSI Reversal", desc: "RSI oversold bounce", accuracy: 72 },
  { name: "VWAP Bounce", desc: "Price bounces from VWAP", accuracy: 71 },
  {
    name: "Opening Range Breakout",
    desc: "First 15min range breakout",
    accuracy: 74,
  },
  {
    name: "Supertrend Following",
    desc: "Supertrend direction signals",
    accuracy: 69,
  },
  {
    name: "Bollinger Squeeze",
    desc: "Volatility squeeze breakout",
    accuracy: 67,
  },
];

function generateEquityCurve() {
  let equity = 500000;
  return Array.from({ length: 24 }, (_, i) => {
    equity += (Math.random() - 0.35) * 15000;
    const month = [
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
    ][i % 12];
    return {
      month: `${month} ${i < 12 ? "2023" : "2024"}`,
      equity: Math.max(equity, 400000),
    };
  });
}

const BLOCK_COLORS: Record<
  BlockType,
  { bg: string; border: string; text: string }
> = {
  trigger: { bg: "rgba(59,130,246,0.1)", border: "#3B82F644", text: "#60AFFF" },
  condition: {
    bg: "rgba(245,158,11,0.1)",
    border: "#F59E0B44",
    text: "#FBBF24",
  },
  action: { bg: "rgba(16,185,129,0.1)", border: "#10B98144", text: "#34D399" },
};

export default function StrategyBuilder() {
  const [blocks, setBlocks] = useState<StrategyBlock[]>(DEFAULT_BLOCKS);
  const [showBacktest, setShowBacktest] = useState(false);
  const [paperMode, setPaperMode] = useState(false);
  const equityCurve = useMemo(generateEquityCurve, []);

  const addBlock = (label: string, type: BlockType) => {
    const newBlock: StrategyBlock = {
      id: `b${Date.now()}`,
      type,
      label: label.toUpperCase(),
      icon:
        type === "condition" ? (
          <GitBranch className="w-3.5 h-3.5" />
        ) : (
          <Zap className="w-3.5 h-3.5" />
        ),
    };
    setBlocks((prev) => [...prev, newBlock]);
  };

  const removeBlock = (id: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <div
      className="px-4 lg:px-6 max-w-[1600px] mx-auto space-y-5 pb-6"
      data-ocid="strategy-builder.page"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-[#EAF0FF] flex items-center gap-2">
          <GitBranch className="w-5 h-5" style={{ color: "#F2C94C" }} />
          Strategy Builder
        </h1>
        <div className="flex gap-2">
          <Button
            data-ocid="strategy-builder.secondary_button"
            onClick={() => setPaperMode(!paperMode)}
            className="h-8 text-xs"
            style={{
              background: paperMode
                ? "rgba(99,102,241,0.2)"
                : "rgba(255,255,255,0.05)",
              color: paperMode ? "#A5B4FC" : "#9AA8C1",
              border: paperMode ? "1px solid #6366F133" : "1px solid #24344F",
            }}
          >
            <BookOpen className="w-3.5 h-3.5 mr-1" />
            Paper Trade {paperMode ? "ON" : "OFF"}
          </Button>
          <Button
            data-ocid="strategy-builder.primary_button"
            onClick={() => setShowBacktest(true)}
            className="h-8 text-xs"
            style={{ background: "#F2C94C", color: "#0B1424" }}
          >
            <Play className="w-3.5 h-3.5 mr-1" /> Backtest
          </Button>
        </div>
      </div>

      {/* Paper trade banner */}
      {paperMode && (
        <div
          className="p-3 rounded-xl flex items-center justify-between"
          style={{
            background: "rgba(99,102,241,0.08)",
            border: "1px solid #6366F133",
          }}
        >
          <div className="flex items-center gap-3">
            <BookOpen className="w-4 h-4 text-[#A5B4FC]" />
            <div>
              <span className="text-xs font-bold text-[#A5B4FC]">
                Paper Trading Active
              </span>
              <span className="text-xs text-[#9AA8C1] ml-3">
                Paper P&L:{" "}
                <strong className="text-[#10B981]">+Rs 12,840 (+2.6%)</strong> |
                Trades: 47 | Win Rate: 68.1%
              </span>
            </div>
          </div>
          <Badge
            style={{
              background: "rgba(16,185,129,0.15)",
              color: "#10B981",
              border: "1px solid #10B98133",
            }}
            className="text-[9px]"
          >
            Ready to go live? Accuracy 68% &gt; 65% threshold
          </Badge>
        </div>
      )}

      {/* Two-panel layout */}
      <div className="flex flex-col lg:flex-row gap-5">
        {/* Left: Blocks Library */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="trading-card p-4 space-y-4">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-[#9AA8C1]">
              Blocks Library
            </h2>
            {[
              {
                emoji: "📊",
                key: "indicators" as const,
                label: "INDICATORS",
                type: "condition" as BlockType,
              },
              {
                emoji: "🕯️",
                key: "candles" as const,
                label: "CANDLES",
                type: "condition" as BlockType,
              },
              {
                emoji: "⚡",
                key: "triggers" as const,
                label: "TRIGGERS",
                type: "trigger" as BlockType,
              },
              {
                emoji: "❓",
                key: "conditions" as const,
                label: "CONDITIONS",
                type: "condition" as BlockType,
              },
              {
                emoji: "⚙️",
                key: "actions" as const,
                label: "ACTIONS",
                type: "action" as BlockType,
              },
            ].map((section) => (
              <div key={section.key}>
                <div className="text-[9px] uppercase tracking-wider font-bold text-[#9AA8C1] mb-1.5">
                  {section.emoji} {section.label}
                </div>
                <div className="space-y-1">
                  {LIBRARY_ITEMS[section.key].map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => addBlock(item, section.type)}
                      className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-left transition-colors hover:bg-white/5"
                      style={{ border: "1px solid #1E2C44" }}
                    >
                      <span className="text-[10px] text-[#9AA8C1]">{item}</span>
                      <Plus className="w-3 h-3 text-[#9AA8C1]" />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Strategy Canvas */}
        <div className="flex-1">
          <div className="trading-card p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-[#9AA8C1]">
                Strategy Canvas
              </h2>
              <div className="flex gap-2">
                <Button
                  data-ocid="strategy-builder.save_button"
                  className="h-7 text-[10px] px-2"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    color: "#9AA8C1",
                    border: "1px solid #24344F",
                  }}
                >
                  <Save className="w-3 h-3 mr-1" /> Save
                </Button>
                <Button
                  data-ocid="strategy-builder.secondary_button"
                  className="h-7 text-[10px] px-2"
                  style={{
                    background: "rgba(16,185,129,0.15)",
                    color: "#10B981",
                    border: "1px solid #10B98133",
                  }}
                >
                  <Rocket className="w-3 h-3 mr-1" /> Deploy Live
                </Button>
                <Button
                  data-ocid="strategy-builder.delete_button"
                  onClick={() => setBlocks([])}
                  className="h-7 text-[10px] px-2"
                  style={{
                    background: "rgba(239,68,68,0.1)",
                    color: "#EF4444",
                    border: "1px solid #EF444422",
                  }}
                >
                  <RefreshCw className="w-3 h-3 mr-1" /> Clear
                </Button>
              </div>
            </div>

            {blocks.length === 0 ? (
              <div
                data-ocid="strategy-builder.empty_state"
                className="text-center py-12 text-[#9AA8C1] text-sm"
              >
                Canvas is empty. Add blocks from the library.
              </div>
            ) : (
              <div className="flex flex-col items-center gap-0 max-w-sm mx-auto">
                {blocks.map((block, i) => {
                  const colors = BLOCK_COLORS[block.type];
                  return (
                    <div key={block.id} className="w-full">
                      <div
                        className="flex items-center gap-2 p-3 rounded-xl relative group"
                        style={{
                          background: colors.bg,
                          border: `1px solid ${colors.border}`,
                        }}
                        data-ocid={`strategy-builder.item.${i + 1}`}
                      >
                        <div style={{ color: colors.text }}>{block.icon}</div>
                        <div className="flex-1">
                          <div
                            className="text-xs font-bold"
                            style={{ color: colors.text }}
                          >
                            {block.label}
                          </div>
                          {block.param && (
                            <div className="text-[9px] text-[#9AA8C1]">
                              {block.param}
                            </div>
                          )}
                        </div>
                        {block.type === "condition" && (
                          <div className="flex flex-col gap-1 text-[8px]">
                            <span style={{ color: "#10B981" }}>Yes →</span>
                            <span style={{ color: "#EF4444" }}>No → END</span>
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => removeBlock(block.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{ color: "#EF4444" }}
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      {i < blocks.length - 1 && (
                        <div className="flex justify-center py-1">
                          <ArrowDown
                            className="w-4 h-4"
                            style={{ color: "#374151" }}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Strategy Templates */}
      <div className="trading-card p-4">
        <h2 className="text-[10px] font-bold uppercase tracking-widest text-[#9AA8C1] mb-3">
          Strategy Templates
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {TEMPLATES.map((tmpl) => (
            <div
              key={tmpl.name}
              className="rounded-xl p-3 space-y-2"
              style={{ background: "#0D1117", border: "1px solid #1E2C44" }}
            >
              <div className="text-xs font-bold text-[#EAF0FF]">
                {tmpl.name}
              </div>
              <div className="text-[9px] text-[#9AA8C1]">{tmpl.desc}</div>
              <div className="flex items-center justify-between">
                <span className="text-[9px]" style={{ color: "#10B981" }}>
                  {tmpl.accuracy}% accuracy
                </span>
              </div>
              <Button
                onClick={() => setBlocks(DEFAULT_BLOCKS)}
                data-ocid="strategy-builder.secondary_button"
                className="w-full h-6 text-[9px]"
                style={{
                  background: "rgba(242,201,76,0.1)",
                  color: "#F2C94C",
                  border: "1px solid #F2C94C22",
                }}
              >
                Load Template
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Backtest Modal */}
      <Dialog open={showBacktest} onOpenChange={setShowBacktest}>
        <DialogContent
          className="max-w-3xl"
          style={{ background: "#111E33", border: "1px solid #24344F" }}
          data-ocid="strategy-builder.dialog"
        >
          <DialogHeader>
            <DialogTitle className="text-[#EAF0FF]">
              Backtest Results
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            {[
              { label: "Total Trades", value: "247", color: "#EAF0FF" },
              { label: "Win Rate", value: "72.1%", color: "#10B981" },
              { label: "Total Return", value: "+67.4%", color: "#10B981" },
              { label: "Max Drawdown", value: "-8.2%", color: "#EF4444" },
              { label: "Sharpe Ratio", value: "2.1", color: "#F2C94C" },
              { label: "Profit Factor", value: "2.8", color: "#F2C94C" },
              { label: "Avg Win", value: "+1.8%", color: "#10B981" },
              { label: "Avg Loss", value: "-0.9%", color: "#EF4444" },
            ].map((m) => (
              <div
                key={m.label}
                className="rounded-lg p-2 text-center"
                style={{ background: "#0D1117", border: "1px solid #1E2C44" }}
              >
                <div className="text-[9px] text-[#9AA8C1] uppercase">
                  {m.label}
                </div>
                <div className="text-lg font-black" style={{ color: m.color }}>
                  {m.value}
                </div>
              </div>
            ))}
          </div>
          <div>
            <div className="text-[10px] text-[#9AA8C1] uppercase tracking-wider mb-2">
              Equity Curve
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={equityCurve}>
                <defs>
                  <linearGradient id="btGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E2C44" />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "#9AA8C1", fontSize: 8 }}
                  interval={5}
                />
                <YAxis tick={{ fill: "#9AA8C1", fontSize: 8 }} />
                <Tooltip
                  contentStyle={{
                    background: "#0D1117",
                    border: "1px solid #24344F",
                    fontSize: 11,
                  }}
                  formatter={(v: number) => [
                    `Rs${v.toLocaleString()}`,
                    "Equity",
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="equity"
                  stroke="#10B981"
                  fill="url(#btGrad)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-3 mt-2">
            <Button
              data-ocid="strategy-builder.confirm_button"
              className="flex-1 h-9 text-xs font-bold"
              style={{ background: "#10B981", color: "#fff" }}
            >
              <Rocket className="w-3.5 h-3.5 mr-1" /> Deploy Live
            </Button>
            <Button
              data-ocid="strategy-builder.secondary_button"
              className="flex-1 h-9 text-xs"
              style={{
                background: "rgba(99,102,241,0.15)",
                color: "#A5B4FC",
                border: "1px solid #6366F133",
              }}
            >
              <BookOpen className="w-3.5 h-3.5 mr-1" /> Paper Trade
            </Button>
            <Button
              data-ocid="strategy-builder.close_button"
              onClick={() => setShowBacktest(false)}
              className="h-9 text-xs px-4"
              style={{
                background: "rgba(255,255,255,0.05)",
                color: "#9AA8C1",
                border: "1px solid #24344F",
              }}
            >
              <X className="w-3.5 h-3.5 mr-1" /> Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
