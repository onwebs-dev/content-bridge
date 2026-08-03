import type { MetadataRoute } from "next";

const siteUrl = "https://content-bridge-fa.onwebs.chatgpt.site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      lastModified: new Date("2026-08-03"),
      changeFrequency: "monthly",
      priority: 1,
      alternates: { languages: { fa: siteUrl, en: `${siteUrl}/en` } },
    },
    {
      url: `${siteUrl}/en`,
      lastModified: new Date("2026-08-03"),
      changeFrequency: "monthly",
      priority: 0.9,
      alternates: { languages: { fa: siteUrl, en: `${siteUrl}/en` } },
    },
  ];
}
