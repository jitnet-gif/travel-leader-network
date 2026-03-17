export default {
  common: {
    search: 'Search',
    searchPlaceholder: 'Type to filter',
    close: 'Close',
    menu: 'Menu',
    lightMode: 'Light Mode',
    darkMode: 'Dark Mode',
    open: 'Open',
    view: 'View',
    apply: 'Apply',
    yes: 'Yes',
    no: 'No',
    available: 'Available',
    limited: 'Limited',
    connected: 'Connected',
    none: 'None',
    by: 'By',
    likes: 'likes',
    statusOpen: 'Open',
    fullTime: 'Full-time',
    manage: 'Manage',
    newPost: 'New post',
    postTour: 'Post a tour',
    updateProfile: 'Update profile',
    trackApplications: 'Track applications',
    openDashboard: 'Open Dashboard',
    viewMarketplace: 'View marketplace',
    service: 'service',
    hq: 'HQ',
    active: 'Active',
    uploadComplete: 'Upload complete.',
    supabaseOk: 'Supabase ready',
    supabaseMissing: 'Supabase not configured',
    noResults: 'No results found.'
  },
  nav: {
    home: 'Home',
    dashboard: 'Dashboard',
    countries: 'Countries',
    airports: 'Airports',
    cruiseLines: 'Cruise Lines',
    cruisePorts: 'Cruise Ports',
    jobs: 'Jobs',
    community: 'Community',
    leaderTools: 'Leader Tools',
    admin: 'Admin'
  },
  sidebar: {
    operationalPulse: 'Operational Pulse',
    systemsOnline: 'All systems online',
    toursActive: '42 tours active across 18 countries.',
    alertsPending: '3 urgent alerts pending review.',
    logout: 'Sign Out',
    login: 'Sign In',
    roleTourLeader: 'Tour Leader',
    roleAgency: 'Agency',
    roleAdmin: 'Admin'
  },
  footer: {
    copyright: 'Travel Leader Network (c) 2026',
    community: 'Community',
    leaderTools: 'Leader Tools'
  },
  home: {
    eyebrow: 'Travel Leader Network',
    title: 'Global operations for tour leaders and cruise leaders.',
    subtitle:
      'Centralize travel intelligence, tour management, job matching, and community knowledge in one modern SaaS platform backed by Supabase.',
    buttons: {
      dashboard: 'Open Dashboard',
      jobs: 'Browse Job Marketplace',
      community: 'Community Forum'
    },
    stats: {
      coverage: 'Coverage',
      network: 'Network',
      liveOps: 'Live ops',
      coverageValue: '120+ countries',
      networkValue: '8.4k leaders',
      liveOpsValue: '24/7 updates'
    },
    focus: {
      eyebrow: "Today's command focus",
      title: 'Mediterranean cruise turn-around',
      body:
        'Monitor port shuttle timing, review guest manifest, and confirm shore excursion staffing for Barcelona and Marseille.',
      metrics: {
        alerts: 'Active alerts',
        tours: 'Upcoming tours',
        matches: 'Pending job matches',
        alertsValue: '3 new',
        toursValue: '12 departures',
        matchesValue: '6 leaders'
      }
    },
    modules: {
      eyebrow: 'Core Modules',
      title: 'Everything you need to run tours at scale',
      subtitle: 'Jump straight into operational guides, job pipelines, and leader tools.',
      cards: {
        countries: {
          title: 'Country Guides',
          body: 'Visa rules, embassies, and emergency numbers.'
        },
        airports: {
          title: 'Airport Guide',
          body: 'Terminal maps, lounges, and transit info.'
        },
        cruiseLines: {
          title: 'Cruise Database',
          body: 'Ships, service charges, and package costs.'
        },
        cruisePorts: {
          title: 'Cruise Ports',
          body: 'Shuttles, meeting points, and safety alerts.'
        },
        jobs: {
          title: 'Job Marketplace',
          body: 'Post tours and hire qualified leaders.'
        },
        community: {
          title: 'Community Forum',
          body: 'Share knowledge, ask questions, and network.'
        }
      }
    },
    stack: {
      title: 'Tour leader operations stack',
      bullets: [
        'Tour schedule, passenger manifests, and rooming lists.',
        'Flight, hotel, and cruise itinerary coordination.',
        'Emergency playbooks and safety checklists.',
        'Supabase-powered storage for critical documents.'
      ],
      agencyTitle: 'Built for agencies',
      agencyBody: 'Agencies can create profiles, publish tours, and manage applications with role-based access.',
      tags: ['Agency dashboards', 'Role-based auth', 'Supabase storage']
    }
  },
  dashboard: {
    eyebrow: 'Dashboard',
    title: 'Leader operations dashboard',
    subtitle: 'Track alerts, tours, cruise updates, airport quick links, and job opportunities.',
    stats: {
      activeTours: 'Active Tours',
      activeToursHint: '3 cruise, 5 land',
      travelAlerts: 'Travel Alerts',
      travelAlertsHint: '1 high priority',
      openJobs: 'Open Jobs',
      openJobsHint: 'Agency postings',
      communityPosts: 'Community Posts',
      communityPostsHint: 'Last 24 hours'
    },
    alertsTitle: 'Travel alerts',
    cruiseUpdatesTitle: 'Cruise updates',
    upcomingToursTitle: 'Upcoming tours',
    airportQuickLinksTitle: 'Airport quick links',
    jobOpportunitiesTitle: 'Job opportunities',
    jobOpportunitiesSubtitle: 'Latest tours posted by partner agencies.',
    viewMarketplace: 'View marketplace',
    alerts: [
      {
        title: 'Rome transit strike',
        detail: 'Expect delays at FCO terminals. Update group transfers.',
        level: 'High'
      },
      {
        title: 'Typhoon advisory',
        detail: 'Manila coastline under watch; monitor port closures.',
        level: 'Medium'
      },
      {
        title: 'Visa update: Brazil',
        detail: 'New e-visa rollout for select countries.',
        level: 'Low'
      }
    ],
    cruiseUpdates: [
      'MSC World Europa fuel surcharge update effective April 1.',
      'Royal Caribbean adds late-night shuttle at Port Canaveral.',
      'Crew immigration pre-clearance required for Singapore calls.'
    ],
    upcomingTours: [
      { name: 'Kyoto + Osaka Blossoms', dates: 'Apr 10 - Apr 17' },
      { name: 'Alaska Glacier Voyage', dates: 'May 2 - May 10' },
      { name: 'Barcelona + Provence', dates: 'May 18 - May 26' }
    ],
    airportLinks: ['ICN - Incheon', 'NRT - Narita', 'BCN - Barcelona', 'SEA - Seattle']
  },
  countries: {
    eyebrow: 'Countries Guide',
    title: 'Visa, embassy, and emergency intelligence',
    subtitle: 'Quick access to entry rules, embassy contacts, and emergency numbers.',
    emergencyButton: 'Emergency Resources',
    visaLabel: 'Visa',
    embassyLabel: 'Embassy',
    emergencyLabel: 'Emergency',
    immigrationTipsLabel: 'Immigration tips',
    immigrationFallback: 'Check latest entry rules before departure.'
  },
  airports: {
    eyebrow: 'Airport Guide',
    title: 'Terminal intelligence and transport insights',
    subtitle: 'Smoking areas, lounges, and ground transport mapped for leaders on the move.',
    button: 'Cruise transfer tips',
    searchPlaceholder: 'Search by airport, city, country, or IATA'
  },
  airport: {
    terminals: '{{count}} terminals',
    smokingAreas: 'Smoking areas',
    lounges: 'Lounges',
    subway: 'Subway',
    taxi: 'Taxi',
    bus: 'Bus',
    locationMap: 'Location map',
    openInMaps: 'Open in Google Maps',
    loadingMap: 'Loading map...',
    mapUnavailable: 'Map not available for this airport yet',
    quickFacts: 'Airport quick facts',
    liveLookup: 'Live baggage & transfer lookup',
    flightPlaceholder: 'Enter flight number (e.g. KE123)',
    lookup: 'Check now',
    flightRequired: 'Please enter a flight number.',
    lookupFailed: 'Lookup failed. Try again in a moment.',
    belt: 'Baggage belt',
    terminal: 'Terminal',
    gate: 'Gate',
    status: 'Status',
    notAvailable: 'N/A',
    indoorMap: 'Airport Indoor Map',
    tab: {
      location: 'Location',
      indoor: 'Indoor Map',
      immigration: 'Entry Tips',
      culture: 'Dress & Drinks'
    },
    indoor: {
      loading: 'Loading indoor facility data...',
      noData: 'No indoor map data available for this airport yet. Check the official site.',
      officialSite: 'View official airport site',
      floor: 'Floor',
      restroom: 'Restrooms',
      gate: 'Arrival Gates',
      transit: 'Transit',
      lounge: 'Lounge',
      smoking: 'Smoking Area',
      baggage: 'Baggage Claim',
      info: 'Information',
      exchange: 'Currency Exchange',
      restaurant: 'Restaurants',
      prayer: 'Prayer Room',
      openGoogle: 'Open in Google Maps',
      facilitySearch: 'Facility Quick Search'
    }
  },
  cruise: {
    eyebrow: 'Cruise Database',
    title: 'Cruise lines and ship operations',
    subtitle: 'Service charges, WiFi pricing, drink packages, and specialty dining costs.',
    lineDirectoryTitle: 'Cruise line directory',
    hqLabel: 'HQ',
    activeTag: 'Active',
    costSnapshotTitle: 'Cost snapshot',
    costSnapshotBody: 'Compare onboard costs across top ships. Pricing shown per guest per day.',
    costLabels: {
      serviceRange: 'Service charge range',
      drinkRange: 'Drink packages',
      wifiRange: 'WiFi packages'
    },
    featuredTitle: 'Featured cruise ships',
    featuredSubtitle: 'Operational pricing and capacity details.',
    viewPorts: 'View cruise ports',
    searchPlaceholder: 'Search cruise lines, ships...',
    shipsCount: 'ships',
    linesCount: 'lines',
    capacity: 'Capacity: {{count}} guests',
    serviceCharge: '${{amount}} service',
    drinkPackage: 'Drink package',
    wifi: 'WiFi',
    specialtyDining: 'Specialty dining'
  },
  cruisePorts: {
    eyebrow: 'Cruise Ports',
    title: 'Port operations and transfer guidance',
    subtitle: 'Shuttle locations, taxi stands, meeting points, and safety alerts for port calls.',
    shuttleBus: 'Shuttle bus',
    taxiStands: 'Taxi stands',
    meetingPoint: 'Meeting point',
    safetyAlerts: 'Safety alerts',
    searchPlaceholder: 'Search ports, cities, countries...',
    portsCount: 'ports'
  },
  jobs: {
    eyebrow: 'Job Marketplace',
    title: 'Match agencies with elite tour leaders',
    subtitle: 'Agencies post tours. Leaders apply, track, and get hired quickly.',
    forAgenciesTitle: 'For travel agencies',
    forAgenciesBullets: [
      'Create an agency profile and highlight signature itineraries.',
      'Post tour requirements and onboarding timelines.',
      'Manage applications and hire qualified leaders.'
    ],
    forLeadersTitle: 'For tour leaders',
    forLeadersBullets: [
      'Create a profile with experience and language skills.',
      'Apply to tours and track application status.',
      'Receive notifications from agencies.'
    ],
    postTour: 'Post a tour',
    updateProfile: 'Update profile',
    trackApplications: 'Track applications',
    assignment: '{{country}} tour assignment'
  },
  community: {
    eyebrow: 'Community Forum',
    title: 'Share knowledge with leaders worldwide',
    subtitle: 'Cruise tips, airport tips, emergency cases, tour stories, and travel updates.',
    newPost: 'New post',
    general: 'General'
  },
  leaderTools: {
    eyebrow: 'Leader Tools',
    title: 'The Travel Paradigm Shifts',
    subtitle: 'A World Where Tour Leaders Rule — Schedules, passenger lists, flight details, hotel info, cruise itineraries, and checklists.',
    scheduleTitle: "Today's schedule",
    checklistTitle: 'Checklist status',
    scheduleItems: [
      { time: '08:00', task: 'Hotel lobby briefing', location: 'Grand Lobby' },
      { time: '10:30', task: 'Airport transfer check', location: 'Terminal 2' },
      { time: '14:00', task: 'Embarkation support', location: 'Port gate B' },
      { time: '18:30', task: 'Welcome dinner', location: 'Deck 5 dining' }
    ],
    checklistItems: [
      'Passenger manifests verified',
      'Rooming lists distributed',
      'Emergency contacts updated',
      'Shuttle bus timing confirmed',
      'Cruise itinerary briefing ready'
    ],
    passengerListTitle: 'Passenger list',
    passengerListSubtitle: '28 guests · 2 VIPs · 1 special assistance',
    flightInfoTitle: 'Flight information',
    flightInfoSubtitle: 'KE901 · Seoul to Tokyo · Arrives 14:20',
    hotelInfoTitle: 'Hotel info',
    hotelInfoSubtitle: 'Ocean Bay Resort · Check-in 15:00 · 40 rooms',
    cruiseItineraryTitle: 'Cruise itinerary',
    cruiseItinerarySubtitle: 'Day 3: Yokohama → Shimizu → Osaka',
    operationalNotesTitle: 'Operational notes',
    operationalNotesSubtitle: 'Review port transfer changes and guest meal requests.',
    buttons: {
      openManifest: 'Open manifest',
      viewArrivals: 'View arrivals',
      roomingList: 'Rooming list',
      openItinerary: 'Open itinerary',
      openNotes: 'Open notes'
    },
    aiSchedule: {
      title: 'AI Schedule Recommendation',
      subtitle: 'Claude AI generates an operational schedule tailored to your destination and tour conditions.',
      destinationLabel: 'Destination',
      destinationPlaceholder: 'e.g. Tokyo, Japan',
      tripTypeLabel: 'Tour Type',
      tripTypes: {
        land_tour: 'Land Tour',
        cruise: 'Cruise',
        city_tour: 'City Tour',
        airport_transfer: 'Airport Transfer'
      },
      durationLabel: 'Duration (days)',
      passengerLabel: 'Passengers',
      notesLabel: 'Notes (optional)',
      notesPlaceholder: 'e.g. 2 VIPs, 1 wheelchair user',
      generateBtn: 'Get AI Recommendation',
      generating: 'AI analyzing...',
      resultTitle: 'AI Recommended Schedule',
      day: 'Day',
      tips: 'Operational Tips',
      checklist: 'Checklist',
      errorTitle: 'Error',
      typeIcon: {
        transport: '🚌',
        activity: '📍',
        meal: '🍽️',
        accommodation: '🏨'
      },
      budgetLabel: 'Budget per person (USD)',
      budgetPlaceholder: 'e.g. 500',
      currencyLabel: 'Currency',
      shoreExcursionLabel: 'Shore Excursion Type (Cruise)',
      shoreOptions: {
        guided: 'Guided Tour',
        free: 'Free Time',
        mixed: 'Mixed (Morning Tour + Afternoon Free)'
      },
      budgetTitle: 'Budget Breakdown',
      budgetItem: 'Item',
      budgetEstimate: 'Estimated Cost',
      budgetNote: 'Notes',
      budgetTotal: 'Total',
      budgetPerPax: 'Per person',
      budgetGroup: 'Group ({{count}} pax)'
    }
  },
  admin: {
    eyebrow: 'Admin Console',
    title: 'Platform management center',
    subtitle: 'Manage users, operational content, and marketplace activity.',
    stats: {
      activeUsers: 'Active Users',
      activeUsersHint: '73 online',
      contentUpdates: 'Content Updates',
      contentUpdatesHint: 'Last 7 days',
      openJobs: 'Open Jobs',
      openJobsHint: 'Agency postings'
    },
    modules: [
      {
        title: 'Users & Roles',
        description: 'Approve access, assign roles, and monitor activity.',
        actions: ['tour_leader', 'agency', 'admin']
      },
      {
        title: 'Countries',
        description: 'Maintain visa rules, embassy contacts, and emergency numbers.',
        actions: ['Edit', 'Publish', 'Archive']
      },
      {
        title: 'Airports',
        description: 'Update terminal counts, lounges, and ground transport data.',
        actions: ['Import', 'Audit', 'Publish']
      },
      {
        title: 'Cruise Ships',
        description: 'Update ship capacity, packages, and onboard pricing.',
        actions: ['Review', 'Approve', 'Publish']
      },
      {
        title: 'Ports',
        description: 'Manage shuttle locations, taxi stands, and safety alerts.',
        actions: ['Verify', 'Update', 'Notify']
      },
      {
        title: 'Community Posts',
        description: 'Moderate forum content and highlight top insights.',
        actions: ['Moderate', 'Feature', 'Resolve']
      }
    ]
  },
  education: {
    eyebrow: 'Education',
    title: 'Leader education hub',
    subtitle: 'Operational playbooks, checklists, and training modules.',
    cards: [
      {
        title: 'Tour Schedule Planning',
        body: 'Create hour-by-hour itineraries with buffer time.'
      },
      {
        title: 'Emergency Drill',
        body: 'Practice escalation paths for medical and passport cases.'
      },
      {
        title: 'Cruise Turnaround',
        body: 'Coordinate luggage drop, check-in, and boarding sequences.'
      }
    ]
  },
  emergency: {
    eyebrow: 'Emergency Assistance',
    title: 'Emergency resources for leaders',
    subtitle: 'Embassy contacts, lost passport procedures, and quick navigation to key locations.',
    procedureTitle: 'Passport Lost Procedure',
    procedureSteps: [
      'Report loss at the nearest police station.',
      'Secure a police report for embassy processing.',
      'Contact the embassy and schedule an emergency passport visit.',
      'Keep digital copies of travel documents for verification.'
    ],
    contactsTitle: 'Emergency Contacts',
    contactsLines: [
      'Police: 110 (JP), 911 (PH)',
      'Ambulance: 119 (JP), 911 (PH)',
      'Hospital: 03-3503-8481 (Tokyo), 02-8527-8000 (Manila)',
      'Tourist police: 8-524-1660 (PH)'
    ],
    embassyTitle: 'Embassy Contacts',
    embassies: [
      {
        name: 'US Embassy Tokyo',
        phone: '+81-3-3224-5000',
        address: '1-10-5 Akasaka, Minato-ku'
      },
      {
        name: 'US Embassy Manila',
        phone: '+63-2-301-2000',
        address: '1201 Roxas Blvd, Manila'
      }
    ]
  },
  routes: {
    eyebrow: 'Route Briefs',
    title: 'Route cards for leaders',
    subtitle: 'Share on-site movement routes quickly with compact cards.',
    searchPlaceholder: 'Search routes',
    dashboard: 'Dashboard',
    start: 'Start',
    end: 'End',
    waypoints: 'Waypoints',
    notes: 'Notes',
    openMaps: 'Open in Google Maps',
    copyLink: 'Copy Link'
  },
  cruiseTerminals: {
    eyebrow: 'Cruise Terminals',
    title: 'Cruise terminal guide',
    subtitle: 'Luggage drop, check-in counters, security checkpoints, boarding gates, and maps.',
    luggageDrop: 'Luggage drop',
    checkIn: 'Check-in',
    security: 'Security',
    boarding: 'Boarding',
    luggageClaim: 'Luggage claim'
  },
  dashboardApplications: {
    eyebrow: 'Applications',
    title: 'Track your job applications',
    subtitle: 'Monitor application status and agency responses.',
    status: 'Status',
    items: [
      {
        title: 'Japan Spring Tour Leader',
        status: 'Pending',
        submitted: 'Submitted 2026-02-28'
      },
      {
        title: 'Manila Cruise Escort',
        status: 'Interview Scheduled',
        submitted: 'Submitted 2026-02-20'
      }
    ]
  },
  dashboardMessages: {
    eyebrow: 'Messages',
    title: 'Agency and leader communications',
    subtitle: 'Keep all tour communication in one place.',
    items: [
      {
        sender: 'Blue Compass Travel',
        body: '\"Can you confirm your availability for Apr 10?\"',
        time: '2 hours ago'
      },
      {
        sender: 'WaveLink Cruises',
        body: '\"Interview scheduled for March 15.\"',
        time: 'Yesterday'
      }
    ]
  },
  dashboardMyTours: {
    eyebrow: 'My Tours',
    title: 'Upcoming tour schedule',
    subtitle: 'Manage schedules, passenger lists, and operational checklists.',
    tours: [
      {
        title: 'Kyoto + Tokyo Spring',
        dates: 'Apr 10 - Apr 17',
        items: ['Day 1: Arrival + hotel check-in', 'Day 2: Kyoto cultural tour', 'Day 3: Nara excursion']
      },
      {
        title: 'Manila Cruise Escort',
        dates: 'May 1 - May 5',
        items: ['Day 1: Terminal check-in support', 'Day 2: Shore excursion coordination', 'Day 3: Disembarkation support']
      }
    ]
  },
  dashboardSavedGuides: {
    eyebrow: 'Saved Guides',
    title: 'Saved operational guides',
    subtitle: 'Quick access to your most-used country, airport, and cruise references.',
    guides: [
      {
        title: 'Tokyo Haneda Airport Guide',
        body: 'Terminal maps, lounges, and transit routes.'
      },
      {
        title: 'Yokohama Cruise Port Brief',
        body: 'Shuttle schedule and meeting points.'
      },
      {
        title: 'Japan Visa Requirements',
        body: 'Updated entry guidance and prohibited items.'
      }
    ]
  },
  login: {
    eyebrow: 'Access',
    title: 'Sign in to Travel Leader Network',
    subtitle: 'Use your Supabase credentials to access leader tools and agency portals.',
    emailLabel: 'Email',
    passwordLabel: 'Password',
    roleLabel: 'Role',
    roleOptions: {
      tourLeader: 'Tour Leader',
      agency: 'Agency',
      admin: 'Admin'
    },
    signIn: 'Sign In',
    signingIn: 'Please wait...',
    createAccount: 'Create Account',
    confirmEmail: 'Check your email to confirm sign-up.',
    emailPasswordRequired: 'Please enter email and password.'
  },
  chatbot: {
    name: 'Tour Genie',
    title: 'Tour Genie AI Assistant',
    welcome: 'Hello!',
    subtitle: 'Ask anything about airports, immigration, cruises, or tours.<br>Press the mic to talk with voice.',
    placeholder: 'Type a message...',
    ready: 'Genie',
    masterResponse: 'Yes, Master',
    listening: 'Listening',
    speaking: 'Speaking',
    voiceTts: 'Voice TTS',
    close: 'Close'
  }
};
