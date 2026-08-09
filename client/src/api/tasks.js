const API_URL = import.meta.env.VITE_API_URL || "";
const BASE_URL = `${API_URL}/api/tasks`;

async function handleResponse(res) {
  if (res.status === 204) return null;

  const isJson = res.headers.get("content-type")?.includes("application/json");

  if (!res.ok) {
    const body = isJson ? await res.json().catch(() => ({})) : {};
    throw new Error(body.error || `Request failed with status ${res.status}`);
  }

  if (!isJson) {
    throw new Error(
      "Could not reach the API. Check that VITE_API_URL is set correctly."
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
