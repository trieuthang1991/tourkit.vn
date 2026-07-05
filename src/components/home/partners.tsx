import Image from "next/image";
import { Reveal } from "@/components/reveal";
import { Carousel } from "@/components/carousel";
import type { HomeContent } from "@/lib/content";

export function Partners({ data }: { data: HomeContent["partners"] }) {
  return (
    <section className="bg-white py-16">
      <div className="tk-container">
        <Reveal>
          <h2 className="mx-auto max-w-3xl text-center text-[26px] font-bold text-[#111] md:text-[40px]">{data.pressTitle}</h2>
        </Reveal>

        {/* Featured partners — continuous marquee */}
        <div className="mt-14 text-center">
          <p className="text-[12px] font-semibold uppercase tracking-widest text-[#5842bc]">{data.featuredEyebrow}</p>
          <h3 className="mt-1 text-[28px] font-bold text-[#111] md:text-[40px]">{data.featuredTitle}</h3>
        </div>
      </div>

      <div className="tk-fullbleed mt-10">
        <Carousel variant="marquee" speed={1.4} slideBasis="basis-1/2 sm:basis-1/3 lg:basis-1/5" gapPx={16}>
          {[...data.featured, ...data.featured].map((p, i) => (
            <div key={i} className="flex h-[110px] items-center justify-center rounded-2xl border border-black/5 bg-white px-6 shadow-[0_6px_20px_rgba(0,0,0,0.05)]">
              <Image src={p.img} alt={p.name} width={160} height={60} className="max-h-[52px] w-auto object-contain" />
            </div>
          ))}
        </Carousel>
      </div>

      {/* Clients — single composite board */}
      <div className="tk-container">
        <div className="mt-20 text-center">
          <p className="text-[12px] font-semibold uppercase tracking-widest text-[#5842bc]">{data.clientsEyebrow}</p>
          <h3 className="mt-1 text-[28px] font-bold text-[#111] md:text-[40px]">{data.clientsTitle}</h3>
        </div>
        <Reveal className="mt-10">
          <Image
            src={data.clientsImage}
            alt="Đối tác & khách hàng của Tourkit"
            width={1024}
            height={843}
            className="mx-auto h-auto w-full max-w-[1000px] object-contain"
          />
        </Reveal>
      </div>
    </section>
  );
}
