import { notFound, redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { requireAdmin } from "@/lib/auth/require-admin";


type Props = {
  params: Promise<{
    id: string;
  }>;
};

async function updateTfbUpdate(formData: FormData) {
  "use server";

  await requireAdmin();

  const id = String(formData.get("id") || "");
  const title = String(formData.get("title") || "").trim();
  const text = String(formData.get("text") || "").trim();
  const active = formData.get("active") === "on";

if (!id || !title || !text) {
    throw new Error("Mangler melding");
  }

  const { error } = await supabaseAdmin
    .from("tfb_updates")
    .update({
          title,
      text,
      active,
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  redirect("/admin/tfb");
}

export default async function EditTfbUpdatePage({ params }: Props) {
  const { id } = await params;

  const { data: update, error } = await supabaseAdmin
    .from("tfb_updates")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !update) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[rgb(var(--paper))] px-4 py-8">
      <div className="mx-auto max-w-[760px] bg-white p-6">
        <div className="mb-6 border-b-4 border-black pb-3">
          <div className="text-sm font-black uppercase tracking-[0.18em] text-[rgb(var(--accent))]">
            TFB
          </div>

          <h1 className="text-4xl font-black tracking-tight">
            Rediger melding
          </h1>
        </div>

       

        <form action={updateTfbUpdate} className="space-y-5">
          <input type="hidden" name="id" value={update.id} />

          <div>
  <label className="mb-1 block text-sm font-black">
    Overskrift
  </label>

  <input
    name="title"
    required
    defaultValue={update.title || ""}
    className="w-full border border-black/20 px-4 py-3 text-xl font-black outline-none focus:border-black"
  />
</div>

          <div>
            <label className="mb-1 block text-sm font-black">Melding</label>
            <textarea
              name="text"
              rows={4}
              required
              defaultValue={update.text}
              className="w-full border border-black/20 px-4 py-3 text-lg font-bold outline-none focus:border-black"
            />
          </div>

          <label className="flex items-center gap-2 text-sm font-black">
            <input
              name="active"
              type="checkbox"
              defaultChecked={Boolean(update.active)}
            />
            Aktiv
          </label>

          <div className="flex gap-3">
            <button
              type="submit"
              className="bg-[rgb(var(--accent))] px-5 py-3 text-sm font-black uppercase tracking-[0.12em] text-white hover:bg-black"
            >
              Lagre endringer
            </button>

            <a
              href="/admin/tfb"
              className="px-5 py-3 text-sm font-black uppercase tracking-[0.12em] text-black/60 hover:text-black"
            >
              Avbryt
            </a>
          </div>
        </form>
      </div>
    </main>
  );
}