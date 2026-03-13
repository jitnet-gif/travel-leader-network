#!/usr/bin/env python3
import argparse
import json
import os
import random
import uuid
from datetime import date, timedelta
from pathlib import Path

AIRPORT_BASE = [
    ("ICN", "Incheon International Airport", "Seoul", "South Korea"),
    ("NRT", "Narita International Airport", "Tokyo", "Japan"),
    ("HND", "Tokyo Haneda Airport", "Tokyo", "Japan"),
    ("SIN", "Singapore Changi Airport", "Singapore", "Singapore"),
    ("DXB", "Dubai International Airport", "Dubai", "UAE"),
    ("LAX", "Los Angeles International Airport", "Los Angeles", "USA"),
    ("ATL", "Hartsfield-Jackson Atlanta International Airport", "Atlanta", "USA"),
    ("CDG", "Charles de Gaulle Airport", "Paris", "France"),
    ("LHR", "Heathrow Airport", "London", "UK"),
    ("FRA", "Frankfurt Airport", "Frankfurt", "Germany"),
    ("AMS", "Schiphol Airport", "Amsterdam", "Netherlands"),
    ("SYD", "Sydney Airport", "Sydney", "Australia"),
    ("YYZ", "Toronto Pearson Airport", "Toronto", "Canada"),
    ("YVR", "Vancouver International Airport", "Vancouver", "Canada"),
    ("BKK", "Suvarnabhumi Airport", "Bangkok", "Thailand"),
    ("MNL", "Ninoy Aquino International Airport", "Manila", "Philippines"),
    ("KUL", "Kuala Lumpur International Airport", "Kuala Lumpur", "Malaysia"),
    ("MAD", "Madrid Barajas Airport", "Madrid", "Spain"),
    ("BCN", "Barcelona El Prat Airport", "Barcelona", "Spain"),
    ("IST", "Istanbul Airport", "Istanbul", "Turkey"),
]

CRUISE_LINES = [
    "Royal Caribbean",
    "MSC Cruises",
    "Norwegian Cruise Line",
    "Carnival Cruise Line",
    "Celebrity Cruises",
    "Princess Cruises",
    "Holland America Line",
    "Costa Cruises",
    "Disney Cruise Line",
    "Adora Cruises",
]

SHIPS = [
    "Wonder of the Seas",
    "Icon of the Seas",
    "Symphony of the Seas",
    "Oasis of the Seas",
    "MSC World Europa",
    "MSC Seaside",
    "MSC Grandiosa",
    "Norwegian Prima",
    "Norwegian Viva",
    "Carnival Celebration",
    "Celebrity Beyond",
    "Sky Princess",
    "Koningsdam",
    "Costa Toscana",
    "Disney Wish",
    "Adora Magic City",
]

PORT_CITIES = [
    ("Miami", "United States"),
    ("Barcelona", "Spain"),
    ("Rome", "Italy"),
    ("Athens", "Greece"),
    ("Singapore", "Singapore"),
    ("Dubai", "United Arab Emirates"),
    ("Tokyo", "Japan"),
    ("Shanghai", "China"),
    ("Sydney", "Australia"),
    ("Vancouver", "Canada"),
    ("Los Angeles", "United States"),
    ("Seattle", "United States"),
    ("Istanbul", "Turkey"),
    ("Lisbon", "Portugal"),
    ("Copenhagen", "Denmark"),
    ("Stockholm", "Sweden"),
    ("Naples", "Italy"),
    ("Venice", "Italy"),
    ("Hong Kong", "Hong Kong"),
]

ITINERARY_CITIES = [
    "Tokyo",
    "Seoul",
    "Singapore",
    "Bangkok",
    "Rome",
    "Paris",
    "Barcelona",
    "Los Angeles",
    "Vancouver",
    "Sydney",
    "Istanbul",
    "Athens",
]

JOB_COUNTRIES = [
    "Japan",
    "South Korea",
    "Singapore",
    "Thailand",
    "Italy",
    "France",
    "Spain",
    "United States",
    "Canada",
    "Australia",
    "Turkey",
    "Greece",
]

AGENCIES = [
    "Global Travel Agency",
    "Aurora Travel Group",
    "Blue Harbor Cruises",
    "Summit Expeditions",
    "Skyline Journeys",
    "Pacific Gate Travels",
]

JOB_TITLE_TEMPLATES = [
    "{country} Tour Leader",
    "{country} Spring Tour Leader",
    "{country} City Escort",
    "{country} Cruise Escort",
]

JOB_DESCRIPTIONS = [
    "Lead a multi-city itinerary and manage daily guest logistics.",
    "Coordinate embarkation, shore excursions, and daily briefings.",
    "Guide premium sightseeing tours with cultural highlights and dining.",
    "Manage airport-to-hotel transfers and on-tour communications.",
]

POST_CATEGORIES = [
    "Cruise tips",
    "Airport tips",
    "Emergency cases",
    "Tour stories",
    "Travel updates",
]

POST_SNIPPETS = [
    "Carry passports, printed vouchers, and medication lists together.",
    "Use inter-terminal trains during peak hours to save transfer time.",
    "File a police report before embassy visits and keep guest copies.",
    "Confirm meet-up points 15 minutes before departure windows.",
    "Review local customs and tipping practices with the group.",
]

POST_AUTHORS = [
    "Hana Lee",
    "Miguel Santos",
    "Aiko Tanaka",
    "Jin Park",
    "Elena Rossi",
    "Noah Chen",
]

COUNTRY_NAMES = [
    "Japan",
    "Philippines",
    "Singapore",
    "United Arab Emirates",
    "United Kingdom",
    "France",
    "Germany",
    "United States",
    "Canada",
    "Australia",
    "South Korea",
    "Thailand",
    "Vietnam",
    "Malaysia",
    "Indonesia",
    "Spain",
    "Italy",
    "Greece",
    "Turkey",
    "Mexico",
    "Brazil",
    "Argentina",
    "Chile",
    "South Africa",
    "Egypt",
    "Kenya",
    "India",
    "China",
    "Taiwan",
    "Hong Kong",
    "New Zealand",
    "Norway",
    "Sweden",
    "Denmark",
    "Netherlands",
    "Belgium",
    "Switzerland",
    "Austria",
    "Portugal",
    "Czech Republic",
    "Poland",
    "Croatia",
    "Ireland",
    "Iceland",
    "Finland",
    "Peru",
    "Colombia",
    "Panama",
    "Qatar",
    "Saudi Arabia",
    "Israel",
    "Morocco",
    "Tunisia",
    "Algeria",
    "Nigeria",
    "Ghana",
    "Tanzania",
    "Uganda",
    "Rwanda",
    "Ethiopia",
    "Pakistan",
    "Bangladesh",
    "Sri Lanka",
    "Nepal",
    "Bhutan",
    "Myanmar",
    "Cambodia",
    "Laos",
    "Mongolia",
    "Kazakhstan",
    "Uzbekistan",
    "Georgia",
    "Armenia",
    "Azerbaijan",
    "Romania",
    "Bulgaria",
    "Serbia",
    "Hungary",
    "Slovakia",
    "Slovenia",
    "Lithuania",
    "Latvia",
    "Estonia",
    "Luxembourg",
    "Malta",
    "Cyprus",
    "Bahamas",
    "Jamaica",
    "Dominican Republic",
    "Puerto Rico",
    "Costa Rica",
    "Guatemala",
    "Honduras",
    "El Salvador",
    "Nicaragua",
    "Belize",
    "Uruguay",
    "Paraguay",
    "Bolivia",
    "Venezuela",
]

EMERGENCY_NUMBERS = ["112", "911", "999", "110", "118", "119"]

CRUISE_LINE_COUNTRIES = {
    "Royal Caribbean": "United States",
    "MSC Cruises": "Switzerland",
    "Norwegian Cruise Line": "United States",
    "Carnival Cruise Line": "United States",
    "Celebrity Cruises": "United States",
    "Princess Cruises": "United States",
    "Holland America Line": "United States",
    "Costa Cruises": "Italy",
    "Disney Cruise Line": "United States",
    "Adora Cruises": "China",
}

USER_FIRST_NAMES = [
    "Alex",
    "Jamie",
    "Jordan",
    "Taylor",
    "Morgan",
    "Casey",
    "Riley",
    "Avery",
    "Hayden",
    "Reese",
    "Logan",
    "Parker",
    "Drew",
    "Quinn",
    "Cameron",
    "Skylar",
    "Blake",
    "Dakota",
]

USER_LAST_NAMES = [
    "Kim",
    "Lee",
    "Park",
    "Choi",
    "Garcia",
    "Martinez",
    "Santos",
    "Nguyen",
    "Patel",
    "Singh",
    "Khan",
    "Chen",
    "Liu",
    "Wong",
    "Johnson",
    "Williams",
    "Brown",
    "Davis",
]

LANGUAGE_POOL = ["English", "Korean", "Japanese", "Spanish", "French", "Chinese", "German"]

SHUTTLE_NOTES = [
    "Shuttle every 20 minutes to city center.",
    "Port shuttle to main transit hub.",
    "Complimentary shuttle to downtown drop-off.",
]

TAXI_NOTES = [
    "Taxi stands outside main terminal exit.",
    "Official taxi rank at Gate B arrivals.",
    "Metered taxis at cruise terminal curb.",
]

MEETING_POINTS = [
    "Main terminal gate",
    "Arrivals hall information desk",
    "Terminal B arrivals gate",
    "Pier entrance signage",
]

SAFETY_ALERTS = [
    None,
    "Heavy traffic expected during weekends.",
    "Pickpocketing reported near port gates.",
    "Roadworks near terminal access road.",
]

DEFAULT_ITINERARY_ACTIVITIES = [
    "City tour",
    "Local food experience",
    "Landmark visit",
    "Shopping time",
]

BASE_JOB_DATE = date(2026, 4, 1)
BASE_POST_DATE = date(2026, 3, 11)

SCHEMA_SQL = """
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
""".strip()


def generate_airports(count: int) -> list[dict]:
    airports = []
    for i in range(count):
        code, name, city, country = random.choice(AIRPORT_BASE)
        airports.append(
            {
                "id": i + 1,
                "iata": code,
                "name": name,
                "city": city,
                "country": country,
                "terminals": random.randint(1, 5),
                "smoking_area": random.choice([True, False]),
                "lounge": True,
                "taxi": True,
                "bus": True,
                "subway": random.choice([True, False]),
            }
        )
    return airports


def generate_cruise_ships(count: int) -> list[dict]:
    cruise_data = []
    for i in range(count):
        cruise_data.append(
            {
                "id": i + 1,
                "cruise_line": random.choice(CRUISE_LINES),
                "ship_name": f"{random.choice(SHIPS)}-{i}",
                "capacity": random.randint(2000, 7000),
                "service_charge": random.randint(15, 25),
                "wifi_price": random.randint(15, 30),
                "drink_package": random.randint(60, 110),
                "specialty_dining": random.randint(40, 80),
            }
        )
    return cruise_data


def generate_cruise_ports(count: int) -> list[dict]:
    ports = []
    for i in range(count):
        city, country = random.choice(PORT_CITIES)
        ports.append(
            {
                "id": i + 1,
                "name": f"{city} Cruise Port",
                "country": country,
                "shuttle_bus": random.choice([True, False]),
                "taxi": random.choice([True, False]),
                "meeting_point": random.choice(MEETING_POINTS),
            }
        )
    return ports


def generate_itinerary(days: int) -> list[dict]:
    itinerary = []
    for d in range(days):
        city = random.choice(ITINERARY_CITIES)
        itinerary.append(
            {
                "day": d + 1,
                "city": city,
                "activities": list(DEFAULT_ITINERARY_ACTIVITIES),
            }
        )
    return itinerary


def generate_tour_jobs(count: int) -> list[dict]:
    jobs = []
    for i in range(count):
        country = random.choice(JOB_COUNTRIES)
        start_date = BASE_JOB_DATE + timedelta(days=random.randint(0, 240))
        jobs.append(
            {
                "id": i + 1,
                "agency": random.choice(AGENCIES),
                "country": country,
                "tour_date": start_date.isoformat(),
                "salary": random.randint(180, 280),
                "description": random.choice(JOB_DESCRIPTIONS),
            }
        )
    return jobs


def generate_community_posts(count: int) -> list[dict]:
    posts = []
    for i in range(count):
        created_at = BASE_POST_DATE - timedelta(days=random.randint(0, 60))
        posts.append(
            {
                "id": i + 1,
                "title": f"Travel Tip {i + 1}",
                "content": random.choice(POST_SNIPPETS),
                "author": random.choice(POST_AUTHORS),
                "created_at": created_at.isoformat(),
            }
        )
    return posts


def generate_countries(count: int) -> list[dict]:
    names = list(COUNTRY_NAMES)
    if count <= len(names):
        selected = random.sample(names, count)
    else:
        selected = []
        while len(selected) < count:
            selected.extend(names)
        selected = selected[:count]

    countries = []
    for idx, name in enumerate(selected, start=1):
        countries.append(
            {
                "id": idx,
                "name": name,
                "visa_info": "Visa policy varies by nationality.",
                "embassy": f"Embassy of {name} in Capital City",
                "emergency_number": random.choice(EMERGENCY_NUMBERS),
            }
        )
    return countries


def generate_cruise_lines() -> list[dict]:
    lines = []
    for idx, name in enumerate(CRUISE_LINES, start=1):
        lines.append(
            {
                "id": idx,
                "name": name,
                "country": CRUISE_LINE_COUNTRIES.get(name, "United States"),
            }
        )
    return lines


def generate_users(count: int) -> list[dict]:
    users = []
    seen = set()
    roles = ["leader", "leader", "leader", "agency", "admin"]
    while len(users) < count:
        first = random.choice(USER_FIRST_NAMES)
        last = random.choice(USER_LAST_NAMES)
        name = f"{first} {last}"
        if name in seen:
            continue
        seen.add(name)
        language_count = random.randint(1, 3)
        languages = ", ".join(random.sample(LANGUAGE_POOL, language_count))
        users.append(
            {
                "id": str(uuid.uuid4()),
                "name": name,
                "role": random.choice(roles),
                "experience": random.randint(1, 15),
                "languages": languages,
            }
        )
    return users


def write_json(path: Path, data: list[dict]) -> None:
    path.write_text(json.dumps(data, indent=2), encoding="utf-8")


def write_schema(path: Path) -> None:
    path.write_text(SCHEMA_SQL + "\n", encoding="utf-8")


def chunked(items: list[dict], size: int) -> list[list[dict]]:
    return [items[i : i + size] for i in range(0, len(items), size)]


def strip_id(record: dict) -> dict:
    return {key: value for key, value in record.items() if key != "id"}


def normalize_date(value):
    if value is None:
        return None
    if isinstance(value, str):
        return value[:10]
    return str(value)[:10]


def key_airport(record: dict) -> tuple:
    return (
        record.get("iata"),
        record.get("name"),
        record.get("city"),
        record.get("country"),
    )


def key_cruise_ship(record: dict) -> tuple:
    ship_name = record.get("ship_name") or record.get("ship")
    return (ship_name, record.get("cruise_line"))


def key_cruise_port(record: dict) -> tuple:
    return (record.get("name"), record.get("country"))


def key_tour_job(record: dict) -> tuple:
    return (
        record.get("agency"),
        record.get("country"),
        normalize_date(record.get("tour_date")),
        record.get("description"),
    )


def key_community_post(record: dict) -> tuple:
    return (
        record.get("title"),
        record.get("author"),
        normalize_date(record.get("created_at")),
    )


def key_country(record: dict) -> tuple:
    return (record.get("name"),)


def key_cruise_line(record: dict) -> tuple:
    return (record.get("name"),)


def key_user(record: dict) -> tuple:
    return (
        record.get("name"),
        record.get("role"),
        record.get("languages"),
    )


def fetch_existing_keys(client, table: str, columns: list[str], key_fn, page_size: int = 1000) -> set:
    existing = set()
    offset = 0
    while True:
        resp = client.table(table).select(",".join(columns)).range(offset, offset + page_size - 1).execute()
        rows = resp.data or []
        for row in rows:
            existing.add(key_fn(row))
        if len(rows) < page_size:
            break
        offset += page_size
    return existing


def filter_missing(records: list[dict], existing_keys: set, key_fn) -> list[dict]:
    filtered = []
    seen = set()
    for record in records:
        key = key_fn(record)
        if key in existing_keys or key in seen:
            continue
        filtered.append(strip_id(record))
        seen.add(key)
    return filtered


def upload_to_supabase(
    out_dir: Path,
    chunk_size: int,
    basic_only: bool = False,
    extras_only: bool = False,
    only_missing: bool = False,
) -> None:
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_KEY")
    if not url or not key:
        raise RuntimeError("Missing SUPABASE_URL or SUPABASE_KEY.")

    try:
        from supabase import create_client
    except Exception as exc:
        raise RuntimeError("Missing supabase package. Install with: pip install supabase") from exc

    client = create_client(url, key)

    def upload_records(
        table: str,
        records: list[dict],
        key_fn,
        columns: list[str],
        keep_id: bool = False,
    ) -> None:
        if not records:
            print(f"{table}: no records to upload")
            return
        if only_missing:
            existing = fetch_existing_keys(client, table, columns, key_fn)
            filtered = []
            seen = set()
            for record in records:
                key = key_fn(record)
                if key in existing or key in seen:
                    continue
                filtered.append(record if keep_id else strip_id(record))
                seen.add(key)
            records = filtered
            if not records:
                print(f"{table}: no missing records")
                return
        else:
            records = records if keep_id else [strip_id(record) for record in records]

        for idx, batch in enumerate(chunked(records, chunk_size), start=1):
            client.table(table).insert(batch).execute()
            print(f"{table} uploaded: batch {idx}/{(len(records) - 1) // chunk_size + 1}")

    if not extras_only:
        airports = json.loads((out_dir / "airports_500.json").read_text(encoding="utf-8"))
        ships = json.loads((out_dir / "cruise_ships_300.json").read_text(encoding="utf-8"))
        upload_records("airports", airports, key_airport, ["iata", "name", "city", "country"])
        upload_records("cruise_ships", ships, key_cruise_ship, ["ship_name", "cruise_line"])

    if basic_only:
        return

    ports_path = out_dir / "cruise_ports_400.json"
    jobs_path = out_dir / "tour_jobs.json"
    posts_path = out_dir / "community_posts.json"
    countries_path = out_dir / "countries.json"
    cruise_lines_path = out_dir / "cruise_lines.json"
    users_path = out_dir / "users.json"

    if countries_path.exists():
        countries = json.loads(countries_path.read_text(encoding="utf-8"))
        upload_records("countries", countries, key_country, ["name"])

    if cruise_lines_path.exists():
        cruise_lines = json.loads(cruise_lines_path.read_text(encoding="utf-8"))
        upload_records("cruise_lines", cruise_lines, key_cruise_line, ["name"])

    if users_path.exists():
        users = json.loads(users_path.read_text(encoding="utf-8"))
        upload_records(
            "users",
            users,
            key_user,
            ["name", "role", "languages"],
            keep_id=True,
        )

    if ports_path.exists():
        ports = json.loads(ports_path.read_text(encoding="utf-8"))
        upload_records("cruise_ports", ports, key_cruise_port, ["name", "country"])

    if jobs_path.exists():
        jobs = json.loads(jobs_path.read_text(encoding="utf-8"))
        upload_records(
            "tour_jobs",
            jobs,
            key_tour_job,
            ["agency", "country", "tour_date", "description"],
        )

    if posts_path.exists():
        posts = json.loads(posts_path.read_text(encoding="utf-8"))
        upload_records(
            "community_posts",
            posts,
            key_community_post,
            ["title", "author", "created_at"],
        )


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Generate seed JSON and schema for Supabase, optionally upload data."
    )
    parser.add_argument("--out-dir", default=str(Path(__file__).resolve().parent))
    parser.add_argument("--airports", type=int, default=500)
    parser.add_argument("--ships", type=int, default=300)
    parser.add_argument("--ports", type=int, default=400)
    parser.add_argument("--jobs", type=int, default=50)
    parser.add_argument("--posts", type=int, default=100)
    parser.add_argument("--itinerary-days", type=int, default=7)
    parser.add_argument("--countries", type=int, default=80)
    parser.add_argument("--users", type=int, default=30)
    parser.add_argument("--basic", action="store_true", default=False)
    parser.add_argument("--extras-only", action="store_true", default=False)
    parser.add_argument("--only-missing", action="store_true", default=False)
    parser.add_argument("--use-existing", action="store_true", default=False)
    parser.add_argument("--seed", type=int, default=None)
    parser.add_argument("--write-schema", action="store_true", default=True)
    parser.add_argument("--upload", action="store_true", default=False)
    parser.add_argument("--chunk-size", type=int, default=100)
    args = parser.parse_args()

    if args.seed is not None and not args.use_existing:
        random.seed(args.seed)

    out_dir = Path(args.out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    if args.basic and args.extras_only:
        raise SystemExit("Cannot use --basic and --extras-only together.")

    def ensure_json(path: Path, generator, *args) -> None:
        if path.exists():
            return
        data = generator(*args)
        write_json(path, data)
        print(f"{path.name} created")

    if not args.extras_only:
        if args.use_existing:
            ensure_json(out_dir / "airports_500.json", generate_airports, args.airports)
            ensure_json(out_dir / "cruise_ships_300.json", generate_cruise_ships, args.ships)
        else:
            airports = generate_airports(args.airports)
            ships = generate_cruise_ships(args.ships)

            write_json(out_dir / "airports_500.json", airports)
            write_json(out_dir / "cruise_ships_300.json", ships)

    if not args.basic:
        if args.use_existing:
            ensure_json(out_dir / "cruise_ports_400.json", generate_cruise_ports, args.ports)
            ensure_json(out_dir / "tour_jobs.json", generate_tour_jobs, args.jobs)
            ensure_json(out_dir / "community_posts.json", generate_community_posts, args.posts)
            ensure_json(out_dir / "countries.json", generate_countries, args.countries)
            ensure_json(out_dir / "cruise_lines.json", generate_cruise_lines)
            ensure_json(out_dir / "users.json", generate_users, args.users)
        else:
            ports = generate_cruise_ports(args.ports)
            jobs = generate_tour_jobs(args.jobs)
            posts = generate_community_posts(args.posts)
            itinerary = generate_itinerary(args.itinerary_days)
            countries = generate_countries(args.countries)
            cruise_lines = generate_cruise_lines()
            users = generate_users(args.users)

            write_json(out_dir / "cruise_ports_400.json", ports)
            write_json(out_dir / "tour_jobs.json", jobs)
            write_json(out_dir / "community_posts.json", posts)
            write_json(out_dir / "sample_itinerary.json", itinerary)
            write_json(out_dir / "countries.json", countries)
            write_json(out_dir / "cruise_lines.json", cruise_lines)
            write_json(out_dir / "users.json", users)

    if args.write_schema:
        write_schema(out_dir / "supabase_schema.sql")

    if not args.extras_only and not args.use_existing:
        print("airports_500.json created")
        print("cruise_ships_300.json created")
    if not args.basic and not args.use_existing:
        print("cruise_ports_400.json created")
        print("tour_jobs.json created")
        print("community_posts.json created")
        print("sample_itinerary.json created")
        print("countries.json created")
        print("cruise_lines.json created")
        print("users.json created")
    if args.write_schema:
        print("supabase_schema.sql created")

    if args.upload:
        upload_to_supabase(
            out_dir,
            args.chunk_size,
            basic_only=args.basic,
            extras_only=args.extras_only,
            only_missing=args.only_missing,
        )
        print("Supabase upload complete")


if __name__ == "__main__":
    main()
