"use client";
import dynamic from "next/dynamic";
import { MDXProvider } from "@mdx-js/react";
import NavBar from "../../../../../components/home/protected/pair/Navbar";

const components = {
  h1: (props: any) => (
    <h1 {...props} className="text-stone-300 text-4xl border-b-2 border-slate-400 py-1 my-1" />
  ),
  h2: (props: any) => (
    <h2 {...props} className="text-3xl text-stone-300 border-b-2 border-slate-300 py-1 my-1" />
  ),
  h3: (props: any) => <h3 {...props} className="text-2xl text-stone-300 py-1 my-1" />,
  h4: (props: any) => <h4 {...props} className="text-xl text-stone-300 py-1 my-1" />,
  ul: (props: any) => <ul {...props} className="list-disc " />,
  ol: (props: any) => <ol {...props} className="list-decimal" />,
  li: (props: any) => <li {...props} className="p-1 ml-6" />,
  p: (props: any) => <p {...props} className="py-2" />,
  blockquote: (props: any) => <blockquote {...props} className="border-l-6 p-1 border-slate-400" />,
  pre: (props: any) => <pre {...props} className="flex flex-row overflow-x-scroll p-1" />,
  code: (props: any) => (
    <code {...props} className="inline bg-slate-500 rounded py-1 px-2 text-slate-100" />
  ),
  inlineCode: (props: any) => <code {...props} className="bg-slate-800" />,
  table: (props: any) => <table {...props} className="table m-2 justify-start" />,
  thead: (props: any) => (
    <thead {...props} className="table-header-group border-b-[1px] border-slate-400" />
  ),
  tbody: (props: any) => (
    <tbody {...props} className="table-row-group border-b-[1px] border-slate-300" />
  ),
  th: (props: any) => <th {...props} className="table-cell py-1 px-4" />,
  td: (props: any) => <td {...props} className="table-cell py-1 px-4" />,
  tr: (props: any) => <tr {...props} className="table-row" />,
  em: (props: any) => <em {...props} className="italic" />,
  strong: (props: any) => <strong {...props} className="bold" />,
  del: (props: any) => <del {...props} />,
  hr: (props: any) => <hr {...props} />,
};

export default function PostPage({ params }: { params: { pair: string; date: string } }) {
  const { pair, date } = params;
  const MDXPost = dynamic(() => import(`../../../../../data/journals_mdx/${pair}/${date}.mdx`));

  return (
    <div className="w-screen bg-slate-50 dark:bg-[#161624] min-h-screen text-slate-600 dark:text-slate-200">
      <NavBar symbol={`${date}`} />
      <div className="flex flex-col justify-center items-center">
        <div className="p-8 w-5/6 md:w-2/3">
          <MDXProvider components={components}>
            <MDXPost />
          </MDXProvider>
        </div>
      </div>
    </div>
  );
}

