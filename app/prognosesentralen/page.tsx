// app/prognosesentralen/page.tsx
import Link from "next/link";

const sections = [
  {
    title: "Samfunn",
    items: [
      { value: "97%", text: "Flere vil reagere." },
      { value: "91%", text: "Ny vurdering ventes." },
      { value: "84%", text: "Situasjonen utvikler seg videre." },
    ],
  },
  {
    title: "Sport",
    items: [
      { value: "93%", text: "Noen kommer til å vinne RCC." },
      { value: "68%", text: "Tabellen vil endre seg." },
      { value: "41%", text: "Morgan Fairchild kommenterer utviklingen." },
    ],
  },
  {
    title: "Klima",
    items: [
      { value: "88%", text: "Det ventes ytterligere vær." },
      { value: "74%", text: "Atmosfæren opprettholder aktiviteten." },
      { value: "36%", text: "Nedbør kan ikke avkreftes." },
    ],
  },
  {
    title: "Internasjonalt",
    items: [
      { value: "82%", text: "Flere land vil fortsette å være land." },
      { value: "63%", text: "Samarbeid omtales som nært forestående." },
      { value: "27%", text: "Verdenssituasjonen blir helt ferdig." },
    ],
  },
];

export default function PrognosesentralenPage() {
  return (
    <main className="min-h-screen bg-[rgb(var(--paper))] px-4 py-8">
      <div className="mx-auto max-w-[1100px]">
        <div className="bg-white p-6 md:p-8">
          <div className="border-b-4 border-[rgb(var(--brand))] pb-5">
            <div className="text-sm font-black uppercase tracking-[0.18em] text-[#C62828]">
              TV19 Analyse
            </div>

            <h1 className="mt-2 text-5xl font-black tracking-tight md:text-7xl">
              Prognosesentralen
            </h1>

            <p className="mt-4 max-w-[760px] text-xl font-bold leading-relaxed text-black/60">
              TV19s ledende miljø for prognoser, vurderinger og
              sannsynlighetsbaserte vurderinger.
            </p>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {sections.map((section) => (
              <section key={section.title} className="border border-black/10">
                <div className="bg-[rgb(var(--brand))] px-4 py-3 text-white">
                  <h2 className="text-2xl font-black">{section.title}</h2>
                </div>

                <div className="divide-y divide-black/10">
                  {section.items.map((item) => (
                    <div key={item.text} className="grid grid-cols-[92px_1fr] gap-4 p-4">
                      <div className="text-4xl font-black text-[#C62828]">
                        {item.value}
                      </div>

                      <div className="flex items-center text-lg font-black leading-tight">
                        {item.text}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <section className="mt-8 bg-[#f7f4f4] p-6">
            <div className="text-xs font-black uppercase tracking-[0.22em] text-[#C62828]">
              Metode
            </div>

            <p className="mt-3 text-xl font-black leading-relaxed">
              Prognosene er utarbeidet av TV19 Prognosesentral og bygger på
              analyser, vurderinger og andre vurderinger.
            </p>

            <p className="mt-3 text-sm font-bold text-black/45">
              Sist oppdatert ved behov.
            </p>
          </section>

          <Link
            href="/"
            className="mt-8 inline-block bg-[rgb(var(--brand))] px-5 py-3 text-sm font-black uppercase tracking-[0.14em] text-white no-underline hover:bg-black"
          >
            Tilbake til forsiden
          </Link>
        </div>
      </div>
    </main>
  );
}