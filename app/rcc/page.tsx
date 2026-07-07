import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase-admin";

function formatMatchDate(dateString: string) {
  const date = new Date(dateString);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");

  return `${day}.${month}. ${hour}:${minute}`;
}

export default async function RccPage() {
  const { data: season } = await supabaseAdmin
    .from("rcc_seasons")
    .select("*")
    .eq("active", true)
    .single();

const { data: teams } = await supabaseAdmin
  .from("rcc_teams")
  .select("*")
  .eq("league_level", "RCC")
  .order("name", { ascending: true });

  const { data: matches } = await supabaseAdmin
  .from("rcc_matches")
  .select(`
    *,
    home:rcc_teams!rcc_matches_home_team_id_fkey(name, crest_url),
    away:rcc_teams!rcc_matches_away_team_id_fkey(name, crest_url)
  `)
  .eq("season", season?.name || "2026/27")
  .order("match_date", { ascending: true });

  const { data: topScorers } = await supabaseAdmin
  .from("rcc_match_events")
  .select(`
    player:rcc_players(
      name,
      position,
      team:rcc_teams(name, short_name, crest_url)
    )
  `)
  .eq("event_type", "goal");

 

  const { data: statsMatches } = await supabaseAdmin
  .from("rcc_matches")
  .select("home_goals, away_goals, attendance")
  .eq("played", true);

const upcomingMatches = matches?.filter((match) => !match.played) ?? [];

const recentResults = [...(matches ?? [])]
  .filter((match) => match.played)
  .sort(
    (a, b) =>
      new Date(b.match_date).getTime() -
      new Date(a.match_date).getTime()
  )
  .slice(0, 5);

  const now = new Date().toISOString();

const { data: articles, error: articlesError } = await supabaseAdmin
  .from("articles")
  .select("*")
  .or(`status.eq.published,and(status.eq.scheduled,published_at.lte.${now})`)
  .order("published_at", { ascending: false });

if (articlesError) {
  console.error(articlesError);
}

const rccArticles = (articles ?? [])
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
  .slice(0, 6);

const mainMatch = upcomingMatches[0];

const rows =
  teams
    ?.map((team) => {
      let played = 0;
      let won = 0;
      let drawn = 0;
      let lost = 0;
      let goalsFor = 0;
      let goalsAgainst = 0;

      (matches ?? [])
        .filter((match) => match.played)
        .forEach((match) => {
          const isHome = match.home_team_id === team.id;
          const isAway = match.away_team_id === team.id;

          if (!isHome && !isAway) return;

          const gf = isHome ? match.home_goals ?? 0 : match.away_goals ?? 0;
          const ga = isHome ? match.away_goals ?? 0 : match.home_goals ?? 0;

          played++;
          goalsFor += gf;
          goalsAgainst += ga;

          if (gf > ga) won++;
          else if (gf === ga) drawn++;
          else lost++;
        });

      return {
        ...team,
        played,
        won,
        drawn,
        lost,
        goalsFor,
        goalsAgainst,
        goalDiff: goalsFor - goalsAgainst,
        points: won * 3 + drawn,
      };
    })
    .sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.goalDiff !== a.goalDiff) return b.goalDiff - a.goalDiff;
      if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
      return a.name.localeCompare(b.name);
    }) ?? [];

const tablePreview = [
  ...rows.slice(0, 5),
  ...rows.slice(-5),
];


const scorerMap = new Map<
  string,
  {
    name: string;
    position: string;
    teamName: string;
    teamShortName: string;
    crestUrl: string | null;
    goals: number;
  }
>();

for (const event of topScorers ?? []) {
  const player = event.player as any;
  if (!player) continue;

  const key = `${player.name}-${player.team?.short_name}`;

  const existing = scorerMap.get(key);

  if (existing) {
    existing.goals += 1;
  } else {
    scorerMap.set(key, {
      name: player.name,
      position: player.position,
      teamName: player.team?.name ?? "",
      teamShortName: player.team?.short_name ?? "",
      crestUrl: player.team?.crest_url ?? null,
      goals: 1,
    });
  }
}

const matchesPlayed = statsMatches?.length ?? 0;

const totalGoals =
  statsMatches?.reduce(
    (sum, match) =>
      sum +
      (match.home_goals ?? 0) +
      (match.away_goals ?? 0),
    0
  ) ?? 0;

const totalAttendance =
  statsMatches?.reduce(
    (sum, match) => sum + (match.attendance ?? 0),
    0
  ) ?? 0;

const averageAttendance =
  matchesPlayed > 0
    ? Math.round(totalAttendance / matchesPlayed)
    : 0;

    const highestAttendance =
  Math.max(
    ...(statsMatches?.map((m) => m.attendance ?? 0) ?? [0])
  );

const highestScoringMatch =
  Math.max(
    ...(statsMatches?.map(
      (m) => (m.home_goals ?? 0) + (m.away_goals ?? 0)
    ) ?? [0])
  );

const kebabsSold = Math.round(totalAttendance * 0.18);
const beerLiters = Math.round(totalAttendance * 0.65);
const forgottenUmbrellas = Math.round(matchesPlayed * 7 + totalAttendance * 0.006);
const unusedSeasonTickets = Math.round(totalAttendance * 0.028);

const topScorerList = Array.from(scorerMap.values())
  .sort((a, b) => b.goals - a.goals)
  .slice(0, 5);

  const recentMatches =
  matches
    ?.filter((match) => match.played)
    .slice()
    .reverse()
    .slice(0, 5) ?? [];
  
  return (
    <main className="min-h-screen bg-[rgb(var(--paper))] px-4 py-8">
      <div className="mx-auto max-w-[1180px]">
        <section className="bg-white p-6 md:p-8">
          <div className="grid gap-8 lg:grid-cols-[220px_1fr] lg:items-center">
           
              <div className="text-center">
                
               <div className="flex items-center justify-center">
  <img
    src="/rcc/logo.png"
    alt="Royal County Championship"
    className="h-[220px] w-auto object-contain"
  />
</div>
              </div>
            

            <div>
              <div className="text-sm font-black uppercase tracking-[0.2em] text-[rgb(var(--accent))]">
                TV19 Sport
              </div>

              <h1 className="mt-2 max-w-[760px] text-5xl font-black leading-[0.95] tracking-tight md:text-7xl">
                Royal County Championship
              </h1>

              <p className="mt-4 max-w-[760px] text-xl font-bold text-black/65">
                Sesong {season?.name || "2026/27"} følges fortløpende. Tabellen,
                terminlisten og vurderingene oppdateres etter hvert som
                utviklingen utvikler seg.
              </p>

<div className="mt-6 flex flex-wrap gap-3">
  <Link
    href="/rcc/tabell"
    className="border-2 border-[#102848] bg-[#102848] px-6 py-3 text-sm font-black uppercase tracking-[0.15em] text-white no-underline transition hover:bg-[#183b69]"
  >
    Tabell
  </Link>

  <Link
    href="/rcc/kamper"
    className="border-2 border-[#E7B21D] bg-[#E7B21D] px-6 py-3 text-sm font-black uppercase tracking-[0.15em] text-[#102848] no-underline transition hover:bg-[#f1c94b]"
  >
    Kamper
  </Link>

  <Link
    href="/rcc#clubs"
    className="border-2 border-[#102848] px-6 py-3 text-sm font-black uppercase tracking-[0.15em] text-[#102848] no-underline transition hover:bg-[#102848] hover:text-white"
  >
    Klubber
  </Link>


</div>
            </div>
          </div>
        </section>
        

   <section className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
  <div className="space-y-6">
    <Link
  href={mainMatch ? `/rcc/kamper/${mainMatch.id}` : "/rcc/kamper"}
  className="block bg-[#102848] p-6 text-white no-underline transition hover:bg-[#14365f]"
>
  <div className="mb-5 border-b-4 border-[#E7B21D] pb-2">
    <div className="text-sm font-black uppercase tracking-[0.2em] text-[#E7B21D]">
      Neste hovedkamp
    </div>
  </div>

  {mainMatch ? (
    <>
      <div className="text-sm font-black text-white/55">
        Runde {mainMatch.round} · {formatMatchDate(mainMatch.match_date)}
      </div>

      <div className="mt-6 grid items-center gap-6 md:grid-cols-[1fr_auto_1fr]">
        <div className="flex flex-col items-center text-center">
          {mainMatch.home?.crest_url ? (
            <img
              src={mainMatch.home.crest_url}
              alt=""
              className="h-24 w-24 object-contain"
            />
          ) : null}

          <div className="mt-4 text-4xl font-black leading-tight">
            {mainMatch.home?.name}
          </div>
        </div>

        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#E7B21D]/50 bg-white/5 text-xs font-black uppercase tracking-[0.2em] text-[#E7B21D]">
          VS
        </div>

        <div className="flex flex-col items-center text-center">
          {mainMatch.away?.crest_url ? (
            <img
              src={mainMatch.away.crest_url}
              alt=""
              className="h-24 w-24 object-contain"
            />
          ) : null}

          <div className="mt-4 text-4xl font-black leading-tight">
            {mainMatch.away?.name}
          </div>
        </div>
      </div>

      <p className="mt-6 text-center text-lg font-bold text-white/65">
        Kampen omtales allerede som en kamp som skal spilles.
      </p>
    </>
  ) : (
    <p className="text-lg font-bold text-white/65">
      Terminlisten vurderes fortsatt.
    </p>
  )}
</Link>

<section className="mt-8 bg-white p-5">
  <div className="border-b-4 border-[#102848] pb-2">
    <div className="text-xs font-black uppercase tracking-[0.22em] text-[#C62828]">
      TV19 Sport
    </div>

    <h2 className="mt-1 text-3xl font-black">Siste fra RCC</h2>
  </div>

  {rccArticles.length > 0 ? (
    <div className="mt-4 grid gap-4 md:grid-cols-2">
      {rccArticles.map((article) => (
        <Link
          key={article.id}
          href={`/a/${article.slug}`}
          className="block border border-black/10 p-4 no-underline transition hover:bg-[#f3eeee]"
        >
          <div className="text-[10px] font-black uppercase tracking-[0.18em] text-[#C62828]">
            RCC
          </div>

          <h3 className="mt-1 text-xl font-black leading-tight group-hover:text-[#C62828]">
            {article.title}
          </h3>

          {(article.excerpt || article.ingress) ? (
            <p className="mt-2 line-clamp-2 text-sm font-bold leading-relaxed text-black/55">
              {article.excerpt || article.ingress}
            </p>
          ) : null}
        </Link>
      ))}
    </div>
  ) : (
    <div className="mt-5 bg-[#f3eeee] p-5">
      <div className="text-sm font-black uppercase tracking-[0.18em] text-black/40">
        RCC-redaksjonen forbereder seg
      </div>

      <div className="mt-2 text-xl font-black">
        Flere saker ventes før seriestart
      </div>
    </div>
  )}
</section>


<div className="bg-white p-6">
  <div className="mb-4 border-b-4 border-black pb-2">
    <div className="text-sm font-black uppercase tracking-[0.2em] text-[rgb(var(--brand))]">
      Siste resultater
    </div>
  </div>

  <div className="space-y-3">
    {recentResults.length ? (
      recentResults.map((match) => (
        <Link
          key={match.id}
          href="/rcc/kamper"
          className="grid grid-cols-[1fr_70px_1fr] items-center gap-3 border-b border-black/10 pb-3 no-underline"
        >
          <div className="font-black">{match.home?.name}</div>

          <div className="text-center text-lg font-black text-[#102848]">
            {match.home_goals}–{match.away_goals}
          </div>

          <div className="text-right font-black">{match.away?.name}</div>
        </Link>
      ))
    ) : (
      <p className="text-sm font-bold text-black/45">
        Ingen resultater registrert ennå.
      </p>
    )}
  </div>
</div>

    <div className="bg-white p-6">
      <div className="mb-4 border-b-4 border-black pb-2">
        <div className="text-sm font-black uppercase tracking-[0.2em] text-[rgb(var(--brand))]">
          Kommende kamper
        </div>
      </div>

      <div className="space-y-3">
        {upcomingMatches.slice(0, 5).map((match) => (
          <Link
            key={match.id}
            href="/rcc/kamper"
            className="block border-b border-black/10 pb-3 no-underline"
          >
            <div className="text-xs font-black text-black/40">
              {formatMatchDate(match.match_date)}
            </div>

            <div className="mt-1 font-black leading-tight">
              {match.home?.name} – {match.away?.name}
            </div>
          </Link>
        ))}
        
      </div>
    </div>
  
  </div>


  

  <div className="bg-white p-6">
    <div className="mb-4 flex items-center justify-between border-b-4 border-black pb-2">
      <div className="text-sm font-black uppercase tracking-[0.2em] text-[rgb(var(--brand))]">
        Tabell
      </div>

      <Link
        href="/rcc/tabell"
        className="text-xs font-black text-[rgb(var(--accent))]"
      >
        Full tabell →
      </Link>
    </div>

    <div className="space-y-2">
     {tablePreview.map((team, index) => {
  const actualPosition =
    index < 5 ? index + 1 : teams!.length - 5 + index + 1;

  return (
    <div key={team.id}>
      {index === 5 ? (
        <div className="py-1 text-center text-sm font-black text-black/25">
          ............
        </div>
      ) : null}

      <div className="grid grid-cols-[28px_1fr_40px] items-center gap-2 border-b border-black/10 pb-2 text-sm">
        <div className="font-black text-black/40">{actualPosition}</div>
        <div className="font-black">{team.name}</div>
        <div className="text-right font-black">{team.points}</div>
      </div>
    </div>
  );
})}

<section className="bg-white p-5">
<div className="flex items-end justify-between border-b-4 border-black pb-2">
  <div>
    <div className="text-xs font-black uppercase tracking-[0.22em] text-[#C62828]">
      RCC-statistikk
    </div>

    <h2 className="mt-1 text-2xl font-black">
      Toppscorere
    </h2>
  </div>

  <Link
    href="/rcc/statistikk"
    className="text-xs font-black uppercase tracking-[0.18em] text-[#C62828] no-underline transition hover:text-[#102848]"
  >
    Se full statistikk →
  </Link>
</div>

  {topScorerList.length ? (
    <div className="mt-4 divide-y divide-black/10">
      {topScorerList.map((player, index) => (
        <div
          key={`${player.name}-${player.teamShortName}`}
          className="flex items-center gap-3 py-3"
        >
          <div className="w-6 text-lg font-black text-black/35">
            {index + 1}
          </div>

          {player.crestUrl ? (
            <img
              src={player.crestUrl}
              alt=""
              className="h-8 w-8 object-contain"
            />
          ) : null}

          <div className="min-w-0 flex-1">
            <div className="truncate font-black">{player.name}</div>
            <div className="text-xs font-black uppercase tracking-[0.16em] text-black/40">
              {player.teamName} 
            </div>
          </div>

          <div className="text-2xl font-black text-[#102848]">
            {player.goals}
          </div>
        </div>
      ))}
    </div>
  ) : (
    <p className="mt-4 font-bold text-black/55">
      Ingen mål er registrert ennå.
    </p>
  )}
</section>




    </div>
  </div>
</section>






<section className="mt-12 bg-[#102848] p-8 text-white">
  <div className="border-b border-white/10 pb-4">
    <div className="text-xs font-black uppercase tracking-[0.25em] text-[#E7B21D]">
      Official Partners
    </div>

    <h2 className="mt-2 text-3xl font-black">
      Royal County Championship Partners
    </h2>

    <p className="mt-2 max-w-[700px] text-sm font-bold text-white/55">
      The Royal County Championship is proudly supported by a select group of commercial partners.
    </p>
  </div>

  <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
    {[
      {
        name: "Solaris",
        role: "Official Technical & Match Ball Partner",
        logo: "/rcc/partners/solaris.png",
        alt: "Solaris",
      },
      {
        name: "Blackwood Breweries",
        role: "Official Beer Supplier",
        logo: "/rcc/partners/blackwood.png",
        alt: "Blackwood Breweries",
      },
      {
        name: "Mr. Mickey Online Casino",
        role: "Official Betting Partner",
        logo: "/rcc/partners/mr-micky.png",
        alt: "Mr. Mickey Online Casino",
      },
      {
        name: "Los Kebabos",
        role: "Official Hospitality Partner",
        subtitle: "The Spanish Kebab Experience",
        logo: "/rcc/partners/los-kebabos.png",
        alt: "Los Kebabos",
      },
    ].map((partner) => (
      <div
        key={partner.name}
        className="group flex min-h-[250px] flex-col overflow-hidden rounded-sm bg-white text-black transition hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.25)]"
      >
        <div className="h-1 bg-[#E7B21D]" />

        <div className="flex h-32 items-center justify-center px-6 pt-5">
          <img
            src={partner.logo}
            alt={partner.alt}
            className="max-h-20 max-w-[180px] object-contain"
          />
        </div>

        <div className="mt-auto px-5 pb-5">
          <div className="text-lg font-black leading-tight text-[#102848]">
            {partner.name}
          </div>

          <div className="mt-2 text-sm font-bold text-black/60">
            {partner.role}
          </div>

          {partner.subtitle ? (
            <div className="mt-1 text-xs text-black/40">
              {partner.subtitle}
            </div>
          ) : null}
        </div>
      </div>
    ))}
  </div>
</section>

       <section id="clubs" className="mt-8 bg-white p-6">
  <div className="mb-5 flex items-end justify-between border-b-4 border-black pb-2">
    <h2 className="text-4xl font-black tracking-tight">Klubber</h2>

    <div className="text-sm font-black text-black/40">
      Sesong {season?.name || "2026/27"}
    </div>
  </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {teams?.map((team) => (
              <div
  key={team.id}
  className="group overflow-hidden border border-black/10 bg-white transition hover:-translate-y-1 hover:border-[#102848]/40 hover:shadow-[0_18px_40px_rgba(16,40,72,0.12)]"
>
<div className="h-36 overflow-hidden bg-[#102848]">
  {team.crest_url ? (
    <img
      src={team.crest_url}
      alt={team.name}
      className="h-full w-full scale-[2] object-cover object-center transition duration-500 group-hover:scale-[2.15]"
    />
  ) : null}
</div>



  <h3 className="mt-3 text-2xl font-black leading-tight">
    {team.name}
  </h3>

  <div className="mt-1 text-sm font-bold text-black/55">
    {team.nickname || "Kallenavn vurderes"}
  </div>

  <div className="mt-4 space-y-2 border-t border-black/10 pt-3">
    <div>
      <div className="text-[10px] font-black uppercase tracking-[0.18em] text-black/35">
        Stadion
      </div>
      <div className="text-sm font-black uppercase">
        {team.stadium || "Ikke oppgitt"}
      </div>
    </div>

    <div>
      <div className="text-[10px] font-black uppercase tracking-[0.18em] text-black/35">
        Kapasitet
      </div>
      <div className="text-sm font-black">
        {team.capacity?.toLocaleString("no-NO") || "—"}
      </div>
    </div>

    <div>
      <div className="text-[10px] font-black uppercase tracking-[0.18em] text-black/35">
        Sponsor
      </div>
      <div className="text-sm font-black uppercase text-black/55">
        {team.sponsor || "Ikke oppgitt"}
      </div>
    </div>
  </div>
</div>

            ))}
          </div>
        </section>
      </div>
    </main>
  );
}