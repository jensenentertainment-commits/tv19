import Link from "next/link";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-admin";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

const CATEGORY_MAP: Record<string, string> = {
  norge: "Norge",
  verden: "Verden",
  okonomi: "Økonomi",
  sport: "Sport",
  kultur: "Kultur",
  teknologi: "Teknologi",
  vitenskap: "Vitenskap",
  samfunn: "Samfunn",
  bekymret: "Bekymret",
};

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;

  const category = CATEGORY_MAP[slug];

  if (!category) {
    notFound();
  }

 const now = new Date().toISOString();

const { data: articles } = await supabaseAdmin
  .from("articles")
  .select("*")
  .eq("category", category)
  .or(
    `status.eq.published,and(status.eq.scheduled,published_at.lte.${now})`
  )
  .order("published_at", { ascending: false });

  return (
    <main className="min-h-screen bg-[#f3eeee] px-4 py-8">
      <div className="mx-auto max-w-[1180px]">
        <div className="mb-10 border-b-4 border-black pb-4">
          <div className="text-sm font-black uppercase tracking-[0.18em] text-[rgb(var(--accent))]">
            Kategori
          </div>

          <h1 className="mt-2 text-5xl font-black tracking-tight">
            {category}
          </h1>

          <p className="mt-2 text-lg font-bold text-black/55">
            Situasjoner innen kategorien {category.toLowerCase()} følges
            fortløpende.
          </p>
        </div>

        {!articles?.length ? (
          <div className="bg-white p-8 text-center">
            <h2 className="text-2xl font-black">
              Ingen artikler funnet
            </h2>

            <p className="mt-2 text-black/60">
              Situasjonen er foreløpig uavklart.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {articles.map((article) => (
              <Link
                key={article.id}
                href={`/a/${article.slug}`}
                className="group block overflow-hidden bg-white no-underline transition-transform hover:-translate-y-1"
              >
                {article.image_url ? (
                  <img
                    src={article.image_url}
                    alt={article.title}
                    className="h-56 w-full object-cover"
                  />
                ) : (
                  <div className="h-56 bg-slate-200" />
                )}

                <div className="p-4">
                  <div className="mb-2 text-xs font-black uppercase tracking-[0.12em] text-[rgb(var(--accent))]">
                    {article.category}
                  </div>

                  <h2 className="text-xl font-black leading-tight group-hover:text-[rgb(var(--brand))]">
                    {article.title}
                  </h2>

                  {article.excerpt ? (
                    <p className="mt-3 text-sm font-bold text-black/60">
                      {article.excerpt}
                    </p>
                  ) : null}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}