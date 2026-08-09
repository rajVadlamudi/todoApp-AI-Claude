# todoApp-AI-Claude

A full-stack to-do list app with a React frontend and an Express backend.

## Structure

- `server/` — Express REST API (`/api/tasks`), backed by a Supabase Postgres `tasks` table
- `client/` — React app (Vite), calls the API to add, edit, delete, and complete tasks

## Running locally

### Supabase setup

1. Create a project at [supabase.com](https://supabase.com).
2. Run `server/supabase/schema.sql` in the Supabase SQL editor to create the `tasks` table.
3. In Project Settings -> API, copy the project URL and the **service_role** key
   (not the anon key — the backend needs write access regardless of RLS policies).
4. Copy `server/.env.example` to `server/.env` and fill in `SUPABASE_URL` and `SUPABASE_KEY`.

### Backend

```bash
cd server
npm install
npm run dev
```

The API listens on `http://localhost:4000`.

In a separate terminal, start the frontend:

```bash
cd client
npm install
npm run dev
```

The app is served at `http://localhost:5173` and proxies `/api` requests to the backend.

## API

| Method | Endpoint          | Description          |
| ------ | ----------------- | --------------------- |
| GET    | `/api/tasks`       | List all tasks         |
| POST   | `/api/tasks`       | Create a task (`{ title }`) |
| PUT    | `/api/tasks/:id`   | Update a task (`{ title?, completed? }`) |
| DELETE | `/api/tasks/:id`   | Delete a task          |

## Deployment

The frontend deploys to Vercel; the backend needs a host with a persistent,
writable filesystem (Vercel's serverless functions don't have one), such as
Render, Railway, or Fly.io.

### Backend

Deploy `server/` to your host of choice. Start command: `npm start`. Set the
`SUPABASE_URL` and `SUPABASE_KEY` environment variables on that host (same
values as your local `server/.env`). Note the public URL it gives you (e.g.
`https://todo-api.onrender.com`).

### Frontend (Vercel)

1. Import the repo into Vercel and set the project's **Root Directory** to `client`.
   (Vercel picks up `client/vercel.json` automatically for the build settings and
   SPA routing.)
2. Add an environment variable in the Vercel project settings:
   - `VITE_API_URL` = the backend URL from the step above (no trailing slash)
3. Deploy. `client/.env.example` documents the same variable for local reference.

Without `VITE_API_URL` set, the frontend calls relative `/api/...` paths, which
only works when a proxy (like the local Vite dev server) forwards them — so it
must be set for the Vercel deployment to reach the backend.
