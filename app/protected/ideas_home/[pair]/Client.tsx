"use client";
import NavBar from "../../../../components/home/protected/pair/Navbar";
import Footer from "../../../../components/general/Footer";

export default function PairHomeClient({ pair, posts }: { pair: string; posts: string[] }) {
  const postItems = posts.map((post) => {
    const name = post.replace(".mdx", "");
    return (
      <li key={name} className="text-slate-800 dark:text-slate-100">
        <a href={`/protected/ideas_home/${pair}/${name}`} className="text-sm md:text-base lg:text-lg hover:underline ">
          {name}
        </a>
      </li>
    );
  });

  if (postItems.length === 0) {
    return (
      <div className="w-screen bg-slate-50 dark:bg-[#161624] min-h-screen text-slate-600 dark:text-slate-200">
        <NavBar symbol={pair} />
        <div className="flex flex-col justify-center items-center text-center h-screen -translate-y-[64px]">
          Planning on adding some ideas for {pair} soon!
        </div>
        <footer className="flex flex-col justify-center items-center">
          <span>&#169; SeanoChang</span>
        </footer>
      </div>
    );
  }

  return (
    <div className="w-screen bg-slate-50 dark:bg-[#161624] min-h-screen text-slate-600 dark:text-slate-200">
      <NavBar symbol={pair} />
      <div className="flex flex-col justify-center items-center text-center h-screen -translate-y-[64px]">
        <ul className="grid auto-cols-auto p-4 bg-slate-200 dark:bg-slate-500 m-4 rounded w-5/6 sm:w-3/4 md:w-2/3 lg:w-1/2">
          {postItems}
        </ul>
      </div>
      <Footer />
    </div>
  );
}

