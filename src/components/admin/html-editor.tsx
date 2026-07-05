"use client";

import { useEffect, useRef } from "react";

// Load the self-hosted TinyMCE script once.
let tinyPromise: Promise<void> | null = null;
function loadTiny(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  // @ts-expect-error global
  if (window.tinymce) return Promise.resolve();
  if (tinyPromise) return tinyPromise;
  tinyPromise = new Promise<void>((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "/tinymce/tinymce.min.js";
    s.referrerPolicy = "origin";
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Không tải được TinyMCE"));
    document.head.appendChild(s);
  });
  return tinyPromise;
}

export function HtmlEditor({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const elRef = useRef<HTMLTextAreaElement | null>(null);
  const edRef = useRef<unknown>(null);
  const lastValue = useRef(value);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    let cancelled = false;
    loadTiny().then(() => {
      if (cancelled || !elRef.current) return;
      // @ts-expect-error global
      window.tinymce.init({
        target: elRef.current,
        license_key: "gpl",
        base_url: "/tinymce",
        suffix: ".min",
        height: 420,
        menubar: false,
        branding: false,
        promotion: false,
        plugins: "lists link image code table autolink",
        toolbar:
          "undo redo | blocks | bold italic underline | bullist numlist | link image table | alignleft aligncenter alignright | code removeformat",
        content_style: "body{font-family:'Lexend Deca',sans-serif;font-size:15px;line-height:1.7}",
        setup: (ed: {
          on: (ev: string, cb: () => void) => void;
          getContent: () => string;
        }) => {
          edRef.current = ed;
          const push = () => {
            const c = ed.getContent();
            lastValue.current = c;
            onChangeRef.current(c);
          };
          ed.on("change keyup input undo redo SetContent", push);
        },
        init_instance_callback: (ed: { setContent: (v: string) => void }) => {
          ed.setContent(value || "");
        },
      });
    });
    return () => {
      cancelled = true;
      const ed = edRef.current as { remove?: () => void } | null;
      if (ed && typeof ed.remove === "function") ed.remove();
      edRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // reflect external value changes (e.g. switching records) into the editor
  useEffect(() => {
    const ed = edRef.current as { getContent: () => string; setContent: (v: string) => void } | null;
    if (ed && value !== lastValue.current && value !== ed.getContent()) {
      ed.setContent(value || "");
      lastValue.current = value;
    }
  }, [value]);

  return (
    <div className="tk-html-editor">
      <textarea ref={elRef} defaultValue={value} />
    </div>
  );
}
