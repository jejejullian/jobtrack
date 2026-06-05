const BASE_URL = import.meta.env.VITE_API_URL;

// base fetch wrapper
const fetchApi = async (url, options = {}) => {
  try {
    const response = await fetch(url, options);
    const result = await response.json().catch(() => ({}));
    const hasAuthHeader = Boolean(options.headers?.Authorization);

    if (response.status === 401 && hasAuthHeader) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
      return;
    }

    if (!response.ok) {
      const error = new Error(result.error || result.message || "Something went wrong");
      error.field = result.field;
      throw error;
    }
    return result;
  } catch (err) {
    if (err.message === "Failed to fetch") {
      throw new Error("Unable to connect to server. Please try again later.", { cause: err });
    }
    throw err;
  }
};

// auth
export const login = (data) =>
  fetchApi(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

export const register = (data) =>
  fetchApi(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

// jobs
export const getJobs = (token) =>
  fetchApi(`${BASE_URL}/jobs`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const createJob = (token, data) =>
  fetchApi(`${BASE_URL}/jobs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

export const updateJob = (token, id, data) =>
  fetchApi(`${BASE_URL}/jobs/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

export const deleteJob = (token, id) =>
  fetchApi(`${BASE_URL}/jobs/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

// users
export const getMe = (token) =>
  fetchApi(`${BASE_URL}/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const updateMe = (token, data) =>
  fetchApi(`${BASE_URL}/users/me`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

export const changePassword = (token, data) =>
  fetchApi(`${BASE_URL}/users/password`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

export const deleteAccount = (token, data) =>
  fetchApi(`${BASE_URL}/users/me`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

export const verifyEmail = (token, email = "") => {
  const params = new URLSearchParams({ token });
  if (email) params.set("email", email);
  return fetchApi(`${BASE_URL}/auth/verify?${params.toString()}`);
};

export const forgotPassword = (data) =>
  fetchApi(`${BASE_URL}/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

export const resetPassword = (data) =>
  fetchApi(`${BASE_URL}/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

export const resendVerification = (data) =>
  fetchApi(`${BASE_URL}/auth/resend-verification`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
