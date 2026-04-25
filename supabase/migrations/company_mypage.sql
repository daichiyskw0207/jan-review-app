-- 企業登録申請テーブル
create table if not exists company_applications (
  id serial primary key,
  company_name text not null,
  contact_name text not null,
  email text not null,
  website text,
  message text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

-- 企業とユーザーの紐付けテーブル（承認後に作成）
create table if not exists company_users (
  user_id uuid not null references auth.users(id) on delete cascade,
  company_id integer not null references companies(id) on delete cascade,
  role text not null default 'owner' check (role in ('owner', 'member')),
  created_at timestamptz not null default now(),
  primary key (user_id, company_id)
);

-- productsに画像URLカラムを追加
alter table products add column if not exists image_url text;

-- company_applicationsのインデックス
create index if not exists company_applications_status_idx on company_applications(status);
create index if not exists company_applications_email_idx on company_applications(email);
