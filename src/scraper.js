import puppeteer from "puppeteer";
import { cleanDescriptionWithAI } from "./utils.js";

/**
 * Scrape produk dari eBay
 * @param {string} keyword - kata kunci pencarian
 * @param {string|null} aiProvider - provider AI (misal: "huggingface"), null/undefined untuk skip
 * @param {object} options - opsi tambahan (limit, model)
 */
export async function scrapeEbayProducts(keyword, aiProvider = null, options = {}) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(90000);

  const searchUrl = `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(keyword)}`;
  await page.goto(searchUrl, { waitUntil: "domcontentloaded" });

  const products = await page.evaluate(() => {
    const items = [];
    document.querySelectorAll(".s-item").forEach((el) => {
      const title = el.querySelector(".s-item__title")?.innerText || null;
      const price = el.querySelector(".s-item__price")?.innerText || null;
      const link = el.querySelector(".s-item__link")?.href || null;
      if (title && price && link) {
        items.push({ title, price, link });
      }
    });
    return items;
  });

  const slicedProducts = products.slice(0, options.limit || 5);
  const cleanedProducts = [];

  for (const p of slicedProducts) {
    try {
      const detailPage = await browser.newPage();
      await detailPage.goto(p.link, { waitUntil: "networkidle2", timeout: 60000 });

      let rawDescription = "-";
      const selectors = [
        "#viTabs_0_is",
        "#vi-desc-maincntr",
        "[itemprop='description']",
        "#vi-desc-content",
      ];

      for (const selector of selectors) {
        rawDescription = await detailPage
          .$eval(selector, (el) => el.innerText)
          .catch(() => null);
        if (rawDescription) break;
      }

      rawDescription = rawDescription?.trim() || "-";

      // Gunakan AI hanya jika provider diset
      p.description = await cleanDescriptionWithAI(rawDescription, aiProvider, options.model);

      p.itemNumber = await detailPage.$$eval(
        "span.ux-textspans.ux-textspans--BOLD",
        (els) => {
          const match = els.find((el) => /^\d+$/.test(el.textContent));
          return match?.textContent.trim() || "-";
        }
      );

      cleanedProducts.push(p);
      await detailPage.close();
    } catch (err) {
      console.error(`Gagal mengambil detail dari ${p.link}`);
      console.error("Alasan:", err.message);
      p.description = "-";
      p.itemNumber = "-";
      cleanedProducts.push(p);
    }
  }

  await browser.close();

  return {
    keyword,
    total: cleanedProducts.length,
    products: cleanedProducts,
  };
}
