-- Garantir que pg_net está habilitado
create extension if not exists pg_net with schema extensions;

-- Recriar função do webhook sem dependência de service role key
create or replace function public.notify_new_lead_webhook()
returns trigger
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_url text := 'https://ycjkcdcqhgnvjeohgatu.supabase.co/functions/v1/notify-new-lead';
begin
  begin
    perform net.http_post(
      url := v_url,
      headers := jsonb_build_object(
        'Content-Type', 'application/json'
      ),
      body := jsonb_build_object(
        'type', 'INSERT',
        'table', 'leads',
        'schema', 'public',
        'record', row_to_json(NEW)::jsonb
      )
    );
  exception when others then
    raise warning 'notify_new_lead_webhook failed: %', SQLERRM;
  end;

  return NEW;
end;
$$;

-- Recriar trigger
drop trigger if exists on_new_lead_notify on public.leads;

create trigger on_new_lead_notify
  after insert on public.leads
  for each row
  execute function public.notify_new_lead_webhook();