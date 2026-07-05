import { NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";
import { isAuthed } from "@/lib/admin-auth";

const LEADS_FILE = path.join(process.cwd(), "content", "leads.json");

export async function GET() {
  if (!(await isAuthed())) return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  let leads: unknown[] = [];
  try {
    leads = JSON.parse(await fs.readFile(LEADS_FILE, "utf8"));
    if (!Array.isArray(leads)) leads = [];
  } catch {
    leads = [];
  }
  return NextResponse.json({ ok: true, leads });
}
