"use client";

import { useState } from "react";

const poll = {
  question: "Når bør en ny vurdering vurderes?",
  options: [
    {
      id: "now",
      label: "A",
      text: "Nå",
      percent: 11,
    },
    {
      id: "new-assessment",
      label: "B",
      text: "Etter en ny vurdering",
      percent: 82,
    },
    {
      id: "after-holiday",
      label: "C",
      text: "Etter ferien",
      percent: 7,
    },
  ],
};

export default function Tv19Poll() {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const hasVoted = selectedOption !== null;

  return (
    <section className="min-h-[320px] overflow-hidden bg-white">
      <div className="bg-[rgb(var(--brand))] px-4 py-3 text-white">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-black leading-none">
              TV19 undersøker
            </h3>

            <p className="mt-1 text-[10px] font-black uppercase tracking-[0.18em] text-white/65">
              Ukens spørsmål
            </p>
          </div>

          <span className="text-[10px] font-black uppercase tracking-[0.16em] text-white/75">
            Foreløpig
          </span>
        </div>
      </div>

      <div className="p-4">
        <h4 className="text-xl font-black leading-tight">
          {poll.question}
        </h4>

        <div className="mt-4 space-y-2">
          {poll.options.map((option) => {
            const isSelected = selectedOption === option.id;

            if (!hasVoted) {
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setSelectedOption(option.id)}
                  className="flex w-full items-center gap-3 border border-black/10 bg-[#f7f4f4] px-3 py-2 text-left transition hover:border-[rgb(var(--brand))] hover:bg-white"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center bg-white text-sm font-black">
                    {option.label}
                  </span>

                  <span className="text-sm font-black leading-tight">
                    {option.text}
                  </span>
                </button>
              );
            }

            return (
              <div
                key={option.id}
                className="relative overflow-hidden border border-black/10 bg-[#f7f4f4]"
              >
                <div
                  className={[
                    "absolute inset-y-0 left-0",
                    isSelected
                      ? "bg-[rgb(var(--brand))]/25"
                      : "bg-black/10",
                  ].join(" ")}
                  style={{ width: `${option.percent}%` }}
                />

                <div className="relative flex items-center gap-3 px-3 py-2">
                  <span
                    className={[
                      "flex h-8 w-8 shrink-0 items-center justify-center text-sm font-black",
                      isSelected
                        ? "bg-[rgb(var(--brand))] text-white"
                        : "bg-white",
                    ].join(" ")}
                  >
                    {option.label}
                  </span>

                  <span className="min-w-0 flex-1 text-sm font-black leading-tight">
                    {option.text}
                  </span>

                  <span className="text-sm font-black">
                    {option.percent} %
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-3 text-[10px] font-bold leading-snug text-black/40">
          Resultatet bygger på tilgjengelige stemmer og øvrige vurderinger.
        </p>
      </div>
    </section>
  );
}