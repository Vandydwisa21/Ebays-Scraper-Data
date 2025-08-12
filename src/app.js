import express from "express";
import dotenv from "dotenv";
import { scrapeEbayProducts } from "./scraper.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("✅ eBay Scraper API is running. Use /search?keyword=YOUR_KEYWORD");
});

app.get("/search", async (req, res) => {
  try {
    const { keyword, aiProvider, model, limit } = req.query;

    if (!keyword) {
      return res.status(400).json({ error: "❌ Keyword is required" });
    }

    // Panggil scraper dengan AI opsional
    const data = await scrapeEbayProducts(
      keyword,
      aiProvider || null, // default: tanpa AI
      {
        model: model || "facebook/bart-large-cnn",
        limit: limit ? parseInt(limit, 10) : 5
      }
    );

    res.json(data);
  } catch (error) {
    console.error("❌ Error in /search:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
