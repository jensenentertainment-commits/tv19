import type { MetadataRoute } from "next";
import { supabaseAdmin } from "@/lib/supabase-admin";

const SITE_URL = "https://tv19.no";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data: articles } = await supabaseAdmin
    .from("articles")
    .select("slug, updated_at, published_at")
    .eq("status", "published");

  const articleUrls =
    articles?.map((article) => ({
      url: `${SITE_URL}/artikkel/${article.slug}`,
      lastModified: article.updated_at || article.published_at || new Date(),
    })) ?? [];

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
    },
    {
      url: `${SITE_URL}/rcc`,
      lastModified: new Date(),
    },
    {
      url: `${SITE_URL}/rcc/kamper`,
      lastModified: new Date(),
    },
    {
      url: `${SITE_URL}/rcc/tabell`,
      lastModified: new Date(),
    },
    {
      url: `${SITE_URL}/rcc/statistikk`,
      lastModified: new Date(),
    },
    ...articleUrls,
  ];
}