-- Supabase Seed — 실제 테이블 컬럼 기준으로 작성 (re-run safe)
-- Actual columns verified from Supabase REST API on 2026-03-15
-- Step 2: Run this AFTER supabase_schema_patch.sql
BEGIN;

-- ── 기존 데이터 전체 삭제 및 시퀀스 초기화 ────────────────────────────────
TRUNCATE TABLE
  community_posts_i18n, community_posts,
  tour_jobs_i18n, tour_jobs,
  cruise_ships_i18n, cruise_ships,
  cruise_ports_i18n, cruise_ports,
  cruise_lines_i18n, cruise_lines,
  airports_i18n, airports,
  countries_i18n, countries
RESTART IDENTITY CASCADE;

-- ══════════════════════════════════════════════════════════════════════════
-- AIRPORTS  (iata, name, city, country, terminals, smoking_area, lounge, taxi, bus, subway)
-- ══════════════════════════════════════════════════════════════════════════
INSERT INTO airports (iata, name, city, country, terminals, smoking_area, lounge, taxi, bus, subway) VALUES
  ('ICN', 'Incheon International Airport',        'Seoul',       'South Korea', 2, true,  true,  true,  true,  true),
  ('GMP', 'Gimpo International Airport',           'Seoul',       'South Korea', 2, true,  true,  true,  true,  true),
  ('PUS', 'Gimhae International Airport',          'Busan',       'South Korea', 1, true,  false, true,  true,  false),
  ('NRT', 'Narita International Airport',          'Tokyo',       'Japan',       3, true,  true,  true,  true,  true),
  ('HND', 'Tokyo Haneda Airport',                  'Tokyo',       'Japan',       3, true,  true,  true,  true,  true),
  ('KIX', 'Kansai International Airport',          'Osaka',       'Japan',       2, true,  true,  true,  true,  false),
  ('CTS', 'New Chitose Airport',                   'Sapporo',     'Japan',       2, true,  false, true,  true,  false),
  ('OKA', 'Naha Airport',                          'Okinawa',     'Japan',       1, true,  false, true,  true,  false),
  ('SIN', 'Singapore Changi Airport',              'Singapore',   'Singapore',   4, false, true,  true,  true,  true),
  ('BKK', 'Suvarnabhumi Airport',                  'Bangkok',     'Thailand',    1, true,  true,  true,  true,  true),
  ('DMK', 'Don Mueang International Airport',      'Bangkok',     'Thailand',    2, true,  false, true,  true,  false),
  ('HKT', 'Phuket International Airport',          'Phuket',      'Thailand',    1, true,  false, true,  true,  false),
  ('HKG', 'Hong Kong International Airport',       'Hong Kong',   'Hong Kong',   1, false, true,  true,  true,  true),
  ('PVG', 'Shanghai Pudong International Airport', 'Shanghai',    'China',       2, true,  true,  true,  true,  true),
  ('PEK', 'Beijing Capital International Airport', 'Beijing',     'China',       3, true,  true,  true,  true,  true),
  ('TPE', 'Taiwan Taoyuan International Airport',  'Taipei',      'Taiwan',      2, true,  true,  true,  true,  false),
  ('MNL', 'Ninoy Aquino International Airport',    'Manila',      'Philippines', 4, true,  true,  true,  true,  false),
  ('CEB', 'Mactan-Cebu International Airport',     'Cebu',        'Philippines', 2, true,  false, true,  true,  false),
  ('CGK', 'Soekarno-Hatta International Airport',  'Jakarta',     'Indonesia',   3, true,  true,  true,  true,  true),
  ('DPS', 'Ngurah Rai International Airport',      'Bali',        'Indonesia',   1, true,  false, true,  true,  false),
  ('KUL', 'Kuala Lumpur International Airport',    'Kuala Lumpur','Malaysia',    2, true,  true,  true,  true,  true),
  ('SGN', 'Tan Son Nhat International Airport',    'Ho Chi Minh', 'Vietnam',     2, true,  false, true,  true,  false),
  ('HAN', 'Noi Bai International Airport',         'Hanoi',       'Vietnam',     2, true,  false, true,  true,  false),
  ('RGN', 'Yangon International Airport',          'Yangon',      'Myanmar',     1, true,  false, true,  true,  false),
  ('REP', 'Siem Reap International Airport',       'Siem Reap',   'Cambodia',    1, false, false, true,  true,  false),
  ('DXB', 'Dubai International Airport',           'Dubai',       'UAE',         3, true,  true,  true,  true,  true),
  ('AUH', 'Abu Dhabi International Airport',       'Abu Dhabi',   'UAE',         1, true,  true,  true,  true,  false),
  ('DOH', 'Hamad International Airport',           'Doha',        'Qatar',       1, false, true,  true,  true,  false),
  ('LHR', 'London Heathrow Airport',               'London',      'UK',          5, false, true,  true,  true,  true),
  ('CDG', 'Paris Charles de Gaulle Airport',       'Paris',       'France',      3, false, true,  true,  true,  true),
  ('FRA', 'Frankfurt Airport',                     'Frankfurt',   'Germany',     2, true,  true,  true,  true,  true),
  ('AMS', 'Amsterdam Schiphol Airport',            'Amsterdam',   'Netherlands', 1, false, true,  true,  true,  true),
  ('MAD', 'Adolfo Suárez Madrid–Barajas Airport',  'Madrid',      'Spain',       4, false, true,  true,  true,  true),
  ('BCN', 'Barcelona El Prat Airport',             'Barcelona',   'Spain',       2, false, true,  true,  true,  true),
  ('FCO', 'Leonardo da Vinci International Airport','Rome',        'Italy',       3, false, true,  true,  true,  true),
  ('MXP', 'Milan Malpensa Airport',                'Milan',       'Italy',       2, true,  true,  true,  true,  false),
  ('ATH', 'Athens International Airport',          'Athens',      'Greece',      1, false, true,  true,  true,  false),
  ('IST', 'Istanbul Airport',                      'Istanbul',    'Turkey',      1, false, true,  true,  true,  false),
  ('VIE', 'Vienna International Airport',          'Vienna',      'Austria',     1, false, true,  true,  true,  true),
  ('ZRH', 'Zurich Airport',                        'Zurich',      'Switzerland', 2, false, true,  true,  true,  true),
  ('JFK', 'John F. Kennedy International Airport', 'New York',    'USA',         6, false, true,  true,  true,  true),
  ('LAX', 'Los Angeles International Airport',     'Los Angeles', 'USA',         9, false, true,  true,  true,  false),
  ('ORD', 'O''Hare International Airport',         'Chicago',     'USA',         4, false, true,  true,  true,  true),
  ('SFO', 'San Francisco International Airport',   'San Francisco','USA',        4, false, true,  true,  true,  true),
  ('YVR', 'Vancouver International Airport',       'Vancouver',   'Canada',      2, false, true,  true,  true,  false),
  ('YYZ', 'Toronto Pearson International Airport', 'Toronto',     'Canada',      2, false, true,  true,  true,  false),
  ('SYD', 'Sydney Kingsford Smith Airport',        'Sydney',      'Australia',   3, false, true,  true,  true,  true),
  ('MEL', 'Melbourne Airport',                     'Melbourne',   'Australia',   4, false, true,  true,  true,  false),
  ('NAN', 'Nadi International Airport',            'Nadi',        'Fiji',        1, false, false, true,  true,  false),
  ('PPT', 'Faa''a International Airport',          'Papeete',     'French Polynesia',1,false,false,true, true,  false);

-- airports i18n (한국어)
INSERT INTO airports_i18n (airport_id, lang, name, city, country) VALUES
  ((SELECT id FROM airports WHERE iata='ICN'),'ko','인천국제공항','서울','대한민국'),
  ((SELECT id FROM airports WHERE iata='GMP'),'ko','김포국제공항','서울','대한민국'),
  ((SELECT id FROM airports WHERE iata='PUS'),'ko','김해국제공항','부산','대한민국'),
  ((SELECT id FROM airports WHERE iata='NRT'),'ko','나리타국제공항','도쿄','일본'),
  ((SELECT id FROM airports WHERE iata='HND'),'ko','하네다공항','도쿄','일본'),
  ((SELECT id FROM airports WHERE iata='KIX'),'ko','간사이국제공항','오사카','일본'),
  ((SELECT id FROM airports WHERE iata='CTS'),'ko','신치토세공항','삿포로','일본'),
  ((SELECT id FROM airports WHERE iata='OKA'),'ko','나하공항','오키나와','일본'),
  ((SELECT id FROM airports WHERE iata='SIN'),'ko','싱가포르 창이공항','싱가포르','싱가포르'),
  ((SELECT id FROM airports WHERE iata='BKK'),'ko','수완나품 공항','방콕','태국'),
  ((SELECT id FROM airports WHERE iata='HKT'),'ko','푸켓 국제공항','푸켓','태국'),
  ((SELECT id FROM airports WHERE iata='HKG'),'ko','홍콩국제공항','홍콩','홍콩'),
  ((SELECT id FROM airports WHERE iata='MNL'),'ko','니노이아키노 국제공항','마닐라','필리핀'),
  ((SELECT id FROM airports WHERE iata='CEB'),'ko','막탄세부 국제공항','세부','필리핀'),
  ((SELECT id FROM airports WHERE iata='DPS'),'ko','응우라라이 국제공항','발리','인도네시아'),
  ((SELECT id FROM airports WHERE iata='KUL'),'ko','쿠알라룸푸르 국제공항','쿠알라룸푸르','말레이시아'),
  ((SELECT id FROM airports WHERE iata='SGN'),'ko','떤선녓 국제공항','호찌민','베트남'),
  ((SELECT id FROM airports WHERE iata='HAN'),'ko','노이바이 국제공항','하노이','베트남'),
  ((SELECT id FROM airports WHERE iata='DXB'),'ko','두바이 국제공항','두바이','아랍에미리트'),
  ((SELECT id FROM airports WHERE iata='LHR'),'ko','런던 히스로공항','런던','영국'),
  ((SELECT id FROM airports WHERE iata='CDG'),'ko','파리 샤를 드 골 공항','파리','프랑스'),
  ((SELECT id FROM airports WHERE iata='FRA'),'ko','프랑크푸르트 공항','프랑크푸르트','독일'),
  ((SELECT id FROM airports WHERE iata='BCN'),'ko','바르셀로나 엘프라트 공항','바르셀로나','스페인'),
  ((SELECT id FROM airports WHERE iata='FCO'),'ko','로마 피우미치노 공항','로마','이탈리아'),
  ((SELECT id FROM airports WHERE iata='ATH'),'ko','아테네 국제공항','아테네','그리스'),
  ((SELECT id FROM airports WHERE iata='IST'),'ko','이스탄불 공항','이스탄불','튀르키예'),
  ((SELECT id FROM airports WHERE iata='JFK'),'ko','존 F. 케네디 국제공항','뉴욕','미국'),
  ((SELECT id FROM airports WHERE iata='LAX'),'ko','로스앤젤레스 국제공항','로스앤젤레스','미국'),
  ((SELECT id FROM airports WHERE iata='SYD'),'ko','시드니 킹스퍼드스미스 공항','시드니','호주');

-- ══════════════════════════════════════════════════════════════════════════
-- COUNTRIES  (name, visa_info, embassy, emergency_number)
-- ══════════════════════════════════════════════════════════════════════════
INSERT INTO countries (name, visa_info, embassy, emergency_number, immigration_tips) VALUES
  ('Japan',         'Visa-free up to 90 days for most nationalities.',  'Embassy of Japan',         'Police 110, Ambulance 119',       'Carry return ticket and hotel confirmation. Customs declaration form required.'),
  ('South Korea',   'Visa-free up to 90 days (K-ETA may apply).',       'Embassy of South Korea',   'Police 112, Ambulance 119',       'Register K-ETA at least 72 hours before departure. Have travel purpose ready.'),
  ('Singapore',     'Visa-free 30 days for most nationalities.',         'Embassy of Singapore',     'Police 999, Ambulance 995',       'Show proof of sufficient funds. Hotel booking and return ticket may be checked.'),
  ('Thailand',      'Visa-free 30 days; visa-on-arrival available.',     'Embassy of Thailand',      'Tourist Police 1155',             'Fill TM6 card on the plane. Have 10,000 THB per person in cash for immigration check.'),
  ('Philippines',   'Visa-free 30 days for most nationalities.',         'Embassy of Philippines',   'Police 911, Tourist 8-524-1660',  'Complete eTravel QR at etravel.gov.ph before arrival. Have onward ticket ready.'),
  ('Indonesia',     'Visa-free or visa-on-arrival for most countries.',  'Embassy of Indonesia',     'Police 110, Ambulance 118',       'Customs declaration is mandatory. Do not bring food items without declaration.'),
  ('Malaysia',      'Visa-free 90 days for most nationalities.',         'Embassy of Malaysia',      'Police 999, Ambulance 999',       'No visa required for Korean passport holders. Show hotel booking at immigration.'),
  ('Vietnam',       'E-visa required; apply online before travel.',      'Embassy of Vietnam',       'Police 113, Ambulance 115',       'Apply e-visa at evisa.xuatnhapcanh.gov.vn at least 3 business days before travel.'),
  ('UAE',           'Visa-on-arrival 30 days for most nationalities.',   'Embassy of UAE',           'Police 999, Ambulance 998',       'Dress code applies in public areas. No alcohol in public. Declare large cash amounts.'),
  ('United Kingdom','ETA required for most non-UK/EU nationalities.',    'British Embassy',          'Emergency 999',                   'Apply ETA well in advance. Purpose of visit and accommodation details required.'),
  ('France',        'Schengen visa required for non-EU nationals.',      'French Embassy',           'Emergency 112',                   'Schengen entry: show travel insurance (min €30,000 coverage) and sufficient funds.'),
  ('Italy',         'Schengen visa required for non-EU nationals.',      'Italian Embassy',          'Emergency 112',                   'Schengen entry: carry accommodation bookings for all nights. VAT refund available.'),
  ('Greece',        'Schengen visa required for non-EU nationals.',      'Greek Embassy',            'Emergency 112',                   'Entry via Schengen. Show return ticket and hotel bookings. Cruise passengers may use ship manifest.'),
  ('Spain',         'Schengen visa required for non-EU nationals.',      'Spanish Embassy',          'Emergency 112',                   'Schengen entry. Barcelona port: show cruise booking as entry document.'),
  ('Turkey',        'E-visa required; apply at evisa.gov.tr.',           'Turkish Embassy',          'Emergency 112',                   'Apply e-visa before departure. Valid for 30-90 days depending on nationality.'),
  ('Australia',     'ETA or eVisitor visa required.',                    'Australian Embassy',       'Emergency 000',                   'Apply ETA online before travel. Declare all food, plant, and animal items at customs.'),
  ('USA',           'ESTA required for Visa Waiver Program countries.',  'U.S. Embassy',             'Emergency 911',                   'Apply ESTA at esta.cbp.dhs.gov at least 72 hours before departure. CBP may interview.'),
  ('Canada',        'eTA required for visa-exempt nationals.',           'Canadian Embassy',         'Emergency 911',                   'Apply eTA before travel at canada.ca/eta. CBSA may ask about trip purpose and funds.'),
  ('China',         'Visa required for most nationalities.',             'Chinese Embassy',          'Police 110, Ambulance 120',       '144-hour transit visa-free for qualifying nationalities at designated ports. Advance application required otherwise.'),
  ('Hong Kong',     'Visa-free up to 90 days for most nationalities.',   'HK Immigration Dept.',     'Emergency 999',                   'Separate from mainland China policy. No visa required for most nationalities under 90 days.');

-- countries i18n (한국어)
INSERT INTO countries_i18n (country_id, lang, name, visa_info, embassy, emergency_number, immigration_tips) VALUES
  ((SELECT id FROM countries WHERE name='Japan'),        'ko','일본',       '대부분 국적 90일 무비자.',                  '주한 일본 대사관',          '경찰 110, 구급 119',       '귀국 항공권과 숙소 예약 확인서 지참. 세관 신고서 필수.'),
  ((SELECT id FROM countries WHERE name='South Korea'),  'ko','대한민국',   '대부분 국적 90일 무비자 (K-ETA 필요 가능).','대한민국 대사관',           '경찰 112, 구급 119',       'K-ETA 출발 72시간 전 등록. 방문 목적 준비.'),
  ((SELECT id FROM countries WHERE name='Singapore'),    'ko','싱가포르',   '대부분 국적 30일 무비자.',                  '싱가포르 대사관',           '경찰 999, 구급 995',       '충분한 자금 증명 필요. 숙소 예약 및 귀국편 확인 가능.'),
  ((SELECT id FROM countries WHERE name='Thailand'),     'ko','태국',       '30일 무비자; 도착 비자 가능.',              '주한 태국 대사관',          '관광경찰 1155',            '기내에서 TM6 카드 작성. 1인당 현금 10,000 바트 지참 권장.'),
  ((SELECT id FROM countries WHERE name='Philippines'),  'ko','필리핀',     '대부분 국적 30일 무비자.',                  '주한 필리핀 대사관',        '경찰 911, 관광경찰 8-524-1660','etravel.gov.ph에서 eTravel QR 사전 등록. 귀국편 소지.'),
  ((SELECT id FROM countries WHERE name='Indonesia'),    'ko','인도네시아', '무비자 또는 도착 비자 가능.',               '주한 인도네시아 대사관',    '경찰 110, 구급 118',       '세관 신고서 의무. 음식물 반입 시 반드시 신고.'),
  ((SELECT id FROM countries WHERE name='Malaysia'),     'ko','말레이시아', '한국 여권 90일 무비자.',                    '주한 말레이시아 대사관',    '경찰 999, 구급 999',       '입국 시 숙소 예약 확인서 제시 가능.'),
  ((SELECT id FROM countries WHERE name='Vietnam'),      'ko','베트남',     '전자비자 필요; 사전 온라인 신청.',          '주한 베트남 대사관',        '경찰 113, 구급 115',       'evisa.xuatnhapcanh.gov.vn에서 최소 3영업일 전 신청.'),
  ((SELECT id FROM countries WHERE name='UAE'),          'ko','아랍에미리트','도착 비자 30일.',                          '주한 UAE 대사관',           '경찰 999, 구급 998',       '공공장소 복장 규정 준수. 주류 소지 금지. 고액 현금 신고 필수.'),
  ((SELECT id FROM countries WHERE name='France'),       'ko','프랑스',     '비EU 국민은 솅겐 비자 필요.',               '주한 프랑스 대사관',        '긴급 112',                 '여행자 보험 (최소 €30,000 보장) 및 자금 증명 필수.'),
  ((SELECT id FROM countries WHERE name='Italy'),        'ko','이탈리아',   '비EU 국민은 솅겐 비자 필요.',               '주한 이탈리아 대사관',      '긴급 112',                 '전체 숙소 예약 확인서 지참. 부가세 환급 가능.'),
  ((SELECT id FROM countries WHERE name='Greece'),       'ko','그리스',     '비EU 국민은 솅겐 비자 필요.',               '주한 그리스 대사관',        '긴급 112',                 '크루즈 승객은 선박 승선 서류가 입국 서류 역할 가능.'),
  ((SELECT id FROM countries WHERE name='Turkey'),       'ko','튀르키예',   '전자비자 필요; evisa.gov.tr 신청.',         '주한 튀르키예 대사관',      '긴급 112',                 '출발 전 반드시 신청. 국적에 따라 30~90일 유효.'),
  ((SELECT id FROM countries WHERE name='Australia'),    'ko','호주',       'ETA 또는 eVisitor 비자 필요.',              '주한 호주 대사관',          '긴급 000',                 '온라인 ETA 사전 신청. 음식·식물·동물 반입 시 세관 신고 의무.'),
  ((SELECT id FROM countries WHERE name='China'),        'ko','중국',       '대부분 국적 비자 필요.',                    '주한 중국 대사관',          '경찰 110, 구급 120',       '지정 공항에서 144시간 무비자 환승 가능 (해당 국적 한정).');

-- ══════════════════════════════════════════════════════════════════════════
-- CRUISE LINES  (name, country)
-- ══════════════════════════════════════════════════════════════════════════
INSERT INTO cruise_lines (name, country) VALUES
  ('Royal Caribbean',      'United States'),
  ('MSC Cruises',          'Switzerland'),
  ('Norwegian Cruise Line','United States'),
  ('Carnival Cruise Line', 'United States'),
  ('Celebrity Cruises',    'United States'),
  ('Princess Cruises',     'United States'),
  ('Holland America Line', 'United States'),
  ('Costa Cruises',        'Italy'),
  ('AIDA Cruises',         'Germany'),
  ('Cunard Line',          'United Kingdom');

INSERT INTO cruise_lines_i18n (cruise_line_id, lang, name, country) VALUES
  ((SELECT id FROM cruise_lines WHERE name='Royal Caribbean'),      'ko','로열 캐리비안',     '미국'),
  ((SELECT id FROM cruise_lines WHERE name='MSC Cruises'),          'ko','MSC 크루즈',        '스위스'),
  ((SELECT id FROM cruise_lines WHERE name='Norwegian Cruise Line'),'ko','노르웨지안 크루즈 라인','미국'),
  ((SELECT id FROM cruise_lines WHERE name='Carnival Cruise Line'), 'ko','카니발 크루즈 라인', '미국'),
  ((SELECT id FROM cruise_lines WHERE name='Celebrity Cruises'),    'ko','셀레브리티 크루즈',  '미국'),
  ((SELECT id FROM cruise_lines WHERE name='Princess Cruises'),     'ko','프린세스 크루즈',    '미국'),
  ((SELECT id FROM cruise_lines WHERE name='Holland America Line'), 'ko','홀랜드 아메리카 라인','미국'),
  ((SELECT id FROM cruise_lines WHERE name='Costa Cruises'),        'ko','코스타 크루즈',      '이탈리아'),
  ((SELECT id FROM cruise_lines WHERE name='AIDA Cruises'),         'ko','아이다 크루즈',      '독일'),
  ((SELECT id FROM cruise_lines WHERE name='Cunard Line'),          'ko','큐나드 라인',        '영국');

-- ══════════════════════════════════════════════════════════════════════════
-- CRUISE SHIPS  (cruise_line, ship_name, capacity, service_charge, wifi_price, drink_package, specialty_dining)
-- ══════════════════════════════════════════════════════════════════════════
INSERT INTO cruise_ships (cruise_line, ship_name, capacity, service_charge, wifi_price, drink_package, specialty_dining) VALUES
  ('Royal Caribbean',      'Wonder of the Seas',   6988, 18, 20, 85, 60),
  ('Royal Caribbean',      'Symphony of the Seas', 6680, 18, 20, 85, 60),
  ('Royal Caribbean',      'Icon of the Seas',     7600, 20, 22, 95, 65),
  ('MSC Cruises',          'MSC World Europa',     6762, 16, 18, 75, 50),
  ('MSC Cruises',          'MSC Seashore',         5877, 16, 18, 75, 50),
  ('Norwegian Cruise Line','Norwegian Prima',       3215, 20, 22, 99, 55),
  ('Norwegian Cruise Line','Norwegian Viva',        3219, 20, 22, 99, 55),
  ('Carnival Cruise Line', 'Mardi Gras',            6500, 16, 18, 59, 45),
  ('Carnival Cruise Line', 'Celebration',           6500, 16, 18, 59, 45),
  ('Celebrity Cruises',    'Celebrity Beyond',      3260, 18, 25, 89, 65),
  ('Princess Cruises',     'Sun Princess',          4300, 16, 20, 79, 55),
  ('Holland America Line', 'Rotterdam',             2668, 15, 18, 69, 50),
  ('Costa Cruises',        'Costa Toscana',         5224, 14, 16, 65, 45),
  ('AIDA Cruises',         'AIDAnova',              6600, 14, 15, 60, 40),
  ('Cunard Line',          'Queen Mary 2',          2691, 15, 20, 79, 55);

INSERT INTO cruise_ships_i18n (cruise_ship_id, lang, cruise_line, ship_name) VALUES
  ((SELECT id FROM cruise_ships WHERE ship_name='Wonder of the Seas'),  'ko','로열 캐리비안',     '원더 오브 더 씨즈'),
  ((SELECT id FROM cruise_ships WHERE ship_name='Symphony of the Seas'),'ko','로열 캐리비안',     '심포니 오브 더 씨즈'),
  ((SELECT id FROM cruise_ships WHERE ship_name='Icon of the Seas'),    'ko','로열 캐리비안',     '아이콘 오브 더 씨즈'),
  ((SELECT id FROM cruise_ships WHERE ship_name='MSC World Europa'),    'ko','MSC 크루즈',        'MSC 월드 유로파'),
  ((SELECT id FROM cruise_ships WHERE ship_name='MSC Seashore'),        'ko','MSC 크루즈',        'MSC 씨쇼어'),
  ((SELECT id FROM cruise_ships WHERE ship_name='Norwegian Prima'),     'ko','노르웨지안 크루즈 라인','노르웨지안 프리마'),
  ((SELECT id FROM cruise_ships WHERE ship_name='Norwegian Viva'),      'ko','노르웨지안 크루즈 라인','노르웨지안 비바'),
  ((SELECT id FROM cruise_ships WHERE ship_name='Mardi Gras'),          'ko','카니발 크루즈 라인', '마르디 그라'),
  ((SELECT id FROM cruise_ships WHERE ship_name='Celebrity Beyond'),    'ko','셀레브리티 크루즈',  '셀레브리티 비욘드'),
  ((SELECT id FROM cruise_ships WHERE ship_name='Sun Princess'),        'ko','프린세스 크루즈',    '선 프린세스'),
  ((SELECT id FROM cruise_ships WHERE ship_name='Costa Toscana'),       'ko','코스타 크루즈',      '코스타 토스카나'),
  ((SELECT id FROM cruise_ships WHERE ship_name='Queen Mary 2'),        'ko','큐나드 라인',        '퀸 메리 2');

-- ══════════════════════════════════════════════════════════════════════════
-- CRUISE PORTS  (name, country, shuttle_bus, taxi, meeting_point)
-- ══════════════════════════════════════════════════════════════════════════
INSERT INTO cruise_ports (name, country, shuttle_bus, taxi, meeting_point) VALUES
  ('Yokohama Port',           'Japan',       'Shuttle every 20 min to city center.',     'Taxi stand outside Osanbashi Pier.',       'Osanbashi Hall entrance'),
  ('Kobe Cruise Port',        'Japan',       'Shuttle to Sannomiya every 30 min.',       'Taxi stand at Port Terminal exit.',         'Port Terminal main lobby'),
  ('Hakata Port',             'Japan',       'Shuttle to Tenjin every 20 min.',          'Taxi stand at International Terminal.',     'International Terminal gate'),
  ('Nagasaki Port',           'Japan',       'Taxi recommended; bus every 40 min.',      'Taxi stand at pier exit.',                  'Nagasaki Port Terminal'),
  ('Singapore (Marina Bay)',  'Singapore',   'MRT Circle Line to Harbourfront.',         'Taxi at Marina Bay Cruise Centre exit.',    'MBCC Main Hall Level 1'),
  ('Hong Kong (Kai Tak)',     'Hong Kong',   'Pre-book bus or taxi to Kowloon.',         'Taxi rank outside terminal.',               'Kai Tak Cruise Terminal L3'),
  ('Barcelona Cruise Port',   'Spain',       'Port shuttle to Las Ramblas.',             'Taxi rank at Terminal B exit.',             'Terminal B arrivals gate'),
  ('Civitavecchia (Rome)',    'Italy',       'Shuttle to Rome Termini (90 min).',        'Taxi from Civitavecchia station.',          'Civitavecchia Ferry Terminal'),
  ('Piraeus (Athens)',        'Greece',      'Metro Line 1 to Athens center (1 hr).',    'Taxi stand at Gate E1.',                    'Gate E1 passenger terminal'),
  ('Venice Cruise Terminal',  'Italy',       'Water taxi or bus to Piazzale Roma.',      'Water taxi from terminal dock.',            'Venezia Passenger Terminal'),
  ('Dubrovnik',               'Croatia',     'Bus 1A to Old Town (20 min).',             'Taxi stand at Gruž port.',                  'Gruž Harbour'),
  ('Santorini (Athinios)',    'Greece',      'Cable car or mule ride to Fira.',          'Taxi from Athinios port.',                  'Athinios Ferry Port'),
  ('Mykonos',                 'Greece',      'Local bus to Mykonos Town.',               'Taxi at port entrance.',                    'Old Port entrance'),
  ('Kotor',                   'Montenegro',  'Walk to Old Town (5 min).',               'Taxi at pier exit.',                        'Old Town Gate entrance'),
  ('Southampton',             'UK',          'Pre-book coach to London (2 hr).',         'Taxi rank at Ocean Terminal.',              'Ocean Terminal main entrance'),
  ('Miami Cruise Port',       'USA',         'Port shuttles to hotel areas.',            'Taxi and Uber at terminal exit.',           'Terminal lobby meeting point'),
  ('Port Canaveral',          'USA',         'Shuttle to Orlando (1 hr).',              'Taxi and rideshare available.',             'Cruise terminal lobby'),
  ('Seattle Cruise Port',     'USA',         'Downtown Seattle 10-min walk.',            'Taxi at Bell Street Pier exit.',            'Bell Street Pier entrance'),
  ('Vancouver Cruise Port',   'Canada',      'Canada Place is downtown, walk only.',     'Taxi rank at Canada Place exit.',           'Canada Place Convention Centre'),
  ('Sydney Cruise Terminal',  'Australia',   'Pre-book bus or Uber; ferry available.',   'Taxi at Overseas Passenger Terminal.',      'OPT Main Entrance'),
  ('Cozumel',                 'Mexico',      'Golf cart rentals and taxis available.',   'Taxi stand at Puerta Maya pier.',           'Puerta Maya pier entrance'),
  ('Nassau',                  'Bahamas',     'Walk to downtown (10 min).',              'Taxi at Prince George Wharf.',              'Prince George Wharf'),
  ('Belize City',             'Belize',      'Water taxi to mainland.',                 'Taxi at tender boat landing.',              'Fort Street Tourism Village'),
  ('Phuket (Laem Chabang)',   'Thailand',    'Shuttle to Phuket Town (45 min).',        'Taxi from terminal.',                       'Laem Chabang Port Terminal B'),
  ('Ho Chi Minh City',        'Vietnam',     'Bus or minivan to city center (1 hr).',   'Taxi from Phu My port.',                    'Phu My International Port');

INSERT INTO cruise_ports_i18n (port_id, lang, name, country, shuttle_bus, taxi, meeting_point) VALUES
  ((SELECT id FROM cruise_ports WHERE name='Yokohama Port'),         'ko','요코하마 항','일본','20분 간격 시내 셔틀 운행.','오산바시 부두 출구 택시 승차장.','오산바시 홀 입구'),
  ((SELECT id FROM cruise_ports WHERE name='Kobe Cruise Port'),      'ko','고베 크루즈 항','일본','30분 간격 산노미야행 셔틀.','항만 터미널 출구 택시 승차장.','항만 터미널 메인 로비'),
  ((SELECT id FROM cruise_ports WHERE name='Hakata Port'),           'ko','하카타 항','일본','20분 간격 텐진행 셔틀.','국제 터미널 택시 승차장.','국제 터미널 게이트'),
  ((SELECT id FROM cruise_ports WHERE name='Nagasaki Port'),         'ko','나가사키 항','일본','버스 40분 간격; 택시 권장.','부두 출구 택시 승차장.','나가사키 항 터미널'),
  ((SELECT id FROM cruise_ports WHERE name='Singapore (Marina Bay)'),'ko','싱가포르 (마리나 베이)','싱가포르','MRT 서클 라인 하버프론트행.','MBCC 출구 택시.','MBCC 메인 홀 1층'),
  ((SELECT id FROM cruise_ports WHERE name='Hong Kong (Kai Tak)'),   'ko','홍콩 (카이탁)','홍콩','구룡까지 버스·택시 사전 예약.','터미널 외부 택시 승차장.','카이탁 크루즈 터미널 3층'),
  ((SELECT id FROM cruise_ports WHERE name='Barcelona Cruise Port'), 'ko','바르셀로나 크루즈 항','스페인','라람블라스행 셔틀.','터미널 B 출구 택시 승차장.','터미널 B 도착 게이트'),
  ((SELECT id FROM cruise_ports WHERE name='Civitavecchia (Rome)'),  'ko','치비타베키아 (로마)','이탈리아','로마 테르미니 셔틀 (90분).','치비타베키아역 택시.','치비타베키아 페리 터미널'),
  ((SELECT id FROM cruise_ports WHERE name='Piraeus (Athens)'),      'ko','피레우스 (아테네)','그리스','지하철 1호선 아테네 중심 (1시간).','E1 게이트 앞 택시 승차장.','E1 게이트 여객 터미널'),
  ((SELECT id FROM cruise_ports WHERE name='Venice Cruise Terminal'), 'ko','베네치아 크루즈 터미널','이탈리아','피아찰레 로마까지 수상 택시 또는 버스.','터미널 부두 수상 택시.','베네치아 여객 터미널'),
  ((SELECT id FROM cruise_ports WHERE name='Miami Cruise Port'),     'ko','마이애미 크루즈 항','미국','호텔 지역행 셔틀 운행.','터미널 출구 택시 및 우버.','터미널 로비 집합 지점'),
  ((SELECT id FROM cruise_ports WHERE name='Sydney Cruise Terminal'), 'ko','시드니 크루즈 터미널','호주','버스 또는 우버 사전 예약; 페리 가능.','해외 여객 터미널 앞 택시.','OPT 메인 입구');

-- ══════════════════════════════════════════════════════════════════════════
-- COMMUNITY POSTS  (title, content, author)
-- ══════════════════════════════════════════════════════════════════════════
INSERT INTO community_posts (title, content, author) VALUES
  ('Boarding checklist essentials',  'Carry passports, printed vouchers, and medication lists in a single crew pouch.', 'Hana Lee'),
  ('Fast transfer at Changi',         'Use the Skytrain between terminals during peak hours to save 20 minutes.',        'Miguel Santos'),
  ('Lost passport protocol',          'File a police report before embassy visit and keep copies of guest IDs.',         'Aiko Tanaka'),
  ('Shore excursion timing tips',     'Allow 30 min buffer from ship departure when planning shore excursions.',         'Park Ji-won'),
  ('Incheon transit lounge guide',    'Use the transit hotel on Level 5 for layovers longer than 6 hours.',             'Sarah Kim');

-- ══════════════════════════════════════════════════════════════════════════
-- TOUR JOBS  (agency, country, tour_date, salary, description)
-- ══════════════════════════════════════════════════════════════════════════
INSERT INTO tour_jobs (agency, country, tour_date, salary, description) VALUES
  ('Aurora Travel Group',  'Japan',     '2026-04-10', '$220/day', 'Lead a 7-day Kyoto/Tokyo itinerary with 28 guests.'),
  ('Blue Harbor Cruises',  'Spain',     '2026-05-03', '$240/day', 'Coordinate embarkation and shore excursions for 9-day Mediterranean sailing.'),
  ('Sunrise Asia Tours',   'Thailand',  '2026-06-01', '$180/day', 'Lead 5-day group tour through Bangkok and Phuket.');

COMMIT;
