const situations = [
  "Atmosfæren opprettholdes.",
  "Meteorologene følger utviklingen.",
  "Det ventes ytterligere vær.",
  "Forholdene vurderes som utendørs.",
  "Situasjonen i luften følges tett.",
  "Flere værforhold er observert.",
  "Prognosen omtales som værrelatert.",
  "Været fortsetter å være vær.",
];

const precipitation = [
  "Ikke avkreftet",
  "Under vurdering",
  "Mulig",
  "Følges tett",
];

const atmosphere = [
  "Påvist",
  "Aktiv",
  "Tilstede",
  "I gang",
];

const confidence = [
  "Moderat",
  "Foreløpig",
  "Vurderes",
  "Nær forestående",
];

function randomItem<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)];
}

export default function TvWeather() {
  const situation = randomItem(situations);
  const rain = randomItem(precipitation);
  const air = randomItem(atmosphere);
  const certainty = randomItem(confidence);

  return (
    <section className="h-[320px] overflow-hidden bg-white">
      <div className="bg-[rgb(var(--brand))] px-4 py-3 text-white">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-black leading-none">TV19 Vær</h3>

            <p className="mt-1 text-[10px] font-black uppercase tracking-[0.18em] text-white/65">
              Klimasenteret
            </p>
          </div>

          <span className="text-xs font-black uppercase text-white/75">
            Følges tett
          </span>
        </div>
      </div>

      <div className="flex h-[248px] flex-col justify-between px-5 py-5">
        <div className="text-center text-[1.35rem] font-black leading-tight">
          {situation}
        </div>

        <div className="space-y-3 border-t border-black/10 pt-4">
          <div className="grid grid-cols-[90px_1fr] gap-3">
            <span className="font-bold text-black/55">Nedbør</span>
            <span className="text-right font-black leading-tight">{rain}</span>
          </div>

          <div className="grid grid-cols-[90px_1fr] gap-3">
            <span className="font-bold text-black/55">Atmosfære</span>
            <span className="text-right font-black leading-tight">{air}</span>
          </div>

          <div className="grid grid-cols-[90px_1fr] gap-3">
            <span className="font-bold text-black/55">Konfidens</span>
            <span className="text-right font-black leading-tight">
              {certainty}
            </span>
          </div>
        </div>

        <div className="border-t border-black/10 pt-3 text-center text-[10px] font-black uppercase tracking-[0.18em] text-black/40">
          TV19 Klimasenter følger utviklingen
        </div>
      </div>
    </section>
  );
}