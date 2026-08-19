-- user_item_flags: score-neutral per-user, per-item flags.
-- "wants_improvement" does NOT affect any score calculation.

create table if not exists public.user_item_flags (
  user_id uuid not null references auth.users (id) on delete cascade,
  item_id uuid not null references public.care_items (id) on delete cascade,
  wants_improvement boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, item_id)
);

create index if not exists user_item_flags_user_id_idx
  on public.user_item_flags (user_id);

comment on table public.user_item_flags is
  'Per-user item flags (e.g. wants_improvement). Score-neutral — never affects Self-Care Score calculations.';

-- RLS
alter table public.user_item_flags enable row level security;

create policy "user_item_flags: user owns their flags"
  on public.user_item_flags
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Helper: upsert wants_improvement flag
create or replace function public.set_wants_improvement(
  p_item_id uuid,
  p_wants_improvement boolean
)
returns void
language plpgsql
security invoker
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  insert into public.user_item_flags (user_id, item_id, wants_improvement, updated_at)
  values (auth.uid(), p_item_id, p_wants_improvement, now())
  on conflict (user_id, item_id)
  do update set
    wants_improvement = excluded.wants_improvement,
    updated_at = now();
end;
$$;

grant execute on function public.set_wants_improvement(uuid, boolean) to authenticated;

-- Helper: fetch latest assessed intensity per item for Self-Care Score.
-- Returns only rows with intensity 1-3 (not 0), latest log_date per item.
-- Used by useSelfCareScore to build current assessment snapshot.
create or replace function public.get_latest_item_intensities(
  p_as_of date default null
)
returns table (
  item_id uuid,
  intensity smallint,
  log_date date
)
language sql
security invoker
set search_path = public
stable
as $$
  select distinct on (cl.item_id)
    cl.item_id,
    cl.intensity::smallint,
    cl.log_date
  from public.care_logs cl
  where cl.user_id = auth.uid()
    and cl.intensity between 1 and 3
    and (p_as_of is null or cl.log_date <= p_as_of)
  order by cl.item_id, cl.log_date desc;
$$;

grant execute on function public.get_latest_item_intensities(date) to authenticated;
