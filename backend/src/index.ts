import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import insightsRouter from "./routes/insights.js";
import { rateLimit } from "./middleware/rateLimit.js";

const app = express();

app.use(cors({ origin: true, methods: ["GET", "POST"], allowedHeaders: ["Content-Type"] }));
app.use(express.json());

// Rate limit only the insights endpoint
app.use("/api/insights", rateLimit, insightsRouter);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// npx tsx --require dotenv/config src/index.ts