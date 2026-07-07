// components/bulletin-feed.tsx
type Bulletin = {
  id: string;
  section: string;
  title: string;
  href?: string; // hvis finnes: “kan klikkes” – men skal ikke være tydelig
  badge?: "SENDING" | "VIDEO" | "PÅGÅR" | "MELDING";
};

function Badge({ label }: { label: NonNullable<Bulletin["badge"]> }) {
  const liveish = label === "PÅGÅR" || label === "SENDING";
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-[0.70rem] font-[950] tracking-[0.12em]"
      style={{
        borderColor: liveish ? "rgba(235,41,52,.22)" : "rgba(0,0,0,.10)",
        background: liveish ? "rgba(235,41,52,.08)" : "rgba(0,0,0,.03)",
        color: liveish ? "rgb(var(--accent))" : "rgba(0,0,0,.62)",
      }}
    >
      {liveish ? (
        <span
          className="h-2 w-2 rounded-full"
          style={{ background: "rgb(var(--accent))" }}
          aria-hidden
        />
      ) : null}
      {label}
    </span>
  );
}

export default function BulletinFeed({
  title,
  items,
  dense,
}: {
  title: string;
  items: Bulletin[];
  dense?: boolean;
}) {
  return (
    <div className="surface p-5">
      <div className="flex items-center justify-between">
        <div className="text-sm font-[950] tracking-[0.14em] text-black/55">
          {title}
        </div>
        <div className="text-sm font-[850] text-black/35">
          Redaksjonen følger utviklingen
        </div>
      </div>

      <div className="mt-3 hairline" />

      <ul className={dense ? "mt-2" : "mt-3"}>
        {items.map((x, idx) => {
          // “Irrelevant relevans”: klikkbarhet skal være uklar
          const clickable = !!x.href;
          const Comp: any = clickable ? "a" : "div";

          return (
            <li key={x.id} className={dense ? "py-2.5" : "py-3"}>
              <Comp
                href={clickable ? x.href : undefined}
                className={[
                  "block rounded-[12px] px-3 py-2",
                  "border border-transparent",
                  // hover skal ikke “rope link”
                  "hover:bg-black/[0.02] hover:border-black/10",
                  // noen ikke-klikkbare får også hover for å forvirre litt
                  !clickable ? "cursor-default" : "cursor-pointer",
                ].join(" ")}
                // ingen tydelig affordance
                style={{ textDecoration: "none" }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-[0.74rem] font-[850] text-black/45">
                      {x.section}
                    </div>
                    <div className="mt-1 text-[1.02rem] leading-[1.22] font-[950] tracking-[-0.01em] text-black/90">
                      {x.title}
                    </div>
                  </div>

                  <div className="shrink-0 pt-0.5">
                    {x.badge ? <Badge label={x.badge} /> : null}
                  </div>
                </div>
              </Comp>

              {idx !== items.length - 1 ? (
                <div className="mt-2 hairline" />
              ) : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
