import cron from "node-cron";
import { exec } from "child_process";
import { log } from "./utils/helpers.js";

log("=== Aura Scraper Background Daemon Started ===");

// Runs exactly 3 times a day: every 8 hours (at 00:00, 08:00, 16:00)
// Cron expression: "0 */8 * * *"
const schedulePattern = "0 */8 * * *";

log(`Scheduled cron job configured for: "${schedulePattern}" (3 times daily)`);

function executeScraper() {
  log("⏰ Scheduled trigger fired! Spawning price scraper process...");
  
  exec("npm run scrape", (error, stdout, stderr) => {
    if (error) {
      log(`❌ Scraper execution failed: ${error.message}`, "ERROR");
      return;
    }
    if (stderr && stderr.trim().length > 0) {
      log(`⚠️ Scraper warning logs:\n${stderr}`, "WARN");
    }
    log(`✅ Scraper complete. Process logs:\n${stdout}`);
  });
}

// Register the cron job
cron.schedule(schedulePattern, () => {
  executeScraper();
});

// Trigger a run immediately on startup for convenience
log("🚀 Triggering initial startup scraper cycle...");
executeScraper();
