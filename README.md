# Brewella — Brewella Coffee Shop

Full‑stack TypeScript web app for Brewella — a small coffee shop with a customer storefront and admin interface for managing menu items, bookings, posts, and shop settings.

This README has been updated to match the repository's actual structure and scripts.

---

## Quick summary

- Language: TypeScript
- Frontend: React + Vite
- Backend: Express (single Node process running server.ts via `tsx` in development)
- Database: SQLite (brewella.db included and auto-initialized)
- File uploads: stored in the `uploads/` directory (created automatically)
- Authentication: JWT-based (see notes below)

---

## Repository layout (top-level)

- README.md
- package.json        # npm scripts and dependencies
- tsconfig.json       # TypeScript config
- server.ts           # Express server and API routes
- db.ts               # SQLite database initialization & seed data (brewella.db)
- brewella.db         # Included SQLite database file (seeded)
- .env.example        # Example environment variables
- uploads/            # Runtime uploads (images), created at startup
- src/                # UI / client source (React + Vite) if present

---

## Install

1. Clone the repo

```bash
git clone https://github.com/Koheinn/Brewella_Project.git
cd Brewella_Project
```

2. Install dependencies

```bash
# npm
npm install

# or pnpm
pnpm install

# or yarn
yarn install
```

3. Copy environment file

```bash
cp .env.example .env
# then edit .env if you need to provide keys (see notes below)
```

Notes about environment and secrets

- .env.example included keys used by AI Studio usage (GEMINI_API_KEY, APP_URL). The app in this repository currently uses a hard-coded JWT secret in `server.ts` (JWT_SECRET = 'brewella_secret_key_2026') and a fixed port (3000). For production you should:
  - Replace the hard-coded JWT secret with a value loaded from process.env (e.g. JWT_SECRET) and keep it secret.
  - Optionally change the server port in `server.ts` or modify the code to read `process.env.PORT`.

---

## Available scripts

These come directly from package.json:

- `npm run dev` — start the server for development (runs `tsx server.ts`). The server will use Vite middleware (hot reload) when NODE_ENV !== 'production'.
- `npm run build` — build the frontend with Vite (`vite build`). This generates `dist/`.
- `npm run preview` — preview the frontend build (`vite preview`).
- `npm run clean` — remove the `dist/` directory
- `npm run lint` — run TypeScript type check (`tsc --noEmit`)

Development (recommended)

```bash
npm run dev
# open http://localhost:3000
```

Production / serving a built frontend locally

1. Build the frontend

```bash
npm run build
```

2. Start the server in production mode so it serves the `dist/` directory

On macOS / Linux:

```bash
NODE_ENV=production npx tsx server.ts
```

On Windows (PowerShell):

```powershell
$env:NODE_ENV = 'production'; npx tsx server.ts
```

(You can add a `start` script to package.json that sets NODE_ENV=production and runs `tsx server.ts`.)

---

## Database

This project uses SQLite via better-sqlite3. A file named `brewella.db` is included and `db.ts` contains schema creation and seed data. If you want a fresh database remove `brewella.db` and restart the server — the code will create and seed the DB automatically.

If you prefer Postgres or another RDBMS you'll need to port `db.ts` and the queries accordingly.

---

## Notable implementation details

- Server entry: `server.ts` — Express API routes for auth, menu, bookings, posts, issues, admin endpoints, and settings.
- Database: `db.ts` — creates tables (users, cafe_tables, bookings, menus, posts, comments, reactions, shop_settings) and seeds initial data when empty.
- File uploads: handled with `multer` and served from `/uploads`.
- Authentication: JWT tokens are signed/verified using a secret. Currently the secret is hard-coded; update this for production use.
- Dev tool: `tsx` is used to run TypeScript directly during development.

---

## Running tests

There are no automated tests included in this repository. The `lint` script runs TypeScript checks (`tsc --noEmit`). Add your preferred test runner and scripts if you want unit/integration tests.

---

## Docker

There are no docker files in the repo at the time of writing. To containerize the app:

- Build the frontend (`npm run build`) to produce `dist/`.
- Run the Node server in production mode (serve `dist/`) and ensure `brewella.db` is writable by the container or mount a volume.

---

## Contributing

Contributions are welcome. Suggested workflow:

1. Fork the repo
2. Create a branch: `git checkout -b feat/my-change`
3. Make changes and run `npm run lint`
4. Open a PR describing the change

---

## License

Project includes a LICENSE file. Check `LICENSE` for the repository license.

---

## Contact

Maintained by Koheinn — open issues or PRs for bugs, features, or questions.
