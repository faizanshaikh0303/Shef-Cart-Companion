import { Request, Response, NextFunction } from "express";

const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS = 60; // 60 requests per hour

const requestCounts = new Map<string, { count: number; resetAt: number }>();

// Clean up expired entries every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of requestCounts) {
    if (now > value.resetAt) {
      requestCounts.delete(key);
    }
  }
}, 10 * 60 * 1000);

export function rateLimit(req: Request, res: Response, next: NextFunction): void {
  const ip = req.ip || req.headers["x-forwarded-for"] || "unknown";
  const key = typeof ip === "string" ? ip : String(ip);
  const now = Date.now();

  const record = requestCounts.get(key);

  if (!record || now > record.resetAt) {
    requestCounts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    next();
    return;
  }

  if (record.count >= MAX_REQUESTS) {
    res.status(429).json({
      error: "Rate limit exceeded. Try again later.",
      retryAfter: Math.ceil((record.resetAt - now) / 1000),
    });
    return;
  }

  record.count++;
  next();
}