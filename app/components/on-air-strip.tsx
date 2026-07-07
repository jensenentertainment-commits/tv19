export default function OnAirStrip() {
  return (
    <section className="border-y-4 border-black bg-white px-5 py-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-xs font-black uppercase tracking-[0.24em] text-[#C62828]">
            Akkurat nå
          </div>

          <div className="mt-1 text-2xl font-black tracking-tight">
            Oppdatering forventes
          </div>
        </div>

        <div className="text-sm font-black uppercase tracking-[0.16em] text-black/40">
          Levert av TFB →
        </div>
      </div>
    </section>
  );
}