import { useEffect, useState } from "react";

interface ChartBar {
  open: number;
  high: number;
  low: number;
  close: number;
}

function generateCandleData(basePrice: number, count: number): ChartBar[] {
  let price = basePrice;
  return Array.from({ length: count }, () => {
    const change = (Math.random() - 0.48) * price * 0.012;
    const open = price;
    const close = price + change;
    const high = Math.max(open, close) + Math.random() * price * 0.005;
    const low = Math.min(open, close) - Math.random() * price * 0.005;
    price = close;
    return { open, high, low, close };
  });
}

interface ChartAreaProps {
  symbol?: string;
  basePrice?: number;
}

const TIMEFRAMES = ["1M", "5M", "15M", "1H", "1D", "1W"];
const INDICATORS = ["EMA", "MACD", "RSI", "BB", "VWAP", "ATR"];

export default function ChartArea({
  symbol = "RELIANCE",
  basePrice = 2847,
}: ChartAreaProps) {
  const [timeframe, setTimeframe] = useState("15M");
  const [activeIndicators, setActiveIndicators] = useState<string[]>([
    "EMA",
    "VWAP",
  ]);
  const [candles, setCandles] = useState(() =>
    generateCandleData(basePrice, 60),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCandles((prev) => {
        const last = prev[prev.length - 1];
        const change = (Math.random() - 0.48) * last.close * 0.005;
        const newClose = last.close + change;
        const updated = [...prev.slice(1)];
        updated.push({
          open: last.close,
          high: Math.max(last.close, newClose) + Math.random() * 5,
          low: Math.min(last.close, newClose) - Math.random() * 5,
          close: newClose,
        });
        return updated;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const toggleIndicator = (ind: string) => {
    setActiveIndicators((prev) =>
      prev.includes(ind) ? prev.filter((i) => i !== ind) : [...prev, ind],
    );
  };

  // SVG chart rendering
  const W = 600;
  const H = 200;
  const PAD = { top: 10, right: 10, bottom: 20, left: 50 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;

  const allPrices = candles.flatMap((c) => [c.high, c.low]);
  const minPrice = Math.min(...allPrices);
  const maxPrice = Math.max(...allPrices);
  const priceRange = maxPrice - minPrice || 1;

  const candleW = chartW / candles.length - 1;

  const toY = (price: number) =>
    PAD.top + chartH - ((price - minPrice) / priceRange) * chartH;
  const toX = (i: number) =>
    PAD.left + i * (chartW / candles.length) + candleW / 2;

  const lastPrice = candles[candles.length - 1]?.close ?? basePrice;
  const firstPrice = candles[0]?.close ?? basePrice;
  const isUp = lastPrice >= firstPrice;

  return (
    <div data-ocid="chart.panel">
      {/* Chart Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="font-bold text-[#EAF0FF]">{symbol}</span>
          <span className="ml-2 text-[11px] text-[#9AA8C1]">NSE</span>
          <span
            className="ml-3 text-xl font-bold tabular-nums"
            style={{ color: isUp ? "#2ED47A" : "#FF5A5F" }}
          >
            ₹{lastPrice.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
          </span>
          <span
            className="ml-2 text-xs font-semibold"
            style={{ color: isUp ? "#2ED47A" : "#FF5A5F" }}
          >
            {isUp ? "+" : ""}
            {(((lastPrice - firstPrice) / firstPrice) * 100).toFixed(2)}%
          </span>
        </div>
      </div>

      {/* Timeframe Buttons */}
      <div className="flex items-center gap-1 mb-2">
        {TIMEFRAMES.map((tf) => (
          <button
            type="button"
            key={tf}
            data-ocid="chart.tab"
            onClick={() => setTimeframe(tf)}
            className="px-2.5 py-0.5 rounded text-[10px] font-bold transition-colors"
            style={{
              background: timeframe === tf ? "#F2C94C22" : "transparent",
              color: timeframe === tf ? "#F2C94C" : "#9AA8C1",
              border:
                timeframe === tf
                  ? "1px solid #F2C94C44"
                  : "1px solid transparent",
            }}
          >
            {tf}
          </button>
        ))}
        <div className="flex-1" />
        {INDICATORS.map((ind) => (
          <button
            type="button"
            key={ind}
            data-ocid="chart.toggle"
            onClick={() => toggleIndicator(ind)}
            className="px-2 py-0.5 rounded text-[9px] font-bold transition-colors"
            style={{
              background: activeIndicators.includes(ind)
                ? "#60AFFF22"
                : "transparent",
              color: activeIndicators.includes(ind) ? "#60AFFF" : "#9AA8C1",
              border: activeIndicators.includes(ind)
                ? "1px solid #60AFFF44"
                : "1px solid #24344F",
            }}
          >
            {ind}
          </button>
        ))}
      </div>

      {/* SVG Candlestick Chart */}
      <div
        className="w-full overflow-hidden rounded-lg"
        style={{ background: "#0B1424" }}
      >
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full"
          style={{ height: "220px" }}
          aria-label="Candlestick chart"
          role="img"
        >
          <title>Price Chart</title>
          {/* Grid Lines */}
          {Array.from({ length: 5 }, (_, i) => {
            const y = PAD.top + (chartH / 4) * i;
            const price = maxPrice - (priceRange / 4) * i;
            return (
              <g key={price.toFixed(2)}>
                <line
                  x1={PAD.left}
                  x2={W - PAD.right}
                  y1={y}
                  y2={y}
                  stroke="#1F2B3F"
                  strokeWidth="0.5"
                />
                <text
                  x={PAD.left - 4}
                  y={y + 4}
                  fill="#9AA8C1"
                  fontSize="8"
                  textAnchor="end"
                >
                  {price.toFixed(0)}
                </text>
              </g>
            );
          })}

          {/* EMA Line */}
          {activeIndicators.includes("EMA") &&
            (() => {
              const ema = candles.map((_, i) => {
                const slice = candles.slice(Math.max(0, i - 8), i + 1);
                return slice.reduce((s, c) => s + c.close, 0) / slice.length;
              });
              const path = ema
                .map((v, i) => `${i === 0 ? "M" : "L"} ${toX(i)} ${toY(v)}`)
                .join(" ");
              return (
                <path
                  key="ema"
                  d={path}
                  stroke="#F2C94C"
                  strokeWidth="1"
                  fill="none"
                  opacity="0.8"
                />
              );
            })()}

          {/* VWAP Line */}
          {activeIndicators.includes("VWAP") &&
            (() => {
              const vwap = candles.map((_, i) => {
                const slice = candles.slice(Math.max(0, i - 14), i + 1);
                return (
                  slice.reduce(
                    (s, c) => s + (c.high + c.low + c.close) / 3,
                    0,
                  ) / slice.length
                );
              });
              const path = vwap
                .map((v, i) => `${i === 0 ? "M" : "L"} ${toX(i)} ${toY(v)}`)
                .join(" ");
              return (
                <path
                  key="vwap"
                  d={path}
                  stroke="#60AFFF"
                  strokeWidth="1"
                  fill="none"
                  opacity="0.8"
                  strokeDasharray="3 2"
                />
              );
            })()}

          {/* Candlesticks */}
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
              <g key={`${c.open.toFixed(2)}-${c.close.toFixed(2)}-${i}`}>
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
            y1={toY(lastPrice)}
            y2={toY(lastPrice)}
            stroke={isUp ? "#2ED47A" : "#FF5A5F"}
            strokeWidth="0.5"
            strokeDasharray="4 2"
          />
        </svg>
      </div>
    </div>
  );
}
