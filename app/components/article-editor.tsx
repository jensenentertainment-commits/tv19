"use client";

import { useRef, useState } from "react";

type ArticleEditorProps = {
  article?: {
    title?: string | null;
    kicker?: string | null;
    category?: string | null;
    author?: string | null;
    excerpt?: string | null;
    body?: string | null;
    status?: string | null;
    featured?: boolean | null;
    plus_article?: boolean | null;
    image_url?: string | null;
    image_url_2?: string | null;
    image_url_3?: string | null;
    image_caption?: string | null;
    image_caption_2?: string | null;
    image_caption_3?: string | null;
    published_at?: string | null;
    tags?: string[] | null;
    location?: string | null;
    display_type?: string | null;
  };
};

export default function ArticleEditor({ article }: ArticleEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [kicker, setKicker] = useState(article?.kicker || "");

  const [body, setBody] = useState(article?.body || "");
const [selection, setSelection] = useState({ start: 0, end: 0 });

const [location, setLocation] = useState(article?.location || "");

function rememberSelection() {
  const textarea = textareaRef.current;
  if (!textarea) return;

  setSelection({
    start: textarea.selectionStart,
    end: textarea.selectionEnd,
  });
}
 

function insertBlock(startTag: string, endTag: string) {
  const textarea = textareaRef.current;
  if (!textarea) return;

  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const value = textarea.value;

  const selectedText = value.slice(start, end);

  const insertText = selectedText
    ? `${startTag}\n${selectedText}\n${endTag}`
    : `${startTag}\n\n${endTag}`;

  const nextValue =
    value.slice(0, start) + insertText + value.slice(end);

  setBody(nextValue);

  const cursorStart = selectedText
    ? start + startTag.length + 1
    : start + startTag.length + 1;

  const cursorEnd = selectedText
    ? cursorStart + selectedText.length
    : cursorStart;

  requestAnimationFrame(() => {
    textarea.focus();
    textarea.setSelectionRange(cursorStart, cursorEnd);
  });
}

  return (
    <>
      <div className="rounded-lg border border-black/10 bg-black/[0.03] p-4 text-sm">
        <div className="font-black">TV19 redaksjonsguide</div>
        <ul className="mt-2 space-y-1 text-black/60">
          <li>• Tittel: konkret og alvorlig</li>
          <li>• Ingress: forklar den absurde situasjonen</li>
          <li>• Brødtekst: skriv som om saken er helt ekte</li>
          <li>• SPORT: </li>
          <li>• Skriv som om sporten er svært viktig</li>
          <li>• Ta prognoser på alvor</li>
          <li>• Unngå å vite utfallet på forhånd</li>
          <li>• Eksperter bør være bekymret</li>
        </ul>
      </div>

      <div>
        <label className="mb-1 block text-sm font-black">Tittel</label>
        <input
          name="title"
          required
          defaultValue={article?.title || ""}
          className="w-full border border-black/20 px-4 py-3 text-3xl font-black tracking-tight outline-none focus:border-black"
          placeholder="Westlife kan bli egen bydel i Dublin"
        />
      </div>


      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-black">Kicker</label>
          <div>
  

  <div className="mb-2 flex flex-wrap gap-2">
    {[
      "TV19 ERFARER",
      "TV19 SPORT",
      "PROGNOSESENTRALEN",
      "SSC 2026",
      "RCC ANALYSE",
      "EKSPERTENE VURDERER",
      "UNDER VIDERE VURDERING",
    ].map((kickerOption) => (
      <button
        key={kickerOption}
        type="button"
        onClick={() => setKicker(kickerOption)}
        className="bg-black px-2 py-1 text-xs font-black text-white hover:bg-[#C62828]"
      >
        {kickerOption}
      </button>
    ))}
  </div>

  <input
    name="kicker"
    value={kicker}
    onChange={(e) => setKicker(e.target.value)}
    className="w-full border border-black/20 px-3 py-2 text-lg font-black uppercase tracking-[0.08em] outline-none focus:border-black"
    placeholder="TV19 ERFARER"
  />
</div>


   
        </div>

        <div>
          <label className="mb-1 block text-sm font-black">Kategori</label>
          <select
            name="category"
            defaultValue={article?.category || "Norge"}
            className="w-full border border-black/20 px-3 py-2 font-bold outline-none focus:border-black"
          >
            <option value="Norge">Norge</option>
            <option value="Verden">Verden</option>
            <option value="Økonomi">Økonomi</option>
            <option value="Kultur">Kultur</option>
            <option value="Sport">Sport</option>
            <option value="Teknologi">Teknologi</option>
            <option value="Vitenskap">Vitenskap</option>
            <option value="Samfunn">Samfunn</option>
            <option value="Bekymret">Bekymret</option>
          </select>
        </div>
      </div>

      <div>
  <label className="mb-1 block text-sm font-black">
    Tagger
  </label>

  <input
    name="tags"
    defaultValue={article?.tags?.join(", ") ?? ""}
    placeholder="RCC, Prognose, Analyse"
    className="w-full border border-black/20 px-3 py-2 font-bold outline-none focus:border-black"
  />

  <p className="mt-1 text-xs font-bold text-black/45">
    Skill flere tagger med komma.
  </p>
</div>



      <div>
        <label className="mb-1 block text-sm font-black">Forfatter</label>
        <select
          name="author"
          defaultValue={article?.author || "TV 19s redaksjon"}
          className="w-full border border-black/20 px-3 py-2 font-bold outline-none focus:border-black"
        >
          <option value="TV 19s redaksjon">TV 19s redaksjon</option>
          <option value="Kommunal observatør">Kommunal observatør</option>
          <option value="Politisk kommentator">Politisk kommentator</option>
          <option value="Ekspertgruppen">Ekspertgruppen</option>
          <option value="Korrespondent i Dublin">Korrespondent i Dublin</option>
          <option value="TV19 Sport">TV19 Sport</option>
          <option value="Sportsredaksjonen">Sportsredaksjonen</option>
          <option value="RCC-korrespondenten">RCC-korrespondenten</option>
          <option value="Prognosesentralen">Prognosesentralen</option>
          <option value="Redaksjonen følger utviklingen">
            Redaksjonen følger utviklingen
          </option>
        </select>
      </div>

      <div>
  <label className="mb-1 block text-sm font-black">
    Egendefinert forfatter
  </label>

  <input
    name="custom_author"
    defaultValue=""
    className="w-full border border-black/20 px-3 py-2 font-bold outline-none focus:border-black"
    placeholder="Skriv eget forfatternavn..."
  />

  <p className="mt-1 text-xs font-bold text-black/45">
    Hvis dette fylles ut, brukes det i stedet for valgt forfatter.
  </p>
</div>

<div>
  <label className="mb-1 block text-sm font-black">
    Sted / datelinje
  </label>
  <input
    name="location"
    value={location}
    onChange={(e) => setLocation(e.target.value)}
    className="w-full border border-black/20 px-3 py-2 text-lg font-black uppercase tracking-[0.08em] outline-none focus:border-black"
    placeholder="DUBLIN"
  />
</div>

      <div>
        <label className="mb-1 block text-sm font-black">Ingress</label>
        <textarea
          name="excerpt"
          rows={4}
          defaultValue={article?.excerpt || ""}
          className="w-full border border-black/20 px-4 py-3 text-lg leading-relaxed outline-none focus:border-black"
          placeholder="Kommunale planleggere i Dublin bekrefter at spørsmålet nå er til vurdering..."
        />
      </div>

      <div>
  <label className="mb-1 block text-sm font-black">
    Forsidevisning
  </label>

  <select
    name="display_type"
    defaultValue={article?.display_type || "standard"}
    className="w-full border border-black/20 px-3 py-2 font-bold outline-none focus:border-black"
  >
    <option value="standard">Standard med bilde</option>
    <option value="text">Tekstkort uten bilde</option>
    <option value="breaking">Breaking-boks</option>
  </select>

  <p className="mt-1 text-xs font-bold text-black/45">
    Bruk tekstkort når saken skal vises uten bilde på forsiden.
  </p>
</div>

      <div>
        <label className="mb-1 block text-sm font-black">Hovedbilde</label>

        {article?.image_url ? (
          <img
            src={article.image_url}
            alt=""
            className="mb-3 h-[220px] w-full object-cover"
          />
        ) : null}

        <input
          name="image"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="w-full border border-black/20 px-3 py-2 outline-none focus:border-black"
        />

        <div>
  <label className="mb-1 block text-sm font-black">
    Bildetekst hovedbilde
  </label>

  <input
    name="image_caption"
    className="w-full border border-black/20 px-3 py-2 outline-none focus:border-black"
    placeholder="Foto: Situasjonen slik den fremstod tirsdag ettermiddag."
  />
</div>

        <p className="mt-1 text-xs font-bold text-black/45">
          Anbefalt størrelse: 1200 × 675 px. Lar du feltet stå tomt ved
          redigering, beholdes eksisterende bilde.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-black">Bilde 2</label>

          {article?.image_url_2 ? (
            <img
              src={article.image_url_2}
              alt=""
              className="mb-3 h-[180px] w-full object-cover"
            />
          ) : null}

          <input
            name="image2"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="w-full border border-black/20 px-3 py-2 outline-none focus:border-black"
            
          />
          <textarea
  name="image_caption_2"
  rows={2}
  defaultValue={article?.image_caption_2 || ""}
  className="mt-2 w-full border border-black/20 px-3 py-2 text-sm outline-none focus:border-black"
  placeholder="Bildetekst for bilde 2..."
/>
          
        </div>

        <div>
          <label className="mb-1 block text-sm font-black">Bilde 3</label>

          {article?.image_url_3 ? (
            <img
              src={article.image_url_3}
              alt=""
              className="mb-3 h-[180px] w-full object-cover"
            />
          ) : null}

          <input
            name="image3"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="w-full border border-black/20 px-3 py-2 outline-none focus:border-black"
          />
          <textarea
  name="image_caption_3"
  rows={2}
  defaultValue={article?.image_caption_3 || ""}
  className="mt-2 w-full border border-black/20 px-3 py-2 text-sm outline-none focus:border-black"
  placeholder="Bildetekst for bilde 3..."
/>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-black">Innhold</label>

        <div className="mb-3 flex flex-wrap gap-2">
  <button
    type="button"
    onMouseDown={(e) => e.preventDefault()}
    onClick={() => insertBlock("[QUOTE]", "[/QUOTE]")}
    className="bg-black px-3 py-2 text-xs font-black text-white hover:bg-[rgb(var(--brand))]"
  >
    Sitat
  </button>

  <button
    type="button"
    onMouseDown={(e) => e.preventDefault()}
    onClick={() => insertBlock("[SUBHEADING]", "[/SUBHEADING]")}
    className="bg-black px-3 py-2 text-xs font-black text-white hover:bg-[rgb(var(--brand))]"
  >
    Mellomtittel
  </button>

  <button
    type="button"
    onMouseDown={(e) => e.preventDefault()}
    onClick={() => insertBlock("[FACTBOX]", "[/FACTBOX]")}
    className="bg-black px-3 py-2 text-xs font-black text-white hover:bg-[rgb(var(--brand))]"
  >
    Faktaboks
  </button>

  <button
    type="button"
    onMouseDown={(e) => e.preventDefault()}
    onClick={() => insertBlock("[DOCUMENTS]", "[/DOCUMENTS]")}
    className="bg-black px-3 py-2 text-xs font-black text-white hover:bg-[rgb(var(--brand))]"
  >
    Dokumenter
  </button>

  <button
    type="button"
    onMouseDown={(e) => e.preventDefault()}
    onClick={() => insertBlock("[IMAGE]", "[/IMAGE]")}
    className="bg-black px-3 py-2 text-xs font-black text-white hover:bg-[rgb(var(--brand))]"
  >
    Bilde
  </button>

  <button
    type="button"
    onMouseDown={(e) => e.preventDefault()}
    onClick={() => insertBlock("[IMAGE2]", "[/IMAGE2]")}
    className="bg-black px-3 py-2 text-xs font-black text-white hover:bg-[rgb(var(--brand))]"
  >
    Bilde 2
  </button>

  <button
    type="button"
    onMouseDown={(e) => e.preventDefault()}
    onClick={() => insertBlock("[IMAGE3]", "[/IMAGE3]")}
    className="bg-black px-3 py-2 text-xs font-black text-white hover:bg-[rgb(var(--brand))]"
  >
    Bilde 3
  </button>
</div>

  <textarea
  ref={textareaRef}
  name="body"
  rows={22}
  value={body}
  onChange={(e) => setBody(e.target.value)}
  className="relative z-[999] w-full cursor-text select-text border border-black/20 bg-white px-3 py-2 font-mono text-sm text-black outline-none focus:border-[rgb(var(--accent))] focus:ring-4 focus:ring-red-200"
  style={{ userSelect: "text", WebkitUserSelect: "text" }}
  placeholder="Skriv artikkelen her..."
/>

<p className="mt-2 text-xs font-bold text-black/45">
  Markert: {Math.max(0, selection.end - selection.start)} ||
  Ord: {body.trim().split(/\s+/).filter(Boolean).length} ||
  Tegn: {body.length}
</p>

        <p className="mt-2 text-xs font-bold text-black/45">
          Marker tekst og trykk på en knapp for å gjøre teksten til sitat,
          mellomtittel eller faktaboks.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label className="mb-1 block text-sm font-black">Status</label>
          <select
            name="status"
            defaultValue={article?.status || "draft"}
            className="w-full border border-black/20 px-3 py-2 font-bold outline-none focus:border-black"
          >
            <option value="draft">Kladd</option>
            <option value="scheduled">Planlagt</option>
            <option value="published">Publisert</option>
          </select>
        </div>

        <div>
  <label className="mb-1 block text-sm font-black">
    Publiseres
  </label>

  <input
    name="published_at"
    type="datetime-local"
    defaultValue={
      article?.published_at
        ? new Date(article.published_at).toISOString().slice(0, 16)
        : ""
    }
    className="w-full border border-black/20 px-3 py-2 font-bold outline-none focus:border-black"
  />
</div>

        <label className="flex items-center gap-2 pt-7 text-sm font-black">
          <input
            name="featured"
            type="checkbox"
            defaultChecked={Boolean(article?.featured)}
          />
          Vis som hovedsak
        </label>

        <label className="flex items-center gap-2 pt-7 text-sm font-black">
          <input
            name="plus_article"
            type="checkbox"
            defaultChecked={Boolean(article?.plus_article)}
          />
          TV19+
        </label>
      </div>
    </>
  );
}