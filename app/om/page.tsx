import Link from "next/link";

export default function OmPage() {
  return (
    <main className="min-h-screen bg-[rgb(var(--paper))] px-4 py-8 md:py-12">
      <article className="mx-auto max-w-[860px] bg-white p-5 md:p-8">
        <div className="text-xs font-black uppercase tracking-[0.2em] text-[rgb(var(--accent))]">
          Om TV19
        </div>

        <h1 className="mt-3 text-4xl font-black leading-[0.95] tracking-tight md:text-6xl">
          TV19 følger utviklingen.
        </h1>

        <p className="mt-5 text-xl font-bold leading-snug text-black/70 md:text-2xl">
          TV19 er en uavhengig nyhetsportal som dekker situasjoner, vurderinger
          og utviklinger som omtales som pågående.
        </p>

        <div className="mt-8 space-y-5 text-lg leading-relaxed text-black/80 md:text-xl">
          <p>
            Siden etableringen har TV19 arbeidet kontinuerlig med å følge opp
            oppfølgingen. Redaksjonen dekker saker der eksperter er bekymret,
            kommuner følger situasjonen, og nye vurderinger varsles etter
            tidligere vurderinger.
          </p>

          <p>
            TV19 publiserer nyheter, analyser og opplysninger som kan komme.
            Enkelte saker kan kreve TV19+, men tilgangen er som regel nesten
            aktiv.
          </p>

          <p>
            Redaksjonen består av TV19s redaksjon, Kommunal observatør,
            Ekspertgruppen og andre kilder TV19 ikke nødvendigvis har snakket
            med.
          </p>

           <p>
          TV19 er en uavhengig norsk satirisk nyhetsportal. Navnet TV19 brukes også av andre virksomheter internasjonalt. Eventuelle likheter i navn er ikke uttrykk for samarbeid, tilknytning eller annen utvikling.
          </p>
        </div>

        <section className="mt-10 border-t-4 border-black pt-6">
          <h2 className="text-3xl font-black">Redaksjonelle prinsipper</h2>

          <ul className="mt-4 space-y-3 text-lg font-bold text-black/75">
            <li>● Utviklingen skal følges.</li>
            <li>● Situasjonen skal omtales.</li>
            <li>● Vurderinger skal vurderes.</li>
            <li>● Eksperter skal være bekymret ved behov.</li>
            <li>● Ytterligere opplysninger kan komme.</li>
          </ul>
        </section>

        <section className="mt-10 bg-[rgb(var(--brand))] p-5 text-white">
          <div className="text-xs font-black uppercase tracking-[0.2em] text-white/70">
            Status
          </div>

          <h2 className="mt-2 text-3xl font-black leading-tight">
            Arbeidet med arbeidet fortsetter.
          </h2>

          <p className="mt-3 text-lg font-bold text-white/75">
            TV19 følger utviklingen og kommer tilbake dersom utviklingen
            utvikler seg ytterligere.
          </p>
        </section>

        <div className="mt-8">
          <Link
            href="/"
            className="inline-block bg-[rgb(var(--accent))] px-5 py-3 text-sm font-black uppercase tracking-[0.14em] text-white no-underline hover:bg-black"
          >
            Til forsiden
          </Link>
        </div>
      </article>
    </main>
  );
}