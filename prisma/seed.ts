import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// ==========================================================
// SAMPLE PRODUCT DATA
// This is only used ONCE to seed your database (`npm run seed`).
// After that, you add/edit/delete products from the /admin
// dashboard — you will not need to touch this file again.
//
// Each object below is exactly the shape a "product" has.
// To add a new product later via code instead of the UI, just
// copy one of these objects, change the fields, and add it to
// the array.
// ==========================================================
const products = [
  {
    name: "Wireless ANC Earbuds",
    description: "Best budget earbuds I've tested this year — strong bass, great ANC.",
    fullDescription:
      "I've used these daily for 2 months. Battery lasts a full day, the app lets you tune EQ, and call quality is surprisingly clear indoors.",
    category: "Tech",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800",
    affiliateLink: "https://www.amazon.in/",
    brand: "Amazon",
    price: "₹1,999",
    originalPrice: "₹3,499",
    rating: 4.5,
    featured: true,
    latest: true,
    tags: ["budget", "recommended"],
    platform: "Amazon",
  },
  {
    name: "Vitamin C Face Serum",
    description: "Noticeable brightening in 2 weeks, lightweight, non-sticky.",
    category: "Beauty",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800",
    affiliateLink: "https://www.flipkart.com/",
    brand: "Flipkart",
    price: "₹549",
    originalPrice: "₹799",
    rating: 4.3,
    featured: true,
    latest: false,
    tags: ["skincare", "budget"],
    platform: "Flipkart",
  },
  {
    name: "Ergonomic Laptop Stand",
    description: "Fixed my neck pain from WFH. Sturdy aluminum build.",
    category: "Home & Office",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800",
    affiliateLink: "https://www.amazon.in/",
    brand: "Amazon",
    price: "₹1,299",
    rating: 4.6,
    featured: false,
    latest: true,
    tags: ["wfh", "recommended"],
    platform: "Amazon",
  },
  {
    name: "Oversized Cotton Hoodie",
    description: "Softest hoodie I own, true to size, doesn't shrink.",
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800",
    affiliateLink: "https://www.meesho.com/",
    brand: "Meesho",
    price: "₹649",
    originalPrice: "₹1,199",
    rating: 4.2,
    featured: false,
    latest: true,
    tags: ["winter", "budget"],
    platform: "Meesho",
  },
  {
    name: "Smart Fitness Band",
    description: "Accurate heart-rate tracking, 10-day battery, clean app.",
    category: "Tech",
    image: "https://images.unsplash.com/photo-1575311373937-5c5254bab7fa?w=800",
    affiliateLink: "https://www.amazon.in/",
    brand: "Amazon",
    price: "₹2,499",
    rating: 4.4,
    featured: true,
    latest: false,
    tags: ["fitness", "recommended"],
    platform: "Amazon",
  },
  {
    name: "Matte Liquid Lipstick Set",
    description: "Long-lasting, doesn't dry out lips, great pigment payoff.",
    category: "Beauty",
    image: "https://images.unsplash.com/photo-1631214524115-3e10b8fca0d5?w=800",
    affiliateLink: "https://www.meesho.com/",
    brand: "Meesho",
    price: "₹399",
    originalPrice: "₹699",
    rating: 4.1,
    featured: false,
    latest: true,
    tags: ["makeup", "budget"],
    platform: "Meesho",
  },
  {
    name: "Stainless Steel Insulated Bottle",
    description: "Keeps water cold for 18+ hours. Zero leaks, sleek design.",
    category: "Home & Office",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800",
    affiliateLink: "https://www.flipkart.com/",
    brand: "Flipkart",
    price: "₹449",
    rating: 4.7,
    featured: false,
    latest: false,
    tags: ["daily-use", "recommended"],
    platform: "Flipkart",
  },
  {
    name: "4K Webcam with Ring Light",
    description: "Huge upgrade for content creation — sharp, great low-light.",
    category: "Tech",
    image: "https://images.unsplash.com/photo-1587826080692-f439465bf0a6?w=800",
    affiliateLink: "https://www.amazon.in/",
    brand: "Amazon",
    price: "₹3,299",
    originalPrice: "₹4,999",
    rating: 4.5,
    featured: true,
    latest: true,
    tags: ["content-creation", "recommended"],
    platform: "Amazon",
  },
];

async function main() {
  for (const p of products) {
    await prisma.product.create({ data: p as any });
  }
  await prisma.profile.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: "Your Name",
      tagline: "Honest reviews. Products I actually use.",
      instagram: "https://instagram.com/yourhandle",
      youtube: "https://youtube.com/@yourhandle",
      tiktokOrShorts: "https://youtube.com/@yourhandle/shorts",
    },
  });
  console.log(`Seeded ${products.length} products and 1 profile.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
