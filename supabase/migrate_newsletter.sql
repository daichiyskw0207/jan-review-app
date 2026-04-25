-- メルマガ同意フラグをprofilesに追加
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS newsletter_consent boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS newsletter_consent_at timestamptz,
  ADD COLUMN IF NOT EXISTS email text;

-- メルマガ送信履歴テーブル
CREATE TABLE IF NOT EXISTS newsletter_sends (
  id            serial PRIMARY KEY,
  subject       text NOT NULL,
  body_html     text NOT NULL,
  body_text     text,
  sent_at       timestamptz NOT NULL DEFAULT now(),
  sent_by       text NOT NULL,                        -- 管理者のメールアドレス
  recipient_count int NOT NULL DEFAULT 0,
  status        text NOT NULL DEFAULT 'sent'          -- 'sent' | 'failed'
);

-- 管理者だけが参照・操作できるようにRLSを設定
ALTER TABLE newsletter_sends ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_only" ON newsletter_sends
  USING (false)          -- 通常のAnon/Authキーからは読み書き不可
  WITH CHECK (false);
