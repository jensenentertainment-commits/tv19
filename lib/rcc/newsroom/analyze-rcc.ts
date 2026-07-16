import type { SupabaseClient } from "@supabase/supabase-js";
import {
  calculateRccTable,
  type RccTableRow,
} from "@/lib/rcc/core/calculate-rcc-table";
import type { SimulatedRccMatch } from "@/lib/rcc/core/simulate-rcc-matches";

export type RccTeamForm = {
  teamId: string;
  teamName: string;
  matches: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
  currentWinStreak: number;
  currentUnbeatenStreak: number;
  currentWinlessStreak: number;
  currentLossStreak: number;
};

export type RccScorerStat = {
  playerId: number;
  playerName: string;
  teamId: string;
  teamName: string;
  goals: number;
};

export type RccRoundAnalysis = {
  season: string;
  simulatedMatches: SimulatedRccMatch[];

  tableBefore: RccTableRow[];
  tableAfter: RccTableRow[];

  leaderBefore: RccTableRow | null;
  leaderAfter: RccTableRow | null;
  leaderChanged: boolean;

  formByTeamId: Map<string, RccTeamForm>;
  topScorers: RccScorerStat[];

  previousAttendanceRecord: number | null;
  currentAttendanceRecord: number | null;
};

type DatabaseMatch = {
  id: string;
  round: number;
  match_date: string | null;
  home_team_id: string | null;
  away_team_id: string | null;
  home_goals: number | null;
  away_goals: number | null;
  played: boolean | null;
  attendance: number | null;
};

type DatabaseTeam = {
  id: string;
  name: string;
  crest_url: string | null;
};

type DatabaseGoalEvent = {
  player_id: number;
  team_id: string;
  player: {
    id: number;
    name: string;
  } | null;
  team: {
    id: string;
    name: string;
  } | null;
};

function calculateTeamForm(
  team: DatabaseTeam,
  matches: DatabaseMatch[]
): RccTeamForm {
  const teamMatches = matches
    .filter(
      (match) =>
        match.played &&
        (match.home_team_id === team.id || match.away_team_id === team.id)
    )
    .sort((a, b) => {
      const firstDate = a.match_date
        ? new Date(a.match_date).getTime()
        : 0;

      const secondDate = b.match_date
        ? new Date(b.match_date).getTime()
        : 0;

      if (firstDate !== secondDate) {
        return secondDate - firstDate;
      }

      return b.round - a.round;
    });

  let wins = 0;
  let draws = 0;
  let losses = 0;
  let goalsFor = 0;
  let goalsAgainst = 0;

  let currentWinStreak = 0;
  let currentUnbeatenStreak = 0;
  let currentWinlessStreak = 0;
  let currentLossStreak = 0;

  let winStreakOpen = true;
  let unbeatenStreakOpen = true;
  let winlessStreakOpen = true;
  let lossStreakOpen = true;

  for (const match of teamMatches) {
    const isHome = match.home_team_id === team.id;

    const scored = isHome
      ? match.home_goals ?? 0
      : match.away_goals ?? 0;

    const conceded = isHome
      ? match.away_goals ?? 0
      : match.home_goals ?? 0;

    goalsFor += scored;
    goalsAgainst += conceded;

    const won = scored > conceded;
    const drawn = scored === conceded;
    const lost = scored < conceded;

    if (won) wins++;
    if (drawn) draws++;
    if (lost) losses++;

    if (winStreakOpen) {
      if (won) currentWinStreak++;
      else winStreakOpen = false;
    }

    if (unbeatenStreakOpen) {
      if (!lost) currentUnbeatenStreak++;
      else unbeatenStreakOpen = false;
    }

    if (winlessStreakOpen) {
      if (!won) currentWinlessStreak++;
      else winlessStreakOpen = false;
    }

    if (lossStreakOpen) {
      if (lost) currentLossStreak++;
      else lossStreakOpen = false;
    }
  }

  return {
    teamId: team.id,
    teamName: team.name,
    matches: teamMatches.length,
    wins,
    draws,
    losses,
    goalsFor,
    goalsAgainst,
    points: wins * 3 + draws,
    currentWinStreak,
    currentUnbeatenStreak,
    currentWinlessStreak,
    currentLossStreak,
  };
}

function calculateTopScorers(
  events: DatabaseGoalEvent[]
): RccScorerStat[] {
  const scorerMap = new Map<number, RccScorerStat>();

  for (const event of events) {
    if (!event.player || !event.team) {
      continue;
    }

    const current = scorerMap.get(event.player_id);

    if (current) {
      current.goals++;
      continue;
    }

    scorerMap.set(event.player_id, {
      playerId: event.player.id,
      playerName: event.player.name,
      teamId: event.team.id,
      teamName: event.team.name,
      goals: 1,
    });
  }

  return Array.from(scorerMap.values()).sort((a, b) => {
    if (b.goals !== a.goals) {
      return b.goals - a.goals;
    }

    return a.playerName.localeCompare(b.playerName, "no");
  });
}

export async function analyzeRccRound({
  supabase,
  season,
  simulatedMatches,
}: {
  supabase: SupabaseClient;
  season: string;
  simulatedMatches: SimulatedRccMatch[];
}): Promise<RccRoundAnalysis> {
  const simulatedMatchIds = new Set(
    simulatedMatches.map((match) => match.matchId)
  );

  const { data: teamsData, error: teamsError } = await supabase
    .from("rcc_teams")
    .select("id, name, crest_url")
    .eq("league_level", "RCC");

  if (teamsError) {
    throw teamsError;
  }

  const { data: matchesData, error: matchesError } = await supabase
    .from("rcc_matches")
    .select(
      `
        id,
        round,
        match_date,
        home_team_id,
        away_team_id,
        home_goals,
        away_goals,
        played,
        attendance
      `
    )
    .eq("season", season);

  if (matchesError) {
    throw matchesError;
  }

  const { data: eventsData, error: eventsError } = await supabase
    .from("rcc_match_events")
    .select(
      `
        player_id,
        team_id,
        player:rcc_players (
          id,
          name
        ),
        team:rcc_teams (
          id,
          name
        ),
        match:rcc_matches!inner (
          season,
          played
        )
      `
    )
    .eq("event_type", "goal")
    .eq("match.season", season)
    .eq("match.played", true);

  if (eventsError) {
    throw eventsError;
  }

  const teams = (teamsData ?? []) as DatabaseTeam[];
  const matches = (matchesData ?? []) as DatabaseMatch[];
  const events = (eventsData ?? []) as unknown as DatabaseGoalEvent[];

  const matchesBefore = matches.map((match) => {
    if (!simulatedMatchIds.has(match.id)) {
      return match;
    }

    return {
      ...match,
      played: false,
      home_goals: null,
      away_goals: null,
      attendance: null,
    };
  });

  const tableBefore = calculateRccTable(teams, matchesBefore);
  const tableAfter = calculateRccTable(teams, matches);

  const leaderBefore =
    tableBefore[0]?.played > 0 ? tableBefore[0] : null;

  const leaderAfter =
    tableAfter[0]?.played > 0 ? tableAfter[0] : null;

  const leaderChanged =
    Boolean(leaderAfter) &&
    leaderBefore?.id !== leaderAfter?.id;

  const formByTeamId = new Map<string, RccTeamForm>();

  for (const team of teams) {
    formByTeamId.set(team.id, calculateTeamForm(team, matches));
  }

  const topScorers = calculateTopScorers(events);

  const previousAttendances = matchesBefore
    .filter(
      (match) =>
        match.played &&
        typeof match.attendance === "number"
    )
    .map((match) => match.attendance as number);

  const currentAttendances = matches
    .filter(
      (match) =>
        match.played &&
        typeof match.attendance === "number"
    )
    .map((match) => match.attendance as number);

  const previousAttendanceRecord = previousAttendances.length
    ? Math.max(...previousAttendances)
    : null;

  const currentAttendanceRecord = currentAttendances.length
    ? Math.max(...currentAttendances)
    : null;

  return {
    season,
    simulatedMatches,

    tableBefore,
    tableAfter,

    leaderBefore,
    leaderAfter,
    leaderChanged,

    formByTeamId,
    topScorers,

    previousAttendanceRecord,
    currentAttendanceRecord,
  };
}