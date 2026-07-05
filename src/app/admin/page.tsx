"use client";

import { useCallback, useEffect, useState } from "react";
import { HtmlEditor } from "@/components/admin/html-editor";

type Json = unknown;
type FileMeta = { file: string; label: string };

const LABELS: Record<string, string> = {
  brand: "Thương hiệu", logo: "Logo", logoFooter: "Logo footer",
  contact: "Liên hệ", email: "Email", phone: "Điện thoại", address: "Địa chỉ", footerEmail: "Email footer",
  nav: "Menu điều hướng", label: "Nhãn", href: "Đường dẫn", title: "Tiêu đề", desc: "Mô tả",
  ctaButton: "Nút CTA", serviceMenu: "Menu dịch vụ", heading: "Tiêu đề nhóm", items: "Danh sách", icon: "Icon",
  ctaBand: "Dải CTA", text: "Nội dung", buttonText: "Chữ nút", buttonHref: "Link nút", image: "Ảnh",
  footer: "Chân trang", companyName: "Tên công ty", offices: "Văn phòng", city: "Chi nhánh", addr: "Địa chỉ",
  hotline: "Hotline", facebook: "Facebook", youtube: "Youtube", serviceLinks: "Link dịch vụ",
  infoLinks: "Link thông tin", copyright: "Bản quyền",
  hero: "Hero (đầu trang)", titleLine1: "Dòng tiêu đề 1", titleHighlight: "Chữ nhấn", subtitle: "Phụ đề",
  ctaText: "Chữ nút", ctaHref: "Link nút", supportLabel: "Nhãn support", supportEmail: "Email support",
  erp: "Khối ERP", eyebrow: "Nhãn nhỏ", body: "Đoạn văn",
  solutions: "Giải pháp", titlePre: "Tiêu đề (trước)", titlePost: "Tiêu đề (sau)", buttons: "Nút", variant: "Kiểu",
  featureIntroImage: "Ảnh mở đầu tính năng", features: "Các khối tính năng", pre: "Tiêu đề", highlight: "Chữ nhấn", img: "Ảnh",
  caseStudies: "Câu chuyện chuyển đổi số", tag: "Nhãn", websites: "Dự án Website",
  contactStrip: "Dải liên hệ", small: "Chữ nhỏ",
  partners: "Đối tác", pressTitle: "Tiêu đề báo chí", featuredEyebrow: "Nhãn (tiêu biểu)", featuredTitle: "Tiêu đề (tiêu biểu)",
  featured: "Đối tác tiêu biểu", clientsEyebrow: "Nhãn (khách hàng)", clientsTitle: "Tiêu đề (khách hàng)", clients: "Logo khách hàng", name: "Tên",
  testimonials: "Đánh giá", stats: "Số liệu", num: "Số", links: "Liên kết", avatar: "Ảnh đại diện", role: "Chức vụ", quote: "Nội dung",
  gallery: "Thư viện ảnh", images: "Ảnh", social: "Mạng xã hội", news: "Tin tức", cat: "Chuyên mục", date: "Ngày",
  floating: "Nút nổi (góc phải)", enabled: "Bật/Tắt", type: "Loại",
  chat: "Chat Pancake", src: "Đường dẫn script", consult: "Form đăng ký / tư vấn", submitText: "Chữ nút gửi",
  successText: "Lời cảm ơn sau khi gửi", fields: "Các trường nhập", placeholder: "Nhãn ô nhập",
  width: "Độ rộng (full/half)", options: "Tùy chọn dropdown",
  posts: "Bài viết", excerpt: "Tóm tắt", content: "Nội dung bài", author: "Tác giả",
  slug: "Đường dẫn (slug)", listTitle: "Tiêu đề trang", listSubtitle: "Phụ đề trang", category: "Chuyên mục",
  projects: "Dự án", videoId: "ID video Youtube",
  intro: "Giới thiệu", paragraph: "Đoạn giới thiệu", products: "Danh sách sản phẩm",
  productsSection: "Khối sản phẩm", logos: "Logo sản phẩm", mission: "Sứ mệnh / Triết lý",
  bullets: "Gạch đầu dòng", press: "Báo chí", attrName: "Nguồn trích dẫn", attrDesc: "Mô tả nguồn",
  source: "Nguồn báo",
};

const LEAD_LABELS: Record<string, string> = {
  "company-name": "Công ty", "your-name": "Họ & Tên", role: "Chức vụ",
  "your-email": "Email", "your-phone": "Điện thoại", "company-size": "Quy mô",
  region: "Khu vực", need: "Nhu cầu", name: "Họ tên", phone: "Điện thoại", email: "Email",
};

const FILE_ICONS: Record<string, string> = {
  "site.json": "⚙️",
  "home.json": "🏠",
  "posts.json": "📰",
  "projects.json": "🗂️",
  "about.json": "🏢",
};

// Files that are large collections → edit one item at a time (avoids mounting many editors)
const COLLECTIONS: Record<string, { key: string; labelField: string; itemName: string }> = {
  "posts.json": { key: "posts", labelField: "title", itemName: "bài viết" },
  "projects.json": { key: "projects", labelField: "title", itemName: "dự án" },
};

function label(key: string) {
  return LABELS[key] ?? key;
}
function isImageKey(key: string) {
  return /(^|_)(img|image|logo|logoFooter|icon|avatar|src)$/i.test(key);
}
function isLongText(key: string, val: string) {
  return key === "body" || key === "quote" || key === "text" || key === "desc" || val.length > 70 || val.includes("\n");
}

function setAtPath(root: Json, path: (string | number)[], value: Json): Json {
  if (path.length === 0) return value;
  const clone: Json = Array.isArray(root) ? [...root] : { ...(root as Record<string, unknown>) };
  const [head, ...rest] = path;
  // @ts-expect-error dynamic index
  clone[head] = setAtPath((root as Record<string | number, Json>)[head], rest, value);
  return clone;
}

function emptyLike(sample: Json): Json {
  if (typeof sample === "string") return "";
  if (typeof sample === "number") return 0;
  if (typeof sample === "boolean") return false;
  if (Array.isArray(sample)) return [];
  if (sample && typeof sample === "object") {
    const o: Record<string, Json> = {};
    for (const k of Object.keys(sample as object)) o[k] = emptyLike((sample as Record<string, Json>)[k]);
    return o;
  }
  return "";
}

function Node({
  value,
  path,
  keyName,
  onChange,
}: {
  value: Json;
  path: (string | number)[];
  keyName: string;
  onChange: (path: (string | number)[], value: Json) => void;
}) {
  // Primitive: string
  if (typeof value === "string") {
    // Rich HTML editor for post/project body
    if (keyName === "content") {
      return (
        <label className="block">
          <span className="mb-1 block text-[12px] font-semibold text-[#4b5563]">{label(keyName)} (HTML)</span>
          <HtmlEditor value={value} onChange={(v) => onChange(path, v)} />
        </label>
      );
    }
    const long = isLongText(keyName, value);
    return (
      <label className="block">
        <span className="mb-1 block text-[12px] font-semibold text-[#4b5563]">{label(keyName)}</span>
        {long ? (
          <textarea
            className="w-full rounded-lg border border-black/10 px-3 py-2 text-[13px] outline-none focus:border-[#8169f1]"
            rows={value.length > 200 ? 5 : 3}
            value={value}
            onChange={(e) => onChange(path, e.target.value)}
          />
        ) : (
          <input
            className="w-full rounded-lg border border-black/10 px-3 py-2 text-[13px] outline-none focus:border-[#8169f1]"
            value={value}
            onChange={(e) => onChange(path, e.target.value)}
          />
        )}
        {isImageKey(keyName) && value.startsWith("/") && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="mt-2 h-14 w-auto rounded border border-black/10 object-contain" />
        )}
      </label>
    );
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return (
      <label className="block">
        <span className="mb-1 block text-[12px] font-semibold text-[#4b5563]">{label(keyName)}</span>
        <input
          className="w-full rounded-lg border border-black/10 px-3 py-2 text-[13px] outline-none focus:border-[#8169f1]"
          value={String(value)}
          onChange={(e) => onChange(path, typeof value === "number" ? Number(e.target.value) : e.target.value === "true")}
        />
      </label>
    );
  }

  // Array
  if (Array.isArray(value)) {
    return (
      <div className="rounded-xl border border-black/10 bg-[#fbfafc] p-3">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[13px] font-bold text-[#111]">{label(keyName)} <span className="text-[#9ca3af]">({value.length})</span></span>
          <button
            type="button"
            className="rounded-full bg-[#8169f1] px-3 py-1 text-[12px] font-semibold text-white hover:bg-[#6f56e6]"
            onClick={() => onChange(path, [...value, value.length ? emptyLike(value[value.length - 1]) : ""])}
          >
            + Thêm
          </button>
        </div>
        <div className="space-y-3">
          {value.map((item, i) => (
            <div key={i} className="rounded-lg border border-black/10 bg-white p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-[#8169f1]">#{i + 1}</span>
                <div className="flex gap-1">
                  <button type="button" disabled={i === 0} className="rounded px-2 py-0.5 text-[12px] text-[#4b5563] disabled:opacity-30 hover:bg-black/5"
                    onClick={() => { const a = [...value]; [a[i - 1], a[i]] = [a[i], a[i - 1]]; onChange(path, a); }}>↑</button>
                  <button type="button" disabled={i === value.length - 1} className="rounded px-2 py-0.5 text-[12px] text-[#4b5563] disabled:opacity-30 hover:bg-black/5"
                    onClick={() => { const a = [...value]; [a[i + 1], a[i]] = [a[i], a[i + 1]]; onChange(path, a); }}>↓</button>
                  <button type="button" className="rounded px-2 py-0.5 text-[12px] text-red-500 hover:bg-red-50"
                    onClick={() => onChange(path, value.filter((_, j) => j !== i))}>✕</button>
                </div>
              </div>
              <Node value={item} path={[...path, i]} keyName={typeof item === "object" ? "" : keyName} onChange={onChange} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Object
  if (value && typeof value === "object") {
    const entries = Object.entries(value as Record<string, Json>);
    return (
      <div className={keyName ? "rounded-xl border border-black/10 p-3" : ""}>
        {keyName && <div className="mb-3 text-[13px] font-bold text-[#111]">{label(keyName)}</div>}
        <div className="grid gap-3 sm:grid-cols-2">
          {entries.map(([k, v]) => (
            <div key={k} className={typeof v === "object" && v !== null ? "sm:col-span-2" : ""}>
              <Node value={v} path={[...path, k]} keyName={k} onChange={onChange} />
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
}

export default function AdminPage() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [loginErr, setLoginErr] = useState("");
  const [files, setFiles] = useState<FileMeta[]>([]);
  const [active, setActive] = useState<string>("");
  const [data, setData] = useState<Json>(null);
  const [raw, setRaw] = useState(false);
  const [rawText, setRawText] = useState("");
  const [rawErr, setRawErr] = useState("");
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const [leadsMode, setLeadsMode] = useState(false);
  const [leads, setLeads] = useState<Record<string, string>[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const loadFile = useCallback(async (file: string) => {
    setLeadsMode(false);
    setEditIndex(null);
    setSearch("");
    setRaw(false);
    const res = await fetch(`/api/admin/content?file=${encodeURIComponent(file)}`);
    if (res.status === 401) { setAuthed(false); return; }
    const j = await res.json();
    if (j.ok) { setActive(file); setData(j.data); setRawText(JSON.stringify(j.data, null, 2)); setStatus(""); }
  }, []);

  const loadLeads = useCallback(async () => {
    const res = await fetch("/api/admin/leads");
    if (res.status === 401) { setAuthed(false); return; }
    const j = await res.json();
    if (j.ok) { setLeads(j.leads); setLeadsMode(true); setActive(""); }
  }, []);

  const boot = useCallback(async () => {
    const res = await fetch("/api/admin/content");
    if (res.status === 401) { setAuthed(false); return; }
    const j = await res.json();
    setAuthed(true);
    setFiles(j.files);
    if (j.files?.length) loadFile(j.files[0].file);
  }, [loadFile]);

  useEffect(() => { boot(); }, [boot]);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setLoginErr("");
    const res = await fetch("/api/admin/login", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }),
    });
    if (res.ok) { setPassword(""); boot(); } else { setLoginErr("Sai mật khẩu, thử lại."); }
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthed(false); setData(null); setActive("");
  }

  const onChange = useCallback((path: (string | number)[], value: Json) => {
    setData((prev: Json) => setAtPath(prev, path, value));
    setStatus("");
  }, []);

  async function save() {
    let payload = data;
    if (raw) {
      try { payload = JSON.parse(rawText); setRawErr(""); }
      catch { setRawErr("JSON không hợp lệ"); return; }
      setData(payload);
    }
    setSaving(true);
    const res = await fetch("/api/admin/content", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ file: active, data: payload }),
    });
    setSaving(false);
    if (res.ok) setStatus("✓ Đã lưu. Nội dung trên website đã cập nhật.");
    else if (res.status === 401) setAuthed(false);
    else setStatus("✗ Lưu thất bại.");
  }

  if (authed === null) return <div className="p-10 text-center text-[#6b7280]">Đang tải…</div>;

  if (!authed) {
    return (
      <div className="tk-admin flex min-h-screen items-center justify-center bg-gradient-to-br from-[#f4f5f8] to-[#eceaf6] p-4">
        <form onSubmit={login} className="w-full max-w-sm rounded-3xl border border-black/[0.06] bg-white p-8 shadow-[0_24px_70px_rgba(88,66,188,0.14)]">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6d5cd6] to-[#5842bc] text-[22px] font-bold text-white">T</span>
          <h1 className="mt-5 text-[22px] font-bold text-[#1f2430]">Tourkit Admin</h1>
          <p className="mt-1 text-[13px] text-[#6b7280]">Đăng nhập để chỉnh sửa nội dung website.</p>
          <input
            type="password" autoFocus placeholder="Mật khẩu"
            className="mt-5 w-full rounded-xl border border-black/10 px-4 py-2.5 text-[14px] outline-none"
            value={password} onChange={(e) => setPassword(e.target.value)}
          />
          {loginErr && <p className="mt-2 text-[12px] text-[#dc2626]">{loginErr}</p>}
          <button className="mt-4 w-full rounded-xl bg-[#6d5cd6] py-2.5 text-[14px] font-semibold text-white shadow-[0_6px_16px_rgba(109,92,214,0.3)] hover:bg-[#5c4bc4]">
            Đăng nhập
          </button>
        </form>
      </div>
    );
  }

  const coll = COLLECTIONS[active];
  const collItems = (coll && data && typeof data === "object"
    ? ((data as Record<string, unknown>)[coll.key] as Record<string, unknown>[] | undefined)
    : undefined) ?? [];
  const metaKeys = coll && data && typeof data === "object"
    ? Object.keys(data as Record<string, unknown>).filter((k) => k !== coll.key)
    : [];

  return (
    <div className="tk-admin min-h-screen bg-[#f4f5f8] text-[#1f2430]">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-black/[0.07] bg-white/90 px-6 py-3 backdrop-blur">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#6d5cd6] to-[#5842bc] text-[15px] font-bold text-white">T</span>
          <div className="leading-tight">
            <div className="text-[15px] font-bold text-[#1f2430]">Tourkit Admin</div>
            <div className="text-[11px] text-[#9ca3af]">Quản trị nội dung website</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a href="/" target="_blank" className="rounded-lg px-3 py-1.5 text-[13px] font-medium text-[#4b5563] hover:bg-black/[0.04] hover:text-[#6d5cd6]">Xem website ↗</a>
          <button onClick={logout} className="rounded-lg border border-black/10 px-4 py-1.5 text-[13px] font-medium text-[#4b5563] hover:bg-black/[0.04]">Đăng xuất</button>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl gap-6 p-6">
        <aside className="w-64 shrink-0">
          <div className="sticky top-[76px] rounded-2xl border border-black/[0.06] bg-white p-2.5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <p className="px-3 pb-1.5 pt-2 text-[10.5px] font-bold uppercase tracking-wider text-[#a0a4b0]">Nội dung</p>
            {files.map((f) => {
              const on = active === f.file && !leadsMode;
              return (
                <button
                  key={f.file}
                  onClick={() => loadFile(f.file)}
                  className={`mb-0.5 flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-[13px] ${on ? "bg-[#6d5cd6] text-white shadow-[0_4px_12px_rgba(109,92,214,0.3)]" : "text-[#4b5563] hover:bg-[#6d5cd6]/[0.07]"}`}
                >
                  <span className={`text-[15px] ${on ? "opacity-90" : "opacity-60"}`}>{FILE_ICONS[f.file] ?? "📄"}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium">{f.label.replace(/\s*\(.*\)$/, "")}</span>
                    <span className={`block text-[11px] ${on ? "text-white/70" : "text-[#a0a4b0]"}`}>{f.file}</span>
                  </span>
                </button>
              );
            })}
            <p className="px-3 pb-1.5 pt-3 text-[10.5px] font-bold uppercase tracking-wider text-[#a0a4b0]">Dữ liệu</p>
            <button
              onClick={loadLeads}
              className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-[13px] ${leadsMode ? "bg-[#6d5cd6] text-white shadow-[0_4px_12px_rgba(109,92,214,0.3)]" : "text-[#4b5563] hover:bg-[#6d5cd6]/[0.07]"}`}
            >
              <span className={`text-[15px] ${leadsMode ? "opacity-90" : "opacity-60"}`}>📥</span>
              <span className="min-w-0 flex-1">
                <span className="block font-medium">Lead đăng ký</span>
                <span className={`block text-[11px] ${leadsMode ? "text-white/70" : "text-[#a0a4b0]"}`}>Thông tin khách gửi</span>
              </span>
            </button>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
        {leadsMode ? (
          <div className="rounded-2xl border border-black/[0.06] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-[16px] font-bold text-[#111]">Lead đăng ký <span className="text-[#9ca3af]">({leads.length})</span></h2>
              <button onClick={loadLeads} className="rounded-full border border-black/10 px-4 py-1.5 text-[13px] hover:bg-black/5">Làm mới</button>
            </div>
            {leads.length === 0 ? (
              <p className="py-10 text-center text-[14px] text-[#9ca3af]">Chưa có lead nào. Khi khách gửi form, thông tin sẽ hiện ở đây.</p>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-black/[0.06]">
                <table className="w-full border-collapse text-[13px]">
                  <thead>
                    <tr className="bg-[#f7f7fa] text-left text-[11px] uppercase tracking-wide text-[#8890a0]">
                      <th className="whitespace-nowrap px-4 py-3 font-semibold">Thời gian</th>
                      <th className="whitespace-nowrap px-4 py-3 font-semibold">Nguồn</th>
                      {Array.from(new Set(leads.flatMap((l) => Object.keys(l)).filter((k) => k !== "at" && k !== "source"))).map((k) => (
                        <th key={k} className="whitespace-nowrap px-4 py-3 font-semibold">{LEAD_LABELS[k] ?? k}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((l, i) => {
                      const cols = Array.from(new Set(leads.flatMap((x) => Object.keys(x)).filter((k) => k !== "at" && k !== "source")));
                      return (
                        <tr key={i} className={`border-t border-black/[0.05] ${i % 2 ? "bg-black/[0.015]" : ""}`}>
                          <td className="whitespace-nowrap px-4 py-3 text-[#8890a0]">{(l.at || "").replace("T", " ").slice(0, 16)}</td>
                          <td className="whitespace-nowrap px-4 py-3"><span className="rounded-md bg-[#6d5cd6]/10 px-2 py-0.5 text-[11px] font-medium text-[#6d5cd6]">{l.source}</span></td>
                          {cols.map((k) => (
                            <td key={k} className="whitespace-nowrap px-4 py-3 text-[#1f2430]">{l[k] || <span className="text-[#c5c8d0]">—</span>}</td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <>
          <div className="mb-4 flex items-center justify-between rounded-2xl border border-black/[0.06] bg-white px-5 py-3 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <label className="flex cursor-pointer items-center gap-2 text-[13px] font-medium text-[#4b5563]">
              <input type="checkbox" className="h-4 w-4 accent-[#6d5cd6]" checked={raw} onChange={(e) => { if (!e.target.checked) { try { setData(JSON.parse(rawText)); } catch {} } else { setRawText(JSON.stringify(data, null, 2)); } setRaw(e.target.checked); }} />
              Sửa JSON thô
            </label>
            <div className="flex items-center gap-3">
              {status && <span className={`text-[12.5px] font-medium ${status.startsWith("✓") ? "text-[#059669]" : "text-[#dc2626]"}`}>{status}</span>}
              <button onClick={save} disabled={saving} className="rounded-xl bg-[#6d5cd6] px-6 py-2 text-[13px] font-semibold text-white shadow-[0_4px_12px_rgba(109,92,214,0.3)] hover:bg-[#5c4bc4] disabled:cursor-not-allowed disabled:opacity-50">
                {saving ? "Đang lưu…" : "Lưu thay đổi"}
              </button>
            </div>
          </div>

          {data === null ? (
            <div className="space-y-3 rounded-2xl border border-black/[0.06] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-11 animate-pulse rounded-lg bg-black/[0.05]" />
              ))}
            </div>
          ) : raw ? (
            <div className="rounded-2xl border border-black/[0.06] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              <textarea
                className="h-[70vh] w-full rounded-lg border border-black/10 p-3 font-mono text-[12px] outline-none focus:border-[#8169f1]"
                value={rawText} onChange={(e) => setRawText(e.target.value)}
              />
              {rawErr && <p className="mt-2 text-[12px] text-red-500">{rawErr}</p>}
            </div>
          ) : coll ? (
            editIndex === null ? (
              /* ---- Collection list view ---- */
              <div className="space-y-4">
                {metaKeys.length > 0 && (
                  <div className="rounded-2xl border border-black/[0.06] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                    <div className="grid gap-3 sm:grid-cols-2">
                      {metaKeys.map((k) => (
                        <Node key={k} value={(data as Record<string, unknown>)[k]} path={[k]} keyName={k} onChange={onChange} />
                      ))}
                    </div>
                  </div>
                )}
                <div className="rounded-2xl border border-black/[0.06] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <h2 className="text-[15px] font-bold text-[#111]">
                      Danh sách {coll.itemName} <span className="text-[#9ca3af]">({collItems.length})</span>
                    </h2>
                    <div className="flex items-center gap-2">
                      <input
                        placeholder="Tìm theo tiêu đề…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="rounded-full border border-black/10 px-4 py-1.5 text-[13px] outline-none focus:border-[#8169f1]"
                      />
                      <button
                        onClick={() => {
                          const tpl = collItems.length ? emptyLike(collItems[0]) : {};
                          onChange([coll.key], [tpl, ...collItems]);
                          setSearch("");
                          setEditIndex(0);
                        }}
                        className="rounded-full bg-[#8169f1] px-4 py-1.5 text-[13px] font-semibold text-white hover:bg-[#6f56e6]"
                      >
                        + Thêm {coll.itemName}
                      </button>
                    </div>
                  </div>
                  <div className="divide-y divide-black/5">
                    {collItems.map((it, i) => ({ it, i }))
                      .filter(({ it }) => String(it?.[coll.labelField] ?? "").toLowerCase().includes(search.toLowerCase()))
                      .map(({ it, i }) => (
                        <div key={i} className="flex items-center gap-3 py-2.5">
                          {typeof it?.image === "string" && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={it.image as string} alt="" className="h-10 w-14 shrink-0 rounded object-cover" />
                          )}
                          <button
                            onClick={() => setEditIndex(i)}
                            className="min-w-0 flex-1 text-left"
                          >
                            <span className="line-clamp-1 text-[13.5px] font-medium text-[#111] hover:text-[#8169f1]">
                              {String(it?.[coll.labelField] ?? "(chưa có tiêu đề)")}
                            </span>
                            {typeof it?.category === "string" && <span className="block text-[11px] text-[#9ca3af]">{it.category}</span>}
                          </button>
                          <div className="flex shrink-0 gap-1">
                            <button title="Lên" disabled={i === 0} className="rounded px-2 py-1 text-[13px] text-[#4b5563] disabled:opacity-30 hover:bg-black/5"
                              onClick={() => { const a = [...collItems]; [a[i - 1], a[i]] = [a[i], a[i - 1]]; onChange([coll.key], a); }}>↑</button>
                            <button title="Xuống" disabled={i === collItems.length - 1} className="rounded px-2 py-1 text-[13px] text-[#4b5563] disabled:opacity-30 hover:bg-black/5"
                              onClick={() => { const a = [...collItems]; [a[i + 1], a[i]] = [a[i], a[i + 1]]; onChange([coll.key], a); }}>↓</button>
                            <button onClick={() => setEditIndex(i)} className="rounded-full bg-black/5 px-3 py-1 text-[12px] font-medium text-[#4b5563] hover:bg-black/10">Sửa</button>
                            <button title="Xoá" className="rounded px-2 py-1 text-[13px] text-red-500 hover:bg-red-50"
                              onClick={() => { if (confirm("Xoá mục này?")) onChange([coll.key], collItems.filter((_, j) => j !== i)); }}>✕</button>
                          </div>
                        </div>
                      ))}
                    {collItems.length === 0 && <p className="py-8 text-center text-[13px] text-[#9ca3af]">Chưa có {coll.itemName} nào.</p>}
                  </div>
                </div>
              </div>
            ) : (
              /* ---- Single item editor ---- */
              <div className="rounded-2xl border border-black/[0.06] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <button onClick={() => setEditIndex(null)} className="mb-4 text-[13px] font-semibold text-[#8169f1] hover:underline">
                  ← Về danh sách {coll.itemName}
                </button>
                {collItems[editIndex] !== undefined && (
                  <Node value={collItems[editIndex]} path={[coll.key, editIndex]} keyName="" onChange={onChange} />
                )}
              </div>
            )
          ) : (
            <div className="rounded-2xl border border-black/[0.06] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              {data !== null && <Node value={data} path={[]} keyName="" onChange={onChange} />}
            </div>
          )}
          </>
        )}
        </main>
      </div>
    </div>
  );
}
