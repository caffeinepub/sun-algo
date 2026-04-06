# Sun Algo

## Current State
Full-stack trading platform with 20+ pages. The app has these specific issues reported by user:
1. "Cannot click any stock" — the market dimming CSS applies `grayscale(60%) brightness(0.55)` to all `.market-dim-card` elements when NSE is CLOSED (which is most of the day), making the UI look greyed-out and uninteractive visually, even though pointer-events are not disabled
2. Signal cards use `₹` currency symbol even for Forex/Crypto symbols like BTC/USD, ETH/USD, EURUSD
3. No click-through interaction when clicking a stock row or signal card — no detail panel/modal opens
4. Analysis on signal cards is superficial — only shows Entry/Target/SL without technical indicators, RSI, trend strength, volume context
5. Market dimming is too aggressive — brightness 0.55 and grayscale 60% makes the entire dashboard look dead outside 9:15-15:30 IST window

## Requested Changes (Diff)

### Add
- `StockDetailModal` component: A slide-in sheet/drawer that opens when clicking any watchlist row or signal card. Shows: price chart (mini candlestick), key technical indicators (RSI, MACD signal, EMA trend), support/resistance levels, volume analysis, AI confidence breakdown, and quick BUY/SELL buttons
- `TechnicalBadge` component: Small inline badge showing RSI value with color-coded overbought/oversold, MACD direction arrow, trend strength bar
- Enhanced `SignalCard`: Add RSI, MACD, volume bar, and risk/reward ratio to the card content
- `useStockAnalysis` hook: Computes simulated technical analysis values (RSI 14, MACD line/signal, EMA trend, volume vs avg, support/resistance) based on price history

### Modify
- `index.css`: Change `.market-closed .market-dim-card` from `grayscale(60%) brightness(0.55)` to `brightness(0.92)` (virtually no dimming — market status is shown via the bottom status bar, not by killing the UI). Remove grayscale from all states. Only HOLIDAY state gets slight dim.
- `WatchlistRow`: Make entire row clickable (cursor pointer, onClick opens StockDetailModal). Show mini sparkline trend arrow. Show RSI value inline.
- `SignalCard`: Fix currency display — detect symbol type to use correct currency ($ for BTC/USD, ETH/USD, EURUSD, AAPL etc). Add RSI value, R:R ratio, volume context line
- `useMarketData`: Add per-asset-class volatility (crypto 2x, forex 0.1x, indices 0.3x, equities 0.5x) instead of flat 0.6% for all. Ensure Forex/Crypto always ticks.
- `Dashboard`: Make signal cards and watchlist rows open StockDetailModal on click
- `Watchlist` page: Make table rows clickable, open StockDetailModal. Fix currency display for non-INR symbols.

### Remove
- Heavy grayscale filters on market-dim-card for CLOSED/PRE_OPEN/CLOSING states

## Implementation Plan
1. Update `index.css` — remove destructive dimming filters, keep only subtle brightness reduction for HOLIDAY/HALTED states
2. Create `useStockAnalysis` hook with RSI, MACD, EMA, volume, S/R calculations from candle data
3. Create `StockDetailModal` component (uses Sheet/Drawer) with mini chart, technical analysis panel, trade buttons
4. Update `SignalCard` — fix currency, add technical badges (RSI, MACD, R:R)
5. Update `WatchlistRow` — make clickable, add RSI badge, sparkline direction
6. Update `Dashboard` — wire click handlers to open StockDetailModal
7. Update `Watchlist` page — make rows clickable, fix currency display
8. Update `useMarketData` — per-asset-class volatility
