import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart2, Loader2, Shield, TrendingUp, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const FEATURES = [
  {
    icon: <TrendingUp className="w-5 h-5" />,
    title: "AI-Powered Signals",
    desc: "Real-time buy/sell signals with 85%+ accuracy",
  },
  {
    icon: <Zap className="w-5 h-5" />,
    title: "Automated Trading",
    desc: "Fully automated execution with risk management",
  },
  {
    icon: <BarChart2 className="w-5 h-5" />,
    title: "15+ Markets",
    desc: "NSE, BSE, MCX, Crypto, Forex & more",
  },
  {
    icon: <Shield className="w-5 h-5" />,
    title: "Risk Protected",
    desc: "Capital preservation with daily loss limits",
  },
];

export default function Login() {
  const { login, isLoggingIn, isLoginSuccess, identity } =
    useInternetIdentity();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (isLoginSuccess && identity) {
      navigate("/dashboard");
    }
  }, [isLoginSuccess, identity, navigate]);

  return (
    <div
      className="min-h-screen flex"
      style={{
        background: "linear-gradient(135deg, #0B1424 0%, #0A1220 100%)",
      }}
    >
      {/* Left: Feature Panel */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12"
        style={{ borderRight: "1px solid #1E2C44" }}
      >
        <div className="flex items-center gap-3 mb-8">
          <img
            src="/assets/generated/sun-algo-logo-transparent.dim_200x200.png"
            alt="Sun Algo"
            className="w-12 h-12 object-contain"
          />
          <div>
            <div className="text-2xl font-bold" style={{ color: "#F2C94C" }}>
              SUN ALGO
            </div>
            <div className="text-xs text-[#9AA8C1]">
              Professional Trading Platform
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-[#EAF0FF] leading-tight mb-3">
          Trade Smarter with{" "}
          <span style={{ color: "#F2C94C" }}>AI-Powered</span> Analytics
        </h1>
        <p className="text-sm text-[#9AA8C1] mb-8">
          Automated strategies for Indian and international markets with
          capital-preserving risk management.
        </p>

        <div className="space-y-4">
          {FEATURES.map((feat) => (
            <div key={feat.title} className="flex items-start gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(242,201,76,0.1)", color: "#F2C94C" }}
              >
                {feat.icon}
              </div>
              <div>
                <div className="text-sm font-semibold text-[#EAF0FF]">
                  {feat.title}
                </div>
                <div className="text-xs text-[#9AA8C1]">{feat.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Mini stats */}
        <div className="flex gap-6 mt-10">
          {[
            { label: "Active Traders", value: "10K+" },
            { label: "Signals/Day", value: "200+" },
            { label: "Avg Win Rate", value: "71%" },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-xl font-bold" style={{ color: "#F2C94C" }}>
                {stat.value}
              </div>
              <div className="text-[10px] text-[#9AA8C1]">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Login Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          {/* Mobile Logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <img
              src="/assets/generated/sun-algo-logo-transparent.dim_200x200.png"
              alt="Sun Algo"
              className="w-10 h-10 object-contain"
            />
            <span className="text-xl font-bold" style={{ color: "#F2C94C" }}>
              SUN ALGO
            </span>
          </div>

          <div
            className="rounded-2xl p-6"
            style={{ background: "#111E33", border: "1px solid #24344F" }}
          >
            <Tabs defaultValue="login">
              <TabsList
                className="w-full mb-5 h-9"
                style={{ background: "rgba(255,255,255,0.05)" }}
              >
                <TabsTrigger
                  value="login"
                  data-ocid="login.tab"
                  className="flex-1 text-xs data-[state=active]:bg-[#F2C94C] data-[state=active]:text-[#0B1424]"
                >
                  Sign In
                </TabsTrigger>
                <TabsTrigger
                  value="register"
                  data-ocid="login.tab"
                  className="flex-1 text-xs data-[state=active]:bg-[#F2C94C] data-[state=active]:text-[#0B1424]"
                >
                  Register
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4">
                <div>
                  <Label className="text-xs text-[#9AA8C1]">
                    Email Address
                  </Label>
                  <Input
                    data-ocid="login.input"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="trader@example.com"
                    className="mt-1 bg-white/5 border-[#24344F] text-[#EAF0FF] placeholder:text-[#9AA8C1]"
                  />
                </div>
                <div>
                  <Label className="text-xs text-[#9AA8C1]">Password</Label>
                  <Input
                    data-ocid="login.input"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="mt-1 bg-white/5 border-[#24344F] text-[#EAF0FF]"
                    onKeyDown={(e) => e.key === "Enter" && login()}
                  />
                </div>
                <Button
                  data-ocid="login.submit_button"
                  className="w-full h-9 text-sm font-semibold"
                  style={{ background: "#F2C94C", color: "#0B1424" }}
                  onClick={() => navigate("/dashboard")}
                >
                  Sign In
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span
                      className="w-full border-t"
                      style={{ borderColor: "#24344F" }}
                    />
                  </div>
                  <div className="relative flex justify-center text-[10px] text-[#9AA8C1] uppercase">
                    <span className="px-2" style={{ background: "#111E33" }}>
                      or continue with
                    </span>
                  </div>
                </div>

                <Button
                  data-ocid="login.primary_button"
                  variant="outline"
                  className="w-full h-9 text-xs gap-2 border-[#24344F] bg-transparent text-[#EAF0FF] hover:bg-white/5"
                  onClick={login}
                  disabled={isLoggingIn}
                >
                  {isLoggingIn ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Shield className="w-4 h-4" style={{ color: "#F2C94C" }} />
                  )}
                  {isLoggingIn
                    ? "Authenticating..."
                    : "Continue with Internet Identity"}
                </Button>
              </TabsContent>

              <TabsContent value="register" className="space-y-4">
                <div>
                  <Label className="text-xs text-[#9AA8C1]">Full Name</Label>
                  <Input
                    placeholder="Rajesh Kumar"
                    className="mt-1 bg-white/5 border-[#24344F] text-[#EAF0FF] placeholder:text-[#9AA8C1]"
                    data-ocid="login.input"
                  />
                </div>
                <div>
                  <Label className="text-xs text-[#9AA8C1]">
                    Email Address
                  </Label>
                  <Input
                    type="email"
                    placeholder="trader@example.com"
                    className="mt-1 bg-white/5 border-[#24344F] text-[#EAF0FF] placeholder:text-[#9AA8C1]"
                    data-ocid="login.input"
                  />
                </div>
                <div>
                  <Label className="text-xs text-[#9AA8C1]">Phone Number</Label>
                  <Input
                    placeholder="+91 98765 43210"
                    className="mt-1 bg-white/5 border-[#24344F] text-[#EAF0FF] placeholder:text-[#9AA8C1]"
                    data-ocid="login.input"
                  />
                </div>
                <Button
                  data-ocid="login.submit_button"
                  className="w-full h-9 text-sm font-semibold"
                  style={{ background: "#F2C94C", color: "#0B1424" }}
                  onClick={login}
                  disabled={isLoggingIn}
                >
                  {isLoggingIn ? "Creating Account..." : "Create Account"}
                </Button>
              </TabsContent>
            </Tabs>

            <p className="text-center text-[10px] text-[#9AA8C1] mt-4">
              By continuing, you agree to our{" "}
              <button
                type="button"
                className="underline hover:text-white bg-transparent border-0 p-0 cursor-pointer text-[#9AA8C1] hover:text-white"
              >
                Terms of Service
              </button>{" "}
              and{" "}
              <button
                type="button"
                className="underline hover:text-white bg-transparent border-0 p-0 cursor-pointer text-[#9AA8C1] hover:text-white"
              >
                Privacy Policy
              </button>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
