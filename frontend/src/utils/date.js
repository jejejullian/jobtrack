export function formatDate(date) {
  return new Date(date).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "numeric",
    year: "numeric",
  });
}

export function toDateInputValue(date) {
  return date?.split("T")[0] ?? new Date().toISOString().split("T")[0];
}

export function getDaysSince(date, now) {
  return Math.floor(
    (now - new Date(date).getTime()) /
      (1000 * 60 * 60 * 24)
  );
}