import { Browser } from "puppeteer";
import { ScrapedResult } from "../types.js";
import { parsePrice, calcDiscount, withRetry, log } from "../utils/helpers.js";

/**
 * Scrape product data from Nykaa.
 */
export async function scrapeNykaa(
  browser: Browser,
  url: string,
  productId: string
): Promise<ScrapedResult | null> {
  if (!url || url === "#" || !url.includes("nykaa")) return null;

  log(`  Scraping Nykaa: ${url}`);

  return withRetry(async () => {
    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    );

    try {
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
      
      // Wait for price selectors
      await page.waitForSelector(".css-1gc4x7i, .css-17x46si, [class*='price']", { timeout: 10000 }).catch(() => {});

      const data = await page.evaluate(() => {
        // Nykaa uses dynamic class names, try multiple patterns
        // .css-1jczs19 usually contains exactly the selling price (e.g. ₹349)
        const specificPriceEl = document.querySelector(".css-1jczs19");
        let currentPriceStr = "";
        
        if (specificPriceEl) {
          currentPriceStr = specificPriceEl.textContent?.trim() || "";
        } else {
          // Fallback: get the first price-looking string from the broader price info container
          const priceInfoEl = document.querySelector(".css-1gc4x7i") || document.querySelector("[class*='price-info']");
          if (priceInfoEl && priceInfoEl.textContent) {
            // Find the first occurrence of ₹ followed by numbers
            const match = priceInfoEl.textContent.match(/₹[\d,.]+/);
            if (match) currentPriceStr = match[0];
          }
        }

        const mrpEl =
          document.querySelector("[class*='strike-through']") ||
          document.querySelector(".css-17x46si") ||
          document.querySelector("[class*='original-price']");
        const originalPriceStr = mrpEl?.textContent?.trim() || "";

        const inStock = !document.querySelector("[class*='out-of-stock']");
        const imageEl = document.querySelector(".product-image img") || document.querySelector("img[class*='product']");
        const image = imageEl?.getAttribute("src") || "";

        return { 
          currentPriceStr, 
          originalPriceStr, 
          inStock, 
          image,
          selectorsChecked: {
            specificPriceEl: !!specificPriceEl,
            priceInfoEl: !!(document.querySelector(".css-1gc4x7i") || document.querySelector("[class*='price-info']")),
            mrpEl: !!mrpEl
          }
        };
      });

      console.log(`[Selector Logs] ${url}`);
      console.log(`- Specific Price (.css-1jczs19) found: ${data.selectorsChecked.specificPriceEl}`);
      console.log(`- Price Info (.css-1gc4x7i or price-info) found: ${data.selectorsChecked.priceInfoEl}`);
      console.log(`- MRP found: ${data.selectorsChecked.mrpEl}`);
      console.log(`- Raw Current Price Str: "${data.currentPriceStr}"`);
      console.log(`- Raw Original Price Str: "${data.originalPriceStr}"`);

      const currentPrice = parsePrice(data.currentPriceStr);
      if (!currentPrice || currentPrice <= 35 || currentPrice > 15000) {
        log(`  Nykaa: Invalid or suspicious price parsed (₹${currentPrice}) for ${url}`, "WARN");
        return null;
      }

      const originalPrice = parsePrice(data.originalPriceStr) || currentPrice;

      return {
        productId,
        storeName: "Nykaa",
        productUrl: url,
        currentPrice,
        originalPrice,
        discountPercent: calcDiscount(currentPrice, originalPrice),
        inStock: data.inStock,
        productImage: data.image || null,
      };
    } finally {
      await page.close();
    }
  });
}
