import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  AlertChannel,
  AssetClass,
  Signal,
  StrategyConfig,
  Trade,
  UserProfile,
  WatchlistItem,
} from "../backend.d";
import { useActor } from "./useActor";

export function useSignals() {
  const { actor, isFetching } = useActor();
  return useQuery<Signal[]>({
    queryKey: ["signals"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getSignals();
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useTrades() {
  const { actor, isFetching } = useActor();
  return useQuery<Trade[]>({
    queryKey: ["trades"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getTrades();
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useStrategies() {
  const { actor, isFetching } = useActor();
  return useQuery<StrategyConfig[]>({
    queryKey: ["strategies"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getAllStrategies();
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useWatchlist() {
  const { actor, isFetching } = useActor();
  return useQuery<WatchlistItem[]>({
    queryKey: ["watchlist"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getWatchlist();
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddToWatchlist() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (symbol: string) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.addToWatchlist(symbol);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["watchlist"] });
    },
  });
}

export function useRemoveFromWatchlist() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (symbol: string) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.removeFromWatchlist(symbol);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["watchlist"] });
    },
  });
}

export function usePerformanceMetrics() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["performanceMetrics"],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.getPerformanceMetrics();
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAlertConfig() {
  const { actor, isFetching } = useActor();
  return useQuery<AlertChannel | null>({
    queryKey: ["alertConfig"],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.getAlertConfig();
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateAlertConfig() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (config: AlertChannel) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.updateAlertConfig(config);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alertConfig"] });
    },
  });
}

export function useUserProfile() {
  const { actor, isFetching } = useActor();
  return useQuery<UserProfile | null>({
    queryKey: ["userProfile"],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.getCallerUserProfile();
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      try {
        return await actor.isCallerAdmin();
      } catch {
        return false;
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useInstrumentsByAssetClass(assetClass: AssetClass) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["instruments", assetClass],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getInstrumentsByAssetClass(assetClass);
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}
