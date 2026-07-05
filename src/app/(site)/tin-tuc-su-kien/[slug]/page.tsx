export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/reveal";
import { PostBody } from "@/components/post-body";
import { PostCard } from "@/components/post-card";
import { getPost, getPosts } from "@/lib/content";
import { pageMeta, SITE_URL } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Không tìm thấy bài viết", robots: { index: false } };
  return pageMeta({
    title: post.title,
    description: post.excerpt,
    path: `/tin-tuc-su-kien/${post.slug}`,
    image: post.image,
    type: "article",
  });
}

export default async function PostDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const { posts } = await getPosts();
  const related = posts.filter((p) => p.slug !== slug).slice(0, 3);

  const url = `${SITE_URL}/tin-tuc-su-kien/${post.slug}`;
  const isoDate = /(\d{2})\/(\d{2})\/(\d{4})/.exec(post.date);
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: post.title,
        description: post.excerpt,
        image: `${SITE_URL}${post.image}`,
        author: { "@type": "Organization", name: "Tourkit" },
        publisher: { "@id": `${SITE_URL}/#organization` },
        ...(isoDate ? { datePublished: `${isoDate[3]}-${isoDate[2]}-${isoDate[1]}` } : {}),
        mainEntityOfPage: url,
        articleSection: post.category,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Trang chủ", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Tin tức – Sự Kiện", item: `${SITE_URL}/tin-tuc-su-kien` },
          { "@type": "ListItem", position: 3, name: post.title, item: url },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {/* Header band */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#8169f1] to-[#5842bc] py-14 text-white md:py-16">
        <div
          className="absolute inset-0 opacity-20"
          style={{ backgroundImage: "url(/images/head7_bg.png)", backgroundSize: "cover", backgroundPosition: "center" }}
          aria-hidden
        />
        <div className="tk-container relative">
          <div className="flex flex-wrap items-center gap-2 text-[13px] text-white/80">
            <Link href="/tin-tuc-su-kien" className="hover:text-white">Tin tức – Sự Kiện</Link>
            <span>/</span>
            <span className="text-white/60">{post.category}</span>
          </div>
          <h1 className="mt-3 max-w-4xl text-[26px] font-extrabold leading-tight md:text-[38px]">{post.title}</h1>
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1 text-[13px] text-white/80">
            <span>✍ {post.author}</span>
            <span>📅 {post.date}</span>
            <span>🏷 {post.category}</span>
          </div>
        </div>
      </section>

      {/* Body */}
      <article className="bg-white py-12">
        <div className="tk-container max-w-[820px]">
          <Reveal className="overflow-hidden rounded-2xl">
            <Image src={post.image} alt={post.title} width={820} height={460} priority className="h-auto w-full object-cover" />
          </Reveal>
          <div className="mt-8">
            <PostBody html={post.content} />
          </div>

          <div className="mt-10 flex flex-wrap gap-3 border-t border-black/5 pt-6">
            <Link href="/tin-tuc-su-kien" className="rounded-full border-2 border-[#8169f1] px-6 py-2.5 text-[14px] font-semibold text-[#8169f1] transition hover:bg-[#8169f1] hover:text-white">
              ← Tất cả bài viết
            </Link>
            <Link data-contact-popup href="/lien-he" className="rounded-full bg-[#ff6400] px-6 py-2.5 text-[14px] font-semibold text-white transition hover:bg-[#ff5600]">
              Đăng ký tư vấn
            </Link>
          </div>
        </div>
      </article>

      {/* Related */}
      {related.length > 0 && (
        <section className="bg-[#f2f0fa] py-14">
          <div className="tk-container">
            <h2 className="text-center text-[24px] font-bold text-[#111] md:text-[32px]">Bài viết liên quan</h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p, i) => (
                <Reveal key={p.slug} delay={i * 80}>
                  <PostCard post={p} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
