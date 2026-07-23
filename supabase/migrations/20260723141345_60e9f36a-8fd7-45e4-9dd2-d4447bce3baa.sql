
CREATE TABLE IF NOT EXISTS public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  name text NOT NULL,
  price numeric,
  price_note text DEFAULT '+ tax · installation available',
  description text,
  image_urls text[] NOT NULL DEFAULT '{}',
  status text NOT NULL DEFAULT 'published'
    CHECK (status IN ('published','draft','sold'))
);

GRANT SELECT ON public.products TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

DROP TRIGGER IF EXISTS products_updated_at ON public.products;
CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE POLICY "public_read_published"
  ON public.products FOR SELECT
  USING (status = 'published');

CREATE POLICY "auth_read_all"
  ON public.products FOR SELECT
  TO authenticated USING (auth.uid() IS NOT NULL);

CREATE POLICY "auth_insert"
  ON public.products FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "auth_update"
  ON public.products FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "auth_delete"
  ON public.products FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);

ALTER PUBLICATION supabase_realtime ADD TABLE public.products;

-- Storage policies for product-photos bucket
CREATE POLICY "public_read_product_photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-photos');

CREATE POLICY "auth_upload_product_photos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'product-photos' AND auth.uid() IS NOT NULL);

CREATE POLICY "auth_delete_product_photos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'product-photos' AND auth.uid() IS NOT NULL);
