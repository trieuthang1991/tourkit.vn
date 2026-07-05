import Image from "next/image";
import { Reveal } from "@/components/reveal";
import { Carousel } from "@/components/carousel";
import { SmartLink } from "@/components/smart-link";
import type { HomeContent } from "@/lib/content";

const BTN_STYLES: Record<string, string> = {
  purple: "bg-[#5842bc] text-white hover:bg-[#4a37a3]",
  orange: "bg-[#ff6400] text-white hover:bg-[#ff5600]",
  outline: "bg-white text-[#111] border border-black/10 hover:border-[#8169f1] hover:text-[#8169f1]",
};

export function Solutions({ data }: { data: HomeContent["solutions"] }) {
  // Embla only loops when there are enough off-screen slides to reposition.
  // With few items (3 visible on desktop) the loop is silently disabled, so we
  // repeat the list to give the carousel room to loop + autoplay infinitely.
  const items = data.items.length < 6 ? [...data.items, ...data.items] : data.items;
  return (
    <section className="relative overflow-hidden bg-[#f2f0fa] py-16">
      <Image src="/images/feat_circle.png" alt="" width={480} height={480} className="pointer-events-none absolute -right-24 top-10 w-[380px] opacity-30" aria-hidden />
      <Image src="/images/feat_circle.png" alt="" width={360} height={360} className="pointer-events-none absolute -left-28 top-40 w-[300px] opacity-20" aria-hidden />
      <div className="tk-container relative">
        <Reveal className="text-center">
          <p className="text-[13px] font-semibold uppercase tracking-wide text-[#ff5600]">{data.eyebrow}</p>
          <h2 className="mx-auto mt-3 max-w-4xl text-[28px] font-bold leading-tight text-[#111] md:text-[40px]">
            {data.titlePre} <span className="tk-text-gradient">{data.titleHighlight}</span>{" "}
            <span className="block md:inline">{data.titlePost}</span>
          </h2>
        </Reveal>

        <div className="tk-fullbleed mt-12">
          <Carousel variant="marquee" speed={1} slideBasis="basis-[85%] sm:basis-1/2 lg:basis-1/3" gapPx={20}>
            {items.map((s, i) => (
              <SmartLink
                key={`${s.title}-${i}`}
                href={s.href}
                className="group flex h-full flex-col items-center gap-4 rounded-3xl bg-white p-6 text-center shadow-[0_10px_30px_rgba(0,0,0,0.05)] transition hover:shadow-[0_18px_44px_rgba(0,0,0,0.12)]"
              >
                <div className="flex h-[70px] items-center justify-center">
                  <Image src={s.logo} alt={s.title} width={280} height={84} className="h-auto max-h-[56px] w-auto max-w-[190px] object-contain" />
                </div>
                <div>
                  <h4 className="text-[18px] font-bold leading-snug text-[#00129f] group-hover:text-[#8169f1]">{s.title}</h4>
                  <p className="mt-2 text-[14px] leading-relaxed text-[#4b5563]">{s.desc}</p>
                </div>
              </SmartLink>
            ))}
          </Carousel>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          {data.buttons.map((b) => (
            <SmartLink
              key={b.label}
              href={b.href}
              className={`inline-flex items-center gap-2 rounded-full px-7 py-3 text-[14px] font-semibold shadow-sm transition ${BTN_STYLES[b.variant ?? "outline"] ?? BTN_STYLES.outline}`}
            >
              {b.label} <span aria-hidden>→</span>
            </SmartLink>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureBlock({ pre, highlight, desc, img, imgAlt }: { pre: string; highlight: string; desc?: string; img: string; imgAlt: string }) {
  return (
    <div className="tk-container py-14 text-center">
      <Reveal>
        <h2 className="mx-auto max-w-4xl text-[28px] font-bold leading-tight text-[#111] md:text-[40px]">
          {pre} {highlight && <span className="tk-text-gradient">{highlight}</span>}
        </h2>
        {desc && <p className="mx-auto mt-4 max-w-3xl text-[15px] leading-relaxed text-[#4b5563]">{desc}</p>}
      </Reveal>
      <Reveal delay={120} className="mt-10">
        <Image src={img} alt={imgAlt} width={1200} height={700} className="mx-auto h-auto w-full max-w-[1000px] object-contain" />
      </Reveal>
    </div>
  );
}

export function FeatureShowcase({ introImage, features }: { introImage: string; features: HomeContent["features"] }) {
  return (
    <section className="bg-white">
      <div className="tk-container pt-6">
        <Reveal className="overflow-hidden rounded-3xl">
          <Image src={introImage} alt="Tourkit dashboard" width={1280} height={681} className="mx-auto h-auto w-full object-contain" />
        </Reveal>
      </div>
      {features.map((f) => (
        <FeatureBlock key={f.pre} pre={f.pre} highlight={f.highlight} desc={f.desc} img={f.img} imgAlt={f.pre} />
      ))}
    </section>
  );
}
