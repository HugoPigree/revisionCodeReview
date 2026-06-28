-- RevQuest — schéma Supabase (gratuit)
-- Exécute ce script dans Supabase : SQL Editor → New query → Run

create table if not exists users (
  id bigint generated always as identity primary key,
  email text unique not null,
  password_hash text not null,
  display_name text not null,
  created_at timestamptz not null default now()
);

create table if not exists progress (
  user_id bigint primary key references users(id) on delete cascade,
  data text not null,
  updated_at timestamptz not null default now()
);

create index if not exists users_email_idx on users(email);
