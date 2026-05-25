import "dotenv/config";
import puppeteer from "puppeteer";
import { getProducts, updateProductPrice } from "./src/utils/supabase.js";
import { scrapeNykaa } from "./src/scrapers/nykaa.js";
import { log } from "./src/utils/helpers.js";

async function testSingleProduct() {
  log("=== Testing Single Product Scraper ===");
  
  const products = await getProducts();
  const product = products.find(p => p.nykaa_url && p.nykaa_url.includes("minimalist"));
  
  if (!product) {
    log("Could not find Minimalist product in DB.", "ERROR");
    return;
  }
  
  log(`Found product to test: ${product.product_name} (ID: ${product.id})`);
  log(`URL: ${product.nykaa_url}`);
  
  const browser = await puppeteer.launch({ headless: true });
  
  try {
    log("Scraping price...");
    const result = await scrapeNykaa(browser, product.nykaa_url!, product.id);
    
    if (result && result.currentPrice) {
      log(`✅ Extracted correct price: ₹${result.currentPrice}`);
      log("Attempting to update Supabase...");
      
      const timestamp = new Date().toISOString();
      await updateProductPrice(product.id, result.currentPrice, timestamp);
      log("✨ Supabase update successful!");
    } else {
      log("❌ Failed to extract price.", "ERROR");
    }
  } catch (err: any) {
    log(`❌ Error during test: ${err.message}`, "ERROR");
  } finally {
    await browser.close();
  }
}

testSingleProduct().catch(console.error);
