import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase-admin";

function formatArchiveDate(dateString: string) {
  const date = new Date(dateString);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}.${month}.${year}`;
}


export default async function NewsArchivePage() {
 const now = new Date().toISOString();

const { data: articles } = await supabaseAdmin
  .from("articles")
  .select("*")
  .or(
    `status.eq.published,and(status.eq.scheduled,published_at.lte.${now})`
  )
  .order("published_at", { ascending: false });

  return (
    <main className="mx-auto max-w-[1200px] px-4 py-8">
      <div className="mb-8 border-b-4 border-[rgb(var(--accent))] pb-4">
        <div className="text-sm font-black uppercase tracking-[0.2em] text-[rgb(var(--accent))]">
          TV19
        </div>

        <h1 className="mt-2 text-5xl font-black tracking-tight">
          Nyhetsarkiv
        </h1>

        <p className="mt-2 text-black/60">
          Tidligere publiserte saker fra TV19.
        </p>
      </div>

 <div className="space-y-6">
  {articles?.map((article) => (
    <article
      key={article.id}
      className="border-b border-black/10 pb-6"
    >
      <Link
        href={`/a/${article.slug}`}
        className="grid gap-4 sm:grid-cols-[180px_1fr]"
      >
        {article.image_url ? (
          <img
            src={article.image_url}
            alt={article.title}
            className="h-32 w-full object-cover"
          />
        ) : (
          <div className="h-32 bg-black/5" />
        )}

        <div>
          <h2 className="text-2xl font-black leading-tight hover:text-[rgb(var(--accent))]">
            {article.title}
          </h2>

          {article.excerpt ? (
            <p className="mt-2 text-black/70">
              {article.excerpt}
            </p>
          ) : null}

          <div className="mt-3 text-sm font-bold text-black/45">
        {article.category} · {formatArchiveDate(article.published_at)}
          </div>
        </div>
      </Link>
    </article>
 
        ))}
      </div>
    </main>
  );
}