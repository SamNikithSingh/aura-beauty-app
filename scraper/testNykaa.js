import puppeteer from "puppeteer";

async function main() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
  );
  
  const url = "https://www.nykaa.com/minimalist-vitamin-b5-10percent-moisturizer/p/18876941?ptype=product&skuId=4524075&srsltid=AfmBOorJyvcfs-goFWz0FnEk8C3oBY8l8ddKGU4NV6wJmXK7DBZrOGXJves";
  console.log("Visiting:", url);
  
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
  
  // Wait a bit for react rendering
  await new Promise(r => setTimeout(r, 3000));
  
  const data = await page.evaluate(() => {
    // Try to find the price section
    const priceParent = document.querySelector(".css-1gc4x7i")?.parentElement?.parentElement?.innerHTML 
      || document.querySelector("[class*='price']")?.parentElement?.parentElement?.innerHTML;
      
    // Nykaa's typical price class is often .css-1jczs19 or .css-111z9ua
    const specificPrice = document.querySelector(".css-1jczs19")?.innerHTML;
    
    // Grab all text containing ₹
    const bodyText = document.body.innerText;
    const linesWithRupee = bodyText.split('\n').filter(line => line.includes('₹')).slice(0, 10);

    return { priceParent, specificPrice, linesWithRupee };
  });
  
  console.log(JSON.stringify(data, null, 2));
  await browser.close();
}

main().catch(console.error);
