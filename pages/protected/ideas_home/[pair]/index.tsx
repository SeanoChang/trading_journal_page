import React from "react";
import { GetStaticProps, GetStaticPaths } from "next";
import fs from "fs";
import path from "path";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { RiArrowLeftCircleLine } from "react-icons/ri";

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
      <li key={post}>
        <a
          href={`/protected/ideas_home/${props.pair}/${post}`}
          className="text-sm md:text-base lg:text-lg hover:underline text-slate-100"
        >
          {post}
        </a>
      </li>
    );
  });

  return (
    <>
      <div className="flex flex-row w-full sticky bg-slate-700 justify-start items-center">
        <span className="text-slate-100 p-2 text-xl">
          <a
            href={`/protected/ideas_home`}
            className="flex flex-row items-center"
          >
            <RiArrowLeftCircleLine className="inline " />{" "}
            <span className="pl-1">back</span>
          </a>
        </span>
      </div>
      <div className="flex flex-col justify-center items-center w-full min-h-screen">
        <h1 className="text-3xl md:text-5xl lg:text-7xl">
          {props.pair.toUpperCase()} Home
        </h1>
        <ul className="bg-slate-400 p-4 drop-shadow-md hover:drop-shadow-lg m-4 rounded">
          {" "}
          {postItems}
        </ul>
      </div>
    </>
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
