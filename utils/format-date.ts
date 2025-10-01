import i18n from "../lib/i18n";

export function FormatDate(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();

  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  const currentLang = i18n.language;
  const currentYear = now.getFullYear();

  const localeMap: Record<string, string> = {
    th: "th-TH",
    en: "en-US",
  };

  if (diffDays < 1) {
    if (diffMinutes < 1) {
      return currentLang === "th" ? "เมื่อสักครู่" : "Just now";
    } else if (diffHours < 1) {
      return currentLang === "th"
        ? `${diffMinutes} นาทีที่ผ่านมา`
        : `${diffMinutes} minutes ago`;
    } else {
      return currentLang === "th"
        ? `${diffHours} ชั่วโมงที่ผ่านมา`
        : `${diffHours} hours ago`;
    }
  }

  const options: Intl.DateTimeFormatOptions = {
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  };

  if (date.getFullYear() !== currentYear) {
    options.year = "numeric";
  }

  if (currentLang === "en") {
    options.hour12 = true;
  }

  let formatted = date.toLocaleDateString(
    localeMap[currentLang] || "en-US",
    options
  );

  if (currentLang === "en") {
    formatted = formatted.replace(",", " at");
  }

  if (currentLang === "th") {
    formatted += " น.";
  }

  return formatted;
}
