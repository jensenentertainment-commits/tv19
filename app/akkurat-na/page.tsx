import { supabaseAdmin } from "@/lib/supabase-admin";

export default async function AkkuratNaPage() {
  const { data: updates } = await supabaseAdmin
    .from("tfb_updates")
    .select("*")
    .eq("active", true)
    .order("published_at", { ascending: false })
    .limit(30);

    function formatTfbDate(dateString: string) {
  const date = new Date(dateString);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");

  return `${day}.${month}. ${hour}:${minute}`;
}

  return (
    <main className="mx-auto max-w-[900px] px-4 py-8">
      <div className="border-b-4 border-[rgb(var(--accent))] pb-4">
        <div className="text-sm font-black uppercase tracking-[0.2em] text-[rgb(var(--accent))]">
          AKKURAT NÅ
        </div>

        <h1 className="mt-2 text-5xl font-black tracking-tight">
          Løpende meldinger
        </h1>

        <p className="mt-3 text-black/60">Levert fortløpende av TFB.</p>
      </div>

      <div className="mt-8 space-y-4">
        {updates?.length ? (
          updates.map((update) => (
            <div
              key={update.id}
              className="border-l-4 border-[rgb(var(--accent))] bg-black/[0.02] p-4"
            >
              <div className="text-sm font-black text-[rgb(var(--accent))]">
               {formatTfbDate(update.published_at)}
              </div>

              <div className="mt-1 text-lg font-black">
  {update.title}
</div>

<div className="mt-2">
  {update.text}
</div>
            </div>
          ))
        ) : (
          <div className="bg-white p-6">
            <h2 className="text-2xl font-black">
              Ingen meldinger akkurat nå
            </h2>

            <p className="mt-2 font-bold text-black/50">
              TFB følger utviklingen.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}