import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TrendingDown, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { PositionSide } from "../backend.d";
import { useMarketData } from "../hooks/useMarketData";
import { useTrades } from "../hooks/useQueries";

const OPEN_POSITIONS = [
  {
    symbol: "RELIANCE",
    side: PositionSide.long_,
    qty: 10,
    entry: 2847,
    strategy: "EMA Crossover",
  },
  {
    symbol: "TCS",
    side: PositionSide.long_,
    qty: 5,
    entry: 3940,
    strategy: "Supertrend",
  },
  {
    symbol: "BTC/USD",
    side: PositionSide.short_,
    qty: 0.1,
    entry: 67400,
    strategy: "BB Squeeze",
  },
];

const MOCK_TRADES = Array.from({ length: 15 }, (_, i) => ({
  id: `t${i}`,
  instrumentSymbol: ["RELIANCE", "TCS", "BTC/USD", "HDFCBANK", "INFY"][i % 5],
  side: i % 3 === 0 ? PositionSide.short_ : PositionSide.long_,
  quantity: Math.floor(Math.random() * 50 + 5),
  entryPrice: 2800 + i * 50,
  exitPrice: 2800 + i * 50 + (Math.random() - 0.3) * 200,
  pnl: (Math.random() - 0.35) * 4000,
  strategyName: ["EMA Crossover", "BB Squeeze", "VWAP Scalp"][i % 3],
  openedAt: BigInt(Date.now() - i * 86400000),
  closedAt: BigInt(Date.now() - i * 82000000),
}));

export default function Portfolio() {
  const { data: tradesData } = useTrades();
  const { getPrice } = useMarketData();
  const [isPaper, setIsPaper] = useState(true);
  const trades = (
    tradesData && tradesData.length > 0 ? tradesData : MOCK_TRADES
  ).slice(0, 12);

  const [positions, setPositions] = useState(
    OPEN_POSITIONS.map((p) => ({ ...p, currentPrice: p.entry })),
  );

  useEffect(() => {
    const iv = setInterval(() => {
      setPositions((prev) =>
        prev.map((p) => {
          const market = getPrice(p.symbol);
          return {
            ...p,
            currentPrice: market
              ? market.price
              : p.currentPrice * (1 + (Math.random() - 0.5) * 0.002),
          };
        }),
      );
    }, 3000);
    return () => clearInterval(iv);
  }, [getPrice]);

  const totalUnrealizedPnl = positions.reduce((sum, p) => {
    const multiplier = p.side === PositionSide.long_ ? 1 : -1;
    return sum + (p.currentPrice - p.entry) * p.qty * multiplier;
  }, 0);

  const dayPnl = 12450;
  const winCount = trades.filter((t) => t.pnl > 0).length;
  const winRate = trades.length > 0 ? (winCount / trades.length) * 100 : 0;

  return (
    <div
      className="px-4 lg:px-6 max-w-[1600px] mx-auto space-y-6"
      data-ocid="portfolio.page"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-[#EAF0FF]">Portfolio</h1>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#9AA8C1]">Paper Trading</span>
          <Switch
            data-ocid="portfolio.switch"
            checked={isPaper}
            onCheckedChange={setIsPaper}
            style={isPaper ? { background: "#2ED47A" } : {}}
          />
          <Badge
            className="text-[10px]"
            style={{
              background: isPaper
                ? "rgba(46,212,122,0.1)"
                : "rgba(242,201,76,0.1)",
              color: isPaper ? "#2ED47A" : "#F2C94C",
              border: isPaper ? "1px solid #2ED47A44" : "1px solid #F2C94C44",
            }}
          >
            {isPaper ? "PAPER" : "LIVE"}
          </Badge>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="trading-card p-4">
          <div className="text-[10px] text-[#9AA8C1] uppercase tracking-wider mb-1">
            Total Capital
          </div>
          <div
            className="text-xl font-bold tabular-nums"
            style={{ color: "#F2C94C" }}
          >
            ₹10,00,000
          </div>
          <div className="text-[10px] text-[#9AA8C1] mt-1">
            {isPaper ? "Virtual" : "Real Money"}
          </div>
        </div>
        <div className="trading-card p-4">
          <div className="text-[10px] text-[#9AA8C1] uppercase tracking-wider mb-1">
            Day P&L
          </div>
          <div
            className="text-xl font-bold tabular-nums"
            style={{ color: dayPnl >= 0 ? "#2ED47A" : "#FF5A5F" }}
          >
            {dayPnl >= 0 ? "+" : ""}₹{dayPnl.toLocaleString("en-IN")}
          </div>
          <div
            className="text-[10px] mt-1"
            style={{ color: dayPnl >= 0 ? "#2ED47A" : "#FF5A5F" }}
          >
            +1.31% today
          </div>
        </div>
        <div className="trading-card p-4">
          <div className="text-[10px] text-[#9AA8C1] uppercase tracking-wider mb-1">
            Unrealized P&L
          </div>
          <div
            className="text-xl font-bold tabular-nums"
            style={{ color: totalUnrealizedPnl >= 0 ? "#2ED47A" : "#FF5A5F" }}
          >
            {totalUnrealizedPnl >= 0 ? "+" : ""}₹
            {totalUnrealizedPnl.toLocaleString("en-IN", {
              maximumFractionDigits: 0,
            })}
          </div>
          <div className="text-[10px] text-[#9AA8C1] mt-1">
            {positions.length} open positions
          </div>
        </div>
        <div className="trading-card p-4">
          <div className="text-[10px] text-[#9AA8C1] uppercase tracking-wider mb-1">
            Win Rate
          </div>
          <div className="text-xl font-bold" style={{ color: "#2ED47A" }}>
            {winRate.toFixed(1)}%
          </div>
          <div className="text-[10px] text-[#9AA8C1] mt-1">
            {winCount}/{trades.length} winning trades
          </div>
        </div>
      </div>

      {/* Open Positions */}
      <div className="trading-card p-4" data-ocid="portfolio.panel">
        <h2 className="text-xs font-bold uppercase tracking-widest text-[#EAF0FF] mb-3">
          Open Positions
        </h2>
        <Table>
          <TableHeader>
            <TableRow style={{ borderColor: "#24344F" }}>
              {[
                "Symbol",
                "Side",
                "Qty",
                "Entry",
                "Current",
                "Unrealized P&L",
                "Change %",
                "Strategy",
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
            {positions.map((pos, i) => {
              const multiplier = pos.side === PositionSide.long_ ? 1 : -1;
              const unrealPnl =
                (pos.currentPrice - pos.entry) * pos.qty * multiplier;
              const changePct =
                ((pos.currentPrice - pos.entry) / pos.entry) * 100 * multiplier;
              const isProfit = unrealPnl >= 0;
              return (
                <TableRow
                  key={pos.symbol}
                  data-ocid={`portfolio.row.${i + 1}`}
                  style={{ borderColor: "#1E2C44" }}
                  className="hover:bg-white/5"
                >
                  <TableCell className="font-bold text-xs text-[#EAF0FF]">
                    {pos.symbol}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className="text-[9px] py-0"
                      style={{
                        background:
                          pos.side === PositionSide.long_
                            ? "rgba(46,212,122,0.1)"
                            : "rgba(255,90,95,0.1)",
                        color:
                          pos.side === PositionSide.long_
                            ? "#2ED47A"
                            : "#FF5A5F",
                        border:
                          pos.side === PositionSide.long_
                            ? "1px solid #2ED47A44"
                            : "1px solid #FF5A5F44",
                      }}
                    >
                      {pos.side === PositionSide.long_ ? (
                        <TrendingUp className="inline w-2.5 h-2.5 mr-0.5" />
                      ) : (
                        <TrendingDown className="inline w-2.5 h-2.5 mr-0.5" />
                      )}
                      {pos.side === PositionSide.long_ ? "LONG" : "SHORT"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-[#9AA8C1]">
                    {pos.qty}
                  </TableCell>
                  <TableCell className="text-xs tabular-nums text-[#EAF0FF]">
                    ₹{pos.entry.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-xs tabular-nums font-semibold text-[#EAF0FF]">
                    ₹
                    {pos.currentPrice.toLocaleString("en-IN", {
                      maximumFractionDigits: 2,
                    })}
                  </TableCell>
                  <TableCell
                    className="text-xs font-bold tabular-nums"
                    style={{ color: isProfit ? "#2ED47A" : "#FF5A5F" }}
                  >
                    {isProfit ? "+" : ""}₹
                    {unrealPnl.toLocaleString("en-IN", {
                      maximumFractionDigits: 0,
                    })}
                  </TableCell>
                  <TableCell
                    className="text-xs font-semibold"
                    style={{ color: isProfit ? "#2ED47A" : "#FF5A5F" }}
                  >
                    {isProfit ? "+" : ""}
                    {changePct.toFixed(2)}%
                  </TableCell>
                  <TableCell className="text-[10px] text-[#9AA8C1]">
                    {pos.strategy}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Closed Trades */}
      <div className="trading-card p-4">
        <h2 className="text-xs font-bold uppercase tracking-widest text-[#EAF0FF] mb-3">
          Closed Trades
        </h2>
        <Table>
          <TableHeader>
            <TableRow style={{ borderColor: "#24344F" }}>
              {[
                "Symbol",
                "Side",
                "Qty",
                "Entry",
                "Exit",
                "P&L",
                "Result",
                "Strategy",
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
            {trades.map((trade, i) => {
              const isWin = trade.pnl > 0;
              return (
                <TableRow
                  key={trade.id}
                  data-ocid={`portfolio.row.${i + positions.length + 1}`}
                  style={{ borderColor: "#1E2C44" }}
                  className="hover:bg-white/5"
                >
                  <TableCell className="font-bold text-xs text-[#EAF0FF]">
                    {trade.instrumentSymbol}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className="text-[9px] py-0"
                      style={{
                        background:
                          trade.side === PositionSide.long_
                            ? "rgba(46,212,122,0.1)"
                            : "rgba(255,90,95,0.1)",
                        color:
                          trade.side === PositionSide.long_
                            ? "#2ED47A"
                            : "#FF5A5F",
                        border:
                          trade.side === PositionSide.long_
                            ? "1px solid #2ED47A44"
                            : "1px solid #FF5A5F44",
                      }}
                    >
                      {trade.side === PositionSide.long_ ? "LONG" : "SHORT"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-[#9AA8C1]">
                    {trade.quantity}
                  </TableCell>
                  <TableCell className="text-xs tabular-nums text-[#EAF0FF]">
                    ₹{trade.entryPrice.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-xs tabular-nums text-[#EAF0FF]">
                    ₹{trade.exitPrice.toLocaleString()}
                  </TableCell>
                  <TableCell
                    className="text-xs font-bold tabular-nums"
                    style={{ color: isWin ? "#2ED47A" : "#FF5A5F" }}
                  >
                    {isWin ? "+" : ""}₹{trade.pnl.toFixed(0)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className="text-[9px] py-0"
                      style={{
                        background: isWin
                          ? "rgba(46,212,122,0.1)"
                          : "rgba(255,90,95,0.1)",
                        color: isWin ? "#2ED47A" : "#FF5A5F",
                        border: isWin
                          ? "1px solid #2ED47A44"
                          : "1px solid #FF5A5F44",
                      }}
                    >
                      {isWin ? "WIN" : "LOSS"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-[10px] text-[#9AA8C1]">
                    {trade.strategyName}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
