import React from "react";
import { getProviders, signIn } from "next-auth/react";
import { BsGoogle, BsGithub } from "react-icons/bs";
import { FaDiscord } from "react-icons/fa";

export default function SignIn(providers: any) {
  const providerStyles = [
    {
      bgcolor: "bg-[#7289DA]",
      iconcolor: "text-gray-100",
      icon: <FaDiscord />,
    },
    {
      bgcolor: "bg-gray-800",
      iconcolor: "text-gray-100",
      icon: <BsGithub />,
    },
    {
      bgcolor: "bg-gray-100",
      iconcolor: "text-gray-800",
      icon: <BsGoogle />,
    },
  ];

  const providerList = Object.values(providers.providers).map(
    (provider: any, index: number) => {
      return (
        <div
          key={provider.name}
          className="flex flex-row justify-center items-center text-lg sm:text-xl 2xl:text-2xl w-full py-4"
        >
          <button
            onClick={() =>
              signIn(provider.id, {
                callbackUrl: `${window.location.origin}/protected`,
              })
            }
            className={`flex flex-row justify-evenly items-center rounded-2xl w-2/3 hover:shadow-slate-500/50 hover:shadow-lg transition duration-150 ${providerStyles[index].bgcolor} ${providerStyles[index].iconcolor}`}
          >
            <span className="p-1 sm:p-2 lg:p-4">
              {providerStyles[index].icon}
            </span>
            <span className="py-1 pr-1 sm:py-2 sm:pr-2 lg:py-4 lg:pr-4 overflow-clip">
              {provider.name}
            </span>
          </button>
        </div>
      );
    }
  );

  return (
    <div className="flex flex-row justify-center items-center h-screen w-screen bg-slate-900">
      <div className="flex flex-col justify-center items-center text-center w-1/2 sm:w-1/3 2xl:w-1/5 rounded-lg bg-slate-200">
        {providerList}
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  const providers = await getProviders();
  return {
    props: { providers },
  };
}
