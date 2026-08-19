-- Align default care item names to match the SUCHETA Self-Care Points spec.
-- Only renames copy; IDs, category assignments, logs, and RPCs are unchanged.

update public.care_items
set name = 'Wear clothes that help me feel good about myself'
where name = 'Wear clothes that help me feel good'
  and user_id is null
  and is_default = true;

update public.care_items
set name = 'Participate in fun activities'
where name = 'Participate in fun physical activities'
  and user_id is null
  and is_default = true;

update public.care_items
set name = 'Get away from distractions'
where name = 'Get away from distractions (phone, email)'
  and user_id is null
  and is_default = true;

update public.care_items
set name = 'Say "no" to excessive new responsibilities'
where name = 'Say no to excessive new responsibilities'
  and user_id is null
  and is_default = true;

update public.care_items
set name = 'Maintain balance between my professional and personal life'
where name = 'Maintain balance between professional and personal life'
  and user_id is null
  and is_default = true;
