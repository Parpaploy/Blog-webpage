export function FormatDate(dateStr: string) {
  const date = new Date(dateStr);
  //   const currentLang = i18n.language;

  const localeMap: Record<string, string> = {
    th: "th-TH",
    en: "en-US",
  };

  //   return date.toLocaleDateString(localeMap[currentLang] || "en-US", {
  //     year: "numeric",
  //     month: "long",
  //     day: "numeric",
  //   });

  //   return date.toLocaleDateString("en-US", {
  //     year: "numeric",
  //     month: "long",
  //     day: "numeric",
  //   });

  return date
    .toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
    .replace(",", " at");
}
