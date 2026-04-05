import {
  AlertTriangle,
  ArrowRight,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  Database,
  Download,
  Filter,
  Globe,
  RefreshCw,
  Search,
  Shield,
  TrendingUp,
  X,
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
type SyncStatus = "SUCCESS" | "FAILED" | "RUNNING" | "PARTIAL";
type InstrumentType =
  | "stock"
  | "index"
  | "future"
  | "option"
  | "etf"
  | "currency"
  | "commodity"
  | "crypto";

interface PipelineStep {
  id: number;
  name: string;
  desc: string;
  status: PipelineStatus;
  records: number;
  duration?: string;
}

interface Instrument {
  symbol: string;
  exchange: string;
  type: InstrumentType;
  name: string;
  sector: string;
  lotSize: number | string;
  expiry: string;
  strike: string;
  optType: string;
  tokens: string;
  updated: string;
  active: boolean;
}

interface SyncLog {
  id: string;
  exchange: string;
  time: string;
  fetched: number;
  added: number;
  updated: number;
  removed: number;
  status: SyncStatus;
  errorLog?: string;
}

// ─── Static Data ─────────────────────────────────────────────────────────────
const INITIAL_STEPS: PipelineStep[] = [
  {
    id: 1,
    name: "FETCH",
    desc: "Pull instruments from live APIs",
    status: "done",
    records: 62480,
    duration: "1m 12s",
  },
  {
    id: 2,
    name: "PARSE",
    desc: "Normalize to standard format",
    status: "done",
    records: 62480,
    duration: "0m 48s",
  },
  {
    id: 3,
    name: "ENRICH",
    desc: "Add metadata (sector, cap, type)",
    status: "done",
    records: 58420,
    duration: "0m 55s",
  },
  {
    id: 4,
    name: "STORE",
    desc: "Save to instruments database",
    status: "done",
    records: 58420,
    duration: "0m 42s",
  },
  {
    id: 5,
    name: "INDEX",
    desc: "Build search index for fast lookup",
    status: "done",
    records: 58420,
    duration: "0m 18s",
  },
  {
    id: 6,
    name: "SYNC",
    desc: "Auto-refresh on schedule",
    status: "done",
    records: 58420,
    duration: "0m 05s",
  },
  {
    id: 7,
    name: "MAP",
    desc: "Link broker tokens + data feeds",
    status: "done",
    records: 54280,
    duration: "0m 22s",
  },
];

const INSTRUMENTS: Instrument[] = [
  // NSE Equities
  {
    symbol: "RELIANCE",
    exchange: "NSE",
    type: "stock",
    name: "Reliance Industries Ltd",
    sector: "Energy",
    lotSize: 1,
    expiry: "-",
    strike: "-",
    optType: "-",
    tokens: "Z✓ A✓ U✓",
    updated: "06:00 AM",
    active: true,
  },
  {
    symbol: "TCS",
    exchange: "NSE",
    type: "stock",
    name: "Tata Consultancy Services",
    sector: "IT",
    lotSize: 1,
    expiry: "-",
    strike: "-",
    optType: "-",
    tokens: "Z✓ A✓ U✓",
    updated: "06:00 AM",
    active: true,
  },
  {
    symbol: "HDFCBANK",
    exchange: "NSE",
    type: "stock",
    name: "HDFC Bank Limited",
    sector: "Banking",
    lotSize: 1,
    expiry: "-",
    strike: "-",
    optType: "-",
    tokens: "Z✓ A✓ U✓",
    updated: "06:00 AM",
    active: true,
  },
  {
    symbol: "INFY",
    exchange: "NSE",
    type: "stock",
    name: "Infosys Limited",
    sector: "IT",
    lotSize: 1,
    expiry: "-",
    strike: "-",
    optType: "-",
    tokens: "Z✓ A✓ U✓",
    updated: "06:00 AM",
    active: true,
  },
  {
    symbol: "ICICIBANK",
    exchange: "NSE",
    type: "stock",
    name: "ICICI Bank Limited",
    sector: "Banking",
    lotSize: 1,
    expiry: "-",
    strike: "-",
    optType: "-",
    tokens: "Z✓ A✓ U✓",
    updated: "06:00 AM",
    active: true,
  },
  {
    symbol: "WIPRO",
    exchange: "NSE",
    type: "stock",
    name: "Wipro Limited",
    sector: "IT",
    lotSize: 1,
    expiry: "-",
    strike: "-",
    optType: "-",
    tokens: "Z✓ A✓ U✓",
    updated: "06:00 AM",
    active: true,
  },
  {
    symbol: "BAJFINANCE",
    exchange: "NSE",
    type: "stock",
    name: "Bajaj Finance Limited",
    sector: "NBFC",
    lotSize: 1,
    expiry: "-",
    strike: "-",
    optType: "-",
    tokens: "Z✓ A✓ U✓",
    updated: "06:00 AM",
    active: true,
  },
  {
    symbol: "SBIN",
    exchange: "NSE",
    type: "stock",
    name: "State Bank of India",
    sector: "Banking",
    lotSize: 1,
    expiry: "-",
    strike: "-",
    optType: "-",
    tokens: "Z✓ A✓ U✓",
    updated: "06:00 AM",
    active: true,
  },
  {
    symbol: "LT",
    exchange: "NSE",
    type: "stock",
    name: "Larsen & Toubro Ltd",
    sector: "Infrastructure",
    lotSize: 1,
    expiry: "-",
    strike: "-",
    optType: "-",
    tokens: "Z✓ A✓ U✓",
    updated: "06:00 AM",
    active: true,
  },
  {
    symbol: "MARUTI",
    exchange: "NSE",
    type: "stock",
    name: "Maruti Suzuki India Ltd",
    sector: "Auto",
    lotSize: 1,
    expiry: "-",
    strike: "-",
    optType: "-",
    tokens: "Z✓ A✓ U✓",
    updated: "06:00 AM",
    active: true,
  },
  {
    symbol: "AXISBANK",
    exchange: "NSE",
    type: "stock",
    name: "Axis Bank Limited",
    sector: "Banking",
    lotSize: 1,
    expiry: "-",
    strike: "-",
    optType: "-",
    tokens: "Z✓ A✓ U✓",
    updated: "06:00 AM",
    active: true,
  },
  {
    symbol: "SUNPHARMA",
    exchange: "NSE",
    type: "stock",
    name: "Sun Pharmaceutical",
    sector: "Pharma",
    lotSize: 1,
    expiry: "-",
    strike: "-",
    optType: "-",
    tokens: "Z✓ A✓ U✓",
    updated: "06:00 AM",
    active: true,
  },
  {
    symbol: "HINDUNILVR",
    exchange: "NSE",
    type: "stock",
    name: "Hindustan Unilever Ltd",
    sector: "FMCG",
    lotSize: 1,
    expiry: "-",
    strike: "-",
    optType: "-",
    tokens: "Z✓ A✓ U✓",
    updated: "06:00 AM",
    active: true,
  },
  {
    symbol: "TATAMOTORS",
    exchange: "NSE",
    type: "stock",
    name: "Tata Motors Limited",
    sector: "Auto",
    lotSize: 1,
    expiry: "-",
    strike: "-",
    optType: "-",
    tokens: "Z✓ A✓ U✓",
    updated: "06:00 AM",
    active: true,
  },
  {
    symbol: "ONGC",
    exchange: "NSE",
    type: "stock",
    name: "Oil & Natural Gas Corp",
    sector: "Energy",
    lotSize: 1,
    expiry: "-",
    strike: "-",
    optType: "-",
    tokens: "Z✓ A✓ U✓",
    updated: "06:00 AM",
    active: true,
  },
  {
    symbol: "NTPC",
    exchange: "NSE",
    type: "stock",
    name: "NTPC Limited",
    sector: "Power",
    lotSize: 1,
    expiry: "-",
    strike: "-",
    optType: "-",
    tokens: "Z✓ A✓ U✓",
    updated: "06:00 AM",
    active: true,
  },
  {
    symbol: "POWERGRID",
    exchange: "NSE",
    type: "stock",
    name: "Power Grid Corp of India",
    sector: "Power",
    lotSize: 1,
    expiry: "-",
    strike: "-",
    optType: "-",
    tokens: "Z✓ A✓ U✓",
    updated: "06:00 AM",
    active: true,
  },
  {
    symbol: "ADANIENT",
    exchange: "NSE",
    type: "stock",
    name: "Adani Enterprises Ltd",
    sector: "Conglomerate",
    lotSize: 1,
    expiry: "-",
    strike: "-",
    optType: "-",
    tokens: "Z✓ A✓ U✓",
    updated: "06:00 AM",
    active: true,
  },
  {
    symbol: "COALINDIA",
    exchange: "NSE",
    type: "stock",
    name: "Coal India Limited",
    sector: "Mining",
    lotSize: 1,
    expiry: "-",
    strike: "-",
    optType: "-",
    tokens: "Z✓ A✓ U✓",
    updated: "06:00 AM",
    active: true,
  },
  {
    symbol: "DRREDDY",
    exchange: "NSE",
    type: "stock",
    name: "Dr. Reddy's Laboratories",
    sector: "Pharma",
    lotSize: 1,
    expiry: "-",
    strike: "-",
    optType: "-",
    tokens: "Z✓ A✓ U✓",
    updated: "06:00 AM",
    active: true,
  },
  // NSE Indices
  {
    symbol: "NIFTY 50",
    exchange: "NSE",
    type: "index",
    name: "Nifty 50 Index",
    sector: "Index",
    lotSize: 50,
    expiry: "-",
    strike: "-",
    optType: "-",
    tokens: "Z✓ A✓ U✓",
    updated: "06:00 AM",
    active: true,
  },
  {
    symbol: "BANKNIFTY",
    exchange: "NSE",
    type: "index",
    name: "Bank Nifty Index",
    sector: "Index",
    lotSize: 15,
    expiry: "-",
    strike: "-",
    optType: "-",
    tokens: "Z✓ A✓ U✓",
    updated: "06:00 AM",
    active: true,
  },
  {
    symbol: "FINNIFTY",
    exchange: "NSE",
    type: "index",
    name: "Nifty Financial Services",
    sector: "Index",
    lotSize: 40,
    expiry: "-",
    strike: "-",
    optType: "-",
    tokens: "Z✓ A✓ U✓",
    updated: "06:00 AM",
    active: true,
  },
  {
    symbol: "MIDCPNIFTY",
    exchange: "NSE",
    type: "index",
    name: "Nifty Midcap Select",
    sector: "Index",
    lotSize: 75,
    expiry: "-",
    strike: "-",
    optType: "-",
    tokens: "Z✓ A✓ U✓",
    updated: "06:00 AM",
    active: true,
  },
  {
    symbol: "INDIA VIX",
    exchange: "NSE",
    type: "index",
    name: "India Volatility Index",
    sector: "Index",
    lotSize: 1,
    expiry: "-",
    strike: "-",
    optType: "-",
    tokens: "Z✓ A✓",
    updated: "06:00 AM",
    active: true,
  },
  // NSE Futures
  {
    symbol: "RELIANCE25APRFUT",
    exchange: "NFO",
    type: "future",
    name: "Reliance Apr 2025 Fut",
    sector: "Energy",
    lotSize: 250,
    expiry: "24 Apr 25",
    strike: "-",
    optType: "-",
    tokens: "Z✓ A✓ U✓",
    updated: "06:00 AM",
    active: true,
  },
  {
    symbol: "NIFTY25APRFUT",
    exchange: "NFO",
    type: "future",
    name: "NIFTY Apr 2025 Fut",
    sector: "Index",
    lotSize: 50,
    expiry: "24 Apr 25",
    strike: "-",
    optType: "-",
    tokens: "Z✓ A✓ U✓",
    updated: "06:00 AM",
    active: true,
  },
  {
    symbol: "BANKNIFTY25APRFUT",
    exchange: "NFO",
    type: "future",
    name: "Bank Nifty Apr 2025 Fut",
    sector: "Index",
    lotSize: 15,
    expiry: "24 Apr 25",
    strike: "-",
    optType: "-",
    tokens: "Z✓ A✓ U✓",
    updated: "06:00 AM",
    active: true,
  },
  {
    symbol: "TCS25APRFUT",
    exchange: "NFO",
    type: "future",
    name: "TCS Apr 2025 Fut",
    sector: "IT",
    lotSize: 150,
    expiry: "24 Apr 25",
    strike: "-",
    optType: "-",
    tokens: "Z✓ A✓ U✓",
    updated: "06:00 AM",
    active: true,
  },
  {
    symbol: "INFY25MAYFUT",
    exchange: "NFO",
    type: "future",
    name: "Infosys May 2025 Fut",
    sector: "IT",
    lotSize: 400,
    expiry: "29 May 25",
    strike: "-",
    optType: "-",
    tokens: "Z✓ A✓ U✓",
    updated: "06:00 AM",
    active: true,
  },
  {
    symbol: "HDFCBANK25MAYFUT",
    exchange: "NFO",
    type: "future",
    name: "HDFC Bank May 2025 Fut",
    sector: "Banking",
    lotSize: 550,
    expiry: "29 May 25",
    strike: "-",
    optType: "-",
    tokens: "Z✓ A✓ U✓",
    updated: "06:00 AM",
    active: true,
  },
  {
    symbol: "NIFTY25MAYFUT",
    exchange: "NFO",
    type: "future",
    name: "NIFTY May 2025 Fut",
    sector: "Index",
    lotSize: 50,
    expiry: "29 May 25",
    strike: "-",
    optType: "-",
    tokens: "Z✓ A✓ U✓",
    updated: "06:00 AM",
    active: true,
  },
  {
    symbol: "BANKNIFTY25MAYFUT",
    exchange: "NFO",
    type: "future",
    name: "Bank Nifty May 2025 Fut",
    sector: "Index",
    lotSize: 15,
    expiry: "29 May 25",
    strike: "-",
    optType: "-",
    tokens: "Z✓ A✓ U✓",
    updated: "06:00 AM",
    active: true,
  },
  // NSE Options
  {
    symbol: "NIFTY25APR22500CE",
    exchange: "NFO",
    type: "option",
    name: "NIFTY 22500 CE Apr 25",
    sector: "Index",
    lotSize: 50,
    expiry: "17 Apr 25",
    strike: "22500",
    optType: "CE",
    tokens: "Z✓ A✓ U✓",
    updated: "06:15 AM",
    active: true,
  },
  {
    symbol: "NIFTY25APR22500PE",
    exchange: "NFO",
    type: "option",
    name: "NIFTY 22500 PE Apr 25",
    sector: "Index",
    lotSize: 50,
    expiry: "17 Apr 25",
    strike: "22500",
    optType: "PE",
    tokens: "Z✓ A✓ U✓",
    updated: "06:15 AM",
    active: true,
  },
  {
    symbol: "BANKNIFTY25APR48000CE",
    exchange: "NFO",
    type: "option",
    name: "Bank Nifty 48000 CE Apr 25",
    sector: "Index",
    lotSize: 15,
    expiry: "10 Apr 25",
    strike: "48000",
    optType: "CE",
    tokens: "Z✓ A✓ U✓",
    updated: "06:15 AM",
    active: true,
  },
  {
    symbol: "BANKNIFTY25APR48000PE",
    exchange: "NFO",
    type: "option",
    name: "Bank Nifty 48000 PE Apr 25",
    sector: "Index",
    lotSize: 15,
    expiry: "10 Apr 25",
    strike: "48000",
    optType: "PE",
    tokens: "Z✓ A✓ U✓",
    updated: "06:15 AM",
    active: true,
  },
  {
    symbol: "RELIANCE25APR2850CE",
    exchange: "NFO",
    type: "option",
    name: "Reliance 2850 CE Apr 25",
    sector: "Energy",
    lotSize: 250,
    expiry: "24 Apr 25",
    strike: "2850",
    optType: "CE",
    tokens: "Z✓ A✓ U✓",
    updated: "06:15 AM",
    active: true,
  },
  {
    symbol: "RELIANCE25APR2850PE",
    exchange: "NFO",
    type: "option",
    name: "Reliance 2850 PE Apr 25",
    sector: "Energy",
    lotSize: 250,
    expiry: "24 Apr 25",
    strike: "2850",
    optType: "PE",
    tokens: "Z✓ A✓ U✓",
    updated: "06:15 AM",
    active: true,
  },
  {
    symbol: "INFY25APR1800CE",
    exchange: "NFO",
    type: "option",
    name: "Infosys 1800 CE Apr 25",
    sector: "IT",
    lotSize: 400,
    expiry: "24 Apr 25",
    strike: "1800",
    optType: "CE",
    tokens: "Z✓ A✓ U✓",
    updated: "06:15 AM",
    active: true,
  },
  {
    symbol: "TCS25APR4200CE",
    exchange: "NFO",
    type: "option",
    name: "TCS 4200 CE Apr 25",
    sector: "IT",
    lotSize: 150,
    expiry: "24 Apr 25",
    strike: "4200",
    optType: "CE",
    tokens: "Z✓ A✓ U✓",
    updated: "06:15 AM",
    active: true,
  },
  {
    symbol: "NIFTY25APR23000CE",
    exchange: "NFO",
    type: "option",
    name: "NIFTY 23000 CE Apr 25",
    sector: "Index",
    lotSize: 50,
    expiry: "17 Apr 25",
    strike: "23000",
    optType: "CE",
    tokens: "Z✓ A✓ U✓",
    updated: "06:15 AM",
    active: true,
  },
  {
    symbol: "NIFTY25APR21500PE",
    exchange: "NFO",
    type: "option",
    name: "NIFTY 21500 PE Apr 25",
    sector: "Index",
    lotSize: 50,
    expiry: "17 Apr 25",
    strike: "21500",
    optType: "PE",
    tokens: "Z✓ A✓ U✓",
    updated: "06:15 AM",
    active: true,
  },
  // MCX
  {
    symbol: "GOLD25APR",
    exchange: "MCX",
    type: "commodity",
    name: "Gold April 2025",
    sector: "Metals",
    lotSize: 1,
    expiry: "05 Apr 25",
    strike: "-",
    optType: "-",
    tokens: "Z✓ A✓ U✓",
    updated: "07:00 AM",
    active: true,
  },
  {
    symbol: "GOLDM25APR",
    exchange: "MCX",
    type: "commodity",
    name: "Gold Mini April 2025",
    sector: "Metals",
    lotSize: 10,
    expiry: "05 Apr 25",
    strike: "-",
    optType: "-",
    tokens: "Z✓ A✓ U✓",
    updated: "07:00 AM",
    active: true,
  },
  {
    symbol: "SILVER25APR",
    exchange: "MCX",
    type: "commodity",
    name: "Silver April 2025",
    sector: "Metals",
    lotSize: 30,
    expiry: "05 Apr 25",
    strike: "-",
    optType: "-",
    tokens: "Z✓ A✓ U✓",
    updated: "07:00 AM",
    active: true,
  },
  {
    symbol: "CRUDEOIL25APR",
    exchange: "MCX",
    type: "commodity",
    name: "Crude Oil April 2025",
    sector: "Energy",
    lotSize: 100,
    expiry: "17 Apr 25",
    strike: "-",
    optType: "-",
    tokens: "Z✓ A✓ U✓",
    updated: "07:00 AM",
    active: true,
  },
  {
    symbol: "NATURALGAS25APR",
    exchange: "MCX",
    type: "commodity",
    name: "Natural Gas April 2025",
    sector: "Energy",
    lotSize: 1250,
    expiry: "28 Apr 25",
    strike: "-",
    optType: "-",
    tokens: "Z✓ A✓ U✓",
    updated: "07:00 AM",
    active: true,
  },
  {
    symbol: "COPPER25APR",
    exchange: "MCX",
    type: "commodity",
    name: "Copper April 2025",
    sector: "Metals",
    lotSize: 2500,
    expiry: "29 Apr 25",
    strike: "-",
    optType: "-",
    tokens: "Z✓ A✓ U✓",
    updated: "07:00 AM",
    active: true,
  },
  {
    symbol: "ZINC25APR",
    exchange: "MCX",
    type: "commodity",
    name: "Zinc April 2025",
    sector: "Metals",
    lotSize: 5000,
    expiry: "29 Apr 25",
    strike: "-",
    optType: "-",
    tokens: "Z✓ A✓ U✓",
    updated: "07:00 AM",
    active: true,
  },
  {
    symbol: "NICKEL25APR",
    exchange: "MCX",
    type: "commodity",
    name: "Nickel April 2025",
    sector: "Metals",
    lotSize: 1500,
    expiry: "30 Apr 25",
    strike: "-",
    optType: "-",
    tokens: "Z✓ A✓ U✓",
    updated: "07:00 AM",
    active: true,
  },
  // Currency
  {
    symbol: "USDINR25APR",
    exchange: "CDS",
    type: "currency",
    name: "USD/INR Apr 2025",
    sector: "Currency",
    lotSize: 1000,
    expiry: "29 Apr 25",
    strike: "-",
    optType: "-",
    tokens: "Z✓ A✓ U✓",
    updated: "06:00 AM",
    active: true,
  },
  {
    symbol: "EURINR25APR",
    exchange: "CDS",
    type: "currency",
    name: "EUR/INR Apr 2025",
    sector: "Currency",
    lotSize: 1000,
    expiry: "29 Apr 25",
    strike: "-",
    optType: "-",
    tokens: "Z✓ A✓ U✓",
    updated: "06:00 AM",
    active: true,
  },
  {
    symbol: "GBPINR25APR",
    exchange: "CDS",
    type: "currency",
    name: "GBP/INR Apr 2025",
    sector: "Currency",
    lotSize: 1000,
    expiry: "29 Apr 25",
    strike: "-",
    optType: "-",
    tokens: "Z✓ A✓ U✓",
    updated: "06:00 AM",
    active: true,
  },
  {
    symbol: "USDINR25APR88CE",
    exchange: "CDS",
    type: "option",
    name: "USD/INR 88 CE Apr 25",
    sector: "Currency",
    lotSize: 1000,
    expiry: "29 Apr 25",
    strike: "88",
    optType: "CE",
    tokens: "Z✓ A✓",
    updated: "06:00 AM",
    active: true,
  },
  {
    symbol: "USDINR25APR86PE",
    exchange: "CDS",
    type: "option",
    name: "USD/INR 86 PE Apr 25",
    sector: "Currency",
    lotSize: 1000,
    expiry: "29 Apr 25",
    strike: "86",
    optType: "PE",
    tokens: "Z✓ A✓",
    updated: "06:00 AM",
    active: true,
  },
  // ETFs
  {
    symbol: "NIFTYBEES",
    exchange: "NSE",
    type: "etf",
    name: "Nippon India ETF Nifty 50",
    sector: "ETF-Index",
    lotSize: 1,
    expiry: "-",
    strike: "-",
    optType: "-",
    tokens: "Z✓ A✓ U✓",
    updated: "08:00 PM",
    active: true,
  },
  {
    symbol: "GOLDBEES",
    exchange: "NSE",
    type: "etf",
    name: "Nippon India ETF Gold",
    sector: "ETF-Gold",
    lotSize: 1,
    expiry: "-",
    strike: "-",
    optType: "-",
    tokens: "Z✓ A✓ U✓",
    updated: "08:00 PM",
    active: true,
  },
  {
    symbol: "BANKBEES",
    exchange: "NSE",
    type: "etf",
    name: "Nippon India ETF Bank Nifty",
    sector: "ETF-Index",
    lotSize: 1,
    expiry: "-",
    strike: "-",
    optType: "-",
    tokens: "Z✓ A✓ U✓",
    updated: "08:00 PM",
    active: true,
  },
  {
    symbol: "LIQUIDBEES",
    exchange: "NSE",
    type: "etf",
    name: "Nippon India ETF Liquid",
    sector: "ETF-Debt",
    lotSize: 1,
    expiry: "-",
    strike: "-",
    optType: "-",
    tokens: "Z✓ A✓ U✓",
    updated: "08:00 PM",
    active: true,
  },
  {
    symbol: "ITBEES",
    exchange: "NSE",
    type: "etf",
    name: "Nippon India ETF Nifty IT",
    sector: "ETF-Sector",
    lotSize: 1,
    expiry: "-",
    strike: "-",
    optType: "-",
    tokens: "Z✓ A✓ U✓",
    updated: "08:00 PM",
    active: true,
  },
  // Crypto
  {
    symbol: "BTCUSDT",
    exchange: "BINANCE",
    type: "crypto",
    name: "Bitcoin / Tether",
    sector: "Layer 1",
    lotSize: "0.001",
    expiry: "-",
    strike: "-",
    optType: "-",
    tokens: "Z✓",
    updated: "06:00 AM",
    active: true,
  },
  {
    symbol: "ETHUSDT",
    exchange: "BINANCE",
    type: "crypto",
    name: "Ethereum / Tether",
    sector: "Layer 1",
    lotSize: "0.01",
    expiry: "-",
    strike: "-",
    optType: "-",
    tokens: "Z✓",
    updated: "06:00 AM",
    active: true,
  },
  {
    symbol: "SOLUSDT",
    exchange: "BINANCE",
    type: "crypto",
    name: "Solana / Tether",
    sector: "Layer 1",
    lotSize: 1,
    expiry: "-",
    strike: "-",
    optType: "-",
    tokens: "Z✓",
    updated: "06:00 AM",
    active: true,
  },
  {
    symbol: "BNBUSDT",
    exchange: "BINANCE",
    type: "crypto",
    name: "Binance Coin / Tether",
    sector: "Exchange",
    lotSize: "0.1",
    expiry: "-",
    strike: "-",
    optType: "-",
    tokens: "Z✓",
    updated: "06:00 AM",
    active: true,
  },
  {
    symbol: "ADAUSDT",
    exchange: "BINANCE",
    type: "crypto",
    name: "Cardano / Tether",
    sector: "Layer 1",
    lotSize: 10,
    expiry: "-",
    strike: "-",
    optType: "-",
    tokens: "Z✓",
    updated: "06:00 AM",
    active: true,
  },
  {
    symbol: "MATICUSDT",
    exchange: "BINANCE",
    type: "crypto",
    name: "Polygon / Tether",
    sector: "Layer 2",
    lotSize: 10,
    expiry: "-",
    strike: "-",
    optType: "-",
    tokens: "Z✓",
    updated: "06:00 AM",
    active: true,
  },
  {
    symbol: "DOGEUSDT",
    exchange: "BINANCE",
    type: "crypto",
    name: "Dogecoin / Tether",
    sector: "Meme",
    lotSize: 100,
    expiry: "-",
    strike: "-",
    optType: "-",
    tokens: "Z✓",
    updated: "06:00 AM",
    active: true,
  },
  // Forex
  {
    symbol: "EUR/USD",
    exchange: "FOREX",
    type: "currency",
    name: "Euro / US Dollar",
    sector: "Major",
    lotSize: 100000,
    expiry: "-",
    strike: "-",
    optType: "-",
    tokens: "Z✓",
    updated: "06:00 AM",
    active: true,
  },
  {
    symbol: "GBP/USD",
    exchange: "FOREX",
    type: "currency",
    name: "British Pound / US Dollar",
    sector: "Major",
    lotSize: 100000,
    expiry: "-",
    strike: "-",
    optType: "-",
    tokens: "Z✓",
    updated: "06:00 AM",
    active: true,
  },
  {
    symbol: "USD/JPY",
    exchange: "FOREX",
    type: "currency",
    name: "US Dollar / Japanese Yen",
    sector: "Major",
    lotSize: 100000,
    expiry: "-",
    strike: "-",
    optType: "-",
    tokens: "Z✓",
    updated: "06:00 AM",
    active: true,
  },
  {
    symbol: "USD/CHF",
    exchange: "FOREX",
    type: "currency",
    name: "US Dollar / Swiss Franc",
    sector: "Major",
    lotSize: 100000,
    expiry: "-",
    strike: "-",
    optType: "-",
    tokens: "Z✓",
    updated: "06:00 AM",
    active: true,
  },
  {
    symbol: "AUD/USD",
    exchange: "FOREX",
    type: "currency",
    name: "Australian Dollar / USD",
    sector: "Major",
    lotSize: 100000,
    expiry: "-",
    strike: "-",
    optType: "-",
    tokens: "Z✓",
    updated: "06:00 AM",
    active: true,
  },
  {
    symbol: "EUR/GBP",
    exchange: "FOREX",
    type: "currency",
    name: "Euro / British Pound",
    sector: "Minor",
    lotSize: 100000,
    expiry: "-",
    strike: "-",
    optType: "-",
    tokens: "Z✓",
    updated: "06:00 AM",
    active: true,
  },
  {
    symbol: "USD/INR",
    exchange: "FOREX",
    type: "currency",
    name: "US Dollar / Indian Rupee",
    sector: "Exotic",
    lotSize: 100000,
    expiry: "-",
    strike: "-",
    optType: "-",
    tokens: "Z✓",
    updated: "06:00 AM",
    active: true,
  },
];

const SYNC_LOGS: SyncLog[] = [
  {
    id: "abc-1234",
    exchange: "NSE_EQ",
    time: "Today 06:00 AM",
    fetched: 2847,
    added: 12,
    updated: 45,
    removed: 0,
    status: "SUCCESS",
  },
  {
    id: "abc-1233",
    exchange: "NSE_NFO",
    time: "Today 06:00 AM",
    fetched: 30670,
    added: 840,
    updated: 2200,
    removed: 160,
    status: "SUCCESS",
  },
  {
    id: "abc-1232",
    exchange: "BSE_EQ",
    time: "Today 06:00 AM",
    fetched: 5431,
    added: 8,
    updated: 72,
    removed: 0,
    status: "SUCCESS",
  },
  {
    id: "abc-1231",
    exchange: "MCX",
    time: "Today 07:00 AM",
    fetched: 156,
    added: 2,
    updated: 18,
    removed: 0,
    status: "SUCCESS",
  },
  {
    id: "abc-1230",
    exchange: "BROKER_TOKENS",
    time: "Today 05:30 AM",
    fetched: 54280,
    added: 0,
    updated: 1240,
    removed: 0,
    status: "SUCCESS",
  },
  {
    id: "abc-1229",
    exchange: "NSE_EQ",
    time: "Yesterday 06:00 AM",
    fetched: 2835,
    added: 5,
    updated: 38,
    removed: 2,
    status: "SUCCESS",
  },
  {
    id: "abc-1228",
    exchange: "CRYPTO",
    time: "Yesterday 06:00 AM",
    fetched: 4820,
    added: 45,
    updated: 380,
    removed: 12,
    status: "SUCCESS",
  },
  {
    id: "abc-1227",
    exchange: "NSE_NFO",
    time: "Yesterday 06:00 AM",
    fetched: 29830,
    added: 1200,
    updated: 3400,
    removed: 980,
    status: "SUCCESS",
  },
  {
    id: "abc-1226",
    exchange: "FOREX",
    time: "Yesterday 12:00 PM",
    fetched: 80,
    added: 0,
    updated: 80,
    removed: 0,
    status: "SUCCESS",
  },
  {
    id: "abc-1225",
    exchange: "MCX",
    time: "2 days ago 07:00 AM",
    fetched: 154,
    added: 0,
    updated: 14,
    removed: 4,
    status: "FAILED",
    errorLog:
      "Connection timeout to MCX API after 3 retries. Fallback to previous data used. Error: ECONNREFUSED 203.188.255.22:443 - retry 1/3 at 07:05 AM, retry 2/3 at 07:10 AM, retry 3/3 at 07:15 AM. Admin notified via Telegram.",
  },
  {
    id: "abc-1224",
    exchange: "NSE_EQ",
    time: "2 days ago 06:00 AM",
    fetched: 2840,
    added: 3,
    updated: 29,
    removed: 0,
    status: "SUCCESS",
  },
  {
    id: "abc-1223",
    exchange: "BSE_EQ",
    time: "2 days ago 06:00 AM",
    fetched: 5420,
    added: 0,
    updated: 55,
    removed: 0,
    status: "SUCCESS",
  },
];

const BROKER_TOKEN_TABLE = [
  {
    symbol: "RELIANCE",
    exchange: "NSE",
    type: "EQ",
    zerodha: "738561",
    angel: "2885",
    upstox: "NSE_EQ|RELIANCE",
    mapped: true,
  },
  {
    symbol: "INFY",
    exchange: "NSE",
    type: "EQ",
    zerodha: "408065",
    angel: "1594",
    upstox: "NSE_EQ|INFY",
    mapped: true,
  },
  {
    symbol: "TCS",
    exchange: "NSE",
    type: "EQ",
    zerodha: "2953217",
    angel: "11536",
    upstox: "NSE_EQ|TCS",
    mapped: true,
  },
  {
    symbol: "HDFCBANK",
    exchange: "NSE",
    type: "EQ",
    zerodha: "341249",
    angel: "1333",
    upstox: "NSE_EQ|HDFCBANK",
    mapped: true,
  },
  {
    symbol: "NIFTY25APRFUT",
    exchange: "NFO",
    type: "FUT",
    zerodha: "17879042",
    angel: "99926",
    upstox: "NSE_FO|NIFTY25APRFUT",
    mapped: true,
  },
  {
    symbol: "BANKNIFTY25APRFUT",
    exchange: "NFO",
    type: "FUT",
    zerodha: "11924226",
    angel: "26009",
    upstox: "NSE_FO|BANKNIFTY25APRFUT",
    mapped: true,
  },
  {
    symbol: "GOLD25APR",
    exchange: "MCX",
    type: "FUT",
    zerodha: "59513095",
    angel: "234280",
    upstox: "MCX_FO|GOLD25APR",
    mapped: true,
  },
  {
    symbol: "CRUDEOIL25APR",
    exchange: "MCX",
    type: "FUT",
    zerodha: "57960455",
    angel: "225848",
    upstox: "MCX_FO|CRUDEOIL25APR",
    mapped: true,
  },
  {
    symbol: "USDINR25APR",
    exchange: "CDS",
    type: "FUT",
    zerodha: "412675",
    angel: "10093",
    upstox: "NSE_CD|USDINR25APR",
    mapped: true,
  },
  {
    symbol: "NIFTYBEES",
    exchange: "NSE",
    type: "ETF",
    zerodha: "2977281",
    angel: "13611",
    upstox: "NSE_EQ|NIFTYBEES",
    mapped: true,
  },
  {
    symbol: "ICICIBANK",
    exchange: "NSE",
    type: "EQ",
    zerodha: "1270529",
    angel: "4963",
    upstox: "NSE_EQ|ICICIBANK",
    mapped: true,
  },
  {
    symbol: "SBIN",
    exchange: "NSE",
    type: "EQ",
    zerodha: "779521",
    angel: "3045",
    upstox: "NSE_EQ|SBIN",
    mapped: true,
  },
  {
    symbol: "NIFTY50 IDX",
    exchange: "NSE",
    type: "IDX",
    zerodha: "256265",
    angel: "99926",
    upstox: "NSE_INDEX|NIFTY50",
    mapped: true,
  },
  {
    symbol: "SILVER25APR",
    exchange: "MCX",
    type: "FUT",
    zerodha: "57512967",
    angel: "228924",
    upstox: "MCX_FO|SILVER25APR",
    mapped: true,
  },
  {
    symbol: "BTCUSDT",
    exchange: "CRYPTO",
    type: "PERP",
    zerodha: "-",
    angel: "-",
    upstox: "-",
    mapped: false,
  },
];

const SCHEDULE_ROWS = [
  {
    source: "NSE Equity",
    schedule: "Daily 06:00 AM",
    next: "06:00 AM tomorrow",
    last: "Today 06:00 AM",
    duration: "2m 14s",
    status: "OK",
  },
  {
    source: "NSE F&O (equity)",
    schedule: "Daily 06:00 AM",
    next: "06:00 AM tomorrow",
    last: "Today 06:00 AM",
    duration: "8m 32s",
    status: "OK",
  },
  {
    source: "NSE F&O (weekly)",
    schedule: "Thu 6:00 PM",
    next: "Thu 6:00 PM",
    last: "Last Thu",
    duration: "3m 11s",
    status: "OK",
  },
  {
    source: "BSE Equity",
    schedule: "Daily 06:00 AM",
    next: "06:00 AM tomorrow",
    last: "Today 06:00 AM",
    duration: "3m 28s",
    status: "OK",
  },
  {
    source: "MCX",
    schedule: "Daily 07:00 AM",
    next: "07:00 AM tomorrow",
    last: "Today 07:00 AM",
    duration: "1m 45s",
    status: "OK",
  },
  {
    source: "Currency CDS",
    schedule: "Daily 06:00 AM",
    next: "06:00 AM tomorrow",
    last: "Today 06:00 AM",
    duration: "0m 52s",
    status: "OK",
  },
  {
    source: "ETF",
    schedule: "Weekly Sun 8 PM",
    next: "Sun 8:00 PM",
    last: "Last Sun",
    duration: "2m 07s",
    status: "OK",
  },
  {
    source: "Broker Tokens",
    schedule: "Daily 05:30 AM",
    next: "05:30 AM tomorrow",
    last: "Today 05:30 AM",
    duration: "4m 15s",
    status: "OK",
  },
  {
    source: "Crypto (CoinGecko)",
    schedule: "Every 6h",
    next: "12:00 PM today",
    last: "06:00 AM today",
    duration: "1m 30s",
    status: "OK",
  },
  {
    source: "Forex (OANDA)",
    schedule: "Every 6h",
    next: "12:00 PM today",
    last: "06:00 AM today",
    duration: "0m 45s",
    status: "OK",
  },
  {
    source: "US Stocks",
    schedule: "Weekly Sun 8 PM",
    next: "Sun 8:00 PM",
    last: "Last Sun",
    duration: "12m 18s",
    status: "OK",
  },
];

const FILTER_OPTIONS = [
  "All",
  "NSE-EQ",
  "BSE-EQ",
  "NFO-FUT",
  "NFO-OPT",
  "MCX",
  "CDS",
  "ETF",
  "CRYPTO",
  "FOREX",
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
const typeColor: Record<string, string> = {
  stock: "#3B82F6",
  index: "#8B5CF6",
  future: "#F59E0B",
  option: "#EC4899",
  etf: "#10B981",
  currency: "#06B6D4",
  commodity: "#F97316",
  crypto: "#A78BFA",
};

const exchangeColor: Record<string, string> = {
  NSE: "#00C087",
  BSE: "#F2C94C",
  NFO: "#F59E0B",
  MCX: "#F97316",
  CDS: "#06B6D4",
  BINANCE: "#F3BA2F",
  FOREX: "#8B5CF6",
  BSE_EQ: "#F2C94C",
  NSE_EQ: "#00C087",
  NSE_NFO: "#F59E0B",
  BROKER_TOKENS: "#3B82F6",
  CRYPTO: "#A78BFA",
};

function syncBadge(s: SyncStatus) {
  const cfg = {
    SUCCESS: { bg: "#0D2E1F", color: "#00C087", label: "SUCCESS" },
    FAILED: { bg: "#2E0D12", color: "#F2415A", label: "FAILED" },
    RUNNING: { bg: "#2E260D", color: "#F2C94C", label: "RUNNING" },
    PARTIAL: { bg: "#2A1E0D", color: "#F5A623", label: "PARTIAL" },
  };
  const c = cfg[s];
  return (
    <span
      className="text-[10px] font-bold px-2 py-0.5 rounded"
      style={{ background: c.bg, color: c.color }}
    >
      {c.label}
    </span>
  );
}

const filterInstrument = (
  inst: Instrument,
  filter: string,
  search: string,
): boolean => {
  if (filter !== "All") {
    const map: Record<string, (i: Instrument) => boolean> = {
      "NSE-EQ": (i) => i.exchange === "NSE" && i.type === "stock",
      "BSE-EQ": (i) => i.exchange === "BSE",
      "NFO-FUT": (i) => i.exchange === "NFO" && i.type === "future",
      "NFO-OPT": (i) => i.exchange === "NFO" && i.type === "option",
      MCX: (i) => i.exchange === "MCX",
      CDS: (i) => i.exchange === "CDS",
      ETF: (i) => i.type === "etf",
      CRYPTO: (i) => i.exchange === "BINANCE",
      FOREX: (i) => i.exchange === "FOREX",
    };
    if (map[filter] && !map[filter](inst)) return false;
  }
  if (search) {
    const q = search.toLowerCase();
    return (
      inst.symbol.toLowerCase().includes(q) ||
      inst.name.toLowerCase().includes(q) ||
      inst.sector.toLowerCase().includes(q)
    );
  }
  return true;
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function InstrumentMapping() {
  const [steps, setSteps] = useState<PipelineStep[]>(INITIAL_STEPS);
  const [syncing, setSyncing] = useState(false);
  const [countdown, setCountdown] = useState(3300); // 55 minutes
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [expandedLog, setExpandedLog] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(
    "nse-equity",
  );
  const [selectedInstrument, setSelectedInstrument] =
    useState<Instrument | null>(null);
  const [searchDropdown, setSearchDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Countdown timer
  useEffect(() => {
    const t = setInterval(
      () => setCountdown((c) => (c > 0 ? c - 1 : 3600)),
      1000,
    );
    return () => clearInterval(t);
  }, []);

  const countdownStr = `${String(Math.floor(countdown / 3600)).padStart(2, "0")}:${String(Math.floor((countdown % 3600) / 60)).padStart(2, "0")}:${String(countdown % 60).padStart(2, "0")}`;

  // Run full sync animation
  const runSync = () => {
    if (syncing) return;
    setSyncing(true);
    const reset = INITIAL_STEPS.map((s) => ({
      ...s,
      status: "pending" as PipelineStatus,
    }));
    setSteps(reset);
    reset.forEach((_, i) => {
      setTimeout(() => {
        setSteps((prev) =>
          prev.map((s, idx) => (idx === i ? { ...s, status: "running" } : s)),
        );
        setTimeout(() => {
          setSteps((prev) =>
            prev.map((s, idx) => (idx === i ? { ...s, status: "done" } : s)),
          );
          if (i === 6) setSyncing(false);
        }, 700);
      }, i * 900);
    });
  };

  // Filtered instruments
  const filtered = INSTRUMENTS.filter((i) =>
    filterInstrument(i, activeFilter, search),
  );

  // Search suggestions
  const suggestions =
    search.length >= 1
      ? INSTRUMENTS.filter(
          (i) =>
            i.symbol.toLowerCase().includes(search.toLowerCase()) ||
            i.name.toLowerCase().includes(search.toLowerCase()),
        ).slice(0, 8)
      : [];

  const toggleSection = (key: string) =>
    setExpandedSection((p) => (p === key ? null : key));

  const card = "rounded-xl border p-4" as const;
  const cardStyle = { background: "#0C1A30", borderColor: "#1E2C44" };

  return (
    <div className="min-h-screen p-4 lg:p-6" style={{ background: "#0B1424" }}>
      {/* ── Header ── */}
      <div className="mb-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Database size={22} style={{ color: "#F2C94C" }} />
              <h1
                className="text-xl font-bold tracking-widest uppercase"
                style={{ color: "#F2C94C" }}
              >
                Instrument Mapping Engine
              </h1>
            </div>
            <p className="text-sm" style={{ color: "#9AA8C1" }}>
              Auto-discovery & mapping for 58,420+ tradeable instruments across
              all markets
            </p>
            <div
              className="flex items-center gap-4 mt-1 text-xs"
              style={{ color: "#9AA8C1" }}
            >
              <span>
                Last full sync:{" "}
                <span className="text-white">Today 05:47 AM</span>
              </span>
              <span>
                Next sync:{" "}
                <span style={{ color: "#F2C94C" }}>{countdownStr}</span>
              </span>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button
              onClick={runSync}
              disabled={syncing}
              size="sm"
              className="text-black font-bold text-xs uppercase tracking-widest"
              style={{
                background: syncing ? "#2E2600" : "#F2C94C",
                color: syncing ? "#F2C94C" : "#000",
              }}
            >
              {syncing ? (
                <RefreshCw size={12} className="mr-1 animate-spin" />
              ) : (
                <Zap size={12} className="mr-1" />
              )}
              {syncing ? "Syncing..." : "Run Full Sync"}
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-xs uppercase tracking-widest border-red-700 text-red-400 hover:bg-red-900/20"
            >
              <X size={12} className="mr-1" /> Stop
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-xs uppercase tracking-widest"
              style={{ borderColor: "#1E2C44", color: "#9AA8C1" }}
            >
              <Download size={12} className="mr-1" /> Export DB
            </Button>
          </div>
        </div>
      </div>

      {/* ── Pipeline Visualizer ── */}
      <div className={`${card} mb-6 overflow-x-auto`} style={cardStyle}>
        <div
          className="text-xs font-bold tracking-widest mb-3"
          style={{ color: "#9AA8C1" }}
        >
          7-STEP PIPELINE
        </div>
        <div className="flex items-start gap-0 min-w-[700px]">
          {steps.map((step, idx) => (
            <div key={step.id} className="flex items-start">
              <div className="flex flex-col items-center text-center w-24">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold mb-1"
                  style={{
                    background:
                      step.status === "done"
                        ? "#0D2E1F"
                        : step.status === "running"
                          ? "#2E260D"
                          : step.status === "error"
                            ? "#2E0D12"
                            : "#121C2E",
                    border: `2px solid ${step.status === "done" ? "#00C087" : step.status === "running" ? "#F2C94C" : step.status === "error" ? "#F2415A" : "#1E2C44"}`,
                    color:
                      step.status === "done"
                        ? "#00C087"
                        : step.status === "running"
                          ? "#F2C94C"
                          : step.status === "error"
                            ? "#F2415A"
                            : "#9AA8C1",
                  }}
                >
                  {step.status === "running" ? (
                    <RefreshCw size={14} className="animate-spin" />
                  ) : step.status === "done" ? (
                    <CheckCircle size={14} />
                  ) : step.status === "error" ? (
                    <AlertTriangle size={14} />
                  ) : (
                    step.id
                  )}
                </div>
                <div
                  className="text-[10px] font-bold"
                  style={{
                    color: step.status === "done" ? "#F2C94C" : "#9AA8C1",
                  }}
                >
                  {step.name}
                </div>
                <div
                  className="text-[9px] leading-tight mt-0.5"
                  style={{ color: "#6B7A8D" }}
                >
                  {step.desc}
                </div>
                {step.status !== "pending" && (
                  <div
                    className="text-[9px] mt-1"
                    style={{
                      color: step.status === "done" ? "#00C087" : "#F2C94C",
                    }}
                  >
                    {step.records.toLocaleString()} rec
                    {step.duration && (
                      <span className="ml-1" style={{ color: "#6B7A8D" }}>
                        {step.duration}
                      </span>
                    )}
                  </div>
                )}
              </div>
              {idx < steps.length - 1 && (
                <div className="flex items-center mt-4 mx-1">
                  <ArrowRight
                    size={14}
                    style={{
                      color: step.status === "done" ? "#00C087" : "#1E2C44",
                    }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Stats Bar ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
        {[
          {
            label: "Total Instruments",
            value: "58,420",
            sub: "across all markets",
            gold: true,
          },
          { label: "NSE Equity", value: "2,847", sub: "active stocks" },
          { label: "NSE F&O", value: "50,280", sub: "futures + options" },
          { label: "MCX Commodities", value: "156", sub: "active contracts" },
          { label: "Forex / Crypto", value: "4,820", sub: "pairs & coins" },
        ].map((s) => (
          <div
            key={s.label}
            className={`${card} text-center`}
            style={cardStyle}
          >
            <div
              className="text-2xl font-bold"
              style={{ color: s.gold ? "#F2C94C" : "white" }}
            >
              {s.value}
            </div>
            <div
              className="text-[10px] font-semibold uppercase tracking-wider mt-0.5"
              style={{ color: "#9AA8C1" }}
            >
              {s.label}
            </div>
            <div className="text-[9px] mt-0.5" style={{ color: "#6B7A8D" }}>
              {s.sub}
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 mb-6">
        {[
          { label: "BSE EQ", value: "5,431" },
          { label: "CDS", value: "84" },
          { label: "ETFs", value: "248" },
          { label: "US Stocks", value: "8,100" },
          { label: "Indices", value: "89" },
          { label: "DB Size", value: "2.4 GB" },
          { label: "Sync Time", value: "4.2 min" },
          { label: "Uptime", value: "99.8%" },
        ].map((s) => (
          <div
            key={s.label}
            className={`${card} text-center py-2`}
            style={cardStyle}
          >
            <div className="text-sm font-bold" style={{ color: "#F2C94C" }}>
              {s.value}
            </div>
            <div
              className="text-[9px] uppercase tracking-wider"
              style={{ color: "#6B7A8D" }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* ── Main Tabs ── */}
      <Tabs defaultValue="indian">
        <TabsList className="mb-4 flex flex-wrap gap-1 bg-transparent h-auto p-0">
          {[
            "indian",
            "international",
            "brokers",
            "schedule",
            "logs",
            "master",
          ].map((tab) => (
            <TabsTrigger
              key={tab}
              value={tab}
              className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded data-[state=active]:text-black"
              style={{ background: "#0C1A30", border: "1px solid #1E2C44" }}
            >
              {tab === "indian"
                ? "Indian Markets"
                : tab === "international"
                  ? "International"
                  : tab === "brokers"
                    ? "Broker Tokens"
                    : tab === "schedule"
                      ? "Sync Schedule"
                      : tab === "logs"
                        ? "Sync Logs"
                        : "Master DB"}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* ── INDIAN MARKETS ── */}
        <TabsContent value="indian">
          <div className="space-y-3">
            {[
              {
                key: "nse-equity",
                title: "NSE EQUITY",
                badge: "ACTIVE",
                source: "nseindia.com/content/equities/EQUITY_L.csv",
                count: "2,847 instruments",
                lastSync: "Today 06:00 AM",
                added: "+12 added",
                removed: "0 removed",
                progress: 100,
                fields: [
                  "SYMBOL",
                  "NAME OF COMPANY",
                  "SERIES",
                  "ISIN NUMBER",
                  "FACE VALUE",
                  "MARKET LOT",
                  "DATE OF LISTING",
                ],
                extra: null,
              },
              {
                key: "nse-indices",
                title: "NSE INDICES",
                badge: "ACTIVE",
                source: "nseindia.com/api/allIndices",
                count: "24 indices",
                lastSync: "Today 06:00 AM",
                added: "+0",
                removed: "0 removed",
                progress: 100,
                fields: null,
                extra: "indices",
              },
              {
                key: "nse-fo",
                title: "NSE F&O",
                badge: "ACTIVE",
                source: "nseindia.com/api/option-chain-equities",
                count: "30,670 contracts",
                lastSync: "Today 06:15 AM",
                added: "+840",
                removed: "160 removed",
                progress: 100,
                fields: null,
                extra: "fo",
              },
              {
                key: "mcx",
                title: "MCX COMMODITIES",
                badge: "ACTIVE",
                source: "api.kite.trade/instruments/MCX",
                count: "156 contracts",
                lastSync: "Today 07:00 AM",
                added: "+2",
                removed: "0 removed",
                progress: 100,
                fields: null,
                extra: "mcx",
              },
              {
                key: "cds",
                title: "CDS CURRENCY",
                badge: "ACTIVE",
                source: "nseindia.com/api/currency-stock-watch-all",
                count: "84 contracts",
                lastSync: "Today 06:00 AM",
                added: "+0",
                removed: "0 removed",
                progress: 100,
                fields: null,
                extra: "cds",
              },
              {
                key: "etf",
                title: "ETFs",
                badge: "ACTIVE",
                source: "nseindia.com/market-data/exchange-traded-funds-etf",
                count: "248 ETFs",
                lastSync: "Last Sun 8:00 PM",
                added: "+5",
                removed: "0 removed",
                progress: 100,
                fields: null,
                extra: "etf",
              },
            ].map((sec) => (
              <div key={sec.key} className={card} style={cardStyle}>
                <button
                  type="button"
                  onClick={() => toggleSection(sec.key)}
                  className="w-full flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="text-xs font-bold tracking-widest"
                      style={{ color: "#F2C94C" }}
                    >
                      {sec.title}
                    </span>
                    <Badge
                      className="text-[9px] px-1.5 py-0"
                      style={{
                        background: "#0D2E1F",
                        color: "#00C087",
                        border: "none",
                      }}
                    >
                      {sec.badge}
                    </Badge>
                    <span className="text-[11px]" style={{ color: "#9AA8C1" }}>
                      {sec.count}
                    </span>
                    <span className="text-[10px]" style={{ color: "#00C087" }}>
                      {sec.added}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px]" style={{ color: "#6B7A8D" }}>
                      Last: {sec.lastSync}
                    </span>
                    {expandedSection === sec.key ? (
                      <ChevronUp size={14} style={{ color: "#9AA8C1" }} />
                    ) : (
                      <ChevronDown size={14} style={{ color: "#9AA8C1" }} />
                    )}
                  </div>
                </button>
                {expandedSection === sec.key && (
                  <div className="mt-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span
                        className="text-[10px]"
                        style={{ color: "#6B7A8D" }}
                      >
                        Source:
                      </span>
                      <code
                        className="text-[10px] px-2 py-0.5 rounded"
                        style={{ background: "#0B1424", color: "#F2C94C" }}
                      >
                        {sec.source}
                      </code>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-[10px] h-6 px-2 ml-auto"
                        style={{ borderColor: "#1E2C44", color: "#9AA8C1" }}
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <RefreshCw size={10} className="mr-1" /> Sync Now
                      </Button>
                    </div>
                    <Progress
                      value={sec.progress}
                      className="h-1.5 mb-3"
                      style={{ background: "#1E2C44" }}
                    />
                    {sec.fields && (
                      <div>
                        <div
                          className="text-[10px] mb-1"
                          style={{ color: "#6B7A8D" }}
                        >
                          CSV Fields Parsed:
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {sec.fields.map((f) => (
                            <span
                              key={f}
                              className="text-[9px] px-1.5 py-0.5 rounded"
                              style={{
                                background: "#121C2E",
                                color: "#9AA8C1",
                                border: "1px solid #1E2C44",
                              }}
                            >
                              {f}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {sec.extra === "indices" && (
                      <div>
                        <div
                          className="text-[10px] mb-2"
                          style={{ color: "#6B7A8D" }}
                        >
                          All Indices Mapped:
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {[
                            "NIFTY 50",
                            "NIFTY NEXT 50",
                            "NIFTY 100",
                            "NIFTY 200",
                            "NIFTY 500",
                            "NIFTY BANK",
                            "NIFTY IT",
                            "NIFTY PHARMA",
                            "NIFTY AUTO",
                            "NIFTY FMCG",
                            "NIFTY METAL",
                            "NIFTY REALTY",
                            "NIFTY ENERGY",
                            "NIFTY INFRA",
                            "NIFTY MIDCAP 50",
                            "NIFTY MIDCAP 100",
                            "NIFTY SMALLCAP 100",
                            "NIFTY PSU BANK",
                            "NIFTY PRIVATE BANK",
                            "NIFTY HEALTHCARE",
                            "NIFTY CONSUMER DURABLES",
                            "INDIA VIX",
                            "FINNIFTY",
                            "MIDCPNIFTY",
                          ].map((idx) => (
                            <span
                              key={idx}
                              className="text-[9px] px-1.5 py-0.5 rounded"
                              style={{
                                background: "#0F1E35",
                                color: "#F2C94C",
                                border: "1px solid #2A3A50",
                              }}
                            >
                              {idx}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {sec.extra === "fo" && (
                      <div className="overflow-x-auto">
                        <table className="w-full text-[10px]">
                          <thead>
                            <tr style={{ color: "#6B7A8D" }}>
                              {[
                                "Type",
                                "Symbols",
                                "Contracts",
                                "Last Sync",
                              ].map((h) => (
                                <th
                                  key={h}
                                  className="text-left py-1 pr-3 font-semibold uppercase"
                                >
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {[
                              [
                                "Equity Futures",
                                "182 stocks",
                                "546",
                                "06:00 AM",
                              ],
                              ["Index Futures", "8 indices", "24", "06:00 AM"],
                              [
                                "Equity Options",
                                "182 stocks",
                                "27,300",
                                "06:00 AM",
                              ],
                              [
                                "Index Options (Weekly)",
                                "NIFTY + BANKNIFTY",
                                "1,600",
                                "06:15 AM",
                              ],
                              [
                                "Index Options (Monthly)",
                                "8 indices",
                                "1,200",
                                "06:15 AM",
                              ],
                            ].map((row, i) => (
                              <tr
                                key={row[0]}
                                style={{
                                  color: i % 2 === 0 ? "white" : "#C8D4E3",
                                }}
                              >
                                {row.map((cell) => (
                                  <td key={cell} className="py-1 pr-3">
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <div
                          className="mt-2 text-[10px]"
                          style={{ color: "#6B7A8D" }}
                        >
                          Format:{" "}
                          <code style={{ color: "#F2C94C" }}>
                            SYMBOL + YYMMM + FUT
                          </code>{" "}
                          → NIFTY25APRFUT | Weekly contracts added every
                          Thursday 6 PM
                        </div>
                      </div>
                    )}
                    {sec.extra === "mcx" && (
                      <div>
                        <div
                          className="flex flex-wrap gap-3 text-[10px]"
                          style={{ color: "#9AA8C1" }}
                        >
                          <span>
                            <span style={{ color: "#F2C94C" }}>METALS:</span>{" "}
                            GOLD (1kg), GOLDM (100g), SILVER (30kg), COPPER
                            (2500kg), ALUMINIUM, ZINC, LEAD, NICKEL, TIN
                          </span>
                          <span>
                            <span style={{ color: "#F2C94C" }}>ENERGY:</span>{" "}
                            CRUDEOIL (100 bbl), CRUDEOILM, NATURALGAS,
                            NATURALGASM
                          </span>
                          <span>
                            <span style={{ color: "#F2C94C" }}>AGRI:</span>{" "}
                            COTTON, MENTHAOIL, CARDAMOM, CASTORSEED, CPO, PEPPER
                          </span>
                        </div>
                      </div>
                    )}
                    {sec.extra === "cds" && (
                      <div className="flex flex-wrap gap-1">
                        {[
                          "USDINR",
                          "EURINR",
                          "GBPINR",
                          "JPYINR",
                          "EURUSD",
                          "GBPUSD",
                          "USDJPY",
                        ].map((p) => (
                          <span
                            key={p}
                            className="text-[10px] px-2 py-1 rounded"
                            style={{
                              background: "#0F1E35",
                              color: "#06B6D4",
                              border: "1px solid #1E3A4A",
                            }}
                          >
                            {p}
                          </span>
                        ))}
                        <span
                          className="text-[10px] mt-1 w-full"
                          style={{ color: "#6B7A8D" }}
                        >
                          Each pair: Futures (3 months) + Options (CE/PE)
                        </span>
                      </div>
                    )}
                    {sec.extra === "etf" && (
                      <div>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {[
                            "Index ETFs (48)",
                            "Gold ETFs (12)",
                            "Debt ETFs (18)",
                            "Sector ETFs (35)",
                            "International ETFs (22)",
                            "Silver ETF (8)",
                          ].map((c) => (
                            <span
                              key={c}
                              className="text-[10px] px-2 py-0.5 rounded"
                              style={{
                                background: "#0D2E1F",
                                color: "#00C087",
                                border: "1px solid #1A3D2A",
                              }}
                            >
                              {c}
                            </span>
                          ))}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {[
                            "NIFTYBEES",
                            "GOLDBEES",
                            "BANKBEES",
                            "JUNIORBEES",
                            "LIQUIDBEES",
                            "ITBEES",
                            "N100",
                            "SILVERBEES",
                            "PHARMABEES",
                            "CPSEETF",
                          ].map((e) => (
                            <span
                              key={e}
                              className="text-[9px] px-1.5 py-0.5 rounded"
                              style={{
                                background: "#121C2E",
                                color: "#9AA8C1",
                                border: "1px solid #1E2C44",
                              }}
                            >
                              {e}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </TabsContent>

        {/* ── INTERNATIONAL ── */}
        <TabsContent value="international">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {[
              {
                title: "US STOCKS",
                icon: <Globe size={14} />,
                color: "#3B82F6",
                count: "8,100 stocks",
                sources: ["SEC EDGAR", "Polygon.io", "Alpha Vantage"],
                items: [
                  ["NYSE", "3,400"],
                  ["NASDAQ", "4,200"],
                  ["AMEX", "500"],
                ],
                note: "S&P 500, NASDAQ 100, DOW 30 constituents tracked",
              },
              {
                title: "FOREX PAIRS",
                icon: <TrendingUp size={14} />,
                color: "#8B5CF6",
                count: "80 pairs",
                sources: ["OANDA API", "Alpha Vantage", "ExchangeRate-API"],
                items: [
                  ["Major", "7"],
                  ["Minor", "21"],
                  ["Exotic", "52"],
                ],
                note: "EUR/USD GBP/USD USD/JPY USD/CHF AUD/USD USD/CAD NZD/USD",
              },
              {
                title: "CRYPTOCURRENCY",
                icon: <Shield size={14} />,
                color: "#A78BFA",
                count: "4,820 trading pairs",
                sources: ["CoinGecko API", "Binance Exchange", "CoinMarketCap"],
                items: [
                  ["Layer 1", "48"],
                  ["Layer 2", "15"],
                  ["DeFi", "32"],
                  ["Meme", "18"],
                  ["AI Tokens", "12"],
                ],
                note: "BTC ETH SOL BNB ADA AVAX DOT MATIC + 13,000 more",
              },
              {
                title: "GLOBAL INDICES & COMMODITIES",
                icon: <Database size={14} />,
                color: "#F97316",
                count: "54 instruments",
                sources: ["Yahoo Finance", "Quandl", "Stooq"],
                items: [
                  ["Asia-Pacific", "10"],
                  ["Europe", "8"],
                  ["Americas", "8"],
                  ["ME & Africa", "4"],
                  ["Precious Metals", "6"],
                  ["Energy", "6"],
                  ["Agriculture", "9"],
                  ["Livestock", "3"],
                ],
                note: "NIFTY50 N225 HSI FTSE DAX CAC40 SPX WTI Brent Gold Silver",
              },
            ].map((panel) => (
              <div key={panel.title} className={card} style={cardStyle}>
                <div className="flex items-center gap-2 mb-3">
                  <span style={{ color: panel.color }}>{panel.icon}</span>
                  <span
                    className="text-xs font-bold tracking-widest"
                    style={{ color: panel.color }}
                  >
                    {panel.title}
                  </span>
                  <Badge
                    className="text-[9px] px-1.5 ml-auto"
                    style={{
                      background: "#0D2E1F",
                      color: "#00C087",
                      border: "none",
                    }}
                  >
                    ACTIVE
                  </Badge>
                </div>
                <div className="text-lg font-bold mb-2 text-white">
                  {panel.count}
                </div>
                <div className="flex flex-wrap gap-1 mb-3">
                  {panel.sources.map((s) => (
                    <span
                      key={s}
                      className="text-[9px] px-1.5 py-0.5 rounded"
                      style={{
                        background: "#121C2E",
                        color: "#9AA8C1",
                        border: "1px solid #1E2C44",
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-1 mb-3">
                  {panel.items.map(([label, val]) => (
                    <div
                      key={label}
                      className="flex justify-between text-[10px] px-2 py-1 rounded"
                      style={{ background: "#0B1424" }}
                    >
                      <span style={{ color: "#9AA8C1" }}>{label}</span>
                      <span
                        className="font-bold"
                        style={{ color: panel.color }}
                      >
                        {val}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-[10px]" style={{ color: "#6B7A8D" }}>
                  {panel.note}
                </p>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* ── BROKER TOKENS ── */}
        <TabsContent value="brokers">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            {[
              {
                name: "ZERODHA KITE",
                files: 6,
                mapped: 54280,
                total: 56120,
                rate: 96.7,
                format:
                  "instrument_token | exchange_token | tradingsymbol | name | expiry | strike | lot_size",
              },
              {
                name: "ANGEL ONE SMARTAPI",
                files: 1,
                mapped: 52100,
                total: 53600,
                rate: 97.2,
                format:
                  "token | symbol | name | expiry | strike | lotsize | instrumenttype | exch_seg",
              },
              {
                name: "UPSTOX",
                files: 1,
                mapped: 48920,
                total: 52000,
                rate: 94.1,
                format:
                  "instrument_key | exchange | trading_symbol | name | expiry | lot_size",
              },
            ].map((broker) => (
              <div key={broker.name} className={card} style={cardStyle}>
                <div className="flex items-center justify-between mb-3">
                  <span
                    className="text-xs font-bold tracking-widest"
                    style={{ color: "#F2C94C" }}
                  >
                    {broker.name}
                  </span>
                  <Badge
                    style={{
                      background: "#0D2E1F",
                      color: "#00C087",
                      border: "none",
                    }}
                    className="text-[9px]"
                  >
                    CONNECTED
                  </Badge>
                </div>
                <div className="text-2xl font-bold text-white mb-1">
                  {broker.rate}%
                </div>
                <div className="text-[10px] mb-2" style={{ color: "#9AA8C1" }}>
                  Mapping Rate
                </div>
                <Progress
                  value={broker.rate}
                  className="h-1.5 mb-3"
                  style={{ background: "#1E2C44" }}
                />
                <div className="flex justify-between text-[10px] mb-3">
                  <span style={{ color: "#00C087" }}>
                    Mapped: {broker.mapped.toLocaleString()}
                  </span>
                  <span style={{ color: "#F2415A" }}>
                    Unmapped: {(broker.total - broker.mapped).toLocaleString()}
                  </span>
                </div>
                <div
                  className="text-[9px] mb-3 p-2 rounded"
                  style={{
                    background: "#0B1424",
                    color: "#6B7A8D",
                    fontFamily: "monospace",
                  }}
                >
                  {broker.format}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full text-[10px] h-7"
                  style={{ borderColor: "#1E2C44", color: "#9AA8C1" }}
                >
                  <RefreshCw size={10} className="mr-1" /> Refresh Token Map
                </Button>
              </div>
            ))}
          </div>
          <div className={card} style={cardStyle}>
            <div
              className="text-xs font-bold tracking-widest mb-3"
              style={{ color: "#9AA8C1" }}
            >
              TOKEN MAPPING TABLE
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-[10px]">
                <thead>
                  <tr
                    style={{
                      color: "#6B7A8D",
                      borderBottom: "1px solid #1E2C44",
                    }}
                  >
                    {[
                      "Symbol",
                      "Exchange",
                      "Type",
                      "Zerodha Token",
                      "Angel Token",
                      "Upstox Key",
                      "Mapped",
                    ].map((h) => (
                      <th
                        key={h}
                        className="text-left py-2 pr-3 font-semibold uppercase"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {BROKER_TOKEN_TABLE.map((row) => (
                    <tr
                      key={row.symbol + row.exchange}
                      style={{
                        borderBottom: "1px solid #0F1A28",
                        color: row.mapped ? "white" : "#9AA8C1",
                      }}
                    >
                      <td
                        className="py-1.5 pr-3 font-mono font-bold"
                        style={{ color: "#F2C94C" }}
                      >
                        {row.symbol}
                      </td>
                      <td className="py-1.5 pr-3">
                        <span
                          className="px-1.5 py-0.5 rounded text-[9px] font-bold"
                          style={{
                            background: `${exchangeColor[row.exchange] ?? "#1E2C44"}22`,
                            color: exchangeColor[row.exchange] ?? "#9AA8C1",
                          }}
                        >
                          {row.exchange}
                        </span>
                      </td>
                      <td className="py-1.5 pr-3" style={{ color: "#9AA8C1" }}>
                        {row.type}
                      </td>
                      <td className="py-1.5 pr-3 font-mono">{row.zerodha}</td>
                      <td className="py-1.5 pr-3 font-mono">{row.angel}</td>
                      <td
                        className="py-1.5 pr-3 font-mono"
                        style={{ color: "#9AA8C1" }}
                      >
                        {row.upstox}
                      </td>
                      <td className="py-1.5">
                        {row.mapped ? (
                          <CheckCircle size={12} style={{ color: "#00C087" }} />
                        ) : (
                          <AlertTriangle
                            size={12}
                            style={{ color: "#F5A623" }}
                          />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        {/* ── SYNC SCHEDULE ── */}
        <TabsContent value="schedule">
          <div className={`${card} mb-4`} style={cardStyle}>
            <div
              className="text-xs font-bold tracking-widest mb-3"
              style={{ color: "#9AA8C1" }}
            >
              SYNC SCHEDULE
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-[10px]">
                <thead>
                  <tr
                    style={{
                      color: "#6B7A8D",
                      borderBottom: "1px solid #1E2C44",
                    }}
                  >
                    {[
                      "Source",
                      "Schedule",
                      "Next Run",
                      "Last Run",
                      "Duration",
                      "Status",
                    ].map((h) => (
                      <th
                        key={h}
                        className="text-left py-2 pr-4 font-semibold uppercase"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {SCHEDULE_ROWS.map((row) => (
                    <tr
                      key={row.source}
                      style={{ borderBottom: "1px solid #0F1A28" }}
                    >
                      <td className="py-2 pr-4 font-semibold text-white">
                        {row.source}
                      </td>
                      <td
                        className="py-2 pr-4 font-mono"
                        style={{ color: "#F2C94C" }}
                      >
                        {row.schedule}
                      </td>
                      <td className="py-2 pr-4" style={{ color: "#9AA8C1" }}>
                        {row.next}
                      </td>
                      <td className="py-2 pr-4" style={{ color: "#9AA8C1" }}>
                        {row.last}
                      </td>
                      <td className="py-2 pr-4" style={{ color: "#6B7A8D" }}>
                        {row.duration}
                      </td>
                      <td className="py-2">
                        <span
                          className="text-[9px] px-1.5 py-0.5 rounded font-bold"
                          style={{ background: "#0D2E1F", color: "#00C087" }}
                        >
                          ✓ {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className={card} style={cardStyle}>
            <div
              className="text-xs font-bold tracking-widest mb-3"
              style={{ color: "#F5A623" }}
            >
              ON SYNC FAILURE RULES
            </div>
            <ul className="space-y-2">
              {[
                "Retry 3 times with 5-minute gap",
                "Alert admin via Telegram if all retries fail",
                "Use previous day's data as fallback",
                "Log error with full stack trace and timestamps",
              ].map((rule) => (
                <li
                  key={rule}
                  className="flex items-center gap-2 text-xs"
                  style={{ color: "#9AA8C1" }}
                >
                  <Shield size={12} style={{ color: "#F5A623" }} />
                  {rule}
                </li>
              ))}
            </ul>
          </div>
        </TabsContent>

        {/* ── SYNC LOGS ── */}
        <TabsContent value="logs">
          <div className={card} style={cardStyle}>
            <div
              className="text-xs font-bold tracking-widest mb-3"
              style={{ color: "#9AA8C1" }}
            >
              SYNC LOG HISTORY
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-[10px]">
                <thead>
                  <tr
                    style={{
                      color: "#6B7A8D",
                      borderBottom: "1px solid #1E2C44",
                    }}
                  >
                    {[
                      "Sync ID",
                      "Exchange",
                      "Time",
                      "Fetched",
                      "Added",
                      "Updated",
                      "Removed",
                      "Status",
                      "",
                    ].map((h) => (
                      <th
                        key={h}
                        className="text-left py-2 pr-3 font-semibold uppercase"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {SYNC_LOGS.map((log) => (
                    <>
                      <tr
                        key={log.id}
                        style={{
                          borderBottom:
                            expandedLog === log.id
                              ? "none"
                              : "1px solid #0F1A28",
                        }}
                        className="hover:bg-white/5 cursor-pointer"
                        onClick={() =>
                          setExpandedLog(expandedLog === log.id ? null : log.id)
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ")
                            setExpandedLog(
                              expandedLog === log.id ? null : log.id,
                            );
                        }}
                        tabIndex={0}
                      >
                        <td
                          className="py-1.5 pr-3 font-mono"
                          style={{ color: "#6B7A8D" }}
                        >
                          {log.id}
                        </td>
                        <td className="py-1.5 pr-3">
                          <span
                            className="px-1.5 py-0.5 rounded text-[9px] font-bold"
                            style={{
                              background: `${exchangeColor[log.exchange] ?? "#1E2C44"}22`,
                              color: exchangeColor[log.exchange] ?? "#9AA8C1",
                            }}
                          >
                            {log.exchange}
                          </span>
                        </td>
                        <td
                          className="py-1.5 pr-3"
                          style={{ color: "#9AA8C1" }}
                        >
                          {log.time}
                        </td>
                        <td className="py-1.5 pr-3 font-semibold text-white">
                          {log.fetched.toLocaleString()}
                        </td>
                        <td
                          className="py-1.5 pr-3"
                          style={{ color: "#00C087" }}
                        >
                          +{log.added}
                        </td>
                        <td
                          className="py-1.5 pr-3"
                          style={{ color: "#F2C94C" }}
                        >
                          {log.updated}
                        </td>
                        <td
                          className="py-1.5 pr-3"
                          style={{
                            color: log.removed > 0 ? "#F2415A" : "#6B7A8D",
                          }}
                        >
                          {log.removed}
                        </td>
                        <td className="py-1.5 pr-3">{syncBadge(log.status)}</td>
                        <td className="py-1.5">
                          {log.errorLog &&
                            (expandedLog === log.id ? (
                              <ChevronUp
                                size={12}
                                style={{ color: "#9AA8C1" }}
                              />
                            ) : (
                              <ChevronDown
                                size={12}
                                style={{ color: "#9AA8C1" }}
                              />
                            ))}
                        </td>
                      </tr>
                      {expandedLog === log.id && log.errorLog && (
                        <tr
                          key={`${log.id}-err`}
                          style={{ borderBottom: "1px solid #0F1A28" }}
                        >
                          <td colSpan={9} className="py-2 px-3">
                            <div
                              className="rounded p-2 text-[10px] font-mono"
                              style={{
                                background: "#1A0A0C",
                                color: "#F2415A",
                                border: "1px solid #3D1A1E",
                              }}
                            >
                              {log.errorLog}
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        {/* ── MASTER DB ── */}
        <TabsContent value="master">
          {/* Search bar */}
          <div className="relative mb-4" ref={searchRef}>
            <div
              className="flex items-center gap-2 p-3 rounded-xl"
              style={{ background: "#0C1A30", border: "1px solid #1E2C44" }}
            >
              <Search size={16} style={{ color: "#9AA8C1" }} />
              <Input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setSearchDropdown(true);
                }}
                onFocus={() => setSearchDropdown(true)}
                placeholder="Search by symbol, company name, ISIN, sector..."
                className="flex-1 border-none bg-transparent text-white placeholder-[#6B7A8D] focus:ring-0 text-sm h-auto p-0"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setSearchDropdown(false);
                  }}
                >
                  <X size={14} style={{ color: "#9AA8C1" }} />
                </button>
              )}
            </div>
            {searchDropdown && suggestions.length > 0 && (
              <div
                className="absolute top-full left-0 right-0 z-50 mt-1 rounded-xl overflow-hidden"
                style={{ background: "#0C1A30", border: "1px solid #1E2C44" }}
              >
                {suggestions.map((inst) => (
                  <button
                    type="button"
                    key={inst.symbol}
                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-white/5 text-left"
                    onClick={() => {
                      setSearch(inst.symbol);
                      setSearchDropdown(false);
                      setSelectedInstrument(inst);
                    }}
                  >
                    <span
                      className="text-xs font-mono font-bold"
                      style={{ color: "#F2C94C", minWidth: 120 }}
                    >
                      {inst.symbol}
                    </span>
                    <span
                      className="text-[10px] px-1.5 py-0.5 rounded font-bold"
                      style={{
                        background: `${exchangeColor[inst.exchange] ?? "#1E2C44"}33`,
                        color: exchangeColor[inst.exchange] ?? "#9AA8C1",
                      }}
                    >
                      {inst.exchange}
                    </span>
                    <span
                      className="text-[10px]"
                      style={{ color: typeColor[inst.type] }}
                    >
                      {inst.type}
                    </span>
                    <span
                      className="text-[10px] flex-1"
                      style={{ color: "#9AA8C1" }}
                    >
                      {inst.name}
                    </span>
                  </button>
                ))}
              </div>
            )}
            {!search && searchDropdown && (
              <div
                className="absolute top-full left-0 right-0 z-50 mt-1 rounded-xl p-3"
                style={{ background: "#0C1A30", border: "1px solid #1E2C44" }}
              >
                <div
                  className="text-[9px] uppercase tracking-widest mb-2"
                  style={{ color: "#6B7A8D" }}
                >
                  Recent Searches
                </div>
                <div className="flex flex-wrap gap-1 mb-3">
                  {["RELIANCE", "NIFTY", "GOLD", "BTCUSDT", "EURUSD"].map(
                    (s) => (
                      <button
                        type="button"
                        key={s}
                        onClick={() => {
                          setSearch(s);
                        }}
                        className="text-[10px] px-2 py-0.5 rounded"
                        style={{
                          background: "#121C2E",
                          color: "#9AA8C1",
                          border: "1px solid #1E2C44",
                        }}
                      >
                        {s}
                      </button>
                    ),
                  )}
                </div>
                <div
                  className="text-[9px] uppercase tracking-widest mb-2"
                  style={{ color: "#6B7A8D" }}
                >
                  Trending
                </div>
                <div className="flex flex-wrap gap-1">
                  {[
                    "NIFTY 50 ↑",
                    "BANKNIFTY ↑",
                    "RELIANCE",
                    "HDFCBANK",
                    "INFY",
                  ].map((s) => (
                    <span
                      key={s}
                      className="text-[10px] px-2 py-0.5 rounded"
                      style={{
                        background: "#0D2E1F",
                        color: "#00C087",
                        border: "1px solid #1A3D2A",
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Filter pills */}
          <div className="flex flex-wrap gap-1 mb-4">
            <Filter size={12} style={{ color: "#9AA8C1", marginTop: 2 }} />
            {FILTER_OPTIONS.map((f) => (
              <button
                type="button"
                key={f}
                onClick={() => setActiveFilter(f)}
                className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider transition-colors"
                style={{
                  background: activeFilter === f ? "#F2C94C" : "#121C2E",
                  color: activeFilter === f ? "#000" : "#9AA8C1",
                  border: `1px solid ${activeFilter === f ? "#F2C94C" : "#1E2C44"}`,
                }}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className={card} style={cardStyle}>
            <div className="overflow-x-auto">
              <table className="w-full text-[10px]">
                <thead>
                  <tr
                    style={{
                      color: "#6B7A8D",
                      borderBottom: "1px solid #1E2C44",
                    }}
                  >
                    {[
                      "Symbol",
                      "Exch",
                      "Type",
                      "Name",
                      "Sector",
                      "Lot",
                      "Expiry",
                      "Strike",
                      "Opt",
                      "Tokens",
                      "Updated",
                      "Active",
                    ].map((h) => (
                      <th
                        key={h}
                        className="text-left py-2 pr-2 font-semibold uppercase whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((inst, i) => (
                    <tr
                      key={`${inst.symbol}-${i}`}
                      className="hover:bg-white/5 cursor-pointer"
                      style={{ borderBottom: "1px solid #0F1A28" }}
                      onClick={() => setSelectedInstrument(inst)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ")
                          setSelectedInstrument(inst);
                      }}
                      tabIndex={0}
                    >
                      <td
                        className="py-1.5 pr-2 font-mono font-bold whitespace-nowrap"
                        style={{ color: "#F2C94C" }}
                      >
                        {inst.symbol}
                      </td>
                      <td className="py-1.5 pr-2">
                        <span
                          className="px-1 py-0.5 rounded text-[9px] font-bold"
                          style={{
                            background: `${exchangeColor[inst.exchange] ?? "#1E2C44"}22`,
                            color: exchangeColor[inst.exchange] ?? "#9AA8C1",
                          }}
                        >
                          {inst.exchange}
                        </span>
                      </td>
                      <td className="py-1.5 pr-2">
                        <span
                          style={{ color: typeColor[inst.type] ?? "#9AA8C1" }}
                        >
                          {inst.type}
                        </span>
                      </td>
                      <td
                        className="py-1.5 pr-2 max-w-[140px] truncate"
                        style={{ color: "#C8D4E3" }}
                        title={inst.name}
                      >
                        {inst.name}
                      </td>
                      <td
                        className="py-1.5 pr-2 whitespace-nowrap"
                        style={{ color: "#9AA8C1" }}
                      >
                        {inst.sector}
                      </td>
                      <td
                        className="py-1.5 pr-2 font-mono"
                        style={{ color: "#9AA8C1" }}
                      >
                        {inst.lotSize}
                      </td>
                      <td
                        className="py-1.5 pr-2 whitespace-nowrap"
                        style={{
                          color: inst.expiry === "-" ? "#3D4F66" : "#9AA8C1",
                        }}
                      >
                        {inst.expiry}
                      </td>
                      <td
                        className="py-1.5 pr-2 font-mono"
                        style={{
                          color: inst.strike === "-" ? "#3D4F66" : "#F59E0B",
                        }}
                      >
                        {inst.strike}
                      </td>
                      <td className="py-1.5 pr-2">
                        {inst.optType !== "-" && (
                          <span
                            className="px-1 py-0.5 rounded text-[9px] font-bold"
                            style={{
                              background:
                                inst.optType === "CE" ? "#0D2E1F" : "#2E0D12",
                              color:
                                inst.optType === "CE" ? "#00C087" : "#F2415A",
                            }}
                          >
                            {inst.optType}
                          </span>
                        )}
                      </td>
                      <td
                        className="py-1.5 pr-2 font-mono text-[9px]"
                        style={{ color: "#00C087" }}
                      >
                        {inst.tokens}
                      </td>
                      <td
                        className="py-1.5 pr-2 whitespace-nowrap"
                        style={{ color: "#6B7A8D" }}
                      >
                        {inst.updated}
                      </td>
                      <td className="py-1.5">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{
                            background: inst.active ? "#00C087" : "#F2415A",
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div
              className="mt-3 flex items-center justify-between text-[10px]"
              style={{ color: "#6B7A8D" }}
            >
              <span>Showing {filtered.length} of 58,420 instruments</span>
              <span>Page 1 of 1,169 | 50 per page</span>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* ── Instrument Detail Drawer ── */}
      {selectedInstrument && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.7)" }}
          onClick={() => setSelectedInstrument(null)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setSelectedInstrument(null);
          }}
          role="presentation"
        >
          <div
            className="w-full max-w-lg rounded-2xl p-6"
            style={{ background: "#0C1A30", border: "1px solid #1E2C44" }}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <div
                  className="text-lg font-bold font-mono"
                  style={{ color: "#F2C94C" }}
                >
                  {selectedInstrument.symbol}
                </div>
                <div className="text-xs" style={{ color: "#9AA8C1" }}>
                  {selectedInstrument.name}
                </div>
              </div>
              <button type="button" onClick={() => setSelectedInstrument(null)}>
                <X size={18} style={{ color: "#9AA8C1" }} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              {[
                ["Exchange", selectedInstrument.exchange],
                ["Type", selectedInstrument.type],
                ["Sector", selectedInstrument.sector],
                ["Lot Size", String(selectedInstrument.lotSize)],
                ["Expiry", selectedInstrument.expiry],
                ["Strike", selectedInstrument.strike],
                ["Option Type", selectedInstrument.optType],
                ["Broker Tokens", selectedInstrument.tokens],
                ["Last Updated", selectedInstrument.updated],
                ["Status", selectedInstrument.active ? "Active" : "Inactive"],
              ].map(([label, value]) => (
                <div key={label}>
                  <div
                    className="text-[9px] uppercase tracking-wider mb-0.5"
                    style={{ color: "#6B7A8D" }}
                  >
                    {label}
                  </div>
                  <div
                    className="font-medium"
                    style={{
                      color:
                        value === "Active"
                          ? "#00C087"
                          : value === "Inactive"
                            ? "#F2415A"
                            : "white",
                    }}
                  >
                    {value}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <Button
                size="sm"
                className="flex-1 text-xs font-bold"
                style={{ background: "#F2C94C", color: "#000" }}
              >
                Add to Watchlist
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1 text-xs"
                style={{ borderColor: "#1E2C44", color: "#9AA8C1" }}
              >
                Open Chart
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
