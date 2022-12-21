import React from "react";
import { getProviders, signIn } from "next-auth/react";

export default function SignIn(providers: any) {
  const providerList = Object.values(providers.providers).map(
    (provider: any) => {
      return (
        <div key={provider.name}>
          <button
            onClick={() =>
              signIn(provider.id, {
                callbackUrl: `${window.location.origin}/protected`,
              })
            }
          >
            Sign in with {provider.name}
          </button>
        </div>
      );
    }
  );

  return <>{providerList}</>;
}

export async function getServerSideProps() {
  const providers = await getProviders();
  return {
    props: { providers },
  };
}
