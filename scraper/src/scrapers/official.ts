import { Browser } from "puppeteer";
import { ScrapedResult } from "../types.js";
import { parsePrice, calcDiscount, withRetry, log } from "../utils/helpers.js";

/**
 * Generic scraper for Official Brand Websites.
 * Attempts to extract price from JSON-LD schema, meta tags, and common selectors.
 */
export async function scrapeOfficial(
  browser: Browser,
  url: string,
  productId: string
): Promise<ScrapedResult | null> {
  if (!url || url === "#") return null;

  log(`  Scraping Official Store: ${url}`);

  return withRetry(async () => {
    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    );

    try {
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
      
      const data = await page.evaluate(() => {
        let currentPriceStr = "";
        let originalPriceStr = "";
        let image = "";
        let inStock = true;

        // 1. Try to find JSON-LD Product Schema
        const scripts = document.querySelectorAll('script[type="application/ld+json"]');
        for (const script of scripts) {
          try {
            const json = JSON.parse(script.textContent || "{}");
            const schemas = Array.isArray(json) ? json : [json];
            
            for (const schema of schemas) {
              if (schema["@type"] === "Product" || schema["@type"] === "ProductGroup") {
                if (schema.image && !image) {
                  image = Array.isArray(schema.image) ? schema.image[0] : schema.image;
                }
                
                let offers = schema.offers;
                if (offers) {
                  const offerArr = Array.isArray(offers) ? offers : [offers];
                  for (const offer of offerArr) {
                    if (offer && offer.price) {
                      const num = typeof offer.price === 'string' ? parseFloat(offer.price.replace(/[^\d.]/g, "")) : offer.price;
                      if (!isNaN(num) && num > 35 && num <= 10000) {
                        currentPriceStr = String(offer.price);
                        if (offer.availability) {
                          inStock = offer.availability.includes("InStock");
                        }
                        break; // Found a valid offer
                      }
                    }
                  }
                }
              }
            }
          } catch (e) {
            // Ignore parse errors
          }
        }

        // 2. Fallback to Meta Tags
        if (!currentPriceStr) {
           const metaPrice = document.querySelector('meta[property="product:price:amount"]');
           if (metaPrice) {
              const content = metaPrice.getAttribute("content");
              if (content) {
                 const num = parseFloat(content.replace(/[^\d.]/g, ""));
                 if (!isNaN(num) && num > 35 && num <= 10000) {
                    currentPriceStr = content;
                 }
              }
           }
        }

        // 3. Fallback to generic DOM Selectors
        if (!currentPriceStr) {
          const priceSelectors = [
            '[itemprop="price"]',
            '.price',
            '#price',
            '.current-price',
            '.product-price',
            '[class*="price"]'
          ];

          for (const selector of priceSelectors) {
            const elements = document.querySelectorAll(selector);
            for (const el of elements) {
               const text = el.textContent?.toLowerCase() || "";
               // Filter out shipping, emi, sample, mini, discount, save, off, tax
               if (text.includes("emi") || text.includes("shipping") || text.includes("sample") || text.includes("mini") || text.includes("delivery") || text.includes("discount") || text.includes("save") || text.includes("off") || text.includes("tax")) {
                  continue; 
               }
               
               const match = el.textContent?.match(/[\d,.]+/);
               if (match && match[0]) {
                 const num = parseFloat(match[0].replace(/[^\d.]/g, ""));
                 if (!isNaN(num) && num > 35 && num <= 10000) {
                   currentPriceStr = match[0];
                   break;
                 }
               }
            }
            if (currentPriceStr) break;
          }
        }

        // 4. Fallback for original price (MRP)
        const mrpSelectors = [
          '.compare-at-price',
          '.old-price',
          '.original-price',
          '[class*="strike"]',
          's',
          'del'
        ];
        
        for (const selector of mrpSelectors) {
          const el = document.querySelector(selector);
          if (el && el.textContent) {
            const match = el.textContent.match(/[\d,.]+/);
            if (match && match[0]) {
              const num = parseFloat(match[0].replace(/[^\d.]/g, ""));
              if (!isNaN(num) && num > 35 && num <= 10000) {
                originalPriceStr = match[0];
                break;
              }
            }
          }
        }

        // 5. Fallback for image
        if (!image) {
          const imgEl = document.querySelector('meta[property="og:image"]');
          if (imgEl) {
            image = imgEl.getAttribute('content') || "";
          } else {
            const img = document.querySelector('.product-image img, #product-image img');
            if (img) image = img.getAttribute('src') || "";
          }
        }

        // 6. Fallback for stock status
        const outOfStockText = ['out of stock', 'sold out', 'unavailable'];
        if (currentPriceStr) {
           const btn = document.querySelector('button[name="add"], .add-to-cart, #add-to-cart');
           if (btn) {
              const text = btn.textContent?.toLowerCase() || '';
              if (outOfStockText.some(t => text.includes(t)) || btn.hasAttribute('disabled')) {
                 inStock = false;
              }
           }
        }

        return {
          currentPriceStr,
          originalPriceStr,
          inStock,
          image
        };
      });

      console.log(`[Official Store Logs] ${url}`);
      console.log(`- Raw Current Price Str: "${data.currentPriceStr}"`);
      console.log(`- Raw Original Price Str: "${data.originalPriceStr}"`);
      console.log(`- In Stock: ${data.inStock}`);

      const currentPrice = parsePrice(data.currentPriceStr);
      if (!currentPrice || currentPrice <= 35 || currentPrice > 10000) {
        log(`  Official Store: Could not parse a valid price within range [35, 10000] for ${url}. Extracted: ${currentPrice}`, "WARN");
        return null; // Strict Validation Failed
      }

      const originalPrice = parsePrice(data.originalPriceStr) || currentPrice;
      const storeName = new URL(url).hostname.replace('www.', '');

      return {
        productId,
        storeName,
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
