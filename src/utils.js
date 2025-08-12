import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

/**
 * Bersihkan atau ringkas deskripsi menggunakan AI (opsional)
 * @param {string} text - teks asli
 * @param {string|null} aiProvider - nama provider AI (misal: "huggingface"), null/undefined untuk skip
 * @param {string} model - nama model AI (default: facebook/bart-large-cnn)
 * @returns {Promise<string>}
 */
export async function cleanDescriptionWithAI(text, aiProvider = null, model = "facebook/bart-large-cnn") {
  const rawText = text?.trim() || "-";

  // Skip AI cleaning kalau tidak ada provider
  if (!aiProvider || aiProvider.toLowerCase() !== "huggingface") {
    console.log("⚪ AI cleaning dilewati, menggunakan deskripsi asli.");
    return rawText;
  }

  try {
    console.log("🟡 AI: HuggingFace digunakan");

    const response = await axios.post(
      `https://api-inference.huggingface.co/models/${model}`,
      { inputs: rawText },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 60000,
      }
    );

    if (response.data && Array.isArray(response.data) && response.data[0]?.summary_text) {
      return response.data[0].summary_text.trim();
    }

    return rawText;
  } catch (error) {
    console.error("❌ Error in AI description cleaning:", error.message);
    return rawText;
  }
}
