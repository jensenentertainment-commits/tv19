import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase-admin";

function formatNumber(value: number) {
  return value.toLocaleString("no-NO");
}

type MatchTeam = {
  name: string;
  short_name: string | null;
  stadium?: string | null;
};

type StatsMatch = {
  id: string;
  played: boolean | null;
  match_date: string;
  home_goals: number | null;
  away_goals: number | null;
  attendance: number | null;
  home: MatchTeam | null;
  away: MatchTeam | null;
};

export default async function RccStatisticsPage() {
  const { data: matches } = await supabaseAdmin
    .from("rcc_matches")
    .select(`
      id,
      played,
      match_date,
      home_goals,
      away_goals,
      attendance,
      home:rcc_teams!rcc_matches_home_team_id_fkey(name, short_name, stadium),
      away:rcc_teams!rcc_matches_away_team_id_fkey(name, short_name)
    `)
    .eq("played", true)
    .order("match_date", { ascending: false });

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

  const { data: teams } = await supabaseAdmin
    .from("rcc_teams")
    .select("name, short_name, stadium, capacity")
    .eq("league_level", "RCC")
    .order("capacity", { ascending: false });

 const playedMatches = (matches ?? []) as unknown as StatsMatch[];

  const matchesPlayed = playedMatches.length;

  const totalGoals = playedMatches.reduce(
    (sum, match) => sum + (match.home_goals ?? 0) + (match.away_goals ?? 0),
    0
  );

  const totalAttendance = playedMatches.reduce(
    (sum, match) => sum + (match.attendance ?? 0),
    0
  );

  const averageAttendance =
    matchesPlayed > 0 ? Math.round(totalAttendance / matchesPlayed) : 0;

  const highestAttendance = Math.max(
    ...(playedMatches.map((match) => match.attendance ?? 0) ?? [0])
  );

  const highestScoringMatch = Math.max(
    ...(playedMatches.map(
      (match) => (match.home_goals ?? 0) + (match.away_goals ?? 0)
    ) ?? [0])
  );

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

  const topScorerList = Array.from(scorerMap.values())
    .sort((a, b) => b.goals - a.goals)
    .slice(0, 20);

  const highestScoringMatches = [...playedMatches]
    .sort(
      (a, b) =>
        (b.home_goals ?? 0) +
        (b.away_goals ?? 0) -
        ((a.home_goals ?? 0) + (a.away_goals ?? 0))
    )
    .slice(0, 10);

  const biggestCrowds = [...playedMatches]
    .sort((a, b) => (b.attendance ?? 0) - (a.attendance ?? 0))
    .slice(0, 10);

  const kebabsSold = Math.round(totalAttendance * 0.18);
  const beerLiters = Math.round(totalAttendance * 0.65);
  const forgottenUmbrellas = Math.round(matchesPlayed * 7 + totalAttendance * 0.006);
  const unusedSeasonTickets = Math.round(totalAttendance * 0.028);
  const lostScarves = Math.round(totalAttendance * 0.014);
  const refereeComplaints = Math.round(matchesPlayed * 41 + totalGoals * 3);
  const tacticalExperts = Math.round(totalAttendance * 0.037);

  return (
    <main className="min-h-screen bg-[rgb(var(--paper))] px-4 py-8">
      <div className="mx-auto max-w-[1200px]">
        <div className="bg-[#102848] p-6 text-white">
          <Link
            href="/rcc"
            className="text-sm font-black text-white/60 no-underline"
          >
            ← Royal County Championship
          </Link>

          <div className="mt-4 text-xs font-black uppercase tracking-[0.25em] text-[#E7B21D]">
            RCC Statistikk
          </div>

          <h1 className="mt-2 text-5xl font-black tracking-tight">
            Statistikksenter
          </h1>

          <p className="mt-3 max-w-[760px] text-lg font-bold text-white/60">
            Tall, analyser og observasjoner som TV19 Sport mener fortjener
            uforholdsmessig mye oppmerksomhet.
          </p>
        </div>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <section className="bg-white p-5">
            <div className="border-b-4 border-black pb-2">
              <div className="text-xs font-black uppercase tracking-[0.22em] text-[#C62828]">
                RCC-statistikk
              </div>
              <h2 className="mt-1 text-2xl font-black">RCC i tall</h2>
            </div>

            <div className="mt-4 space-y-3">
              {[
                ["Kamper spilt", matchesPlayed],
                ["Mål scoret", totalGoals],
                ["Totalt tilskuere", formatNumber(totalAttendance)],
                ["Snitt per kamp", formatNumber(averageAttendance)],
                ["Flest mål i kamp", highestScoringMatch],
                ["Største publikum", formatNumber(highestAttendance)],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between border-b border-black/10 pb-2 last:border-b-0"
                >
                  <span className="font-black">{label}</span>
                  <span className="font-black text-[#102848]">{value}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white p-5">
            <div className="border-b-4 border-[#C62828] pb-2">
              <div className="text-xs font-black uppercase tracking-[0.22em] text-[#C62828]">
                TV19 Analyse
              </div>
              <h2 className="mt-1 text-2xl font-black">
                Tall som også følges
              </h2>
            </div>

            <div className="mt-4 space-y-3">
              {[
                ["Kebaber solgt", formatNumber(kebabsSold)],
                ["Liter øl konsumert", formatNumber(beerLiters)],
                ["Gjenglemte paraplyer", formatNumber(forgottenUmbrellas)],
                ["Ubenyttede sesongkort", formatNumber(unusedSeasonTickets)],
                ["Mistet supporterskjerf", formatNumber(lostScarves)],
                ["Dommerklager registrert", formatNumber(refereeComplaints)],
                ["Selverklærte taktiske eksperter", formatNumber(tacticalExperts)],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between border-b border-black/10 pb-2 last:border-b-0"
                >
                  <span className="font-black">{label}</span>
                  <span className="font-black text-[#102848]">{value}</span>
                </div>
              ))}
            </div>
          </section>
        </section>

        <section className="mt-8 bg-white p-5">
          <div className="border-b-4 border-black pb-2">
            <div className="text-xs font-black uppercase tracking-[0.22em] text-[#C62828]">
              RCC-statistikk
            </div>
            <h2 className="mt-1 text-3xl font-black">Toppscorere</h2>
          </div>

          {topScorerList.length ? (
            <div className="mt-4 divide-y divide-black/10">
              {topScorerList.map((player, index) => (
                <div
                  key={`${player.name}-${player.teamShortName}`}
                  className="grid grid-cols-[40px_40px_1fr_60px] items-center gap-3 py-3"
                >
                  <div className="text-lg font-black text-black/35">
                    {index + 1}
                  </div>

                  {player.crestUrl ? (
                    <img
                      src={player.crestUrl}
                      alt=""
                      className="h-8 w-8 object-contain"
                    />
                  ) : (
                    <div />
                  )}

                  <div>
                    <div className="font-black">{player.name}</div>
                    <div className="text-xs font-black uppercase tracking-[0.16em] text-black/40">
                      {player.teamShortName} · {player.position}
                    </div>
                  </div>

                  <div className="text-right text-2xl font-black text-[#102848]">
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

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <section className="bg-white p-5">
            <div className="border-b-4 border-black pb-2">
              <div className="text-xs font-black uppercase tracking-[0.22em] text-[#C62828]">
                RCC-statistikk
              </div>
              <h2 className="mt-1 text-2xl font-black">
                Mest målrike kamper
              </h2>
            </div>

            {highestScoringMatches.length ? (
              <div className="mt-4 divide-y divide-black/10">
                {highestScoringMatches.map((match) => {
                  const goals = (match.home_goals ?? 0) + (match.away_goals ?? 0);

                  return (
                    <Link
                      key={match.id}
                      href={`/rcc/kamper/${match.id}`}
                      className="grid grid-cols-[1fr_70px] gap-3 py-3 font-black no-underline transition hover:bg-[#f3eeee]"
                    >
                      <div>
                        {match.home?.name} {match.home_goals}–{match.away_goals}{" "}
                        {match.away?.name}
                      </div>
                      <div className="text-right text-[#102848]">
                        {goals} mål
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <p className="mt-4 font-bold text-black/55">
                Ingen spilte kamper ennå.
              </p>
            )}
          </section>

          <section className="bg-white p-5">
            <div className="border-b-4 border-black pb-2">
              <div className="text-xs font-black uppercase tracking-[0.22em] text-[#C62828]">
                RCC-statistikk
              </div>
              <h2 className="mt-1 text-2xl font-black">Største publikum</h2>
            </div>

            {biggestCrowds.length ? (
              <div className="mt-4 divide-y divide-black/10">
                {biggestCrowds.map((match) => (
                  <Link
                    key={match.id}
                    href={`/rcc/kamper/${match.id}`}
                    className="block py-3 font-black no-underline transition hover:bg-[#f3eeee]"
                  >
                    <div>
                      {match.home?.name} {match.home_goals}–{match.away_goals}{" "}
                      {match.away?.name}
                    </div>
                    <div className="mt-1 text-xs font-black uppercase tracking-[0.16em] text-black/40">
                      {match.home?.stadium ?? "Stadion ukjent"} ·{" "}
                      {formatNumber(match.attendance ?? 0)} tilskuere
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="mt-4 font-bold text-black/55">
                Publikumstallene vurderes fortsatt.
              </p>
            )}
          </section>
        </section>

        <section className="mt-8 bg-white p-5">
          <div className="mb-5 flex items-end justify-between border-b-4 border-black pb-2">
            <div>
              <div className="text-xs font-black uppercase tracking-[0.22em] text-[#C62828]">
                RCC-statistikk
              </div>
              <h2 className="mt-1 text-3xl font-black">Stadionoversikt</h2>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {(teams ?? []).map((team) => (
              <div key={team.name} className="border border-black/10 p-4">
                <div className="text-lg font-black">{team.stadium}</div>
                <div className="mt-1 text-sm font-bold text-black/50">
                  {team.name}
                </div>
                <div className="mt-4 text-xs font-black uppercase tracking-[0.18em] text-black/35">
                  Kapasitet
                </div>
                <div className="text-2xl font-black text-[#102848]">
                  {formatNumber(team.capacity ?? 0)}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}