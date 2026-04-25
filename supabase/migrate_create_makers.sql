-- ============================================================
-- makers テーブル作成
-- Supabase ダッシュボードの SQL エディタで実行してください
-- ============================================================

CREATE TABLE IF NOT EXISTS makers (
  id         BIGSERIAL PRIMARY KEY,
  name       TEXT NOT NULL UNIQUE,
  category   TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS を有効化
ALTER TABLE makers ENABLE ROW LEVEL SECURITY;

-- 全員が参照可能
CREATE POLICY "makers_select_all"
  ON makers FOR SELECT
  USING (true);
