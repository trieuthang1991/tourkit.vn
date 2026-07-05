"use client";

import { useEffect, useState } from "react";

function ytId(raw: string): string {
  if (!raw) return "";
  const m = raw.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/);
  return m ? m[1] : raw.trim();
}

/**
 * Global video lightbox. Opens whenever the user clicks:
 *  - any element with `data-video="<youtube url or id>"`
 *  - any link to youtube.com/watch, youtu.be, or youtube embed
 * Plays the video in a modal instead of navigating away.
 */
export function VideoPopup() {
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      const dv = t?.closest("[data-video]");
      const a = t?.closest<HTMLAnchorElement>(
        'a[href*="youtube.com/watch"], a[href*="youtu.be/"], a[href*="youtube.com/embed"], a[href*="youtube.com/shorts"]'
      );
      const raw = dv ? dv.getAttribute("data-video") : a ? a.getAttribute("href") : null;
      if (raw) {
        e.preventDefault();
        e.stopPropagation();
        setId(ytId(raw));
      }
    };
    document.addEventListener("click", onClick, true);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setId(null);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = id ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [id]);

  if (!id) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 p-4"
      style={{ animation: "tkfade .2s ease" }}
      onClick={() => setId(null)}
    >
      <div className="relative aspect-video w-full max-w-4xl" style={{ animation: "tkmodal .25s ease" }} onClick={(e) => e.stopPropagation()}>
        <button
          aria-label="Đóng"
          onClick={() => setId(null)}
          className="absolute -top-11 right-0 flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-2xl text-white hover:bg-white/25"
        >
          ✕
        </button>
        <iframe
          className="h-full w-full rounded-xl"
          src={`https://www.youtube.com/embed/${id}?autoplay=1&rel=0`}
          title="Video"
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
        />
      </div>
    </div>
  );
}
