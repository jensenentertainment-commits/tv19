import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase-admin";

function formatSolarisDate(dateString: string) {
  const date = new Date(dateString);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");

  return `${day}.${month}.${date.getFullYear()} ${hour}:${minute}`;
}

export default async function SolarisSummerCupPage() {
  const { data: competition } = await supabaseAdmin
    .from("rcc_competitions")
    .select("*")
    .eq("slug", "solaris-summer-cup")
    .single();

  const { data: entries } = await supabaseAdmin
    .from("rcc_competition_teams")
    .select("id, team_id")
    .eq("competition_id", competition?.id ?? "");

  const teamIds = entries?.map((entry) => entry.team_id) ?? [];

  const { data: teams } = await supabaseAdmin
    .from("rcc_teams")
    .select(`
      id,
      name,
      slug,
      crest_url,
      nickname,
      league_level,
      sponsor,
      kit_supplier,
       country,
  league_name
    `)
    .in("id", teamIds);

    const { data: matches } = await supabaseAdmin
  .from("rcc_competition_matches")
  .select(`
    *,
    home:rcc_teams!rcc_competition_matches_home_team_id_fkey(
      name,
      crest_url
    ),
    away:rcc_teams!rcc_competition_matches_away_team_id_fkey(
      name,
      crest_url
    )
  `)
  .eq("competition_id", competition?.id ?? "")
  .order("match_date", { ascending: true });

  
const groupMatches = matches?.filter((match) => match.stage === "group") ?? [];

const semifinalMatches =
  matches?.filter((match) => match.stage === "semifinal") ?? [];

const finalMatches = matches?.filter((match) => match.stage === "final") ?? [];

 

  const groupedMatches =
  groupMatches.reduce<Record<number, typeof groupMatches>>((groups, match) => {
    if (!groups[match.round]) {
      groups[match.round] = [];
    }

    groups[match.round].push(match);
    return groups;
  }, {}) ?? {};

  const table = (teams ?? [])
  .map((team) => {
    let played = 0;
    let won = 0;
    let drawn = 0;
    let lost = 0;
    let goalsFor = 0;
    let goalsAgainst = 0;

    groupMatches
  .filter((match) => match.played)
      .forEach((match) => {
        const isHome = match.home_team_id === team.id;
        const isAway = match.away_team_id === team.id;

        if (!isHome && !isAway) return;

        const gf = isHome ? match.home_goals : match.away_goals;
        const ga = isHome ? match.away_goals : match.home_goals;

        played++;
        goalsFor += gf ?? 0;
        goalsAgainst += ga ?? 0;

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
      goalDifference: goalsFor - goalsAgainst,
      points: won * 3 + drawn,
    };
  })
  .sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDifference !== a.goalDifference) {
      return b.goalDifference - a.goalDifference;
    }
    return b.goalsFor - a.goalsFor;
  });

  

const groupMatchesPlayed = groupMatches.filter((match) => match.played).length;
const groupMatchesTotal = groupMatches.length;
const totalMatches = 31;
const totalPlayed = groupMatchesPlayed;
const progressPercent =
  totalMatches > 0 ? Math.round((totalPlayed / totalMatches) * 100) : 0;

const groupStageFinished = groupMatchesPlayed === 28;

const placeholderTeam = (name: string) => ({
  name,
  crest_url: null,
});

const knockoutMatches = [
  {
    stage: "Semifinaler",
    matches:
      semifinalMatches.length > 0
        ? semifinalMatches.map((match, index) => ({
            label: `Semifinale ${index + 1}`,
            date: formatSolarisDate(match.match_date).split(" ")[0],
            time: formatSolarisDate(match.match_date).split(" ").slice(-1)[0],
            home: match.home,
            away: match.away,
            played: match.played,
            home_goals: match.home_goals,
            away_goals: match.away_goals,
          }))
        : [
            {
              label: "Semifinale 1",
              date: "29.07.2026",
              time: "15:00",
              home: groupStageFinished ? table[0] : placeholderTeam("1. plass"),
              away: groupStageFinished ? table[3] : placeholderTeam("4. plass"),
              played: false,
              home_goals: null,
              away_goals: null,
            },
            {
              label: "Semifinale 2",
              date: "29.07.2026",
              time: "20:00",
              home: groupStageFinished ? table[1] : placeholderTeam("2. plass"),
              away: groupStageFinished ? table[2] : placeholderTeam("3. plass"),
              played: false,
              home_goals: null,
              away_goals: null,
            },
          ],
  },
  {
    stage: "Finale",
    matches:
      finalMatches.length > 0
        ? finalMatches.map((match) => ({
            label: "Finale",
            date: formatSolarisDate(match.match_date).split(" ")[0],
            time: formatSolarisDate(match.match_date).split(" ").slice(-1)[0],
            home: match.home,
            away: match.away,
            played: match.played,
            home_goals: match.home_goals,
            away_goals: match.away_goals,
          }))
        : [
            {
              label: "Finale",
              date: "01.08.2026",
              time: "18:00",
              home: placeholderTeam("Vinner semifinale 1"),
              away: placeholderTeam("Vinner semifinale 2"),
              played: false,
              home_goals: null,
              away_goals: null,
            },
          ],
  },
];


const nextGroupMatch = groupMatches.find((match) => !match.played);

const nextKnockoutMatch = groupStageFinished
  ? knockoutMatches
      .flatMap((stage) => stage.matches)
      .find((match) => !match.played)
  : null;

const nextMatch = nextGroupMatch ?? nextKnockoutMatch;



  return (
    <main className="min-h-screen bg-[rgb(var(--paper))] px-4 py-8">
      <div className="mx-auto max-w-[1180px]">
        <section className="bg-[#102848] p-8 text-white">
          <Link href="/rcc" className="text-sm font-black text-white/55">
            ← Royal County Championship
          </Link>

          <div className="mt-8 grid gap-8 lg:grid-cols-[260px_1fr] lg:items-center">
            <div className="flex items-center justify-center  border border-white/60 p-6">
              <img
                src="/ssc/solaris-white.png"
                alt="Solaris"
                className="max-h-[200px] object-contain"
              />
            </div>

            <div>
              <div className="text-xs font-black uppercase tracking-[0.25em] text-[#E7B21D]">
                Presented by Solaris
              </div>

              <h1 className="mt-2 max-w-[760px] text-5xl font-black leading-[0.95] tracking-tight md:text-7xl">
                Solaris Summer Cup
              </h1>

              <p className="mt-4 max-w-[760px] text-xl font-bold text-white/65">
                Åtte klubber møtes i RCCs offisielle pre-season turnering.
                Alle møter alle én gang, før topp fire går videre til
                semifinaler.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <div className="border border-white/15 px-4 py-3 text-sm font-black uppercase tracking-[0.15em] text-white">
                  2026
                </div>

                <div className="border border-white/15 px-4 py-3 text-sm font-black uppercase tracking-[0.15em] text-white">
                  8 lag
                </div>

                <div className="border border-white/15 px-4 py-3 text-sm font-black uppercase tracking-[0.15em] text-white">
                  31 kamper
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-4">
  <div className="bg-white p-5">
    <div className="text-xs font-black uppercase tracking-[0.2em] text-black/35">
      Format
    </div>
    <div className="mt-2 text-3xl font-black text-[#102848]">8 lag</div>
  </div>

  <div className="bg-white p-5">
    <div className="text-xs font-black uppercase tracking-[0.2em] text-black/35">
      Gruppespill
    </div>
    <div className="mt-2 text-3xl font-black text-[#102848]">28 kamper</div>
  </div>

  <div className="bg-white p-5">
    <div className="text-xs font-black uppercase tracking-[0.2em] text-black/35">
      Videre
    </div>
    <div className="mt-2 text-3xl font-black text-[#102848]">Topp 4</div>
  </div>

  <div className="bg-white p-5">
    <div className="text-xs font-black uppercase tracking-[0.2em] text-black/35">
      Finale
    </div>
    <div className="mt-2 text-3xl font-black text-[#102848]">01.08.2026</div>
  </div>
</section>

<section className="mt-6 bg-white p-6">
  <div className="mb-4 border-b-4 border-[#E7B21D] pb-2">
    <div className="text-sm font-black uppercase tracking-[0.2em] text-[#102848]">
      Turneringsstatus
    </div>
  </div>

  <div className="flex items-end justify-between gap-4">
    <div>
      <div className="text-2xl font-black text-[#102848]">
        Gruppespill pågår
      </div>
      <div className="mt-1 text-sm font-bold text-black/50">
        {totalPlayed} av {totalMatches} kamper spilt
      </div>
    </div>

    <div className="text-3xl font-black text-[#102848]">
      {progressPercent}%
    </div>
  </div>

  <div className="mt-5 h-4 overflow-hidden bg-black/10">
    <div
      className="h-full bg-[#E7B21D]"
      style={{ width: `${progressPercent}%` }}
    />
  </div>

  <div className="mt-4 grid gap-3 text-xs font-black uppercase tracking-[0.18em] md:grid-cols-3">
    <div className="bg-[#102848] px-4 py-3 text-[#E7B21D]">
      Gruppespill
    </div>
    <div className="bg-black/5 px-4 py-3 text-black/35">
      Semifinaler
    </div>
    <div className="bg-black/5 px-4 py-3 text-black/35">
      Finale
    </div>
  </div>
</section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="bg-white p-6">
  <div className="mb-4 border-b-4 border-[#E7B21D] pb-2">
    <div className="text-sm font-black uppercase tracking-[0.2em] text-[#102848]">
      Tabell
    </div>
  </div>

  <table className="w-full">
  <thead>
    <tr className="border-b border-black/10 text-left text-xs font-black uppercase text-black/45">
      <th className="pb-2">#</th>
      <th className="pb-2">Lag</th>
      <th className="pb-2 text-right">K</th>
      <th className="pb-2 text-right">V</th>
      <th className="pb-2 text-right">U</th>
      <th className="pb-2 text-right">T</th>
      <th className="pb-2 text-right">MF</th>
      <th className="pb-2 text-right">P</th>
    </tr>
  </thead>

  <tbody>
    {table.map((team, index) => (
      <tr
        key={team.id}
        className={`border-b border-black/5 ${
          index < 4 ? "bg-[#E7B21D]/10" : ""
        }`}
      >
        <td className="py-2 font-black text-black/40">{index + 1}</td>

        <td className="py-2">
          <div className="flex items-center gap-2">
            {team.crest_url ? (
              <img
                src={team.crest_url}
                alt=""
                className="h-6 w-6 object-contain"
              />
            ) : null}

            <span className="font-black">{team.name}</span>
          </div>
        </td>

        <td className="py-2 text-right font-black">{team.played}</td>
        <td className="py-2 text-right font-black">{team.won}</td>
        <td className="py-2 text-right font-black">{team.drawn}</td>
        <td className="py-2 text-right font-black">{team.lost}</td>
        <td className="py-2 text-right font-black">
          {team.goalsFor}-{team.goalsAgainst}
        </td>
        <td className="py-2 text-right text-lg font-black text-[#102848]">
          {team.points}
        </td>
      </tr>
    ))}
  </tbody>
</table>

<div className="mt-4 text-xs font-black uppercase tracking-[0.18em] text-black/35">
  Topp 4 går til semifinaler
</div>
</div>

          <div className="bg-white p-6">
            <div className="group flex items-center gap-4 border border-black/10 bg-white p-4 transition hover:-translate-y-1 hover:border-[#102848]/40 hover:shadow-[0_14px_30px_rgba(16,40,72,0.12)]">
              <div className="text-sm font-black uppercase tracking-[0.2em] text-[#102848]">
                
                Deltakere
              </div>
            </div>

       <div className="grid gap-4 md:grid-cols-2">
  {teams?.map((team) => (
    <div
      key={team.id}
      className="flex items-center gap-4 border border-black/10 p-4"
    >
      {team.crest_url ? (
        <img
          src={team.crest_url}
          alt=""
          className="h-20 w-20 object-contain"
        />
      ) : (
        <div className="flex h-16 w-16 items-center justify-center bg-black/5 text-xs font-black text-black/30">
          SSC
        </div>
      )}

      <div>
        <div className="text-lg font-black">
          {team.name}
        </div>

        <div className="text-sm font-bold text-black/55">
          {team.league_name || team.league_level || "Invitert klubb"}
        </div>

        <div className="text-xs font-black uppercase tracking-[0.15em] text-black/35">
          {team.country || "International"}
        </div>
      </div>
    </div>
  ))}
</div>
          </div>
        </section>

     {nextMatch ? (
  <section className="mt-8 bg-[#102848] p-6 text-white">
    <div className="flex items-center gap-3">
  <div className="text-xs font-black uppercase tracking-[0.25em] text-[#E7B21D]">
    Neste kamp
  </div>

  {"label" in nextMatch ? (
    <div className="text-xs font-black uppercase tracking-[0.25em] text-white/60">
      {nextMatch.label}
    </div>
  ) : null}
</div>

   <div className="mt-4 text-sm font-black text-white/55">
  {"round" in nextMatch
    ? `Runde ${nextMatch.round} · ${formatSolarisDate(nextMatch.match_date)}`
    : `${nextMatch.date} · ${nextMatch.time}`}
</div>

    <div className="mt-6 grid items-center gap-5 md:grid-cols-[1fr_auto_1fr]">
      <div className="flex flex-col items-center text-center">
        {nextMatch.home?.crest_url ? (
          <img
            src={nextMatch.home.crest_url}
            alt=""
            className="h-20 w-20 object-contain"
          />
        ) : null}

        <div className="mt-3 text-3xl font-black">
          {nextMatch.home?.name}
        </div>
      </div>

      <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#E7B21D]/50 bg-white/5 text-xs font-black uppercase tracking-[0.2em] text-[#E7B21D]">
        VS
      </div>

      <div className="flex flex-col items-center text-center">
        {nextMatch.away?.crest_url ? (
          <img
            src={nextMatch.away.crest_url}
            alt=""
            className="h-20 w-20 object-contain"
          />
        ) : null}

        <div className="mt-3 text-3xl font-black">
          {nextMatch.away?.name}
        </div>
      </div>
    </div>
  </section>
) : null}

        <section className="mt-8 bg-white p-6">
  <div className="mb-4 border-b-4 border-[#E7B21D] pb-2">
    <div className="text-sm font-black uppercase tracking-[0.2em] text-[#102848]">
      Kamper
    </div>
  </div>

  <div className="space-y-8">
    {Object.entries(groupedMatches).map(([round, roundMatches]) => (
      <section key={round}>
        <div className="mb-3 bg-[#102848] px-4 py-3">
          <div className="text-xs font-black uppercase tracking-[0.22em] text-[#E7B21D]">
            Runde {round}
          </div>
        </div>

        <div className="divide-y divide-black/10">
          {roundMatches.map((match) => (
            <div
              key={match.id}
              className="grid items-center gap-4 py-4 md:grid-cols-[120px_1fr_70px_1fr]"
            >
              <div className="text-sm font-black text-black/45">
                {formatSolarisDate(match.match_date)}
              </div>

              <div className="flex items-center gap-3">
                {match.home?.crest_url ? (
                  <img
                    src={match.home.crest_url}
                    alt=""
                    className="h-8 w-8 object-contain"
                  />
                ) : null}

                <span className="font-black">
                  {match.home?.name}
                </span>
              </div>

             <div className="text-center font-black">
  {match.played ? (
    <span className="text-xl text-[#102848]">
      {match.home_goals}–{match.away_goals}
    </span>
  ) : (
    <span className="text-xs uppercase tracking-[0.18em] text-black/35">
      VS
    </span>
  )}
</div>

              <div className="flex items-center justify-end gap-3 text-right">
                <span className="font-black">
                  {match.away?.name}
                </span>

                {match.away?.crest_url ? (
                  <img
                    src={match.away.crest_url}
                    alt=""
                    className="h-8 w-8 object-contain"
                  />
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </section>
    ))}

   {knockoutMatches.map((stage) => (
  <section key={stage.stage}>
    <div className="mb-3 bg-[#102848] px-4 py-3">
      <div className="text-xs font-black uppercase tracking-[0.22em] text-[#E7B21D]">
        {stage.stage}
      </div>
    </div>

    <div className="divide-y divide-black/10">
      {stage.matches.map((match) => (
        <div
          key={match.label}
          className="grid items-center gap-4 py-4 md:grid-cols-[140px_1fr_70px_1fr]"
        >
          <div className="text-sm font-black text-black/45">
            {match.date} {match.time}
          </div>

          <div className="flex items-center gap-3">
            {match.home?.crest_url ? (
              <img
                src={match.home.crest_url}
                alt=""
                className="h-8 w-8 object-contain"
              />
            ) : null}

            <span className="font-black">{match.home?.name}</span>
          </div>

          <div className="text-center font-black">
            {match.played ? (
              <span className="text-xl text-[#102848]">
                {match.home_goals}–{match.away_goals}
              </span>
            ) : (
              <span className="text-xs uppercase tracking-[0.18em] text-black/35">
                VS
              </span>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 text-right">
            <span className="font-black">{match.away?.name}</span>

            {match.away?.crest_url ? (
              <img
                src={match.away.crest_url}
                alt=""
                className="h-8 w-8 object-contain"
              />
            ) : null}
          </div>
        </div>
      ))}
    </div>
  </section>
))}
  </div>
</section>
      </div>
    </main>
  );
}