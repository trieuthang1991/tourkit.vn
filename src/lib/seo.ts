import type { Metadata } from "next";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://tourkit.vn").replace(/\/$/, "");
export const SITE_NAME = "Tourkit";
export const SITE_TITLE = "Tourkit | Giải pháp quản trị doanh nghiệp du lịch toàn diện";
export const SITE_DESC =
  "TOURKIT - \"Trái tim số\" của doanh nghiệp du lịch Việt Nam. Giải pháp quản trị doanh nghiệp du lịch toàn diện: CRM, HRM, Website Booking, Affiliate, Chuyển đổi số.";
export const DEFAULT_OG = "/images/Group-48-Test.png";

/** Build consistent per-page metadata (title, description, canonical, OpenGraph, Twitter). */
export function pageMeta({
  title,
  description,
  path,
  image,
  type = "website",
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
}): Metadata {
  const url = SITE_URL + path;
  const img = image ? (image.startsWith("http") ? image : SITE_URL + image) : SITE_URL + DEFAULT_OG;
  const fullTitle = title.includes("Tourkit") ? title : `${title} | Tourkit`;
  return {
    title: fullTitle,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      locale: "vi_VN",
      type,
      images: [{ url: img, width: 1200, height: 630, alt: fullTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [img],
    },
  };
}
