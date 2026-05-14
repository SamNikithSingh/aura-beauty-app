-- =============================================
-- AURA BEAUTY — Chat System Schema
-- =============================================

-- 1. Chat Sessions
create table if not exists public.chat_sessions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  chat_type text not null check (chat_type in ('skincare', 'beauty')),
  title text default 'New Chat',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Chat Messages
create table if not exists public.chat_messages (
  id uuid default gen_random_uuid() primary key,
  session_id uuid references public.chat_sessions on delete cascade not null,
  user_id uuid references auth.users on delete cascade not null,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Usage Limits (daily counters)
create table if not exists public.usage_limits (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  chat_type text not null check (chat_type in ('skincare', 'beauty')),
  text_count int default 0,
  image_count int default 0,
  reset_date date default current_date not null,
  unique (user_id, chat_type)
);

-- =============================================
-- Row Level Security
-- =============================================

-- Chat Sessions RLS
alter table public.chat_sessions enable row level security;

create policy "Users can view own chat sessions"
  on public.chat_sessions for select using (auth.uid() = user_id);

create policy "Users can create own chat sessions"
  on public.chat_sessions for insert with check (auth.uid() = user_id);

create policy "Users can update own chat sessions"
  on public.chat_sessions for update using (auth.uid() = user_id);

create policy "Users can delete own chat sessions"
  on public.chat_sessions for delete using (auth.uid() = user_id);

-- Chat Messages RLS
alter table public.chat_messages enable row level security;

create policy "Users can view own chat messages"
  on public.chat_messages for select using (auth.uid() = user_id);

create policy "Users can create own chat messages"
  on public.chat_messages for insert with check (auth.uid() = user_id);

-- Usage Limits RLS
alter table public.usage_limits enable row level security;

create policy "Users can view own usage limits"
  on public.usage_limits for select using (auth.uid() = user_id);

create policy "Users can create own usage limits"
  on public.usage_limits for insert with check (auth.uid() = user_id);

create policy "Users can update own usage limits"
  on public.usage_limits for update using (auth.uid() = user_id);

-- =============================================
-- Indexes for performance
-- =============================================

create index if not exists idx_chat_sessions_user_type
  on public.chat_sessions (user_id, chat_type);

create index if not exists idx_chat_messages_session
  on public.chat_messages (session_id, created_at);

create index if not exists idx_usage_limits_user_type
  on public.usage_limits (user_id, chat_type);

-- =============================================
-- Storage bucket for chat image uploads
-- =============================================
-- NOTE: Run this in Supabase SQL Editor:
-- insert into storage.buckets (id, name, public) values ('chat-uploads', 'chat-uploads', true);
--
-- Then add a storage policy:
-- create policy "Users can upload chat images"
--   on storage.objects for insert
--   with check (bucket_id = 'chat-uploads' and auth.uid()::text = (storage.foldername(name))[1]);
--
-- create policy "Public can view chat images"
--   on storage.objects for select
--   using (bucket_id = 'chat-uploads');
