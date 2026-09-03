import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/95 text-white backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-sm font-semibold tracking-tight">
          在网增长 OKR
        </Link>
        <nav className="flex items-center gap-5 text-xs text-slate-300">
          <a href="#overview" className="hover:text-white">
            总览
          </a>
          <a href="#baseline" className="hover:text-white">
            基线
          </a>
          <a href="#target" className="hover:text-white">
            推演
          </a>
          <a href="#staffing" className="hover:text-white">
            编制
          </a>
          <a href="#guide" className="hover:text-white">
            口径
          </a>
        </nav>
      </div>
    </header>
  );
}
