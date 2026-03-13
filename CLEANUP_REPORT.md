# 데이터 정리 및 검색·내부지도 수정 보고서

> 작업일: 2026-03-13

---

## 1. 데이터베이스 중복 제거 결과

### 1-1. `database/airports_500.json`

| 항목 | 수치 |
|------|------|
| 정리 전 | **500** 건 |
| 정리 후 | **20** 건 |
| 제거된 중복 | **480** 건 |

**고유 공항 목록 (20개)**

| IATA | 공항명 | 도시 | 국가 |
|------|--------|------|------|
| AMS | Schiphol Airport | Amsterdam | Netherlands |
| ATL | Hartsfield-Jackson Atlanta International | Atlanta | USA |
| BCN | Barcelona El Prat Airport | Barcelona | Spain |
| BKK | Suvarnabhumi Airport | Bangkok | Thailand |
| CDG | Charles de Gaulle Airport | Paris | France |
| DXB | Dubai International Airport | Dubai | UAE |
| FRA | Frankfurt Airport | Frankfurt | Germany |
| HND | Tokyo Haneda Airport | Tokyo | Japan |
| ICN | Incheon International Airport | Seoul | South Korea |
| IST | Istanbul Airport | Istanbul | Turkey |
| KUL | Kuala Lumpur International Airport | Kuala Lumpur | Malaysia |
| LAX | Los Angeles International Airport | Los Angeles | USA |
| LHR | Heathrow Airport | London | UK |
| MAD | Madrid Barajas Airport | Madrid | Spain |
| MNL | Ninoy Aquino International Airport | Manila | Philippines |
| NRT | Narita International Airport | Tokyo | Japan |
| SIN | Singapore Changi Airport | Singapore | Singapore |
| SYD | Sydney Airport | Sydney | Australia |
| YVR | Vancouver International Airport | Vancouver | Canada |
| YYZ | Toronto Pearson Airport | Toronto | Canada |

---

### 1-2. `database/cruise_ports_400.json`

| 항목 | 수치 |
|------|------|
| 정리 전 | **400** 건 |
| 정리 후 | **19** 건 |
| 제거된 중복 | **381** 건 |

**고유 크루즈 항구 목록 (19개)**

| 항구명 | 국가 |
|--------|------|
| Athens Cruise Port | Greece |
| Barcelona Cruise Port | Spain |
| Copenhagen Cruise Port | Denmark |
| Dubai Cruise Port | United Arab Emirates |
| Hong Kong Cruise Port | Hong Kong |
| Istanbul Cruise Port | Turkey |
| Lisbon Cruise Port | Portugal |
| Los Angeles Cruise Port | United States |
| Miami Cruise Port | United States |
| Naples Cruise Port | Italy |
| Rome Cruise Port | Italy |
| Seattle Cruise Port | United States |
| Shanghai Cruise Port | China |
| Singapore Cruise Port | Singapore |
| Stockholm Cruise Port | Sweden |
| Sydney Cruise Port | Australia |
| Tokyo Cruise Port | Japan |
| Vancouver Cruise Port | Canada |
| Venice Cruise Port | Italy |

---

### 1-3. `database/cruise_ships_300.json`

| 항목 | 수치 |
|------|------|
| 정리 전 | **300** 건 (선박명 suffix "-0","-1" 붙은 중복 + 선사 무작위 배정) |
| 정리 후 | **30** 건 |
| 제거된 중복 | **270** 건 |

> **주요 문제**: 기존 데이터는 동일 선박(Icon of the Seas 등)이 여러 선사(Carnival, Disney 등)에 반복 등록되어 있었음.
> **해결**: 실제 선사-선박 관계에 맞게 완전 재구성.

**정리된 선사별 선박 목록**

| 선사 | 선박명 |
|------|--------|
| Royal Caribbean | Icon of the Seas, Wonder of the Seas, Oasis of the Seas, Symphony of the Seas |
| Carnival Cruise Line | Carnival Celebration, Carnival Jubilee, Carnival Venezia |
| Norwegian Cruise Line | Norwegian Prima, Norwegian Viva, Norwegian Encore |
| MSC Cruises | MSC World Europa, MSC Grandiosa, MSC Seashore, MSC Seaside |
| Celebrity Cruises | Celebrity Beyond, Celebrity Apex, Celebrity Edge |
| Holland America Line | Koningsdam, Rotterdam, Nieuw Statendam |
| Princess Cruises | Sky Princess, Discovery Princess, Sun Princess |
| Disney Cruise Line | Disney Wish, Disney Fantasy, Disney Dream |
| Costa Cruises | Costa Toscana, Costa Smeralda |
| Adora Cruises | Adora Magic City, Adora Star |

---

### 1-4. 변경 없는 테이블

| 파일 | 건수 | 중복 |
|------|------|------|
| `countries.json` | 80 | 없음 ✅ |
| `cruise_lines.json` | 10 | 없음 ✅ |
| `tour_jobs.json` | 50 | 없음 ✅ |
| `community_posts.json` | 100 | 없음 ✅ |
| `audio_pois.json` | 5 | 없음 ✅ |

---

## 2. 공항 내부 지도 (`AirportIndoorMap.vue`) 수정

### 문제
- 기존: `around:3000`(반경 3km) 쿼리 → 공항 주변 도시의 식당·화장실까지 모두 표시
- 기존: zoom 15 → 터미널 건물 내부 구조가 보이지 않음

### 수정 내용

| 항목 | 이전 | 이후 |
|------|------|------|
| Overpass 쿼리 방식 | `around:3000` (3km 반경) | `area["aeroway"="aerodrome"]["iata"="ICN"]` (공항 경계 내부만) |
| fallback 반경 | 3000m | **800m** (area 쿼리 결과 없을 때만 사용) |
| 초기 zoom | 15 | **17** (터미널 내부 구조 표시 가능 레벨) |
| 자동 범위 조정 | 없음 | `fitBounds` 적용 (마커 로드 후 자동 fit) |

### 동작 흐름

```
1. IATA 코드로 OSM aerodrome area 경계 쿼리 (정확한 공항 내부만)
   ↓ 결과 없으면
2. 공항 중심 좌표 기준 반경 800m fallback 쿼리
   ↓ 결과 없으면
3. "내부 지도 데이터 없음" 안내 + 공식 사이트 링크 표시
```

---

## 3. 검색 기능 수정 (이전 작업 포함)

### `composables/useSearch.ts` 신규 생성

- 단어별 분리 후 **OR 매칭** (어떤 단어든 하나라도 포함되면 표시)
- 자동 `trim()` 처리

### 페이지별 검색 필드 확장

| 페이지 | 이전 검색 필드 | 이후 검색 필드 |
|--------|--------------|--------------|
| 공항 | name, city, country, iata | 동일 (공통 함수 적용) |
| 국가 | name만 | name + visa_requirements + embassy + immigration_tips + emergency_numbers |
| 커뮤니티 | title만 | title + content + author + category |
| 채용 | title + country | title + country + agency + description |
| 루트 | title만 | title + description + start/end_location + waypoints + notes |

---

## 4. 수정된 파일 목록

```
database/
  airports_500.json          ← 500 → 20건 (중복 제거)
  cruise_ports_400.json      ← 400 → 19건 (중복 제거)
  cruise_ships_300.json      ← 300 → 30건 (재구성)

frontend/components/
  AirportIndoorMap.vue       ← Overpass 쿼리 및 zoom 수정

frontend/composables/
  useSearch.ts               ← 신규: 공통 검색 함수

frontend/pages/
  airports/index.vue         ← matchesQuery 적용
  countries/index.vue        ← 검색 필드 확장
  community/index.vue        ← 검색 필드 확장
  jobs/index.vue             ← 검색 필드 확장
  routes/index.vue           ← 검색 필드 확장
```
