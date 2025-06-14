export const formatRelativeDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  const diffInDays = Math.floor(diffInSeconds / 86400);

  if (diffInDays === 0) {
    const diffInHours = Math.floor(diffInSeconds / 3600);
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInSeconds / 60);
      if (diffInMinutes < 1) return "Just now";
      return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
    }
    return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
  }
  if (diffInDays === 1) return "Yesterday";
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);
    return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
  }
  if (diffInDays < 365) {
    const months = Math.floor(diffInDays / 30);
    return `${months} month${months > 1 ? "s" : ""} ago`;
  }
  // Default to a simple date format if older than a year or for very recent future dates
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const getGreetingMessage = () => {
  const hours = new Date().getHours();

  if (hours < 12) {
    return "Good morning!";
  } else if (hours < 18) {
    return "Good afternoon";
  } else {
    return "Good evening";
  }
};

export const getCurrentFormatDate = () => {
  const options = {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  };

  return new Date().toLocaleDateString(undefined, options);
};
