export default {
  common: {
    search: '검색',
    searchPlaceholder: '검색어 입력',
    close: '닫기',
    menu: '메뉴',
    lightMode: '라이트 모드',
    darkMode: '다크 모드',
    open: '열기',
    view: '보기',
    apply: '지원',
    yes: '예',
    no: '아니오',
    available: '가능',
    limited: '제한적',
    connected: '연결됨',
    none: '없음',
    by: '작성자',
    likes: '좋아요',
    statusOpen: '모집중',
    fullTime: '전일제',
    manage: '관리',
    newPost: '새 글',
    postTour: '투어 등록',
    updateProfile: '프로필 수정',
    trackApplications: '지원 현황',
    openDashboard: '대시보드 열기',
    viewMarketplace: '마켓 보기',
    service: '서비스',
    hq: '본사',
    active: '운항 중',
    uploadComplete: '업로드 완료.',
    supabaseOk: 'Supabase 연결됨',
    supabaseMissing: 'Supabase 미설정',
    noResults: '검색 결과가 없습니다.'
  },
  nav: {
    home: '홈',
    dashboard: '대시보드',
    countries: '국가',
    airports: '공항',
    cruiseLines: '크루즈 라인',
    cruisePorts: '크루즈 항구',
    jobs: '채용',
    community: '커뮤니티',
    leaderTools: '리더 도구',
    admin: '관리자'
  },
  sidebar: {
    operationalPulse: '운영 상태',
    systemsOnline: '모든 시스템 정상',
    toursActive: '18개국 42개 투어 진행 중.',
    alertsPending: '긴급 알림 3건 검토 필요.',
    logout: '로그아웃',
    login: '로그인',
    roleTourLeader: '투어 리더',
    roleAgency: '에이전시',
    roleAdmin: '관리자'
  },
  footer: {
    copyright: 'Travel Leader Network (c) 2026',
    community: '커뮤니티',
    leaderTools: '리더 도구'
  },
  home: {
    eyebrow: 'Travel Leader Network',
    title: '전 세계 투어 리더와 크루즈 리더를 위한 운영 플랫폼.',
    subtitle:
      'Supabase 기반의 현대적인 SaaS 플랫폼에서 여행 정보, 투어 관리, 채용 매칭, 커뮤니티 지식을 통합합니다.',
    buttons: {
      dashboard: '대시보드 열기',
      jobs: '채용 마켓 보기',
      community: '커뮤니티 포럼'
    },
    stats: {
      coverage: '커버리지',
      network: '네트워크',
      liveOps: '라이브 운영',
      coverageValue: '120+ 국가',
      networkValue: '8.4k 리더',
      liveOpsValue: '24/7 업데이트'
    },
    focus: {
      eyebrow: '오늘의 운영 포커스',
      title: '지중해 크루즈 턴어라운드',
      body:
        '바르셀로나와 마르세유의 포트 셔틀 타이밍을 모니터링하고, 승객 명단을 확인하며, 육상 투어 인력을 확정하세요.',
      metrics: {
        alerts: '활성 알림',
        tours: '예정 투어',
        matches: '대기 중 매칭',
        alertsValue: '신규 3건',
        toursValue: '12건 출발',
        matchesValue: '리더 6명'
      }
    },
    modules: {
      eyebrow: '핵심 모듈',
      title: '대규모 투어 운영에 필요한 모든 것',
      subtitle: '운영 가이드, 채용 파이프라인, 리더 도구로 바로 이동하세요.',
      cards: {
        countries: {
          title: '국가 가이드',
          body: '비자 규정, 대사관, 긴급 번호.'
        },
        airports: {
          title: '공항 가이드',
          body: '터미널 지도, 라운지, 교통 정보.'
        },
        cruiseLines: {
          title: '크루즈 데이터베이스',
          body: '선박, 서비스 요금, 패키지 비용.'
        },
        cruisePorts: {
          title: '크루즈 항구',
          body: '셔틀, 집결지, 안전 알림.'
        },
        jobs: {
          title: '채용 마켓',
          body: '투어 게시와 리더 채용.'
        },
        community: {
          title: '커뮤니티 포럼',
          body: '지식 공유와 네트워킹.'
        }
      }
    },
    stack: {
      title: '투어 리더 운영 스택',
      bullets: [
        '투어 일정, 승객 명단, 룸 리스트 관리.',
        '항공, 호텔, 크루즈 일정 조율.',
        '비상 대응 매뉴얼과 안전 체크리스트.',
        '중요 문서용 Supabase 스토리지.'
      ],
      agencyTitle: '여행사 전용 기능',
      agencyBody: '여행사는 프로필을 만들고 투어를 게시하며 역할 기반 접근으로 지원서를 관리할 수 있습니다.',
      tags: ['여행사 대시보드', '역할 기반 인증', 'Supabase 스토리지']
    }
  },
  dashboard: {
    eyebrow: '대시보드',
    title: '리더 운영 대시보드',
    subtitle: '알림, 투어, 크루즈 업데이트, 공항 링크, 채용 기회를 한눈에.',
    stats: {
      activeTours: '진행 중 투어',
      activeToursHint: '크루즈 3, 육상 5',
      travelAlerts: '여행 알림',
      travelAlertsHint: '높음 1건',
      openJobs: '모집 공고',
      openJobsHint: '여행사 게시',
      communityPosts: '커뮤니티 글',
      communityPostsHint: '최근 24시간'
    },
    alertsTitle: '여행 알림',
    cruiseUpdatesTitle: '크루즈 업데이트',
    upcomingToursTitle: '예정 투어',
    airportQuickLinksTitle: '공항 빠른 링크',
    jobOpportunitiesTitle: '채용 기회',
    jobOpportunitiesSubtitle: '파트너 여행사가 올린 최신 투어.',
    viewMarketplace: '마켓 보기',
    alerts: [
      {
        title: '로마 교통 파업',
        detail: 'FCO 터미널 지연 예상. 그룹 이동 일정 업데이트.',
        level: '높음'
      },
      {
        title: '태풍 주의보',
        detail: '마닐라 해안 경보; 항구 폐쇄 여부 모니터링.',
        level: '중간'
      },
      {
        title: '브라질 비자 업데이트',
        detail: '일부 국가 대상 e-비자 도입.',
        level: '낮음'
      }
    ],
    cruiseUpdates: [
      'MSC World Europa 연료 할증 업데이트, 4월 1일 적용.',
      '로열 캐리비안, 포트 캐너버럴 야간 셔틀 추가.',
      '싱가포르 기항 승무원 사전 입국 심사 필요.'
    ],
    upcomingTours: [
      { name: '교토 + 오사카 벚꽃', dates: '4월 10일 - 4월 17일' },
      { name: '알래스카 빙하 항해', dates: '5월 2일 - 5월 10일' },
      { name: '바르셀로나 + 프로방스', dates: '5월 18일 - 5월 26일' }
    ],
    airportLinks: ['ICN - 인천', 'NRT - 나리타', 'BCN - 바르셀로나', 'SEA - 시애틀']
  },
  countries: {
    eyebrow: '국가 가이드',
    title: '비자, 대사관, 긴급 정보',
    subtitle: '입국 규정, 대사관 연락처, 긴급 번호를 빠르게 확인.',
    emergencyButton: '긴급 자료',
    visaLabel: '비자',
    embassyLabel: '대사관',
    emergencyLabel: '긴급번호',
    immigrationTipsLabel: '입국 팁',
    immigrationFallback: '출발 전 최신 입국 규정을 확인하세요.'
  },
  airports: {
    eyebrow: '공항 가이드',
    title: '터미널 정보와 교통 인사이트',
    subtitle: '흡연 구역, 라운지, 지상 교통 정보를 리더용으로 정리.',
    button: '크루즈 이동 팁',
    searchPlaceholder: '공항 / 도시 / 국가 / IATA 코드로 검색'
  },
  airport: {
    terminals: '터미널 {{count}}개',
    smokingAreas: '흡연 구역',
    lounges: '라운지',
    subway: '지하철',
    taxi: '택시',
    bus: '버스',
    locationMap: '위치 지도',
    openInMaps: '구글지도에서 보기',
    loadingMap: '지도를 불러오는 중...',
    mapUnavailable: '이 공항의 지도 정보를 찾을 수 없습니다',
    quickFacts: '공항 요약 정보',
    liveLookup: '실시간 수하물·환승 조회',
    flightPlaceholder: '항공편 번호 입력 (예: KE123)',
    lookup: '지금 조회',
    flightRequired: '항공편 번호를 입력하세요.',
    lookupFailed: '조회에 실패했습니다. 잠시 후 다시 시도하세요.',
    belt: '수하물 벨',
    terminal: '터미널',
    gate: '게이트',
    status: '상태',
    notAvailable: '정보 없음',
    indoorMap: '공항 내부 지도',
    tab: {
      location: '위치 지도',
      indoor: '공항 내부',
      immigration: '입국 팁'
    },
    indoor: {
      loading: '내부 시설 데이터를 불러오는 중...',
      noData: '이 공항의 내부 지도 데이터가 아직 없습니다. 공식 사이트에서 확인하세요.',
      officialSite: '공식 공항 사이트 보기',
      floor: '층',
      restroom: '화장실',
      gate: '입국 게이트',
      transit: '환승',
      lounge: '라운지',
      smoking: '흡연소',
      baggage: '짐 찾는 곳',
      info: '안내소',
      exchange: '환전소',
      restaurant: '식당',
      prayer: '기도실',
      openGoogle: '구글 지도에서 보기',
      facilitySearch: '시설 빠른 검색'
    }
  },
  cruise: {
    eyebrow: '크루즈 데이터베이스',
    title: '크루즈 라인과 선박 운영',
    subtitle: '서비스 요금, 와이파이, 음료 패키지, 스페셜티 다이닝 비용.',
    lineDirectoryTitle: '크루즈 라인 목록',
    hqLabel: '본사',
    activeTag: '운항 중',
    costSnapshotTitle: '비용 스냅샷',
    costSnapshotBody: '대표 선박의 선내 비용을 비교합니다. 1인 1일 기준.',
    costLabels: {
      serviceRange: '서비스 요금 범위',
      drinkRange: '음료 패키지',
      wifiRange: '와이파이 패키지'
    },
    featuredTitle: '주요 선박',
    featuredSubtitle: '운영 가격과 수용 인원 정보.',
    viewPorts: '크루즈 항구 보기',
    searchPlaceholder: '크루즈 라인, 선박명 검색...',
    shipsCount: '척',
    linesCount: '개 라인',
    capacity: '수용 인원: {{count}}명',
    serviceCharge: '${{amount}} 서비스',
    drinkPackage: '음료 패키지',
    wifi: '와이파이',
    specialtyDining: '스페셜티 다이닝'
  },
  cruisePorts: {
    eyebrow: '크루즈 항구',
    title: '항만 운영 및 이동 안내',
    subtitle: '셔틀 위치, 택시 승차장, 집결지, 안전 알림.',
    shuttleBus: '셔틀 버스',
    taxiStands: '택시 승차장',
    meetingPoint: '집결지',
    safetyAlerts: '안전 알림',
    searchPlaceholder: '항구, 도시, 국가 검색...',
    portsCount: '개 항구'
  },
  jobs: {
    eyebrow: '채용 마켓',
    title: '여행사와 우수 리더를 연결',
    subtitle: '여행사는 투어를 게시하고, 리더는 지원하고 추적합니다.',
    forAgenciesTitle: '여행사용',
    forAgenciesBullets: [
      '여행사 프로필 작성 및 대표 일정 소개.',
      '투어 요구사항과 일정 게시.',
      '지원서 관리 및 리더 채용.'
    ],
    forLeadersTitle: '투어 리더용',
    forLeadersBullets: [
      '경험과 언어 능력을 포함한 프로필 작성.',
      '투어에 지원하고 상태 추적.',
      '여행사 알림 수신.'
    ],
    postTour: '투어 등록',
    updateProfile: '프로필 수정',
    trackApplications: '지원 현황',
    assignment: '{{country}} 투어 배정'
  },
  community: {
    eyebrow: '커뮤니티 포럼',
    title: '전 세계 리더와 지식 공유',
    subtitle: '크루즈 팁, 공항 팁, 비상 사례, 투어 스토리, 여행 업데이트.',
    newPost: '새 글',
    general: '일반'
  },
  leaderTools: {
    eyebrow: '리더 도구',
    title: '여행의 패러다임은 바뀐다',
    subtitle: '인솔자가 지배하는 여행 세상 — 일정, 승객 명단, 항공 정보, 호텔 정보, 크루즈 일정, 체크리스트.',
    scheduleTitle: '오늘의 일정',
    checklistTitle: '체크리스트 현황',
    scheduleItems: [
      { time: '08:00', task: '호텔 로비 브리핑', location: '그랜드 로비' },
      { time: '10:30', task: '공항 이동 점검', location: '터미널 2' },
      { time: '14:00', task: '승선 지원', location: '포트 게이트 B' },
      { time: '18:30', task: '환영 디너', location: '데크 5 다이닝' }
    ],
    checklistItems: [
      '승객 명단 확인 완료',
      '룸 리스트 배포 완료',
      '비상 연락처 업데이트',
      '셔틀 버스 시간 확인',
      '크루즈 일정 브리핑 준비'
    ],
    passengerListTitle: '승객 명단',
    passengerListSubtitle: '28명 · VIP 2명 · 특별 지원 1명',
    flightInfoTitle: '항공 정보',
    flightInfoSubtitle: 'KE901 · 서울 → 도쿄 · 14:20 도착',
    hotelInfoTitle: '호텔 정보',
    hotelInfoSubtitle: '오션 베이 리조트 · 체크인 15:00 · 40객실',
    cruiseItineraryTitle: '크루즈 일정',
    cruiseItinerarySubtitle: '3일차: 요코하마 → 시미즈 → 오사카',
    operationalNotesTitle: '운영 노트',
    operationalNotesSubtitle: '항만 이동 변경과 게스트 식사 요청을 확인하세요.',
    buttons: {
      openManifest: '명단 열기',
      viewArrivals: '도착 보기',
      roomingList: '룸 리스트',
      openItinerary: '일정 열기',
      openNotes: '노트 열기'
    },
    aiSchedule: {
      title: 'AI 스케쥴 추천',
      subtitle: 'Claude AI가 목적지와 투어 조건에 맞는 운영 일정을 생성합니다.',
      destinationLabel: '목적지',
      destinationPlaceholder: '예: 도쿄, 일본',
      tripTypeLabel: '투어 유형',
      tripTypes: {
        land_tour: '육상 투어',
        cruise: '크루즈',
        city_tour: '시티 투어',
        airport_transfer: '공항 이동'
      },
      durationLabel: '기간 (일)',
      passengerLabel: '승객 수',
      notesLabel: '특이사항 (선택)',
      notesPlaceholder: '예: VIP 2명, 휠체어 이용자 1명',
      generateBtn: 'AI 추천 받기',
      generating: 'AI 분석 중...',
      resultTitle: 'AI 추천 일정',
      day: '일차',
      tips: '운영 팁',
      checklist: '체크리스트',
      errorTitle: '오류',
      typeIcon: {
        transport: '🚌',
        activity: '📍',
        meal: '🍽️',
        accommodation: '🏨'
      },
      budgetLabel: '예산 (1인 기준, USD)',
      budgetPlaceholder: '예: 500',
      currencyLabel: '통화',
      shoreExcursionLabel: '기항지 관광 방식 (크루즈)',
      shoreOptions: {
        guided: '가이드 투어 포함',
        free: '자유여행',
        mixed: '혼합 (오전 투어 + 오후 자유)'
      },
      budgetTitle: '예산 계획표',
      budgetItem: '항목',
      budgetEstimate: '예상 금액',
      budgetNote: '비고',
      budgetTotal: '합계',
      budgetPerPax: '1인 기준',
      budgetGroup: '단체 기준 ({{count}}명)'
    }
  },
  admin: {
    eyebrow: '관리자 콘솔',
    title: '플랫폼 관리 센터',
    subtitle: '사용자, 운영 콘텐츠, 채용 활동을 관리합니다.',
    stats: {
      activeUsers: '활성 사용자',
      activeUsersHint: '온라인 73명',
      contentUpdates: '콘텐츠 업데이트',
      contentUpdatesHint: '최근 7일',
      openJobs: '모집 공고',
      openJobsHint: '여행사 게시'
    },
    modules: [
      {
        title: '사용자 및 역할',
        description: '접근 승인, 역할 부여, 활동 모니터링.',
        actions: ['tour_leader', 'agency', 'admin']
      },
      {
        title: '국가',
        description: '비자 규정, 대사관 연락처, 긴급 번호 관리.',
        actions: ['편집', '게시', '보관']
      },
      {
        title: '공항',
        description: '터미널 수, 라운지, 교통 정보 업데이트.',
        actions: ['가져오기', '감사', '게시']
      },
      {
        title: '크루즈 선박',
        description: '수용 인원, 패키지, 선내 비용 업데이트.',
        actions: ['검토', '승인', '게시']
      },
      {
        title: '항구',
        description: '셔틀 위치, 택시 승차장, 안전 알림 관리.',
        actions: ['확인', '업데이트', '공지']
      },
      {
        title: '커뮤니티 글',
        description: '포럼 콘텐츠를 검토하고 인사이트를 강조.',
        actions: ['모더레이션', '추천', '해결']
      }
    ]
  },
  education: {
    eyebrow: '교육',
    title: '리더 교육 허브',
    subtitle: '운영 매뉴얼, 체크리스트, 트레이닝 모듈.',
    cards: [
      {
        title: '투어 일정 설계',
        body: '시간대별 일정에 버퍼 타임을 포함하세요.'
      },
      {
        title: '비상 대응 훈련',
        body: '의료/여권 이슈의 에스컬레이션 절차를 점검합니다.'
      },
      {
        title: '크루즈 턴어라운드',
        body: '수하물 드롭, 체크인, 승선 동선을 조율합니다.'
      }
    ]
  },
  emergency: {
    eyebrow: '긴급 지원',
    title: '리더용 긴급 리소스',
    subtitle: '대사관 연락처, 여권 분실 절차, 주요 위치 빠른 안내.',
    procedureTitle: '여권 분실 절차',
    procedureSteps: [
      '가까운 경찰서에 분실 신고를 합니다.',
      '대사관 제출용 경찰 신고서를 확보합니다.',
      '대사관에 연락해 긴급 여권 방문을 예약합니다.',
      '여행 서류 디지털 사본을 준비합니다.'
    ],
    contactsTitle: '긴급 연락처',
    contactsLines: [
      '경찰: 110 (JP), 911 (PH)',
      '구급: 119 (JP), 911 (PH)',
      '병원: 03-3503-8481 (도쿄), 02-8527-8000 (마닐라)',
      '관광 경찰: 8-524-1660 (PH)'
    ],
    embassyTitle: '대사관 연락처',
    embassies: [
      {
        name: '주일 미국 대사관',
        phone: '+81-3-3224-5000',
        address: '1-10-5 Akasaka, Minato-ku'
      },
      {
        name: '주필리핀 미국 대사관',
        phone: '+63-2-301-2000',
        address: '1201 Roxas Blvd, Manila'
      }
    ]
  },
  routes: {
    eyebrow: '동선 브리프',
    title: '리더용 동선 카드',
    subtitle: '현장 이동 경로를 카드로 공유해 빠르게 전달하세요.',
    searchPlaceholder: '동선 검색',
    dashboard: '대시보드',
    start: '출발',
    end: '도착',
    waypoints: '경유지',
    notes: '메모',
    openMaps: '구글 지도 열기',
    copyLink: '링크 복사'
  },
  cruiseTerminals: {
    eyebrow: '크루즈 터미널',
    title: '크루즈 터미널 가이드',
    subtitle: '수하물 드롭, 체크인 카운터, 보안, 탑승 게이트, 지도 안내.',
    luggageDrop: '수하물 드롭',
    checkIn: '체크인',
    security: '보안',
    boarding: '탑승',
    luggageClaim: '수하물 수령'
  },
  dashboardApplications: {
    eyebrow: '지원 현황',
    title: '지원한 투어 관리',
    subtitle: '지원 상태와 여행사 응답을 확인합니다.',
    status: '상태',
    items: [
      {
        title: '일본 봄 시즌 투어 리더',
        status: '대기 중',
        submitted: '제출 2026-02-28'
      },
      {
        title: '마닐라 크루즈 에스코트',
        status: '면접 예정',
        submitted: '제출 2026-02-20'
      }
    ]
  },
  dashboardMessages: {
    eyebrow: '메시지',
    title: '여행사 및 리더 커뮤니케이션',
    subtitle: '투어 관련 메시지를 한 곳에서 관리합니다.',
    items: [
      {
        sender: '블루 컴퍼스 트래블',
        body: '\"4월 10일 가능 여부를 확인해 주세요.\"',
        time: '2시간 전'
      },
      {
        sender: '웨이브링크 크루즈',
        body: '\"3월 15일 면접이 예정되었습니다.\"',
        time: '어제'
      }
    ]
  },
  dashboardMyTours: {
    eyebrow: '내 투어',
    title: '예정 투어 일정',
    subtitle: '일정, 승객 명단, 운영 체크리스트를 관리합니다.',
    tours: [
      {
        title: '교토 + 도쿄 봄 시즌',
        dates: '4월 10일 - 4월 17일',
        items: ['1일차: 도착 및 호텔 체크인', '2일차: 교토 문화 투어', '3일차: 나라 일정']
      },
      {
        title: '마닐라 크루즈 에스코트',
        dates: '5월 1일 - 5월 5일',
        items: ['1일차: 터미널 체크인 지원', '2일차: 기항지 투어 조율', '3일차: 하선 지원']
      }
    ]
  },
  dashboardSavedGuides: {
    eyebrow: '저장한 가이드',
    title: '저장된 운영 가이드',
    subtitle: '자주 사용하는 국가/공항/크루즈 자료에 빠르게 접근하세요.',
    guides: [
      {
        title: '도쿄 하네다 공항 가이드',
        body: '터미널 지도, 라운지, 환승 동선.'
      },
      {
        title: '요코하마 크루즈 항구 브리프',
        body: '셔틀 일정 및 집결지 안내.'
      },
      {
        title: '일본 비자 요건',
        body: '최신 입국 안내와 반입 금지 품목.'
      }
    ]
  },
  login: {
    eyebrow: '접속',
    title: 'Travel Leader Network 로그인',
    subtitle: 'Supabase 자격 증명으로 리더 도구와 여행사 포털에 접속하세요.',
    emailLabel: '이메일',
    passwordLabel: '비밀번호',
    roleLabel: '역할',
    roleOptions: {
      tourLeader: '투어 리더',
      agency: '여행사',
      admin: '관리자'
    },
    signIn: '로그인',
    signingIn: '처리 중...',
    createAccount: '계정 만들기',
    confirmEmail: '가입 확인을 위해 이메일을 확인하세요.',
    emailPasswordRequired: '이메일과 비밀번호를 입력해주세요.'
  }
};
