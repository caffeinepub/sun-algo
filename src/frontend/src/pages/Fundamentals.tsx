import {
  Activity,
  BarChart2,
  Bitcoin,
  BookOpen,
  Building2,
  CheckCircle,
  Clock,
  DollarSign,
  Globe,
  RefreshCw,
  Search,
  Shield,
  TrendingDown,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
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
interface StatCard {
  label: string;
  value: string;
  sub?: string;
  color?: string;
}

interface QuarterResult {
  quarter: string;
  revenue: string;
  ebitda: string;
  pat: string;
  eps: string;
  vsEst: string;
  vsPY: string;
  beat: boolean | null;
}

interface CentralBank {
  bank: string;
  governor: string;
  rate: string;
  lastChange: string;
  nextMeeting: string;
  tone: "HAWKISH" | "DOVISH" | "NEUTRAL";
}

// ─── Static Data ──────────────────────────────────────────────────────────────
const QUARTERLY_RESULTS: QuarterResult[] = [
  {
    quarter: "Q4 FY26",
    revenue: "2,38,402",
    ebitda: "54,096",
    pat: "22,982",
    eps: "33.9",
    vsEst: "+8.2%",
    vsPY: "+6.8%",
    beat: true,
  },
  {
    quarter: "Q3 FY26",
    revenue: "2,26,840",
    ebitda: "51,487",
    pat: "21,648",
    eps: "32.0",
    vsEst: "+2.1%",
    vsPY: "+4.2%",
    beat: true,
  },
  {
    quarter: "Q2 FY26",
    revenue: "2,19,104",
    ebitda: "49,820",
    pat: "20,874",
    eps: "30.8",
    vsEst: "-1.2%",
    vsPY: "+2.4%",
    beat: false,
  },
  {
    quarter: "Q1 FY26",
    revenue: "2,11,608",
    ebitda: "48,240",
    pat: "20,481",
    eps: "30.2",
    vsEst: "+4.5%",
    vsPY: "+5.1%",
    beat: true,
  },
  {
    quarter: "Q4 FY25",
    revenue: "2,03,847",
    ebitda: "46,984",
    pat: "21,527",
    eps: "31.8",
    vsEst: "-0.8%",
    vsPY: "+2.9%",
    beat: false,
  },
  {
    quarter: "Q3 FY25",
    revenue: "2,06,419",
    ebitda: "47,204",
    pat: "20,758",
    eps: "30.7",
    vsEst: "+1.4%",
    vsPY: "+3.2%",
    beat: true,
  },
  {
    quarter: "Q2 FY25",
    revenue: "1,98,472",
    ebitda: "45,410",
    pat: "20,397",
    eps: "30.1",
    vsEst: "+0.9%",
    vsPY: "+1.8%",
    beat: true,
  },
  {
    quarter: "Q1 FY25",
    revenue: "1,90,404",
    ebitda: "43,924",
    pat: "19,488",
    eps: "28.8",
    vsEst: "+3.1%",
    vsPY: "+4.7%",
    beat: true,
  },
];

const SHAREHOLDING = [
  {
    quarter: "Q4 FY26",
    promoter: "50.3%",
    fii: "23.1%",
    dii: "18.4%",
    public: "8.2%",
  },
  {
    quarter: "Q3 FY26",
    promoter: "50.3%",
    fii: "22.8%",
    dii: "18.7%",
    public: "8.2%",
  },
  {
    quarter: "Q2 FY26",
    promoter: "50.3%",
    fii: "22.4%",
    dii: "19.1%",
    public: "8.2%",
  },
  {
    quarter: "Q1 FY26",
    promoter: "50.3%",
    fii: "21.9%",
    dii: "19.6%",
    public: "8.2%",
  },
];

const CENTRAL_BANKS: CentralBank[] = [
  {
    bank: "US Fed",
    governor: "Jerome Powell",
    rate: "5.25%",
    lastChange: "-25bps Nov 2025",
    nextMeeting: "May 7, 2026",
    tone: "HAWKISH",
  },
  {
    bank: "ECB",
    governor: "Christine Lagarde",
    rate: "3.40%",
    lastChange: "-25bps Mar 2026",
    nextMeeting: "Apr 17, 2026",
    tone: "DOVISH",
  },
  {
    bank: "Bank of England",
    governor: "Andrew Bailey",
    rate: "5.00%",
    lastChange: "-25bps Feb 2026",
    nextMeeting: "May 8, 2026",
    tone: "NEUTRAL",
  },
  {
    bank: "Bank of Japan",
    governor: "Kazuo Ueda",
    rate: "0.50%",
    lastChange: "+25bps Jan 2026",
    nextMeeting: "Apr 30, 2026",
    tone: "HAWKISH",
  },
  {
    bank: "RBA",
    governor: "Michele Bullock",
    rate: "4.35%",
    lastChange: "-25bps Mar 2026",
    nextMeeting: "Apr 1, 2026",
    tone: "NEUTRAL",
  },
  {
    bank: "RBI",
    governor: "Sanjay Malhotra",
    rate: "6.25%",
    lastChange: "-25bps Feb 2026",
    nextMeeting: "Apr 9, 2026",
    tone: "NEUTRAL",
  },
];

const SYNC_SCHEDULE = [
  {
    dataType: "Indian Stock Prices",
    source: "NSE/BSE",
    freq: "Every 15 min",
    lastUpdate: "2 min ago",
  },
  {
    dataType: "Quarterly Results",
    source: "NSE/BSE Filing",
    freq: "On announcement",
    lastUpdate: "Apr 13",
  },
  {
    dataType: "Shareholding Pattern",
    source: "NSE/BSE",
    freq: "Quarterly",
    lastUpdate: "Q4FY26",
  },
  {
    dataType: "Analyst Targets",
    source: "Various brokers",
    freq: "Daily 8 AM",
    lastUpdate: "Today 8:02 AM",
  },
  {
    dataType: "On-Chain Metrics",
    source: "Glassnode",
    freq: "Every 1 hour",
    lastUpdate: "34 min ago",
  },
  {
    dataType: "Forex Macro Data",
    source: "FRED / CB sites",
    freq: "Daily",
    lastUpdate: "Today 7:00 AM",
  },
  {
    dataType: "Crude Oil EIA Report",
    source: "EIA.gov",
    freq: "Weekly Wed",
    lastUpdate: "Apr 2",
  },
  {
    dataType: "Gold WGC Data",
    source: "World Gold Council",
    freq: "Quarterly",
    lastUpdate: "Q4 2025",
  },
];

// ─── Helper Components ───────────────────────────────────────────────────────────
function StatGrid({ stats }: { stats: StatCard[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
      {stats.map((s) => (
        <div
          key={s.label}
          className="rounded-lg p-3"
          style={{ background: "#111E33", border: "1px solid #1E2C44" }}
        >
          <div
            className="text-[10px] uppercase tracking-wider mb-1"
            style={{ color: "#9AA8C1" }}
          >
            {s.label}
          </div>
          <div
            className="text-sm font-bold"
            style={{ color: s.color ?? "#EAF0FF" }}
          >
            {s.value}
          </div>
          {s.sub && (
            <div className="text-[10px] mt-0.5" style={{ color: "#9AA8C1" }}>
              {s.sub}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function SectionTitle({
  icon,
  title,
}: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <div style={{ color: "#F2C94C" }}>{icon}</div>
      <h3
        className="text-xs font-bold uppercase tracking-widest"
        style={{ color: "#EAF0FF" }}
      >
        {title}
      </h3>
    </div>
  );
}

function ToneBadge({ tone }: { tone: "HAWKISH" | "DOVISH" | "NEUTRAL" }) {
  const map = {
    HAWKISH: { bg: "rgba(255,90,95,0.12)", color: "#FF5A5F" },
    DOVISH: { bg: "rgba(0,192,135,0.12)", color: "#00C087" },
    NEUTRAL: { bg: "rgba(154,168,193,0.12)", color: "#9AA8C1" },
  };
  const s = map[tone];
  return (
    <span
      className="text-[10px] font-bold px-2 py-0.5 rounded"
      style={{ background: s.bg, color: s.color }}
    >
      {tone}
    </span>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Fundamentals() {
  const [searchQuery, setSearchQuery] = useState("");
  const [countdown, setCountdown] = useState(780); // seconds
  const [lastUpdated, setLastUpdated] = useState(120);

  // Countdown timers
  useEffect(() => {
    const iv = setInterval(() => {
      setCountdown((c) => (c <= 1 ? 900 : c - 1));
      setLastUpdated((u) => u + 1);
    }, 1000);
    return () => clearInterval(iv);
  }, []);

  const fmtTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s.toString().padStart(2, "0")}s`;
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
              <BookOpen className="w-7 h-7" style={{ color: "#F2C94C" }} />
              <h1
                className="text-2xl font-bold tracking-widest uppercase"
                style={{ color: "#EAF0FF" }}
              >
                Fundamental Data Engine
              </h1>
            </div>
            <p className="text-sm" style={{ color: "#9AA8C1" }}>
              Live fundamental data for stocks, crypto, forex & commodities
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div
              className="px-4 py-2 rounded-xl text-center"
              style={{ background: "#0C1A30", border: "1px solid #1E2C44" }}
            >
              <div className="text-xs" style={{ color: "#9AA8C1" }}>
                Updated {fmtTime(lastUpdated)} ago
              </div>
              <div className="text-xs" style={{ color: "#F2C94C" }}>
                Next in {fmtTime(countdown)}
              </div>
            </div>
            <Button
              size="sm"
              className="gap-2"
              style={{ background: "#F2C94C", color: "#0B1424" }}
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
          </div>
        </div>

        {/* ── Instrument Search ── */}
        <div
          className="rounded-xl p-4"
          style={{ background: "#0C1A30", border: "1px solid #1E2C44" }}
        >
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
              style={{ color: "#9AA8C1" }}
            />
            <Input
              data-ocid="fundamentals.search_input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search instrument to view fundamentals (e.g. RELIANCE, BTC, EUR/USD, GOLD)"
              className="pl-9 h-10 text-sm"
              style={{
                background: "#111E33",
                border: "1px solid #24344F",
                color: "#EAF0FF",
              }}
            />
          </div>
          <div className="flex flex-wrap items-center gap-3 mt-3">
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ background: "#F2C94C" }}
              />
              <span className="text-sm font-bold" style={{ color: "#EAF0FF" }}>
                RELIANCE (NSE)
              </span>
              <span className="text-sm" style={{ color: "#9AA8C1" }}>
                — Reliance Industries Ltd
              </span>
            </div>
            <div
              className="ml-auto flex items-center gap-3 text-xs"
              style={{ color: "#9AA8C1" }}
            >
              <span>
                <CheckCircle
                  className="inline w-3 h-3 mr-1"
                  style={{ color: "#00C087" }}
                />
                Live data
              </span>
              <span>Last updated: {fmtTime(lastUpdated)} ago</span>
              <span style={{ color: "#F2C94C" }}>
                Next update: {fmtTime(countdown)}
              </span>
            </div>
          </div>
        </div>

        {/* ── Main Tabs ── */}
        <Tabs defaultValue="stocks">
          <TabsList
            className="flex flex-wrap gap-1 h-auto p-1 rounded-xl mb-4"
            style={{ background: "#0C1A30", border: "1px solid #1E2C44" }}
          >
            {[
              {
                value: "stocks",
                label: "Stocks (Indian & US)",
                icon: <BarChart2 className="w-3.5 h-3.5" />,
              },
              {
                value: "crypto",
                label: "Crypto",
                icon: <Bitcoin className="w-3.5 h-3.5" />,
              },
              {
                value: "forex",
                label: "Forex & Macro",
                icon: <Globe className="w-3.5 h-3.5" />,
              },
              {
                value: "commodities",
                label: "Commodities",
                icon: <TrendingUp className="w-3.5 h-3.5" />,
              },
            ].map((t) => (
              <TabsTrigger
                key={t.value}
                value={t.value}
                data-ocid="fundamentals.tab"
                className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide px-3 py-1.5 rounded-lg data-[state=active]:text-[#0B1424]"
                style={{ color: "#9AA8C1" }}
              >
                {t.icon}
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* ===================== STOCKS TAB ===================== */}
          <TabsContent value="stocks" data-ocid="fundamentals.panel">
            <div className="space-y-4">
              {/* Company Overview */}
              <div
                className="rounded-xl p-5"
                style={{ background: "#0C1A30", border: "1px solid #1E2C44" }}
              >
                <SectionTitle
                  icon={<Building2 className="w-4 h-4" />}
                  title="Company Overview"
                />
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                      {[
                        ["Company", "Reliance Industries Ltd"],
                        ["Sector", "Energy"],
                        ["Industry", "Oil & Gas Refining"],
                        ["Founded", "1966"],
                        ["HQ", "Mumbai, Maharashtra"],
                        ["Employees", "2,36,334"],
                        ["Website", "www.ril.com"],
                        ["Auditor", "Deloitte Haskins & Sells"],
                        ["Registrar", "KFin Technologies"],
                      ].map(([k, v]) => (
                        <div key={k} className="flex gap-2">
                          <span
                            style={{ color: "#9AA8C1" }}
                            className="w-24 shrink-0"
                          >
                            {k}:
                          </span>
                          <span
                            style={{ color: "#EAF0FF" }}
                            className="font-semibold"
                          >
                            {v}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div
                      className="text-[10px] uppercase tracking-wider mb-2"
                      style={{ color: "#9AA8C1" }}
                    >
                      Business Overview
                    </div>
                    <p
                      className="text-xs leading-relaxed"
                      style={{ color: "#EAF0FF" }}
                    >
                      Reliance Industries Limited is India's largest private
                      sector company and a Fortune Global 500 conglomerate. The
                      company has diversified business interests spanning
                      energy, petrochemicals, natural gas, retail,
                      telecommunications, and digital services through
                      subsidiaries Jio and Reliance Retail.
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <div
                        className="text-[10px] px-2 py-1 rounded"
                        style={{
                          background: "#111E33",
                          color: "#9AA8C1",
                          border: "1px solid #1E2C44",
                        }}
                      >
                        Chairman: Mukesh D. Ambani
                      </div>
                      <div
                        className="text-[10px] px-2 py-1 rounded"
                        style={{
                          background: "#111E33",
                          color: "#9AA8C1",
                          border: "1px solid #1E2C44",
                        }}
                      >
                        CFO: Srinivasan V.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Market Data */}
              <div
                className="rounded-xl p-5"
                style={{ background: "#0C1A30", border: "1px solid #1E2C44" }}
              >
                <SectionTitle
                  icon={<DollarSign className="w-4 h-4" />}
                  title="Market Data"
                />
                <StatGrid
                  stats={[
                    {
                      label: "Market Cap",
                      value: "\u20b919.2L Cr",
                      sub: "Large Cap",
                      color: "#F2C94C",
                    },
                    {
                      label: "Enterprise Value",
                      value: "\u20b921.4L Cr",
                      color: "#EAF0FF",
                    },
                    {
                      label: "Shares Outstanding",
                      value: "676.2 Cr",
                      color: "#EAF0FF",
                    },
                    { label: "Free Float", value: "52.3%", color: "#EAF0FF" },
                    {
                      label: "Promoter Holding",
                      value: "50.3%",
                      color: "#F2C94C",
                    },
                    { label: "FII Holding", value: "23.1%", color: "#EAF0FF" },
                    { label: "DII Holding", value: "18.4%", color: "#EAF0FF" },
                    {
                      label: "Public Holding",
                      value: "8.2%",
                      color: "#EAF0FF",
                    },
                    {
                      label: "52W High",
                      value: "\u20b93,024",
                      color: "#00C087",
                    },
                    {
                      label: "52W Low",
                      value: "\u20b92,184",
                      color: "#FF5A5F",
                    },
                    {
                      label: "All Time High",
                      value: "\u20b93,217",
                      color: "#00C087",
                    },
                    { label: "Beta vs NIFTY", value: "1.12", color: "#EAF0FF" },
                    {
                      label: "Avg Vol 30D",
                      value: "1.24 Cr",
                      sub: "shares/day",
                      color: "#EAF0FF",
                    },
                    {
                      label: "CMP",
                      value: "\u20b92,840",
                      sub: "+1.2% today",
                      color: "#00C087",
                    },
                  ]}
                />
              </div>

              {/* Valuation Ratios */}
              <div
                className="rounded-xl p-5"
                style={{ background: "#0C1A30", border: "1px solid #1E2C44" }}
              >
                <SectionTitle
                  icon={<BarChart2 className="w-4 h-4" />}
                  title="Valuation Ratios"
                />
                <StatGrid
                  stats={[
                    {
                      label: "P/E Ratio (TTM)",
                      value: "27.4x",
                      color: "#EAF0FF",
                    },
                    { label: "Forward P/E", value: "22.1x", color: "#EAF0FF" },
                    { label: "P/B Ratio", value: "2.34x", color: "#EAF0FF" },
                    { label: "P/S Ratio", value: "1.89x", color: "#EAF0FF" },
                    { label: "EV/EBITDA", value: "14.2x", color: "#EAF0FF" },
                    { label: "EV/Sales", value: "1.93x", color: "#EAF0FF" },
                    { label: "PEG Ratio", value: "1.4", color: "#EAF0FF" },
                    { label: "Price/CF", value: "18.2x", color: "#EAF0FF" },
                    {
                      label: "Dividend Yield",
                      value: "0.38%",
                      color: "#F2C94C",
                    },
                    {
                      label: "Earnings Yield",
                      value: "3.65%",
                      color: "#EAF0FF",
                    },
                    {
                      label: "Dividend Payout",
                      value: "10.4%",
                      color: "#EAF0FF",
                    },
                  ]}
                />
              </div>

              {/* Financial Health + Profitability */}
              <div className="grid md:grid-cols-2 gap-4">
                <div
                  className="rounded-xl p-5"
                  style={{ background: "#0C1A30", border: "1px solid #1E2C44" }}
                >
                  <SectionTitle
                    icon={<Shield className="w-4 h-4" />}
                    title="Financial Health"
                  />
                  <StatGrid
                    stats={[
                      { label: "Debt/Equity", value: "0.42", color: "#00C087" },
                      {
                        label: "Current Ratio",
                        value: "1.34",
                        color: "#00C087",
                      },
                      { label: "Quick Ratio", value: "0.89", color: "#F2C94C" },
                      {
                        label: "Interest Coverage",
                        value: "8.4x",
                        color: "#00C087",
                      },
                      {
                        label: "Cash & Equiv.",
                        value: "\u20b91.87L Cr",
                        color: "#00C087",
                      },
                      {
                        label: "Net Debt",
                        value: "\u20b91.24L Cr",
                        color: "#FF5A5F",
                      },
                      {
                        label: "Working Capital",
                        value: "\u20b934,210 Cr",
                        color: "#EAF0FF",
                      },
                      { label: "Debt/Assets", value: "0.18", color: "#00C087" },
                    ]}
                  />
                </div>
                <div
                  className="rounded-xl p-5"
                  style={{ background: "#0C1A30", border: "1px solid #1E2C44" }}
                >
                  <SectionTitle
                    icon={<TrendingUp className="w-4 h-4" />}
                    title="Profitability"
                  />
                  <StatGrid
                    stats={[
                      { label: "ROE", value: "9.8%", color: "#00C087" },
                      { label: "ROA", value: "4.2%", color: "#00C087" },
                      { label: "ROCE", value: "11.3%", color: "#00C087" },
                      { label: "ROIC", value: "8.7%", color: "#00C087" },
                      {
                        label: "Gross Margin",
                        value: "23.4%",
                        color: "#EAF0FF",
                      },
                      { label: "Op. Margin", value: "18.2%", color: "#EAF0FF" },
                      { label: "Net Margin", value: "9.1%", color: "#EAF0FF" },
                      {
                        label: "EBITDA Margin",
                        value: "22.7%",
                        color: "#EAF0FF",
                      },
                    ]}
                  />
                </div>
              </div>

              {/* Growth Metrics */}
              <div
                className="rounded-xl p-5"
                style={{ background: "#0C1A30", border: "1px solid #1E2C44" }}
              >
                <SectionTitle
                  icon={<Zap className="w-4 h-4" />}
                  title="Growth Metrics"
                />
                <StatGrid
                  stats={[
                    { label: "Revenue YoY", value: "+8.4%", color: "#00C087" },
                    { label: "Revenue QoQ", value: "+2.1%", color: "#00C087" },
                    { label: "PAT YoY", value: "+6.8%", color: "#00C087" },
                    {
                      label: "EPS Growth YoY",
                      value: "+7.2%",
                      color: "#00C087",
                    },
                    { label: "3Y Rev CAGR", value: "14.2%", color: "#F2C94C" },
                    { label: "5Y Rev CAGR", value: "11.8%", color: "#F2C94C" },
                    {
                      label: "3Y Profit CAGR",
                      value: "9.4%",
                      color: "#F2C94C",
                    },
                    { label: "PAT QoQ", value: "+6.2%", color: "#00C087" },
                  ]}
                />
              </div>

              {/* Quarterly Results */}
              <div
                className="rounded-xl overflow-hidden"
                style={{ border: "1px solid #1E2C44" }}
              >
                <div
                  className="px-5 py-3 flex items-center gap-2"
                  style={{
                    background: "#111E33",
                    borderBottom: "1px solid #1E2C44",
                  }}
                >
                  <Activity className="w-4 h-4" style={{ color: "#F2C94C" }} />
                  <span
                    className="text-sm font-bold uppercase tracking-widest"
                    style={{ color: "#EAF0FF" }}
                  >
                    Quarterly Results — Last 8 Quarters
                  </span>
                  <span
                    className="ml-auto text-[10px] px-2 py-0.5 rounded"
                    style={{
                      background: "rgba(0,192,135,0.12)",
                      color: "#00C087",
                    }}
                  >
                    Beat 5/8 Quarters
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table
                    className="w-full text-xs"
                    data-ocid="fundamentals.table"
                  >
                    <thead>
                      <tr
                        style={{
                          background: "#0C1A30",
                          borderBottom: "1px solid #1E2C44",
                        }}
                      >
                        {[
                          "Quarter",
                          "Revenue (\u20b9Cr)",
                          "EBITDA",
                          "PAT",
                          "EPS",
                          "vs Estimate",
                          "vs PY Qtr",
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
                      {QUARTERLY_RESULTS.map((r, i) => (
                        <tr
                          key={r.quarter}
                          data-ocid={`fundamentals.row.${i + 1}`}
                          className="hover:bg-white/[0.02]"
                          style={{
                            borderBottom: "1px solid #1E2C44",
                            background:
                              i % 2 === 0 ? "transparent" : "#111E3310",
                          }}
                        >
                          <td
                            className="px-3 py-2.5 font-bold"
                            style={{ color: "#EAF0FF" }}
                          >
                            {r.quarter}
                          </td>
                          <td
                            className="px-3 py-2.5 font-mono"
                            style={{ color: "#EAF0FF" }}
                          >
                            {r.revenue}
                          </td>
                          <td
                            className="px-3 py-2.5 font-mono"
                            style={{ color: "#9AA8C1" }}
                          >
                            {r.ebitda}
                          </td>
                          <td
                            className="px-3 py-2.5 font-mono font-bold"
                            style={{ color: "#F2C94C" }}
                          >
                            {r.pat}
                          </td>
                          <td
                            className="px-3 py-2.5 font-mono"
                            style={{ color: "#9AA8C1" }}
                          >
                            {r.eps}
                          </td>
                          <td
                            className="px-3 py-2.5 font-bold"
                            style={{
                              color:
                                r.beat === true
                                  ? "#00C087"
                                  : r.beat === false
                                    ? "#FF5A5F"
                                    : "#9AA8C1",
                            }}
                          >
                            {r.vsEst}{" "}
                            {r.beat === true
                              ? "✔ BEAT"
                              : r.beat === false
                                ? "✘ MISS"
                                : ""}
                          </td>
                          <td
                            className="px-3 py-2.5 font-bold"
                            style={{
                              color: r.vsPY.startsWith("+")
                                ? "#00C087"
                                : "#FF5A5F",
                            }}
                          >
                            {r.vsPY}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Shareholding Pattern */}
              <div
                className="rounded-xl overflow-hidden"
                style={{ border: "1px solid #1E2C44" }}
              >
                <div
                  className="px-5 py-3"
                  style={{
                    background: "#111E33",
                    borderBottom: "1px solid #1E2C44",
                  }}
                >
                  <span
                    className="text-sm font-bold uppercase tracking-widest"
                    style={{ color: "#EAF0FF" }}
                  >
                    Shareholding Pattern — Quarterly Trend
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
                      {["Quarter", "Promoter", "FII", "DII", "Public"].map(
                        (h) => (
                          <th
                            key={h}
                            className="px-4 py-2.5 text-left font-semibold uppercase tracking-wider"
                            style={{ color: "#9AA8C1" }}
                          >
                            {h}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {SHAREHOLDING.map((row, i) => (
                      <tr
                        key={row.quarter}
                        data-ocid={`fundamentals.row.${i + 1}`}
                        className="hover:bg-white/[0.02]"
                        style={{ borderBottom: "1px solid #1E2C44" }}
                      >
                        <td
                          className="px-4 py-2.5 font-bold"
                          style={{ color: "#EAF0FF" }}
                        >
                          {row.quarter}
                        </td>
                        <td
                          className="px-4 py-2.5 font-bold"
                          style={{ color: "#F2C94C" }}
                        >
                          {row.promoter}
                        </td>
                        <td
                          className="px-4 py-2.5"
                          style={{ color: "#EAF0FF" }}
                        >
                          {row.fii}
                        </td>
                        <td
                          className="px-4 py-2.5"
                          style={{ color: "#EAF0FF" }}
                        >
                          {row.dii}
                        </td>
                        <td
                          className="px-4 py-2.5"
                          style={{ color: "#9AA8C1" }}
                        >
                          {row.public}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Corporate Actions */}
              <div className="grid md:grid-cols-2 gap-4">
                <div
                  className="rounded-xl p-5"
                  style={{ background: "#0C1A30", border: "1px solid #1E2C44" }}
                >
                  <SectionTitle
                    icon={<Clock className="w-4 h-4" />}
                    title="Upcoming Corporate Actions"
                  />
                  <div className="space-y-2">
                    <div
                      className="flex items-center justify-between p-3 rounded-lg"
                      style={{
                        background: "#111E33",
                        border: "1px solid #1E2C44",
                      }}
                    >
                      <div>
                        <div
                          className="text-xs font-bold"
                          style={{ color: "#F2C94C" }}
                        >
                          Dividend ₹10/share
                        </div>
                        <div
                          className="text-[10px]"
                          style={{ color: "#9AA8C1" }}
                        >
                          Interim | Record Date: Apr 28, 2026
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className="text-[10px] border-[#24344F]"
                        style={{ color: "#00C087" }}
                      >
                        UPCOMING
                      </Badge>
                    </div>
                    <div
                      className="flex items-center justify-between p-3 rounded-lg"
                      style={{
                        background: "#111E33",
                        border: "1px solid #1E2C44",
                      }}
                    >
                      <div>
                        <div
                          className="text-xs font-bold"
                          style={{ color: "#EAF0FF" }}
                        >
                          AGM
                        </div>
                        <div
                          className="text-[10px]"
                          style={{ color: "#9AA8C1" }}
                        >
                          Annual General Meeting | Jun 12, 2026
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className="text-[10px] border-[#24344F] text-[#9AA8C1]"
                      >
                        SCHEDULED
                      </Badge>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div
                      className="text-[10px] uppercase tracking-wider mb-2"
                      style={{ color: "#9AA8C1" }}
                    >
                      Dividend History (Last 4 Years)
                    </div>
                    <div className="space-y-1">
                      {[
                        { year: "FY25", amount: "\u20b99.00", type: "Final" },
                        { year: "FY24", amount: "\u20b910.00", type: "Final" },
                        { year: "FY23", amount: "\u20b98.00", type: "Final" },
                        { year: "FY22", amount: "\u20b97.00", type: "Final" },
                      ].map((d) => (
                        <div
                          key={d.year}
                          className="flex items-center justify-between text-xs"
                        >
                          <span style={{ color: "#9AA8C1" }}>{d.year}</span>
                          <span
                            style={{ color: "#F2C94C" }}
                            className="font-bold"
                          >
                            {d.amount}
                          </span>
                          <span style={{ color: "#9AA8C1" }}>{d.type}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Analyst Consensus */}
                <div
                  className="rounded-xl p-5"
                  style={{ background: "#0C1A30", border: "1px solid #1E2C44" }}
                >
                  <SectionTitle
                    icon={<Users className="w-4 h-4" />}
                    title="Analyst Consensus"
                  />
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs" style={{ color: "#9AA8C1" }}>
                        28 analysts covering
                      </span>
                      <span
                        className="text-sm font-bold px-3 py-1 rounded"
                        style={{
                          background: "rgba(0,192,135,0.15)",
                          color: "#00C087",
                        }}
                      >
                        OUTPERFORM
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      {[
                        { label: "BUY", count: 18, color: "#00C087" },
                        { label: "HOLD", count: 7, color: "#F2C94C" },
                        { label: "SELL", count: 3, color: "#FF5A5F" },
                      ].map((a) => (
                        <div
                          key={a.label}
                          className="rounded-lg p-2 text-center"
                          style={{ background: "#111E33" }}
                        >
                          <div
                            className="text-lg font-bold"
                            style={{ color: a.color }}
                          >
                            {a.count}
                          </div>
                          <div
                            className="text-[10px]"
                            style={{ color: a.color }}
                          >
                            {a.label}
                          </div>
                          <Progress
                            value={(a.count / 28) * 100}
                            className="mt-1 h-1"
                          />
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      {[
                        {
                          label: "Low Target",
                          value: "\u20b92,400",
                          color: "#FF5A5F",
                        },
                        {
                          label: "Avg Target",
                          value: "\u20b93,200",
                          color: "#F2C94C",
                        },
                        {
                          label: "High Target",
                          value: "\u20b93,650",
                          color: "#00C087",
                        },
                      ].map((t) => (
                        <div
                          key={t.label}
                          className="rounded-lg p-2"
                          style={{ background: "#111E33" }}
                        >
                          <div
                            className="text-xs font-bold"
                            style={{ color: t.color }}
                          >
                            {t.value}
                          </div>
                          <div
                            className="text-[9px]"
                            style={{ color: "#9AA8C1" }}
                          >
                            {t.label}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div
                      className="mt-2 text-center text-xs"
                      style={{ color: "#00C087" }}
                    >
                      +12.7% upside from CMP
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <div
                      className="text-[10px] uppercase tracking-wider mb-1"
                      style={{ color: "#9AA8C1" }}
                    >
                      Recent Analyst Actions
                    </div>
                    {[
                      {
                        broker: "Goldman Sachs",
                        action: "UPGRADED to BUY",
                        target: "\u20b93,400",
                        color: "#00C087",
                      },
                      {
                        broker: "Morgan Stanley",
                        action: "Maintains OVERWEIGHT",
                        target: "\u20b93,250",
                        color: "#F2C94C",
                      },
                      {
                        broker: "JPMorgan",
                        action: "Cut target to \u20b92,800",
                        target: "\u20b92,800",
                        color: "#FF5A5F",
                      },
                    ].map((a) => (
                      <div
                        key={a.broker}
                        className="text-[10px] px-2 py-1.5 rounded"
                        style={{
                          background: "#111E33",
                          border: "1px solid #1E2C44",
                        }}
                      >
                        <span style={{ color: a.color }} className="font-bold">
                          {a.broker}
                        </span>
                        <span style={{ color: "#9AA8C1" }}>
                          {" "}
                          — {a.action}, Target {a.target}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* ===================== CRYPTO TAB ===================== */}
          <TabsContent value="crypto" data-ocid="fundamentals.panel">
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="p-2 rounded-lg"
                  style={{ background: "rgba(242,201,76,0.12)" }}
                >
                  <Bitcoin className="w-6 h-6" style={{ color: "#F2C94C" }} />
                </div>
                <div>
                  <div
                    className="text-lg font-bold"
                    style={{ color: "#EAF0FF" }}
                  >
                    Bitcoin (BTC)
                  </div>
                  <div className="text-xs" style={{ color: "#9AA8C1" }}>
                    Layer 1 Blockchain · PoW Consensus · Market Cap Rank #1
                  </div>
                </div>
                <div className="ml-auto text-right">
                  <div
                    className="text-xl font-bold"
                    style={{ color: "#F2C94C" }}
                  >
                    $68,420
                  </div>
                  <div
                    className="text-xs font-bold"
                    style={{ color: "#00C087" }}
                  >
                    +3.14% (24h)
                  </div>
                </div>
              </div>

              {/* Tokenomics */}
              <div
                className="rounded-xl p-5"
                style={{ background: "#0C1A30", border: "1px solid #1E2C44" }}
              >
                <SectionTitle
                  icon={<DollarSign className="w-4 h-4" />}
                  title="Tokenomics"
                />
                <StatGrid
                  stats={[
                    {
                      label: "Max Supply",
                      value: "21,000,000",
                      sub: "BTC (hard cap)",
                      color: "#F2C94C",
                    },
                    {
                      label: "Circulating Supply",
                      value: "19,687,000",
                      color: "#EAF0FF",
                    },
                    { label: "% Mined", value: "93.75%", color: "#00C087" },
                    {
                      label: "Supply Inflation",
                      value: "0.84%/yr",
                      color: "#EAF0FF",
                    },
                    {
                      label: "Next Halving",
                      value: "~Apr 2028",
                      sub: "Block 1,050,000",
                      color: "#F2C94C",
                    },
                    {
                      label: "Block Reward",
                      value: "3.125 BTC",
                      sub: "Since Apr 2024",
                      color: "#EAF0FF",
                    },
                    { label: "Block Time", value: "~10 min", color: "#9AA8C1" },
                    { label: "Blocks/Day", value: "~144", color: "#9AA8C1" },
                  ]}
                />
              </div>

              {/* On-Chain Metrics */}
              <div
                className="rounded-xl p-5"
                style={{ background: "#0C1A30", border: "1px solid #1E2C44" }}
              >
                <SectionTitle
                  icon={<Activity className="w-4 h-4" />}
                  title="On-Chain Metrics (via Glassnode)"
                />
                <StatGrid
                  stats={[
                    {
                      label: "Active Addresses 24h",
                      value: "847,234",
                      color: "#00C087",
                    },
                    {
                      label: "Transactions 24h",
                      value: "392,847",
                      color: "#EAF0FF",
                    },
                    {
                      label: "Tx Volume USD",
                      value: "$24.8B",
                      color: "#F2C94C",
                    },
                    { label: "Avg Fee", value: "$4.82", color: "#9AA8C1" },
                    {
                      label: "Hash Rate",
                      value: "612 EH/s",
                      sub: "All-time high",
                      color: "#00C087",
                    },
                    { label: "Realized Cap", value: "$423B", color: "#EAF0FF" },
                    {
                      label: "MVRV Ratio",
                      value: "2.14",
                      sub: "Slightly overvalued",
                      color: "#F2C94C",
                    },
                    { label: "NVT Ratio", value: "68.4", color: "#EAF0FF" },
                    {
                      label: "SOPR",
                      value: "1.032",
                      sub: "Profit territory",
                      color: "#00C087",
                    },
                    {
                      label: "LTH Supply %",
                      value: "74.8%",
                      sub: "Long-term holders",
                      color: "#00C087",
                    },
                  ]}
                />
              </div>

              {/* Exchange + Developer */}
              <div className="grid md:grid-cols-2 gap-4">
                <div
                  className="rounded-xl p-5"
                  style={{ background: "#0C1A30", border: "1px solid #1E2C44" }}
                >
                  <SectionTitle
                    icon={<BarChart2 className="w-4 h-4" />}
                    title="Exchange Metrics"
                  />
                  <StatGrid
                    stats={[
                      {
                        label: "Exchange Reserves",
                        value: "2,324,000",
                        sub: "BTC on exchanges",
                        color: "#FF5A5F",
                      },
                      {
                        label: "Exchange Inflow 24h",
                        value: "12,840 BTC",
                        color: "#FF5A5F",
                      },
                      {
                        label: "Exchange Outflow 24h",
                        value: "14,210 BTC",
                        sub: "Bullish signal",
                        color: "#00C087",
                      },
                      {
                        label: "Funding Rate",
                        value: "+0.012%",
                        sub: "Perp. futures",
                        color: "#F2C94C",
                      },
                      {
                        label: "Open Interest",
                        value: "$18.4B",
                        color: "#EAF0FF",
                      },
                      {
                        label: "Long/Short Ratio",
                        value: "54.2/45.8",
                        color: "#00C087",
                      },
                      {
                        label: "Liquidations 24h",
                        value: "$842M",
                        color: "#FF5A5F",
                      },
                      { label: "Basis (3M)", value: "+2.4%", color: "#F2C94C" },
                    ]}
                  />
                </div>
                <div
                  className="rounded-xl p-5"
                  style={{ background: "#0C1A30", border: "1px solid #1E2C44" }}
                >
                  <SectionTitle
                    icon={<Activity className="w-4 h-4" />}
                    title="Developer Activity"
                  />
                  <StatGrid
                    stats={[
                      {
                        label: "GitHub Commits (30d)",
                        value: "847",
                        color: "#00C087",
                      },
                      { label: "Contributors", value: "124", color: "#EAF0FF" },
                      {
                        label: "GitHub Stars",
                        value: "71,234",
                        color: "#F2C94C",
                      },
                      {
                        label: "GitHub Forks",
                        value: "34,891",
                        color: "#EAF0FF",
                      },
                      {
                        label: "Last Commit",
                        value: "2 days ago",
                        color: "#00C087",
                      },
                      { label: "Dev Score", value: "9.2/10", color: "#F2C94C" },
                      { label: "Issues Open", value: "234", color: "#9AA8C1" },
                      {
                        label: "PRs Merged (30d)",
                        value: "48",
                        color: "#EAF0FF",
                      },
                    ]}
                  />
                  <div className="mt-4">
                    <SectionTitle
                      icon={<Users className="w-4 h-4" />}
                      title="Community"
                    />
                    <StatGrid
                      stats={[
                        {
                          label: "Twitter Followers",
                          value: "6.8M",
                          color: "#EAF0FF",
                        },
                        {
                          label: "Reddit Subscribers",
                          value: "6.2M",
                          color: "#EAF0FF",
                        },
                        {
                          label: "Reddit Active",
                          value: "18,247",
                          color: "#9AA8C1",
                        },
                        {
                          label: "Twitter Sentiment",
                          value: "+62 BULLISH",
                          color: "#00C087",
                        },
                      ]}
                    />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* ===================== FOREX TAB ===================== */}
          <TabsContent value="forex" data-ocid="fundamentals.panel">
            <div className="space-y-4">
              <div
                className="text-xs font-bold uppercase tracking-wider mb-2"
                style={{ color: "#9AA8C1" }}
              >
                Showing: EUR/USD — Euro vs US Dollar
              </div>

              {/* EUR vs USD Side by Side */}
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  {
                    currency: "EUR (Eurozone)",
                    flag: "🇪🇺",
                    bank: "ECB",
                    rate: "3.40%",
                    rateChange: "-25bps Mar 7, 2026",
                    nextMeeting: "Apr 17, 2026",
                    cpi: "2.3%",
                    coreCpi: "2.7%",
                    target: "2.0%",
                    unemployment: "6.1%",
                    gdpQoQ: "+0.3%",
                    pmiMfg: "46.4",
                    pmiSvc: "51.2",
                    tone: "DOVISH" as const,
                  },
                  {
                    currency: "USD (United States)",
                    flag: "🇺🇸",
                    bank: "Federal Reserve",
                    rate: "5.25-5.50%",
                    rateChange: "-25bps Nov 2025",
                    nextMeeting: "May 7, 2026",
                    cpi: "3.2%",
                    coreCpi: "3.8%",
                    target: "2.0%",
                    unemployment: "3.9%",
                    gdpQoQ: "+2.1% (ann.)",
                    pmiMfg: "52.8",
                    pmiSvc: "54.1",
                    tone: "HAWKISH" as const,
                  },
                ].map((country) => (
                  <div
                    key={country.currency}
                    className="rounded-xl p-5 space-y-3"
                    style={{
                      background: "#0C1A30",
                      border: "1px solid #1E2C44",
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{country.flag}</span>
                      <div>
                        <div
                          className="text-sm font-bold"
                          style={{ color: "#EAF0FF" }}
                        >
                          {country.currency}
                        </div>
                        <div
                          className="text-[10px]"
                          style={{ color: "#9AA8C1" }}
                        >
                          {country.bank}
                        </div>
                      </div>
                      <ToneBadge tone={country.tone} />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {[
                        {
                          label: "CB Rate",
                          value: country.rate,
                          color: "#F2C94C",
                        },
                        {
                          label: "Last Change",
                          value: country.rateChange,
                          color: country.rateChange.startsWith("-")
                            ? "#FF5A5F"
                            : "#00C087",
                        },
                        {
                          label: "Next Meeting",
                          value: country.nextMeeting,
                          color: "#9AA8C1",
                        },
                        {
                          label: "CPI",
                          value: country.cpi,
                          color:
                            Number.parseFloat(country.cpi) > 2
                              ? "#FF5A5F"
                              : "#00C087",
                        },
                        {
                          label: "Core CPI",
                          value: country.coreCpi,
                          color: "#EAF0FF",
                        },
                        {
                          label: "Inflation Target",
                          value: country.target,
                          color: "#9AA8C1",
                        },
                        {
                          label: "Unemployment",
                          value: country.unemployment,
                          color: "#EAF0FF",
                        },
                        {
                          label: "GDP QoQ",
                          value: country.gdpQoQ,
                          color: "#00C087",
                        },
                        {
                          label: "PMI Mfg.",
                          value: country.pmiMfg,
                          color:
                            Number.parseFloat(country.pmiMfg) > 50
                              ? "#00C087"
                              : "#FF5A5F",
                        },
                        {
                          label: "PMI Services",
                          value: country.pmiSvc,
                          color:
                            Number.parseFloat(country.pmiSvc) > 50
                              ? "#00C087"
                              : "#FF5A5F",
                        },
                      ].map((s) => (
                        <div
                          key={s.label}
                          className="rounded p-2"
                          style={{ background: "#111E33" }}
                        >
                          <div
                            className="text-[9px] uppercase tracking-wider"
                            style={{ color: "#9AA8C1" }}
                          >
                            {s.label}
                          </div>
                          <div
                            className="text-xs font-bold"
                            style={{ color: s.color }}
                          >
                            {s.value}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Central Bank Tracker */}
              <div
                className="rounded-xl overflow-hidden"
                style={{ border: "1px solid #1E2C44" }}
              >
                <div
                  className="px-5 py-3 flex items-center gap-2"
                  style={{
                    background: "#111E33",
                    borderBottom: "1px solid #1E2C44",
                  }}
                >
                  <Shield className="w-4 h-4" style={{ color: "#F2C94C" }} />
                  <span
                    className="text-sm font-bold uppercase tracking-widest"
                    style={{ color: "#EAF0FF" }}
                  >
                    Global Central Bank Tracker
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table
                    className="w-full text-xs"
                    data-ocid="fundamentals.table"
                  >
                    <thead>
                      <tr
                        style={{
                          background: "#0C1A30",
                          borderBottom: "1px solid #1E2C44",
                        }}
                      >
                        {[
                          "Central Bank",
                          "Governor",
                          "Current Rate",
                          "Last Change",
                          "Next Meeting",
                          "Tone",
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
                      {CENTRAL_BANKS.map((cb, i) => (
                        <tr
                          key={cb.bank}
                          data-ocid={`fundamentals.row.${i + 1}`}
                          className="hover:bg-white/[0.02]"
                          style={{
                            borderBottom: "1px solid #1E2C44",
                            background:
                              i % 2 === 0 ? "transparent" : "#111E3310",
                          }}
                        >
                          <td
                            className="px-4 py-2.5 font-bold"
                            style={{ color: "#EAF0FF" }}
                          >
                            {cb.bank}
                          </td>
                          <td
                            className="px-4 py-2.5"
                            style={{ color: "#9AA8C1" }}
                          >
                            {cb.governor}
                          </td>
                          <td
                            className="px-4 py-2.5 font-mono font-bold"
                            style={{ color: "#F2C94C" }}
                          >
                            {cb.rate}
                          </td>
                          <td
                            className="px-4 py-2.5 font-mono text-[11px]"
                            style={{
                              color: cb.lastChange.startsWith("+")
                                ? "#FF5A5F"
                                : "#00C087",
                            }}
                          >
                            {cb.lastChange}
                          </td>
                          <td
                            className="px-4 py-2.5 text-[11px]"
                            style={{ color: "#9AA8C1" }}
                          >
                            {cb.nextMeeting}
                          </td>
                          <td className="px-4 py-2.5">
                            <ToneBadge tone={cb.tone} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Additional Macro */}
              <div className="grid md:grid-cols-2 gap-4">
                <div
                  className="rounded-xl p-4"
                  style={{ background: "#0C1A30", border: "1px solid #1E2C44" }}
                >
                  <SectionTitle
                    icon={<Globe className="w-4 h-4" />}
                    title="EUR/USD Pair Data"
                  />
                  <StatGrid
                    stats={[
                      {
                        label: "Current Rate",
                        value: "1.0824",
                        color: "#F2C94C",
                      },
                      {
                        label: "24h Change",
                        value: "-0.12%",
                        color: "#FF5A5F",
                      },
                      { label: "52W High", value: "1.1275", color: "#00C087" },
                      { label: "52W Low", value: "1.0448", color: "#FF5A5F" },
                      { label: "Pip Size", value: "0.0001", color: "#9AA8C1" },
                      { label: "Spread", value: "0.1 pip", color: "#00C087" },
                      {
                        label: "Daily Volume",
                        value: "$1.4T",
                        color: "#EAF0FF",
                      },
                      { label: "Beta (DXY)", value: "-0.82", color: "#EAF0FF" },
                    ]}
                  />
                </div>
                <div
                  className="rounded-xl p-4"
                  style={{ background: "#0C1A30", border: "1px solid #1E2C44" }}
                >
                  <SectionTitle
                    icon={<Activity className="w-4 h-4" />}
                    title="Rate Differential Analysis"
                  />
                  <div className="space-y-3">
                    <div
                      className="p-3 rounded-lg"
                      style={{ background: "#111E33" }}
                    >
                      <div
                        className="text-xs mb-1"
                        style={{ color: "#9AA8C1" }}
                      >
                        Fed Funds Rate vs ECB Rate
                      </div>
                      <div
                        className="text-lg font-bold"
                        style={{ color: "#FF5A5F" }}
                      >
                        +1.85% to +2.10%
                      </div>
                      <div className="text-[10px]" style={{ color: "#9AA8C1" }}>
                        USD yield advantage — bearish for EUR/USD
                      </div>
                    </div>
                    <div
                      className="p-3 rounded-lg"
                      style={{ background: "#111E33" }}
                    >
                      <div
                        className="text-xs mb-1"
                        style={{ color: "#9AA8C1" }}
                      >
                        CME FedWatch — May 2026
                      </div>
                      <div className="flex gap-2">
                        <span
                          className="text-xs font-bold"
                          style={{ color: "#9AA8C1" }}
                        >
                          Hold: 72%
                        </span>
                        <span
                          className="text-xs font-bold"
                          style={{ color: "#00C087" }}
                        >
                          Cut: 28%
                        </span>
                      </div>
                    </div>
                    <div
                      className="p-3 rounded-lg"
                      style={{ background: "#111E33" }}
                    >
                      <div
                        className="text-xs mb-1"
                        style={{ color: "#9AA8C1" }}
                      >
                        Technical Level
                      </div>
                      <div className="text-xs" style={{ color: "#EAF0FF" }}>
                        Support: 1.0750 | Resistance: 1.0900 | Key: 1.0800
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* ===================== COMMODITIES TAB ===================== */}
          <TabsContent value="commodities" data-ocid="fundamentals.panel">
            <div className="space-y-4">
              <Tabs defaultValue="gold">
                <TabsList
                  className="h-auto p-1"
                  style={{ background: "#111E33", border: "1px solid #1E2C44" }}
                >
                  {["gold", "crude", "agriculture"].map((t) => (
                    <TabsTrigger
                      key={t}
                      value={t}
                      data-ocid="fundamentals.tab"
                      className="text-xs uppercase tracking-wide px-3 py-1.5 rounded data-[state=active]:text-[#0B1424]"
                      style={{ color: "#9AA8C1" }}
                    >
                      {t === "gold"
                        ? "💠 Gold"
                        : t === "crude"
                          ? "🛢 Crude Oil"
                          : "🌱 Agriculture"}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {/* GOLD */}
                <TabsContent value="gold" className="mt-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div
                          className="text-lg font-bold"
                          style={{ color: "#F2C94C" }}
                        >
                          XAU/USD — Gold Spot
                        </div>
                        <div className="text-xs" style={{ color: "#9AA8C1" }}>
                          Source: World Gold Council · COMEX · SPDR
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className="text-xl font-bold"
                          style={{ color: "#F2C94C" }}
                        >
                          $2,342.80
                        </div>
                        <div className="text-xs" style={{ color: "#00C087" }}>
                          +0.82%
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div
                        className="rounded-xl p-4"
                        style={{
                          background: "#0C1A30",
                          border: "1px solid #1E2C44",
                        }}
                      >
                        <SectionTitle
                          icon={<DollarSign className="w-4 h-4" />}
                          title="Supply & Demand"
                        />
                        <StatGrid
                          stats={[
                            {
                              label: "WGC Q4 2025 Demand",
                              value: "1,297 t",
                              color: "#F2C94C",
                            },
                            {
                              label: "Central Bank Buying",
                              value: "+333t",
                              sub: "YTD net (China, India, Poland)",
                              color: "#00C087",
                            },
                            {
                              label: "ETF Holdings (GLD)",
                              value: "860 t",
                              color: "#EAF0FF",
                            },
                            {
                              label: "SPDR Holdings",
                              value: "862 t",
                              color: "#EAF0FF",
                            },
                            {
                              label: "Total ETF Holdings",
                              value: "3,247 t",
                              color: "#F2C94C",
                            },
                            {
                              label: "Mine Production",
                              value: "3,644 t/yr",
                              color: "#9AA8C1",
                            },
                            {
                              label: "Recycling",
                              value: "1,247 t/yr",
                              color: "#9AA8C1",
                            },
                            {
                              label: "India Demand",
                              value: "747 t/yr",
                              color: "#EAF0FF",
                            },
                            {
                              label: "China Demand",
                              value: "864 t/yr",
                              color: "#EAF0FF",
                            },
                          ]}
                        />
                      </div>
                      <div
                        className="rounded-xl p-4"
                        style={{
                          background: "#0C1A30",
                          border: "1px solid #1E2C44",
                        }}
                      >
                        <SectionTitle
                          icon={<Activity className="w-4 h-4" />}
                          title="Market Correlations"
                        />
                        <StatGrid
                          stats={[
                            {
                              label: "Real Rate Corr.",
                              value: "-0.87",
                              sub: "Strong inverse",
                              color: "#FF5A5F",
                            },
                            {
                              label: "DXY Correlation",
                              value: "-0.76",
                              sub: "Inverse USD",
                              color: "#FF5A5F",
                            },
                            {
                              label: "S&P 500 Corr.",
                              value: "-0.14",
                              sub: "Near zero",
                              color: "#9AA8C1",
                            },
                            {
                              label: "Inflation Corr.",
                              value: "+0.62",
                              sub: "Moderate positive",
                              color: "#00C087",
                            },
                          ]}
                        />
                        <div className="mt-4">
                          <SectionTitle
                            icon={<BarChart2 className="w-4 h-4" />}
                            title="COT Report"
                          />
                          <div
                            className="p-3 rounded-lg"
                            style={{ background: "#111E33" }}
                          >
                            <div
                              className="text-xs"
                              style={{ color: "#9AA8C1" }}
                            >
                              Managed Money Net Position
                            </div>
                            <div
                              className="text-lg font-bold"
                              style={{ color: "#00C087" }}
                            >
                              +234,847 contracts
                            </div>
                            <div
                              className="text-[10px]"
                              style={{ color: "#9AA8C1" }}
                            >
                              Commitment of Traders — BULLISH positioning
                            </div>
                            <div
                              className="text-xs mt-2 font-bold"
                              style={{ color: "#F2C94C" }}
                            >
                              BULLISH SIGNAL
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* CRUDE OIL */}
                <TabsContent value="crude" className="mt-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div
                          className="text-lg font-bold"
                          style={{ color: "#E74C3C" }}
                        >
                          CL — WTI Crude Oil
                        </div>
                        <div className="text-xs" style={{ color: "#9AA8C1" }}>
                          Source: EIA · Baker Hughes · IEA · OPEC
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className="text-xl font-bold"
                          style={{ color: "#E74C3C" }}
                        >
                          $82.14
                        </div>
                        <div className="text-xs" style={{ color: "#FF5A5F" }}>
                          -0.94%
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div
                        className="rounded-xl p-4"
                        style={{
                          background: "#0C1A30",
                          border: "1px solid #1E2C44",
                        }}
                      >
                        <SectionTitle
                          icon={<Activity className="w-4 h-4" />}
                          title="OPEC & Production"
                        />
                        <StatGrid
                          stats={[
                            {
                              label: "OPEC Production",
                              value: "26.8M bbl/d",
                              color: "#EAF0FF",
                            },
                            {
                              label: "OPEC+ Total",
                              value: "43.2M bbl/d",
                              color: "#F2C94C",
                            },
                            {
                              label: "US Production",
                              value: "13.2M bbl/d",
                              sub: "Record high",
                              color: "#00C087",
                            },
                            {
                              label: "OPEC+ Meeting",
                              value: "Jun 1, 2026",
                              sub: "Expected: Hold",
                              color: "#9AA8C1",
                            },
                            {
                              label: "Geo. Risk Index",
                              value: "68/100",
                              sub: "Elevated",
                              color: "#FF5A5F",
                            },
                            {
                              label: "Baker Hughes Rigs",
                              value: "485",
                              sub: "vs prev: 483",
                              color: "#EAF0FF",
                            },
                          ]}
                        />
                      </div>
                      <div
                        className="rounded-xl p-4"
                        style={{
                          background: "#0C1A30",
                          border: "1px solid #1E2C44",
                        }}
                      >
                        <SectionTitle
                          icon={<BarChart2 className="w-4 h-4" />}
                          title="EIA Inventory & Demand"
                        />
                        <StatGrid
                          stats={[
                            {
                              label: "US Crude Inventory",
                              value: "443.2M bbl",
                              sub: "5yr avg: 459M",
                              color: "#00C087",
                            },
                            {
                              label: "Inventory Vs Avg",
                              value: "-15.8M bbl",
                              sub: "Below average",
                              color: "#FF5A5F",
                            },
                            {
                              label: "IEA Demand 2026",
                              value: "103.8M bbl/d",
                              color: "#F2C94C",
                            },
                            {
                              label: "Demand YoY",
                              value: "+1.2M bbl/d",
                              color: "#00C087",
                            },
                            {
                              label: "Refinery Utilization",
                              value: "87.4%",
                              color: "#EAF0FF",
                            },
                            {
                              label: "WTI-Brent Spread",
                              value: "$3.20",
                              color: "#9AA8C1",
                            },
                          ]}
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* AGRICULTURE */}
                <TabsContent value="agriculture" className="mt-4">
                  <div className="space-y-4">
                    <div className="text-xs" style={{ color: "#9AA8C1" }}>
                      Source: USDA Crop Reports · NOAA Weather · CME Group
                    </div>

                    <div
                      className="rounded-xl p-5"
                      style={{
                        background: "#0C1A30",
                        border: "1px solid #1E2C44",
                      }}
                    >
                      <SectionTitle
                        icon={<Activity className="w-4 h-4" />}
                        title="USDA Crop Report (Latest)"
                      />
                      <div className="overflow-x-auto">
                        <table
                          className="w-full text-xs"
                          data-ocid="fundamentals.table"
                        >
                          <thead>
                            <tr style={{ borderBottom: "1px solid #1E2C44" }}>
                              {[
                                "Crop",
                                "Production",
                                "Stocks",
                                "Export Forecast",
                                "vs Last Year",
                              ].map((h) => (
                                <th
                                  key={h}
                                  className="pb-2 text-left font-semibold uppercase tracking-wider"
                                  style={{ color: "#9AA8C1" }}
                                >
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody
                            className="divide-y"
                            style={{ borderColor: "#1E2C44" }}
                          >
                            {[
                              {
                                crop: "Corn",
                                prod: "15.1B bu",
                                stocks: "1.82B bu",
                                export: "2.4B bu",
                                change: "+2.8%",
                              },
                              {
                                crop: "Wheat",
                                prod: "1.87B bu",
                                stocks: "654M bu",
                                export: "780M bu",
                                change: "-3.2%",
                              },
                              {
                                crop: "Soybeans",
                                prod: "4.46B bu",
                                stocks: "342M bu",
                                export: "1.84B bu",
                                change: "+1.4%",
                              },
                              {
                                crop: "Cotton",
                                prod: "14.8M bales",
                                stocks: "3.2M bales",
                                export: "12.1M bales",
                                change: "+5.1%",
                              },
                            ].map((row, i) => (
                              <tr
                                key={row.crop}
                                data-ocid={`fundamentals.row.${i + 1}`}
                                className="hover:bg-white/[0.02]"
                              >
                                <td
                                  className="py-2 font-bold"
                                  style={{ color: "#F2C94C" }}
                                >
                                  {row.crop}
                                </td>
                                <td
                                  className="py-2"
                                  style={{ color: "#EAF0FF" }}
                                >
                                  {row.prod}
                                </td>
                                <td
                                  className="py-2"
                                  style={{ color: "#9AA8C1" }}
                                >
                                  {row.stocks}
                                </td>
                                <td
                                  className="py-2"
                                  style={{ color: "#EAF0FF" }}
                                >
                                  {row.export}
                                </td>
                                <td
                                  className="py-2 font-bold"
                                  style={{
                                    color: row.change.startsWith("+")
                                      ? "#00C087"
                                      : "#FF5A5F",
                                  }}
                                >
                                  {row.change}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div
                        className="rounded-xl p-4"
                        style={{
                          background: "#0C1A30",
                          border: "1px solid #1E2C44",
                        }}
                      >
                        <SectionTitle
                          icon={<Globe className="w-4 h-4" />}
                          title="Weather & Climate"
                        />
                        <StatGrid
                          stats={[
                            {
                              label: "ENSO Status",
                              value: "Neutral",
                              sub: "Transitioning to El Nino",
                              color: "#F2C94C",
                            },
                            {
                              label: "US Corn Belt",
                              value: "Moderate drought",
                              color: "#FF5A5F",
                            },
                            {
                              label: "Brazil Soy",
                              value: "Favorable",
                              color: "#00C087",
                            },
                            {
                              label: "Australian Wheat",
                              value: "Favorable",
                              color: "#00C087",
                            },
                          ]}
                        />
                      </div>
                      <div
                        className="rounded-xl p-4"
                        style={{
                          background: "#0C1A30",
                          border: "1px solid #1E2C44",
                        }}
                      >
                        <SectionTitle
                          icon={<TrendingDown className="w-4 h-4" />}
                          title="Price vs Seasonality"
                        />
                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between">
                            <span style={{ color: "#9AA8C1" }}>Corn (ZC)</span>
                            <span
                              className="font-bold"
                              style={{ color: "#F2C94C" }}
                            >
                              452.50 c/bu
                            </span>
                            <span style={{ color: "#00C087" }}>+1.2%</span>
                          </div>
                          <div className="flex justify-between">
                            <span style={{ color: "#9AA8C1" }}>Wheat (ZW)</span>
                            <span
                              className="font-bold"
                              style={{ color: "#F2C94C" }}
                            >
                              528.25 c/bu
                            </span>
                            <span style={{ color: "#FF5A5F" }}>-0.8%</span>
                          </div>
                          <div className="flex justify-between">
                            <span style={{ color: "#9AA8C1" }}>
                              Soybeans (ZS)
                            </span>
                            <span
                              className="font-bold"
                              style={{ color: "#F2C94C" }}
                            >
                              1,142.00 c/bu
                            </span>
                            <span style={{ color: "#00C087" }}>+0.6%</span>
                          </div>
                          <div className="flex justify-between">
                            <span style={{ color: "#9AA8C1" }}>
                              Coffee (KC)
                            </span>
                            <span
                              className="font-bold"
                              style={{ color: "#F2C94C" }}
                            >
                              248.40 c/lb
                            </span>
                            <span style={{ color: "#00C087" }}>+3.4%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </TabsContent>
        </Tabs>

        {/* ── Data Sync Schedule ── */}
        <div
          className="rounded-xl overflow-hidden"
          style={{ border: "1px solid #1E2C44" }}
          data-ocid="fundamentals.panel"
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
              Data Sync Schedule
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
                {["Data Type", "Source", "Frequency", "Last Update"].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-4 py-2.5 text-left font-semibold uppercase tracking-wider"
                      style={{ color: "#9AA8C1" }}
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {SYNC_SCHEDULE.map((row, i) => (
                <tr
                  key={row.dataType}
                  data-ocid={`fundamentals.row.${i + 1}`}
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
                    {row.dataType}
                  </td>
                  <td className="px-4 py-2.5" style={{ color: "#9AA8C1" }}>
                    {row.source}
                  </td>
                  <td
                    className="px-4 py-2.5 font-mono text-[11px]"
                    style={{ color: "#F2C94C" }}
                  >
                    {row.freq}
                  </td>
                  <td className="px-4 py-2.5">
                    <span
                      className="text-[10px] font-semibold px-2 py-0.5 rounded"
                      style={{
                        background: "rgba(0,192,135,0.12)",
                        color: "#00C087",
                      }}
                    >
                      {row.lastUpdate}
                    </span>
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
