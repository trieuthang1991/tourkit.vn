export const dynamic = "force-dynamic";

import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { ConsultForm } from "@/components/consult-form";
import { getSite } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Liên hệ",
  description: "Liên hệ với đội ngũ Tourkit - Giải pháp quản trị doanh nghiệp du lịch toàn diện. Hotline 0383.202.404.",
  path: "/lien-he",
});

export default async function LienHe() {
  const site = await getSite();
  return (
    <>
      <PageHero
        breadcrumb="Liên hệ"
        title="Liên Hệ Với Chúng Tôi"
        subtitle="Hãy gửi cho chúng tôi những thắc mắc, góp ý hoặc đề nghị hợp tác của bạn. Chúng tôi sẽ phản hồi trong thời gian sớm nhất!"
      />
      <section className="bg-white py-16">
        <div className="tk-container grid gap-10 lg:grid-cols-2">
          <Reveal>
            <h2 className="text-[26px] font-bold text-[#111]">{site.footer.companyName}</h2>
            <div className="mt-6 space-y-6">
              {site.footer.offices.map((o) => (
                <div key={o.city} className="rounded-2xl border border-black/5 bg-[#f2f0fa] p-5">
                  <h3 className="text-[16px] font-bold text-[#8169f1]">{o.city}</h3>
                  <p className="mt-1 text-[14px] text-[#4b5563]">{o.addr}</p>
                </div>
              ))}
              <div className="rounded-2xl border border-black/5 bg-[#f2f0fa] p-5">
                <p className="text-[14px] text-[#4b5563]"><span className="font-semibold text-[#111]">Hotline:</span> {site.footer.hotline}</p>
                <p className="mt-1 text-[14px] text-[#4b5563]"><span className="font-semibold text-[#111]">Email:</span> {site.footer.email}</p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="rounded-2xl bg-white p-6 shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
              <h3 className="text-[20px] font-bold text-[#111]">{site.consult.title}</h3>
              <p className="mt-1 text-[13.5px] text-[#6b7280]">{site.consult.subtitle}</p>
              <hr className="my-5 border-black/5" />
              <ConsultForm data={site.consult} source="lien-he" />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
