import React from "react";
import { GetStaticProps, GetStaticPaths } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import AdminList from "../../components/admin/AdminList";
import UserList from "../../components/admin/UserList";

const Admin = (): JSX.Element => {
  const router = useRouter();
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      // The user is not authenticated, handle it here.
      router.push("/");
    },
  });

  // if the user is not an admin,
  //   if (session && session.user.role !== "admin") {
  //     return (
  //       <div className="flex flex-col justify-center items-center min-h-screen">
  //         <h1 className="text-xl md:text-4xl lg:text-6xl text-stone-800">
  //           You are not authorized to view this page.
  //         </h1>
  //         <button
  //           className="bg-stone-500 hover:bg-stone-700 text-white font-bold py-2 px-4 rounded"
  //           onClick={() => router.push("/")}
  //         >
  //           <a href="/">Go Back</a>
  //         </button>
  //       </div>
  //     );
  //   }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <h1 className="text-xl md:text-4xl lg:text-6xl text-stone-800">
        Admin Page
      </h1>
      <AdminList />
      <UserList />
    </div>
  );
};

const getStaticProps: GetStaticProps = async () => {
  // get the list of admin from the database

  return {
    props: {
      // props for your component
    },
  };
};

export default Admin;
