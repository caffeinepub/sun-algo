import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertCircle,
  ExternalLink,
  Eye,
  EyeOff,
  Lock,
  RefreshCw,
  Trash2,
  Wifi,
  WifiOff,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// ──────────────────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────────────────

interface ConnectedAccount {
  id: string;
  broker: string;
  market: "indian" | "forex_crypto";
  accountId: string;
  apiKey: string;
  status: "connected" | "disconnected" | "error";
  lastSync: string;
  balance?: string;
  currency: string;
}

interface BrokerDef {
  name: string;
  market: "indian" | "forex_crypto";
  fields: string[];
  note: string;
  link: string;
  category: string;
}

// ──────────────────────────────────────────────────────────
// Broker Catalogue
// ──────────────────────────────────────────────────────────

const BROKER_CONFIG: Record<string, BrokerDef> = {
  "Zerodha (Kite)": {
    name: "Zerodha (Kite)",
    market: "indian",
    fields: ["API Key", "API Secret", "Request Token"],
    note: "Get from kite.trade/api",
    link: "https://kite.trade/api",
    category: "NSE/BSE/MCX",
  },
  "Angel One (SmartAPI)": {
    name: "Angel One (SmartAPI)",
    market: "indian",
    fields: ["API Key", "Client ID", "Password", "TOTP Secret"],
    note: "Get from smartapi.angelbroking.com",
    link: "https://smartapi.angelbroking.com",
    category: "NSE/BSE",
  },
  Upstox: {
    name: "Upstox",
    market: "indian",
    fields: ["API Key", "API Secret", "Redirect URL"],
    note: "Get from developer.upstox.com",
    link: "https://developer.upstox.com",
    category: "NSE/BSE",
  },
  Fyers: {
    name: "Fyers",
    market: "indian",
    fields: ["App ID", "Secret Key"],
    note: "Get from myapi.fyers.in",
    link: "https://myapi.fyers.in",
    category: "NSE/BSE",
  },
  "5paisa": {
    name: "5paisa",
    market: "indian",
    fields: ["App Name", "User Key", "Encryption Key"],
    note: "Get from dev-portal.5paisa.com",
    link: "https://dev-portal.5paisa.com",
    category: "NSE/BSE",
  },
  IIFL: {
    name: "IIFL",
    market: "indian",
    fields: ["API Key", "API Secret"],
    note: "Get from api.iiflsecurities.com",
    link: "https://api.iiflsecurities.com",
    category: "NSE/BSE",
  },
  Dhan: {
    name: "Dhan",
    market: "indian",
    fields: ["Client ID", "Access Token"],
    note: "Get from dhanhq.co/dhan-hq-api",
    link: "https://dhanhq.co/dhan-hq-api",
    category: "NSE/BSE",
  },
  Binance: {
    name: "Binance",
    market: "forex_crypto",
    fields: ["API Key", "API Secret"],
    note: "Get from binance.com/en/my/settings/api-management",
    link: "https://binance.com/en/my/settings/api-management",
    category: "Crypto",
  },
  "Coinbase Pro": {
    name: "Coinbase Pro",
    market: "forex_crypto",
    fields: ["API Key", "API Secret", "Passphrase"],
    note: "Get from pro.coinbase.com/settings/api",
    link: "https://pro.coinbase.com/settings/api",
    category: "Crypto",
  },
  Kraken: {
    name: "Kraken",
    market: "forex_crypto",
    fields: ["API Key", "Private Key"],
    note: "Get from kraken.com/u/security/api",
    link: "https://kraken.com/u/security/api",
    category: "Crypto",
  },
  OKX: {
    name: "OKX",
    market: "forex_crypto",
    fields: ["API Key", "Secret Key", "Passphrase"],
    note: "Get from okx.com/account/users/personal-center/api",
    link: "https://okx.com/account/users/personal-center/api",
    category: "Crypto",
  },
  "Interactive Brokers": {
    name: "Interactive Brokers",
    market: "forex_crypto",
    fields: ["Account ID", "API Key"],
    note: "Enable in TWS/Gateway API settings",
    link: "https://www.interactivebrokers.com/en/trading/ib-api.php",
    category: "Forex/Stocks",
  },
  Alpaca: {
    name: "Alpaca",
    market: "forex_crypto",
    fields: ["API Key ID", "Secret Key"],
    note: "Get from app.alpaca.markets/paper-trading",
    link: "https://app.alpaca.markets/paper-trading",
    category: "US Stocks",
  },
  "TD Ameritrade": {
    name: "TD Ameritrade",
    market: "forex_crypto",
    fields: ["Client ID", "Refresh Token"],
    note: "Get from developer.tdameritrade.com",
    link: "https://developer.tdameritrade.com",
    category: "US Stocks",
  },
};

const INDIAN_BROKERS = [
  "Zerodha (Kite)",
  "Angel One (SmartAPI)",
  "Upstox",
  "Fyers",
  "5paisa",
  "IIFL",
  "Dhan",
];

const FOREX_CRYPTO_BROKERS = [
  "Binance",
  "Coinbase Pro",
  "Kraken",
  "OKX",
  "Interactive Brokers",
  "Alpaca",
  "TD Ameritrade",
];

// ──────────────────────────────────────────────────────────
// Sample connected accounts
// ──────────────────────────────────────────────────────────

const INITIAL_ACCOUNTS: ConnectedAccount[] = [
  {
    id: "acc1",
    broker: "Zerodha (Kite)",
    market: "indian",
    accountId: "ZE****2341",
    apiKey: "kite_*****************",
    status: "connected",
    lastSync: "2 min ago",
    balance: "₹8,47,320",
    currency: "INR",
  },
  {
    id: "acc2",
    broker: "Binance",
    market: "forex_crypto",
    accountId: "BN****9871",
    apiKey: "bnb_*****************",
    status: "connected",
    lastSync: "1 min ago",
    balance: "$24,580",
    currency: "USDT",
  },
];

// ──────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────

function brokerInitials(name: string): string {
  const words = name.replace(/[()]/g, "").split(" ");
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

function StatusBadge({ status }: { status: ConnectedAccount["status"] }) {
  const map = {
    connected: {
      bg: "rgba(46,212,122,0.12)",
      color: "#2ED47A",
      border: "#2ED47A44",
      label: "LIVE",
    },
    disconnected: {
      bg: "rgba(154,168,193,0.1)",
      color: "#9AA8C1",
      border: "#9AA8C144",
      label: "OFFLINE",
    },
    error: {
      bg: "rgba(255,90,95,0.12)",
      color: "#FF5A5F",
      border: "#FF5A5F44",
      label: "ERROR",
    },
  };
  const s = map[status];
  return (
    <Badge
      className="text-[9px] font-bold tracking-wider"
      style={{
        background: s.bg,
        color: s.color,
        border: `1px solid ${s.border}`,
      }}
    >
      {s.label}
    </Badge>
  );
}

function MarketBadge({ market }: { market: "indian" | "forex_crypto" }) {
  if (market === "indian") {
    return (
      <span
        className="text-[9px] font-semibold px-1.5 py-0.5 rounded"
        style={{
          background: "rgba(242,201,76,0.12)",
          color: "#F2C94C",
          border: "1px solid #F2C94C33",
        }}
      >
        🇮🇳 Indian
      </span>
    );
  }
  return (
    <span
      className="text-[9px] font-semibold px-1.5 py-0.5 rounded"
      style={{
        background: "rgba(139,92,246,0.12)",
        color: "#A78BFA",
        border: "1px solid #A78BFA33",
      }}
    >
      💱 Forex/Crypto
    </span>
  );
}

// ──────────────────────────────────────────────────────────
// Main Page
// ──────────────────────────────────────────────────────────

export default function Broker() {
  const [accounts, setAccounts] =
    useState<ConnectedAccount[]>(INITIAL_ACCOUNTS);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedBrokerKey, setSelectedBrokerKey] = useState<string | null>(
    null,
  );
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [showFields, setShowFields] = useState<Record<string, boolean>>({});
  const [confirmDisconnect, setConfirmDisconnect] = useState<string | null>(
    null,
  );
  const [syncing, setSyncing] = useState<string | null>(null);

  const selectedBroker = selectedBrokerKey
    ? BROKER_CONFIG[selectedBrokerKey]
    : null;

  const openDialog = (brokerKey: string) => {
    setSelectedBrokerKey(brokerKey);
    setFieldValues({});
    setShowFields({});
    setDialogOpen(true);
  };

  const handleConnect = () => {
    if (!selectedBroker) return;
    const allFilled = selectedBroker.fields.every(
      (f) => (fieldValues[f] || "").trim().length > 0,
    );
    if (!allFilled) {
      toast.error("Please fill in all required fields.");
      return;
    }
    const newAccount: ConnectedAccount = {
      id: `acc${Date.now()}`,
      broker: selectedBroker.name,
      market: selectedBroker.market,
      accountId: `${selectedBroker.name.slice(0, 2).toUpperCase()}****${Math.floor(Math.random() * 9000 + 1000)}`,
      apiKey: `${selectedBroker.fields[0].toLowerCase().replace(/ /g, "_")}_***`,
      status: "connected",
      lastSync: "just now",
      balance: selectedBroker.market === "indian" ? "₹—" : "$—",
      currency: selectedBroker.market === "indian" ? "INR" : "USD",
    };
    setAccounts((prev) => [...prev, newAccount]);
    toast.success(`${selectedBroker.name} connected successfully! 🎉`);
    setDialogOpen(false);
    setFieldValues({});
  };

  const handleTestConnection = () => {
    if (!selectedBroker) return;
    toast.info(`Testing connection to ${selectedBroker.name}...`);
    setTimeout(() => toast.success("Connection test successful ✅"), 1800);
  };

  const handleDisconnect = (id: string) => {
    setAccounts((prev) => prev.filter((a) => a.id !== id));
    toast.success("Account disconnected.");
    setConfirmDisconnect(null);
  };

  const handleResync = (id: string) => {
    setSyncing(id);
    setTimeout(() => {
      setAccounts((prev) =>
        prev.map((a) => (a.id === id ? { ...a, lastSync: "just now" } : a)),
      );
      setSyncing(null);
      toast.success("Account synced successfully.");
    }, 1500);
  };

  const connectedBrokerNames = new Set(accounts.map((a) => a.broker));

  return (
    <div
      className="px-4 lg:px-6 max-w-[1600px] mx-auto space-y-6"
      data-ocid="broker.page"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-[#EAF0FF]">
            Broker Connections
          </h1>
          <p className="text-[11px] text-[#9AA8C1] mt-0.5">
            Connect live brokerage accounts for Indian markets and global
            Forex/Crypto trading
          </p>
        </div>
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px]"
          style={{
            background: "rgba(46,212,122,0.08)",
            border: "1px solid rgba(46,212,122,0.2)",
            color: "#2ED47A",
          }}
        >
          <Lock className="w-3 h-3" />
          AES-256 Encrypted
        </div>
      </div>

      {/* ── Paper Trading Card ── */}
      <div className="trading-card p-5" data-ocid="broker.panel">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-sm font-bold text-[#EAF0FF]">
                Paper Trading Account
              </h2>
              <Badge
                className="text-[9px]"
                style={{
                  background: "rgba(46,212,122,0.1)",
                  color: "#2ED47A",
                  border: "1px solid #2ED47A44",
                }}
              >
                ACTIVE
              </Badge>
              <Badge
                className="text-[9px]"
                style={{
                  background: "rgba(139,92,246,0.1)",
                  color: "#A78BFA",
                  border: "1px solid #A78BFA44",
                }}
              >
                SIMULATED
              </Badge>
            </div>
            <p className="text-xs text-[#9AA8C1]">
              Virtual account with ₹10,00,000 capital — supports Indian Paper
              &amp; Crypto Paper modes. No real money risk.
            </p>
          </div>
          <Button
            data-ocid="broker.secondary_button"
            variant="outline"
            onClick={() => toast.success("Paper account reset to ₹10,00,000")}
            className="h-8 text-xs gap-1.5 border-[#24344F] bg-transparent text-[#9AA8C1] hover:text-white flex-shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reset Account
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="bg-white/5 rounded-xl p-3">
            <div className="text-[10px] text-[#9AA8C1] mb-1">
              Virtual Capital
            </div>
            <div className="text-lg font-bold" style={{ color: "#F2C94C" }}>
              ₹10,00,000
            </div>
          </div>
          <div className="bg-white/5 rounded-xl p-3">
            <div className="text-[10px] text-[#9AA8C1] mb-1">Available</div>
            <div className="text-lg font-bold text-[#EAF0FF]">₹8,47,320</div>
          </div>
          <div className="bg-white/5 rounded-xl p-3">
            <div className="text-[10px] text-[#9AA8C1] mb-1">Open P&amp;L</div>
            <div className="text-lg font-bold" style={{ color: "#2ED47A" }}>
              +₹12,450
            </div>
          </div>
          <div className="bg-white/5 rounded-xl p-3">
            <div className="text-[10px] text-[#9AA8C1] mb-1">Total Return</div>
            <div className="text-lg font-bold" style={{ color: "#2ED47A" }}>
              +6.33%
            </div>
          </div>
          <div className="bg-white/5 rounded-xl p-3">
            <div className="text-[10px] text-[#9AA8C1] mb-1">Mode</div>
            <div className="text-[11px] font-bold text-[#EAF0FF] mt-1">
              🇮🇳 Indian Paper
              <br />
              <span className="text-[#A78BFA]">💱 Crypto Paper</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Connected Accounts ── */}
      {accounts.length > 0 && (
        <div className="trading-card p-5">
          <h2 className="text-sm font-bold text-[#EAF0FF] mb-4">
            Connected Accounts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {accounts.map((acc, i) => (
              <div
                key={acc.id}
                data-ocid={`broker.item.${i + 1}`}
                className="rounded-xl p-4 relative"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: `1px solid ${
                    acc.market === "indian"
                      ? "rgba(242,201,76,0.2)"
                      : "rgba(139,92,246,0.2)"
                  }`,
                  borderLeft: `3px solid ${
                    acc.market === "indian" ? "#F2C94C" : "#8B5CF6"
                  }`,
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                      style={{
                        background:
                          acc.market === "indian"
                            ? "rgba(242,201,76,0.12)"
                            : "rgba(139,92,246,0.12)",
                        color: acc.market === "indian" ? "#F2C94C" : "#A78BFA",
                      }}
                    >
                      {brokerInitials(acc.broker)}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#EAF0FF]">
                        {acc.broker}
                      </div>
                      <MarketBadge market={acc.market} />
                    </div>
                  </div>
                  <StatusBadge status={acc.status} />
                </div>

                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div>
                    <div className="text-[9px] text-[#9AA8C1]">Account ID</div>
                    <div className="text-xs font-mono text-[#EAF0FF]">
                      {acc.accountId}
                    </div>
                  </div>
                  {acc.balance && (
                    <div>
                      <div className="text-[9px] text-[#9AA8C1]">Balance</div>
                      <div
                        className="text-xs font-bold"
                        style={{ color: "#2ED47A" }}
                      >
                        {acc.balance}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div
                    className="flex items-center gap-1 text-[10px]"
                    style={{ color: "#2ED47A" }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{
                        background:
                          acc.status === "connected" ? "#2ED47A" : "#FF5A5F",
                        animation:
                          acc.status === "connected"
                            ? "pulse 2s infinite"
                            : "none",
                      }}
                    />
                    <span className="text-[#9AA8C1]">Sync: {acc.lastSync}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      data-ocid={`broker.toggle.${i + 1}`}
                      onClick={() => handleResync(acc.id)}
                      className="p-1.5 rounded-lg transition-colors hover:bg-white/10"
                      title="Re-sync account"
                    >
                      <RefreshCw
                        className={`w-3.5 h-3.5 text-[#9AA8C1] ${
                          syncing === acc.id ? "animate-spin" : ""
                        }`}
                      />
                    </button>
                    <button
                      type="button"
                      data-ocid={`broker.delete_button.${i + 1}`}
                      onClick={() => setConfirmDisconnect(acc.id)}
                      className="p-1.5 rounded-lg transition-colors hover:bg-red-500/10"
                      title="Disconnect account"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-[#FF5A5F]" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Indian Market Brokers ── */}
      <div
        className="trading-card p-5"
        style={{ borderLeft: "3px solid #F2C94C" }}
      >
        <div className="flex items-center gap-3 mb-1">
          <h2 className="text-sm font-bold text-[#EAF0FF]">
            🇮🇳 Indian Market Brokers
          </h2>
          <Badge
            className="text-[9px]"
            style={{
              background: "rgba(242,201,76,0.1)",
              color: "#F2C94C",
              border: "1px solid #F2C94C44",
            }}
          >
            NSE / BSE / MCX
          </Badge>
        </div>
        <p className="text-xs text-[#9AA8C1] mb-4">
          Connect Indian brokers for live trading — Mon to Fri, 9:15 AM – 3:30
          PM IST
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {INDIAN_BROKERS.map((key) => {
            const broker = BROKER_CONFIG[key];
            const isConnected = connectedBrokerNames.has(key);
            return (
              <div
                key={key}
                data-ocid="broker.card"
                className="rounded-xl p-4 flex flex-col gap-3"
                style={{
                  background: isConnected
                    ? "rgba(46,212,122,0.05)"
                    : "rgba(255,255,255,0.03)",
                  border: isConnected
                    ? "1px solid rgba(46,212,122,0.25)"
                    : "1px solid #1E2C44",
                }}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold"
                    style={{
                      background: "rgba(242,201,76,0.12)",
                      color: "#F2C94C",
                    }}
                  >
                    {brokerInitials(key)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-[#EAF0FF] truncate">
                      {broker.name}
                    </div>
                    <div className="text-[9px] text-[#9AA8C1]">
                      {broker.category}
                    </div>
                  </div>
                  {isConnected && (
                    <Wifi
                      className="w-3.5 h-3.5 flex-shrink-0"
                      style={{ color: "#2ED47A" }}
                    />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  {isConnected ? (
                    <span className="text-[10px]" style={{ color: "#2ED47A" }}>
                      ● Connected
                    </span>
                  ) : (
                    <span className="text-[10px] text-[#9AA8C1]">
                      Not connected
                    </span>
                  )}
                  <Button
                    data-ocid="broker.primary_button"
                    size="sm"
                    onClick={() => openDialog(key)}
                    className="h-7 text-[10px] px-3"
                    style={{
                      background: isConnected
                        ? "rgba(46,212,122,0.15)"
                        : "rgba(242,201,76,0.9)",
                      color: isConnected ? "#2ED47A" : "#0B1424",
                      border: isConnected
                        ? "1px solid rgba(46,212,122,0.3)"
                        : "none",
                    }}
                  >
                    {isConnected ? "Re-connect" : "Connect"}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Forex & Crypto Brokers ── */}
      <div
        className="trading-card p-5"
        style={{ borderLeft: "3px solid #8B5CF6" }}
      >
        <div className="flex items-center gap-3 mb-1">
          <h2 className="text-sm font-bold text-[#EAF0FF]">
            💱 Forex &amp; Crypto Brokers
          </h2>
          <Badge
            className="text-[9px]"
            style={{
              background: "rgba(139,92,246,0.1)",
              color: "#A78BFA",
              border: "1px solid #A78BFA44",
            }}
          >
            24/7 Global
          </Badge>
        </div>
        <p className="text-xs text-[#9AA8C1] mb-4">
          Connect global brokers for Forex, Crypto, and US Stock trading —
          available 24/7
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {FOREX_CRYPTO_BROKERS.map((key) => {
            const broker = BROKER_CONFIG[key];
            const isConnected = connectedBrokerNames.has(key);
            return (
              <div
                key={key}
                data-ocid="broker.card"
                className="rounded-xl p-4 flex flex-col gap-3"
                style={{
                  background: isConnected
                    ? "rgba(46,212,122,0.05)"
                    : "rgba(255,255,255,0.03)",
                  border: isConnected
                    ? "1px solid rgba(46,212,122,0.25)"
                    : "1px solid #1E2C44",
                }}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold"
                    style={{
                      background: "rgba(139,92,246,0.12)",
                      color: "#A78BFA",
                    }}
                  >
                    {brokerInitials(key)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-[#EAF0FF] truncate">
                      {broker.name}
                    </div>
                    <div className="text-[9px] text-[#9AA8C1]">
                      {broker.category}
                    </div>
                  </div>
                  {isConnected && (
                    <Wifi
                      className="w-3.5 h-3.5 flex-shrink-0"
                      style={{ color: "#2ED47A" }}
                    />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  {isConnected ? (
                    <span className="text-[10px]" style={{ color: "#2ED47A" }}>
                      ● Connected
                    </span>
                  ) : (
                    <span className="text-[10px] text-[#9AA8C1]">
                      Not connected
                    </span>
                  )}
                  <Button
                    data-ocid="broker.primary_button"
                    size="sm"
                    onClick={() => openDialog(key)}
                    className="h-7 text-[10px] px-3"
                    style={{
                      background: isConnected
                        ? "rgba(46,212,122,0.15)"
                        : "rgba(139,92,246,0.85)",
                      color: isConnected ? "#2ED47A" : "#FFFFFF",
                      border: isConnected
                        ? "1px solid rgba(46,212,122,0.3)"
                        : "none",
                    }}
                  >
                    {isConnected ? "Re-connect" : "Connect"}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Connect Broker Dialog ── */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent
          data-ocid="broker.dialog"
          style={{
            background: "#111E33",
            border: "1px solid #24344F",
            maxWidth: 480,
          }}
        >
          <DialogHeader>
            <DialogTitle className="text-[#EAF0FF] flex items-center gap-2">
              <Zap className="w-4 h-4" style={{ color: "#F2C94C" }} />
              Connect {selectedBroker?.name}
            </DialogTitle>
            {selectedBroker && (
              <div className="flex items-center gap-2 mt-1">
                <MarketBadge market={selectedBroker.market} />
                <span className="text-[10px] text-[#9AA8C1]">
                  {selectedBroker.category}
                </span>
              </div>
            )}
          </DialogHeader>

          {selectedBroker && (
            <div className="space-y-4 py-2">
              {/* Dynamic fields */}
              {selectedBroker.fields.map((field) => (
                <div key={field}>
                  <Label className="text-[#9AA8C1] text-xs">{field}</Label>
                  <div className="relative mt-1">
                    <Input
                      data-ocid="broker.input"
                      type={showFields[field] ? "text" : "password"}
                      value={fieldValues[field] ?? ""}
                      onChange={(e) =>
                        setFieldValues((prev) => ({
                          ...prev,
                          [field]: e.target.value,
                        }))
                      }
                      placeholder={`Enter ${field}`}
                      className="bg-white/5 border-[#24344F] text-[#EAF0FF] pr-10"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowFields((prev) => ({
                          ...prev,
                          [field]: !prev[field],
                        }))
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9AA8C1] hover:text-white"
                    >
                      {showFields[field] ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              ))}

              {/* API key source note */}
              <div
                className="rounded-lg p-3 flex items-start gap-2"
                style={{
                  background: "rgba(154,168,193,0.06)",
                  border: "1px solid #24344F",
                }}
              >
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-[#9AA8C1]" />
                <div>
                  <div className="text-[10px] text-[#9AA8C1]">
                    {selectedBroker.note}
                  </div>
                  <a
                    href={selectedBroker.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] flex items-center gap-1 mt-1 hover:underline"
                    style={{ color: "#F2C94C" }}
                  >
                    Open API settings <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Encryption notice */}
              <div
                className="rounded-lg p-3 text-xs flex items-center gap-2"
                style={{
                  background: "rgba(242,201,76,0.07)",
                  border: "1px solid #F2C94C44",
                }}
              >
                <Lock
                  className="w-3.5 h-3.5 flex-shrink-0"
                  style={{ color: "#F2C94C" }}
                />
                <span style={{ color: "#F2C94C" }}>
                  Your API keys are encrypted with AES-256 before storage.
                </span>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button
              data-ocid="broker.cancel_button"
              variant="ghost"
              onClick={() => setDialogOpen(false)}
              className="text-[#9AA8C1]"
            >
              Cancel
            </Button>
            <Button
              data-ocid="broker.secondary_button"
              variant="outline"
              onClick={handleTestConnection}
              className="border-[#24344F] text-[#9AA8C1] hover:text-white"
            >
              Test Connection
            </Button>
            <Button
              data-ocid="broker.submit_button"
              onClick={handleConnect}
              style={{ background: "#F2C94C", color: "#0B1424" }}
            >
              Connect Broker
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Disconnect Confirm Dialog ── */}
      <Dialog
        open={!!confirmDisconnect}
        onOpenChange={(open) => !open && setConfirmDisconnect(null)}
      >
        <DialogContent
          data-ocid="broker.modal"
          style={{
            background: "#111E33",
            border: "1px solid #24344F",
            maxWidth: 400,
          }}
        >
          <DialogHeader>
            <DialogTitle className="text-[#EAF0FF] flex items-center gap-2">
              <WifiOff className="w-4 h-4 text-[#FF5A5F]" />
              Disconnect Account?
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-[#9AA8C1] py-2">
            This will remove the broker connection and all stored credentials.
            You can reconnect at any time.
          </p>
          <DialogFooter>
            <Button
              data-ocid="broker.cancel_button"
              variant="ghost"
              onClick={() => setConfirmDisconnect(null)}
              className="text-[#9AA8C1]"
            >
              Cancel
            </Button>
            <Button
              data-ocid="broker.confirm_button"
              onClick={() =>
                confirmDisconnect && handleDisconnect(confirmDisconnect)
              }
              style={{
                background: "rgba(255,90,95,0.15)",
                color: "#FF5A5F",
                border: "1px solid rgba(255,90,95,0.3)",
              }}
            >
              Disconnect
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
