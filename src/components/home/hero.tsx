import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/reveal";
import type { HomeContent } from "@/lib/content";

export function Hero({ data }: { data: HomeContent["hero"] }) {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="absolute inset-0 bg-cover bg-bottom opacity-90" style={{ backgroundImage: "url(/images/head7_bg.png)" }} aria-hidden />
      <div className="tk-container relative grid items-center gap-8 py-10 md:grid-cols-2 md:py-16">
        <div>
          <h1 className="text-[40px] font-bold leading-[1.1] text-[#111] md:text-[50px]">
            {data.titleLine1}
            <br />
            <span className="text-[#ff6400]">{data.titleHighlight}</span>
          </h1>
          <p className="mt-4 text-[22px] font-medium text-[#333] md:text-[26px]">{data.subtitle}</p>
          <div className="mt-8 flex flex-wrap items-center gap-6">
            <Link data-contact-popup href={data.ctaHref} className="rounded-full bg-[#ff6400] px-8 py-3.5 text-[15px] font-semibold text-white transition hover:bg-[#ff5600]">
              {data.ctaText}
            </Link>
            <div className="text-[13px] leading-tight">
              <span className="block text-[#8169f1]">{data.supportLabel}</span>
              <span className="block font-semibold text-[#111]">{data.supportEmail}</span>
            </div>
          </div>
        </div>
        <Reveal className="relative flex justify-center">
          <Image src={data.image} alt="Tourkit - Giải pháp quản trị doanh nghiệp du lịch" width={720} height={566} priority className="h-auto w-full max-w-[560px] object-contain" />
        </Reveal>
      </div>
    </section>
  );
}

export function ErpIntro({ data }: { data: HomeContent["erp"] }) {
  return (
    <section className="bg-white py-14">
      <div className="tk-container grid items-center gap-10 md:grid-cols-2">
        <Reveal>
          {data.videoId ? (
            <button
              data-video={data.videoId}
              aria-label="Xem video giới thiệu"
              className="group relative block w-full overflow-hidden rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.12)]"
            >
              <Image src={data.image} alt="Video giới thiệu Tourkit ERP" width={682} height={387} className="h-auto w-full object-cover transition duration-500 group-hover:scale-105" />
              <span className="absolute inset-0 flex items-center justify-center bg-black/15 transition group-hover:bg-black/25">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-[26px] text-[#ff5600] shadow-lg transition group-hover:scale-110">▶</span>
              </span>
            </button>
          ) : (
            <div className="overflow-hidden rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.12)]">
              <Image src={data.image} alt="Video giới thiệu Tourkit ERP" width={682} height={387} className="h-auto w-full object-cover" />
            </div>
          )}
        </Reveal>
        <Reveal delay={100}>
          <p className="text-[13px] font-semibold uppercase tracking-wide text-[#8169f1]">{data.eyebrow}</p>
          <h2 className="mt-2 text-[31px] font-medium text-[#111]">{data.title}</h2>
          <p className="mt-1 text-[15px] font-medium text-[#ff5600]">{data.subtitle}</p>
          <p className="mt-4 text-[14.5px] leading-relaxed text-[#4b5563]">{data.body}</p>
        </Reveal>
      </div>
    </section>
  );
}
