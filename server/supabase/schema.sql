-- Run this in the Supabase SQL editor (or `supabase db execute`) to create
-- the table the backend expects.

create table if not exists tasks (
  id bigint generated always as identity primary key,
  text text not null,
  completed boolean not null default false,
  created_at timestamptz not null default now(),
  user_id text not null
);

-- If the table already existed from before Clerk auth was added, run this
-- instead to add the new column (existing rows have no owner and will no
-- longer be visible to anyone once the backend starts filtering by user_id;
-- delete them or backfill user_id manually if you need to keep them):
-- alter table tasks add column if not exists user_id text not null default '';

create index if not exists tasks_user_id_idx on tasks (user_id);
