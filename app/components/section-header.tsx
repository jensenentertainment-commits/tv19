export default function SectionHeader({
  title,
  action,
}: {
  title: string;
  action?: { label: string; href?: string };
}) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div className="text-[0.92rem] font-[900] tracking-[0.16em] text-black/60">
        {title}
      </div>
      {action ? (
        <a
          href={action.href ?? "#"}
          className="text-sm font-[700] text-black/55 hover:text-black no-underline hover:underline"
        >
          {action.label}
        </a>
      ) : null}
    </div>
  );
}
