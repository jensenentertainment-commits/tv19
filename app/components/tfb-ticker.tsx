"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type TfbUpdate = {
  id: string;
  title: string | null;
  text: string;
};

export default function TfbTicker({ updates }: { updates: TfbUpdate[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (updates.length <= 1) return;

    const interval = setInterval(() => {
      setIndex((current) => (current + 1) % updates.length);
    }, 7000);

    return () => clearInterval(interval);
  }, [updates.length]);

  const update = updates[index];

  if (!update) return null;

  return (
    <Link href="/akkurat-na" className="group block no-underline">
      <section className="mb-4 border-y-4 border-black bg-white p-4 transition-colors group-hover:bg-[#f3eeee]">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[rgb(var(--accent))]" />

            <span className="text-xs font-black uppercase tracking-[0.25em] text-[rgb(var(--accent))]">
              Akkurat nå
            </span>
          </div>

          <span className="hidden text-xs font-black uppercase tracking-[0.16em] text-black/35 sm:inline">
            TFB LIVE
          </span>
        </div>

        <div className="mt-2 text-2xl font-black leading-tight">
          {update.title ?? "Observasjon registrert"}
        </div>

        <p className="mt-2 max-w-3xl text-base font-bold leading-snug text-black/65">
          {update.text}
        </p>

        <div className="mt-3 text-xs font-black uppercase tracking-[0.18em] text-black/40 group-hover:text-[rgb(var(--accent))]">
          Levert av TFB →
        </div>
      </section>
    </Link>
  );
}