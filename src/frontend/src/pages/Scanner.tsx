import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Bell,
  Filter,
  Plus,
  RefreshCw,
  Save,
  TrendingDown,
  TrendingUp,
  Volume2,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useMarketData } from "../hooks/useMarketData";

type ScanResult = {
  symbol: string;
  exchange: string;
  assetClass: string;
  price: number;
  changePct: number;
  volume: string;
  trigger: string;
  signal: string;
  confidence: number;
};

const generateScanResults = (): ScanResult[] => [
  {
    symbol: "RELIANCE",
    exchange: "NSE",
    assetClass: "equity",
    price: 2847,
    changePct: 2.34,
    volume: "12.4M",
    trigger: "EMA 9 crossed above EMA 21",
    signal: "strongBuy",
    confidence: 87,
  },
  {
    symbol: "BANKNIFTY",
    exchange: "NSE",
    assetClass: "index",
    price: 52445,
    changePct: 1.82,
    volume: "8.2M",
    trigger: "RSI(14) crossed 50 with volume surge",
    signal: "buy",
    confidence: 74,
  },
  {
    symbol: "SBIN",
    exchange: "NSE",
    assetClass: "equity",
    price: 784,
    changePct: 3.21,
    volume: "28.7M",
    trigger: "Breakout above resistance 780",
    signal: "strongBuy",
    confidence: 91,
  },
  {
    symbol: "BTC/USD",
    exchange: "CRYPTO",
    assetClass: "crypto",
    price: 67234,
    changePct: -2.14,
    volume: "$4.2B",
    trigger: "RSI overbought (78)",
    signal: "sell",
    confidence: 68,
  },
  {
    symbol: "INFY",
    exchange: "NSE",
    assetClass: "equity",
    price: 1847,
    changePct: -1.65,
    volume: "9.1M",
    trigger: "MACD bearish crossover",
    signal: "sell",
    confidence: 71,
  },
  {
    symbol: "TATAMOTORS",
    exchange: "NSE",
    assetClass: "equity",
    price: 972,
    changePct: 4.82,
    volume: "34.5M",
    trigger: "Gap up + volume 3x average",
    signal: "strongBuy",
    confidence: 88,
  },
  {
    symbol: "GOLD",
    exchange: "MCX",
    assetClass: "commodity",
    price: 72450,
    changePct: 0.78,
    volume: "2.1M oz",
    trigger: "BB lower band bounce + RSI 32",
    signal: "buy",
    confidence: 76,
  },
  {
    symbol: "NIFTYIT",
    exchange: "NSE",
    assetClass: "index",
    price: 38420,
    changePct: -0.95,
    volume: "5.4M",
    trigger: "ADX(14) rising, RSI 62",
    signal: "neutral",
    confidence: 55,
  },
  {
    symbol: "MARUTI",
    exchange: "NSE",
    assetClass: "equity",
    price: 12456,
    changePct: 2.14,
    volume: "1.8M",
    trigger: "Breakout triangle pattern",
    signal: "buy",
    confidence: 79,
  },
  {
    symbol: "ETH/USD",
    exchange: "CRYPTO",
    assetClass: "crypto",
    price: 3456,
    changePct: -0.92,
    volume: "$1.8B",
    trigger: "Support at 3400 holding",
    signal: "neutral",
    confidence: 52,
  },
  {
    symbol: "NTPC",
    exchange: "NSE",
    assetClass: "equity",
    price: 367,
    changePct: 5.14,
    volume: "45.2M",
    trigger: "Gap up from earnings beat",
    signal: "strongBuy",
    confidence: 93,
  },
  {
    symbol: "CRUDE",
    exchange: "MCX",
    assetClass: "commodity",
    price: 87.34,
    changePct: 1.44,
    volume: "890K bbl",
    trigger: "Supertrend turned bullish",
    signal: "buy",
    confidence: 72,
  },
];

const SIGNAL_CONFIG: Record<
  string,
  { label: string; color: string; icon: React.ReactNode }
> = {
  strongBuy: {
    label: "STRONG BUY",
    color: "#2ED47A",
    icon: <TrendingUp className="w-3 h-3" />,
  },
  buy: {
    label: "BUY",
    color: "#2ED47A",
    icon: <TrendingUp className="w-3 h-3" />,
  },
  neutral: {
    label: "NEUTRAL",
    color: "#E7D27C",
    icon: <Zap className="w-3 h-3" />,
  },
  sell: {
    label: "SELL",
    color: "#FF5A5F",
    icon: <TrendingDown className="w-3 h-3" />,
  },
  strongSell: {
    label: "STRONG SELL",
    color: "#FF5A5F",
    icon: <TrendingDown className="w-3 h-3" />,
  },
};

const SECTOR_ROTATION = [
  { sector: "Banking", flow: 1240, trend: "up", signal: "BUY" },
  { sector: "FMCG", flow: 840, trend: "up", signal: "BUY" },
  { sector: "Auto", flow: 520, trend: "up", signal: "BUY" },
  { sector: "IT", flow: -840, trend: "down", signal: "SELL" },
  { sector: "Pharma", flow: -420, trend: "down", signal: "REDUCE" },
  { sector: "Metal", flow: -210, trend: "down", signal: "REDUCE" },
];

type ConditionRow = {
  id: string;
  indicator: string;
  condition: string;
  value: string;
};

export default function Scanner() {
  const { getPrice } = useMarketData();
  const [results, setResults] = useState(generateScanResults);
  const [lastScan, setLastScan] = useState(new Date());
  const [scanning, setScanning] = useState(false);
  const [exchange, setExchange] = useState("all");
  const [assetClass, setAssetClass] = useState("all");
  const [minConf, setMinConf] = useState("50");
  const [activeTab, setActiveTab] = useState("all");
  const [scanCategory, setScanCategory] = useState("MOMENTUM");
  const [conditions, setConditions] = useState<ConditionRow[]>([
    { id: "c1", indicator: "RSI(14)", condition: ">", value: "60" },
    { id: "c2", indicator: "Volume", condition: ">", value: "2x avg" },
  ]);
  const [scanName, setScanName] = useState("My Momentum Setup");

  useEffect(() => {
    const iv = setInterval(() => {
      setResults(generateScanResults());
      setLastScan(new Date());
    }, 30000);
    return () => clearInterval(iv);
  }, []);

  const handleRunScan = () => {
    setScanning(true);
    setTimeout(() => {
      setResults(generateScanResults());
      setLastScan(new Date());
      setScanning(false);
    }, 1200);
  };

  const addCondition = () => {
    setConditions((prev) => [
      ...prev,
      {
        id: `c${Date.now()}`,
        indicator: "RSI(14)",
        condition: ">",
        value: "50",
      },
    ]);
  };

  const removeCondition = (id: string) => {
    setConditions((prev) => prev.filter((c) => c.id !== id));
  };

  const filterResults = (tab: string) => {
    let filtered = results;
    if (exchange !== "all")
      filtered = filtered.filter((r) => r.exchange === exchange);
    if (assetClass !== "all")
      filtered = filtered.filter((r) => r.assetClass === assetClass);
    filtered = filtered.filter((r) => r.confidence >= Number.parseInt(minConf));
    switch (tab) {
      case "breakouts":
        return filtered.filter((r) =>
          r.trigger.toLowerCase().includes("breakout"),
        );
      case "overbought":
        return filtered.filter(
          (r) =>
            r.trigger.toLowerCase().includes("rsi") ||
            r.trigger.toLowerCase().includes("overbought") ||
            r.trigger.toLowerCase().includes("oversold"),
        );
      case "volume":
        return filtered.filter(
          (r) => r.trigger.toLowerCase().includes("volume") || r.changePct > 2,
        );
      case "gap":
        return filtered.filter((r) => r.trigger.toLowerCase().includes("gap"));
      default:
        return filtered;
    }
  };

  const displayResults = filterResults(activeTab);

  return (
    <div
      className="px-4 lg:px-6 max-w-[1600px] mx-auto space-y-5"
      data-ocid="scanner.page"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-[#EAF0FF]">Market Scanner</h1>
        <div className="flex items-center gap-3">
          <span className="text-xs text-[#9AA8C1]">
            Last scan: {lastScan.toLocaleTimeString("en-IN")}
          </span>
          <Button
            data-ocid="scanner.primary_button"
            onClick={handleRunScan}
            disabled={scanning}
            className="h-8 text-xs gap-1.5"
            style={{ background: "#F2C94C", color: "#0B1424" }}
          >
            {scanning ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Zap className="w-3.5 h-3.5" />
            )}
            {scanning ? "Scanning..." : "Run Scan"}
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <Select value={exchange} onValueChange={setExchange}>
          <SelectTrigger
            data-ocid="scanner.select"
            className="h-8 text-xs bg-white/5 border-[#24344F] text-[#EAF0FF] w-32"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent
            style={{ background: "#111E33", border: "1px solid #24344F" }}
          >
            {["all", "NSE", "BSE", "MCX", "CRYPTO", "NASDAQ"].map((e) => (
              <SelectItem key={e} value={e} className="text-[#EAF0FF] text-xs">
                {e === "all" ? "All Exchanges" : e}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={assetClass} onValueChange={setAssetClass}>
          <SelectTrigger
            data-ocid="scanner.select"
            className="h-8 text-xs bg-white/5 border-[#24344F] text-[#EAF0FF] w-36"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent
            style={{ background: "#111E33", border: "1px solid #24344F" }}
          >
            {["all", "equity", "index", "crypto", "commodity", "forex"].map(
              (a) => (
                <SelectItem
                  key={a}
                  value={a}
                  className="text-[#EAF0FF] text-xs"
                >
                  {a === "all" ? "All Classes" : a}
                </SelectItem>
              ),
            )}
          </SelectContent>
        </Select>
        <Select value={minConf} onValueChange={setMinConf}>
          <SelectTrigger
            data-ocid="scanner.select"
            className="h-8 text-xs bg-white/5 border-[#24344F] text-[#EAF0FF] w-40"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent
            style={{ background: "#111E33", border: "1px solid #24344F" }}
          >
            {["50", "60", "70", "80", "90"].map((c) => (
              <SelectItem key={c} value={c} className="text-[#EAF0FF] text-xs">
                Min Confidence {c}%
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-white/5 border border-[#24344F] h-8">
          {[
            { value: "all", label: "All Signals" },
            { value: "breakouts", label: "Breakouts" },
            { value: "overbought", label: "RSI Signals" },
            { value: "volume", label: "High Volume" },
            { value: "gap", label: "Gap Up/Down" },
          ].map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              data-ocid="scanner.tab"
              className="text-[10px] h-6 data-[state=active]:bg-[#F2C94C] data-[state=active]:text-[#0B1424]"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeTab}>
          {displayResults.length === 0 ? (
            <div
              data-ocid="scanner.empty_state"
              className="trading-card p-12 text-center"
            >
              <p className="text-[#9AA8C1] text-sm">
                No results match your filters. Try adjusting the criteria.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {displayResults.map((result, i) => {
                const sigConf =
                  SIGNAL_CONFIG[result.signal] ?? SIGNAL_CONFIG.neutral;
                const market = getPrice(result.symbol);
                const currentPct = market ? market.changePct : result.changePct;
                const isUp = currentPct >= 0;
                return (
                  <div
                    key={result.symbol}
                    data-ocid={`scanner.item.${i + 1}`}
                    className="trading-card p-3 hover:shadow-card transition-shadow cursor-pointer"
                    style={{ borderLeft: `3px solid ${sigConf.color}` }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-bold text-sm text-[#EAF0FF]">
                          {result.symbol}
                        </div>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Badge
                            className="text-[9px] py-0 h-4"
                            style={{
                              background: "rgba(96,175,255,0.1)",
                              color: "#60AFFF",
                              border: "1px solid #60AFFF44",
                            }}
                          >
                            {result.exchange}
                          </Badge>
                          <span className="text-[9px] text-[#9AA8C1] capitalize">
                            {result.assetClass}
                          </span>
                        </div>
                      </div>
                      <Badge
                        className="text-[9px] flex items-center gap-0.5"
                        style={{
                          background: `${sigConf.color}22`,
                          color: sigConf.color,
                          border: `1px solid ${sigConf.color}44`,
                        }}
                      >
                        {sigConf.icon} {sigConf.label}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-base font-bold tabular-nums text-[#EAF0FF]">
                        {result.price > 100
                          ? result.price.toLocaleString("en-IN")
                          : result.price.toFixed(2)}
                      </span>
                      <span
                        className="text-xs font-semibold flex items-center gap-0.5"
                        style={{ color: isUp ? "#2ED47A" : "#FF5A5F" }}
                      >
                        {isUp ? (
                          <ArrowUp className="w-3 h-3" />
                        ) : (
                          <ArrowDown className="w-3 h-3" />
                        )}
                        {isUp ? "+" : ""}
                        {currentPct.toFixed(2)}%
                      </span>
                    </div>
                    <div className="flex items-start gap-1 mb-2">
                      <Volume2 className="w-3 h-3 text-[#9AA8C1] mt-0.5 flex-shrink-0" />
                      <span className="text-[10px] text-[#9AA8C1]">
                        {result.volume}
                      </span>
                    </div>
                    <div
                      className="text-[10px] text-[#9AA8C1] border-t pt-2"
                      style={{ borderColor: "#24344F" }}
                    >
                      {result.trigger}
                    </div>
                    <div className="flex justify-end mt-1">
                      <span
                        className="text-[10px] font-bold"
                        style={{ color: sigConf.color }}
                      >
                        Conf. {result.confidence}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* === NEW SECTIONS BELOW === */}

      {/* Scan Template Category Pills */}
      <div>
        <h2 className="text-[10px] font-bold uppercase tracking-widest text-[#9AA8C1] mb-3 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" /> Scan Templates
        </h2>
        <div className="overflow-x-auto">
          <div className="flex gap-2 pb-1 min-w-max">
            {[
              "MOMENTUM",
              "REVERSAL",
              "BREAKOUT",
              "FUNDAMENTAL",
              "OPTIONS F&O",
            ].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setScanCategory(cat)}
                data-ocid="scanner.tab"
                className="px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap"
                style={{
                  background:
                    scanCategory === cat ? "#F2C94C" : "rgba(255,255,255,0.05)",
                  color: scanCategory === cat ? "#0B1424" : "#9AA8C1",
                  border:
                    scanCategory === cat
                      ? "1px solid #F2C94C"
                      : "1px solid #24344F",
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 mt-3">
          {[
            {
              MOMENTUM: [
                "RSI Breakout: RSI > 60 + 2x vol",
                "EMA Crossover: EMA9 > EMA21",
                "MACD Signal: bullish crossover",
                "52-Week High Breakout",
                "Top Momentum Score",
              ],
            },
            {
              REVERSAL: [
                "RSI Oversold: RSI < 30",
                "Hammer at Support",
                "Bullish Divergence",
                "Bollinger Bounce",
                "Double Bottom Detected",
              ],
            },
            {
              BREAKOUT: [
                "Volume Breakout",
                "Consolidation Break",
                "Resistance Break",
                "IPO Breakout",
                "Pattern Breakout",
              ],
            },
            {
              FUNDAMENTAL: [
                "Earnings Beat > 10%",
                "Revenue 3Q Growth",
                "Debt Free + Cash+",
                "High ROE > 20%",
                "Dividend Growth 5Y",
              ],
            },
            {
              "OPTIONS F&O": [
                "High OI Buildup",
                "PCR Extremes",
                "IV Crush Play",
                "Max Pain Zone",
                "Unusual Options Activity",
              ],
            },
          ]
            .flatMap((obj) => obj[scanCategory] ?? [])
            .map((scan) => (
              <button
                key={scan}
                type="button"
                className="text-left p-2 rounded-lg text-[10px] text-[#9AA8C1] hover:bg-white/5 transition-colors"
                style={{ border: "1px solid #1E2C44" }}
                onClick={handleRunScan}
              >
                {scan}
              </button>
            ))}
        </div>
      </div>

      {/* Custom Screener Builder */}
      <div className="trading-card p-5">
        <h2 className="text-[10px] font-bold uppercase tracking-widest text-[#9AA8C1] mb-4">
          Custom Screener Builder
        </h2>
        <div className="space-y-2 mb-4">
          {conditions.map((cond, i) => (
            <div key={cond.id} className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] text-[#9AA8C1] w-8">
                {i === 0 ? "IF" : "AND"}
              </span>
              <Select
                value={cond.indicator}
                onValueChange={(val) =>
                  setConditions((prev) =>
                    prev.map((c) =>
                      c.id === cond.id ? { ...c, indicator: val } : c,
                    ),
                  )
                }
              >
                <SelectTrigger
                  data-ocid="scanner.select"
                  className="h-8 text-xs bg-white/5 border-[#24344F] text-[#EAF0FF] w-28"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent
                  style={{ background: "#111E33", border: "1px solid #24344F" }}
                >
                  {[
                    "RSI(14)",
                    "EMA(9)",
                    "MACD",
                    "Volume",
                    "Market Cap",
                    "Price",
                  ].map((s) => (
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
              <Select
                value={cond.condition}
                onValueChange={(val) =>
                  setConditions((prev) =>
                    prev.map((c) =>
                      c.id === cond.id ? { ...c, condition: val } : c,
                    ),
                  )
                }
              >
                <SelectTrigger
                  data-ocid="scanner.select"
                  className="h-8 text-xs bg-white/5 border-[#24344F] text-[#EAF0FF] w-32"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent
                  style={{ background: "#111E33", border: "1px solid #24344F" }}
                >
                  {[">", "<", "crosses above", "crosses below", "="].map(
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
              <Input
                value={cond.value}
                onChange={(e) =>
                  setConditions((prev) =>
                    prev.map((c) =>
                      c.id === cond.id ? { ...c, value: e.target.value } : c,
                    ),
                  )
                }
                data-ocid="scanner.input"
                className="h-8 text-xs bg-white/5 border-[#24344F] text-[#EAF0FF] w-24"
              />
              {conditions.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeCondition(cond.id)}
                  className="text-[#EF4444] hover:text-[#F87171]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addCondition}
          className="flex items-center gap-1 text-[10px] text-[#F2C94C] hover:text-[#F2C94C]/80 mb-4"
        >
          <Plus className="w-3.5 h-3.5" /> Add Condition
        </button>
        <div className="flex flex-wrap items-center gap-3">
          <Input
            value={scanName}
            onChange={(e) => setScanName(e.target.value)}
            placeholder="Save scan as..."
            data-ocid="scanner.input"
            className="h-8 text-xs bg-white/5 border-[#24344F] text-[#EAF0FF] w-48"
          />
          <Button
            data-ocid="scanner.primary_button"
            onClick={handleRunScan}
            disabled={scanning}
            className="h-8 text-xs font-bold gap-1"
            style={{ background: "#F2C94C", color: "#0B1424" }}
          >
            <Zap className="w-3.5 h-3.5" />
            {scanning ? "Scanning..." : "Run Scan"}
          </Button>
          <Button
            data-ocid="scanner.secondary_button"
            className="h-8 text-xs gap-1"
            style={{
              background: "rgba(255,255,255,0.05)",
              color: "#9AA8C1",
              border: "1px solid #24344F",
            }}
          >
            <Save className="w-3.5 h-3.5" /> Save Scan
          </Button>
          <Button
            data-ocid="scanner.secondary_button"
            className="h-8 text-xs gap-1"
            style={{
              background: "rgba(99,102,241,0.15)",
              color: "#A5B4FC",
              border: "1px solid #6366F133",
            }}
          >
            <Bell className="w-3.5 h-3.5" /> Set Alert
          </Button>
        </div>
      </div>

      {/* Sector Rotation */}
      <div className="trading-card p-5">
        <h2 className="text-[10px] font-bold uppercase tracking-widest text-[#9AA8C1] mb-4">
          Sector Rotation Detector
        </h2>
        <div
          className="p-4 rounded-xl mb-4 flex items-center gap-4"
          style={{
            background: "rgba(242,201,76,0.06)",
            border: "1px solid #F2C94C22",
          }}
        >
          <div className="text-center">
            <div className="text-[9px] text-[#EF4444] uppercase tracking-wider mb-1">
              Money Moving FROM
            </div>
            <div className="text-sm font-bold text-[#EF4444]">IT Sector</div>
            <div className="text-[10px] text-[#EF4444]">-Rs840 Cr today</div>
          </div>
          <ArrowRight className="w-8 h-8 text-[#F2C94C] flex-shrink-0" />
          <div className="text-center">
            <div className="text-[9px] text-[#10B981] uppercase tracking-wider mb-1">
              Money Moving TO
            </div>
            <div className="text-sm font-bold text-[#10B981]">Banking</div>
            <div className="text-[10px] text-[#10B981]">+Rs1,240 Cr today</div>
          </div>
          <div className="ml-auto text-xs text-[#9AA8C1] max-w-xs">
            Recommendation:{" "}
            <span className="text-[#EAF0FF] font-semibold">
              Reduce IT exposure, increase Banking
            </span>
          </div>
        </div>
        <table className="w-full text-xs">
          <thead>
            <tr style={{ borderBottom: "1px solid #24344F" }}>
              {["Sector", "Flow Today", "5D Trend", "Signal"].map((h) => (
                <th
                  key={h}
                  className="text-left py-1.5 px-2 text-[9px] text-[#9AA8C1] uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SECTOR_ROTATION.map((sec, i) => (
              <tr
                key={sec.sector}
                data-ocid={`scanner.row.${i + 1}`}
                style={{ borderBottom: "1px solid #1E2C44" }}
                className="hover:bg-white/5"
              >
                <td className="py-2 px-2 font-semibold text-[#EAF0FF]">
                  {sec.sector}
                </td>
                <td
                  className="py-2 px-2 font-bold"
                  style={{ color: sec.flow >= 0 ? "#10B981" : "#EF4444" }}
                >
                  {sec.flow >= 0 ? "+" : ""}Rs{Math.abs(sec.flow)} Cr
                </td>
                <td className="py-2 px-2">
                  {sec.trend === "up" ? (
                    <TrendingUp className="w-3.5 h-3.5 text-[#10B981]" />
                  ) : (
                    <TrendingDown className="w-3.5 h-3.5 text-[#EF4444]" />
                  )}
                </td>
                <td className="py-2 px-2">
                  <Badge
                    className="text-[9px]"
                    style={{
                      background:
                        sec.flow >= 0
                          ? "rgba(16,185,129,0.15)"
                          : "rgba(239,68,68,0.15)",
                      color: sec.flow >= 0 ? "#10B981" : "#EF4444",
                    }}
                  >
                    {sec.signal}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
