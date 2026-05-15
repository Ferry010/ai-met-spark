create table public.user_stats (
  user_id uuid primary key references auth.users(id) on delete cascade,
  xp integer not null default 0,
  level integer not null default 1,
  streak_days integer not null default 0,
  longest_combo integer not null default 0,
  last_played_date date,
  updated_at timestamptz not null default now()
);

alter table public.user_stats enable row level security;

create policy "Users view own stats" on public.user_stats
  for select using (auth.uid() = user_id);

create policy "Users insert own stats" on public.user_stats
  for insert with check (auth.uid() = user_id);

create policy "Users update own stats" on public.user_stats
  for update using (auth.uid() = user_id);

create policy "Teachers view student stats" on public.user_stats
  for select using (has_role(auth.uid(), 'teacher'::app_role) and is_student_in_my_school(user_id));

create trigger update_user_stats_updated_at
  before update on public.user_stats
  for each row execute function public.update_updated_at_column();