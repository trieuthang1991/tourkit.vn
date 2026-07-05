"use client";

import { useState } from "react";
import type { SiteContent } from "@/lib/content";

type Consult = SiteContent["consult"];

export function ConsultForm({
  data,
  onDone,
  source = "website",
}: {
  data: Consult;
  onDone?: () => void;
  source?: string;
}) {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const fd = new FormData(e.currentTarget);
    const values: Record<string, string> = {};
    fd.forEach((v, k) => (values[k] = String(v)));
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source, values }),
      });
      if (!res.ok) throw new Error();
      setSent(true);
    } catch {
      setError("Gửi thất bại, vui lòng thử lại hoặc gọi 0383.202.404.");
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <div className="py-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl text-green-600">✓</div>
        <h3 className="mt-4 text-[20px] font-bold text-[#111]">Đã gửi thành công!</h3>
        <p className="mt-2 text-[14px] text-[#6b7280]">{data.successText}</p>
        {onDone && (
          <button onClick={onDone} className="mt-6 rounded-full bg-[#8169f1] px-6 py-2.5 text-[14px] font-semibold text-white hover:bg-[#6f56e6]">
            Đóng
          </button>
        )}
      </div>
    );
  }

  const inputCls =
    "w-full rounded-xl border border-black/10 px-4 py-3 text-[14px] outline-none focus:border-[#8169f1]";

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-2 gap-3">
      {data.fields.map((f) => (
        <div key={f.name} className={f.width === "full" ? "col-span-2" : "col-span-2 sm:col-span-1"}>
          {f.type === "select" ? (
            <select name={f.name} required={f.required} defaultValue={f.options?.[0] ?? ""} className={`${inputCls} bg-white`}>
              {(f.options ?? []).map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          ) : (
            <input
              name={f.name}
              type={f.type || "text"}
              required={f.required}
              placeholder={f.placeholder + (f.required ? " *" : "")}
              className={inputCls}
            />
          )}
        </div>
      ))}
      {error && <p className="col-span-2 text-[12px] text-red-500">{error}</p>}
      <div className="col-span-2">
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-[#ff6400] py-3 text-[15px] font-semibold text-white transition hover:bg-[#ff5600] disabled:opacity-60"
        >
          {submitting ? "Đang gửi…" : data.submitText}
        </button>
      </div>
    </form>
  );
}
