import Link from "next/link";

export default function CultureCalendarPage() {
  return (
    <main className="min-h-screen bg-[rgb(var(--paper))] px-4 py-8">
      <div className="mx-auto max-w-[900px]">

        <div className="bg-white p-8 shadow-sm">
          <div className="text-xs font-black uppercase tracking-[0.2em] text-[rgb(var(--accent))]">
            UNDER UTVIKLING
          </div>

          <h1 className="mt-2 text-5xl font-black tracking-tight">
            Kultur<span className="text-[rgb(var(--brand))]">kalenderen</span>
          </h1>

          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-black/70">
            TV19 arbeider med å ferdigstille Kulturkalenderen. Festivaler,
            konserter, teater, markeder og andre arrangementer vil bli publisert
            fortløpende når de vurderes som tilstrekkelig vurdert.
          </p>

          <div className="mt-8 border-l-4 border-[rgb(var(--brand))] bg-[#f7f4f4] p-5">
            <div className="text-xs font-black uppercase tracking-[0.18em] text-[rgb(var(--brand))]">
              STATUS
            </div>

            <div className="mt-2 text-3xl font-black">
              Under videre vurdering
            </div>

            <p className="mt-3 font-bold text-black/60">
              Kulturredaksjonen følger utviklingen og forventer at
              Kulturkalenderen vil bli tilgjengelig så snart den er ferdig
              vurdert.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2">

            <div className="border border-black/10 bg-[#f7f4f4] p-5">
              <div className="text-lg font-black">🎵 Festivaler</div>
              <div className="mt-2 text-sm font-bold text-black/55">
                Under vurdering.
              </div>
            </div>

            <div className="border border-black/10 bg-[#f7f4f4] p-5">
              <div className="text-lg font-black">🎤 Konserter</div>
              <div className="mt-2 text-sm font-bold text-black/55">
                Nesten klare.
              </div>
            </div>

            <div className="border border-black/10 bg-[#f7f4f4] p-5">
              <div className="text-lg font-black">🎭 Teater</div>
              <div className="mt-2 text-sm font-bold text-black/55">
                Følges fortløpende.
              </div>
            </div>

            <div className="border border-black/10 bg-[#f7f4f4] p-5">
              <div className="text-lg font-black">🎪 Arrangementer</div>
              <div className="mt-2 text-sm font-bold text-black/55">
                Oppdateres ved behov.
              </div>
            </div>

          </div>

          <div className="mt-10 bg-[rgb(var(--brand))] p-6 text-white">
            <div className="text-xs font-black uppercase tracking-[0.2em] text-white/70">
              TV19 OPPLYSER
            </div>

            <h2 className="mt-3 text-2xl font-black">
              Kultur forventes fortsatt å finne sted.
            </h2>

            <p className="mt-3 font-bold text-white/80">
              Redaksjonen ser foreløpig ingen tegn til at kultur har opphørt.
              Situasjonen overvåkes kontinuerlig.
            </p>
          </div>

          <div className="mt-10 flex">
            <Link
              href="/"
              className="bg-[rgb(var(--brand))] px-6 py-4 text-sm font-black uppercase tracking-[0.14em] text-white no-underline hover:bg-[rgb(var(--accent))]"
            >
              ← Til forsiden
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}