import type { SupabaseClient } from "@supabase/supabase-js";

const DEFAULT_SEASON = "2026/27";

type Team = {
  id: string;
  name: string;
  strength: number | null;
  capacity: number | null;
  stadium: string | null;
};

type Match = {
  id: string;
  round: number;
  match_date: string | null;
  home_team_id: string | null;
  away_team_id: string | null;
  played: boolean | null;
};

type Player = {
  id: number;
  team_id: string;
  name: string;
  position: "GK" | "DEF" | "MID" | "ATT";
  rating: number;
};

type GoalEvent = {
  match_id: string;
  team_id: string;
  player_id: number;
  minute: number;
  event_type: "goal";
};

export type SimulatedRccMatch = {
  matchId: string;
  round: number;
  matchDate: string | null;
  homeTeam: Team;
  awayTeam: Team;
  homeGoals: number;
  awayGoals: number;
  attendance: number;
  events: Array<{
    teamId: string;
    teamName: string;
    playerId: number;
    playerName: string;
    minute: number;
  }>;
};

type SimulateRccOptions = {
  season?: string;
  dueOnly?: boolean;
};

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle<T>(items: T[]) {
  const shuffled = [...items];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = randomInt(0, i);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

function generateGoals(power: number) {
  let goals = 0;

  if (Math.random() < 0.66 + power * 0.012) goals++;
  if (Math.random() < 0.4 + power * 0.01) goals++;
  if (Math.random() < 0.22 + power * 0.008) goals++;
  if (Math.random() < 0.1 + power * 0.006) goals++;
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

  if (diff > 12 && Math.random() < 0.35) {
    homeGoals++;
  }

  if (diff < -12 && Math.random() < 0.35) {
    awayGoals++;
  }

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

    if (roll <= 0) {
      return item.player;
    }
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

function generateAttendance(
  home: Team,
  homeGoals: number,
  awayGoals: number
) {
  const capacity = home.capacity ?? 10_000;

  let fillRate = 0.58 + Math.random() * 0.28;

  if ((home.strength ?? 70) >= 82) {
    fillRate += 0.08;
  }

  if (homeGoals + awayGoals >= 4) {
    fillRate += 0.04;
  }

  fillRate = Math.min(fillRate, 0.98);

  return Math.round(capacity * fillRate);
}

function createGoalEvents({
  matchId,
  home,
  away,
  homePlayers,
  awayPlayers,
  homeGoals,
  awayGoals,
}: {
  matchId: string;
  home: Team;
  away: Team;
  homePlayers: Player[];
  awayPlayers: Player[];
  homeGoals: number;
  awayGoals: number;
}) {
  const totalGoals = homeGoals + awayGoals;
  const goalMinutes = generateGoalMinutes(totalGoals);

  /*
   * Lager først en liste over hvilket lag som scorer hvert mål,
   * og blander den. Dermed får ikke hjemmelaget automatisk alle
   * de tidligste målene.
   */
  const scoringTeams = shuffle([
    ...Array(homeGoals).fill("home" as const),
    ...Array(awayGoals).fill("away" as const),
  ]);

  const events: GoalEvent[] = scoringTeams.map((scoringTeam, index) => {
    const isHomeGoal = scoringTeam === "home";
    const team = isHomeGoal ? home : away;
    const players = isHomeGoal ? homePlayers : awayPlayers;
    const scorer = pickScorer(players);

    return {
      match_id: matchId,
      team_id: team.id,
      player_id: scorer.id,
      minute: goalMinutes[index],
      event_type: "goal",
    };
  });

  return events.sort((a, b) => a.minute - b.minute);
}

export async function simulateRccMatches(
  supabase: SupabaseClient,
  options: SimulateRccOptions = {}
): Promise<SimulatedRccMatch[]> {
  const season = options.season ?? DEFAULT_SEASON;
  const dueOnly = options.dueOnly ?? true;

  let matchesQuery = supabase
    .from("rcc_matches")
    .select(
      `
        id,
        round,
        match_date,
        home_team_id,
        away_team_id,
        played
      `
    )
    .eq("season", season)
    .eq("played", false)
    .order("match_date", { ascending: true });

  if (dueOnly) {
    matchesQuery = matchesQuery
      .not("match_date", "is", null)
      .lte("match_date", new Date().toISOString());
  }

  const { data: matchesData, error: matchesError } = await matchesQuery;

  if (matchesError) {
    throw matchesError;
  }

  const matches = (matchesData ?? []) as Match[];

  if (!matches.length) {
    return [];
  }

  const teamIds = Array.from(
    new Set(
      matches.flatMap((match) =>
        [match.home_team_id, match.away_team_id].filter(
          (teamId): teamId is string => Boolean(teamId)
        )
      )
    )
  );

  const { data: teamsData, error: teamsError } = await supabase
    .from("rcc_teams")
   .select("id, name, strength, capacity, stadium")
    .in("id", teamIds);

  if (teamsError) {
    throw teamsError;
  }

  const { data: playersData, error: playersError } = await supabase
    .from("rcc_players")
    .select("id, team_id, name, position, rating")
    .in("team_id", teamIds);

  if (playersError) {
    throw playersError;
  }

  const teams = (teamsData ?? []) as Team[];
  const players = (playersData ?? []) as Player[];

  const teamsById = new Map(teams.map((team) => [team.id, team]));
  const playersByTeamId = new Map<string, Player[]>();

  for (const player of players) {
    const teamPlayers = playersByTeamId.get(player.team_id) ?? [];
    teamPlayers.push(player);
    playersByTeamId.set(player.team_id, teamPlayers);
  }

  const simulatedMatches: SimulatedRccMatch[] = [];

  for (const match of matches) {
    if (!match.home_team_id || !match.away_team_id) {
      console.warn(`Hopper over kamp ${match.id}: mangler lag-ID.`);
      continue;
    }

    const home = teamsById.get(match.home_team_id);
    const away = teamsById.get(match.away_team_id);

    if (!home || !away) {
      console.warn(`Hopper over kamp ${match.id}: mangler lagdata.`);
      continue;
    }

    const homePlayers = playersByTeamId.get(home.id) ?? [];
    const awayPlayers = playersByTeamId.get(away.id) ?? [];

    if (!homePlayers.length || !awayPlayers.length) {
      console.warn(
        `Hopper over ${home.name} – ${away.name}: mangler spillere.`
      );
      continue;
    }

    const result = simulateScore(home, away);

    const attendance = generateAttendance(
      home,
      result.homeGoals,
      result.awayGoals
    );

    const events = createGoalEvents({
      matchId: match.id,
      home,
      away,
      homePlayers,
      awayPlayers,
      homeGoals: result.homeGoals,
      awayGoals: result.awayGoals,
    });

    const { error: deleteOldEventsError } = await supabase
      .from("rcc_match_events")
      .delete()
      .eq("match_id", match.id);

    if (deleteOldEventsError) {
      throw deleteOldEventsError;
    }

    if (events.length) {
      const { error: eventsError } = await supabase
        .from("rcc_match_events")
        .insert(events);

      if (eventsError) {
        throw eventsError;
      }
    }

    const { error: updateError } = await supabase
      .from("rcc_matches")
      .update({
        played: true,
        home_goals: result.homeGoals,
        away_goals: result.awayGoals,
        attendance,
      })
      .eq("id", match.id)
      .eq("played", false);

    if (updateError) {
      throw updateError;
    }

    const allPlayers = [...homePlayers, ...awayPlayers];

    const returnedEvents = events.map((event) => {
      const scorer = allPlayers.find(
        (player) => player.id === event.player_id
      );

      return {
        teamId: event.team_id,
        teamName:
          event.team_id === home.id ? home.name : away.name,
        playerId: event.player_id,
        playerName: scorer?.name ?? "Ukjent spiller",
        minute: event.minute,
      };
    });

    simulatedMatches.push({
      matchId: match.id,
      round: match.round,
      matchDate: match.match_date,
      homeTeam: home,
      awayTeam: away,
      homeGoals: result.homeGoals,
      awayGoals: result.awayGoals,
      attendance,
      events: returnedEvents,
    });
  }

  return simulatedMatches;
}