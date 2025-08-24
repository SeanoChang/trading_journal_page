"use client";
import dynamic from "next/dynamic";
import { MDXProvider } from "@mdx-js/react";
import Image from "next/image";
import NavBar from "../../../../../components/home/protected/pair/Navbar";

const components = {
  h1: (props: any) => (
    <h1 {...props} className="text-stone-300 text-4xl border-b-2 border-slate-400 py-1 my-1" />
  ),
  h2: (props: any) => (
    <h2 {...props} className="text-stone-300 text-3xl border-b-2 border-slate-400 py-1 my-1" />
  ),
  h3: (props: any) => (
    <h3 {...props} className="text-stone-300 text-2xl border-b-2 border-slate-400 py-1 my-1" />
  ),
  h4: (props: any) => (
    <h4 {...props} className="text-stone-300 text-xl border-b-2 border-slate-400 py-1 my-1" />
  ),
  p: (props: any) => <p {...props} className="py-2" />,
  a: (props: any) => <a {...props} className="text-blue-400 hover:text-blue-300 underline" />,
  ul: (props: any) => <ul {...props} className="list-disc pl-6 py-2" />,
  ol: (props: any) => <ol {...props} className="list-decimal pl-6 py-2" />,
  li: (props: any) => <li {...props} className="py-1" />,
  blockquote: (props: any) => (
    <blockquote {...props} className="border-l-4 border-slate-400 pl-4 py-2 italic" />
  ),
  code: (props: any) => (
    <code {...props} className="bg-slate-700 text-slate-100 px-1 py-0.5 rounded text-sm" />
  ),
  pre: (props: any) => (
    <pre {...props} className="bg-slate-800 text-slate-100 p-4 rounded-lg overflow-x-auto my-4" />
  ),
  img: (props: any) => (
    <Image
      {...props}
      alt={props.alt ?? ""}
      width={props.width ?? 1200}
      height={props.height ?? 800}
      className="max-w-full h-auto my-4 rounded-lg"
    />
  ),
  table: (props: any) => (
    <table {...props} className="table-auto border-collapse border border-slate-400 my-4" />
  ),
  thead: (props: any) => (
    <thead {...props} className="table-header-group border-b-[1px] border-slate-300" />
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

interface ClientWrapperProps {
  pair: string;
  date: string;
}

export default function ClientWrapper({ pair, date }: ClientWrapperProps) {
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
