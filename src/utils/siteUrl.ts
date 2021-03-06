export const siteUrl = (slug: string): string => {
  const url = process.env.NODE_ENV === "production" ? process.env.NEXT_PUBLIC_SITE_URL || "/" : "http://localhost:3000";
  return `${url}/${slug || ""}`;
};
