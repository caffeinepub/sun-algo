import {
  Activity,
  AlertTriangle,
  BarChart2,
  Bitcoin,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  Database,
  DollarSign,
  Globe,
  Layers,
  Mic,
  RefreshCw,
  Search,
  Star,
  TrendingDown,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Progress } from "../components/ui/progress";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";

// ─── Types ───────────────────────────────────────────────────────────────────
type PipelineStatus = "pending" | "running" | "done" | "error";
type SyncStatusType = "OK" | "RUNNING" | "ERROR" | "SYNCING";

interface PipelineStep {
  id: number;
  name: string;
  desc: string;
  icon: React.ReactNode;
  status: PipelineStatus;
  records: number;
  duration?: string;
  sources: string[];
}

interface SyncScheduleRow {
  market: string;
  schedule: string;
  nextSync: string;
  status: SyncStatusType;
  lastCount: number;
}

interface SyncLogRow {
  id: string;
  exchange: string;
  time: string;
  fetched: number;
  added: number;
  updated: number;
  removed: number;
  status: "SUCCESS" | "RUNNING" | "FAILED";
}

interface SearchResult {
  symbol: string;
  name: string;
  exchange: string;
  type: string;
  category: string;
  price: string;
  change: number;
  trending?: boolean;
}

// ─── Static Data ──────────────────────────────────────────────────────────────
const PIPELINE_STEPS: PipelineStep[] = [
  {
    id: 1,
    name: "FETCH",
    desc: "Pull from live APIs — SEC, Polygon, CoinGecko, Binance, OANDA, Yahoo Finance",
    icon: <Globe className="w-4 h-4" />,
    status: "done",
    records: 84312,
    duration: "2m 14s",
    sources: [
      "SEC EDGAR",
      "Polygon.io",
      "CoinGecko",
      "Binance",
      "OANDA",
      "Yahoo Finance",
    ],
  },
  {
    id: 2,
    name: "PARSE",
    desc: "Normalize all formats to standard instrument schema",
    icon: <Layers className="w-4 h-4" />,
    status: "done",
    records: 84312,
    duration: "1m 08s",
    sources: ["CSV parser", "JSON normalizer", "GZip decompressor"],
  },
  {
    id: 3,
    name: "ENRICH",
    desc: "Add metadata: sector, market cap, token type, pip size, contract specs",
    icon: <Star className="w-4 h-4" />,
    status: "done",
    records: 81247,
    duration: "1m 42s",
    sources: ["SIC codes", "GICS sectors", "CoinGecko categories"],
  },
  {
    id: 4,
    name: "STORE",
    desc: "Save to instruments_master database with UPSERT logic",
    icon: <Database className="w-4 h-4" />,
    status: "done",
    records: 81247,
    duration: "0m 58s",
    sources: ["PostgreSQL", "Redis cache"],
  },
  {
    id: 5,
    name: "INDEX",
    desc: "Build full-text search index for instant symbol/name/ISIN lookup",
    icon: <Search className="w-4 h-4" />,
    status: "done",
    records: 81247,
    duration: "0m 22s",
    sources: ["Elasticsearch", "Trigram index"],
  },
  {
    id: 6,
    name: "SYNC",
    desc: "Schedule auto-refresh — continuous for crypto/forex, daily for stocks",
    icon: <RefreshCw className="w-4 h-4" />,
    status: "running",
    records: 81247,
    duration: "ongoing",
    sources: ["APScheduler", "Celery Beat"],
  },
  {
    id: 7,
    name: "MAP",
    desc: "Link to broker tokens (IB, Alpaca, Binance) and streaming data feeds",
    icon: <Zap className="w-4 h-4" />,
    status: "done",
    records: 78934,
    duration: "0m 35s",
    sources: ["Interactive Brokers", "Alpaca", "Binance API"],
  },
];

const SYNC_SCHEDULE: SyncScheduleRow[] = [
  {
    market: "US Stocks (NYSE/NASDAQ/AMEX)",
    schedule: "Daily 5:30 AM EST",
    nextSync: "Tomorrow 5:30 AM",
    status: "OK",
    lastCount: 14102,
  },
  {
    market: "US ETFs",
    schedule: "Daily 5:30 AM EST",
    nextSync: "Tomorrow 5:30 AM",
    status: "OK",
    lastCount: 3247,
  },
  {
    market: "US Options",
    schedule: "Daily 6:00 AM EST",
    nextSync: "Tomorrow 6:00 AM",
    status: "OK",
    lastCount: 245820,
  },
  {
    market: "Global Forex",
    schedule: "Continuous (1 hr)",
    nextSync: "In 45 min",
    status: "OK",
    lastCount: 77,
  },
  {
    market: "Cryptocurrency",
    schedule: "Every 15 min",
    nextSync: "In 8 min",
    status: "RUNNING",
    lastCount: 13241,
  },
  {
    market: "Global Commodities",
    schedule: "Daily 7:00 AM EST",
    nextSync: "Tomorrow 7:00 AM",
    status: "OK",
    lastCount: 48,
  },
  {
    market: "Global Indices",
    schedule: "Daily 6:00 AM EST",
    nextSync: "Tomorrow 6:00 AM",
    status: "OK",
    lastCount: 30,
  },
];

const SYNC_LOG: SyncLogRow[] = [
  {
    id: "1",
    exchange: "CoinGecko",
    time: "04:52 AM",
    fetched: 13241,
    added: 0,
    updated: 847,
    removed: 2,
    status: "SUCCESS",
  },
  {
    id: "2",
    exchange: "Binance",
    time: "04:50 AM",
    fetched: 2847,
    added: 0,
    updated: 124,
    removed: 0,
    status: "SUCCESS",
  },
  {
    id: "3",
    exchange: "SEC EDGAR",
    time: "05:30 AM",
    fetched: 10482,
    added: 12,
    updated: 340,
    removed: 3,
    status: "SUCCESS",
  },
  {
    id: "4",
    exchange: "Polygon.io",
    time: "05:31 AM",
    fetched: 14102,
    added: 8,
    updated: 892,
    removed: 1,
    status: "SUCCESS",
  },
  {
    id: "5",
    exchange: "Alpha Vantage",
    time: "05:32 AM",
    fetched: 14102,
    added: 0,
    updated: 420,
    removed: 0,
    status: "SUCCESS",
  },
  {
    id: "6",
    exchange: "OANDA",
    time: "05:00 AM",
    fetched: 77,
    added: 0,
    updated: 77,
    removed: 0,
    status: "SUCCESS",
  },
  {
    id: "7",
    exchange: "Yahoo Finance",
    time: "06:01 AM",
    fetched: 30,
    added: 0,
    updated: 30,
    removed: 0,
    status: "SUCCESS",
  },
  {
    id: "8",
    exchange: "CoinGecko",
    time: "05:07 AM",
    fetched: 13241,
    added: 0,
    updated: 512,
    removed: 1,
    status: "SUCCESS",
  },
  {
    id: "9",
    exchange: "Quandl",
    time: "07:02 AM",
    fetched: 48,
    added: 0,
    updated: 48,
    removed: 0,
    status: "SUCCESS",
  },
  {
    id: "10",
    exchange: "ETF Database",
    time: "05:33 AM",
    fetched: 3247,
    added: 2,
    updated: 187,
    removed: 0,
    status: "SUCCESS",
  },
];

const ALL_SEARCH_RESULTS: SearchResult[] = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    exchange: "NASDAQ",
    type: "Stock",
    category: "Large Cap Tech",
    price: "$187.42",
    change: 1.24,
    trending: true,
  },
  {
    symbol: "NVDA",
    name: "NVIDIA Corporation",
    exchange: "NASDAQ",
    type: "Stock",
    category: "Large Cap Tech",
    price: "$824.18",
    change: 2.87,
    trending: true,
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corporation",
    exchange: "NASDAQ",
    type: "Stock",
    category: "Large Cap Tech",
    price: "$415.30",
    change: 0.68,
  },
  {
    symbol: "TSLA",
    name: "Tesla Inc.",
    exchange: "NASDAQ",
    type: "Stock",
    category: "Large Cap EV",
    price: "$172.64",
    change: -1.43,
  },
  {
    symbol: "JPM",
    name: "JPMorgan Chase & Co.",
    exchange: "NYSE",
    type: "Stock",
    category: "Large Cap Financial",
    price: "$198.72",
    change: 0.34,
  },
  {
    symbol: "BTC",
    name: "Bitcoin",
    exchange: "Crypto",
    type: "Crypto",
    category: "Layer 1",
    price: "$68,420",
    change: 3.14,
    trending: true,
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    exchange: "Crypto",
    type: "Crypto",
    category: "Layer 1",
    price: "$3,847",
    change: 1.82,
  },
  {
    symbol: "EUR/USD",
    name: "Euro / US Dollar",
    exchange: "FOREX",
    type: "Forex",
    category: "Major Pair",
    price: "1.0824",
    change: -0.12,
  },
  {
    symbol: "GLD",
    name: "SPDR Gold Shares",
    exchange: "NYSE",
    type: "ETF",
    category: "Commodity ETF",
    price: "$224.18",
    change: 0.54,
  },
  {
    symbol: "XAU/USD",
    name: "Gold Spot",
    exchange: "COMEX",
    type: "Commodity",
    category: "Precious Metal",
    price: "$2,342.80",
    change: 0.82,
    trending: true,
  },
  {
    symbol: "SPY",
    name: "SPDR S&P 500 ETF",
    exchange: "NYSE",
    type: "ETF",
    category: "Index ETF",
    price: "$524.82",
    change: 0.47,
  },
  {
    symbol: "^N225",
    name: "Nikkei 225",
    exchange: "TSE",
    type: "Index",
    category: "Asia Pacific",
    price: "40,247",
    change: -0.38,
  },
  {
    symbol: "USD/INR",
    name: "US Dollar / Indian Rupee",
    exchange: "FOREX",
    type: "Forex",
    category: "Exotic Pair",
    price: "83.42",
    change: 0.08,
  },
  {
    symbol: "CL",
    name: "WTI Crude Oil Futures",
    exchange: "NYMEX",
    type: "Commodity",
    category: "Energy",
    price: "$82.14",
    change: -0.94,
  },
  {
    symbol: "DOGE",
    name: "Dogecoin",
    exchange: "Crypto",
    type: "Crypto",
    category: "Meme Coin",
    price: "$0.1624",
    change: 5.42,
  },
];

const US_ETF_SAMPLES = [
  {
    symbol: "SPY",
    name: "SPDR S&P 500 ETF Trust",
    type: "Index",
    aum: "$502B",
    expense: "0.0945%",
  },
  {
    symbol: "QQQ",
    name: "Invesco NASDAQ 100 ETF",
    type: "Index",
    aum: "$248B",
    expense: "0.20%",
  },
  {
    symbol: "IWM",
    name: "iShares Russell 2000 ETF",
    type: "Index",
    aum: "$62B",
    expense: "0.19%",
  },
  {
    symbol: "DIA",
    name: "SPDR Dow Jones Industrial Avg",
    type: "Index",
    aum: "$34B",
    expense: "0.16%",
  },
  {
    symbol: "GLD",
    name: "SPDR Gold Shares",
    type: "Commodity",
    aum: "$59B",
    expense: "0.40%",
  },
  {
    symbol: "SLV",
    name: "iShares Silver Trust",
    type: "Commodity",
    aum: "$11B",
    expense: "0.50%",
  },
  {
    symbol: "XLF",
    name: "Financial Select Sector SPDR",
    type: "Sector",
    aum: "$38B",
    expense: "0.10%",
  },
  {
    symbol: "XLK",
    name: "Technology Select Sector SPDR",
    type: "Sector",
    aum: "$62B",
    expense: "0.10%",
  },
  {
    symbol: "ARKK",
    name: "ARK Innovation ETF",
    type: "Thematic",
    aum: "$7.2B",
    expense: "0.75%",
  },
  {
    symbol: "TLT",
    name: "iShares 20+ Year Treasury Bond",
    type: "Bond",
    aum: "$52B",
    expense: "0.15%",
  },
];

const FOREX_MAJORS = [
  {
    pair: "EUR/USD",
    base: "EUR",
    quote: "USD",
    pip: "0.0001",
    spread: "0.1",
    session: "London/NY",
  },
  {
    pair: "GBP/USD",
    base: "GBP",
    quote: "USD",
    pip: "0.0001",
    spread: "0.3",
    session: "London/NY",
  },
  {
    pair: "USD/JPY",
    base: "USD",
    quote: "JPY",
    pip: "0.01",
    spread: "0.4",
    session: "Tokyo/NY",
  },
  {
    pair: "USD/CHF",
    base: "USD",
    quote: "CHF",
    pip: "0.0001",
    spread: "0.5",
    session: "London/NY",
  },
  {
    pair: "AUD/USD",
    base: "AUD",
    quote: "USD",
    pip: "0.0001",
    spread: "0.4",
    session: "Sydney/NY",
  },
  {
    pair: "USD/CAD",
    base: "USD",
    quote: "CAD",
    pip: "0.0001",
    spread: "0.5",
    session: "NY",
  },
  {
    pair: "NZD/USD",
    base: "NZD",
    quote: "USD",
    pip: "0.0001",
    spread: "0.6",
    session: "Sydney/NY",
  },
];

const FOREX_MINORS = [
  "EUR/GBP",
  "EUR/JPY",
  "EUR/CHF",
  "EUR/AUD",
  "EUR/CAD",
  "EUR/NZD",
  "GBP/JPY",
  "GBP/CHF",
  "GBP/AUD",
  "GBP/CAD",
  "GBP/NZD",
  "AUD/JPY",
  "AUD/CAD",
  "AUD/CHF",
  "AUD/NZD",
  "CAD/JPY",
  "CHF/JPY",
  "NZD/JPY",
  "NZD/CAD",
];

const FOREX_EXOTICS = [
  { pair: "USD/INR", region: "South Asia", pip: "0.01" },
  { pair: "USD/SGD", region: "SE Asia", pip: "0.0001" },
  { pair: "USD/HKD", region: "East Asia", pip: "0.0001" },
  { pair: "USD/CNH", region: "China", pip: "0.0001" },
  { pair: "USD/KRW", region: "Korea", pip: "0.01" },
  { pair: "USD/BRL", region: "Brazil", pip: "0.0001" },
  { pair: "USD/MXN", region: "Mexico", pip: "0.0001" },
  { pair: "USD/TRY", region: "Turkey", pip: "0.0001" },
  { pair: "USD/ZAR", region: "S. Africa", pip: "0.0001" },
  { pair: "USD/THB", region: "Thailand", pip: "0.01" },
  { pair: "USD/IDR", region: "Indonesia", pip: "0.01" },
  { pair: "EUR/INR", region: "India", pip: "0.01" },
];

const CRYPTO_CATEGORIES = [
  {
    name: "Layer 1",
    color: "#F2C94C",
    count: 10,
    coins: [
      "BTC",
      "ETH",
      "SOL",
      "ADA",
      "AVAX",
      "DOT",
      "ATOM",
      "NEAR",
      "APT",
      "SUI",
    ],
  },
  {
    name: "Layer 2",
    color: "#9B59B6",
    count: 5,
    coins: ["MATIC", "ARB", "OP", "IMX", "STRK"],
  },
  {
    name: "DeFi",
    color: "#00C087",
    count: 6,
    coins: ["UNI", "AAVE", "MKR", "CRV", "COMP", "SNX"],
  },
  {
    name: "Exchange",
    color: "#F39C12",
    count: 4,
    coins: ["BNB", "OKB", "CRO", "KCS"],
  },
  {
    name: "Stablecoins",
    color: "#3498DB",
    count: 4,
    coins: ["USDT", "USDC", "DAI", "BUSD"],
  },
  {
    name: "Meme Coins",
    color: "#E74C3C",
    count: 4,
    coins: ["DOGE", "SHIB", "PEPE", "FLOKI"],
  },
  {
    name: "NFT/Gaming",
    color: "#2ECC71",
    count: 4,
    coins: ["AXS", "SAND", "MANA", "ENJ"],
  },
  {
    name: "AI Tokens",
    color: "#1ABC9C",
    count: 4,
    coins: ["FET", "AGIX", "OCEAN", "WLD"],
  },
];

const CRYPTO_SAMPLES = [
  {
    symbol: "BTC",
    name: "Bitcoin",
    cat: "Layer 1",
    rank: 1,
    price: "$68,420",
    change: 3.14,
    binancePair: "BTCUSDT",
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    cat: "Layer 1",
    rank: 2,
    price: "$3,847",
    change: 1.82,
    binancePair: "ETHUSDT",
  },
  {
    symbol: "SOL",
    name: "Solana",
    cat: "Layer 1",
    rank: 5,
    price: "$178.42",
    change: 4.21,
    binancePair: "SOLUSDT",
  },
  {
    symbol: "BNB",
    name: "Binance Coin",
    cat: "Exchange",
    rank: 4,
    price: "$412.80",
    change: 0.84,
    binancePair: "BNBUSDT",
  },
  {
    symbol: "USDT",
    name: "Tether",
    cat: "Stablecoin",
    rank: 3,
    price: "$1.0001",
    change: 0.01,
    binancePair: "USDTBUSD",
  },
  {
    symbol: "DOGE",
    name: "Dogecoin",
    cat: "Meme",
    rank: 9,
    price: "$0.1624",
    change: 5.42,
    binancePair: "DOGEUSDT",
  },
  {
    symbol: "UNI",
    name: "Uniswap",
    cat: "DeFi",
    rank: 18,
    price: "$12.48",
    change: -1.24,
    binancePair: "UNIUSDT",
  },
  {
    symbol: "MATIC",
    name: "Polygon",
    cat: "Layer 2",
    rank: 14,
    price: "$0.8420",
    change: 2.14,
    binancePair: "MATICUSDT",
  },
];

const COMMODITIES = [
  {
    symbol: "XAU/USD",
    name: "Gold Spot",
    exchange: "COMEX",
    contract: "Troy oz",
    cat: "Precious Metal",
  },
  {
    symbol: "XAG/USD",
    name: "Silver Spot",
    exchange: "COMEX",
    contract: "Troy oz",
    cat: "Precious Metal",
  },
  {
    symbol: "XPT/USD",
    name: "Platinum Spot",
    exchange: "NYMEX",
    contract: "Troy oz",
    cat: "Precious Metal",
  },
  {
    symbol: "XPD/USD",
    name: "Palladium Spot",
    exchange: "NYMEX",
    contract: "Troy oz",
    cat: "Precious Metal",
  },
  {
    symbol: "CL",
    name: "WTI Crude Oil",
    exchange: "NYMEX",
    contract: "1,000 bbl",
    cat: "Energy",
  },
  {
    symbol: "CO",
    name: "Brent Crude Oil",
    exchange: "ICE",
    contract: "1,000 bbl",
    cat: "Energy",
  },
  {
    symbol: "NG",
    name: "Natural Gas",
    exchange: "NYMEX",
    contract: "10,000 mmBtu",
    cat: "Energy",
  },
  {
    symbol: "ZW",
    name: "Wheat",
    exchange: "CBOT",
    contract: "5,000 bu",
    cat: "Agriculture",
  },
  {
    symbol: "ZC",
    name: "Corn",
    exchange: "CBOT",
    contract: "5,000 bu",
    cat: "Agriculture",
  },
  {
    symbol: "ZS",
    name: "Soybeans",
    exchange: "CBOT",
    contract: "5,000 bu",
    cat: "Agriculture",
  },
  {
    symbol: "KC",
    name: "Coffee",
    exchange: "ICE",
    contract: "37,500 lb",
    cat: "Agriculture",
  },
  {
    symbol: "SB",
    name: "Sugar",
    exchange: "ICE",
    contract: "112,000 lb",
    cat: "Agriculture",
  },
  {
    symbol: "CT",
    name: "Cotton",
    exchange: "ICE",
    contract: "50,000 lb",
    cat: "Agriculture",
  },
  {
    symbol: "CC",
    name: "Cocoa",
    exchange: "ICE",
    contract: "10 MT",
    cat: "Agriculture",
  },
  {
    symbol: "LE",
    name: "Live Cattle",
    exchange: "CME",
    contract: "40,000 lb",
    cat: "Livestock",
  },
  {
    symbol: "HE",
    name: "Lean Hogs",
    exchange: "CME",
    contract: "40,000 lb",
    cat: "Livestock",
  },
];

const GLOBAL_INDICES = [
  {
    symbol: "^NSEI",
    name: "NIFTY 50",
    country: "🇮🇳",
    region: "Asia-Pacific",
    exchange: "NSE",
  },
  {
    symbol: "^BSESN",
    name: "BSE SENSEX",
    country: "🇮🇳",
    region: "Asia-Pacific",
    exchange: "BSE",
  },
  {
    symbol: "^N225",
    name: "Nikkei 225",
    country: "🇯🇵",
    region: "Asia-Pacific",
    exchange: "TSE",
  },
  {
    symbol: "^HSI",
    name: "Hang Seng",
    country: "🇭🇰",
    region: "Asia-Pacific",
    exchange: "HKEX",
  },
  {
    symbol: "000001.SS",
    name: "Shanghai Composite",
    country: "🇨🇳",
    region: "Asia-Pacific",
    exchange: "SSE",
  },
  {
    symbol: "^AXJO",
    name: "ASX 200",
    country: "🇦🇺",
    region: "Asia-Pacific",
    exchange: "ASX",
  },
  {
    symbol: "^STI",
    name: "Straits Times",
    country: "🇸🇬",
    region: "Asia-Pacific",
    exchange: "SGX",
  },
  {
    symbol: "^KS11",
    name: "KOSPI",
    country: "🇰🇷",
    region: "Asia-Pacific",
    exchange: "KRX",
  },
  {
    symbol: "^TWII",
    name: "Taiwan Weighted",
    country: "🇹🇼",
    region: "Asia-Pacific",
    exchange: "TWSE",
  },
  {
    symbol: "^FTSE",
    name: "FTSE 100",
    country: "🇬🇧",
    region: "Europe",
    exchange: "LSE",
  },
  {
    symbol: "^GDAXI",
    name: "DAX",
    country: "🇩🇪",
    region: "Europe",
    exchange: "XETRA",
  },
  {
    symbol: "^FCHI",
    name: "CAC 40",
    country: "🇫🇷",
    region: "Europe",
    exchange: "Euronext",
  },
  {
    symbol: "^AEX",
    name: "AEX",
    country: "🇳🇱",
    region: "Europe",
    exchange: "Euronext",
  },
  {
    symbol: "^IBEX",
    name: "IBEX 35",
    country: "🇪🇸",
    region: "Europe",
    exchange: "BME",
  },
  {
    symbol: "^SSMI",
    name: "SMI",
    country: "🇨🇭",
    region: "Europe",
    exchange: "SIX",
  },
  {
    symbol: "FTSEMIB.MI",
    name: "FTSE MIB",
    country: "🇮🇹",
    region: "Europe",
    exchange: "Borsa",
  },
  {
    symbol: "^GSPC",
    name: "S&P 500",
    country: "🇺🇸",
    region: "Americas",
    exchange: "NYSE",
  },
  {
    symbol: "^DJI",
    name: "Dow Jones",
    country: "🇺🇸",
    region: "Americas",
    exchange: "NYSE",
  },
  {
    symbol: "^IXIC",
    name: "NASDAQ Composite",
    country: "🇺🇸",
    region: "Americas",
    exchange: "NASDAQ",
  },
  {
    symbol: "^RUT",
    name: "Russell 2000",
    country: "🇺🇸",
    region: "Americas",
    exchange: "NYSE",
  },
  {
    symbol: "^VIX",
    name: "CBOE VIX",
    country: "🇺🇸",
    region: "Americas",
    exchange: "CBOE",
  },
  {
    symbol: "^BVSP",
    name: "Bovespa",
    country: "🇧🇷",
    region: "Americas",
    exchange: "B3",
  },
  {
    symbol: "^MXX",
    name: "IPC Mexico",
    country: "🇲🇽",
    region: "Americas",
    exchange: "BMV",
  },
  {
    symbol: "^GSPTSE",
    name: "TSX Composite",
    country: "🇨🇦",
    region: "Americas",
    exchange: "TSX",
  },
  {
    symbol: "^TASI",
    name: "Tadawul",
    country: "🇸🇦",
    region: "Middle East",
    exchange: "Tadawul",
  },
  {
    symbol: "^DFMGI",
    name: "Dubai Financial Market",
    country: "🇦🇪",
    region: "Middle East",
    exchange: "DFM",
  },
  {
    symbol: "^CASE30",
    name: "EGX 30",
    country: "🇪🇬",
    region: "Africa",
    exchange: "EGX",
  },
  {
    symbol: "^JSE",
    name: "JSE All Share",
    country: "🇿🇦",
    region: "Africa",
    exchange: "JSE",
  },
];

const US_STOCK_SAMPLES = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    exchange: "NASDAQ",
    cap: "Large",
    sector: "Technology",
    sp500: true,
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corporation",
    exchange: "NASDAQ",
    cap: "Large",
    sector: "Technology",
    sp500: true,
  },
  {
    symbol: "NVDA",
    name: "NVIDIA Corporation",
    exchange: "NASDAQ",
    cap: "Large",
    sector: "Technology",
    sp500: true,
  },
  {
    symbol: "AMZN",
    name: "Amazon.com Inc.",
    exchange: "NASDAQ",
    cap: "Large",
    sector: "Consumer Disc.",
    sp500: true,
  },
  {
    symbol: "TSLA",
    name: "Tesla Inc.",
    exchange: "NASDAQ",
    cap: "Large",
    sector: "Auto",
    sp500: true,
  },
  {
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    exchange: "NASDAQ",
    cap: "Large",
    sector: "Technology",
    sp500: true,
  },
  {
    symbol: "META",
    name: "Meta Platforms",
    exchange: "NASDAQ",
    cap: "Large",
    sector: "Technology",
    sp500: true,
  },
  {
    symbol: "JPM",
    name: "JPMorgan Chase & Co.",
    exchange: "NYSE",
    cap: "Large",
    sector: "Financial",
    sp500: true,
  },
  {
    symbol: "BAC",
    name: "Bank of America",
    exchange: "NYSE",
    cap: "Large",
    sector: "Financial",
    sp500: true,
  },
  {
    symbol: "XOM",
    name: "Exxon Mobil",
    exchange: "NYSE",
    cap: "Large",
    sector: "Energy",
    sp500: true,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function PipelineStatusBadge({ status }: { status: PipelineStatus }) {
  const map: Record<
    PipelineStatus,
    { label: string; color: string; bg: string }
  > = {
    done: { label: "DONE", color: "#00C087", bg: "rgba(0,192,135,0.12)" },
    running: {
      label: "RUNNING",
      color: "#F2C94C",
      bg: "rgba(242,201,76,0.12)",
    },
    pending: {
      label: "PENDING",
      color: "#9AA8C1",
      bg: "rgba(154,168,193,0.12)",
    },
    error: { label: "ERROR", color: "#FF5A5F", bg: "rgba(255,90,95,0.12)" },
  };
  const s = map[status];
  return (
    <span
      className="text-[10px] font-bold px-2 py-0.5 rounded"
      style={{ color: s.color, background: s.bg }}
    >
      {s.label}
    </span>
  );
}

function SyncBadge({ status }: { status: SyncStatusType }) {
  const map: Record<
    SyncStatusType,
    { label: string; color: string; emoji: string }
  > = {
    OK: { label: "OK", color: "#00C087", emoji: "✅" },
    RUNNING: { label: "RUNNING", color: "#F2C94C", emoji: "🔄" },
    ERROR: { label: "ERROR", color: "#FF5A5F", emoji: "❌" },
    SYNCING: { label: "SYNCING", color: "#9B59B6", emoji: "⟳" },
  };
  const s = map[status];
  return (
    <span style={{ color: s.color }}>
      {s.emoji} {s.label}
    </span>
  );
}

function StatusBadge({ status }: { status: "SUCCESS" | "RUNNING" | "FAILED" }) {
  const map = {
    SUCCESS: "text-[#00C087] bg-[#00C087]/10",
    RUNNING: "text-[#F2C94C] bg-[#F2C94C]/10",
    FAILED: "text-[#FF5A5F] bg-[#FF5A5F]/10",
  };
  return (
    <span
      className={`text-[10px] font-bold px-2 py-0.5 rounded ${map[status]}`}
    >
      {status}
    </span>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function GlobalMarkets() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All Markets");
  const [totalCount, setTotalCount] = useState(0);

  const [pipelineProgress, setPipelineProgress] = useState(85);
  const [recentSearches] = useState(["AAPL", "EUR/USD", "BTCUSDT", "GOLD"]);
  const targetCount = 84312;
  const animFrameRef = useRef<number | null>(null);

  // Animated counter
  useEffect(() => {
    let current = 0;
    const step = Math.ceil(targetCount / 80);
    const tick = () => {
      current = Math.min(current + step, targetCount);
      setTotalCount(current);
      if (current < targetCount) {
        animFrameRef.current = requestAnimationFrame(tick);
      }
    };
    animFrameRef.current = requestAnimationFrame(tick);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Simulate pipeline progress for SYNC step
  useEffect(() => {
    const iv = setInterval(() => {
      setPipelineProgress((p) => (p >= 100 ? 42 : p + 2));
    }, 800);
    return () => clearInterval(iv);
  }, []);

  const filters = [
    "All Markets",
    "US Stocks",
    "Forex",
    "Crypto",
    "Commodities",
    "Indices",
  ];

  const filteredResults = ALL_SEARCH_RESULTS.filter((r) => {
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      !q ||
      r.symbol.toLowerCase().includes(q) ||
      r.name.toLowerCase().includes(q);
    const matchesFilter =
      activeFilter === "All Markets" ||
      (activeFilter === "US Stocks" && r.type === "Stock") ||
      (activeFilter === "Forex" && r.type === "Forex") ||
      (activeFilter === "Crypto" && r.type === "Crypto") ||
      (activeFilter === "Commodities" && r.type === "Commodity") ||
      (activeFilter === "Indices" && r.type === "Index") ||
      (activeFilter === "US Stocks" && r.type === "ETF");
    return matchesQuery && matchesFilter;
  });

  const indicesByRegion = GLOBAL_INDICES.reduce<
    Record<string, typeof GLOBAL_INDICES>
  >((acc, idx) => {
    if (!acc[idx.region]) acc[idx.region] = [];
    acc[idx.region].push(idx);
    return acc;
  }, {});

  const FOREX_SESSION_NOW_UTC = 14; // Simulate 14:00 UTC — London+NY overlap
  const sessions = [
    { name: "Sydney", start: 22, end: 7, color: "#3498DB" },
    { name: "Tokyo", start: 0, end: 9, color: "#9B59B6" },
    { name: "London", start: 8, end: 17, color: "#F2C94C" },
    { name: "New York", start: 13, end: 22, color: "#00C087" },
  ];

  const isSessionOpen = (start: number, end: number) => {
    if (start < end)
      return FOREX_SESSION_NOW_UTC >= start && FOREX_SESSION_NOW_UTC < end;
    return FOREX_SESSION_NOW_UTC >= start || FOREX_SESSION_NOW_UTC < end;
  };

  return (
    <div
      className="min-h-screen p-4 lg:p-6"
      style={{ background: "#0B1424", color: "#EAF0FF" }}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* ── Header ── */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Globe className="w-7 h-7" style={{ color: "#F2C94C" }} />
              <h1
                className="text-2xl font-bold tracking-widest uppercase"
                style={{ color: "#EAF0FF" }}
              >
                Global Markets Mapping Engine
              </h1>
            </div>
            <p className="text-sm" style={{ color: "#9AA8C1" }}>
              Auto-discovery across 6 asset classes · 50+ exchanges · worldwide
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div
              className="px-5 py-2.5 rounded-xl text-center"
              style={{ background: "#111E33", border: "1px solid #24344F" }}
            >
              <div
                className="text-2xl font-bold tabular-nums"
                style={{ color: "#F2C94C" }}
              >
                {totalCount.toLocaleString()}
              </div>
              <div
                className="text-[10px] uppercase tracking-widest"
                style={{ color: "#9AA8C1" }}
              >
                Total Instruments
              </div>
            </div>
            <Button
              size="sm"
              className="gap-2"
              style={{ background: "#F2C94C", color: "#0B1424" }}
            >
              <RefreshCw className="w-4 h-4" />
              Sync All
            </Button>
          </div>
        </div>

        {/* ── 7-Step Pipeline ── */}
        <div
          className="rounded-xl p-5"
          style={{ background: "#0C1A30", border: "1px solid #1E2C44" }}
          data-ocid="global-markets.panel"
        >
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5" style={{ color: "#F2C94C" }} />
            <h2
              className="text-sm font-bold uppercase tracking-widest"
              style={{ color: "#EAF0FF" }}
            >
              Auto-Mapping Pipeline
            </h2>
            <span
              className="ml-auto text-xs px-2 py-0.5 rounded"
              style={{ background: "rgba(0,192,135,0.15)", color: "#00C087" }}
            >
              6/7 Steps Complete
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {PIPELINE_STEPS.map((step, idx) => (
              <div
                key={step.id}
                className="rounded-lg p-3 relative"
                style={{
                  background:
                    step.status === "running"
                      ? "rgba(242,201,76,0.06)"
                      : "#111E33",
                  border: `1px solid ${step.status === "running" ? "#F2C94C" : step.status === "done" ? "#00C087" : "#1E2C44"}`,
                }}
                data-ocid={`global-markets.item.${idx + 1}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{
                      background:
                        step.status === "done"
                          ? "rgba(0,192,135,0.15)"
                          : step.status === "running"
                            ? "rgba(242,201,76,0.15)"
                            : "rgba(154,168,193,0.1)",
                      color:
                        step.status === "done"
                          ? "#00C087"
                          : step.status === "running"
                            ? "#F2C94C"
                            : "#9AA8C1",
                    }}
                  >
                    {step.status === "done" ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      step.icon
                    )}
                  </div>
                  <span
                    className="text-[9px] font-bold"
                    style={{
                      color:
                        step.status === "done"
                          ? "#00C087"
                          : step.status === "running"
                            ? "#F2C94C"
                            : "#9AA8C1",
                    }}
                  >
                    {step.id}
                  </span>
                </div>
                <div
                  className="text-xs font-bold mb-0.5"
                  style={{ color: "#EAF0FF" }}
                >
                  {step.name}
                </div>
                <div
                  className="text-[10px] leading-tight mb-2"
                  style={{ color: "#9AA8C1" }}
                >
                  {step.desc}
                </div>
                <PipelineStatusBadge status={step.status} />
                {step.status === "running" && (
                  <Progress
                    value={pipelineProgress}
                    className="mt-2 h-1"
                    style={{ background: "#1E2C44" }}
                  />
                )}
                <div
                  className="mt-1 text-[10px] font-mono"
                  style={{ color: "#F2C94C" }}
                >
                  {step.records.toLocaleString()} records
                </div>
                {step.duration && (
                  <div className="text-[9px]" style={{ color: "#9AA8C1" }}>
                    {step.duration}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── Intelligent Search ── */}
        <div
          className="rounded-xl p-5"
          style={{ background: "#0C1A30", border: "1px solid #1E2C44" }}
          data-ocid="global-markets.panel"
        >
          <div className="flex items-center gap-2 mb-4">
            <Search className="w-5 h-5" style={{ color: "#F2C94C" }} />
            <h2
              className="text-sm font-bold uppercase tracking-widest"
              style={{ color: "#EAF0FF" }}
            >
              Instrument Search & Discovery
            </h2>
          </div>

          {/* Search Bar */}
          <div className="relative mb-3">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
              style={{ color: "#9AA8C1" }}
            />
            <Input
              data-ocid="global-markets.search_input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by symbol, company name, ISIN or sector..."
              className="pl-9 pr-10 text-sm h-10"
              style={{
                background: "#111E33",
                border: "1px solid #24344F",
                color: "#EAF0FF",
              }}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity"
              data-ocid="global-markets.button"
              title="Voice Search"
            >
              <Mic className="w-4 h-4" style={{ color: "#9AA8C1" }} />
            </button>
          </div>

          {/* Trending + Recent */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span
              className="text-[10px] uppercase tracking-widest"
              style={{ color: "#9AA8C1" }}
            >
              Trending:
            </span>
            {["NVDA", "BTC", "GOLD", "SPY"].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setSearchQuery(t)}
                data-ocid="global-markets.button"
                className="text-[10px] font-bold px-2 py-0.5 rounded-full hover:opacity-80 transition-opacity"
                style={{
                  background: "rgba(242,201,76,0.15)",
                  color: "#F2C94C",
                  border: "1px solid rgba(242,201,76,0.3)",
                }}
              >
                🔥 {t}
              </button>
            ))}
            <span
              className="text-[10px] ml-2 uppercase tracking-widest"
              style={{ color: "#9AA8C1" }}
            >
              Recent:
            </span>
            {recentSearches.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setSearchQuery(r)}
                data-ocid="global-markets.button"
                className="text-[10px] px-2 py-0.5 rounded-full hover:opacity-80 transition-opacity"
                style={{
                  background: "#111E33",
                  color: "#9AA8C1",
                  border: "1px solid #1E2C44",
                }}
              >
                {r}
              </button>
            ))}
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2 mb-4">
            {filters.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setActiveFilter(f)}
                data-ocid="global-markets.tab"
                className="text-xs px-3 py-1 rounded-full font-semibold transition-all"
                style={{
                  background: activeFilter === f ? "#F2C94C" : "#111E33",
                  color: activeFilter === f ? "#0B1424" : "#9AA8C1",
                  border: `1px solid ${activeFilter === f ? "#F2C94C" : "#24344F"}`,
                }}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Results Table */}
          <div
            className="overflow-x-auto rounded-lg"
            style={{ border: "1px solid #1E2C44" }}
          >
            <table className="w-full text-xs" data-ocid="global-markets.table">
              <thead>
                <tr
                  style={{
                    background: "#111E33",
                    borderBottom: "1px solid #1E2C44",
                  }}
                >
                  {[
                    "Symbol",
                    "Name",
                    "Exchange",
                    "Type",
                    "Category",
                    "Price",
                    "Change%",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-3 py-2.5 text-left font-semibold uppercase tracking-wider"
                      style={{ color: "#9AA8C1" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredResults.map((r, i) => (
                  <tr
                    key={r.symbol}
                    data-ocid={`global-markets.row.${i + 1}`}
                    className="hover:bg-white/[0.02] transition-colors"
                    style={{ borderBottom: "1px solid #1E2C44" }}
                  >
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="font-bold"
                          style={{ color: "#F2C94C" }}
                        >
                          {r.symbol}
                        </span>
                        {r.trending && (
                          <span
                            title="Trending"
                            style={{ color: "#F2C94C", fontSize: 10 }}
                          >
                            🔥
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-2.5" style={{ color: "#EAF0FF" }}>
                      {r.name}
                    </td>
                    <td className="px-3 py-2.5">
                      <span
                        className="px-1.5 py-0.5 rounded text-[10px] font-semibold"
                        style={{
                          background: "#111E33",
                          color: "#9AA8C1",
                          border: "1px solid #24344F",
                        }}
                      >
                        {r.exchange}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <Badge
                        variant="outline"
                        className="text-[10px] border-[#24344F] text-[#9AA8C1]"
                      >
                        {r.type}
                      </Badge>
                    </td>
                    <td
                      className="px-3 py-2.5 text-[11px]"
                      style={{ color: "#9AA8C1" }}
                    >
                      {r.category}
                    </td>
                    <td
                      className="px-3 py-2.5 font-mono font-bold"
                      style={{ color: "#EAF0FF" }}
                    >
                      {r.price}
                    </td>
                    <td
                      className="px-3 py-2.5 font-mono font-bold"
                      style={{ color: r.change >= 0 ? "#00C087" : "#FF5A5F" }}
                    >
                      {r.change >= 0 ? "+" : ""}
                      {r.change.toFixed(2)}%
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          data-ocid="global-markets.button"
                          className="text-[10px] px-2 py-0.5 rounded hover:opacity-80 transition-opacity"
                          style={{
                            background: "rgba(0,192,135,0.15)",
                            color: "#00C087",
                            border: "1px solid rgba(0,192,135,0.3)",
                          }}
                        >
                          + Watch
                        </button>
                        <button
                          type="button"
                          data-ocid="global-markets.button"
                          className="text-[10px] px-2 py-0.5 rounded hover:opacity-80 transition-opacity"
                          style={{
                            background: "rgba(242,201,76,0.12)",
                            color: "#F2C94C",
                            border: "1px solid rgba(242,201,76,0.25)",
                          }}
                        >
                          📈 Chart
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Market Coverage Tabs ── */}
        <Tabs defaultValue="us-stocks">
          <TabsList
            className="flex flex-wrap gap-1 h-auto p-1 rounded-xl mb-4"
            style={{ background: "#0C1A30", border: "1px solid #1E2C44" }}
          >
            {[
              {
                value: "us-stocks",
                label: "US Stocks & ETFs",
                icon: <DollarSign className="w-3.5 h-3.5" />,
              },
              {
                value: "forex",
                label: "Global Forex",
                icon: <Globe className="w-3.5 h-3.5" />,
              },
              {
                value: "crypto",
                label: "Cryptocurrency",
                icon: <Bitcoin className="w-3.5 h-3.5" />,
              },
              {
                value: "commodities",
                label: "Commodities",
                icon: <BarChart2 className="w-3.5 h-3.5" />,
              },
              {
                value: "indices",
                label: "Global Indices",
                icon: <TrendingUp className="w-3.5 h-3.5" />,
              },
            ].map((t) => (
              <TabsTrigger
                key={t.value}
                value={t.value}
                data-ocid="global-markets.tab"
                className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide px-3 py-1.5 rounded-lg data-[state=active]:text-[#0B1424]"
                style={{ color: "#9AA8C1" }}
              >
                {t.icon}
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* US Stocks & ETFs */}
          <TabsContent value="us-stocks" data-ocid="global-markets.panel">
            <div className="space-y-4">
              {/* Stats Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  {
                    label: "NYSE Stocks",
                    value: "2,847",
                    src: "Alpha Vantage",
                  },
                  { label: "NASDAQ Stocks", value: "3,524", src: "Polygon.io" },
                  { label: "AMEX Stocks", value: "312", src: "SEC EDGAR" },
                  { label: "US ETFs", value: "3,247", src: "ETF Database" },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="rounded-xl p-4"
                    style={{
                      background: "#0C1A30",
                      border: "1px solid #1E2C44",
                    }}
                  >
                    <div
                      className="text-xl font-bold"
                      style={{ color: "#F2C94C" }}
                    >
                      {s.value}
                    </div>
                    <div
                      className="text-xs font-semibold"
                      style={{ color: "#EAF0FF" }}
                    >
                      {s.label}
                    </div>
                    <div
                      className="text-[10px] mt-1"
                      style={{ color: "#9AA8C1" }}
                    >
                      Source: {s.src}
                    </div>
                  </div>
                ))}
              </div>

              {/* Index Constituents */}
              <div
                className="rounded-xl p-4"
                style={{ background: "#0C1A30", border: "1px solid #1E2C44" }}
              >
                <div
                  className="text-xs font-bold uppercase tracking-wider mb-3"
                  style={{ color: "#9AA8C1" }}
                >
                  Index Constituents
                </div>
                <div className="flex flex-wrap gap-3">
                  {[
                    { index: "S&P 500", count: 500, color: "#00C087" },
                    { index: "NASDAQ 100", count: 100, color: "#3498DB" },
                    { index: "DOW 30", count: 30, color: "#F2C94C" },
                    { index: "Russell 2000", count: 2000, color: "#9B59B6" },
                  ].map((idx) => (
                    <div
                      key={idx.index}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg"
                      style={{
                        background: "#111E33",
                        border: "1px solid #24344F",
                      }}
                    >
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ background: idx.color }}
                      />
                      <span
                        className="text-xs font-semibold"
                        style={{ color: "#EAF0FF" }}
                      >
                        {idx.index}
                      </span>
                      <span
                        className="text-xs font-bold"
                        style={{ color: idx.color }}
                      >
                        {idx.count.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stocks Table */}
              <div
                className="rounded-xl overflow-hidden"
                style={{ border: "1px solid #1E2C44" }}
              >
                <div
                  className="px-4 py-2.5"
                  style={{
                    background: "#111E33",
                    borderBottom: "1px solid #1E2C44",
                  }}
                >
                  <span
                    className="text-xs font-bold uppercase tracking-wider"
                    style={{ color: "#EAF0FF" }}
                  >
                    Sample Stocks — S&P 500 Top Holdings
                  </span>
                </div>
                <table className="w-full text-xs">
                  <thead>
                    <tr
                      style={{
                        background: "#0C1A30",
                        borderBottom: "1px solid #1E2C44",
                      }}
                    >
                      {[
                        "Symbol",
                        "Company",
                        "Exchange",
                        "Market Cap",
                        "Sector",
                        "S&P 500",
                      ].map((h) => (
                        <th
                          key={h}
                          className="px-3 py-2 text-left font-semibold uppercase tracking-wider"
                          style={{ color: "#9AA8C1" }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {US_STOCK_SAMPLES.map((s, i) => (
                      <tr
                        key={s.symbol}
                        data-ocid={`global-markets.item.${i + 1}`}
                        className="hover:bg-white/[0.02]"
                        style={{ borderBottom: "1px solid #1E2C44" }}
                      >
                        <td
                          className="px-3 py-2 font-bold"
                          style={{ color: "#F2C94C" }}
                        >
                          {s.symbol}
                        </td>
                        <td className="px-3 py-2" style={{ color: "#EAF0FF" }}>
                          {s.name}
                        </td>
                        <td className="px-3 py-2">
                          <span
                            className="text-[10px] px-1.5 py-0.5 rounded"
                            style={{
                              background: "#111E33",
                              color: "#9AA8C1",
                              border: "1px solid #24344F",
                            }}
                          >
                            {s.exchange}
                          </span>
                        </td>
                        <td className="px-3 py-2">
                          <Badge
                            variant="outline"
                            className="text-[10px] border-[#24344F]"
                            style={{ color: "#F2C94C" }}
                          >
                            {s.cap} Cap
                          </Badge>
                        </td>
                        <td
                          className="px-3 py-2 text-[11px]"
                          style={{ color: "#9AA8C1" }}
                        >
                          {s.sector}
                        </td>
                        <td className="px-3 py-2">
                          {s.sp500 && (
                            <CheckCircle
                              className="w-3.5 h-3.5"
                              style={{ color: "#00C087" }}
                            />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* ETFs */}
              <div
                className="rounded-xl overflow-hidden"
                style={{ border: "1px solid #1E2C44" }}
              >
                <div
                  className="px-4 py-2.5"
                  style={{
                    background: "#111E33",
                    borderBottom: "1px solid #1E2C44",
                  }}
                >
                  <span
                    className="text-xs font-bold uppercase tracking-wider"
                    style={{ color: "#EAF0FF" }}
                  >
                    Top US ETFs — 3,247 Total
                  </span>
                </div>
                <table className="w-full text-xs">
                  <thead>
                    <tr
                      style={{
                        background: "#0C1A30",
                        borderBottom: "1px solid #1E2C44",
                      }}
                    >
                      {["Symbol", "Name", "Type", "AUM", "Expense Ratio"].map(
                        (h) => (
                          <th
                            key={h}
                            className="px-3 py-2 text-left font-semibold uppercase tracking-wider"
                            style={{ color: "#9AA8C1" }}
                          >
                            {h}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {US_ETF_SAMPLES.map((e, i) => (
                      <tr
                        key={e.symbol}
                        data-ocid={`global-markets.item.${i + 1}`}
                        className="hover:bg-white/[0.02]"
                        style={{ borderBottom: "1px solid #1E2C44" }}
                      >
                        <td
                          className="px-3 py-2 font-bold"
                          style={{ color: "#F2C94C" }}
                        >
                          {e.symbol}
                        </td>
                        <td className="px-3 py-2" style={{ color: "#EAF0FF" }}>
                          {e.name}
                        </td>
                        <td className="px-3 py-2">
                          <Badge
                            variant="outline"
                            className="text-[10px] border-[#24344F] text-[#9AA8C1]"
                          >
                            {e.type}
                          </Badge>
                        </td>
                        <td
                          className="px-3 py-2 font-mono font-bold"
                          style={{ color: "#00C087" }}
                        >
                          {e.aum}
                        </td>
                        <td
                          className="px-3 py-2 font-mono text-[11px]"
                          style={{ color: "#9AA8C1" }}
                        >
                          {e.expense}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="text-xs" style={{ color: "#9AA8C1" }}>
                <span style={{ color: "#00C087" }}>✅</span> Last sync: Today
                05:30 AM &nbsp;|&nbsp;
                <span>⏰</span> Next: Tomorrow 05:30 AM &nbsp;|&nbsp; Sources:
                SEC EDGAR · Polygon.io · Alpha Vantage
              </div>
            </div>
          </TabsContent>

          {/* Forex */}
          <TabsContent value="forex" data-ocid="global-markets.panel">
            <div className="space-y-4">
              {/* Session Clock */}
              <div
                className="rounded-xl p-4"
                style={{ background: "#0C1A30", border: "1px solid #1E2C44" }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div
                    className="text-xs font-bold uppercase tracking-wider"
                    style={{ color: "#EAF0FF" }}
                  >
                    🌍 Live Forex Session Clock
                  </div>
                  <div className="text-xs" style={{ color: "#9AA8C1" }}>
                    Current UTC: 14:00 — London+NY Overlap
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {sessions.map((s) => {
                    const open = isSessionOpen(s.start, s.end);
                    return (
                      <div
                        key={s.name}
                        className="rounded-lg p-3"
                        style={{
                          background: open ? `${s.color}18` : "#111E33",
                          border: `1px solid ${open ? s.color : "#1E2C44"}`,
                        }}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span
                            className="text-xs font-bold"
                            style={{ color: open ? s.color : "#9AA8C1" }}
                          >
                            {s.name}
                          </span>
                          <span
                            className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                            style={{
                              background: open
                                ? `${s.color}25`
                                : "rgba(154,168,193,0.1)",
                              color: open ? s.color : "#9AA8C1",
                            }}
                          >
                            {open ? "OPEN" : "CLOSED"}
                          </span>
                        </div>
                        <div
                          className="text-[11px] font-mono"
                          style={{ color: "#9AA8C1" }}
                        >
                          {s.start.toString().padStart(2, "0")}:00 –{" "}
                          {s.end.toString().padStart(2, "0")}:00 UTC
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div
                  className="mt-3 flex items-center gap-2 px-3 py-2 rounded-lg"
                  style={{
                    background: "rgba(242,201,76,0.1)",
                    border: "1px solid rgba(242,201,76,0.3)",
                  }}
                >
                  <AlertTriangle
                    className="w-4 h-4"
                    style={{ color: "#F2C94C" }}
                  />
                  <span className="text-xs" style={{ color: "#F2C94C" }}>
                    <strong>MOST VOLATILE:</strong> London + New York Overlap —
                    13:00–17:00 UTC | Tokyo + London: 08:00–09:00 UTC
                  </span>
                </div>
              </div>

              {/* Majors */}
              <div
                className="rounded-xl overflow-hidden"
                style={{ border: "1px solid #1E2C44" }}
              >
                <div
                  className="px-4 py-2.5 flex items-center justify-between"
                  style={{
                    background: "#111E33",
                    borderBottom: "1px solid #1E2C44",
                  }}
                >
                  <span
                    className="text-xs font-bold uppercase tracking-wider"
                    style={{ color: "#EAF0FF" }}
                  >
                    Major Pairs — 7 pairs
                  </span>
                  <Badge
                    variant="outline"
                    className="text-[10px] border-[#24344F] text-[#F2C94C]"
                  >
                    Most Liquid
                  </Badge>
                </div>
                <table className="w-full text-xs">
                  <thead>
                    <tr
                      style={{
                        background: "#0C1A30",
                        borderBottom: "1px solid #1E2C44",
                      }}
                    >
                      {[
                        "Pair",
                        "Base",
                        "Quote",
                        "Pip Size",
                        "Std Lot",
                        "Typical Spread",
                        "Session",
                      ].map((h) => (
                        <th
                          key={h}
                          className="px-3 py-2 text-left font-semibold uppercase tracking-wider"
                          style={{ color: "#9AA8C1" }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {FOREX_MAJORS.map((f, i) => (
                      <tr
                        key={f.pair}
                        data-ocid={`global-markets.item.${i + 1}`}
                        className="hover:bg-white/[0.02]"
                        style={{ borderBottom: "1px solid #1E2C44" }}
                      >
                        <td
                          className="px-3 py-2 font-bold"
                          style={{ color: "#F2C94C" }}
                        >
                          {f.pair}
                        </td>
                        <td className="px-3 py-2" style={{ color: "#EAF0FF" }}>
                          {f.base}
                        </td>
                        <td className="px-3 py-2" style={{ color: "#EAF0FF" }}>
                          {f.quote}
                        </td>
                        <td
                          className="px-3 py-2 font-mono"
                          style={{ color: "#9AA8C1" }}
                        >
                          {f.pip}
                        </td>
                        <td
                          className="px-3 py-2 font-mono"
                          style={{ color: "#9AA8C1" }}
                        >
                          100,000
                        </td>
                        <td
                          className="px-3 py-2 font-mono"
                          style={{ color: "#00C087" }}
                        >
                          {f.spread} pip
                        </td>
                        <td
                          className="px-3 py-2 text-[11px]"
                          style={{ color: "#9AA8C1" }}
                        >
                          {f.session}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Minors + Exotics */}
              <div className="grid md:grid-cols-2 gap-4">
                <div
                  className="rounded-xl p-4"
                  style={{ background: "#0C1A30", border: "1px solid #1E2C44" }}
                >
                  <div
                    className="text-xs font-bold uppercase tracking-wider mb-3"
                    style={{ color: "#EAF0FF" }}
                  >
                    Minor Pairs — {FOREX_MINORS.length}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {FOREX_MINORS.map((p) => (
                      <span
                        key={p}
                        className="text-[10px] px-2 py-0.5 rounded font-mono"
                        style={{
                          background: "#111E33",
                          color: "#9AA8C1",
                          border: "1px solid #24344F",
                        }}
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
                <div
                  className="rounded-xl p-4"
                  style={{ background: "#0C1A30", border: "1px solid #1E2C44" }}
                >
                  <div
                    className="text-xs font-bold uppercase tracking-wider mb-3"
                    style={{ color: "#EAF0FF" }}
                  >
                    Exotic Pairs (EM) — 50+
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {FOREX_EXOTICS.map((e) => (
                      <div
                        key={e.pair}
                        className="flex items-center justify-between"
                      >
                        <span
                          className="text-[10px] font-bold font-mono"
                          style={{ color: "#F2C94C" }}
                        >
                          {e.pair}
                        </span>
                        <span
                          className="text-[9px]"
                          style={{ color: "#9AA8C1" }}
                        >
                          {e.region}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="text-xs" style={{ color: "#9AA8C1" }}>
                Sources: OANDA Instruments API · Alpha Vantage Forex ·
                ExchangeRate-API | Total pairs: 77 | Sync: Continuous (1 hr)
              </div>
            </div>
          </TabsContent>

          {/* Crypto */}
          <TabsContent value="crypto" data-ocid="global-markets.panel">
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  {
                    label: "Total Coins",
                    value: "13,241",
                    src: "CoinGecko",
                    color: "#F2C94C",
                  },
                  {
                    label: "Binance Pairs",
                    value: "2,847",
                    src: "Binance API",
                    color: "#00C087",
                  },
                  {
                    label: "Perp Futures",
                    value: "487",
                    src: "Binance Futures",
                    color: "#9B59B6",
                  },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="rounded-xl p-4"
                    style={{
                      background: "#0C1A30",
                      border: "1px solid #1E2C44",
                    }}
                  >
                    <div
                      className="text-2xl font-bold"
                      style={{ color: s.color }}
                    >
                      {s.value}
                    </div>
                    <div
                      className="text-xs font-semibold"
                      style={{ color: "#EAF0FF" }}
                    >
                      {s.label}
                    </div>
                    <div
                      className="text-[10px] mt-1"
                      style={{ color: "#9AA8C1" }}
                    >
                      Source: {s.src}
                    </div>
                  </div>
                ))}
              </div>

              {/* Categories Grid */}
              <div
                className="rounded-xl p-4"
                style={{ background: "#0C1A30", border: "1px solid #1E2C44" }}
              >
                <div
                  className="text-xs font-bold uppercase tracking-wider mb-3"
                  style={{ color: "#EAF0FF" }}
                >
                  Token Categories
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {CRYPTO_CATEGORIES.map((cat) => (
                    <div
                      key={cat.name}
                      className="rounded-lg p-3"
                      style={{
                        background: "#111E33",
                        border: `1px solid ${cat.color}40`,
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className="text-xs font-bold"
                          style={{ color: cat.color }}
                        >
                          {cat.name}
                        </span>
                        <span
                          className="text-xs font-bold"
                          style={{ color: "#EAF0FF" }}
                        >
                          {cat.count}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {cat.coins.slice(0, 6).map((c) => (
                          <span
                            key={c}
                            className="text-[9px] px-1 py-0.5 rounded font-mono"
                            style={{
                              background: `${cat.color}18`,
                              color: cat.color,
                            }}
                          >
                            {c}
                          </span>
                        ))}
                        {cat.coins.length > 6 && (
                          <span
                            className="text-[9px]"
                            style={{ color: "#9AA8C1" }}
                          >
                            +{cat.coins.length - 6}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Crypto Table */}
              <div
                className="rounded-xl overflow-hidden"
                style={{ border: "1px solid #1E2C44" }}
              >
                <div
                  className="px-4 py-2.5"
                  style={{
                    background: "#111E33",
                    borderBottom: "1px solid #1E2C44",
                  }}
                >
                  <span
                    className="text-xs font-bold uppercase tracking-wider"
                    style={{ color: "#EAF0FF" }}
                  >
                    Top Coins by Market Cap
                  </span>
                </div>
                <table className="w-full text-xs">
                  <thead>
                    <tr
                      style={{
                        background: "#0C1A30",
                        borderBottom: "1px solid #1E2C44",
                      }}
                    >
                      {[
                        "Rank",
                        "Symbol",
                        "Name",
                        "Category",
                        "Price",
                        "24h Change",
                        "Binance Pair",
                      ].map((h) => (
                        <th
                          key={h}
                          className="px-3 py-2 text-left font-semibold uppercase tracking-wider"
                          style={{ color: "#9AA8C1" }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {CRYPTO_SAMPLES.map((c, i) => (
                      <tr
                        key={c.symbol}
                        data-ocid={`global-markets.item.${i + 1}`}
                        className="hover:bg-white/[0.02]"
                        style={{ borderBottom: "1px solid #1E2C44" }}
                      >
                        <td
                          className="px-3 py-2 font-mono font-bold"
                          style={{ color: "#9AA8C1" }}
                        >
                          #{c.rank}
                        </td>
                        <td
                          className="px-3 py-2 font-bold"
                          style={{ color: "#F2C94C" }}
                        >
                          {c.symbol}
                        </td>
                        <td className="px-3 py-2" style={{ color: "#EAF0FF" }}>
                          {c.name}
                        </td>
                        <td className="px-3 py-2">
                          <Badge
                            variant="outline"
                            className="text-[10px] border-[#24344F] text-[#9AA8C1]"
                          >
                            {c.cat}
                          </Badge>
                        </td>
                        <td
                          className="px-3 py-2 font-mono font-bold"
                          style={{ color: "#EAF0FF" }}
                        >
                          {c.price}
                        </td>
                        <td
                          className="px-3 py-2 font-mono font-bold"
                          style={{
                            color: c.change >= 0 ? "#00C087" : "#FF5A5F",
                          }}
                        >
                          {c.change >= 0 ? "+" : ""}
                          {c.change.toFixed(2)}%
                        </td>
                        <td
                          className="px-3 py-2 font-mono text-[10px]"
                          style={{ color: "#9AA8C1" }}
                        >
                          {c.binancePair}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="text-xs" style={{ color: "#9AA8C1" }}>
                Sources: CoinGecko API · Binance Exchange Info · CoinMarketCap |
                Sync: Every 15 min
              </div>
            </div>
          </TabsContent>

          {/* Commodities */}
          <TabsContent value="commodities" data-ocid="global-markets.panel">
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  {
                    label: "Precious Metals",
                    value: "4",
                    detail: "Spot + Futures",
                    color: "#F2C94C",
                  },
                  {
                    label: "Energy",
                    value: "6",
                    detail: "NYMEX + ICE",
                    color: "#E74C3C",
                  },
                  {
                    label: "Agriculture",
                    value: "9",
                    detail: "CBOT + ICE + CME",
                    color: "#2ECC71",
                  },
                  {
                    label: "Livestock",
                    value: "3",
                    detail: "CME Group",
                    color: "#E67E22",
                  },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="rounded-xl p-4"
                    style={{
                      background: "#0C1A30",
                      border: "1px solid #1E2C44",
                    }}
                  >
                    <div
                      className="text-2xl font-bold"
                      style={{ color: s.color }}
                    >
                      {s.value}
                    </div>
                    <div
                      className="text-xs font-semibold"
                      style={{ color: "#EAF0FF" }}
                    >
                      {s.label}
                    </div>
                    <div
                      className="text-[10px] mt-1"
                      style={{ color: "#9AA8C1" }}
                    >
                      {s.detail}
                    </div>
                  </div>
                ))}
              </div>

              <div
                className="rounded-xl overflow-hidden"
                style={{ border: "1px solid #1E2C44" }}
              >
                <div
                  className="px-4 py-2.5"
                  style={{
                    background: "#111E33",
                    borderBottom: "1px solid #1E2C44",
                  }}
                >
                  <span
                    className="text-xs font-bold uppercase tracking-wider"
                    style={{ color: "#EAF0FF" }}
                  >
                    All Commodities — {COMMODITIES.length} Instruments
                  </span>
                </div>
                <table className="w-full text-xs">
                  <thead>
                    <tr
                      style={{
                        background: "#0C1A30",
                        borderBottom: "1px solid #1E2C44",
                      }}
                    >
                      {[
                        "Symbol",
                        "Name",
                        "Exchange",
                        "Contract Size",
                        "Category",
                      ].map((h) => (
                        <th
                          key={h}
                          className="px-3 py-2 text-left font-semibold uppercase tracking-wider"
                          style={{ color: "#9AA8C1" }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {COMMODITIES.map((c, i) => (
                      <tr
                        key={c.symbol}
                        data-ocid={`global-markets.item.${i + 1}`}
                        className="hover:bg-white/[0.02]"
                        style={{
                          borderBottom: "1px solid #1E2C44",
                          background: i % 2 === 0 ? "transparent" : "#111E3318",
                        }}
                      >
                        <td
                          className="px-3 py-2 font-bold"
                          style={{ color: "#F2C94C" }}
                        >
                          {c.symbol}
                        </td>
                        <td className="px-3 py-2" style={{ color: "#EAF0FF" }}>
                          {c.name}
                        </td>
                        <td className="px-3 py-2">
                          <span
                            className="text-[10px] px-1.5 py-0.5 rounded"
                            style={{
                              background: "#111E33",
                              color: "#9AA8C1",
                              border: "1px solid #24344F",
                            }}
                          >
                            {c.exchange}
                          </span>
                        </td>
                        <td
                          className="px-3 py-2 font-mono text-[11px]"
                          style={{ color: "#9AA8C1" }}
                        >
                          {c.contract}
                        </td>
                        <td className="px-3 py-2">
                          <Badge
                            variant="outline"
                            className="text-[10px] border-[#24344F] text-[#9AA8C1]"
                          >
                            {c.cat}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="text-xs" style={{ color: "#9AA8C1" }}>
                Sources: Quandl/NASDAQ Data Link · Alpha Vantage Commodities |
                Sync: Daily 7:00 AM EST
              </div>
            </div>
          </TabsContent>

          {/* Global Indices */}
          <TabsContent value="indices" data-ocid="global-markets.panel">
            <div className="space-y-4">
              {Object.entries(indicesByRegion).map(([region, indices]) => (
                <div
                  key={region}
                  className="rounded-xl overflow-hidden"
                  style={{ border: "1px solid #1E2C44" }}
                >
                  <div
                    className="px-4 py-2.5"
                    style={{
                      background: "#111E33",
                      borderBottom: "1px solid #1E2C44",
                    }}
                  >
                    <span
                      className="text-xs font-bold uppercase tracking-wider"
                      style={{ color: "#EAF0FF" }}
                    >
                      {region} — {indices.length} Indices
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0">
                    {indices.map((idx, i) => (
                      <div
                        key={idx.symbol}
                        data-ocid={`global-markets.item.${i + 1}`}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-white/[0.02] transition-colors"
                        style={{ borderBottom: "1px solid #1E2C44" }}
                      >
                        <span className="text-xl">{idx.country}</span>
                        <div className="flex-1 min-w-0">
                          <div
                            className="font-bold text-xs"
                            style={{ color: "#F2C94C" }}
                          >
                            {idx.symbol}
                          </div>
                          <div
                            className="text-[11px] truncate"
                            style={{ color: "#EAF0FF" }}
                          >
                            {idx.name}
                          </div>
                          <div
                            className="text-[10px]"
                            style={{ color: "#9AA8C1" }}
                          >
                            {idx.exchange}
                          </div>
                        </div>
                        <span
                          className="text-[9px] px-1.5 py-0.5 rounded font-bold"
                          style={{
                            background: "rgba(0,192,135,0.12)",
                            color: "#00C087",
                          }}
                        >
                          ✅ SYNCED
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div className="text-xs" style={{ color: "#9AA8C1" }}>
                Sources: Yahoo Finance API · Stooq | Total: 30 indices across 4
                regions | Sync: Daily 6:00 AM EST
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* ── Sync Schedule ── */}
        <div
          className="rounded-xl overflow-hidden"
          style={{ border: "1px solid #1E2C44" }}
          data-ocid="global-markets.panel"
        >
          <div
            className="px-5 py-3 flex items-center gap-2"
            style={{ background: "#111E33", borderBottom: "1px solid #1E2C44" }}
          >
            <Clock className="w-4 h-4" style={{ color: "#F2C94C" }} />
            <h2
              className="text-sm font-bold uppercase tracking-widest"
              style={{ color: "#EAF0FF" }}
            >
              Sync Schedule
            </h2>
          </div>
          <table className="w-full text-xs">
            <thead>
              <tr
                style={{
                  background: "#0C1A30",
                  borderBottom: "1px solid #1E2C44",
                }}
              >
                {[
                  "Market",
                  "Schedule",
                  "Next Sync",
                  "Last Count",
                  "Status",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-2.5 text-left font-semibold uppercase tracking-wider"
                    style={{ color: "#9AA8C1" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SYNC_SCHEDULE.map((row, i) => (
                <tr
                  key={row.market}
                  data-ocid={`global-markets.row.${i + 1}`}
                  className="hover:bg-white/[0.02]"
                  style={{
                    borderBottom: "1px solid #1E2C44",
                    background: i % 2 === 0 ? "transparent" : "#111E3310",
                  }}
                >
                  <td
                    className="px-4 py-2.5 font-semibold"
                    style={{ color: "#EAF0FF" }}
                  >
                    {row.market}
                  </td>
                  <td
                    className="px-4 py-2.5 font-mono text-[11px]"
                    style={{ color: "#9AA8C1" }}
                  >
                    {row.schedule}
                  </td>
                  <td
                    className="px-4 py-2.5 font-mono text-[11px]"
                    style={{ color: "#EAF0FF" }}
                  >
                    {row.nextSync}
                  </td>
                  <td
                    className="px-4 py-2.5 font-mono font-bold"
                    style={{ color: "#F2C94C" }}
                  >
                    {row.lastCount.toLocaleString()}
                  </td>
                  <td className="px-4 py-2.5">
                    <SyncBadge status={row.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Sync Log ── */}
        <div
          className="rounded-xl overflow-hidden"
          style={{ border: "1px solid #1E2C44" }}
          data-ocid="global-markets.panel"
        >
          <div
            className="px-5 py-3 flex items-center gap-2"
            style={{ background: "#111E33", borderBottom: "1px solid #1E2C44" }}
          >
            <Activity className="w-4 h-4" style={{ color: "#F2C94C" }} />
            <h2
              className="text-sm font-bold uppercase tracking-widest"
              style={{ color: "#EAF0FF" }}
            >
              Recent Sync Log
            </h2>
            <span
              className="ml-auto text-[10px] px-2 py-0.5 rounded"
              style={{ background: "rgba(0,192,135,0.12)", color: "#00C087" }}
            >
              10 entries
            </span>
          </div>
          <table className="w-full text-xs">
            <thead>
              <tr
                style={{
                  background: "#0C1A30",
                  borderBottom: "1px solid #1E2C44",
                }}
              >
                {[
                  "#",
                  "Source",
                  "Time",
                  "Fetched",
                  "Added",
                  "Updated",
                  "Removed",
                  "Status",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-2.5 text-left font-semibold uppercase tracking-wider"
                    style={{ color: "#9AA8C1" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SYNC_LOG.map((row, i) => (
                <tr
                  key={row.id}
                  data-ocid={`global-markets.row.${i + 1}`}
                  className="hover:bg-white/[0.02]"
                  style={{
                    borderBottom: "1px solid #1E2C44",
                    background: i % 2 === 0 ? "transparent" : "#111E3310",
                  }}
                >
                  <td
                    className="px-4 py-2.5 font-mono"
                    style={{ color: "#9AA8C1" }}
                  >
                    {row.id}
                  </td>
                  <td
                    className="px-4 py-2.5 font-semibold"
                    style={{ color: "#EAF0FF" }}
                  >
                    {row.exchange}
                  </td>
                  <td
                    className="px-4 py-2.5 font-mono"
                    style={{ color: "#9AA8C1" }}
                  >
                    {row.time}
                  </td>
                  <td
                    className="px-4 py-2.5 font-mono font-bold"
                    style={{ color: "#EAF0FF" }}
                  >
                    {row.fetched.toLocaleString()}
                  </td>
                  <td
                    className="px-4 py-2.5 font-mono font-bold"
                    style={{ color: row.added > 0 ? "#00C087" : "#9AA8C1" }}
                  >
                    {row.added > 0 ? `+${row.added}` : "—"}
                  </td>
                  <td
                    className="px-4 py-2.5 font-mono font-bold"
                    style={{ color: row.updated > 0 ? "#F2C94C" : "#9AA8C1" }}
                  >
                    {row.updated > 0 ? `~${row.updated}` : "—"}
                  </td>
                  <td
                    className="px-4 py-2.5 font-mono font-bold"
                    style={{ color: row.removed > 0 ? "#FF5A5F" : "#9AA8C1" }}
                  >
                    {row.removed > 0 ? `-${row.removed}` : "—"}
                  </td>
                  <td className="px-4 py-2.5">
                    <StatusBadge status={row.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Stats footer row ── */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            {
              label: "US Stocks",
              value: "14,102",
              icon: <DollarSign className="w-4 h-4" />,
            },
            {
              label: "US ETFs/Options",
              value: "249,067",
              icon: <BarChart2 className="w-4 h-4" />,
            },
            {
              label: "Forex Pairs",
              value: "77",
              icon: <Globe className="w-4 h-4" />,
            },
            {
              label: "Crypto Coins",
              value: "13,241",
              icon: <Bitcoin className="w-4 h-4" />,
            },
            {
              label: "Commodities",
              value: "48",
              icon: <TrendingDown className="w-4 h-4" />,
            },
            {
              label: "Global Indices",
              value: "30",
              icon: <TrendingUp className="w-4 h-4" />,
            },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-xl p-3 flex items-center gap-3"
              style={{ background: "#0C1A30", border: "1px solid #1E2C44" }}
            >
              <div
                className="p-1.5 rounded-lg"
                style={{
                  background: "rgba(242,201,76,0.12)",
                  color: "#F2C94C",
                }}
              >
                {s.icon}
              </div>
              <div>
                <div className="text-sm font-bold" style={{ color: "#F2C94C" }}>
                  {s.value}
                </div>
                <div className="text-[10px]" style={{ color: "#9AA8C1" }}>
                  {s.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
