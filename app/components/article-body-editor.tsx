"use client";

import { useRef } from "react";

type ArticleBodyEditorProps = {
  defaultValue?: string;
};

export default function ArticleBodyEditor({
  defaultValue = "",
}: ArticleBodyEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function selectAll() {
    textareaRef.current?.focus();
    textareaRef.current?.select();
  }

  return (
    <div>
      <div className="mb-1 flex items-center justify-between gap-3">
        <label className="block text-sm font-black">Innhold</label>

        <button
          type="button"
          onClick={selectAll}
          className="text-xs font-black uppercase tracking-[0.12em] text-[rgb(var(--brand))] hover:text-[rgb(var(--accent))]"
        >
          Marker alt
        </button>
      </div>

      <textarea
        ref={textareaRef}
        name="body"
        rows={18}
        defaultValue={defaultValue}
        className="w-full border border-black/20 px-3 py-2 font-mono text-sm outline-none focus:border-black"
        placeholder="Skriv artikkelen her..."
      />

      <div className="mt-3 rounded-lg border border-black/10 bg-black/[0.03] p-4 text-sm">
        <div className="mb-2 font-black">TV19-blokker</div>

        <pre className="overflow-x-auto whitespace-pre-wrap text-black/60">
{`[QUOTE]
...
[/QUOTE]

[SUBHEADING]
...
[/SUBHEADING]

[FACTBOX]
...
[/FACTBOX]

[DOCUMENTS]
...
[/DOCUMENTS]

[IMAGE]
https://...
[/IMAGE]`}
        </pre>
      </div>
    </div>
  );
}