import Image from "next/image";
import { Reveal } from "@/components/reveal";
import { Carousel } from "@/components/carousel";
import { SmartLink } from "@/components/smart-link";
import type { HomeContent } from "@/lib/content";

export function Testimonials({ data }: { data: HomeContent["testimonials"] }) {
  return (
    <section className="bg-[#f2f0fa] py-16 md:py-20">
      <div className="tk-container">
        <div className="grid items-center gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16">
          {/* Left: intro + stats + CTA */}
          <Reveal>
            <p className="text-[12px] font-semibold uppercase tracking-widest text-[#5842bc]">{data.eyebrow}</p>
            <h2 className="mt-2 text-[28px] font-bold leading-tight text-[#111] md:text-[38px]">{data.title}</h2>
            <div className="mt-8 flex gap-10">
              {data.stats.map((s) => (
                <div key={s.label}>
                  <div className="text-[34px] font-extrabold text-[#5842bc]">{s.num}</div>
                  <p className="mt-1 text-[13px] leading-snug text-[#6b7280]">{s.label}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              {data.links.map((l) => (
                <SmartLink
                  key={l.label}
                  href={l.href}
                  className={l.variant === "purple"
                    ? "rounded-full bg-[#8169f1] px-6 py-2.5 text-[14px] font-semibold text-white hover:bg-[#6f56e6]"
                    : "rounded-full border-2 border-[#8169f1] px-6 py-2.5 text-[14px] font-semibold text-[#8169f1] hover:bg-[#8169f1] hover:text-white"}
                >
                  {l.label}
                </SmartLink>
              ))}
            </div>
          </Reveal>

          {/* Right: single testimonial card that cross-fades */}
          <Reveal delay={100}>
            <Carousel slideBasis="basis-full" autoplayDelay={5000} dots gapPx={0}>
              {data.items.map((t) => (
                <figure key={t.name} className="relative flex min-h-[260px] flex-col rounded-3xl bg-white p-8 shadow-[0_20px_50px_rgba(88,66,188,0.10)] md:p-10">
                  <span className="absolute right-8 top-6 font-serif text-[80px] leading-none text-[#8169f1]/15">”</span>
                  <blockquote className="relative flex-1 text-[16px] leading-[1.9] text-[#4b5563]">{t.quote}</blockquote>
                  <figcaption className="mt-6 flex items-center gap-4 border-t border-black/5 pt-5">
                    <Image src={t.avatar} alt={t.name} width={56} height={56} className="h-14 w-14 rounded-full object-cover ring-2 ring-[#8169f1]/20" />
                    <div>
                      <div className="text-[15px] font-bold text-[#111]">{t.name}</div>
                      <div className="text-[12px] text-[#6b7280]">{t.role}</div>
                    </div>
                  </figcaption>
                </figure>
              ))}
            </Carousel>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function TeamGallery({ data }: { data: HomeContent["gallery"] }) {
  return (
    <section className="bg-white py-16">
      <div className="tk-container">
        <Reveal className="text-center">
          <p className="text-[13px] font-semibold uppercase tracking-widest text-[#5842bc]">{data.eyebrow}</p>
          <h2 className="mt-2 text-[28px] font-bold text-[#111] md:text-[40px]">{data.title}</h2>
        </Reveal>
      </div>
      <div className="tk-fullbleed mt-10">
        <Carousel variant="marquee" speed={1.1} slideBasis="basis-1/2 sm:basis-1/3 lg:basis-1/5" gapPx={12}>
          {data.images.map((src) => (
            <button key={src} type="button" data-lightbox={src} className="block aspect-square cursor-zoom-in overflow-hidden rounded-2xl">
              <Image src={src} alt="Hoạt động Tourkit" width={600} height={600} className="h-full w-full object-cover transition duration-500 hover:scale-105" />
            </button>
          ))}
        </Carousel>
      </div>
    </section>
  );
}

export function SocialSection({ data }: { data: HomeContent["social"] }) {
  const words = data.title.split(" ");
  return (
    <section className="relative overflow-hidden bg-black pb-24 pt-16 text-white md:pb-28">
      <div className="tk-container grid items-center gap-10 md:grid-cols-2 md:gap-14">
        {/* Video */}
        <Reveal>
          {data.videoId ? (
            <button data-video={data.videoId} aria-label="Xem video" className="group relative block w-full overflow-hidden rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
              <Image src={data.videoThumb || "/images/Thiet-ke-chua-co-ten.jpg"} alt="Video Tourkit" width={682} height={420} className="h-auto w-full object-cover transition duration-500 group-hover:scale-105" />
              <span className="absolute inset-0 flex items-center justify-center bg-black/20 transition group-hover:bg-black/30">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-[24px] text-[#ff5600] shadow-lg transition group-hover:scale-110">▶</span>
              </span>
            </button>
          ) : (
            <Image src={data.videoThumb || "/images/Thiet-ke-chua-co-ten.jpg"} alt="Tourkit" width={682} height={420} className="h-auto w-full rounded-2xl object-cover" />
          )}
        </Reveal>

        {/* Social list */}
        <Reveal delay={100}>
          <p className="text-[13px] font-semibold uppercase tracking-widest text-white/50">{data.eyebrow}</p>
          <h2 className="mt-2 text-[30px] font-bold leading-tight md:text-[42px]">
            {words.slice(0, 2).join(" ")} <span className="tk-text-gradient">{words.slice(2, 4).join(" ")}</span>
            <span className="block">{words.slice(4).join(" ")}</span>
          </h2>
          <div className="mt-8 space-y-4">
            {data.items.map((s) => (
              <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4 rounded-2xl p-2 transition hover:bg-white/5">
                <Image src={s.img} alt={s.name} width={56} height={56} className="h-14 w-14 shrink-0 rounded-2xl object-contain" />
                <div>
                  <div className="text-[17px] font-bold">{s.name}</div>
                  <div className="text-[13px] text-white/50">{s.desc}</div>
                </div>
              </a>
            ))}
          </div>
        </Reveal>
      </div>

      {/* Wavy bottom edge */}
      <svg className="pointer-events-none absolute inset-x-0 bottom-0 h-6 w-full md:h-9" viewBox="0 0 1440 40" preserveAspectRatio="none" aria-hidden>
        <path d="M0,20 Q360,44 720,20 T1440,20 L1440,40 L0,40 Z" fill="#f2f0fa" />
      </svg>
    </section>
  );
}

export function NewsSection({ data }: { data: HomeContent["news"] }) {
  return (
    <section className="bg-[#f2f0fa] py-16">
      <div className="tk-container">
        <Reveal className="text-center">
          <p className="text-[13px] font-semibold uppercase tracking-widest text-[#5842bc]">{data.eyebrow}</p>
          <h2 className="mt-2 text-[26px] font-bold text-[#111] md:text-[40px]">{data.title}</h2>
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {data.items.map((n, i) => (
            <Reveal key={n.title} delay={i * 90}>
              <SmartLink href={n.href} className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-[0_10px_28px_rgba(0,0,0,0.06)] transition hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,0.12)]">
                <div className="aspect-[16/9] overflow-hidden">
                  <Image src={n.img} alt={n.title} width={600} height={338} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex flex-wrap items-center gap-x-2 text-[12px] text-[#8169f1]">
                    <span className="font-semibold">{n.cat}</span>
                    <span className="text-[#9ca3af]">· {n.date}</span>
                  </div>
                  <h3 className="mt-2 text-[16px] font-bold leading-snug text-[#111] group-hover:text-[#8169f1]">{n.title}</h3>
                  <span className="mt-auto pt-4 text-[13px] font-semibold text-[#8169f1]">Đọc thêm →</span>
                </div>
              </SmartLink>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
