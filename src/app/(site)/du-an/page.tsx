export const dynamic = "force-dynamic";

import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { ProjectCard } from "@/components/project-card";
import { getProjects } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Dự án",
  description: "Các dự án chuyển đổi số và website du lịch tiêu biểu đã triển khai cùng Tourkit.",
  path: "/du-an",
});

export default async function DuAn() {
  const { listTitle, listSubtitle, projects } = await getProjects();
  const digital = projects.filter((p) => p.category !== "Website Du Lịch");
  const websites = projects.filter((p) => p.category === "Website Du Lịch");

  return (
    <>
      <PageHero breadcrumb="Dự án" title={listTitle} subtitle={listSubtitle} />

      <section className="bg-[#f2f0fa] py-16">
        <div className="tk-container">
          <h2 className="text-center text-[26px] font-bold text-[#111] md:text-[36px]">Câu chuyện chuyển đổi số</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {digital.map((p, i) => (
              <Reveal key={p.slug} delay={(i % 3) * 70}><ProjectCard project={p} /></Reveal>
            ))}
          </div>

          {websites.length > 0 && (
            <>
              <h2 className="mt-16 text-center text-[26px] font-bold text-[#111] md:text-[36px]">Các dự án Website</h2>
              <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {websites.map((p, i) => (
                  <Reveal key={p.slug} delay={(i % 3) * 70}><ProjectCard project={p} /></Reveal>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
