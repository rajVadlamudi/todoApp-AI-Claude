const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");
const BASE_URL = `${API_URL}/api/tasks`;

if (import.meta.env.PROD && !API_URL) {
  console.error(
    "VITE_API_URL is not set for this build. API requests will be sent to " +
      "this site's own origin instead of a backend, which will fail unless " +
      "one is deployed there too."
  );
}

async function handleResponse(res) {
  if (res.status === 204) return null;

  const isJson = res.headers.get("content-type")?.includes("application/json");

  if (!res.ok) {
    const body = isJson ? await res.json().catch(() => ({})) : {};
    throw new Error(body.error || `Request failed with status ${res.status}`);
  }

  if (!isJson) {
    throw new Error(
      `Could not reach the API at ${res.url} (got ${res.headers.get("content-type") || "no content-type"} instead of JSON). Check that VITE_API_URL is set correctly.`
    );
  }

  return res.json();
}

export function fetchTasks() {
  return fetch(BASE_URL).then(handleResponse);
}

export function addTask(title) {
  return fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  }).then(handleResponse);
}

export function editTask(id, updates) {
  return fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  }).then(handleResponse);
}

export function removeTask(id) {
  return fetch(`${BASE_URL}/${id}`, { method: "DELETE" }).then(handleResponse);
}
