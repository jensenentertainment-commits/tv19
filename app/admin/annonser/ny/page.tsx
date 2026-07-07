import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { requireAdmin } from "@/lib/auth/require-admin";



async function createAd(formData: FormData) {
  "use server";

  await requireAdmin();

  const title = String(formData.get("title") || "").trim();
  const text = String(formData.get("text") || "").trim();
  const cta = String(formData.get("cta") || "").trim();
  const href = String(formData.get("href") || "").trim();
  const theme = String(formData.get("theme") || "blue");
  const active = formData.get("active") === "on";
  const label = String(formData.get("label") || "").trim();
const sponsor = String(formData.get("sponsor") || "").trim();
const image_url = String(formData.get("image_url") || "").trim();

  if (!title || !text) {
    throw new Error("Tittel og tekst mangler");
  }

  const { error } = await supabaseAdmin.from("ads").insert({
    title,
    text,
    cta,
    href: href || null,
    theme,
    active,

      label: label || null,
  sponsor: sponsor || null,
  image_url: image_url || null,
  });

  if (error) {
    throw new Error(error.message);
  }

  redirect("/admin/annonser");
}

export default async function NewAdPage() {
  await requireAdmin();

  return (
    <main className="min-h-screen bg-[rgb(var(--paper))] px-4 py-8">
      <div className="mx-auto max-w-[820px] bg-white p-6">
        <div className="mb-6 border-b-4 border-black pb-3">
          <div className="text-sm font-black uppercase tracking-[0.18em] text-[rgb(var(--accent))]">
            TV19 Admin
          </div>
          <h1 className="text-4xl font-black tracking-tight">Ny annonse</h1>
        </div>

        <form action={createAd} className="space-y-5">
          <div>
            <label className="mb-1 block text-sm font-black">Tittel</label>
            <input
              name="title"
              required
              className="w-full border border-black/20 px-3 py-2 text-lg font-bold outline-none focus:border-black"
              placeholder="Prishandel"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
  <div>
    <label className="mb-1 block text-sm font-black">
      Etikett
    </label>

    <input
      name="label"
      className="w-full border border-black/20 px-3 py-2 outline-none focus:border-black"
      placeholder="TV19 PARTNER"
    />
  </div>

  <div>
    <label className="mb-1 block text-sm font-black">
      Sponsor
    </label>

    <input
      name="sponsor"
      className="w-full border border-black/20 px-3 py-2 outline-none focus:border-black"
      placeholder="Blackwood Breweries"
    />
  </div>
</div>

<div>
  <label className="mb-1 block text-sm font-black">
    Logo / bilde URL
  </label>

  <input
    name="image_url"
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
              className="w-full border border-black/20 px-3 py-2 outline-none focus:border-black"
              placeholder="Alt er på tilbud. Også ting du ikke skulle ha."
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-black">CTA</label>
              <input
                name="cta"
                className="w-full border border-black/20 px-3 py-2 outline-none focus:border-black"
                placeholder="Se dagens vurdering"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-black">Lenke</label>
              <input
                name="href"
                className="w-full border border-black/20 px-3 py-2 outline-none focus:border-black"
                placeholder="https://turforventning.no"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-black">Tema</label>
              <select
                name="theme"
                defaultValue="blue"
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
              <input name="active" type="checkbox" defaultChecked />
              Aktiv
            </label>
          </div>

          <button
            type="submit"
            className="bg-[rgb(var(--accent))] px-5 py-3 text-sm font-black uppercase tracking-[0.12em] text-white hover:bg-black"
          >
            Lagre annonse
          </button>
        </form>
      </div>
    </main>
  );
}