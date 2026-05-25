import puppeteer from "puppeteer";
import { scrapeFlipkart } from "./src/scrapers/flipkart.js";

async function run() {
  const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });
  const url = "https://www.flipkart.com/minimalist-10-vitamin-b5-oil-free-face-moisturizer-zinc-copper-ha-oily-skin/p/itma0d920488accf";
  console.log("Testing Flipkart Scraper...");
  
  try {
    const result = await scrapeFlipkart(browser, url, "test-id");
    console.log("RESULT:", result);
  } catch (e) {
    console.error("Error:", e);
  }
  
  await browser.close();
}

run();
