import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader } from "@/components/ui/sheet";
import { TrendingDown, TrendingUp, X, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface ChartBar {
  open: number;
  high: number;
  low: number;
  close: number;
}

function generateCandles(basePrice: number, count: number): ChartBar[] {
  let price = basePrice;
  return Array.from({ length: count }, () => {
    const vol = basePrice * 0.01;
    const change = (Math.random() - 0.48) * vol;
    const open = price;
    const close = price + change;
    const high = Math.max(open, close) + Math.random() * vol * 0.4;
    const low = Math.min(open, close) - Math.random() * vol * 0.4;
    price = close;
    return { open, high, low, close };
  });
}

// Compute EMA
function computeEMA(prices: number[], period: number): number[] {
  const k = 2 / (period + 1);
  const ema: number[] = [prices[0]];
  for (let i = 1; i < prices.length; i++) {
    ema.push(prices[i] * k + ema[i - 1] * (1 - k));
  }
  return ema;
}

// Compute RSI(14)
function computeRSI(candles: ChartBar[]): number {
  const closes = candles.map((c) => c.close);
  const changes = closes.slice(1).map((c, i) => c - closes[i]);
  const last14 = changes.slice(-14);
  const gains = last14.filter((c) => c > 0);
  const losses = last14.filter((c) => c < 0).map((c) => Math.abs(c));
  const avgGain = gains.length ? gains.reduce((a, b) => a + b, 0) / 14 : 0;
  const avgLoss = losses.length ? losses.reduce((a, b) => a + b, 0) / 14 : 0;
  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return Math.round(100 - 100 / (1 + rs));
}

// Compute MACD
function computeMACD(candles: ChartBar[]): {
  macd: number;
  signal: number;
  histogram: number;
} {
  const closes = candles.map((c) => c.close);
  const ema12 = computeEMA(closes, 12);
  const ema26 = computeEMA(closes, 26);
  const macdLine = ema12.map((v, i) => v - ema26[i]);
  const signalLine = computeEMA(macdLine.slice(-9), 9);
  const macd = macdLine[macdLine.length - 1];
  const signal = signalLine[signalLine.length - 1];
  return { macd, signal, histogram: macd - signal };
}

// Compute EMA value at last point
function lastEMA(candles: ChartBar[], period: number): number {
  const closes = candles.map((c) => c.close);
  const ema = computeEMA(closes, period);
  return ema[ema.length - 1];
}

function getCurrencySymbol(symbol: string): string {
  const inrSymbols = [
    "NIFTY",
    "SENSEX",
    "BANKNIFTY",
    "RELIANCE",
    "TCS",
    "HDFC",
    "INFY",
    "GOLD_INR",
    "USDINR",
  ];
  if (inrSymbols.some((s) => symbol.toUpperCase().includes(s))) return "₹";
  if (
    symbol.includes("BTC") ||
    symbol.includes("ETH") ||
    symbol.includes("USD") ||
    symbol.includes("EUR") ||
    symbol.includes("GBP") ||
    symbol.includes("CRUDE") ||
    symbol.includes("AAPL") ||
    symbol.includes("MSFT") ||
    symbol.includes("GOLD")
  )
    return "$";
  return "₹";
}

function getExchangeLabel(symbol: string): string {
  if (
    symbol.includes("BTC") ||
    symbol.includes("ETH") ||
    symbol.includes("SOL")
  )
    return "CRYPTO";
  if (
    symbol.includes("USD") ||
    symbol.includes("EUR") ||
    symbol.includes("GBP")
  )
    return "FOREX";
  if (
    symbol.includes("NIFTY") ||
    symbol.includes("SENSEX") ||
    symbol.includes("BANKNIFTY")
  )
    return "NSE";
  if (["RELIANCE", "TCS", "HDFCBANK", "INFY"].includes(symbol)) return "NSE";
  if (["AAPL", "MSFT"].includes(symbol)) return "NASDAQ";
  if (symbol.includes("CRUDE") || symbol.includes("GOLD")) return "MCX";
  return "NSE";
}

export interface StockDetailModalProps {
  symbol: string;
  open: boolean;
  onClose: () => void;
  currentPrice?: number;
  changePct?: number;
  currency?: string;
}

export default function StockDetailModal({
  symbol,
  open,
  onClose,
  currentPrice,
  changePct,
  currency,
}: StockDetailModalProps) {
  const basePrice = currentPrice ?? 1000;
  const [candles, setCandles] = useState<ChartBar[]>(() =>
    generateCandles(basePrice, 40),
  );
  const [livePrice, setLivePrice] = useState(basePrice);
  const [liveChangePct, setLiveChangePct] = useState(changePct ?? 0);

  // Reset candles when symbol changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional reset on symbol
  useEffect(() => {
    const initial = generateCandles(basePrice, 40);
    setCandles(initial);
    const last = initial[initial.length - 1].close;
    setLivePrice(last);
    setLiveChangePct(((last - initial[0].close) / initial[0].close) * 100);
  }, [symbol]);

  // Live update every 3s
  useEffect(() => {
    if (!open) return;
    const interval = setInterval(() => {
      setCandles((prev) => {
        const last = prev[prev.length - 1];
        const vol = last.close * 0.008;
        const newClose = last.close + (Math.random() - 0.47) * vol;
        const newCandle: ChartBar = {
          open: last.close,
          high: Math.max(last.close, newClose) + Math.random() * vol * 0.3,
          low: Math.min(last.close, newClose) - Math.random() * vol * 0.3,
          close: newClose,
        };
        const updated = [...prev.slice(1), newCandle];
        const firstClose = updated[0].close;
        setLivePrice(newClose);
        setLiveChangePct(((newClose - firstClose) / firstClose) * 100);
        return updated;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [open]);

  // Technical calculations
  const rsi = computeRSI(candles);
  const { macd, signal: macdSignal } = computeMACD(candles);
  const ema9 = lastEMA(candles, 9);
  const ema21 = lastEMA(candles, 21);
  const last20 = candles.slice(-20);
  const support = Math.min(...last20.map((c) => c.low));
  const resistance = Math.max(...last20.map((c) => c.high));
  const currentClose = candles[candles.length - 1]?.close ?? basePrice;

  // RSI label
  const rsiLabel =
    rsi < 30
      ? "Oversold"
      : rsi < 45
        ? "Near Oversold"
        : rsi > 70
          ? "Overbought"
          : rsi > 55
            ? "Near Overbought"
            : "Neutral";
  const rsiColor = rsi < 40 ? "#2ED47A" : rsi > 70 ? "#FF5A5F" : "#E7D27C";

  // MACD label
  const macdLabel =
    macd > macdSignal
      ? "Bullish Crossover"
      : macd < macdSignal
        ? "Bearish Crossover"
        : "Neutral";
  const macdColor =
    macd > macdSignal ? "#2ED47A" : macd < macdSignal ? "#FF5A5F" : "#E7D27C";

  // Trend
  const diff = ((ema9 - ema21) / ema21) * 100;
  const trendLabel =
    diff > 0.5
      ? "Strong Uptrend"
      : diff > 0.1
        ? "Uptrend"
        : diff < -0.5
          ? "Downtrend"
          : "Sideways";
  const trendColor =
    diff > 0.5
      ? "#2ED47A"
      : diff > 0.1
        ? "#86EFAC"
        : diff < -0.5
          ? "#FF5A5F"
          : "#E7D27C";

  // Volume (simulated)
  const volSeed = symbol.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const volRandom = (volSeed % 100) / 100 + Math.random() * 0.3 > 0.5;
  const volumeLabel = volRandom ? "Above Average" : "Below Average";
  const volumeColor = volRandom ? "#2ED47A" : "#9AA8C1";

  // AI Signal — combine RSI + MACD + trend
  let aiSignal: string;
  let aiColor: string;
  let aiConfidence: number;
  const bullCount = [macd > macdSignal, diff > 0, rsi < 60 && rsi > 30].filter(
    Boolean,
  ).length;
  const bearCount = [macd < macdSignal, diff < 0, rsi > 65].filter(
    Boolean,
  ).length;

  if (rsi < 30 && macd > macdSignal) {
    aiSignal = "STRONG BUY";
    aiColor = "#2ED47A";
    aiConfidence = 82 + Math.round(volSeed % 10);
  } else if (bullCount >= 3) {
    aiSignal = "STRONG BUY";
    aiColor = "#2ED47A";
    aiConfidence = 78 + Math.round(volSeed % 8);
  } else if (bullCount === 2) {
    aiSignal = "BUY";
    aiColor = "#86EFAC";
    aiConfidence = 65 + Math.round(volSeed % 12);
  } else if (rsi > 75 && macd < macdSignal) {
    aiSignal = "STRONG SELL";
    aiColor = "#FF5A5F";
    aiConfidence = 79 + Math.round(volSeed % 9);
  } else if (bearCount >= 2) {
    aiSignal = "SELL";
    aiColor = "#FF9898";
    aiConfidence = 63 + Math.round(volSeed % 13);
  } else {
    aiSignal = "NEUTRAL";
    aiColor = "#E7D27C";
    aiConfidence = 50 + Math.round(volSeed % 15);
  }

  // R:R
  const entryPrice = currentClose;
  const targetPct = aiSignal.includes("BUY") ? (rsi < 40 ? 4.5 : 2.8) : 1.5;
  const slPct = aiSignal.includes("BUY")
    ? 1.8
    : aiSignal.includes("SELL")
      ? 2.2
      : 2.0;
  const targetPrice = entryPrice * (1 + targetPct / 100);
  const stopLoss = entryPrice * (1 - slPct / 100);
  const rrRatio = (targetPct / slPct).toFixed(1);

  const curr = currency ?? getCurrencySymbol(symbol);
  const exchange = getExchangeLabel(symbol);
  const isUp = liveChangePct >= 0;

  // Mini SVG chart
  const W = 360;
  const H = 120;
  const PAD = { top: 8, right: 8, bottom: 8, left: 40 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;
  const allPrices = candles.flatMap((c) => [c.high, c.low]);
  const minP = Math.min(...allPrices);
  const maxP = Math.max(...allPrices);
  const priceRange = maxP - minP || 1;
  const candleW = Math.max(2, chartW / candles.length - 1);
  const toY = (p: number) =>
    PAD.top + chartH - ((p - minP) / priceRange) * chartH;
  const toX = (i: number) =>
    PAD.left + i * (chartW / candles.length) + candleW / 2;
  const lastClose = candles[candles.length - 1]?.close ?? basePrice;
  const firstClose = candles[0]?.close ?? basePrice;
  const chartIsUp = lastClose >= firstClose;

  const formatPrice = (p: number) =>
    p > 1000
      ? p.toLocaleString("en-IN", { maximumFractionDigits: 2 })
      : p > 100
        ? p.toFixed(2)
        : p > 1
          ? p.toFixed(4)
          : p.toFixed(6);

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent
        side="right"
        className="w-[420px] p-0 overflow-y-auto"
        style={{
          background: "#0D1928",
          border: "1px solid #24344F",
          borderRight: "none",
        }}
        data-ocid="stock.modal"
      >
        <SheetHeader className="px-0 py-0">
          {/* Header */}
          <div
            className="flex items-start justify-between p-4 border-b"
            style={{ borderColor: "#24344F" }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black flex-shrink-0"
                style={{ background: "#1A2A42", color: "#F2C94C" }}
              >
                {symbol.replace("/", "").slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-base text-[#EAF0FF]">
                    {symbol}
                  </span>
                  <Badge
                    className="text-[9px] py-0"
                    style={{
                      background: "rgba(96,175,255,0.12)",
                      color: "#60AFFF",
                      border: "1px solid rgba(96,175,255,0.3)",
                    }}
                  >
                    {exchange}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-lg font-black tabular-nums text-[#EAF0FF]">
                    {curr}
                    {formatPrice(livePrice)}
                  </span>
                  <span
                    className="text-xs font-semibold flex items-center gap-0.5"
                    style={{ color: isUp ? "#2ED47A" : "#FF5A5F" }}
                  >
                    {isUp ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    {isUp ? "+" : ""}
                    {liveChangePct.toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
            <button
              type="button"
              data-ocid="stock.close_button"
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4 text-[#9AA8C1]" />
            </button>
          </div>
        </SheetHeader>

        <div className="space-y-4 p-4">
          {/* Mini Chart */}
          <div
            className="rounded-xl overflow-hidden"
            style={{ background: "#0B1424", border: "1px solid #1E2C44" }}
          >
            <div className="flex items-center justify-between px-3 pt-2.5 pb-1">
              <span className="text-[10px] font-bold text-[#9AA8C1] uppercase tracking-wider">
                Price Chart (40 bars)
              </span>
              <span
                className="text-[10px] font-semibold"
                style={{ color: chartIsUp ? "#2ED47A" : "#FF5A5F" }}
              >
                {chartIsUp ? "+" : ""}
                {(((lastClose - firstClose) / firstClose) * 100).toFixed(2)}%
              </span>
            </div>
            <svg
              viewBox={`0 0 ${W} ${H}`}
              className="w-full"
              style={{ height: "120px" }}
              aria-label="Mini price chart"
              role="img"
            >
              <title>Mini Price Chart</title>
              {/* Grid */}
              {[0, 0.33, 0.67, 1].map((t) => {
                const y = PAD.top + chartH * t;
                const p = maxP - priceRange * t;
                return (
                  <g key={t}>
                    <line
                      x1={PAD.left}
                      x2={W - PAD.right}
                      y1={y}
                      y2={y}
                      stroke="#1F2B3F"
                      strokeWidth="0.5"
                    />
                    <text
                      x={PAD.left - 3}
                      y={y + 3}
                      fill="#9AA8C1"
                      fontSize="7"
                      textAnchor="end"
                    >
                      {p > 100 ? p.toFixed(0) : p.toFixed(2)}
                    </text>
                  </g>
                );
              })}
              {/* Candles */}
              {candles.map((c, i) => {
                const x = toX(i);
                const openY = toY(c.open);
                const closeY = toY(c.close);
                const highY = toY(c.high);
                const lowY = toY(c.low);
                const isGreen = c.close >= c.open;
                const color = isGreen ? "#2ED47A" : "#FF5A5F";
                const bodyTop = Math.min(openY, closeY);
                const bodyH = Math.abs(openY - closeY) || 1;
                return (
                  <g key={`${i}-${c.close.toFixed(3)}`}>
                    <line
                      x1={x}
                      x2={x}
                      y1={highY}
                      y2={lowY}
                      stroke={color}
                      strokeWidth="0.8"
                    />
                    <rect
                      x={x - candleW / 2}
                      y={bodyTop}
                      width={candleW}
                      height={bodyH}
                      fill={color}
                      opacity="0.85"
                    />
                  </g>
                );
              })}
              {/* Current price line */}
              <line
                x1={PAD.left}
                x2={W - PAD.right}
                y1={toY(lastClose)}
                y2={toY(lastClose)}
                stroke={chartIsUp ? "#2ED47A" : "#FF5A5F"}
                strokeWidth="0.5"
                strokeDasharray="3 2"
              />
            </svg>
          </div>

          {/* Technical Analysis */}
          <div
            className="rounded-xl p-3"
            style={{ background: "#111E33", border: "1px solid #1E2C44" }}
          >
            <div className="text-[10px] font-black uppercase tracking-widest text-[#9AA8C1] mb-3">
              Technical Analysis
            </div>
            <div className="grid grid-cols-2 gap-2">
              {/* RSI */}
              <div
                className="rounded-lg p-2.5"
                style={{ background: "#0D1928" }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-[#9AA8C1] font-semibold">
                    RSI (14)
                  </span>
                  <span
                    className="text-xs font-black tabular-nums"
                    style={{ color: rsiColor }}
                  >
                    {rsi}
                  </span>
                </div>
                <div
                  className="h-1.5 rounded-full overflow-hidden"
                  style={{ background: "#1E2C44" }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${rsi}%`, background: rsiColor }}
                  />
                </div>
                <div className="text-[9px] mt-1" style={{ color: rsiColor }}>
                  {rsiLabel}
                </div>
              </div>

              {/* MACD */}
              <div
                className="rounded-lg p-2.5"
                style={{ background: "#0D1928" }}
              >
                <div className="text-[10px] text-[#9AA8C1] font-semibold mb-1">
                  MACD
                </div>
                <div
                  className="text-[10px] font-bold"
                  style={{ color: macdColor }}
                >
                  {macdLabel}
                </div>
                <div className="text-[9px] text-[#9AA8C1] mt-1">
                  {macd > 0 ? "+" : ""}
                  {macd.toFixed(2)} vs {macdSignal.toFixed(2)}
                </div>
              </div>

              {/* Trend */}
              <div
                className="rounded-lg p-2.5"
                style={{ background: "#0D1928" }}
              >
                <div className="text-[10px] text-[#9AA8C1] font-semibold mb-1">
                  Trend
                </div>
                <div
                  className="text-[10px] font-bold"
                  style={{ color: trendColor }}
                >
                  {trendLabel}
                </div>
                <div className="text-[9px] text-[#9AA8C1] mt-1">
                  EMA9: {curr}
                  {ema9.toFixed(ema9 > 100 ? 1 : 4)} | EMA21: {curr}
                  {ema21.toFixed(ema21 > 100 ? 1 : 4)}
                </div>
              </div>

              {/* Volume */}
              <div
                className="rounded-lg p-2.5"
                style={{ background: "#0D1928" }}
              >
                <div className="text-[10px] text-[#9AA8C1] font-semibold mb-1">
                  Volume
                </div>
                <div
                  className="text-[10px] font-bold"
                  style={{ color: volumeColor }}
                >
                  {volumeLabel}
                </div>
                <div className="text-[9px] text-[#9AA8C1] mt-1">
                  Relative to 20-period avg
                </div>
              </div>

              {/* Support */}
              <div
                className="rounded-lg p-2.5"
                style={{ background: "#0D1928" }}
              >
                <div className="text-[10px] text-[#9AA8C1] font-semibold mb-1">
                  Support
                </div>
                <div
                  className="text-xs font-black tabular-nums"
                  style={{ color: "#2ED47A" }}
                >
                  {curr}
                  {formatPrice(support)}
                </div>
                <div className="text-[9px] text-[#9AA8C1] mt-1">20-bar low</div>
              </div>

              {/* Resistance */}
              <div
                className="rounded-lg p-2.5"
                style={{ background: "#0D1928" }}
              >
                <div className="text-[10px] text-[#9AA8C1] font-semibold mb-1">
                  Resistance
                </div>
                <div
                  className="text-xs font-black tabular-nums"
                  style={{ color: "#FF5A5F" }}
                >
                  {curr}
                  {formatPrice(resistance)}
                </div>
                <div className="text-[9px] text-[#9AA8C1] mt-1">
                  20-bar high
                </div>
              </div>
            </div>
          </div>

          {/* AI Signal */}
          <div
            className="rounded-xl p-3"
            style={{
              background: `${aiColor}10`,
              border: `1px solid ${aiColor}33`,
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4" style={{ color: aiColor }} />
                <span
                  className="text-[10px] font-black uppercase tracking-widest"
                  style={{ color: aiColor }}
                >
                  AI Signal
                </span>
              </div>
              <div
                className="text-xs font-black px-2.5 py-1 rounded-full"
                style={{
                  background: `${aiColor}20`,
                  color: aiColor,
                  border: `1px solid ${aiColor}44`,
                }}
              >
                {aiSignal}
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <div
                className="h-1.5 flex-1 rounded-full overflow-hidden"
                style={{ background: "#1E2C44" }}
              >
                <div
                  className="h-full rounded-full"
                  style={{ width: `${aiConfidence}%`, background: aiColor }}
                />
              </div>
              <span
                className="text-[10px] font-bold tabular-nums"
                style={{ color: aiColor }}
              >
                {aiConfidence}% confidence
              </span>
            </div>
            <div className="text-[9px] text-[#9AA8C1] mt-1.5">
              Based on RSI({rsi}) + MACD({macdLabel}) + {trendLabel} trend
            </div>
          </div>

          {/* Risk / Reward */}
          <div
            className="rounded-xl p-3"
            style={{ background: "#111E33", border: "1px solid #1E2C44" }}
          >
            <div className="text-[10px] font-black uppercase tracking-widest text-[#9AA8C1] mb-3">
              Risk / Reward
            </div>
            <div className="grid grid-cols-3 gap-2 mb-3">
              <div className="text-center">
                <div className="text-[9px] text-[#9AA8C1] mb-0.5">Entry</div>
                <div className="text-xs font-bold tabular-nums text-[#EAF0FF]">
                  {curr}
                  {formatPrice(entryPrice)}
                </div>
              </div>
              <div className="text-center">
                <div className="text-[9px] text-[#9AA8C1] mb-0.5">Target</div>
                <div
                  className="text-xs font-bold tabular-nums"
                  style={{ color: "#2ED47A" }}
                >
                  {curr}
                  {formatPrice(targetPrice)}
                  <span className="text-[9px] ml-0.5">+{targetPct}%</span>
                </div>
              </div>
              <div className="text-center">
                <div className="text-[9px] text-[#9AA8C1] mb-0.5">
                  Stop Loss
                </div>
                <div
                  className="text-xs font-bold tabular-nums"
                  style={{ color: "#FF5A5F" }}
                >
                  {curr}
                  {formatPrice(stopLoss)}
                  <span className="text-[9px] ml-0.5">-{slPct}%</span>
                </div>
              </div>
            </div>
            <div
              className="flex items-center justify-between rounded-lg px-3 py-2"
              style={{ background: "#0D1928" }}
            >
              <span className="text-[10px] text-[#9AA8C1]">
                Risk:Reward Ratio
              </span>
              <span className="text-sm font-black" style={{ color: "#F2C94C" }}>
                1 : {rrRatio}
              </span>
            </div>
          </div>

          {/* Quick Trade */}
          <div
            className="rounded-xl p-3"
            style={{ background: "#111E33", border: "1px solid #1E2C44" }}
          >
            <div className="text-[10px] font-black uppercase tracking-widest text-[#9AA8C1] mb-3">
              Quick Trade
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button
                data-ocid="stock.primary_button"
                className="font-black text-sm h-10"
                style={{
                  background: "rgba(46,212,122,0.15)",
                  color: "#2ED47A",
                  border: "1px solid rgba(46,212,122,0.3)",
                }}
                onClick={() => {
                  toast.success(
                    `Paper BUY ${symbol} @ ${curr}${formatPrice(entryPrice)}`,
                  );
                }}
              >
                BUY
              </Button>
              <Button
                data-ocid="stock.secondary_button"
                className="font-black text-sm h-10"
                style={{
                  background: "rgba(255,90,95,0.15)",
                  color: "#FF5A5F",
                  border: "1px solid rgba(255,90,95,0.3)",
                }}
                onClick={() => {
                  toast.success(
                    `Paper SELL ${symbol} @ ${curr}${formatPrice(entryPrice)}`,
                  );
                }}
              >
                SELL
              </Button>
            </div>
            <div className="text-center text-[9px] text-[#9AA8C1] mt-2">
              Paper Trade — No real money involved
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
