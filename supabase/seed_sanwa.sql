-- ============================================================
-- 三和酒類 全商品マスタ
-- ※ JANコードは暫定値。実物バーコードで要確認。
-- ============================================================

-- いいちこ 25度
WITH p AS (
  INSERT INTO products (name, category, sub_category, store_name, jan_code, score, created_at)
  VALUES ('いいちこ 25度', 'ドリンク', '焼酎（麦）', '三和酒類', '4905233100010', 0, now())
  RETURNING id
)
INSERT INTO product_jan_codes (product_id, jan_code, size_label, created_at)
SELECT p.id, j.jan_code, j.size_label, now() FROM p
CROSS JOIN (VALUES
  ('4905233100010', '900ml PET'),
  ('4905233100027', '1800ml PET'),
  ('4905233100034', '720ml 瓶'),
  ('4905233100041', '1800ml 瓶'),
  ('4905233100058', '2700ml PET'),
  ('4905233100065', '4000ml PET')
) AS j(jan_code, size_label);

-- いいちこ 20度
WITH p AS (
  INSERT INTO products (name, category, sub_category, store_name, jan_code, score, created_at)
  VALUES ('いいちこ 20度', 'ドリンク', '焼酎（麦）', '三和酒類', '4905233100072', 0, now())
  RETURNING id
)
INSERT INTO product_jan_codes (product_id, jan_code, size_label, created_at)
SELECT p.id, j.jan_code, j.size_label, now() FROM p
CROSS JOIN (VALUES
  ('4905233100072', '900ml PET'),
  ('4905233100089', '1800ml PET'),
  ('4905233100096', '720ml 瓶')
) AS j(jan_code, size_label);

-- いいちこ スペシャル 30度
WITH p AS (
  INSERT INTO products (name, category, sub_category, store_name, jan_code, score, created_at)
  VALUES ('いいちこ スペシャル 30度', 'ドリンク', '焼酎（麦）', '三和酒類', '4905233100102', 0, now())
  RETURNING id
)
INSERT INTO product_jan_codes (product_id, jan_code, size_label, created_at)
SELECT p.id, j.jan_code, j.size_label, now() FROM p
CROSS JOIN (VALUES
  ('4905233100102', '720ml 瓶'),
  ('4905233100119', '1800ml 瓶'),
  ('4905233100126', '900ml PET')
) AS j(jan_code, size_label);

-- いいちこ フラスコボトル 25度
WITH p AS (
  INSERT INTO products (name, category, sub_category, store_name, jan_code, score, created_at)
  VALUES ('いいちこ フラスコボトル 25度', 'ドリンク', '焼酎（麦）', '三和酒類', '4905233100133', 0, now())
  RETURNING id
)
INSERT INTO product_jan_codes (product_id, jan_code, size_label, created_at)
SELECT p.id, j.jan_code, j.size_label, now() FROM p
CROSS JOIN (VALUES
  ('4905233100133', '720ml 瓶')
) AS j(jan_code, size_label);

-- いいちこ フラスコボトル 30度
WITH p AS (
  INSERT INTO products (name, category, sub_category, store_name, jan_code, score, created_at)
  VALUES ('いいちこ フラスコボトル 30度', 'ドリンク', '焼酎（麦）', '三和酒類', '4905233100140', 0, now())
  RETURNING id
)
INSERT INTO product_jan_codes (product_id, jan_code, size_label, created_at)
SELECT p.id, j.jan_code, j.size_label, now() FROM p
CROSS JOIN (VALUES
  ('4905233100140', '720ml 瓶')
) AS j(jan_code, size_label);

-- いいちこ 日田全麹 25度
WITH p AS (
  INSERT INTO products (name, category, sub_category, store_name, jan_code, score, created_at)
  VALUES ('いいちこ 日田全麹 25度', 'ドリンク', '焼酎（麦）', '三和酒類', '4905233100157', 0, now())
  RETURNING id
)
INSERT INTO product_jan_codes (product_id, jan_code, size_label, created_at)
SELECT p.id, j.jan_code, j.size_label, now() FROM p
CROSS JOIN (VALUES
  ('4905233100157', '720ml 瓶'),
  ('4905233100164', '1800ml 瓶')
) AS j(jan_code, size_label);

-- いいちこ シルエット 25度
WITH p AS (
  INSERT INTO products (name, category, sub_category, store_name, jan_code, score, created_at)
  VALUES ('いいちこ シルエット 25度', 'ドリンク', '焼酎（麦）', '三和酒類', '4905233100171', 0, now())
  RETURNING id
)
INSERT INTO product_jan_codes (product_id, jan_code, size_label, created_at)
SELECT p.id, j.jan_code, j.size_label, now() FROM p
CROSS JOIN (VALUES
  ('4905233100171', '720ml 瓶'),
  ('4905233100188', '1800ml 瓶')
) AS j(jan_code, size_label);

-- いいちこ シルエット 35度
WITH p AS (
  INSERT INTO products (name, category, sub_category, store_name, jan_code, score, created_at)
  VALUES ('いいちこ シルエット 35度', 'ドリンク', '焼酎（麦）', '三和酒類', '4905233100195', 0, now())
  RETURNING id
)
INSERT INTO product_jan_codes (product_id, jan_code, size_label, created_at)
SELECT p.id, j.jan_code, j.size_label, now() FROM p
CROSS JOIN (VALUES
  ('4905233100195', '720ml 瓶'),
  ('4905233100201', '1800ml 瓶')
) AS j(jan_code, size_label);

-- 百年の孤独 40度
WITH p AS (
  INSERT INTO products (name, category, sub_category, store_name, jan_code, score, created_at)
  VALUES ('百年の孤独 40度', 'ドリンク', '焼酎（麦）', '三和酒類', '4905233100218', 0, now())
  RETURNING id
)
INSERT INTO product_jan_codes (product_id, jan_code, size_label, created_at)
SELECT p.id, j.jan_code, j.size_label, now() FROM p
CROSS JOIN (VALUES
  ('4905233100218', '720ml 瓶'),
  ('4905233100225', '1800ml 瓶')
) AS j(jan_code, size_label);

-- いいちこ 25度 缶（RTD）
WITH p AS (
  INSERT INTO products (name, category, sub_category, store_name, jan_code, score, created_at)
  VALUES ('いいちこ 25度 缶', 'ドリンク', '焼酎（麦）', '三和酒類', '4905233100232', 0, now())
  RETURNING id
)
INSERT INTO product_jan_codes (product_id, jan_code, size_label, created_at)
SELECT p.id, j.jan_code, j.size_label, now() FROM p
CROSS JOIN (VALUES
  ('4905233100232', '350ml缶'),
  ('4905233100249', '500ml缶')
) AS j(jan_code, size_label);

-- 安心院ワイン シャルドネ（白）
WITH p AS (
  INSERT INTO products (name, category, sub_category, store_name, jan_code, score, created_at)
  VALUES ('安心院ワイン シャルドネ', 'ドリンク', 'ワイン', '三和酒類', '4905233200010', 0, now())
  RETURNING id
)
INSERT INTO product_jan_codes (product_id, jan_code, size_label, created_at)
SELECT p.id, j.jan_code, j.size_label, now() FROM p
CROSS JOIN (VALUES
  ('4905233200010', '720ml 瓶'),
  ('4905233200027', '375ml 瓶')
) AS j(jan_code, size_label);

-- 安心院ワイン カベルネ・ソーヴィニヨン（赤）
WITH p AS (
  INSERT INTO products (name, category, sub_category, store_name, jan_code, score, created_at)
  VALUES ('安心院ワイン カベルネ・ソーヴィニヨン', 'ドリンク', 'ワイン', '三和酒類', '4905233200034', 0, now())
  RETURNING id
)
INSERT INTO product_jan_codes (product_id, jan_code, size_label, created_at)
SELECT p.id, j.jan_code, j.size_label, now() FROM p
CROSS JOIN (VALUES
  ('4905233200034', '720ml 瓶'),
  ('4905233200041', '375ml 瓶')
) AS j(jan_code, size_label);

-- 安心院ワイン ロゼ
WITH p AS (
  INSERT INTO products (name, category, sub_category, store_name, jan_code, score, created_at)
  VALUES ('安心院ワイン ロゼ', 'ドリンク', 'ワイン', '三和酒類', '4905233200058', 0, now())
  RETURNING id
)
INSERT INTO product_jan_codes (product_id, jan_code, size_label, created_at)
SELECT p.id, j.jan_code, j.size_label, now() FROM p
CROSS JOIN (VALUES
  ('4905233200058', '720ml 瓶')
) AS j(jan_code, size_label);

-- 安心院スパークリングワイン
WITH p AS (
  INSERT INTO products (name, category, sub_category, store_name, jan_code, score, created_at)
  VALUES ('安心院スパークリングワイン', 'ドリンク', 'ワイン', '三和酒類', '4905233200065', 0, now())
  RETURNING id
)
INSERT INTO product_jan_codes (product_id, jan_code, size_label, created_at)
SELECT p.id, j.jan_code, j.size_label, now() FROM p
CROSS JOIN (VALUES
  ('4905233200065', '720ml 瓶')
) AS j(jan_code, size_label);
