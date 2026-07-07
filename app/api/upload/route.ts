import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { requireAdmin } from "@/lib/requireAdmin";

// POST /api/upload
// Accepts multipart/form-data with a "file" field.
// Stores the file permanently on Vercel Blob storage and
// returns a public URL you can save on a Product or on the Profile.
// The old file is simply replaced by a new URL in the database when
// you upload again later — nothing is deleted automatically, so
// there is zero risk of losing the current image mid-update.
export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const form = await req.formData();
  const file = form.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

  const filename = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;

  const blob = await put(filename, file, {
    access: "public",
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });

  return NextResponse.json({ url: blob.url });
}
