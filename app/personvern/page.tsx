import Link from "next/link";

export default function PersonvernPage() {
  return (
    <main className="min-h-screen bg-[rgb(var(--paper))] px-4 py-8 md:py-12">
      <article className="mx-auto max-w-[860px] bg-white p-5 md:p-8">
        <div className="text-xs font-black uppercase tracking-[0.2em] text-[rgb(var(--accent))]">
          Personvern
        </div>

        <h1 className="mt-3 text-4xl font-black leading-[0.95] tracking-tight md:text-6xl">
          Personvern hos TV19
        </h1>

        <p className="mt-5 text-xl font-bold leading-snug text-black/70 md:text-2xl">
          TV19 behandler personopplysninger i samsvar med gjeldende regelverk og
          med respekt for brukernes personvern.
        </p>

        <div className="mt-10 space-y-6 text-lg leading-relaxed text-black/80">
          <section>
            <h2 className="mb-2 text-2xl font-black">
              Hvilke opplysninger samles inn?
            </h2>

            <p>
              TV19 kan registrere teknisk informasjon som IP-adresse,
              nettlesertype, operativsystem og besøksstatistikk. Informasjonen
              brukes for å forbedre nettstedet og forstå hvordan tjenesten
              benyttes.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-2xl font-black">
              Informasjonskapsler
            </h2>

            <p>
              TV19 kan benytte informasjonskapsler (cookies) for å sikre
              grunnleggende funksjonalitet og analysere bruk av nettstedet.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-2xl font-black">
              Deling av informasjon
            </h2>

            <p>
              TV19 selger ikke personopplysninger til tredjeparter.
              Opplysninger deles kun dersom dette er nødvendig for drift,
              sikkerhet eller dersom lovverket krever det.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-2xl font-black">
              Dine rettigheter
            </h2>

            <p>
              Du har rett til innsyn, retting og sletting av personopplysninger
              som behandles om deg, i henhold til gjeldende lovgivning.
            </p>
          </section>
        </div>

        <section className="mt-10 bg-[rgb(var(--brand))] p-5 text-white">
          <div className="text-xs font-black uppercase tracking-[0.2em] text-white/70">
            Informasjon
          </div>

          <h2 className="mt-2 text-3xl font-black">
            Ytterligere opplysninger kan komme.
          </h2>

          <p className="mt-3 text-lg font-bold text-white/75">
            Dersom personvernet utvikler seg ytterligere, kan denne siden bli
            oppdatert.
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