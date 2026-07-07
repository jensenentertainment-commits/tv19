import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase-admin";

type TeamRow = {
  id: string;
  name: string;
  crest_url?: string | null;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDiff: number;
  points: number;
};

export default async function RccTablePage() {
 const { data: teams } = await supabaseAdmin
  .from("rcc_teams")
  .select("*")
  .eq("league_level", "RCC")
  .order("name", { ascending: true });

  const { data: matches } = await supabaseAdmin
  .from("rcc_matches")
  .select("*")
  .eq("season", "2026/27");

 const rows: TeamRow[] =
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
        id: team.id,
        name: team.name,
        crest_url: team.crest_url,
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

  return (
    <main className="min-h-screen bg-[rgb(var(--paper))] px-4 py-8">
      <div className="mx-auto max-w-[1000px]">
        <div className="mb-6 bg-[#102848] p-6 text-white">
  <Link href="/rcc" className="text-sm font-black text-white/60">
    ← Royal County Championship
  </Link>

  <div className="mt-4 text-xs font-black uppercase tracking-[0.25em] text-[#E7B21D]">
    Sesong 2026/27
  </div>

  <h1 className="mt-2 text-5xl font-black tracking-tight">
    Tabell
  </h1>
</div>

<div className="flex flex-wrap gap-4 border-b border-black/10 px-4 py-3 text-xs font-black uppercase">
  <div className="flex items-center gap-2">
    <div className="h-3 w-3 bg-green-200" />
    Seriemester
  </div>

  <div className="flex items-center gap-2">
    <div className="h-3 w-3 bg-red-200" />
    Nedrykk
  </div>
</div>

        <div className="overflow-x-auto bg-white">
          <table className="w-full min-w-[720px]">
            <thead className="border-b-4 border-[#E7B21D] bg-[#102848] text-white">
              <tr className="text-left text-sm font-black uppercase">
                <th className="px-3 py-3">#</th>
                <th className="px-3 py-3">Lag</th>
                <th className="px-3 py-3">K</th>
                <th className="px-3 py-3">V</th>
                <th className="px-3 py-3">U</th>
                <th className="px-3 py-3">T</th>
                <th className="px-3 py-3">MF</th>
                <th className="px-3 py-3">MM</th>
                <th className="px-3 py-3">+/-</th>
                <th className="px-3 py-3">P</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((row, index) => (
                <tr
   key={row.id}
  className={[
    "border-b border-black/10 bg-white",
    index < 1 ? "border-l-4 border-l-green-500" : "",
    index >= rows.length - 3 ? "border-l-4 border-l-red-500" : "",
  ].join(" ")}
>
                  <td className="px-3 py-3">
  <div className="font-black text-black/60">
    {index + 1}
  </div>
</td>
                  <td className="px-3 py-3">
  <div className="flex items-center gap-3">
    {row.crest_url ? (
      <img
        src={row.crest_url}
        alt=""
        className="h-8 w-8 object-contain"
      />
    ) : null}

    <span className="font-black">
      {row.name}
    </span>
  </div>
</td>
                  <td className="px-3 py-3">{row.played}</td>
                  <td className="px-3 py-3">{row.won}</td>
                  <td className="px-3 py-3">{row.drawn}</td>
                  <td className="px-3 py-3">{row.lost}</td>
                  <td className="px-3 py-3">{row.goalsFor}</td>
                  <td className="px-3 py-3">{row.goalsAgainst}</td>
                  <td className="px-3 py-3">
  {row.goalDiff > 0 ? `+${row.goalDiff}` : row.goalDiff}
</td>
                  <td className="px-3 py-3 font-black">{row.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-sm font-bold text-black/50">
          Tabellen oppdateres når kampene begynner å få konsekvenser. Den sorteres etter poeng, målforskjell og scorede mål.
        </p>
      </div>
    </main>
  );
}