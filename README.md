# todoApp-AI-Claude

A full-stack to-do list app with a React frontend and an Express backend.

## Structure

- `server/` — Express REST API (`/api/tasks`), backed by a Supabase Postgres `tasks` table,
  protected by Clerk auth
- `client/` — React app (Vite), signs users in with Clerk and calls the API to add, edit,
  delete, and complete their own tasks

## Running locally

### Supabase setup

1. Create a project at [supabase.com](https://supabase.com).
2. Run `server/supabase/schema.sql` in the Supabase SQL editor to create the `tasks` table.
3. In Project Settings -> API, copy the project URL and the **service_role** key
   (not the anon key — the backend needs write access regardless of RLS policies).
4. Copy `server/.env.example` to `server/.env` and fill in `SUPABASE_URL` and `SUPABASE_KEY`.

### Clerk setup

1. Create an application at [clerk.com](https://clerk.com).
2. In Dashboard -> API Keys, copy the **Publishable key** and **Secret key**.
3. Backend: add both to `server/.env` as `CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`
   (the SDK needs both server-side, even though only the publishable key is meant for
   the browser).
4. Frontend: copy `client/.env.example` to `client/.env` and set
   `VITE_CLERK_PUBLISHABLE_KEY` to the same publishable key.

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

All `/api/tasks` routes require a Clerk session token (`Authorization: Bearer <token>`)
and only ever return/modify the signed-in user's own tasks.

| Method | Endpoint          | Description          |
| ------ | ----------------- | --------------------- |
| GET    | `/api/tasks`       | List the current user's tasks |
| POST   | `/api/tasks`       | Create a task for the current user (`{ title }`) |
| PUT    | `/api/tasks/:id`   | Update a task owned by the current user (`{ title?, completed? }`) |
| DELETE | `/api/tasks/:id`   | Delete a task owned by the current user |

`GET /api/health` is unauthenticated and only reports server liveness.

## Deployment

The frontend deploys to Vercel; the backend needs a host with a persistent,
writable filesystem (Vercel's serverless functions don't have one), such as
Render, Railway, or Fly.io.

### Backend

Deploy `server/` to your host of choice. Start command: `npm start`. Set these
environment variables on that host (same values as your local `server/.env`):
`SUPABASE_URL`, `SUPABASE_KEY`, `CLERK_SECRET_KEY`, `CLERK_PUBLISHABLE_KEY`.
Note the public URL it gives you (e.g. `https://todo-api.onrender.com`).

### Frontend (Vercel)

1. Import the repo into Vercel and set the project's **Root Directory** to `client`.
   (Vercel picks up `client/vercel.json` automatically for the build settings and
   SPA routing.)
2. Add these environment variables in the Vercel project settings:
   - `VITE_API_URL` = the backend URL from the step above (no trailing slash)
   - `VITE_CLERK_PUBLISHABLE_KEY` = the same Clerk publishable key as the backend
3. Deploy. `client/.env.example` documents the same variables for local reference.
4. In the Clerk dashboard, add your Vercel domain to the application's allowed
   origins/redirect URLs so sign-in works from production.

Without `VITE_API_URL` set, the frontend calls relative `/api/...` paths, which
only works when a proxy (like the local Vite dev server) forwards them — so it
must be set for the Vercel deployment to reach the backend.
