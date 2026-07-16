import Link from "next/link";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { generateMatchReport } from "@/lib/rcc/match/generate-match-report";
import { generateMatchHeadline } from "@/lib/rcc/match/generate-match-headline";

function formatAttendance(value?: number | null) {
  if (!value) return "Ikke oppgitt";
  return value.toLocaleString("no-NO").replace(/\s/g, " ");
}



export default async function RccMatchPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: match } = await supabaseAdmin
    .from("rcc_matches")
    .select(`
      *,
      home:rcc_teams!rcc_matches_home_team_id_fkey(
        name,
        short_name,
        crest_url,
        stadium,
        capacity
      ),
      away:rcc_teams!rcc_matches_away_team_id_fkey(
        name,
        short_name,
        crest_url
      ),
      events:rcc_match_events(
        minute,
        event_type,
        team:rcc_teams(name, short_name),
        player:rcc_players(name)
      )
    `)
    .eq("id", id)
    .single();

  if (!match) {
    notFound();
  }

  const events = [...(match.events ?? [])].sort(
    (a, b) => a.minute - b.minute
  );

const title = `${match.home?.name} – ${match.away?.name}`;

const report = generateMatchReport(match, events);

const headline = generateMatchHeadline(match, events);

  return (
    <main className="min-h-screen bg-[rgb(var(--paper))] px-4 py-8">
      <div className="mx-auto max-w-[900px]">
        <div className="mb-6 bg-[#102848] px-6 py-5 text-white">
          <Link href="/rcc/kamper" className="text-sm font-black text-white/60">
            ← Kamper
          </Link>

          <div className="mt-4 text-xs font-black uppercase tracking-[0.25em] text-[#E7B21D]">
            Royal County Championship
          </div>

          <h1 className="mt-2 text-3xl md:text-4xl font-black tracking-tight ">
            {title}
          </h1>

          <div className="mt-4 space-y-1 text-sm font-black uppercase tracking-[0.16em] text-white/55">
  <div>{match.home?.stadium ?? "Stadion ikke oppgitt"}</div>

  <div>
    {new Date(match.match_date).toLocaleDateString("no-NO", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    })}
  </div>
</div>
        </div>

        <section className="bg-white p-6">
          <div className="grid items-center gap-6 md:grid-cols-[1fr_140px_1fr]">
            <div className="flex items-center gap-4">
              {match.home?.crest_url ? (
                <img src={match.home.crest_url} alt="" className="h-16 w-16 object-contain" />
              ) : null}
              <div>
                <div className="text-2xl font-black">{match.home?.name}</div>
                <div className="text-xs font-black uppercase tracking-[0.18em] text-black/40">
                  Hjemmelag
                </div>
              </div>
            </div>

            <div className="text-center">
              {match.played ? (
                <div className="text-5xl font-black text-[#102848]">
                  {match.home_goals}–{match.away_goals}
                </div>
              ) : (
                <div className="text-xl font-black uppercase tracking-[0.2em] text-black/35">
                  VS
                </div>
              )}
            </div>

            <div className="flex items-center gap-4 md:justify-end">
              <div className="text-right">
                <div className="text-2xl font-black">{match.away?.name}</div>
                <div className="text-xs font-black uppercase tracking-[0.18em] text-black/40">
                  Bortelag
                </div>
              </div>
              {match.away?.crest_url ? (
                <img src={match.away.crest_url} alt="" className="h-16 w-16 object-contain" />
              ) : null}
            </div>
          </div>
        </section>

        <section className="mt-6 bg-white p-6">
          <h2 className="border-b-4 border-black pb-2 text-3xl font-black">
            Mål
          </h2>

          {events.length ? (
            <div className="mt-5 space-y-3">
              {events.map((event, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border-b border-black/10 pb-3"
                >
                  <div className="font-black">
  ⚽ {event.minute}' {event.player?.name} ({event.team?.short_name})
</div>
                  
                </div>
              ))}
            </div>
            
          ) : (
            <p className="mt-4 text-lg font-bold text-black/55">
              Ingen mål registrert.
            </p>
          )}
<div className="mt-4 text-sm font-black uppercase tracking-[0.16em] text-black/70">
            
            tilskuere: {formatAttendance(match.attendance)} 
          </div>
          
        </section>

        <section className="mt-6 bg-white p-6">
          <div className="text-xs font-black uppercase tracking-[0.22em] text-[#C62828]">
            TV19 kampreferat
          </div>

          <h2 className="mt-2 text-3xl font-black tracking-tight">
  {match.played ? headline : "Før kampen"}
</h2>

          <p className="mt-4 text-lg leading-relaxed text-black/75">
  {report}
</p>
        </section>
      </div>
    </main>
  );
}