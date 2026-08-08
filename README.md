# todoApp-AI-Claude

A full-stack to-do list app with a React frontend and an Express backend.

## Structure

- `server/` — Express REST API (`/api/tasks`), tasks persisted to a local JSON file
- `client/` — React app (Vite), calls the API to add, edit, delete, and complete tasks

## Running locally

Start the backend:

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
