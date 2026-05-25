-- =============================================
-- AURA BEAUTY — Product Offers Schema
-- Stores scraped price/offer data from multiple stores
-- Updated 3x daily by scheduled scraper
-- =============================================

-- 1. Create the product_offers table
create table if not exists public.product_offers (
  id uuid default gen_random_uuid() primary key,
  product_id uuid references public.products(id) on delete cascade not null,
  store_name text not null,
  store_logo text,
  product_url text not null,
  current_price numeric(10, 2) not null,
  original_price numeric(10, 2),
  discount_percent numeric(5, 2) default 0,
  is_best_deal boolean default false,
  is_official boolean default false,
  in_stock boolean default true,
  product_image text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Enable Row Level Security
alter table public.product_offers enable row level security;

-- 3. RLS Policies
-- Offers are publicly readable (app reads these)
create policy "Product offers are publicly viewable"
  on public.product_offers for select using (true);

-- Only service role (scraper) can insert/update/delete
-- No public insert/update/delete policies needed

-- 4. Indexes for performance
create index if not exists idx_product_offers_product_id
  on public.product_offers (product_id);

create index if not exists idx_product_offers_best_deal
  on public.product_offers (product_id, is_best_deal) where is_best_deal = true;

create index if not exists idx_product_offers_store
  on public.product_offers (store_name);

-- 5. Seed with sample offers for existing products
-- NOTE: Replace the UUIDs below with actual product IDs from your products table
-- You can get them with: SELECT id, name FROM products;

-- Example seed (run after getting real UUIDs):
/*
INSERT INTO public.product_offers (product_id, store_name, store_logo, product_url, current_price, original_price, discount_percent, is_best_deal, is_official, in_stock)
VALUES
  -- Niacinamide 10% Serum by Minimalist
  ('PRODUCT_UUID_1', 'Amazon', '🛒', 'https://amazon.in/dp/example1', 499, 599, 16.69, true, false, true),
  ('PRODUCT_UUID_1', 'Nykaa', '💄', 'https://nykaa.com/minimalist-niacinamide', 549, 599, 8.35, false, false, true),
  ('PRODUCT_UUID_1', 'Official', '🏷️', 'https://beminimalist.co/niacinamide-serum', 599, 599, 0, false, true, true),

  -- Oil-Free Gel Moisturizer by Neutrogena
  ('PRODUCT_UUID_2', 'Amazon', '🛒', 'https://amazon.in/dp/example2', 399, 499, 20.04, true, false, true),
  ('PRODUCT_UUID_2', 'Myntra', '👗', 'https://myntra.com/neutrogena-moisturizer', 449, 499, 10.02, false, false, true),
  ('PRODUCT_UUID_2', 'Nykaa', '💄', 'https://nykaa.com/neutrogena-gel', 469, 499, 6.01, false, false, true),

  -- Sunscreen SPF 50 by La Shield
  ('PRODUCT_UUID_3', 'Amazon', '🛒', 'https://amazon.in/dp/example3', 599, 699, 14.31, false, false, true),
  ('PRODUCT_UUID_3', 'Tira', '✨', 'https://tirabeauty.com/la-shield-spf50', 569, 699, 18.60, true, false, true),
  ('PRODUCT_UUID_3', 'Nykaa', '💄', 'https://nykaa.com/la-shield-sunscreen', 649, 699, 7.15, false, false, true),

  -- Gentle Foam Cleanser by Cetaphil
  ('PRODUCT_UUID_4', 'Amazon', '🛒', 'https://amazon.in/dp/example4', 375, 445, 15.73, true, false, true),
  ('PRODUCT_UUID_4', 'Nykaa', '💄', 'https://nykaa.com/cetaphil-cleanser', 420, 445, 5.62, false, false, true),
  ('PRODUCT_UUID_4', 'Official', '🏷️', 'https://cetaphil.in/gentle-cleanser', 445, 445, 0, false, true, true);
*/
