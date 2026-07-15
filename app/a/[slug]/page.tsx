// app/a/[slug]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { renderArticleBody } from "@/lib/render-article";
import ShareButton from "@/app/components/share-button";
import type { Metadata } from "next";

function getCategorySlug(category: string) {
  const map: Record<string, string> = {
    Norge: "norge",
    Verden: "verden",
    Økonomi: "okonomi",
    Sport: "sport",
    Kultur: "kultur",
    Teknologi: "teknologi",
    Samfunn: "samfunn",
    Bekymret: "bekymret",
  };

  return map[category] ?? "norge";
}



type Props = {
  params: Promise<{ slug: string }>;
};

const SITE_URL = "https://tv19.no";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const { data: article } = await supabaseAdmin
    .from("articles")
    .select("title, excerpt, image_url, slug")
    .eq("slug", slug)
    .single();

  if (!article) {
    return {
      title: "TV19",
      description: "Sist med det første.",
    };
  }

  const title = `${article.title} – TV19`;
  const description = article.excerpt || "TV19 følger utviklingen.";
const url = `${SITE_URL}/a/${article.slug}`;
  const image = article.image_url || `${SITE_URL}/og-default.png`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: "TV19",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
      locale: "no_NO",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;

  const { data: article, error } = await supabaseAdmin
    .from("articles")
    .select("*")
    .eq("slug", slug)
    
    .single();

  if (error || !article) {
    notFound();
  }

  const now = new Date().toISOString();

const isPublished = article.status === "published";

const isScheduledAndReady =
  article.status === "scheduled" &&
  article.published_at &&
  article.published_at <= now;

if (!isPublished && !isScheduledAndReady) {
  notFound();
}

  const { data: relatedArticles } = await supabaseAdmin
  .from("articles")
  .select("id,title,slug,image_url")
  .eq("category", article.category)
  .neq("id", article.id)
  .eq("status", "published")
  .limit(3);
  

  return (
    <main className="min-h-screen bg-[rgb(var(--paper))] px-4 py-6 md:py-10">
      <article className="mx-auto max-w-[860px] bg-white px-5 py-6 md:p-8">
        <div className="mb-4 text-xs font-black uppercase tracking-[0.2em] text-[rgb(var(--accent))]">
  <Link
    href={`/kategori/${getCategorySlug(article.category || "TV19")}`}
    className="no-underline hover:underline"
  >
    {article.category || "TV19"}
  </Link>
</div>

        {article.kicker ? (
          <div className="mb-2 text-base font-black text-[rgb(var(--accent))] md:text-lg">
            {article.kicker}
          </div>
        ) : null}

        {article.plus_article ? (
          <Link
            href="/pluss"
            className="mb-4 inline-block bg-[rgb(var(--brand))] px-3 py-1 text-sm font-black text-white no-underline"
          >
            TV19+
          </Link>
        ) : null}

       <h1 className="text-3xl font-black leading-[1.02] tracking-tight md:text-6xl">
          {article.title}
        </h1>

        

        {article.excerpt ? (
          <p className="mt-5 text-lg font-bold leading-snug text-black/70 md:text-2xl">
            {article.excerpt}
          </p>
        ) : null}

      

      {article.image_url ? (
  <img
    src={article.image_url}
    alt={article.title}
    className="my-6 aspect-video w-full object-cover object-center md:max-h-[520px]"
  />
) : null}

        {article.image_caption ? (
  <p className="mt-2 text-sm font-bold leading-relaxed text-black/45">
    {article.image_caption}
  </p>
) : null}

  

     <div className="my-6 border-y border-black/10 py-5">
  <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

    <div className="flex items-center gap-4">

      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[rgb(var(--brand))] hover:bg-[rgb(var(--accent))] text-sm font-black text-white">
        TV19
      </div>

      <div>
        <div className="font-black">
          {article.author || "TV19s redaksjon"}
        </div>

        <div className="mt-1 text-xs font-black uppercase tracking-[0.16em] text-[#C62828]">
          {article.location}
        </div>

        <div className="mt-1 text-sm text-black/50">
          Publisert TV19 følger saken • Oppdatert ved behov
        </div>
      </div>

    </div>

    <ShareButton title={article.title} />

  </div>
</div>

        {article.plus_article ? (
          <section className="mt-8 border-t-4 border-black pt-6">
            <div className="mb-3 inline-block bg-[rgb(var(--brand))] px-3 py-1 text-sm font-black text-white">
              TV19+
            </div>

            <h2 className="text-3xl font-black leading-tight md:text-4xl">
              Resten av saken krever abonnement.
            </h2>

            <p className="mt-3 text-lg font-bold text-black/60">
              Tilgangen din er nesten aktiv. Betalingen må bare vurderes først.
            </p>

            <Link
              href="/pluss"
              className="mt-5 inline-block bg-[rgb(var(--accent))] px-5 py-3 text-sm font-black uppercase tracking-[0.14em] text-white no-underline hover:bg-black"
            >
              Kjøp tilgang
            </Link>
          </section>
     
) : article.body ? (
  <div className="article-body">
    {renderArticleBody(article.body, {
      image2: article.image_url_2,
      image3: article.image_url_3,
      imageCaption2: article.image_caption_2,
      imageCaption3: article.image_caption_3,
    })}
  </div>
) : null}

{article.tags?.length ? (
  <div className="mt-8 flex flex-wrap gap-2 border-t border-black/10 pt-4">
    {article.tags.map((tag: string) => (
      <span
        key={tag}
        className="bg-black/5 px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-black/55"
      >
        #{tag}
      </span>
    ))}
  </div>
) : null}


<div className="mt-16 border-t-4 border-[rgb(var(--brand))] pt-6">
  <div className="text-xs font-black uppercase tracking-[0.2em] text-[rgb(var(--brand))]">
    Situasjonen følges fortsatt
  </div>

  <p className="mt-3 text-lg font-bold text-black/70">
    TV19 vil fortsette å følge utviklingen,
    vurderingene og eventuelle nye vurderinger.
  </p>
</div>


      </article>

      {relatedArticles?.length ? (
  <section className="mx-auto mt-16 max-w-[820px]">
    <div className="border-t-4 border-black pt-8">
      <h2 className="mb-6 text-3xl font-black">
       Andre situasjoner som følges tett
      </h2>

      <div className="grid gap-6 md:grid-cols-3">
        {relatedArticles.map((related) => (
          <Link
            key={related.id}
            href={`/a/${related.slug}`}
            className="group block bg-white p-3"
          >
            {related.image_url ? (
              <img
                src={related.image_url}
                alt={related.title}
               className="mb-3 aspect-video w-full object-cover object-center md:h-40 md:aspect-auto"
              />
            ) : null}

            <h3 className="text-lg font-black leading-tight group-hover:text-[rgb(var(--brand))]">
              {related.title}
            </h3>
          </Link>
        ))}
      </div>
    </div>
  </section>
) : null}
    </main>
  );
}