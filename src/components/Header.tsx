import Link from "next/link";

const links = [
  { href: "#overview", label: "总览" },
  { href: "#findings", label: "发现" },
  { href: "#diagnosis", label: "问卷诊断" },
  { href: "#next", label: "下一轮问卷" },
  { href: "#scripts", label: "话术" },
] as const;

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-stone-200/80 bg-[#f6f1e8]/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-teal-800 text-sm font-semibold text-amber-100">
            电
          </span>
          <span className="text-[15px] font-semibold tracking-tight text-stone-900">
            客户回访校准
          </span>
        </Link>
        <nav className="hidden items-center gap-5 text-sm text-stone-600 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-teal-800"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
