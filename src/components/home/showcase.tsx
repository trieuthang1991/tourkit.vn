import { Reveal } from "@/components/reveal";
import { Carousel } from "@/components/carousel";
import { ProjectCard } from "@/components/project-card";
import type { HomeContent, Project } from "@/lib/content";

export function CaseStudies({ meta, items }: { meta: HomeContent["caseStudies"]; items: Project[] }) {
  if (!items.length) return null;
  return (
    <section className="bg-white pb-16 pt-4">
      <div className="tk-container">
        <Reveal className="text-center">
          <h2 className="text-[28px] font-bold text-[#111] md:text-[40px]">{meta.title}</h2>
          {meta.subtitle && <p className="mx-auto mt-3 max-w-2xl text-[15px] leading-relaxed text-[#6b7280]">{meta.subtitle}</p>}
        </Reveal>
      </div>
      <div className="tk-fullbleed mt-12">
        <Carousel slideBasis="basis-[85%] sm:basis-1/2 lg:basis-1/4" autoplayDelay={3200} dots arrows>
          {items.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </Carousel>
      </div>
    </section>
  );
}

export function WebsiteProjects({ meta, items }: { meta: HomeContent["websites"]; items: Project[] }) {
  if (!items.length) return null;
  return (
    <section className="bg-[#f2f0fa] py-16">
      <div className="tk-container">
        <Reveal className="text-center">
          <h2 className="text-[28px] font-bold text-[#111] md:text-[40px]">{meta.title}</h2>
          {meta.subtitle && <p className="mx-auto mt-3 max-w-2xl text-[15px] leading-relaxed text-[#6b7280]">{meta.subtitle}</p>}
        </Reveal>
      </div>
      <div className="tk-fullbleed mt-12">
        <Carousel slideBasis="basis-[85%] sm:basis-1/2 lg:basis-1/3" autoplayDelay={3600} dots arrows>
          {items.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </Carousel>
      </div>
    </section>
  );
}
