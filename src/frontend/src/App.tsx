import { Toaster } from "@/components/ui/sonner";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./AppLayout";
import AIBrain from "./pages/AIBrain";
import Admin from "./pages/Admin";
import AdvancedCharts from "./pages/AdvancedCharts";
import Alerts from "./pages/Alerts";
import Analytics from "./pages/Analytics";
import Broker from "./pages/Broker";
import CopyTrading from "./pages/CopyTrading";
import Dashboard from "./pages/Dashboard";
import Fundamentals from "./pages/Fundamentals";
import GlobalMarkets from "./pages/GlobalMarkets";
import Help from "./pages/Help";
import InstrumentMapping from "./pages/InstrumentMapping";
import Login from "./pages/Login";
import OptionsIntelligence from "./pages/OptionsIntelligence";
import OrderExecution from "./pages/OrderExecution";
import Portfolio from "./pages/Portfolio";
import Profile from "./pages/Profile";
import Reports from "./pages/Reports";
import RiskManagement from "./pages/RiskManagement";
import Scanner from "./pages/Scanner";
import Strategies from "./pages/Strategies";
import StrategyBuilder from "./pages/StrategyBuilder";
import Telegram from "./pages/Telegram";
import Watchlist from "./pages/Watchlist";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="strategies" element={<Strategies />} />
          <Route path="portfolio" element={<Portfolio />} />
          <Route path="watchlist" element={<Watchlist />} />
          <Route path="scanner" element={<Scanner />} />
          <Route path="alerts" element={<Alerts />} />
          <Route path="telegram" element={<Telegram />} />
          <Route path="reports" element={<Reports />} />
          <Route path="broker" element={<Broker />} />
          <Route path="admin" element={<Admin />} />
          <Route path="profile" element={<Profile />} />
          <Route path="ai-brain" element={<AIBrain />} />
          <Route path="risk" element={<RiskManagement />} />
          <Route path="orders" element={<OrderExecution />} />
          <Route path="charts" element={<AdvancedCharts />} />
          <Route path="strategy-builder" element={<StrategyBuilder />} />
          <Route path="copy-trading" element={<CopyTrading />} />
          <Route path="options" element={<OptionsIntelligence />} />
          <Route path="instruments" element={<InstrumentMapping />} />
          <Route path="global-markets" element={<GlobalMarkets />} />
          <Route path="fundamentals" element={<Fundamentals />} />
          <Route path="help" element={<Help />} />
        </Route>
      </Routes>
      <Toaster position="bottom-right" theme="dark" />
    </BrowserRouter>
  );
}
