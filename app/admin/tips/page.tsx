import { requireAdmin } from "@/lib/auth/require-admin";
import { supabaseAdmin } from "@/lib/supabase-admin";

export default async function AdminTipsPage() {
  await requireAdmin();

  const { data: tips } = await supabaseAdmin
    .from("tips")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-[rgb(var(--paper))] px-4 py-8">
      <div className="mx-auto max-w-[1000px] bg-white p-6">
        <div className="mb-6 border-b-4 border-black pb-3">
          <div className="text-sm font-black uppercase tracking-[0.18em] text-[#C62828]">
            TV19 Admin
          </div>

          <h1 className="text-4xl font-black tracking-tight">
            Tips til redaksjonen
          </h1>
        </div>

        {!tips?.length ? (
          <p className="font-bold text-black/55">
            Ingen tips er registrert ennå.
          </p>
        ) : (
          <div className="space-y-4">
            {tips.map((tip) => (
              <article
                key={tip.id}
                className="border border-black/10 bg-white p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/10 pb-3">
                  <div>
                    <div className="text-sm font-black">
                      {tip.name || "Anonym tipser"}
                    </div>

                    <div className="text-xs font-bold text-black/45">
                      {tip.email || "Ingen e-post oppgitt"}
                    </div>
                  </div>

                  <div className="text-xs font-black uppercase tracking-[0.14em] text-black/40">
                    {new Date(tip.created_at).toLocaleString("no-NO", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>

                <p className="mt-4 whitespace-pre-wrap text-lg font-bold leading-relaxed text-black/75">
                  {tip.message}
                </p>

                <div className="mt-4 text-xs font-black uppercase tracking-[0.14em] text-[#C62828]">
                  Status: {tip.status || "new"}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}