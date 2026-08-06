import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-zinc-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <Link href="/" className="text-lg font-semibold tracking-tight text-zinc-900">
          WS
        </Link>
        <nav className="flex items-center gap-6 text-sm text-zinc-600">
          <Link href="/" className="transition-colors hover:text-zinc-900">
            首页
          </Link>
          <a
            href="https://nextjs.org/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-zinc-900"
          >
            文档
          </a>
        </nav>
      </div>
    </header>
  );
}
