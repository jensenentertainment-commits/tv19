import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase-admin";

export default async function RccMatchesPage() {
  const { data: matches } = await supabaseAdmin
    .from("rcc_matches")
    .select(`
  *,
  home:rcc_teams!rcc_matches_home_team_id_fkey(name, crest_url),
  away:rcc_teams!rcc_matches_away_team_id_fkey(name, crest_url)
`)
    .order("round", { ascending: true })
    .order("match_date", { ascending: true });

    const groupedMatches =
  matches?.reduce<Record<number, typeof matches>>((groups, match) => {
    if (!groups[match.round]) {
      groups[match.round] = [];
    }

    groups[match.round].push(match);
    return groups;
  }, {}) ?? {};

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
    Kamper
  </h1>
</div>

        {!matches?.length ? (
          <div className="bg-white p-8">
            <h2 className="text-3xl font-black">
              Terminlisten er ikke offentliggjort
            </h2>

            <p className="mt-3 text-lg font-bold text-black/60">
              TV19 erfarer at flere kamper vurderes som sannsynlige.
            </p>
          </div>
        ) : (
         <div className="space-y-8">
  {Object.entries(groupedMatches).map(([round, roundMatches]) => (
    <section key={round} className="overflow-hidden bg-white">
  <div className="bg-[#102848] px-5 py-4 text-white">
    <div className="text-sm font-black uppercase tracking-[0.25em] text-[#E7B21D]">
      Runde {round}
    </div>
  </div>
      <div className="divide-y divide-black/10">
        {roundMatches.map((match) => (
    <Link
  key={match.id}
  href={`/rcc/kamper/${match.id}`}
  className="grid gap-3 px-5 py-5 no-underline transition-colors duration-150 hover:bg-[#f3eeee] md:grid-cols-[190px_1fr]"
>
  <div className="text-sm font-black text-black/45">
    {new Date(match.match_date).toLocaleString("no-NO", {
  weekday: "short",
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
})}
  </div>

 <div className="grid items-center gap-3 text-center md:grid-cols-[1fr_90px_1fr] md:text-left">
  <div className="flex items-center justify-center gap-3 md:justify-start">
    {match.home?.crest_url ? (
      <img src={match.home.crest_url} alt="" className="h-9 w-9 object-contain" />
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

  <div className="flex items-center justify-center gap-3 md:justify-end">
    <span className="font-black">{match.away?.name}</span>

    {match.away?.crest_url ? (
      <img src={match.away.crest_url} alt="" className="h-9 w-9 object-contain" />
    ) : null}
  </div>
</div>

 
</Link>

        ))}
      </div>
    </section>
  ))}
</div>
        )}
      </div>
    </main>
  );
}