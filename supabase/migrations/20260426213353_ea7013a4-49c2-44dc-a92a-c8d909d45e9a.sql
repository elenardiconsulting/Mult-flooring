-- Enum for lead status
do $$ begin
  create type public.lead_status as enum (
    'new','in_contact','scheduled','waiting','closed_won','closed_lost','no_show'
  );
exception when duplicate_object then null; end $$;

-- Leads table
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null default '',
  email text not null default '',
  project_type text not null default '',
  message text not null default '',
  status public.lead_status not null default 'new',
  scheduled_at timestamptz,
  notes text not null default '',
  prefer_phone boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- updated_at trigger
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists trg_leads_updated_at on public.leads;
create trigger trg_leads_updated_at
before update on public.leads
for each row execute function public.set_updated_at();

-- RLS
alter table public.leads enable row level security;

drop policy if exists "Anyone can insert leads" on public.leads;
create policy "Anyone can insert leads"
on public.leads for insert
to anon, authenticated
with check (true);

drop policy if exists "Authenticated can read leads" on public.leads;
create policy "Authenticated can read leads"
on public.leads for select
to authenticated
using (true);

drop policy if exists "Authenticated can update leads" on public.leads;
create policy "Authenticated can update leads"
on public.leads for update
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated can delete leads" on public.leads;
create policy "Authenticated can delete leads"
on public.leads for delete
to authenticated
using (true);

-- Realtime
alter table public.leads replica identity full;
do $$ begin
  alter publication supabase_realtime add table public.leads;
exception when duplicate_object then null; end $$;