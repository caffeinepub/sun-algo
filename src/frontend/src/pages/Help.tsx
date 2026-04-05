import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Activity,
  AlertTriangle,
  BarChart2,
  Bot,
  Brain,
  ChevronDown,
  ChevronUp,
  Clock,
  Copy,
  Globe,
  HelpCircle,
  LineChart,
  List,
  Lock,
  MessageSquare,
  Radio,
  RefreshCw,
  Search,
  Settings,
  Shield,
  ShoppingBag,
  Star,
  Target,
  TrendingUp,
  User,
  Zap,
} from "lucide-react";
import { useMemo, useState } from "react";

interface HelpSection {
  id: string;
  category: string;
  icon: React.ReactNode;
  title: string;
  content: React.ReactNode;
  keywords: string[];
}

const HELP_SECTIONS: HelpSection[] = [
  {
    id: "what-is-sun-algo",
    category: "GETTING STARTED",
    icon: <Star className="w-4 h-4" />,
    title: "What is Sun Algo?",
    keywords: ["what", "intro", "overview", "about", "platform", "trading"],
    content: (
      <div className="space-y-3 text-sm text-[#9AA8C1]">
        <p>
          <strong className="text-[#EAF0FF]">Sun Algo</strong> is a
          professional, AI-powered automated trading platform for both{" "}
          <strong className="text-[#F2C94C]">Indian markets</strong> (NSE, BSE,
          MCX, F&O) and{" "}
          <strong className="text-[#F2C94C]">international markets</strong>{" "}
          (Forex, Crypto, US Stocks, Global Indices).
        </p>
        <p>
          It uses a{" "}
          <strong className="text-[#EAF0FF]">7-layer AI/ML pipeline</strong> to
          generate high-confidence trading signals, execute automated
          strategies, manage risk in real-time, and provide deep market analysis
          — all in one terminal-style dashboard.
        </p>
        <div className="grid grid-cols-2 gap-2 mt-3">
          {[
            ["📈", "20+ Pages", "Full trading suite"],
            ["🤖", "AI-Powered", "7-layer ML engine"],
            ["🌏", "142,732+", "Instruments mapped"],
            ["📱", "Telegram Bot", "@SunAlgoBot"],
          ].map(([emoji, title, desc]) => (
            <div key={title} className="bg-white/5 rounded-lg p-2.5">
              <div className="text-lg mb-1">{emoji}</div>
              <div className="text-xs font-bold text-[#EAF0FF]">{title}</div>
              <div className="text-[10px] text-[#9AA8C1]">{desc}</div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "paper-vs-live",
    category: "GETTING STARTED",
    icon: <Lock className="w-4 h-4" />,
    title: "Paper Trading vs Live Trading",
    keywords: ["paper", "live", "virtual", "capital", "demo", "real", "money"],
    content: (
      <div className="space-y-3 text-sm text-[#9AA8C1]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-[#2ED47A]/10 border border-[#2ED47A]/30 rounded-lg p-3">
            <div className="text-[#2ED47A] font-bold text-xs mb-1.5">
              ✅ PAPER MODE (Current)
            </div>
            <ul className="space-y-1 text-[11px]">
              <li>• Virtual capital: ₹10,00,000</li>
              <li>• BUY/SELL always available</li>
              <li>• No real money at risk</li>
              <li>• Perfect for practice & testing</li>
              <li>• Full strategy backtesting</li>
            </ul>
          </div>
          <div className="bg-[#F2C94C]/10 border border-[#F2C94C]/30 rounded-lg p-3">
            <div className="text-[#F2C94C] font-bold text-xs mb-1.5">
              ⚡ LIVE MODE (Broker Required)
            </div>
            <ul className="space-y-1 text-[11px]">
              <li>• Real money trading</li>
              <li>• Connect broker via API key</li>
              <li>• Locked outside market hours</li>
              <li>• Requires KYC verification</li>
              <li>• Pro/Elite subscription needed</li>
            </ul>
          </div>
        </div>
        <p className="text-[11px] bg-white/5 rounded p-2">
          💡 <strong className="text-[#EAF0FF]">Tip:</strong> In Paper mode,
          BUY/SELL buttons are <em>always active</em> — they are only locked
          during a circuit breaker halt (⚠️ HALTED status). Use paper mode to
          test strategies before going live.
        </p>
      </div>
    ),
  },
  {
    id: "market-mode-selector",
    category: "GETTING STARTED",
    icon: <Globe className="w-4 h-4" />,
    title: "Market Mode Selector",
    keywords: [
      "market",
      "mode",
      "selector",
      "indian",
      "forex",
      "crypto",
      "global",
      "switch",
    ],
    content: (
      <div className="space-y-3 text-sm text-[#9AA8C1]">
        <p>
          The <strong className="text-[#EAF0FF]">Market Mode Selector</strong>{" "}
          is in the top-right of the header. It controls which market the
          dashboard and signals target.
        </p>
        <div className="space-y-2">
          {[
            {
              flag: "🇮🇳",
              name: "Indian Market",
              hours: "Mon–Fri 9:15–15:30 IST",
              detail:
                "NSE, BSE, MCX, F&O, Currency derivatives. Trading buttons lock outside hours (Live mode only).",
              color: "#FF9933",
            },
            {
              flag: "💱",
              name: "Forex & Crypto",
              hours: "24/7 — Always Open",
              detail:
                "BTC, ETH, EUR/USD, GOLD and 13,000+ instruments. BUY/SELL always unlocked. Dashboard shows crypto/forex signals.",
              color: "#2ED47A",
            },
            {
              flag: "🌐",
              name: "Global Markets",
              hours: "Mon–Fri 9:30–16:00 ET (NYSE)",
              detail:
                "US Stocks (NYSE, NASDAQ, AMEX), ETFs, and global indices. Switches dashboard to international data.",
              color: "#4A9EFF",
            },
          ].map((mode) => (
            <div
              key={mode.name}
              className="bg-white/5 rounded-lg p-3 flex gap-3"
            >
              <span className="text-2xl">{mode.flag}</span>
              <div>
                <div className="text-xs font-bold text-[#EAF0FF]">
                  {mode.name}
                </div>
                <div
                  className="text-[10px] font-mono"
                  style={{ color: mode.color }}
                >
                  {mode.hours}
                </div>
                <div className="text-[11px] text-[#9AA8C1] mt-1">
                  {mode.detail}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "dashboard-overview",
    category: "DASHBOARD",
    icon: <BarChart2 className="w-4 h-4" />,
    title: "Dashboard Layout Overview",
    keywords: [
      "dashboard",
      "layout",
      "overview",
      "columns",
      "watchlist",
      "chart",
      "portfolio",
    ],
    content: (
      <div className="space-y-3 text-sm text-[#9AA8C1]">
        <p>
          The dashboard uses a{" "}
          <strong className="text-[#EAF0FF]">3-column layout</strong>:
        </p>
        <div className="grid grid-cols-3 gap-2 text-center">
          {[
            {
              col: "LEFT",
              label: "Watchlist",
              desc: "Live prices, add/remove symbols",
            },
            {
              col: "CENTER",
              label: "Chart + Signals",
              desc: "TradingView chart & AI signals",
            },
            {
              col: "RIGHT",
              label: "Portfolio + Strategies",
              desc: "P&L, positions, BUY/SELL",
            },
          ].map((c) => (
            <div key={c.col} className="bg-white/5 rounded-lg p-2.5">
              <div className="text-[9px] font-bold text-[#F2C94C] mb-1">
                {c.col}
              </div>
              <div className="text-xs font-bold text-[#EAF0FF]">{c.label}</div>
              <div className="text-[10px] text-[#9AA8C1] mt-1">{c.desc}</div>
            </div>
          ))}
        </div>
        <div className="bg-white/5 rounded-lg p-3 space-y-2">
          <div className="text-xs font-bold text-[#EAF0FF]">
            Market Status Indicator
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "MARKET LIVE", color: "#2ED47A", desc: "NSE/BSE open" },
              {
                label: "24/7 LIVE",
                color: "#2ED47A",
                desc: "Forex/Crypto mode",
              },
              { label: "PRE-OPEN", color: "#F2C94C", desc: "9:00–9:15 AM IST" },
              { label: "MARKET CLOSED", color: "#FF5A5F", desc: "After hours" },
              {
                label: "CIRCUIT BREAKER",
                color: "#FF5A5F",
                desc: "Emergency halt",
              },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-1.5">
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: s.color }}
                />
                <span
                  className="text-[10px] font-bold"
                  style={{ color: s.color }}
                >
                  {s.label}
                </span>
                <span className="text-[10px] text-[#9AA8C1]">— {s.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "buy-sell-buttons",
    category: "DASHBOARD",
    icon: <Zap className="w-4 h-4" />,
    title: "BUY/SELL Buttons & Paper Mode",
    keywords: [
      "buy",
      "sell",
      "button",
      "lock",
      "unlock",
      "paper",
      "trade",
      "disabled",
    ],
    content: (
      <div className="space-y-3 text-sm text-[#9AA8C1]">
        <div className="bg-[#2ED47A]/10 border border-[#2ED47A]/30 rounded-lg p-3">
          <div className="text-[#2ED47A] font-bold text-xs mb-2">
            ✅ BUY/SELL are always available in PAPER mode
          </div>
          <p className="text-[11px]">
            In paper trading, BUY and SELL buttons are active 24/7. You can
            practice at any time, even when markets are closed.
          </p>
        </div>
        <div className="bg-[#FF5A5F]/10 border border-[#FF5A5F]/30 rounded-lg p-3">
          <div className="text-[#FF5A5F] font-bold text-xs mb-2">
            ⚠️ Only locked during CIRCUIT BREAKER (HALTED)
          </div>
          <p className="text-[11px]">
            If an emergency market halt (circuit breaker) is triggered, all
            trade buttons lock. This protects you from executing in extreme
            volatility. The banner shows: "CIRCUIT BREAKER TRIGGERED."
          </p>
        </div>
        <p className="text-[11px] text-[#9AA8C1]">
          In <strong className="text-[#F2C94C]">Live mode</strong> (broker
          connected), Indian market buttons lock outside 9:15–15:30 IST.
          Forex/Crypto mode is always unlocked.
        </p>
      </div>
    ),
  },
  {
    id: "signals-ai",
    category: "SIGNALS & AI ENGINE",
    icon: <Brain className="w-4 h-4" />,
    title: "How Signals are Generated",
    keywords: [
      "signal",
      "ai",
      "ml",
      "confidence",
      "buy",
      "sell",
      "strong",
      "entry",
      "target",
      "stop",
    ],
    content: (
      <div className="space-y-3 text-sm text-[#9AA8C1]">
        <p>
          Signals are produced by Sun Algo's{" "}
          <strong className="text-[#EAF0FF]">7-Layer AI/ML Pipeline</strong>:
        </p>
        <div className="space-y-1">
          {[
            ["1", "Data Ingestion", "Live tick data, order book, news feeds"],
            [
              "2",
              "Feature Engine",
              "200+ technical indicators computed in real-time",
            ],
            [
              "3",
              "ML Models",
              "LSTM, CNN, FinBERT, Isolation Forest, Portfolio Optimizer",
            ],
            [
              "4",
              "Signal Generator",
              "Model outputs aggregated with confidence scoring",
            ],
            [
              "5",
              "Risk Engine",
              "Pre-trade checks, position sizing, correlation filters",
            ],
            [
              "6",
              "Execution Engine",
              "Smart order routing with slippage optimization",
            ],
            [
              "7",
              "Learning Engine",
              "Daily retraining, auto-disable underperformers",
            ],
          ].map(([num, name, desc]) => (
            <div
              key={num}
              className="flex gap-2 items-start bg-white/5 rounded p-2"
            >
              <span
                className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                style={{ background: "#F2C94C", color: "#0B1424" }}
              >
                {num}
              </span>
              <div>
                <span className="text-xs font-bold text-[#EAF0FF]">{name}</span>
                <span className="text-[11px] text-[#9AA8C1] ml-2">{desc}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-white/5 rounded-lg p-3">
          <div className="text-xs font-bold text-[#EAF0FF] mb-2">
            Confidence Thresholds
          </div>
          <div className="space-y-1">
            {[
              { tier: "Standard Signal", pct: "72%+", color: "#4A9EFF" },
              { tier: "High Confidence", pct: "85%+", color: "#F2C94C" },
              { tier: "Elite Signal", pct: "92%+", color: "#2ED47A" },
            ].map((t) => (
              <div key={t.tier} className="flex items-center justify-between">
                <span className="text-[11px]">{t.tier}</span>
                <span className="text-xs font-bold" style={{ color: t.color }}>
                  {t.pct}
                </span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-[11px]">
          Each signal card shows:{" "}
          <strong className="text-[#EAF0FF]">
            Entry Price, Target, Stop Loss, Strategy Name, Timeframe,
          </strong>{" "}
          and the confidence percentage.
        </p>
      </div>
    ),
  },
  {
    id: "watchlist",
    category: "WATCHLIST",
    icon: <List className="w-4 h-4" />,
    title: "Using the Watchlist",
    keywords: [
      "watchlist",
      "add",
      "symbol",
      "price",
      "live",
      "remove",
      "enter",
    ],
    content: (
      <div className="space-y-3 text-sm text-[#9AA8C1]">
        <ul className="space-y-2">
          <li className="flex gap-2">
            <span className="text-[#F2C94C]">→</span>
            <span>
              Type a symbol in the input box (top of left panel) and press{" "}
              <strong className="text-[#EAF0FF]">Enter</strong> or click the{" "}
              <strong className="text-[#EAF0FF]">+</strong> button to add it.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-[#F2C94C]">→</span>
            <span>
              Works for{" "}
              <strong className="text-[#EAF0FF]">Indian stocks</strong>{" "}
              (RELIANCE, TCS, NIFTY50),{" "}
              <strong className="text-[#EAF0FF]">crypto pairs</strong> (BTC/USD,
              ETH/USD), and{" "}
              <strong className="text-[#EAF0FF]">forex pairs</strong> (EURUSD,
              USDINR).
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-[#F2C94C]">→</span>
            <span>
              Prices{" "}
              <strong className="text-[#EAF0FF]">update every 3 seconds</strong>{" "}
              with live market data. Green = up, Red = down.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-[#F2C94C]">→</span>
            <span>
              Hover over a row and click the{" "}
              <strong className="text-[#EAF0FF]">✕ remove button</strong> to
              delete it from the watchlist.
            </span>
          </li>
        </ul>
        <div className="bg-white/5 rounded p-2 text-[11px]">
          💡 The full Watchlist page (
          <strong className="text-[#EAF0FF]">/watchlist</strong>) has expanded
          features including sorting, filtering by exchange, and bulk actions.
        </div>
      </div>
    ),
  },
  {
    id: "strategies",
    category: "STRATEGIES",
    icon: <Target className="w-4 h-4" />,
    title: "Automated Trading Strategies",
    keywords: [
      "strategy",
      "automated",
      "ema",
      "bollinger",
      "supertrend",
      "vwap",
      "risk",
      "daily",
      "loss",
    ],
    content: (
      <div className="space-y-3 text-sm text-[#9AA8C1]">
        <p>
          Go to <strong className="text-[#EAF0FF]">/strategies</strong> to
          manage all automated strategies. Currently active on dashboard:
        </p>
        <div className="space-y-1">
          {[
            [
              "EMA Crossover",
              "Trend Following",
              "Buys when fast EMA crosses above slow EMA",
            ],
            [
              "BB Squeeze",
              "Mean Reversion",
              "Trades Bollinger Band breakouts after low volatility",
            ],
            [
              "Supertrend",
              "Trend Following",
              "ATR-based directional signal with SL trailing",
            ],
            [
              "VWAP Reversion",
              "Mean Reversion",
              "Fades price when it deviates from VWAP",
            ],
          ].map(([name, type, desc]) => (
            <div key={name} className="bg-white/5 rounded p-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#EAF0FF]">{name}</span>
                <span
                  className="text-[9px] px-1.5 py-0.5 rounded"
                  style={{ background: "#F2C94C22", color: "#F2C94C" }}
                >
                  {type}
                </span>
              </div>
              <div className="text-[11px] mt-0.5">{desc}</div>
            </div>
          ))}
        </div>
        <div className="bg-white/5 rounded-lg p-3">
          <div className="text-xs font-bold text-[#EAF0FF] mb-2">
            Risk Settings per Strategy
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
            {[
              ["Daily Loss Limit", "Max % drawdown per day"],
              ["Stop Loss %", "Per-trade risk control"],
              ["Max Positions", "Concurrent open trades"],
            ].map(([label, desc]) => (
              <div key={label}>
                <div className="font-bold text-[#F2C94C] text-[10px]">
                  {label}
                </div>
                <div className="text-[#9AA8C1]">{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "portfolio",
    category: "PORTFOLIO",
    icon: <TrendingUp className="w-4 h-4" />,
    title: "Portfolio Tracking",
    keywords: [
      "portfolio",
      "positions",
      "pnl",
      "drawdown",
      "capital",
      "virtual",
      "paper",
    ],
    content: (
      <div className="space-y-3 text-sm text-[#9AA8C1]">
        <div className="grid grid-cols-2 gap-2">
          {[
            ["Virtual Capital", "₹10,00,000", "Starting paper balance"],
            ["P&L Tracking", "Live simulation", "Updates every 5 seconds"],
            ["Drawdown", "Real-time calc", "Max loss from peak"],
            ["Open Positions", "All instruments", "Indian + Global"],
          ].map(([title, val, desc]) => (
            <div key={title} className="bg-white/5 rounded p-2.5">
              <div className="text-[10px] text-[#9AA8C1]">{title}</div>
              <div className="text-xs font-bold text-[#F2C94C]">{val}</div>
              <div className="text-[10px] text-[#9AA8C1]">{desc}</div>
            </div>
          ))}
        </div>
        <p className="text-[11px]">
          Full portfolio page (
          <strong className="text-[#EAF0FF]">/portfolio</strong>) shows open
          positions, closed trades, trade history, P&L breakdown by instrument
          and strategy.
        </p>
      </div>
    ),
  },
  {
    id: "ai-brain",
    category: "AI & ML ENGINE",
    icon: <Brain className="w-4 h-4" />,
    title: "AI Brain (/ai-brain)",
    keywords: [
      "ai",
      "brain",
      "ml",
      "lstm",
      "cnn",
      "finbert",
      "sentiment",
      "model",
      "pipeline",
    ],
    content: (
      <div className="space-y-3 text-sm text-[#9AA8C1]">
        <p>
          The <strong className="text-[#EAF0FF]">/ai-brain</strong> page gives a
          full view of the 7-layer ML pipeline and live model performance.
        </p>
        <div className="space-y-1">
          {[
            [
              "LSTM",
              "Price Direction",
              "Time-series forecasting of next-candle direction",
            ],
            [
              "CNN",
              "Pattern Recognition",
              "Identifies chart patterns (Head & Shoulders, Cup, etc.)",
            ],
            [
              "FinBERT",
              "Sentiment Analysis",
              "Processes financial news to score market sentiment",
            ],
            [
              "Isolation Forest",
              "Anomaly Detection",
              "Detects unusual price/volume behavior",
            ],
            [
              "Portfolio Optimizer",
              "MPT + RL",
              "Optimal position sizing via Modern Portfolio Theory",
            ],
            [
              "Regime Detector",
              "HMM",
              "Identifies trending vs. mean-reverting market regimes",
            ],
          ].map(([model, type, desc]) => (
            <div key={model} className="flex gap-2 bg-white/5 rounded p-2">
              <div className="min-w-[90px]">
                <div className="text-xs font-bold text-[#EAF0FF]">{model}</div>
                <div className="text-[9px] text-[#F2C94C]">{type}</div>
              </div>
              <div className="text-[11px]">{desc}</div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "risk-management",
    category: "RISK MANAGEMENT",
    icon: <Shield className="w-4 h-4" />,
    title: "Risk Management (/risk)",
    keywords: [
      "risk",
      "stop",
      "loss",
      "position",
      "sizing",
      "kelly",
      "atr",
      "drawdown",
      "protection",
    ],
    content: (
      <div className="space-y-3 text-sm text-[#9AA8C1]">
        <p>
          6-tab risk management system at{" "}
          <strong className="text-[#EAF0FF]">/risk</strong>:
        </p>
        <div className="space-y-1">
          {[
            [
              "Pre-Trade Checks",
              "Validates each order before execution — liquidity, circuit limits, correlation",
            ],
            [
              "Position Sizing",
              "Fixed %, Kelly Criterion, ATR-based, or Volatility-Adjusted sizing",
            ],
            [
              "Real-Time Monitor",
              "Live risk dashboard: drawdown, beta, VaR, Sharpe ratio",
            ],
            [
              "Account Controls",
              "Max daily loss, max open positions, max sector exposure",
            ],
            [
              "Correlation Risk",
              "Prevents over-concentration in correlated assets",
            ],
            [
              "Black Swan Protection",
              "Automatic hedge triggers if market drops >3% in 15 min",
            ],
          ].map(([tab, desc]) => (
            <div key={tab} className="flex gap-2 items-start">
              <span className="text-[#F2C94C] mt-0.5">▸</span>
              <div>
                <strong className="text-[#EAF0FF] text-xs">{tab}:</strong>
                <span className="text-[11px] ml-1">{desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "orders",
    category: "ORDERS",
    icon: <ShoppingBag className="w-4 h-4" />,
    title: "Order Execution (/orders)",
    keywords: [
      "order",
      "bracket",
      "cover",
      "iceberg",
      "twap",
      "vwap",
      "oco",
      "conditional",
      "smart",
      "router",
    ],
    content: (
      <div className="space-y-3 text-sm text-[#9AA8C1]">
        <p>
          10+ advanced order types at{" "}
          <strong className="text-[#EAF0FF]">/orders</strong>:
        </p>
        <div className="grid grid-cols-2 gap-1">
          {[
            ["Bracket Order", "Auto SL + Target"],
            ["Cover Order", "Intraday with SL"],
            ["Iceberg Order", "Large orders sliced"],
            ["TWAP", "Time-weighted average"],
            ["VWAP", "Volume-weighted average"],
            ["OCO", "One Cancels Other"],
            ["Scale-In/Out", "Ladder entry/exit"],
            ["Conditional", "Trigger on price/event"],
          ].map(([name, desc]) => (
            <div key={name} className="bg-white/5 rounded p-2">
              <div className="text-[11px] font-bold text-[#EAF0FF]">{name}</div>
              <div className="text-[10px]">{desc}</div>
            </div>
          ))}
        </div>
        <p className="text-[11px]">
          The <strong className="text-[#EAF0FF]">Smart Order Router</strong>{" "}
          automatically selects the best execution path — checks liquidity,
          spread, circuit limits, and provides slippage analytics.
        </p>
      </div>
    ),
  },
  {
    id: "charts",
    category: "CHARTS",
    icon: <LineChart className="w-4 h-4" />,
    title: "Advanced Charts (/charts)",
    keywords: [
      "chart",
      "candlestick",
      "indicator",
      "sa",
      "supertrend",
      "tradingview",
      "timeframe",
      "pattern",
      "heatmap",
    ],
    content: (
      <div className="space-y-3 text-sm text-[#9AA8C1]">
        <p>
          Full charting suite at{" "}
          <strong className="text-[#EAF0FF]">/charts</strong> with TradingView
          integration and Sun Algo's proprietary indicators:
        </p>
        <div className="space-y-1">
          {[
            [
              "SA_SuperSignal",
              "Combined signal overlay with entry/exit arrows",
            ],
            ["SA_SmartSR", "Auto-detected support/resistance levels"],
            ["SA_VolumeProfile", "Volume at price histogram"],
            ["SA_MarketStructure", "HH/HL/LH/LL structural break detection"],
            ["SA_FibonacciAuto", "Auto-drawn Fibonacci retracements"],
            ["SA_SmartMoney", "Institutional order flow detection"],
          ].map(([ind, desc]) => (
            <div key={ind} className="flex gap-2">
              <span className="text-[#F2C94C] text-[11px] font-mono min-w-[140px]">
                {ind}
              </span>
              <span className="text-[11px]">{desc}</span>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {["1M", "5M", "15M", "1H", "4H", "1D", "1W"].map((tf) => (
            <span
              key={tf}
              className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-[#EAF0FF] font-mono"
            >
              {tf}
            </span>
          ))}
          <span className="text-[10px] text-[#9AA8C1] self-center">
            timeframes supported
          </span>
        </div>
      </div>
    ),
  },
  {
    id: "strategy-builder",
    category: "STRATEGY BUILDER",
    icon: <Settings className="w-4 h-4" />,
    title: "Visual Strategy Builder (/strategy-builder)",
    keywords: [
      "builder",
      "drag",
      "drop",
      "no-code",
      "backtest",
      "deploy",
      "visual",
    ],
    content: (
      <div className="space-y-3 text-sm text-[#9AA8C1]">
        <ul className="space-y-2">
          <li className="flex gap-2">
            <span className="text-[#F2C94C]">→</span>
            <span>
              <strong className="text-[#EAF0FF]">No-code drag-and-drop</strong>{" "}
              interface to build custom strategies using a block library of
              conditions and actions.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-[#F2C94C]">→</span>
            <span>
              <strong className="text-[#EAF0FF]">Backtest</strong> your strategy
              against years of historical data — see win rate, P&L, drawdown,
              and Sharpe ratio.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-[#F2C94C]">→</span>
            <span>
              <strong className="text-[#EAF0FF]">Deploy to Paper</strong>{" "}
              trading instantly for live simulation before risking real capital.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-[#F2C94C]">→</span>
            <span>
              Includes pre-built{" "}
              <strong className="text-[#EAF0FF]">strategy templates</strong> for
              EMA crossover, RSI oversold, MACD divergence, and more.
            </span>
          </li>
        </ul>
      </div>
    ),
  },
  {
    id: "copy-trading",
    category: "COPY TRADING",
    icon: <Copy className="w-4 h-4" />,
    title: "Copy Trading (/copy-trading)",
    keywords: [
      "copy",
      "follow",
      "master",
      "trader",
      "follower",
      "pnl",
      "ratio",
    ],
    content: (
      <div className="space-y-3 text-sm text-[#9AA8C1]">
        <ul className="space-y-2">
          <li className="flex gap-2">
            <span className="text-[#F2C94C]">→</span>
            <span>
              Browse{" "}
              <strong className="text-[#EAF0FF]">
                verified master traders
              </strong>{" "}
              with audited track records.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-[#F2C94C]">→</span>
            <span>
              Set your <strong className="text-[#EAF0FF]">copy ratio</strong>{" "}
              (e.g., 50% of master's trade size) and per-trade risk controls.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-[#F2C94C]">→</span>
            <span>
              All trades are mirrored automatically with live P&L tracking on
              your account.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-[#F2C94C]">→</span>
            <span>
              Masters earn a{" "}
              <strong className="text-[#EAF0FF]">revenue share</strong> or
              subscription fee from followers.
            </span>
          </li>
        </ul>
      </div>
    ),
  },
  {
    id: "options",
    category: "OPTIONS",
    icon: <Activity className="w-4 h-4" />,
    title: "Options Intelligence (/options)",
    keywords: [
      "options",
      "greeks",
      "delta",
      "gamma",
      "theta",
      "vega",
      "iv",
      "pcr",
      "max",
      "pain",
      "chain",
    ],
    content: (
      <div className="space-y-3 text-sm text-[#9AA8C1]">
        <div className="grid grid-cols-2 gap-2">
          {[
            ["Option Chain", "Full strike matrix with bid/ask, OI, volume"],
            ["Max Pain", "Strike where most options expire worthless"],
            ["PCR", "Put/Call ratio — market sentiment gauge"],
            ["IV Rank/Percentile", "Is volatility cheap or expensive?"],
            ["Greeks Dashboard", "Delta, Gamma, Theta, Vega for each position"],
            [
              "Strategy Suggester",
              "Straddle, Strangle, Iron Condor recommendations",
            ],
          ].map(([label, desc]) => (
            <div key={label} className="bg-white/5 rounded p-2">
              <div className="text-[11px] font-bold text-[#EAF0FF]">
                {label}
              </div>
              <div className="text-[10px]">{desc}</div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "instruments",
    category: "INSTRUMENTS",
    icon: <Search className="w-4 h-4" />,
    title: "Instrument Mapping (/instruments)",
    keywords: [
      "instrument",
      "mapping",
      "fetch",
      "parse",
      "enrich",
      "store",
      "index",
      "sync",
      "isin",
      "symbol",
      "search",
    ],
    content: (
      <div className="space-y-3 text-sm text-[#9AA8C1]">
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-white/5 rounded p-2.5 text-center">
            <div className="text-lg font-bold text-[#F2C94C]">58,420+</div>
            <div className="text-[10px]">
              Indian Instruments (NSE/BSE/MCX/F&O)
            </div>
          </div>
          <div className="bg-white/5 rounded p-2.5 text-center">
            <div className="text-lg font-bold text-[#F2C94C]">84,312+</div>
            <div className="text-[10px]">
              International (US/Forex/Crypto/Commodities)
            </div>
          </div>
        </div>
        <div className="text-xs font-bold text-[#EAF0FF] mb-1">
          7-Step Auto-Mapping Pipeline
        </div>
        <div className="flex flex-wrap gap-1.5">
          {["Fetch", "Parse", "Enrich", "Store", "Index", "Sync", "Map"].map(
            (step, i) => (
              <span key={step} className="flex items-center gap-1">
                <span
                  className="text-[10px] px-2 py-0.5 rounded"
                  style={{ background: "#F2C94C22", color: "#F2C94C" }}
                >
                  {step}
                </span>
                {i < 6 && <span className="text-[#9AA8C1] text-[10px]">→</span>}
              </span>
            ),
          )}
        </div>
        <p className="text-[11px]">
          Search by <strong className="text-[#EAF0FF]">symbol</strong>,{" "}
          <strong className="text-[#EAF0FF]">company name</strong>,{" "}
          <strong className="text-[#EAF0FF]">ISIN</strong>, or{" "}
          <strong className="text-[#EAF0FF]">sector</strong>. Results show
          exchange, type, last price, and one-click add to watchlist or chart.
        </p>
      </div>
    ),
  },
  {
    id: "global-markets",
    category: "GLOBAL MARKETS",
    icon: <Globe className="w-4 h-4" />,
    title: "Global Markets (/global-markets)",
    keywords: [
      "global",
      "us",
      "stock",
      "nasdaq",
      "nyse",
      "forex",
      "crypto",
      "commodities",
      "indices",
      "international",
    ],
    content: (
      <div className="space-y-3 text-sm text-[#9AA8C1]">
        <p>
          5-tab coverage at{" "}
          <strong className="text-[#EAF0FF]">/global-markets</strong>:
        </p>
        <div className="space-y-1">
          {[
            [
              "US Stocks",
              "NYSE, NASDAQ, AMEX — 10,000+ companies, S&P 500, NASDAQ 100, DOW 30 constituents",
            ],
            [
              "Global Forex",
              "Major, minor, and exotic pairs (7+20+50), live session clock for Sydney/Tokyo/London/NY",
            ],
            [
              "Crypto",
              "13,000+ coins — Layer 1, Layer 2, DeFi, Exchange, Stablecoins, Meme, NFT/Gaming, AI tokens",
            ],
            [
              "Commodities",
              "Gold, Silver, Crude Oil, Natural Gas, Wheat, Corn, Coffee, Cotton, and more",
            ],
            [
              "Global Indices",
              "30+ indices across Asia-Pacific, Europe, Americas, Middle East & Africa",
            ],
          ].map(([tab, desc]) => (
            <div key={tab} className="flex gap-2">
              <span className="text-[#F2C94C] min-w-[110px] text-[11px] font-bold">
                {tab}
              </span>
              <span className="text-[11px]">{desc}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "fundamentals",
    category: "FUNDAMENTALS",
    icon: <BarChart2 className="w-4 h-4" />,
    title: "Fundamentals (/fundamentals)",
    keywords: [
      "fundamentals",
      "ratios",
      "earnings",
      "shareholding",
      "on-chain",
      "macro",
      "forex",
      "commodities",
    ],
    content: (
      <div className="space-y-3 text-sm text-[#9AA8C1]">
        <div className="space-y-1">
          {[
            [
              "Stocks",
              "Valuation ratios, P&L, balance sheet, quarterly results (BEAT/MISS), shareholding, corporate actions, analyst consensus",
            ],
            [
              "Crypto",
              "Tokenomics, on-chain metrics (Glassnode), exchange metrics, funding rate, developer activity, community sentiment",
            ],
            [
              "Forex",
              "Side-by-side macroeconomic data for both currencies, Central Bank Tracker with HAWKISH/DOVISH/NEUTRAL badges",
            ],
            [
              "Commodities",
              "OPEC, EIA inventory, Baker Hughes rig count, USDA crop report, WGC gold demand data",
            ],
          ].map(([tab, desc]) => (
            <div key={tab} className="bg-white/5 rounded p-2">
              <div className="text-[11px] font-bold text-[#EAF0FF]">{tab}</div>
              <div className="text-[11px]">{desc}</div>
            </div>
          ))}
        </div>
        <p className="text-[11px]">
          Data syncs every 15 minutes for market data, within 15 minutes for
          quarterly results, daily for analyst targets and corporate actions.
        </p>
      </div>
    ),
  },
  {
    id: "analytics",
    category: "ANALYTICS & SCANNER",
    icon: <BarChart2 className="w-4 h-4" />,
    title: "Analytics & Scanner",
    keywords: [
      "analytics",
      "scanner",
      "equity",
      "curve",
      "heatmap",
      "sector",
      "screener",
      "filter",
    ],
    content: (
      <div className="space-y-3 text-sm text-[#9AA8C1]">
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-white/5 rounded p-2.5">
            <div className="text-xs font-bold text-[#EAF0FF] mb-1.5">
              /analytics
            </div>
            <ul className="space-y-1 text-[11px]">
              <li>• Equity curve visualization</li>
              <li>• Trade distribution heatmap</li>
              <li>• Psychology tracker</li>
              <li>• Sector rotation analysis</li>
              <li>• Win rate & profit factor</li>
            </ul>
          </div>
          <div className="bg-white/5 rounded p-2.5">
            <div className="text-xs font-bold text-[#EAF0FF] mb-1.5">
              /scanner
            </div>
            <ul className="space-y-1 text-[11px]">
              <li>• Real-time auto-scan</li>
              <li>• Filter by sector, market cap</li>
              <li>• Technical pattern filters</li>
              <li>• Custom screener builder</li>
              <li>• Scan templates</li>
            </ul>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "alerts",
    category: "ALERTS",
    icon: <AlertTriangle className="w-4 h-4" />,
    title: "Alerts & Notifications (/alerts)",
    keywords: [
      "alert",
      "notification",
      "push",
      "email",
      "telegram",
      "sms",
      "price",
      "signal",
    ],
    content: (
      <div className="space-y-3 text-sm text-[#9AA8C1]">
        <div className="space-y-1">
          {[
            ["Price Alerts", "Trigger when any instrument hits a target price"],
            ["Signal Alerts", "Notify when a new AI signal is generated"],
            ["Strategy Alerts", "Confirm when a strategy executes a trade"],
            ["Risk Alerts", "Warn when daily loss limit approaches"],
          ].map(([type, desc]) => (
            <div key={type} className="flex gap-2">
              <span className="text-[#F2C94C] min-w-[110px] text-[11px] font-bold">
                {type}
              </span>
              <span className="text-[11px]">{desc}</span>
            </div>
          ))}
        </div>
        <div className="text-xs font-bold text-[#EAF0FF] mb-1">
          Delivery Channels
        </div>
        <div className="flex flex-wrap gap-2">
          {["📱 Push", "📧 Email", "💬 Telegram", "📲 SMS", "📞 WhatsApp"].map(
            (ch) => (
              <span
                key={ch}
                className="text-[11px] px-2 py-1 rounded bg-white/10 text-[#EAF0FF]"
              >
                {ch}
              </span>
            ),
          )}
        </div>
      </div>
    ),
  },
  {
    id: "telegram-bot",
    category: "TELEGRAM BOT",
    icon: <MessageSquare className="w-4 h-4" />,
    title: "Telegram Bot (@SunAlgoBot)",
    keywords: [
      "telegram",
      "bot",
      "signal",
      "subscribe",
      "channel",
      "command",
      "refer",
      "premium",
      "free",
    ],
    content: (
      <div className="space-y-3 text-sm text-[#9AA8C1]">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <div className="text-xs font-bold text-[#EAF0FF] mb-1.5">
              Bot Commands
            </div>
            <div className="space-y-0.5">
              {[
                "/start",
                "/subscribe",
                "/signals",
                "/portfolio",
                "/status",
                "/refer",
                "/help",
                "/unsubscribe",
              ].map((cmd) => (
                <div key={cmd} className="text-[11px] font-mono text-[#4A9EFF]">
                  {cmd}
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs font-bold text-[#EAF0FF] mb-1.5">
              Channels
            </div>
            <div className="space-y-1">
              {[
                ["@SunAlgo_Free", "Delayed signals — free"],
                ["@SunAlgo_Premium", "Instant signals — Pro plan"],
                ["@SunAlgo_Elite", "All signals — Elite plan"],
                ["@SunAlgo_Community", "Discussion group"],
              ].map(([ch, desc]) => (
                <div key={ch}>
                  <div className="text-[10px] font-bold text-[#4A9EFF]">
                    {ch}
                  </div>
                  <div className="text-[10px] text-[#9AA8C1]">{desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <p className="text-[11px]">
          Each signal delivered via Telegram includes: instrument, entry, target
          1/2/3, stop loss, confidence %, chart image, and legal disclaimer.
        </p>
      </div>
    ),
  },
  {
    id: "broker",
    category: "BROKER CONNECTIONS",
    icon: <Radio className="w-4 h-4" />,
    title: "Broker Connections (/broker)",
    keywords: [
      "broker",
      "zerodha",
      "angel",
      "upstox",
      "binance",
      "api",
      "key",
      "secret",
      "connect",
      "live",
    ],
    content: (
      <div className="space-y-3 text-sm text-[#9AA8C1]">
        <p>
          Connect your brokerage account at{" "}
          <strong className="text-[#EAF0FF]">/broker</strong> using API Key +
          Secret (stored with AES-256 encryption).
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="text-[10px] font-bold text-[#FF9933] mb-1.5">
              🇮🇳 Indian Brokers
            </div>
            <div className="space-y-0.5">
              {[
                "Zerodha (Kite)",
                "Angel One",
                "Upstox",
                "Fyers",
                "5paisa",
                "IIFL",
                "Dhan",
              ].map((b) => (
                <div key={b} className="text-[11px]">
                  {b}
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="text-[10px] font-bold text-[#4A9EFF] mb-1.5">
              🌐 International
            </div>
            <div className="space-y-0.5">
              {[
                "Binance",
                "Coinbase Pro",
                "Kraken",
                "OKX",
                "Alpaca",
                "Interactive Brokers",
                "TD Ameritrade",
              ].map((b) => (
                <div key={b} className="text-[11px]">
                  {b}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="bg-[#F2C94C]/10 border border-[#F2C94C]/30 rounded p-2 text-[11px]">
          ⚠️ API keys are used only for order placement and account data — they
          are never shared or stored in plaintext. Enable{" "}
          <strong className="text-[#EAF0FF]">IP whitelist</strong> in your
          broker's settings for extra security.
        </div>
      </div>
    ),
  },
  {
    id: "admin",
    category: "ADMIN & PROFILE",
    icon: <User className="w-4 h-4" />,
    title: "Admin Panel & Profile",
    keywords: [
      "admin",
      "profile",
      "kyc",
      "subscription",
      "user",
      "plan",
      "free",
      "pro",
      "elite",
      "2fa",
    ],
    content: (
      <div className="space-y-3 text-sm text-[#9AA8C1]">
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-white/5 rounded p-2.5">
            <div className="text-xs font-bold text-[#EAF0FF] mb-1.5">
              /admin
            </div>
            <ul className="space-y-1 text-[11px]">
              <li>• User management</li>
              <li>• Subscription plans</li>
              <li>• Signal monitoring</li>
              <li>• Broker API health</li>
              <li>• Revenue analytics</li>
              <li>• Referral leaderboard</li>
            </ul>
          </div>
          <div className="bg-white/5 rounded p-2.5">
            <div className="text-xs font-bold text-[#EAF0FF] mb-1.5">
              /profile
            </div>
            <ul className="space-y-1 text-[11px]">
              <li>• KYC document upload</li>
              <li>• 2FA setup</li>
              <li>• Subscription plan</li>
              <li>• Notification prefs</li>
              <li>• API key management</li>
            </ul>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          {[
            {
              plan: "Free",
              color: "#9AA8C1",
              desc: "Delayed signals, India only",
            },
            {
              plan: "Pro",
              color: "#4A9EFF",
              desc: "Instant signals, all markets",
            },
            {
              plan: "Elite",
              color: "#F2C94C",
              desc: "VIP signals, all features",
            },
          ].map((p) => (
            <div key={p.plan} className="bg-white/5 rounded p-2 flex-1">
              <div className="text-xs font-bold" style={{ color: p.color }}>
                {p.plan}
              </div>
              <div className="text-[10px] text-[#9AA8C1]">{p.desc}</div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
];

const CHANGELOG = [
  {
    version: "v9",
    date: "2025",
    label: "Latest",
    color: "#2ED47A",
    changes: [
      "Forex/Crypto live market fixes (24/7 price updates)",
      "Dashboard switches content on market mode change",
      "Broker page rebuilt with Indian & International sections",
      "API key connection with AES-256 encrypted storage",
    ],
  },
  {
    version: "v8",
    date: "2025",
    label: "",
    color: "#4A9EFF",
    changes: [
      "Market Mode Selector (🇮🇳 Indian / 💱 Forex & Crypto / 🌐 Global)",
      "BUY/SELL always unlocked in Forex/Crypto mode (24/7)",
      "Dashboard status label adapts to active mode",
      "Signal engine pause logic is mode-aware",
    ],
  },
  {
    version: "v7",
    date: "2025",
    label: "",
    color: "#9B8AFF",
    changes: [
      "Global Markets page: 84,312+ international instruments",
      "Fundamentals data engine (stocks, crypto, forex, commodities)",
      "Live macro data, analyst consensus, on-chain metrics",
      "Sync schedule and data freshness indicators",
    ],
  },
  {
    version: "v6",
    date: "2025",
    label: "",
    color: "#F2C94C",
    changes: [
      "Instrument Mapping Engine: 58,420+ Indian instruments",
      "7-step pipeline: Fetch → Parse → Enrich → Store → Index → Sync → Map",
      "Broker token mapping (Zerodha, Angel One, Upstox)",
      "Instruments search page with ISIN and sector search",
    ],
  },
  {
    version: "v5",
    date: "2025",
    label: "",
    color: "#FF9933",
    changes: [
      "AI/ML Intelligence Suite (7-layer pipeline)",
      "6 new AI pages: Data Ingestion, Feature Engine, ML Models, Signal Generator, Risk Engine, Execution Engine",
      "Model performance dashboard and continuous learning",
      "AI explainability: every signal includes model reasoning breakdown",
    ],
  },
  {
    version: "v4",
    date: "2025",
    label: "",
    color: "#FF5A5F",
    changes: [
      "Risk Management: 6-tab system with pre-trade checks",
      "Orders: 10+ order types, smart routing, Level 2 book",
      "Copy Trading: master/follower dashboards",
      "Options Intelligence: full chain, Greeks, IV, strategy suggester",
    ],
  },
  {
    version: "v3",
    date: "2024",
    label: "",
    color: "#9AA8C1",
    changes: [
      "Strategy Builder: visual drag-and-drop, no-code",
      "Advanced Charts: TradingView + 6 proprietary indicators",
      "Analytics enhancement: equity curve, heatmap, psychology tracker",
      "NIFTY 50 heatmap and sector rotation view",
    ],
  },
  {
    version: "v2",
    date: "2024",
    label: "",
    color: "#9AA8C1",
    changes: [
      "Telegram Bot: @SunAlgoBot with full signal delivery pipeline",
      "Scanner: real-time auto-scan with custom screener",
      "Alerts: multi-channel notifications (Push, Email, Telegram, SMS)",
      "Admin panel: user management, subscription, signal control",
    ],
  },
  {
    version: "v1",
    date: "2024",
    label: "Initial",
    color: "#9AA8C1",
    changes: [
      "Dashboard: 3-column layout, live prices, signal cards",
      "Portfolio: paper trading with ₹10,00,000 virtual capital",
      "Watchlist: add/remove symbols, live price updates",
      "Strategies: EMA Crossover, BB Squeeze, Supertrend, VWAP",
      "Broker: connection page for Indian and international brokers",
    ],
  },
];

function AccordionSection({
  section,
  isOpen,
  onToggle,
}: {
  section: HelpSection;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className="bg-white/5 rounded-lg overflow-hidden border border-white/5 hover:border-white/10 transition-colors"
      data-ocid="help.panel"
    >
      <button
        type="button"
        onClick={onToggle}
        data-ocid="help.toggle"
        className="w-full flex items-center justify-between px-4 py-3 text-left cursor-pointer hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span style={{ color: "#F2C94C" }}>{section.icon}</span>
          <span className="text-sm font-semibold text-[#EAF0FF]">
            {section.title}
          </span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-[#9AA8C1] flex-shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-[#9AA8C1] flex-shrink-0" />
        )}
      </button>
      {isOpen && (
        <div className="px-4 pb-4 border-t border-white/5">
          <div className="pt-3">{section.content}</div>
        </div>
      )}
    </div>
  );
}

export default function Help() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openSections, setOpenSections] = useState<Set<string>>(
    new Set(["what-is-sun-algo"]),
  );

  const toggleSection = (id: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return HELP_SECTIONS;
    const q = searchQuery.toLowerCase();
    return HELP_SECTIONS.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.keywords.some((k) => k.includes(q)),
    );
  }, [searchQuery]);

  const groupedSections = useMemo(() => {
    const groups: Record<string, HelpSection[]> = {};
    for (const section of filteredSections) {
      if (!groups[section.category]) groups[section.category] = [];
      groups[section.category].push(section);
    }
    return groups;
  }, [filteredSections]);

  const expandAll = () => {
    setOpenSections(new Set(filteredSections.map((s) => s.id)));
  };
  const collapseAll = () => {
    setOpenSections(new Set());
  };

  return (
    <div className="px-4 lg:px-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: "rgba(242,201,76,0.15)",
              border: "1px solid rgba(242,201,76,0.3)",
            }}
          >
            <HelpCircle className="w-5 h-5" style={{ color: "#F2C94C" }} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#EAF0FF]">
              Help & Documentation
            </h1>
            <p className="text-xs text-[#9AA8C1]">
              Full guide to Sun Algo — AI-powered multi-market trading platform
            </p>
          </div>
          <Badge
            className="ml-auto text-[10px] px-2"
            style={{
              background: "rgba(46,212,122,0.15)",
              color: "#2ED47A",
              border: "1px solid rgba(46,212,122,0.3)",
            }}
          >
            v9 Latest
          </Badge>
        </div>

        {/* Search */}
        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9AA8C1]" />
          <Input
            data-ocid="help.search_input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documentation... (e.g. 'signals', 'broker', 'paper trading')"
            className="pl-9 bg-white/5 border-[#24344F] text-[#EAF0FF] placeholder:text-[#9AA8C1] h-10"
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mt-3">
          <span className="text-xs text-[#9AA8C1]">
            {filteredSections.length} section
            {filteredSections.length !== 1 ? "s" : ""}
            {searchQuery && ` matching "${searchQuery}"`}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={expandAll}
              data-ocid="help.button"
              className="text-[10px] text-[#9AA8C1] hover:text-[#EAF0FF] transition-colors"
            >
              Expand All
            </button>
            <span className="text-[#9AA8C1]">·</span>
            <button
              type="button"
              onClick={collapseAll}
              data-ocid="help.button"
              className="text-[10px] text-[#9AA8C1] hover:text-[#EAF0FF] transition-colors"
            >
              Collapse All
            </button>
          </div>
        </div>
      </div>

      {/* Sections */}
      <ScrollArea className="pb-8">
        {filteredSections.length === 0 ? (
          <div className="text-center py-16" data-ocid="help.empty_state">
            <Search className="w-8 h-8 text-[#9AA8C1] mx-auto mb-3" />
            <div className="text-sm text-[#EAF0FF]">
              No results for "{searchQuery}"
            </div>
            <div className="text-xs text-[#9AA8C1] mt-1">
              Try different keywords
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedSections).map(([category, sections]) => (
              <div key={category}>
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className="text-[9px] font-bold tracking-widest"
                    style={{ color: "#F2C94C" }}
                  >
                    {category}
                  </span>
                  <div
                    className="flex-1 h-px"
                    style={{ background: "rgba(242,201,76,0.2)" }}
                  />
                </div>
                <div className="space-y-2">
                  {sections.map((section) => (
                    <AccordionSection
                      key={section.id}
                      section={section}
                      isOpen={openSections.has(section.id)}
                      onToggle={() => toggleSection(section.id)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Version History / Changelog */}
        {!searchQuery && (
          <div className="mt-10">
            <div className="flex items-center gap-2 mb-5">
              <Clock className="w-4 h-4" style={{ color: "#F2C94C" }} />
              <h2 className="text-sm font-bold text-[#EAF0FF]">
                Version History & Changelog
              </h2>
              <div
                className="flex-1 h-px"
                style={{ background: "rgba(242,201,76,0.2)" }}
              />
            </div>
            <div className="relative pl-6">
              {/* vertical line */}
              <div
                className="absolute left-2.5 top-0 bottom-0 w-px"
                style={{ background: "rgba(255,255,255,0.1)" }}
              />
              <div className="space-y-6">
                {CHANGELOG.map((entry) => (
                  <div
                    key={entry.version}
                    className="relative"
                    data-ocid="help.item.1"
                  >
                    {/* dot */}
                    <div
                      className="absolute -left-[19px] top-1 w-3 h-3 rounded-full border-2 border-[#0B1424]"
                      style={{ background: entry.color }}
                    />
                    <div className="flex items-center gap-2 mb-1.5">
                      <span
                        className="text-sm font-bold"
                        style={{ color: entry.color }}
                      >
                        {entry.version}
                      </span>
                      <span className="text-[10px] text-[#9AA8C1]">
                        {entry.date}
                      </span>
                      {entry.label && (
                        <span
                          className="text-[9px] px-1.5 py-0.5 rounded font-bold"
                          style={{
                            background: `${entry.color}22`,
                            color: entry.color,
                          }}
                        >
                          {entry.label}
                        </span>
                      )}
                    </div>
                    <ul className="space-y-1">
                      {entry.changes.map((change) => (
                        <li
                          key={change}
                          className="text-[11px] text-[#9AA8C1] flex gap-2"
                        >
                          <span style={{ color: entry.color }}>▸</span>
                          <span>{change}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer note */}
        <div className="mt-10 text-center pb-4">
          <div className="text-xs text-[#9AA8C1]">
            This documentation updates automatically with every new release.
          </div>
          <div className="text-[10px] text-[#9AA8C1]/60 mt-1">
            Sun Algo v9 · © {new Date().getFullYear()} ·{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Built with ❤️ using caffeine.ai
            </a>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
