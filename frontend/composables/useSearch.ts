/**
 * matchesQuery – multilingual multi-word partial search helper
 *
 * Translates Korean/Japanese/Chinese search terms to English aliases
 * before matching against English-only airport data.
 */

// ─── Multilingual alias map ────────────────────────────────────────────────
// Format: 'native term' → ['english', 'aliases', ...]
const ALIASES: Record<string, string[]> = {
  // ── Korea ──
  '인천': ['incheon', 'icn'],
  '인천공항': ['incheon', 'icn'],
  '인천국제공항': ['incheon international', 'icn'],
  '김포': ['gimpo', 'gmp'],
  '김포공항': ['gimpo', 'gmp'],
  '제주': ['jeju', 'cju'],
  '부산': ['busan', 'pus', 'gimhae'],
  '대구': ['daegu', 'tae'],
  '청주': ['cheongju', 'cjj'],
  '광주': ['gwangju', 'kwj'],
  '한국': ['korea', 'south korea'],
  // ── Japan ──
  '나리타': ['narita', 'nrt'],
  '하네다': ['haneda', 'hnd'],
  '간사이': ['kansai', 'kix'],
  '오사카': ['osaka', 'kix', 'itm'],
  '도쿄': ['tokyo', 'nrt', 'hnd'],
  '동경': ['tokyo', 'nrt', 'hnd'],
  '후쿠오카': ['fukuoka', 'fuk'],
  '삿포로': ['sapporo', 'cts'],
  '오키나와': ['okinawa', 'oka'],
  '나고야': ['nagoya', 'ngo'],
  '일본': ['japan'],
  // ── China ──
  '베이징': ['beijing', 'pek', 'pkx'],
  '북경': ['beijing', 'pek'],
  '상하이': ['shanghai', 'pvg', 'sha'],
  '광저우': ['guangzhou', 'can'],
  '홍콩': ['hong kong', 'hkg'],
  '마카오': ['macau', 'mfm'],
  '중국': ['china'],
  '대만': ['taiwan', 'tpe'],
  '타이베이': ['taipei', 'tpe'],
  // ── Southeast Asia ──
  '방콕': ['bangkok', 'bkk', 'dmk'],
  '싱가포르': ['singapore', 'sin'],
  '쿠알라룸푸르': ['kuala lumpur', 'kul'],
  '마닐라': ['manila', 'mnl'],
  '자카르타': ['jakarta', 'cgk'],
  '발리': ['bali', 'dps'],
  '호치민': ['ho chi minh', 'sgn'],
  '하노이': ['hanoi', 'han'],
  '태국': ['thailand'],
  '말레이시아': ['malaysia'],
  '베트남': ['vietnam'],
  '인도네시아': ['indonesia'],
  '필리핀': ['philippines'],
  // ── Middle East ──
  '두바이': ['dubai', 'dxb'],
  '아부다비': ['abu dhabi', 'auh'],
  '도하': ['doha', 'doh'],
  '이스탄불': ['istanbul', 'ist'],
  // ── Europe ──
  '런던': ['london', 'lhr', 'lgw', 'stn'],
  '파리': ['paris', 'cdg', 'ory'],
  '프랑크푸르트': ['frankfurt', 'fra'],
  '암스테르담': ['amsterdam', 'ams'],
  '취리히': ['zurich', 'zrh'],
  '뮌헨': ['munich', 'muc'],
  '로마': ['rome', 'fco'],
  '바르셀로나': ['barcelona', 'bcn'],
  '마드리드': ['madrid', 'mad'],
  '비엔나': ['vienna', 'vie'],
  '코펜하겐': ['copenhagen', 'cph'],
  '헬싱키': ['helsinki', 'hel'],
  '오슬로': ['oslo', 'osl'],
  '스톡홀름': ['stockholm', 'arn'],
  '브뤼셀': ['brussels', 'bru'],
  '리스본': ['lisbon', 'lis'],
  '아테네': ['athens', 'ath'],
  '프라하': ['prague', 'prg'],
  '부다페스트': ['budapest', 'bud'],
  '영국': ['united kingdom', 'uk', 'england'],
  '프랑스': ['france'],
  '독일': ['germany'],
  '이탈리아': ['italy'],
  '스페인': ['spain'],
  '네덜란드': ['netherlands'],
  '스위스': ['switzerland'],
  '터키': ['turkey'],
  // ── Americas ──
  '뉴욕': ['new york', 'jfk', 'lga', 'ewr'],
  '로스앤젤레스': ['los angeles', 'lax'],
  '엘에이': ['los angeles', 'lax'],
  '샌프란시스코': ['san francisco', 'sfo'],
  '시카고': ['chicago', 'ord'],
  '마이애미': ['miami', 'mia'],
  '라스베이거스': ['las vegas', 'las'],
  '시애틀': ['seattle', 'sea'],
  '밴쿠버': ['vancouver', 'yvr'],
  '토론토': ['toronto', 'yyz'],
  '상파울루': ['sao paulo', 'gru'],
  '미국': ['united states', 'usa'],
  '캐나다': ['canada'],
  '브라질': ['brazil'],
  // ── Oceania ──
  '시드니': ['sydney', 'syd'],
  '멜버른': ['melbourne', 'mel'],
  '오클랜드': ['auckland', 'akl'],
  '호주': ['australia'],
  '뉴질랜드': ['new zealand'],
  // ── India ──
  '뭄바이': ['mumbai', 'bom'],
  '뉴델리': ['new delhi', 'del'],
  '인도': ['india'],
  // ── Africa ──
  '나이로비': ['nairobi', 'nbo'],
  '요하네스버그': ['johannesburg', 'jnb'],
  // ── Cruise lines & ships ──
  '크루즈': ['cruise'],
  '항구': ['port', 'harbor', 'harbour'],
  '부두': ['pier', 'dock'],
  '로열캐리비안': ['royal caribbean'],
  '로열 캐리비안': ['royal caribbean'],
  '카니발': ['carnival'],
  '노르웨지안': ['norwegian'],
  '프린세스': ['princess'],
  '코스타': ['costa'],
  '홀랜드아메리카': ['holland america'],
  '오아시스': ['oasis'],
  '심포니': ['symphony'],
  '하모니': ['harmony'],
  '원더': ['wonder'],
  // ── Cruise port cities ──
  '요코하마': ['yokohama'],
  '베네치아': ['venice', 'venezia'],
  '베니스': ['venice'],
  '나폴리': ['naples', 'napoli'],
  '제노바': ['genoa', 'genova'],
  '피레우스': ['piraeus', 'athens'],
  '산토리니': ['santorini'],
  '미코노스': ['mykonos'],
  '두브로브니크': ['dubrovnik'],
  '로테르담': ['rotterdam'],
  '함부르크': ['hamburg'],
  '사우샘프턴': ['southampton'],
  '마르세유': ['marseille'],
  '바르셀로나항': ['barcelona port', 'barcelona'],
  '카사블랑카': ['casablanca'],
  '알렉산드리아': ['alexandria'],
  // ── Japanese input ──
  '成田': ['narita', 'nrt'],
  '羽田': ['haneda', 'hnd'],
  '関西': ['kansai', 'kix'],
  '仁川': ['incheon', 'icn'],
  '東京': ['tokyo', 'nrt', 'hnd'],
  '大阪': ['osaka'],
  '上海': ['shanghai'],
  '北京': ['beijing'],
  '香港': ['hong kong', 'hkg'],
  '台北': ['taipei', 'tpe'],
  // ── Chinese input ──
  '首尔': ['seoul', 'icn'],
  '新加坡': ['singapore', 'sin'],
  '曼谷': ['bangkok', 'bkk'],
};

/**
 * Expand a query word using the multilingual alias map.
 * Returns the original word plus any English aliases found.
 */
function expandWord(word: string): string[] {
  const result = [word];
  const aliases = ALIASES[word];
  if (aliases) result.push(...aliases);
  return result;
}

/**
 * matchesQuery – multi-word partial search helper with multilingual support
 */
export function matchesQuery(rawQuery: string, fields: (string | null | undefined)[]): boolean {
  const q = rawQuery.trim().toLowerCase();
  if (!q) return true;

  const haystack = fields
    .filter(Boolean)
    .map((f) => (f as string).toLowerCase())
    .join(' ');

  // Split query into words, expand each with aliases, then check if ANY expanded word matches
  return q.split(/\s+/).some((word) =>
    expandWord(word).some((expanded) => haystack.includes(expanded))
  );
}
