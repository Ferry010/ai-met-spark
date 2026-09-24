-- ============================================================
-- Admin-led school onboarding
--  - Schools ask to join (school_requests); the admin approves them.
--  - Each approved school is an `organizations` row. (The older `schools`
--    table holds classes, one row per class.)
--  - Teachers can only become a teacher with a personal invite code,
--    bound to their email address. Self-service teacher signup is closed.
--  - The admin sees schools, teachers, classes and class-level totals,
--    never the names of children.
-- Safe to run once, after 20260923120000_v2_accounts_classes_missions.sql.
-- ============================================================

create extension if not exists pgcrypto with schema extensions;

-- ------------------------------------------------------------
-- 1) Schools, and which school a teacher belongs to
-- ------------------------------------------------------------
create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(trim(name)) between 1 and 150),
  city text check (city is null or length(city) <= 100),
  contact_name text check (contact_name is null or length(contact_name) <= 100),
  contact_email text check (contact_email is null or length(contact_email) <= 255),
  notes text check (notes is null or length(notes) <= 2000),
  created_at timestamptz not null default now()
);
alter table public.organizations enable row level security;

drop policy if exists "Admins manage organizations" on public.organizations;
create policy "Admins manage organizations" on public.organizations
  for all using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

create table if not exists public.teacher_memberships (
  user_id uuid primary key references auth.users(id) on delete cascade,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.teacher_memberships enable row level security;

drop policy if exists "Admins manage memberships" on public.teacher_memberships;
create policy "Admins manage memberships" on public.teacher_memberships
  for all using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));
drop policy if exists "Teachers view own membership" on public.teacher_memberships;
create policy "Teachers view own membership" on public.teacher_memberships
  for select using (user_id = auth.uid());

-- Classes remember which school they belong to.
alter table public.schools
  add column if not exists organization_id uuid references public.organizations(id) on delete set null;

-- ------------------------------------------------------------
-- 2) Personal invite codes for teachers, e.g. LK-7QXM-3H9P
-- ------------------------------------------------------------
create or replace function public.gen_invite_code()
returns text
language plpgsql
volatile
set search_path = public, extensions
as $$
declare
  alphabet constant text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  bytes bytea;
  v text;
begin
  loop
    bytes := extensions.gen_random_bytes(8);
    v := 'LK-';
    for i in 0..7 loop
      v := v || substr(alphabet, 1 + (get_byte(bytes, i) % 32), 1);
      if i = 3 then v := v || '-'; end if;
    end loop;
    exit when not exists (select 1 from public.teacher_invites where code = v);
  end loop;
  return v;
end;
$$;

create table if not exists public.teacher_invites (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  code text not null unique default public.gen_invite_code(),
  name text check (name is null or length(name) <= 100),
  email text not null check (length(email) between 5 and 255 and email like '%@%.%'),
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default now() + interval '30 days',
  used_by uuid references auth.users(id) on delete set null,
  used_at timestamptz
);
alter table public.teacher_invites enable row level security;

drop policy if exists "Admins manage invites" on public.teacher_invites;
create policy "Admins manage invites" on public.teacher_invites
  for all using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- ------------------------------------------------------------
-- 3) Schools asking to join
-- ------------------------------------------------------------
create table if not exists public.school_requests (
  id uuid primary key default gen_random_uuid(),
  school_name text not null check (length(trim(school_name)) between 2 and 150),
  city text not null check (length(trim(city)) between 1 and 100),
  contact_name text not null check (length(trim(contact_name)) between 1 and 100),
  contact_role text check (contact_role is null or length(contact_role) <= 60),
  contact_email text not null check (length(contact_email) between 5 and 255 and contact_email like '%@%.%'),
  class_count integer check (class_count is null or class_count between 1 and 200),
  message text check (message is null or length(message) <= 1000),
  status text not null default 'new' check (status in ('new', 'approved', 'rejected')),
  organization_id uuid references public.organizations(id) on delete set null,
  created_at timestamptz not null default now(),
  handled_at timestamptz
);
alter table public.school_requests enable row level security;

drop policy if exists "Anyone can request a school signup" on public.school_requests;
create policy "Anyone can request a school signup" on public.school_requests
  for insert to anon, authenticated
  with check (status = 'new' and organization_id is null and handled_at is null);
drop policy if exists "Admins manage school requests" on public.school_requests;
create policy "Admins manage school requests" on public.school_requests
  for all using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- ------------------------------------------------------------
-- 4) Turning an invite into a teacher account
-- ------------------------------------------------------------
-- Internal: validates the code for this email and makes the user a teacher.
-- Returns the school id, or null when the code is not valid.
create or replace function public._apply_teacher_invite(_user uuid, _email text, _code text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_invite public.teacher_invites;
begin
  if _user is null or _email is null or _code is null then
    return null;
  end if;
  -- Kid accounts can never become a teacher.
  if lower(_email) like '%@leerling.aimetspark.nl' then
    return null;
  end if;
  select * into v_invite
  from public.teacher_invites
  where code = upper(trim(_code))
    and lower(email) = lower(trim(_email))
    and used_at is null
    and expires_at > now()
  for update;
  if v_invite.id is null then
    return null;
  end if;

  insert into public.user_roles (user_id, role) values (_user, 'teacher')
  on conflict (user_id, role) do nothing;
  insert into public.teacher_memberships (user_id, organization_id)
  values (_user, v_invite.organization_id)
  on conflict (user_id) do update set organization_id = excluded.organization_id;
  update public.schools set organization_id = v_invite.organization_id
   where teacher_id = _user and organization_id is null;
  update public.teacher_invites set used_by = _user, used_at = now() where id = v_invite.id;
  return v_invite.organization_id;
end;
$$;
revoke all on function public._apply_teacher_invite(uuid, text, text) from public, anon, authenticated;

-- Before signing up: is this code valid for this email? Returns the school name.
create or replace function public.check_teacher_invite(_code text, _email text)
returns text
language sql
stable
security definer
set search_path = public
as $$
  select o.name
  from public.teacher_invites i
  join public.organizations o on o.id = i.organization_id
  where i.code = upper(trim(_code))
    and lower(i.email) = lower(trim(_email))
    and i.used_at is null
    and i.expires_at > now();
$$;
revoke all on function public.check_teacher_invite(text, text) from public;
grant execute on function public.check_teacher_invite(text, text) to anon, authenticated;

-- An existing (grown-up) account redeems a code.
create or replace function public.redeem_teacher_invite(_code text)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_org uuid;
  v_email text;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;
  select email into v_email from auth.users where id = auth.uid();
  v_org := public._apply_teacher_invite(auth.uid(), v_email, _code);
  if v_org is null then
    raise exception 'Invalid invite code';
  end if;
  return (select name from public.organizations where id = v_org);
end;
$$;
revoke all on function public.redeem_teacher_invite(text) from public, anon;
grant execute on function public.redeem_teacher_invite(text) to authenticated;

-- Signup: same as v2, plus teacher invites. Teachers do not get the student role.
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
  v_invite text;
  v_org uuid;
begin
  v_invite := nullif(trim(new.raw_user_meta_data->>'teacher_invite'), '');

  v_class_code := new.raw_user_meta_data->>'class_code';
  if v_invite is null and v_class_code is not null and length(v_class_code) > 0 then
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

  if v_invite is not null then
    v_org := public._apply_teacher_invite(new.id, new.email, v_invite);
  end if;
  if v_org is null then
    insert into public.user_roles (user_id, role) values (new.id, 'student');
  end if;
  return new;
end;
$function$;

-- ------------------------------------------------------------
-- 5) Only invited teachers can create classes
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
  if not (public.has_role(v_user, 'teacher') or public.has_role(v_user, 'admin')) then
    raise exception 'Only teachers can create classes';
  end if;
  if _class_name is null or length(trim(_class_name)) = 0 then
    raise exception 'Class name is required';
  end if;
  insert into public.schools (name, teacher_id, organization_id)
  values (trim(_class_name), v_user, (select m.organization_id from public.teacher_memberships m where m.user_id = v_user))
  returning id into v_school_id;
  loop
    v_code := 'SPARK-' || upper(substr(md5(random()::text), 1, 4));
    exit when not exists (select 1 from public.class_codes c where c.code = v_code);
  end loop;
  insert into public.class_codes (school_id, code) values (v_school_id, v_code);
  return query select v_school_id, v_code;
end;
$$;
revoke all on function public.create_class(text) from public, anon;
grant execute on function public.create_class(text) to authenticated;

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
  if not (public.has_role(v_user, 'teacher') or public.has_role(v_user, 'admin')) then
    raise exception 'Only teachers can create classes';
  end if;
  if _class_name is null or length(trim(_class_name)) = 0 then
    raise exception 'Class name is required';
  end if;
  select s.id into v_school_id from public.schools s where s.teacher_id = v_user order by s.created_at limit 1;
  if v_school_id is null then
    insert into public.schools (name, teacher_id, organization_id)
    values (trim(_class_name), v_user, (select m.organization_id from public.teacher_memberships m where m.user_id = v_user))
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
revoke all on function public.create_teacher_class(text) from public, anon;
grant execute on function public.create_teacher_class(text) to authenticated;

-- The teacher's own school (for the header).
create or replace function public.my_school()
returns table (organization_id uuid, name text)
language sql
stable
security definer
set search_path = public
as $$
  select o.id, o.name
  from public.teacher_memberships m
  join public.organizations o on o.id = m.organization_id
  where m.user_id = auth.uid();
$$;
revoke all on function public.my_school() from public, anon;
grant execute on function public.my_school() to authenticated;

-- ------------------------------------------------------------
-- 6) Admin: overview and management (class-level totals only)
-- ------------------------------------------------------------
create or replace function public._require_admin()
returns void
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.has_role(auth.uid(), 'admin') then
    raise exception 'Admins only';
  end if;
end;
$$;
revoke all on function public._require_admin() from public, anon;
grant execute on function public._require_admin() to authenticated;

-- Kids = accounts with the student role and no teacher/admin role.
create or replace view public._kid_ids with (security_invoker = on) as
  select r.user_id
  from public.user_roles r
  where r.role = 'student'
    and not exists (
      select 1 from public.user_roles r2
      where r2.user_id = r.user_id and r2.role in ('teacher', 'admin')
    );
revoke all on public._kid_ids from anon, authenticated;

create or replace function public.admin_overview()
returns table (
  schools bigint, teachers bigint, classes bigint,
  class_kids bigint, home_kids bigint, active_7d bigint,
  missions_done bigint, diplomas bigint, open_requests bigint, open_invites bigint
)
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  perform public._require_admin();
  return query select
    (select count(*) from public.organizations),
    (select count(distinct user_id) from public.user_roles where role = 'teacher'),
    (select count(*) from public.schools),
    (select count(*) from public.profiles p join public._kid_ids k on k.user_id = p.id where p.school_id is not null),
    (select count(*) from public.profiles p join public._kid_ids k on k.user_id = p.id where p.school_id is null),
    (select count(distinct x.user_id) from (
        select user_id from public.user_progress where completed_at > now() - interval '7 days'
        union
        select user_id from public.user_stats where last_played_date > current_date - 7
     ) x),
    (select count(*) from public.user_progress),
    (select count(distinct user_id) from public.final_test_attempts where passed),
    (select count(*) from public.school_requests where status = 'new'),
    (select count(*) from public.teacher_invites where used_at is null and expires_at > now());
end;
$$;
revoke all on function public.admin_overview() from public, anon;
grant execute on function public.admin_overview() to authenticated;

create or replace function public.admin_schools()
returns table (
  id uuid, name text, city text, contact_name text, contact_email text, notes text, created_at timestamptz,
  teacher_count bigint, class_count bigint, kid_count bigint, avg_missions numeric, active_7d bigint, open_invites bigint
)
language plpgsql
stable
security definer
set search_path = public
as $$
#variable_conflict use_column
begin
  perform public._require_admin();
  return query
  with kids as (
    select s.organization_id as org, p.id as kid
    from public.schools s
    join public.profiles p on p.school_id = s.id
    join public._kid_ids k on k.user_id = p.id
    where s.organization_id is not null
  ), done as (
    select user_id, count(*) as n, max(completed_at) as last from public.user_progress group by user_id
  )
  select
    o.id, o.name, o.city, o.contact_name, o.contact_email, o.notes, o.created_at,
    (select count(*) from public.teacher_memberships m where m.organization_id = o.id),
    (select count(*) from public.schools s where s.organization_id = o.id),
    (select count(*) from kids where kids.org = o.id),
    (select round(coalesce(avg(coalesce(d.n, 0)), 0), 1) from kids left join done d on d.user_id = kids.kid where kids.org = o.id),
    (select count(*) from kids join done d on d.user_id = kids.kid where kids.org = o.id and d.last > now() - interval '7 days'),
    (select count(*) from public.teacher_invites i where i.organization_id = o.id and i.used_at is null and i.expires_at > now())
  from public.organizations o
  order by o.name;
end;
$$;
revoke all on function public.admin_schools() from public, anon;
grant execute on function public.admin_schools() to authenticated;

-- Classes of one school, or classes without a school when _org is null.
create or replace function public.admin_classes(_org uuid)
returns table (
  id uuid, name text, class_code text, teacher_id uuid, teacher_name text,
  kid_count bigint, avg_missions numeric, finished bigint, diplomas bigint, last_active timestamptz, created_at timestamptz
)
language plpgsql
stable
security definer
set search_path = public
as $$
#variable_conflict use_column
begin
  perform public._require_admin();
  return query
  with done as (
    select user_id, count(*) as n, max(completed_at) as last from public.user_progress group by user_id
  )
  select
    s.id, s.name,
    (select c.code from public.class_codes c where c.school_id = s.id order by c.created_at limit 1),
    s.teacher_id,
    (select t.first_name from public.profiles t where t.id = s.teacher_id),
    count(p.id),
    round(coalesce(avg(coalesce(d.n, 0)) filter (where p.id is not null), 0), 1),
    count(p.id) filter (where d.n >= 18),
    count(f.user_id),
    max(d.last),
    s.created_at
  from public.schools s
  left join (public.profiles p join public._kid_ids k on k.user_id = p.id) on p.school_id = s.id
  left join done d on d.user_id = p.id
  left join (select distinct user_id from public.final_test_attempts where passed) f on f.user_id = p.id
  where (_org is null and s.organization_id is null) or s.organization_id = _org
  group by s.id
  order by s.created_at;
end;
$$;
revoke all on function public.admin_classes(uuid) from public, anon;
grant execute on function public.admin_classes(uuid) to authenticated;

create or replace function public.admin_teachers()
returns table (
  user_id uuid, first_name text, email text, organization_id uuid, organization_name text,
  class_count bigint, kid_count bigint, created_at timestamptz, last_sign_in_at timestamptz
)
language plpgsql
stable
security definer
set search_path = public
as $$
#variable_conflict use_column
begin
  perform public._require_admin();
  return query
  select
    r.user_id,
    p.first_name,
    u.email::text,
    m.organization_id,
    o.name,
    (select count(*) from public.schools s where s.teacher_id = r.user_id),
    (select count(*) from public.schools s join public.profiles kp on kp.school_id = s.id
       join public._kid_ids k on k.user_id = kp.id where s.teacher_id = r.user_id),
    u.created_at,
    u.last_sign_in_at
  from public.user_roles r
  join auth.users u on u.id = r.user_id
  left join public.profiles p on p.id = r.user_id
  left join public.teacher_memberships m on m.user_id = r.user_id
  left join public.organizations o on o.id = m.organization_id
  where r.role = 'teacher'
  order by o.name nulls first, p.first_name;
end;
$$;
revoke all on function public.admin_teachers() from public, anon;
grant execute on function public.admin_teachers() to authenticated;

-- Approve a request: create the school and (optionally) invite the contact person.
create or replace function public.admin_approve_request(_request uuid, _invite_contact boolean default true)
returns table (organization_id uuid, invite_code text)
language plpgsql
security definer
set search_path = public
as $$
#variable_conflict use_column
declare
  v_req public.school_requests;
  v_org uuid;
  v_code text;
begin
  perform public._require_admin();
  select * into v_req from public.school_requests where id = _request for update;
  if v_req.id is null then
    raise exception 'Request not found';
  end if;
  if v_req.organization_id is not null then
    v_org := v_req.organization_id;
  else
    insert into public.organizations (name, city, contact_name, contact_email)
    values (trim(v_req.school_name), trim(v_req.city), trim(v_req.contact_name), lower(trim(v_req.contact_email)))
    returning id into v_org;
  end if;
  update public.school_requests
     set status = 'approved', organization_id = v_org, handled_at = now()
   where id = _request;
  if _invite_contact then
    insert into public.teacher_invites (organization_id, name, email)
    values (v_org, trim(v_req.contact_name), lower(trim(v_req.contact_email)))
    returning code into v_code;
  end if;
  return query select v_org, v_code;
end;
$$;
revoke all on function public.admin_approve_request(uuid, boolean) from public, anon;
grant execute on function public.admin_approve_request(uuid, boolean) to authenticated;

-- Link an existing teacher to a school (e.g. teachers from before invites existed).
create or replace function public.admin_assign_teacher(_user uuid, _org uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public._require_admin();
  if not public.has_role(_user, 'teacher') then
    raise exception 'This account is not a teacher';
  end if;
  insert into public.teacher_memberships (user_id, organization_id) values (_user, _org)
  on conflict (user_id) do update set organization_id = excluded.organization_id;
  update public.schools set organization_id = _org where teacher_id = _user;
end;
$$;
revoke all on function public.admin_assign_teacher(uuid, uuid) from public, anon;
grant execute on function public.admin_assign_teacher(uuid, uuid) to authenticated;

-- Take away teacher rights. The account, the classes and the kids' progress stay,
-- but nobody can see those classes until a teacher is linked again.
create or replace function public.admin_remove_teacher(_user uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public._require_admin();
  if _user = auth.uid() then
    raise exception 'You cannot remove yourself';
  end if;
  delete from public.user_roles where user_id = _user and role = 'teacher';
  delete from public.teacher_memberships where user_id = _user;
end;
$$;
revoke all on function public.admin_remove_teacher(uuid) from public, anon;
grant execute on function public.admin_remove_teacher(uuid) to authenticated;

-- Remove a school: its teachers lose teacher rights, open invites are deleted.
create or replace function public.admin_delete_school(_org uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public._require_admin();
  delete from public.user_roles r
   using public.teacher_memberships m
   where m.organization_id = _org and r.user_id = m.user_id and r.role = 'teacher'
     and r.user_id <> auth.uid();
  delete from public.organizations where id = _org;
end;
$$;
revoke all on function public.admin_delete_school(uuid) from public, anon;
grant execute on function public.admin_delete_school(uuid) to authenticated;

-- ------------------------------------------------------------
-- 7) Make sure the owner's account is admin (no-op if it doesn't exist yet)
-- ------------------------------------------------------------
insert into public.user_roles (user_id, role)
select id, 'admin' from auth.users where lower(email) = 'ferry@brandhumanizing.com'
on conflict (user_id, role) do nothing;
