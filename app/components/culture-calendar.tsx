import Link from "next/link";

const events = [
  {
    day: "11",
    month: "juli",
    place: "Hamar",
    type: "Festival",
    title: "Ventefestivalen",
    text: "Tre dager med forventninger, kø og foreløpige programendringer.",
    status: "Program ventes",
  },
  {
    day: "13",
    month: "juli",
    place: "Lillehammer",
    type: "Konkurranse",
    title: "NM i Moderat Entusiasme",
    text: "Deltakerne oppfordres til å ikke overdrive.",
    status: "Påmelding vurderes",
  },
  {
    day: "15",
    month: "juli",
    place: "Skien",
    type: "Konferanse",
    title: "Konferansen om Kommende Konferanser",
    text: "Årets program offentliggjøres under neste konferanse.",
    status: "Nært forestående",
  },
  {
    day: "18",
    month: "juli",
    place: "Drammen",
    type: "Marked",
    title: "Sommermarked for Midlertidige Løsninger",
    text: "Lokale aktører viser frem løsninger som foreløpig fungerer.",
    status: "Følges tett",
  },
];

export default function CultureCalendar() {
  return (
    <section className="bg-white p-5">
      <div className="border-b-4 border-[#102848] pb-2">
        <div className="text-xs font-black uppercase tracking-[0.22em] text-[#C62828]">
          TV19 anbefaler
        </div>

        <h2 className="mt-1 text-2xl font-black">Kulturkalenderen</h2>
      </div>

      <div className="mt-5 divide-y divide-black/10">
        {events.map((event) => (
          <article
            key={`${event.day}-${event.title}`}
            className="grid gap-4 py-4 md:grid-cols-[76px_1fr_auto]"
          >
            <div className="bg-[rgb(var(--brand))] p-3 text-center text-white">
              <div className="text-3xl font-black leading-none">
                {event.day}
              </div>
              <div className="mt-1 text-[10px] font-black uppercase tracking-[0.16em] text-white/70">
                {event.month}
              </div>
            </div>

            <div>
              <div className="text-[10px] font-black uppercase tracking-[0.18em] text-[#C62828]">
                {event.type} · {event.place}
              </div>

              <h3 className="mt-1 text-xl font-black leading-tight">
                {event.title}
              </h3>

              <p className="mt-1 text-sm font-bold leading-relaxed text-black/60">
                {event.text}
              </p>
            </div>

            <div className="self-center text-left text-[10px] font-black uppercase tracking-[0.16em] text-black/40 md:w-36 md:text-right">
              Status:
              <br />
              {event.status}
            </div>
          </article>
        ))}
      </div>

      <Link
        href="/kulturkalenderen"
        className="mt-5 block text-center text-sm font-black uppercase tracking-[0.16em] text-[#C62828] no-underline"
      >
        Se hele kalenderen →
      </Link>
    </section>
  );
}