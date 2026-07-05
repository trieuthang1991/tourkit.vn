import { Reveal } from "@/components/reveal";

export function PageHero({
  breadcrumb,
  title,
  subtitle,
}: {
  breadcrumb: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#8169f1] to-[#5842bc] py-16 text-white md:py-20">
      <div
        className="absolute inset-0 opacity-20"
        style={{ backgroundImage: "url(/images/head7_bg.png)", backgroundSize: "cover", backgroundPosition: "center" }}
        aria-hidden
      />
      <div className="tk-container relative text-center">
        <Reveal>
          <p className="text-[13px] font-medium uppercase tracking-widest text-white/70">{breadcrumb}</p>
          <h1 className="mx-auto mt-3 max-w-3xl text-[32px] font-extrabold leading-tight md:text-[46px]">{title}</h1>
          {subtitle && <p className="mx-auto mt-4 max-w-2xl text-[16px] text-white/85">{subtitle}</p>}
        </Reveal>
      </div>
    </section>
  );
}
