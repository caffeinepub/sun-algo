import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Activity, Plus, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { SignalType } from "../backend.d";
import ChartArea from "../components/ChartArea";
import PortfolioSummary from "../components/PortfolioSummary";
import SignalCard from "../components/SignalCard";
import StockDetailModal from "../components/StockDetailModal";
import WatchlistRow from "../components/WatchlistRow";
import { useMarketModeContext } from "../contexts/MarketModeContext";
import { useMarketStatusContext } from "../contexts/MarketStatusContext";
import { useMarketData } from "../hooks/useMarketData";
import {
  useAddToWatchlist,
  useRemoveFromWatchlist,
  useSignals,
  useStrategies,
  useWatchlist,
} from "../hooks/useQueries";

const INDIAN_SIGNALS = [
  {
    id: "1",
    instrumentSymbol: "RELIANCE",
    signalType: "strongBuy" as SignalType,
    confidence: 0.87,
    entryPrice: 2850,
    targetPrice: 2950,
    stopLoss: 2800,
    strategyName: "EMA Crossover + RSI",
    timeframe: "15M",
    timestamp: BigInt(Date.now()),
    technicalScore: 85,
    fundamentalScore: 78,
  },
  {
    id: "2",
    instrumentSymbol: "TCS",
    signalType: "buy" as SignalType,
    confidence: 0.74,
    entryPrice: 3945,
    targetPrice: 4080,
    stopLoss: 3880,
    strategyName: "Supertrend + MACD",
    timeframe: "1H",
    timestamp: BigInt(Date.now()),
    technicalScore: 72,
    fundamentalScore: 81,
  },
  {
    id: "3",
    instrumentSymbol: "BANKNIFTY",
    signalType: "sell" as SignalType,
    confidence: 0.71,
    entryPrice: 52440,
    targetPrice: 51800,
    stopLoss: 52900,
    strategyName: "Bollinger Band",
    timeframe: "15M",
    timestamp: BigInt(Date.now()),
    technicalScore: 68,
    fundamentalScore: 55,
  },
  {
    id: "4",
    instrumentSymbol: "HDFCBANK",
    signalType: "neutral" as SignalType,
    confidence: 0.52,
    entryPrice: 1723,
    targetPrice: 1780,
    stopLoss: 1690,
    strategyName: "VWAP Reversion",
    timeframe: "1D",
    timestamp: BigInt(Date.now()),
    technicalScore: 50,
    fundamentalScore: 62,
  },
];

const FOREX_CRYPTO_SIGNALS = [
  {
    id: "1",
    instrumentSymbol: "BTC/USD",
    signalType: "strongBuy" as SignalType,
    confidence: 0.88,
    entryPrice: 67234,
    targetPrice: 71000,
    stopLoss: 65000,
    strategyName: "BTC Momentum + MACD",
    timeframe: "4H",
    timestamp: BigInt(Date.now()),
    technicalScore: 88,
    fundamentalScore: 72,
  },
  {
    id: "2",
    instrumentSymbol: "ETH/USD",
    signalType: "buy" as SignalType,
    confidence: 0.76,
    entryPrice: 3456,
    targetPrice: 3700,
    stopLoss: 3300,
    strategyName: "ETH RSI Divergence",
    timeframe: "1H",
    timestamp: BigInt(Date.now()),
    technicalScore: 74,
    fundamentalScore: 68,
  },
  {
    id: "3",
    instrumentSymbol: "EURUSD",
    signalType: "sell" as SignalType,
    confidence: 0.69,
    entryPrice: 1.0834,
    targetPrice: 1.072,
    stopLoss: 1.091,
    strategyName: "EUR/USD Fib Retracement",
    timeframe: "1D",
    timestamp: BigInt(Date.now()),
    technicalScore: 65,
    fundamentalScore: 60,
  },
  {
    id: "4",
    instrumentSymbol: "GOLD",
    signalType: "buy" as SignalType,
    confidence: 0.73,
    entryPrice: 2340,
    targetPrice: 2420,
    stopLoss: 2290,
    strategyName: "Gold Safe-Haven Flow",
    timeframe: "4H",
    timestamp: BigInt(Date.now()),
    technicalScore: 71,
    fundamentalScore: 80,
  },
];

const INDIAN_WATCHLIST = [
  { instrumentSymbol: "NIFTY50", addedAt: BigInt(0) },
  { instrumentSymbol: "SENSEX", addedAt: BigInt(0) },
  { instrumentSymbol: "BANKNIFTY", addedAt: BigInt(0) },
  { instrumentSymbol: "RELIANCE", addedAt: BigInt(0) },
  { instrumentSymbol: "TCS", addedAt: BigInt(0) },
  { instrumentSymbol: "HDFCBANK", addedAt: BigInt(0) },
  { instrumentSymbol: "INFY", addedAt: BigInt(0) },
];

const FOREX_CRYPTO_WATCHLIST = [
  { instrumentSymbol: "BTC/USD", addedAt: BigInt(0) },
  { instrumentSymbol: "ETH/USD", addedAt: BigInt(0) },
  { instrumentSymbol: "EURUSD", addedAt: BigInt(0) },
  { instrumentSymbol: "GOLD", addedAt: BigInt(0) },
  { instrumentSymbol: "CRUDE", addedAt: BigInt(0) },
  { instrumentSymbol: "USDINR", addedAt: BigInt(0) },
  { instrumentSymbol: "AAPL", addedAt: BigInt(0) },
];

const MOCK_STRATEGIES = [
  {
    id: "s1",
    name: "EMA Crossover",
    strategyType: "trendFollowing" as const,
    enabled: true,
    parameters: "{}",
    riskSettings: {
      dailyLossLimitPct: 2,
      perTradeStopLossPct: 1.5,
      maxPositions: BigInt(5),
      positionSizePct: 5,
      drawdownProtectionPct: 5,
    },
  },
  {
    id: "s2",
    name: "BB Squeeze",
    strategyType: "meanReversion" as const,
    enabled: true,
    parameters: "{}",
    riskSettings: {
      dailyLossLimitPct: 1.5,
      perTradeStopLossPct: 2,
      maxPositions: BigInt(3),
      positionSizePct: 3,
      drawdownProtectionPct: 8,
    },
  },
];

export default function Dashboard() {
  const { data: signals } = useSignals();
  const { data: watchlist } = useWatchlist();
  const { data: strategies } = useStrategies();
  const { getPrice, isLive } = useMarketData();
  const addToWatchlist = useAddToWatchlist();
  const removeFromWatchlist = useRemoveFromWatchlist();
  const [newSymbol, setNewSymbol] = useState("");
  const [dayPnl, setDayPnl] = useState(12450);
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);

  const { dominantStatus, marketStateClass } = useMarketStatusContext();
  const { marketMode, isMarketOpen, modeLabel } = useMarketModeContext();

  // Mode-aware watchlist and signals
  const defaultWatchlist =
    marketMode === "forex_crypto" || marketMode === "global"
      ? FOREX_CRYPTO_WATCHLIST
      : INDIAN_WATCHLIST;
  const displayWatchlist =
    watchlist && watchlist.length > 0 ? watchlist : defaultWatchlist;

  const mockSignals =
    marketMode === "forex_crypto" || marketMode === "global"
      ? FOREX_CRYPTO_SIGNALS
      : INDIAN_SIGNALS;
  const displaySignals = (
    signals && signals.length > 0 ? signals : mockSignals
  ).slice(0, 4);

  const displayStrategies =
    strategies && strategies.length > 0 ? strategies : MOCK_STRATEGIES;

  // P&L simulation — always runs in paper mode (no market hours guard)
  useEffect(() => {
    const iv = setInterval(() => {
      setDayPnl((prev) => prev + (Math.random() - 0.45) * 200);
    }, 5000);
    return () => clearInterval(iv);
  }, []);

  const handleAddToWatchlist = () => {
    if (!newSymbol.trim()) return;
    addToWatchlist.mutate(newSymbol.toUpperCase().trim(), {
      onSuccess: () => {
        toast.success(`Added ${newSymbol.toUpperCase()} to watchlist`);
        setNewSymbol("");
      },
      onError: () => {
        toast.error("Failed to add to watchlist");
      },
    });
  };

  const handleRemove = (symbol: string) => {
    removeFromWatchlist.mutate(symbol, {
      onSuccess: () => toast.success(`Removed ${symbol}`),
      onError: () => toast.error("Failed to remove"),
    });
  };

  const nifty = getPrice("NIFTY50");

  // Signal engine paused message — mode-aware
  const pauseMessage = (() => {
    if (marketMode === "forex_crypto") return null; // never show for 24/7
    if (marketMode === "global")
      return "Signal engine paused \u2014 NYSE opens at 09:30 AM ET.";
    return "Signal engine paused \u2014 NSE opens at 09:15 AM IST. Strategies will resume automatically.";
  })();

  // Market status label — mode-aware
  const marketStatusLabel = (() => {
    if (marketMode === "forex_crypto") return "24/7 LIVE";
    if (marketMode === "global") {
      return isMarketOpen ? "NYSE LIVE" : "NYSE CLOSED";
    }
    // Indian mode — existing logic
    if (isMarketOpen) return "MARKET LIVE";
    if (dominantStatus === "PRE_OPEN") return "PRE-OPEN";
    if (dominantStatus === "CLOSING") return "CLOSING SOON";
    if (dominantStatus === "HOLIDAY") return "HOLIDAY";
    return "MARKET CLOSED";
  })();

  const statusColor =
    isMarketOpen || marketMode === "forex_crypto" ? "#2ED47A" : "#FF5A5F";

  // In paper mode, BUY/SELL are only locked during circuit breaker (HALTED)
  const tradeButtonsLocked = dominantStatus === "HALTED";

  return (
    <>
      <div
        className={cn(
          "px-4 lg:px-6 max-w-[1600px] mx-auto dashboard-container",
          marketStateClass,
        )}
      >
        {/* Holiday Banner — only for Indian mode */}
        {dominantStatus === "HOLIDAY" && marketMode === "indian" && (
          <div
            className="holiday-banner rounded-lg p-3 mb-4 flex items-center gap-3"
            data-ocid="dashboard.panel"
          >
            <span className="text-2xl">🎉</span>
            <div>
              <div className="text-sm font-bold text-blue-400">
                Market Holiday
              </div>
              <div className="text-xs text-blue-300">
                NSE/BSE closed today — next trading day resumes as scheduled
              </div>
            </div>
          </div>
        )}

        {/* Circuit Breaker Banner */}
        {dominantStatus === "HALTED" && (
          <div
            className="circuit-breaker-banner rounded-lg p-3 mb-4 flex items-center gap-3"
            data-ocid="dashboard.panel"
          >
            <span className="text-2xl">⚠️</span>
            <div>
              <div className="text-sm font-bold text-red-400">
                CIRCUIT BREAKER TRIGGERED
              </div>
              <div className="text-xs text-red-300">
                Market trading has been halted. All trade buttons are locked.
              </div>
            </div>
            <div className="ml-auto">
              <span className="text-xs font-bold text-red-400 font-mono">
                STRATEGY ENGINE PAUSED
              </span>
            </div>
          </div>
        )}

        {/* Status Bar */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-lg font-bold text-[#EAF0FF]">
              Trading Dashboard
            </h1>
            <div className="text-[9px] text-[#9AA8C1] mt-0.5">
              {modeLabel} Mode
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs">
              <span
                className={`w-2 h-2 rounded-full ${
                  isMarketOpen || marketMode === "forex_crypto"
                    ? "pulse-green"
                    : ""
                }`}
                style={{ background: statusColor }}
              />
              <span style={{ color: statusColor }} className="font-semibold">
                {marketStatusLabel}
              </span>
            </div>
            <div className="text-xs text-[#9AA8C1]">
              P&L Today:{" "}
              <span
                style={{ color: dayPnl >= 0 ? "#2ED47A" : "#FF5A5F" }}
                className="font-bold tabular-nums"
              >
                {dayPnl >= 0 ? "+" : ""}₹
                {Math.abs(dayPnl).toLocaleString("en-IN", {
                  maximumFractionDigits: 0,
                })}
              </span>
            </div>
            {isLive && (
              <div className="flex items-center gap-1 text-[9px] text-[#9AA8C1]">
                <span className="live-dot" style={{ width: 5, height: 5 }} />
                <span>LIVE</span>
              </div>
            )}
          </div>
        </div>

        {/* Main 3-column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* LEFT: Watchlist */}
          <div className="lg:col-span-3">
            <div
              className="trading-card market-dim-card p-3 h-full"
              data-ocid="watchlist.panel"
            >
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xs font-bold uppercase tracking-widest text-[#EAF0FF]">
                  Watchlist
                </h2>
                <Activity className="w-3.5 h-3.5 text-[#9AA8C1]" />
              </div>
              {/* Add to watchlist */}
              <div className="flex gap-1.5 mb-3">
                <Input
                  data-ocid="watchlist.input"
                  value={newSymbol}
                  onChange={(e) => setNewSymbol(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddToWatchlist()}
                  placeholder="Add symbol..."
                  className="h-7 text-xs bg-white/5 border-[#24344F] text-[#EAF0FF] placeholder:text-[#9AA8C1]"
                />
                <Button
                  data-ocid="watchlist.primary_button"
                  size="sm"
                  onClick={handleAddToWatchlist}
                  className="h-7 w-7 p-0 flex-shrink-0"
                  style={{ background: "#F2C94C", color: "#0B1424" }}
                >
                  <Plus className="w-3.5 h-3.5" />
                </Button>
              </div>
              {/* Watchlist items */}
              <div className="space-y-0.5">
                {displayWatchlist.map((item, idx) => (
                  <WatchlistRow
                    key={item.instrumentSymbol}
                    item={item}
                    price={getPrice(item.instrumentSymbol)}
                    index={idx + 1}
                    onRemove={handleRemove}
                    onClick={(sym) => setSelectedSymbol(sym)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* CENTER: Chart + Signals */}
          <div className="lg:col-span-6 space-y-4">
            {/* Chart Card */}
            <div
              className="trading-card market-dim-card p-4"
              data-ocid="chart.panel"
            >
              <ChartArea symbol="RELIANCE" basePrice={nifty?.price ?? 2847} />
            </div>

            {/* Signal Cards */}
            <div data-ocid="signals.panel">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xs font-bold uppercase tracking-widest text-[#EAF0FF]">
                  Live Signals
                </h2>
                <div className="flex items-center gap-1 text-[#9AA8C1]">
                  <RefreshCw className="w-3 h-3" />
                  <span className="text-[10px]">Auto-refresh</span>
                </div>
              </div>

              {/* Signal engine paused message — hidden for forex_crypto */}
              {!isMarketOpen &&
                dominantStatus !== "HOLIDAY" &&
                pauseMessage && (
                  <div
                    className="text-xs text-[#9AA8C1] bg-white/5 rounded px-3 py-1.5 flex items-center gap-2 mb-2"
                    data-ocid="signals.panel"
                  >
                    <span>⏸️</span>
                    <span>{pauseMessage}</span>
                  </div>
                )}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {displaySignals.map((signal, i) => (
                  <SignalCard
                    key={signal.id}
                    signal={signal}
                    index={i + 1}
                    marketClosed={false}
                    nextOpenTime={undefined}
                    onClick={() => setSelectedSymbol(signal.instrumentSymbol)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: Portfolio + Strategy */}
          <div className="lg:col-span-3 space-y-4">
            {/* Portfolio Summary */}
            <div className="trading-card market-dim-card p-3">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xs font-bold uppercase tracking-widest text-[#EAF0FF]">
                  Portfolio
                </h2>
                <span
                  className="text-[10px] px-2 py-0.5 rounded-full"
                  style={{ background: "#2ED47A22", color: "#2ED47A" }}
                >
                  PAPER
                </span>
              </div>
              <PortfolioSummary dayPnl={dayPnl} />
            </div>

            {/* Strategy Performance */}
            <div className="trading-card market-dim-card p-3">
              <h2 className="text-xs font-bold uppercase tracking-widest text-[#EAF0FF] mb-3">
                Top Strategies
              </h2>
              <div className="space-y-3">
                {displayStrategies.slice(0, 2).map((strat, i) => (
                  <div
                    key={strat.id}
                    data-ocid={`strategies.item.${i + 1}`}
                    className="bg-white/5 rounded-lg p-2.5"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="text-xs font-bold text-[#EAF0FF]">
                          {strat.name}
                        </div>
                        <div className="text-[9px] text-[#9AA8C1] mt-0.5">
                          {strat.strategyType}
                        </div>
                      </div>
                      <span
                        className={`w-1.5 h-1.5 rounded-full mt-1 ${
                          strat.enabled ? "pulse-green" : ""
                        }`}
                        style={{
                          background: strat.enabled ? "#2ED47A" : "#9AA8C1",
                        }}
                      />
                    </div>
                    <div className="flex gap-3">
                      <div>
                        <div className="text-[9px] text-[#9AA8C1]">
                          Daily Limit
                        </div>
                        <div
                          className="text-xs font-bold"
                          style={{ color: "#F2C94C" }}
                        >
                          {strat.riskSettings.dailyLossLimitPct}%
                        </div>
                      </div>
                      <div>
                        <div className="text-[9px] text-[#9AA8C1]">Max Pos</div>
                        <div className="text-xs font-bold text-[#EAF0FF]">
                          {strat.riskSettings.maxPositions.toString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-[9px] text-[#9AA8C1]">SL</div>
                        <div className="text-xs font-bold text-[#EAF0FF]">
                          {strat.riskSettings.perTradeStopLossPct}%
                        </div>
                      </div>
                    </div>
                    {/* Trade buttons — only locked during circuit breaker halt in paper mode */}
                    <div className="flex gap-1.5 mt-2">
                      <button
                        type="button"
                        data-ocid={`strategies.primary_button.${i + 1}`}
                        disabled={tradeButtonsLocked}
                        className="flex-1 text-[9px] font-bold py-1 rounded transition-all"
                        style={{
                          background: !tradeButtonsLocked
                            ? "rgba(46,212,122,0.15)"
                            : "rgba(55,65,81,0.3)",
                          color: !tradeButtonsLocked ? "#2ED47A" : "#4B5563",
                          border: `1px solid ${
                            !tradeButtonsLocked
                              ? "rgba(46,212,122,0.3)"
                              : "rgba(55,65,81,0.4)"
                          }`,
                          cursor: !tradeButtonsLocked
                            ? "pointer"
                            : "not-allowed",
                        }}
                      >
                        BUY
                      </button>
                      <button
                        type="button"
                        data-ocid={`strategies.secondary_button.${i + 1}`}
                        disabled={tradeButtonsLocked}
                        className="flex-1 text-[9px] font-bold py-1 rounded transition-all"
                        style={{
                          background: !tradeButtonsLocked
                            ? "rgba(255,90,95,0.15)"
                            : "rgba(55,65,81,0.3)",
                          color: !tradeButtonsLocked ? "#FF5A5F" : "#4B5563",
                          border: `1px solid ${
                            !tradeButtonsLocked
                              ? "rgba(255,90,95,0.3)"
                              : "rgba(55,65,81,0.4)"
                          }`,
                          cursor: !tradeButtonsLocked
                            ? "pointer"
                            : "not-allowed",
                        }}
                      >
                        SELL
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stock Detail Modal */}
      {selectedSymbol && (
        <StockDetailModal
          symbol={selectedSymbol}
          open={!!selectedSymbol}
          onClose={() => setSelectedSymbol(null)}
          currentPrice={getPrice(selectedSymbol)?.price}
          changePct={getPrice(selectedSymbol)?.changePct}
          currency={getPrice(selectedSymbol)?.currency}
        />
      )}
    </>
  );
}
