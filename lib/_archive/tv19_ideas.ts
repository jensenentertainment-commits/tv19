// lib/tv19-data.ts
export const BULLETINS = [
  { id: "b1", section: "SISTE", title: "Norge skal arrangere vinter-OL.", href: "/a/ol" },
  { id: "b2", section: "TEKNOLOGI", title: "Smarttelefonen er kommet for å bli." },
  { id: "b3", section: "KULTUR", title: "Melodi Grand Prix arrangeres igjen.", href: "/a/mgp" },
  { id: "b4", section: "VERDEN", title: "Et møte avholdes etter at møtet ble avtalt." },
  { id: "b5", section: "ØKONOMI", title: "Markedet reagerer rolig på at markedet reagerer rolig." },
  { id: "b6", section: "SPORT", title: "Treneren: laget må bli bedre til å bli bedre." },
  { id: "b7", section: "Norge", title: "Ny vurdering varsles etter tidligere vurdering.", badge: "MELDING" },
  { id: "b8", section: "Verden", title: "Uttalelser følges opp med nye uttalelser.", badge: "PÅGÅR", href: "/a/uttalelser" },
  { id: "b9", section: "Teknologi", title: "Oppdatering lanseres for å forbedre opplevelsen av lansering.", badge: "VIDEO" },
  { id: "b10", section: "Kultur", title: "Ny satsing presenteres med vekt på at det er en satsing." },
  { id: "b11", section: "Norge", title: "Det avventes avklaring etter at avklaring ble avventet." },
  { id: "b12", section: "Økonomi", title: "Ny gjennomgang gjennomgås før ekstern gjennomgang kan gjennomgås." },
  { id: "b13", section: "Verden", title: "Dialogen fortsetter å fortsette, bekrefter partene." },
  { id: "b14", section: "Sport", title: "Situasjonen omtales som under utvikling.", badge: "PÅGÅR" },
  { id: "b15", section: "Teknologi", title: "Grensesnittet endres uten at endringen merkes." },
  { id: "b16", section: "Kultur", title: "Programmet fortsetter – det jobbes med å fortsette programmet.", href: "/a/programmet" },
  { id: "b17", section: "Norge", title: "Plan foreligger for videre planlegging.", badge: "MELDING" },
  { id: "b18", section: "Verden", title: "Situasjonen omtales som pågående – redaksjonen følger utviklingen." },
  // legg gjerne til flere – designet tåler 60+ items
  { id: "b19", section: "Økonomi", title: "Rapport peker på behovet for en rapport som kan peke på behov." },
  { id: "b20", section: "Norge", title: "Det foreligger informasjon. Utfallet omtales ikke, men behandles som nært." },
  { id: "b21", section: "Teknologi", title: "Ny løsning omtales som fremtidig, uten nærmere tidfesting.", badge: "PÅGÅR" },
  { id: "b22", section: "Kultur", title: "Enighet om behovet for fremdrift. Uenighet om hva fremdrift er." },
  { id: "b23", section: "Sport", title: "En plan er klar. Planen er ikke endelig.", href: "/a/plan" },
  { id: "b24", section: "Verden", title: "Uttalelse omtales som viktig – uten at viktigheten utdypes." },
  { id: "b25", section: "Norge", title: "Nytt møte planlegges for å planlegge videre møter." },
];

export const SENDINGER = [
  { id: "s1", label: "SENDING PÅGÅR", title: "Oppdatering omtales som oppdatering.", href: "/video/1" },
  { id: "s2", label: "SISTE SENDING", title: "Det gis en rolig oppdatering med høy troverdighet.", href: "/video/2" },
  { id: "s3", label: "TIDLIGERE", title: "Studioet var klart. Sendingen gikk som planlagt.", href: "/video/3" },
];

export const DEBATT = {
  title: "Debatt sendes som planlagt",
  body:
    "Studioet er klart. Sendingen går. Programleder er ikke til stede. Formatet opprettholdes.",
  status: "Aktivt",
};

export const MAGASIN = {
  title: "Tema behandles som uavklart",
  body:
    "Et historisk avklart tema omtales som om konsekvensene fortsatt er åpne. Ingen retrospektiv vurdering foretas.",
};
export const TOPP = [
  { id: "t1", section: "Norge", kicker: "Se direkte snart:", title: "Norge skal arrangere vinter-OL.", href: "/a/ol", kind: "SENDING" },
  { id: "t2", section: "Økonomi", kicker: "Markedet omtales som urolig:", title: "Kraftig fall på Wall Street – nå topper det seg", href: "/a/wallstreet", kind: "SAK" },
  { id: "t3", section: "Verden", kicker: "Uten nærmere detalj:", title: "Partene bekrefter at dialogen fortsetter å fortsette", href: "/a/dialog", kind: "SAK" },

  { id: "t4", section: "Teknologi", title: "Grensesnittet endres uten at endringen merkes.", href: "/a/ui" },
  { id: "t5", section: "Kultur", title: "Programmet fortsetter – det jobbes med å fortsette programmet.", href: "/a/program" },
  { id: "t6", section: "Sport", title: "Treneren: laget må bli bedre til å bli bedre.", href: "/a/trener" },
  { id: "t7", section: "Norge", title: "Ny vurdering varsles etter tidligere vurdering.", href: "/a/vurdering" },
  { id: "t8", section: "Verden", title: "Uttalelser følges opp med nye uttalelser.", href: "/a/uttalelser", kind: "VIDEO" },
] as const;
