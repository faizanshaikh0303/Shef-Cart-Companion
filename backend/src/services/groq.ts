import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export interface DishInsight {
  dishName: string;
  vibeProfile: string;
  funFact: string;
  pairing: string;
}

export async function getDishInsights(
  dishNames: string[]
): Promise<DishInsight[]> {
  const prompt = `You are a fun, witty food culture expert. For each dish below, provide exactly 3 things in JSON format:

1. "vibeProfile": A short taste/vibe profile (max 8 words). Include 1-2 emojis. Describe the flavor personality and cultural vibe. Examples: "🌶️ Bold & Smoky | South Indian Soul Food", "🍋 Bright & Herby | Mediterranean Sunshine"

2. "funFact": ONE sentence fun fact — could be history, health benefit, cultural significance, or a surprising origin story. Make it genuinely interesting and not generic.

3. "pairing": A specific, easily available drink or pantry item pairing for the best experience. Be specific, not generic. Examples: "🥛 Cold lassi with a pinch of cardamom", "🍺 A chilled wheat beer like Blue Moon"

Dishes: ${JSON.stringify(dishNames)}

Respond ONLY with a valid JSON array of objects. No markdown, no explanation, no wrapping object.
Example format:
[{"dishName": "Dish 1", "vibeProfile": "...", "funFact": "...", "pairing": "..."}, {"dishName": "Dish 2", "vibeProfile": "...", "funFact": "...", "pairing": "..."}]`;

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.8,
    max_tokens: 1024,
  });

  const raw = completion.choices[0]?.message?.content || "[]";

  // Clean markdown fences if present
  const cleaned = raw.replace(/```json\s?/g, "").replace(/```/g, "").trim();

  const parsed = JSON.parse(cleaned);

  // Handle all possible response shapes
  if (Array.isArray(parsed)) {
    return parsed;
  }

  if (parsed.insights) {
    return Array.isArray(parsed.insights) ? parsed.insights : [parsed.insights];
  }

  if (parsed.dishes) {
    return Array.isArray(parsed.dishes) ? parsed.dishes : [parsed.dishes];
  }

  // Single object with dishName
  if (parsed.dishName) {
    return [parsed];
  }

  return [];
}