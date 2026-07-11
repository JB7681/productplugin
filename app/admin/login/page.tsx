"use client";

import { Suspense, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";

function AdminLoginInner() {
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
        <h1 className="mb-1 text-xl font-bold">Admin Login</h1>
        <p className="mb-6 text-sm text-neutral-500">
          Sign in with the Gmail account linked to this site.
        </p>

        {denied && (
          <p className="mb-4 text-sm text-red-600">
            Access denied. This Google account is not allowed.
          </p>
        )}

        <button
          onClick={() => signIn("google", { callbackUrl: "/admin" })}
          className="w-full rounded-lg bg-black py-3 font-medium text-white"
        >
          Continue with Google
        </button>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center">Loading...</div>}>
      <AdminLoginInner />
    </Suspense>
  );
}