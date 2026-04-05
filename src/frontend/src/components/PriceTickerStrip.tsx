import { useMarketModeContext } from "../contexts/MarketModeContext";
import { useMarketStatusContext } from "../contexts/MarketStatusContext";
import { useMarketData } from "../hooks/useMarketData";

export default function PriceTickerStrip() {
  const { prices } = useMarketData();
  const { isNSEOpen, dominantStatus, getMarketById } = useMarketStatusContext();
  const { marketMode } = useMarketModeContext();

  const isTicking = (() => {
    if (marketMode === "forex_crypto") return true;
    if (marketMode === "global") {
      const nyse = getMarketById("NYSE");
      return nyse?.isOpen ?? false;
    }
    return isNSEOpen || dominantStatus === "PRE_OPEN";
  })();

  const showClosedLabel = !isTicking && marketMode !== "forex_crypto";

  const tickerItems = prices.map((p) => {
    const isUp = p.changePct >= 0;
    const formatted =
      p.price > 1000
        ? p.price.toLocaleString("en-IN", { maximumFractionDigits: 2 })
        : p.price.toFixed(p.price < 10 ? 4 : 2);
    return {
      ...p,
      formatted,
      isUp,
    };
  });

  // Duplicate for seamless loop
  const doubled = [...tickerItems, ...tickerItems];

  return (
    <div
      className="ticker-wrapper h-8 flex items-center"
      style={{
        background: "#0A162A",
        borderBottom: "1px solid #1E2C44",
      }}
    >
      {showClosedLabel && (
        <span
          className="text-[9px] text-[#6B7280] font-semibold px-2 flex-shrink-0 whitespace-nowrap"
          style={{ borderRight: "1px solid #1E2C44" }}
        >
          MARKET CLOSED
        </span>
      )}
      <div
        className={`ticker-content${!isTicking ? " opacity-50" : ""}`}
        style={{ animationPlayState: isTicking ? "running" : "paused" }}
      >
        {doubled.map((item, i) => (
          <span
            key={`${item.symbol}-${i}`}
            className="inline-flex items-center gap-1.5 px-4 tabular-nums text-[11px]"
            style={{ borderRight: "1px solid #1E2C44" }}
          >
            <span className="font-semibold" style={{ color: "#9AA8C1" }}>
              {item.name}
            </span>
            <span className="font-bold" style={{ color: "#EAF0FF" }}>
              {item.currency}
              {item.formatted}
            </span>
            <span
              className="font-semibold"
              style={{ color: item.isUp ? "#2ED47A" : "#FF5A5F" }}
            >
              {item.isUp ? "+" : ""}
              {item.changePct.toFixed(2)}%
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
