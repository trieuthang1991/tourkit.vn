// Crawl ALL blog posts from tourkit.vn into content/posts.json (content stored as HTML).
// Downloads in-content + featured images into public/images and rewrites src to local.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import * as cheerio from "cheerio";

const OUT_IMG = join(process.cwd(), "public", "images");
mkdirSync(OUT_IMG, { recursive: true });
const HEADERS = { "User-Agent": "Mozilla/5.0", Referer: "https://tourkit.vn/" };

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// fetch with timeout + retry so a slow/hanging request never blocks the whole crawl
async function fetchT(url, ms = 20000, tries = 3) {
  for (let i = 0; i < tries; i++) {
    const ac = new AbortController();
    const t = setTimeout(() => ac.abort(), ms);
    try {
      return await fetch(url, { headers: HEADERS, signal: ac.signal });
    } catch (e) {
      if (i === tries - 1) throw e;
      await sleep(1500 * (i + 1));
    } finally {
      clearTimeout(t);
    }
  }
}

function slugFromUrl(u) {
  return decodeURIComponent(u.replace(/\/$/, "").split("/").pop());
}

// ---- image downloading with de-dup ----
const imgMap = new Map(); // remote url -> local /images/xxx
async function localizeImg(remote) {
  if (!remote || !/^https?:\/\//.test(remote)) return remote;
  if (imgMap.has(remote)) return imgMap.get(remote);
  let base = decodeURIComponent(new URL(remote).pathname.split("/").pop() || "img").replace(/[^a-zA-Z0-9._-]/g, "_");
  if (!/\.(png|jpe?g|webp|gif|svg|avif)$/i.test(base)) base += ".jpg";
  let local = "/images/" + base;
  // collision: if a different remote already mapped to this local name, prefix
  if ([...imgMap.values()].includes(local)) { base = "post_" + base; local = "/images/" + base; }
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
  const html = await res.text();
  const $ = cheerio.load(html);

  const title = ($("h1").first().text() || $('meta[property="og:title"]').attr("content") || "").trim();
  let featured = $('meta[property="og:image"]').attr("content") || $("img.attachment-post-thumbnail").attr("src") || "";
  const excerpt = ($('meta[property="og:description"]').attr("content") || "").trim().slice(0, 220);

  // meta list
  let author = "adminmigroup", date = "", category = "";
  const meta = $("ul.post-detail").first();
  meta.find("li").each((i, li) => {
    const t = $(li).text().trim().replace(/\s+/g, " ");
    const href = $(li).find("a").attr("href") || "";
    if (/\/author\//.test(href)) author = t;
    else if (/\d{2}\/\d{2}\/\d{4}/.test(t)) date = t.match(/\d{2}\/\d{2}\/\d{4}/)[0];
    else if (/\/category\//.test(href) && !category) category = t;
  });
  if (!category) category = "Tin tức";

  // ---- content extraction ----
  const bp = $(".blog-post").first();
  let contentEl = null;
  if (bp.length) {
    const clone = bp.clone();
    // drop non-content nodes
    clone.find("img.attachment-post-thumbnail, .spc-30, .spc-20, h3.entry-title, ul.post-detail, .xs_social_share_widget, .post-pager, .pagination-comment, .comment-respond, script, style, .single-relate, form").remove();
    // remove the first h1 (title) and everything that is "Related Posts"
    clone.find("h1").first().remove();
    clone.find("div").each((i, d) => { if ($(d).text().includes("Related Posts")) $(d).remove(); });
    contentEl = clone;
  } else {
    contentEl = $(".elementor-widget-theme-post-content .elementor-widget-container").first();
    if (!contentEl.length) contentEl = $(".entry-content").first();
  }

  let contentHtml = "";
  if (contentEl && contentEl.length) {
    // localize images inside content
    const imgs = contentEl.find("img").toArray();
    for (const im of imgs) {
      const src = $(im).attr("src") || $(im).attr("data-src") || "";
      const local = await localizeImg(src);
      $(im).attr("src", local);
      $(im).removeAttr("srcset").removeAttr("data-src").removeAttr("sizes").removeAttr("loading").removeAttr("width").removeAttr("height");
    }
    // strip messy attributes
    contentEl.find("*").each((i, el) => {
      const tag = el.tagName;
      if (["p", "h1", "h2", "h3", "h4", "ul", "ol", "li", "span", "div", "strong", "em", "a"].includes(tag)) {
        $(el).removeAttr("class").removeAttr("style").removeAttr("id").removeAttr("data-settings");
      }
    });
    // remove empty paragraphs / divs
    contentEl.find("p, div, span").each((i, el) => { if (!$(el).text().trim() && $(el).find("img").length === 0) $(el).remove(); });
    contentHtml = (contentEl.html() || "").replace(/\s+\n/g, "\n").replace(/(<p>\s*<\/p>)/g, "").trim();
  }

  featured = await localizeImg(featured);

  return { slug: slugFromUrl(url), title, category, date, author, image: featured, excerpt, content: contentHtml };
}

// ---- main ----
const sm = await (await fetchT("https://tourkit.vn/post-sitemap.xml")).text();
let urls = (sm.match(/<loc>([^<]+)<\/loc>/g) || []).map((s) => s.replace(/<\/?loc>/g, ""));
console.log("Found", urls.length, "post URLs");

const posts = [];
for (let i = 0; i < urls.length; i += 4) {
  const batch = urls.slice(i, i + 4);
  const r = await Promise.allSettled(batch.map(crawl));
  r.forEach((x, j) => {
    if (x.status === "fulfilled" && x.value.title && x.value.content) { posts.push(x.value); console.log("ok", posts.length, x.value.slug); }
    else { console.log("SKIP", batch[j], x.status === "rejected" ? x.reason?.message : "(no content)"); }
  });
  await sleep(400);
}

// newest first: keep sitemap order (usually newest first). Write file.
const data = {
  listTitle: "Tin Tức - Sự Kiện Mới Nhất",
  listSubtitle: "Điểm tin doanh nghiệp, cập nhật sản phẩm và các hoạt động, sự kiện của Tourkit.",
  posts,
};
writeFileSync(join(process.cwd(), "content", "posts.json"), JSON.stringify(data, null, 2) + "\n", "utf8");
console.log(`\nDone. ${posts.length} posts, ${imgMap.size} images. -> content/posts.json`);
