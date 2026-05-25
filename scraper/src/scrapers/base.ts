import { StoreScraper } from "../types.js";
import { scrapeNykaa } from "./nykaa.js";
import { scrapeOfficial } from "./official.js";
import { scrapeAmazon } from "./amazon.js";
import { scrapeFlipkart } from "./flipkart.js";

export const SCRAPER_REGISTRY: Record<string, StoreScraper> = {
  nykaa: scrapeNykaa,
  official: scrapeOfficial,
  amazon: scrapeAmazon,
  flipkart: scrapeFlipkart,
};
