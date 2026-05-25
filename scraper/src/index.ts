import "dotenv/config";
import puppeteer from "puppeteer";
import { getProducts, updateStorePrice } from "./utils/supabase.js";
import { SCRAPER_REGISTRY } from "./scrapers/base.js";
import { log, sleep } from "./utils/helpers.js";

const isDryRun = process.argv.includes("--dry-run");

async function main() {
  log("=== Aura Beauty Scraper Orchestrator (TypeScript Foundation) ===");
  if (isDryRun) {
    log("Running in DRY-RUN mode. No database updates will be committed.");
  }

  let browser;
  try {
    const products = await getProducts();
    if (products.length === 0) {
      log("No products found in the database.");
      return;
    }

    log(`Loaded ${products.length} products from the database.`);

    // Check if we have any products to scrape (have Nykaa, Official, Amazon, or Flipkart URLs)
    const scrapeableProducts = products.filter(
      (p) => 
        (p.nykaa_url && p.nykaa_url !== "#" && p.nykaa_url.trim() !== "") ||
        (p.official_url && p.official_url !== "#" && p.official_url.trim() !== "") ||
        (p.amazon_url && p.amazon_url !== "#" && p.amazon_url.trim() !== "") ||
        (p.flipkart_url && p.flipkart_url !== "#" && p.flipkart_url.trim() !== "")
    );

    if (scrapeableProducts.length === 0) {
      log("No products with valid scrapeable URLs found. Skipping run.");
      return;
    }

    log(`Found ${scrapeableProducts.length} products to scrape.`);

    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const stats = {
      total: scrapeableProducts.length,
      successes: 0,
      failures: 0,
      failedDomains: new Set<string>()
    };

    for (const product of scrapeableProducts) {
      log(`\n📦 Processing: ${product.product_name} (ID: ${product.id})`);
      
      // 1. Try Nykaa
      try {
        if (product.nykaa_url && product.nykaa_url !== "#" && product.nykaa_url.trim() !== "") {
          log(`  🔍 Trying Nykaa URL...`);
          const nykaaScraper = SCRAPER_REGISTRY.nykaa;
          const result = await nykaaScraper(browser, product.nykaa_url, product.id);
          
          if (result && result.currentPrice && result.inStock) {
            log(`  ✅ Nykaa Price Extracted: ₹${result.currentPrice}`);
            stats.successes++;

            if (!isDryRun) {
              const timestamp = new Date().toISOString();
              await updateStorePrice(product.id, "nykaa", result.currentPrice, timestamp);
              log(`  ✨ Updated DB nykaa_price to ₹${result.currentPrice}`);
            } else {
              log(`  [Dry Run] Would update DB nykaa_price to ₹${result.currentPrice}`);
            }
          } else {
            log(`  ⚠️ Nykaa failed, out of stock, or returned no price.`, "WARN");
            stats.failures++;
          }
        }
      } catch (err: any) {
        log(`  ❌ Failed to process Nykaa for product ${product.product_name}: ${err.message}`, "ERROR");
        stats.failures++;
      }

      // 2. Try Official Store independently
      try {
        if (product.official_url && product.official_url !== "#" && product.official_url.trim() !== "") {
          log(`  🔍 Trying Official Store URL...`);
          const officialScraper = SCRAPER_REGISTRY.official;
          const result = await officialScraper(browser, product.official_url, product.id);
          
          if (result && result.currentPrice && result.inStock) {
            log(`  ✅ Official Store Price Extracted: ₹${result.currentPrice}`);
            stats.successes++;

            if (!isDryRun) {
              const timestamp = new Date().toISOString();
              await updateStorePrice(product.id, "official", result.currentPrice, timestamp);
              log(`  ✨ Updated DB official_price to ₹${result.currentPrice}`);
            } else {
              log(`  [Dry Run] Would update DB official_price to ₹${result.currentPrice}`);
            }
          } else {
            log(`  ⚠️ Official Store failed, out of stock, or returned no price.`, "WARN");
            stats.failures++;
            
            // Record failure
            if (product.official_url) {
               try {
                  const domain = new URL(product.official_url).hostname;
                  stats.failedDomains.add(domain);
               } catch (e) {}
            }
          }
        }
      } catch (err: any) {
        log(`  ❌ Failed to process Official Store for product ${product.product_name}: ${err.message}`, "ERROR");
        stats.failures++;
      }

      // 3. Try Amazon independently
      try {
        if (product.amazon_url && product.amazon_url !== "#" && product.amazon_url.trim() !== "") {
          log(`  🔍 Trying Amazon URL...`);
          const amazonScraper = SCRAPER_REGISTRY.amazon;
          const result = await amazonScraper(browser, product.amazon_url, product.id);
          
          if (result && result.currentPrice && result.inStock) {
            log(`  ✅ Amazon Price Extracted: ₹${result.currentPrice}`);
            stats.successes++;

            if (!isDryRun) {
              const timestamp = new Date().toISOString();
              await updateStorePrice(product.id, "amazon", result.currentPrice, timestamp);
              log(`  ✨ Updated DB amazon_price to ₹${result.currentPrice}`);
            } else {
              log(`  [Dry Run] Would update DB amazon_price to ₹${result.currentPrice}`);
            }
          } else {
            log(`  ⚠️ Amazon failed, out of stock, or returned no price.`, "WARN");
            stats.failures++;
          }
        }
      } catch (err: any) {
        log(`  ❌ Failed to process Amazon for product ${product.product_name}: ${err.message}`, "ERROR");
        stats.failures++;
      }

      // 4. Try Flipkart independently
      try {
        if (product.flipkart_url && product.flipkart_url !== "#" && product.flipkart_url.trim() !== "") {
          log(`  🔍 Trying Flipkart URL...`);
          const flipkartScraper = SCRAPER_REGISTRY.flipkart;
          const result = await flipkartScraper(browser, product.flipkart_url, product.id);
          
          if (result && result.currentPrice && result.inStock) {
            log(`  ✅ Flipkart Price Extracted: ₹${result.currentPrice}`);
            stats.successes++;

            if (!isDryRun) {
              const timestamp = new Date().toISOString();
              await updateStorePrice(product.id, "flipkart", result.currentPrice, timestamp);
              log(`  ✨ Updated DB flipkart_price to ₹${result.currentPrice}`);
            } else {
              log(`  [Dry Run] Would update DB flipkart_price to ₹${result.currentPrice}`);
            }
          } else {
            log(`  ⚠️ Flipkart failed, out of stock, or returned no price.`, "WARN");
            stats.failures++;
          }
        }
      } catch (err: any) {
        log(`  ❌ Failed to process Flipkart for product ${product.product_name}: ${err.message}`, "ERROR");
        stats.failures++;
      }

      // Respectful delay between requests
      await sleep(2000);
    }
    
    // Print Final Summary Report
    log(`\n=========================================`);
    log(`📊 EXTRACTION SUMMARY REPORT`);
    log(`=========================================`);
    log(`Total Processed: ${stats.total}`);
    log(`Successful Extractions: ${stats.successes}`);
    log(`Failed Extractions: ${stats.failures}`);
    
    if (stats.failedDomains.size > 0) {
       log(`\n⚠️ Failed Official Store Domains:`);
       stats.failedDomains.forEach(domain => {
          log(`   - ${domain}`);
       });
       log(`   (Consider adding custom scraper logic for these domains if they don't support JSON-LD or standard HTML classes)`);
    }
    log(`=========================================\n`);
  } catch (err: any) {
    log(`Fatal Scraper Error: ${err.message}`, "ERROR");
  } finally {
    if (browser) {
      await browser.close();
    }
    log("\n=== Aura Scraper Run Complete ===");
  }
}

main().catch((err) => {
  log(`Unhandled promise rejection in main: ${err.message}`, "ERROR");
});
