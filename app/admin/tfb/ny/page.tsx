import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { requireAdmin } from "@/lib/auth/require-admin";

async function createTfbUpdate(formData: FormData) {
  "use server";

await requireAdmin();

  const title = String(formData.get("title") || "").trim();
  const text = String(formData.get("text") || "").trim();
  const active = formData.get("active") === "on";

 if (!title || !text) {
    throw new Error("Mangler melding");
  }

  const { error } = await supabaseAdmin.from("tfb_updates").insert({
      title,
    text,
    active,
  });

  if (error) throw new Error(error.message);

  redirect("/admin/tfb");
}

export default function NewTfbUpdatePage() {
  return (
    <main className="min-h-screen bg-[rgb(var(--paper))] px-4 py-8">
      <div className="mx-auto max-w-[760px] bg-white p-6">
        <div className="mb-6 border-b-4 border-black pb-3">
          <div className="text-sm font-black uppercase tracking-[0.18em] text-[rgb(var(--accent))]">
            TFB
          </div>
     
          <h1 className="text-4xl font-black tracking-tight">Ny melding</h1>
        </div>

        <form action={createTfbUpdate} className="space-y-5">
          <div>
    <label className="mb-1 block text-sm font-black">
      Overskrift
    </label>

    <input
      name="title"
      required
      className="w-full border border-black/20 px-4 py-3 text-xl font-black outline-none focus:border-black"
      placeholder="Eksperter følger utviklingen"
    />
  </div>

          <div>
            <label className="mb-1 block text-sm font-black">Melding</label>
            <textarea
              name="text"
              rows={4}
              required
              className="w-full border border-black/20 px-4 py-3 text-lg font-bold outline-none focus:border-black"
              placeholder="TFB erfarer at utviklingen fortsatt utvikler seg."
            />
          </div>

          <label className="flex items-center gap-2 text-sm font-black">
            <input name="active" type="checkbox" defaultChecked />
            Aktiv
          </label>

          <button
            type="submit"
            className="bg-[rgb(var(--accent))] px-5 py-3 text-sm font-black uppercase tracking-[0.12em] text-white hover:bg-black"
          >
            Publiser melding
          </button>
        </form>
      </div>
    </main>
  );
}