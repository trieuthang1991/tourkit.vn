import type { Metadata } from "next";
import { Lexend_Deca } from "next/font/google";
import "./globals.css";
import { SITE_URL, SITE_NAME, SITE_TITLE, SITE_DESC, DEFAULT_OG } from "@/lib/seo";

const lexend = Lexend_Deca({
  variable: "--font-lexend",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s | Tourkit",
  },
  description: SITE_DESC,
  applicationName: SITE_NAME,
  keywords: [
    "Tourkit", "phần mềm quản lý du lịch", "quản trị doanh nghiệp du lịch",
    "chuyển đổi số du lịch", "CRM du lịch", "phần mềm lữ hành", "quản lý tour",
  ],
  authors: [{ name: "Tourkit" }],
  creator: "Tourkit",
  alternates: { canonical: "/" },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/seo/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/seo/favicon-192x192.png", type: "image/png", sizes: "192x192" },
    ],
    apple: "/seo/apple-touch-icon.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESC,
    images: [{ url: DEFAULT_OG, width: 1200, height: 630, alt: SITE_TITLE }],
  },
  twitter: { card: "summary_large_image", title: SITE_TITLE, description: SITE_DESC, images: [DEFAULT_OG] },
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "Công ty Cổ phần Tourkit Việt Nam",
      url: SITE_URL,
      logo: `${SITE_URL}/images/Untitled-2-01.png`,
      email: "hotro@migroup.asia",
      telephone: "0383.202.404",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Tầng 4, Tòa nhà 242 Nguyễn Văn Lộc, Hà Đông",
        addressLocality: "Hà Nội",
        addressCountry: "VN",
      },
      sameAs: [
        "https://www.facebook.com/ThemesCamp-107594098187709",
        "https://www.youtube.com/channel/UCcqdCHUg0INMZCj0K457HPg",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      description: SITE_DESC,
      publisher: { "@id": `${SITE_URL}/#organization` },
      inLanguage: "vi-VN",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" className={`${lexend.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-[#111]">
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      </body>
    </html>
  );
}
