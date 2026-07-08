// app/components/breaking-article-box.tsx
import Link from "next/link";

export default function BreakingArticleBox({ article }: { article: any }) {
  if (!article) return null;

  return (
    <Link href={`/a/${article.slug}`} className="group block no-underline">
      <section className="mb-4 border-y-4 border-black bg-[#C62828] p-5 text-white transition-colors group-hover:bg-[#a91f1f] md:p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-white" />

            <span className="text-xs font-black uppercase tracking-[0.25em] text-white">
              Akkurat nå
            </span>
          </div>

          <span className="hidden text-xs font-black uppercase tracking-[0.16em] text-white/60 sm:inline">
            TV19 LIVE
          </span>
        </div>

        <div className="mt-3 text-[10px] font-black uppercase tracking-[0.18em] text-white/65 md:text-xs">
          {article.kicker || article.category || "TV19"}
        </div>

        <div className="mt-2 text-3xl md:text-5xl font-black leading-[1.02] tracking-tight md:text-3xl">
          {article.title}
        </div>

     
        <div className="mt-3 text-xs font-black uppercase tracking-[0.18em] text-white/70 group-hover:text-white">
          Les saken →
        </div>
      </section>
    </Link>
  );
}