import React from "react";
import { GetStaticProps, GetStaticPaths } from "next";
import fs from "fs";
import path from "path";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import NavBar from "../../../../components/home/protected/pair/Navbar";
import Footer from "../../../../components/general/Footer";

const PairHome = (props: { pair: string; posts: string[] }): JSX.Element => {
  const router = useRouter();
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      // The user is not authenticated, handle it here.
      router.push("/");
    },
  });

  const postItems = props.posts.map((post) => {
    // strip the .mdx extension
    post = post.replace(".mdx", "");

    return (
      <li key={post} className="text-slate-800 dark:text-slate-100">
        <a
          href={`/protected/ideas_home/${props.pair}/${post}`}
          className="text-sm md:text-base lg:text-lg hover:underline "
        >
          {post}
        </a>
      </li>
    );
  });

  if (postItems.length === 0) {
    return (
      <div className="w-screen bg-slate-50 dark:bg-[#161624] min-h-screen text-slate-600 dark:text-slate-200">
        <NavBar symbol={props.pair} />
        <div className="flex flex-col justify-center items-center text-center h-screen -translate-y-[64px]">
          Planning on adding some ideas for {props.pair} soon!
        </div>
        <footer className="flex flex-col justify-center items-center">
          <span>&#169; SeanoChang</span>
        </footer>
      </div>
    );
  }

  return (
    <div className="w-screen bg-slate-50 dark:bg-[#161624] min-h-screen text-slate-600 dark:text-slate-200">
      <NavBar symbol={props.pair} />
      <div className="flex flex-col justify-center items-center text-center h-screen -translate-y-[64px]">
        <ul className="grid auto-cols-auto p-4 bg-slate-200 dark:bg-slate-500 m-4 rounded w-5/6 sm:w-3/4 md:w-2/3 lg:w-1/2">
          {postItems}
        </ul>
      </div>
      <Footer />
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  // query all of the posts for the pair
  const posts: string[] = [];
  if (params?.pair) {
    const pairDirectory = path.join(
      process.cwd(),
      "data",
      "journals_mdx",
      `${params?.pair}`
    );
    const filenames = fs.readdirSync(pairDirectory);
    filenames.forEach((filename) => {
      posts.push(filename);
    });
  }

  return {
    props: {
      pair: params?.pair,
      posts: posts,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  // get all the paths from the data -> journals_mdx folder.
  const postsDirectory = path.join(process.cwd(), "data", "journals_mdx");
  const filenames = fs.readdirSync(postsDirectory);
  const paths = filenames.map((filename) => {
    return {
      params: {
        pair: filename,
      },
    };
  });

  return {
    paths,
    fallback: false,
  };
};

export default PairHome;
