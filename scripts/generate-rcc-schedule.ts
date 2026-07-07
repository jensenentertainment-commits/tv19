import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const SEASON = "2026/27";
const START_DATE = new Date("2026-08-22");

const TIME_SLOTS = [
  { dayOffset: -1, time: "20:00" }, // fredag
  { dayOffset: 0, time: "13:30" },  // lørdag
  { dayOffset: 0, time: "16:00" },
  { dayOffset: 0, time: "16:00" },
  { dayOffset: 0, time: "16:00" },
  { dayOffset: 0, time: "16:00" },
  { dayOffset: 0, time: "16:00" },
  { dayOffset: 0, time: "18:30" },
  { dayOffset: 1, time: "15:00" },  // søndag
  { dayOffset: 1, time: "17:30" },
];

function addDays(date: Date, days: number) {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
}

function formatDateTime(date: Date, time: string) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");

  return `${yyyy}-${mm}-${dd}T${time}:00`;
}

function generateRounds<T>(teams: T[]) {
  const teamList = [...teams];

  if (teamList.length % 2 !== 0) {
    throw new Error("Antall lag må være partall");
  }

  const rounds = [];
  const numberOfTeams = teamList.length;
  const numberOfRounds = numberOfTeams - 1;

  for (let round = 0; round < numberOfRounds; round++) {
    const matches = [];

    for (let i = 0; i < numberOfTeams / 2; i++) {
      const home = teamList[i];
      const away = teamList[numberOfTeams - 1 - i];

      if (round % 2 === 0) {
        matches.push({ home, away });
      } else {
        matches.push({ home: away, away: home });
      }
    }

    rounds.push(matches);

    const fixed = teamList[0];
    const rotated = [
      teamList[0],
      teamList[numberOfTeams - 1],
      ...teamList.slice(1, numberOfTeams - 1),
    ];

    teamList.splice(0, teamList.length, fixed, ...rotated.slice(1));
  }

  const reverseRounds = rounds.map((round) =>
    round.map((match) => ({
      home: match.away,
      away: match.home,
    }))
  );

  return [...rounds, ...reverseRounds];
}

async function main() {
  const { data: teams, error: teamsError } = await supabase
    .from("rcc_teams")
    .select("id,name")
    .order("name", { ascending: true });

  if (teamsError) throw teamsError;
  if (!teams || teams.length !== 20) {
    throw new Error(`Fant ${teams?.length ?? 0} lag. Forventet 20.`);
  }

  await supabase.from("rcc_matches").delete().eq("season", SEASON);

  const rounds = generateRounds(teams);

  const rows = rounds.flatMap((matches, roundIndex) => {
    const roundNumber = roundIndex + 1;
    const roundBaseDate = addDays(START_DATE, roundIndex * 7);

    return matches.map((match, matchIndex) => {
      const slot = TIME_SLOTS[matchIndex];
      const matchDate = addDays(roundBaseDate, slot.dayOffset);

      return {
        season: SEASON,
        round: roundNumber,
        match_date: formatDateTime(matchDate, slot.time),
        home_team_id: match.home.id,
        away_team_id: match.away.id,
        played: false,
      };
    });
  });

  const { error: insertError } = await supabase
    .from("rcc_matches")
    .insert(rows);

  if (insertError) throw insertError;

  console.log(`Opprettet ${rows.length} kamper for ${SEASON}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});