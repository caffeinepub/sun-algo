import Time "mo:core/Time";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Float "mo:core/Float";
import Iter "mo:core/Iter";
import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Blob "mo:core/Blob";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";



actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  // Core types
  type UUID = Text;

  type SignalType = {
    #strongBuy;
    #buy;
    #sell;
    #strongSell;
    #neutral;
  };

  type AssetClass = {
    #equity;
    #forex;
    #crypto;
    #commodity;
    #index;
    #etf;
  };

  type StrategyType = {
    #trendFollowing;
    #meanReversion;
    #breakout;
    #scalping;
    #arbitrage;
    #marketMaking;
  };

  type PositionSide = { #long; #short };

  type StrategyConfig = {
    id : UUID;
    name : Text;
    strategyType : StrategyType;
    enabled : Bool;
    parameters : Text;
    riskSettings : {
      dailyLossLimitPct : Float;
      perTradeStopLossPct : Float;
      maxPositions : Nat;
      positionSizePct : Float;
      drawdownProtectionPct : Float;
    };
  };

  type BrokerConnection = {
    id : UUID;
    brokerName : Text;
    apiKeyMasked : Text;
    isPaper : Bool;
    connected : Bool;
    status : Text;
  };

  type PaperAccount = {
    capital : Float;
    availableCapital : Float;
    positions : [UUID];
    closedTrades : [UUID];
  };

  type AlertChannel = {
    telegramEnabled : Bool;
    emailEnabled : Bool;
    smsEnabled : Bool;
    whatsappEnabled : Bool;
    telegramChatId : Text;
  };

  type Instrument = {
    symbol : Text;
    name : Text;
    exchange : Text;
    assetClass : AssetClass;
  };

  // NEW: AI Model types
  type ModelStatus = {
    #active;
    #paused;
    #disabled;
  };

  type ModelType = {
    #lstm;
    #cnn;
    #sentiment;
    #anomaly;
    #portfolio;
    #regime;
  };

  type AIModel = {
    modelId : UUID;
    name : Text;
    accuracy : Float;
    lastTrained : Time.Time;
    status : ModelStatus;
    modelType : ModelType;
  };

  // NEW: AI Signal with explainability
  type SignalTier = {
    #standard;
    #highConfidence;
    #premiumElite;
  };

  type AIReasoning = {
    lstmProbability : Float;
    patternDetected : Text;
    sentimentScore : Float;
    volumeRatio : Float;
    regime : Text;
    fiiFlow : Float;
    riskWarning : Text;
    overallScore : Float;
    signalTier : SignalTier;
  };

  type Signal = {
    id : UUID;
    instrumentSymbol : Text;
    signalType : SignalType;
    confidence : Float;
    entryPrice : Float;
    targetPrice : Float;
    stopLoss : Float;
    strategyName : Text;
    timeframe : Text;
    timestamp : Time.Time;
    technicalScore : Float;
    fundamentalScore : Float;
    aiReasoning : ?AIReasoning;
  };

  // NEW: Risk Profile types
  type PositionSizingMethod = {
    #fixedPct;
    #kelly;
    #atr;
    #volatility;
  };

  type RiskLevel = {
    #conservative;
    #moderate;
    #aggressive;
  };

  type RiskProfile = {
    dailyLossLimitPct : Float;
    weeklyLossLimitPct : Float;
    monthlyDrawdownLimitPct : Float;
    maxPositions : Nat;
    consecutiveLosses : Nat;
    positionSizingMethod : PositionSizingMethod;
    riskLevel : RiskLevel;
    tradingLocked : Bool;
    paperModeForced : Bool;
  };

  // NEW: Order types
  type OrderType = {
    #bracket;
    #cover;
    #iceberg;
    #twap;
    #vwap;
    #smartEntry;
    #scaleIn;
    #scaleOut;
    #oco;
    #conditional;
  };

  type OrderSide = {
    #buy;
    #sell;
  };

  type OrderStatus = {
    #pending;
    #active;
    #filled;
    #cancelled;
    #rejected;
  };

  type Order = {
    id : UUID;
    userId : Principal;
    instrumentSymbol : Text;
    orderType : OrderType;
    side : OrderSide;
    quantity : Float;
    limitPrice : ?Float;
    stopLoss : ?Float;
    target : ?Float;
    status : OrderStatus;
    placedAt : Time.Time;
    filledAt : ?Time.Time;
    slippageRs : ?Float;
    slippagePct : ?Float;
    brokerLatencyMs : ?Nat;
    condition : ?Text;
  };

  // NEW: Copy Trading types
  type TradingStyle = {
    #intraday;
    #swing;
    #positional;
  };

  type MasterTrader = {
    traderId : UUID;
    name : Text;
    style : TradingStyle;
    totalReturnPct : Float;
    winRate : Float;
    maxDrawdown : Float;
    sharpeRatio : Float;
    subscriberCount : Nat;
    monthlyFee : Float;
  };

  type CopySubscription = {
    masterId : UUID;
    copyRatioPct : Float;
    maxCapital : Float;
    maxTradesPerDay : Nat;
    drawdownStopPct : Float;
    copyEquity : Bool;
    copyFO : Bool;
    copyCrypto : Bool;
  };

  // NEW: Strategy Builder types
  type BacktestResult = {
    totalTrades : Nat;
    winRate : Float;
    totalReturnPct : Float;
    maxDrawdown : Float;
    sharpeRatio : Float;
    profitFactor : Float;
    bestMonth : Float;
    worstMonth : Float;
  };

  type SavedStrategy = {
    id : UUID;
    userId : Principal;
    name : Text;
    blocks : Text;
    backtestResults : ?BacktestResult;
  };

  // NEW: Options types
  type OptionType = {
    #call;
    #put;
  };

  type OptionSide = {
    #buy;
    #sell;
  };

  type OptionPosition = {
    id : UUID;
    userId : Principal;
    underlying : Text;
    strike : Float;
    expiry : Time.Time;
    optionType : OptionType;
    side : OptionSide;
    quantity : Float;
    premium : Float;
    delta : Float;
    gamma : Float;
    theta : Float;
    vega : Float;
    iv : Float;
  };

  type PortfolioGreeks = {
    totalDelta : Float;
    totalGamma : Float;
    totalTheta : Float;
    totalVega : Float;
  };

  // NEW: Performance Analytics types
  type DailyReport = {
    date : Text;
    totalTrades : Nat;
    winners : Nat;
    losers : Nat;
    winRate : Float;
    dayPnl : Float;
    bestTrade : Float;
    worstTrade : Float;
    signalsAccuracy : Float;
  };

  type PsychologyFlags = {
    revengeTradingDetected : Bool;
    overTradingDetected : Bool;
    fomoDetected : Bool;
    avgTradesAfterLoss : Float;
    winRateHighVolumeDays : Float;
  };

  type Trade = {
    id : UUID;
    instrumentSymbol : Text;
    side : PositionSide;
    quantity : Float;
    entryPrice : Float;
    exitPrice : Float;
    pnl : Float;
    strategyName : Text;
    openedAt : Time.Time;
    closedAt : Time.Time;
  };

  type Position = {
    id : UUID;
    instrumentSymbol : Text;
    quantity : Float;
    entryPrice : Float;
    currentPrice : Float;
    side : PositionSide;
    openedAt : Time.Time;
  };

  type WatchlistItem = {
    instrumentSymbol : Text;
    addedAt : Time.Time;
  };

  type UserRole = {
    #admin;
    #user;
    #guest;
  };

  public type UserProfile = {
    username : Text;
    email : Text;
    phone : Text;
    role : UserRole;
    subscription : {
      #free;
      #pro;
      #elite;
    };
    kycStatus : {
      #pending;
      #verified;
      #rejected;
    };
    twoFaEnabled : Bool;
    createdAt : Time.Time;
  };

  // Market Holidays
  type MarketHoliday = {
    date : Text;
    market : Text;
    name : Text;
  };

  type MarketHalt = {
    market : Text;
    reason : Text;
    expiresAt : Time.Time;
    startedAt : Time.Time;
  };

  // Persistent state
  let userProfiles = Map.empty<Principal, UserProfile>();
  let signals = Map.empty<UUID, Signal>();
  let trades = Map.empty<UUID, Trade>();
  let strategies = Map.empty<UUID, StrategyConfig>();
  let instruments = Map.empty<Text, Instrument>();
  let brokerConnections = Map.empty<Principal, [BrokerConnection]>();
  let alertConfigs = Map.empty<Principal, AlertChannel>();
  let watchlists = Map.empty<Principal, [WatchlistItem]>();
  let marketHolidays = Map.empty<Text, [MarketHoliday]>();
  let marketHalts = Map.empty<Text, MarketHalt>();

  // NEW: Persistent state for new features
  let aiModels = Map.empty<UUID, AIModel>();
  let riskProfiles = Map.empty<Principal, RiskProfile>();
  let orders = Map.empty<UUID, Order>();
  let masterTraders = Map.empty<UUID, MasterTrader>();
  let copySubscriptions = Map.empty<Principal, [CopySubscription]>();
  let savedStrategies = Map.empty<UUID, SavedStrategy>();
  let optionPositions = Map.empty<UUID, OptionPosition>();
  let dailyReports = Map.empty<Principal, [DailyReport]>();
  let psychologyFlags = Map.empty<Principal, PsychologyFlags>();

  func getUserProfileInternal(user : Principal) : ?UserProfile {
    userProfiles.get(user);
  };

  func cleanExpiredHalts() {
    let now = Time.now();
    let currentHalts = marketHalts.filter(
      func(_market, halt) { halt.expiresAt > now }
    );
    marketHalts.clear();
    for ((market, halt) in currentHalts.entries()) {
      marketHalts.add(market, halt);
    };
  };

  func filteredArray<T>(iter : Iter.Iter<T>, predicate : (T) -> Bool) : List.List<T> {
    let filtered = List.empty<T>();
    for (item in iter) {
      if (predicate(item)) {
        filtered.add(item);
      };
    };
    filtered;
  };

  func assertHasPermission(caller : Principal, requiredRole : UserRole) {
    if (not (AccessControl.hasPermission(accessControlState, caller, requiredRole))) {
      Runtime.trap("Unauthorized: Insufficient privileges");
    };
  };

  func upsert<K, V>(map : Map.Map<K, V>, key : K, value : V) {
    map.add(func(a, b) { #equal }, key, value);
  };

  // User Profile functions
  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    upsert(userProfiles, caller, profile);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    getUserProfileInternal(user);
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    getUserProfileInternal(caller);
  };

  // Instrument functions
  public shared ({ caller }) func addInstrument(symbol : Text, name : Text, exchange : Text, assetClass : AssetClass) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add instruments");
    };
    let instrument : Instrument = {
      symbol;
      name;
      exchange;
      assetClass;
    };
    upsert(instruments, symbol, instrument);
  };

  public query ({ caller }) func getInstrumentsByAssetClass(assetClass : AssetClass) : async [Instrument] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view instruments");
    };
    instruments.values().toArray().filter(func(i) { i.assetClass == assetClass });
  };

  // Signal functions
  public shared ({ caller }) func addSignal(symbol : Text, signalType : SignalType, confidence : Float, entryPrice : Float, targetPrice : Float, stopLoss : Float, strategyName : Text, timeframe : Text, technicalScore : Float, fundamentalScore : Float, aiReasoning : ?AIReasoning) : async UUID {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add signals");
    };

    let id = Time.now().toText();
    let signal : Signal = {
      id;
      instrumentSymbol = symbol;
      signalType;
      confidence;
      entryPrice;
      targetPrice;
      stopLoss;
      strategyName;
      timeframe;
      timestamp = Time.now();
      technicalScore;
      fundamentalScore;
      aiReasoning;
    };
    upsert(signals, id, signal);
    id;
  };

  public query ({ caller }) func getSignals() : async [Signal] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view signals");
    };
    signals.values().toArray();
  };

  public query ({ caller }) func getSignalsByInstrument(symbol : Text) : async [Signal] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view signals");
    };
    signals.values().toArray().filter(func(s) { s.instrumentSymbol == symbol });
  };

  // Trade functions
  public query ({ caller }) func getTrades() : async [Trade] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view trades");
    };
    trades.values().toArray();
  };

  // Strategy functions
  public query ({ caller }) func getAllStrategies() : async [StrategyConfig] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view strategies");
    };
    strategies.values().toArray();
  };

  public shared ({ caller }) func addStrategy(name : Text, strategyType : StrategyType, parameters : Text, riskSettings : {
    dailyLossLimitPct : Float;
    perTradeStopLossPct : Float;
    maxPositions : Nat;
    positionSizePct : Float;
    drawdownProtectionPct : Float;
  }) : async UUID {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add strategies");
    };

    let id = Time.now().toText();
    let strategy : StrategyConfig = {
      id;
      name;
      strategyType;
      enabled = true;
      parameters;
      riskSettings;
    };
    upsert(strategies, id, strategy);
    id;
  };

  // Performance metrics
  public query ({ caller }) func getPerformanceMetrics() : async {
    winRate : Float;
    avgRR : Float;
    profitFactor : Float;
    maxDrawdown : Float;
    totalTrades : Nat;
    totalPnl : Float;
  } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view performance metrics");
    };
    let tradesList = trades.values().toArray();
    let totalTrades = tradesList.size();
    let wins = tradesList.filter(func(t) { t.pnl > 0 }).size();
    let losses = tradesList.filter(func(t) { t.pnl < 0 }).size();
    let totalWinAmount = tradesList.filter(func(t) { t.pnl > 0 }).foldLeft(0.0, func(acc, t) { acc + t.pnl });
    let totalLossAmount = tradesList.filter(func(t) { t.pnl < 0 }).foldLeft(0.0, func(acc, t) { acc + Float.abs(t.pnl) });
    let totalPnl = tradesList.foldLeft(0.0, func(acc, t) { acc + t.pnl });

    let winRate = if (totalTrades == 0) { 0.toFloat() } else { wins.toFloat() / totalTrades.toFloat() };
    let avgRR = if (losses == 0) { 0.toFloat() } else { totalWinAmount / losses.toFloat() };
    let profitFactor = if (totalLossAmount == 0) { 0.toFloat() } else { totalWinAmount / totalLossAmount };
    let maxDrawdown : Float = 0;

    {
      winRate;
      avgRR;
      profitFactor;
      maxDrawdown;
      totalTrades;
      totalPnl;
    };
  };

  // Broker connection functions
  public shared ({ caller }) func addBrokerConnection(brokerName : Text, apiKeyMasked : Text, isPaper : Bool) : async UUID {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add broker connections");
    };

    let id = Time.now().toText();
    let connection : BrokerConnection = {
      id;
      brokerName;
      apiKeyMasked;
      isPaper;
      connected = false;
      status = "inactive";
    };

    let existing = brokerConnections.get(caller);
    switch (existing) {
      case (null) {
        upsert(brokerConnections, caller, [connection]);
      };
      case (?list) {
        let updatedList = list.concat([connection]);
        upsert(brokerConnections, caller, updatedList);
      };
    };
    id;
  };

  // Alert config functions
  public shared ({ caller }) func updateAlertConfig(alertConfig : AlertChannel) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update alert config");
    };
    upsert(alertConfigs, caller, alertConfig);
  };

  public query ({ caller }) func getAlertConfig() : async ?AlertChannel {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view alert config");
    };
    alertConfigs.get(caller);
  };

  // Watchlist functions
  public shared ({ caller }) func addToWatchlist(instrumentSymbol : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add to watchlist");
    };
    let watchlistItem : WatchlistItem = {
      instrumentSymbol;
      addedAt = Time.now();
    };
    let existing = watchlists.get(caller);
    switch (existing) {
      case (null) {
        upsert(watchlists, caller, [watchlistItem]);
      };
      case (?list) {
        let updatedList = list.concat([watchlistItem]);
        upsert(watchlists, caller, updatedList);
      };
    };
  };

  public query ({ caller }) func getWatchlist() : async [WatchlistItem] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view watchlist");
    };
    switch (watchlists.get(caller)) {
      case (null) { [] };
      case (?items) { items };
    };
  };

  public shared ({ caller }) func removeFromWatchlist(instrumentSymbol : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can remove from watchlist");
    };
    let existing = watchlists.get(caller);
    switch (existing) {
      case (null) {};
      case (?items) {
        let filteredItems = items.filter(func(item) { item.instrumentSymbol != instrumentSymbol });
        upsert(watchlists, caller, filteredItems);
      };
    };
  };

  // Market holidays functions
  public shared ({ caller }) func upsertMarketHolidays(market : Text, year : Text, holidays : [MarketHoliday]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can modify market holidays");
    };

    let filteredHolidays = holidays.filter(
      func(h) {
        h.date.startsWith(#text year) and h.market == market
      }
    );

    switch (marketHolidays.get(market)) {
      case (null) {
        upsert(marketHolidays, market, filteredHolidays);
      };
      case (?existing) {
        let others = existing.filter(
          func(h) { not h.date.startsWith(#text year) }
        );
        let combined = others.concat(filteredHolidays);
        upsert(marketHolidays, market, combined);
      };
    };
  };

  public query ({ caller }) func getMarketHolidays(market : Text) : async [MarketHoliday] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view market holidays");
    };
    switch (marketHolidays.get(market)) {
      case (null) { [] };
      case (?holidays) { holidays };
    };
  };

  public query ({ caller }) func isMarketHoliday(market : Text, date : Text) : async ?MarketHoliday {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can check market holidays");
    };
    switch (marketHolidays.get(market)) {
      case (null) { null };
      case (?holidays) {
        let found = holidays.filter(
          func(h) { h.date == date }
        );
        if (found.size() > 0) { ?found[0] } else { null };
      };
    };
  };

  // Market halt functions
  public shared ({ caller }) func setMarketHalt(market : Text, reason : Text, durationMinutes : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can set market halts");
    };
    let halt : MarketHalt = {
      market;
      reason;
      expiresAt = Time.now() + (durationMinutes * 60 * 1000000000);
      startedAt = Time.now();
    };
    upsert(marketHalts, market, halt);
  };

  public shared ({ caller }) func clearMarketHalt(market : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can clear market halts");
    };
    marketHalts.remove(market);
  };

  public query ({ caller }) func getMarketHalt(market : Text) : async ?MarketHalt {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view market halt status");
    };
    cleanExpiredHalts();
    marketHalts.get(market);
  };

  public query ({ caller }) func isMarketHalted(market : Text) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can check market halt status");
    };
    cleanExpiredHalts();
    marketHalts.containsKey(market);
  };

  // ========== NEW FEATURE FUNCTIONS ==========

  // 1. AI Model tracking
  public shared ({ caller }) func addAIModel(name : Text, accuracy : Float, modelType : ModelType) : async UUID {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add AI models");
    };
    let id = Time.now().toText();
    let model : AIModel = {
      modelId = id;
      name;
      accuracy;
      lastTrained = Time.now();
      status = #active;
      modelType;
    };
    upsert(aiModels, id, model);
    id;
  };

  public shared ({ caller }) func updateAIModelStatus(modelId : UUID, status : ModelStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update AI model status");
    };
    switch (aiModels.get(modelId)) {
      case (null) {
        Runtime.trap("AI model not found");
      };
      case (?model) {
        let updated : AIModel = {
          modelId = model.modelId;
          name = model.name;
          accuracy = model.accuracy;
          lastTrained = model.lastTrained;
          status;
          modelType = model.modelType;
        };
        upsert(aiModels, modelId, updated);
      };
    };
  };

  public query ({ caller }) func getAllAIModels() : async [AIModel] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can query AI models");
    };
    aiModels.values().toArray();
  };

  // 3. Risk settings per user
  public shared ({ caller }) func updateRiskProfile(profile : RiskProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update risk profile");
    };
    upsert(riskProfiles, caller, profile);
  };

  public query ({ caller }) func getRiskProfile() : async ?RiskProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view risk profile");
    };
    riskProfiles.get(caller);
  };

  public query ({ caller }) func getUserRiskProfile(user : Principal) : async ?RiskProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own risk profile");
    };
    riskProfiles.get(user);
  };

  // 4. Order types
  public shared ({ caller }) func placeOrder(instrumentSymbol : Text, orderType : OrderType, side : OrderSide, quantity : Float, limitPrice : ?Float, stopLoss : ?Float, target : ?Float, condition : ?Text) : async UUID {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can place orders");
    };
    let id = Time.now().toText();
    let order : Order = {
      id;
      userId = caller;
      instrumentSymbol;
      orderType;
      side;
      quantity;
      limitPrice;
      stopLoss;
      target;
      status = #pending;
      placedAt = Time.now();
      filledAt = null;
      slippageRs = null;
      slippagePct = null;
      brokerLatencyMs = null;
      condition;
    };
    upsert(orders, id, order);
    id;
  };

  public query ({ caller }) func getMyOrders() : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view orders");
    };
    orders.values().toArray().filter(func(o) { o.userId == caller });
  };

  public query ({ caller }) func getUserOrders(user : Principal) : async [Order] {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own orders");
    };
    orders.values().toArray().filter(func(o) { o.userId == user });
  };

  public shared ({ caller }) func cancelOrder(orderId : UUID) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can cancel orders");
    };
    switch (orders.get(orderId)) {
      case (null) {
        Runtime.trap("Order not found");
      };
      case (?order) {
        if (order.userId != caller) {
          Runtime.trap("Unauthorized: Can only cancel your own orders");
        };
        let updated : Order = {
          id = order.id;
          userId = order.userId;
          instrumentSymbol = order.instrumentSymbol;
          orderType = order.orderType;
          side = order.side;
          quantity = order.quantity;
          limitPrice = order.limitPrice;
          stopLoss = order.stopLoss;
          target = order.target;
          status = #cancelled;
          placedAt = order.placedAt;
          filledAt = order.filledAt;
          slippageRs = order.slippageRs;
          slippagePct = order.slippagePct;
          brokerLatencyMs = order.brokerLatencyMs;
          condition = order.condition;
        };
        upsert(orders, orderId, updated);
      };
    };
  };

  // 5. Copy trading
  public shared ({ caller }) func registerMasterTrader(name : Text, style : TradingStyle, totalReturnPct : Float, winRate : Float, maxDrawdown : Float, sharpeRatio : Float, monthlyFee : Float) : async UUID {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can register master traders");
    };
    let id = Time.now().toText();
    let master : MasterTrader = {
      traderId = id;
      name;
      style;
      totalReturnPct;
      winRate;
      maxDrawdown;
      sharpeRatio;
      subscriberCount = 0;
      monthlyFee;
    };
    upsert(masterTraders, id, master);
    id;
  };

  public query ({ caller }) func getAllMasterTraders() : async [MasterTrader] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view master traders");
    };
    masterTraders.values().toArray();
  };

  public shared ({ caller }) func subscribeToCopyTrading(masterId : UUID, copyRatioPct : Float, maxCapital : Float, maxTradesPerDay : Nat, drawdownStopPct : Float, copyEquity : Bool, copyFO : Bool, copyCrypto : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can subscribe to copy trading");
    };
    let subscription : CopySubscription = {
      masterId;
      copyRatioPct;
      maxCapital;
      maxTradesPerDay;
      drawdownStopPct;
      copyEquity;
      copyFO;
      copyCrypto;
    };
    let existing = copySubscriptions.get(caller);
    switch (existing) {
      case (null) {
        upsert(copySubscriptions, caller, [subscription]);
      };
      case (?list) {
        let updatedList = list.concat([subscription]);
        upsert(copySubscriptions, caller, updatedList);
      };
    };
  };

  public query ({ caller }) func getMyCopySubscriptions() : async [CopySubscription] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view copy subscriptions");
    };
    switch (copySubscriptions.get(caller)) {
      case (null) { [] };
      case (?subs) { subs };
    };
  };

  public shared ({ caller }) func unsubscribeFromCopyTrading(masterId : UUID) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can unsubscribe from copy trading");
    };
    let existing = copySubscriptions.get(caller);
    switch (existing) {
      case (null) {};
      case (?subs) {
        let filtered = subs.filter(func(s) { s.masterId != masterId });
        upsert(copySubscriptions, caller, filtered);
      };
    };
  };

  // 6. Strategy builder
  public shared ({ caller }) func saveStrategy(name : Text, blocks : Text, backtestResults : ?BacktestResult) : async UUID {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save strategies");
    };
    let id = Time.now().toText();
    let strategy : SavedStrategy = {
      id;
      userId = caller;
      name;
      blocks;
      backtestResults;
    };
    upsert(savedStrategies, id, strategy);
    id;
  };

  public query ({ caller }) func getMySavedStrategies() : async [SavedStrategy] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view saved strategies");
    };
    savedStrategies.values().toArray().filter(func(s) { s.userId == caller });
  };

  public query ({ caller }) func loadStrategy(strategyId : UUID) : async ?SavedStrategy {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can load strategies");
    };
    switch (savedStrategies.get(strategyId)) {
      case (null) { null };
      case (?strategy) {
        if (strategy.userId != caller) {
          Runtime.trap("Unauthorized: Can only load your own strategies");
        };
        ?strategy;
      };
    };
  };

  public shared ({ caller }) func deleteStrategy(strategyId : UUID) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete strategies");
    };
    switch (savedStrategies.get(strategyId)) {
      case (null) {
        Runtime.trap("Strategy not found");
      };
      case (?strategy) {
        if (strategy.userId != caller) {
          Runtime.trap("Unauthorized: Can only delete your own strategies");
        };
        savedStrategies.remove(strategyId);
      };
    };
  };

  // 7. Options data
  public shared ({ caller }) func addOptionPosition(underlying : Text, strike : Float, expiry : Time.Time, optionType : OptionType, side : OptionSide, quantity : Float, premium : Float, delta : Float, gamma : Float, theta : Float, vega : Float, iv : Float) : async UUID {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add option positions");
    };
    let id = Time.now().toText();
    let position : OptionPosition = {
      id;
      userId = caller;
      underlying;
      strike;
      expiry;
      optionType;
      side;
      quantity;
      premium;
      delta;
      gamma;
      theta;
      vega;
      iv;
    };
    upsert(optionPositions, id, position);
    id;
  };

  public query ({ caller }) func getMyOptionPositions() : async [OptionPosition] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view option positions");
    };
    optionPositions.values().toArray().filter(func(p) { p.userId == caller });
  };

  public query ({ caller }) func getPortfolioGreeks() : async PortfolioGreeks {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view portfolio Greeks");
    };
    let positions = optionPositions.values().toArray().filter(func(p) { p.userId == caller });
    let totalDelta = positions.foldLeft(0.0, func(acc, p) { acc + p.delta * p.quantity });
    let totalGamma = positions.foldLeft(0.0, func(acc, p) { acc + p.gamma * p.quantity });
    let totalTheta = positions.foldLeft(0.0, func(acc, p) { acc + p.theta * p.quantity });
    let totalVega = positions.foldLeft(0.0, func(acc, p) { acc + p.vega * p.quantity });
    {
      totalDelta;
      totalGamma;
      totalTheta;
      totalVega;
    };
  };

  // 8. Performance analytics
  public shared ({ caller }) func addDailyReport(date : Text, totalTrades : Nat, winners : Nat, losers : Nat, winRate : Float, dayPnl : Float, bestTrade : Float, worstTrade : Float, signalsAccuracy : Float) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add daily reports");
    };
    let report : DailyReport = {
      date;
      totalTrades;
      winners;
      losers;
      winRate;
      dayPnl;
      bestTrade;
      worstTrade;
      signalsAccuracy;
    };
    let existing = dailyReports.get(caller);
    switch (existing) {
      case (null) {
        upsert(dailyReports, caller, [report]);
      };
      case (?reports) {
        let updatedReports = reports.concat([report]);
        upsert(dailyReports, caller, updatedReports);
      };
    };
  };

  public query ({ caller }) func getMyDailyReports() : async [DailyReport] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view daily reports");
    };
    switch (dailyReports.get(caller)) {
      case (null) { [] };
      case (?reports) { reports };
    };
  };

  public shared ({ caller }) func updatePsychologyFlags(flags : PsychologyFlags) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update psychology flags");
    };
    upsert(psychologyFlags, caller, flags);
  };

  public query ({ caller }) func getMyPsychologyFlags() : async ?PsychologyFlags {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view psychology flags");
    };
    psychologyFlags.get(caller);
  };

  public query ({ caller }) func getUserPsychologyFlags(user : Principal) : async ?PsychologyFlags {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own psychology flags");
    };
    psychologyFlags.get(user);
  };
};

