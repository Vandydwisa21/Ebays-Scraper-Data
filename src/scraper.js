import puppeteer from "puppeteer";
import { cleanDescriptionWithAI } from "./utils.js";


// User agents untuk rotasi
const userAgents = [
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/121.0",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
];

// Default eBay session cookies dengan session ID yang baru
const DEFAULT_COOKIES = [
  {"domain":".ebay.com","hostOnly":false,"httpOnly":true,"name":"s","path":"/","sameSite":"unspecified","secure":true,"session":true,"storeId":"0","value":"CgAD4ACBonI7uOWU2N2Y4ZDYxOTgwYTUxNmE1YTI1YjhjZmZmYmNmOGSXxcBL"},
  {"domain":".ebay.com","hostOnly":false,"httpOnly":false,"name":"ebay","path":"/","sameSite":"unspecified","secure":true,"session":true,"storeId":"0","value":"%5Esbf%3D%23000000%5E"},
  {"domain":".ebay.com","expirationDate":1770556279.038283,"hostOnly":false,"httpOnly":false,"name":"__uzma","path":"/","sameSite":"unspecified","secure":false,"session":false,"storeId":"0","value":"2de30aed-0cde-4bcf-bafd-6441af50dcec"},
  {"domain":".ebay.com","expirationDate":1770556279.038367,"hostOnly":false,"httpOnly":false,"name":"__uzmb","path":"/","sameSite":"unspecified","secure":false,"session":false,"storeId":"0","value":"1755004270"},
  {"domain":".ebay.com","expirationDate":1770556279.038563,"hostOnly":false,"httpOnly":false,"name":"__uzme","path":"/","sameSite":"unspecified","secure":false,"session":false,"storeId":"0","value":"9261"},
  {"domain":".ebay.com","expirationDate":1755011471.057929,"hostOnly":false,"httpOnly":false,"name":"ak_bmsc","path":"/","sameSite":"unspecified","secure":false,"session":false,"storeId":"0","value":"D511C26FC665DC0B5B973BECE269BB93~000000000000000000000000000000~YAAQzgfUF3R+dZ2YAQAAZflnnhyOcXvPq/7mXzfaHL3rUI017nhWgGa+s8af6HiUsPsja7mhKvsh6oAe4eUEzfBIAA2QGeVzpmqzLdF8WBfmBJrV9erGVgYyIyBz6qCNqbhlJm9tzVSIEJ1WokDobV13Lr3VQ3FAw6cqerO3paa24idvD5PpL+vJJlHUSOKs4uR/O/zZuukKyahOlH50LBj81TPCiDSLG1Iw6wXf2YnQg7VsN6Gd2xxNn2BgEZi4SJR61TV9kNTEEIt3VC9FRf+gghC30YkAf5bD2D+py5hDY7VnCmKLsn5+nyFidVCIdcELeJEub02n96BrMmDAal0VKF9+k5Ml5ho5lqidDcA6K3ZTrD+Mk6/s6AD9aKinHzPAHYhC9UvNFEo="},
  {"domain":".ebay.com","expirationDate":1770556274,"hostOnly":false,"httpOnly":false,"name":"__ssds","path":"/","sameSite":"unspecified","secure":false,"session":false,"storeId":"0","value":"2"},
  {"domain":".ebay.com","expirationDate":1770556277,"hostOnly":false,"httpOnly":false,"name":"__ssuzjsr2","path":"/","sameSite":"unspecified","secure":false,"session":false,"storeId":"0","value":"a9be0cd8e"},
  {"domain":".ebay.com","expirationDate":1770556277,"hostOnly":false,"httpOnly":false,"name":"__uzmaj2","path":"/","sameSite":"unspecified","secure":false,"session":false,"storeId":"0","value":"ab431122-3aa2-4cfc-9286-6d02b88e6260"},
  {"domain":".ebay.com","expirationDate":1770556277,"hostOnly":false,"httpOnly":false,"name":"__uzmbj2","path":"/","sameSite":"unspecified","secure":false,"session":false,"storeId":"0","value":"1755004276"},
  {"domain":".ebay.com","expirationDate":1770556277,"hostOnly":false,"httpOnly":false,"name":"__uzmcj2","path":"/","sameSite":"unspecified","secure":false,"session":false,"storeId":"0","value":"542781071420"},
  {"domain":".ebay.com","expirationDate":1770556277,"hostOnly":false,"httpOnly":false,"name":"__uzmdj2","path":"/","sameSite":"unspecified","secure":false,"session":false,"storeId":"0","value":"1755004276"},
  {"domain":".ebay.com","expirationDate":1770556277,"hostOnly":false,"httpOnly":false,"name":"__uzmlj2","path":"/","sameSite":"unspecified","secure":false,"session":false,"storeId":"0","value":"IBAfBmb4h6clP157YfJayEIv08n+cWndz2dFb0GvQs4="},
  {"domain":".ebay.com","expirationDate":1770556277,"hostOnly":false,"httpOnly":false,"name":"__uzmfj2","path":"/","sameSite":"unspecified","secure":false,"session":false,"storeId":"0","value":"7f600086b4c272-4fea-41d1-a747-69d9c1418ea517550042765690-19ccabc7cf20987610"},
  {"domain":".ebay.com","expirationDate":1789564279.037702,"hostOnly":false,"httpOnly":true,"name":"nonsession","path":"/","sameSite":"unspecified","secure":true,"session":false,"storeId":"0","value":"BAQAAAZhdx0gSAAaAADMABWp8cPY2MDYyOQDKACBsXaR2OWU2N2Y4ZDYxOTgwYTUxNmE1YTI1YjhjZmZmYmNmOGQAywABaJtEfjFTkDXLC0/ljqjJyo5tertOAoLoxw**"},
  {"domain":".ebay.com","expirationDate":1789564279.038008,"hostOnly":false,"httpOnly":false,"name":"dp1","path":"/","sameSite":"unspecified","secure":true,"session":false,"storeId":"0","value":"bbl/US6c5da476^"},
  {"domain":".ebay.com","expirationDate":1786540279.038154,"hostOnly":false,"httpOnly":true,"name":"ns1","path":"/","sameSite":"unspecified","secure":true,"session":false,"storeId":"0","value":"BAQAAAZhdx0gSAAaAANgAU2p8cPZjNjl8NjAxXjE3NTUwMDQyNzA4NzFeXjFeM3wyfDV8NHw3fDEwfDQyfDQzfDExXl5eNF4zXjEyXjEyXjJeMV4xXjBeMV4wXjFeNjQ0MjQ1OTA3Nd7R3DJfp3IslkhpJds16HooCfXO"},
  {"domain":".ebay.com","expirationDate":1770556279.038447,"hostOnly":false,"httpOnly":false,"name":"__uzmc","path":"/","sameSite":"unspecified","secure":false,"session":false,"storeId":"0","value":"666281313249"},
  {"domain":".ebay.com","expirationDate":1770556279.038507,"hostOnly":false,"httpOnly":false,"name":"__uzmd","path":"/","sameSite":"unspecified","secure":false,"session":false,"storeId":"0","value":"1755004278"},
  {"domain":".ebay.com","expirationDate":1770556279.038611,"hostOnly":false,"httpOnly":false,"name":"__uzmf","path":"/","sameSite":"unspecified","secure":false,"session":false,"storeId":"0","value":"7f600086b4c272-4fea-41d1-a747-69d9c1418ea517550042707808104-a47529c03431ac0913"},
  {"domain":".ebay.com","hostOnly":false,"httpOnly":false,"name":"autotrack_tab_id","path":"/","sameSite":"unspecified","secure":false,"session":true,"storeId":"0","value":"9817a9fd-b998-43d6-95bb-76133a30a5b7"},
  {"domain":".ebay.com","hostOnly":false,"httpOnly":false,"name":"ebay-rum-session-id","path":"/","sameSite":"unspecified","secure":false,"session":true,"storeId":"0","value":"ef3e2a18-ba8b-4ed4-b4c8-915961a4c5dc"}
];

// Fungsi untuk mendapatkan user agent acak
function getRandomUserAgent() {
  return userAgents[Math.floor(Math.random() * userAgents.length)];
}

// Fungsi untuk setup default cookies
async function setupDefaultCookies(page) {
  try {
    const cookies = DEFAULT_COOKIES.map(cookie => ({
      name: cookie.name,
      value: cookie.value,
      domain: cookie.domain,
      path: cookie.path,
      expires: cookie.expirationDate ? cookie.expirationDate * 1000 : undefined,
      httpOnly: cookie.httpOnly,
      secure: cookie.secure,
      sameSite: cookie.sameSite === 'unspecified' ? 'Lax' : cookie.sameSite
    }));
    
    await page.setCookie(...cookies);
    console.log(`🍪 ${cookies.length} default cookies berhasil diset`);
  } catch (error) {
    console.error("❌ Error setting default cookies:", error.message);
  }
}
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
      console.error(`❌ Gagal mengambil detail dari ${p.link}`);
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
