CREATE TABLE IF NOT EXISTS countries (
id SERIAL PRIMARY KEY,
name TEXT,
visa_info TEXT,
embassy TEXT,
emergency_number TEXT
);

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

CREATE TABLE IF NOT EXISTS cruise_lines (
id SERIAL PRIMARY KEY,
name TEXT,
country TEXT
);

CREATE TABLE IF NOT EXISTS cruise_ships (
id SERIAL PRIMARY KEY,
cruise_line TEXT,
ship_name TEXT,
capacity INT,
service_charge INT,
wifi_price INT,
drink_package INT,
specialty_dining INT
);

CREATE TABLE IF NOT EXISTS cruise_ports (
id SERIAL PRIMARY KEY,
name TEXT,
country TEXT,
shuttle_bus BOOLEAN,
taxi BOOLEAN,
meeting_point TEXT
);

CREATE TABLE IF NOT EXISTS users (
id UUID PRIMARY KEY,
name TEXT,
role TEXT,
experience INT,
languages TEXT
);

CREATE TABLE IF NOT EXISTS tour_jobs (
id SERIAL PRIMARY KEY,
agency TEXT,
country TEXT,
tour_date DATE,
salary INT,
description TEXT
);

CREATE TABLE IF NOT EXISTS community_posts (
id SERIAL PRIMARY KEY,
title TEXT,
content TEXT,
author TEXT,
created_at TIMESTAMP DEFAULT NOW()
);
