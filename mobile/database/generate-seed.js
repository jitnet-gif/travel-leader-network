const fs = require('fs');

let seed = 42;
const rand = () => {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return seed / 4294967296;
};

const pick = (arr) => arr[Math.floor(rand() * arr.length)];
const esc = (value) => String(value).replace(/'/g, "''");

const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const reservedCodes = new Set(['NRT','ICN','SIN','DXB','LHR','CDG','FRA','LAX','JFK','HKG']);
const usedCodes = new Set(reservedCodes);

const codeFromIndex = (n) => {
  const a = letters[Math.floor(n / (26 * 26)) % 26];
  const b = letters[Math.floor(n / 26) % 26];
  const c = letters[n % 26];
  return `${a}${b}${c}`;
};

let codeIndex = 0;
const nextCode = () => {
  while (codeIndex < 26 * 26 * 26) {
    const code = codeFromIndex(codeIndex++);
    if (!usedCodes.has(code)) {
      usedCodes.add(code);
      return code;
    }
  }
  return 'ZZZ';
};

const sql = [];
sql.push('-- Auto-generated seed data for Travel Leader Network');
sql.push('begin;');
sql.push('truncate table route_briefs, cruise_ships, cruise_terminals, cruise_ports, cruise_lines, airports, embassies, countries, tour_applications, tour_jobs, agencies, community_posts, users restart identity cascade;');

const countries = [
  'Japan','Philippines','Singapore','United Arab Emirates','United Kingdom','France','Germany','United States','Canada','Australia',
  'South Korea','Thailand','Vietnam','Malaysia','Indonesia','Spain','Italy','Greece','Turkey','Mexico','Brazil','Argentina','Chile',
  'South Africa','Egypt','Kenya','India','China','Taiwan','Hong Kong','New Zealand','Norway','Sweden','Denmark','Netherlands',
  'Belgium','Switzerland','Austria','Portugal','Czech Republic','Poland','Croatia','Ireland','Iceland','Finland','Peru','Colombia',
  'Panama','Qatar','Saudi Arabia','Israel','Morocco','Tunisia','Algeria','Nigeria','Ghana','Tanzania','Uganda','Rwanda','Ethiopia',
  'Pakistan','Bangladesh','Sri Lanka','Nepal','Bhutan','Myanmar','Cambodia','Laos','Mongolia','Kazakhstan','Uzbekistan','Georgia',
  'Armenia','Azerbaijan','Romania','Bulgaria','Serbia','Hungary','Slovakia','Slovenia','Lithuania','Latvia','Estonia','Luxembourg',
  'Malta','Cyprus','Bahamas','Jamaica','Dominican Republic','Puerto Rico','Costa Rica','Guatemala','Honduras','El Salvador',
  'Nicaragua','Belize','Uruguay','Paraguay','Bolivia','Venezuela'
];

sql.push('insert into countries (name, iso_code, visa_requirements, entry_forms, immigration_tips, prohibited_items, emergency_numbers) values');
const countryRows = countries.map((name, idx) => {
  const iso = name.slice(0, 2).toUpperCase();
  return `('${esc(name)}','${esc(iso)}','Visa policy varies by nationality.','Online entry form required for most arrivals.','Carry hotel booking and onward ticket.','Weapons, narcotics, and restricted agricultural items.','Police 112, Ambulance 112')`;
});
sql.push(countryRows.join(',\n') + ';');

sql.push('insert into embassies (country_id, name, address, phone, email, lat, lng) values');
const embassyRows = countries.map((country, idx) => {
  const phone = `+1-202-55${String(idx).padStart(2, '0')}-${String(100 + (idx % 900))}`;
  const email = `embassy-${country.toLowerCase().replace(/\\s+/g, '-') }@tln.example.com`;
  const lat = (rand() * 120 - 60).toFixed(3);
  const lng = (rand() * 340 - 170).toFixed(3);
  const address = `1 Embassy Way, ${country} City`;
  const name = `Embassy in ${country} City`;
  return `((select id from countries where name='${esc(country)}'),'${esc(name)}','${esc(address)}','${esc(phone)}','${esc(email)}',${lat},${lng})`;
});

sql.push(embassyRows.join(',\n') + ';');

const airportExamples = [
  { name: 'Tokyo Narita International Airport', iata: 'NRT', city: 'Tokyo', country: 'Japan' },
  { name: 'Seoul Incheon International Airport', iata: 'ICN', city: 'Incheon', country: 'South Korea' },
  { name: 'Singapore Changi Airport', iata: 'SIN', city: 'Singapore', country: 'Singapore' },
  { name: 'Dubai International Airport', iata: 'DXB', city: 'Dubai', country: 'United Arab Emirates' },
  { name: 'London Heathrow Airport', iata: 'LHR', city: 'London', country: 'United Kingdom' },
  { name: 'Paris Charles de Gaulle Airport', iata: 'CDG', city: 'Paris', country: 'France' },
  { name: 'Frankfurt Airport', iata: 'FRA', city: 'Frankfurt', country: 'Germany' },
  { name: 'Los Angeles International Airport', iata: 'LAX', city: 'Los Angeles', country: 'United States' },
  { name: 'John F. Kennedy International Airport', iata: 'JFK', city: 'New York', country: 'United States' },
  { name: 'Hong Kong International Airport', iata: 'HKG', city: 'Hong Kong', country: 'Hong Kong' }
];

const cityPool = [
  { city: 'Sydney', country: 'Australia' },
  { city: 'Melbourne', country: 'Australia' },
  { city: 'Auckland', country: 'New Zealand' },
  { city: 'Osaka', country: 'Japan' },
  { city: 'Fukuoka', country: 'Japan' },
  { city: 'Bangkok', country: 'Thailand' },
  { city: 'Phuket', country: 'Thailand' },
  { city: 'Hanoi', country: 'Vietnam' },
  { city: 'Ho Chi Minh City', country: 'Vietnam' },
  { city: 'Kuala Lumpur', country: 'Malaysia' },
  { city: 'Jakarta', country: 'Indonesia' },
  { city: 'Bali', country: 'Indonesia' },
  { city: 'Madrid', country: 'Spain' },
  { city: 'Barcelona', country: 'Spain' },
  { city: 'Rome', country: 'Italy' },
  { city: 'Milan', country: 'Italy' },
  { city: 'Athens', country: 'Greece' },
  { city: 'Istanbul', country: 'Turkey' },
  { city: 'Lisbon', country: 'Portugal' },
  { city: 'Amsterdam', country: 'Netherlands' },
  { city: 'Brussels', country: 'Belgium' },
  { city: 'Zurich', country: 'Switzerland' },
  { city: 'Vienna', country: 'Austria' },
  { city: 'Prague', country: 'Czech Republic' },
  { city: 'Warsaw', country: 'Poland' },
  { city: 'Copenhagen', country: 'Denmark' },
  { city: 'Stockholm', country: 'Sweden' },
  { city: 'Oslo', country: 'Norway' },
  { city: 'Dublin', country: 'Ireland' },
  { city: 'Reykjavik', country: 'Iceland' },
  { city: 'Helsinki', country: 'Finland' },
  { city: 'Cape Town', country: 'South Africa' },
  { city: 'Johannesburg', country: 'South Africa' },
  { city: 'Cairo', country: 'Egypt' },
  { city: 'Nairobi', country: 'Kenya' },
  { city: 'Delhi', country: 'India' },
  { city: 'Mumbai', country: 'India' },
  { city: 'Beijing', country: 'China' },
  { city: 'Shanghai', country: 'China' },
  { city: 'Taipei', country: 'Taiwan' },
  { city: 'Manila', country: 'Philippines' },
  { city: 'Cebu', country: 'Philippines' },
  { city: 'Vancouver', country: 'Canada' },
  { city: 'Toronto', country: 'Canada' },
  { city: 'Mexico City', country: 'Mexico' },
  { city: 'Cancun', country: 'Mexico' },
  { city: 'Sao Paulo', country: 'Brazil' },
  { city: 'Rio de Janeiro', country: 'Brazil' },
  { city: 'Buenos Aires', country: 'Argentina' },
  { city: 'Santiago', country: 'Chile' },
  { city: 'Lima', country: 'Peru' },
  { city: 'Bogota', country: 'Colombia' },
  { city: 'Panama City', country: 'Panama' },
  { city: 'Honolulu', country: 'United States' },
  { city: 'Anchorage', country: 'United States' },
  { city: 'Las Vegas', country: 'United States' },
  { city: 'Chicago', country: 'United States' },
  { city: 'Boston', country: 'United States' },
  { city: 'Montreal', country: 'Canada' },
  { city: 'Ottawa', country: 'Canada' },
  { city: 'Doha', country: 'Qatar' },
  { city: 'Riyadh', country: 'Saudi Arabia' },
  { city: 'Jeddah', country: 'Saudi Arabia' },
  { city: 'Tel Aviv', country: 'Israel' },
  { city: 'Wellington', country: 'New Zealand' }
];

const airports = [];
airportExamples.forEach((a) => airports.push({
  name: a.name,
  iata: a.iata,
  city: a.city,
  country: a.country
}));

const airportNameVariants = [
  'International Airport',
  'Gateway Airport',
  'Metropolitan Airport',
  'Skyport',
  'Aero Terminal'
];

while (airports.length < 500) {
  const entry = cityPool[airports.length % cityPool.length];
  const name = `${entry.city} ${pick(airportNameVariants)}`;
  const iata = nextCode();
  airports.push({ name, iata, city: entry.city, country: entry.country });
}

sql.push('insert into airports (name, iata_code, city, country, terminal_info, terminal_maps, smoking_areas, lounges, transportation, bus_stops, taxi_stands, subway_stations, rest_areas) values');
const airportRows = airports.map((a, idx) => {
  const terminalInfo = `Terminal ${((idx % 3) + 1)} main concourse with international connections.`;
  const terminalMaps = 'Terminal maps available at info desks and website.';
  const smoking = `Designated smoking rooms near gates ${((idx % 6) + 1)}A-${((idx % 6) + 1)}C.`;
  const lounges = `Premium lounge near Gate ${((idx % 8) + 2)} and business lounge in main hall.`;
  const transport = 'Rail link, airport bus, and taxi services.';
  const busStops = `Bus stops at arrivals curb zone ${((idx % 4) + 1)}.`;
  const taxi = 'Metered taxi stand outside arrivals.';
  const subway = idx % 2 === 0 ? 'Subway station connected to Terminal 1.' : 'No direct subway; connect via rail shuttle.';
  const rest = 'Quiet rest area near Gate B and day rooms in Terminal 2.';
  return `('${esc(a.name)}','${esc(a.iata)}','${esc(a.city)}','${esc(a.country)}','${esc(terminalInfo)}','${esc(terminalMaps)}','${esc(smoking)}','${esc(lounges)}','${esc(transport)}','${esc(busStops)}','${esc(taxi)}','${esc(subway)}','${esc(rest)}')`;
});
sql.push(airportRows.join(',\n') + ';');

const cruiseLines = [
  { name: 'Royal Caribbean', service: '$18/day', drink: '$79/day', wifi: '$25/day', dining: '$45 per meal', laundry: '$30 per bag', tips: 'Pre-book dining and shore excursions.' },
  { name: 'MSC Cruises', service: '$16/day', drink: '$69/day', wifi: '$22/day', dining: '$39 per meal', laundry: '$28 per bag', tips: 'Check daily schedule on the app.' },
  { name: 'Costa Cruises', service: '$15/day', drink: '$65/day', wifi: '$20/day', dining: '$35 per meal', laundry: '$25 per bag', tips: 'Arrive early for theater seating.' },
  { name: 'Norwegian Cruise Line', service: '$20/day', drink: '$85/day', wifi: '$28/day', dining: '$49 per meal', laundry: '$32 per bag', tips: 'Reserve specialty dining before sailing.' },
  { name: 'Celebrity Cruises', service: '$19/day', drink: '$80/day', wifi: '$26/day', dining: '$48 per meal', laundry: '$30 per bag', tips: 'Use concierge for priority bookings.' },
  { name: 'Princess Cruises', service: '$17/day', drink: '$70/day', wifi: '$24/day', dining: '$42 per meal', laundry: '$29 per bag', tips: 'Use Medallion app for dining.' },
  { name: 'Carnival Cruise Line', service: '$16/day', drink: '$68/day', wifi: '$21/day', dining: '$38 per meal', laundry: '$26 per bag', tips: 'Verify muster drill time on day 1.' },
  { name: 'Holland America', service: '$17/day', drink: '$72/day', wifi: '$23/day', dining: '$44 per meal', laundry: '$31 per bag', tips: 'Plan port talks for guests.' },
  { name: 'Disney Cruise Line', service: '$20/day', drink: '$82/day', wifi: '$27/day', dining: '$50 per meal', laundry: '$34 per bag', tips: 'Coordinate character meet-up timing.' }
];

sql.push('insert into cruise_lines (name, service_charge, drink_package_price, wifi_price, specialty_dining_cost, laundry_price, cruise_tips) values');
const cruiseLineRows = cruiseLines.map((c) => `('${esc(c.name)}','${esc(c.service)}','${esc(c.drink)}','${esc(c.wifi)}','${esc(c.dining)}','${esc(c.laundry)}','${esc(c.tips)}')`);
sql.push(cruiseLineRows.join(',\n') + ';');

const shipAdjectives = ['Ocean', 'Sea', 'Voyager', 'Harmony', 'Majestic', 'Celestial', 'Aurora', 'Navigator', 'Odyssey', 'Serenity', 'Radiance', 'Liberty', 'Crown', 'Eclipse', 'Summit', 'Dream', 'Vista', 'Spirit'];
const shipNouns = ['Star', 'Wave', 'Spirit', 'Pearl', 'Legend', 'Sky', 'Horizon', 'Breeze', 'Mirage', 'Explorer', 'Crown', 'Splendor'];

const ships = [];
let shipCount = 0;
while (shipCount < 300) {
  const line = cruiseLines[shipCount % cruiseLines.length];
  const name = `${pick(shipAdjectives)} ${pick(shipNouns)} ${shipCount + 1}`;
  const capacity = Math.floor(2000 + rand() * 4500);
  ships.push({
    line: line.name,
    name,
    capacity,
    service: line.service,
    drink: line.drink,
    wifi: line.wifi,
    dining: line.dining
  });
  shipCount += 1;
}

sql.push('insert into cruise_ships (cruise_line_id, name, passenger_capacity, service_charge, drink_package_price, wifi_price, specialty_dining_cost) values');
const shipRows = ships.map((s) => `((select id from cruise_lines where name='${esc(s.line)}'),'${esc(s.name)}',${s.capacity},'${esc(s.service)}','${esc(s.drink)}','${esc(s.wifi)}','${esc(s.dining)}')`);
sql.push(shipRows.join(',\n') + ';');

const portCities = [
  { city: 'Yokohama', country: 'Japan' },
  { city: 'Osaka', country: 'Japan' },
  { city: 'Kobe', country: 'Japan' },
  { city: 'Manila', country: 'Philippines' },
  { city: 'Cebu', country: 'Philippines' },
  { city: 'Singapore', country: 'Singapore' },
  { city: 'Shanghai', country: 'China' },
  { city: 'Hong Kong', country: 'Hong Kong' },
  { city: 'Ho Chi Minh City', country: 'Vietnam' },
  { city: 'Bangkok', country: 'Thailand' },
  { city: 'Phuket', country: 'Thailand' },
  { city: 'Sydney', country: 'Australia' },
  { city: 'Melbourne', country: 'Australia' },
  { city: 'Auckland', country: 'New Zealand' },
  { city: 'Dubai', country: 'United Arab Emirates' },
  { city: 'Doha', country: 'Qatar' },
  { city: 'Istanbul', country: 'Turkey' },
  { city: 'Athens', country: 'Greece' },
  { city: 'Barcelona', country: 'Spain' },
  { city: 'Rome', country: 'Italy' },
  { city: 'Venice', country: 'Italy' },
  { city: 'Lisbon', country: 'Portugal' },
  { city: 'London', country: 'United Kingdom' },
  { city: 'Southampton', country: 'United Kingdom' },
  { city: 'Hamburg', country: 'Germany' },
  { city: 'Copenhagen', country: 'Denmark' },
  { city: 'Stockholm', country: 'Sweden' },
  { city: 'Oslo', country: 'Norway' },
  { city: 'Reykjavik', country: 'Iceland' },
  { city: 'Miami', country: 'United States' },
  { city: 'Fort Lauderdale', country: 'United States' },
  { city: 'Los Angeles', country: 'United States' },
  { city: 'San Francisco', country: 'United States' },
  { city: 'Seattle', country: 'United States' },
  { city: 'Vancouver', country: 'Canada' },
  { city: 'Montreal', country: 'Canada' },
  { city: 'Mexico City', country: 'Mexico' },
  { city: 'Cancun', country: 'Mexico' },
  { city: 'Havana', country: 'Cuba' },
  { city: 'Kingston', country: 'Jamaica' },
  { city: 'Nassau', country: 'Bahamas' },
  { city: 'Rio de Janeiro', country: 'Brazil' },
  { city: 'Buenos Aires', country: 'Argentina' },
  { city: 'Cape Town', country: 'South Africa' },
  { city: 'Durban', country: 'South Africa' },
  { city: 'Cairo', country: 'Egypt' },
  { city: 'Casablanca', country: 'Morocco' },
  { city: 'Alesund', country: 'Norway' },
  { city: 'Kotor', country: 'Montenegro' },
  { city: 'Split', country: 'Croatia' },
  { city: 'Dubrovnik', country: 'Croatia' }
];

const ports = [];
while (ports.length < 500) {
  const entry = portCities[ports.length % portCities.length];
  ports.push({
    name: `Port of ${entry.city}`,
    city: entry.city,
    country: entry.country,
    shuttle: `Shuttle bus pickup at Gate ${((ports.length % 5) + 1)}.`,
    busStops: `Bus stop near Terminal ${((ports.length % 3) + 1)}.`,
    meeting: `Meeting point: Arrivals Hall ${((ports.length % 4) + 1)}.`,
    taxi: `Taxi stand outside Gate ${((ports.length % 6) + 1)}.`,
    warn: ports.length % 4 === 0 ? 'Watch for heavy traffic during peak hours.' : 'Keep groups together in busy areas.',
    maps: 'Port maps available at the information desk.'
  });
}

sql.push('insert into cruise_ports (name, country, city, shuttle_buses, bus_stops, meeting_points, taxi_stands, local_warnings, port_maps) values');
const portRows = ports.map((p) => `('${esc(p.name)}','${esc(p.country)}','${esc(p.city)}','${esc(p.shuttle)}','${esc(p.busStops)}','${esc(p.meeting)}','${esc(p.taxi)}','${esc(p.warn)}','${esc(p.maps)}')`);
sql.push(portRows.join(',\n') + ';');

const terminals = [
  { port: 'Port of Yokohama', name: 'Osanbashi Terminal', luggage: 'Level 1 west side', checkin: 'Level 2 counters A-D', security: 'Level 2 security lanes', gate: 'Gate 3-5', claim: 'Level 1 carousel', maps: 'Terminal map boards near escalators.' },
  { port: 'Port of Manila', name: 'South Harbor Terminal 2', luggage: 'Ground floor bay 4', checkin: 'Second floor counters 1-6', security: 'Second floor lane B', gate: 'Gate 2', claim: 'Ground floor claim area', maps: 'Printed maps at help desk.' }
];

sql.push('insert into cruise_terminals (cruise_port_id, name, luggage_drop_location, check_in_counters, security_checkpoint, boarding_gate, luggage_claim, terminal_maps) values');
const terminalRows = terminals.map((t) => `((select id from cruise_ports where name='${esc(t.port)}'),'${esc(t.name)}','${esc(t.luggage)}','${esc(t.checkin)}','${esc(t.security)}','${esc(t.gate)}','${esc(t.claim)}','${esc(t.maps)}')`);
sql.push(terminalRows.join(',\n') + ';');

const agencies = Array.from({ length: 20 }).map((_, idx) => ({
  name: `Agency ${idx + 1} Travel Group`,
  description: 'International tour operator focused on leader support.',
  website: `https://agency${idx + 1}.example.com`,
  email: `ops${idx + 1}@agency${idx + 1}.example.com`,
  phone: `+1-555-01${String(idx + 1).padStart(2, '0')}`,
  location: pick(['Seattle, WA','Manila, PH','Singapore','London, UK','Sydney, AU','Toronto, CA','Dubai, UAE'])
}));

sql.push('insert into agencies (name, description, website, contact_email, contact_phone, location) values');
const agencyRows = agencies.map((a) => `('${esc(a.name)}','${esc(a.description)}','${esc(a.website)}','${esc(a.email)}','${esc(a.phone)}','${esc(a.location)}')`);
sql.push(agencyRows.join(',\n') + ';');

const jobs = Array.from({ length: 50 }).map((_, idx) => ({
  agency: agencies[idx % agencies.length].name,
  title: `Tour Leader Assignment ${idx + 1}`,
  description: 'Lead multi-city itinerary and manage group operations.',
  destination: pick(countries),
  start: `2026-${String((idx % 9) + 1).padStart(2, '0')}-${String((idx % 24) + 1).padStart(2, '0')}`,
  end: `2026-${String((idx % 9) + 1).padStart(2, '0')}-${String((idx % 24) + 6).padStart(2, '0')}`,
  pay: `$${180 + (idx % 6) * 10}/day`
}));

sql.push('insert into tour_jobs (agency_id, title, description, destination_country, start_date, end_date, pay_rate, status) values');
const jobRows = jobs.map((j) => `((select id from agencies where name='${esc(j.agency)}'),'${esc(j.title)}','${esc(j.description)}','${esc(j.destination)}','${j.start}','${j.end}','${esc(j.pay)}','open')`);
sql.push(jobRows.join(',\n') + ';');

const posts = [
  { category: 'Cruise tips', title: 'Boarding checklist essentials', body: 'Carry passports, printed vouchers, and medication list.' },
  { category: 'Airport tips', title: 'Fast transfer at Singapore Changi', body: 'Use Skytrain between terminals during peak hours.' },
  { category: 'Emergency cases', title: 'Lost passport in Tokyo', body: 'File a police report before embassy visit.' },
  { category: 'Tour stories', title: 'Handling weather disruptions', body: 'Always maintain a backup indoor plan.' },
  { category: 'Country travel updates', title: 'Entry form updates', body: 'Confirm electronic entry forms 24 hours before arrival.' }
];

sql.push('insert into community_posts (category, title, body) values');
const postRows = posts.map((p) => `('${esc(p.category)}','${esc(p.title)}','${esc(p.body)}')`);
sql.push(postRows.join(',\n') + ';');

const routeBriefs = [
  {
    title: 'Singapore City Highlights Loop',
    description: 'Cruise arrival city loop: Marina Bay Cruise Centre → Gardens by the Bay → Merlion Park → Raffles Hotel → Chinatown Heritage Centre → return.',
    start: 'Marina Bay Cruise Centre Singapore, 61 Marina Coastal Dr, Singapore 018947',
    end: 'Marina Bay Cruise Centre Singapore, 61 Marina Coastal Dr, Singapore 018947',
    waypoints: [
      'Gardens by the Bay, 18 Marina Gardens Dr, Singapore 018953',
      'Merlion Park, 1 Fullerton Rd, Singapore 049213',
      'Raffles Singapore, 1 Beach Rd, Singapore 189673',
      'Chinatown Heritage Centre, 48 Pagoda St, Singapore 059207'
    ],
    mapsUrl: 'https://www.google.com/maps/dir/Marina+Bay+Cruise+Centre+Singapore,+61+Marina+Coastal+Dr,+Singapore+018947/Gardens+by+the+Bay,+18+Marina+Gardens+Dr,+Singapore+018953/Merlion+Park,+1+Fullerton+Rd,+Singapore+049213/Raffles+Singapore,+1+Beach+Rd,+Singapore+189673/Chinatown+Heritage+Centre,+48+Pagoda+St,+Singapore+059207/Marina+Bay+Cruise+Centre+Singapore,+61+Marina+Coastal+Dr,+Singapore+018947/@1.2757712,103.8234828,13.4z/data=!3m1!5s0x31da19734845e93f:0x81f2323dbcc673cd!4m38!4m37!1m5!1m1!1s0x31da1900758262cb:0x36ec1640ec829d0c!2m2!1d103.8602571!2d1.2667383!1m5!1m1!1s0x31da1904937e1633:0x62099677b59fca76!2m2!1d103.8636132!2d1.2815683!1m5!1m1!1s0x31da190ed6203605:0x66ad5eee6e01f3a7!2m2!1d103.8543872!2d1.2867449!1m5!1m1!1s0x31da19a5bbca44c1:0x647f3845b65cdec2!2m2!1d103.854483!2d1.294889!1m5!1m1!1s0x31da1973493ae8dd:0x26539d86b7ad1b0b!2m2!1d103.8442036!2d1.2835298!1m5!1m1!1s0x31da1900758262cb:0x36ec1640ec829d0c!2m2!1d103.8602571!2d1.2667383!3e0?entry=ttu&g_ep=EgoyMDI2MDMwOS4wIKXMDSoASAFQAw%3D%3D',
    notes: 'Allow 10-15 minutes between stops for group movement. Use Raffles Hotel drop-off point for coach parking.'
  }
];

sql.push('insert into route_briefs (title, description, start_location, end_location, waypoints, maps_url, notes) values');
const routeRows = routeBriefs.map((r) => {
  const waypointsJson = JSON.stringify(r.waypoints);
  return `('${esc(r.title)}','${esc(r.description)}','${esc(r.start)}','${esc(r.end)}','${esc(waypointsJson)}'::jsonb,'${esc(r.mapsUrl)}','${esc(r.notes)}')`;
});
sql.push(routeRows.join(',\n') + ';');

sql.push('commit;');

fs.writeFileSync('seed.sql', sql.join('\n'));
console.log('seed.sql generated');
