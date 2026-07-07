import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const SEASON = "2026/27";

type Team = {
  id: string;
  name: string;
  strength: number | null;
  capacity: number | null;
};

type Match = {
  id: string;
  home_team_id: string;
  away_team_id: string;
  played: boolean | null;
};

type Player = {
  id: number;
  team_id: string;
  name: string;
  position: "GK" | "DEF" | "MID" | "ATT";
  rating: number;
};

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateGoals(power: number) {
  let goals = 0;

  if (Math.random() < 0.66 + power * 0.012) goals++;
  if (Math.random() < 0.40 + power * 0.01) goals++;
  if (Math.random() < 0.22 + power * 0.008) goals++;
  if (Math.random() < 0.10 + power * 0.006) goals++;
  if (Math.random() < 0.04 + power * 0.003) goals++;

  return Math.max(0, Math.min(goals, 7));
}

function simulateScore(home: Team, away: Team) {
  const homeStrength = home.strength ?? 70;
  const awayStrength = away.strength ?? 70;

  const homePower = homeStrength + 3 + randomInt(-10, 10);
  const awayPower = awayStrength + randomInt(-10, 10);

  const diff = homePower - awayPower;

  let homeGoals = generateGoals(diff / 10);
  let awayGoals = generateGoals(-diff / 10);

  if (diff > 12 && Math.random() < 0.35) homeGoals++;
  if (diff < -12 && Math.random() < 0.35) awayGoals++;

  if (Math.random() < 0.14) {
    homeGoals += randomInt(0, 2);
    awayGoals += randomInt(0, 2);
  }

  return {
    homeGoals: Math.min(homeGoals, 6),
    awayGoals: Math.min(awayGoals, 6),
  };
}

function scorerWeight(player: Player) {
  if (player.position === "ATT") return 60 + player.rating;
  if (player.position === "MID") return 25 + player.rating * 0.6;
  if (player.position === "DEF") return 7 + player.rating * 0.2;
  return 1;
}

function pickScorer(players: Player[]) {
  const weighted = players.map((player) => ({
    player,
    weight: scorerWeight(player),
  }));

  const total = weighted.reduce((sum, item) => sum + item.weight, 0);
  let roll = Math.random() * total;

  for (const item of weighted) {
    roll -= item.weight;
    if (roll <= 0) return item.player;
  }

  return weighted[0].player;
}

function generateGoalMinutes(totalGoals: number) {
  const minutes = new Set<number>();

  while (minutes.size < totalGoals) {
    minutes.add(randomInt(3, 90));
  }

  return Array.from(minutes).sort((a, b) => a - b);
}

function generateAttendance(home: Team, homeGoals: number, awayGoals: number) {
  const capacity = home.capacity ?? 10000;

  let fillRate = 0.58 + Math.random() * 0.28;

  if ((home.strength ?? 70) >= 82) fillRate += 0.08;
  if (homeGoals + awayGoals >= 4) fillRate += 0.04;

  fillRate = Math.min(fillRate, 0.98);

  return Math.round(capacity * fillRate);
}

async function main() {
  const { data: matches, error: matchesError } = await supabase
    .from("rcc_matches")
    .select("id, home_team_id, away_team_id, played")
    .eq("season", SEASON)
    .eq("played", false);

  if (matchesError) throw matchesError;

  if (!matches?.length) {
    console.log("Ingen uspilt RCC-kamper funnet.");
    return;
  }

  const teamIds = Array.from(
    new Set(matches.flatMap((match) => [match.home_team_id, match.away_team_id]))
  );

  const { data: teams, error: teamsError } = await supabase
    .from("rcc_teams")
    .select("id, name, strength, capacity")
    .in("id", teamIds);

  if (teamsError) throw teamsError;

  const { data: players, error: playersError } = await supabase
    .from("rcc_players")
    .select("id, team_id, name, position, rating")
    .in("team_id", teamIds);

  if (playersError) throw playersError;

  const teamsById = new Map((teams ?? []).map((team) => [team.id, team]));
  const playersByTeamId = new Map<string, Player[]>();

  for (const player of (players ?? []) as Player[]) {
    const current = playersByTeamId.get(player.team_id) ?? [];
    current.push(player);
    playersByTeamId.set(player.team_id, current);
  }

  console.log(`Simulerer ${matches.length} RCC-kamper...\n`);

  for (const match of matches as Match[]) {
    const home = teamsById.get(match.home_team_id) as Team | undefined;
    const away = teamsById.get(match.away_team_id) as Team | undefined;

    if (!home || !away) {
      console.warn(`Hopper over kamp ${match.id}: mangler lagdata`);
      continue;
    }

    const homePlayers = playersByTeamId.get(home.id) ?? [];
    const awayPlayers = playersByTeamId.get(away.id) ?? [];

    if (!homePlayers.length || !awayPlayers.length) {
      console.warn(`Hopper over ${home.name} - ${away.name}: mangler spillere`);
      continue;
    }

    const result = simulateScore(home, away);
    const attendance = generateAttendance(home, result.homeGoals, result.awayGoals);

    const totalGoals = result.homeGoals + result.awayGoals;
    const goalMinutes = generateGoalMinutes(totalGoals);

    const events = [];

    for (let i = 0; i < result.homeGoals; i++) {
      const scorer = pickScorer(homePlayers);

      events.push({
        match_id: match.id,
        team_id: home.id,
        player_id: scorer.id,
        minute: goalMinutes.shift()!,
        event_type: "goal",
      });
    }

    for (let i = 0; i < result.awayGoals; i++) {
      const scorer = pickScorer(awayPlayers);

      events.push({
        match_id: match.id,
        team_id: away.id,
        player_id: scorer.id,
        minute: goalMinutes.shift()!,
        event_type: "goal",
      });
    }

    events.sort((a, b) => a.minute - b.minute);

    const { error: deleteOldEventsError } = await supabase
      .from("rcc_match_events")
      .delete()
      .eq("match_id", match.id);

    if (deleteOldEventsError) throw deleteOldEventsError;

    if (events.length) {
      const { error: eventsError } = await supabase
        .from("rcc_match_events")
        .insert(events);

      if (eventsError) throw eventsError;
    }

    const { error: updateError } = await supabase
      .from("rcc_matches")
      .update({
        played: true,
        home_goals: result.homeGoals,
        away_goals: result.awayGoals,
        attendance,
      })
      .eq("id", match.id);

    if (updateError) throw updateError;

    console.log(
      `${home.name} ${result.homeGoals}-${result.awayGoals} ${away.name} (${attendance.toLocaleString("no-NO")} tilskuere)`
    );

    for (const event of events) {
      const allPlayers = [...homePlayers, ...awayPlayers];
      const scorer = allPlayers.find((player) => player.id === event.player_id);

      console.log(`  ${event.minute}' ${scorer?.name ?? "Ukjent"}`);
    }
  }

  console.log("\nFerdig. RCC-sesongen er simulert med målscorere og tilskuertall.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});