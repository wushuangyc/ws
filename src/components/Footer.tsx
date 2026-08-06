export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6 text-sm text-zinc-500">
        <span>© {new Date().getFullYear()} WS</span>
        <span>Next.js · TypeScript · Tailwind</span>
      </div>
    </footer>
  );
}
