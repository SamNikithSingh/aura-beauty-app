import { Browser } from "puppeteer";

export interface Product {
  id: string;
  product_name: string;
  category: string;
  amazon_url: string | null;
  nykaa_url: string | null;
  official_url: string | null;
  flipkart_url: string | null;
  other_urls: string | null;
  created_at: string;
  image_url: string | null;
  nykaa_price: string | null;
  official_price: string | null;
  amazon_price: string | null;
  flipkart_price: string | null;
  nykaa_last_updated: string | null;
  official_last_updated: string | null;
  amazon_last_updated: string | null;
  flipkart_last_updated: string | null;
}

export interface ScrapedResult {
  productId: string;
  storeName: string;
  currentPrice: number;
  originalPrice: number;
  discountPercent: number;
  productUrl: string;
  inStock: boolean;
  productImage: string | null;
}

export type StoreScraper = (
  browser: Browser,
  url: string,
  productId: string
) => Promise<ScrapedResult | null>;
