import { useState, useEffect, useCallback } from "react";
import { DishInsight, AppState } from "../types";
import { fetchInsights, pingHealth } from "../../utils/api";

const CACHE_KEY = "shef_cart_insights_cache";
const USAGE_KEY = "shef_api_usage";
const DAILY_LIMIT = 30; // max Groq calls per day

async function getCache(): Promise<Record<string, DishInsight>> {
  return new Promise((resolve) => {
    try {
      chrome.storage.session.get(CACHE_KEY, (result) => {
        resolve(result[CACHE_KEY] || {});
      });
    } catch {
      resolve({});
    }
  });
}

async function setCache(cache: Record<string, DishInsight>): Promise<void> {
  return new Promise((resolve) => {
    try {
      chrome.storage.session.set({ [CACHE_KEY]: cache }, () => resolve());
    } catch {
      resolve();
    }
  });
}

async function getUsage(): Promise<{ count: number; date: string }> {
  return new Promise((resolve) => {
    try {
      chrome.storage.local.get(USAGE_KEY, (result) => {
        const usage = result[USAGE_KEY] || { count: 0, date: "" };
        const today = new Date().toISOString().split("T")[0];
        // Reset if it's a new day
        if (usage.date !== today) {
          resolve({ count: 0, date: today });
        } else {
          resolve(usage);
        }
      });
    } catch {
      resolve({ count: 0, date: new Date().toISOString().split("T")[0] });
    }
  });
}

async function incrementUsage(): Promise<boolean> {
  const usage = await getUsage();
  if (usage.count >= DAILY_LIMIT) return false;
  usage.count += 1;
  return new Promise((resolve) => {
    try {
      chrome.storage.local.set({ [USAGE_KEY]: usage }, () => resolve(true));
    } catch {
      resolve(false);
    }
  });
}

function normalizeKey(name: string): string {
  return name.toLowerCase().split(" — ")[0].trim();
}

export function useCartInsights() {
  const [insights, setInsights] = useState<DishInsight[]>([]);
  const [state, setState] = useState<AppState>("loading");
  const [dishNames, setDishNames] = useState<string[]>([]);
  const [fetchingNew, setFetchingNew] = useState(false);
  const [newCount, setNewCount] = useState(0);

  // Ping health endpoint on mount to wake up Render
  useEffect(() => {
    pingHealth();
  }, []);

  const loadInsights = useCallback(async (dishes: string[]) => {
    if (dishes.length === 0) {
      setState("empty");
      setInsights([]);
      setFetchingNew(false);
      setNewCount(0);
      return;
    }

    setDishNames(dishes);
    const cache = await getCache();

    const cachedResults: DishInsight[] = [];
    const newDishes: string[] = [];

    dishes.forEach((dish) => {
      const key = normalizeKey(dish);
      if (cache[key]) {
        cachedResults.push(cache[key]);
      } else {
        newDishes.push(dish);
      }
    });

    if (newDishes.length === 0) {
      setInsights(cachedResults);
      setState("ready");
      setFetchingNew(false);
      setNewCount(0);
      return;
    }

    // Show cached results immediately + loading indicator for new
    if (cachedResults.length > 0) {
      setInsights(cachedResults);
      setState("ready");
      setFetchingNew(true);
      setNewCount(newDishes.length);
    } else {
      setState("loading");
    }

    // Check rate limit before calling API
    const allowed = await incrementUsage();
    if (!allowed) {
      console.warn("[Shef Cart Companion] Daily API limit reached");
      if (cachedResults.length > 0) {
        setInsights(cachedResults);
        setState("ready");
      } else {
        setState("error");
      }
      setFetchingNew(false);
      setNewCount(0);
      return;
    }

    try {
      const newInsights = await fetchInsights(newDishes);

      newDishes.forEach((dish, i) => {
        const key = normalizeKey(dish);
        if (newInsights[i]) {
          cache[key] = newInsights[i];
        }
      });

      newInsights.forEach((insight) => {
        const key = normalizeKey(insight.dishName);
        if (!cache[key]) {
          cache[key] = insight;
        }
      });

      await setCache(cache);

      const allInsights: DishInsight[] = [];
      dishes.forEach((dish) => {
        const key = normalizeKey(dish);
        if (cache[key]) {
          allInsights.push(cache[key]);
        }
      });

      newInsights.forEach((ni) => {
        if (!allInsights.find((a) => a.dishName === ni.dishName)) {
          allInsights.push(ni);
        }
      });

      setInsights(allInsights);
      setState("ready");
      setFetchingNew(false);
      setNewCount(0);
    } catch (err) {
      console.error("Failed to fetch insights:", err);
      setFetchingNew(false);
      setNewCount(0);
      if (cachedResults.length > 0) {
        setInsights(cachedResults);
        setState("ready");
      } else {
        setState("error");
      }
    }
  }, []);

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      const url = tab?.url || "";

      if (!url.includes("shef.com")) {
        setState("not_shef");
        return;
      }

      if (!tab?.id) {
        setState("error");
        return;
      }

      chrome.tabs.sendMessage(
        tab.id,
        { type: "GET_CART_ITEMS" },
        (response) => {
          if (chrome.runtime.lastError) {
            console.warn("Content script error:", chrome.runtime.lastError.message);
            setState("empty");
            return;
          }

          const items: string[] = response?.items || [];
          if (items.length === 0) {
            setState("empty");
            setInsights([]);
          } else {
            loadInsights(items);
          }
        }
      );
    });
  }, [loadInsights]);

  const retry = () => {
    if (dishNames.length > 0) {
      loadInsights(dishNames);
    }
  };

  const manualSubmit = (dishes: string[]) => {
    loadInsights(dishes);
  };

  return { insights, state, retry, manualSubmit, dishNames, fetchingNew, newCount };
}