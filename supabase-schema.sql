-- Dancing in Shackles - Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Tasks table
create table tasks (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  commitment_level text not null check (commitment_level in ('low', 'medium', 'high')),
  status text not null default 'active' check (status in ('active', 'completed', 'forgiven', 'abandoned')),
  due_date date,
  streak_count integer not null default 0,
  recurring boolean not null default false,
  forgive_reason text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Daily logs table
create table daily_logs (
  id uuid default uuid_generate_v4() primary key,
  log_date date not null default current_date,
  mood integer not null check (mood between 1 and 5),
  energy integer not null check (energy between 1 and 5),
  hours_worked numeric(4,1) not null default 0,
  tasks_completed integer not null default 0,
  tasks_forgiven integer not null default 0,
  notes text,
  created_at timestamp with time zone default now()
);

-- Accountability reviews table
create table accountability_reviews (
  id uuid default uuid_generate_v4() primary key,
  review_date date not null default current_date,
  performance_score integer not null check (performance_score between 1 and 10),
  wellbeing_score integer not null check (wellbeing_score between 1 and 10),
  commitments_kept integer not null default 0,
  commitments_total integer not null default 0,
  reflection text,
  improvement text,
  recovery_needed boolean not null default false,
  created_at timestamp with time zone default now()
);

-- Wellbeing alerts table
create table wellbeing_alerts (
  id uuid default uuid_generate_v4() primary key,
  alert_type text not null check (alert_type in ('overload', 'exhaustion', 'streak_pressure', 'low_mood', 'dancing_in_shackles')),
  severity text not null check (severity in ('yellow', 'red')),
  message text not null,
  acknowledged boolean not null default false,
  created_at timestamp with time zone default now()
);

-- Indexes
create index idx_tasks_status on tasks(status);
create index idx_daily_logs_date on daily_logs(log_date);
create index idx_reviews_date on accountability_reviews(review_date);
create index idx_alerts_acknowledged on wellbeing_alerts(acknowledged);

-- Row Level Security (disabled for simplicity - single user app)
alter table tasks enable row level security;
alter table daily_logs enable row level security;
alter table accountability_reviews enable row level security;
alter table wellbeing_alerts enable row level security;

-- Allow all operations (single-user app with anon key)
create policy "Allow all on tasks" on tasks for all using (true) with check (true);
create policy "Allow all on daily_logs" on daily_logs for all using (true) with check (true);
create policy "Allow all on accountability_reviews" on accountability_reviews for all using (true) with check (true);
create policy "Allow all on wellbeing_alerts" on wellbeing_alerts for all using (true) with check (true);
