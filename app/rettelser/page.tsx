import Link from "next/link";

export default function RettelserPage() {
  return (
    <main className="min-h-screen bg-[rgb(var(--paper))] px-4 py-8 md:py-12">
      <article className="mx-auto max-w-[860px] bg-white p-5 md:p-8">
        <div className="text-xs font-black uppercase tracking-[0.2em] text-[rgb(var(--accent))]">
          Rettelser
        </div>

        <h1 className="mt-3 text-4xl font-black leading-[0.95] tracking-tight md:text-6xl">
          TV19 retter fortløpende.
        </h1>

        <p className="mt-5 text-xl font-bold leading-snug text-black/70 md:text-2xl">
          Dersom TV19 har omtalt en utvikling på en måte som senere viser seg å
          være en annen utvikling, publiseres rettelser her.
        </p>

        <div className="mt-10 space-y-8">

          <section className="border-l-4 border-[rgb(var(--accent))] pl-5">
            <div className="text-sm font-black uppercase text-black/40">
              2. juni 2026
            </div>

            <h2 className="mt-2 text-2xl font-black">
              Situasjonen var under utvikling.
            </h2>

            <p className="mt-2 text-lg text-black/75">
              TV19 skrev tidligere at situasjonen utviklet seg.
              Senere opplysninger tydet på at situasjonen på tidspunktet
              befant seg under utvikling.
            </p>
          </section>

          <section className="border-l-4 border-[rgb(var(--accent))] pl-5">
            <div className="text-sm font-black uppercase text-black/40">
              28. mai 2026
            </div>

            <h2 className="mt-2 text-2xl font-black">
              Ekspertene var mer bekymret enn først antatt.
            </h2>

            <p className="mt-2 text-lg text-black/75">
              TV19 omtalte ekspertgruppen som bekymret.
              Etter en ny vurdering viste det seg at bekymringen
              var betydelig bekymret.
            </p>
          </section>

          <section className="border-l-4 border-[rgb(var(--accent))] pl-5">
            <div className="text-sm font-black uppercase text-black/40">
              16. mai 2026
            </div>

            <h2 className="mt-2 text-2xl font-black">
              Oppfølgingen ble fulgt opp.
            </h2>

            <p className="mt-2 text-lg text-black/75">
              TV19 skrev at oppfølgingen skulle følges opp.
              Oppfølgingen ble senere fulgt opp som varslet.
            </p>
          </section>

        </div>

        <section className="mt-10 bg-[rgb(var(--brand))] p-5 text-white">
          <div className="text-xs font-black uppercase tracking-[0.2em] text-white/70">
            Prinsipp
          </div>

          <h2 className="mt-2 text-3xl font-black">
            Feil vurderes fortløpende.
          </h2>

          <p className="mt-3 text-lg font-bold text-white/75">
            Dersom en vurdering viser seg å kreve en ny vurdering,
            vurderes dette nærmere.
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