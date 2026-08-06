export default function Home() {
  return (
    <section className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-6 py-20">
      <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">
        Next.js Starter
      </p>
      <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
        欢迎使用 WS
      </h1>
      <p className="mt-5 max-w-xl text-lg leading-8 text-zinc-600">
        这是一个基于 Next.js、TypeScript 与 Tailwind CSS 的可运行起步项目，已包含基础布局与首页。
      </p>
      <div className="mt-10 flex flex-wrap gap-3">
        <a
          href="https://nextjs.org/docs"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-11 items-center rounded-lg bg-zinc-900 px-5 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
        >
          查看 Next.js 文档
        </a>
        <a
          href="https://tailwindcss.com/docs"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-11 items-center rounded-lg border border-zinc-300 bg-white px-5 text-sm font-medium text-zinc-800 transition-colors hover:bg-zinc-100"
        >
          查看 Tailwind 文档
        </a>
      </div>
    </section>
  );
}
