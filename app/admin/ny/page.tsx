// app/admin/ny/page.tsx
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-admin";
import ArticleEditor from "../../components/article-editor";
import { requireAdmin } from "@/lib/auth/require-admin";

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

async function createArticle(formData: FormData) {
  "use server";

  await requireAdmin();

  const title = String(formData.get("title") || "").trim();
  const kicker = String(formData.get("kicker") || "").trim();
  const category = String(formData.get("category") || "").trim();
  const selectedAuthor = String(formData.get("author") || "").trim();
const customAuthor = String(formData.get("custom_author") || "").trim();
const author = customAuthor || selectedAuthor || "TV 19s redaksjon";
const imageCaption = String(formData.get("image_caption") || "").trim();
const imageCaption2 = String(formData.get("image_caption_2") || "").trim();
const imageCaption3 = String(formData.get("image_caption_3") || "").trim();
  const excerpt = String(formData.get("excerpt") || "").trim();
  const body = String(formData.get("body") || "").trim();
  const status = String(formData.get("status") || "draft");
  const featured = formData.get("featured") === "on";
  const plus_article = formData.get("plus_article") === "on";
  const image2 = formData.get("image2") as File;
const image3 = formData.get("image3") as File;
const location = String(formData.get("location") || "").trim();


const imageUrl2 = await uploadImage(image2);
const imageUrl3 = await uploadImage(image3);

const publishedAtRaw = String(formData.get("published_at") || "");
const publishedAt = publishedAtRaw
  ? new Date(publishedAtRaw).toISOString()
  : new Date().toISOString();

if (!title) {
  throw new Error("Tittel mangler");
}

const tagsRaw = String(formData.get("tags") || "");

const tags = tagsRaw
  .split(",")
  .map((tag) => tag.trim())
  .filter(Boolean);

const slug = slugify(title);
  
  const image = formData.get("image") as File | null;
let image_url = "";

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



  const { error } = await supabaseAdmin.from("articles").insert({
    title,
    slug,
    kicker,
    category,
    excerpt,
    body,
    status,
    featured,
    author,
    image_url,
    image_url_2: imageUrl2,
image_url_3: imageUrl3,
image_caption: imageCaption || null,
image_caption_2: imageCaption2,
image_caption_3: imageCaption3,
    plus_article,
    published_at: publishedAt,
    tags,
    location: location || null,
  });

  if (error) {
    throw new Error(error.message);
  }

  redirect("/admin/artikler");
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

export default async function NewArticlePage() {
  await requireAdmin();

  return (
    <main className="min-h-screen bg-[#f3eeee] px-4 py-8">
      <div className="mx-auto max-w-[820px] bg-white p-6 shadow-sm">
        <div className="mb-6 border-b-4 border-black pb-3">
          <div className="text-sm font-black uppercase tracking-[0.18em] text-red-600">
            TV 19 admin
          </div>
          <h1 className="text-4xl font-black tracking-tight">
            Ny artikkel
          </h1>
        </div>

  

        

      <form action={createArticle} className="space-y-5">
  <ArticleEditor />

          <button
            type="submit"
            className="bg-red-600 px-5 py-3 text-sm font-black uppercase tracking-[0.12em] text-white hover:bg-red-700"
          >
            Lagre artikkel
          </button>
        </form>
      </div>
    </main>
  );
}