export const dynamic = "force-dynamic";

import { PageHero } from "@/components/page-hero";
import { Solutions } from "@/components/home/solutions";
import { Partners } from "@/components/home/partners";
import { getHome } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Dịch vụ",
  description: "Các giải pháp toàn diện của Tourkit cho doanh nghiệp du lịch: CRM, HRM, Website, Affiliate, Chuyển đổi số.",
  path: "/dich-vu",
});

export default async function DichVu() {
  const c = await getHome();
  return (
    <>
      <PageHero
        breadcrumb="Dịch Vụ"
        title="Giải Pháp Toàn Diện Cho Doanh Nghiệp Du Lịch"
        subtitle="Hệ sinh thái sản phẩm Tourkit đồng hành cùng doanh nghiệp du lịch từ vận hành, marketing đến kết nối."
      />
      <Solutions data={c.solutions} />
      <Partners data={c.partners} />
    </>
  );
}