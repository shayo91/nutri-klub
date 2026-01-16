import { useQuery } from "@tanstack/react-query";

interface UsageStats {
  recipe_view: {
    current: number;
    limit: number;
    remaining: number;
  };
  ai_message: {
    current: number;
    limit: number;
    remaining: number;
  };
  ebook_download: {
    current: number;
    limit: number;
    remaining: number;
  };
}

interface SubscriptionStatus {
  role: string;
  subscriptionStatus: string;
  subscriptionTier?: string;
  subscriptionExpiresAt?: string;
  isPremium: boolean;
  isAdmin: boolean;
  subscriptions: any[];
  usageStats: UsageStats;
}

export function useSubscription() {
  return useQuery<SubscriptionStatus>({
    queryKey: ["subscription-status"],
    queryFn: async () => {
      const response = await fetch("/api/subscription/status", {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch subscription status");
      }

      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });
}

export function useUsageStats() {
  return useQuery<UsageStats>({
    queryKey: ["usage-stats"],
    queryFn: async () => {
      const response = await fetch("/api/subscription/usage", {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch usage stats");
      }

      return response.json();
    },
    staleTime: 1 * 60 * 1000, // 1 minute
    retry: false,
  });
}
