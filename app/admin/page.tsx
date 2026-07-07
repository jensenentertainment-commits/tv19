// app/admin/page.tsx

import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase-admin";

export default async function AdminPage() {
  const { data: articles, error: articlesError } = await supabaseAdmin
    .from("articles")
    .select("*")
    .order("created_at", { ascending: false });

  const { data: ads, error: adsError } = await supabaseAdmin
    .from("ads")
    .select("*")
    .order("created_at", { ascending: false });

  if (articlesError) console.error(articlesError);
  if (adsError) console.error(adsError);

  const publishedCount =
    articles?.filter((article) => article.status === "published").length ?? 0;

  const draftCount =
    articles?.filter((article) => article.status === "draft").length ?? 0;

  const plusCount =
    articles?.filter((article) => article.plus_article).length ?? 0;

  const activeAdsCount =
    ads?.filter((ad) => ad.active).length ?? 0;

  const latestArticles = articles?.slice(0, 5) ?? [];
  const latestAds = ads?.slice(0, 4) ?? [];

  return (
    <main className="min-h-screen bg-[rgb(var(--paper))] px-4 py-8">
      <div className="mx-auto max-w-[1100px]">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <div className="text-sm font-black uppercase tracking-[0.18em] text-[rgb(var(--accent))]">
              TV19 Admin
            </div>

            <h1 className="text-5xl font-black tracking-tight">
              Dashboard
            </h1>
          </div>

          <div className="flex gap-3">
            <Link
              href="/admin/ny"
              className="bg-[rgb(var(--accent))] px-4 py-3 text-sm font-black text-white no-underline hover:bg-black"
            >
              Ny artikkel
            </Link>

            <Link
              href="/admin/annonser/ny"
              className="bg-[rgb(var(--brand))] px-4 py-3 text-sm font-black text-white no-underline hover:bg-black"
            >
              Ny annonse
            </Link>
          </div>
        </div>

        <section className="grid gap-3 md:grid-cols-4">
          <div className="bg-white p-5">
            <div className="text-sm font-black text-black/45">Publiserte</div>
            <div className="text-4xl font-black">{publishedCount}</div>
          </div>

          <div className="bg-white p-5">
            <div className="text-sm font-black text-black/45">Kladd</div>
            <div className="text-4xl font-black">{draftCount}</div>
          </div>

          <div className="bg-white p-5">
            <div className="text-sm font-black text-black/45">TV19+</div>
            <div className="text-4xl font-black">{plusCount}</div>
          </div>

          <div className="bg-white p-5">
            <div className="text-sm font-black text-black/45">
              Aktive annonser
            </div>
            <div className="text-4xl font-black">{activeAdsCount}</div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_340px]">
          <div className="bg-white p-5">
            <div className="mb-4 flex items-center justify-between border-b-4 border-black pb-3">
              <h2 className="text-2xl font-black">Siste artikler</h2>

              <Link
                href="/admin/artikler"
                className="text-sm font-black text-[rgb(var(--accent))]"
              >
                Se alle
              </Link>
            </div>

            <div className="space-y-4">
              {latestArticles.length ? (
                latestArticles.map((article) => (
                  <Link
                    key={article.id}
                    href={`/admin/rediger/${article.id}`}
                    className="block border-b border-black/10 pb-3 no-underline"
                  >
                    <div className="font-black leading-tight">
                      {article.title}
                    </div>

                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="bg-black px-2 py-1 text-xs font-black uppercase text-white">
                        {article.category || "TV19"}
                      </span>

                      <span
                        className={[
                          "px-2 py-1 text-xs font-black uppercase text-white",
                          article.status === "published"
                            ? "bg-green-700"
                            : "bg-orange-600",
                        ].join(" ")}
                      >
                        {article.status === "published"
                          ? "Publisert"
                          : "Kladd"}
                      </span>

                      {article.plus_article ? (
                        <span className="bg-[rgb(var(--brand))] px-2 py-1 text-xs font-black uppercase text-white">
                          TV19+
                        </span>
                      ) : null}
                    </div>
                  </Link>
                ))
              ) : (
                <div className="font-bold text-black/50">
                  Ingen artikler ennå.
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-[rgb(var(--brand))] p-5 text-white">
              <div className="text-xs font-black uppercase tracking-[0.2em] text-white/70">
                Redaksjonsstatus
              </div>

              <h2 className="mt-3 text-3xl font-black leading-tight">
                Arbeidet med arbeidet fortsetter.
              </h2>

              <p className="mt-3 font-bold text-white/75">
                TV19 følger utviklingen og vurderer nye vurderinger
                fortløpende.
              </p>
            </div>

            <div className="bg-white p-5">
              <div className="mb-4 flex items-center justify-between border-b-4 border-black pb-3">
                <h2 className="text-2xl font-black">Annonser</h2>

                <Link
                  href="/admin/annonser"
                  className="text-sm font-black text-[rgb(var(--accent))]"
                >
                  Se alle
                </Link>
              </div>

              <div className="space-y-3">
                {latestAds.length ? (
                  latestAds.map((ad) => (
                    <div
                      key={ad.id}
                      className="border-b border-black/10 pb-3"
                    >
                      <div className="font-black">{ad.title}</div>

                      <div className="mt-1 text-sm font-bold text-black/50">
                        {ad.theme || "blue"} •{" "}
                        {ad.active ? "Aktiv" : "Inaktiv"}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="font-bold text-black/50">
                    Ingen annonser ennå.
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}