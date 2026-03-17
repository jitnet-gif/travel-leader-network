-- Travel Leader Network schema

create extension if not exists "pgcrypto";

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique,
  role text not null check (role in ('leader','agency','admin')),
  full_name text not null,
  email text unique,
  phone text,
  bio text,
  experience_years int default 0,
  created_at timestamptz default now()
);

create table if not exists agencies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  website text,
  contact_email text,
  contact_phone text,
  location text,
  created_at timestamptz default now()
);

create table if not exists tour_jobs (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid references agencies(id) on delete cascade,
  title text not null,
  description text,
  destination_country text,
  start_date date,
  end_date date,
  pay_rate text,
  status text not null default 'open' check (status in ('open','closed')),
  created_at timestamptz default now()
);

create table if not exists tour_applications (
  id uuid primary key default gen_random_uuid(),
  tour_job_id uuid references tour_jobs(id) on delete cascade,
  user_id uuid references users(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending','accepted','rejected')),
  message text,
  created_at timestamptz default now()
);

create table if not exists countries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  iso_code text,
  visa_requirements text,
  entry_forms text,
  immigration_tips text,
  prohibited_items text,
  emergency_numbers text,
  created_at timestamptz default now()
);

create table if not exists embassies (
  id uuid primary key default gen_random_uuid(),
  country_id uuid references countries(id) on delete cascade,
  name text not null,
  address text,
  phone text,
  email text,
  lat numeric,
  lng numeric
);

create table if not exists airports (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  iata_code text,
  city text,
  country text,
  terminal_info text,
  terminal_maps text,
  smoking_areas text,
  lounges text,
  transportation text,
  bus_stops text,
  taxi_stands text,
  subway_stations text,
  rest_areas text,
  created_at timestamptz default now()
);

create table if not exists cruise_lines (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  service_charge text,
  drink_package_price text,
  wifi_price text,
  specialty_dining_cost text,
  laundry_price text,
  cruise_tips text,
  created_at timestamptz default now()
);

create table if not exists cruise_ships (
  id uuid primary key default gen_random_uuid(),
  cruise_line_id uuid references cruise_lines(id) on delete cascade,
  name text not null,
  passenger_capacity int,
  service_charge text,
  drink_package_price text,
  wifi_price text,
  specialty_dining_cost text,
  created_at timestamptz default now()
);

create table if not exists cruise_ports (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  country text,
  city text,
  shuttle_buses text,
  bus_stops text,
  meeting_points text,
  taxi_stands text,
  local_warnings text,
  port_maps text,
  created_at timestamptz default now()
);

create table if not exists cruise_terminals (
  id uuid primary key default gen_random_uuid(),
  cruise_port_id uuid references cruise_ports(id) on delete cascade,
  name text not null,
  luggage_drop_location text,
  check_in_counters text,
  security_checkpoint text,
  boarding_gate text,
  luggage_claim text,
  terminal_maps text,
  created_at timestamptz default now()
);

create table if not exists community_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete set null,
  category text not null,
  title text not null,
  body text,
  created_at timestamptz default now()
);

create table if not exists route_briefs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  start_location text,
  end_location text,
  waypoints jsonb,
  maps_url text,
  notes text,
  created_at timestamptz default now()
);

-- Audio POIs for GPS-triggered TTS
create table if not exists audio_pois (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  lat numeric not null,
  lng numeric not null,
  radius_m int default 200,
  messages jsonb not null, -- language -> text
  tags text[],
  active boolean default true,
  created_at timestamptz default now()
);

-- Per-leader audio guide preferences
create table if not exists leader_settings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  language text default 'en-US',
  radius_m int default 200,
  voice text,
  repeat boolean default false,
  created_at timestamptz default now()
);

create unique index if not exists leader_settings_user_id_idx on leader_settings(user_id);
