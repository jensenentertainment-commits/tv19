"use client";

export default function ShareButton({
  title,
}: {
  title: string;
}) {
  async function handleShare() {
    const url = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title,
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        alert("Lenke kopiert");
      }
    } catch {
      // bruker avbrøt
    }
  }

  return (
    <button
      onClick={handleShare}
      className="border border-black/20 px-4 py-2 text-xs font-black uppercase tracking-[0.12em] hover:bg-[rgb(var(--accent))] hover:text-white transition"
    >
      Del artikkel
    </button>
  );
}