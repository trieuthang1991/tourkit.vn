// Crawl ALL portfolio/projects from tourkit.vn into content/projects.json (content as HTML).
import { writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import * as cheerio from "cheerio";

const OUT_IMG = join(process.cwd(), "public", "images");
mkdirSync(OUT_IMG, { recursive: true });
const HEADERS = { "User-Agent": "Mozilla/5.0", Referer: "https://tourkit.vn/" };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchT(url, ms = 20000, tries = 3) {
  for (let i = 0; i < tries; i++) {
    const ac = new AbortController();
    const t = setTimeout(() => ac.abort(), ms);
    try { return await fetch(url, { headers: HEADERS, signal: ac.signal }); }
    catch (e) { if (i === tries - 1) throw e; await sleep(1500 * (i + 1)); }
    finally { clearTimeout(t); }
  }
}

const slugFromUrl = (u) => decodeURIComponent(u.replace(/\/$/, "").split("/").pop());

const imgMap = new Map();
async function localizeImg(remote) {
  if (!remote || !/^https?:\/\//.test(remote)) return remote;
  if (imgMap.has(remote)) return imgMap.get(remote);
  let base = decodeURIComponent(new URL(remote).pathname.split("/").pop() || "img").replace(/[^a-zA-Z0-9._-]/g, "_");
  if (!/\.(png|jpe?g|webp|gif|svg|avif)$/i.test(base)) base += ".jpg";
  let local = "/images/" + base;
  if ([...imgMap.values()].includes(local)) { base = "proj_" + base; local = "/images/" + base; }
  const dest = join(OUT_IMG, base);
  imgMap.set(remote, local);
  if (!existsSync(dest)) {
    try {
      const r = await fetchT(remote, 10000);
      if (r.ok) writeFileSync(dest, Buffer.from(await r.arrayBuffer()));
      else { imgMap.set(remote, remote); return remote; }
    } catch { imgMap.set(remote, remote); return remote; }
  }
  return local;
}

async function crawl(url) {
  const res = await fetchT(url, 15000);
  if (!res.ok) throw new Error("HTTP " + res.status);
  const $ = cheerio.load(await res.text());

  const title = ($('meta[property="og:title"]').attr("content") || "").split("|")[0].trim();
  let featured = $('meta[property="og:image"]').attr("content") || "";
  const excerpt = ($('meta[property="og:description"]').attr("content") || "").trim().slice(0, 220);
  const upper = title.toUpperCase();
  const category = upper.includes("WEBSITE") ? "Website Du Lịch" : "Giải pháp chuyển đổi số";

  let el = $('[class*="iteck-portfolio"]').first();
  if (!el.length) el = $(".single-portfolio").first();
  if (!el.length) throw new Error("no content container");
  const clone = el.clone();
  clone.find("script, style, nav, footer, header, .iteck-custom-header, .iteck-custom-footer, .progress-wrap, form, .ays-pb-modals, [class*=modal], [class*=gray-bg]").remove();
  // remove the "See our other portfolio" related block
  clone.find("div,section").each((i, d) => { const t = $(d).text(); if (t.includes("Other portfolio") || t.includes("other portfolio")) $(d).remove(); });
  // remove a heading that just repeats the title (normalise dashes/spaces)
  const norm = (s) => s.trim().replace(/[–—]/g, "-").replace(/\s+/g, " ").toLowerCase();
  const nt = norm(title);
  clone.find("h1,h2,h3,h4").each((i, h) => { if (norm($(h).text()) === nt) { $(h).remove(); return false; } });

  // localize images
  for (const im of clone.find("img").toArray()) {
    const src = $(im).attr("src") || $(im).attr("data-src") || "";
    const local = await localizeImg(src);
    $(im).attr("src", local);
    $(im).removeAttr("srcset").removeAttr("data-src").removeAttr("sizes").removeAttr("loading").removeAttr("width").removeAttr("height");
  }
  // strip all styling/framework attributes from every element
  clone.find("*").each((i, e) => {
    const keep = e.tagName === "img" || e.tagName === "a";
    const attrs = Object.keys(e.attribs || {});
    attrs.forEach((a) => {
      if (a === "src" || a === "alt" || (keep && a === "href")) return;
      $(e).removeAttr(a);
    });
  });
  clone.find("p,div,span").each((i, e) => { if (!$(e).text().trim() && $(e).find("img").length === 0) $(e).remove(); });
  // drop dead external imgs (keep tourkit.vn remote + local)
  let content = (clone.html() || "").trim();
  content = content.replace(/<img[^>]*src="(https?:\/\/(?!.*tourkit\.vn)[^"]+)"[^>]*>/g, "");

  featured = await localizeImg(featured);
  return { slug: slugFromUrl(url), title, category, image: featured, excerpt, content };
}

const sm = await (await fetchT("https://tourkit.vn/portfolio-sitemap.xml")).text();
let urls = (sm.match(/<loc>([^<]+)<\/loc>/g) || []).map((s) => s.replace(/<\/?loc>/g, ""))
  .filter((u) => /\/portfolio\/[^/]+\/?$/.test(u) && !/\/portfolio\/?$/.test(u));
console.log("Found", urls.length, "project URLs");

const projects = [];
for (let i = 0; i < urls.length; i += 4) {
  const r = await Promise.allSettled(urls.slice(i, i + 4).map(crawl));
  r.forEach((x, j) => {
    if (x.status === "fulfilled" && x.value.title && x.value.content) { projects.push(x.value); console.log("ok", projects.length, x.value.slug); }
    else console.log("SKIP", urls[i + j], x.status === "rejected" ? x.reason?.message : "(no content)");
  });
  await sleep(400);
}

const data = {
  listTitle: "Dự Án Tiêu Biểu",
  listSubtitle: "Những câu chuyện chuyển đổi số và các dự án website du lịch Tourkit đã đồng hành cùng khách hàng.",
  projects,
};
writeFileSync(join(process.cwd(), "content", "projects.json"), JSON.stringify(data, null, 2) + "\n", "utf8");
console.log(`\nDone. ${projects.length} projects, ${imgMap.size} images. -> content/projects.json`);
