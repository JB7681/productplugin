"use client";
import { useMemo, useState } from "react";
import { Product, Profile } from "@/lib/types";
import ProductCard from "./ProductCard";
import Header from "./Header";
import Hero from "./Hero";
import Disclosure from "./Disclosure";
import Footer from "./Footer";

export default function HomeClient({
  products,
  profile,
}: {
  products: Product[];
  profile: Profile;
}) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [platform, setPlatform] = useState("All");

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(products.map((p) => p.category)))],
    [products]
  );
  const platforms = useMemo(
    () => ["All", ...Array.from(new Set(products.map((p) => p.platform)))],
    [products]
  );

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === "All" || p.category === category;
      const matchesPlatform = platform === "All" || p.platform === platform;
      return matchesSearch && matchesCategory && matchesPlatform;
    });
  }, [products, search, category, platform]);

  const featured = products.filter((p) => p.featured);
  const latest = [...products]
    .filter((p) => p.latest)
    .sort((a, b) => {
  const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
  const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
  return bTime - aTime;
});
  const deals = products.filter((p) => p.originalPrice && p.originalPrice !== p.price);

  return (
    <>
      <Header name={profile.name} />
      <Hero profile={profile} />

      {/* -------- Search + Filters -------- */}
      <section className="mx-auto max-w-6xl px-4 pb-2">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-ink-900 px-4 py-3 text-sm outline-none focus:border-accent transition-colors"
        />

        <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-medium border transition-colors ${
                category === c
                  ? "bg-accent text-white border-accent"
                  : "border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:border-accent"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mt-2 flex gap-2 overflow-x-auto no-scrollbar">
          {platforms.map((pl) => (
            <button
              key={pl}
              onClick={() => setPlatform(pl)}
              className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-medium border transition-colors ${
                platform === pl
                  ? "bg-neutral-900 text-white dark:bg-white dark:text-ink-950 border-neutral-900 dark:border-white"
                  : "border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:border-neutral-400"
              }`}
            >
              {pl}
            </button>
          ))}
        </div>
      </section>

      {/* If actively searching/filtering, show a single results grid instead of curated sections */}
      {(search || category !== "All" || platform !== "All") ? (
        <section className="mx-auto max-w-6xl px-4 py-6">
          <h2 className="mb-4 text-lg font-bold">
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </h2>
          <ProductGrid products={filtered} />
        </section>
      ) : (
        <>
          {featured.length > 0 && (
            <Section id="featured" title="Featured Products">
              <ProductGrid products={featured} />
            </Section>
          )}

          <Section id="categories" title="Shop by Category">
            <div className="flex flex-wrap gap-3">
              {categories
                .filter((c) => c !== "All")
                .map((c) => (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    className="rounded-xl2 bg-white dark:bg-ink-900 border border-neutral-100 dark:border-neutral-800 px-6 py-4 text-sm font-semibold shadow-soft hover:shadow-card hover:-translate-y-0.5 transition-all"
                  >
                    {c}
                  </button>
                ))}
            </div>
          </Section>

          {deals.length > 0 && (
            <Section id="deals" title="Best Deals">
              <ProductGrid products={deals} />
            </Section>
          )}

          {latest.length > 0 && (
            <Section id="latest" title="Recently Added">
              <ProductGrid products={latest.slice(0, 8)} />
            </Section>
          )}

          <Section id="all-products" title="All Products">
            <ProductGrid products={products} />
          </Section>
        </>
      )}

      <Disclosure text={profile.disclosure} />
      <Footer name={profile.name} />
    </>
  );
}

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mx-auto max-w-6xl px-4 py-8">
      <h2 className="mb-4 text-lg font-bold tracking-tight">{title}</h2>
      {children}
    </section>
  );
}

function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <p className="text-sm text-neutral-400 py-8 text-center">No products found.</p>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
