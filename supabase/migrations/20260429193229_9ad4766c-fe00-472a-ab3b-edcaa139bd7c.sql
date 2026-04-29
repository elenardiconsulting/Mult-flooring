-- Verify and recreate function for webhook notification
CREATE OR REPLACE FUNCTION public.notify_new_lead_webhook()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  v_url text := 'https://ycjkcdcqhgnvjeohgatu.supabase.co/functions/v1/notify-new-lead';
BEGIN
  BEGIN
    PERFORM net.http_post(
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
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'notify_new_lead_webhook failed: %', SQLERRM;
  END;
  RETURN NEW;
END;
$$;

-- Drop and recreate trigger
DROP TRIGGER IF EXISTS on_new_lead_notify ON public.leads;

CREATE TRIGGER on_new_lead_notify
  AFTER INSERT ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_new_lead_webhook();

-- Clean up old or invalid push subscriptions
DELETE FROM push_subscriptions
WHERE endpoint NOT LIKE '%mozilla%'
  AND endpoint NOT LIKE '%apple%'
  AND endpoint NOT LIKE '%google%'
  AND endpoint NOT LIKE '%windows%';