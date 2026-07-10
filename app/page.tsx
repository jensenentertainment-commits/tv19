// app/page.tsx
import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase-admin";
import TfbTicker from "@/app/components/tfb-ticker";
import TvWeather from "./components/tv-weather";
import BreakingArticleBox from "@/app/components/breaking-article-box";
import AdBox from "./components/ad-box";
import CultureCalendar from "./components/culture-calendar";
import Tv19Poll from "./components/tv19-poll";







function Thumb({ article }: { article: any }) {
  return (
    <div className="relative aspect-video overflow-hidden bg-slate-200 sm:h-[95px] sm:aspect-auto">
      {article.image_url ? (
        <img
          src={article.image_url}
          alt={article.title}
          className="h-full w-full object-cover"
        />
      ) : null}

      {article.plus_article ? (
        <div className="absolute left-1 top-1 bg-red-600 px-1.5 py-0.5 text-[10px] font-black text-white">
          +
        </div>
      ) : null}
    </div>
  );
}


function formatTfbDate(dateString: string) {
  const date = new Date(dateString);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");

  return `${day}.${month}. ${hour}:${minute}`;
}


 

export default async function Page() {
 const now = new Date().toISOString();

const { data: articles } = await supabaseAdmin
  .from("articles")
  .select("*")
  .or(
    `status.eq.published,and(status.eq.scheduled,published_at.lte.${now})`
  )
  .order("published_at", { ascending: false });

    const { data: ads } = await supabaseAdmin
  .from("ads")
  .select("*")
  .eq("active", true)
  .order("created_at", { ascending: false });

const published = articles ?? [];

const mainArticle =
  published.find((article) => article.featured) ?? published[0];

const otherArticles = published.filter(
  (article) => article.id !== mainArticle?.id
);

const breakingArticle = published.find(
  (article) => article.display_type === "breaking"
);

const rccArticles = published
  .filter((article) => {
    const tags = article.tags;

    if (Array.isArray(tags)) {
      return tags.some((tag) => tag.toLowerCase() === "rcc");
    }

    if (typeof tags === "string") {
      return tags.toLowerCase().includes("rcc");
    }

    return false;
  })
  .slice(0, 4);

const latestArticles = otherArticles.slice(0, 8);

const shuffled = [...otherArticles]
  .filter((article) => article.id !== breakingArticle?.id)
  .sort(() => Math.random() - 0.5);

const workingArticles = shuffled.slice(0, 3);



  const plusArticles = published.filter((a) => a.plus_article).slice(0, 3);
 

const { data: tfbUpdates } = await supabaseAdmin
  .from("tfb_updates")
  .select("id,title,text")
  .eq("active", true)
  .order("published_at", { ascending: false })
  .limit(5);

 

  
 const { data: nextRccMatch } = await supabaseAdmin
  .from("rcc_matches")
  .select(`
    *,
    home:rcc_teams!rcc_matches_home_team_id_fkey(
      name,
      crest_url,
      stadium
    ),
    away:rcc_teams!rcc_matches_away_team_id_fkey(
      name,
      crest_url
    )
  `)
  .eq("played", false)
  .order("match_date", { ascending: true })
  .limit(1)
  .single();

  return (
    <main className="min-h-screen bg-[#f3eeee]">
      
    

      <div className="mx-auto max-w-[1180px] px-4 py-4">
      
      <BreakingArticleBox article={breakingArticle} />

        {mainArticle ? (
          <section className="bg-white p-4">
            <h2 className="mb-6 border-b-4 border-black pb-2 text-sm font-black uppercase tracking-[0.18em] text-black/50">
              Hovedsak
            </h2>

            <Link href={`/a/${mainArticle.slug}`}>
              <div className="relative aspect-video bg-slate-200 md:h-[420px] md:aspect-auto">
                {mainArticle.image_url ? (
                  <img
                    src={mainArticle.image_url}
                    alt={mainArticle.title}
                    className="h-full w-full object-cover object-center"
                  />
                ) : null}
              </div>

              <div className="mt-3 text-sm font-black text-[rgb(var(--accent))]">
                {mainArticle.kicker || mainArticle.category || "TV 19"}
              </div>

              <h1 className="mt-1 text-2xl sm:text-3xl md:text-5xl font-black leading-[0.92] tracking-tight">
                {mainArticle.title}
              </h1>

              {mainArticle.excerpt ? (
                <p className="mt-3 text-lg font-bold text-black/65">
                  {mainArticle.excerpt}
                </p>
              ) : null}
            </Link>
          </section>
        ) : null}

        <section className="mt-10">
  <div className="mb-4 flex items-end justify-between border-b-4 border-black pb-2">
    <h2 className="text-3xl font-black tracking-tight md:text-4xl">
      Siste <span className="text-[rgb(var(--brand))]">nytt</span>
    </h2>

    <Link
      href="/nyhetsarkiv"
      className="text-sm font-black text-[rgb(var(--accent))] no-underline hover:underline"
    >
      Nyhetsarkiv →
    </Link>
  </div>

<div className="grid gap-4 md:grid-cols-2">
  {latestArticles.map((article) => {
    if (article.display_type === "text") {
      return (
        <Link
          key={article.id}
          href={`/a/${article.slug}`}
          className="group block border-b border-black/10 bg-[#183A66] p-5 text-white no-underline"
        >
          <div className="mb-2 text-xs font-black uppercase tracking-[0.12em] text-red-300">
            {article.kicker || article.category || "TV19"}
          </div>

          <h3 className="text-2xl font-black leading-tight">
            {article.title}
          </h3>

          <div className="mt-4 text-sm font-black text-white/70 group-hover:text-white">
            Les saken →
          </div>
        </Link>
      );
    }

    if (article.display_type === "breaking") {
      return (
        <Link
          key={article.id}
          href={`/a/${article.slug}`}
          className="group block border-b border-black/10 bg-[#C62828] p-5 text-white no-underline"
        >
          <div className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-white/75">
            Akkurat nå
          </div>

          <h3 className="text-2xl font-black leading-tight">
            {article.title}
          </h3>

          <div className="mt-4 text-sm font-black text-white/75 group-hover:text-white">
            Følg saken →
          </div>
        </Link>
      );
    }

    return (
      <Link
        key={article.id}
        href={`/a/${article.slug}`}
        className="group grid gap-3 border-b border-black/10 pb-4 no-underline sm:grid-cols-[120px_1fr]"
      >
        {article.image_url ? (
          <img
            src={article.image_url}
            alt={article.title}
            className="aspect-video w-full object-cover object-center sm:h-24 sm:aspect-auto"
          />
        ) : (
          <div className="aspect-video bg-black/5 sm:h-24 sm:aspect-auto" />
        )}

        <div>
          <div className="mb-1 text-xs font-black uppercase tracking-[0.12em] text-[rgb(var(--accent))]">
            {article.kicker || article.category || "TV19"}
          </div>

          <h3 className="text-lg font-black leading-tight group-hover:text-[rgb(var(--brand))]">
            {article.title}
          </h3>
        </div>
      </Link>
    );
  })}
</div>
</section>

<section className="mt-10 bg-[#102848] text-white">
  <div className="grid gap-6 p-6 md:grid-cols-[180px_1fr_auto]">
    <div className="flex items-center justify-center md:justify-start">
      <img
        src="/rcc/logo-gold.png"
        alt="Royal County Championship"
        className="h-24 w-auto"
      />
    </div>

    <div className="flex flex-col justify-center">
      <div className="text-xs font-black uppercase tracking-[0.25em] text-yellow-400">
        TV19 Sport
      </div>

      <h2 className="mt-1 text-3xl font-black tracking-tight">
        Royal County Championship
      </h2>

      <p className="mt-2 max-w-[560px] text-sm font-bold text-white/60">
        Seriestarten nærmer seg. Første runde spilles 21. august, og TV19
        Sport følger sesongen med tabell, kampreferater, statistikk og
        nødvendig bekymring.
      </p>

      {nextRccMatch ? (
        <div className="mt-4 text-sm font-black text-white/70">
          Neste kamp: {nextRccMatch.home?.name} – {nextRccMatch.away?.name} ·{" "}
          {formatTfbDate(nextRccMatch.match_date)}
        </div>
      ) : null}
    </div>

    <div className="flex flex-wrap items-center gap-3 md:flex-col md:items-stretch md:justify-center">
      <Link
        href="/rcc"
        className="bg-yellow-500 px-4 py-3 text-sm font-black uppercase tracking-[0.12em] text-black no-underline hover:bg-yellow-400"
      >
        RCC Portal
      </Link>

      <Link
        href="/rcc/tabell"
        className="border border-white/20 px-4 py-3 text-sm font-black uppercase tracking-[0.12em] text-white no-underline hover:bg-white/10"
      >
        Tabell
      </Link>

      <Link
        href="/rcc/kamper"
        className="border border-white/20 px-4 py-3 text-sm font-black uppercase tracking-[0.12em] text-white no-underline hover:bg-white/10"
      >
        Kamper
      </Link>
    </div>
  </div>
</section>

<aside className="mt-10 border-t-4 border-[#C62828] bg-white p-8">
  <div className="grid gap-6 md:grid-cols-[1fr_auto]">
    <div>
      <div className="text-xs font-black uppercase tracking-[0.28em] text-[#C62828]">
        Tips redaksjonen
      </div>

      <h2 className="text-[2.2rem] font-black tracking-tight">
        Har du observert en utvikling?
      </h2>

      <p className="mt-3 max-w-[720px] text-base font-bold leading-relaxed text-black/65">
        TV19 mottar tips om situasjoner, saker og hendelser som kan være i ferd
        med å utvikle seg.
      </p>

      <div className="mt-4 text-sm font-black text-black/50">
        Tips kan sendes med eller uten navn.
      </div>
    </div>

  <div>
  <Link
    href="/tips"
    className="block w-full bg-[#183A66] px-6 py-4 text-center text-sm font-black uppercase tracking-[0.14em] text-white no-underline hover:bg-[#C62828] md:inline-block md:w-auto"
  >
    Send tips →
  </Link>
</div>
  </div>
</aside>




        <div className="mt-10 flex flex-col gap-8 lg:flex-row">
  <div className="min-w-0 flex-1 space-y-8">
            <section className="bg-white p-4">
    <h2 className="text-3xl font-black md:text-4xl">
      Det jobbes med{" "}
      <span className="text-[rgb(var(--brand))]">saken</span>
    </h2>

    <div className="mt-4">
      {workingArticles.map((article) => (
        <Link
          key={article.id}
          href={`/a/${article.slug}`}
          className="grid grid-cols-1 gap-4 border-b border-black/20 py-4 hover:bg-black/5 sm:grid-cols-[135px_1fr]"
        >
          <Thumb article={article} />

          <div>
            <div className="text-xs font-black uppercase text-[rgb(var(--accent))]">
              {article.kicker || article.category || "TV19"}
            </div>

            <h3 className="mt-1 text-xl font-black leading-tight">
              {article.title}
            </h3>
          </div>
        </Link>
      ))}
    </div>
  </section>

  {/* Prognoser, undersøkelse, vær og annonse */}
<div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
  <div className="min-w-0 space-y-8">
    <section className="bg-white p-4">
      <div className="flex items-end justify-between gap-4">
        <h2 className="text-3xl font-black md:text-4xl">
          Prognose
          <span className="text-[rgb(var(--brand))]">sentralen</span>
        </h2>

        <Link
          href="/prognosesentralen"
          className="text-sm font-black uppercase tracking-[0.14em] text-[rgb(var(--brand))]"
        >
          Se alle →
        </Link>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {[
          { value: "91%", text: "Flere vil reagere." },
          { value: "84%", text: "Ny vurdering ventes." },
          { value: "76%", text: "Situasjonen utvikler seg." },
          {
            value: "63%",
            text: "Oppdateringer omtales som nært forestående.",
          },
        ].map((item) => (
          <Link
            key={item.text}
            href="/prognosesentralen"
            className="group block border border-black/10 bg-[#f7f4f4] p-4 transition-all duration-200 hover:-translate-y-1 hover:border-[rgb(var(--brand))] hover:shadow-lg"
          >
            <div className="text-[10px] font-black uppercase tracking-[0.18em] text-[#C62828]">
              Prognose
            </div>

            <div className="mt-2 text-4xl font-black text-[rgb(var(--brand))] transition-colors group-hover:text-[#C62828]">
              {item.value}
            </div>

            <div className="mt-2 text-lg font-black leading-tight">
              {item.text}
            </div>

            <div className="mt-3 text-xs font-black uppercase tracking-[0.16em] text-black/35 transition-colors group-hover:text-[rgb(var(--brand))]">
              Se prognose →
            </div>
          </Link>
        ))}
      </div>
    </section>

    <AdBox ads={ads ?? []} className="h-[245px]" />
  </div>

  <aside className="flex flex-col gap-8">
    <TvWeather />

    <Tv19Poll />
  </aside>
</div>

  {/* Kulturkalenderen i full bredde */}
  <div className="pt-4">
    <CultureCalendar />
  </div>
</div>
      </div>
        </div>
    </main>
  );
}