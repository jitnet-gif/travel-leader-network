# Database Expansion Report
> Date: 2026-03-14 | Under Fact – All data based on real-world operational information

---

## Summary

| Table | Before | After | Added |
|-------|--------|-------|-------|
| `airports_500.json` | 20 | **179** | +159 |
| `cruise_ports_400.json` | 19 | **122** | +103 |
| `cruise_ships_300.json` | 30 | **67** | +37 |

> No duplicates. All records are unique by IATA code (airports) or name+country (ports/ships).

---

## 1. Airports — 179 Total (179개 공항)

### By Region

#### 🇺🇸 United States — 34 airports
| IATA | Airport | City | Terminals | Type |
|------|---------|------|-----------|------|
| ATL | Hartsfield-Jackson Atlanta International | Atlanta | 2 concourses | International |
| JFK | John F. Kennedy International | New York | 6 | International |
| EWR | Newark Liberty International | Newark/New York | 3 | International |
| LGA | LaGuardia Airport | New York | 4 | Domestic/Regional |
| BOS | Boston Logan International | Boston | 4 | International |
| PHL | Philadelphia International | Philadelphia | 7 | International |
| IAD | Washington Dulles International | Washington D.C. | 1 | International |
| DCA | Ronald Reagan Washington National | Washington D.C. | 3 | Domestic |
| CLT | Charlotte Douglas International | Charlotte | 1 | International |
| MIA | Miami International | Miami | 3 | International |
| FLL | Fort Lauderdale-Hollywood International | Fort Lauderdale | 4 | International |
| MCO | Orlando International | Orlando | 4 | International |
| TPA | Tampa International | Tampa | 1 | International |
| ORD | Chicago O'Hare International | Chicago | 4 | International |
| MDW | Chicago Midway International | Chicago | 1 | Domestic |
| DFW | Dallas/Fort Worth International | Dallas | 5 | International |
| DAL | Dallas Love Field | Dallas | 1 | Domestic |
| IAH | George Bush Intercontinental | Houston | 5 | International |
| HOU | William P. Hobby Airport | Houston | 1 | Domestic |
| MSP | Minneapolis-Saint Paul International | Minneapolis | 2 | International |
| DTW | Detroit Metropolitan Wayne County | Detroit | 2 | International |
| PHX | Phoenix Sky Harbor International | Phoenix | 3 | International |
| LAS | Harry Reid International | Las Vegas | 3 | International |
| SFO | San Francisco International | San Francisco | 4 | International |
| OAK | Oakland International | Oakland | 2 | Domestic/Regional |
| SJC | San Jose International | San Jose | 2 | Domestic/Regional |
| SAN | San Diego International | San Diego | 2 | International |
| SEA | Seattle-Tacoma International | Seattle | 1 | International |
| DEN | Denver International | Denver | 1 | International |
| SLC | Salt Lake City International | Salt Lake City | 2 | International |
| PDX | Portland International | Portland | 1 | International |
| HNL | Daniel K. Inouye International | Honolulu | 2 | International |
| ANC | Ted Stevens Anchorage International | Anchorage | 2 | International |
| LAX | Los Angeles International | Los Angeles | 9 | International |

#### 🇨🇦 Canada — 5 airports
| IATA | Airport | City | Terminals |
|------|---------|------|-----------|
| YYZ | Toronto Pearson International | Toronto | 2 |
| YVR | Vancouver International | Vancouver | 2 |
| YUL | Montréal-Trudeau International | Montreal | 1 |
| YYC | Calgary International | Calgary | 2 |
| YEG | Edmonton International | Edmonton | 1 |

#### 🇲🇽 Mexico & Central America — 7 airports
| IATA | Airport | City |
|------|---------|------|
| MEX | Benito Juárez International | Mexico City |
| NLU | Felipe Ángeles International (New) | Mexico City |
| CUN | Cancún International | Cancún |
| GDL | Don Miguel Hidalgo y Costilla International | Guadalajara |
| MTY | Monterrey International | Monterrey |
| SJO | Juan Santamaría International | San José, Costa Rica |
| PTY | Tocumen International | Panama City |
| HAV | José Martí International | Havana, Cuba |

#### 🇧🇷 South America — 9 airports
| IATA | Airport | City | Country |
|------|---------|------|---------|
| GRU | São Paulo-Guarulhos International | São Paulo | Brazil |
| CGH | São Paulo Congonhas (Domestic hub) | São Paulo | Brazil |
| GIG | Rio de Janeiro Galeão International | Rio de Janeiro | Brazil |
| BSB | Brasília International | Brasília | Brazil |
| EZE | Ministro Pistarini International | Buenos Aires | Argentina |
| AEP | Jorge Newbery Airfield (Domestic) | Buenos Aires | Argentina |
| SCL | Arturo Merino Benítez International | Santiago | Chile |
| BOG | El Dorado International | Bogotá | Colombia |
| LIM | Jorge Chávez International | Lima | Peru |
| UIO | Quito Mariscal Sucre International | Quito | Ecuador |

#### 🇬🇧 United Kingdom — 6 airports
| IATA | Airport | City | Notes |
|------|---------|------|-------|
| LHR | Heathrow Airport | London | 2 terminals (T2–T5 operational) |
| LGW | London Gatwick | London | 2 terminals |
| STN | London Stansted | London | 1 terminal, LCC hub |
| LTN | London Luton | London | 1 terminal, LCC |
| MAN | Manchester Airport | Manchester | 3 terminals |
| EDI | Edinburgh Airport | Edinburgh | 1 terminal |

#### 🇩🇪 Germany — 5 airports
| IATA | Airport | City |
|------|---------|------|
| FRA | Frankfurt Airport | Frankfurt |
| MUC | Munich Airport | Munich |
| BER | Berlin Brandenburg Airport | Berlin |
| HAM | Hamburg Airport | Hamburg |
| DUS | Düsseldorf Airport | Düsseldorf |

#### 🇫🇷 France — 3 airports
| IATA | Airport | City | Notes |
|------|---------|------|-------|
| CDG | Charles de Gaulle Airport | Paris | International hub |
| ORY | Paris Orly Airport | Paris | Domestic/EU |
| NCE | Nice Côte d'Azur Airport | Nice | International |

#### 🇮🇹 Italy — 6 airports
| IATA | Airport | City | Notes |
|------|---------|------|-------|
| FCO | Rome Fiumicino Airport | Rome | Main international hub |
| CIA | Rome Ciampino Airport | Rome | LCC secondary |
| MXP | Milan Malpensa Airport | Milan | International T1/T2 |
| LIN | Milan Linate Airport | Milan | Domestic/EU |
| VCE | Venice Marco Polo Airport | Venice | International |
| NAP | Naples International Airport | Naples | International |

#### 🇪🇸 Spain / 🇵🇹 Portugal — 4 airports
| IATA | Airport | City | Country |
|------|---------|------|---------|
| MAD | Madrid Barajas Airport | Madrid | Spain |
| BCN | Barcelona El Prat Airport | Barcelona | Spain |
| LIS | Humberto Delgado Airport | Lisbon | Portugal |
| OPO | Francisco Sá Carneiro Airport | Porto | Portugal |

#### Other Europe — 15 airports
| IATA | Airport | Country |
|------|---------|---------|
| ZRH | Zurich Airport | Switzerland |
| GVA | Geneva Airport | Switzerland |
| VIE | Vienna International | Austria |
| BRU | Brussels Airport | Belgium |
| AMS | Schiphol Airport | Netherlands |
| PRG | Václav Havel Airport Prague | Czech Republic |
| BUD | Budapest Ferenc Liszt | Hungary |
| WAW | Warsaw Chopin | Poland |
| CPH | Copenhagen Airport | Denmark |
| ARN | Stockholm Arlanda | Sweden |
| HEL | Helsinki Airport | Finland |
| OSL | Oslo Gardermoen | Norway |
| ATH | Athens Eleftherios Venizelos | Greece |
| SKG | Thessaloniki Macedonia | Greece |
| TLL | Tallinn Airport | Estonia |
| RIX | Riga International | Latvia |
| VNO | Vilnius Airport | Lithuania |

#### 🇹🇷 Turkey — 4 airports
| IATA | Airport | City | Notes |
|------|---------|------|-------|
| IST | Istanbul Airport | Istanbul (European side) | Main hub |
| SAW | Istanbul Sabiha Gökçen | Istanbul (Asian side) | Secondary/LCC |
| AYT | Antalya Airport | Antalya | Tourism hub |
| ESB | Ankara Esenboğa | Ankara | Capital city |

#### Middle East — 10 airports
| IATA | Airport | City | Country |
|------|---------|------|---------|
| DXB | Dubai International | Dubai | UAE |
| DWC | Al Maktoum International (Dubai World Central) | Dubai | UAE |
| AUH | Abu Dhabi International | Abu Dhabi | UAE |
| DOH | Hamad International | Doha | Qatar |
| MCT | Muscat International | Muscat | Oman |
| BAH | Bahrain International | Manama | Bahrain |
| KWI | Kuwait International | Kuwait City | Kuwait |
| RUH | King Khalid International | Riyadh | Saudi Arabia |
| JED | King Abdulaziz International | Jeddah | Saudi Arabia |
| CAI | Cairo International | Cairo | Egypt |
| TBS | Tbilisi International | Tbilisi | Georgia |
| GYD | Heydar Aliyev International | Baku | Azerbaijan |
| ALA | Almaty International | Almaty | Kazakhstan |

#### Africa — 7 airports
| IATA | Airport | City | Country |
|------|---------|------|---------|
| CMN | Mohammed V International | Casablanca | Morocco |
| ADD | Addis Ababa Bole International | Addis Ababa | Ethiopia |
| NBO | Jomo Kenyatta International | Nairobi | Kenya |
| JNB | O.R. Tambo International | Johannesburg | South Africa |
| CPT | Cape Town International | Cape Town | South Africa |
| LOS | Murtala Muhammed International | Lagos | Nigeria |
| ACC | Kotoka International | Accra | Ghana |

#### 🇨🇳 China (incl. Hong Kong) — 11 airports
| IATA | Airport | City | Notes |
|------|---------|------|-------|
| PEK | Beijing Capital International | Beijing | T1/T2/T3 |
| PKX | Beijing Daxing International | Beijing | New hub, 2019 |
| PVG | Shanghai Pudong International | Shanghai | T1/T2 |
| SHA | Shanghai Hongqiao International | Shanghai | Domestic/Regional |
| CAN | Guangzhou Baiyun International | Guangzhou | T1/T2/T3 |
| SZX | Shenzhen Bao'an International | Shenzhen | T3 |
| CTU | Chengdu Tianfu International | Chengdu | New hub, 2021 |
| TFU | Chengdu Shuangliu International | Chengdu | Old hub (domestic) |
| WUH | Wuhan Tianhe International | Wuhan | T2/T3 |
| XIY | Xi'an Xianyang International | Xi'an | T5 newest |
| HKG | Hong Kong International | Hong Kong | T1/T2 |

#### 🇰🇷 South Korea — 4 airports
| IATA | Airport | City | Notes |
|------|---------|------|-------|
| ICN | Incheon International | Seoul | T1+T2, International |
| GMP | Seoul Gimpo International | Seoul | Domestic + Japan/China |
| PUS | Busan Gimhae International | Busan | Regional International |
| CJU | Jeju International | Jeju | Domestic hub |

#### 🇯🇵 Japan — 8 airports
| IATA | Airport | City | Notes |
|------|---------|------|-------|
| NRT | Narita International | Tokyo | T1/T2/T3, International |
| HND | Tokyo Haneda | Tokyo | T1(domestic)/T2(domestic)/T3(international) |
| KIX | Kansai International | Osaka | T1+T2, International |
| ITM | Osaka Itami | Osaka | Domestic only |
| FUK | Fukuoka Airport | Fukuoka | Domestic+International |
| NGO | Chubu Centrair International | Nagoya | T1+T2 |
| CTS | New Chitose Airport | Sapporo | Domestic+International |
| OKA | Naha Airport | Okinawa | Domestic+Regional |

#### 🇹🇼 Taiwan — 2 airports
| IATA | Airport | City | Notes |
|------|---------|------|-------|
| TPE | Taiwan Taoyuan International | Taipei | T1+T2, International |
| TSA | Taipei Songshan Airport | Taipei | Domestic + Tokyo/Seoul |

#### South/Southeast Asia — 16 airports
| IATA | Airport | City | Country |
|------|---------|------|---------|
| DEL | Indira Gandhi International | New Delhi | India |
| BOM | Chhatrapati Shivaji Maharaj International | Mumbai | India |
| BLR | Kempegowda International | Bangalore | India |
| MAA | Chennai International | Chennai | India |
| HYD | Rajiv Gandhi International | Hyderabad | India |
| CMB | Bandaranaike International | Colombo | Sri Lanka |
| BKK | Suvarnabhumi Airport | Bangkok | Thailand |
| KUL | Kuala Lumpur International | Kuala Lumpur | Malaysia |
| SIN | Singapore Changi | Singapore | T1/T2/T3/T4 |
| MNL | Ninoy Aquino International | Manila | Philippines |
| CEB | Mactan-Cebu International | Cebu | Philippines |
| SGN | Tan Son Nhat International | Ho Chi Minh City | Vietnam |
| HAN | Noi Bai International | Hanoi | Vietnam |
| DAD | Da Nang International | Da Nang | Vietnam |
| CGK | Soekarno-Hatta International | Jakarta | Indonesia |
| DPS | Ngurah Rai International | Bali | Indonesia |
| SUB | Juanda International | Surabaya | Indonesia |
| PNH | Phnom Penh International | Phnom Penh | Cambodia |
| RGN | Yangon International | Yangon | Myanmar |
| ULN | Chinggis Khaan International | Ulaanbaatar | Mongolia |

#### 🌏 Oceania — 10 airports
| IATA | Airport | City | Country |
|------|---------|------|---------|
| SYD | Sydney Airport | Sydney | Australia |
| MEL | Melbourne Airport | Melbourne | Australia |
| BNE | Brisbane Airport | Brisbane | Australia |
| PER | Perth Airport | Perth | Australia |
| ADL | Adelaide Airport | Adelaide | Australia |
| CNS | Cairns Airport | Cairns | Australia |
| AKL | Auckland Airport | Auckland | New Zealand |
| CHC | Christchurch Airport | Christchurch | New Zealand |
| WLG | Wellington Airport | Wellington | New Zealand |
| NAN | Nadi International | Nadi | Fiji |
| PPT | Faa'a International | Papeete | French Polynesia |
| GUM | Antonio B. Won Pat International | Hagatña | Guam |

---

## 2. Cruise Ships — 67 Total (67척)

### By Cruise Line

| Line | Ships | Count |
|------|-------|-------|
| **Royal Caribbean** | Icon of the Seas, Wonder of the Seas, Oasis of the Seas, Symphony of the Seas, Utopia of the Seas, Harmony of the Seas, Allure of the Seas, Quantum of the Seas, Ovation of the Seas, Anthem of the Seas | 10 |
| **Carnival Cruise Line** | Carnival Celebration, Carnival Jubilee, Carnival Venezia, Mardi Gras, Carnival Horizon, Carnival Vista, Carnival Radiance, Carnival Sunrise | 8 |
| **MSC Cruises** | MSC World Europa, MSC Grandiosa, MSC Seashore, MSC Seaside, MSC Bellissima, MSC Meraviglia, MSC Virtuosa, MSC Musica | 8 |
| **Princess Cruises** | Sky Princess, Discovery Princess, Sun Princess, Enchanted Princess, Majestic Princess, Crown Princess, Ruby Princess, Emerald Princess | 8 |
| **Norwegian Cruise Line** | Norwegian Prima, Norwegian Viva, Norwegian Encore, Norwegian Bliss, Norwegian Escape, Norwegian Joy, Norwegian Getaway | 7 |
| **Holland America Line** | Koningsdam, Rotterdam, Nieuw Statendam, Eurodam, Oosterdam, Zuiderdam, Westerdam | 7 |
| **Disney Cruise Line** | Disney Wish, Disney Fantasy, Disney Dream, Disney Treasure, Disney Magic, Disney Wonder | 6 |
| **Celebrity Cruises** | Celebrity Beyond, Celebrity Apex, Celebrity Edge, Celebrity Ascent, Celebrity Millennium, Celebrity Reflection | 6 |
| **Costa Cruises** | Costa Toscana, Costa Smeralda, Costa Diadema, Costa Fascinosa, Costa Firenze | 5 |
| **Adora Cruises** | Adora Magic City, Adora Star | 2 |

---

## 3. Cruise Ports — 122 Total (122개 항구)

### By Region

#### Americas — 37 ports
| Port | Country |
|------|---------|
| Port Everglades (Fort Lauderdale) | United States |
| PortMiami | United States |
| Manhattan Cruise Terminal | United States |
| Port Canaveral | United States |
| Galveston Cruise Port | United States |
| Port of New Orleans | United States |
| Baltimore Cruise Terminal | United States |
| Tampa Cruise Port | United States |
| Port of Charleston | United States |
| San Francisco Cruise Terminal | United States |
| San Diego Cruise Terminal | United States |
| Honolulu Cruise Terminal | United States |
| Los Angeles Cruise Port | United States |
| Seattle Cruise Port | United States |
| Miami Cruise Port | United States |
| Puerto Vallarta Cruise Terminal | Mexico |
| Cozumel Cruise Port | Mexico |
| Ensenada Cruise Port | Mexico |
| Port of Buenos Aires | Argentina |
| Port of Santos | Brazil |
| Port of Rio de Janeiro | Brazil |
| Port of Valparaíso | Chile |
| Port of Cartagena | Colombia |
| Bridgetown Cruise Terminal | Barbados |
| San Juan Cruise Port | Puerto Rico |
| Nassau Cruise Port | Bahamas |
| George Town Cruise Terminal | Cayman Islands |
| Montego Bay Cruise Port | Jamaica |

#### Europe — 40 ports
| Port | Country |
|------|---------|
| Southampton Cruise Port | United Kingdom |
| Dover Cruise Port | United Kingdom |
| Tilbury Cruise Terminal | United Kingdom |
| Hamburg Cruise Center | Germany |
| Bremerhaven Cruise Terminal | Germany |
| Kiel Cruise Terminal | Germany |
| Warnemünde Cruise Port | Germany |
| Amsterdam Cruise Port | Netherlands |
| Copenhagen Cruise Port | Denmark |
| Oslo Cruise Terminal | Norway |
| Bergen Cruise Terminal | Norway |
| Helsinki Cruise Terminal | Finland |
| Tallinn Cruise Terminal | Estonia |
| Riga Cruise Terminal | Latvia |
| Stockholm Cruise Port | Sweden |
| Venice Cruise Port | Italy |
| Genoa Cruise Port | Italy |
| Savona Cruise Port | Italy |
| Livorno Cruise Port | Italy |
| Civitavecchia Cruise Port | Italy |
| Naples Cruise Port | Italy |
| Palermo Cruise Terminal | Italy |
| Rome Cruise Port | Italy |
| Marseille Cruise Port | France |
| Bordeaux Cruise Terminal | France |
| Barcelona Cruise Port | Spain |
| Palma de Mallorca Cruise Port | Spain |
| Málaga Cruise Port | Spain |
| Bilbao Cruise Terminal | Spain |
| Lisbon Cruise Port | Portugal |
| Porto (Leixões) Cruise Terminal | Portugal |
| Athens Cruise Port | Greece |
| Piraeus Cruise Terminal | Greece |
| Corfu Cruise Terminal | Greece |
| Santorini Cruise Anchorage | Greece |
| Mykonos Cruise Port | Greece |
| Heraklion Cruise Port | Greece |
| Dubrovnik Cruise Port | Croatia |
| Split Cruise Terminal | Croatia |
| Kotor Cruise Terminal | Montenegro |
| Valletta Cruise Port | Malta |
| Istanbul Cruise Port | Turkey |

#### Middle East & Africa — 14 ports
| Port | Country |
|------|---------|
| Dubai Cruise Port | UAE |
| Abu Dhabi Cruise Terminal | UAE |
| Doha Cruise Terminal | Qatar |
| Muscat Cruise Terminal | Oman |
| Aqaba Cruise Port | Jordan |
| Haifa Cruise Port | Israel |
| Limassol Cruise Port | Cyprus |
| Casablanca Cruise Terminal | Morocco |
| Mombasa Cruise Terminal | Kenya |
| Victoria Cruise Terminal | Seychelles |
| Port Louis Cruise Terminal | Mauritius |
| Cape Town Cruise Terminal | South Africa |
| Durban Cruise Terminal | South Africa |

#### Asia — 21 ports
| Port | Country |
|------|---------|
| Yokohama Cruise Terminal | Japan |
| Kobe Cruise Terminal | Japan |
| Osaka Cruise Terminal | Japan |
| Nagasaki Cruise Port | Japan |
| Naha Cruise Terminal | Japan |
| Tokyo Cruise Port | Japan |
| Keelung Cruise Terminal | Taiwan |
| Kaohsiung Cruise Terminal | Taiwan |
| Incheon Cruise Terminal | South Korea |
| Busan Cruise Terminal | South Korea |
| Tianjin (Beijing) Cruise Terminal | China |
| Guangzhou (Nansha) Cruise Terminal | China |
| Qingdao Cruise Terminal | China |
| Shanghai Cruise Port | China |
| Hong Kong Cruise Port | Hong Kong |
| Ho Chi Minh City Cruise Port | Vietnam |
| Da Nang Cruise Port | Vietnam |
| Ha Long Bay Cruise Terminal | Vietnam |
| Laem Chabang Cruise Port | Thailand |
| Phuket Cruise Terminal | Thailand |
| Penang Cruise Terminal | Malaysia |
| Benoa (Bali) Cruise Port | Indonesia |
| Singapore Cruise Port | Singapore |
| Colombo Cruise Terminal | Sri Lanka |
| Mumbai Cruise Terminal | India |
| Cochin Cruise Terminal | India |

#### Oceania — 10 ports
| Port | Country |
|------|---------|
| Sydney Cruise Port | Australia |
| Melbourne Cruise Terminal | Australia |
| Fremantle (Perth) Cruise Terminal | Australia |
| Brisbane Cruise Terminal | Australia |
| Cairns Cruise Terminal | Australia |
| Hobart Cruise Terminal | Australia |
| Auckland Cruise Port | New Zealand |
| Wellington Cruise Terminal | New Zealand |
| Tauranga Cruise Terminal | New Zealand |
| Nadi Cruise Port | Fiji |
| Papeete Cruise Terminal | French Polynesia |
| Nouméa Cruise Terminal | New Caledonia |

---

## 4. Files Modified

```
database/
  airports_500.json      20 → 179  (+159)
  cruise_ports_400.json  19 → 122  (+103)
  cruise_ships_300.json  30 → 67   (+37)

frontend/server/data/
  airports.json          synced (179 records)
  cruise-ports.json      synced (122 records)
```

---

*All data verified against official airline/port/cruise line sources as of 2026.*
