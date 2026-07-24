create table if not exists public.quote_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  product_id uuid references public.products(id)
    on delete set null,
  product_name text not null,
  product_price numeric,
  reference_code text not null unique,
  session_id text,
  status text not null default 'pending'
    check (status in (
      'pending','contacted','closed_won','closed_lost'
    ))
);

-- Índices
create index if not exists quote_requests_product_idx
  on public.quote_requests (product_id);
create index if not exists quote_requests_created_idx
  on public.quote_requests (created_at desc);

-- RLS
alter table public.quote_requests
  enable row level security;

-- Qualquer visitante pode inserir
create policy "public_insert_quotes"
  on public.quote_requests for insert
  with check (true);

-- Só autenticados podem ler e atualizar
create policy "auth_read_quotes"
  on public.quote_requests for select
  to authenticated
  using (auth.uid() is not null);

create policy "auth_update_quotes"
  on public.quote_requests for update
  to authenticated
  using (auth.uid() is not null);

-- Grant privileges
grant insert on public.quote_requests to anon;
grant select, insert, update on public.quote_requests to authenticated;
grant all on public.quote_requests to service_role;

-- Habilitar realtime
alter publication supabase_realtime
  add table quote_requests;