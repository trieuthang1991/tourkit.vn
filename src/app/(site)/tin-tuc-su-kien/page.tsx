export const dynamic = "force-dynamic";

import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { PostCard } from "@/components/post-card";
import { getPosts } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Tin tức - Sự kiện",
  description: "Điểm tin doanh nghiệp, thông tin sản phẩm và các sự kiện của Tourkit.",
  path: "/tin-tuc-su-kien",
});

export default async function TinTuc() {
  const { listTitle, listSubtitle, posts } = await getPosts();
  return (
    <>
      <PageHero breadcrumb="Tin tức – Sự Kiện" title={listTitle} subtitle={listSubtitle} />
      <section className="bg-[#f2f0fa] py-16">
        <div className="tk-container">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p, i) => (
              <Reveal key={p.slug} delay={(i % 3) * 70}>
                <PostCard post={p} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
