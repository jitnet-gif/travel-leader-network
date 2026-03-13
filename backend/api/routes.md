# Travel Leader Network API

Base URL: `http://localhost:4000`

## Public

- `GET /health`
- `GET /api/countries`
- `GET /api/airports`
- `GET /api/cruise-lines`
- `GET /api/cruise-ports`
- `GET /api/cruise-terminals`
- `GET /api/embassies`
- `GET /api/jobs`
- `GET /api/community-posts`
- `GET /api/route-briefs`

## Authenticated

- `POST /api/jobs` (role: agency, admin)
- `POST /api/applications` (role: leader, admin)
- `POST /api/community-posts` (role: leader, agency, admin)
- `POST /api/route-briefs` (role: agency, admin)
- `GET /api/applications`
