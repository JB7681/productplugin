import { getServerSession } from "next-auth";
import { authOptions, isAdminEmail } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AdminDashboard from "@/components/admin/AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || !isAdminEmail(session.user.email)) {
    redirect("/admin/login?denied=1");
  }

  const [products, profile] = await Promise.all([
    prisma.product.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.profile.upsert({ where: { id: 1 }, update: {}, create: { id: 1 } }),
  ]);

  return (
    <AdminDashboard
      initialProducts={JSON.parse(JSON.stringify(products))}
      initialProfile={JSON.parse(JSON.stringify(profile))}
      adminEmail={session.user.email}
    />
  );
}
