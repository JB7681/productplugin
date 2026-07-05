import { prisma } from "@/lib/prisma";
import HomeClient from "@/components/HomeClient";
import { Product, Profile } from "@/lib/types";

export const dynamic = "force-dynamic";

async function getProfile(): Promise<Profile> {
  let profile = await prisma.profile.findUnique({ where: { id: 1 } });
  if (!profile) profile = await prisma.profile.create({ data: { id: 1 } });
  return profile as unknown as Profile;
}

export default async function HomePage() {
  const [products, profile] = await Promise.all([
    prisma.product.findMany({ orderBy: { createdAt: "desc" } }),
    getProfile(),
  ]);

  return (
    <main>
      <HomeClient products={products as unknown as Product[]} profile={profile} />
    </main>
  );
}
