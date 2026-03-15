-- Supabase Schema for Travel Leader Network

-- Countries
CREATE TABLE IF NOT EXISTS countries (
  id SERIAL PRIMARY KEY,
  name TEXT,
  visa_info TEXT,
  embassy TEXT,
  emergency_number TEXT,
  immigration_tips TEXT
);

CREATE TABLE IF NOT EXISTS countries_i18n (
  id SERIAL PRIMARY KEY,
  country_id INT REFERENCES countries(id) ON DELETE CASCADE,
  lang TEXT NOT NULL,
  name TEXT,
  visa_info TEXT,
  embassy TEXT,
  emergency_number TEXT,
  immigration_tips TEXT
);

-- Airports
CREATE TABLE IF NOT EXISTS airports (
  id SERIAL PRIMARY KEY,
  iata TEXT,
  name TEXT,
  city TEXT,
  country TEXT,
  terminals INT,
  smoking_area BOOLEAN,
  lounge BOOLEAN,
  taxi BOOLEAN,
  bus BOOLEAN,
  subway BOOLEAN
);

CREATE TABLE IF NOT EXISTS airports_i18n (
  id SERIAL PRIMARY KEY,
  airport_id INT REFERENCES airports(id) ON DELETE CASCADE,
  lang TEXT NOT NULL,
  name TEXT,
  city TEXT,
  country TEXT
);

-- Cruise Lines
CREATE TABLE IF NOT EXISTS cruise_lines (
  id SERIAL PRIMARY KEY,
  name TEXT,
  country TEXT
);

CREATE TABLE IF NOT EXISTS cruise_lines_i18n (
  id SERIAL PRIMARY KEY,
  cruise_line_id INT REFERENCES cruise_lines(id) ON DELETE CASCADE,
  lang TEXT NOT NULL,
  name TEXT,
  country TEXT
);

-- Cruise Ships
CREATE TABLE IF NOT EXISTS cruise_ships (
  id SERIAL PRIMARY KEY,
  cruise_line TEXT,
  ship TEXT,
  capacity INT,
  service_charge INT,
  wifi_price INT,
  drink_package INT,
  specialty_dining INT
);

CREATE TABLE IF NOT EXISTS cruise_ships_i18n (
  id SERIAL PRIMARY KEY,
  cruise_ship_id INT REFERENCES cruise_ships(id) ON DELETE CASCADE,
  lang TEXT NOT NULL,
  cruise_line TEXT,
  ship TEXT
);

-- Cruise Ports
CREATE TABLE IF NOT EXISTS cruise_ports (
  id SERIAL PRIMARY KEY,
  name TEXT,
  country TEXT,
  shuttle_bus TEXT,
  taxi TEXT,
  meeting_point TEXT,
  safety_alert TEXT
);

CREATE TABLE IF NOT EXISTS cruise_ports_i18n (
  id SERIAL PRIMARY KEY,
  port_id INT REFERENCES cruise_ports(id) ON DELETE CASCADE,
  lang TEXT NOT NULL,
  name TEXT,
  country TEXT,
  shuttle_bus TEXT,
  taxi TEXT,
  meeting_point TEXT,
  safety_alert TEXT
);

-- Cruise Terminals
CREATE TABLE IF NOT EXISTS cruise_terminals (
  id SERIAL PRIMARY KEY,
  cruise_port_id INT REFERENCES cruise_ports(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  luggage_drop_location TEXT,
  check_in_counters TEXT,
  security_checkpoint TEXT,
  boarding_gate TEXT,
  luggage_claim TEXT,
  terminal_maps TEXT
);

-- Embassies
CREATE TABLE IF NOT EXISTS embassies (
  id SERIAL PRIMARY KEY,
  country_id INT REFERENCES countries(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  email TEXT,
  lat NUMERIC,
  lng NUMERIC
);

-- Users
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  role TEXT,
  experience INT,
  languages TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Agencies
CREATE TABLE IF NOT EXISTS agencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  website TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  location TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tour Jobs
CREATE TABLE IF NOT EXISTS tour_jobs (
  id SERIAL PRIMARY KEY,
  agency TEXT,
  agency_id UUID REFERENCES agencies(id) ON DELETE SET NULL,
  country TEXT,
  tour_date DATE, -- Keep for seed compatibility
  start_date DATE,
  end_date DATE,
  salary TEXT,
  title TEXT,
  description TEXT,
  status TEXT DEFAULT 'open'
);

CREATE TABLE IF NOT EXISTS tour_jobs_i18n (
  id SERIAL PRIMARY KEY,
  tour_job_id INT REFERENCES tour_jobs(id) ON DELETE CASCADE,
  lang TEXT NOT NULL,
  title TEXT,
  description TEXT,
  country TEXT
);

-- Tour Applications
CREATE TABLE IF NOT EXISTS tour_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tour_job_id INT REFERENCES tour_jobs(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending',
  message TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Community Posts
CREATE TABLE IF NOT EXISTS community_posts (
  id SERIAL PRIMARY KEY,
  title TEXT,
  content TEXT,
  author TEXT,
  category TEXT,
  likes INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS community_posts_i18n (
  id SERIAL PRIMARY KEY,
  community_post_id INT REFERENCES community_posts(id) ON DELETE CASCADE,
  lang TEXT NOT NULL,
  title TEXT,
  content TEXT,
  category TEXT
);

-- Route Briefs
CREATE TABLE IF NOT EXISTS route_briefs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  start_location TEXT,
  end_location TEXT,
  waypoints JSONB,
  maps_url TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Audio POIs
CREATE TABLE IF NOT EXISTS audio_pois (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  lat NUMERIC NOT NULL,
  lng NUMERIC NOT NULL,
  radius_m INT DEFAULT 200,
  messages JSONB NOT NULL,
  tags TEXT[],
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Leader Settings
CREATE TABLE IF NOT EXISTS leader_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE,
  language TEXT DEFAULT 'ko-KR',
  radius_m INT DEFAULT 200,
  voice TEXT DEFAULT 'default',
  repeat BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
