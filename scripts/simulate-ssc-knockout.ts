import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const COMPETITION_SLUG = "solaris-summer-cup";

type Team = {
  id: string;
  name: string;
  strength: number | null;
};

type Match = {
  id: string;
  competition_id: string;
  stage: string | null;
  round: number | null;
  match_date: string;
  home_team_id: string;
  away_team_id: string;
  played: boolean | null;
  home_goals: number | null;
  away_goals: number | null;
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

  const homePower = homeStrength + 2 + randomInt(-10, 10);
  const awayPower = awayStrength + randomInt(-10, 10);
  const diff = homePower - awayPower;

  let homeGoals = generateGoals(diff / 10);
  let awayGoals = generateGoals(-diff / 10);

  if (diff > 12 && Math.random() < 0.35) homeGoals++;
  if (diff < -12 && Math.random() < 0.35) awayGoals++;

  if (Math.random() < 0.08) {
    homeGoals += randomInt(0, 2);
    awayGoals += randomInt(0, 2);
  }

  homeGoals = Math.min(homeGoals, 6);
  awayGoals = Math.min(awayGoals, 6);

  // Sluttspill kan ikke ende uavgjort.
  if (homeGoals === awayGoals) {
    if (Math.random() < 0.5 + diff * 0.01) {
      homeGoals++;
    } else {
      awayGoals++;
    }
  }

  return { homeGoals, awayGoals };
}

function getWinnerId(match: Match) {
  if (!match.played || match.home_goals === null || match.away_goals === null) {
    throw new Error("Kan ikke finne vinner av uspilt kamp.");
  }

  return match.home_goals > match.away_goals
    ? match.home_team_id
    : match.away_team_id;
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

  const { data: groupMatches, error: groupError } = await supabase
    .from("rcc_competition_matches")
    .select("*")
    .eq("competition_id", competition.id)
    .eq("stage", "group")
    .order("match_date", { ascending: true });

  if (groupError) throw groupError;

  if (!groupMatches || groupMatches.length !== 28) {
    throw new Error(`Forventet 28 gruppespillkamper. Fant ${groupMatches?.length ?? 0}.`);
  }

  const unplayedGroupMatches = groupMatches.filter((match) => !match.played);

  if (unplayedGroupMatches.length > 0) {
    throw new Error(
      `Gruppespillet er ikke ferdig. ${unplayedGroupMatches.length} kamper gjenstår.`
    );
  }

  const teamIds = Array.from(
    new Set(
      groupMatches.flatMap((match) => [
        match.home_team_id,
        match.away_team_id,
      ])
    )
  );

  const { data: teams, error: teamsError } = await supabase
    .from("rcc_teams")
    .select("id,name,strength")
    .in("id", teamIds);

  if (teamsError) throw teamsError;

  const table = (teams ?? [])
    .map((team) => {
      let played = 0;
      let won = 0;
      let drawn = 0;
      let lost = 0;
      let goalsFor = 0;
      let goalsAgainst = 0;

      groupMatches.forEach((match) => {
        const isHome = match.home_team_id === team.id;
        const isAway = match.away_team_id === team.id;

        if (!isHome && !isAway) return;

        const gf = isHome ? match.home_goals ?? 0 : match.away_goals ?? 0;
        const ga = isHome ? match.away_goals ?? 0 : match.home_goals ?? 0;

        played++;
        goalsFor += gf;
        goalsAgainst += ga;

        if (gf > ga) won++;
        else if (gf === ga) drawn++;
        else lost++;
      });

      return {
        ...team,
        played,
        won,
        drawn,
        lost,
        goalsFor,
        goalsAgainst,
        goalDifference: goalsFor - goalsAgainst,
        points: won * 3 + drawn,
      };
    })
    .sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.goalDifference !== a.goalDifference) {
        return b.goalDifference - a.goalDifference;
      }
      return b.goalsFor - a.goalsFor;
    });

  const top4 = table.slice(0, 4);

  if (top4.length !== 4) {
    throw new Error("Klarte ikke finne topp 4.");
  }

  const teamsById = new Map((teams ?? []).map((team) => [team.id, team]));

  let { data: semifinals, error: semifinalFetchError } = await supabase
    .from("rcc_competition_matches")
    .select("*")
    .eq("competition_id", competition.id)
    .eq("stage", "semifinal")
    .order("match_date", { ascending: true });

  if (semifinalFetchError) throw semifinalFetchError;

  if (!semifinals?.length) {
    const semifinalRows = [
      {
        competition_id: competition.id,
        stage: "semifinal",
        round: 8,
        match_date: "2026-07-29T15:00:00",
        home_team_id: top4[0].id,
        away_team_id: top4[3].id,
        played: false,
      },
      {
        competition_id: competition.id,
        stage: "semifinal",
        round: 8,
        match_date: "2026-07-29T20:00:00",
        home_team_id: top4[1].id,
        away_team_id: top4[2].id,
        played: false,
      },
    ];

    const { error: insertSemiError } = await supabase
      .from("rcc_competition_matches")
      .insert(semifinalRows);

    if (insertSemiError) throw insertSemiError;

    const refetch = await supabase
      .from("rcc_competition_matches")
      .select("*")
      .eq("competition_id", competition.id)
      .eq("stage", "semifinal")
      .order("match_date", { ascending: true });

    if (refetch.error) throw refetch.error;

    semifinals = refetch.data ?? [];

    console.log("Opprettet semifinaler:");
    console.log(`${top4[0].name} vs ${top4[3].name}`);
    console.log(`${top4[1].name} vs ${top4[2].name}\n`);
  }

  for (const match of semifinals as Match[]) {
    if (match.played) continue;

    const home = teamsById.get(match.home_team_id);
    const away = teamsById.get(match.away_team_id);

    if (!home || !away) {
      throw new Error("Mangler lagdata for semifinale.");
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
      `Semifinale: ${home.name} ${result.homeGoals}-${result.awayGoals} ${away.name}`
    );
  }

  const { data: playedSemifinals, error: playedSemiError } = await supabase
    .from("rcc_competition_matches")
    .select("*")
    .eq("competition_id", competition.id)
    .eq("stage", "semifinal")
    .eq("played", true)
    .order("match_date", { ascending: true });

  if (playedSemiError) throw playedSemiError;

  if (!playedSemifinals || playedSemifinals.length !== 2) {
    throw new Error("Begge semifinaler må være spilt før finale kan opprettes.");
  }

  const finalistIds = playedSemifinals.map((match) =>
    getWinnerId(match as Match)
  );

  let { data: finalMatches, error: finalFetchError } = await supabase
    .from("rcc_competition_matches")
    .select("*")
    .eq("competition_id", competition.id)
    .eq("stage", "final");

  if (finalFetchError) throw finalFetchError;

  if (!finalMatches?.length) {
    const { error: insertFinalError } = await supabase
      .from("rcc_competition_matches")
      .insert({
        competition_id: competition.id,
        stage: "final",
        round: 9,
        match_date: "2026-08-01T18:00:00",
        home_team_id: finalistIds[0],
        away_team_id: finalistIds[1],
        played: false,
      });

    if (insertFinalError) throw insertFinalError;

    const refetchFinal = await supabase
      .from("rcc_competition_matches")
      .select("*")
      .eq("competition_id", competition.id)
      .eq("stage", "final");

    if (refetchFinal.error) throw refetchFinal.error;

    finalMatches = refetchFinal.data ?? [];

    const homeFinalist = teamsById.get(finalistIds[0]);
    const awayFinalist = teamsById.get(finalistIds[1]);

    console.log(
      `\nOpprettet finale: ${homeFinalist?.name} vs ${awayFinalist?.name}`
    );
  }

  const final = finalMatches?.[0] as Match | undefined;

  if (!final) {
    throw new Error("Fant ikke finale.");
  }

  if (!final.played) {
    const home = teamsById.get(final.home_team_id);
    const away = teamsById.get(final.away_team_id);

    if (!home || !away) {
      throw new Error("Mangler lagdata for finale.");
    }

    const result = simulateScore(home as Team, away as Team);

    const { error: finalUpdateError } = await supabase
      .from("rcc_competition_matches")
      .update({
        played: true,
        home_goals: result.homeGoals,
        away_goals: result.awayGoals,
      })
      .eq("id", final.id);

    if (finalUpdateError) throw finalUpdateError;

    const winner =
      result.homeGoals > result.awayGoals ? home.name : away.name;

    console.log(
      `Finale: ${home.name} ${result.homeGoals}-${result.awayGoals} ${away.name}`
    );

    console.log(`\n🏆 Solaris Summer Cup-vinner: ${winner}`);
  } else {
    const winnerId = getWinnerId(final);
    const winner = teamsById.get(winnerId);

    console.log(`Finalen er allerede spilt.`);
    console.log(`🏆 Solaris Summer Cup-vinner: ${winner?.name}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});