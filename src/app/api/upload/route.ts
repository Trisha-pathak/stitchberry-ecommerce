import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";

const ALLOWED_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "image/svg+xml",
]);

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }
    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: "Only PNG, JPG, WEBP, GIF, or SVG images are supported." },
        { status: 400 }
      );
    }
    if (file.size > 6 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Image must be under 6 MB." },
        { status: 400 }
      );
    }

    const ext = file.name.split(".").pop()?.replace(/[^a-zA-Z0-9]/g, "") || "png";
    const filename = `sb-${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });
    const bytes = await file.arrayBuffer();
    await fs.writeFile(path.join(uploadDir, filename), Buffer.from(bytes));

    return NextResponse.json({ url: `/uploads/${filename}` }, { status: 201 });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Upload failed." }, { status: 500 });
  }
}
