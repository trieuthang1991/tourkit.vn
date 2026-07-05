import { NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";

const LEADS_FILE = path.join(process.cwd(), "content", "leads.json");

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const values = body?.values;
  if (!values || typeof values !== "object") {
    return NextResponse.json({ ok: false, error: "Dữ liệu không hợp lệ" }, { status: 400 });
  }

  let leads: unknown[] = [];
  try {
    leads = JSON.parse(await fs.readFile(LEADS_FILE, "utf8"));
    if (!Array.isArray(leads)) leads = [];
  } catch {
    leads = [];
  }

  leads.unshift({
    at: new Date().toISOString(),
    source: typeof body.source === "string" ? body.source : "website",
    ...values,
  });

  try {
    await fs.writeFile(LEADS_FILE, JSON.stringify(leads, null, 2) + "\n", "utf8");
  } catch (e) {
    return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
