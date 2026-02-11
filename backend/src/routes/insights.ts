import { Router, Request, Response } from "express";
import { getDishInsights } from "../services/groq.js";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  const { dishes } = req.body; // string[]
  if (!dishes?.length) return res.status(400).json({ error: "No dishes provided" });
  if (dishes.length > 10) return res.status(400).json({ error: "Max 10 dishes" });

  try {
    const insights = await getDishInsights(dishes);
    res.json({ insights });
  } catch (err) {
    console.error("Groq error:", err);
    res.status(500).json({ error: "Failed to get insights" });
  }
});

export default router;