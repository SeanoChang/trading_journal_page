import React from "react";
import { GetStaticProps, GetStaticPaths } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import fs from "fs";
import path from "path";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import matter from "gray-matter";
import remarkGfm from "remark-gfm";
import dynamic from "next/dynamic";
import { MDXProvider } from "@mdx-js/react";
import { RiArrowLeftCircleLine } from "react-icons/ri";

const components = {
  h1: (props: any) => (
    <h1
      {...props}
      className="text-stone-300 text-4xl border-b-2 border-slate-400 py-1 my-1"
    />
  ),
  h2: (props: any) => (
    <h2
      {...props}
      className="text-3xl text-stone-300 border-b-2 border-slate-300 py-1 my-1"
    />
  ),
  h3: (props: any) => (
    <h3 {...props} className="text-2xl text-stone-300 py-1 my-1" />
  ),
  h4: (props: any) => (
    <h4 {...props} className="text-xl text-stone-300 py-1 my-1" />
  ),
  ul: (props: any) => <ul {...props} className="list-disc " />,
  ol: (props: any) => <ol {...props} className="list-decimal" />,
  li: (props: any) => <li {...props} className="p-1 ml-6" />,
  p: (props: any) => <p {...props} className="py-2" />,
  blockquote: (props: any) => (
    <blockquote {...props} className="border-l-6 p-1 border-slate-400" />
  ),
  pre: (props: any) => (
    <pre {...props} className="flex flex-row overflow-x-scroll p-1" />
  ),
  code: (props: any) => (
    <code
      {...props}
      className="inline bg-slate-500 rounded py-1 px-2 text-slate-100"
    />
  ),
  inlineCode: (props: any) => <code {...props} className="bg-slate-800" />,
  table: (props: any) => (
    <table {...props} className="table m-2 justify-start" />
  ),
  thead: (props: any) => (
    <thead
      {...props}
      className="table-header-group border-b-[1px] border-slate-400"
    />
  ),
  tbody: (props: any) => (
    <tbody
      {...props}
      className="table-row-group border-b-[1px] border-slate-300"
    />
  ),
  th: (props: any) => <th {...props} className="table-cell py-1 px-4" />,
  td: (props: any) => <td {...props} className="table-cell py-1 px-4" />,
  tr: (props: any) => <tr {...props} className="table-row" />,
  em: (props: any) => <em {...props} className="italic" />,
  strong: (props: any) => <strong {...props} className="bold" />,
  del: (props: any) => <del {...props} />,
  hr: (props: any) => <hr {...props} />,
};

const Post = (): JSX.Element => {
  const router = useRouter();
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      // The user is not authenticated, handle it here.
      router.push("/");
    },
  });

  const { pair, date } = router.query;

  const Post = dynamic(
    import(`../../../../data/journals_mdx/${pair}/${date}.mdx`)
  );

  return (
    <div className="flex flex-col min-h-screen w-full justify-center items-center bg-slate-800">
      <div className="flex flex-row w-full sticky bg-slate-700 justify-start items-center">
        <span className="text-slate-100 p-2 text-xl">
          <a
            href={`/protected/ideas_home/${pair}`}
            className="flex flex-row items-center"
          >
            <RiArrowLeftCircleLine className="inline " />{" "}
            <span className="pl-1">back</span>
          </a>
        </span>
      </div>
      <div className="p-8 w-5/6 md:w-2/3 text-slate-300">
        <MDXProvider components={components}>
          <Post />
        </MDXProvider>
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const source = fs.readFileSync(
    path.join(
      process.cwd(),
      "data",
      "journals_mdx",
      `${params?.pair}`,
      `${params?.date}.mdx`
    ),
    "utf8"
  );

  const { content, data } = matter(source);

  const mdxSource = await serialize(content, {
    mdxOptions: {
      remarkPlugins: [remarkGfm],
    },
    scope: data,
    parseFrontmatter: true,
  });

  return {
    props: {
      source: mdxSource,
      frontmatter: data,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const postsDirectory = path.join(process.cwd(), "data", "journals_mdx");
  const filenames = fs.readdirSync(postsDirectory);
  let paths: any = [];
  filenames.forEach((filename) => {
    // for each filename, get all the posts.
    // for each post, get the date and pair.
    const postsPath = path.join(postsDirectory, filename);
    const posts = fs.readdirSync(postsPath);
    posts.forEach((post) => {
      // replace the .mdx with nothing
      const postName = post.replace(".mdx", "");

      paths.push({
        params: {
          pair: filename,
          date: postName,
        },
      });
    });
  });

  return {
    paths,
    fallback: false,
  };
};

export default Post;
