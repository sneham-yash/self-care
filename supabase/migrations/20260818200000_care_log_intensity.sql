-- Daily logs store how well/often each care item was done (0–3).
-- completed stays in sync so existing metrics RPCs keep working.

alter table public.care_logs
  add column if not exists intensity smallint not null default 0;

alter table public.care_logs
  drop constraint if exists care_logs_intensity_range;

alter table public.care_logs
  add constraint care_logs_intensity_range
  check (intensity between 0 and 3);

comment on column public.care_logs.intensity is
  '0 = not logged, 1 = rarely/poorly, 2 = sometimes/okay, 3 = often/well';

update public.care_logs
set intensity = 3
where completed = true
  and intensity = 0;

create or replace function public.set_care_intensity(
  p_item_id uuid,
  p_intensity smallint,
  p_date date default (timezone('UTC', now()))::date
)
returns smallint
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_current smallint;
  v_next smallint;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  if p_intensity is null or p_intensity < 1 or p_intensity > 3 then
    raise exception 'Intensity must be 1, 2, or 3';
  end if;

  select intensity into v_current
  from public.care_logs
  where user_id = auth.uid()
    and item_id = p_item_id
    and log_date = p_date;

  if found then
    if v_current = p_intensity then
      v_next := 0;
    else
      v_next := p_intensity;
    end if;

    update public.care_logs
    set
      intensity = v_next,
      completed = (v_next > 0)
    where user_id = auth.uid()
      and item_id = p_item_id
      and log_date = p_date;

    return v_next;
  end if;

  insert into public.care_logs (
    item_id,
    user_id,
    log_date,
    intensity,
    completed
  )
  values (
    p_item_id,
    auth.uid(),
    p_date,
    p_intensity,
    true
  );

  return p_intensity;
end;
$$;

-- Keep the old toggle in sync with intensity (on = well/often).
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
    set
      completed = not v_completed,
      intensity = case when not v_completed then 3 else 0 end
    where user_id = auth.uid()
      and item_id = p_item_id
      and log_date = p_date;
    return not v_completed;
  end if;

  insert into public.care_logs (
    item_id,
    user_id,
    log_date,
    completed,
    intensity
  )
  values (
    p_item_id,
    auth.uid(),
    p_date,
    true,
    3
  );

  return true;
end;
$$;

grant execute on function public.set_care_intensity(uuid, smallint, date) to authenticated;
