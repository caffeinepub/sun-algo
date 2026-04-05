import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Bell, Mail, MessageSquare, Phone, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAlertConfig, useUpdateAlertConfig } from "../hooks/useQueries";

const RECENT_ALERTS = [
  {
    instrument: "RELIANCE",
    signal: "STRONG BUY",
    time: "10:32 AM",
    entry: 2850,
    target: 2950,
    sl: 2800,
    confidence: 87,
  },
  {
    instrument: "TCS",
    signal: "BUY",
    time: "10:45 AM",
    entry: 3945,
    target: 4080,
    sl: 3880,
    confidence: 74,
  },
  {
    instrument: "BANKNIFTY",
    signal: "SELL",
    time: "11:12 AM",
    entry: 52400,
    target: 51800,
    sl: 52800,
    confidence: 68,
  },
  {
    instrument: "GOLD",
    signal: "BUY",
    time: "11:28 AM",
    entry: 72450,
    target: 73200,
    sl: 71800,
    confidence: 76,
  },
  {
    instrument: "BTC/USD",
    signal: "NEUTRAL",
    time: "11:55 AM",
    entry: 67200,
    target: 68000,
    sl: 66500,
    confidence: 52,
  },
];

export default function Alerts() {
  const { data: alertConfig } = useAlertConfig();
  const updateConfig = useUpdateAlertConfig();

  const [emailEnabled, setEmailEnabled] = useState(
    alertConfig?.emailEnabled ?? true,
  );
  const [telegramEnabled, setTelegramEnabled] = useState(
    alertConfig?.telegramEnabled ?? false,
  );
  const [smsEnabled, setSmsEnabled] = useState(
    alertConfig?.smsEnabled ?? false,
  );
  const [whatsappEnabled, setWhatsappEnabled] = useState(
    alertConfig?.whatsappEnabled ?? false,
  );
  const [telegramChatId, setTelegramChatId] = useState(
    alertConfig?.telegramChatId ?? "",
  );

  const handleSave = () => {
    updateConfig.mutate(
      {
        emailEnabled,
        telegramEnabled,
        smsEnabled,
        whatsappEnabled,
        telegramChatId,
      },
      {
        onSuccess: () => toast.success("Alert settings saved"),
        onError: () => toast.error("Failed to save settings"),
      },
    );
  };

  const signalColor = (signal: string) => {
    if (signal.includes("STRONG BUY")) return "#2ED47A";
    if (signal.includes("BUY")) return "#2ED47A";
    if (signal.includes("STRONG SELL") || signal === "SELL") return "#FF5A5F";
    return "#E7D27C";
  };

  return (
    <div
      className="px-4 lg:px-6 max-w-[1600px] mx-auto space-y-6"
      data-ocid="alerts.page"
    >
      <h1 className="text-lg font-bold text-[#EAF0FF]">
        Alerts & Notifications
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Channel Config */}
        <div className="lg:col-span-1 space-y-4">
          <div className="trading-card p-4" data-ocid="alerts.panel">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#EAF0FF] mb-4">
              Alert Channels
            </h2>
            <div className="space-y-4">
              {/* Email */}
              <div
                className="flex items-center justify-between p-3 rounded-lg"
                style={{
                  background: emailEnabled
                    ? "rgba(46,212,122,0.07)"
                    : "rgba(255,255,255,0.03)",
                }}
              >
                <div className="flex items-center gap-2">
                  <Mail
                    className="w-4 h-4"
                    style={{ color: emailEnabled ? "#2ED47A" : "#9AA8C1" }}
                  />
                  <div>
                    <div className="text-xs font-semibold text-[#EAF0FF]">
                      Email Alerts
                    </div>
                    <div className="text-[10px] text-[#9AA8C1]">
                      HTML formatted signals
                    </div>
                  </div>
                </div>
                <Switch
                  data-ocid="alerts.switch"
                  checked={emailEnabled}
                  onCheckedChange={setEmailEnabled}
                  style={emailEnabled ? { background: "#2ED47A" } : {}}
                />
              </div>

              {/* Telegram */}
              <div className="space-y-2">
                <div
                  className="flex items-center justify-between p-3 rounded-lg"
                  style={{
                    background: telegramEnabled
                      ? "rgba(96,175,255,0.07)"
                      : "rgba(255,255,255,0.03)",
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Send
                      className="w-4 h-4"
                      style={{ color: telegramEnabled ? "#60AFFF" : "#9AA8C1" }}
                    />
                    <div>
                      <div className="text-xs font-semibold text-[#EAF0FF]">
                        Telegram Bot
                      </div>
                      <div className="text-[10px] text-[#9AA8C1]">
                        Real-time signal messages
                      </div>
                    </div>
                  </div>
                  <Switch
                    data-ocid="alerts.switch"
                    checked={telegramEnabled}
                    onCheckedChange={setTelegramEnabled}
                    style={telegramEnabled ? { background: "#60AFFF" } : {}}
                  />
                </div>
                {telegramEnabled && (
                  <div>
                    <Label className="text-[10px] text-[#9AA8C1] mb-1 block">
                      Telegram Chat ID
                    </Label>
                    <Input
                      data-ocid="alerts.input"
                      value={telegramChatId}
                      onChange={(e) => setTelegramChatId(e.target.value)}
                      placeholder="@your_channel or -100XXXXXXXX"
                      className="h-8 text-xs bg-white/5 border-[#24344F] text-[#EAF0FF] placeholder:text-[#9AA8C1]"
                    />
                  </div>
                )}
              </div>

              {/* SMS */}
              <div
                className="flex items-center justify-between p-3 rounded-lg"
                style={{
                  background: smsEnabled
                    ? "rgba(242,201,76,0.07)"
                    : "rgba(255,255,255,0.03)",
                }}
              >
                <div className="flex items-center gap-2">
                  <Phone
                    className="w-4 h-4"
                    style={{ color: smsEnabled ? "#F2C94C" : "#9AA8C1" }}
                  />
                  <div>
                    <div className="text-xs font-semibold text-[#EAF0FF]">
                      SMS Alerts
                    </div>
                    <div className="text-[10px] text-[#9AA8C1]">Via Twilio</div>
                  </div>
                </div>
                <Switch
                  data-ocid="alerts.switch"
                  checked={smsEnabled}
                  onCheckedChange={setSmsEnabled}
                  style={smsEnabled ? { background: "#F2C94C" } : {}}
                />
              </div>

              {/* WhatsApp */}
              <div
                className="flex items-center justify-between p-3 rounded-lg"
                style={{
                  background: whatsappEnabled
                    ? "rgba(46,212,122,0.07)"
                    : "rgba(255,255,255,0.03)",
                }}
              >
                <div className="flex items-center gap-2">
                  <MessageSquare
                    className="w-4 h-4"
                    style={{ color: whatsappEnabled ? "#2ED47A" : "#9AA8C1" }}
                  />
                  <div>
                    <div className="text-xs font-semibold text-[#EAF0FF]">
                      WhatsApp
                    </div>
                    <div className="text-[10px] text-[#9AA8C1]">
                      Via WATI API
                    </div>
                  </div>
                </div>
                <Switch
                  data-ocid="alerts.switch"
                  checked={whatsappEnabled}
                  onCheckedChange={setWhatsappEnabled}
                  style={whatsappEnabled ? { background: "#2ED47A" } : {}}
                />
              </div>
            </div>

            <Button
              data-ocid="alerts.save_button"
              onClick={handleSave}
              className="mt-4 w-full h-8 text-xs"
              style={{ background: "#F2C94C", color: "#0B1424" }}
            >
              Save Alert Settings
            </Button>
          </div>

          {/* Signal Preview */}
          <div className="trading-card p-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#EAF0FF] mb-3">
              Signal Preview
            </h2>
            <div
              className="rounded-xl p-3 text-xs font-mono space-y-1"
              style={{ background: "#0B1424", border: "1px solid #24344F" }}
            >
              <div className="font-bold" style={{ color: "#F2C94C" }}>
                🌞 SUN ALGO SIGNAL
              </div>
              <div className="text-[#9AA8C1]">------------------</div>
              <div className="text-[#EAF0FF]">📌 Instrument: RELIANCE NSE</div>
              <div style={{ color: "#2ED47A" }}>📈 Signal: STRONG BUY</div>
              <div className="text-[#EAF0FF]">💰 Entry: ₹2,850</div>
              <div style={{ color: "#2ED47A" }}>🎯 Target: ₹2,950 (3.5%)</div>
              <div style={{ color: "#FF5A5F" }}>
                🛡️ Stop Loss: ₹2,800 (1.75%)
              </div>
              <div className="text-[#9AA8C1]">⚡ Strategy: EMA + RSI</div>
              <div className="text-[#9AA8C1]">🕐 Time: 10:32 AM IST</div>
              <div style={{ color: "#F2C94C" }}>📊 Confidence: 87%</div>
            </div>
          </div>
        </div>

        {/* Right: Alert History */}
        <div
          className="lg:col-span-2 trading-card p-4"
          data-ocid="alerts.panel"
        >
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-4 h-4" style={{ color: "#F2C94C" }} />
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#EAF0FF]">
              Recent Alerts
            </h2>
          </div>
          <div className="space-y-3">
            {RECENT_ALERTS.map((alert, i) => (
              <div
                key={alert.instrument + alert.time}
                data-ocid={`alerts.item.${i + 1}`}
                className="p-3 rounded-xl"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid #24344F",
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                      style={{ background: "#1A2A42", color: "#F2C94C" }}
                    >
                      {alert.instrument.slice(0, 2)}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[#EAF0FF]">
                        {alert.instrument}
                      </div>
                      <div className="text-[10px] text-[#9AA8C1]">
                        {alert.time}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      className="text-[9px]"
                      style={{
                        background: `${signalColor(alert.signal)}22`,
                        color: signalColor(alert.signal),
                        border: `1px solid ${signalColor(alert.signal)}44`,
                      }}
                    >
                      {alert.signal}
                    </Badge>
                    <span
                      className="text-[10px] font-bold"
                      style={{ color: "#F2C94C" }}
                    >
                      {alert.confidence}%
                    </span>
                  </div>
                </div>
                <div
                  className="grid grid-cols-3 gap-2 mt-2 pt-2"
                  style={{ borderTop: "1px solid #1E2C44" }}
                >
                  <div>
                    <div className="text-[9px] text-[#9AA8C1]">Entry</div>
                    <div className="text-xs font-semibold text-[#EAF0FF] tabular-nums">
                      ₹{alert.entry.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-[9px] text-[#9AA8C1]">Target</div>
                    <div
                      className="text-xs font-semibold tabular-nums"
                      style={{ color: "#2ED47A" }}
                    >
                      ₹{alert.target.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-[9px] text-[#9AA8C1]">Stop Loss</div>
                    <div
                      className="text-xs font-semibold tabular-nums"
                      style={{ color: "#FF5A5F" }}
                    >
                      ₹{alert.sl.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
