/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Product images can come from Unsplash (samples), Vercel Blob (uploads),
    // or any store's own CDN (auto-fetched og:image). Wildcard pattern keeps
    // this working no matter which platform/store you add products from.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

module.exports = nextConfig;
