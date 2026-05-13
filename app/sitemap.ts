import type { MetadataRoute } from "next";
import { getAllTemplates } from "@/lib/templates";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://dropin.akellainmotion.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const templates = await getAllTemplates();
  const now = new Date();

  const fixed: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/gallery`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/playground`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  const templatePages: MetadataRoute.Sitemap = templates.map((t) => ({
    url: `${SITE_URL}/t/${t.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...fixed, ...templatePages];
}
