// app/pluss/page.tsx
export default function PlussPage() {
  return (
    <main className="min-h-screen bg-[#f3eeee] px-4 py-10">
      <section className="mx-auto max-w-[720px] bg-white p-8 text-center">
        <div className="text-sm font-black uppercase tracking-[0.2em] text-red-600">
          TV 19+
        </div>

        <h1 className="mt-3 text-5xl font-black leading-none tracking-tight">
          Abonnementet ditt er nesten aktivt.
        </h1>

        <p className="mx-auto mt-5 max-w-[520px] text-lg font-bold text-black/60">
          Betalingen er sendt til vurdering. Flere arbeider med saken.
        </p>

        <div className="mt-8 h-6 w-full bg-black/10">
          <div className="h-full w-[97%] bg-red-600" />
        </div>

        <div className="mt-2 text-sm font-black text-black/45">
          97 % fullført
        </div>

        <button className="mt-8 bg-red-600 px-6 py-4 text-sm font-black uppercase tracking-[0.14em] text-white">
          Fullfør betaling
        </button>

        <p className="mt-4 text-xs font-bold text-black/40">
          Knappen fungerer foreløpig etter intensjonen.
        </p>
      </section>
    </main>
  );
}