# Affiliate Product Hub

A premium,  dynamic link-in-bio store for your affiliate products — built with
Next.js (App Router), a real database, Google-authenticated admin panel, and
permanent image storage. Deploys free on Vercel.

Unlike a static bio.site clone, this is a **live web app**: adding a product
in `/admin` shows up on your site instantly, with no rebuild or redeploy.

---

## 1. How the product system works

Every product is one row in the database with this shape:

```ts
{
  id: "cuid...",
  name: "Product Name",
  description: "Short review text",
  fullDescription: "Optional longer text",
  category: "Tech",
  image: "https://...",          // auto-fetched OR uploaded
  affiliateLink: "https://example.com",
  brand: "Amazon",
  price: "₹999",
  originalPrice: "₹1499",        // optional
  rating: 4.5,                   // optional
  featured: true,
  latest: true,
  tags: ["budget", "recommended"],
  platform: "Amazon"
}
```

**You never edit code to add a product.** You use the `/admin` dashboard,
which reads and writes this data through `app/api/products/route.ts` and
`app/api/products/[id]/route.ts`.

The schema itself lives in `prisma/schema.prisma` (model `Product`) — that's
the only file you'd ever touch if you wanted to add a brand-new *field* to
every product (e.g. "coupon code").

`prisma/seed.ts` contains 8 sample products used to initialize your database
once. After seeding, manage everything from `/admin`.

## 2. Product images: auto-fetch or manual upload

When adding a product in `/admin`:
1. Paste the affiliate link.
2. Click **"Auto-fetch image"** — the server reads the store page's
   `og:image` tag (the same tag WhatsApp/Twitter use for link previews) and
   pulls the product photo automatically.
3. If the store blocks this (some do — Amazon in particular can be
   inconsistent), you'll see a message and can just **upload a photo
   manually** instead using the file picker right below. Nothing breaks —
   it's a graceful fallback, not an error state.

Manually uploaded images (and your profile photo) go to **Vercel Blob
storage** and are permanent — they stay exactly as uploaded until you
upload a replacement.

## 3. Admin access (Gmail-authenticated)

Login lives at `/admin/login` and uses Google OAuth via NextAuth. Only the
email addresses listed in the `ADMIN_EMAILS` environment variable can reach
`/admin` — anyone else who signs in with Google is authenticated but not
authorized, and gets bounced back to the login screen.

## 4. Local setup

```bash
npm install
cp .env.example .env
# fill in .env (see below for where each value comes from)
npx prisma migrate dev --name init
npm run seed
npm run dev
```

Visit `http://localhost:3000` for the site and `/admin/login` for the
dashboard.

## 5. Getting each environment variable

| Variable | Where to get it |
|---|---|
| `DATABASE_URL` | Free Postgres: [Vercel Postgres](https://vercel.com/storage/postgres) (powered by Neon) or [neon.tech](https://neon.tech) directly, or [supabase.com](https://supabase.com) |
| `NEXTAUTH_SECRET` | Run `openssl rand -base64 32` in your terminal |
| `NEXTAUTH_URL` | `http://localhost:3000` locally, your real domain in production |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | [Google Cloud Console → Credentials](https://console.cloud.google.com/apis/credentials) → Create OAuth Client ID → Web application → add redirect URI `https://YOUR_DOMAIN/api/auth/callback/google` (and `http://localhost:3000/api/auth/callback/google` for local dev) |
| `ADMIN_EMAILS` | Your Gmail address(es), comma-separated |
| `BLOB_READ_WRITE_TOKEN` | Vercel Dashboard → your project → Storage → Create Blob store → copy token |

## 6. Deploying to Vercel

1. Push this project to a GitHub repo.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repo.
3. Add all the environment variables above in the Vercel project settings
   (use your real production domain for `NEXTAUTH_URL`).
4. Add a **Vercel Postgres** and a **Vercel Blob** store from the Storage tab
   — Vercel will auto-fill `DATABASE_URL` and `BLOB_READ_WRITE_TOKEN` for you.
5. Deploy. Then run the migration + seed once against production:
   ```bash
   npx prisma migrate deploy
   npm run seed
   ```
   (You can run these locally pointed at the production `DATABASE_URL`, or
   via the Vercel CLI.)
6. Update your Google OAuth Client's authorized redirect URI to match your
   live domain.
7. Visit `https://your-domain/admin/login`, sign in with your Gmail, and
   start managing products.

## 7. Project structure

```
app/
  page.tsx                 → public homepage (server component, live DB data)
  admin/page.tsx            → admin dashboard (protected)
  admin/login/page.tsx      → Google sign-in screen
  api/products/             → CRUD API for products
  api/profile/              → profile/avatar API
  api/upload/                → permanent image upload (Vercel Blob)
  api/fetch-image/           → auto-fetch product image from affiliate link
components/                  → all UI (ProductCard, Header, Hero, sections...)
components/admin/            → ProductForm, ProfileForm, AdminDashboard
prisma/schema.prisma          → Product + Profile data model
prisma/seed.ts                 → 8 sample products
```

## 8. Design notes

- Neutral palette + one accent color (amber) — change it in
  `tailwind.config.ts` under `theme.extend.colors.accent` to re-theme the
  entire site instantly.
- Mobile-first grid (`grid-cols-2` on phones → `grid-cols-4` on desktop).
- Dark mode toggle persists via `localStorage` and applies before paint (no
  flash).
- Smooth scroll + anchor navigation built in.
- SEO metadata set in `app/layout.tsx`.
