export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/reveal";
import { PostBody } from "@/components/post-body";
import { ProjectCard } from "@/components/project-card";
import { getProject, getProjects } from "@/lib/content";
import { pageMeta, SITE_URL } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return { title: "Không tìm thấy dự án", robots: { index: false } };
  return pageMeta({
    title: project.title,
    description: project.excerpt,
    path: `/du-an/${project.slug}`,
    image: project.image,
    type: "article",
  });
}

export default async function ProjectDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();

  const { projects } = await getProjects();
  const related = projects.filter((p) => p.slug !== slug && p.category === project.category).slice(0, 3);
  const fallback = related.length ? related : projects.filter((p) => p.slug !== slug).slice(0, 3);

  const url = `${SITE_URL}/du-an/${project.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CreativeWork",
        name: project.title,
        description: project.excerpt,
        image: `${SITE_URL}${project.image}`,
        author: { "@id": `${SITE_URL}/#organization` },
        url,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Trang chủ", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Dự án", item: `${SITE_URL}/du-an` },
          { "@type": "ListItem", position: 3, name: project.title, item: url },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="relative overflow-hidden bg-gradient-to-br from-[#8169f1] to-[#5842bc] py-14 text-white md:py-16">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "url(/images/head7_bg.png)", backgroundSize: "cover", backgroundPosition: "center" }} aria-hidden />
        <div className="tk-container relative">
          <div className="flex flex-wrap items-center gap-2 text-[13px] text-white/80">
            <Link href="/du-an" className="hover:text-white">Dự án</Link>
            <span>/</span>
            <span className="text-white/60">{project.category}</span>
          </div>
          <h1 className="mt-3 max-w-4xl text-[26px] font-extrabold leading-tight md:text-[38px]">{project.title}</h1>
        </div>
      </section>

      <article className="bg-white py-12">
        <div className="tk-container max-w-[880px]">
          <Reveal className="overflow-hidden rounded-2xl">
            <Image src={project.image} alt={project.title} width={880} height={480} priority className="h-auto w-full object-cover" />
          </Reveal>
          <div className="mt-8">
            <PostBody html={project.content} />
          </div>

          <div className="mt-10 flex flex-wrap gap-3 border-t border-black/5 pt-6">
            <Link href="/du-an" className="rounded-full border-2 border-[#8169f1] px-6 py-2.5 text-[14px] font-semibold text-[#8169f1] transition hover:bg-[#8169f1] hover:text-white">
              ← Tất cả dự án
            </Link>
            <Link data-contact-popup href="/lien-he" className="rounded-full bg-[#ff6400] px-6 py-2.5 text-[14px] font-semibold text-white transition hover:bg-[#ff5600]">
              Đăng ký tư vấn
            </Link>
          </div>
        </div>
      </article>

      {fallback.length > 0 && (
        <section className="bg-[#f2f0fa] py-14">
          <div className="tk-container">
            <h2 className="text-center text-[24px] font-bold text-[#111] md:text-[32px]">Dự án khác</h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {fallback.map((p, i) => (
                <Reveal key={p.slug} delay={i * 80}><ProjectCard project={p} /></Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
