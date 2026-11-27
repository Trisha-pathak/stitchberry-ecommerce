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

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 1. If Vercel Blob token is configured, upload via Vercel Blob REST API
    const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
    if (blobToken) {
      if (file.size > 6 * 1024 * 1024) {
        return NextResponse.json({ error: "Image must be under 6 MB." }, { status: 400 });
      }
      const ext = file.name.split(".").pop()?.replace(/[^a-zA-Z0-9]/g, "") || "png";
      const pathname = `stitchberry/sb-${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`;
      const blobRes = await fetch(`https://blob.vercel-storage.com/${pathname}`, {
        method: "PUT",
        headers: {
          authorization: `Bearer ${blobToken}`,
          "x-content-type": file.type,
          "x-api-version": "7",
        },
        body: buffer,
      });
      if (blobRes.ok) {
        const blobData = await blobRes.json();
        return NextResponse.json({ url: blobData.url }, { status: 201 });
      }
    }

    // 2. In serverless / read-only environments (like Vercel without Blob), return a safe Data URL
    if (process.env.VERCEL || process.env.NODE_ENV === "production") {
      if (file.size > 2 * 1024 * 1024) {
        return NextResponse.json(
          { error: "Image must be under 2 MB (or configure BLOB_READ_WRITE_TOKEN)." },
          { status: 400 }
        );
      }
      const dataUrl = `data:${file.type};base64,${buffer.toString("base64")}`;
      return NextResponse.json({ url: dataUrl }, { status: 201 });
    }

    // 3. Local development disk storage
    if (file.size > 6 * 1024 * 1024) {
      return NextResponse.json({ error: "Image must be under 6 MB." }, { status: 400 });
    }
    const ext = file.name.split(".").pop()?.replace(/[^a-zA-Z0-9]/g, "") || "png";
    const filename = `sb-${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });
    await fs.writeFile(path.join(uploadDir, filename), buffer);

    return NextResponse.json({ url: `/uploads/${filename}` }, { status: 201 });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Upload failed." }, { status: 500 });
  }
}
