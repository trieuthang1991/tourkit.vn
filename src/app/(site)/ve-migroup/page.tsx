export const dynamic = "force-dynamic";

import Image from "next/image";
import { SmartLink } from "@/components/smart-link";
import { Reveal } from "@/components/reveal";
import { Carousel } from "@/components/carousel";
import { TeamGallery } from "@/components/home/social-proof";
import { getAbout, getHome } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Về Tourkit",
  description: "Tourkit - công ty công nghệ SaaS tiên phong cung cấp giải pháp quản trị doanh nghiệp du lịch toàn diện tại Việt Nam.",
  path: "/ve-migroup",
  image: "/images/about-mission.jpg",
});

export default async function VeTourkit() {
  const a = await getAbout();
  const home = await getHome();

  return (
    <>
      {/* Intro */}
      <section className="bg-white py-14 md:py-20">
        <div className="tk-container grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <Reveal>
            <p className="text-[13px] font-semibold uppercase tracking-widest text-[#5842bc]">〰 {a.intro.eyebrow}</p>
            <p className="mt-4 text-[15px] leading-[1.9] text-[#4b5563]">{a.intro.paragraph}</p>
            <p className="mt-4 text-[14px] font-semibold text-[#111]">Hệ thống sản phẩm của Công ty gồm:</p>
            <ul className="mt-3 space-y-2">
              {a.intro.products.map((p) => (
                <li key={p.name} className="flex gap-2 text-[14px] text-[#4b5563]">
                  <span className="mt-0.5 text-[#8169f1]">✦</span>
                  <span><span className="font-bold text-[#00129f]">{p.name}:</span> {p.desc}</span>
                </li>
              ))}
            </ul>
            <SmartLink href={a.intro.buttonHref} className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#5842bc] px-7 py-3 text-[14px] font-semibold text-white transition hover:bg-[#4a37a3]">
              {a.intro.buttonText} <span aria-hidden>→</span>
            </SmartLink>
          </Reveal>
          <Reveal delay={100} className="relative">
            <div className="overflow-hidden rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.12)]">
              <Image src={a.intro.image} alt="Tourkit" width={720} height={600} priority className="h-auto w-full object-cover" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Products */}
      <section className="relative overflow-hidden bg-white py-14">
        <Image src="/images/feat_circle.png" alt="" width={360} height={360} className="pointer-events-none absolute -left-24 top-6 w-[280px] opacity-20" aria-hidden />
        <div className="tk-container relative text-center">
          <Reveal>
            <p className="text-[13px] font-semibold uppercase tracking-widest text-[#5842bc]">{a.productsSection.eyebrow}</p>
            <h2 className="mx-auto mt-2 max-w-3xl text-[28px] font-bold leading-tight text-[#111] md:text-[38px]">
              {a.productsSection.titlePre} <span className="tk-text-gradient">{a.productsSection.titleHighlight}</span>
            </h2>
          </Reveal>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
            {a.productsSection.logos.map((l, i) => (
              <Reveal key={i} delay={i * 70}>
                <Image src={l} alt="Sản phẩm Tourkit" width={220} height={64} className="h-auto max-h-[46px] w-auto max-w-[180px] object-contain" />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Team gallery */}
      <TeamGallery data={home.gallery} />

      {/* Mission */}
      <section className="relative overflow-hidden bg-white py-14 md:py-20">
        <div className="tk-container grid items-center gap-12 lg:grid-cols-2">
          <Reveal className="relative flex justify-center">
            <Image src="/images/feat_circle.png" alt="" width={200} height={200} className="pointer-events-none absolute -left-4 -top-4 w-[130px] opacity-30" aria-hidden />
            <div className="aspect-square w-full max-w-[420px] overflow-hidden rounded-full border-8 border-[#f2f0fa] shadow-[0_20px_50px_rgba(0,0,0,0.12)]">
              <Image src={a.mission.image} alt="Triết lý làm việc Tourkit" width={520} height={520} className="h-full w-full object-cover" />
            </div>
          </Reveal>
          <Reveal delay={100}>
            <p className="text-[13px] font-semibold uppercase tracking-widest text-[#5842bc]">{a.mission.eyebrow}</p>
            <h2 className="mt-2 text-[28px] font-bold leading-tight text-[#111] md:text-[38px]">
              {a.mission.titlePre} <span className="tk-text-gradient">{a.mission.titleHighlight}</span>
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-[#4b5563]">{a.mission.text}</p>
            <ul className="mt-6 space-y-3">
              {a.mission.bullets.map((b) => (
                <li key={b} className="flex items-start gap-3 text-[14.5px] font-medium text-[#111]">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#f2f0fa] text-[12px] text-[#8169f1]">✦</span>
                  {b}
                </li>
              ))}
            </ul>
            <SmartLink href={a.mission.buttonHref} data-contact-popup className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#5842bc] px-7 py-3 text-[14px] font-semibold text-white transition hover:bg-[#4a37a3]">
              {a.mission.buttonText} <span aria-hidden>→</span>
            </SmartLink>
          </Reveal>
        </div>
      </section>

      {/* Press */}
      <section className="bg-[#f2f0fa] py-16">
        <div className="tk-container">
          <Reveal className="text-center">
            <p className="text-[13px] font-semibold uppercase tracking-widest text-[#5842bc]">{a.press.eyebrow}</p>
            <h2 className="mt-2 text-[26px] font-bold leading-tight text-[#111] md:text-[36px]">
              {a.press.titlePre} <span className="tk-text-gradient">{a.press.titleHighlight}</span>
            </h2>
          </Reveal>
          <Reveal delay={100} className="mx-auto mt-10 max-w-3xl">
            <Carousel slideBasis="basis-full" autoplayDelay={6000} dots gapPx={0}>
              {a.press.items.map((p) => (
                <figure key={p.source} className="relative flex flex-col rounded-3xl bg-white p-8 text-center shadow-[0_20px_50px_rgba(88,66,188,0.10)] md:p-12">
                  <blockquote className="text-[17px] font-medium leading-[1.9] text-[#374151] md:text-[19px]">“{p.quote}”</blockquote>
                  <figcaption className="mt-8 flex flex-col items-center">
                    <Image src={p.logo} alt={p.source} width={140} height={48} className="h-auto max-h-[42px] w-auto object-contain" />
                    <div className="mt-3 text-[16px] font-bold text-[#111]">{p.source}</div>
                    <div className="mt-1 max-w-md text-[13px] text-[#6b7280]">{p.desc}</div>
                  </figcaption>
                </figure>
              ))}
            </Carousel>
          </Reveal>
        </div>
      </section>
    </>
  );
}
