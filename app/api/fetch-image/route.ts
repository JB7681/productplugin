import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";
import { requireAdmin } from "@/lib/requireAdmin";

// POST /api/fetch-image  { url: "https://amazon.in/..." }
//
// Tries to automatically pull the product image straight from the
// store page (Amazon / Flipkart / Meesho / etc.) by reading its
// Open Graph / Twitter-card meta tags — the same tags WhatsApp or
// Twitter use to generate link previews.
//
// IMPORTANT HONEST NOTE:
// Some large e-commerce sites (Amazon in particular) actively block
// server-side requests or render images via JavaScript, so this will
// not always succeed. When it fails, the admin form automatically
// falls back to manual upload — nothing breaks, you just pick a file.
export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { url } = await req.json();
  if (!url) return NextResponse.json({ error: "URL required" }, { status: 400 });

  try {
    const res = await fetch(url, {
      headers: {
        // Pretend to be a normal browser — many sites reject unlabeled bots outright.
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
      },
      // Affiliate links often redirect through a shortener (e.g. amzn.to) before landing.
      redirect: "follow",
    });

    if (!res.ok) throw new Error(`Store page responded with ${res.status}`);

    const html = await res.text();
    const $ = cheerio.load(html);

    const image =
      $('meta[property="og:image"]').attr("content") ||
      $('meta[name="twitter:image"]').attr("content") ||
      $('meta[itemprop="image"]').attr("content") ||
      null;

    if (!image) {
      return NextResponse.json(
        { success: false, message: "No image found on that page. Please upload one manually." },
        { status: 200 }
      );
    }

    return NextResponse.json({ success: true, image });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        message:
          "Couldn't fetch that page automatically (the store may block bots). Please upload the image manually instead.",
      },
      { status: 200 }
    );
  }
}
