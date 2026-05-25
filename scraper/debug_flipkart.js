import puppeteer from "puppeteer";
import fs from "fs";

async function run() {
  const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });
  const page = await browser.newPage();
  
  await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
  await page.setExtraHTTPHeaders({
    'Accept-Language': 'en-IN,en;q=0.9',
  });

  const url = "https://www.flipkart.com/minimalist-10-vitamin-b5-oil-free-face-moisturizer-zinc-copper-ha-oily-skin/p/itma0d920488accf";
  console.log(`Visiting ${url}`);
  await page.goto(url, { waitUntil: "networkidle2", timeout: 45000 });
  
  const content = await page.content();
  fs.writeFileSync("flipkart_debug.html", content);
  console.log("Saved DOM to flipkart_debug.html");
  
  // Try to find the title
  const title = await page.title();
  console.log("Title: " + title);
  
  // Look for ₹ symbols to try and spot price classes
  const priceElements = await page.evaluate(() => {
     const elements = Array.from(document.querySelectorAll('*'));
     return elements.filter(el => 
        el.textContent && 
        el.textContent.includes('₹') && 
        el.children.length === 0 &&
        el.textContent.length < 15
     ).map(el => ({
        text: el.textContent,
        className: el.className,
        tagName: el.tagName
     })).slice(0, 10);
  });
  
  console.log("Found possible price elements:", priceElements);
  
  await browser.close();
}

run().catch(console.error);
