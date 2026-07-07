import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const COMPETITION_SLUG = "solaris-summer-cup";

const GROUP_MATCH_SLOTS = [
  "2026-07-15T15:00:00",
  "2026-07-15T18:00:00",
  "2026-07-15T21:00:00",

  "2026-07-16T15:00:00",
  "2026-07-16T18:00:00",
  "2026-07-16T21:00:00",

  "2026-07-17T15:00:00",
  "2026-07-17T18:00:00",
  "2026-07-17T21:00:00",

  "2026-07-19T15:00:00",
  "2026-07-19T18:00:00",
  "2026-07-19T21:00:00",

  "2026-07-20T15:00:00",
  "2026-07-20T18:00:00",
  "2026-07-20T21:00:00",

  "2026-07-21T15:00:00",
  "2026-07-21T18:00:00",
  "2026-07-21T21:00:00",

  "2026-07-23T15:00:00",
  "2026-07-23T18:00:00",
  "2026-07-23T21:00:00",

  "2026-07-24T15:00:00",
  "2026-07-24T18:00:00",
  "2026-07-24T21:00:00",

  "2026-07-25T15:00:00",
  "2026-07-25T18:00:00",
  "2026-07-25T21:00:00",

  "2026-07-27T18:00:00",
];

type Team = {
  id: string;
  name: string;
};

function generateRoundRobin(teams: Team[]) {
  const list = [...teams];

  if (list.length !== 8) {
    throw new Error(`Solaris Summer Cup krever 8 lag. Fant ${list.length}.`);
  }

  const rounds: { home: Team; away: Team }[][] = [];
  const teamCount = list.length;

  for (let round = 0; round < teamCount - 1; round++) {
    const matches: { home: Team; away: Team }[] = [];

    for (let i = 0; i < teamCount / 2; i++) {
      const home = list[i];
      const away = list[teamCount - 1 - i];

      matches.push(
        round % 2 === 0
          ? { home, away }
          : { home: away, away: home }
      );
    }

    rounds.push(matches);

    const fixed = list[0];
    const rotated = [
      fixed,
      list[teamCount - 1],
      ...list.slice(1, teamCount - 1),
    ];

    list.splice(0, list.length, ...rotated);
  }

  return rounds;
}

async function main() {
  const { data: competition, error: competitionError } = await supabase
    .from("rcc_competitions")
    .select("id,name")
    .eq("slug", COMPETITION_SLUG)
    .single();

  if (competitionError || !competition) {
    throw new Error("Fant ikke Solaris Summer Cup.");
  }

  const { data: entries, error: entriesError } = await supabase
    .from("rcc_competition_teams")
    .select("team_id")
    .eq("competition_id", competition.id);

  if (entriesError) throw entriesError;

  const teamIds = entries?.map((entry) => entry.team_id) ?? [];

  const { data: teams, error: teamsError } = await supabase
    .from("rcc_teams")
    .select("id,name")
    .in("id", teamIds)
    .order("name", { ascending: true });

  if (teamsError) throw teamsError;
  if (!teams || teams.length !== 8) {
    throw new Error(`Fant ${teams?.length ?? 0} lag. Forventet 8.`);
  }

  await supabase
    .from("rcc_competition_matches")
    .delete()
    .eq("competition_id", competition.id);

  const rounds = generateRoundRobin(teams);

  let slotIndex = 0;

  const rows = rounds.flatMap((matches, roundIndex) =>
    matches.map((match) => {
      const matchDate = GROUP_MATCH_SLOTS[slotIndex];

      slotIndex++;

      return {
        competition_id: competition.id,
        stage: "group",
        round: roundIndex + 1,
        match_date: matchDate,
        home_team_id: match.home.id,
        away_team_id: match.away.id,
        played: false,
      };
    })
  );

  const { error: insertError } = await supabase
    .from("rcc_competition_matches")
    .insert(rows);

  if (insertError) throw insertError;

  console.log(`Opprettet ${rows.length} gruppespillkamper for ${competition.name}.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});