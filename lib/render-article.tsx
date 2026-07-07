import { Fragment } from "react";

function ArticleQuote({ children }: { children: string }) {
  return (
    <blockquote className="my-10 border-l-4 border-[rgb(var(--accent))] bg-[rgb(var(--paper))] py-4 pl-5 text-2xl font-black leading-tight">
      – {children}
    </blockquote>
  );
}

function ArticleSubheading({ children }: { children: string }) {
  return (
    <h2 className="mt-12 mb-6 text-3xl font-black tracking-tight">
      {children}
    </h2>
  );
}

function ArticleFactBox({ children }: { children: string[] }) {
  return (
    <aside className="my-10 border-l-4 border-[rgb(var(--accent))] bg-[rgb(var(--paper))] p-5">
      <div className="text-xs font-black uppercase tracking-[0.2em] text-[rgb(var(--accent))]">
        Fakta
      </div>

      <ul className="mt-3 space-y-2 text-base font-bold text-black/75">
        {children.map((item, index) => (
          <li key={index}>• {item}</li>
        ))}
      </ul>
    </aside>
  );
}

function ArticleDocuments({ children }: { children: string[] }) {
  return (
    <aside className="my-10 border-l-4 border-[rgb(var(--brand))] bg-[rgb(var(--paper))] p-5">
      <div className="text-xs font-black uppercase tracking-[0.2em] text-[rgb(var(--brand))]">
        TV19 har fått tilgang til
      </div>

      <ul className="mt-3 space-y-2 text-base font-bold text-black/75">
        {children.map((item, index) => (
          <li key={index}>• {item}</li>
        ))}
      </ul>
    </aside>
  );
}

function ArticleImage({
  src,
  caption,
}: {
  src: string;
  caption?: string | null;
}) {
  return (
    <figure className="my-10">
      <img src={src} alt="" className="w-full object-cover" />
      <figcaption className="mt-2 text-sm font-bold text-black/45">
        {caption || "TV19 følger utviklingen."}
      </figcaption>
    </figure>
  );
}


export function renderArticleBody(
  body: string,
  images?: {
  image2?: string | null;
  image3?: string | null;
  imageCaption2?: string | null;
  imageCaption3?: string | null;
}
) {
  const lines = body.split("\n");
  const elements: React.ReactNode[] = [];

  let i = 0;

  while (i < lines.length) {
    const line = lines[i].trim();

    if (!line) {
      i++;
      continue;
    }

    if (line === "[QUOTE]") {
      const content: string[] = [];
      i++;

      while (i < lines.length && lines[i].trim() !== "[/QUOTE]") {
        if (lines[i].trim()) content.push(lines[i].trim());
        i++;
      }

      elements.push(
        <ArticleQuote key={elements.length}>{content.join(" ")}</ArticleQuote>
      );

      i++;
      continue;
    }

    if (line === "[SUBHEADING]") {
      const content: string[] = [];
      i++;

      while (i < lines.length && lines[i].trim() !== "[/SUBHEADING]") {
        if (lines[i].trim()) content.push(lines[i].trim());
        i++;
      }

      elements.push(
        <ArticleSubheading key={elements.length}>
          {content.join(" ")}
        </ArticleSubheading>
      );

      i++;
      continue;
    }

    if (line === "[FACTBOX]") {
      const content: string[] = [];
      i++;

      while (i < lines.length && lines[i].trim() !== "[/FACTBOX]") {
        if (lines[i].trim()) content.push(lines[i].trim());
        i++;
      }

      elements.push(
        <ArticleFactBox key={elements.length}>{content}</ArticleFactBox>
      );

      i++;
      continue;
    }

    if (line === "[DOCUMENTS]") {
      const content: string[] = [];
      i++;

      while (i < lines.length && lines[i].trim() !== "[/DOCUMENTS]") {
        if (lines[i].trim()) content.push(lines[i].trim());
        i++;
      }

      elements.push(
        <ArticleDocuments key={elements.length}>{content}</ArticleDocuments>
      );

      i++;
      continue;
    }

    if (line === "[IMAGE]") {
      const content: string[] = [];
      i++;

      while (i < lines.length && lines[i].trim() !== "[/IMAGE]") {
        if (lines[i].trim()) content.push(lines[i].trim());
        i++;
      }

      const src = content[0];

      if (src) {
        elements.push(<ArticleImage key={elements.length} src={src} />);
      }

      i++;
      continue;
    }

 if (line === "[IMAGE2]") {
  if (images?.image2) {
    elements.push(
     <ArticleImage
  key={elements.length}
  src={images.image2}
  caption={images.imageCaption2}
/>
    );
  }

  i++;

  while (i < lines.length && lines[i].trim() !== "[/IMAGE2]") {
    i++;
  }

  i++;
  continue;
}

if (line === "[IMAGE3]") {
  if (images?.image3) {
    elements.push(
      <ArticleImage
  key={elements.length}
  src={images.image3}
  caption={images.imageCaption3}
/>
    );
  }

  i++;

  while (i < lines.length && lines[i].trim() !== "[/IMAGE3]") {
    i++;
  }

  i++;
  continue;
}

elements.push(<p key={elements.length}>{line}</p>);

i++;
}

return <Fragment>{elements}</Fragment>;
}