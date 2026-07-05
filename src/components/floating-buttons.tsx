"use client";

import { useEffect, useState } from "react";
import type { SiteContent } from "@/lib/content";

function Icon({ type }: { type: string }) {
  const common = { width: 22, height: 22, viewBox: "0 0 24 24", fill: "currentColor" } as const;
  switch (type) {
    case "phone":
      return (
        <svg {...common}><path d="M6.62 10.79a15.53 15.53 0 006.59 6.59l2.2-2.2a1 1 0 011.02-.24 11.36 11.36 0 003.56.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.36 11.36 0 00.57 3.56 1 1 0 01-.24 1.02l-2.2 2.21z" /></svg>
      );
    case "facebook":
      return (
        <svg {...common}><path d="M22 12a10 10 0 10-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0022 12z" /></svg>
      );
    case "tiktok":
      return (
        <svg {...common}><path d="M16.6 5.82A4.28 4.28 0 0115.54 3h-3.09v12.4a2.59 2.59 0 01-2.59 2.5 2.59 2.59 0 01-2.59-2.59 2.59 2.59 0 012.59-2.59c.27 0 .53.04.77.12v-3.2a5.8 5.8 0 00-.77-.05A5.79 5.79 0 004.07 15.4a5.79 5.79 0 005.79 5.79 5.79 5.79 0 005.79-5.79V9.01a7.35 7.35 0 004.29 1.37V7.3a4.28 4.28 0 01-3.13-1.48z" /></svg>
      );
    case "zalo":
      return <span className="text-[13px] font-extrabold italic">Zalo</span>;
    default:
      return null;
  }
}

export function FloatingButtons({ data }: { data: SiteContent["floating"] }) {
  const [open, setOpen] = useState(true);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 500);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!data?.enabled) return null;

  return (
    <div className="fixed bottom-5 right-4 z-40 flex flex-col items-center gap-3">
      {showTop && (
        <button
          aria-label="Lên đầu trang"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-[#8169f1] text-white shadow-lg transition hover:bg-[#6f56e6]"
        >
          ↑
        </button>
      )}

      <div className="flex flex-col items-center gap-3">
        {open &&
          data.buttons.map((b) => (
            <a
              key={b.type}
              href={b.href}
              target={b.href.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              aria-label={b.label}
              title={b.label}
              className="flex h-12 w-12 animate-[tkpop_.25s_ease] items-center justify-center rounded-full bg-[#f15a22] text-white shadow-[0_6px_18px_rgba(241,90,34,0.5)] transition hover:scale-110"
            >
              <Icon type={b.type} />
            </a>
          ))}

        <button
          aria-label="Liên hệ nhanh"
          onClick={() => setOpen((v) => !v)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-[#2f7789] text-2xl text-white shadow-[0_6px_20px_rgba(47,119,137,0.5)] transition hover:bg-[#276474]"
        >
          <span className={`transition-transform ${open ? "rotate-45" : ""}`}>+</span>
        </button>
      </div>
    </div>
  );
}
