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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Plus, Shield } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { StrategyConfig, StrategyType } from "../backend.d";
import StrategyCard from "../components/StrategyCard";
import { useStrategies } from "../hooks/useQueries";

const MOCK_STRATEGIES: StrategyConfig[] = [
  {
    id: "s1",
    name: "EMA Crossover + RSI",
    strategyType: "trendFollowing" as StrategyType,
    enabled: true,
    parameters: '{"emaFast":9,"emaSlow":21}',
    riskSettings: {
      dailyLossLimitPct: 2,
      perTradeStopLossPct: 1.5,
      maxPositions: BigInt(5),
      positionSizePct: 5,
      drawdownProtectionPct: 5,
    },
  },
  {
    id: "s2",
    name: "Bollinger Band Squeeze",
    strategyType: "meanReversion" as StrategyType,
    enabled: true,
    parameters: '{"period":20}',
    riskSettings: {
      dailyLossLimitPct: 1.5,
      perTradeStopLossPct: 2,
      maxPositions: BigInt(3),
      positionSizePct: 3,
      drawdownProtectionPct: 8,
    },
  },
  {
    id: "s3",
    name: "VWAP Scalping",
    strategyType: "scalping" as StrategyType,
    enabled: false,
    parameters: '{"deviation":1.5}',
    riskSettings: {
      dailyLossLimitPct: 1,
      perTradeStopLossPct: 0.5,
      maxPositions: BigInt(8),
      positionSizePct: 2,
      drawdownProtectionPct: 3,
    },
  },
  {
    id: "s4",
    name: "Supertrend Breakout",
    strategyType: "breakout" as StrategyType,
    enabled: true,
    parameters: '{"atrPeriod":10}',
    riskSettings: {
      dailyLossLimitPct: 2.5,
      perTradeStopLossPct: 2,
      maxPositions: BigInt(4),
      positionSizePct: 6,
      drawdownProtectionPct: 10,
    },
  },
  {
    id: "s5",
    name: "Statistical Arbitrage",
    strategyType: "arbitrage" as StrategyType,
    enabled: false,
    parameters: '{"zScore":2}',
    riskSettings: {
      dailyLossLimitPct: 1,
      perTradeStopLossPct: 1,
      maxPositions: BigInt(6),
      positionSizePct: 4,
      drawdownProtectionPct: 5,
    },
  },
  {
    id: "s6",
    name: "Swing + Multi-TF",
    strategyType: "trendFollowing" as StrategyType,
    enabled: true,
    parameters: '{"timeframes":["15m","1d"]}',
    riskSettings: {
      dailyLossLimitPct: 3,
      perTradeStopLossPct: 3,
      maxPositions: BigInt(2),
      positionSizePct: 10,
      drawdownProtectionPct: 15,
    },
  },
];

export default function Strategies() {
  const { data: strategiesData } = useStrategies();
  const strategies =
    strategiesData && strategiesData.length > 0
      ? strategiesData
      : MOCK_STRATEGIES;
  const [dailyLoss, setDailyLoss] = useState([2]);
  const [maxPositions, setMaxPositions] = useState([5]);
  const [drawdownLimit, setDrawdownLimit] = useState([10]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newStratName, setNewStratName] = useState("");
  const [newStratType, setNewStratType] = useState<string>("trendFollowing");

  return (
    <div
      className="px-4 lg:px-6 max-w-[1600px] mx-auto space-y-6"
      data-ocid="strategies.page"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-[#EAF0FF]">Strategy Engine</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              data-ocid="strategies.open_modal_button"
              className="gap-1.5 text-xs h-8"
              style={{ background: "#F2C94C", color: "#0B1424" }}
            >
              <Plus className="w-3.5 h-3.5" /> Add Strategy
            </Button>
          </DialogTrigger>
          <DialogContent
            data-ocid="strategies.dialog"
            style={{ background: "#111E33", border: "1px solid #24344F" }}
          >
            <DialogHeader>
              <DialogTitle className="text-[#EAF0FF]">
                Add New Strategy
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div>
                <Label className="text-[#9AA8C1] text-xs">Strategy Name</Label>
                <Input
                  data-ocid="strategies.input"
                  value={newStratName}
                  onChange={(e) => setNewStratName(e.target.value)}
                  placeholder="My EMA Strategy"
                  className="mt-1 bg-white/5 border-[#24344F] text-[#EAF0FF]"
                />
              </div>
              <div>
                <Label className="text-[#9AA8C1] text-xs">Strategy Type</Label>
                <Select value={newStratType} onValueChange={setNewStratType}>
                  <SelectTrigger
                    data-ocid="strategies.select"
                    className="mt-1 bg-white/5 border-[#24344F] text-[#EAF0FF]"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent
                    style={{
                      background: "#111E33",
                      border: "1px solid #24344F",
                    }}
                  >
                    {[
                      "trendFollowing",
                      "meanReversion",
                      "scalping",
                      "breakout",
                      "arbitrage",
                      "marketMaking",
                    ].map((t) => (
                      <SelectItem key={t} value={t} className="text-[#EAF0FF]">
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                data-ocid="strategies.cancel_button"
                variant="ghost"
                onClick={() => setDialogOpen(false)}
                className="text-[#9AA8C1]"
              >
                Cancel
              </Button>
              <Button
                data-ocid="strategies.submit_button"
                onClick={() => {
                  toast.success(`Strategy "${newStratName}" added`);
                  setDialogOpen(false);
                  setNewStratName("");
                }}
                style={{ background: "#F2C94C", color: "#0B1424" }}
              >
                Add Strategy
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Strategy Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {strategies.map((strat, i) => (
          <StrategyCard
            key={strat.id}
            strategy={strat}
            index={i + 1}
            onToggle={(id, enabled) => {
              toast.success(`${id} ${enabled ? "enabled" : "disabled"}`);
            }}
          />
        ))}
      </div>

      {/* Global Risk Management */}
      <div className="trading-card p-5" data-ocid="strategies.panel">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-4 h-4" style={{ color: "#F2C94C" }} />
          <h2 className="text-sm font-bold uppercase tracking-widest text-[#EAF0FF]">
            Global Risk Management
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="flex justify-between text-xs mb-2">
              <span className="text-[#9AA8C1]">Daily Loss Limit</span>
              <span className="font-bold" style={{ color: "#F2C94C" }}>
                {dailyLoss[0]}%
              </span>
            </div>
            <Slider
              data-ocid="strategies.toggle"
              min={0.5}
              max={10}
              step={0.5}
              value={dailyLoss}
              onValueChange={setDailyLoss}
              className="[&_[role=slider]]:bg-[#F2C94C] [&_[role=slider]]:border-[#F2C94C]"
            />
            <div className="flex justify-between text-[10px] text-[#9AA8C1] mt-1">
              <span>0.5%</span>
              <span>10%</span>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs mb-2">
              <span className="text-[#9AA8C1]">Max Open Positions</span>
              <span className="font-bold text-[#EAF0FF]">
                {maxPositions[0]}
              </span>
            </div>
            <Slider
              data-ocid="strategies.toggle"
              min={1}
              max={20}
              step={1}
              value={maxPositions}
              onValueChange={setMaxPositions}
              className="[&_[role=slider]]:bg-[#60AFFF] [&_[role=slider]]:border-[#60AFFF]"
            />
            <div className="flex justify-between text-[10px] text-[#9AA8C1] mt-1">
              <span>1</span>
              <span>20</span>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs mb-2">
              <span className="text-[#9AA8C1]">Drawdown Protection</span>
              <span className="font-bold" style={{ color: "#FF5A5F" }}>
                {drawdownLimit[0]}%
              </span>
            </div>
            <Slider
              data-ocid="strategies.toggle"
              min={5}
              max={30}
              step={1}
              value={drawdownLimit}
              onValueChange={setDrawdownLimit}
              className="[&_[role=slider]]:bg-[#FF5A5F] [&_[role=slider]]:border-[#FF5A5F]"
            />
            <div className="flex justify-between text-[10px] text-[#9AA8C1] mt-1">
              <span>5%</span>
              <span>30%</span>
            </div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t" style={{ borderColor: "#24344F" }}>
          <Button
            data-ocid="strategies.save_button"
            onClick={() => toast.success("Risk settings saved")}
            className="h-8 text-xs"
            style={{ background: "#F2C94C", color: "#0B1424" }}
          >
            Save Risk Settings
          </Button>
        </div>
      </div>
    </div>
  );
}
