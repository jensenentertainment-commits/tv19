import type { SimulatedRccMatch } from "@/lib/rcc/core/simulate-rcc-matches";
import { generateSimulatedMatchReport } from "@/lib/rcc/match/generate-match-report";

export type GeneratedSportsArticle = {
  title: string;
  kicker: string;
  ingress: string;
  body: string;
  slug: string;
  category: string;
};

function pick<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)];
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/æ/g, "ae")
    .replace(/ø/g, "o")
    .replace(/å/g, "a")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function generateTitle(match: SimulatedRccMatch) {
  const home = match.homeTeam.name;
  const away = match.awayTeam.name;
  const homeGoals = match.homeGoals;
  const awayGoals = match.awayGoals;

  const homeWon = homeGoals > awayGoals;
  const awayWon = awayGoals > homeGoals;
  const draw = homeGoals === awayGoals;

  const lastGoal = match.events.at(-1);

  const winningTeamId = homeWon
    ? match.homeTeam.id
    : awayWon
      ? match.awayTeam.id
      : null;

  const lateWinner =
    !draw &&
    lastGoal &&
    lastGoal.minute >= 85 &&
    lastGoal.teamId === winningTeamId;

  if (lateWinner) {
    const winner = homeWon ? home : away;

    return pick([
      `${winner} avgjorde sent`,
      `${winner} sikret seieren på tampen`,
      `Sen scoring ga ${winner} tre poeng`,
    ]);
  }

  if (draw) {
    if (homeGoals === 0) {
      return pick([
        `Målløst mellom ${home} og ${away}`,
        `${home} og ${away} delte poengene`,
        `Ingen mål da ${home} møtte ${away}`,
      ]);
    }

    return pick([
      `${home} og ${away} delte poengene`,
      `Uavgjort mellom ${home} og ${away}`,
      `Ingen vinner i møtet mellom ${home} og ${away}`,
    ]);
  }

  if (homeWon) {
    if (awayGoals === 0) {
      return pick([
        `${home} holdt nullen mot ${away}`,
        `${home} tok kontroll hjemme`,
        `${home} sikret en solid hjemmeseier`,
      ]);
    }

    return pick([
      `${home} slo ${away}`,
      `${home} tok tre poeng hjemme`,
      `${home} vant foran egne supportere`,
    ]);
  }

  if (homeGoals === 0) {
    return pick([
      `${away} holdt nullen og vant borte`,
      `${away} tok en sterk borteseier`,
      `${away} stengte igjen mot ${home}`,
    ]);
  }

  return pick([
    `${away} slo ${home} på bortebane`,
    `${away} tok med seg tre poeng`,
    `${away} leverte sterkt borte mot ${home}`,
  ]);
}

function generateIngress(match: SimulatedRccMatch) {
  const home = match.homeTeam.name;
  const away = match.awayTeam.name;

  if (match.homeGoals > match.awayGoals) {
    return `${home} tok tre poeng etter ${match.homeGoals}–${match.awayGoals} hjemme mot ${away} i runde ${match.round} av Royal County Championship.`;
  }

  if (match.awayGoals > match.homeGoals) {
    return `${away} tok tre poeng etter ${match.awayGoals}–${match.homeGoals} borte mot ${home} i runde ${match.round} av Royal County Championship.`;
  }

  return `${home} og ${away} delte poengene etter ${match.homeGoals}–${match.awayGoals} i runde ${match.round} av Royal County Championship.`;
}

function generateGoalList(match: SimulatedRccMatch) {
  if (!match.events.length) {
    return "";
  }

  const lines = match.events.map(
    (event) =>
      `${event.minute}' ${event.playerName} (${event.teamName})`
  );

  return [
    "",
    "[SUBHEADING]",
    "Mål",
    "[/SUBHEADING]",
    "",
    ...lines,
  ].join("\n");
}

export function generateSportsArticle(
  match: SimulatedRccMatch
): GeneratedSportsArticle {
  const title = generateTitle(match);
  const ingress = generateIngress(match);
  const report = generateSimulatedMatchReport(match);
  const goalList = generateGoalList(match);

  const body = [
    report,
    goalList,
    "",
    `[FACTBOX]`,
    `Resultat: ${match.homeTeam.name} ${match.homeGoals}–${match.awayGoals} ${match.awayTeam.name}`,
    `Runde: ${match.round}`,
    `Tilskuere: ${match.attendance.toLocaleString("no-NO")}`,
    `[/FACTBOX]`,
  ]
    .filter(Boolean)
    .join("\n\n");

  const slug = `${slugify(title)}-${match.matchId.slice(0, 8)}`;

  return {
    title,
    kicker: "ROYAL COUNTY CHAMPIONSHIP",
    ingress,
    body,
    slug,
    category: "Sport",
  };
}