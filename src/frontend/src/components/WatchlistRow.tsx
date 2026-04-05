import { TrendingDown, TrendingUp, X } from "lucide-react";
import type { WatchlistItem } from "../backend.d";
import type { MarketPrice } from "../hooks/useMarketData";

interface WatchlistRowProps {
  item: WatchlistItem;
  price?: MarketPrice;
  index?: number;
  onRemove?: (symbol: string) => void;
}

export default function WatchlistRow({
  item,
  price,
  index = 1,
  onRemove,
}: WatchlistRowProps) {
  const isUp = (price?.changePct ?? 0) >= 0;

  return (
    <div
      data-ocid={`watchlist.item.${index}`}
      className="flex items-center justify-between py-2 px-2 rounded-lg hover:bg-white/5 transition-colors group"
      style={{ borderBottom: "1px solid #1E2C44" }}
    >
      <div className="flex items-center gap-2 min-w-0">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold flex-shrink-0"
          style={{ background: "#1A2A42", color: "#F2C94C" }}
        >
          {item.instrumentSymbol.slice(0, 2)}
        </div>
        <div className="min-w-0">
          <div className="text-xs font-bold text-[#EAF0FF] truncate">
            {item.instrumentSymbol}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        {price ? (
          <>
            <div className="text-right">
              <div className="text-xs font-bold tabular-nums text-[#EAF0FF]">
                {price.currency}
                {price.price.toLocaleString("en-IN", {
                  maximumFractionDigits: 2,
                })}
              </div>
              <div
                className="text-[10px] font-semibold flex items-center gap-0.5"
                style={{ color: isUp ? "#2ED47A" : "#FF5A5F" }}
              >
                {isUp ? (
                  <TrendingUp className="w-2.5 h-2.5" />
                ) : (
                  <TrendingDown className="w-2.5 h-2.5" />
                )}
                {isUp ? "+" : ""}
                {price.changePct.toFixed(2)}%
              </div>
            </div>
          </>
        ) : (
          <div className="text-xs text-[#9AA8C1]">--</div>
        )}
        {onRemove && (
          <button
            type="button"
            data-ocid={`watchlist.delete_button.${index}`}
            onClick={() => onRemove(item.instrumentSymbol)}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-red-500/20"
          >
            <X className="w-3 h-3 text-[#FF5A5F]" />
          </button>
        )}
      </div>
    </div>
  );
}
