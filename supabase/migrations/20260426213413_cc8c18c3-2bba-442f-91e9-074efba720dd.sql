-- Fix function search_path
create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- Tighten UPDATE / DELETE policies (require an authenticated user id)
drop policy if exists "Authenticated can update leads" on public.leads;
create policy "Authenticated can update leads"
on public.leads for update
to authenticated
using (auth.uid() is not null)
with check (auth.uid() is not null);

drop policy if exists "Authenticated can delete leads" on public.leads;
create policy "Authenticated can delete leads"
on public.leads for delete
to authenticated
using (auth.uid() is not null);

-- INSERT policy: anon allowed (public form), authenticated allowed
drop policy if exists "Anyone can insert leads" on public.leads;
create policy "Public can insert leads from forms"
on public.leads for insert
to anon, authenticated
with check (
  length(coalesce(name, '')) between 1 and 200
  and length(coalesce(email, '')) <= 200
  and length(coalesce(phone, '')) <= 50
  and length(coalesce(message, '')) <= 5000
);