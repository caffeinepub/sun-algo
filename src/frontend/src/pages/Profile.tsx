import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  AlertTriangle,
  Check,
  CreditCard,
  Shield,
  Upload,
  User,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  UserRole,
  type Variant_pro_free_elite,
  Variant_verified_pending_rejected,
} from "../backend.d";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useSaveUserProfile, useUserProfile } from "../hooks/useQueries";

const PLAN_FEATURES: Record<
  string,
  { label: string; color: string; features: string[]; price: string }
> = {
  free: {
    label: "Free",
    color: "#9AA8C1",
    price: "₹0/mo",
    features: [
      "5 instruments",
      "End-of-day signals",
      "Paper trading",
      "Basic analytics",
    ],
  },
  pro: {
    label: "Pro",
    color: "#F2C94C",
    price: "₹999/mo",
    features: [
      "50 instruments",
      "Real-time signals",
      "Live trading",
      "All strategies",
      "Email alerts",
    ],
  },
  elite: {
    label: "Elite",
    color: "#2ED47A",
    price: "₹2,499/mo",
    features: [
      "Unlimited instruments",
      "Priority signals",
      "All brokers",
      "Telegram alerts",
      "Priority support",
      "Custom strategies",
    ],
  },
};

export default function Profile() {
  const { identity } = useInternetIdentity();
  const { data: profile } = useUserProfile();
  const saveProfile = useSaveUserProfile();

  const [name, setName] = useState(profile?.username ?? "Rajesh Kumar");
  const [email, setEmail] = useState(profile?.email ?? "rajesh@example.com");
  const [phone, setPhone] = useState(profile?.phone ?? "+91 98765 43210");
  const [twoFa, setTwoFa] = useState(profile?.twoFaEnabled ?? false);
  const [currentPlan] = useState<string>(profile?.subscription ?? "pro");
  const [kycStatus] = useState(
    profile?.kycStatus ?? Variant_verified_pending_rejected.pending,
  );

  const handleSave = () => {
    if (!profile) {
      toast.error("Profile not loaded");
      return;
    }
    saveProfile.mutate(
      {
        ...profile,
        username: name,
        email,
        phone,
        twoFaEnabled: twoFa,
        subscription: currentPlan as Variant_pro_free_elite,
        role: profile.role ?? UserRole.user,
        kycStatus:
          profile.kycStatus ?? Variant_verified_pending_rejected.pending,
        createdAt: profile.createdAt ?? BigInt(Date.now()),
      },
      {
        onSuccess: () => toast.success("Profile saved successfully"),
        onError: () => toast.error("Failed to save profile"),
      },
    );
  };

  const principalStr = identity?.getPrincipal().toString() ?? "Not connected";

  return (
    <div
      className="px-4 lg:px-6 max-w-[900px] mx-auto space-y-6"
      data-ocid="profile.page"
    >
      <h1 className="text-lg font-bold text-[#EAF0FF]">My Profile</h1>

      {/* Profile Edit */}
      <div className="trading-card p-5" data-ocid="profile.panel">
        <div className="flex items-center gap-2 mb-4">
          <User className="w-4 h-4" style={{ color: "#F2C94C" }} />
          <h2 className="text-sm font-bold text-[#EAF0FF]">
            Account Information
          </h2>
        </div>
        <div className="flex items-center gap-4 mb-5">
          <div
            className="w-16 h-16 rounded-xl flex items-center justify-center text-xl font-bold"
            style={{
              background: "linear-gradient(135deg, #F2C94C, #E5B93A)",
              color: "#0B1424",
            }}
          >
            {name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)}
          </div>
          <div>
            <div className="text-sm font-bold text-[#EAF0FF]">{name}</div>
            <div className="text-xs text-[#9AA8C1] font-mono mt-0.5">
              {principalStr.slice(0, 30)}...
            </div>
            <Badge
              className="mt-1 text-[9px]"
              style={{
                background: "rgba(242,201,76,0.1)",
                color: "#F2C94C",
                border: "1px solid #F2C94C44",
              }}
            >
              {currentPlan.toUpperCase()}
            </Badge>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-[#9AA8C1] text-xs">Full Name</Label>
            <Input
              data-ocid="profile.input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 bg-white/5 border-[#24344F] text-[#EAF0FF]"
            />
          </div>
          <div>
            <Label className="text-[#9AA8C1] text-xs">Email Address</Label>
            <Input
              data-ocid="profile.input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 bg-white/5 border-[#24344F] text-[#EAF0FF]"
            />
          </div>
          <div>
            <Label className="text-[#9AA8C1] text-xs">Phone Number</Label>
            <Input
              data-ocid="profile.input"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1 bg-white/5 border-[#24344F] text-[#EAF0FF]"
            />
          </div>
        </div>
        <div
          className="flex items-center justify-between mt-4 pt-4"
          style={{ borderTop: "1px solid #24344F" }}
        >
          <div className="flex items-center gap-3">
            <Shield
              className="w-4 h-4"
              style={{ color: twoFa ? "#2ED47A" : "#9AA8C1" }}
            />
            <div>
              <div className="text-xs font-semibold text-[#EAF0FF]">
                Two-Factor Authentication
              </div>
              <div className="text-[10px] text-[#9AA8C1]">
                Add extra layer of security
              </div>
            </div>
          </div>
          <Switch
            data-ocid="profile.switch"
            checked={twoFa}
            onCheckedChange={setTwoFa}
            style={twoFa ? { background: "#2ED47A" } : {}}
          />
        </div>
        <Button
          data-ocid="profile.save_button"
          onClick={handleSave}
          disabled={saveProfile.isPending}
          className="mt-4 h-8 text-xs"
          style={{ background: "#F2C94C", color: "#0B1424" }}
        >
          {saveProfile.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      {/* Subscription Plans */}
      <div className="trading-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <CreditCard className="w-4 h-4" style={{ color: "#F2C94C" }} />
          <h2 className="text-sm font-bold text-[#EAF0FF]">
            Subscription Plans
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {Object.entries(PLAN_FEATURES).map(([planKey, plan]) => (
            <div
              key={planKey}
              data-ocid={`profile.item.${planKey}`}
              className="rounded-xl p-4"
              style={{
                background:
                  currentPlan === planKey
                    ? `${plan.color}11`
                    : "rgba(255,255,255,0.03)",
                border:
                  currentPlan === planKey
                    ? `1px solid ${plan.color}44`
                    : "1px solid #24344F",
              }}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div
                    className="font-bold text-sm"
                    style={{ color: plan.color }}
                  >
                    {plan.label}
                  </div>
                  <div className="text-lg font-bold text-[#EAF0FF]">
                    {plan.price}
                  </div>
                </div>
                {currentPlan === planKey && (
                  <Badge
                    className="text-[9px]"
                    style={{ background: `${plan.color}22`, color: plan.color }}
                  >
                    Current
                  </Badge>
                )}
              </div>
              <ul className="space-y-1 mb-3">
                {plan.features.map((feat) => (
                  <li
                    key={feat}
                    className="flex items-center gap-1.5 text-[11px] text-[#9AA8C1]"
                  >
                    <Check
                      className="w-2.5 h-2.5 flex-shrink-0"
                      style={{ color: plan.color }}
                    />
                    {feat}
                  </li>
                ))}
              </ul>
              {currentPlan !== planKey && (
                <Button
                  data-ocid="profile.primary_button"
                  onClick={() =>
                    toast.success(`Upgrade to ${plan.label} coming soon`)
                  }
                  className="w-full h-7 text-xs"
                  style={{ background: plan.color, color: "#0B1424" }}
                >
                  Upgrade to {plan.label}
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* KYC Section */}
      <div className="trading-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4" style={{ color: "#F2C94C" }} />
            <h2 className="text-sm font-bold text-[#EAF0FF]">
              KYC Verification
            </h2>
          </div>
          <Badge
            className="text-[10px]"
            style={{
              background:
                kycStatus === "verified"
                  ? "rgba(46,212,122,0.1)"
                  : kycStatus === "pending"
                    ? "rgba(231,210,124,0.1)"
                    : "rgba(255,90,95,0.1)",
              color:
                kycStatus === "verified"
                  ? "#2ED47A"
                  : kycStatus === "pending"
                    ? "#E7D27C"
                    : "#FF5A5F",
            }}
          >
            {kycStatus.toUpperCase()}
          </Badge>
        </div>
        <p className="text-xs text-[#9AA8C1] mb-4">
          Upload your government-issued ID for verification. Required for live
          trading.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button
            type="button"
            data-ocid="profile.upload_button"
            className="border-2 border-dashed rounded-xl p-6 text-center hover:border-[#F2C94C]/50 transition-colors"
            style={{ borderColor: "#24344F" }}
            onClick={() => toast.info("Document upload coming soon")}
          >
            <Upload className="w-6 h-6 mx-auto mb-2 text-[#9AA8C1]" />
            <div className="text-xs font-semibold text-[#EAF0FF]">
              Government ID
            </div>
            <div className="text-[10px] text-[#9AA8C1] mt-0.5">
              Aadhaar / PAN / Passport
            </div>
          </button>
          <button
            type="button"
            data-ocid="profile.upload_button"
            className="border-2 border-dashed rounded-xl p-6 text-center hover:border-[#F2C94C]/50 transition-colors"
            style={{ borderColor: "#24344F" }}
            onClick={() => toast.info("Photo upload coming soon")}
          >
            <Upload className="w-6 h-6 mx-auto mb-2 text-[#9AA8C1]" />
            <div className="text-xs font-semibold text-[#EAF0FF]">
              Profile Photo
            </div>
            <div className="text-[10px] text-[#9AA8C1] mt-0.5">
              Clear face photo
            </div>
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div
        className="trading-card p-5"
        style={{ border: "1px solid #FF5A5F33" }}
      >
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="w-4 h-4" style={{ color: "#FF5A5F" }} />
          <h2 className="text-sm font-bold" style={{ color: "#FF5A5F" }}>
            Danger Zone
          </h2>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-[#EAF0FF]">
              Reset Paper Trading Account
            </div>
            <div className="text-[10px] text-[#9AA8C1]">
              Reset virtual capital to ₹10,00,000. All trades and P&L will be
              cleared.
            </div>
          </div>
          <Button
            data-ocid="profile.delete_button"
            variant="outline"
            onClick={() => toast.success("Paper account reset successfully")}
            className="h-8 text-xs border-[#FF5A5F] text-[#FF5A5F] hover:bg-[#FF5A5F]/10"
          >
            Reset Account
          </Button>
        </div>
      </div>
    </div>
  );
}
