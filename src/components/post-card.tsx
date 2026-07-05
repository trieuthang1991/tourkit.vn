import Image from "next/image";
import Link from "next/link";
import type { Post } from "@/lib/content";

export function PostCard({ post }: { post: Post }) {
  const href = `/tin-tuc-su-kien/${post.slug}`;
  return (
    <Link
      href={href}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-black/[0.04] bg-white shadow-[0_10px_28px_rgba(20,10,60,0.08)] transition hover:-translate-y-1 hover:shadow-[0_18px_44px_rgba(20,10,60,0.14)]"
    >
      <div className="aspect-[16/9] overflow-hidden">
        <Image src={post.image} alt={post.title} width={600} height={338} sizes="(max-width:640px) 88vw, (max-width:1024px) 45vw, 30vw" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-x-2 text-[12px] text-[#8169f1]">
          <span className="font-semibold">{post.category}</span>
          <span className="text-[#9ca3af]">· {post.date}</span>
        </div>
        <h3 className="mt-2 line-clamp-2 text-[16px] font-bold leading-snug text-[#111] group-hover:text-[#8169f1]">{post.title}</h3>
        <p className="mt-2 line-clamp-2 text-[13.5px] leading-relaxed text-[#6b7280]">{post.excerpt}</p>
        <span className="mt-auto pt-4 text-[13px] font-semibold text-[#8169f1]">Đọc thêm →</span>
      </div>
    </Link>
  );
}
