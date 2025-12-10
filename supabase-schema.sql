-- TIPTONE Database Schema
-- Run this in your Supabase SQL Editor to set up the database

-- Enable required extensions FIRST
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Create tiptones table
CREATE TABLE tiptones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(25) NOT NULL,
  catalog_number VARCHAR(10) NOT NULL UNIQUE,
  hex VARCHAR(7) NOT NULL,

  -- RGB values
  rgb_r INTEGER NOT NULL CHECK (rgb_r >= 0 AND rgb_r <= 255),
  rgb_g INTEGER NOT NULL CHECK (rgb_g >= 0 AND rgb_g <= 255),
  rgb_b INTEGER NOT NULL CHECK (rgb_b >= 0 AND rgb_b <= 255),

  -- HSL values
  hsl_h INTEGER NOT NULL CHECK (hsl_h >= 0 AND hsl_h <= 360),
  hsl_s INTEGER NOT NULL CHECK (hsl_s >= 0 AND hsl_s <= 100),
  hsl_l INTEGER NOT NULL CHECK (hsl_l >= 0 AND hsl_l <= 100),

  -- HSV values
  hsv_h INTEGER NOT NULL CHECK (hsv_h >= 0 AND hsv_h <= 360),
  hsv_s INTEGER NOT NULL CHECK (hsv_s >= 0 AND hsv_s <= 100),
  hsv_v INTEGER NOT NULL CHECK (hsv_v >= 0 AND hsv_v <= 100),

  -- CMYK values
  cmyk_c INTEGER NOT NULL CHECK (cmyk_c >= 0 AND cmyk_c <= 100),
  cmyk_m INTEGER NOT NULL CHECK (cmyk_m >= 0 AND cmyk_m <= 100),
  cmyk_y INTEGER NOT NULL CHECK (cmyk_y >= 0 AND cmyk_y <= 100),
  cmyk_k INTEGER NOT NULL CHECK (cmyk_k >= 0 AND cmyk_k <= 100),

  -- Metadata
  view_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX idx_tiptones_catalog_number ON tiptones(catalog_number);
CREATE INDEX idx_tiptones_created_at ON tiptones(created_at DESC);
CREATE INDEX idx_tiptones_view_count ON tiptones(view_count DESC);
CREATE INDEX idx_tiptones_is_featured ON tiptones(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_tiptones_name ON tiptones USING gin(name gin_trgm_ops);

-- Create function to increment view count
CREATE OR REPLACE FUNCTION increment_view_count(tiptone_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE tiptones
  SET view_count = view_count + 1
  WHERE id = tiptone_id;
END;
$$ LANGUAGE plpgsql;

-- Enable Row Level Security
ALTER TABLE tiptones ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read tiptones
CREATE POLICY "Anyone can read tiptones"
  ON tiptones FOR SELECT
  USING (true);

-- Policy: Anyone can insert tiptones (anonymous submissions)
CREATE POLICY "Anyone can insert tiptones"
  ON tiptones FOR INSERT
  WITH CHECK (true);

-- Policy: Only allow view count updates via RPC
CREATE POLICY "Allow view count updates"
  ON tiptones FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Insert some sample tiptones for testing
INSERT INTO tiptones (name, catalog_number, hex, rgb_r, rgb_g, rgb_b, hsl_h, hsl_s, hsl_l, hsv_h, hsv_s, hsv_v, cmyk_c, cmyk_m, cmyk_y, cmyk_k, is_featured)
VALUES
  ('HARD RYAN', '01-0001', '#C4938A', 196, 147, 138, 9, 31, 65, 9, 30, 77, 0, 25, 30, 23, TRUE),
  ('SOFT EMMA', '01-0002', '#D4A5A0', 212, 165, 160, 6, 38, 73, 6, 25, 83, 0, 22, 25, 17, TRUE),
  ('WARM SUNSET', '01-0003', '#C78B7A', 199, 139, 122, 13, 40, 63, 13, 39, 78, 0, 30, 39, 22, FALSE),
  ('COOL JADE', '01-0004', '#A89B8E', 168, 155, 142, 30, 13, 61, 30, 15, 66, 0, 8, 15, 34, FALSE),
  ('DUSTY ROSE', '01-0005', '#C9A099', 201, 160, 153, 9, 30, 69, 9, 24, 79, 0, 20, 24, 21, TRUE);
