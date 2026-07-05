export const dynamic = "force-dynamic";

import { SmartLink } from "@/components/smart-link";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { Partners } from "@/components/home/partners";
import { getHome } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Hồ sơ năng lực",
  description: "Hồ sơ năng lực, số liệu và portfolio của Tourkit trong chuyển đổi số ngành du lịch.",
  path: "/ho-so-nang-luc",
});

const DOCS = [
  { label: "Profile Công Ty", href: "/docs/profile-migroup.pdf" },
  { label: "Portfolio Mistudio", href: "/docs/portfolio-mistudio.pdf" },
];

const STATS = [
  { num: "20K+", label: "Người dùng hệ thống" },
  { num: "300+", label: "Doanh nghiệp tin dùng" },
  { num: "4.8/5", label: "Đánh giá chất lượng phục vụ" },
  { num: "30+", label: "Dự án đã triển khai" },
];

export default async function HoSoNangLuc() {
  const c = await getHome();
  return (
    <>
      <PageHero
        breadcrumb="Hồ sơ năng lực"
        title="Hồ Sơ Năng Lực"
        subtitle="Năng lực và kinh nghiệm triển khai chuyển đổi số ngành du lịch của Tourkit."
      />
      <section className="bg-white py-16">
        <div className="tk-container">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STATS.map((s, i) => (
              <Reveal key={s.label} delay={i * 70}>
                <div className="rounded-2xl border border-black/5 bg-[#f2f0fa] p-6 text-center">
                  <div className="text-[34px] font-extrabold text-[#5842bc]">{s.num}</div>
                  <p className="mt-2 text-[14px] text-[#6b7280]">{s.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            {DOCS.map((d) => (
              <SmartLink key={d.label} href={d.href} className="rounded-full bg-[#8169f1] px-7 py-3 text-[15px] font-semibold text-white transition hover:bg-[#6f56e6]">
                {d.label}
              </SmartLink>
            ))}
          </div>
        </div>
      </section>
      <Partners data={c.partners} />
    </>
  );
}