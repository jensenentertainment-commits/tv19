type AdEditorProps = {
  ad?: {
    title?: string | null;
    label?: string | null;
    sponsor?: string | null;
    image_url?: string | null;
    text?: string | null;
    cta?: string | null;
    href?: string | null;
    theme?: string | null;
    active?: boolean | null;
  };
};

export default function AdEditor({ ad }: AdEditorProps) {

  return (
    <div className="space-y-5">
      <div>
        <label className="mb-1 block text-sm font-black">Tittel</label>
        <input
          name="title"
          required
           defaultValue={ad?.title || ""}
          className="w-full border border-black/20 px-3 py-2 text-lg font-bold outline-none focus:border-black"
          placeholder="Prishandel"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-black">Etikett</label>
          <input
            name="label"
            defaultValue={ad?.label || ""}
            className="w-full border border-black/20 px-3 py-2 outline-none focus:border-black"
            placeholder="TV19 PARTNER"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-black">Sponsor</label>
          <input
            name="sponsor"
            defaultValue={ad?.sponsor || ""}
            className="w-full border border-black/20 px-3 py-2 outline-none focus:border-black"
            placeholder="Blackwood Breweries"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-black">
          Logo / bilde-URL
        </label>
        <input
          name="image_url"
          defaultValue={ad?.image_url || ""}
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
  defaultValue={ad?.text || ""}
  className="w-full border border-black/20 px-3 py-2 outline-none focus:border-black"
  placeholder="Alt er på tilbud. Også ting du ikke skulle ha."
/>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-black">CTA</label>
          <input
            name="cta"
            defaultValue={ad?.cta || ""}
            className="w-full border border-black/20 px-3 py-2 outline-none focus:border-black"
            placeholder="Se dagens vurdering"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-black">Lenke</label>
          <input
            name="href"
            defaultValue={ad?.href || ""}
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
            defaultValue={ad?.theme || "blue"}
            className="w-full border border-black/20 px-3 py-2 font-bold outline-none focus:border-black"
          >
            <option value="tv19">TV19</option>
            <option value="rcc">RCC</option>
            <option value="notice">Offentlig melding</option>
            <option value="blue">Blå</option>
            <option value="red">Rød</option>
            <option value="gold">Gull</option>
            <option value="dark">Sort</option>
          </select>
        </div>

        <label className="flex items-center gap-2 pt-7 text-sm font-black">
          <input
  name="active"
  type="checkbox"
  defaultChecked={ad ? Boolean(ad.active) : true}
/>
          Aktiv
        </label>
      </div>
    </div>
  );
}