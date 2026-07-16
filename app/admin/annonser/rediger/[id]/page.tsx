import { notFound, redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { requireAdmin } from "@/lib/auth/require-admin";
import AdEditor from "@/app/components/ad-editor";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

async function updateAd(formData: FormData) {
  "use server";

  await requireAdmin();

  const id = String(formData.get("id") || "");
  const title = String(formData.get("title") || "").trim();
  const text = String(formData.get("text") || "").trim();
  const cta = String(formData.get("cta") || "").trim();
  const href = String(formData.get("href") || "").trim();
  const theme = String(formData.get("theme") || "blue");
  const active = formData.get("active") === "on";

  const label = String(formData.get("label") || "").trim();
const sponsor = String(formData.get("sponsor") || "").trim();
const image_url = String(formData.get("image_url") || "").trim();

  if (!id || !title || !text) {
    throw new Error("Mangler id, tittel eller tekst");
  }

  const { error } = await supabaseAdmin
    .from("ads")
    .update({
      title,
      label: label || null,
sponsor: sponsor || null,
image_url: image_url || null,
      text,
      cta,
      href: href || null,
      theme,
      active,
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  redirect("/admin/annonser");
}

export default async function EditAdPage({ params }: Props) {
  await requireAdmin();
  const { id } = await params;

  const { data: ad, error } = await supabaseAdmin
    .from("ads")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !ad) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[rgb(var(--paper))] px-4 py-8">
      <div className="mx-auto max-w-[820px] bg-white p-6">
        <div className="mb-6 border-b-4 border-black pb-3">
          <div className="text-sm font-black uppercase tracking-[0.18em] text-[rgb(var(--accent))]">
            TV19 Admin
          </div>
          <h1 className="text-4xl font-black tracking-tight">
            Rediger annonse
          </h1>
        </div>

        <form action={updateAd} className="space-y-5">
  <input type="hidden" name="id" value={ad.id} />

  <AdEditor ad={ad} />

  <div className="flex gap-3">
    <button
      type="submit"
      className="bg-[rgb(var(--accent))] px-5 py-3 text-sm font-black uppercase tracking-[0.12em] text-white hover:bg-black"
    >
      Lagre endringer
    </button>

    <a
      href="/admin/annonser"
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