-- ============================================================
-- product_jan_codes テーブル作成 & 既存データ移行
-- ============================================================

-- 1. 新テーブル作成
CREATE TABLE IF NOT EXISTS product_jan_codes (
  id          BIGSERIAL PRIMARY KEY,
  product_id  BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  jan_code    TEXT NOT NULL UNIQUE,
  size_label  TEXT,  -- 例: '900ml', '1800ml', '25度900ml' など（任意）
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. インデックス（JANコード検索を高速化）
CREATE INDEX IF NOT EXISTS idx_product_jan_codes_jan_code
  ON product_jan_codes (jan_code);

CREATE INDEX IF NOT EXISTS idx_product_jan_codes_product_id
  ON product_jan_codes (product_id);

-- 3. RLS
ALTER TABLE product_jan_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "product_jan_codes_select_all"
  ON product_jan_codes FOR SELECT
  USING (true);

-- 4. 既存の products.jan_code を新テーブルへ移行
INSERT INTO product_jan_codes (product_id, jan_code)
SELECT id, jan_code
FROM products
WHERE jan_code IS NOT NULL
ON CONFLICT (jan_code) DO NOTHING;
