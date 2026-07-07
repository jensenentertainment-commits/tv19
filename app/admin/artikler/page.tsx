import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { requireAdmin } from "@/lib/auth/require-admin";
import { revalidatePath } from "next/cache";

type Props = {
  searchParams?: Promise<{
    q?: string;
    category?: string;
  }>;
};

const categories = [
  "Alle",
  "Norge",
  "Verden",
  "Økonomi",
  "Sport",
  "Kultur",
  "Teknologi",
  "Samfunn",
  "Bekymret",
];

 async function deleteArticle(formData: FormData) {
  "use server";
  

  const id = String(formData.get("id") || "");

  if (!id) {
    throw new Error("Mangler artikkel-id");
  }

  const { error } = await supabaseAdmin
    .from("articles")
    .update({
      status: "deleted",
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}

export default async function ArticlesPage({ searchParams }: Props) {
  await requireAdmin();

  const params = await searchParams;
  const q = params?.q?.trim() || "";
  const category = params?.category || "Alle";

  let query = supabaseAdmin
    .from("articles")
    .select("*")
     .neq("status", "deleted")
    .order("created_at", { ascending: false });

  if (q) {
    query = query.ilike("title", `%${q}%`);
  }

  if (category !== "Alle") {
    query = query.eq("category", category);
  }

  const { data: articles, error } = await query;

  if (error) console.error(error);

 

  return (
    <main className="min-h-screen bg-[rgb(var(--paper))] px-4 py-8">
      <div className="mx-auto max-w-[1100px]">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <div className="text-sm font-black uppercase tracking-[0.18em] text-[rgb(var(--accent))]">
              TV19 Admin
            </div>

            <h1 className="text-5xl font-black tracking-tight">Artikler</h1>
          </div>

          <Link
            href="/admin/ny"
            className="bg-[rgb(var(--accent))] px-4 py-3 text-sm font-black text-white no-underline hover:bg-black"
          >
            Ny artikkel
          </Link>
        </div>

        <form className="mb-5 grid gap-3 bg-white p-4 md:grid-cols-[1fr_220px_auto]">
          <input
            name="q"
            defaultValue={q}
            placeholder="Søk etter tittel..."
            className="w-full border border-black/20 px-3 py-2 font-bold outline-none focus:border-black"
          />

          <select
            name="category"
            defaultValue={category}
            className="w-full border border-black/20 px-3 py-2 font-bold outline-none focus:border-black"
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="bg-[rgb(var(--brand))] px-4 py-2 text-sm font-black text-white hover:bg-black"
          >
            Filtrer
          </button>
        </form>

        <div className="overflow-hidden bg-white">
          {!articles?.length ? (
            <div className="p-8 text-center">
              <h2 className="text-2xl font-black">Ingen artikler funnet</h2>
              <p className="mt-2 font-bold text-black/50">
                Redaksjonen vurderer søket.
              </p>
            </div>
          ) : (
            articles.map((article) => (
              <div
                key={article.id}
                className="flex flex-col gap-4 border-b border-black/10 p-4 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <div className="text-xl font-black">{article.title}</div>

                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="bg-black px-2 py-1 text-xs font-black uppercase text-white">
                      {article.category || "TV19"}
                    </span>

                    <span
                      className={[
                        "px-2 py-1 text-xs font-black uppercase text-white",
                        article.status === "published"
                          ? "bg-green-700"
                          : "bg-orange-600",
                      ].join(" ")}
                    >
                      {article.status === "published" ? "Publisert" : "Kladd"}
                    </span>

                    {article.plus_article ? (
                      <span className="bg-[rgb(var(--brand))] px-2 py-1 text-xs font-black uppercase text-white">
                        TV19+
                      </span>
                    ) : null}

                    {article.featured ? (
                      <span className="bg-[rgb(var(--accent))] px-2 py-1 text-xs font-black uppercase text-white">
                        Hovedsak
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    href={`/a/${article.slug}`}
                    className="font-black text-[rgb(var(--brand))]"
                  >
                    Vis
                  </Link>

                  <Link
                    href={`/admin/rediger/${article.id}`}
                    className="font-black text-[rgb(var(--accent))]"
                  >
                    Rediger
                  </Link>
                  <form action={deleteArticle}>
  <input type="hidden" name="id" value={article.id} />

  <button
    type="submit"
    className="font-black text-black/35 hover:text-red-700"
  >
    Slett
  </button>
</form>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}