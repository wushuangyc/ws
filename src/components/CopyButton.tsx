"use client";

import { useState } from "react";

export function CopyButton({ text, label = "复制" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  async function onCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <button
      type="button"
      onClick={onCopy}
      className="inline-flex h-8 items-center rounded-md border border-stone-300 bg-white px-2.5 text-xs font-medium text-stone-700 transition-colors hover:bg-stone-100"
    >
      {copied ? "已复制" : label}
    </button>
  );
}
