"use client";

import { useEffect, useState } from "react";

/**
 * Global image lightbox. Opens when the user clicks any element with
 * `data-lightbox="<image src>"`, showing the image large.
 */
export function ImageLightbox() {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement)?.closest<HTMLElement>("[data-lightbox]");
      if (el) {
        const s = el.getAttribute("data-lightbox");
        if (s) {
          e.preventDefault();
          e.stopPropagation();
          setSrc(s);
        }
      }
    };
    document.addEventListener("click", onClick, true);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSrc(null);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = src ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [src]);

  if (!src) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/85 p-4"
      style={{ animation: "tkfade .2s ease" }}
      onClick={() => setSrc(null)}
    >
      <button
        aria-label="Đóng"
        onClick={() => setSrc(null)}
        className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-2xl text-white hover:bg-white/25"
      >
        ✕
      </button>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        className="max-h-[90vh] max-w-[92vw] rounded-xl object-contain shadow-2xl"
        style={{ animation: "tkmodal .25s ease" }}
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}
