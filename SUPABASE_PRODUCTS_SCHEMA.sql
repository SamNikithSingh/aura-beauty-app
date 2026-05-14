-- 1. Create the products table
create table if not exists public.products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  brand text not null,
  benefit text not null,
  price text not null,
  price_usd text not null,
  category text not null,
  tag text not null,
  image text not null,
  rating numeric(2, 1) default 0.0,
  reviews int default 0,
  key_ingredients text[] default '{}',
  skin_type text not null,
  affiliate_url text default '#',
  discount text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Enable Row Level Security (RLS)
alter table public.products enable row level security;

-- 3. Create RLS Policies
-- Products are publicly viewable
create policy "Products are publicly viewable" on public.products
  for select using (true);

-- Only admins can insert/update/delete (in a real app, you'd add an admin role check)
-- For now, we only allow select for public.

-- 4. Insert Seed Data (matching the previous hardcoded UI data)
insert into public.products (name, brand, benefit, price, price_usd, category, tag, image, rating, reviews, key_ingredients, skin_type, affiliate_url, discount)
values 
  ('Niacinamide 10% Serum', 'Minimalist', 'Helps reduce dark spots, controls oil & improves skin texture for oily/combination skin.', '₹599', '$7', 'Serum', 'Best Seller', 'https://images.unsplash.com/photo-1774887554034-c73a4edc3d3c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400', 4.8, 12040, ARRAY['Niacinamide 10%', 'Zinc 1%'], 'Oily, Combination', '#', null),
  ('Oil-Free Gel Moisturizer', 'Neutrogena', 'Lightweight, non-comedogenic & perfect for oily skin. Provides 24hr hydration.', '₹499', '$12', 'Moisturizer', 'Aura Pick', 'https://images.unsplash.com/photo-1765964492963-b0aa8c172431?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400', 4.6, 8670, ARRAY['Hyaluronic Acid', 'Glycerin'], 'Oily, Normal', '#', '10% OFF'),
  ('Sunscreen SPF 50 PA++++', 'La Shield', 'Broad spectrum protection & prevents tanning. Invisible finish on all skin tones.', '₹699', '$8', 'Sunscreen', 'Editor''s Pick', 'https://images.unsplash.com/photo-1694101454278-7fb3df776578?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400', 4.7, 23410, ARRAY['Zinc Oxide', 'Titanium Dioxide'], 'All types', '#', null),
  ('Gentle Foam Cleanser', 'Cetaphil', 'Ultra-gentle formula that cleanses without stripping. Dermatologist-recommended.', '₹445', '$14', 'Cleanser', 'Fan Favorite', 'https://images.unsplash.com/photo-1763532997223-d0f81ea8743c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400', 4.9, 31020, ARRAY['Niacinamide', 'Panthenol', 'Aloe'], 'All types', '#', '15% OFF');
