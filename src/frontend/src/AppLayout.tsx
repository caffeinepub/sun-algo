import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, ChevronDown, HelpCircle, Menu, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import MarketModeSelector from "./components/MarketModeSelector";
import MarketStatusBar from "./components/MarketStatusBar";
import PriceTickerStrip from "./components/PriceTickerStrip";
import { MarketModeProvider } from "./contexts/MarketModeContext";
import { MarketStatusProvider } from "./contexts/MarketStatusContext";
import { useInternetIdentity } from "./hooks/useInternetIdentity";

const NAV_ITEMS = [
  { label: "DASHBOARD", to: "/dashboard" },
  { label: "ANALYTICS", to: "/analytics" },
  { label: "STRATEGIES", to: "/strategies" },
  { label: "PORTFOLIO", to: "/portfolio" },
  { label: "WATCHLIST", to: "/watchlist" },
  { label: "SCANNER", to: "/scanner" },
  { label: "ALERTS", to: "/alerts" },
  { label: "TELEGRAM", to: "/telegram" },
  { label: "REPORTS", to: "/reports" },
  { label: "AI BRAIN", to: "/ai-brain" },
  { label: "RISK", to: "/risk" },
  { label: "ORDERS", to: "/orders" },
  { label: "CHARTS", to: "/charts" },
  { label: "STRATEGY", to: "/strategy-builder" },
  { label: "COPY TRADE", to: "/copy-trading" },
  { label: "OPTIONS", to: "/options" },
  { label: "INSTRUMENTS", to: "/instruments" },
  { label: "GLOBAL MKTS", to: "/global-markets" },
  { label: "FUNDAMENTALS", to: "/fundamentals" },
  { label: "BROKER", to: "/broker" },
  { label: "ADMIN", to: "/admin" },
  { label: "HELP", to: "/help" },
];

export default function AppLayout() {
  const { identity, clear } = useInternetIdentity();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const userInitials = identity
    ? identity.getPrincipal().toString().slice(0, 2).toUpperCase()
    : "SA";

  const handleLogout = () => {
    clear();
    navigate("/login");
  };

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <MarketStatusProvider>
      <MarketModeProvider>
        <div
          className="min-h-screen flex flex-col"
          style={{
            background: "linear-gradient(135deg, #0B1424 0%, #0A1220 100%)",
          }}
        >
          {/* Header */}
          <header
            data-ocid="app.panel"
            className="fixed top-0 left-0 right-0 z-50 h-14"
            style={{ background: "#0C1A30", borderBottom: "1px solid #1E2C44" }}
          >
            <div className="flex items-center justify-between h-full px-4 lg:px-6">
              {/* Logo */}
              <Link
                to="/dashboard"
                className="flex items-center gap-2 flex-shrink-0"
                data-ocid="app.link"
              >
                <img
                  src="/assets/generated/sun-algo-logo-transparent.dim_200x200.png"
                  alt="Sun Algo"
                  className="h-8 w-8 object-contain"
                />
                <span
                  className="text-lg font-bold tracking-wide"
                  style={{ color: "#F2C94C" }}
                >
                  SUN ALGO
                </span>
              </Link>

              {/* Desktop Nav */}
              <nav className="hidden xl:flex items-center gap-0.5 overflow-x-auto flex-1 mx-4">
                {NAV_ITEMS.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    data-ocid={`nav.${item.label.toLowerCase().replace(/[^a-z0-9]/g, "_")}.link`}
                    className={({ isActive }) =>
                      `nav-link px-2.5 py-1 rounded text-[10px] whitespace-nowrap ${
                        isActive
                          ? "text-[#F2C94C] bg-white/5"
                          : "text-[#7A8BA5] hover:text-[#EAF0FF] hover:bg-white/5"
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              </nav>

              {/* Right side: Market Mode + User */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <MarketModeSelector />

                {/* Notifications */}
                <button
                  type="button"
                  className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors relative"
                  style={{ color: "#7A8BA5" }}
                  data-ocid="notifications.button"
                >
                  <Bell className="w-4 h-4" />
                  <span
                    className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full"
                    style={{ background: "#FF5A5F" }}
                  />
                </button>

                {/* Help shortcut */}
                <Link
                  to="/help"
                  className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors"
                  style={{ color: "#7A8BA5" }}
                  data-ocid="help.link"
                  title="Help & Documentation"
                >
                  <HelpCircle className="w-4 h-4" />
                </Link>

                {/* User dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="flex items-center gap-1.5 h-8 px-2 rounded-lg hover:bg-white/10 transition-colors"
                      data-ocid="user.button"
                    >
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold"
                        style={{ background: "#F2C94C22", color: "#F2C94C" }}
                      >
                        {userInitials}
                      </div>
                      <ChevronDown
                        className="w-3 h-3"
                        style={{ color: "#7A8BA5" }}
                      />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-48"
                    style={{
                      background: "#0C1A30",
                      border: "1px solid #1E2C44",
                    }}
                  >
                    <DropdownMenuItem
                      onClick={() => navigate("/profile")}
                      data-ocid="user.profile.link"
                      className="cursor-pointer"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => navigate("/broker")}
                      data-ocid="user.broker.link"
                      className="cursor-pointer"
                    >
                      Broker Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleLogout}
                      data-ocid="user.logout.button"
                      className="cursor-pointer text-red-400 focus:text-red-400"
                    >
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Mobile menu toggle */}
                <button
                  type="button"
                  className="xl:hidden w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors"
                  style={{ color: "#7A8BA5" }}
                  onClick={() => setMobileMenuOpen((v) => !v)}
                  data-ocid="mobile_menu.button"
                >
                  {mobileMenuOpen ? (
                    <X className="w-4 h-4" />
                  ) : (
                    <Menu className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </header>

          {/* Price Ticker Strip */}
          <div className="fixed top-14 left-0 right-0 z-40">
            <PriceTickerStrip />
          </div>

          {/* Mobile Menu Overlay */}
          {mobileMenuOpen && (
            <div
              className="fixed inset-0 z-[45] xl:hidden"
              style={{ background: "#0C1A30", top: "56px" }}
            >
              <div className="overflow-y-auto h-full pb-20">
                <nav className="flex flex-col p-4 gap-1">
                  {NAV_ITEMS.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      data-ocid={`mobile_nav.${item.label.toLowerCase().replace(/[^a-z0-9]/g, "_")}.link`}
                      className={({ isActive }) =>
                        `flex items-center px-4 py-3 rounded-lg text-sm font-semibold uppercase tracking-wider transition-colors ${
                          isActive
                            ? "text-[#F2C94C] bg-[#F2C94C11]"
                            : "text-[#7A8BA5] hover:text-[#EAF0FF] hover:bg-white/5"
                        }`
                      }
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </NavLink>
                  ))}
                </nav>
              </div>
            </div>
          )}

          {/* Main content area */}
          <main
            className="flex-1 pt-[88px] pb-14"
            style={{ minHeight: "100vh" }}
          >
            <Outlet />
          </main>

          {/* Bottom Market Status Bar */}
          <MarketStatusBar />
        </div>
      </MarketModeProvider>
    </MarketStatusProvider>
  );
}
