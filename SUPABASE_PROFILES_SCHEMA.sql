-- 1. Create the profiles table
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  full_name text,
  skin_type text,
  beauty_preferences jsonb default '[]'::jsonb,
  onboarding_selections jsonb default '{}'::jsonb,
  glow_score int default 65,
  onboarded boolean default false,
  api_key text,
  privacy_save boolean default false,
  routine_checks jsonb default '{}'::jsonb,
  referral_code text,
  chat_count int default 0,
  session_time int default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Enable Row Level Security (RLS)
alter table public.profiles enable row level security;

-- 3. Create RLS Policies
-- Users can view their own profile
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

-- Users can insert their own profile
create policy "Users can insert own profile" on public.profiles
  for insert with check (auth.uid() = id);

-- Users can update their own profile
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- 4. Create a function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, onboarded)
  values (new.id, new.raw_user_meta_data->>'full_name', false);
  return new;
end;
$$ language plpgsql security definer;

-- 5. Trigger the function every time a user is created
-- Note: Uncomment this if you want auto-creation on signup. 
-- Some flows (like OTP) might prefer manual creation in the app.
-- drop trigger if exists on_auth_user_created on auth.users;
-- create trigger on_auth_user_created
--   after insert on auth.users
--   for each row execute procedure public.handle_new_user();
