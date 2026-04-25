-- ============================================================
-- HOYU（ホーユー）全商品マスタ
-- ※ JANコードは暫定値。実物バーコードで要確認。
-- ============================================================

-- ビゲン 香りのヘアカラー 1 ナチュラルブラック
WITH p AS (INSERT INTO products (name, category, sub_category, store_name, jan_code, score, created_at)
  VALUES ('ビゲン 香りのヘアカラー 1 ナチュラルブラック', 'その他', 'ヘアカラー', 'HOYU', '4987205100010', 0, now()) RETURNING id)
INSERT INTO product_jan_codes (product_id, jan_code, size_label, created_at)
SELECT id, '4987205100010', NULL, now() FROM p;

-- ビゲン 香りのヘアカラー 2 ダークブラウン
WITH p AS (INSERT INTO products (name, category, sub_category, store_name, jan_code, score, created_at)
  VALUES ('ビゲン 香りのヘアカラー 2 ダークブラウン', 'その他', 'ヘアカラー', 'HOYU', '4987205100027', 0, now()) RETURNING id)
INSERT INTO product_jan_codes (product_id, jan_code, size_label, created_at)
SELECT id, '4987205100027', NULL, now() FROM p;

-- ビゲン 香りのヘアカラー 3 ブラウン
WITH p AS (INSERT INTO products (name, category, sub_category, store_name, jan_code, score, created_at)
  VALUES ('ビゲン 香りのヘアカラー 3 ブラウン', 'その他', 'ヘアカラー', 'HOYU', '4987205100034', 0, now()) RETURNING id)
INSERT INTO product_jan_codes (product_id, jan_code, size_label, created_at)
SELECT id, '4987205100034', NULL, now() FROM p;

-- ビゲン 香りのヘアカラー 4 ライトブラウン
WITH p AS (INSERT INTO products (name, category, sub_category, store_name, jan_code, score, created_at)
  VALUES ('ビゲン 香りのヘアカラー 4 ライトブラウン', 'その他', 'ヘアカラー', 'HOYU', '4987205100041', 0, now()) RETURNING id)
INSERT INTO product_jan_codes (product_id, jan_code, size_label, created_at)
SELECT id, '4987205100041', NULL, now() FROM p;

-- ビゲン 香りのヘアカラー 5 明るいライトブラウン
WITH p AS (INSERT INTO products (name, category, sub_category, store_name, jan_code, score, created_at)
  VALUES ('ビゲン 香りのヘアカラー 5 明るいライトブラウン', 'その他', 'ヘアカラー', 'HOYU', '4987205100058', 0, now()) RETURNING id)
INSERT INTO product_jan_codes (product_id, jan_code, size_label, created_at)
SELECT id, '4987205100058', NULL, now() FROM p;

-- ビゲン 香りのヘアカラー 6 アッシュグレー
WITH p AS (INSERT INTO products (name, category, sub_category, store_name, jan_code, score, created_at)
  VALUES ('ビゲン 香りのヘアカラー 6 アッシュグレー', 'その他', 'ヘアカラー', 'HOYU', '4987205100065', 0, now()) RETURNING id)
INSERT INTO product_jan_codes (product_id, jan_code, size_label, created_at)
SELECT id, '4987205100065', NULL, now() FROM p;

-- ビゲン 香りのヘアカラー 7 グレー
WITH p AS (INSERT INTO products (name, category, sub_category, store_name, jan_code, score, created_at)
  VALUES ('ビゲン 香りのヘアカラー 7 グレー', 'その他', 'ヘアカラー', 'HOYU', '4987205100072', 0, now()) RETURNING id)
INSERT INTO product_jan_codes (product_id, jan_code, size_label, created_at)
SELECT id, '4987205100072', NULL, now() FROM p;

-- ビゲン 香りのヘアカラー 8 ソフトブラック
WITH p AS (INSERT INTO products (name, category, sub_category, store_name, jan_code, score, created_at)
  VALUES ('ビゲン 香りのヘアカラー 8 ソフトブラック', 'その他', 'ヘアカラー', 'HOYU', '4987205100089', 0, now()) RETURNING id)
INSERT INTO product_jan_codes (product_id, jan_code, size_label, created_at)
SELECT id, '4987205100089', NULL, now() FROM p;

-- ビゲン スピーディカラー 1H ナチュラルブラック
WITH p AS (INSERT INTO products (name, category, sub_category, store_name, jan_code, score, created_at)
  VALUES ('ビゲン スピーディカラー 1H ナチュラルブラック', 'その他', 'ヘアカラー', 'HOYU', '4987205100096', 0, now()) RETURNING id)
INSERT INTO product_jan_codes (product_id, jan_code, size_label, created_at)
SELECT id, '4987205100096', NULL, now() FROM p;

-- ビゲン スピーディカラー 2 ダークブラウン
WITH p AS (INSERT INTO products (name, category, sub_category, store_name, jan_code, score, created_at)
  VALUES ('ビゲン スピーディカラー 2 ダークブラウン', 'その他', 'ヘアカラー', 'HOYU', '4987205100102', 0, now()) RETURNING id)
INSERT INTO product_jan_codes (product_id, jan_code, size_label, created_at)
SELECT id, '4987205100102', NULL, now() FROM p;

-- ビゲン スピーディカラー 3 ブラウン
WITH p AS (INSERT INTO products (name, category, sub_category, store_name, jan_code, score, created_at)
  VALUES ('ビゲン スピーディカラー 3 ブラウン', 'その他', 'ヘアカラー', 'HOYU', '4987205100119', 0, now()) RETURNING id)
INSERT INTO product_jan_codes (product_id, jan_code, size_label, created_at)
SELECT id, '4987205100119', NULL, now() FROM p;

-- ビゲン スピーディカラー 4 ライトブラウン
WITH p AS (INSERT INTO products (name, category, sub_category, store_name, jan_code, score, created_at)
  VALUES ('ビゲン スピーディカラー 4 ライトブラウン', 'その他', 'ヘアカラー', 'HOYU', '4987205100126', 0, now()) RETURNING id)
INSERT INTO product_jan_codes (product_id, jan_code, size_label, created_at)
SELECT id, '4987205100126', NULL, now() FROM p;

-- ビゲン スピーディカラー 5 アッシュブラウン
WITH p AS (INSERT INTO products (name, category, sub_category, store_name, jan_code, score, created_at)
  VALUES ('ビゲン スピーディカラー 5 アッシュブラウン', 'その他', 'ヘアカラー', 'HOYU', '4987205100133', 0, now()) RETURNING id)
INSERT INTO product_jan_codes (product_id, jan_code, size_label, created_at)
SELECT id, '4987205100133', NULL, now() FROM p;

-- ビゲン カラーリンス ソフトブラック
WITH p AS (INSERT INTO products (name, category, sub_category, store_name, jan_code, score, created_at)
  VALUES ('ビゲン カラーリンス ソフトブラック', 'その他', 'ヘアカラー', 'HOYU', '4987205100140', 0, now()) RETURNING id)
INSERT INTO product_jan_codes (product_id, jan_code, size_label, created_at)
SELECT id, '4987205100140', NULL, now() FROM p;

-- ビゲン カラーリンス ダークブラウン
WITH p AS (INSERT INTO products (name, category, sub_category, store_name, jan_code, score, created_at)
  VALUES ('ビゲン カラーリンス ダークブラウン', 'その他', 'ヘアカラー', 'HOYU', '4987205100157', 0, now()) RETURNING id)
INSERT INTO product_jan_codes (product_id, jan_code, size_label, created_at)
SELECT id, '4987205100157', NULL, now() FROM p;

-- ビゲン カラーリンス ブラウン
WITH p AS (INSERT INTO products (name, category, sub_category, store_name, jan_code, score, created_at)
  VALUES ('ビゲン カラーリンス ブラウン', 'その他', 'ヘアカラー', 'HOYU', '4987205100164', 0, now()) RETURNING id)
INSERT INTO product_jan_codes (product_id, jan_code, size_label, created_at)
SELECT id, '4987205100164', NULL, now() FROM p;

-- ビゲン カラーリンス ライトブラウン
WITH p AS (INSERT INTO products (name, category, sub_category, store_name, jan_code, score, created_at)
  VALUES ('ビゲン カラーリンス ライトブラウン', 'その他', 'ヘアカラー', 'HOYU', '4987205100171', 0, now()) RETURNING id)
INSERT INTO product_jan_codes (product_id, jan_code, size_label, created_at)
SELECT id, '4987205100171', NULL, now() FROM p;

-- シエロ ヘアカラーEX クリーム 1 ナチュラルブラック
WITH p AS (INSERT INTO products (name, category, sub_category, store_name, jan_code, score, created_at)
  VALUES ('シエロ ヘアカラーEX クリーム 1 ナチュラルブラック', 'その他', 'ヘアカラー', 'HOYU', '4987205200010', 0, now()) RETURNING id)
INSERT INTO product_jan_codes (product_id, jan_code, size_label, created_at)
SELECT id, '4987205200010', NULL, now() FROM p;

-- シエロ ヘアカラーEX クリーム 2 ダークブラウン
WITH p AS (INSERT INTO products (name, category, sub_category, store_name, jan_code, score, created_at)
  VALUES ('シエロ ヘアカラーEX クリーム 2 ダークブラウン', 'その他', 'ヘアカラー', 'HOYU', '4987205200027', 0, now()) RETURNING id)
INSERT INTO product_jan_codes (product_id, jan_code, size_label, created_at)
SELECT id, '4987205200027', NULL, now() FROM p;

-- シエロ ヘアカラーEX クリーム 3 ブラウン
WITH p AS (INSERT INTO products (name, category, sub_category, store_name, jan_code, score, created_at)
  VALUES ('シエロ ヘアカラーEX クリーム 3 ブラウン', 'その他', 'ヘアカラー', 'HOYU', '4987205200034', 0, now()) RETURNING id)
INSERT INTO product_jan_codes (product_id, jan_code, size_label, created_at)
SELECT id, '4987205200034', NULL, now() FROM p;

-- シエロ ヘアカラーEX クリーム 4 ライトブラウン
WITH p AS (INSERT INTO products (name, category, sub_category, store_name, jan_code, score, created_at)
  VALUES ('シエロ ヘアカラーEX クリーム 4 ライトブラウン', 'その他', 'ヘアカラー', 'HOYU', '4987205200041', 0, now()) RETURNING id)
INSERT INTO product_jan_codes (product_id, jan_code, size_label, created_at)
SELECT id, '4987205200041', NULL, now() FROM p;

-- シエロ ヘアカラーEX クリーム 5 明るいアッシュブラウン
WITH p AS (INSERT INTO products (name, category, sub_category, store_name, jan_code, score, created_at)
  VALUES ('シエロ ヘアカラーEX クリーム 5 明るいアッシュブラウン', 'その他', 'ヘアカラー', 'HOYU', '4987205200058', 0, now()) RETURNING id)
INSERT INTO product_jan_codes (product_id, jan_code, size_label, created_at)
SELECT id, '4987205200058', NULL, now() FROM p;

-- シエロ ヘアカラーEX クリーム 6 明るいライトブラウン
WITH p AS (INSERT INTO products (name, category, sub_category, store_name, jan_code, score, created_at)
  VALUES ('シエロ ヘアカラーEX クリーム 6 明るいライトブラウン', 'その他', 'ヘアカラー', 'HOYU', '4987205200065', 0, now()) RETURNING id)
INSERT INTO product_jan_codes (product_id, jan_code, size_label, created_at)
SELECT id, '4987205200065', NULL, now() FROM p;

-- シエロ ムースカラー ナチュラルブラック
WITH p AS (INSERT INTO products (name, category, sub_category, store_name, jan_code, score, created_at)
  VALUES ('シエロ ムースカラー ナチュラルブラック', 'その他', 'ヘアカラー', 'HOYU', '4987205200072', 0, now()) RETURNING id)
INSERT INTO product_jan_codes (product_id, jan_code, size_label, created_at)
SELECT id, '4987205200072', NULL, now() FROM p;

-- シエロ ムースカラー ダークブラウン
WITH p AS (INSERT INTO products (name, category, sub_category, store_name, jan_code, score, created_at)
  VALUES ('シエロ ムースカラー ダークブラウン', 'その他', 'ヘアカラー', 'HOYU', '4987205200089', 0, now()) RETURNING id)
INSERT INTO product_jan_codes (product_id, jan_code, size_label, created_at)
SELECT id, '4987205200089', NULL, now() FROM p;

-- シエロ ムースカラー ブラウン
WITH p AS (INSERT INTO products (name, category, sub_category, store_name, jan_code, score, created_at)
  VALUES ('シエロ ムースカラー ブラウン', 'その他', 'ヘアカラー', 'HOYU', '4987205200096', 0, now()) RETURNING id)
INSERT INTO product_jan_codes (product_id, jan_code, size_label, created_at)
SELECT id, '4987205200096', NULL, now() FROM p;

-- シエロ ムースカラー ライトブラウン
WITH p AS (INSERT INTO products (name, category, sub_category, store_name, jan_code, score, created_at)
  VALUES ('シエロ ムースカラー ライトブラウン', 'その他', 'ヘアカラー', 'HOYU', '4987205200102', 0, now()) RETURNING id)
INSERT INTO product_jan_codes (product_id, jan_code, size_label, created_at)
SELECT id, '4987205200102', NULL, now() FROM p;

-- シエロ 泡カラーEX 1 ナチュラルブラック
WITH p AS (INSERT INTO products (name, category, sub_category, store_name, jan_code, score, created_at)
  VALUES ('シエロ 泡カラーEX 1 ナチュラルブラック', 'その他', 'ヘアカラー', 'HOYU', '4987205200119', 0, now()) RETURNING id)
INSERT INTO product_jan_codes (product_id, jan_code, size_label, created_at)
SELECT id, '4987205200119', NULL, now() FROM p;

-- シエロ 泡カラーEX 2 ダークブラウン
WITH p AS (INSERT INTO products (name, category, sub_category, store_name, jan_code, score, created_at)
  VALUES ('シエロ 泡カラーEX 2 ダークブラウン', 'その他', 'ヘアカラー', 'HOYU', '4987205200126', 0, now()) RETURNING id)
INSERT INTO product_jan_codes (product_id, jan_code, size_label, created_at)
SELECT id, '4987205200126', NULL, now() FROM p;

-- シエロ 泡カラーEX 3 ブラウン
WITH p AS (INSERT INTO products (name, category, sub_category, store_name, jan_code, score, created_at)
  VALUES ('シエロ 泡カラーEX 3 ブラウン', 'その他', 'ヘアカラー', 'HOYU', '4987205200133', 0, now()) RETURNING id)
INSERT INTO product_jan_codes (product_id, jan_code, size_label, created_at)
SELECT id, '4987205200133', NULL, now() FROM p;

-- シエロ 泡カラーEX 4 ライトブラウン
WITH p AS (INSERT INTO products (name, category, sub_category, store_name, jan_code, score, created_at)
  VALUES ('シエロ 泡カラーEX 4 ライトブラウン', 'その他', 'ヘアカラー', 'HOYU', '4987205200140', 0, now()) RETURNING id)
INSERT INTO product_jan_codes (product_id, jan_code, size_label, created_at)
SELECT id, '4987205200140', NULL, now() FROM p;

-- シエロ 泡カラーEX 5 アッシュブラウン
WITH p AS (INSERT INTO products (name, category, sub_category, store_name, jan_code, score, created_at)
  VALUES ('シエロ 泡カラーEX 5 アッシュブラウン', 'その他', 'ヘアカラー', 'HOYU', '4987205200157', 0, now()) RETURNING id)
INSERT INTO product_jan_codes (product_id, jan_code, size_label, created_at)
SELECT id, '4987205200157', NULL, now() FROM p;

-- シエロ 泡カラーEX 6 ベージュブラウン
WITH p AS (INSERT INTO products (name, category, sub_category, store_name, jan_code, score, created_at)
  VALUES ('シエロ 泡カラーEX 6 ベージュブラウン', 'その他', 'ヘアカラー', 'HOYU', '4987205200164', 0, now()) RETURNING id)
INSERT INTO product_jan_codes (product_id, jan_code, size_label, created_at)
SELECT id, '4987205200164', NULL, now() FROM p;

-- ビューティーン メイクアップカラー アッシュグレー
WITH p AS (INSERT INTO products (name, category, sub_category, store_name, jan_code, score, created_at)
  VALUES ('ビューティーン メイクアップカラー アッシュグレー', 'その他', 'ヘアカラー', 'HOYU', '4987205300010', 0, now()) RETURNING id)
INSERT INTO product_jan_codes (product_id, jan_code, size_label, created_at)
SELECT id, '4987205300010', NULL, now() FROM p;

-- ビューティーン メイクアップカラー ブルーブラック
WITH p AS (INSERT INTO products (name, category, sub_category, store_name, jan_code, score, created_at)
  VALUES ('ビューティーン メイクアップカラー ブルーブラック', 'その他', 'ヘアカラー', 'HOYU', '4987205300027', 0, now()) RETURNING id)
INSERT INTO product_jan_codes (product_id, jan_code, size_label, created_at)
SELECT id, '4987205300027', NULL, now() FROM p;

-- ビューティーン メイクアップカラー ピンクブラウン
WITH p AS (INSERT INTO products (name, category, sub_category, store_name, jan_code, score, created_at)
  VALUES ('ビューティーン メイクアップカラー ピンクブラウン', 'その他', 'ヘアカラー', 'HOYU', '4987205300034', 0, now()) RETURNING id)
INSERT INTO product_jan_codes (product_id, jan_code, size_label, created_at)
SELECT id, '4987205300034', NULL, now() FROM p;

-- ビューティーン メイクアップカラー パープルアッシュ
WITH p AS (INSERT INTO products (name, category, sub_category, store_name, jan_code, score, created_at)
  VALUES ('ビューティーン メイクアップカラー パープルアッシュ', 'その他', 'ヘアカラー', 'HOYU', '4987205300041', 0, now()) RETURNING id)
INSERT INTO product_jan_codes (product_id, jan_code, size_label, created_at)
SELECT id, '4987205300041', NULL, now() FROM p;

-- ビューティーン メイクアップカラー ナチュラルブラウン
WITH p AS (INSERT INTO products (name, category, sub_category, store_name, jan_code, score, created_at)
  VALUES ('ビューティーン メイクアップカラー ナチュラルブラウン', 'その他', 'ヘアカラー', 'HOYU', '4987205300058', 0, now()) RETURNING id)
INSERT INTO product_jan_codes (product_id, jan_code, size_label, created_at)
SELECT id, '4987205300058', NULL, now() FROM p;

-- ビューティーン ベースアップブリーチ
WITH p AS (INSERT INTO products (name, category, sub_category, store_name, jan_code, score, created_at)
  VALUES ('ビューティーン ベースアップブリーチ', 'その他', 'ヘアカラー', 'HOYU', '4987205300065', 0, now()) RETURNING id)
INSERT INTO product_jan_codes (product_id, jan_code, size_label, created_at)
SELECT id, '4987205300065', NULL, now() FROM p;

-- BeauNatural ヘアカラー ダークブラウン
WITH p AS (INSERT INTO products (name, category, sub_category, store_name, jan_code, score, created_at)
  VALUES ('BeauNatural ヘアカラー ダークブラウン', 'その他', 'ヘアカラー', 'HOYU', '4987205400010', 0, now()) RETURNING id)
INSERT INTO product_jan_codes (product_id, jan_code, size_label, created_at)
SELECT id, '4987205400010', NULL, now() FROM p;

-- BeauNatural ヘアカラー ブラウン
WITH p AS (INSERT INTO products (name, category, sub_category, store_name, jan_code, score, created_at)
  VALUES ('BeauNatural ヘアカラー ブラウン', 'その他', 'ヘアカラー', 'HOYU', '4987205400027', 0, now()) RETURNING id)
INSERT INTO product_jan_codes (product_id, jan_code, size_label, created_at)
SELECT id, '4987205400027', NULL, now() FROM p;

-- BeauNatural ヘアカラー ライトブラウン
WITH p AS (INSERT INTO products (name, category, sub_category, store_name, jan_code, score, created_at)
  VALUES ('BeauNatural ヘアカラー ライトブラウン', 'その他', 'ヘアカラー', 'HOYU', '4987205400034', 0, now()) RETURNING id)
INSERT INTO product_jan_codes (product_id, jan_code, size_label, created_at)
SELECT id, '4987205400034', NULL, now() FROM p;
