function pick<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)];
}

export function generateMatchHeadline(match: any, events: any[]) {
  if (!match.played) {
    return `${match.home?.name} – ${match.away?.name}`;
  }

  const homeGoals = match.home_goals ?? 0;
  const awayGoals = match.away_goals ?? 0;

  const homeWon = homeGoals > awayGoals;
  const awayWon = awayGoals > homeGoals;
  const draw = homeGoals === awayGoals;

  const totalGoals = homeGoals + awayGoals;
  const lastGoal = events[events.length - 1];

  if (draw) {
    if (totalGoals === 0) {
      return pick([
        "Ingen fant veien til nettet",
        "Målløs poengdeling",
        "Null mål, ett poeng hver",
      ]);
    }

    return pick([
      `Poengdeling mellom ${match.home?.name} og ${match.away?.name}`,
      `Ingen skilte lagene`,
      `${homeGoals}–${awayGoals} etter jevnt oppgjør`,
    ]);
  }

  const winner = homeWon ? match.home?.name : match.away?.name;

  if (lastGoal?.minute >= 85) {
    return pick([
      `${winner} avgjorde sent`,
      `${winner} tok seieren på tampen`,
      `Sen scoring sikret seier for ${winner}`,
    ]);
  }

  if (totalGoals >= 5) {
    return pick([
      `Målfest da ${winner} vant`,
      `${winner} vant i målrik kamp`,
      `${totalGoals} mål i underholdende oppgjør`,
    ]);
  }

  return pick([
    `${winner} tok alle poengene`,
    `${winner} sikret viktig seier`,
    `${winner} trakk det lengste strået`,
  ]);
}