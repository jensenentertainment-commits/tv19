"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Ad = {
  id?: string;
  label?: string | null;
  sponsor?: string | null;
  image_url?: string | null;
  title: string;
  text: string;
  cta?: string | null;
  href?: string | null;
  theme?: string | null;
};

const FALLBACK_ADS: Ad[] = [
  {
    title: "TV19",
    text: "Annonsen er under vurdering.",
    cta: "Følg utviklingen",
    theme: "tv19",
  },
];

function getAdTheme(theme?: string | null) {
  if (theme === "red") {
    return "bg-[rgb(var(--accent))] text-white";
  }

  if (theme === "dark") {
    return "bg-black text-white";
  }

  if (theme === "gold") {
    return "bg-[#E7B21D] text-black";
  }

  if (theme === "tv19") {
    return "bg-[rgb(var(--brand))] text-white";
  }

  if (theme === "rcc") {
    return "bg-[#102848] text-white";
  }

  if (theme === "ssc") {
    return "bg-[#E7B21D] text-black";
  }

  if (theme === "plus") {
    return "bg-gradient-to-br from-[#183A66] to-[#C62828] text-white";
  }

  if (theme === "notice") {
    return "bg-[#3b3b3b] text-white";
  }

  return "bg-[rgb(var(--brand))] text-white";
}

function getMutedText(theme?: string | null) {
  return theme === "gold" || theme === "ssc"
    ? "text-black/55"
    : "text-white/65";
}

function getBodyText(theme?: string | null) {
  return theme === "gold" || theme === "ssc"
    ? "text-black/80"
    : "text-white/90";
}

function getSponsorText(theme?: string | null) {
  return theme === "gold" || theme === "ssc"
    ? "text-black/55"
    : "text-white/55";
}

function getButton(theme?: string | null) {
  if (theme === "gold" || theme === "ssc") {
    return "border-black text-black hover:bg-black hover:text-white";
  }

  return "border-white text-white hover:bg-white hover:text-black";
}

export default function AdBox({
  ads,
  className = "",
}: {
  ads: Ad[];
  className?: string;
}) {
  const safeAds = ads?.length ? ads : FALLBACK_ADS;

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const ad = safeAds[index] ?? safeAds[0];

  useEffect(() => {
    if (paused || safeAds.length <= 1) return;

    const interval = window.setInterval(() => {
      setIndex((previousIndex) => {
        return (previousIndex + 1) % safeAds.length;
      });
    }, 10000);

    return () => window.clearInterval(interval);
  }, [paused, safeAds.length]);

  if (!ad) return null;

  const adContent = (
    <aside
      key={ad.id ?? index}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className={[
        "group relative h-full overflow-hidden p-5 shadow-sm",
        "animate-[adSwap_.5s_ease-out]",
        "transition duration-300 hover:-translate-y-1 hover:shadow-lg",
        getAdTheme(ad.theme),
      ].join(" ")}
    >
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -left-12 -top-12 h-36 w-36 rounded-full border-[22px] border-current" />

        <div className="absolute -bottom-16 -right-16 h-48 w-48 rounded-full border-[26px] border-current" />
      </div>

      <div className="relative z-10 flex h-full flex-col">
        <div
          className={[
            "text-[10px] font-black uppercase tracking-[0.28em]",
            getMutedText(ad.theme),
          ].join(" ")}
        >
          {ad.label || "Annonse"}
        </div>

        {ad.sponsor ? (
          <div
            className={[
              "mt-2 text-xs font-black uppercase tracking-[0.18em]",
              getSponsorText(ad.theme),
            ].join(" ")}
          >
            {ad.sponsor}
          </div>
        ) : null}

        {ad.image_url ? (
          <img
            src={ad.image_url}
            alt=""
            className="mb-4 mt-3 h-14 w-auto object-contain"
          />
        ) : null}

        <div className="mt-auto">
          <h3 className="text-2xl font-black leading-tight">
            {ad.title}
          </h3>

          <p
            className={[
              "mt-3 text-sm font-black leading-snug",
              getBodyText(ad.theme),
            ].join(" ")}
          >
            {ad.text}
          </p>

          {ad.cta ? (
            <div
              className={[
                "mt-5 inline-block border-2 px-3 py-2",
                "text-xs font-black uppercase tracking-[0.12em]",
                "transition-all duration-300",
                getButton(ad.theme),
              ].join(" ")}
            >
              {ad.cta}
            </div>
          ) : null}
        </div>

        {safeAds.length > 1 ? (
          <div className="mt-5 flex gap-1.5">
            {safeAds.map((item, dotIndex) => (
              <span
                key={item.id ?? dotIndex}
                className={[
                  "h-1.5 flex-1 rounded-full",
                  dotIndex === index
                    ? "bg-current opacity-70"
                    : "bg-current opacity-20",
                ].join(" ")}
              />
            ))}
          </div>
        ) : null}
      </div>
    </aside>
  );

  return (
    <div className={className}>
      {ad.href ? (
        <Link
          href={ad.href}
          target="_blank"
          rel="noopener noreferrer"
          className="block h-full no-underline"
        >
          {adContent}
        </Link>
      ) : (
        adContent
      )}
    </div>
  );
}