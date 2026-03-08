# InnoApp Landing Monorepo

Monorepo with two root folders only:

- `front/`: Vite + React + TypeScript landing page
- `back/`: Node.js + Express + MongoDB API

## Requirements

- Node.js 18 or newer
- npm 9 or newer
- MongoDB running locally or remotely

## Environment Variables

### Backend (`back/.env`)

Use `back/.env.example` as reference:

```env
MONGO_URI=mongodb://localhost:27017/innoapp
PORT=4000
CORS_ORIGIN=http://localhost:5173
```

### Frontend (`front/.env`)

Use `front/.env.example` as reference:

```env
VITE_API_URL=http://localhost:4000
```

## Run Backend

```bash
cd back
npm install
npm run dev
```

API base URL: `http://localhost:4000`

- `GET /health` -> `{ ok: true, timestamp }`
- `POST /api/contact` -> saves contact message in MongoDB

Payload:

```json
{
  "name": "Jane Doe",
  "email": "jane@company.com",
  "message": "I want a demo"
}
```

## Run Frontend

```bash
cd front
npm install
npm run dev
```

App URL: `http://localhost:5173`

The contact form sends data to `${VITE_API_URL}/api/contact`.

## Build Frontend

```bash
cd front
npm run build
npm run preview
```
