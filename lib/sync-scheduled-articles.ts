import { supabaseAdmin } from "@/lib/supabase-admin";

export async function syncScheduledArticles() {
  const now = new Date().toISOString();

  const { error } = await supabaseAdmin
    .from("articles")
    .update({
      status: "published",
    })
    .eq("status", "draft")
    .not("published_at", "is", null)
    .lte("published_at", now);

  if (error) {
    console.error("Kunne ikke synkronisere planlagte artikler:", error);
  }
}