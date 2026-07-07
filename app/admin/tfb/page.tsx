import Link from "next/link";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { requireAdmin } from "@/lib/auth/require-admin";

async function deleteTfbUpdate(formData: FormData) {
  "use server";

  await requireAdmin();

  const id = String(formData.get("id") || "");

  if (!id) {
    throw new Error("Mangler melding-id");
  }

  const { error } = await supabaseAdmin
    .from("tfb_updates")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/tfb");
  revalidatePath("/akkurat-na");
  revalidatePath("/");
}

function formatTfbDate(dateString: string) {
  const date = new Date(dateString);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");

  return `${day}.${month}. ${hour}:${minute}`;
}

export default async function TfbAdminPage() {
  const { data: updates } = await supabaseAdmin
    .from("tfb_updates")
    .select("*")
    .order("published_at", { ascending: false });

    

  return (
    <main className="min-h-screen bg-[rgb(var(--paper))] px-4 py-8">
      <div className="mx-auto max-w-[900px]">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="text-sm font-black uppercase tracking-[0.18em] text-[rgb(var(--accent))]">
              TV19 Admin
            </div>
            <h1 className="text-5xl font-black tracking-tight">TFB</h1>
          </div>

          <Link
            href="/admin/tfb/ny"
            className="bg-[rgb(var(--accent))] px-4 py-3 text-sm font-black text-white no-underline hover:bg-black"
          >
            Ny melding
          </Link>
        </div>

        <div className="space-y-3">
          {updates?.length ? (
            updates.map((update) => (
              <div key={update.id} className="bg-white p-4">
                <div className="text-sm font-black text-[rgb(var(--accent))]">
                {formatTfbDate(update.published_at)}
                </div>

              <div className="mt-1 text-lg font-black">
  {update.title}
</div>

<div className="mt-2 text-black/70">
  {update.text}
</div>

                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <span
                    className={[
                      "px-2 py-1 text-xs font-black uppercase text-white",
                      update.active ? "bg-green-700" : "bg-orange-600",
                    ].join(" ")}
                  >
                    {update.active ? "Aktiv" : "Inaktiv"}
                  </span>

                  <Link
                    href={`/admin/tfb/rediger/${update.id}`}
                    className="text-sm font-black text-[rgb(var(--brand))]"
                  >
                    Rediger
                  </Link>

                  <form action={deleteTfbUpdate}>
                    <input type="hidden" name="id" value={update.id} />

                    <button
                      type="submit"
                      className="text-sm font-black text-black/40 hover:text-black"
                    >
                      Slett
                    </button>
                  </form>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white p-6 text-center font-bold text-black/50">
              Ingen TFB-meldinger ennå.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}