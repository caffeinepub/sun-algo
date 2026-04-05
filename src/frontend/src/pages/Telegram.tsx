import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertTriangle,
  BarChart2,
  Bot,
  CheckCircle,
  Clock,
  Download,
  Edit,
  Gift,
  MessageSquare,
  Plus,
  Send,
  Settings,
  Shield,
  Trash2,
  TrendingDown,
  TrendingUp,
  Trophy,
  Users,
  Wallet,
  XCircle,
  Zap,
} from "lucide-react";
import { useState } from "react";

type TabId =
  | "overview"
  | "subscribers"
  | "signals"
  | "broadcast"
  | "revenue"
  | "performance"
  | "referrals"
  | "config";

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  {
    id: "overview",
    label: "Overview",
    icon: <BarChart2 className="w-3.5 h-3.5" />,
  },
  {
    id: "subscribers",
    label: "Subscribers",
    icon: <Users className="w-3.5 h-3.5" />,
  },
  { id: "signals", label: "Signals", icon: <Zap className="w-3.5 h-3.5" /> },
  {
    id: "broadcast",
    label: "Broadcast",
    icon: <Send className="w-3.5 h-3.5" />,
  },
  {
    id: "revenue",
    label: "Revenue",
    icon: <TrendingUp className="w-3.5 h-3.5" />,
  },
  {
    id: "performance",
    label: "Performance",
    icon: <Trophy className="w-3.5 h-3.5" />,
  },
  {
    id: "referrals",
    label: "Referrals",
    icon: <Gift className="w-3.5 h-3.5" />,
  },
  {
    id: "config",
    label: "Bot Config",
    icon: <Settings className="w-3.5 h-3.5" />,
  },
];

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_SUBSCRIBERS = [
  {
    id: "1",
    tgId: "528341092",
    username: "@rk_trader",
    name: "Rajesh Kumar",
    plan: "PRO",
    expiry: "2026-05-12",
    status: "ACTIVE",
    ref: "SUN-A8K2P",
  },
  {
    id: "2",
    tgId: "319045762",
    username: "@priya_sharma",
    name: "Priya Sharma",
    plan: "ELITE",
    expiry: "2026-06-30",
    status: "ACTIVE",
    ref: "SUN-B3X7Q",
  },
  {
    id: "3",
    tgId: "742819034",
    username: "@amittr99",
    name: "Amit Trivedi",
    plan: "BASIC",
    expiry: "2026-04-08",
    status: "EXPIRED",
    ref: "SUN-C5M1R",
  },
  {
    id: "4",
    tgId: "891234056",
    username: "@neha.patel",
    name: "Neha Patel",
    plan: "PRO",
    expiry: "2026-05-22",
    status: "ACTIVE",
    ref: "SUN-D2N9T",
  },
  {
    id: "5",
    tgId: "103847562",
    username: "@vikram_rao",
    name: "Vikram Rao",
    plan: "FREE",
    expiry: "-",
    status: "ACTIVE",
    ref: "SUN-E7H4U",
  },
  {
    id: "6",
    tgId: "672018394",
    username: "@sunita.joshi",
    name: "Sunita Joshi",
    plan: "BASIC",
    expiry: "2026-04-30",
    status: "TRIAL",
    ref: "SUN-F1K6V",
  },
  {
    id: "7",
    tgId: "481029375",
    username: "@deepak_mv",
    name: "Deepak Mehta",
    plan: "ELITE",
    expiry: "2026-07-15",
    status: "ACTIVE",
    ref: "SUN-G8L2W",
  },
  {
    id: "8",
    tgId: "293847610",
    username: "@ananya_s",
    name: "Ananya Singh",
    plan: "PRO",
    expiry: "2026-04-11",
    status: "ACTIVE",
    ref: "SUN-H3M5X",
  },
  {
    id: "9",
    tgId: "830192745",
    username: "@rohit.gupta",
    name: "Rohit Gupta",
    plan: "FREE",
    expiry: "-",
    status: "ACTIVE",
    ref: "SUN-I9P7Y",
  },
  {
    id: "10",
    tgId: "567384920",
    username: "@kavya.r",
    name: "Kavya Reddy",
    plan: "BASIC",
    expiry: "2026-05-05",
    status: "ACTIVE",
    ref: "SUN-J4Q8Z",
  },
  {
    id: "11",
    tgId: "124567890",
    username: "@suresh.k",
    name: "Suresh Kumar",
    plan: "PRO",
    expiry: "2026-03-31",
    status: "EXPIRED",
    ref: "SUN-K6R2A",
  },
  {
    id: "12",
    tgId: "987654321",
    username: "@pooja.nair",
    name: "Pooja Nair",
    plan: "ELITE",
    expiry: "2026-08-20",
    status: "ACTIVE",
    ref: "SUN-L1S9B",
  },
  {
    id: "13",
    tgId: "345678901",
    username: "@manish.v",
    name: "Manish Verma",
    plan: "FREE",
    expiry: "-",
    status: "TRIAL",
    ref: "SUN-M7T3C",
  },
  {
    id: "14",
    tgId: "234567890",
    username: "@divya_kp",
    name: "Divya K Pillai",
    plan: "BASIC",
    expiry: "2026-05-18",
    status: "ACTIVE",
    ref: "SUN-N2U6D",
  },
  {
    id: "15",
    tgId: "456789012",
    username: "@arun.s",
    name: "Arun Sharma",
    plan: "PRO",
    expiry: "2026-06-01",
    status: "ACTIVE",
    ref: "SUN-O5V8E",
  },
];

const MOCK_SIGNALS_LOG = [
  {
    id: "SIG-001",
    instrument: "RELIANCE",
    type: "SWING",
    action: "BUY",
    entry: 2850,
    t1: 2950,
    t2: 3050,
    sl: 2800,
    conf: 87,
    channel: "ALL",
    posted: "09:15 AM",
    result: "T1_HIT",
    pnl: "+3.5%",
  },
  {
    id: "SIG-002",
    instrument: "BANKNIFTY",
    type: "INTRADAY",
    action: "BUY",
    entry: 52400,
    t1: 53200,
    t2: 53800,
    sl: 51800,
    conf: 78,
    channel: "PREMIUM",
    posted: "09:20 AM",
    result: "ACTIVE",
    pnl: "+1.2%",
  },
  {
    id: "SIG-003",
    instrument: "BTC/USDT",
    type: "CRYPTO",
    action: "SELL",
    entry: 67200,
    t1: 65500,
    t2: 64000,
    sl: 68200,
    conf: 72,
    channel: "ELITE",
    posted: "08:45 AM",
    result: "T2_HIT",
    pnl: "+4.8%",
  },
  {
    id: "SIG-004",
    instrument: "TCS",
    type: "SWING",
    action: "BUY",
    entry: 3945,
    t1: 4080,
    t2: 4200,
    sl: 3880,
    conf: 85,
    channel: "ALL",
    posted: "Yesterday",
    result: "SL_HIT",
    pnl: "-1.6%",
  },
  {
    id: "SIG-005",
    instrument: "NIFTY FUT",
    type: "FNO",
    action: "BUY",
    entry: 22450,
    t1: 22700,
    t2: 22950,
    sl: 22200,
    conf: 80,
    channel: "PREMIUM",
    posted: "Yesterday",
    result: "CLOSED",
    pnl: "+2.1%",
  },
  {
    id: "SIG-006",
    instrument: "GOLD MCX",
    type: "INTRADAY",
    action: "BUY",
    entry: 72450,
    t1: 73000,
    t2: 73500,
    sl: 72000,
    conf: 76,
    channel: "PREMIUM",
    posted: "2 days ago",
    result: "T1_HIT",
    pnl: "+0.76%",
  },
  {
    id: "SIG-007",
    instrument: "EUR/USD",
    type: "FOREX",
    action: "SELL",
    entry: 1.085,
    t1: 1.078,
    t2: 1.072,
    sl: 1.09,
    conf: 74,
    channel: "ELITE",
    posted: "2 days ago",
    result: "ACTIVE",
    pnl: "-0.3%",
  },
  {
    id: "SIG-008",
    instrument: "INFY",
    type: "SWING",
    action: "BUY",
    entry: 1785,
    t1: 1860,
    t2: 1930,
    sl: 1740,
    conf: 88,
    channel: "ALL",
    posted: "3 days ago",
    result: "T2_HIT",
    pnl: "+8.1%",
  },
  {
    id: "SIG-009",
    instrument: "HDFCBANK",
    type: "INTRADAY",
    action: "SELL",
    entry: 1640,
    t1: 1610,
    t2: 1580,
    sl: 1665,
    conf: 77,
    channel: "PREMIUM",
    posted: "3 days ago",
    result: "SL_HIT",
    pnl: "-1.5%",
  },
  {
    id: "SIG-010",
    instrument: "AAPL",
    type: "US_STOCK",
    action: "BUY",
    entry: 178.5,
    t1: 185.0,
    t2: 192.0,
    sl: 174.0,
    conf: 73,
    channel: "ELITE",
    posted: "4 days ago",
    result: "CLOSED",
    pnl: "+3.7%",
  },
];

const MOCK_BROADCASTS = [
  {
    id: "b1",
    time: "Today 10:30 AM",
    preview: "⏳ Your subscription expires in 7 days! Renew now...",
    audience: "PRO Users",
    sent: 286,
    delivered: 281,
    failed: 5,
    status: "DELIVERED",
  },
  {
    id: "b2",
    time: "Yesterday 9:00 AM",
    preview: "🌞 Good morning! Markets open at 9:15 AM IST...",
    audience: "All Users",
    sent: 1284,
    delivered: 1267,
    failed: 17,
    status: "DELIVERED",
  },
  {
    id: "b3",
    time: "Apr 3, 2:00 PM",
    preview: "🚨 URGENT: NIFTY approaching key resistance level...",
    audience: "Paid Users",
    sent: 990,
    delivered: 982,
    failed: 8,
    status: "DELIVERED",
  },
  {
    id: "b4",
    time: "Apr 2, 8:30 AM",
    preview: "📊 Weekly Performance Report: Win Rate 73.4%...",
    audience: "All Users",
    sent: 1284,
    delivered: 1271,
    failed: 13,
    status: "DELIVERED",
  },
  {
    id: "b5",
    time: "Tomorrow 8:30 AM",
    preview: "🌅 SUN ALGO ELITE — MORNING BRIEFING (Scheduled)",
    audience: "ELITE Users",
    sent: 0,
    delivered: 0,
    failed: 0,
    status: "SCHEDULED",
  },
];

const REFERRERS = [
  {
    rank: 1,
    name: "Priya Sharma",
    username: "@priya_sharma",
    referrals: 45,
    active: 38,
    level: "Level 3",
    earned: "₹28,500",
    badge: "🏆",
  },
  {
    rank: 2,
    name: "Deepak Mehta",
    username: "@deepak_mv",
    referrals: 32,
    active: 27,
    level: "Level 3",
    earned: "₹19,200",
    badge: "🥈",
  },
  {
    rank: 3,
    name: "Rajesh Kumar",
    username: "@rk_trader",
    referrals: 21,
    active: 18,
    level: "Level 3",
    earned: "₹12,600",
    badge: "🥉",
  },
  {
    rank: 4,
    name: "Kavya Reddy",
    username: "@kavya.r",
    referrals: 14,
    active: 11,
    level: "Level 2",
    earned: "₹7,000",
    badge: "",
  },
  {
    rank: 5,
    name: "Ananya Singh",
    username: "@ananya_s",
    referrals: 9,
    active: 8,
    level: "Level 2",
    earned: "₹4,500",
    badge: "",
  },
  {
    rank: 6,
    name: "Vikram Rao",
    username: "@vikram_rao",
    referrals: 7,
    active: 6,
    level: "Level 2",
    earned: "₹3,500",
    badge: "",
  },
  {
    rank: 7,
    name: "Rohit Gupta",
    username: "@rohit.gupta",
    referrals: 5,
    active: 4,
    level: "Level 1",
    earned: "₹2,500",
    badge: "",
  },
  {
    rank: 8,
    name: "Sunita Joshi",
    username: "@sunita.joshi",
    referrals: 4,
    active: 3,
    level: "Level 1",
    earned: "₹2,000",
    badge: "",
  },
  {
    rank: 9,
    name: "Pooja Nair",
    username: "@pooja.nair",
    referrals: 3,
    active: 2,
    level: "Level 1",
    earned: "₹1,500",
    badge: "",
  },
  {
    rank: 10,
    name: "Arun Sharma",
    username: "@arun.s",
    referrals: 2,
    active: 2,
    level: "Level 1",
    earned: "₹1,000",
    badge: "",
  },
];

const WITHDRAWALS = [
  {
    id: "w1",
    user: "Priya Sharma",
    username: "@priya_sharma",
    amount: "₹5,000",
    upi: "priya@okaxis",
    requested: "Today 11:30 AM",
    status: "PENDING",
  },
  {
    id: "w2",
    user: "Deepak Mehta",
    username: "@deepak_mv",
    amount: "₹3,200",
    upi: "deepak@paytm",
    requested: "Today 9:15 AM",
    status: "PENDING",
  },
  {
    id: "w3",
    user: "Rajesh Kumar",
    username: "@rk_trader",
    amount: "₹2,500",
    upi: "rajesh@ybl",
    requested: "Yesterday",
    status: "PENDING",
  },
  {
    id: "w4",
    user: "Kavya Reddy",
    username: "@kavya.r",
    amount: "₹1,500",
    upi: "kavya@oksbi",
    requested: "Yesterday",
    status: "PENDING",
  },
  {
    id: "w5",
    user: "Ananya Singh",
    username: "@ananya_s",
    amount: "₹800",
    upi: "ananya@okhdfcbank",
    requested: "Apr 3",
    status: "PENDING",
  },
];

// ─── Helper Components ────────────────────────────────────────────────────────

function KpiCard({
  title,
  value,
  sub,
  color = "#EAF0FF",
  icon,
  trend,
  index,
}: {
  title: string;
  value: string;
  sub?: string;
  color?: string;
  icon?: React.ReactNode;
  trend?: "up" | "down";
  index: number;
}) {
  return (
    <div className="trading-card p-4" data-ocid={`telegram.item.${index}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] text-[#9AA8C1] uppercase tracking-wider">
          {title}
        </span>
        {icon && <span style={{ color }}>{icon}</span>}
      </div>
      <div className="text-2xl font-bold" style={{ color }}>
        {value}
      </div>
      {sub && (
        <div className="flex items-center gap-1 mt-1">
          {trend === "up" && (
            <TrendingUp className="w-3 h-3" style={{ color: "#2ED47A" }} />
          )}
          {trend === "down" && (
            <TrendingDown className="w-3 h-3" style={{ color: "#FF5A5F" }} />
          )}
          <span
            className="text-[10px]"
            style={{
              color:
                trend === "up"
                  ? "#2ED47A"
                  : trend === "down"
                    ? "#FF5A5F"
                    : "#9AA8C1",
            }}
          >
            {sub}
          </span>
        </div>
      )}
    </div>
  );
}

function PlanBadge({ plan }: { plan: string }) {
  const colors: Record<string, { bg: string; text: string }> = {
    FREE: { bg: "rgba(154,168,193,0.15)", text: "#9AA8C1" },
    BASIC: { bg: "rgba(96,175,255,0.15)", text: "#60AFFF" },
    PRO: { bg: "rgba(242,201,76,0.15)", text: "#F2C94C" },
    ELITE: { bg: "rgba(46,212,122,0.15)", text: "#2ED47A" },
  };
  const c = colors[plan] ?? colors.FREE;
  return (
    <Badge
      className="text-[9px] font-bold"
      style={{ background: c.bg, color: c.text, border: "none" }}
    >
      {plan}
    </Badge>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, { bg: string; text: string }> = {
    ACTIVE: { bg: "rgba(46,212,122,0.15)", text: "#2ED47A" },
    EXPIRED: { bg: "rgba(255,90,95,0.15)", text: "#FF5A5F" },
    TRIAL: { bg: "rgba(242,201,76,0.15)", text: "#F2C94C" },
    CANCELLED: { bg: "rgba(154,168,193,0.15)", text: "#9AA8C1" },
    PENDING: { bg: "rgba(242,201,76,0.15)", text: "#F2C94C" },
    DELIVERED: { bg: "rgba(46,212,122,0.15)", text: "#2ED47A" },
    SCHEDULED: { bg: "rgba(96,175,255,0.15)", text: "#60AFFF" },
  };
  const c = colors[status] ?? colors.ACTIVE;
  return (
    <Badge
      className="text-[9px] font-bold"
      style={{ background: c.bg, color: c.text, border: "none" }}
    >
      {status}
    </Badge>
  );
}

function ResultBadge({ result }: { result: string }) {
  const map: Record<string, { text: string; color: string }> = {
    ACTIVE: { text: "ACTIVE", color: "#60AFFF" },
    T1_HIT: { text: "✅ T1 HIT", color: "#2ED47A" },
    T2_HIT: { text: "✅✅ T2 HIT", color: "#2ED47A" },
    SL_HIT: { text: "🛡️ SL HIT", color: "#FF5A5F" },
    CLOSED: { text: "CLOSED", color: "#9AA8C1" },
  };
  const m = map[result] ?? map.ACTIVE;
  return (
    <span className="text-[10px] font-bold" style={{ color: m.color }}>
      {m.text}
    </span>
  );
}

// ─── SVG Charts ───────────────────────────────────────────────────────────────

function RevenueDonut() {
  const data = [
    { label: "BASIC", value: 147852, color: "#60AFFF", pct: 38 },
    { label: "PRO", value: 149940, color: "#F2C94C", pct: 39 },
    { label: "ELITE", value: 87204, color: "#2ED47A", pct: 23 },
  ];
  const cx = 60;
  const cy = 60;
  const r = 48;
  const inner = 30;
  let cum = -Math.PI / 2;
  const segs = data.map((d) => {
    const angle = (d.pct / 100) * 2 * Math.PI;
    const s = cum;
    cum += angle;
    const x1 = cx + r * Math.cos(s);
    const y1 = cy + r * Math.sin(s);
    const x2 = cx + r * Math.cos(cum);
    const y2 = cy + r * Math.sin(cum);
    const xi1 = cx + inner * Math.cos(s);
    const yi1 = cy + inner * Math.sin(s);
    const xi2 = cx + inner * Math.cos(cum);
    const yi2 = cy + inner * Math.sin(cum);
    const la = angle > Math.PI ? 1 : 0;
    return {
      ...d,
      path: `M ${x1} ${y1} A ${r} ${r} 0 ${la} 1 ${x2} ${y2} L ${xi2} ${yi2} A ${inner} ${inner} 0 ${la} 0 ${xi1} ${yi1} Z`,
    };
  });
  return (
    <div className="flex items-center gap-6">
      <svg width="120" height="120" role="img" aria-label="Revenue donut">
        <title>Revenue by Plan</title>
        {segs.map((s) => (
          <path key={s.label} d={s.path} fill={s.color} opacity="0.85" />
        ))}
        <text
          x={cx}
          y={cy - 5}
          textAnchor="middle"
          fill="#EAF0FF"
          fontSize="10"
          fontWeight="bold"
        >
          ₹3.84L
        </text>
        <text x={cx} y={cy + 8} textAnchor="middle" fill="#9AA8C1" fontSize="7">
          Monthly
        </text>
      </svg>
      <div className="space-y-2">
        {data.map((d) => (
          <div key={d.label} className="flex items-center gap-3">
            <div
              className="w-2.5 h-2.5 rounded-sm"
              style={{ background: d.color }}
            />
            <span className="text-xs text-[#9AA8C1] w-12">{d.label}</span>
            <span className="text-xs font-bold text-[#EAF0FF]">
              ₹{(d.value / 1000).toFixed(0)}K
            </span>
            <span className="text-[10px] text-[#9AA8C1]">({d.pct}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RevenueBarChart() {
  const months = ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr"];
  const newSubs = [38, 52, 44, 61, 73, 89];
  const renewals = [72, 85, 91, 88, 94, 102];
  const maxVal = Math.max(...newSubs.map((v, i) => v + renewals[i]));
  const W = 300;
  const H = 100;
  const barW = 32;
  const gap = 50;
  return (
    <svg
      viewBox={`0 0 ${W} ${H + 20}`}
      className="w-full"
      style={{ height: "120px" }}
      role="img"
      aria-label="Revenue bars"
    >
      <title>New vs Renewals</title>
      {months.map((m, i) => {
        const x = i * gap + 10;
        const rH = (renewals[i] / maxVal) * H;
        const nH = (newSubs[i] / maxVal) * H;
        return (
          <g key={m}>
            <rect
              x={x}
              y={H - rH}
              width={barW}
              height={rH}
              fill="#60AFFF"
              opacity="0.7"
              rx="2"
            />
            <rect
              x={x}
              y={H - rH - nH}
              width={barW}
              height={nH}
              fill="#F2C94C"
              opacity="0.8"
              rx="2"
            />
            <text
              x={x + barW / 2}
              y={H + 14}
              textAnchor="middle"
              fill="#9AA8C1"
              fontSize="8"
            >
              {m}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function MrrLineChart() {
  const mrr = [210000, 245000, 278000, 310000, 352000, 384750];
  const W = 300;
  const H = 80;
  const min = Math.min(...mrr);
  const max = Math.max(...mrr);
  const toX = (i: number) => (i / (mrr.length - 1)) * W;
  const toY = (v: number) => H - ((v - min) / (max - min)) * (H - 10) - 5;
  const d = mrr
    .map((v, i) => `${i === 0 ? "M" : "L"} ${toX(i)} ${toY(v)}`)
    .join(" ");
  const area = `${d} L ${W} ${H} L 0 ${H} Z`;
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full"
      style={{ height: "80px" }}
      role="img"
      aria-label="MRR trend"
    >
      <title>MRR Trend</title>
      <defs>
        <linearGradient id="mrr-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2ED47A" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#2ED47A" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#mrr-grad)" />
      <path d={d} stroke="#2ED47A" strokeWidth="2" fill="none" />
      {mrr.map((v, i) => (
        <circle key={v} cx={toX(i)} cy={toY(v)} r="3" fill="#2ED47A" />
      ))}
    </svg>
  );
}

function PnlBarChart() {
  const months = ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr"];
  const pnl = [8.4, 12.1, 6.7, -2.3, 15.4, 9.8];
  const maxAbs = Math.max(...pnl.map(Math.abs));
  const W = 360;
  const H = 80;
  const barW = 44;
  const gap = 60;
  return (
    <svg
      viewBox={`0 0 ${W} ${H + 20}`}
      className="w-full"
      style={{ height: "100px" }}
      role="img"
      aria-label="Monthly P&L"
    >
      <title>Monthly P&L</title>
      <line
        x1="0"
        x2={W}
        y1={H / 2}
        y2={H / 2}
        stroke="#24344F"
        strokeWidth="0.5"
      />
      {pnl.map((v, i) => {
        const isPos = v >= 0;
        const bH = (Math.abs(v) / maxAbs) * (H / 2 - 5);
        const x = i * gap + 8;
        const y = isPos ? H / 2 - bH : H / 2;
        return (
          <g key={months[i]}>
            <rect
              x={x}
              y={y}
              width={barW}
              height={bH}
              fill={isPos ? "#2ED47A" : "#FF5A5F"}
              opacity="0.8"
              rx="2"
            />
            <text
              x={x + barW / 2}
              y={isPos ? y - 3 : y + bH + 9}
              textAnchor="middle"
              fill={isPos ? "#2ED47A" : "#FF5A5F"}
              fontSize="7"
              fontWeight="bold"
            >
              {isPos ? "+" : ""}
              {v}%
            </text>
            <text
              x={x + barW / 2}
              y={H + 14}
              textAnchor="middle"
              fill="#9AA8C1"
              fontSize="8"
            >
              {months[i]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ─── Tab Panels ───────────────────────────────────────────────────────────────

function OverviewTab() {
  const activities = [
    {
      time: "10:42 AM",
      msg: "@priya_sharma subscribed to ELITE plan (₹4,999)",
    },
    { time: "10:38 AM", msg: "Signal SIG-002 posted to PREMIUM channel" },
    {
      time: "10:15 AM",
      msg: "@amittr99 subscription expired — removed from channels",
    },
    {
      time: "09:55 AM",
      msg: "Payment ₹2,499 received from @neha.patel (PRO plan)",
    },
    {
      time: "09:30 AM",
      msg: "Morning briefing sent to ELITE channel (156 members)",
    },
    { time: "09:22 AM", msg: "@rk_trader activated 7-day free trial" },
    { time: "09:15 AM", msg: "Signal SIG-001 posted to ALL channels" },
    {
      time: "08:47 AM",
      msg: "@vikram_rao used /start command — new user joined",
    },
    {
      time: "08:30 AM",
      msg: "Elite Morning Briefing scheduled — sending now...",
    },
    {
      time: "12:00 AM",
      msg: "Daily expiry check complete — 3 subscriptions expired",
    },
  ];

  const channels = [
    {
      handle: "@SunAlgo_Free",
      type: "PUBLIC",
      members: "8,421",
      joins: "+34",
      removals: "0",
      typeColor: "#60AFFF",
      health: "Healthy",
    },
    {
      handle: "@SunAlgo_Premium",
      type: "PRIVATE",
      members: "1,109",
      joins: "+12",
      removals: "2",
      typeColor: "#F2C94C",
      health: "Healthy",
    },
    {
      handle: "@SunAlgo_Elite",
      type: "VIP",
      members: "156",
      joins: "+3",
      removals: "1",
      typeColor: "#2ED47A",
      health: "Healthy",
    },
    {
      handle: "@SunAlgo_Community",
      type: "PUBLIC",
      members: "12,340",
      joins: "+67",
      removals: "0",
      typeColor: "#60AFFF",
      health: "Healthy",
    },
  ];

  return (
    <div className="space-y-5">
      {/* Bot Status */}
      <div className="trading-card p-4" data-ocid="telegram.item.1">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(96,175,255,0.15)" }}
            >
              <Bot className="w-5 h-5" style={{ color: "#60AFFF" }} />
            </div>
            <div>
              <div className="text-sm font-bold text-[#EAF0FF]">
                @SunAlgoBot
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span
                  className="w-2 h-2 rounded-full pulse-green"
                  style={{ background: "#2ED47A" }}
                />
                <span
                  className="text-[10px] font-semibold"
                  style={{ color: "#2ED47A" }}
                >
                  ONLINE
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-6 ml-2">
            {[
              { label: "Uptime", value: "99.7%" },
              { label: "Commands Today", value: "1,247" },
              { label: "Active Users", value: "342" },
              { label: "Webhooks OK", value: "100%" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-[9px] text-[#9AA8C1] uppercase tracking-wider">
                  {s.label}
                </div>
                <div className="text-sm font-bold text-[#EAF0FF]">
                  {s.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard
          index={2}
          title="Total Subscribers"
          value="1,284"
          color="#60AFFF"
          icon={<Users className="w-4 h-4" />}
          sub="+34 this week"
          trend="up"
        />
        <KpiCard
          index={3}
          title="Monthly Revenue"
          value="₹3,84,750"
          color="#2ED47A"
          icon={<TrendingUp className="w-4 h-4" />}
          sub="+23% vs last month"
          trend="up"
        />
        <KpiCard
          index={4}
          title="Trial Users"
          value="47"
          color="#F2C94C"
          icon={<Clock className="w-4 h-4" />}
          sub="7-day trials active"
        />
        <KpiCard
          index={5}
          title="Expiring (7 days)"
          value="23"
          color="#FF5A5F"
          icon={<AlertTriangle className="w-4 h-4" />}
          sub="Reminders sent"
          trend="down"
        />
      </div>

      {/* Channel Health */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-widest text-[#EAF0FF] mb-3">
          Channel Health Monitor
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {channels.map((ch, i) => (
            <div
              key={ch.handle}
              className="trading-card p-4"
              data-ocid={`telegram.item.${i + 6}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#EAF0FF]">
                  {ch.handle}
                </span>
                <Badge
                  className="text-[8px]"
                  style={{
                    background: `${ch.typeColor}22`,
                    color: ch.typeColor,
                    border: "none",
                  }}
                >
                  {ch.type}
                </Badge>
              </div>
              <div
                className="text-2xl font-bold mb-1"
                style={{ color: ch.typeColor }}
              >
                {ch.members}
              </div>
              <div className="text-[10px] text-[#9AA8C1]">members</div>
              <div className="flex gap-4 mt-3 text-[10px]">
                <div>
                  <span className="text-[#2ED47A] font-bold">{ch.joins}</span>{" "}
                  <span className="text-[#9AA8C1]">joins today</span>
                </div>
                <div>
                  <span
                    style={{
                      color: ch.removals === "0" ? "#9AA8C1" : "#FF5A5F",
                    }}
                    className="font-bold"
                  >
                    {ch.removals}
                  </span>{" "}
                  <span className="text-[#9AA8C1]">removed</span>
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2">
                <CheckCircle className="w-3 h-3" style={{ color: "#2ED47A" }} />
                <span className="text-[10px]" style={{ color: "#2ED47A" }}>
                  {ch.health}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Activity Log */}
      <div className="trading-card p-4">
        <div className="flex items-center gap-2 mb-3">
          <MessageSquare className="w-4 h-4" style={{ color: "#F2C94C" }} />
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#EAF0FF]">
            Recent Bot Activity
          </h2>
        </div>
        <div className="space-y-2">
          {activities.map((a, i) => (
            <div
              key={`${a.time}-${i}`}
              className="flex gap-3 items-start py-1.5"
              style={{
                borderBottom:
                  i < activities.length - 1 ? "1px solid #1E2C44" : "none",
              }}
            >
              <span className="text-[10px] text-[#9AA8C1] whitespace-nowrap w-16 flex-shrink-0">
                {a.time}
              </span>
              <span className="text-xs text-[#EAF0FF]">{a.msg}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SubscribersTab() {
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const filtered = MOCK_SUBSCRIBERS.filter((s) => {
    const matchSearch =
      search === "" ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.username.toLowerCase().includes(search.toLowerCase()) ||
      s.tgId.includes(search);
    const matchPlan = planFilter === "ALL" || s.plan === planFilter;
    const matchStatus = statusFilter === "ALL" || s.status === statusFilter;
    return matchSearch && matchPlan && matchStatus;
  });

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard index={20} title="Active" value="987" color="#2ED47A" />
        <KpiCard index={21} title="Expired" value="156" color="#FF5A5F" />
        <KpiCard index={22} title="Trial" value="47" color="#F2C94C" />
        <KpiCard index={23} title="Total" value="1,284" color="#60AFFF" />
      </div>

      {/* Filters */}
      <div className="trading-card p-4">
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <div className="flex flex-wrap gap-2 flex-1">
            <Input
              placeholder="Search by name, @username, or Telegram ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 text-xs w-64 bg-white/5 border-[#24344F] text-[#EAF0FF] placeholder:text-[#9AA8C1]"
            />
            <select
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
              className="h-8 text-xs px-2 rounded-md border text-[#EAF0FF] bg-[#0D1B2E] border-[#24344F]"
            >
              {["ALL", "FREE", "BASIC", "PRO", "ELITE"].map((p) => (
                <option key={p} value={p} className="bg-[#0D1B2E]">
                  {p}
                </option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-8 text-xs px-2 rounded-md border text-[#EAF0FF] bg-[#0D1B2E] border-[#24344F]"
            >
              {["ALL", "ACTIVE", "EXPIRED", "TRIAL", "CANCELLED"].map((s) => (
                <option key={s} value={s} className="bg-[#0D1B2E]">
                  {s}
                </option>
              ))}
            </select>
          </div>
          <Button
            size="sm"
            className="h-8 text-xs gap-1.5"
            style={{ background: "#F2C94C", color: "#0B1424" }}
          >
            <Download className="w-3 h-3" /> Export CSV
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="trading-card p-4">
        <Table>
          <TableHeader>
            <TableRow style={{ borderColor: "#24344F" }}>
              {[
                "TG ID",
                "Username",
                "Full Name",
                "Plan",
                "Expiry",
                "Status",
                "Referral Code",
                "Actions",
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
            {filtered.map((sub, i) => (
              <TableRow
                key={sub.id}
                data-ocid={`telegram.row.${i + 1}`}
                style={{ borderColor: "#1E2C44" }}
                className="hover:bg-white/5"
              >
                <TableCell className="text-[10px] font-mono text-[#9AA8C1]">
                  {sub.tgId}
                </TableCell>
                <TableCell className="text-xs text-[#60AFFF]">
                  {sub.username}
                </TableCell>
                <TableCell className="text-xs font-semibold text-[#EAF0FF]">
                  {sub.name}
                </TableCell>
                <TableCell>
                  <PlanBadge plan={sub.plan} />
                </TableCell>
                <TableCell className="text-xs text-[#9AA8C1]">
                  {sub.expiry}
                </TableCell>
                <TableCell>
                  <StatusBadge status={sub.status} />
                </TableCell>
                <TableCell className="text-[10px] font-mono text-[#9AA8C1]">
                  {sub.ref}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      className="text-[9px] px-2 py-1 rounded"
                      style={{
                        background: "rgba(96,175,255,0.15)",
                        color: "#60AFFF",
                      }}
                    >
                      Extend
                    </button>
                    <button
                      type="button"
                      className="text-[9px] px-2 py-1 rounded"
                      style={{
                        background: "rgba(255,90,95,0.15)",
                        color: "#FF5A5F",
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex items-center justify-between mt-3 text-[10px] text-[#9AA8C1]">
          <span>Showing {filtered.length} of 1,284 subscribers</span>
          <div className="flex gap-1">
            <button
              type="button"
              className="px-2 py-1 rounded border border-[#24344F] hover:bg-white/5"
            >
              ← Prev
            </button>
            <button
              type="button"
              className="px-2 py-1 rounded"
              style={{ background: "#F2C94C22", color: "#F2C94C" }}
            >
              1
            </button>
            <button
              type="button"
              className="px-2 py-1 rounded border border-[#24344F] hover:bg-white/5"
            >
              2
            </button>
            <button
              type="button"
              className="px-2 py-1 rounded border border-[#24344F] hover:bg-white/5"
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SignalsTab() {
  const [instrument, setInstrument] = useState("RELIANCE");
  const [exchange, setExchange] = useState("NSE");
  const [signalType, setSignalType] = useState("SWING");
  const [action, setAction] = useState<"BUY" | "SELL">("BUY");
  const [entry, setEntry] = useState("2850");
  const [t1, setT1] = useState("2950");
  const [t2, setT2] = useState("3050");
  const [t3, setT3] = useState("3150");
  const [sl, setSl] = useState("2800");
  const [conf, setConf] = useState(85);
  const [strategy, setStrategy] = useState("EMA Crossover");
  const [riskLevel, setRiskLevel] = useState("MEDIUM");
  const [channels, setChannels] = useState({
    free: true,
    premium: true,
    elite: true,
  });
  const [previewChannel, setPreviewChannel] = useState<"free" | "premium">(
    "premium",
  );
  const [showRouting, setShowRouting] = useState(false);

  const t1Pct = entry
    ? (((Number(t1) - Number(entry)) / Number(entry)) * 100).toFixed(1)
    : "0";
  const t2Pct = entry
    ? (((Number(t2) - Number(entry)) / Number(entry)) * 100).toFixed(1)
    : "0";
  const t3Pct = entry
    ? (((Number(t3) - Number(entry)) / Number(entry)) * 100).toFixed(1)
    : "0";
  const slPct = entry
    ? (((Number(entry) - Number(sl)) / Number(entry)) * 100).toFixed(1)
    : "0";
  const rrRatio =
    slPct && t2Pct ? (Number(t2Pct) / Number(slPct)).toFixed(1) : "0";

  const freePreview = `🌞 SUN ALGO — FREE SIGNAL\n\n📌 ${instrument} | ${exchange} | ${signalType}\n📈 Action: ${action}\n💰 Entry Zone: ₹${entry}\n🎯 Target 1: ₹${t1}\n🎯 Target 2: ₹${t2}\n🛡️ Stop Loss: ₹${sl}\n⏱️ Type: ${signalType}\n📊 Confidence: ${conf}%\n\n⚠️ Free signal — delayed 20 minutes\n📰 Live signals → /subscribe\n\n⚠️ DISCLAIMER: For educational purposes only.\nNot SEBI registered advice. Trade at own risk.`;
  const premiumPreview = `🌞 SUN ALGO PREMIUM ⚡ LIVE SIGNAL\n\n━━━━━━━━━━━━━━━━━━━━━\n📌 ${instrument}\n🏛️ Exchange: ${exchange} | ${signalType}\n⏰ Signal Time: ${new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })} IST\n━━━━━━━━━━━━━━━━━━━━━\n\n📈 Action: ${action} (${signalType})\n💰 Entry: ₹${entry}\n🎯 Target 1: ₹${t1} (+${t1Pct}%)\n🎯 Target 2: ₹${t2} (+${t2Pct}%)\n🎯 Target 3: ₹${t3} (+${t3Pct}%)\n🛡️ Stop Loss: ₹${sl} (-${slPct}%)\n📐 Risk : Reward = 1 : ${rrRatio}\n\n━━━━━━━━━━━━━━━━━━━━━\n🔍 TECHNICAL ANALYSIS\nRSI Bullish ✅\nMACD Crossover ✅\nAbove 200 EMA ✅\nVolume Surge ✅\n\n⚠️ Risk Level: ${riskLevel}\n🤖 Strategy: ${strategy}\n━━━━━━━━━━━━━━━━━━━━━\n\n⚠️ Not SEBI registered investment advice.`;

  const scheduled = [
    {
      instrument: "BANKNIFTY",
      channel: "PREMIUM+ELITE",
      time: "Today 3:15 PM",
    },
    { instrument: "HDFCBANK", channel: "ALL", time: "Tomorrow 9:20 AM" },
    { instrument: "BTC/USDT", channel: "ELITE", time: "Tomorrow 10:00 AM" },
  ];

  return (
    <div className="space-y-5">
      {/* Accuracy Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard index={30} title="Win Rate" value="73.4%" color="#2ED47A" />
        <KpiCard index={31} title="Avg R:R" value="1 : 2.8" color="#F2C94C" />
        <KpiCard
          index={32}
          title="Best Strategy"
          value="EMA Cross"
          color="#60AFFF"
          sub="81% win rate"
        />
        <KpiCard
          index={33}
          title="Best Instrument"
          value="BANKNIFTY"
          color="#EAF0FF"
          sub="78% win rate"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Create Signal Form */}
        <div className="trading-card p-4 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <Plus className="w-4 h-4" style={{ color: "#F2C94C" }} />
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#EAF0FF]">
              Create New Signal
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="text-[10px] text-[#9AA8C1] block mb-1">
                Instrument
              </div>
              <Input
                value={instrument}
                onChange={(e) => setInstrument(e.target.value)}
                className="h-8 text-xs bg-white/5 border-[#24344F] text-[#EAF0FF]"
              />
            </div>
            <div>
              <div className="text-[10px] text-[#9AA8C1] block mb-1">
                Exchange
              </div>
              <select
                value={exchange}
                onChange={(e) => setExchange(e.target.value)}
                className="w-full h-8 text-xs px-2 rounded-md border text-[#EAF0FF] bg-[#0D1B2E] border-[#24344F]"
              >
                {["NSE", "BSE", "MCX", "CRYPTO", "FOREX", "US"].map((x) => (
                  <option key={x} value={x} className="bg-[#0D1B2E]">
                    {x}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="text-[10px] text-[#9AA8C1] block mb-1">
                Signal Type
              </div>
              <select
                value={signalType}
                onChange={(e) => setSignalType(e.target.value)}
                className="w-full h-8 text-xs px-2 rounded-md border text-[#EAF0FF] bg-[#0D1B2E] border-[#24344F]"
              >
                {[
                  "SWING",
                  "INTRADAY",
                  "OPTIONS",
                  "FNO",
                  "FOREX",
                  "CRYPTO",
                  "US_STOCK",
                ].map((t) => (
                  <option key={t} value={t} className="bg-[#0D1B2E]">
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <div className="text-[10px] text-[#9AA8C1] block mb-1">
                Action
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setAction("BUY")}
                  className="flex-1 h-8 text-xs font-bold rounded-md transition-all"
                  style={{
                    background:
                      action === "BUY" ? "#2ED47A" : "rgba(46,212,122,0.1)",
                    color: action === "BUY" ? "#0B1424" : "#2ED47A",
                    border: "1px solid #2ED47A44",
                  }}
                >
                  BUY
                </button>
                <button
                  type="button"
                  onClick={() => setAction("SELL")}
                  className="flex-1 h-8 text-xs font-bold rounded-md transition-all"
                  style={{
                    background:
                      action === "SELL" ? "#FF5A5F" : "rgba(255,90,95,0.1)",
                    color: action === "SELL" ? "white" : "#FF5A5F",
                    border: "1px solid #FF5A5F44",
                  }}
                >
                  SELL
                </button>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="text-[10px] text-[#9AA8C1] block mb-1">
                Entry Price ₹
              </div>
              <Input
                value={entry}
                onChange={(e) => setEntry(e.target.value)}
                className="h-8 text-xs bg-white/5 border-[#24344F] text-[#EAF0FF]"
              />
            </div>
            <div>
              <div className="text-[10px] text-[#9AA8C1] block mb-1">
                Stop Loss ₹
              </div>
              <Input
                value={sl}
                onChange={(e) => setSl(e.target.value)}
                className="h-8 text-xs bg-white/5 border-[#24344F] text-[#EAF0FF]"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <div className="text-[10px] text-[#9AA8C1] block mb-1">
                Target 1 ₹
              </div>
              <Input
                value={t1}
                onChange={(e) => setT1(e.target.value)}
                className="h-8 text-xs bg-white/5 border-[#24344F] text-[#EAF0FF]"
              />
            </div>
            <div>
              <div className="text-[10px] text-[#9AA8C1] block mb-1">
                Target 2 ₹
              </div>
              <Input
                value={t2}
                onChange={(e) => setT2(e.target.value)}
                className="h-8 text-xs bg-white/5 border-[#24344F] text-[#EAF0FF]"
              />
            </div>
            <div>
              <div className="text-[10px] text-[#9AA8C1] block mb-1">
                Target 3 ₹
              </div>
              <Input
                value={t3}
                onChange={(e) => setT3(e.target.value)}
                className="h-8 text-xs bg-white/5 border-[#24344F] text-[#EAF0FF]"
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <div className="text-[10px] text-[#9AA8C1]">
                Confidence: {conf}%
              </div>
              <span
                className="text-[10px] font-bold"
                style={{
                  color:
                    conf >= 85 ? "#2ED47A" : conf >= 75 ? "#F2C94C" : "#FF5A5F",
                }}
              >
                {conf >= 85 ? "HIGH" : conf >= 75 ? "MEDIUM" : "LOW"}
              </span>
            </div>
            <input
              type="range"
              min="50"
              max="100"
              value={conf}
              onChange={(e) => setConf(Number(e.target.value))}
              className="w-full h-1.5 rounded-full cursor-pointer"
              style={{ accentColor: "#F2C94C" }}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="text-[10px] text-[#9AA8C1] block mb-1">
                Strategy
              </div>
              <select
                value={strategy}
                onChange={(e) => setStrategy(e.target.value)}
                className="w-full h-8 text-xs px-2 rounded-md border text-[#EAF0FF] bg-[#0D1B2E] border-[#24344F]"
              >
                {[
                  "EMA Crossover",
                  "Supertrend",
                  "BB Squeeze",
                  "RSI Divergence",
                  "VWAP",
                ].map((s) => (
                  <option key={s} value={s} className="bg-[#0D1B2E]">
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <div className="text-[10px] text-[#9AA8C1] block mb-1">
                Risk Level
              </div>
              <div className="flex gap-1">
                {["LOW", "MEDIUM", "HIGH"].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRiskLevel(r)}
                    className="flex-1 h-8 text-[9px] font-bold rounded transition-all"
                    style={{
                      background:
                        riskLevel === r
                          ? r === "LOW"
                            ? "#2ED47A"
                            : r === "MEDIUM"
                              ? "#F2C94C"
                              : "#FF5A5F"
                          : "rgba(255,255,255,0.05)",
                      color: riskLevel === r ? "#0B1424" : "#9AA8C1",
                    }}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div>
            <div className="text-[10px] text-[#9AA8C1] block mb-1">
              Post to Channels
            </div>
            <div className="flex gap-3">
              {(["free", "premium", "elite"] as const).map((ch) => (
                <label
                  key={ch}
                  className="flex items-center gap-1.5 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={channels[ch]}
                    onChange={(e) =>
                      setChannels((p) => ({ ...p, [ch]: e.target.checked }))
                    }
                    className="w-3 h-3"
                    style={{ accentColor: "#F2C94C" }}
                  />
                  <span className="text-[10px] text-[#EAF0FF] capitalize">
                    {ch}
                  </span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex gap-2 pt-1">
            <Button
              className="flex-1 h-8 text-xs font-bold"
              style={{ background: "#F2C94C", color: "#0B1424" }}
            >
              <Send className="w-3 h-3 mr-1" /> Send Now
            </Button>
            <Button
              variant="outline"
              className="flex-1 h-8 text-xs"
              style={{ borderColor: "#24344F", color: "#9AA8C1" }}
            >
              <Clock className="w-3 h-3 mr-1" /> Schedule
            </Button>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="space-y-3">
          <div className="trading-card p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-bold uppercase tracking-widest text-[#EAF0FF]">
                Signal Preview
              </h2>
              <div className="flex gap-1">
                {(["free", "premium"] as const).map((ch) => (
                  <button
                    key={ch}
                    type="button"
                    onClick={() => setPreviewChannel(ch)}
                    className="text-[9px] px-2 py-1 rounded capitalize"
                    style={{
                      background:
                        previewChannel === ch ? "#F2C94C22" : "transparent",
                      color: previewChannel === ch ? "#F2C94C" : "#9AA8C1",
                      border: `1px solid ${previewChannel === ch ? "#F2C94C44" : "#24344F"}`,
                    }}
                  >
                    {ch}
                  </button>
                ))}
              </div>
            </div>
            <div
              className="rounded-xl p-3 font-mono text-[10px] whitespace-pre-wrap leading-relaxed"
              style={{
                background: "rgba(0,0,0,0.3)",
                color: "#EAF0FF",
                border: "1px solid #1E2C44",
              }}
            >
              {previewChannel === "free" ? freePreview : premiumPreview}
            </div>
          </div>

          {/* Routing Rules */}
          <div className="trading-card p-3">
            <button
              type="button"
              onClick={() => setShowRouting((p) => !p)}
              className="flex items-center justify-between w-full"
            >
              <span className="text-xs font-bold text-[#EAF0FF]">
                Signal Routing Rules
              </span>
              <span className="text-[#9AA8C1] text-xs">
                {showRouting ? "▲" : "▼"}
              </span>
            </button>
            {showRouting && (
              <div className="mt-3 space-y-2 text-[10px]">
                {[
                  {
                    rule: "SWING ≥ 85% confidence",
                    dest: "Free (20min delay) + Premium + Elite",
                  },
                  {
                    rule: "INTRADAY ≥ 75% confidence",
                    dest: "Premium + Elite only",
                  },
                  { rule: "FOREX / CRYPTO / US_STOCK", dest: "Elite only" },
                  { rule: "OPTIONS / FNO", dest: "Premium + Elite" },
                ].map((r) => (
                  <div
                    key={r.rule}
                    className="flex gap-2 py-1.5"
                    style={{ borderBottom: "1px solid #1E2C44" }}
                  >
                    <span className="text-[#F2C94C] font-mono w-44 flex-shrink-0">
                      {r.rule}
                    </span>
                    <span className="text-[#9AA8C1]">→ {r.dest}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Scheduled Queue */}
          <div className="trading-card p-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#EAF0FF] mb-3">
              Scheduled Queue
            </h2>
            {scheduled.map((s, i) => (
              <div
                key={s.instrument}
                className="flex items-center justify-between py-2"
                style={{
                  borderBottom:
                    i < scheduled.length - 1 ? "1px solid #1E2C44" : "none",
                }}
              >
                <div>
                  <div className="text-xs font-bold text-[#EAF0FF]">
                    {s.instrument}
                  </div>
                  <div className="text-[10px] text-[#9AA8C1]">
                    {s.channel} · {s.time}
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    type="button"
                    className="p-1 rounded hover:bg-white/10"
                  >
                    <Edit className="w-3 h-3 text-[#9AA8C1]" />
                  </button>
                  <button
                    type="button"
                    className="p-1 rounded hover:bg-white/10"
                  >
                    <Trash2 className="w-3 h-3 text-[#FF5A5F]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Signal History */}
      <div className="trading-card p-4">
        <h2 className="text-xs font-bold uppercase tracking-widest text-[#EAF0FF] mb-3">
          Signal History
        </h2>
        <Table>
          <TableHeader>
            <TableRow style={{ borderColor: "#24344F" }}>
              {[
                "ID",
                "Instrument",
                "Type",
                "Action",
                "Entry",
                "T1",
                "T2",
                "SL",
                "Conf",
                "Channel",
                "Posted",
                "Result",
                "P&L",
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
            {MOCK_SIGNALS_LOG.map((sig, i) => (
              <TableRow
                key={sig.id}
                data-ocid={`signals.row.${i + 1}`}
                style={{ borderColor: "#1E2C44" }}
                className="hover:bg-white/5"
              >
                <TableCell className="text-[10px] font-mono text-[#9AA8C1]">
                  {sig.id}
                </TableCell>
                <TableCell className="text-xs font-bold text-[#EAF0FF]">
                  {sig.instrument}
                </TableCell>
                <TableCell className="text-[10px] text-[#9AA8C1]">
                  {sig.type}
                </TableCell>
                <TableCell>
                  <span
                    className="text-[10px] font-bold"
                    style={{
                      color: sig.action === "BUY" ? "#2ED47A" : "#FF5A5F",
                    }}
                  >
                    {sig.action}
                  </span>
                </TableCell>
                <TableCell className="text-[10px] tabular-nums text-[#EAF0FF]">
                  ₹{sig.entry}
                </TableCell>
                <TableCell className="text-[10px] tabular-nums text-[#9AA8C1]">
                  ₹{sig.t1}
                </TableCell>
                <TableCell className="text-[10px] tabular-nums text-[#9AA8C1]">
                  ₹{sig.t2}
                </TableCell>
                <TableCell className="text-[10px] tabular-nums text-[#9AA8C1]">
                  ₹{sig.sl}
                </TableCell>
                <TableCell
                  className="text-[10px]"
                  style={{
                    color:
                      sig.conf >= 85
                        ? "#2ED47A"
                        : sig.conf >= 75
                          ? "#F2C94C"
                          : "#9AA8C1",
                  }}
                >
                  {sig.conf}%
                </TableCell>
                <TableCell>
                  <Badge
                    className="text-[8px]"
                    style={{
                      background: "rgba(96,175,255,0.1)",
                      color: "#60AFFF",
                      border: "none",
                    }}
                  >
                    {sig.channel}
                  </Badge>
                </TableCell>
                <TableCell className="text-[10px] text-[#9AA8C1]">
                  {sig.posted}
                </TableCell>
                <TableCell>
                  <ResultBadge result={sig.result} />
                </TableCell>
                <TableCell
                  className="text-[10px] font-bold"
                  style={{
                    color: sig.pnl.startsWith("+") ? "#2ED47A" : "#FF5A5F",
                  }}
                >
                  {sig.pnl}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function BroadcastTab() {
  const [audience, setAudience] = useState("All Users");
  const [msgType, setMsgType] = useState("text");
  const [msg, setMsg] = useState("");
  const [schedule, setSchedule] = useState(false);

  const audiences = [
    { label: "All Users", count: 1284 },
    { label: "Free Users", count: 294 },
    { label: "Basic", count: 548 },
    { label: "Pro", count: 286 },
    { label: "Elite", count: 156 },
  ];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Composer */}
        <div className="trading-card p-4 space-y-4">
          <div className="flex items-center gap-2">
            <Send className="w-4 h-4" style={{ color: "#F2C94C" }} />
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#EAF0FF]">
              Compose Broadcast
            </h2>
          </div>

          <div>
            <div className="text-[10px] text-[#9AA8C1] block mb-2">
              Target Audience
            </div>
            <div className="grid grid-cols-2 gap-2">
              {audiences.map((a) => (
                <button
                  key={a.label}
                  type="button"
                  onClick={() => setAudience(a.label)}
                  className="flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all"
                  style={{
                    background:
                      audience === a.label
                        ? "rgba(242,201,76,0.1)"
                        : "rgba(255,255,255,0.03)",
                    border: `1px solid ${audience === a.label ? "#F2C94C44" : "#24344F"}`,
                    color: audience === a.label ? "#F2C94C" : "#9AA8C1",
                  }}
                >
                  <span className="font-semibold">{a.label}</span>
                  <span className="text-[10px]">
                    {a.count.toLocaleString()}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="text-[10px] text-[#9AA8C1] block mb-2">
              Message Type
            </div>
            <div className="flex gap-1">
              {["text", "photo", "video", "document"].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setMsgType(t)}
                  className="px-3 py-1 rounded text-[10px] capitalize"
                  style={{
                    background:
                      msgType === t ? "#F2C94C" : "rgba(255,255,255,0.05)",
                    color: msgType === t ? "#0B1424" : "#9AA8C1",
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="text-[10px] text-[#9AA8C1] block mb-1">Message</div>
            <Textarea
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              placeholder="Type your broadcast message here..."
              rows={5}
              className="text-xs bg-white/5 border-[#24344F] text-[#EAF0FF] placeholder:text-[#9AA8C1] resize-none"
            />
            <div className="text-right text-[10px] text-[#9AA8C1] mt-1">
              {msg.length} / 4096
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="schedule"
              checked={schedule}
              onChange={(e) => setSchedule(e.target.checked)}
              style={{ accentColor: "#F2C94C" }}
            />
            <label htmlFor="schedule" className="text-xs text-[#9AA8C1]">
              Schedule for later
            </label>
          </div>
          {schedule && (
            <Input
              type="datetime-local"
              className="h-8 text-xs bg-white/5 border-[#24344F] text-[#EAF0FF]"
            />
          )}

          <Button
            className="w-full h-9 font-bold"
            style={{ background: "#F2C94C", color: "#0B1424" }}
          >
            <Send className="w-4 h-4 mr-2" />{" "}
            {schedule ? "Schedule Broadcast" : "Send Now"}
          </Button>
        </div>

        {/* Preview */}
        <div className="space-y-4">
          <div className="trading-card p-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#EAF0FF] mb-3">
              Preview
            </h2>
            <div className="flex gap-3">
              <div
                className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center"
                style={{ background: "#F2C94C22" }}
              >
                <Bot className="w-4 h-4" style={{ color: "#F2C94C" }} />
              </div>
              <div
                className="rounded-xl rounded-tl-none p-3 max-w-[85%] text-xs"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  color: "#EAF0FF",
                }}
              >
                {msg || "Your broadcast message will appear here..."}
                <div className="text-[9px] text-[#9AA8C1] mt-1 text-right">
                  @SunAlgoBot · Just now
                </div>
              </div>
            </div>
          </div>

          <div className="trading-card p-3">
            <div className="flex items-center gap-2 text-xs text-[#9AA8C1] mb-1">
              <Users className="w-3.5 h-3.5" />
              <span>
                Reaching:{" "}
                <span className="text-[#EAF0FF] font-bold">
                  {audiences
                    .find((a) => a.label === audience)
                    ?.count.toLocaleString()}{" "}
                  users
                </span>
              </span>
            </div>
            <div className="text-[10px] text-[#9AA8C1]">
              Estimated delivery: ~2 minutes
            </div>
          </div>
        </div>
      </div>

      {/* Broadcast History */}
      <div className="trading-card p-4">
        <h2 className="text-xs font-bold uppercase tracking-widest text-[#EAF0FF] mb-3">
          Broadcast History
        </h2>
        <Table>
          <TableHeader>
            <TableRow style={{ borderColor: "#24344F" }}>
              {[
                "Date / Time",
                "Message Preview",
                "Audience",
                "Sent",
                "Delivered",
                "Failed",
                "Status",
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
            {MOCK_BROADCASTS.map((b, i) => (
              <TableRow
                key={b.id}
                data-ocid={`broadcast.row.${i + 1}`}
                style={{ borderColor: "#1E2C44" }}
                className="hover:bg-white/5"
              >
                <TableCell className="text-[10px] text-[#9AA8C1] whitespace-nowrap">
                  {b.time}
                </TableCell>
                <TableCell className="text-xs text-[#EAF0FF] max-w-[200px] truncate">
                  {b.preview}
                </TableCell>
                <TableCell className="text-xs text-[#9AA8C1]">
                  {b.audience}
                </TableCell>
                <TableCell className="text-xs text-[#EAF0FF]">
                  {b.sent.toLocaleString()}
                </TableCell>
                <TableCell className="text-xs" style={{ color: "#2ED47A" }}>
                  {b.delivered.toLocaleString()}
                </TableCell>
                <TableCell
                  className="text-xs"
                  style={{ color: b.failed > 0 ? "#FF5A5F" : "#9AA8C1" }}
                >
                  {b.failed}
                </TableCell>
                <TableCell>
                  <StatusBadge status={b.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function RevenueTab() {
  return (
    <div className="space-y-5">
      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard
          index={40}
          title="Today"
          value="₹12,480"
          color="#2ED47A"
          sub="+8% vs yesterday"
          trend="up"
          icon={<TrendingUp className="w-4 h-4" />}
        />
        <KpiCard
          index={41}
          title="This Week"
          value="₹84,750"
          color="#2ED47A"
          sub="+12% vs last week"
          trend="up"
          icon={<TrendingUp className="w-4 h-4" />}
        />
        <KpiCard
          index={42}
          title="This Month"
          value="₹3,84,750"
          color="#F2C94C"
          sub="+23% vs last month"
          trend="up"
          icon={<TrendingUp className="w-4 h-4" />}
        />
        <KpiCard
          index={43}
          title="ARR"
          value="₹46.2L"
          color="#60AFFF"
          sub="Annual Run Rate"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Revenue Donut */}
        <div className="trading-card p-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#EAF0FF] mb-4">
            Revenue by Plan
          </h2>
          <RevenueDonut />
          <div
            className="mt-4 p-3 rounded-lg"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid #1E2C44",
            }}
          >
            <div className="flex justify-between text-xs">
              <span className="text-[#9AA8C1]">Churn Rate</span>
              <span className="font-bold" style={{ color: "#2ED47A" }}>
                4.2% <span className="text-[10px]">↓ from 5.1%</span>
              </span>
            </div>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="trading-card p-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#EAF0FF] mb-1">
            New vs Renewals
          </h2>
          <div className="flex gap-3 mb-3">
            <div className="flex items-center gap-1">
              <div
                className="w-2 h-2 rounded-sm"
                style={{ background: "#F2C94C" }}
              />
              <span className="text-[10px] text-[#9AA8C1]">New</span>
            </div>
            <div className="flex items-center gap-1">
              <div
                className="w-2 h-2 rounded-sm"
                style={{ background: "#60AFFF" }}
              />
              <span className="text-[10px] text-[#9AA8C1]">Renewals</span>
            </div>
          </div>
          <RevenueBarChart />
        </div>

        {/* MRR Line */}
        <div className="trading-card p-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#EAF0FF] mb-1">
            MRR Trend
          </h2>
          <div className="text-[10px] text-[#9AA8C1] mb-3">
            ₹2.1L → ₹3.84L (6 months)
          </div>
          <MrrLineChart />
          <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
            <div>
              <div className="text-[10px] text-[#9AA8C1]">MRR Growth</div>
              <div className="font-bold" style={{ color: "#2ED47A" }}>
                +83%
              </div>
            </div>
            <div>
              <div className="text-[10px] text-[#9AA8C1]">Avg Revenue/User</div>
              <div className="font-bold text-[#EAF0FF]">₹2,994</div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Referrers */}
      <div className="trading-card p-4">
        <h2 className="text-xs font-bold uppercase tracking-widest text-[#EAF0FF] mb-3">
          Top Referrers Leaderboard
        </h2>
        <Table>
          <TableHeader>
            <TableRow style={{ borderColor: "#24344F" }}>
              {[
                "Rank",
                "Name",
                "Username",
                "Referrals",
                "Plan",
                "Total Earned",
                "Level",
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
            {REFERRERS.slice(0, 5).map((r, i) => (
              <TableRow
                key={r.rank}
                data-ocid={`revenue.row.${i + 1}`}
                style={{ borderColor: "#1E2C44" }}
                className="hover:bg-white/5"
              >
                <TableCell
                  className="text-sm font-bold"
                  style={{ color: r.rank <= 3 ? "#F2C94C" : "#9AA8C1" }}
                >
                  {r.badge || r.rank}
                </TableCell>
                <TableCell className="text-xs font-semibold text-[#EAF0FF]">
                  {r.name}
                </TableCell>
                <TableCell className="text-xs text-[#60AFFF]">
                  {r.username}
                </TableCell>
                <TableCell className="text-xs font-bold text-[#EAF0FF]">
                  {r.referrals}
                </TableCell>
                <TableCell>
                  <PlanBadge plan="PRO" />
                </TableCell>
                <TableCell
                  className="text-xs font-bold"
                  style={{ color: "#2ED47A" }}
                >
                  {r.earned}
                </TableCell>
                <TableCell>
                  <Badge
                    className="text-[9px]"
                    style={{
                      background: "rgba(242,201,76,0.1)",
                      color: "#F2C94C",
                      border: "none",
                    }}
                  >
                    {r.level}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function PerformanceTab() {
  const channelData = [
    {
      channel: "Free",
      signals: 234,
      winRate: "68%",
      avgReturn: "+5.2%",
      avgRR: "1:2.1",
    },
    {
      channel: "Premium",
      signals: 1456,
      winRate: "74%",
      avgReturn: "+8.4%",
      avgRR: "1:2.9",
    },
    {
      channel: "Elite",
      signals: 1157,
      winRate: "79%",
      avgReturn: "+12.1%",
      avgRR: "1:3.4",
    },
  ];
  const strategies = [
    {
      name: "EMA Crossover",
      signals: 612,
      winRate: "81%",
      avgPnl: "+9.4%",
      best: "NIFTY 50",
    },
    {
      name: "Supertrend",
      signals: 487,
      winRate: "76%",
      avgPnl: "+7.8%",
      best: "BANKNIFTY",
    },
    {
      name: "BB Squeeze",
      signals: 398,
      winRate: "72%",
      avgPnl: "+6.5%",
      best: "RELIANCE",
    },
    {
      name: "RSI Divergence",
      signals: 312,
      winRate: "69%",
      avgPnl: "+5.9%",
      best: "TCS",
    },
    {
      name: "VWAP",
      signals: 284,
      winRate: "74%",
      avgPnl: "+8.1%",
      best: "HDFCBANK",
    },
  ];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <KpiCard
          index={50}
          title="Total Signals (All)"
          value="2,847"
          color="#EAF0FF"
        />
        <KpiCard index={51} title="This Month" value="156" color="#60AFFF" />
        <KpiCard index={52} title="Win Rate" value="73.4%" color="#2ED47A" />
        <KpiCard index={53} title="Avg R:R" value="1 : 2.8" color="#F2C94C" />
        <KpiCard
          index={54}
          title="Best Strategy"
          value="EMA Cross"
          color="#60AFFF"
          sub="81% win"
        />
        <KpiCard
          index={55}
          title="Best Instrument"
          value="BANKNIFTY"
          color="#EAF0FF"
          sub="78% win"
        />
      </div>

      {/* Monthly P&L */}
      <div className="trading-card p-5">
        <h2 className="text-xs font-bold uppercase tracking-widest text-[#EAF0FF] mb-4">
          Monthly Signal P&L
        </h2>
        <PnlBarChart />
      </div>

      {/* Channel Comparison */}
      <div className="trading-card p-4">
        <h2 className="text-xs font-bold uppercase tracking-widest text-[#EAF0FF] mb-3">
          Channel Performance Comparison
        </h2>
        <Table>
          <TableHeader>
            <TableRow style={{ borderColor: "#24344F" }}>
              {["Channel", "Signals", "Win Rate", "Avg Return", "Avg R:R"].map(
                (h) => (
                  <TableHead
                    key={h}
                    className="text-[#9AA8C1] text-[10px] uppercase"
                  >
                    {h}
                  </TableHead>
                ),
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {channelData.map((c, i) => (
              <TableRow
                key={c.channel}
                data-ocid={`perf.row.${i + 1}`}
                style={{ borderColor: "#1E2C44" }}
                className="hover:bg-white/5"
              >
                <TableCell className="text-xs font-bold text-[#EAF0FF]">
                  {c.channel}
                </TableCell>
                <TableCell className="text-xs text-[#9AA8C1]">
                  {c.signals.toLocaleString()}
                </TableCell>
                <TableCell
                  className="text-xs font-bold"
                  style={{ color: "#2ED47A" }}
                >
                  {c.winRate}
                </TableCell>
                <TableCell
                  className="text-xs font-bold"
                  style={{ color: "#2ED47A" }}
                >
                  {c.avgReturn}
                </TableCell>
                <TableCell className="text-xs text-[#F2C94C]">
                  {c.avgRR}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Strategy Breakdown */}
      <div className="trading-card p-4">
        <h2 className="text-xs font-bold uppercase tracking-widest text-[#EAF0FF] mb-3">
          Strategy Performance Breakdown
        </h2>
        <Table>
          <TableHeader>
            <TableRow style={{ borderColor: "#24344F" }}>
              {[
                "Strategy",
                "Signals",
                "Win Rate",
                "Avg P&L",
                "Best Instrument",
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
            {strategies.map((s, i) => (
              <TableRow
                key={s.name}
                data-ocid={`strategy.row.${i + 1}`}
                style={{ borderColor: "#1E2C44" }}
                className="hover:bg-white/5"
              >
                <TableCell className="text-xs font-bold text-[#EAF0FF]">
                  {s.name}
                </TableCell>
                <TableCell className="text-xs text-[#9AA8C1]">
                  {s.signals}
                </TableCell>
                <TableCell
                  className="text-xs font-bold"
                  style={{
                    color:
                      Number(s.winRate.replace("%", "")) >= 75
                        ? "#2ED47A"
                        : "#F2C94C",
                  }}
                >
                  {s.winRate}
                </TableCell>
                <TableCell
                  className="text-xs font-bold"
                  style={{ color: "#2ED47A" }}
                >
                  {s.avgPnl}
                </TableCell>
                <TableCell className="text-xs text-[#9AA8C1]">
                  {s.best}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function ReferralsTab() {
  const [wdAction, setWdAction] = useState<
    Record<string, "approved" | "rejected" | null>
  >({});

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard
          index={60}
          title="Total Referrals"
          value="3,847"
          color="#EAF0FF"
          icon={<Users className="w-4 h-4" />}
        />
        <KpiCard
          index={61}
          title="Referral Users"
          value="289"
          color="#60AFFF"
        />
        <KpiCard
          index={62}
          title="Total Commission Paid"
          value="₹8,47,250"
          color="#2ED47A"
          icon={<Wallet className="w-4 h-4" />}
        />
        <KpiCard
          index={63}
          title="Pending Withdrawals"
          value="₹34,500"
          color="#F2C94C"
          sub="12 requests"
        />
      </div>

      {/* Referral Tiers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {[
          {
            level: "Level 1",
            range: "1 – 5 referrals",
            commission: "20%",
            users: 156,
            color: "#9AA8C1",
          },
          {
            level: "Level 2",
            range: "6 – 15 referrals",
            commission: "25%",
            users: 89,
            color: "#F2C94C",
          },
          {
            level: "Level 3",
            range: "16+ referrals",
            commission: "30% + 🏆",
            users: 44,
            color: "#2ED47A",
          },
        ].map((t, i) => (
          <div
            key={t.level}
            className="trading-card p-4"
            data-ocid={`referral.tier.${i + 1}`}
          >
            <div className="text-sm font-bold mb-1" style={{ color: t.color }}>
              {t.level}
            </div>
            <div className="text-xs text-[#9AA8C1]">{t.range}</div>
            <div
              className="text-2xl font-bold mt-2 mb-1"
              style={{ color: t.color }}
            >
              {t.commission}
            </div>
            <div className="text-[10px] text-[#9AA8C1]">commission</div>
            <div className="text-xs text-[#EAF0FF] mt-2">
              {t.users} users at this level
            </div>
          </div>
        ))}
      </div>

      {/* Leaderboard */}
      <div className="trading-card p-4">
        <div className="flex items-center gap-2 mb-3">
          <Trophy className="w-4 h-4" style={{ color: "#F2C94C" }} />
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#EAF0FF]">
            Top 10 Referrers
          </h2>
        </div>
        <Table>
          <TableHeader>
            <TableRow style={{ borderColor: "#24344F" }}>
              {[
                "Rank",
                "Name",
                "Username",
                "Referrals",
                "Active",
                "Level",
                "Total Earned",
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
            {REFERRERS.map((r, i) => (
              <TableRow
                key={r.rank}
                data-ocid={`referral.row.${i + 1}`}
                style={{ borderColor: "#1E2C44" }}
                className="hover:bg-white/5"
              >
                <TableCell
                  className="text-sm font-bold"
                  style={{ color: r.rank <= 3 ? "#F2C94C" : "#9AA8C1" }}
                >
                  {r.badge || `#${r.rank}`}
                </TableCell>
                <TableCell className="text-xs font-semibold text-[#EAF0FF]">
                  {r.name}
                </TableCell>
                <TableCell className="text-xs text-[#60AFFF]">
                  {r.username}
                </TableCell>
                <TableCell className="text-xs font-bold text-[#EAF0FF]">
                  {r.referrals}
                </TableCell>
                <TableCell className="text-xs" style={{ color: "#2ED47A" }}>
                  {r.active}
                </TableCell>
                <TableCell>
                  <Badge
                    className="text-[9px]"
                    style={{
                      background: "rgba(242,201,76,0.1)",
                      color: "#F2C94C",
                      border: "none",
                    }}
                  >
                    {r.level}
                  </Badge>
                </TableCell>
                <TableCell
                  className="text-xs font-bold"
                  style={{ color: "#2ED47A" }}
                >
                  {r.earned}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pending Withdrawals */}
      <div className="trading-card p-4">
        <div className="flex items-center gap-2 mb-3">
          <Wallet className="w-4 h-4" style={{ color: "#F2C94C" }} />
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#EAF0FF]">
            Pending Withdrawal Requests
          </h2>
        </div>
        <Table>
          <TableHeader>
            <TableRow style={{ borderColor: "#24344F" }}>
              {[
                "User",
                "Username",
                "Amount",
                "UPI ID",
                "Requested",
                "Actions",
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
            {WITHDRAWALS.map((w, i) => (
              <TableRow
                key={w.id}
                data-ocid={`withdrawal.row.${i + 1}`}
                style={{ borderColor: "#1E2C44" }}
                className="hover:bg-white/5"
              >
                <TableCell className="text-xs font-semibold text-[#EAF0FF]">
                  {w.user}
                </TableCell>
                <TableCell className="text-xs text-[#60AFFF]">
                  {w.username}
                </TableCell>
                <TableCell
                  className="text-xs font-bold"
                  style={{ color: "#F2C94C" }}
                >
                  {w.amount}
                </TableCell>
                <TableCell className="text-[10px] font-mono text-[#9AA8C1]">
                  {w.upi}
                </TableCell>
                <TableCell className="text-[10px] text-[#9AA8C1]">
                  {w.requested}
                </TableCell>
                <TableCell>
                  {wdAction[w.id] ? (
                    <Badge
                      className="text-[9px]"
                      style={{
                        background:
                          wdAction[w.id] === "approved"
                            ? "rgba(46,212,122,0.15)"
                            : "rgba(255,90,95,0.15)",
                        color:
                          wdAction[w.id] === "approved" ? "#2ED47A" : "#FF5A5F",
                        border: "none",
                      }}
                    >
                      {wdAction[w.id] === "approved" ? "APPROVED" : "REJECTED"}
                    </Badge>
                  ) : (
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() =>
                          setWdAction((p) => ({ ...p, [w.id]: "approved" }))
                        }
                        className="text-[9px] px-2 py-1 rounded font-bold"
                        style={{
                          background: "rgba(46,212,122,0.15)",
                          color: "#2ED47A",
                        }}
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setWdAction((p) => ({ ...p, [w.id]: "rejected" }))
                        }
                        className="text-[9px] px-2 py-1 rounded font-bold"
                        style={{
                          background: "rgba(255,90,95,0.15)",
                          color: "#FF5A5F",
                        }}
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function BotConfigTab() {
  const plans = [
    {
      name: "FREE",
      price: "₹0/month",
      signals: "2-3/day (delayed 20 min)",
      markets: "India only",
      color: "#9AA8C1",
    },
    {
      name: "BASIC",
      price: "₹999/month",
      signals: "10-15/day (realtime)",
      markets: "NSE / BSE / MCX",
      color: "#60AFFF",
    },
    {
      name: "PRO",
      price: "₹2,499/mo · ₹19,999/yr",
      signals: "25-30/day (realtime)",
      markets: "India + Global",
      color: "#F2C94C",
    },
    {
      name: "ELITE",
      price: "₹4,999/month",
      signals: "Unlimited + VIP",
      markets: "All + Crypto + Forex",
      color: "#2ED47A",
    },
  ];
  const commands = [
    {
      cmd: "/start",
      desc: "Welcome message with subscription plan buttons + privacy policy",
    },
    {
      cmd: "/subscribe",
      desc: "Show plans with inline Razorpay payment buttons",
    },
    { cmd: "/status", desc: "Show user subscription status + expiry date" },
    { cmd: "/signals", desc: "Show today's active signals list" },
    { cmd: "/portfolio", desc: "Show virtual portfolio performance" },
    {
      cmd: "/trial",
      desc: "Activate 7-day free trial (once per user / phone)",
    },
    {
      cmd: "/refer",
      desc: "Generate personal referral link (SUN-XXXXX) + stats",
    },
    { cmd: "/settings", desc: "User preferences: market type, language" },
    { cmd: "/help", desc: "Help and support contact" },
    { cmd: "/unsubscribe", desc: "Cancel subscription flow" },
    { cmd: "/withdraw", desc: "Wallet balance + UPI withdrawal request" },
    {
      cmd: "/deletedata",
      desc: "GDPR: erase all user data (12-month retention policy)",
    },
  ];
  const envVars = [
    { key: "TELEGRAM_BOT_TOKEN", status: "ok" },
    { key: "TELEGRAM_FREE_CHANNEL_ID", status: "ok" },
    { key: "TELEGRAM_PREMIUM_CHANNEL_ID", status: "ok" },
    { key: "TELEGRAM_ELITE_CHANNEL_ID", status: "ok" },
    { key: "RAZORPAY_KEY_ID", status: "ok" },
    { key: "RAZORPAY_KEY_SECRET", status: "ok" },
    { key: "DATABASE_URL", status: "ok" },
    { key: "REDIS_URL", status: "ok" },
    { key: "ZERODHA_API_KEY", status: "warn" },
    { key: "ANGEL_ONE_API_KEY", status: "warn" },
    { key: "ALPHA_VANTAGE_KEY", status: "ok" },
    { key: "ADMIN_TELEGRAM_ID", status: "ok" },
  ];
  const security = [
    "One-time invite links (expire after 1 use + 24h)",
    "Anti-forward protection on Elite channel",
    "Watermark user Telegram ID on signal images",
    "Rate limiting on bot commands (anti-spam)",
    "One trial per Telegram account + phone number",
    "Payment verification before channel access",
    "Webhook signature validation (Razorpay HMAC-SHA256)",
    "Auto-detect and remove non-subscribers monthly",
    "All user actions logged for audit trail",
    "GDPR: /deletedata command available",
  ];

  return (
    <div className="space-y-5">
      {/* Plans */}
      <div className="trading-card p-4">
        <h2 className="text-xs font-bold uppercase tracking-widest text-[#EAF0FF] mb-4">
          Subscription Plans
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {plans.map((p) => (
            <div
              key={p.name}
              className="p-4 rounded-xl"
              style={{
                background: `${p.color}0D`,
                border: `1px solid ${p.color}33`,
              }}
            >
              <div
                className="text-sm font-bold mb-1"
                style={{ color: p.color }}
              >
                {p.name}
              </div>
              <div className="text-base font-bold text-[#EAF0FF] mb-2">
                {p.price}
              </div>
              <div className="text-[10px] text-[#9AA8C1] mb-1">
                📊 {p.signals}
              </div>
              <div className="text-[10px] text-[#9AA8C1]">🌐 {p.markets}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Bot Commands */}
        <div className="trading-card p-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#EAF0FF] mb-3">
            Bot Commands Reference
          </h2>
          <div className="space-y-2">
            {commands.map((c, i) => (
              <div
                key={c.cmd}
                className="flex gap-3 items-start py-1.5"
                style={{
                  borderBottom:
                    i < commands.length - 1 ? "1px solid #1E2C44" : "none",
                }}
              >
                <span
                  className="text-[10px] font-mono font-bold w-28 flex-shrink-0"
                  style={{ color: "#F2C94C" }}
                >
                  {c.cmd}
                </span>
                <span className="text-[10px] text-[#9AA8C1]">{c.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Channel Architecture */}
          <div className="trading-card p-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#EAF0FF] mb-3">
              Channel Architecture
            </h2>
            {[
              {
                handle: "@SunAlgo_Free",
                type: "PUBLIC",
                desc: "Free delayed signals",
                color: "#60AFFF",
              },
              {
                handle: "@SunAlgo_Premium",
                type: "PRIVATE",
                desc: "Paid real-time signals",
                color: "#F2C94C",
              },
              {
                handle: "@SunAlgo_Elite",
                type: "VIP PRIVATE",
                desc: "Elite members only",
                color: "#2ED47A",
              },
              {
                handle: "@SunAlgoBot",
                type: "BOT",
                desc: "Subscription + signal delivery",
                color: "#9AA8C1",
              },
              {
                handle: "@SunAlgo_Community",
                type: "PUBLIC GROUP",
                desc: "Community discussion",
                color: "#60AFFF",
              },
            ].map((ch) => (
              <div
                key={ch.handle}
                className="flex items-center gap-3 py-2"
                style={{ borderBottom: "1px solid #1E2C44" }}
              >
                <Badge
                  className="text-[8px] w-20 justify-center"
                  style={{
                    background: `${ch.color}22`,
                    color: ch.color,
                    border: "none",
                  }}
                >
                  {ch.type}
                </Badge>
                <div>
                  <div className="text-xs font-bold text-[#EAF0FF]">
                    {ch.handle}
                  </div>
                  <div className="text-[10px] text-[#9AA8C1]">{ch.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Tech Stack */}
          <div className="trading-card p-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#EAF0FF] mb-3">
              Tech Stack
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {[
                "Python 3.11+",
                "python-telegram-bot v20+",
                "FastAPI",
                "Celery + Redis",
                "PostgreSQL",
                "SQLAlchemy",
                "Razorpay SDK",
                "mplfinance",
                "APScheduler",
                "AWS EC2",
                "Nginx",
              ].map((t) => (
                <span
                  key={t}
                  className="text-[9px] px-2 py-1 rounded-full"
                  style={{
                    background: "rgba(96,175,255,0.1)",
                    color: "#60AFFF",
                    border: "1px solid #60AFFF33",
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Env Vars */}
        <div className="trading-card p-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#EAF0FF] mb-3">
            Environment Variables
          </h2>
          <div className="space-y-2">
            {envVars.map((v) => (
              <div
                key={v.key}
                className="flex items-center justify-between py-1"
                style={{ borderBottom: "1px solid #1E2C44" }}
              >
                <span className="text-[10px] font-mono text-[#EAF0FF]">
                  {v.key}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-[#9AA8C1]">
                    **********
                  </span>
                  {v.status === "ok" ? (
                    <CheckCircle
                      className="w-3.5 h-3.5"
                      style={{ color: "#2ED47A" }}
                    />
                  ) : (
                    <AlertTriangle
                      className="w-3.5 h-3.5"
                      style={{ color: "#F2C94C" }}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security */}
        <div className="space-y-4">
          <div className="trading-card p-4">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-4 h-4" style={{ color: "#2ED47A" }} />
              <h2 className="text-xs font-bold uppercase tracking-widest text-[#EAF0FF]">
                Security & Compliance
              </h2>
            </div>
            <div className="space-y-2">
              {security.map((s) => (
                <div key={s} className="flex items-start gap-2 text-[10px]">
                  <CheckCircle
                    className="w-3 h-3 flex-shrink-0 mt-0.5"
                    style={{ color: "#2ED47A" }}
                  />
                  <span className="text-[#9AA8C1]">{s}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          <div
            className="trading-card p-4"
            style={{ border: "1px solid #FF5A5F33" }}
          >
            <div className="flex items-center gap-2 mb-2">
              <XCircle className="w-3.5 h-3.5" style={{ color: "#FF5A5F" }} />
              <h2
                className="text-[10px] font-bold uppercase tracking-widest"
                style={{ color: "#FF5A5F" }}
              >
                Legal Disclaimer
              </h2>
            </div>
            <p
              className="text-[10px] leading-relaxed"
              style={{ color: "#9AA8C1" }}
            >
              ⚠️ Sun Algo signals are for educational and informational purposes
              only. We are not a SEBI registered investment advisor. Trading in
              equity, F&O, commodities, forex and crypto involves substantial
              risk of loss. Past performance does not guarantee future results.
              Please consult a certified financial advisor before making
              investment decisions. Trade at your own risk.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Telegram() {
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  const renderTab = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewTab />;
      case "subscribers":
        return <SubscribersTab />;
      case "signals":
        return <SignalsTab />;
      case "broadcast":
        return <BroadcastTab />;
      case "revenue":
        return <RevenueTab />;
      case "performance":
        return <PerformanceTab />;
      case "referrals":
        return <ReferralsTab />;
      case "config":
        return <BotConfigTab />;
      default:
        return <OverviewTab />;
    }
  };

  return (
    <div
      className="px-4 lg:px-6 max-w-[1600px] mx-auto"
      data-ocid="telegram.page"
    >
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(96,175,255,0.15)" }}
          >
            <Bot className="w-5 h-5" style={{ color: "#60AFFF" }} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-[#EAF0FF]">
              Telegram Bot Management
            </h1>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#9AA8C1]">@SunAlgoBot</span>
              <span className="w-1 h-1 rounded-full bg-[#9AA8C1]" />
              <span className="flex items-center gap-1">
                <span
                  className="w-1.5 h-1.5 rounded-full pulse-green"
                  style={{ background: "#2ED47A" }}
                />
                <span
                  className="text-[10px] font-bold"
                  style={{ color: "#2ED47A" }}
                >
                  ONLINE
                </span>
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="text-[10px] px-3 py-1.5 rounded-full"
            style={{
              background: "rgba(46,212,122,0.1)",
              color: "#2ED47A",
              border: "1px solid #2ED47A33",
            }}
          >
            Uptime: 99.7%
          </div>
          <div
            className="text-[10px] px-3 py-1.5 rounded-full"
            style={{
              background: "rgba(96,175,255,0.1)",
              color: "#60AFFF",
              border: "1px solid #60AFFF33",
            }}
          >
            1,247 commands today
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div
        className="flex overflow-x-auto gap-0 mb-6 border-b"
        style={{ borderColor: "#1E2C44" }}
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            data-ocid={`telegram.tab.${tab.id}`}
            className="flex items-center gap-1.5 px-4 py-3 text-[11px] font-semibold uppercase tracking-wider whitespace-nowrap transition-all relative flex-shrink-0"
            style={{ color: activeTab === tab.id ? "#F2C94C" : "#9AA8C1" }}
          >
            {tab.icon}
            {tab.label}
            {activeTab === tab.id && (
              <span
                className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full"
                style={{ background: "#F2C94C" }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {renderTab()}
    </div>
  );
}
