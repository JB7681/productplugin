"use client";
import { useState } from "react";
import { Product } from "@/lib/types";

const CATEGORIES = ["Tech", "Beauty", "Home & Office", "Fashion", "Fitness", "Other"];
const PLATFORMS = ["Amazon", "Flipkart", "Meesho", "Myntra", "Other"];

export default function ProductForm({
  initial,
  onSaved,
  onCancel,
}: {
  initial?: Product;
  onSaved: () => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<Partial<Product>>(
    initial || {
      name: "",
      description: "",
      fullDescription: "",
      category: CATEGORIES[0],
      image: "",
      affiliateLink: "",
      brand: "",
      price: "",
      originalPrice: "",
      rating: undefined,
      featured: false,
      latest: true,
      tags: [],
      platform: PLATFORMS[0],
    }
  );
  const [tagsInput, setTagsInput] = useState((initial?.tags || []).join(", "));
  const [saving, setSaving] = useState(false);
  const [fetchingImage, setFetchingImage] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageMessage, setImageMessage] = useState("");

  function update<K extends keyof Product>(key: K, value: Product[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  // Step 1: try to auto-pull the image straight from the affiliate/store link.
  async function autoFetchImage() {
    if (!form.affiliateLink) {
      setImageMessage("Paste the affiliate link first.");
      return;
    }
    setFetchingImage(true);
    setImageMessage("");
    try {
      const res = await fetch("/api/fetch-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: form.affiliateLink }),
      });
      const data = await res.json();
      if (data.success && data.image) {
        update("image", data.image);
        setImageMessage("Image pulled from the store page ✓");
      } else {
        setImageMessage(data.message || "Couldn't auto-fetch. Upload manually below.");
      }
    } catch {
      setImageMessage("Couldn't auto-fetch. Upload manually below.");
    } finally {
      setFetchingImage(false);
    }
  }

  // Step 2 (fallback / preference): manual upload, stored permanently on Vercel Blob.
  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    setImageMessage("");
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body });
      const data = await res.json();
      if (data.url) {
        update("image", data.url);
        setImageMessage("Image uploaded ✓");
      } else {
        setImageMessage("Upload failed. Try again.");
      }
    } finally {
      setUploadingImage(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      tags: tagsInput.split(",").map((t) => t.trim()).filter(Boolean),
    };
    const url = initial ? `/api/products/${initial.id}` : "/api/products";
    const method = initial ? "PUT" : "POST";
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    onSaved();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-xl2 bg-white dark:bg-ink-900 p-5 shadow-card"
    >
      <h3 className="md:col-span-2 text-base font-bold">
        {initial ? "Edit Product" : "Add New Product"}
      </h3>

      <Field label="Product Name">
        <input required value={form.name} onChange={(e) => update("name", e.target.value)} className="input" />
      </Field>

      <Field label="Brand / Store Name">
        <input required value={form.brand} onChange={(e) => update("brand", e.target.value)} className="input" />
      </Field>

      <Field label="Short Description" full>
        <textarea
          required
          rows={2}
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          className="input"
        />
      </Field>

      <Field label="Full Description (optional)" full>
        <textarea
          rows={3}
          value={form.fullDescription || ""}
          onChange={(e) => update("fullDescription", e.target.value)}
          className="input"
        />
      </Field>

      <Field label="Category">
        <select value={form.category} onChange={(e) => update("category", e.target.value)} className="input">
          {CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </Field>

      <Field label="Platform">
        <select value={form.platform} onChange={(e) => update("platform", e.target.value)} className="input">
          {PLATFORMS.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>
      </Field>

      <Field label="Price">
        <input required placeholder="₹999" value={form.price} onChange={(e) => update("price", e.target.value)} className="input" />
      </Field>

      <Field label="Original Price (optional)">
        <input placeholder="₹1499" value={form.originalPrice || ""} onChange={(e) => update("originalPrice", e.target.value)} className="input" />
      </Field>

      <Field label="Rating (optional, 0-5)">
        <input type="number" step="0.1" min="0" max="5" value={form.rating ?? ""} onChange={(e) => update("rating", e.target.value as any)} className="input" />
      </Field>

      <Field label="Tags (comma-separated)">
        <input value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} placeholder="budget, recommended" className="input" />
      </Field>

      <Field label="Affiliate Link" full>
        <div className="flex gap-2">
          <input
            required
            value={form.affiliateLink}
            onChange={(e) => update("affiliateLink", e.target.value)}
            placeholder="https://amazon.in/..."
            className="input flex-1"
          />
          <button
            type="button"
            onClick={autoFetchImage}
            disabled={fetchingImage}
            className="whitespace-nowrap rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-ink-950 px-3 text-xs font-semibold disabled:opacity-50"
          >
            {fetchingImage ? "Fetching..." : "Auto-fetch image"}
          </button>
        </div>
      </Field>

      <Field label="Product Image" full>
        <div className="flex items-center gap-3">
          {form.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={form.image} alt="preview" className="h-16 w-16 rounded-lg object-cover border" />
          )}
          <div className="flex-1">
            <input type="file" accept="image/*" onChange={handleFileUpload} disabled={uploadingImage} className="text-xs" />
            <p className="text-[11px] text-neutral-400 mt-1">
              {uploadingImage ? "Uploading..." : imageMessage || "Auto-fetch from the link above, or upload a file manually."}
            </p>
          </div>
        </div>
      </Field>

      <Field label="Featured?">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={!!form.featured} onChange={(e) => update("featured", e.target.checked as any)} />
          Show in Featured section
        </label>
      </Field>

      <Field label="Latest?">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={!!form.latest} onChange={(e) => update("latest", e.target.checked as any)} />
          Show "New" badge / Recently Added
        </label>
      </Field>

      <div className="md:col-span-2 flex gap-3 pt-2">
        <button
          disabled={saving || !form.image}
          type="submit"
          className="rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-dark disabled:opacity-50"
        >
          {saving ? "Saving..." : initial ? "Save Changes" : "Add Product"}
        </button>
        <button type="button" onClick={onCancel} className="rounded-lg border px-5 py-2.5 text-sm font-semibold">
          Cancel
        </button>
        {!form.image && <p className="text-xs text-red-500 self-center">Image required — auto-fetch or upload one.</p>}
      </div>

      <style jsx global>{`
        .input {
          @apply w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-ink-950 px-3 py-2 text-sm outline-none focus:border-accent;
        }
      `}</style>
    </form>
  );
}

function Field({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <label className={`flex flex-col gap-1 ${full ? "md:col-span-2" : ""}`}>
      <span className="text-xs font-medium text-neutral-500">{label}</span>
      {children}
    </label>
  );
}
