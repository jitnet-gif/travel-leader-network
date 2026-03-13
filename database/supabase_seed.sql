-- Sample seed data with i18n rows (English + Korean)
begin;

-- Airports
with airport_rows as (
  insert into airports (iata, name, city, country, terminals, smoking_area, lounge, subway, taxi, bus)
  values
    ('ICN', 'Incheon International Airport', 'Seoul', 'South Korea', 2, true, true, true, true, true),
    ('NRT', 'Narita International Airport', 'Tokyo', 'Japan', 3, true, true, true, true, true)
  returning id, iata
)
insert into airports_i18n (airport_id, lang, name, city, country)
values
  ((select id from airport_rows where iata = 'ICN'), 'en', 'Incheon International Airport', 'Seoul', 'South Korea'),
  ((select id from airport_rows where iata = 'ICN'), 'ko', '인천국제공항', '서울', '대한민국'),
  ((select id from airport_rows where iata = 'NRT'), 'en', 'Narita International Airport', 'Tokyo', 'Japan'),
  ((select id from airport_rows where iata = 'NRT'), 'ko', '나리타국제공항', '도쿄', '일본');

-- Countries
with country_rows as (
  insert into countries (name, visa_info, embassy, emergency_number, immigration_tips)
  values
    ('Japan', 'Visa-free up to 90 days for many nationalities.', 'Embassy of Japan, Washington DC', 'Police 110, Ambulance 119', 'Carry return ticket and hotel confirmation.'),
    ('Philippines', 'Visa-free 30 days for many nationalities.', 'Philippine Embassy, Washington DC', 'Police 911, Tourist 8-524-1660', 'Complete eTravel QR before arrival.')
  returning id, name
)
insert into countries_i18n (country_id, lang, name, visa_info, embassy, emergency_number, immigration_tips)
values
  ((select id from country_rows where name = 'Japan'), 'en', 'Japan', 'Visa-free up to 90 days for many nationalities.', 'Embassy of Japan, Washington DC', 'Police 110, Ambulance 119', 'Carry return ticket and hotel confirmation.'),
  ((select id from country_rows where name = 'Japan'), 'ko', '일본', '여러 국적은 최대 90일 무비자 입국.', '주미 일본 대사관', '경찰 110, 구급 119', '귀국 항공권과 숙소 예약 확인서를 지참하세요.'),
  ((select id from country_rows where name = 'Philippines'), 'en', 'Philippines', 'Visa-free 30 days for many nationalities.', 'Philippine Embassy, Washington DC', 'Police 911, Tourist 8-524-1660', 'Complete eTravel QR before arrival.'),
  ((select id from country_rows where name = 'Philippines'), 'ko', '필리핀', '여러 국적은 30일 무비자 입국.', '주미 필리핀 대사관', '경찰 911, 관광경찰 8-524-1660', '입국 전 eTravel QR을 완료하세요.');

-- Cruise lines
with line_rows as (
  insert into cruise_lines (name, country)
  values
    ('Royal Caribbean', 'United States'),
    ('MSC Cruises', 'Switzerland')
  returning id, name
)
insert into cruise_lines_i18n (cruise_line_id, lang, name, country)
values
  ((select id from line_rows where name = 'Royal Caribbean'), 'en', 'Royal Caribbean', 'United States'),
  ((select id from line_rows where name = 'Royal Caribbean'), 'ko', '로열 캐리비안', '미국'),
  ((select id from line_rows where name = 'MSC Cruises'), 'en', 'MSC Cruises', 'Switzerland'),
  ((select id from line_rows where name = 'MSC Cruises'), 'ko', 'MSC 크루즈', '스위스');

-- Cruise ships
with ship_rows as (
  insert into cruise_ships (cruise_line, ship, capacity, service_charge, wifi_price, drink_package, specialty_dining)
  values
    ('Royal Caribbean', 'Wonder of the Seas', 6988, 18, 20, 85, 60),
    ('MSC Cruises', 'MSC World Europa', 6762, 16, 18, 75, 50)
  returning id, ship
)
insert into cruise_ships_i18n (cruise_ship_id, lang, cruise_line, ship)
values
  ((select id from ship_rows where ship = 'Wonder of the Seas'), 'en', 'Royal Caribbean', 'Wonder of the Seas'),
  ((select id from ship_rows where ship = 'Wonder of the Seas'), 'ko', '로열 캐리비안', '원더 오브 더 씨즈'),
  ((select id from ship_rows where ship = 'MSC World Europa'), 'en', 'MSC Cruises', 'MSC World Europa'),
  ((select id from ship_rows where ship = 'MSC World Europa'), 'ko', 'MSC 크루즈', 'MSC 월드 유로파');

-- Ports
with port_rows as (
  insert into ports (name, country, shuttle_bus, taxi, meeting_point, safety_alert)
  values
    ('Yokohama Port', 'Japan', 'Shuttle every 20 minutes to city center.', 'Taxi stands outside Osanbashi Pier.', 'Osanbashi Hall entrance', 'Heavy traffic during weekends.'),
    ('Barcelona Cruise Port', 'Spain', 'Port shuttle to Las Ramblas.', 'Taxi rank at Terminal B exit.', 'Terminal B arrivals gate', 'Pickpocketing reported near port gates.')
  returning id, name
)
insert into ports_i18n (port_id, lang, name, country, shuttle_bus, taxi, meeting_point, safety_alert)
values
  ((select id from port_rows where name = 'Yokohama Port'), 'en', 'Yokohama Port', 'Japan', 'Shuttle every 20 minutes to city center.', 'Taxi stands outside Osanbashi Pier.', 'Osanbashi Hall entrance', 'Heavy traffic during weekends.'),
  ((select id from port_rows where name = 'Yokohama Port'), 'ko', '요코하마 항', '일본', '20분 간격 시내 셔틀 운행.', '오산바시 부두 출구 택시 승차장.', '오산바시 홀 입구', '주말 교통 혼잡 주의.'),
  ((select id from port_rows where name = 'Barcelona Cruise Port'), 'en', 'Barcelona Cruise Port', 'Spain', 'Port shuttle to Las Ramblas.', 'Taxi rank at Terminal B exit.', 'Terminal B arrivals gate', 'Pickpocketing reported near port gates.'),
  ((select id from port_rows where name = 'Barcelona Cruise Port'), 'ko', '바르셀로나 크루즈 항', '스페인', '라람블라스로 향하는 셔틀 운행.', '터미널 B 출구 택시 승차장.', '터미널 B 도착 게이트', '항구 게이트 인근 소매치기 주의.');

-- Tour jobs
with job_rows as (
  insert into tour_jobs (agency, country, tour_date, salary, title, description)
  values
    ('Aurora Travel Group', 'Japan', '2026-04-10', '$220/day', 'Japan Spring Tour Leader', 'Lead a 7-day Kyoto/Tokyo itinerary with 28 guests.'),
    ('Blue Harbor Cruises', 'Spain', '2026-05-03', '$240/day', 'Mediterranean Cruise Escort', 'Coordinate embarkation and shore excursions for 9-day sailing.')
  returning id, title
)
insert into tour_jobs_i18n (tour_job_id, lang, title, description, country)
values
  ((select id from job_rows where title = 'Japan Spring Tour Leader'), 'en', 'Japan Spring Tour Leader', 'Lead a 7-day Kyoto/Tokyo itinerary with 28 guests.', 'Japan'),
  ((select id from job_rows where title = 'Japan Spring Tour Leader'), 'ko', '일본 봄 시즌 투어 리더', '28명 규모의 교토/도쿄 7일 일정 리딩.', '일본'),
  ((select id from job_rows where title = 'Mediterranean Cruise Escort'), 'en', 'Mediterranean Cruise Escort', 'Coordinate embarkation and shore excursions for 9-day sailing.', 'Spain'),
  ((select id from job_rows where title = 'Mediterranean Cruise Escort'), 'ko', '지중해 크루즈 에스코트', '9일 항해 승선 및 기항지 운영 지원.', '스페인');

-- Community posts
with post_rows as (
  insert into community_posts (title, content, author, category, likes)
  values
    ('Boarding checklist essentials', 'Carry passports, printed vouchers, and medication lists in a single crew pouch.', 'Hana Lee', 'Cruise tips', 18),
    ('Fast transfer at Changi', 'Use the Skytrain between terminals during peak hours to save 20 minutes.', 'Miguel Santos', 'Airport tips', 11),
    ('Lost passport protocol', 'File a police report before embassy visit and keep copies of guest IDs.', 'Aiko Tanaka', 'Emergency cases', 24)
  returning id, title
)
insert into community_posts_i18n (community_post_id, lang, title, content, category)
values
  ((select id from post_rows where title = 'Boarding checklist essentials'), 'en', 'Boarding checklist essentials', 'Carry passports, printed vouchers, and medication lists in a single crew pouch.', 'Cruise tips'),
  ((select id from post_rows where title = 'Boarding checklist essentials'), 'ko', '승선 체크리스트 핵심', '여권, 바우처, 약 목록을 하나의 파우치에 정리하세요.', '크루즈 팁'),
  ((select id from post_rows where title = 'Fast transfer at Changi'), 'en', 'Fast transfer at Changi', 'Use the Skytrain between terminals during peak hours to save 20 minutes.', 'Airport tips'),
  ((select id from post_rows where title = 'Fast transfer at Changi'), 'ko', '창이 환승 빠른 동선', '피크 타임에는 스카이트레인을 이용해 20분 절약할 수 있습니다.', '공항 팁'),
  ((select id from post_rows where title = 'Lost passport protocol'), 'en', 'Lost passport protocol', 'File a police report before embassy visit and keep copies of guest IDs.', 'Emergency cases'),
  ((select id from post_rows where title = 'Lost passport protocol'), 'ko', '여권 분실 프로토콜', '대사관 방문 전 경찰 신고서 발급 및 신분증 사본 확보.', '비상 사례');

commit;
