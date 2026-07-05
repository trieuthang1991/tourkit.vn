import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/content";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/du-an/${project.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-black/[0.04] bg-white shadow-[0_10px_28px_rgba(20,10,60,0.08)] transition hover:-translate-y-1 hover:shadow-[0_18px_44px_rgba(20,10,60,0.14)]"
    >
      <div className="aspect-[16/10] overflow-hidden">
        <Image src={project.image} alt={project.title} width={640} height={400} sizes="(max-width:640px) 88vw, (max-width:1024px) 45vw, 30vw" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-[#8169f1]">{project.category}</span>
        <h3 className="mt-2 line-clamp-2 text-[15px] font-bold leading-snug text-[#111] group-hover:text-[#8169f1]">{project.title}</h3>
        {project.excerpt && <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-[#6b7280]">{project.excerpt}</p>}
        <span className="mt-auto pt-4 text-[13px] font-semibold text-[#8169f1]">Xem dự án →</span>
      </div>
    </Link>
  );
}
