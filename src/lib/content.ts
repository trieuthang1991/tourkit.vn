import { promises as fs } from "node:fs";
import path from "node:path";

export const CONTENT_DIR = path.join(process.cwd(), "content");

export type LinkItem = { label: string; href: string; variant?: string };

export type SiteContent = {
  brand: { logo: string; logoFooter: string };
  contact: { email: string; phone: string; address: string; footerEmail: string };
  nav: { label: string; href: string }[];
  ctaButton: { label: string; href: string };
  serviceMenu: {
    heading: string;
    items: { icon: string; title: string; desc: string; href: string }[];
  }[];
  ctaBand: { text: string; title: string; buttonText: string; buttonHref: string; image: string };
  floating: {
    enabled: boolean;
    buttons: { type: string; label: string; href: string }[];
  };
  chat: { enabled: boolean; src: string };
  consult: {
    title: string;
    subtitle: string;
    submitText: string;
    successText: string;
    fields: {
      name: string;
      placeholder: string;
      type: string;
      required?: boolean;
      width?: string;
      options?: string[];
    }[];
  };
  footer: {
    companyName: string;
    offices: { city: string; addr: string }[];
    hotline: string;
    email: string;
    facebook: string;
    youtube: string;
    serviceLinks: LinkItem[];
    infoLinks: LinkItem[];
    copyright: string;
  };
};

export type HomeContent = {
  hero: {
    titleLine1: string; titleHighlight: string; subtitle: string;
    ctaText: string; ctaHref: string; supportLabel: string; supportEmail: string; image: string;
  };
  erp: { eyebrow: string; title: string; subtitle: string; body: string; image: string; videoId?: string };
  solutions: {
    eyebrow: string; titlePre: string; titleHighlight: string; titlePost: string;
    items: { logo: string; title: string; desc: string; href: string }[];
    buttons: LinkItem[];
  };
  featureIntroImage: string;
  features: { pre: string; highlight: string; desc: string; img: string }[];
  caseStudies: { title: string; subtitle: string; tag: string };
  websites: { title: string; subtitle: string; tag: string };
  partners: {
    pressTitle: string;
    featuredEyebrow: string; featuredTitle: string; featured: { name: string; img: string }[];
    clientsEyebrow: string; clientsTitle: string; clientsImage: string; clients: string[];
  };
  testimonials: {
    eyebrow: string; title: string;
    stats: { num: string; label: string }[];
    links: LinkItem[];
    items: { avatar: string; name: string; role: string; quote: string }[];
  };
  gallery: { eyebrow: string; title: string; images: string[] };
  social: { eyebrow: string; title: string; videoId?: string; videoThumb?: string; items: { img: string; name: string; desc: string; href: string }[] };
  news: { eyebrow: string; title: string; items: { img: string; cat: string; date: string; title: string; href: string }[] };
};

export type Post = {
  slug: string;
  title: string;
  category: string;
  date: string;
  author: string;
  image: string;
  excerpt: string;
  /** Post body as HTML */
  content: string;
};

export type PostsContent = {
  listTitle: string;
  listSubtitle: string;
  posts: Post[];
};

export type Project = {
  slug: string;
  title: string;
  category: string;
  image: string;
  excerpt: string;
  content: string;
};

export type ProjectsContent = {
  listTitle: string;
  listSubtitle: string;
  projects: Project[];
};

async function readJson<T>(file: string): Promise<T> {
  const raw = await fs.readFile(path.join(CONTENT_DIR, file), "utf8");
  return JSON.parse(raw) as T;
}

export async function getSite(): Promise<SiteContent> {
  return readJson<SiteContent>("site.json");
}

export async function getHome(): Promise<HomeContent> {
  return readJson<HomeContent>("home.json");
}

export async function getPosts(): Promise<PostsContent> {
  return readJson<PostsContent>("posts.json");
}

export async function getPost(slug: string): Promise<Post | null> {
  const { posts } = await getPosts();
  return posts.find((p) => p.slug === slug) ?? null;
}

export type AboutContent = {
  intro: {
    eyebrow: string; paragraph: string;
    products: { name: string; desc: string }[];
    buttonText: string; buttonHref: string; image: string;
  };
  productsSection: { eyebrow: string; titlePre: string; titleHighlight: string; logos: string[] };
  mission: {
    eyebrow: string; titlePre: string; titleHighlight: string; text: string;
    bullets: string[]; buttonText: string; buttonHref: string; image: string;
  };
  press: {
    eyebrow: string; titlePre: string; titleHighlight: string;
    items: { quote: string; logo: string; source: string; desc: string }[];
  };
};

export async function getAbout(): Promise<AboutContent> {
  return readJson<AboutContent>("about.json");
}

export async function getProjects(): Promise<ProjectsContent> {
  return readJson<ProjectsContent>("projects.json");
}

export async function getProject(slug: string): Promise<Project | null> {
  const { projects } = await getProjects();
  return projects.find((p) => p.slug === slug) ?? null;
}

/** Registry of editable content files for the admin UI. */
export const CONTENT_FILES: { file: string; label: string }[] = [
  { file: "site.json", label: "Cấu hình chung (header, footer, menu, liên hệ)" },
  { file: "home.json", label: "Trang chủ" },
  { file: "posts.json", label: "Tin tức - Sự kiện (bài viết)" },
  { file: "projects.json", label: "Dự án (portfolio)" },
  { file: "about.json", label: "Trang Về Tourkit" },
];

export async function readContentFile(file: string): Promise<unknown> {
  if (!CONTENT_FILES.some((c) => c.file === file)) throw new Error("Unknown content file");
  return readJson(file);
}

export async function writeContentFile(file: string, data: unknown): Promise<void> {
  if (!CONTENT_FILES.some((c) => c.file === file)) throw new Error("Unknown content file");
  const dest = path.join(CONTENT_DIR, file);
  await fs.writeFile(dest, JSON.stringify(data, null, 2) + "\n", "utf8");
}
