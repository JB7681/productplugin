import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";

// Profile is a singleton row (id = 1). Created on first access if missing.
async function getOrCreateProfile() {
  let profile = await prisma.profile.findUnique({ where: { id: 1 } });
  if (!profile) {
    profile = await prisma.profile.create({ data: { id: 1 } });
  }
  return profile;
}

export async function GET() {
  const profile = await getOrCreateProfile();
  return NextResponse.json(profile);
}

export async function PUT(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await getOrCreateProfile();
  const body = await req.json();

  const profile = await prisma.profile.update({
    where: { id: 1 },
    data: {
      name: body.name,
      tagline: body.tagline,
      bio: body.bio,
      avatarUrl: body.avatarUrl, // set this to the URL returned by /api/upload
      instagram: body.instagram,
      youtube: body.youtube,
      tiktokOrShorts: body.tiktokOrShorts,
      disclosure: body.disclosure,
    },
  });

  return NextResponse.json(profile);
}
