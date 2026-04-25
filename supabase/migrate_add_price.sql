-- products テーブルにメーカー希望小売価格カラムを追加
-- Supabase ダッシュボード → SQL Editor で実行してください

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS price integer;

COMMENT ON COLUMN products.price IS 'メーカー希望小売価格（円・税抜）。未設定の場合は NULL。';
