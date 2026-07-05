"use client";

import { useEffect, useState } from "react";
import type { SiteContent } from "@/lib/content";
import { ConsultForm } from "@/components/consult-form";

/**
 * Global consultation popup. Opens whenever the user clicks any element that has
 * a `data-contact-popup` attribute (works from server-rendered links too).
 */
export function ContactPopup({ data }: { data: SiteContent["consult"] }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement)?.closest("[data-contact-popup]");
      if (el) {
        e.preventDefault();
        e.stopPropagation();
        setOpen(true);
      }
    };
    // Capture phase so we intercept before Next.js <Link> navigation runs.
    document.addEventListener("click", onClick, true);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-black/50 p-4"
      style={{ animation: "tkfade .2s ease" }}
      onClick={() => setOpen(false)}
    >
      <div
        className="relative my-8 w-full max-w-3xl rounded-2xl bg-white p-7 shadow-2xl md:p-9"
        style={{ animation: "tkmodal .25s ease" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          aria-label="Đóng"
          onClick={() => setOpen(false)}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-[#9ca3af] hover:bg-black/5"
        >
          ✕
        </button>
        <h3 className="pr-8 text-[24px] font-bold text-[#111]">{data.title}</h3>
        <p className="mt-1 text-[13.5px] leading-relaxed text-[#6b7280]">{data.subtitle}</p>
        <hr className="my-5 border-black/5" />
        <ConsultForm data={data} source="popup" onDone={() => setOpen(false)} />
      </div>
    </div>
  );
}
