// app/admin/rediger/[id]/page.tsx

import { notFound, redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-admin";
import ArticleEditor from "../../../components/article-editor";
import { requireAdmin } from "@/lib/auth/require-admin";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[æ]/g, "ae")
    .replace(/[ø]/g, "o")
    .replace(/[å]/g, "a")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function updateArticle(formData: FormData) {
  "use server";

  await requireAdmin();

  const id = String(formData.get("id") || "");
  const title = String(formData.get("title") || "").trim();
  const kicker = String(formData.get("kicker") || "").trim();
  const category = String(formData.get("category") || "").trim();
  const selectedAuthor = String(formData.get("author") || "").trim();
const customAuthor = String(formData.get("custom_author") || "").trim();
const author = customAuthor || selectedAuthor || "TV 19s redaksjon";
const imageCaption2 = String(formData.get("image_caption_2") || "").trim();
const imageCaption3 = String(formData.get("image_caption_3") || "").trim();
  const excerpt = String(formData.get("excerpt") || "").trim();
  const body = String(formData.get("body") || "").trim();
  const status = String(formData.get("status") || "draft");
  const displayType = String(formData.get("display_type") || "standard");
  const featured = formData.get("featured") === "on";
  const currentImageUrl = String(formData.get("currentImageUrl") || "");
const image = formData.get("image") as File | null;
const currentImageUrl2 = String(formData.get("currentImageUrl2") || "");
const currentImageUrl3 = String(formData.get("currentImageUrl3") || "");
const imageCaption = String(formData.get("image_caption") || "").trim();
const image2 = formData.get("image2") as File;
const image3 = formData.get("image3") as File;

const imageUrl2 = (await uploadImage(image2)) || currentImageUrl2 || null;
const imageUrl3 = (await uploadImage(image3)) || currentImageUrl3 || null;
const plus_article = formData.get("plus_article") === "on";

const location = String(formData.get("location") || "").trim();

let image_url = currentImageUrl;
const publishedAtRaw = String(formData.get("published_at") || "");
const publishedAt = publishedAtRaw
  ? new Date(publishedAtRaw).toISOString()
  : null;

  if (!id || !title) {
    throw new Error("Mangler id eller tittel");
  }

  const tagsRaw = String(formData.get("tags") || "");

const tags = tagsRaw
  .split(",")
  .map((tag) => tag.trim())
  .filter(Boolean);

  const slug = slugify(title);

  if (image && image.size > 0) {
  const fileExt = image.name.split(".").pop();
  const fileName = `${Date.now()}-${slug}.${fileExt}`;

  const { error: uploadError } = await supabaseAdmin.storage
    .from("tv19-images")
    .upload(fileName, image, {
      contentType: image.type,
      upsert: false,
    });

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const { data } = supabaseAdmin.storage
    .from("tv19-images")
    .getPublicUrl(fileName);

  image_url = data.publicUrl;
}

  const { error } = await supabaseAdmin
    .from("articles")
    .update({
      title,
      slug,
      kicker,
      category,
      author,
      excerpt,
      body,
      status,
      featured,
      display_type: displayType,
      image_url,
      image_url_2: imageUrl2,
image_url_3: imageUrl3,
image_caption: imageCaption || null,
image_caption_2: imageCaption2,
image_caption_3: imageCaption3,
      plus_article,
      published_at: publishedAt,
      updated_at: new Date().toISOString(),
      tags,
      location: location || null,
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  redirect("/admin");
}

async function uploadImage(file: File) {
  if (!file || file.size === 0) return null;

  const ext = file.name.split(".").pop();
  const fileName = `${crypto.randomUUID()}.${ext}`;

  const { error } = await supabaseAdmin.storage
    .from("article-images")
    .upload(fileName, file);

  if (error) {
    throw new Error(error.message);
  }

  const { data } = supabaseAdmin.storage
    .from("article-images")
    .getPublicUrl(fileName);

  return data.publicUrl;
}

export default async function EditArticlePage({ params }: Props) {
  const { id } = await params;

  const { data: article, error } = await supabaseAdmin
    .from("articles")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !article) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#f3eeee] px-4 py-8">
      <div className="mx-auto max-w-[820px] bg-white p-6 shadow-sm">
        <div className="mb-6 border-b-4 border-black pb-3">
          <div className="text-sm font-black uppercase tracking-[0.18em] text-red-600">
            TV 19 admin
          </div>

          <h1 className="text-4xl font-black tracking-tight">
            Rediger artikkel
          </h1>
        </div>

      <form action={updateArticle} className="space-y-5">
  <input type="hidden" name="id" value={article.id} />

  <input
    type="hidden"
    name="currentImageUrl"
    value={article.image_url || ""}
  />



<input
  type="hidden"
  name="currentImageUrl2"
  value={article.image_url_2 || ""}
/>

<input
  type="hidden"
  name="currentImageUrl3"
  value={article.image_url_3 || ""}
/>

  <ArticleEditor article={article} />


          <div className="flex gap-3">
            <button
              type="submit"
              className="bg-red-600 px-5 py-3 text-sm font-black uppercase tracking-[0.12em] text-white hover:bg-red-700"
            >
              Lagre endringer
            </button>

            <a
              href="/admin"
              className="px-5 py-3 text-sm font-black uppercase tracking-[0.12em] text-black/60 hover:text-black"
            >
              Avbryt
            </a>
          </div>
        </form>
      </div>
    </main>
  );
}