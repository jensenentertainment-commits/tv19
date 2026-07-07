import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase-admin";

export default async function AdsAdminPage() {
  const { data: ads, error } = await supabaseAdmin
    .from("ads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) console.error(error);

  return (
    <main className="min-h-screen bg-[rgb(var(--paper))] p-6">
      <div className="mx-auto max-w-[1100px]">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="text-sm font-black uppercase tracking-[0.18em] text-[rgb(var(--accent))]">
              TV19 Admin
            </div>
            <h1 className="text-5xl font-black tracking-tight">Annonser</h1>
          </div>

          <Link
            href="/admin/annonser/ny"
            className="bg-[rgb(var(--accent))] px-4 py-3 font-black text-white no-underline hover:bg-black"
          >
            Ny annonse
          </Link>
        </div>

        <div className="overflow-hidden bg-white">
          <table className="w-full">
            <thead className="border-b border-black/10 bg-black/5">
              <tr>
                <th className="px-4 py-3 text-left">Tittel</th>
                <th className="px-4 py-3 text-left">Tema</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Lenke</th>
                <th className="px-4 py-3 text-left">Handling</th>
              </tr>
            </thead>

            <tbody>
              {ads?.map((ad) => (
                <tr key={ad.id} className="border-b border-black/5">
                  <td className="px-4 py-4 font-black">{ad.title}</td>
                  <td className="px-4 py-4">{ad.theme || "blue"}</td>
                  <td className="px-4 py-4">
                    <span
                      className={
                        ad.active
                          ? "font-black text-green-700"
                          : "font-black text-orange-600"
                      }
                    >
                      {ad.active ? "Aktiv" : "Inaktiv"}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-black/50">
                    {ad.href || "-"}
                  </td>
                  <td className="px-4 py-4">
                    <Link
                      href={`/admin/annonser/rediger/${ad.id}`}
                      className="font-black text-[rgb(var(--accent))]"
                    >
                      Rediger
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {!ads?.length ? (
            <div className="p-6 text-center font-bold text-black/50">
              Ingen annonser ennå.
            </div>
          ) : null}
        </div>
      </div>
    </main>
  );
}