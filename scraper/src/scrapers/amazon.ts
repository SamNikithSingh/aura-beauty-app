import { Browser } from "puppeteer";
import { ScrapedResult } from "../types.js";
import { parsePrice, calcDiscount, withRetry, log } from "../utils/helpers.js";

/**
 * Scrape product data from Amazon India.
 */
export async function scrapeAmazon(
  browser: Browser,
  url: string,
  productId: string
): Promise<ScrapedResult | null> {
  if (!url || url === "#" || !url.includes("amazon")) return null;

  log(`  Scraping Amazon: ${url}`);

  return withRetry(async () => {
    const page = await browser.newPage();
    
    // Rotate User Agents to reduce bot detection
    const userAgents = [
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:122.0) Gecko/20100101 Firefox/122.0"
    ];
    await page.setUserAgent(userAgents[Math.floor(Math.random() * userAgents.length)]);
    
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-IN,en;q=0.9',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
    });

    try {
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 40000 });
      
      // Check for CAPTCHA or Anti-Bot Page
      const isCaptcha = await page.evaluate(() => !!document.querySelector("#captchacharacters") || !!document.querySelector("form[action='/errors/validateCaptcha']"));
      if (isCaptcha) {
        log(`  [Amazon] Captcha detected for ${url}. Throwing error to trigger retry.`, "WARN");
        throw new Error("Amazon CAPTCHA block detected.");
      }

      // Wait for at least one price selector, but don't fail immediately if not found (might be unavailable)
      await page.waitForSelector(".a-price, #corePriceDisplay_desktop_feature_div", { timeout: 8000 }).catch(() => {});

      const data = await page.evaluate(() => {
        // Find the active selling price
        // Exclude crossed out MRP (.a-text-price) to get actual deal price
        const specificPriceEl = document.querySelector(".a-price:not(.a-text-price) .a-offscreen") || 
                                document.querySelector("#corePriceDisplay_desktop_feature_div .a-price-whole") ||
                                document.querySelector("#priceblock_ourprice") ||
                                document.querySelector("#priceblock_dealprice");
                                
        let currentPriceStr = specificPriceEl?.textContent?.trim() || "";

        // Find the original MRP price
        const mrpEl = document.querySelector(".a-price.a-text-price .a-offscreen") || 
                      document.querySelector("#priceblock_strike") ||
                      document.querySelector(".basisPrice .a-offscreen");
                      
        let originalPriceStr = mrpEl?.textContent?.trim() || "";

        const outOfStockEl = document.querySelector("#outOfStock");
        const priceEls = Array.from(document.querySelectorAll(".a-color-price"));
        const hasUnavailableText = priceEls.some(el => el.textContent?.includes("Currently unavailable"));
        const isUnavailable = !!outOfStockEl || hasUnavailableText;
        const inStock = !isUnavailable;

        const imageEl = document.querySelector("#landingImage") || document.querySelector("#imgBlkFront");
        const image = imageEl?.getAttribute("src") || "";

        return { 
          currentPriceStr, 
          originalPriceStr, 
          inStock, 
          image,
          selectorsChecked: {
            specificPriceEl: !!specificPriceEl,
            mrpEl: !!mrpEl,
            unavailable: isUnavailable
          }
        };
      });

      console.log(`[Selector Logs] Amazon ${url}`);
      console.log(`- Selling Price element found: ${data.selectorsChecked.specificPriceEl}`);
      console.log(`- MRP element found: ${data.selectorsChecked.mrpEl}`);
      console.log(`- Unavailable element found: ${data.selectorsChecked.unavailable}`);
      console.log(`- Raw Current Price Str: "${data.currentPriceStr}"`);
      console.log(`- Raw Original Price Str: "${data.originalPriceStr}"`);

      // Price Validation
      let currentPrice = parsePrice(data.currentPriceStr);
      if (!currentPrice || currentPrice <= 1 || currentPrice < 50 || currentPrice > 15000) {
        log(`  Amazon: Invalid or suspicious price parsed (₹${currentPrice}) for ${url}`, "WARN");
        if (!data.selectorsChecked.specificPriceEl && !data.selectorsChecked.unavailable) {
            throw new Error("Could not find valid price selector. Might be dynamic render issue.");
        }
        return null;
      }

      const originalPrice = parsePrice(data.originalPriceStr) || currentPrice;

      return {
        productId,
        storeName: "Amazon",
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
