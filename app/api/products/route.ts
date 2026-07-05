import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";

// GET /api/products -> public, used by the site and for client-side refresh
export async function GET() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(products);
}

// POST /api/products -> admin only, create a new product
// This is what the "Add Product" form in /admin calls.
export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  const product = await prisma.product.create({
    data: {
      name: body.name,
      description: body.description,
      fullDescription: body.fullDescription || null,
      category: body.category,
      image: body.image,
      affiliateLink: body.affiliateLink,
      brand: body.brand,
      price: body.price,
      originalPrice: body.originalPrice || null,
      rating: body.rating ? parseFloat(body.rating) : null,
      featured: !!body.featured,
      latest: body.latest !== false,
      tags: Array.isArray(body.tags) ? body.tags : [],
      platform: body.platform,
    },
  });

  return NextResponse.json(product, { status: 201 });
}
