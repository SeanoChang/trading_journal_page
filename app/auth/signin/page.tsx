"use client";
import { useEffect, useState } from "react";
import { getProviders, signIn } from "next-auth/react";

type Provider = {
  id: string;
  name: string;
};

export default function SignInPage() {
  const [providers, setProviders] = useState<Record<string, Provider> | null>(
    null
  );

  useEffect(() => {
    getProviders().then((prov) => setProviders(prov));
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6">
      <h1 className="text-2xl font-semibold">Sign in</h1>
      {!providers && <p>Loading providers...</p>}
      {providers && (
        <div className="flex flex-col gap-3">
          {Object.values(providers).map((provider) => (
            <button
              key={provider.id}
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              onClick={() => signIn(provider.id)}
            >
              Sign in with {provider.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

