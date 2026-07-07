import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("Mangler NEXT_PUBLIC_SUPABASE_URL eller SUPABASE_SERVICE_ROLE_KEY");
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

type Team = {
  id: string;
  name: string;
  strength: number | null;
};

type Match = {
  id: string;
  home_team_id: string;
  away_team_id: string;
  match_date: string;
  stage: string | null;
  played: boolean | null;
};

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateGoals(power: number) {
  let goals = 0;

  if (Math.random() < 0.62 + power * 0.012) goals++;
  if (Math.random() < 0.36 + power * 0.01) goals++;
  if (Math.random() < 0.18 + power * 0.008) goals++;
  if (Math.random() < 0.08 + power * 0.006) goals++;
  if (Math.random() < 0.025 + power * 0.003) goals++;

  return Math.max(0, Math.min(goals, 6));
}

function simulateScore(home: Team, away: Team) {
  const homeStrength = home.strength ?? 70;
  const awayStrength = away.strength ?? 70;

  const homePower =
    homeStrength + 3 + randomInt(-10, 10);

  const awayPower =
    awayStrength + randomInt(-10, 10);

  const diff = homePower - awayPower;

  let homeGoals = generateGoals(diff / 10);
  let awayGoals = generateGoals(-diff / 10);

  // Litt ekstra fordel til klart sterkere lag, men ikke alltid.
  if (diff > 12 && Math.random() < 0.35) homeGoals++;
  if (diff < -12 && Math.random() < 0.35) awayGoals++;

  // Hold resultatene fotballrealistiske.
  homeGoals = Math.min(homeGoals, 6);
  awayGoals = Math.min(awayGoals, 6);

  function generateGoals(power: number) {
  let goals = 0;

  if (Math.random() < 0.62 + power * 0.012) goals++;
  if (Math.random() < 0.36 + power * 0.01) goals++;
  if (Math.random() < 0.18 + power * 0.008) goals++;
  if (Math.random() < 0.08 + power * 0.006) goals++;
  if (Math.random() < 0.025 + power * 0.003) goals++;

  return Math.max(0, Math.min(goals, 6));
}

  return {
    homeGoals,
    awayGoals,
  };
}

async function main() {
  const { data: matches, error: matchesError } = await supabase
    .from("rcc_competition_matches")
    .select("id, home_team_id, away_team_id, match_date, stage, played")
    .eq("stage", "group")
    .eq("played", false)
    .order("match_date", { ascending: true });

  if (matchesError) throw matchesError;

  if (!matches?.length) {
    console.log("Ingen uspilt gruppespillkamper funnet.");
    return;
  }

  const teamIds = Array.from(
    new Set(matches.flatMap((match) => [match.home_team_id, match.away_team_id]))
  );

  const { data: teams, error: teamsError } = await supabase
    .from("rcc_teams")
    .select("id, name, strength")
    .in("id", teamIds);

  if (teamsError) throw teamsError;

  const teamsById = new Map((teams ?? []).map((team) => [team.id, team]));

  console.log(`Simulerer ${matches.length} gruppespillkamper...\n`);

  for (const match of matches as Match[]) {
    const home = teamsById.get(match.home_team_id);
    const away = teamsById.get(match.away_team_id);

    if (!home || !away) {
      console.warn(`Hopper over kamp ${match.id}: mangler lagdata`);
      continue;
    }

    const result = simulateScore(home as Team, away as Team);

    const { error: updateError } = await supabase
      .from("rcc_competition_matches")
      .update({
        played: true,
        home_goals: result.homeGoals,
        away_goals: result.awayGoals,
      })
      .eq("id", match.id);

    if (updateError) throw updateError;

    console.log(
      `${home.name} ${result.homeGoals}-${result.awayGoals} ${away.name}`
    );
  }

  console.log("\nFerdig. Gruppespillet er simulert.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});