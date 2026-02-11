import { DishInsight } from "../popup/types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export async function fetchInsights(dishes: string[]): Promise<DishInsight[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);

  try {
    const res = await fetch(`${API_URL}/api/insights`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dishes }),
      signal: controller.signal,
    });

    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }

    const data = await res.json();
    return data.insights || [];
  } finally {
    clearTimeout(timeout);
  }
}

// Fire-and-forget ping to wake up Render free tier
export function pingHealth(): void {
  fetch(`${API_URL}/health`).catch(() => {
    // Silently ignore — just warming up
  });
}