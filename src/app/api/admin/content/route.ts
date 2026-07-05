import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAuthed } from "@/lib/admin-auth";
import { CONTENT_FILES, readContentFile, writeContentFile } from "@/lib/content";

export async function GET(req: Request) {
  if (!(await isAuthed())) return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const file = searchParams.get("file");
  if (!file) {
    return NextResponse.json({ ok: true, files: CONTENT_FILES });
  }
  try {
    const data = await readContentFile(file);
    return NextResponse.json({ ok: true, file, data });
  } catch (e) {
    return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 400 });
  }
}

export async function POST(req: Request) {
  if (!(await isAuthed())) return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  const body = await req.json().catch(() => null);
  if (!body?.file || typeof body.data === "undefined") {
    return NextResponse.json({ ok: false, error: "Thiếu dữ liệu" }, { status: 400 });
  }
  try {
    await writeContentFile(body.file, body.data);
    // Refresh all pages that read content
    revalidatePath("/", "layout");
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 400 });
  }
}
