import { Browser } from "puppeteer";
import { ScrapedResult } from "../types.js";
import { parsePrice, calcDiscount, withRetry, log } from "../utils/helpers.js";

/**
 * Scrape product data from Flipkart.
 */
export async function scrapeFlipkart(
  browser: Browser,
  url: string,
  productId: string
): Promise<ScrapedResult | null> {
  if (!url || url === "#" || !url.includes("flipkart")) return null;

  log(`  Scraping Flipkart: ${url}`);

  return withRetry(async () => {
    const page = await browser.newPage();
    
    // Rotate User Agents
    const userAgents = [
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    ];
    await page.setUserAgent(userAgents[Math.floor(Math.random() * userAgents.length)]);
    
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-IN,en;q=0.9',
    });

    try {
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 40000 });
      
      // Wait for price selector
      await page.waitForSelector(".Nx9bqj.CxhGGd, div[class*='Nx9bqj'], ._30jeq3, div[class*='v1zwn20'], div[class*='v1zwn21l']", { timeout: 8000 }).catch(() => {});

      const data = await page.evaluate(() => {
        // Find the active selling price
        const specificPriceEl = document.querySelector(".Nx9bqj.CxhGGd") || 
                                document.querySelector("div[class*='Nx9bqj']") ||
                                document.querySelector("._30jeq3._16Jk6d") ||
                                document.querySelector("div[class*='v1zwn20']") ||
                                document.querySelector("div.v1zwn21l");
                                
        let currentPriceStr = specificPriceEl?.textContent?.trim() || "";

        // Find the original MRP price
        const mrpEl = document.querySelector(".yRaY8j.A6E8dR") || 
                      document.querySelector("div[class*='yRaY8j']") ||
                      document.querySelector("._3I9_wc._2p6lqe") ||
                      document.querySelector("div[class*='v1zwn28']");
                      
        let originalPriceStr = mrpEl?.textContent?.trim() || "";

        const outOfStockEl = document.querySelector(".Z86-1m") || document.querySelector("button.QqFHMw.aG7c01") || document.querySelector("._16FRp0");
        const isUnavailable = outOfStockEl?.textContent?.toLowerCase().includes("sold out") || outOfStockEl?.textContent?.toLowerCase().includes("notify me");
        const inStock = !isUnavailable;

        const imageEl = document.querySelector("img.DByuf4") || document.querySelector("img.v2s15H") || document.querySelector("img[class*='_396cs4']");
        const image = imageEl?.getAttribute("src") || "";

        return { 
          currentPriceStr, 
          originalPriceStr, 
          inStock, 
          image,
          selectorsChecked: {
            specificPriceEl: !!specificPriceEl,
            mrpEl: !!mrpEl,
            unavailable: !!isUnavailable
          }
        };
      });

      console.log(`[Selector Logs] Flipkart ${url}`);
      console.log(`- Selling Price element found: ${data.selectorsChecked.specificPriceEl}`);
      console.log(`- MRP element found: ${data.selectorsChecked.mrpEl}`);
      console.log(`- Raw Current Price Str: "${data.currentPriceStr}"`);
      console.log(`- Raw Original Price Str: "${data.originalPriceStr}"`);

      // Price Validation
      let currentPrice = parsePrice(data.currentPriceStr);
      if (!currentPrice || currentPrice <= 1) {
        log(`  Flipkart: Invalid or suspicious price parsed for ${url}`, "WARN");
        if (!data.selectorsChecked.specificPriceEl) {
            throw new Error("Could not find valid price selector.");
        }
        return null;
      }

      const originalPrice = parsePrice(data.originalPriceStr) || currentPrice;

      return {
        productId,
        storeName: "Flipkart",
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
