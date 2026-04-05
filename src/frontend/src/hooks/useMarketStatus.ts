import { useEffect, useState } from "react";

export type MarketStatusType =
  | "PRE_OPEN"
  | "OPEN"
  | "CLOSING"
  | "CLOSED"
  | "HOLIDAY"
  | "HALTED"
  | "AMO_WINDOW";

export interface MarketConfig {
  id: string;
  name: string;
  timezone: string;
  openHour: number;
  openMinute: number;
  closeHour: number;
  closeMinute: number;
  preOpenHour: number;
  preOpenMinute: number;
  days: number[];
  alwaysOpen?: boolean;
  isCrypto?: boolean;
  isForex?: boolean;
}

export interface MarketStatusInfo {
  id: string;
  name: string;
  status: MarketStatusType;
  sessionTime: string;
  secondsToNextEvent: number;
  nextEventLabel: string;
  nextEventTime: string;
  isOpen: boolean;
}

export const MARKET_CONFIGS: MarketConfig[] = [
  {
    id: "NSE",
    name: "NSE/BSE",
    timezone: "Asia/Kolkata",
    openHour: 9,
    openMinute: 15,
    closeHour: 15,
    closeMinute: 30,
    preOpenHour: 9,
    preOpenMinute: 0,
    days: [1, 2, 3, 4, 5],
  },
  {
    id: "MCX",
    name: "MCX",
    timezone: "Asia/Kolkata",
    openHour: 9,
    openMinute: 0,
    closeHour: 23,
    closeMinute: 30,
    preOpenHour: 8,
    preOpenMinute: 45,
    days: [1, 2, 3, 4, 5],
  },
  {
    id: "CDS",
    name: "NSE Currency",
    timezone: "Asia/Kolkata",
    openHour: 9,
    openMinute: 0,
    closeHour: 17,
    closeMinute: 0,
    preOpenHour: 8,
    preOpenMinute: 45,
    days: [1, 2, 3, 4, 5],
  },
  {
    id: "NYSE",
    name: "NYSE/NASDAQ",
    timezone: "America/New_York",
    openHour: 9,
    openMinute: 30,
    closeHour: 16,
    closeMinute: 0,
    preOpenHour: 4,
    preOpenMinute: 0,
    days: [1, 2, 3, 4, 5],
  },
  {
    id: "LSE",
    name: "London",
    timezone: "Europe/London",
    openHour: 8,
    openMinute: 0,
    closeHour: 16,
    closeMinute: 30,
    preOpenHour: 7,
    preOpenMinute: 45,
    days: [1, 2, 3, 4, 5],
  },
  {
    id: "TSE",
    name: "Tokyo",
    timezone: "Asia/Tokyo",
    openHour: 9,
    openMinute: 0,
    closeHour: 15,
    closeMinute: 30,
    preOpenHour: 8,
    preOpenMinute: 45,
    days: [1, 2, 3, 4, 5],
  },
  {
    id: "SGX",
    name: "Singapore",
    timezone: "Asia/Singapore",
    openHour: 9,
    openMinute: 0,
    closeHour: 17,
    closeMinute: 0,
    preOpenHour: 8,
    preOpenMinute: 45,
    days: [1, 2, 3, 4, 5],
  },
  {
    id: "FOREX",
    name: "FOREX",
    timezone: "UTC",
    openHour: 0,
    openMinute: 0,
    closeHour: 23,
    closeMinute: 59,
    preOpenHour: 0,
    preOpenMinute: 0,
    days: [1, 2, 3, 4, 5],
    isForex: true,
  },
  {
    id: "CRYPTO",
    name: "CRYPTO",
    timezone: "UTC",
    openHour: 0,
    openMinute: 0,
    closeHour: 23,
    closeMinute: 59,
    preOpenHour: 0,
    preOpenMinute: 0,
    days: [0, 1, 2, 3, 4, 5, 6],
    alwaysOpen: true,
    isCrypto: true,
  },
];

function getTimeInZone(timezone: string): {
  hour: number;
  minute: number;
  second: number;
  dayOfWeek: number;
} {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
    weekday: "short",
  });

  const parts = formatter.formatToParts(now);
  let hour = 0;
  let minute = 0;
  let second = 0;
  let weekday = "";

  for (const part of parts) {
    if (part.type === "hour") hour = Number.parseInt(part.value, 10);
    else if (part.type === "minute") minute = Number.parseInt(part.value, 10);
    else if (part.type === "second") second = Number.parseInt(part.value, 10);
    else if (part.type === "weekday") weekday = part.value;
  }

  // Handle 24 hour edge case (midnight)
  if (hour === 24) hour = 0;

  const weekdayMap: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };
  const dayOfWeek = weekdayMap[weekday] ?? new Date().getDay();

  return { hour, minute, second, dayOfWeek };
}

function toMinutes(hour: number, minute: number): number {
  return hour * 60 + minute;
}

function calcMarketStatus(
  config: MarketConfig,
  haltedMarkets: string[],
): MarketStatusInfo {
  const { hour, minute, second, dayOfWeek } = getTimeInZone(config.timezone);
  const currentMin = toMinutes(hour, minute);
  const openMin = toMinutes(config.openHour, config.openMinute);
  const closeMin = toMinutes(config.closeHour, config.closeMinute);
  const preOpenMin = toMinutes(config.preOpenHour, config.preOpenMinute);
  const closingWarningMin = closeMin - 15;

  const sessionTime = `${String(config.openHour).padStart(2, "0")}:${String(config.openMinute).padStart(2, "0")} – ${String(config.closeHour).padStart(2, "0")}:${String(config.closeMinute).padStart(2, "0")}`;

  let status: MarketStatusType = "CLOSED";
  let secondsToNextEvent = 0;
  let nextEventLabel = "Opens in";
  let nextEventTime = "";

  // Check halted
  if (haltedMarkets.includes(config.id)) {
    return {
      id: config.id,
      name: config.name,
      status: "HALTED",
      sessionTime,
      secondsToNextEvent: 0,
      nextEventLabel: "Halted",
      nextEventTime: "",
      isOpen: false,
    };
  }

  // Crypto always open
  if (config.alwaysOpen) {
    const secondsToMidnight =
      (23 - hour) * 3600 + (59 - minute) * 60 + (60 - second);
    return {
      id: config.id,
      name: config.name,
      status: "OPEN",
      sessionTime: "24/7",
      secondsToNextEvent: secondsToMidnight,
      nextEventLabel: "Always Open",
      nextEventTime: "24/7",
      isOpen: true,
    };
  }

  // Check weekend
  if (!config.days.includes(dayOfWeek)) {
    const daysUntilMonday = dayOfWeek === 0 ? 1 : dayOfWeek === 6 ? 2 : 0;
    let secs =
      daysUntilMonday * 24 * 3600 +
      (openMin - currentMin) * 60 -
      second +
      (openMin < currentMin ? 24 * 3600 : 0);
    if (secs < 0) secs += daysUntilMonday * 24 * 3600;
    return {
      id: config.id,
      name: config.name,
      status: "CLOSED",
      sessionTime,
      secondsToNextEvent: Math.max(0, secs),
      nextEventLabel: "Opens in",
      nextEventTime: `${String(config.openHour).padStart(2, "0")}:${String(config.openMinute).padStart(2, "0")}`,
      isOpen: false,
    };
  }

  if (currentMin < preOpenMin) {
    status = "CLOSED";
    secondsToNextEvent = Math.max(0, (preOpenMin - currentMin) * 60 - second);
    nextEventLabel = "Pre-open in";
    nextEventTime = `${String(config.preOpenHour).padStart(2, "0")}:${String(config.preOpenMinute).padStart(2, "0")}`;
  } else if (currentMin < openMin) {
    status = "PRE_OPEN";
    secondsToNextEvent = Math.max(0, (openMin - currentMin) * 60 - second);
    nextEventLabel = "Opens in";
    nextEventTime = `${String(config.openHour).padStart(2, "0")}:${String(config.openMinute).padStart(2, "0")}`;
  } else if (currentMin <= closingWarningMin) {
    status = "OPEN";
    secondsToNextEvent = Math.max(0, (closeMin - currentMin) * 60 - second);
    nextEventLabel = "Closes in";
    nextEventTime = `${String(config.closeHour).padStart(2, "0")}:${String(config.closeMinute).padStart(2, "0")}`;
  } else if (currentMin <= closeMin) {
    status = "CLOSING";
    secondsToNextEvent = Math.max(0, (closeMin - currentMin) * 60 - second);
    nextEventLabel = "Closes in";
    nextEventTime = `${String(config.closeHour).padStart(2, "0")}:${String(config.closeMinute).padStart(2, "0")}`;
  } else {
    status = "CLOSED";
    const secondsUntilMidnight = (24 * 60 - currentMin) * 60 - second;
    secondsToNextEvent = secondsUntilMidnight + preOpenMin * 60;
    nextEventLabel = "Opens in";
    nextEventTime = `tomorrow ${String(config.preOpenHour).padStart(2, "0")}:${String(config.preOpenMinute).padStart(2, "0")}`;
  }

  return {
    id: config.id,
    name: config.name,
    status,
    sessionTime,
    secondsToNextEvent: Math.max(0, secondsToNextEvent),
    nextEventLabel,
    nextEventTime,
    isOpen: status === "OPEN" || status === "CLOSING",
  };
}

// Simple NSE open check (no context dependency)
export function getNSEOpenStatus(): boolean {
  const { hour, minute, dayOfWeek } = getTimeInZone("Asia/Kolkata");
  const currentMin = toMinutes(hour, minute);
  const openMin = toMinutes(9, 15);
  const closeMin = toMinutes(15, 30);
  return (
    dayOfWeek >= 1 &&
    dayOfWeek <= 5 &&
    currentMin >= openMin &&
    currentMin <= closeMin
  );
}

// Check AMO window: 17:00 IST to 08:59 IST next day
function isAMOWindow(): boolean {
  const { hour, minute, dayOfWeek } = getTimeInZone("Asia/Kolkata");
  if (dayOfWeek === 0 || dayOfWeek === 6) return false;
  const currentMin = toMinutes(hour, minute);
  const amoStartMin = toMinutes(17, 0);
  const amoEndMin = toMinutes(8, 59);
  return currentMin >= amoStartMin || currentMin <= amoEndMin;
}

function computeBrokerStatuses(): BrokerStatus[] {
  const nseOpen = getNSEOpenStatus();
  const amoWindow = isAMOWindow();

  const {
    hour: istHour,
    minute: istMinute,
    dayOfWeek,
  } = getTimeInZone("Asia/Kolkata");
  const {
    hour: nyHour,
    minute: nyMinute,
    dayOfWeek: nyDay,
  } = getTimeInZone("America/New_York");

  const istMin = toMinutes(istHour, istMinute);
  const nyMin = toMinutes(nyHour, nyMinute);

  const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5;
  const isNYWeekday = nyDay >= 1 && nyDay <= 5;

  const nyOpen =
    isNYWeekday && nyMin >= toMinutes(9, 30) && nyMin <= toMinutes(16, 0);
  const nyPreOpen =
    isNYWeekday && nyMin >= toMinutes(4, 0) && nyMin < toMinutes(9, 30);

  const getIndianBrokerStatus = (): BrokerStatus["status"] => {
    if (nseOpen) return "OPEN";
    if (!isWeekday) return "CLOSED";
    const preOpen =
      isWeekday && istMin >= toMinutes(9, 0) && istMin < toMinutes(9, 15);
    if (preOpen) return "PRE_OPEN";
    if (amoWindow) return "AMO_WINDOW";
    return "CLOSED";
  };

  const getUSBrokerStatus = (): BrokerStatus["status"] => {
    if (nyOpen) return "OPEN";
    if (nyPreOpen) return "PRE_OPEN";
    return "CLOSED";
  };

  return [
    {
      id: "zerodha",
      name: "Zerodha",
      market: "NSE",
      status: getIndianBrokerStatus(),
      connected: true,
      equityOpen: "09:15",
      equityClose: "15:30",
      timezone: "Asia/Kolkata",
      amoSupported: true,
    },
    {
      id: "angelone",
      name: "Angel One",
      market: "NSE",
      status: getIndianBrokerStatus(),
      connected: true,
      equityOpen: "09:15",
      equityClose: "15:30",
      timezone: "Asia/Kolkata",
      amoSupported: true,
    },
    {
      id: "upstox",
      name: "Upstox",
      market: "NSE",
      status: getIndianBrokerStatus(),
      connected: false,
      equityOpen: "09:15",
      equityClose: "15:30",
      timezone: "Asia/Kolkata",
      amoSupported: false,
    },
    {
      id: "ibkr",
      name: "IBKR",
      market: "NYSE",
      status: getUSBrokerStatus(),
      connected: true,
      equityOpen: "09:30",
      equityClose: "16:00",
      timezone: "America/New_York",
      amoSupported: false,
    },
    {
      id: "alpaca",
      name: "Alpaca",
      market: "NYSE",
      status: getUSBrokerStatus(),
      connected: true,
      equityOpen: "09:30",
      equityClose: "16:00",
      timezone: "America/New_York",
      amoSupported: false,
    },
    {
      id: "binance",
      name: "Binance",
      market: "CRYPTO",
      status: "OPEN",
      connected: true,
      equityOpen: "00:00",
      equityClose: "23:59",
      timezone: "UTC",
      amoSupported: false,
    },
  ];
}

export interface BrokerStatus {
  id: string;
  name: string;
  market: string;
  status: "OPEN" | "CLOSED" | "AMO_WINDOW" | "PRE_OPEN" | "DISCONNECTED";
  connected: boolean;
  equityOpen: string;
  equityClose: string;
  timezone: string;
  amoSupported: boolean;
}

export const BROKER_DEFINITIONS = {
  zerodha: {
    name: "Zerodha",
    market: "NSE",
    equityOpen: "09:15",
    equityClose: "15:30",
    amoStart: "17:00",
    amoEnd: "08:59",
    timezone: "Asia/Kolkata",
    amoSupported: true,
  },
  angelone: {
    name: "Angel One",
    market: "NSE",
    equityOpen: "09:15",
    equityClose: "15:30",
    amoStart: "17:00",
    amoEnd: "08:59",
    timezone: "Asia/Kolkata",
    amoSupported: true,
  },
  upstox: {
    name: "Upstox",
    market: "NSE",
    equityOpen: "09:15",
    equityClose: "15:30",
    amoStart: "17:00",
    amoEnd: "08:59",
    timezone: "Asia/Kolkata",
    amoSupported: false,
  },
  ibkr: {
    name: "IBKR",
    market: "NYSE",
    equityOpen: "09:30",
    equityClose: "16:00",
    amoStart: "",
    amoEnd: "",
    timezone: "America/New_York",
    amoSupported: false,
  },
  alpaca: {
    name: "Alpaca",
    market: "NYSE",
    equityOpen: "09:30",
    equityClose: "16:00",
    amoStart: "",
    amoEnd: "",
    timezone: "America/New_York",
    amoSupported: false,
  },
  binance: {
    name: "Binance",
    market: "CRYPTO",
    equityOpen: "00:00",
    equityClose: "23:59",
    amoStart: "",
    amoEnd: "",
    timezone: "UTC",
    amoSupported: false,
  },
};

export function useBrokerStatuses(): BrokerStatus[] {
  const [statuses, setStatuses] = useState<BrokerStatus[]>(
    computeBrokerStatuses,
  );

  useEffect(() => {
    // Re-evaluate every 30 seconds
    const interval = setInterval(() => {
      setStatuses(computeBrokerStatuses());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return statuses;
}

function computeAllMarketStatuses(haltedMarkets: string[]): MarketStatusInfo[] {
  return MARKET_CONFIGS.map((cfg) => calcMarketStatus(cfg, haltedMarkets));
}

export function useMarketStatus(haltedMarkets: string[] = []) {
  const [markets, setMarkets] = useState<MarketStatusInfo[]>(() =>
    computeAllMarketStatuses(haltedMarkets),
  );

  // Status recalc every 30s
  useEffect(() => {
    const interval = setInterval(() => {
      setMarkets(computeAllMarketStatuses(haltedMarkets));
    }, 30000);
    return () => clearInterval(interval);
    // Re-run if haltedMarkets changes
  }, [haltedMarkets]);

  // Countdown update every 1s
  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setMarkets((prev) =>
        prev.map((m) => ({
          ...m,
          secondsToNextEvent: Math.max(0, m.secondsToNextEvent - 1),
        })),
      );
    }, 1000);
    return () => clearInterval(countdownInterval);
  }, []);

  const nseStatus = markets.find((m) => m.id === "NSE") ?? {
    id: "NSE",
    name: "NSE/BSE",
    status: "CLOSED" as MarketStatusType,
    sessionTime: "09:15 – 15:30",
    secondsToNextEvent: 0,
    nextEventLabel: "Opens in",
    nextEventTime: "09:15",
    isOpen: false,
  };

  const isNSEOpen = nseStatus.isOpen;
  const isAnyIndianMarketOpen = markets.some(
    (m) => ["NSE", "MCX", "CDS"].includes(m.id) && m.isOpen,
  );

  const dominantStatus: MarketStatusType = nseStatus.status;

  return {
    markets,
    dominantStatus,
    nseStatus,
    isAnyIndianMarketOpen,
    isNSEOpen,
  };
}
