CREATE TABLE IF NOT EXISTS public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  rating int NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment text,
  source text NOT NULL DEFAULT 'website',
  approved boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.reviews TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reviews TO authenticated;
GRANT ALL ON public.reviews TO service_role;

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone can submit a review"
  ON public.reviews FOR INSERT
  TO anon, authenticated
  WITH CHECK (approved = true AND source = 'website' AND length(name) BETWEEN 1 AND 100 AND length(coalesce(comment,'')) <= 2000);

CREATE POLICY "public reads approved reviews"
  ON public.reviews FOR SELECT
  TO anon, authenticated
  USING (approved = true);

CREATE POLICY "authenticated can update reviews"
  ON public.reviews FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "authenticated can delete reviews"
  ON public.reviews FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);