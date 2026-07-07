"use client";
import { useState } from "react";
import { signOut } from "next-auth/react";
import { Product, Profile } from "@/lib/types";
import ProductForm from "./ProductForm";
import ProfileForm from "./ProfileForm";

export default function AdminDashboard({
  initialProducts,
  initialProfile,
  adminEmail,
}: {
  initialProducts: Product[];
  initialProfile: Profile;
  adminEmail: string;
}) {
  const [products, setProducts] = useState(initialProducts);
  const [tab, setTab] = useState<"products" | "profile">("products");
  const [editing, setEditing] = useState<Product | null>(null);
  const [adding, setAdding] = useState(false);

  async function refreshProducts() {
    const res = await fetch("/api/products");
    setProducts(await res.json());
    setAdding(false);
    setEditing(null);
  }

  async function deleteProduct(id: string) {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    setProducts((p) => p.filter((x) => x.id !== id));
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-ink-950">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b bg-white dark:bg-ink-900 dark:border-neutral-800 px-5 py-3">
        <div>
          <h1 className="font-bold">Admin Dashboard</h1>
          <p className="text-xs text-neutral-400">{adminEmail}</p>
        </div>
        <div className="flex gap-2">
          <a href="/" target="_blank" className="rounded-lg border px-3 py-1.5 text-xs font-semibold">
            View Site ↗
          </a>
          <button onClick={() => signOut({ callbackUrl: "/" })} className="rounded-lg border px-3 py-1.5 text-xs font-semibold">
            Sign Out
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-5 py-6">
        <div className="mb-6 flex gap-2">
          <TabButton active={tab === "products"} onClick={() => setTab("products")}>
            Products ({products.length})
          </TabButton>
          <TabButton active={tab === "profile"} onClick={() => setTab("profile")}>
            Profile & Avatar
          </TabButton>
        </div>

        {tab === "products" && (
          <div className="space-y-4">
            {!adding && !editing && (
              <button
                onClick={() => setAdding(true)}
                className="rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent-dark"
              >
                + Add New Product
              </button>
            )}

            {adding && <ProductForm onSaved={refreshProducts} onCancel={() => setAdding(false)} />}
            {editing && (
              <ProductForm initial={editing} onSaved={refreshProducts} onCancel={() => setEditing(null)} />
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {products.map((p) => (
                <div key={p.id} className="flex gap-3 rounded-xl2 bg-white dark:bg-ink-900 p-3 shadow-soft">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.image} alt={p.name} className="h-16 w-16 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-semibold">{p.name}</p>
                    <p className="text-xs text-neutral-400">{p.category} · {p.platform}</p>
                    <p className="text-sm font-bold mt-1">{p.price}</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <button onClick={() => setEditing(p)} className="text-xs font-semibold text-accent">Edit</button>
                    <button onClick={() => deleteProduct(p.id)} className="text-xs font-semibold text-red-500">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "profile" && <ProfileForm initial={initialProfile} />}
      </div>
    </div>
  );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg px-4 py-2 text-sm font-semibold ${
        active ? "bg-neutral-900 text-white dark:bg-white dark:text-ink-950" : "bg-white dark:bg-ink-900 border"
      }`}
    >
      {children}
    </button>
  );
}
