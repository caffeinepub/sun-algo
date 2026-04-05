import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Activity,
  AlertCircle,
  BarChart2,
  CheckCircle,
  Cpu,
  DollarSign,
  Users,
} from "lucide-react";
import type { SignalType } from "../backend.d";
import { useIsAdmin, useSignals } from "../hooks/useQueries";

const MOCK_USERS = [
  {
    address: "rdmx6-j...p27",
    name: "Rajesh Kumar",
    email: "rajesh@example.com",
    role: "admin",
    subscription: "elite",
    kyc: "verified",
  },
  {
    address: "bngui-k...m4a",
    name: "Priya Sharma",
    email: "priya@example.com",
    role: "user",
    subscription: "pro",
    kyc: "verified",
  },
  {
    address: "aef7c-n...q9x",
    name: "Amit Singh",
    email: "amit@example.com",
    role: "user",
    subscription: "free",
    kyc: "pending",
  },
  {
    address: "kmc2p-r...h8z",
    name: "Neha Patel",
    email: "neha@example.com",
    role: "user",
    subscription: "pro",
    kyc: "verified",
  },
  {
    address: "opm3q-t...j5w",
    name: "Vikram Rao",
    email: "vikram@example.com",
    role: "guest",
    subscription: "free",
    kyc: "rejected",
  },
];

const MOCK_SIGNALS = [
  {
    id: "s1",
    instrumentSymbol: "RELIANCE",
    signalType: "strongBuy" as SignalType,
    confidence: 0.87,
    entryPrice: 2850,
    targetPrice: 2950,
    stopLoss: 2800,
    strategyName: "EMA Crossover",
    timeframe: "15M",
    timestamp: BigInt(Date.now()),
    technicalScore: 85,
    fundamentalScore: 78,
  },
  {
    id: "s2",
    instrumentSymbol: "BANKNIFTY",
    signalType: "buy" as SignalType,
    confidence: 0.74,
    entryPrice: 52400,
    targetPrice: 53200,
    stopLoss: 51800,
    strategyName: "Supertrend",
    timeframe: "1H",
    timestamp: BigInt(Date.now()),
    technicalScore: 72,
    fundamentalScore: 68,
  },
  {
    id: "s3",
    instrumentSymbol: "BTC/USD",
    signalType: "sell" as SignalType,
    confidence: 0.68,
    entryPrice: 67200,
    targetPrice: 65500,
    stopLoss: 68200,
    strategyName: "BB Squeeze",
    timeframe: "1D",
    timestamp: BigInt(Date.now()),
    technicalScore: 64,
    fundamentalScore: 55,
  },
];

const SYSTEM_HEALTH = [
  { name: "Signal Engine", status: "operational", latency: "142ms" },
  { name: "Broker APIs", status: "operational", latency: "89ms" },
  { name: "Database", status: "operational", latency: "12ms" },
  { name: "WebSocket Feed", status: "operational", latency: "34ms" },
];

const SUBSCRIPTION_DATA = [
  { plan: "Free", count: 234, color: "#9AA8C1" },
  { plan: "Pro", count: 89, color: "#F2C94C" },
  { plan: "Elite", count: 31, color: "#2ED47A" },
];

function SubscriptionDonut() {
  const total = SUBSCRIPTION_DATA.reduce((s, d) => s + d.count, 0);
  let cumAngle = -Math.PI / 2;
  const cx = 60;
  const cy = 60;
  const r = 48;
  const innerR = 30;

  const segments = SUBSCRIPTION_DATA.map((d) => {
    const angle = (d.count / total) * 2 * Math.PI;
    const startAngle = cumAngle;
    cumAngle += angle;
    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(cumAngle);
    const y2 = cy + r * Math.sin(cumAngle);
    const xi1 = cx + innerR * Math.cos(startAngle);
    const yi1 = cy + innerR * Math.sin(startAngle);
    const xi2 = cx + innerR * Math.cos(cumAngle);
    const yi2 = cy + innerR * Math.sin(cumAngle);
    const largeArc = angle > Math.PI ? 1 : 0;
    return {
      ...d,
      path: `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} L ${xi2} ${yi2} A ${innerR} ${innerR} 0 ${largeArc} 0 ${xi1} ${yi1} Z`,
    };
  });

  return (
    <div className="flex items-center gap-4">
      <svg
        width="120"
        height="120"
        role="img"
        aria-label="Subscription breakdown"
      >
        <title>Subscription Split</title>
        {segments.map((s) => (
          <path key={s.plan} d={s.path} fill={s.color} opacity="0.85" />
        ))}
        <text
          x={cx}
          y={cy - 5}
          textAnchor="middle"
          fill="#EAF0FF"
          fontSize="14"
          fontWeight="bold"
        >
          {total}
        </text>
        <text
          x={cx}
          y={cy + 10}
          textAnchor="middle"
          fill="#9AA8C1"
          fontSize="8"
        >
          Users
        </text>
      </svg>
      <div className="space-y-1">
        {SUBSCRIPTION_DATA.map((d) => (
          <div key={d.plan} className="flex items-center gap-2">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ background: d.color }}
            />
            <span className="text-xs text-[#9AA8C1]">{d.plan}</span>
            <span className="text-xs font-bold text-[#EAF0FF]">{d.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Admin() {
  const { data: isAdmin, isLoading } = useIsAdmin();
  const { data: signalsData } = useSignals();
  const signals = (
    signalsData && signalsData.length > 0 ? signalsData : MOCK_SIGNALS
  ).slice(0, 6);

  if (isLoading) {
    return (
      <div
        className="flex items-center justify-center h-64"
        data-ocid="admin.loading_state"
      >
        <div className="text-[#9AA8C1] text-sm">Checking permissions...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div
        className="flex flex-col items-center justify-center h-64"
        data-ocid="admin.error_state"
      >
        <AlertCircle className="w-12 h-12 text-[#FF5A5F] mb-3" />
        <h2 className="text-lg font-bold text-[#EAF0FF]">Access Denied</h2>
        <p className="text-sm text-[#9AA8C1] mt-1">
          You don't have admin privileges.
        </p>
      </div>
    );
  }

  const signalColor = (type: SignalType) => {
    if (type === "strongBuy" || type === "buy") return "#2ED47A";
    if (type === "sell" || type === "strongSell") return "#FF5A5F";
    return "#E7D27C";
  };

  return (
    <div
      className="px-4 lg:px-6 max-w-[1600px] mx-auto space-y-6"
      data-ocid="admin.page"
    >
      <h1 className="text-lg font-bold text-[#EAF0FF]">Admin Panel</h1>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          {
            title: "Total Users",
            value: "354",
            icon: <Users className="w-4 h-4" />,
            color: "#60AFFF",
          },
          {
            title: "Active Signals",
            value: signals.length.toString(),
            icon: <Activity className="w-4 h-4" />,
            color: "#2ED47A",
          },
          {
            title: "Total Trades",
            value: "1,247",
            icon: <BarChart2 className="w-4 h-4" />,
            color: "#F2C94C",
          },
          {
            title: "MRR",
            value: "₹2.4L",
            icon: <DollarSign className="w-4 h-4" />,
            color: "#2ED47A",
          },
        ].map((stat, i) => (
          <div
            key={stat.title}
            data-ocid={`admin.item.${i + 1}`}
            className="trading-card p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <span style={{ color: stat.color }}>{stat.icon}</span>
              <span className="text-[10px] text-[#9AA8C1] uppercase tracking-wider">
                {stat.title}
              </span>
            </div>
            <div className="text-2xl font-bold" style={{ color: stat.color }}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Users Table */}
        <div className="lg:col-span-2 trading-card p-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#EAF0FF] mb-3">
            User Management
          </h2>
          <Table>
            <TableHeader>
              <TableRow style={{ borderColor: "#24344F" }}>
                {["Address", "Name", "Role", "Subscription", "KYC"].map((h) => (
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
              {MOCK_USERS.map((user, i) => (
                <TableRow
                  key={user.address}
                  data-ocid={`admin.row.${i + 1}`}
                  style={{ borderColor: "#1E2C44" }}
                  className="hover:bg-white/5"
                >
                  <TableCell className="text-xs font-mono text-[#9AA8C1]">
                    {user.address}
                  </TableCell>
                  <TableCell>
                    <div className="text-xs font-semibold text-[#EAF0FF]">
                      {user.name}
                    </div>
                    <div className="text-[10px] text-[#9AA8C1]">
                      {user.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className="text-[9px]"
                      style={{
                        background:
                          user.role === "admin"
                            ? "rgba(242,201,76,0.1)"
                            : "rgba(96,175,255,0.1)",
                        color: user.role === "admin" ? "#F2C94C" : "#60AFFF",
                        border: `1px solid ${user.role === "admin" ? "#F2C94C44" : "#60AFFF44"}`,
                      }}
                    >
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className="text-[9px]"
                      style={{
                        background:
                          user.subscription === "elite"
                            ? "rgba(46,212,122,0.1)"
                            : user.subscription === "pro"
                              ? "rgba(242,201,76,0.1)"
                              : "rgba(255,255,255,0.05)",
                        color:
                          user.subscription === "elite"
                            ? "#2ED47A"
                            : user.subscription === "pro"
                              ? "#F2C94C"
                              : "#9AA8C1",
                      }}
                    >
                      {user.subscription.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="flex items-center gap-1 text-[10px]">
                      {user.kyc === "verified" ? (
                        <>
                          <CheckCircle
                            className="w-3 h-3"
                            style={{ color: "#2ED47A" }}
                          />
                          <span style={{ color: "#2ED47A" }}>Verified</span>
                        </>
                      ) : user.kyc === "pending" ? (
                        <>
                          <AlertCircle className="w-3 h-3 text-[#E7D27C]" />
                          <span className="text-[#E7D27C]">Pending</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle
                            className="w-3 h-3"
                            style={{ color: "#FF5A5F" }}
                          />
                          <span style={{ color: "#FF5A5F" }}>Rejected</span>
                        </>
                      )}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Subscription Analytics */}
          <div className="trading-card p-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#EAF0FF] mb-3">
              Subscription Split
            </h2>
            <SubscriptionDonut />
          </div>

          {/* System Health */}
          <div className="trading-card p-4">
            <div className="flex items-center gap-2 mb-3">
              <Cpu className="w-4 h-4" style={{ color: "#F2C94C" }} />
              <h2 className="text-xs font-bold uppercase tracking-widest text-[#EAF0FF]">
                System Health
              </h2>
            </div>
            <div className="space-y-2">
              {SYSTEM_HEALTH.map((sys, i) => (
                <div
                  key={sys.name}
                  data-ocid={`admin.item.${i + 5}`}
                  className="flex items-center justify-between py-1.5"
                  style={{ borderBottom: "1px solid #1E2C44" }}
                >
                  <div className="flex items-center gap-2">
                    <span className="pulse-green" />
                    <span className="text-xs text-[#EAF0FF]">{sys.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px]" style={{ color: "#2ED47A" }}>
                      Operational
                    </div>
                    <div className="text-[10px] text-[#9AA8C1]">
                      {sys.latency}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Active Signals */}
      <div className="trading-card p-4">
        <h2 className="text-xs font-bold uppercase tracking-widest text-[#EAF0FF] mb-3">
          Active Signals
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {signals.map((sig, i) => (
            <div
              key={sig.id}
              data-ocid={`admin.item.${i + 9}`}
              className="p-3 rounded-xl"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: `1px solid ${signalColor(sig.signalType)}44`,
              }}
            >
              <div className="flex justify-between items-start">
                <span className="font-bold text-sm text-[#EAF0FF]">
                  {sig.instrumentSymbol}
                </span>
                <Badge
                  className="text-[9px]"
                  style={{
                    background: `${signalColor(sig.signalType)}22`,
                    color: signalColor(sig.signalType),
                  }}
                >
                  {sig.signalType.toUpperCase()}
                </Badge>
              </div>
              <div className="flex gap-3 mt-2 text-[10px] text-[#9AA8C1]">
                <span>Entry: ₹{sig.entryPrice.toLocaleString()}</span>
                <span>Conf: {(sig.confidence * 100).toFixed(0)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
