import Image from "next/image";
import { Profile } from "@/lib/types";
import SocialLinks from "./SocialLinks";

export default function Hero({ profile }: { profile: Profile }) {
  return (
    <section id="top" className="mx-auto max-w-3xl px-4 pt-10 pb-8 text-center">
      <div className="relative mx-auto mb-4 h-24 w-24 overflow-hidden rounded-full ring-4 ring-white dark:ring-ink-900 shadow-card">
        <Image
          src={profile.avatarUrl || "https://api.dicebear.com/7.x/initials/png?seed=" + profile.name}
          alt={profile.name}
          fill
          sizes="96px"
          className="object-cover"
        />
      </div>
      <h1 className="text-2xl font-bold tracking-tight">{profile.name}</h1>
      <p className="mt-1 text-sm font-medium text-accent">{profile.tagline}</p>
      <p className="mx-auto mt-3 max-w-md text-sm text-neutral-500 dark:text-neutral-400">
        {profile.bio}
      </p>
      <div className="mt-4">
        <SocialLinks profile={profile} />
      </div>
    </section>
  );
}
