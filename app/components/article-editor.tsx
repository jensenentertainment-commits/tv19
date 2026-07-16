"use client";

import { useRef, useState, type ReactNode } from "react";

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
    followed_story?: boolean | null;
  };
};

function EditorSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="bg-white p-5 md:p-6">
      <div className="mb-6 border-b-4 border-black pb-3">
        <h2 className="text-2xl font-black tracking-tight">{title}</h2>
        {description ? (
          <p className="mt-1 text-sm font-bold text-black/45">{description}</p>
        ) : null}
      </div>

      <div className="space-y-5">{children}</div>
    </section>
  );
}

function FieldLabel({ children }: { children: ReactNode }) {
  return <label className="mb-1 block text-sm font-black">{children}</label>;
}

export default function ArticleEditor({ article }: ArticleEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [kicker, setKicker] = useState(article?.kicker || "");
  const [body, setBody] = useState(article?.body || "");
  const [location, setLocation] = useState(article?.location || "");
  const [selection, setSelection] = useState({ start: 0, end: 0 });

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

    setBody(value.slice(0, start) + insertText + value.slice(end));

    const cursorStart = start + startTag.length + 1;
    const cursorEnd = selectedText
      ? cursorStart + selectedText.length
      : cursorStart;

    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(cursorStart, cursorEnd);
    });
  }

  function insertMarker(marker: string) {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const value = textarea.value;
    const insertText = `${marker}\n`;

    setBody(value.slice(0, start) + insertText + value.slice(end));

    requestAnimationFrame(() => {
      const nextPosition = start + insertText.length;
      textarea.focus();
      textarea.setSelectionRange(nextPosition, nextPosition);
    });
  }

  const wordCount = body.trim().split(/\s+/).filter(Boolean).length;
  const selectedCount = Math.max(0, selection.end - selection.start);

  return (
    <div className="space-y-8">
      <div className="border-l-4 border-[rgb(var(--accent))] bg-white p-5">
        <div className="text-xs font-black uppercase tracking-[0.2em] text-[rgb(var(--accent))]">
          TV19 redaksjonsguide
        </div>

        <div className="mt-3 grid gap-x-8 gap-y-2 text-sm font-bold text-black/60 md:grid-cols-2">
          <div>• Tittel: konkret og alvorlig</div>
          <div>• Ingress: forklar den absurde situasjonen</div>
          <div>• Brødtekst: skriv som om saken er helt ekte</div>
          <div>• Eksperter bør være bekymret</div>
          <div>• Sport skal behandles som svært viktig</div>
          <div>• Prognoser skal tas på alvor</div>
        </div>
      </div>

      <EditorSection
        title="Grunnopplysninger"
        description="Overskrift, inngang og redaksjonell plassering."
      >
        <div>
          <FieldLabel>Tittel</FieldLabel>
          <input
            name="title"
            required
            defaultValue={article?.title || ""}
            className="w-full border border-black/20 px-4 py-3 text-3xl font-black tracking-tight outline-none focus:border-black"
            placeholder="Westlife kan bli egen bydel i Dublin"
          />
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <FieldLabel>Kicker</FieldLabel>
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
              onChange={(event) => setKicker(event.target.value)}
              className="w-full border border-black/20 px-3 py-2 text-lg font-black uppercase tracking-[0.08em] outline-none focus:border-black"
              placeholder="TV19 ERFARER"
            />
          </div>

          <div>
            <FieldLabel>Kategori</FieldLabel>
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

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <FieldLabel>Sted / datelinje</FieldLabel>
            <input
              name="location"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              className="w-full border border-black/20 px-3 py-2 text-lg font-black uppercase tracking-[0.08em] outline-none focus:border-black"
              placeholder="DUBLIN"
            />
          </div>

          <div>
            <FieldLabel>Tagger</FieldLabel>
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
        </div>

        <div>
          <FieldLabel>Ingress</FieldLabel>
          <textarea
            name="excerpt"
            rows={4}
            defaultValue={article?.excerpt || ""}
            className="w-full border border-black/20 px-4 py-3 text-lg leading-relaxed outline-none focus:border-black"
            placeholder="Kommunale planleggere i Dublin bekrefter at spørsmålet nå er til vurdering..."
          />
        </div>
      </EditorSection>

      <EditorSection
        title="Forfatter"
        description="Velg redaksjonell avsender eller skriv inn et eget navn."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <FieldLabel>Forfatter</FieldLabel>
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
            <FieldLabel>Egendefinert forfatter</FieldLabel>
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
        </div>
      </EditorSection>

      <EditorSection
        title="Forsideplassering"
        description="Bestem hvordan saken skal presenteres og prioriteres."
      >
        <div>
          <FieldLabel>Forsidevisning</FieldLabel>
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

        <div className="grid gap-4 md:grid-cols-3">
          <label className="flex items-start gap-3 border border-black/10 bg-[#f7f4f4] p-4">
            <input
              name="featured"
              type="checkbox"
              defaultChecked={Boolean(article?.featured)}
              className="mt-1"
            />
            <span>
              <span className="block text-sm font-black">Vis som hovedsak</span>
              <span className="mt-1 block text-xs font-bold text-black/45">
                Prioriter saken øverst på forsiden.
              </span>
            </span>
          </label>

          <label className="flex items-start gap-3 border border-black/10 bg-[#f7f4f4] p-4">
            <input
              name="followed_story"
              type="checkbox"
              defaultChecked={Boolean(article?.followed_story)}
              className="mt-1"
            />
            <span>
              <span className="block text-sm font-black">
                Redaksjonen følger utviklingen
              </span>
              <span className="mt-1 block text-xs font-bold leading-relaxed text-black/45">
                Vis saken i den redaksjonelt utvalgte seksjonen på forsiden.
              </span>
            </span>
          </label>

          <label className="flex items-start gap-3 border border-black/10 bg-[#f7f4f4] p-4">
            <input
              name="plus_article"
              type="checkbox"
              defaultChecked={Boolean(article?.plus_article)}
              className="mt-1"
            />
            <span>
              <span className="block text-sm font-black">TV19+</span>
              <span className="mt-1 block text-xs font-bold text-black/45">
                Lås saken for ordinære lesere.
              </span>
            </span>
          </label>
        </div>
      </EditorSection>

      <EditorSection
        title="Bilder"
        description="Hovedbilde og eventuelle bilder i brødteksten."
      >
        <div className="border border-black/10 bg-[#f7f4f4] p-4">
          <FieldLabel>Hovedbilde</FieldLabel>
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
            className="w-full border border-black/20 bg-white px-3 py-2 outline-none focus:border-black"
          />

          <div className="mt-4">
            <FieldLabel>Bildetekst hovedbilde</FieldLabel>
            <input
              name="image_caption"
              defaultValue={article?.image_caption || ""}
              className="w-full border border-black/20 bg-white px-3 py-2 outline-none focus:border-black"
              placeholder="Foto: Situasjonen slik den fremstod tirsdag ettermiddag."
            />
          </div>

          <p className="mt-2 text-xs font-bold text-black/45">
            Anbefalt størrelse: 1200 × 675 px. Lar du feltet stå tomt ved
            redigering, beholdes eksisterende bilde.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="border border-black/10 bg-[#f7f4f4] p-4">
            <FieldLabel>Bilde 2</FieldLabel>
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
              className="w-full border border-black/20 bg-white px-3 py-2 outline-none focus:border-black"
            />

            <textarea
              name="image_caption_2"
              rows={2}
              defaultValue={article?.image_caption_2 || ""}
              className="mt-2 w-full border border-black/20 bg-white px-3 py-2 text-sm outline-none focus:border-black"
              placeholder="Bildetekst for bilde 2..."
            />
          </div>

          <div className="border border-black/10 bg-[#f7f4f4] p-4">
            <FieldLabel>Bilde 3</FieldLabel>
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
              className="w-full border border-black/20 bg-white px-3 py-2 outline-none focus:border-black"
            />

            <textarea
              name="image_caption_3"
              rows={2}
              defaultValue={article?.image_caption_3 || ""}
              className="mt-2 w-full border border-black/20 bg-white px-3 py-2 text-sm outline-none focus:border-black"
              placeholder="Bildetekst for bilde 3..."
            />
          </div>
        </div>
      </EditorSection>

      <EditorSection
        title="Artikkeltekst"
        description="Skriv brødteksten og sett inn redaksjonelle elementer."
      >
        <div>
          <div className="mb-3 flex flex-wrap gap-2">
            <button
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => insertBlock("[QUOTE]", "[/QUOTE]")}
              className="bg-black px-3 py-2 text-xs font-black text-white hover:bg-[rgb(var(--brand))]"
            >
              Sitat
            </button>
            <button
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => insertBlock("[SUBHEADING]", "[/SUBHEADING]")}
              className="bg-black px-3 py-2 text-xs font-black text-white hover:bg-[rgb(var(--brand))]"
            >
              Mellomtittel
            </button>
            <button
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => insertBlock("[FACTBOX]", "[/FACTBOX]")}
              className="bg-black px-3 py-2 text-xs font-black text-white hover:bg-[rgb(var(--brand))]"
            >
              Faktaboks
            </button>
            <button
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => insertBlock("[DOCUMENTS]", "[/DOCUMENTS]")}
              className="bg-black px-3 py-2 text-xs font-black text-white hover:bg-[rgb(var(--brand))]"
            >
              Dokumenter
            </button>
            <button
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => insertBlock("[IMAGE]", "[/IMAGE]")}
              className="bg-black px-3 py-2 text-xs font-black text-white hover:bg-[rgb(var(--brand))]"
            >
              Bilde
            </button>
            <button
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => insertMarker("[IMAGE2]")}
              className="bg-black px-3 py-2 text-xs font-black text-white hover:bg-[rgb(var(--brand))]"
            >
              Bilde 2
            </button>
            <button
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => insertMarker("[IMAGE3]")}
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
            onChange={(event) => setBody(event.target.value)}
            onSelect={rememberSelection}
            onKeyUp={rememberSelection}
            onMouseUp={rememberSelection}
            className="relative z-[999] w-full cursor-text select-text border border-black/20 bg-white px-3 py-2 font-mono text-sm text-black outline-none focus:border-[rgb(var(--accent))] focus:ring-4 focus:ring-red-200"
            style={{ userSelect: "text", WebkitUserSelect: "text" }}
            placeholder="Skriv artikkelen her..."
          />

          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs font-bold text-black/45">
            <span>Markert: {selectedCount}</span>
            <span>Ord: {wordCount}</span>
            <span>Tegn: {body.length}</span>
          </div>

          <p className="mt-2 text-xs font-bold text-black/45">
            Marker tekst og velg sitat, mellomtittel, faktaboks eller
            dokumenter.
          </p>
        </div>
      </EditorSection>

      <EditorSection
        title="Publisering"
        description="Lagre som kladd, planlegg eller publiser saken."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <FieldLabel>Status</FieldLabel>
            <select
              name="status"
              defaultValue={article?.status || "draft"}
              className="w-full border border-black/20 px-3 py-3 font-bold outline-none focus:border-black"
            >
              <option value="draft">Kladd</option>
              <option value="scheduled">Planlagt</option>
              <option value="published">Publisert</option>
            </select>
          </div>

          <div>
            <FieldLabel>Publiseres</FieldLabel>
            <input
              name="published_at"
              type="datetime-local"
              defaultValue={
                article?.published_at
                  ? new Date(article.published_at).toISOString().slice(0, 16)
                  : ""
              }
              className="w-full border border-black/20 px-3 py-3 font-bold outline-none focus:border-black"
            />
          </div>
        </div>
      </EditorSection>
    </div>
  );
}