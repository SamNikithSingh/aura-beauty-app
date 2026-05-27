import { createClient } from "@supabase/supabase-js";
import { Product } from "../types.js";

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error(
    "Missing Supabase URL or Anon/Service Key environment variables"
  );
}

/**
 * Scraper-only Supabase client.
 *
 * Realtime / WebSocket support is intentionally disabled here because:
 *  - Node.js 20 (used in GitHub Actions) has no native WebSocket.
 *  - The scraper only needs REST + PostgREST (read / update via HTTP).
 *  - Enabling Realtime would require the `ws` polyfill and causes the
 *    "Node.js 20 detected without native WebSocket support" startup error.
 *
 * The `realtime` option set to a disconnected channel prevents
 * @supabase/realtime-js from opening any WebSocket connection.
 */
export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  // Disable ALL Realtime functionality – no WebSocket is opened.
  realtime: {
    params: {
      eventsPerSecond: -1, // signal: do not subscribe to anything
    },
  },
  // Supabase auth auto-refresh uses timers; disable it for headless scripts.
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});

// Immediately disconnect the Realtime transport so no WS handshake is attempted.
supabase.realtime.disconnect();

/**
 * Fetch all products from the Supabase DB (pure REST / PostgREST).
 */
export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch products: ${error.message}`);
  }

  return (data as Product[]) || [];
}

/**
 * Update a product's store-specific price and last-updated timestamp
 * (pure REST / PostgREST — no Realtime involved).
 */
export async function updateStorePrice(
  productId: string,
  storeName: "nykaa" | "official" | "amazon" | "flipkart",
  price: number,
  lastPriceUpdated: string
): Promise<void> {
  console.log(
    `[Supabase Update Attempt] Product ID: ${productId}, Store: ${storeName}`
  );
  console.log(
    `[Supabase Update Data] Price: ${price.toString()}, Last Updated: ${lastPriceUpdated}`
  );

  const priceCol = `${storeName}_price`;
  const updatedCol = `${storeName}_last_updated`;

  const { data, error, status, statusText } = await supabase
    .from("products")
    .update({
      [priceCol]: price.toString(), // Store as string to match text column
      [updatedCol]: lastPriceUpdated,
    })
    .eq("id", productId)
    .select(); // Select the updated row to verify it worked

  console.log(`[Supabase Response] Status: ${status} ${statusText}`);
  console.log(
    `[Supabase Response Data]`,
    data ? JSON.stringify(data) : null
  );
  console.log(
    `[Supabase Response Error]`,
    error ? JSON.stringify(error) : null
  );

  if (error) {
    console.error(`[Supabase Error] ${JSON.stringify(error)}`);
    throw new Error(
      `Failed to update ${storeName} price for product ${productId}: ${error.message}`
    );
  }

  if (!data || data.length === 0) {
    console.warn(
      `[Supabase Warn] No rows were updated for product ID ${productId}. ` +
        `This is almost certainly due to RLS policies silently blocking the update ` +
        `because we are using the ANON key, or the product ID does not exist.`
    );
    throw new Error(
      `Supabase RLS blocked the update for product ${productId}. ` +
        `The scraper requires a SERVICE_ROLE key or RLS configured to allow updates.`
    );
  }
}
