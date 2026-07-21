CREATE TABLE IF NOT EXISTS campaign_benefits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  external_id TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  source_url TEXT NOT NULL,
  category_names TEXT[] NOT NULL DEFAULT '{}',
  target_results TEXT[] NOT NULL DEFAULT '{}',
  benefit_type TEXT NOT NULL CHECK (benefit_type IN ('drink', 'combo')),
  price INTEGER,
  original_price INTEGER,
  discount_label TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  synced_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_campaign_benefits_is_active
  ON campaign_benefits(is_active);

CREATE INDEX IF NOT EXISTS idx_campaign_benefits_target_results
  ON campaign_benefits USING GIN(target_results);

ALTER TABLE campaign_benefits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir lectura publica de beneficios activos"
  ON campaign_benefits
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);
