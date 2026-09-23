-- ============================================================
-- v2: kid-friendly accounts, parental consent, classes, missions
-- Safe to run once on a project that already has the earlier migrations.
-- ============================================================

create extension if not exists pgcrypto with schema extensions;

-- ------------------------------------------------------------
-- 1) Usernames + consent on profiles
-- ------------------------------------------------------------
alter table public.profiles
  add column if not exists username text,
  add column if not exists consent_type text check (consent_type in ('school', 'parent')),
  add column if not exists consent_at timestamptz;

create unique index if not exists profiles_username_key
  on public.profiles (lower(username))
  where username is not null;

-- ------------------------------------------------------------
-- 2) Signup: store username + how consent was given
--    - joined with a class code  -> consent via the school
--    - signed up at home         -> a parent ticked consent
-- ------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path to 'public'
as $function$
declare
  v_class_code text;
  v_school_id uuid;
  v_username text;
  v_consent_type text := null;
  v_consent_at timestamptz := null;
begin
  v_class_code := new.raw_user_meta_data->>'class_code';
  if v_class_code is not null and length(v_class_code) > 0 then
    select school_id into v_school_id
    from public.class_codes
    where code = upper(v_class_code)
      and (expires_at is null or expires_at > now())
    limit 1;
  end if;

  v_username := nullif(lower(trim(new.raw_user_meta_data->>'username')), '');

  if v_school_id is not null then
    v_consent_type := 'school';
    v_consent_at := now();
  elsif lower(coalesce(new.raw_user_meta_data->>'parent_consent', '')) = 'true' then
    v_consent_type := 'parent';
    v_consent_at := now();
  end if;

  insert into public.profiles (id, first_name, age, parent_email, language, school_id, username, consent_type, consent_at)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'first_name', split_part(new.email, '@', 1)),
    nullif(new.raw_user_meta_data->>'age', '')::integer,
    new.raw_user_meta_data->>'parent_email',
    coalesce((new.raw_user_meta_data->>'language')::public.app_language, 'nl'),
    v_school_id,
    v_username,
    v_consent_type,
    v_consent_at
  );

  insert into public.user_roles (user_id, role) values (new.id, 'student');
  return new;
end;
$function$;

-- Kids log in with a username. Under the hood that is <username>@leerling.aimetspark.nl.
create or replace function public.username_available(_username text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select not exists (select 1 from public.profiles where lower(username) = lower(trim(_username)))
     and not exists (select 1 from auth.users where email = lower(trim(_username)) || '@leerling.aimetspark.nl');
$$;
revoke all on function public.username_available(text) from public;
grant execute on function public.username_available(text) to anon, authenticated;

-- ------------------------------------------------------------
-- 3) Protect fields that must only change through the app's own
--    functions (class membership, username, consent).
-- ------------------------------------------------------------
create or replace function public.guard_profile_update()
returns trigger
language plpgsql
as $$
begin
  if current_setting('app.trusted_profile_update', true) = 'on' then
    return new;
  end if;
  if new.school_id is distinct from old.school_id
     or new.username is distinct from old.username
     or new.consent_type is distinct from old.consent_type
     or new.consent_at is distinct from old.consent_at then
    raise exception 'These profile fields can only be changed through the app';
  end if;
  return new;
end;
$$;

drop trigger if exists guard_profile_update on public.profiles;
create trigger guard_profile_update
  before update on public.profiles
  for each row execute function public.guard_profile_update();

-- ------------------------------------------------------------
-- 4) Kids join (or leave) a class after signing up
-- ------------------------------------------------------------
create or replace function public.join_class(_code text)
returns table (school_id uuid, class_name text)
language plpgsql
security definer
set search_path = public
as $$
#variable_conflict use_column
declare
  v_school uuid;
  v_name text;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;
  select c.school_id, s.name into v_school, v_name
  from public.class_codes c
  join public.schools s on s.id = c.school_id
  where c.code = upper(trim(_code))
    and (c.expires_at is null or c.expires_at > now())
  limit 1;
  if v_school is null then
    raise exception 'Unknown class code';
  end if;
  perform set_config('app.trusted_profile_update', 'on', true);
  update public.profiles
     set school_id = v_school,
         consent_type = coalesce(consent_type, 'school'),
         consent_at = coalesce(consent_at, now())
   where id = auth.uid();
  return query select v_school, v_name;
end;
$$;
revoke all on function public.join_class(text) from public;
grant execute on function public.join_class(text) to authenticated;

create or replace function public.leave_class()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;
  perform set_config('app.trusted_profile_update', 'on', true);
  update public.profiles set school_id = null where id = auth.uid();
end;
$$;
revoke all on function public.leave_class() from public;
grant execute on function public.leave_class() to authenticated;

-- ------------------------------------------------------------
-- 5) Teachers: more than one class
-- ------------------------------------------------------------
create or replace function public.create_class(_class_name text)
returns table (school_id uuid, class_code text)
language plpgsql
security definer
set search_path = public
as $$
#variable_conflict use_column
declare
  v_user uuid := auth.uid();
  v_school_id uuid;
  v_code text;
begin
  if v_user is null then
    raise exception 'Not authenticated';
  end if;
  if _class_name is null or length(trim(_class_name)) = 0 then
    raise exception 'Class name is required';
  end if;
  insert into public.user_roles (user_id, role) values (v_user, 'teacher')
  on conflict (user_id, role) do nothing;
  insert into public.schools (name, teacher_id) values (trim(_class_name), v_user)
  returning id into v_school_id;
  loop
    v_code := 'SPARK-' || upper(substr(md5(random()::text), 1, 4));
    exit when not exists (select 1 from public.class_codes c where c.code = v_code);
  end loop;
  insert into public.class_codes (school_id, code) values (v_school_id, v_code);
  return query select v_school_id, v_code;
end;
$$;
revoke all on function public.create_class(text) from public;
grant execute on function public.create_class(text) to authenticated;

-- First-class onboarding (reuses the teacher's first class if it exists).
-- Redefined with an explicit variable-conflict rule for robustness.
create or replace function public.create_teacher_class(_class_name text)
returns table (school_id uuid, class_code text)
language plpgsql
security definer
set search_path = public
as $$
#variable_conflict use_column
declare
  v_user uuid := auth.uid();
  v_school_id uuid;
  v_code text;
begin
  if v_user is null then
    raise exception 'Not authenticated';
  end if;
  if _class_name is null or length(trim(_class_name)) = 0 then
    raise exception 'Class name is required';
  end if;
  insert into public.user_roles (user_id, role) values (v_user, 'teacher')
  on conflict (user_id, role) do nothing;
  select s.id into v_school_id from public.schools s where s.teacher_id = v_user order by s.created_at limit 1;
  if v_school_id is null then
    insert into public.schools (name, teacher_id) values (trim(_class_name), v_user)
    returning id into v_school_id;
  end if;
  select c.code into v_code from public.class_codes c where c.school_id = v_school_id order by c.created_at limit 1;
  if v_code is null then
    loop
      v_code := 'SPARK-' || upper(substr(md5(random()::text), 1, 4));
      exit when not exists (select 1 from public.class_codes c where c.code = v_code);
    end loop;
    insert into public.class_codes (school_id, code) values (v_school_id, v_code);
  end if;
  return query select v_school_id, v_code;
end;
$$;
revoke all on function public.create_teacher_class(text) from public;
grant execute on function public.create_teacher_class(text) to authenticated;

create or replace function public.my_classes()
returns table (school_id uuid, class_name text, class_code text, student_count bigint, created_at timestamptz)
language sql
stable
security definer
set search_path = public
as $$
  select
    s.id,
    s.name,
    (select c.code from public.class_codes c where c.school_id = s.id order by c.created_at limit 1),
    (select count(*) from public.profiles p where p.school_id = s.id),
    s.created_at
  from public.schools s
  where s.teacher_id = auth.uid()
  order by s.created_at;
$$;
revoke all on function public.my_classes() from public;
grant execute on function public.my_classes() to authenticated;

-- Roster now includes the username (so a teacher can help a kid log in).
drop function if exists public.list_students_in_my_school();
create function public.list_students_in_my_school()
returns table (id uuid, first_name text, username text, school_id uuid)
language sql
stable
security definer
set search_path = public
as $$
  select p.id, p.first_name, p.username, p.school_id
  from public.profiles p
  join public.schools s on s.id = p.school_id
  where s.teacher_id = auth.uid();
$$;
revoke all on function public.list_students_in_my_school() from public;
grant execute on function public.list_students_in_my_school() to authenticated;

-- A teacher can set a new password for a student in their own class
-- (kids don't have an email address to reset it themselves).
create or replace function public.teacher_reset_student_password(_student uuid, _password text)
returns void
language plpgsql
security definer
set search_path = public, extensions
as $$
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;
  if not public.is_student_in_my_school(_student) then
    raise exception 'This student is not in your class';
  end if;
  if _password is null or length(_password) < 6 then
    raise exception 'Password must be at least 6 characters';
  end if;
  update auth.users
     set encrypted_password = extensions.crypt(_password, extensions.gen_salt('bf')),
         updated_at = now()
   where id = _student;
end;
$$;
revoke all on function public.teacher_reset_student_password(uuid, text) from public;
grant execute on function public.teacher_reset_student_password(uuid, text) to authenticated;

create or replace function public.teacher_remove_student(_student uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;
  if not public.is_student_in_my_school(_student) then
    raise exception 'This student is not in your class';
  end if;
  perform set_config('app.trusted_profile_update', 'on', true);
  update public.profiles set school_id = null where id = _student;
end;
$$;
revoke all on function public.teacher_remove_student(uuid) from public;
grant execute on function public.teacher_remove_student(uuid) to authenticated;

-- ------------------------------------------------------------
-- 6) Delete your own account without an edge function.
--    Everything else is removed by ON DELETE CASCADE.
-- ------------------------------------------------------------
create or replace function public.delete_my_account()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;
  delete from auth.users where id = auth.uid();
end;
$$;
revoke all on function public.delete_my_account() from public;
grant execute on function public.delete_my_account() to authenticated;

-- ------------------------------------------------------------
-- 7) Move existing progress from the 24 v1 lessons to the 18 v2 missions.
--    Runs once (guarded by a marker row).
-- ------------------------------------------------------------
create table if not exists public._migration_markers (
  name text primary key,
  applied_at timestamptz not null default now()
);
alter table public._migration_markers enable row level security;

do $$
begin
  if exists (select 1 from public._migration_markers where name = 'missions_v2_remap') then
    return;
  end if;

  create temp table _lesson_map (old_id text primary key, new_id text not null) on commit drop;
  insert into _lesson_map (old_id, new_id) values
    ('1.1', '1.1'), ('1.2', '1.2'), ('1.6', '1.2'), ('1.5', '1.3'), ('1.7', '1.3'), ('1.8', '1.6'),
    ('1.4', '2.1'), ('2.1', '2.1'), ('2.2', '2.1'), ('2.4', '2.2'), ('2.6', '2.2'),
    ('1.3', '2.3'), ('2.3', '2.3'), ('2.5', '2.3'), ('2.7', '2.5'), ('2.8', '2.6'),
    ('3.1', '3.1'), ('3.2', '3.1'), ('3.3', '3.2'), ('3.6', '3.2'), ('3.4', '3.3'),
    ('3.5', '3.4'), ('3.7', '3.5'), ('3.8', '3.6');

  create temp table _remapped on commit drop as
    select p.user_id, m.new_id as lesson_id, max(p.stars) as stars, max(p.completed_at) as completed_at
    from public.user_progress p
    join _lesson_map m on m.old_id = p.lesson_id
    group by p.user_id, m.new_id;

  delete from public.user_progress;
  insert into public.user_progress (user_id, lesson_id, stars, completed_at)
    select user_id, lesson_id, stars, completed_at from _remapped;

  insert into public._migration_markers (name) values ('missions_v2_remap');
end $$;
