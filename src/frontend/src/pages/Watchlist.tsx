import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Search, TrendingDown, TrendingUp } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AssetClass } from "../backend.d";
import { useMarketData } from "../hooks/useMarketData";

const INSTRUMENTS = [
  {
    symbol: "NIFTY50",
    name: "Nifty 50 Index",
    exchange: "NSE",
    assetClass: "index",
    price: 24850,
    low52: 19425,
    high52: 26277,
  },
  {
    symbol: "SENSEX",
    name: "BSE Sensex",
    exchange: "BSE",
    assetClass: "index",
    price: 82134,
    low52: 64148,
    high52: 85978,
  },
  {
    symbol: "RELIANCE",
    name: "Reliance Industries",
    exchange: "NSE",
    assetClass: "equity",
    price: 2847,
    low52: 2220,
    high52: 3218,
  },
  {
    symbol: "TCS",
    name: "Tata Consultancy Services",
    exchange: "NSE",
    assetClass: "equity",
    price: 3945,
    low52: 3311,
    high52: 4592,
  },
  {
    symbol: "HDFCBANK",
    name: "HDFC Bank",
    exchange: "NSE",
    assetClass: "equity",
    price: 1723,
    low52: 1363,
    high52: 1880,
  },
  {
    symbol: "INFY",
    name: "Infosys",
    exchange: "NSE",
    assetClass: "equity",
    price: 1847,
    low52: 1358,
    high52: 2006,
  },
  {
    symbol: "BTC/USD",
    name: "Bitcoin",
    exchange: "CRYPTO",
    assetClass: "crypto",
    price: 67234,
    low52: 25012,
    high52: 73838,
  },
  {
    symbol: "ETH/USD",
    name: "Ethereum",
    exchange: "CRYPTO",
    assetClass: "crypto",
    price: 3456,
    low52: 1520,
    high52: 4094,
  },
  {
    symbol: "GOLD",
    name: "Gold MCX",
    exchange: "MCX",
    assetClass: "commodity",
    price: 72450,
    low52: 57200,
    high52: 74980,
  },
  {
    symbol: "CRUDE",
    name: "Crude Oil",
    exchange: "MCX",
    assetClass: "commodity",
    price: 87.34,
    low52: 62.4,
    high52: 95.7,
  },
  {
    symbol: "EURUSD",
    name: "Euro / US Dollar",
    exchange: "FOREX",
    assetClass: "forex",
    price: 1.0834,
    low52: 1.0448,
    high52: 1.1139,
  },
  {
    symbol: "USDINR",
    name: "USD Indian Rupee",
    exchange: "NSE",
    assetClass: "forex",
    price: 83.47,
    low52: 81.44,
    high52: 84.99,
  },
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    exchange: "NASDAQ",
    assetClass: "equity",
    price: 189.45,
    low52: 164.08,
    high52: 199.62,
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corp.",
    exchange: "NASDAQ",
    assetClass: "equity",
    price: 415.23,
    low52: 309.45,
    high52: 430.82,
  },
  {
    symbol: "BANKNIFTY",
    name: "Bank Nifty Index",
    exchange: "NSE",
    assetClass: "index",
    price: 52445,
    low52: 42422,
    high52: 54467,
  },
];

const SIGNAL_LABELS: Record<string, { label: string; color: string }> = {
  strongBuy: { label: "STRONG BUY", color: "#2ED47A" },
  buy: { label: "BUY", color: "#2ED47A" },
  neutral: { label: "NEUTRAL", color: "#E7D27C" },
  sell: { label: "SELL", color: "#FF5A5F" },
  strongSell: { label: "STRONG SELL", color: "#FF5A5F" },
};

const MOCK_SIGNALS: Record<string, string> = {
  NIFTY50: "strongBuy",
  SENSEX: "buy",
  RELIANCE: "strongBuy",
  TCS: "buy",
  HDFCBANK: "neutral",
  INFY: "sell",
  "BTC/USD": "buy",
  "ETH/USD": "neutral",
  GOLD: "buy",
  CRUDE: "strongBuy",
  EURUSD: "neutral",
  USDINR: "sell",
  AAPL: "buy",
  MSFT: "neutral",
  BANKNIFTY: "strongBuy",
};

export default function Watchlist() {
  const { getPrice } = useMarketData();
  const [search, setSearch] = useState("");
  const [exchangeFilter, setExchangeFilter] = useState("all");
  const [assetFilter, setAssetFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newSymbol, setNewSymbol] = useState("");
  const [newName, setNewName] = useState("");
  const [newExchange, setNewExchange] = useState("");
  const [newAsset, setNewAsset] = useState("equity");

  const filtered = INSTRUMENTS.filter((inst) => {
    const matchSearch =
      !search ||
      inst.symbol.toLowerCase().includes(search.toLowerCase()) ||
      inst.name.toLowerCase().includes(search.toLowerCase());
    const matchExchange =
      exchangeFilter === "all" || inst.exchange === exchangeFilter;
    const matchAsset = assetFilter === "all" || inst.assetClass === assetFilter;
    return matchSearch && matchExchange && matchAsset;
  });

  return (
    <div
      className="px-4 lg:px-6 max-w-[1600px] mx-auto space-y-5"
      data-ocid="watchlist.page"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-[#EAF0FF]">Market Watchlist</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              data-ocid="watchlist.open_modal_button"
              className="gap-1.5 text-xs h-8"
              style={{ background: "#F2C94C", color: "#0B1424" }}
            >
              <Plus className="w-3.5 h-3.5" /> Add Instrument
            </Button>
          </DialogTrigger>
          <DialogContent
            data-ocid="watchlist.dialog"
            style={{ background: "#111E33", border: "1px solid #24344F" }}
          >
            <DialogHeader>
              <DialogTitle className="text-[#EAF0FF]">
                Add Instrument
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-3 py-2">
              <div>
                <p className="text-[#9AA8C1] text-xs mb-1">Symbol</p>
                <Input
                  id="wl-symbol"
                  data-ocid="watchlist.input"
                  value={newSymbol}
                  onChange={(e) => setNewSymbol(e.target.value)}
                  placeholder="e.g. WIPRO"
                  className="bg-white/5 border-[#24344F] text-[#EAF0FF]"
                />
              </div>
              <div>
                <p className="text-[#9AA8C1] text-xs mb-1">Name</p>
                <Input
                  id="wl-name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Full instrument name"
                  className="bg-white/5 border-[#24344F] text-[#EAF0FF]"
                />
              </div>
              <div>
                <p className="text-[#9AA8C1] text-xs mb-1">Exchange</p>
                <Input
                  id="wl-exchange"
                  value={newExchange}
                  onChange={(e) => setNewExchange(e.target.value)}
                  placeholder="NSE, BSE, CRYPTO..."
                  className="bg-white/5 border-[#24344F] text-[#EAF0FF]"
                />
              </div>
              <div>
                <p className="text-[#9AA8C1] text-xs mb-1">Asset Class</p>
                <Select value={newAsset} onValueChange={setNewAsset}>
                  <SelectTrigger
                    data-ocid="watchlist.select"
                    className="bg-white/5 border-[#24344F] text-[#EAF0FF]"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent
                    style={{
                      background: "#111E33",
                      border: "1px solid #24344F",
                    }}
                  >
                    {Object.values(AssetClass).map((ac) => (
                      <SelectItem
                        key={ac}
                        value={ac}
                        className="text-[#EAF0FF]"
                      >
                        {ac}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                data-ocid="watchlist.cancel_button"
                variant="ghost"
                onClick={() => setDialogOpen(false)}
                className="text-[#9AA8C1]"
              >
                Cancel
              </Button>
              <Button
                data-ocid="watchlist.submit_button"
                onClick={() => {
                  toast.success(`Added ${newSymbol} to watchlist`);
                  setDialogOpen(false);
                }}
                style={{ background: "#F2C94C", color: "#0B1424" }}
              >
                Add
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#9AA8C1]" />
          <Input
            data-ocid="watchlist.search_input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search symbol or name..."
            className="pl-8 h-8 text-xs bg-white/5 border-[#24344F] text-[#EAF0FF] placeholder:text-[#9AA8C1] w-56"
          />
        </div>
        <Select value={exchangeFilter} onValueChange={setExchangeFilter}>
          <SelectTrigger
            data-ocid="watchlist.select"
            className="h-8 text-xs bg-white/5 border-[#24344F] text-[#EAF0FF] w-32"
          >
            <SelectValue placeholder="Exchange" />
          </SelectTrigger>
          <SelectContent
            style={{ background: "#111E33", border: "1px solid #24344F" }}
          >
            {[
              "all",
              "NSE",
              "BSE",
              "MCX",
              "CRYPTO",
              "NASDAQ",
              "NYSE",
              "FOREX",
            ].map((e) => (
              <SelectItem key={e} value={e} className="text-[#EAF0FF] text-xs">
                {e === "all" ? "All Exchanges" : e}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={assetFilter} onValueChange={setAssetFilter}>
          <SelectTrigger
            data-ocid="watchlist.select"
            className="h-8 text-xs bg-white/5 border-[#24344F] text-[#EAF0FF] w-36"
          >
            <SelectValue placeholder="Asset Class" />
          </SelectTrigger>
          <SelectContent
            style={{ background: "#111E33", border: "1px solid #24344F" }}
          >
            {["all", ...Object.values(AssetClass)].map((a) => (
              <SelectItem key={a} value={a} className="text-[#EAF0FF] text-xs">
                {a === "all" ? "All Classes" : a}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="trading-card overflow-hidden" data-ocid="watchlist.table">
        <Table>
          <TableHeader>
            <TableRow style={{ borderColor: "#24344F", background: "#0B1424" }}>
              {[
                "Symbol",
                "Name",
                "Exchange",
                "Class",
                "Price",
                "Change %",
                "52W Low",
                "52W High",
                "Signal",
              ].map((h) => (
                <TableHead
                  key={h}
                  className="text-[#9AA8C1] text-[10px] uppercase py-3"
                >
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((inst, i) => {
              const market = getPrice(inst.symbol);
              const price = market ? market.price : inst.price;
              const changePct = market ? market.changePct : 0;
              const isUp = changePct >= 0;
              const sig = MOCK_SIGNALS[inst.symbol] ?? "neutral";
              const sigConf = SIGNAL_LABELS[sig];
              return (
                <TableRow
                  key={inst.symbol}
                  data-ocid={`watchlist.row.${i + 1}`}
                  style={{ borderColor: "#1E2C44" }}
                  className="hover:bg-white/5"
                >
                  <TableCell className="font-bold text-xs text-[#EAF0FF]">
                    {inst.symbol}
                  </TableCell>
                  <TableCell className="text-xs text-[#9AA8C1] max-w-[160px] truncate">
                    {inst.name}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className="text-[9px] py-0"
                      style={{
                        background: "rgba(96,175,255,0.1)",
                        color: "#60AFFF",
                        border: "1px solid #60AFFF44",
                      }}
                    >
                      {inst.exchange}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-[10px] text-[#9AA8C1] capitalize">
                    {inst.assetClass}
                  </TableCell>
                  <TableCell className="text-xs font-bold tabular-nums text-[#EAF0FF]">
                    {price > 100
                      ? price.toLocaleString("en-IN", {
                          maximumFractionDigits: 2,
                        })
                      : price.toFixed(4)}
                  </TableCell>
                  <TableCell>
                    <span
                      className="flex items-center gap-0.5 text-xs font-semibold"
                      style={{ color: isUp ? "#2ED47A" : "#FF5A5F" }}
                    >
                      {isUp ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      {isUp ? "+" : ""}
                      {changePct.toFixed(2)}%
                    </span>
                  </TableCell>
                  <TableCell className="text-[11px] tabular-nums text-[#9AA8C1]">
                    {inst.low52.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-[11px] tabular-nums text-[#9AA8C1]">
                    {inst.high52.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className="text-[9px] py-0"
                      style={{
                        background: `${sigConf.color}22`,
                        color: sigConf.color,
                        border: `1px solid ${sigConf.color}44`,
                      }}
                    >
                      {sigConf.label}
                    </Badge>
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
