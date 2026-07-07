import { getServerSession } from "next-auth";
import { authOptions, isAdminEmail } from "@/lib/auth";

/** Returns the session if the caller is a logged-in admin, otherwise null. */
export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || !isAdminEmail(session.user.email)) {
    return null;
  }
  return session;
}
