-- AURA BEAUTY — Commerce System Migration
-- Extensions for products and offers

-- 1. Extend the products table
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS usage_steps TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS concerns TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS trending BOOLEAN DEFAULT false;

-- Migrate skin_type to skin_types if not already done
-- For now, we'll keep skin_type and add skin_types for multi-select
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS skin_types TEXT[] DEFAULT '{}';

-- Populate skin_types from skin_type if empty
UPDATE public.products 
SET skin_types = string_to_array(skin_type, ', ')
WHERE skin_types = '{}' OR skin_types IS NULL;

-- 2. Ensure product_offers has necessary fields
ALTER TABLE public.product_offers
ADD COLUMN IF NOT EXISTS is_best_deal BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_official BOOLEAN DEFAULT false;

-- 3. Update existing data with more details for better testing
UPDATE public.products
SET 
  description = 'A powerful serum with 10% Niacinamide to reduce dark spots and 1% Zinc to control excess sebum.',
  usage_steps = ARRAY['Cleanse face', 'Apply 2-3 drops', 'Follow with moisturizer'],
  concerns = ARRAY['Acne', 'Oil Control', 'Dark Spots'],
  featured = true
WHERE name = 'Niacinamide 10% Serum';

UPDATE public.products
SET 
  description = 'Ultra-lightweight gel moisturizer that provides 24-hour hydration without any greasy feel.',
  usage_steps = ARRAY['Cleanse face', 'Apply evenly over face and neck'],
  concerns = ARRAY['Dehydration', 'Oiliness'],
  trending = true
WHERE name = 'Oil-Free Gel Moisturizer';

-- 4. Indexes for recommendations
CREATE INDEX IF NOT EXISTS idx_products_skin_types ON public.products USING GIN (skin_types);
CREATE INDEX IF NOT EXISTS idx_products_concerns ON public.products USING GIN (concerns);
CREATE INDEX IF NOT EXISTS idx_products_featured_trending ON public.products (featured, trending);
