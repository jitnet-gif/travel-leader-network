-- Update schema to match seed and frontend expectations
BEGIN;

-- 1. Airports
ALTER TABLE airports ADD COLUMN IF NOT EXISTS lat DOUBLE PRECISION;
ALTER TABLE airports ADD COLUMN IF NOT EXISTS lng DOUBLE PRECISION;

CREATE TABLE IF NOT EXISTS airports_i18n (
  id SERIAL PRIMARY KEY,
  airport_id INT REFERENCES airports(id) ON DELETE CASCADE,
  lang VARCHAR(5) NOT NULL,
  name TEXT,
  city TEXT,
  country TEXT,
  UNIQUE(airport_id, lang)
);

-- 2. Countries
ALTER TABLE countries ADD COLUMN IF NOT EXISTS immigration_tips TEXT;

CREATE TABLE IF NOT EXISTS countries_i18n (
  id SERIAL PRIMARY KEY,
  country_id INT REFERENCES countries(id) ON DELETE CASCADE,
  lang VARCHAR(5) NOT NULL,
  name TEXT,
  visa_info TEXT,
  embassy TEXT,
  emergency_number TEXT,
  immigration_tips TEXT,
  UNIQUE(country_id, lang)
);

-- 3. Cruise Lines
CREATE TABLE IF NOT EXISTS cruise_lines_i18n (
  id SERIAL PRIMARY KEY,
  cruise_line_id INT REFERENCES cruise_lines(id) ON DELETE CASCADE,
  lang VARCHAR(5) NOT NULL,
  name TEXT,
  country TEXT,
  UNIQUE(cruise_line_id, lang)
);

-- 4. Cruise Ships
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='cruise_ships' AND column_name='ship_name') THEN
    ALTER TABLE cruise_ships RENAME COLUMN ship_name TO ship;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS cruise_ships_i18n (
  id SERIAL PRIMARY KEY,
  cruise_ship_id INT REFERENCES cruise_ships(id) ON DELETE CASCADE,
  lang VARCHAR(5) NOT NULL,
  cruise_line TEXT,
  ship TEXT,
  UNIQUE(cruise_ship_id, lang)
);

-- 5. Ports (rename from cruise_ports)
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'cruise_ports') THEN
    ALTER TABLE cruise_ports RENAME TO ports;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS ports (
  id SERIAL PRIMARY KEY,
  name TEXT,
  country TEXT,
  shuttle_bus TEXT, 
  taxi TEXT,        
  meeting_point TEXT,
  safety_alert TEXT
);

ALTER TABLE ports ALTER COLUMN shuttle_bus TYPE TEXT;
ALTER TABLE ports ALTER COLUMN taxi TYPE TEXT;

CREATE TABLE IF NOT EXISTS ports_i18n (
  id SERIAL PRIMARY KEY,
  port_id INT REFERENCES ports(id) ON DELETE CASCADE,
  lang VARCHAR(5) NOT NULL,
  name TEXT,
  country TEXT,
  shuttle_bus TEXT,
  taxi TEXT,
  meeting_point TEXT,
  safety_alert TEXT,
  UNIQUE(port_id, lang)
);

-- 6. Tour Jobs
ALTER TABLE tour_jobs ADD COLUMN IF NOT EXISTS title TEXT;
DO $$ 
BEGIN
  IF (SELECT data_type FROM information_schema.columns WHERE table_name='tour_jobs' AND column_name='salary') <> 'text' THEN
    ALTER TABLE tour_jobs ALTER COLUMN salary TYPE TEXT;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS tour_jobs_i18n (
  id SERIAL PRIMARY KEY,
  tour_job_id INT REFERENCES tour_jobs(id) ON DELETE CASCADE,
  lang VARCHAR(5) NOT NULL,
  title TEXT,
  description TEXT,
  country TEXT,
  UNIQUE(tour_job_id, lang)
);

-- 7. Community Posts
ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS likes INT DEFAULT 0;

CREATE TABLE IF NOT EXISTS community_posts_i18n (
  id SERIAL PRIMARY KEY,
  community_post_id INT REFERENCES community_posts(id) ON DELETE CASCADE,
  lang VARCHAR(5) NOT NULL,
  title TEXT,
  content TEXT,
  category TEXT,
  UNIQUE(community_post_id, lang)
);

-- 8. Leader Settings
CREATE TABLE IF NOT EXISTS leader_settings (
  user_id TEXT PRIMARY KEY,
  language TEXT DEFAULT 'ko-KR',
  radius_m INT DEFAULT 200,
  voice TEXT DEFAULT 'alloy',
  repeat BOOLEAN DEFAULT false,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMIT;
