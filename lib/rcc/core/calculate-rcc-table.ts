export type RccTableTeam = {
  id: string;
  name: string;
  crest_url?: string | null;
};

export type RccTableMatch = {
  home_team_id: string | null;
  away_team_id: string | null;
  home_goals: number | null;
  away_goals: number | null;
  played: boolean | null;
};

export type RccTableRow = {
  position: number;
  id: string;
  name: string;
  crest_url: string | null;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDiff: number;
  points: number;
};

export function calculateRccTable(
  teams: RccTableTeam[],
  matches: RccTableMatch[]
): RccTableRow[] {
  const playedMatches = matches.filter((match) => match.played);

  const rows = teams.map((team) => {
    let played = 0;
    let won = 0;
    let drawn = 0;
    let lost = 0;
    let goalsFor = 0;
    let goalsAgainst = 0;

    for (const match of playedMatches) {
      const isHome = match.home_team_id === team.id;
      const isAway = match.away_team_id === team.id;

      if (!isHome && !isAway) {
        continue;
      }

      const homeGoals = match.home_goals ?? 0;
      const awayGoals = match.away_goals ?? 0;

      const goalsScored = isHome ? homeGoals : awayGoals;
      const goalsConceded = isHome ? awayGoals : homeGoals;

      played++;
      goalsFor += goalsScored;
      goalsAgainst += goalsConceded;

      if (goalsScored > goalsConceded) {
        won++;
      } else if (goalsScored === goalsConceded) {
        drawn++;
      } else {
        lost++;
      }
    }

    return {
      position: 0,
      id: team.id,
      name: team.name,
      crest_url: team.crest_url ?? null,
      played,
      won,
      drawn,
      lost,
      goalsFor,
      goalsAgainst,
      goalDiff: goalsFor - goalsAgainst,
      points: won * 3 + drawn,
    };
  });

  rows.sort((a, b) => {
    if (b.points !== a.points) {
      return b.points - a.points;
    }

    if (b.goalDiff !== a.goalDiff) {
      return b.goalDiff - a.goalDiff;
    }

    if (b.goalsFor !== a.goalsFor) {
      return b.goalsFor - a.goalsFor;
    }

    return a.name.localeCompare(b.name, "no");
  });

  return rows.map((row, index) => ({
    ...row,
    position: index + 1,
  }));
}