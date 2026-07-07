import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-admin";

async function submitTip(formData: FormData) {
  "use server";

  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const message = String(formData.get("message") || "").trim();

  if (!message) {
    throw new Error("Tipset mangler innhold");
  }

  const { error } = await supabaseAdmin.from("tips").insert({
    name: name || null,
    email: email || null,
    message,
    status: "new",
  });

  if (error) {
    throw new Error(error.message);
  }

  redirect("/tips/takk");
}

export default function TipsPage() {
  return (
    <main className="min-h-screen bg-[rgb(var(--paper))] px-4 py-8">
      <div className="mx-auto max-w-[760px] bg-white p-6 md:p-8">
        <div className="border-b-4 border-black pb-4">
          <div className="text-sm font-black uppercase tracking-[0.2em] text-[#C62828]">
            Tips redaksjonen
          </div>

          <h1 className="mt-2 text-5xl font-black tracking-tight">
            Har du observert en utvikling?
          </h1>

          <p className="mt-4 text-lg font-bold text-black/60">
            TV19 mottar tips om saker, situasjoner og hendelser som foreløpig
            vurderes som mulige.
          </p>
        </div>

        <form action={submitTip} className="mt-8 space-y-5">
          <div>
            <label className="mb-1 block text-sm font-black">Navn</label>
            <input
              name="name"
              className="w-full border border-black/20 px-4 py-3 font-bold outline-none focus:border-black"
              placeholder="Kan stå tomt"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-black">E-post</label>
            <input
              name="email"
              type="email"
              className="w-full border border-black/20 px-4 py-3 font-bold outline-none focus:border-black"
              placeholder="Kan stå tomt"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-black">Tips</label>
            <textarea
              name="message"
              required
              rows={8}
              className="w-full border border-black/20 px-4 py-3 text-lg leading-relaxed outline-none focus:border-black"
              placeholder="Beskriv utviklingen så nøkternt som mulig..."
            />
          </div>

          <button
            type="submit"
            className="bg-[#C62828] px-5 py-3 text-sm font-black uppercase tracking-[0.14em] text-white hover:bg-black"
          >
            Send tips
          </button>
        </form>
      </div>
    </main>
  );
}