// lib/rcc/generate-match-report.ts

function pick<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)];
}

function formatNumber(value?: number | null) {
  if (!value) return "Et ukjent antall";
  return value.toLocaleString("no-NO");
}

export function generateMatchReport(match: any, events: any[]) {
  const homeName = match.home?.name ?? "Hjemmelaget";
  const awayName = match.away?.name ?? "Bortelaget";
  const stadium = match.home?.stadium ?? "stadion";

  if (!match.played) {
    return `${homeName} tar imot ${awayName} i Royal County Championship. TV19 Sport følger oppgjøret når kampen er spilt.`;
  }

  const homeGoals = match.home_goals ?? 0;
  const awayGoals = match.away_goals ?? 0;
  const totalGoals = homeGoals + awayGoals;

  const homeWon = homeGoals > awayGoals;
  const awayWon = awayGoals > homeGoals;
  const draw = homeGoals === awayGoals;

  const firstGoal = events[0];
  const lastGoal = events[events.length - 1];

  const attendance = formatNumber(match.attendance);

  const comeback =
    (homeWon && firstGoal?.team?.short_name === match.away?.short_name) ||
    (awayWon && firstGoal?.team?.short_name === match.home?.short_name);

  const lateWinner =
    !draw &&
    lastGoal &&
    lastGoal.minute >= 85 &&
    lastGoal.team?.short_name ===
      (homeWon ? match.home?.short_name : match.away?.short_name);

  const cleanSheet = homeGoals === 0 || awayGoals === 0;

  let intro = "";

  if (homeWon) {
    intro = comeback
      ? `${homeName} slo tilbake og vant ${homeGoals}–${awayGoals} hjemme mot ${awayName}.`
      : pick([
          `${homeName} tok alle tre poengene hjemme mot ${awayName} etter en ${homeGoals}–${awayGoals}-seier.`,
          `${homeName} gjorde jobben foran egne supportere og slo ${awayName} ${homeGoals}–${awayGoals}.`,
          `${homeName} kunne juble for hjemmeseier etter ${homeGoals}–${awayGoals} mot ${awayName}.`,
        ]);
  } else if (awayWon) {
    intro = comeback
      ? `${awayName} slo tilbake og vant ${awayGoals}–${homeGoals} borte mot ${homeName}.`
      : pick([
          `${awayName} tok med seg alle tre poengene fra ${stadium} etter en ${awayGoals}–${homeGoals}-seier.`,
          `${awayName} leverte sterkt på bortebane og slo ${homeName} ${awayGoals}–${homeGoals}.`,
          `${awayName} reiste hjem med seier etter å ha slått ${homeName} ${awayGoals}–${homeGoals}.`,
        ]);
  } else {
    intro =
      totalGoals === 0
        ? `${homeName} og ${awayName} delte poengene etter en målløs kamp på ${stadium}.`
        : pick([
            `${homeName} og ${awayName} måtte nøye seg med ett poeng hver etter ${homeGoals}–${awayGoals}.`,
            `${homeName} og ${awayName} spilte uavgjort ${homeGoals}–${awayGoals} etter en kamp som aldri helt bestemte seg.`,
            `Det endte ${homeGoals}–${awayGoals} mellom ${homeName} og ${awayName}.`,
          ]);
  }

  let story = "";

  if (totalGoals === 0) {
    story = pick([
      `Ingen av lagene klarte å finne veien til nettet, selv om kampen ifølge TV19s notater inneholdt flere perioder med det som kan beskrives som nesten-trykk.`,
      `Kampen hadde sine tilløp, men mål ble det ikke, til tross for flere situasjoner som i ettertid kan omtales som lovende.`,
      `Begge lag forsøkte å ta kontroll, men angrepsspillet stoppet ofte akkurat der publikum hadde begynt å håpe.`,
    ]);
  } else if (firstGoal && lastGoal && firstGoal !== lastGoal) {
    story = pick([
      `${firstGoal.player?.name ?? "En spiller"} åpnet målprotokollen etter ${firstGoal.minute} minutter, før ${lastGoal.player?.name ?? "en annen spiller"} sto for kampens siste scoring i det ${lastGoal.minute}. minutt.`,
      `${firstGoal.player?.name ?? "En spiller"} scoret kampens første mål etter ${firstGoal.minute} minutter. Siste ord fikk ${lastGoal.player?.name ?? "en annen spiller"} da kampen nærmet seg slutten.`,
      `Kampen fikk sin første scoring ved ${firstGoal.player?.name ?? "en spiller"} etter ${firstGoal.minute} minutter, mens ${lastGoal.player?.name ?? "en annen spiller"} satte punktum i det ${lastGoal.minute}. minutt.`,
    ]);
  } else if (firstGoal) {
    story = pick([
      `${firstGoal.player?.name ?? "Kampens eneste målscorer"} scoret kampens eneste mål etter ${firstGoal.minute} minutter.`,
      `Ett mål var nok. Det kom etter ${firstGoal.minute} minutter og ble satt inn av ${firstGoal.player?.name ?? "kampens eneste målscorer"}.`,
      `${firstGoal.player?.name ?? "Kampens eneste målscorer"} ble avgjørende med kampens eneste scoring.`,
    ]);
  }

  let ending = "";

  if (lateWinner) {
    ending = pick([
      `Avgjørelsen kom helt på tampen, noe som gjorde avslutningen betydelig mer dramatisk enn det lenge så ut til å bli.`,
      `Kampen ble avgjort sent, på et tidspunkt der flere allerede hadde begynt å formulere konklusjoner som måtte slettes.`,
      `Det hele vippet helt mot slutten, og siste scoring endret både stemningen og poengfordelingen.`,
    ]);
  } else if (comeback) {
    ending = pick([
      `Kampen ble dermed et lite bevis på at ledelse fortsatt ikke er det samme som kontroll.`,
      `Snuoperasjonen sørget for at kampen fikk en langt mer dramatisk utvikling enn hjemmepublikummet hadde bestilt.`,
      `Det ble en påminnelse om at ingen resultater i RCC bør anses som ferdigbehandlet før dommeren faktisk er ferdig.`,
    ]);
  } else if (cleanSheet && !draw) {
    const winner = homeWon ? homeName : awayName;
    ending = pick([
      `${winner} holdt nullen og kunne reise videre med både poeng og en følelse av defensiv orden.`,
      `${winner} slapp ikke inn mål, noe som i etterkant ble omtalt som praktisk for tabellen.`,
      `${winner} fikk med seg seier og rent bur, en kombinasjon trenere ofte hevder å sette pris på.`,
    ]);
  } else if (totalGoals >= 5) {
    ending = pick([
      `For de nøytrale ble det en underholdende affære med nok mål til at flere taktiske forklaringer måtte revideres underveis.`,
      `Det ble en kamp med høyt støynivå, mange scoringer og begrenset behov for defensiv hyllest.`,
      `Målene kom tett nok til at enkelte tilskuere knapt rakk å sette seg før neste situasjon oppsto.`,
    ]);
  } else if (draw) {
    ending = pick([
      `Begge lagene hadde sine perioder i kampen, men ingen klarte å vippe oppgjøret helt i sin retning.`,
      `Poengdelingen fremstår som et resultat begge lag kan forklare, men neppe feire særlig lenge.`,
      `Ingen av lagene klarte å skape nok avstand til at kampen fikk en tydelig eier.`,
    ]);
  } else {
    ending = pick([
      `Seieren gir laget en god start på en sesong der svært mye fortsatt omtales som åpent.`,
      `Resultatet gir vinnerlaget noe å bygge videre på, mens taperlaget må forholde seg til begrepet tidlig i sesongen.`,
      `Tre poeng ble med videre, sammen med en håndfull spørsmål TV19 Sport foreløpig lar ligge.`,
    ]);
  }

  const attendanceLine = pick([
    `${attendance} tilskuere var til stede på ${stadium}.`,
    `${stadium} dannet rammen rundt oppgjøret foran ${attendance} tilskuere.`,
    `${attendance} supportere hadde funnet veien til ${stadium}.`,
    `Publikumstallet ble registrert til ${attendance} på ${stadium}.`,
    `${stadium} var vertskap for ${attendance} tilskuere denne runden.`,
  ]);

  return `${intro} ${story} ${ending} ${attendanceLine}`;
}