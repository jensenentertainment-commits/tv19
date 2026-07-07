import Link from "next/link";

export default function TipsThanksPage() {
  return (
    <main className="min-h-screen bg-[rgb(var(--paper))] px-4 py-8">
      <div className="mx-auto max-w-[720px] bg-white p-8">
        <div className="text-sm font-black uppercase tracking-[0.2em] text-[#C62828]">
          Tips mottatt
        </div>

        <h1 className="mt-2 text-5xl font-black tracking-tight">
          Redaksjonen vurderer utviklingen
        </h1>

        <p className="mt-4 text-lg font-bold text-black/60">
          Tipset er mottatt. TV19 kan ikke garantere at noe skjer, men kan
          bekrefte at noe nå er registrert.
        </p>

        <Link
          href="/"
          className="mt-6 inline-block bg-[#183A66] px-5 py-3 text-sm font-black uppercase tracking-[0.14em] text-white no-underline hover:bg-black"
        >
          Til forsiden
        </Link>
      </div>
    </main>
  );
}