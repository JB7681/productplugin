"use client";
import { signIn, useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const { data: session, status } = useSession();
  const params = useSearchParams();
  const denied = params.get("denied");
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && (session?.user as any)?.isAdmin) {
      router.replace("/admin");
    }
  }, [status, session, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 dark:bg-ink-950 px-4">
      <div className="w-full max-w-sm rounded-xl2 bg-white dark:bg-ink-900 p-8 shadow-card text-center">
        <h1 className="text-xl font-bold mb-1">Admin Login</h1>
        <p className="text-sm text-neutral-500 mb-6">
          Sign in with the Gmail account linked to this site.
        </p>

        {denied && (
          <p className="mb-4 rounded-lg bg-red-50 dark:bg-red-900/20 px-3 py-2 text-xs text-red-600 dark:text-red-400">
            That Google account isn't authorized as admin.
          </p>
        )}

        <button
          onClick={() => signIn("google", { callbackUrl: "/admin" })}
          className="w-full rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-ink-950 py-3 text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          Continue with Google
        </button>
      </div>
    </div>
  );
}
