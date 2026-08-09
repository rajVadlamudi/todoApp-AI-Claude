-- Run this in the Supabase SQL editor (or `supabase db execute`) to create
-- the table the backend expects.

create table if not exists tasks (
  id bigint generated always as identity primary key,
  text text not null,
  completed boolean not null default false,
  created_at timestamptz not null default now()
);
