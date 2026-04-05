import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Activity,
  Brain,
  CheckCircle2,
  ChevronRight,
  Clock,
  Cpu,
  Database,
  Eye,
  FlaskConical,
  GitBranch,
  LineChart,
  MessageSquare,
  Pause,
  Shield,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";

const LAYERS = [
  {
    num: 1,
    label: "Data Ingestion",
    desc: "Live prices, news, social",
    icon: <Database className="w-4 h-4" />,
  },
  {
    num: 2,
    label: "Feature Engine",
    desc: "200+ technical indicators",
    icon: <GitBranch className="w-4 h-4" />,
  },
  {
    num: 3,
    label: "ML Models",
    desc: "Predict price direction",
    icon: <Brain className="w-4 h-4" />,
  },
  {
    num: 4,
    label: "Signal Generator",
    desc: "Entry/Exit/SL/Target",
    icon: <Zap className="w-4 h-4" />,
  },
  {
    num: 5,
    label: "Risk Engine",
    desc: "Position size, risk score",
    icon: <Shield className="w-4 h-4" />,
  },
  {
    num: 6,
    label: "Execution Engine",
    desc: "Auto-place broker orders",
    icon: <Activity className="w-4 h-4" />,
  },
  {
    num: 7,
    label: "Learning Engine",
    desc: "Self-improve from results",
    icon: <FlaskConical className="w-4 h-4" />,
  },
];

const ML_MODELS = [
  {
    name: "LSTM Price Direction",
    algo: "LSTM",
    algoColor: "#3B82F6",
    accuracy: 74.2,
    status: "ACTIVE",
    statusColor: "#10B981",
    lastTrained: "2 days ago",
    keyMetric: "78% UP probability",
    keyMetricLabel: "Current Prediction",
    details: ["5min", "15min", "1hr", "1day"],
    icon: <LineChart className="w-5 h-5" />,
  },
  {
    name: "Pattern Recognition CNN",
    algo: "CNN",
    algoColor: "#8B5CF6",
    accuracy: 71.8,
    status: "ACTIVE",
    statusColor: "#10B981",
    lastTrained: "3 days ago",
    keyMetric: "Bullish Engulfing — 84%",
    keyMetricLabel: "Last Pattern",
    details: ["50+ patterns", "Chart patterns"],
    icon: <Eye className="w-5 h-5" />,
  },
  {
    name: "Sentiment NLP (FinBERT)",
    algo: "FinBERT",
    algoColor: "#EC4899",
    accuracy: 68.4,
    status: "ACTIVE",
    statusColor: "#10B981",
    lastTrained: "1 day ago",
    keyMetric: "+67 (positive)",
    keyMetricLabel: "Sentiment Score Today",
    details: ["NSE/BSE", "ET/MC", "Twitter"],
    icon: <MessageSquare className="w-5 h-5" />,
  },
  {
    name: "Anomaly Detector",
    algo: "Isolation Forest",
    algoColor: "#F59E0B",
    accuracy: 82.1,
    status: "MONITORING",
    statusColor: "#F59E0B",
    lastTrained: "4 hours ago",
    keyMetric: "3 anomalies today",
    keyMetricLabel: "Pump Signals: 1 | Vol Spikes: 2",
    details: ["Pump & dump", "Manipulation", "OI spikes"],
    icon: <Shield className="w-5 h-5" />,
  },
  {
    name: "Portfolio Optimizer",
    algo: "MPT + RL",
    algoColor: "#10B981",
    accuracy: 87.0,
    status: "ACTIVE",
    statusColor: "#10B981",
    lastTrained: "3 days ago",
    keyMetric: "Sharpe 2.1 | Eff. 87%",
    keyMetricLabel: "Last Rebalance: 3 days ago",
    details: ["Max Sharpe", "Drawdown risk"],
    icon: <TrendingUp className="w-5 h-5" />,
  },
  {
    name: "Regime Detector",
    algo: "HMM",
    algoColor: "#06B6D4",
    accuracy: 79.3,
    status: "ACTIVE",
    statusColor: "#10B981",
    lastTrained: "6 hours ago",
    keyMetric: "TRENDING_UP (82%)",
    keyMetricLabel: "Current Regime",
    details: ["TRENDING", "RANGING", "HIGH_VOL"],
    icon: <Cpu className="w-5 h-5" />,
  },
];

const PIPELINE_STEPS = [
  { done: true, text: "Fetch all signals sent today", detail: "247 signals" },
  {
    done: true,
    text: "Record actual outcomes",
    detail: "hit/miss/SL recorded",
  },
  { done: true, text: "Calculate model accuracy", detail: "74.2% today" },
  {
    done: true,
    text: "Update model weights",
    detail: "online learning applied",
  },
  { done: true, text: "Flag underperforming strategies", detail: "1 flagged" },
  { done: true, text: "Generate performance report", detail: "report ready" },
  {
    done: false,
    text: "Auto-disable check",
    detail: "no strategy below threshold",
  },
  { done: true, text: "Admin alert sent", detail: "✓ delivered" },
];

const CONFIDENCE_COMPONENTS = [
  { label: "LSTM Model", weight: 30, value: 78, color: "#3B82F6" },
  { label: "Pattern Recognition", weight: 20, value: 84, color: "#8B5CF6" },
  { label: "Sentiment Score", weight: 15, value: 67, color: "#EC4899" },
  { label: "Technical Indicators", weight: 25, value: 81, color: "#F59E0B" },
  { label: "Volume Analysis", weight: 10, value: 100, color: "#10B981" },
];

function AnimatedDataFlow({ active }: { active: boolean }) {
  return (
    <div className="flex justify-center items-center my-1">
      <div
        className="w-0.5 h-6 relative overflow-hidden rounded-full"
        style={{ background: "#1E2C44" }}
      >
        <div
          className="absolute top-0 w-full rounded-full"
          style={{
            height: "40%",
            background: active ? "#F2C94C" : "#374151",
            animation: active ? "flowDown 1.2s linear infinite" : "none",
          }}
        />
      </div>
      <ChevronRight
        className="w-3 h-3 rotate-90 absolute"
        style={{ color: active ? "#F2C94C" : "#374151" }}
      />
    </div>
  );
}

export default function AIBrain() {
  const [activeLayer, setActiveLayer] = useState(0);
  const [pipelineActive, setPipelineActive] = useState(true);

  useEffect(() => {
    const iv = setInterval(() => {
      setActiveLayer((prev) => (prev + 1) % LAYERS.length);
    }, 800);
    return () => clearInterval(iv);
  }, []);

  const finalScore = Math.round(
    CONFIDENCE_COMPONENTS.reduce(
      (acc, c) => acc + (c.value * c.weight) / 100,
      0,
    ),
  );

  const getTierInfo = (score: number) => {
    if (score >= 92) return { label: "PREMIUM ELITE", color: "#F2C94C" };
    if (score >= 85) return { label: "HIGH CONFIDENCE", color: "#10B981" };
    if (score >= 72) return { label: "STANDARD", color: "#3B82F6" };
    return { label: "BELOW THRESHOLD", color: "#9AA8C1" };
  };

  const tier = getTierInfo(finalScore);

  return (
    <div
      className="px-4 lg:px-6 max-w-[1600px] mx-auto space-y-6 pb-6"
      data-ocid="ai-brain.page"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-[#EAF0FF] flex items-center gap-2">
            <Brain className="w-5 h-5" style={{ color: "#F2C94C" }} />
            AI Intelligence Engine
          </h1>
          <p className="text-xs text-[#9AA8C1] mt-0.5">
            7-layer neural pipeline · 6 ML models · continuous learning
          </p>
        </div>
        <Badge
          className="text-xs"
          style={{
            background: "rgba(16,185,129,0.15)",
            color: "#10B981",
            border: "1px solid #10B98133",
          }}
        >
          ● ENGINE ONLINE
        </Badge>
      </div>

      {/* Section 1: AI Architecture */}
      <div className="trading-card p-5">
        <h2 className="text-xs font-bold uppercase tracking-widest text-[#9AA8C1] mb-4">
          AI Architecture — 7-Layer Pipeline
        </h2>
        <div className="flex flex-col items-center gap-0 max-w-sm mx-auto">
          {LAYERS.map((layer, i) => (
            <div key={layer.num} className="w-full">
              <button
                type="button"
                className="flex items-center gap-3 p-3 rounded-xl transition-all duration-300 cursor-pointer w-full text-left"
                style={{
                  border:
                    i === activeLayer
                      ? "1px solid #F2C94C"
                      : "1px solid #24344F",
                  background:
                    i === activeLayer ? "rgba(242,201,76,0.08)" : "#0D1117",
                  boxShadow:
                    i === activeLayer
                      ? "0 0 12px rgba(242,201,76,0.15)"
                      : "none",
                }}
                onClick={() => setActiveLayer(i)}
              >
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{
                    background: i === activeLayer ? "#F2C94C" : "#1E2C44",
                    color: i === activeLayer ? "#0B1424" : "#9AA8C1",
                  }}
                >
                  {layer.num}
                </div>
                <div
                  style={{ color: i === activeLayer ? "#F2C94C" : "#9AA8C1" }}
                >
                  {layer.icon}
                </div>
                <div className="flex-1">
                  <div
                    className="text-sm font-semibold"
                    style={{ color: i === activeLayer ? "#EAF0FF" : "#9AA8C1" }}
                  >
                    {layer.label}
                  </div>
                  <div className="text-[10px] text-[#9AA8C1]">{layer.desc}</div>
                </div>
                {i === activeLayer && (
                  <div
                    className="w-2 h-2 rounded-full animate-pulse"
                    style={{ background: "#F2C94C" }}
                  />
                )}
              </button>
              {i < LAYERS.length - 1 && <AnimatedDataFlow active={true} />}
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: ML Model Cards */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-widest text-[#9AA8C1] mb-3">
          ML Models — Live Status
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ML_MODELS.map((model, i) => (
            <div
              key={model.name}
              data-ocid={`ai-brain.item.${i + 1}`}
              className="trading-card p-4 space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{
                      background: `${model.algoColor}22`,
                      color: model.algoColor,
                    }}
                  >
                    {model.icon}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#EAF0FF]">
                      {model.name}
                    </div>
                    <Badge
                      className="text-[9px] py-0 mt-0.5"
                      style={{
                        background: `${model.algoColor}22`,
                        color: model.algoColor,
                        border: `1px solid ${model.algoColor}44`,
                      }}
                    >
                      {model.algo}
                    </Badge>
                  </div>
                </div>
                <Badge
                  className="text-[9px]"
                  style={{
                    background: `${model.statusColor}22`,
                    color: model.statusColor,
                    border: `1px solid ${model.statusColor}44`,
                  }}
                >
                  ● {model.status}
                </Badge>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-[#9AA8C1]">Accuracy</span>
                  <span
                    className="text-[10px] font-bold"
                    style={{ color: model.algoColor }}
                  >
                    {model.accuracy}%
                  </span>
                </div>
                <Progress value={model.accuracy} className="h-1.5" />
              </div>
              <div
                className="rounded-lg p-2"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid #1E2C44",
                }}
              >
                <div className="text-[9px] text-[#9AA8C1] uppercase tracking-wider">
                  {model.keyMetricLabel}
                </div>
                <div className="text-xs font-semibold text-[#EAF0FF] mt-0.5">
                  {model.keyMetric}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex gap-1 flex-wrap">
                  {model.details.map((d) => (
                    <span
                      key={d}
                      className="text-[9px] px-1.5 py-0.5 rounded"
                      style={{ background: "#1E2C44", color: "#9AA8C1" }}
                    >
                      {d}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-1 text-[9px] text-[#9AA8C1]">
                  <Clock className="w-3 h-3" />
                  {model.lastTrained}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 3: AI Confidence Scoring */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="trading-card p-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#9AA8C1] mb-4">
            AI Confidence Scoring
          </h2>
          <div className="space-y-3">
            {CONFIDENCE_COMPONENTS.map((comp) => (
              <div key={comp.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-[#EAF0FF]">
                    {comp.label}
                    <span className="text-[#9AA8C1] ml-1">
                      ({comp.weight}% weight)
                    </span>
                  </span>
                  <span
                    className="text-xs font-bold"
                    style={{ color: comp.color }}
                  >
                    {comp.value}
                    {comp.label === "Volume Analysis" ? "% avg" : "%"}
                  </span>
                </div>
                <Progress value={Math.min(comp.value, 100)} className="h-2" />
              </div>
            ))}
          </div>
          <div
            className="mt-5 rounded-xl p-4 text-center"
            style={{
              background: "rgba(242,201,76,0.08)",
              border: "1px solid #F2C94C44",
            }}
          >
            <div className="text-[10px] text-[#9AA8C1] uppercase tracking-widest mb-1">
              Final AI Score
            </div>
            <div className="text-5xl font-black" style={{ color: "#F2C94C" }}>
              {finalScore}
              <span className="text-2xl">/100</span>
            </div>
            <Badge
              className="mt-2 text-xs"
              style={{
                background: `${tier.color}22`,
                color: tier.color,
                border: `1px solid ${tier.color}44`,
              }}
            >
              {tier.label} SIGNAL
            </Badge>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {[
              { tier: "STANDARD", min: 72, color: "#3B82F6" },
              { tier: "HIGH CONF.", min: 85, color: "#10B981" },
              { tier: "PREMIUM", min: 92, color: "#F2C94C" },
            ].map((t) => (
              <div
                key={t.tier}
                className="rounded-lg p-2 text-center"
                style={{
                  background: finalScore >= t.min ? `${t.color}22` : "#1E2C44",
                  border: `1px solid ${finalScore >= t.min ? `${t.color}44` : "#24344F"}`,
                }}
              >
                <div
                  className="text-[9px] font-bold"
                  style={{ color: finalScore >= t.min ? t.color : "#4B5563" }}
                >
                  {t.tier}
                </div>
                <div className="text-[9px] text-[#9AA8C1]">≥{t.min}%</div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 5: AI Explainability */}
        <div className="trading-card p-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#9AA8C1] mb-4">
            AI Explainability — Signal Reasoning
          </h2>
          <div
            className="rounded-xl p-4"
            style={{ background: "#0D1117", border: "1px solid #24344F" }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Brain className="w-4 h-4" style={{ color: "#F2C94C" }} />
              <span className="text-xs font-bold text-[#EAF0FF]">
                AI REASONING — HDFC BANK
              </span>
              <Badge
                style={{
                  background: "rgba(16,185,129,0.15)",
                  color: "#10B981",
                  border: "1px solid #10B98133",
                }}
                className="text-[9px] ml-auto"
              >
                BUY SIGNAL
              </Badge>
            </div>
            <div className="space-y-1.5">
              {[
                { ok: true, text: "LSTM model: 78% probability UP" },
                { ok: true, text: "Pattern: Bullish Engulfing detected" },
                { ok: true, text: "Sentiment: +67 (positive news flow)" },
                { ok: true, text: "Volume: 2.4x above 20-day average" },
                { ok: true, text: "Regime: TRENDING UP confirmed" },
                { ok: true, text: "FII: Net buyers ₹1,240 Cr today" },
                {
                  ok: false,
                  text: "Risk: Earnings in 3 days (caution)",
                  warn: true,
                },
              ].map((item) => (
                <div key={item.text} className="flex items-start gap-2 text-xs">
                  <span
                    style={{
                      color: item.warn ? "#F59E0B" : "#10B981",
                      flexShrink: 0,
                    }}
                  >
                    {item.warn ? "⚠️" : "✅"}
                  </span>
                  <span style={{ color: item.warn ? "#F59E0B" : "#EAF0FF" }}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
            <div
              className="mt-4 rounded-lg p-3 text-center"
              style={{
                background: "rgba(242,201,76,0.06)",
                border: "1px solid #F2C94C33",
              }}
            >
              <span className="text-[10px] text-[#9AA8C1]">
                Overall AI Score:{" "}
              </span>
              <span className="text-xl font-black" style={{ color: "#F2C94C" }}>
                84/100
              </span>
              <span className="text-xs text-[#EAF0FF]"> → BUY SIGNAL</span>
              <div className="mt-1">
                <Badge
                  style={{
                    background: "rgba(16,185,129,0.15)",
                    color: "#10B981",
                    border: "1px solid #10B98133",
                  }}
                  className="text-[10px]"
                >
                  HIGH CONFIDENCE
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 4: Continuous Learning Pipeline */}
      <div className="trading-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#9AA8C1]">
            Continuous Learning Pipeline
          </h2>
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-[#9AA8C1]">
              <Clock className="w-3 h-3 inline mr-1" />
              Last run: Yesterday 11:00 PM
            </span>
            <span className="text-[10px] text-[#F2C94C]">
              Next: Tonight 11:00 PM
            </span>
            <button
              type="button"
              onClick={() => setPipelineActive(!pipelineActive)}
              className="text-[10px] px-2 py-1 rounded"
              style={{
                background: pipelineActive
                  ? "rgba(16,185,129,0.15)"
                  : "rgba(239,68,68,0.15)",
                color: pipelineActive ? "#10B981" : "#EF4444",
              }}
            >
              {pipelineActive ? "ACTIVE" : "PAUSED"}
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {PIPELINE_STEPS.map((step, stepIdx) => (
            <div
              key={step.text}
              className="flex items-start gap-2 p-3 rounded-lg"
              style={{
                background: step.done
                  ? "rgba(16,185,129,0.06)"
                  : "rgba(245,158,11,0.06)",
                border: `1px solid ${step.done ? "#10B98133" : "#F59E0B33"}`,
              }}
            >
              <div className="flex-shrink-0 mt-0.5">
                {step.done ? (
                  <CheckCircle2
                    className="w-4 h-4"
                    style={{ color: "#10B981" }}
                  />
                ) : (
                  <Pause className="w-4 h-4" style={{ color: "#F59E0B" }} />
                )}
              </div>
              <div>
                <div
                  className="text-xs font-semibold"
                  style={{ color: step.done ? "#EAF0FF" : "#F59E0B" }}
                >
                  {stepIdx + 1}. {step.text}
                </div>
                <div
                  className="text-[10px] mt-0.5"
                  style={{ color: step.done ? "#9AA8C1" : "#F59E0B" }}
                >
                  {step.detail}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes flowDown {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(250%); }
        }
      `}</style>
    </div>
  );
}
