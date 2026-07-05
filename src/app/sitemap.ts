import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { getPosts, getProjects } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPaths = ["", "/dich-vu", "/ve-migroup", "/ho-so-nang-luc", "/du-an", "/tin-tuc-su-kien", "/lien-he"];
  const now = new Date();

  const base: MetadataRoute.Sitemap = staticPaths.map((p) => ({
    url: `${SITE_URL}${p}`,
    lastModified: now,
    changeFrequency: p === "" ? "daily" : "weekly",
    priority: p === "" ? 1 : 0.8,
  }));

  const [{ posts }, { projects }] = await Promise.all([getPosts(), getProjects()]);

  const postUrls: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${SITE_URL}/tin-tuc-su-kien/${p.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const projectUrls: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${SITE_URL}/du-an/${p.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...base, ...postUrls, ...projectUrls];
}
