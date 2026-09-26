// base fetch wrapper
const fetchApi = async (url, options = {}) => {
  try {
    const response = await fetch(url, options);
    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      const error = new Error(result.error || result.message || "Something went wrong");
      error.field = result.field;
      error.status = response.status;
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
  fetchApi("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

export const register = (data) =>
  fetchApi("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

export const logout = () => fetchApi("/api/auth/logout", { method: "POST" });

// jobs
export const getJobs = () => fetchApi("/api/jobs");

export const createJob = (data) =>
  fetchApi("/api/jobs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

export const updateJob = (id, data) =>
  fetchApi(`/api/jobs/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

export const deleteJob = (id) => fetchApi(`/api/jobs/${id}`, { method: "DELETE" });

// users
export const getMe = () => fetchApi("/api/users/me");

export const updateMe = (data) =>
  fetchApi("/api/users/me", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

export const changePassword = (data) =>
  fetchApi("/api/users/password", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

export const deleteAccount = (data) =>
  fetchApi("/api/users/me", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

export const verifyEmail = (token, email = "") => {
  const params = new URLSearchParams({ token });
  if (email) params.set("email", email);
  return fetchApi(`/api/auth/verify-email?${params.toString()}`);
};

export const forgotPassword = (data) =>
  fetchApi("/api/auth/forgot-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

export const resetPassword = (data) =>
  fetchApi("/api/auth/reset-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

export const resendVerification = (data) =>
  fetchApi("/api/auth/resend-verification", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });