import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { supabase, supabaseReady } from './services/supabase.js';
import { requireAuth, requireRole } from './middleware/auth.js';
import crypto from 'crypto';
import Anthropic from '@anthropic-ai/sdk';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;
const corsOrigin = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',')
  : '*';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.resolve(__dirname, '../../database');

const readJson = (file, fallbackValue) => {
  try {
    const content = fs.readFileSync(path.join(dataDir, file), 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    console.warn(`Fallback JSON load failed for ${file}:`, err.message);
    return fallbackValue;
  }
};

app.use(cors({ origin: corsOrigin }));
app.use(express.json());

// 역할별 메뉴 및 기능 권한 설정
const rolePermissions = {
  admin: {
    menus: [
      'dashboard',
      'airports',
      'cruise-lines',
      'cruise-ships',
      'cruise-ports',
      'countries',
      'users',
      'community-posts',
      'tour-jobs',
      'applications',
      'settings'
    ],
    features: [
      'create_airports',
      'edit_airports',
      'delete_airports',
      'create_cruise_lines',
      'edit_cruise_lines',
      'delete_cruise_lines',
      'create_cruise_ships',
      'edit_cruise_ships',
      'delete_cruise_ships',
      'create_cruise_ports',
      'edit_cruise_ports',
      'delete_cruise_ports',
      'create_countries',
      'edit_countries',
      'delete_countries',
      'manage_users',
      'create_posts',
      'edit_posts',
      'delete_posts',
      'create_jobs',
      'edit_jobs',
      'delete_jobs',
      'view_applications',
      'manage_applications'
    ]
  },
  agency: {
    menus: [
      'dashboard',
      'tour-jobs',
      'applications',
      'community-posts'
    ],
    features: [
      'create_jobs',
      'edit_jobs',
      'delete_jobs',
      'view_applications',
      'manage_applications',
      'create_posts',
      'edit_posts'
    ]
  },
  leader: {
    menus: [
      'dashboard',
      'airports',
      'cruise-lines',
      'cruise-ships',
      'cruise-ports',
      'countries',
      'community-posts',
      'applications'
    ],
    features: [
      'view_airports',
      'view_cruise_lines',
      'view_cruise_ships',
      'view_cruise_ports',
      'view_countries',
      'create_posts',
      'edit_posts',
      'view_applications'
    ]
  }
};

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'travel-leader-network-api' });
});

const handleList = async (res, query) => {
  const { data, error } = await query;
  if (error) {
    return res.status(500).json({ error: error.message });
  }
  return res.json(data);
};

const fallback = {
  countries: readJson('countries.json', []),
  embassies: readJson('embassies.json', []),
  airports: readJson('airports_500.json', []),
  cruiseLines: readJson('cruise_lines.json', [
    { id: '1', name: 'Royal Caribbean', country: 'United States' },
    { id: '2', name: 'MSC Cruises', country: 'Switzerland' }
  ]),
  cruiseShips: readJson('cruise_ships_300.json', []),
  cruisePorts: readJson('cruise_ports_400.json', []),
  cruiseTerminals: [],
  communityPosts: readJson('community_posts.json', []),
  jobs: readJson('tour_jobs.json', []),
  routeBriefs: [
    {
      id: '1',
      title: 'Singapore City Highlights Loop',
      description: 'Cruise arrival city loop: Marina Bay Cruise Centre → Gardens by the Bay → Merlion Park → Raffles Hotel → Chinatown Heritage Centre → return.',
      start_location: 'Marina Bay Cruise Centre Singapore, 61 Marina Coastal Dr, Singapore 018947',
      end_location: 'Marina Bay Cruise Centre Singapore, 61 Marina Coastal Dr, Singapore 018947',
      waypoints: [
        'Gardens by the Bay, 18 Marina Gardens Dr, Singapore 018953',
        'Merlion Park, 1 Fullerton Rd, Singapore 049213',
        'Raffles Singapore, 1 Beach Rd, Singapore 189673',
        'Chinatown Heritage Centre, 48 Pagoda St, Singapore 059207'
      ],
      maps_url: 'https://www.google.com/maps/dir/Marina+Bay+Cruise+Centre+Singapore,+61+Marina+Coastal+Dr,+Singapore+018947/Gardens+by+the+Bay,+18+Marina+Gardens+Dr,+Singapore+018953/Merlion+Park,+1+Fullerton+Rd,+Singapore+049213/Raffles+Singapore,+1+Beach+Rd,+Singapore+189673/Chinatown+Heritage+Centre,+48+Pagoda+St,+Singapore+059207/Marina+Bay+Cruise+Centre+Singapore,+61+Marina+Coastal+Dr,+Singapore+018947',
      notes: 'Allow 10-15 minutes between stops for group movement. Use Raffles Hotel drop-off point for coach parking.'
    }
  ],
  audioPois: readJson('audio_pois.json', [
    {
      id: '00000000-0000-0000-0000-00000000a001',
      name: 'Marina Bay Cruise Centre',
      lat: 1.2667383,
      lng: 103.8602571,
      radius_m: 200,
      messages: {
        'ko-KR': '마리나 베이 크루즈 센터입니다. 수하물은 1층 드롭존에서 내리시고, 2층 체크인 카운터로 이동하세요.',
        'en-US': 'You are approaching Marina Bay Cruise Centre. Drop luggage on level 1, then proceed to level 2 check-in.',
        'ja-JP': 'マリーナベイクルーズセンターです。1階で荷物を降ろし、2階のチェックインへお進みください。'
      },
      tags: ['singapore', 'cruise'],
      active: true
    },
    {
      id: '00000000-0000-0000-0000-00000000a002',
      name: 'Gardens by the Bay',
      lat: 1.2815683,
      lng: 103.8636132,
      radius_m: 180,
      messages: {
        'ko-KR': '가든스 바이 더 베이에 도착했습니다. 플라워 돔과 클라우드 포레스트 입구가 앞에 있습니다.',
        'en-US': 'Welcome to Gardens by the Bay. Flower Dome and Cloud Forest entrances are ahead.',
        'ja-JP': 'ガーデンズ・バイ・ザ・ベイに到着しました。フラワードームとクラウドフォレストの入口があります。'
      },
      tags: ['singapore', 'garden'],
      active: true
    },
    {
      id: '00000000-0000-0000-0000-00000000a003',
      name: 'Merlion Park',
      lat: 1.2867449,
      lng: 103.8543872,
      radius_m: 150,
      messages: {
        'ko-KR': '멀라이언 파크입니다. 단체 사진 포인트는 분수 정면 좌측 데크입니다.',
        'en-US': 'Merlion Park ahead. Best group photo spot is on the left deck facing the fountain.',
        'ja-JP': 'マーライオンパークです。噴水を正面にして左側デッキが写真スポットです。'
      },
      tags: ['singapore', 'iconic'],
      active: true
    },
    {
      id: '00000000-0000-0000-0000-00000000a004',
      name: 'Raffles Hotel',
      lat: 1.294889,
      lng: 103.854483,
      radius_m: 120,
      messages: {
        'ko-KR': '래플스 호텔입니다. 체크인 로비는 메인 아치 안쪽에 있습니다.',
        'en-US': 'Arriving at Raffles Hotel. Check-in lobby is through the main arch.',
        'ja-JP': 'ラッフルズホテル到着。チェックインロビーはメインアーチの奥です。'
      },
      tags: ['singapore', 'hotel'],
      active: true
    },
    {
      id: '00000000-0000-0000-0000-00000000a005',
      name: 'Chinatown Heritage Centre',
      lat: 1.2835298,
      lng: 103.8442036,
      radius_m: 150,
      messages: {
        'ko-KR': '차이나타운 헤리티지 센터입니다. 투어 동선은 2층 전시부터 시작하세요.',
        'en-US': 'Chinatown Heritage Centre. Start the group on level 2 exhibits.',
        'ja-JP': 'チャイナタウン・ヘリテージセンターです。2階展示からご案内ください。'
      },
      tags: ['singapore', 'museum'],
      active: true
    }
  ])
};

// Simple in-memory session cache for audio sharing
const audioSessions = new Map();
const randomId = (len = 12) => crypto.randomBytes(len).toString('hex');

const filterList = (list, q, keys) => {
  if (!q) return list;
  const needle = String(q).toLowerCase();
  return list.filter((item) => keys.some((key) => String(item[key] || '').toLowerCase().includes(needle)));
};

app.get('/api/countries', async (req, res) => {
  const q = req.query.q;
  if (!supabaseReady) return res.json(filterList(fallback.countries, q, ['name']));
  let query = supabase.from('countries').select('*').order('name');
  if (q) query = query.ilike('name', `%${q}%`);
  return handleList(res, query);
});

app.get('/api/agencies', async (req, res) => {
  const q = req.query.q;
  if (!supabaseReady) return res.json([]);
  let query = supabase.from('agencies').select('*').order('name');
  if (q) query = query.ilike('name', `%${q}%`);
  return handleList(res, query);
});

app.post('/api/agencies', requireAuth, requireRole('agency', 'admin'), async (req, res) => {
  if (!supabaseReady) return res.status(501).json({ error: 'Supabase not configured' });
  const payload = req.body;
  const { data, error } = await supabase.from('agencies').insert(payload).select('*').single();
  if (error) return res.status(400).json({ error: error.message });
  return res.status(201).json(data);
});

app.get('/api/airports', async (req, res) => {
  const q = req.query.q;
  if (!supabaseReady) return res.json(filterList(fallback.airports, q, ['name', 'iata', 'city', 'country']));
  let query = supabase.from('airports').select('*').order('name');
  if (q) {
    const pattern = `%${q}%`;
    query = query.or(
      `name.ilike.${pattern},country.ilike.${pattern},city.ilike.${pattern},iata.ilike.${pattern}`
    );
  }
  return handleList(res, query);
});

app.get('/api/cruise-lines', async (req, res) => {
  const q = req.query.q;
  if (!supabaseReady) return res.json(filterList(fallback.cruiseLines, q, ['name']));
  let query = supabase.from('cruise_lines').select('*').order('name');
  if (q) query = query.ilike('name', `%${q}%`);
  return handleList(res, query);
});

app.get('/api/cruise-ships', async (req, res) => {
  const q = req.query.q;
  if (!supabaseReady) return res.json(filterList(fallback.cruiseShips, q, ['ship_name', 'cruise_line']));
  let query = supabase.from('cruise_ships').select('*').order('ship_name');
  if (q) query = query.ilike('ship_name', `%${q}%`);
  return handleList(res, query);
});

app.get('/api/cruise-ports', async (req, res) => {
  const q = req.query.q;
  if (!supabaseReady) return res.json(filterList(fallback.cruisePorts, q, ['name', 'city', 'country']));
  let query = supabase.from('cruise_ports').select('*').order('name');
  if (q) query = query.ilike('name', `%${q}%`);
  return handleList(res, query);
});

app.get('/api/cruise-terminals', async (req, res) => {
  const cruisePortId = req.query.cruise_port_id;
  if (!supabaseReady) return res.json(fallback.cruiseTerminals);
  let query = supabase.from('cruise_terminals').select('*').order('name');
  if (cruisePortId) query = query.eq('cruise_port_id', cruisePortId);
  return handleList(res, query);
});

app.get('/api/embassies', async (req, res) => {
  const countryId = req.query.country_id;
  if (!supabaseReady) return res.json(fallback.embassies);
  let query = supabase.from('embassies').select('*').order('name');
  if (countryId) query = query.eq('country_id', countryId);
  return handleList(res, query);
});

app.get('/api/community-posts', async (req, res) => {
  const q = req.query.q;
  if (!supabaseReady) return res.json(filterList(fallback.communityPosts, q, ['title']));
  let query = supabase.from('community_posts').select('*').order('created_at', { ascending: false });
  if (q) query = query.ilike('title', `%${q}%`);
  return handleList(res, query);
});

app.post('/api/community-posts', requireAuth, requireRole('leader', 'agency', 'admin'), async (req, res) => {
  if (!supabaseReady) return res.status(501).json({ error: 'Supabase not configured' });
  const payload = req.body;
  const { data, error } = await supabase.from('community_posts').insert(payload).select('*').single();
  if (error) return res.status(400).json({ error: error.message });
  return res.status(201).json(data);
});

app.post('/api/audio-tts', async (req, res) => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'OPENAI_API_KEY not configured' });
  const { text, voice = 'alloy', format = 'mp3' } = req.body || {};
  if (!text || typeof text !== 'string') return res.status(400).json({ error: 'text is required' });
  try {
    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini-tts',
        voice,
        input: text,
        format
      })
    });
    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({ error: errText });
    }
    const arrayBuf = await response.arrayBuffer();
    const buf = Buffer.from(arrayBuf);
    res.setHeader('Content-Type', `audio/${format}`);
    res.setHeader('Cache-Control', 'public, max-age=3600');
    return res.send(buf);
  } catch (err) {
    console.error('TTS error', err);
    res.status(502).json({ error: 'TTS generation failed or network unavailable' });
  }
});

app.get('/api/jobs', async (req, res) => {
  const q = req.query.q;
  const status = req.query.status || 'open';
  if (!supabaseReady) {
    const jobs = fallback.jobs.map((job) => ({ ...job, start_date: job.start_date || job.tour_date, pay_rate: job.pay_rate || job.salary, status }));
    return res.json(filterList(jobs, q, ['title']));
  }
  let query = supabase.from('tour_jobs').select('*').eq('status', status).order('start_date');
  if (q) query = query.ilike('title', `%${q}%`);
  return handleList(res, query);
});

app.get('/api/route-briefs', async (req, res) => {
  if (!supabaseReady) return res.json(fallback.routeBriefs);
  return handleList(res, supabase.from('route_briefs').select('*').order('created_at', { ascending: false }));
});

app.get('/api/audio-pois', async (req, res) => {
  const q = req.query.q;
  if (!supabaseReady) return res.json(filterList(fallback.audioPois, q, ['name']));
  let query = supabase.from('audio_pois').select('*').eq('active', true).order('name');
  if (q) query = query.ilike('name', `%${q}%`);
  return handleList(res, query);
});

app.get('/api/leader-settings', async (req, res) => {
  const userId = req.query.user_id;
  if (!supabaseReady) {
    return res.json({
      user_id: userId || null,
      language: 'ko-KR',
      radius_m: 200,
      voice: 'default',
      repeat: false
    });
  }
  if (!userId) return res.status(400).json({ error: 'user_id is required' });
  const { data, error } = await supabase.from('leader_settings').select('*').eq('user_id', userId).single();
  if (error && error.code !== 'PGRST116') return res.status(400).json({ error: error.message });
  if (!data) {
    return res.json({
      user_id: userId,
      language: 'ko-KR',
      radius_m: 200,
      voice: 'default',
      repeat: false
    });
  }
  return res.json(data);
});

app.post('/api/leader-settings', requireAuth, requireRole('leader', 'agency', 'admin'), async (req, res) => {
  if (!supabaseReady) return res.status(501).json({ error: 'Supabase not configured' });
  const payload = req.body;
  if (!payload.user_id) return res.status(400).json({ error: 'user_id is required' });
  const { data, error } = await supabase.from('leader_settings').upsert(payload, { onConflict: 'user_id' }).select('*').single();
  if (error) return res.status(400).json({ error: error.message });
  return res.status(201).json(data);
});

app.post('/api/jobs', requireAuth, requireRole('agency', 'admin'), async (req, res) => {
  if (!supabaseReady) return res.status(501).json({ error: 'Supabase not configured' });
  const payload = req.body;
  const { data, error } = await supabase.from('tour_jobs').insert(payload).select('*').single();
  if (error) return res.status(400).json({ error: error.message });
  return res.status(201).json(data);
});

app.post('/api/applications', requireAuth, requireRole('leader', 'admin'), async (req, res) => {
  if (!supabaseReady) return res.status(501).json({ error: 'Supabase not configured' });
  const payload = req.body;
  const { data, error } = await supabase.from('tour_applications').insert(payload).select('*').single();
  if (error) return res.status(400).json({ error: error.message });
  return res.status(201).json(data);
});

app.post('/api/schedule-ai', async (req, res) => {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'ANTHROPIC_API_KEY not configured' });

  const {
    destination, tripType, duration, passengerCount,
    language = 'ko', notes, budgetPerPax, currency = 'USD', shoreExcursion
  } = req.body || {};
  if (!destination) return res.status(400).json({ error: 'destination is required' });

  const isCruise = tripType === 'cruise';
  const tripTypeLabel = {
    land_tour: language === 'ko' ? '육상 투어' : 'Land Tour',
    cruise: language === 'ko' ? '크루즈' : 'Cruise',
    city_tour: language === 'ko' ? '시티 투어' : 'City Tour',
    airport_transfer: language === 'ko' ? '공항 이동' : 'Airport Transfer'
  }[tripType] || tripType || (language === 'ko' ? '투어' : 'Tour');

  const shoreLabel = {
    guided: language === 'ko' ? '가이드 투어 포함' : 'Guided Tour',
    free: language === 'ko' ? '자유여행' : 'Free Time',
    mixed: language === 'ko' ? '혼합 (오전 투어 + 오후 자유)' : 'Mixed (Morning Tour + Afternoon Free)'
  }[shoreExcursion] || '';

  const isKo = language === 'ko';
  const systemPrompt = isKo
    ? `당신은 전문 투어 리더 운영 어시스턴트입니다. 실제 현지 물가와 운영 비용에 기반한 정확한 예산을 포함한 여행 일정을 JSON 형식으로 생성합니다. 반드시 유효한 JSON만 응답하고, 마크다운 코드블록 없이 순수 JSON만 반환하세요.`
    : `You are a professional tour leader operations assistant. You generate travel schedules with accurate budgets based on real local pricing. Always respond with valid JSON only, no markdown code blocks.`;

  const budgetSection = isKo
    ? (budgetPerPax ? `- 1인 예산: ${budgetPerPax} ${currency}\n- 단체 총 예산: ${(Number(budgetPerPax) * (passengerCount || 20)).toLocaleString()} ${currency}` : '- 예산: 미지정 (적정 예산 추천)')
    : (budgetPerPax ? `- Budget per person: ${budgetPerPax} ${currency}\n- Group total budget: ${(Number(budgetPerPax) * (passengerCount || 20)).toLocaleString()} ${currency}` : '- Budget: Not specified (recommend appropriate budget)');

  const shoreSection = isCruise && shoreLabel
    ? (isKo ? `- 기항지 관광 방식: ${shoreLabel}` : `- Shore excursion type: ${shoreLabel}`)
    : '';

  const userPrompt = isKo
    ? `다음 조건으로 투어 리더용 운영 일정과 예산 계획표를 생성해 주세요:
- 목적지: ${destination}
- 투어 유형: ${tripTypeLabel}
- 기간: ${duration || 1}일
- 승객 수: ${passengerCount || 20}명
${budgetSection}
${shoreSection}
${notes ? `- 특이사항: ${notes}` : ''}

실제 현지 물가를 기반으로 정확한 숫자를 제공하세요. 크루즈의 경우 기항지별 입장료, 교통비, 가이드비를 실제 가격으로 기재하세요.

다음 JSON 구조로 정확히 응답하세요. schedule의 각 items는 가능한 한 상세하게 작성하세요:
{
  "destination": "목적지명",
  "duration": 숫자,
  "schedule": [
    {
      "day": 1,
      "title": "1일차 제목",
      "items": [
        {
          "time": "HH:MM",
          "activity": "활동명",
          "location": "장소명 (구체적 주소 또는 랜드마크)",
          "type": "transport|activity|meal|accommodation",
          "duration": "소요시간 (예: 2시간, 45분)",
          "cost": 숫자 (1인당 비용, 없으면 0),
          "description": "활동에 대한 구체적 설명 (2-3문장: 무엇을 하는지, 주의사항, 팁 등)",
          "notes": "투어 리더 운영 메모 (예: 집합 장소, 주의사항, 대기 포인트)"
        }
      ]
    }
  ],
  "budget": {
    "currency": "${currency}",
    "perPax": 숫자,
    "groupTotal": 숫자,
    "breakdown": [
      { "item": "항목명", "perPax": 숫자, "groupTotal": 숫자, "note": "비고", "category": "transport|activity|meal|accommodation|entrance|guide|misc" }
    ],
    "shoreExcursionOptions": ${isCruise ? `[
      { "port": "기항지명", "option": "guided|free|mixed", "label": "옵션 설명", "perPax": 숫자, "included": ["포함 항목"] }
    ]` : 'null'},
    "savingTips": ["절약 팁1", "절약 팁2"]
  },
  "tips": ["팁1", "팁2"],
  "checklist": ["체크항목1", "체크항목2"]
}`
    : `Generate a tour leader operations schedule and budget breakdown for:
- Destination: ${destination}
- Tour type: ${tripTypeLabel}
- Duration: ${duration || 1} day(s)
- Passenger count: ${passengerCount || 20}
${budgetSection}
${shoreSection}
${notes ? `- Notes: ${notes}` : ''}

Provide accurate numbers based on real local pricing. For cruises, include actual entrance fees, transport costs, and guide fees per port.

Respond with exactly this JSON structure. Make each schedule item as detailed as possible:
{
  "destination": "destination name",
  "duration": number,
  "schedule": [
    {
      "day": 1,
      "title": "Day 1 title",
      "items": [
        {
          "time": "HH:MM",
          "activity": "activity name",
          "location": "specific location name or landmark",
          "type": "transport|activity|meal|accommodation",
          "duration": "time required (e.g. 2 hours, 45 min)",
          "cost": number (cost per person, 0 if free),
          "description": "2-3 sentence description: what to do, highlights, practical tips",
          "notes": "tour leader operational note (meeting point, headcount reminder, etc.)"
        }
      ]
    }
  ],
  "budget": {
    "currency": "${currency}",
    "perPax": number,
    "groupTotal": number,
    "breakdown": [
      { "item": "item name", "perPax": number, "groupTotal": number, "note": "note", "category": "transport|activity|meal|accommodation|entrance|guide|misc" }
    ],
    "shoreExcursionOptions": ${isCruise ? `[
      { "port": "port name", "option": "guided|free|mixed", "label": "option description", "perPax": number, "included": ["included item"] }
    ]` : 'null'},
    "savingTips": ["saving tip 1", "saving tip 2"]
  },
  "tips": ["tip1", "tip2"],
  "checklist": ["item1", "item2"]
}`;

  try {
    const client = new Anthropic({ apiKey });
    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2048,
      messages: [{ role: 'user', content: userPrompt }],
      system: systemPrompt
    });

    const rawText = message.content[0]?.text || '';
    let parsed;
    try {
      parsed = JSON.parse(rawText);
    } catch {
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        return res.status(502).json({ error: 'Failed to parse AI response', raw: rawText });
      }
    }
    return res.json(parsed);
  } catch (err) {
    console.error('Schedule AI error', err);
    return res.status(502).json({ error: 'AI request failed', message: err.message });
  }
});

app.post('/api/route-briefs', requireAuth, requireRole('agency', 'admin'), async (req, res) => {
  if (!supabaseReady) return res.status(501).json({ error: 'Supabase not configured' });
  const payload = req.body;
  const { data, error } = await supabase.from('route_briefs').insert(payload).select('*').single();
  if (error) return res.status(400).json({ error: error.message });
  return res.status(201).json(data);
});

app.get('/api/applications', requireAuth, async (req, res) => {
  const userId = req.query.user_id;
  if (!supabaseReady) return res.json([]);
  let query = supabase.from('tour_applications').select('*').order('created_at', { ascending: false });
  if (userId) query = query.eq('user_id', userId);
  return handleList(res, query);
});

// Auth routes
app.post('/api/auth/signup', async (req, res) => {
  if (!supabaseReady) return res.status(501).json({ error: 'Supabase not configured' });
  const { email, password, role = 'leader' } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { role }
    }
  });
  if (error) return res.status(400).json({ error: error.message });
  return res.status(201).json({ user: data.user, session: data.session });
});

app.post('/api/auth/login', async (req, res) => {
  if (!supabaseReady) return res.status(501).json({ error: 'Supabase not configured' });
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  if (error) return res.status(400).json({ error: error.message });
  return res.status(200).json({ user: data.user, session: data.session });
});

app.post('/api/auth/logout', requireAuth, async (req, res) => {
  if (!supabaseReady) return res.status(501).json({ error: 'Supabase not configured' });
  const { error } = await supabase.auth.signOut();
  if (error) return res.status(400).json({ error: error.message });
  return res.status(200).json({ message: 'Logged out successfully' });
});

app.get('/api/auth/me', requireAuth, async (req, res) => {
  return res.json({ user: req.user });
});

// 권한 및 메뉴 설정 API
app.get('/api/permissions', requireAuth, async (req, res) => {
  const userRole = req.user?.role;
  if (!userRole || !rolePermissions[userRole]) {
    return res.status(403).json({ error: 'Invalid user role' });
  }
  
  const permissions = rolePermissions[userRole];
  return res.json({
    role: userRole,
    menus: permissions.menus,
    features: permissions.features
  });
});

app.get('/api/permissions/:role', requireAuth, requireRole('admin'), async (req, res) => {
  const { role } = req.params;
  if (!rolePermissions[role]) {
    return res.status(404).json({ error: 'Role not found' });
  }
  
  return res.json({
    role,
    menus: rolePermissions[role].menus,
    features: rolePermissions[role].features
  });
});

app.put('/api/permissions/:role', requireAuth, requireRole('admin'), async (req, res) => {
  const { role } = req.params;
  const { menus, features } = req.body;
  
  if (!rolePermissions[role]) {
    return res.status(404).json({ error: 'Role not found' });
  }
  
  // 권한 업데이트 (실제로는 데이터베이스에 저장)
  rolePermissions[role] = {
    menus: menus || rolePermissions[role].menus,
    features: features || rolePermissions[role].features
  };
  
  return res.json({
    role,
    menus: rolePermissions[role].menus,
    features: rolePermissions[role].features,
    message: 'Permissions updated successfully'
  });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`API running on http://0.0.0.0:${port}`);
});
