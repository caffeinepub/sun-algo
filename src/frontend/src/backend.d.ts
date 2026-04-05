import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Signal {
    id: UUID;
    timeframe: string;
    targetPrice: number;
    fundamentalScore: number;
    stopLoss: number;
    instrumentSymbol: string;
    timestamp: Time;
    entryPrice: number;
    technicalScore: number;
    aiReasoning?: AIReasoning;
    confidence: number;
    strategyName: string;
    signalType: SignalType;
}
export interface Instrument {
    name: string;
    exchange: string;
    symbol: string;
    assetClass: AssetClass;
}
export type Time = bigint;
export interface PsychologyFlags {
    winRateHighVolumeDays: number;
    overTradingDetected: boolean;
    avgTradesAfterLoss: number;
    fomoDetected: boolean;
    revengeTradingDetected: boolean;
}
export interface PortfolioGreeks {
    totalTheta: number;
    totalVega: number;
    totalGamma: number;
    totalDelta: number;
}
export interface MasterTrader {
    traderId: UUID;
    name: string;
    sharpeRatio: number;
    style: TradingStyle;
    monthlyFee: number;
    winRate: number;
    subscriberCount: bigint;
    maxDrawdown: number;
    totalReturnPct: number;
}
export interface WatchlistItem {
    addedAt: Time;
    instrumentSymbol: string;
}
export interface BacktestResult {
    bestMonth: number;
    worstMonth: number;
    totalTrades: bigint;
    sharpeRatio: number;
    winRate: number;
    maxDrawdown: number;
    totalReturnPct: number;
    profitFactor: number;
}
export interface MarketHalt {
    startedAt: Time;
    expiresAt: Time;
    market: string;
    reason: string;
}
export interface OptionPosition {
    id: UUID;
    iv: number;
    theta: number;
    strike: number;
    premium: number;
    userId: Principal;
    side: OptionSide;
    vega: number;
    underlying: string;
    gamma: number;
    optionType: OptionType;
    quantity: number;
    expiry: Time;
    delta: number;
}
export interface Trade {
    id: UUID;
    pnl: number;
    side: PositionSide;
    closedAt: Time;
    instrumentSymbol: string;
    quantity: number;
    entryPrice: number;
    exitPrice: number;
    strategyName: string;
    openedAt: Time;
}
export interface SavedStrategy {
    id: UUID;
    userId: Principal;
    name: string;
    backtestResults?: BacktestResult;
    blocks: string;
}
export interface Order {
    id: UUID;
    status: OrderStatus;
    brokerLatencyMs?: bigint;
    slippagePct?: number;
    userId: Principal;
    side: OrderSide;
    orderType: OrderType;
    filledAt?: Time;
    target?: number;
    stopLoss?: number;
    instrumentSymbol: string;
    placedAt: Time;
    quantity: number;
    limitPrice?: number;
    slippageRs?: number;
    condition?: string;
}
export interface AIReasoning {
    regime: string;
    overallScore: number;
    sentimentScore: number;
    fiiFlow: number;
    volumeRatio: number;
    riskWarning: string;
    lstmProbability: number;
    patternDetected: string;
    signalTier: SignalTier;
}
export interface MarketHoliday {
    date: string;
    name: string;
    market: string;
}
export interface RiskProfile {
    paperModeForced: boolean;
    monthlyDrawdownLimitPct: number;
    weeklyLossLimitPct: number;
    tradingLocked: boolean;
    consecutiveLosses: bigint;
    maxPositions: bigint;
    positionSizingMethod: PositionSizingMethod;
    dailyLossLimitPct: number;
    riskLevel: RiskLevel;
}
export interface AIModel {
    status: ModelStatus;
    lastTrained: Time;
    name: string;
    modelType: ModelType;
    modelId: UUID;
    accuracy: number;
}
export type UUID = string;
export interface DailyReport {
    bestTrade: number;
    worstTrade: number;
    totalTrades: bigint;
    dayPnl: number;
    date: string;
    losers: bigint;
    signalsAccuracy: number;
    winRate: number;
    winners: bigint;
}
export interface CopySubscription {
    maxCapital: number;
    masterId: UUID;
    copyCrypto: boolean;
    drawdownStopPct: number;
    copyRatioPct: number;
    copyEquity: boolean;
    copyFO: boolean;
    maxTradesPerDay: bigint;
}
export interface AlertChannel {
    smsEnabled: boolean;
    emailEnabled: boolean;
    telegramEnabled: boolean;
    telegramChatId: string;
    whatsappEnabled: boolean;
}
export interface StrategyConfig {
    id: UUID;
    riskSettings: {
        perTradeStopLossPct: number;
        positionSizePct: number;
        drawdownProtectionPct: number;
        maxPositions: bigint;
        dailyLossLimitPct: number;
    };
    name: string;
    parameters: string;
    enabled: boolean;
    strategyType: StrategyType;
}
export interface UserProfile {
    username: string;
    subscription: Variant_pro_free_elite;
    createdAt: Time;
    role: UserRole;
    email: string;
    kycStatus: Variant_verified_pending_rejected;
    twoFaEnabled: boolean;
    phone: string;
}
export enum AssetClass {
    etf = "etf",
    forex = "forex",
    crypto = "crypto",
    index = "index",
    equity = "equity",
    commodity = "commodity"
}
export enum ModelStatus {
    active = "active",
    disabled = "disabled",
    paused = "paused"
}
export enum ModelType {
    cnn = "cnn",
    regime = "regime",
    portfolio = "portfolio",
    lstm = "lstm",
    sentiment = "sentiment",
    anomaly = "anomaly"
}
export enum OptionSide {
    buy = "buy",
    sell = "sell"
}
export enum OptionType {
    put = "put",
    call = "call"
}
export enum OrderStatus {
    active = "active",
    cancelled = "cancelled",
    pending = "pending",
    filled = "filled",
    rejected = "rejected"
}
export enum OrderType {
    oco = "oco",
    scaleOut = "scaleOut",
    iceberg = "iceberg",
    cover = "cover",
    twap = "twap",
    vwap = "vwap",
    conditional = "conditional",
    scaleIn = "scaleIn",
    bracket = "bracket",
    smartEntry = "smartEntry"
}
export enum PositionSide {
    long_ = "long",
    short_ = "short"
}
export enum PositionSizingMethod {
    atr = "atr",
    volatility = "volatility",
    fixedPct = "fixedPct",
    kelly = "kelly"
}
export enum RiskLevel {
    conservative = "conservative",
    aggressive = "aggressive",
    moderate = "moderate"
}
export enum SignalTier {
    highConfidence = "highConfidence",
    premiumElite = "premiumElite",
    standard = "standard"
}
export enum SignalType {
    buy = "buy",
    strongBuy = "strongBuy",
    sell = "sell",
    neutral = "neutral",
    strongSell = "strongSell"
}
export enum StrategyType {
    scalping = "scalping",
    trendFollowing = "trendFollowing",
    arbitrage = "arbitrage",
    meanReversion = "meanReversion",
    breakout = "breakout",
    marketMaking = "marketMaking"
}
export enum TradingStyle {
    positional = "positional",
    swing = "swing",
    intraday = "intraday"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum Variant_pro_free_elite {
    pro = "pro",
    free = "free",
    elite = "elite"
}
export enum Variant_verified_pending_rejected {
    verified = "verified",
    pending = "pending",
    rejected = "rejected"
}
export interface backendInterface {
    addAIModel(name: string, accuracy: number, modelType: ModelType): Promise<UUID>;
    addBrokerConnection(brokerName: string, apiKeyMasked: string, isPaper: boolean): Promise<UUID>;
    addDailyReport(date: string, totalTrades: bigint, winners: bigint, losers: bigint, winRate: number, dayPnl: number, bestTrade: number, worstTrade: number, signalsAccuracy: number): Promise<void>;
    addInstrument(symbol: string, name: string, exchange: string, assetClass: AssetClass): Promise<void>;
    addOptionPosition(underlying: string, strike: number, expiry: Time, optionType: OptionType, side: OptionSide, quantity: number, premium: number, delta: number, gamma: number, theta: number, vega: number, iv: number): Promise<UUID>;
    addSignal(symbol: string, signalType: SignalType, confidence: number, entryPrice: number, targetPrice: number, stopLoss: number, strategyName: string, timeframe: string, technicalScore: number, fundamentalScore: number, aiReasoning: AIReasoning | null): Promise<UUID>;
    addStrategy(name: string, strategyType: StrategyType, parameters: string, riskSettings: {
        perTradeStopLossPct: number;
        positionSizePct: number;
        drawdownProtectionPct: number;
        maxPositions: bigint;
        dailyLossLimitPct: number;
    }): Promise<UUID>;
    addToWatchlist(instrumentSymbol: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    cancelOrder(orderId: UUID): Promise<void>;
    clearMarketHalt(market: string): Promise<void>;
    deleteStrategy(strategyId: UUID): Promise<void>;
    getAlertConfig(): Promise<AlertChannel | null>;
    getAllAIModels(): Promise<Array<AIModel>>;
    getAllMasterTraders(): Promise<Array<MasterTrader>>;
    getAllStrategies(): Promise<Array<StrategyConfig>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getInstrumentsByAssetClass(assetClass: AssetClass): Promise<Array<Instrument>>;
    getMarketHalt(market: string): Promise<MarketHalt | null>;
    getMarketHolidays(market: string): Promise<Array<MarketHoliday>>;
    getMyCopySubscriptions(): Promise<Array<CopySubscription>>;
    getMyDailyReports(): Promise<Array<DailyReport>>;
    getMyOptionPositions(): Promise<Array<OptionPosition>>;
    getMyOrders(): Promise<Array<Order>>;
    getMyPsychologyFlags(): Promise<PsychologyFlags | null>;
    getMySavedStrategies(): Promise<Array<SavedStrategy>>;
    getPerformanceMetrics(): Promise<{
        totalTrades: bigint;
        avgRR: number;
        totalPnl: number;
        winRate: number;
        maxDrawdown: number;
        profitFactor: number;
    }>;
    getPortfolioGreeks(): Promise<PortfolioGreeks>;
    getRiskProfile(): Promise<RiskProfile | null>;
    getSignals(): Promise<Array<Signal>>;
    getSignalsByInstrument(symbol: string): Promise<Array<Signal>>;
    getTrades(): Promise<Array<Trade>>;
    getUserOrders(user: Principal): Promise<Array<Order>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getUserPsychologyFlags(user: Principal): Promise<PsychologyFlags | null>;
    getUserRiskProfile(user: Principal): Promise<RiskProfile | null>;
    getWatchlist(): Promise<Array<WatchlistItem>>;
    isCallerAdmin(): Promise<boolean>;
    isMarketHalted(market: string): Promise<boolean>;
    isMarketHoliday(market: string, date: string): Promise<MarketHoliday | null>;
    loadStrategy(strategyId: UUID): Promise<SavedStrategy | null>;
    placeOrder(instrumentSymbol: string, orderType: OrderType, side: OrderSide, quantity: number, limitPrice: number | null, stopLoss: number | null, target: number | null, condition: string | null): Promise<UUID>;
    registerMasterTrader(name: string, style: TradingStyle, totalReturnPct: number, winRate: number, maxDrawdown: number, sharpeRatio: number, monthlyFee: number): Promise<UUID>;
    removeFromWatchlist(instrumentSymbol: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveStrategy(name: string, blocks: string, backtestResults: BacktestResult | null): Promise<UUID>;
    setMarketHalt(market: string, reason: string, durationMinutes: bigint): Promise<void>;
    subscribeToCopyTrading(masterId: UUID, copyRatioPct: number, maxCapital: number, maxTradesPerDay: bigint, drawdownStopPct: number, copyEquity: boolean, copyFO: boolean, copyCrypto: boolean): Promise<void>;
    unsubscribeFromCopyTrading(masterId: UUID): Promise<void>;
    updateAIModelStatus(modelId: UUID, status: ModelStatus): Promise<void>;
    updateAlertConfig(alertConfig: AlertChannel): Promise<void>;
    updatePsychologyFlags(flags: PsychologyFlags): Promise<void>;
    updateRiskProfile(profile: RiskProfile): Promise<void>;
    upsertMarketHolidays(market: string, year: string, holidays: Array<MarketHoliday>): Promise<void>;
}
