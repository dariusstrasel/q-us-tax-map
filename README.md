# q-us-tax-map

Monorepo for a **US Taxation Map** demo:

- **Backend**: NestJS service providing map data, CSV upload, and random scenario APIs.
- **Frontend**: React + TypeScript + Vite SPA that renders an SVG US map and colors states.
- **Tests**:
  - Backend Jest e2e tests (Nest testing module + Supertest).
  - Frontend Cypress e2e test for map rendering and interaction.
- **RPG**: A lightweight Repository Planning Graph (`rpg/index.json`) used to keep modules and tests aligned.

---

## Monorepo Structure


q-us-tax-map/
├── backend/                 # NestJS backend
│   ├── src/
│   │   ├── main.ts
│   │   ├── app.module.ts
│   │   ├── map/
│   │   │   ├── map.module.ts
│   │   │   ├── map.controller.ts
│   │   │   └── map.service.ts
│   │   ├── csv/
│   │   ├── scenario/
│   │   └── static/
│   ├── public/
│   │   ├── index.html       # Simple static UI served by Nest
│   │   └── app.js
│   ├── test/
│   │   ├── map.e2e-spec.ts  # Jest e2e test for /api/map/data
│   │   └── jest-e2e-config.json
│   ├── package.json
│   └── tsconfig*.json
├── frontend/                # React + Vite frontend
│   ├── src/
│   │   ├── main.tsx
│   │   ├── App.tsx
│   │   ├── components/
│   │   │   ├── Legend.tsx
│   │   │   └── Controls.tsx
│   │   └── utils/
│   │       └── color.ts
│   ├── cypress/
│   │   ├── cypress.config.ts
│   │   └── e2e/
│   │       └── map_integration.cy.ts
│   ├── public/
│   ├── package.json
│   ├── tsconfig*.json
│   └── vite.config.ts
├── rpg/
│   └── index.json           # RPG definition (nodes + edges)
├── scripts/
│   ├── rpg-validate.cjs     # Validates RPG vs filesystem
│   └── generate-test-skeletons.cjs
├── tsconfig.base.json
├── package.json             # Root scripts (build, test, RPG)
└── README.md

---

## Backend (NestJS)

The backend exposes a simple API:

- `GET /api/map/data` – returns the current in-memory map data.
- `POST /api/csv/upload` – accepts a CSV file (`state,value`), parses it, and updates map data.
- `POST /api/scenario/randomize` – generates a random scenario for all US states and updates map data.
- `/` – can serve either the simple static UI (`backend/public`) or the built React app, depending on your configuration in `StaticController`.

Key files:

- `backend/src/app.module.ts` – wires `MapModule`, `CsvModule`, `ScenarioModule`, `StaticModule`.
- `backend/src/map/*` – map data storage and retrieval.
- `backend/src/csv/*` – CSV upload and parsing.
- `backend/src/scenario/*` – random scenario generation.
- `backend/src/static/static.controller.ts` – serves `index.html` (can be pointed to `frontend/dist` for SPA).

---

## Frontend (React + Vite)

The frontend is a SPA that:

- Renders an SVG map of the US.
- Colors states based on numeric values (0–100) using `colorForValue` in `frontend/src/utils/color.ts`.
- Lets the user:
  - Upload a CSV file and visualize it.
  - Generate a random scenario (client or server).
- Uses a Vite `server.proxy` to forward `/api` calls to the NestJS backend during development.

`vite.config.ts` (excerpt):

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
export default defineConfig({
  plugins: [react(), svgr()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // NestJS backend
        changeOrigin: true,
        secure: false
      }
    }
  }
});

---

## RPG: Repository Planning Graph

The RPG file `rpg/index.json` describes:

- **Nodes**: backend/frontend modules and features (`backend-map`, `backend-csv`, `frontend-app`, etc.).
- **Files**: source files that implement each node.
- **Tests**: Jest/Cypress specs associated with each node.
- **Edges**: data/dep flows (e.g. `frontend-app → backend-map`).

Two scripts help keep structure and tests in sync:

Validate that all RPG-listed files/tests exist
npm run rpg:validate
Generate backend Jest test skeletons for nodes without tests
npm run rpg:tests
Validate + run backend Jest tests
npm run rpg:check

Generated backend skeleton tests are placed under `backend/test/rpg/`.

---

## Getting Started

### 1. Install dependencies

From the repo root:

Root dev tooling (Jest, ESLint, etc.)
npm install
Backend deps
cd backend
npm install
Frontend deps
cd ../frontend
npm install

### 2. Run the backend (NestJS)

From the repo root:
npm --prefix backend run start:dev

This starts NestJS on `http://localhost:3000`.

### 3. Run the frontend (Vite dev server)

In another terminal:
npm --prefix frontend run dev

This starts Vite (by default on `http://localhost:5173`).

Because of the Vite proxy, the frontend can call `/api/...` and have those requests forwarded to `http://localhost:3000/api/...` during development.

Open:

- `http://localhost:5173` – React SPA.

---

## Build & Deployment

### Build both backend and frontend

From the repo root:

npm run build

This runs:

- `npm --prefix backend run build` → compiles NestJS to `backend/dist`.
- `npm --prefix frontend run build` → builds the SPA to `frontend/dist`.

### Serving the built SPA from the backend

You can configure `StaticController` to serve the built React app:

// backend/src/static/static.controller.ts
@Get()
root(@Res() res: Response) {
  // Adjust this path if needed
  res.sendFile(join(process.cwd(), 'frontend', 'dist', 'index.html'));
}

In a production deployment where backend and frontend live together, you would:

1. Run `npm run build`.
2. Start the backend (e.g. `node backend/dist/main.js`).
3. Serve `frontend/dist` as static assets (either via Nest or a reverse proxy).

For GitHub Pages, you can deploy just `frontend/dist` as static assets and point the API calls to a separately hosted backend.

---

## Testing

### Backend Jest tests

From the backend directory:

cd backend
All Jest tests (if configured)
npm run test
E2E tests (Map API)
npm run test:e2e

The main e2e file is:

- `backend/test/map.e2e-spec.ts` – verifies `GET /api/map/data`.

### Frontend Cypress tests

From the frontend directory:

cd frontend
npm run e2e   # or ￼ depending on your script name

Key test:

- `frontend/cypress/e2e/map_integration.cy.ts` – loads the SPA, checks the SVG map renders, verifies colors, and triggers a random scenario.

---

## Recommended Workflow

1. **Feature work**
   - Modify `backend/src/**` or `frontend/src/**`.
   - Update `rpg/index.json` if you add new modules or features.

2. **Check RPG + tests**

   npm run rpg:validate
   npm run rpg:tests  # only when you want new skeletons
   npm run rpg:check
   
3. **Build**

   npm run build
   
4. **Optional: deploy**
   - Backend: deploy `backend/dist` + assets.
   - Frontend: deploy `frontend/dist` (GitHub Pages or behind the backend).
   
   

   
   