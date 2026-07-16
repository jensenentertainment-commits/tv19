import type { SimulatedRccMatch } from "@/lib/rcc/core/simulate-rcc-matches";
import type {
  RccRoundAnalysis,
  RccTeamForm,
} from "./analyze-rcc";

export type RccStoryType =
  | "NEW_LEADER"
  | "FIRST_WIN"
  | "HATTRICK"
  | "BEAT_LEADER"
  | "WINLESS_STREAK"
  | "BIG_WIN"
  | "ATTENDANCE_RECORD";

export type RccStoryCandidate = {
  type: RccStoryType;
  priority: number;
  deduplicationKey: string;
  titleHint: string;
  matchId?: string;
  teamId?: string;
  playerId?: number;
  round?: number;
  data: Record<string, unknown>;
};

function findTeamForm(
  analysis: RccRoundAnalysis,
  teamId: string
): RccTeamForm | null {
  return analysis.formByTeamId.get(teamId) ?? null;
}

function getWinner(match: SimulatedRccMatch) {
  if (match.homeGoals > match.awayGoals) {
    return {
      team: match.homeTeam,
      goals: match.homeGoals,
      opponent: match.awayTeam,
      opponentGoals: match.awayGoals,
      home: true,
    };
  }

  if (match.awayGoals > match.homeGoals) {
    return {
      team: match.awayTeam,
      goals: match.awayGoals,
      opponent: match.homeTeam,
      opponentGoals: match.homeGoals,
      home: false,
    };
  }

  return null;
}

function detectNewLeader(
  analysis: RccRoundAnalysis
): RccStoryCandidate[] {
  if (!analysis.leaderChanged || !analysis.leaderAfter) {
    return [];
  }

  const latestRound = Math.max(
    ...analysis.simulatedMatches.map((match) => match.round)
  );

  /*
   * Etter første og andre serierunde skifter tabellen ofte leder
   * uten at det nødvendigvis er særlig interessant.
   */
  if (latestRound < 3) {
    return [];
  }

  return [
    {
      type: "NEW_LEADER",
      priority: 95,
      deduplicationKey: `rcc:new-leader:${analysis.leaderAfter.id}:round-${latestRound}`,
      titleHint: `${analysis.leaderAfter.name} overtar tabelltoppen`,
      teamId: analysis.leaderAfter.id,
      round: latestRound,
      data: {
        team: analysis.leaderAfter,
        previousLeader: analysis.leaderBefore,
        table: analysis.tableAfter,
      },
    },
  ];
}

function detectFirstWins(
  analysis: RccRoundAnalysis
): RccStoryCandidate[] {
  const candidates: RccStoryCandidate[] = [];

  for (const match of analysis.simulatedMatches) {
    const winner = getWinner(match);

    if (!winner) {
      continue;
    }

    const form = findTeamForm(analysis, winner.team.id);

    if (!form) {
      continue;
    }

    /*
     * Laget må ha spilt minst fem kamper totalt og dette må være
     * sesongens første seier.
     */
    if (form.matches < 5 || form.wins !== 1) {
      continue;
    }

    candidates.push({
      type: "FIRST_WIN",
      priority: 85,
      deduplicationKey: `rcc:first-win:${winner.team.id}:${analysis.season}`,
      titleHint: `${winner.team.name} tok sesongens første seier`,
      matchId: match.matchId,
      teamId: winner.team.id,
      round: match.round,
      data: {
        match,
        team: winner.team,
        opponent: winner.opponent,
        matchesBeforeWin: form.matches - 1,
      },
    });
  }

  return candidates;
}

function detectHattricks(
  analysis: RccRoundAnalysis
): RccStoryCandidate[] {
  const candidates: RccStoryCandidate[] = [];

  for (const match of analysis.simulatedMatches) {
    const goalsByPlayer = new Map<
      number,
      {
        playerId: number;
        playerName: string;
        teamId: string;
        teamName: string;
        goals: number;
      }
    >();

    for (const event of match.events) {
      const current = goalsByPlayer.get(event.playerId);

      if (current) {
        current.goals++;
        continue;
      }

      goalsByPlayer.set(event.playerId, {
        playerId: event.playerId,
        playerName: event.playerName,
        teamId: event.teamId,
        teamName: event.teamName,
        goals: 1,
      });
    }

    for (const scorer of goalsByPlayer.values()) {
      if (scorer.goals < 3) {
        continue;
      }

      candidates.push({
        type: "HATTRICK",
        priority: scorer.goals >= 4 ? 90 : 82,
        deduplicationKey: `rcc:hattrick:${match.matchId}:${scorer.playerId}`,
        titleHint:
          scorer.goals >= 4
            ? `${scorer.playerName} scoret fire mål`
            : `${scorer.playerName} scoret hattrick`,
        matchId: match.matchId,
        playerId: scorer.playerId,
        teamId: scorer.teamId,
        round: match.round,
        data: {
          match,
          scorer,
        },
      });
    }
  }

  return candidates;
}

function detectLeaderDefeats(
  analysis: RccRoundAnalysis
): RccStoryCandidate[] {
  if (!analysis.leaderBefore) {
    return [];
  }

  const candidates: RccStoryCandidate[] = [];

  for (const match of analysis.simulatedMatches) {
    const winner = getWinner(match);

    if (!winner) {
      continue;
    }

    if (winner.opponent.id !== analysis.leaderBefore.id) {
      continue;
    }

    /*
     * Dersom den tidligere serielederen fortsatt leder etter runden,
     * er seieren fortsatt interessant, men litt mindre dramatisk.
     */
    const leaderLostTopSpot =
      analysis.leaderAfter?.id !== analysis.leaderBefore.id;

    candidates.push({
      type: "BEAT_LEADER",
      priority: leaderLostTopSpot ? 88 : 80,
      deduplicationKey: `rcc:beat-leader:${match.matchId}`,
      titleHint: `${winner.team.name} slo serielederen`,
      matchId: match.matchId,
      teamId: winner.team.id,
      round: match.round,
      data: {
        match,
        winner: winner.team,
        defeatedLeader: analysis.leaderBefore,
        leaderLostTopSpot,
      },
    });
  }

  return candidates;
}

function detectWinlessStreaks(
  analysis: RccRoundAnalysis
): RccStoryCandidate[] {
  const candidates: RccStoryCandidate[] = [];

  for (const match of analysis.simulatedMatches) {
    const involvedTeams = [match.homeTeam, match.awayTeam];

    for (const team of involvedTeams) {
      const form = findTeamForm(analysis, team.id);

      if (!form || form.currentWinlessStreak < 6) {
        continue;
      }

      /*
       * Publiser ved konkrete milepæler, ikke hver eneste runde.
       * Ellers får samme lag en ny nesten identisk sak kontinuerlig.
       */
      if (![6, 8, 10, 12].includes(form.currentWinlessStreak)) {
        continue;
      }

      candidates.push({
        type: "WINLESS_STREAK",
        priority:
          form.currentWinlessStreak >= 10
            ? 85
            : form.currentWinlessStreak >= 8
              ? 80
              : 75,
        deduplicationKey: `rcc:winless:${team.id}:${form.currentWinlessStreak}`,
        titleHint: `${team.name} har gått ${form.currentWinlessStreak} kamper uten seier`,
        matchId: match.matchId,
        teamId: team.id,
        round: match.round,
        data: {
          team,
          form,
          match,
        },
      });
    }
  }

  return candidates;
}

function detectBigWins(
  analysis: RccRoundAnalysis
): RccStoryCandidate[] {
  const candidates: RccStoryCandidate[] = [];

  for (const match of analysis.simulatedMatches) {
    const winner = getWinner(match);

    if (!winner) {
      continue;
    }

    const goalDifference = winner.goals - winner.opponentGoals;

    if (goalDifference < 4) {
      continue;
    }

    candidates.push({
      type: "BIG_WIN",
      priority:
        goalDifference >= 6
          ? 85
          : goalDifference >= 5
            ? 78
            : 70,
      deduplicationKey: `rcc:big-win:${match.matchId}`,
      titleHint: `${winner.team.name} vant stort mot ${winner.opponent.name}`,
      matchId: match.matchId,
      teamId: winner.team.id,
      round: match.round,
      data: {
        match,
        winner: winner.team,
        opponent: winner.opponent,
        goalDifference,
      },
    });
  }

  return candidates;
}

function detectAttendanceRecord(
  analysis: RccRoundAnalysis
): RccStoryCandidate[] {
  const previousRecord = analysis.previousAttendanceRecord;

  if (previousRecord === null) {
    return [];
  }

  const recordMatch = analysis.simulatedMatches
    .filter((match) => match.attendance > previousRecord)
    .sort((a, b) => b.attendance - a.attendance)[0];

  if (!recordMatch) {
    return [];
  }

  return [
    {
      type: "ATTENDANCE_RECORD",
      priority: 72,
      deduplicationKey: `rcc:attendance-record:${recordMatch.matchId}`,
      titleHint: `Ny publikumsrekord i RCC`,
      matchId: recordMatch.matchId,
      teamId: recordMatch.homeTeam.id,
      round: recordMatch.round,
      data: {
        match: recordMatch,
        previousRecord,
        newRecord: recordMatch.attendance,
      },
    },
  ];
}

export function detectRccStories(
  analysis: RccRoundAnalysis
): RccStoryCandidate[] {
  const candidates = [
    ...detectNewLeader(analysis),
    ...detectFirstWins(analysis),
    ...detectHattricks(analysis),
    ...detectLeaderDefeats(analysis),
    ...detectWinlessStreaks(analysis),
    ...detectBigWins(analysis),
    ...detectAttendanceRecord(analysis),
  ];

  return candidates.sort((a, b) => b.priority - a.priority);
}