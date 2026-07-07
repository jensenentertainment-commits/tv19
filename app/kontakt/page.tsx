import Link from "next/link";

export default function KontaktPage() {
  return (
    <main className="min-h-screen bg-[rgb(var(--paper))] px-4 py-8 md:py-12">
      <article className="mx-auto max-w-[860px] bg-white p-5 md:p-8">
        <div className="text-xs font-black uppercase tracking-[0.2em] text-[rgb(var(--accent))]">
          Kontakt redaksjonen
        </div>

        <h1 className="mt-3 text-4xl font-black leading-[0.95] tracking-tight md:text-6xl">
          Tips TV19 om en utvikling.
        </h1>

        <p className="mt-5 text-xl font-bold leading-snug text-black/70 md:text-2xl">
          Har du observert en situasjon, vurdering, prosess eller ekspert som
          virker unødvendig bekymret, kan redaksjonen kontaktes.
        </p>

        <section className="mt-10 grid gap-4 md:grid-cols-2">
          <div className="border-t-4 border-black bg-[rgb(var(--paper))] p-5">
            <h2 className="text-2xl font-black">Tips</h2>
            <p className="mt-2 text-lg font-bold text-black/70">
              tips@tv19.no
            </p>
          </div>

          <div className="border-t-4 border-black bg-[rgb(var(--paper))] p-5">
            <h2 className="text-2xl font-black">Redaksjonen</h2>
            <p className="mt-2 text-lg font-bold text-black/70">
              redaksjonen@tv19.no
            </p>
          </div>
        </section>

        <section className="mt-10 bg-[rgb(var(--brand))] p-5 text-white">
          <div className="text-xs font-black uppercase tracking-[0.2em] text-white/70">
            Status
          </div>

          <h2 className="mt-2 text-3xl font-black leading-tight">
            Henvendelser vurderes fortløpende.
          </h2>

          <p className="mt-3 text-lg font-bold text-white/75">
            TV19 besvarer henvendelser dersom henvendelsen vurderes som relevant
            for vurderingen.
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