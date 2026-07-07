import { notFound, redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { requireAdmin } from "@/lib/auth/require-admin";


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

          <div>
            <label className="mb-1 block text-sm font-black">Tittel</label>
            <input
              name="title"
              required
              defaultValue={ad.title}
              className="w-full border border-black/20 px-3 py-2 text-lg font-bold outline-none focus:border-black"
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
  <div>
    <label className="mb-1 block text-sm font-black">Etikett</label>
    <input
      name="label"
      defaultValue={ad.label || ""}
      className="w-full border border-black/20 px-3 py-2 outline-none focus:border-black"
      placeholder="TV19 PARTNER"
    />
  </div>

  <div>
    <label className="mb-1 block text-sm font-black">Sponsor</label>
    <input
      name="sponsor"
      defaultValue={ad.sponsor || ""}
      className="w-full border border-black/20 px-3 py-2 outline-none focus:border-black"
      placeholder="Blackwood Breweries"
    />
  </div>
</div>

<div>
  <label className="mb-1 block text-sm font-black">Logo / bilde URL</label>
  <input
    name="image_url"
    defaultValue={ad.image_url || ""}
    className="w-full border border-black/20 px-3 py-2 outline-none focus:border-black"
    placeholder="/ads/blackwood.png"
  />
</div>

          <div>
            <label className="mb-1 block text-sm font-black">Tekst</label>
            <textarea
              name="text"
              required
              rows={3}
              defaultValue={ad.text}
              className="w-full border border-black/20 px-3 py-2 outline-none focus:border-black"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-black">CTA</label>
              <input
                name="cta"
                defaultValue={ad.cta || ""}
                className="w-full border border-black/20 px-3 py-2 outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-black">Lenke</label>
              <input
                name="href"
                defaultValue={ad.href || ""}
                className="w-full border border-black/20 px-3 py-2 outline-none focus:border-black"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-black">Tema</label>
              <select
                name="theme"
                defaultValue={ad.theme || "blue"}
                className="w-full border border-black/20 px-3 py-2 font-bold outline-none focus:border-black"
              >
                <option value="tv19">TV19</option>
<option value="rcc">RCC</option>
<option value="ssc">Solaris Summer Cup</option>
<option value="plus">TV19+</option>
<option value="notice">Offentlig melding</option>
<option value="dark">Mørk</option>
                <option value="blue">Blå</option>
                <option value="red">Rød</option>
                <option value="dark">Sort</option>
                <option value="gold">Gull</option>
              </select>
            </div>

            <label className="flex items-center gap-2 pt-7 text-sm font-black">
              <input
                name="active"
                type="checkbox"
                defaultChecked={Boolean(ad.active)}
              />
              Aktiv
            </label>
          </div>

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