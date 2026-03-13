# Travel Leader Network

Production-ready SaaS platform for tour leaders and cruise tour leaders to access operational travel information and connect with travel agencies.

## Tech Stack
- Frontend: Nuxt 3 + Vue 3 + Tailwind CSS + Pinia
- Backend: Node.js (Express) + Supabase PostgreSQL
- Auth: Supabase Auth
- Storage: Supabase Storage
- Maps: Mapbox
- Mobile: Capacitor

## Folder Structure
```
travel-leader-network
  frontend/
    pages/
    components/
    layouts/
    composables/
    stores/
  backend/
    api/
    src/
  database/
    schema.sql
    seed.sql
  admin/
  mobile/
```

## Setup

1) Install dependencies

```bash
npm install
```

2) Configure environment variables

Frontend (`frontend/.env`):
```
NUXT_PUBLIC_API_BASE=http://localhost:4000
NUXT_PUBLIC_SUPABASE_URL=
NUXT_PUBLIC_SUPABASE_ANON_KEY=
NUXT_PUBLIC_MAPBOX_TOKEN=
```

Backend (`backend/.env`):
```
PORT=4000
CORS_ORIGIN=http://localhost:3000,http://localhost:3100
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_BYPASS_AUTH=true
```

Admin (`admin/.env`):
```
NUXT_PUBLIC_API_BASE=http://localhost:4000
NUXT_PUBLIC_SUPABASE_URL=
NUXT_PUBLIC_SUPABASE_ANON_KEY=
```

3) Initialize database

- Run `database/schema.sql` in your Supabase SQL editor.
- Run `database/seed.sql` to load sample data.
  - To regenerate seed data: `node database/generate-seed.js`

Seed data includes:
- 500 airports
- 300 cruise ships
- 500 cruise ports
- 50 tour jobs
- 20 agencies
- Embassies for all seeded countries

4) Run dev servers

```bash
npm run dev
```

- 웹 앱: http://localhost:3000
- API: http://localhost:4000
- 관리자(Admin): http://localhost:3100 (별도 실행: `npm run dev:admin`)

## Authentication Roles
- `leader`
- `agency`
- `admin`

Roles are stored in Supabase user metadata (`role`).

## Mobile (Capacitor)

```bash
npm run build -w frontend
npm run sync -w mobile
npm run open:ios -w mobile
npm run open:android -w mobile
```

## API Documentation
See `backend/api/routes.md`.
