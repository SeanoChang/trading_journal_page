"use client";
import { useSession, signIn } from "next-auth/react";

export default function AdminPage() {
  const { status } = useSession();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p>Admin requires sign-in.</p>
        <button
          className="px-4 py-2 rounded bg-blue-600 text-white"
          onClick={() => signIn()}
        >
          Sign in
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-xl font-semibold">Admin</h1>
    </div>
  );
}
