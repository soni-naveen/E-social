export const convertCreatedAt = (createdAt) => {
  try {
    const now = new Date();
    const date = new Date(createdAt);
    const diff = (now - date) / 1000; // in seconds

    if (isNaN(diff)) return "Invalid date";

    const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

    if (diff < 60) return "Just now";
    if (diff < 3600) return rtf.format(-Math.floor(diff / 60), "minute"); // minutes ago
    if (diff < 86400) return rtf.format(-Math.floor(diff / 3600), "hour"); // hours ago

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);

    if (
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear()
    ) {
      return `Yesterday at ${date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })}`;
    }

    if (date.getFullYear() === now.getFullYear()) {
      return date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }); // Jun 7 at 5:42 PM
    }

    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }); // Dec 25, 2023
  } catch (err) {
    return "Invalid date";
  }
};
