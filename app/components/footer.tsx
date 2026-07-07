export default function Footer() {
  return (
    <footer className="mt-20 border-t-4 border-[rgb(var(--brand))] bg-[#eef1f4]">
      <div className="mx-auto max-w-[1180px] px-4 py-10">
        <div className="grid gap-8 md:grid-cols-[1fr_auto]">
          {/* Venstre */}
          <div>
            <div className="text-3xl font-black tracking-[-0.06em]">
  <span style={{ color: "rgb(var(--brand))" }}>TV</span>
  <span className="text-red-600">19</span>
</div>

            <p className="mt-2 text-sm font-semibold text-black/65">
              Sist med det første.
            </p>

            <p className="mt-4 max-w-[500px] text-sm text-black/55">
              TV19 er en uavhengig nyhetsportal som følger utviklingen,
              vurderingene og situasjonene som omtales som pågående.
            </p>
          </div>

          {/* Høyre */}
          <div className="space-y-2 text-sm font-black">
            <a
              href="/om"
              className="block no-underline hover:text-red-600"
            >
              Om TV19
            </a>

            <a
              href="/tips"
              className="block no-underline hover:text-red-600"
            >
              Tips redaksjonen
            </a>

            <a
              href="/personvern"
              className="block no-underline hover:text-red-600"
            >
              Personvern
            </a>

            <a
              href="/rettelser"
              className="block no-underline hover:text-red-600"
            >
              Rettelser
            </a>

             <a
              href="/nyhetsarkiv"
              className="block no-underline hover:text-red-600"
            >
              Nyhetsarkiv
            </a>
          </div>
        </div>

        <div className="mt-8 border-t border-black/10 pt-4">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div className="text-sm text-black/50">
              © {new Date().getFullYear()} TV19
            </div>

            <div className="text-sm font-black text-black/60">
              Status: Oppdatering pågår
            </div>
          </div>

          <div className="mt-4 text-center text-[11px] font-black uppercase tracking-[0.18em] text-black/35">
            Utviklingen omtales som pågående.
          </div>
        </div>
      </div>
    </footer>
  );
}