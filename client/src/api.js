const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

async function request(path, options = {}) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || `Request failed with status ${res.status}`);
  }

  return data;
}

export function login(email, password) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function getMe() {
  return request("/auth/me");
}

export function listCampuses() {
  return request("/campuses");
}

export function createCampus(data) {
  return request("/campuses", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateCampus(id, data) {
  return request(`/campuses/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}
