-- Nourish — Self-care tracker initial schema

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
create type public.item_frequency as enum ('daily', 'weekly', 'custom');

-- ---------------------------------------------------------------------------
-- Profiles
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  avatar_url text,
  timezone text not null default 'UTC',
  onboarding_completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

revoke all on function public.handle_new_user() from public;
revoke all on function public.handle_new_user() from anon, authenticated;

-- ---------------------------------------------------------------------------
-- Categories (5 system domains + user custom)
-- ---------------------------------------------------------------------------
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete cascade,
  name text not null check (char_length(trim(name)) > 0),
  slug text not null check (char_length(trim(slug)) > 0),
  icon text,
  is_default boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint categories_user_slug_unique unique nulls not distinct (user_id, slug)
);

create index categories_user_id_idx on public.categories (user_id);

-- ---------------------------------------------------------------------------
-- Care items (system catalog + user custom)
-- ---------------------------------------------------------------------------
create table public.care_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete cascade,
  category_id uuid not null references public.categories (id) on delete cascade,
  name text not null check (char_length(trim(name)) > 0),
  description text,
  icon text,
  frequency public.item_frequency not null default 'daily',
  frequency_days smallint[] check (
    frequency_days is null
    or (
      cardinality(frequency_days) > 0
      and frequency_days <@ array[1, 2, 3, 4, 5, 6, 7]::smallint[]
    )
  ),
  start_date date not null default date '2020-01-01',
  is_default boolean not null default false,
  archived_at timestamptz,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint care_items_default_owner check (
    (is_default and user_id is null) or (not is_default and user_id is not null)
  )
);

create index care_items_user_id_idx on public.care_items (user_id);
create index care_items_category_id_idx on public.care_items (category_id);
create index care_items_active_idx on public.care_items (user_id) where archived_at is null;

-- ---------------------------------------------------------------------------
-- Hidden default items (per user)
-- ---------------------------------------------------------------------------
create table public.user_hidden_items (
  user_id uuid not null references auth.users (id) on delete cascade,
  item_id uuid not null references public.care_items (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, item_id)
);

-- ---------------------------------------------------------------------------
-- Daily logs
-- ---------------------------------------------------------------------------
create table public.care_logs (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references public.care_items (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  log_date date not null,
  completed boolean not null default false,
  remark text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint care_logs_unique_per_day unique (user_id, item_id, log_date)
);

create index care_logs_user_date_idx on public.care_logs (user_id, log_date desc);
create index care_logs_item_date_idx on public.care_logs (item_id, log_date desc);

-- ---------------------------------------------------------------------------
-- updated_at helper
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger categories_set_updated_at
  before update on public.categories
  for each row execute function public.set_updated_at();

create trigger care_items_set_updated_at
  before update on public.care_items
  for each row execute function public.set_updated_at();

create trigger care_logs_set_updated_at
  before update on public.care_logs
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.care_items enable row level security;
alter table public.user_hidden_items enable row level security;
alter table public.care_logs enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Users can view default and own categories"
  on public.categories for select
  using (is_default = true or user_id = auth.uid());

create policy "Users can insert own categories"
  on public.categories for insert
  with check (auth.uid() = user_id and is_default = false);

create policy "Users can update own categories"
  on public.categories for update
  using (auth.uid() = user_id and is_default = false)
  with check (auth.uid() = user_id and is_default = false);

create policy "Users can delete own categories"
  on public.categories for delete
  using (auth.uid() = user_id and is_default = false);

create policy "Users can view default and own care items"
  on public.care_items for select
  using (is_default = true or user_id = auth.uid());

create policy "Users can insert own care items"
  on public.care_items for insert
  with check (auth.uid() = user_id and is_default = false);

create policy "Users can update own care items"
  on public.care_items for update
  using (auth.uid() = user_id and is_default = false)
  with check (auth.uid() = user_id and is_default = false);

create policy "Users can delete own care items"
  on public.care_items for delete
  using (auth.uid() = user_id and is_default = false);

create policy "Users can view own hidden items"
  on public.user_hidden_items for select
  using (auth.uid() = user_id);

create policy "Users can hide items"
  on public.user_hidden_items for insert
  with check (auth.uid() = user_id);

create policy "Users can unhide items"
  on public.user_hidden_items for delete
  using (auth.uid() = user_id);

create policy "Users can view own care logs"
  on public.care_logs for select
  using (auth.uid() = user_id);

create policy "Users can insert own care logs"
  on public.care_logs for insert
  with check (auth.uid() = user_id);

create policy "Users can update own care logs"
  on public.care_logs for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own care logs"
  on public.care_logs for delete
  using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Seed system categories
-- ---------------------------------------------------------------------------
insert into public.categories (id, user_id, name, slug, icon, is_default, sort_order)
values
  ('11111111-1111-4111-8111-111111111111', null, 'Physical', 'physical', 'heart-pulse', true, 1),
  ('22222222-2222-4222-8222-222222222222', null, 'Social', 'social', 'users', true, 2),
  ('33333333-3333-4333-8333-333333333333', null, 'Emotional', 'emotional', 'brain', true, 3),
  ('44444444-4444-4444-8444-444444444444', null, 'Spiritual', 'spiritual', 'leaf', true, 4),
  ('55555555-5555-4555-8555-555555555555', null, 'Professional', 'professional', 'briefcase', true, 5);

-- ---------------------------------------------------------------------------
-- Seed default care items
-- ---------------------------------------------------------------------------
insert into public.care_items (user_id, category_id, name, icon, is_default, sort_order)
values
  -- Physical
  (null, '11111111-1111-4111-8111-111111111111', 'Eat healthy foods', 'apple', true, 1),
  (null, '11111111-1111-4111-8111-111111111111', 'Take care of personal hygiene', 'sparkles', true, 2),
  (null, '11111111-1111-4111-8111-111111111111', 'Exercise', 'dumbbell', true, 3),
  (null, '11111111-1111-4111-8111-111111111111', 'Wear clothes that help me feel good', 'sparkles', true, 4),
  (null, '11111111-1111-4111-8111-111111111111', 'Eat regularly', 'coffee', true, 5),
  (null, '11111111-1111-4111-8111-111111111111', 'Participate in fun physical activities', 'flame', true, 6),
  (null, '11111111-1111-4111-8111-111111111111', 'Get enough sleep', 'moon', true, 7),
  (null, '11111111-1111-4111-8111-111111111111', 'Go to preventative medical appointments', 'heart-pulse', true, 8),
  (null, '11111111-1111-4111-8111-111111111111', 'Get enough rest when sick', 'moon', true, 9),
  -- Social
  (null, '22222222-2222-4222-8222-222222222222', 'Spend time with people I like', 'users', true, 1),
  (null, '22222222-2222-4222-8222-222222222222', 'Call or write to friends and family who are far away', 'message-circle', true, 2),
  (null, '22222222-2222-4222-8222-222222222222', 'Have stimulating conversations', 'message-circle', true, 3),
  (null, '22222222-2222-4222-8222-222222222222', 'Meet new people', 'users', true, 4),
  (null, '22222222-2222-4222-8222-222222222222', 'Spend time alone with my romantic partner', 'heart', true, 5),
  (null, '22222222-2222-4222-8222-222222222222', 'Ask for help when I need it', 'handshake', true, 6),
  (null, '22222222-2222-4222-8222-222222222222', 'Do enjoyable activities with other people', 'users', true, 7),
  (null, '22222222-2222-4222-8222-222222222222', 'Have intimate time with my romantic partner', 'heart', true, 8),
  (null, '22222222-2222-4222-8222-222222222222', 'Keep in touch with old friends', 'message-circle', true, 9),
  -- Emotional
  (null, '33333333-3333-4333-8333-333333333333', 'Take time off from work, school, and other obligations', 'moon', true, 1),
  (null, '33333333-3333-4333-8333-333333333333', 'Participate in hobbies', 'palette', true, 2),
  (null, '33333333-3333-4333-8333-333333333333', 'Get away from distractions (phone, email)', 'smartphone', true, 3),
  (null, '33333333-3333-4333-8333-333333333333', 'Learn new things unrelated to work or school', 'book-open', true, 4),
  (null, '33333333-3333-4333-8333-333333333333', 'Express my feelings in a healthy way', 'pencil', true, 5),
  (null, '33333333-3333-4333-8333-333333333333', 'Recognize my strengths and achievements', 'sparkles', true, 6),
  (null, '33333333-3333-4333-8333-333333333333', 'Go on vacations or day trips', 'trees', true, 7),
  (null, '33333333-3333-4333-8333-333333333333', 'Do something comforting', 'coffee', true, 8),
  (null, '33333333-3333-4333-8333-333333333333', 'Find reasons to laugh', 'sparkles', true, 9),
  (null, '33333333-3333-4333-8333-333333333333', 'Talk about my problems', 'message-circle', true, 10),
  -- Spiritual
  (null, '44444444-4444-4444-8444-444444444444', 'Spend time in nature', 'trees', true, 1),
  (null, '44444444-4444-4444-8444-444444444444', 'Meditate', 'leaf', true, 2),
  (null, '44444444-4444-4444-8444-444444444444', 'Pray', 'sparkles', true, 3),
  (null, '44444444-4444-4444-8444-444444444444', 'Recognize the things that give meaning to my life', 'heart', true, 4),
  (null, '44444444-4444-4444-8444-444444444444', 'Act in accordance with my morals and values', 'target', true, 5),
  (null, '44444444-4444-4444-8444-444444444444', 'Set aside time for thought and reflection', 'moon', true, 6),
  (null, '44444444-4444-4444-8444-444444444444', 'Participate in a cause that is important to me', 'handshake', true, 7),
  (null, '44444444-4444-4444-8444-444444444444', 'Appreciate art that is impactful to me', 'palette', true, 8),
  -- Professional
  (null, '55555555-5555-4555-8555-555555555555', 'Improve my professional skills', 'graduation-cap', true, 1),
  (null, '55555555-5555-4555-8555-555555555555', 'Say no to excessive new responsibilities', 'target', true, 2),
  (null, '55555555-5555-4555-8555-555555555555', 'Take on projects that are interesting or rewarding', 'briefcase', true, 3),
  (null, '55555555-5555-4555-8555-555555555555', 'Learn new things related to my profession', 'book-open', true, 4),
  (null, '55555555-5555-4555-8555-555555555555', 'Make time to talk and build relationships with colleagues', 'users', true, 5),
  (null, '55555555-5555-4555-8555-555555555555', 'Take breaks during work', 'coffee', true, 6),
  (null, '55555555-5555-4555-8555-555555555555', 'Maintain balance between professional and personal life', 'scale', true, 7),
  (null, '55555555-5555-4555-8555-555555555555', 'Keep a comfortable workspace', 'briefcase', true, 8),
  (null, '55555555-5555-4555-8555-555555555555', 'Advocate for fair pay, benefits, and other needs', 'handshake', true, 9);

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------
create or replace function public.is_item_scheduled(
  p_item public.care_items,
  p_date date
)
returns boolean
language sql
immutable
set search_path = public
as $$
  select case
    when p_date < p_item.start_date then false
    when p_item.frequency = 'daily' then true
    when p_item.frequency in ('weekly', 'custom') then
      extract(isodow from p_date)::smallint = any (
        coalesce(p_item.frequency_days, array[1,2,3,4,5,6,7]::smallint[])
      )
    else false
  end;
$$;

create or replace function public.visible_care_items(p_user_id uuid)
returns setof public.care_items
language sql
stable
security invoker
set search_path = public
as $$
  select i.*
  from public.care_items i
  where i.archived_at is null
    and (
      (i.is_default = true and i.user_id is null)
      or i.user_id = p_user_id
    )
    and not exists (
      select 1
      from public.user_hidden_items h
      where h.user_id = p_user_id and h.item_id = i.id
    );
$$;

-- ---------------------------------------------------------------------------
-- Toggle completion (keeps remark)
-- ---------------------------------------------------------------------------
create or replace function public.toggle_care_completion(
  p_item_id uuid,
  p_date date default (timezone('UTC', now()))::date
)
returns boolean
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_completed boolean;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  select completed into v_completed
  from public.care_logs
  where user_id = auth.uid()
    and item_id = p_item_id
    and log_date = p_date;

  if found then
    update public.care_logs
    set completed = not v_completed
    where user_id = auth.uid()
      and item_id = p_item_id
      and log_date = p_date;
    return not v_completed;
  end if;

  insert into public.care_logs (item_id, user_id, log_date, completed)
  values (p_item_id, auth.uid(), p_date, true);

  return true;
end;
$$;

create or replace function public.upsert_care_remark(
  p_item_id uuid,
  p_date date,
  p_remark text
)
returns void
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_remark text := nullif(trim(coalesce(p_remark, '')), '');
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  insert into public.care_logs (item_id, user_id, log_date, completed, remark)
  values (p_item_id, auth.uid(), p_date, false, v_remark)
  on conflict (user_id, item_id, log_date)
  do update set remark = excluded.remark;
end;
$$;

-- ---------------------------------------------------------------------------
-- Metrics
-- ---------------------------------------------------------------------------
create or replace function public.get_care_metrics(
  p_user_id uuid default auth.uid(),
  p_start_date date default null,
  p_end_date date default null
)
returns table (
  completion_rate numeric,
  current_streak integer,
  growth_trend numeric,
  steps_forward integer,
  longest_streak integer,
  physical_rate numeric,
  social_rate numeric,
  emotional_rate numeric,
  spiritual_rate numeric,
  professional_rate numeric,
  strongest_category_id uuid,
  strongest_category_name text,
  needs_attention_category_id uuid,
  needs_attention_category_name text
)
language plpgsql
stable
security invoker
set search_path = public
as $$
declare
  v_end date := coalesce(p_end_date, (timezone('UTC', now()))::date);
  v_start date := coalesce(p_start_date, v_end - 29);
  v_prev_start date;
  v_prev_end date;
begin
  if p_user_id is null or p_user_id <> auth.uid() then
    p_user_id := auth.uid();
  end if;
  if p_user_id is null then
    return;
  end if;

  v_prev_end := v_start - 1;
  v_prev_start := v_prev_end - (v_end - v_start);

  return query
  with items as (
    select * from public.visible_care_items(p_user_id)
  ),
  days as (
    select generate_series(v_start, v_end, interval '1 day')::date as d
  ),
  scheduled as (
    select i.id as item_id, i.category_id, days.d
    from items i
    cross join days
    where public.is_item_scheduled(i, days.d)
  ),
  completed as (
    select s.item_id, s.category_id, s.d
    from scheduled s
    join public.care_logs l
      on l.user_id = p_user_id
     and l.item_id = s.item_id
     and l.log_date = s.d
     and l.completed = true
  ),
  overall as (
    select
      count(*)::numeric as scheduled_count,
      (select count(*)::numeric from completed) as completed_count
    from scheduled
  ),
  domain as (
    select
      c.slug,
      c.id as category_id,
      c.name as category_name,
      count(s.*)::numeric as scheduled_count,
      count(comp.*)::numeric as completed_count,
      case
        when count(s.*) = 0 then 0
        else round((count(comp.*)::numeric / count(s.*)) * 100, 1)
      end as rate
    from public.categories c
    left join scheduled s on s.category_id = c.id
    left join completed comp on comp.item_id = s.item_id and comp.d = s.d
    where c.is_default = true
    group by c.slug, c.id, c.name
  ),
  prev_days as (
    select generate_series(v_prev_start, v_prev_end, interval '1 day')::date as d
  ),
  prev_scheduled as (
    select i.id as item_id, prev_days.d
    from items i
    cross join prev_days
    where public.is_item_scheduled(i, prev_days.d)
  ),
  prev_completed as (
    select count(*)::numeric as completed_count
    from prev_scheduled s
    join public.care_logs l
      on l.user_id = p_user_id
     and l.item_id = s.item_id
     and l.log_date = s.d
     and l.completed = true
  ),
  prev_overall as (
    select
      count(*)::numeric as scheduled_count,
      (select completed_count from prev_completed) as completed_count
    from prev_scheduled
  ),
  daily as (
    select
      days.d,
      count(s.*)::integer as scheduled_count,
      count(comp.*)::integer as completed_count
    from days
    left join scheduled s on s.d = days.d
    left join completed comp on comp.d = days.d and comp.item_id = s.item_id
    group by days.d
  ),
  day_flags as (
    select d, (completed_count > 0) as active
    from daily
  ),
  grouped as (
    select
      d,
      active,
      d - (row_number() over (partition by active order by d))::integer as grp
    from day_flags
    where active
  ),
  streaks as (
    select count(*)::integer as len, max(d) as end_date
    from grouped
    group by grp
  ),
  strongest as (
    select category_id, category_name, rate
    from domain
    where scheduled_count > 0
    order by rate desc, category_name
    limit 1
  ),
  weakest as (
    select category_id, category_name, rate
    from domain
    where scheduled_count > 0
    order by rate asc, category_name
    limit 1
  )
  select
    case when o.scheduled_count = 0 then 0
         else round((o.completed_count / o.scheduled_count) * 100, 1)
    end,
    coalesce((
      select s.len from streaks s
      where s.end_date >= v_end - 1
      order by s.end_date desc
      limit 1
    ), 0),
    (
      case
        when po.scheduled_count = 0 or o.scheduled_count = 0 then 0
        else round(
          ((o.completed_count / nullif(o.scheduled_count, 0))
            - (po.completed_count / nullif(po.scheduled_count, 0))),
          4
        )
      end
    ),
    (
      select count(*)::integer
      from public.care_logs
      where user_id = p_user_id and completed = true
    ),
    coalesce((select max(len) from streaks), 0),
    coalesce((select rate from domain where slug = 'physical'), 0),
    coalesce((select rate from domain where slug = 'social'), 0),
    coalesce((select rate from domain where slug = 'emotional'), 0),
    coalesce((select rate from domain where slug = 'spiritual'), 0),
    coalesce((select rate from domain where slug = 'professional'), 0),
    (select category_id from strongest),
    (select category_name from strongest),
    (select category_id from weakest),
    (select category_name from weakest)
  from overall o
  cross join prev_overall po;
end;
$$;

create or replace function public.get_care_score_trend(
  p_user_id uuid default auth.uid(),
  p_days integer default 30
)
returns table (
  score_date date,
  completion_rate numeric,
  current_streak integer,
  physical_rate numeric,
  social_rate numeric,
  emotional_rate numeric,
  spiritual_rate numeric,
  professional_rate numeric,
  growth_trend numeric
)
language plpgsql
stable
security invoker
set search_path = public
as $$
declare
  v_end date := (timezone('UTC', now()))::date;
  v_start date;
  i integer;
  m record;
begin
  if p_user_id is null or p_user_id <> auth.uid() then
    p_user_id := auth.uid();
  end if;
  if p_user_id is null then
    return;
  end if;

  v_start := v_end - (greatest(p_days, 1) - 1);

  for i in 0..(v_end - v_start) loop
    select * into m from public.get_care_metrics(
      p_user_id,
      v_start,
      v_start + i
    );
    score_date := v_start + i;
    completion_rate := coalesce(m.completion_rate, 0);
    current_streak := coalesce(m.current_streak, 0);
    physical_rate := coalesce(m.physical_rate, 0);
    social_rate := coalesce(m.social_rate, 0);
    emotional_rate := coalesce(m.emotional_rate, 0);
    spiritual_rate := coalesce(m.spiritual_rate, 0);
    professional_rate := coalesce(m.professional_rate, 0);
    growth_trend := coalesce(m.growth_trend, 0);
    return next;
  end loop;
end;
$$;

create or replace function public.get_category_analytics(
  p_category_id uuid,
  p_start_date date default null,
  p_end_date date default null
)
returns table (
  category_id uuid,
  category_name text,
  item_count integer,
  scheduled_days integer,
  completed_days integer,
  completion_rate numeric
)
language plpgsql
stable
security invoker
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_end date := coalesce(p_end_date, (timezone('UTC', now()))::date);
  v_start date := coalesce(p_start_date, v_end - 29);
begin
  if v_user is null then
    return;
  end if;

  return query
  with items as (
    select i.*
    from public.visible_care_items(v_user) i
    where i.category_id = p_category_id
  ),
  days as (
    select generate_series(v_start, v_end, interval '1 day')::date as d
  ),
  scheduled as (
    select i.id as item_id, days.d
    from items i
    cross join days
    where public.is_item_scheduled(i, days.d)
  ),
  completed as (
    select count(*)::integer as n
    from scheduled s
    join public.care_logs l
      on l.user_id = v_user
     and l.item_id = s.item_id
     and l.log_date = s.d
     and l.completed = true
  )
  select
    p_category_id,
    (select name from public.categories where id = p_category_id),
    (select count(*)::integer from items),
    (select count(*)::integer from scheduled),
    (select n from completed),
    case
      when (select count(*) from scheduled) = 0 then 0
      else round(((select n from completed)::numeric / (select count(*) from scheduled)) * 100, 1)
    end;
end;
$$;

create or replace function public.get_care_calendar(
  p_year integer,
  p_month integer,
  p_user_id uuid default auth.uid()
)
returns table (
  calendar_date date,
  scheduled_count integer,
  completed_count integer,
  completion_rate numeric
)
language plpgsql
stable
security invoker
set search_path = public
as $$
declare
  v_start date;
  v_end date;
begin
  if p_user_id is null or p_user_id <> auth.uid() then
    p_user_id := auth.uid();
  end if;
  if p_user_id is null then
    return;
  end if;

  v_start := make_date(p_year, p_month, 1);
  v_end := (v_start + interval '1 month' - interval '1 day')::date;

  return query
  with items as (
    select * from public.visible_care_items(p_user_id)
  ),
  days as (
    select generate_series(v_start, v_end, interval '1 day')::date as d
  ),
  scheduled as (
    select i.id as item_id, days.d
    from items i
    cross join days
    where public.is_item_scheduled(i, days.d)
  )
  select
    days.d,
    count(s.item_id)::integer,
    count(l.id) filter (where l.completed)::integer,
    case
      when count(s.item_id) = 0 then 0
      else round(
        (count(l.id) filter (where l.completed)::numeric / count(s.item_id)) * 100,
        1
      )
    end
  from days
  left join scheduled s on s.d = days.d
  left join public.care_logs l
    on l.user_id = p_user_id
   and l.item_id = s.item_id
   and l.log_date = days.d
  group by days.d
  order by days.d;
end;
$$;

grant execute on function public.toggle_care_completion(uuid, date) to authenticated;
grant execute on function public.upsert_care_remark(uuid, date, text) to authenticated;
grant execute on function public.get_care_metrics(uuid, date, date) to authenticated;
grant execute on function public.get_care_score_trend(uuid, integer) to authenticated;
grant execute on function public.get_category_analytics(uuid, date, date) to authenticated;
grant execute on function public.get_care_calendar(integer, integer, uuid) to authenticated;
grant execute on function public.visible_care_items(uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- Avatar storage
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'avatars',
  'avatars',
  true,
  2097152,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

do $$
begin
  create policy "Avatar images are publicly accessible"
    on storage.objects for select
    using (bucket_id = 'avatars');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create policy "Users can upload own avatar"
    on storage.objects for insert
    to authenticated
    with check (
      bucket_id = 'avatars'
      and (storage.foldername(name))[1] = auth.uid()::text
    );
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create policy "Users can update own avatar"
    on storage.objects for update
    to authenticated
    using (
      bucket_id = 'avatars'
      and (storage.foldername(name))[1] = auth.uid()::text
    )
    with check (
      bucket_id = 'avatars'
      and (storage.foldername(name))[1] = auth.uid()::text
    );
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create policy "Users can delete own avatar"
    on storage.objects for delete
    to authenticated
    using (
      bucket_id = 'avatars'
      and (storage.foldername(name))[1] = auth.uid()::text
    );
exception
  when duplicate_object then null;
end $$;
