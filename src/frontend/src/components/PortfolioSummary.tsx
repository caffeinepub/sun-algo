interface PortfolioSummaryProps {
  totalCapital?: number;
  availableCapital?: number;
  dayPnl?: number;
  dayPnlPct?: number;
  openPositions?: number;
  winRate?: number;
}

export default function PortfolioSummary({
  totalCapital = 1000000,
  availableCapital = 847320,
  dayPnl = 12450,
  dayPnlPct = 1.31,
  openPositions = 3,
  winRate = 68,
}: PortfolioSummaryProps) {
  const isPnlUp = dayPnl >= 0;
  const usedCapitalPct =
    ((totalCapital - availableCapital) / totalCapital) * 100;

  return (
    <div data-ocid="portfolio.panel">
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="bg-white/5 rounded-xl p-3">
          <div className="text-[10px] text-[#9AA8C1] uppercase tracking-wider mb-1">
            Total Capital
          </div>
          <div
            className="text-lg font-bold tabular-nums"
            style={{ color: "#F2C94C" }}
          >
            ₹10,00,000
          </div>
        </div>
        <div className="bg-white/5 rounded-xl p-3">
          <div className="text-[10px] text-[#9AA8C1] uppercase tracking-wider mb-1">
            Available
          </div>
          <div className="text-lg font-bold tabular-nums text-[#EAF0FF]">
            ₹{availableCapital.toLocaleString("en-IN")}
          </div>
        </div>
      </div>

      <div
        className="rounded-xl p-3 mb-3"
        style={{
          background: isPnlUp
            ? "rgba(46,212,122,0.08)"
            : "rgba(255,90,95,0.08)",
          border: `1px solid ${isPnlUp ? "#2ED47A44" : "#FF5A5F44"}`,
        }}
      >
        <div className="text-[10px] text-[#9AA8C1] uppercase tracking-wider mb-1">
          Day P&L
        </div>
        <div
          className="text-2xl font-bold tabular-nums"
          style={{ color: isPnlUp ? "#2ED47A" : "#FF5A5F" }}
        >
          {isPnlUp ? "+" : ""}₹{Math.abs(dayPnl).toLocaleString("en-IN")}
        </div>
        <div
          className="text-xs mt-0.5"
          style={{ color: isPnlUp ? "#2ED47A" : "#FF5A5F" }}
        >
          {isPnlUp ? "+" : ""}
          {dayPnlPct.toFixed(2)}% today
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="bg-white/5 rounded-xl p-3 text-center">
          <div className="text-xl font-bold text-[#EAF0FF]">
            {openPositions}
          </div>
          <div className="text-[10px] text-[#9AA8C1]">Open Positions</div>
        </div>
        <div className="bg-white/5 rounded-xl p-3 text-center">
          <div className="text-xl font-bold" style={{ color: "#2ED47A" }}>
            {winRate}%
          </div>
          <div className="text-[10px] text-[#9AA8C1]">Win Rate</div>
        </div>
      </div>

      {/* Capital Usage Bar */}
      <div>
        <div className="flex justify-between text-[10px] text-[#9AA8C1] mb-1">
          <span>Capital Used</span>
          <span>{usedCapitalPct.toFixed(1)}%</span>
        </div>
        <div
          className="h-1.5 rounded-full overflow-hidden"
          style={{ background: "#24344F" }}
        >
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${usedCapitalPct}%`,
              background: "linear-gradient(90deg, #F2C94C, #E5B93A)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
