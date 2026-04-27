-- Habilitar extensão pg_net para chamadas HTTP
create extension if not exists pg_net with schema extensions;

-- Armazenar service role key no Vault (de forma segura)
-- Se já existir, atualiza; caso contrário, insere
do $$
declare
  v_secret_id uuid;
begin
  select id into v_secret_id
  from vault.secrets
  where name = 'service_role_key';

  if v_secret_id is null then
    perform vault.create_secret(
      current_setting('app.settings.service_role_key', true),
      'service_role_key',
      'Service role key for internal webhook calls'
    );
  end if;
exception when others then
  -- Se o setting não estiver disponível, ignora — será preenchido manualmente
  null;
end $$;

-- Criar função que dispara o webhook
create or replace function public.notify_new_lead_webhook()
returns trigger
language plpgsql
security definer
set search_path = public, extensions, vault
as $$
declare
  v_service_key text;
  v_url text := 'https://ycjkcdcqhgnvjeohgatu.supabase.co/functions/v1/notify-new-lead';
begin
  -- Buscar service role key do Vault
  begin
    select decrypted_secret into v_service_key
    from vault.decrypted_secrets
    where name = 'service_role_key'
    limit 1;
  exception when others then
    v_service_key := null;
  end;

  -- Se não tiver chave, não bloqueia o insert
  if v_service_key is null or v_service_key = '' then
    raise warning 'service_role_key not found in vault — webhook skipped';
    return NEW;
  end if;

  -- Disparar webhook
  begin
    perform net.http_post(
      url := v_url,
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || v_service_key
      ),
      body := jsonb_build_object(
        'type', 'INSERT',
        'table', 'leads',
        'schema', 'public',
        'record', row_to_json(NEW)::jsonb
      )
    );
  exception when others then
    -- Nunca bloqueia o insert se o webhook falhar
    raise warning 'notify_new_lead_webhook failed: %', SQLERRM;
  end;

  return NEW;
end;
$$;

-- Criar trigger na tabela leads
drop trigger if exists on_new_lead_notify on public.leads;

create trigger on_new_lead_notify
  after insert on public.leads
  for each row
  execute function public.notify_new_lead_webhook();