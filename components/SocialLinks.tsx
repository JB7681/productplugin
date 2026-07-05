import { Profile } from "@/lib/types";

export default function SocialLinks({ profile }: { profile: Profile }) {
  const links = [
    { label: "Instagram", href: profile.instagram },
    { label: "YouTube", href: profile.youtube },
    { label: "Shorts", href: profile.tiktokOrShorts },
  ].filter((l) => l.href);

  if (links.length === 0) return null;

  return (
    <div className="flex items-center justify-center gap-3">
      {links.map((l) => (
        <a
          key={l.label}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-neutral-200 dark:border-neutral-700 px-4 py-1.5 text-xs font-medium hover:border-accent hover:text-accent transition-colors"
        >
          {l.label}
        </a>
      ))}
    </div>
  );
}
