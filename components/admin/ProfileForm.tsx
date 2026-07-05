"use client";
import { useState } from "react";
import { Profile } from "@/lib/types";

export default function ProfileForm({ initial }: { initial: Profile }) {
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saved, setSaved] = useState(false);

  function update<K extends keyof Profile>(key: K, value: Profile[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
  }

  // Uploading a new photo replaces the URL saved on the Profile row.
  // Because it's stored in the database (not on disk), it stays exactly
  // as-is — permanently — until you upload a different one.
  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body });
      const data = await res.json();
      if (data.url) update("avatarUrl", data.url);
    } finally {
      setUploading(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    setSaved(true);
  }

  return (
    <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-xl2 bg-white dark:bg-ink-900 p-5 shadow-card">
      <h3 className="md:col-span-2 text-base font-bold">Profile & Avatar</h3>

      <div className="md:col-span-2 flex items-center gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={form.avatarUrl || "https://api.dicebear.com/7.x/initials/png?seed=" + form.name}
          alt="avatar"
          className="h-20 w-20 rounded-full object-cover border"
        />
        <div>
          <input type="file" accept="image/*" onChange={handleAvatarUpload} disabled={uploading} className="text-xs" />
          <p className="text-[11px] text-neutral-400 mt-1">
            {uploading ? "Uploading..." : "This photo stays permanent until you upload a new one."}
          </p>
        </div>
      </div>

      <Field label="Name">
        <input value={form.name} onChange={(e) => update("name", e.target.value)} className="input" />
      </Field>
      <Field label="Tagline">
        <input value={form.tagline} onChange={(e) => update("tagline", e.target.value)} className="input" />
      </Field>
      <Field label="Bio" full>
        <textarea rows={3} value={form.bio} onChange={(e) => update("bio", e.target.value)} className="input" />
      </Field>
      <Field label="Instagram URL">
        <input value={form.instagram} onChange={(e) => update("instagram", e.target.value)} className="input" />
      </Field>
      <Field label="YouTube URL">
        <input value={form.youtube} onChange={(e) => update("youtube", e.target.value)} className="input" />
      </Field>
      <Field label="Shorts/TikTok URL">
        <input value={form.tiktokOrShorts} onChange={(e) => update("tiktokOrShorts", e.target.value)} className="input" />
      </Field>
      <Field label="Affiliate Disclosure Text" full>
        <textarea rows={3} value={form.disclosure} onChange={(e) => update("disclosure", e.target.value)} className="input" />
      </Field>

      <div className="md:col-span-2 flex items-center gap-3">
        <button disabled={saving} type="submit" className="rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-dark disabled:opacity-50">
          {saving ? "Saving..." : "Save Profile"}
        </button>
        {saved && <span className="text-xs text-green-600">Saved ✓</span>}
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
