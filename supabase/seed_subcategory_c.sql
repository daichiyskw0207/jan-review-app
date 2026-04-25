-- ============================================================
-- sub_category 更新 Part C: 惣菜 + チルド + スイーツ + その他
-- ============================================================

-- ========== コンビニ惣菜 ==========

UPDATE products SET sub_category = 'サラダチキン' WHERE jan_code IN (
  '4901301401234', '4901301412345',
  '4901301901010', '4901301901027', '4901301901034'
);

UPDATE products SET sub_category = 'サラダ' WHERE jan_code IN (
  '4901301901041', '4901301901055', '4901301901062',
  '4901301901069', '4901301901265', '4901301901272'
);

UPDATE products SET sub_category = '玉子系' WHERE jan_code IN (
  '4901301901076', '4901301901083'
);

UPDATE products SET sub_category = '和惣菜' WHERE jan_code IN (
  '4901301901048', '4901301901090', '4901301901107',
  '4901301901114', '4901301901121',
  '4901301445678', '4901301456789', '4901301467890'
);

UPDATE products SET sub_category = '弁当' WHERE jan_code IN (
  '4901301901138', '4901301901145', '4901301901152',
  '4901301901159', '4901301901166', '4901301901173',
  '4901301901180', '4901301901197', '4901301901203'
);

UPDATE products SET sub_category = '丼' WHERE jan_code IN (
  '4901301901210', '4901301901227', '4901301901234',
  '4901301901241', '4901301901258'
);

UPDATE products SET sub_category = 'おでん' WHERE jan_code IN (
  '4901301423456', '4901301434567', '4901301901289'
);

UPDATE products SET sub_category = '汁物' WHERE jan_code IN (
  '4901301478901', '4901301901296', '4901301901302'
);

UPDATE products SET sub_category = '麺類（惣菜）' WHERE jan_code IN (
  '4901301901319', '4901301901326'
);

-- ========== チルド食品 ==========

UPDATE products SET sub_category = '牛乳' WHERE jan_code IN (
  '4903050120050',
  '4902705501010', '4902705501027', '4903050501010'
);

UPDATE products SET sub_category = 'ヨーグルト' WHERE jan_code IN (
  '4902705011472', '4902705018754', '4903065112016',
  '4902705501034', '4902705501041',
  '4901005501034', '4902705501048'
);

UPDATE products SET sub_category = 'チーズ' WHERE jan_code IN (
  '4903050345678',
  '4903050501034', '4903065501034', '4903050501048'
);

UPDATE products SET sub_category = '豆乳' WHERE jan_code IN (
  '4903050501041', '4904735501010'
);

UPDATE products SET sub_category = '野菜・果実ジュース（チルド）' WHERE jan_code IN (
  '4901306121018', '4901085166636',
  '4901306501010', '4901306501027',
  '4901085501010', '4514603501010', '4902102501010'
);

UPDATE products SET sub_category = '乳飲料（チルド）' WHERE jan_code IN (
  '4903050501027', '4901005501010', '4903065501010'
);

UPDATE products SET sub_category = 'バター・生クリーム' WHERE jan_code IN (
  '4903164501010', '4904854501010'
);

UPDATE products SET sub_category = 'デザート系（チルド）' WHERE jan_code IN (
  '4903050234567', '4901085234567',
  '4901005501027', '4902362501010', '4901005501041'
);

UPDATE products SET sub_category = 'コーヒー（チルド）' WHERE jan_code IN (
  '4903065501010'
);

UPDATE products SET sub_category = '調味料（チルド）' WHERE jan_code IN (
  '4901577501010', '4901577501027',
  '4901306501034', '4903065501027'
);

-- ========== スイーツ・デザート ==========

UPDATE products SET sub_category = 'ケーキ' WHERE jan_code IN (
  '4901301501234', '4901301512345',
  '4901301201010', '4901301201027',
  '4901860201010', '4901301201076', '4901301201203'
);

UPDATE products SET sub_category = 'プリン' WHERE jan_code IN (
  '4901301523456',
  '4901301201034',
  '4901860201027', '4901860201034',
  '4901301201173', '4901301201210'
);

UPDATE products SET sub_category = 'ゼリー' WHERE jan_code IN (
  '4901301201145', '4901301201152',
  '4901301201159', '4901301201197'
);

UPDATE products SET sub_category = 'シュークリーム・エクレア' WHERE jan_code IN (
  '4901860123456', '4901860134567',
  '4901301201055', '4901301201069', '4901860201041'
);

UPDATE products SET sub_category = 'タルト・パイ' WHERE jan_code IN (
  '4901301534567', '4901301201041'
);

UPDATE products SET sub_category = 'その他洋菓子' WHERE jan_code IN (
  '4903110345678', '4901301545678',
  '4901301201048', '4901301201062',
  '4901301201083', '4901301201166', '4901301201180'
);

UPDATE products SET sub_category = '和菓子' WHERE jan_code IN (
  '4901301567890', '4901301556789',
  '4901006601010',
  '4903110601010',
  '4901301201090', '4901301201107', '4901301201114',
  '4901301201121', '4901301201138'
);

UPDATE products SET sub_category = 'パンナコッタ・その他' WHERE jan_code IN (
  '4901301201166'
);

-- ========== その他・日用品 ==========

UPDATE products SET sub_category = 'キッチン用品' WHERE jan_code IN (
  '4901670201010', '4901766201010', '4901670201027',
  '4901750201010', '4904118201010', '4901670201034',
  '4901301301010', '4901301301027', '4901301301034',
  '4903320190123'
);

UPDATE products SET sub_category = '衛生用品' WHERE jan_code IN (
  '4987433201010', '4903111201010', '4901730201010'
);

UPDATE products SET sub_category = '医薬品' WHERE jan_code IN (
  '4987107201010', '4903301201010', '4987240201010',
  '4987300201010', '4987107301010', '4904820201010'
);

UPDATE products SET sub_category = 'オーラルケア' WHERE jan_code IN (
  '4903301301010', '4978881201010', '4901730401010'
);

UPDATE products SET sub_category = 'スキンケア' WHERE jan_code IN (
  '4901301401010', '4901301401027', '4901301189012',
  '4987036201010', '4987036201027', '4903111301010'
);

UPDATE products SET sub_category = 'ヘアケア' WHERE jan_code IN (
  '4901730301010', '4901301401041', '4902430178901'
);

UPDATE products SET sub_category = '電池・充電器' WHERE jan_code IN (
  '4984824201010', '4901301401055'
);

-- ========== 冷凍食品（seed.sqlより）==========

UPDATE products SET sub_category = '冷凍惣菜' WHERE jan_code IN (
  '4901001089012', '4902001090123', '4902201101234'
);
