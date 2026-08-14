import { NextResponse } from "next/server";
import { isAdminAuthed } from "@/lib/admin-auth";
import { rewriteProductCopy } from "@/lib/ai-rewrite";

export async function POST(request: Request) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title, description, marketplace } = await request.json().catch(() => ({}));
  if (!title || !description) {
    return NextResponse.json(
      { error: "Both a title and description are required to rewrite." },
      { status: 400 }
    );
  }

  try {
    const rewritten = await rewriteProductCopy({
      title,
      description,
      marketplace: marketplace ?? "MANUAL",
    });
    return NextResponse.json(rewritten);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "AI rewrite failed." },
      { status: 502 }
    );
  }
}
