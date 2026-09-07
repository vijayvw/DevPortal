import { useState } from "react";
import { Check, Copy } from "lucide-react";

interface CodeBlockProps {
  title: string;
  code: string;
}

export function CodeBlock({ title, code }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(code);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  return (
    <details className="overflow-hidden rounded-xl border border-neutral-700 bg-neutral-900">
      <summary className="flex cursor-pointer items-center justify-between p-4 font-mono font-semibold">
        <span>{title}</span>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            handleCopy();
          }}
          className="rounded-md p-2 transition hover:bg-neutral-800"
        >
          {copied ? (
            <Check size={18} className="text-green-400" />
          ) : (
            <Copy size={18} />
          )}
        </button>
      </summary>

      <pre className="overflow-x-auto border-t border-neutral-700 p-5 text-sm leading-7 text-green-400">
        <code>{code}</code>
      </pre>
    </details>
  );
}
