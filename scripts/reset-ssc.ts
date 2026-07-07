import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const COMPETITION_SLUG = "solaris-summer-cup";

async function main() {
  const { data: competition, error: competitionError } = await supabase
    .from("rcc_competitions")
    .select("id,name")
    .eq("slug", COMPETITION_SLUG)
    .single();

  if (competitionError || !competition) {
    throw new Error("Fant ikke Solaris Summer Cup.");
  }

  const { error: deleteKnockoutError } = await supabase
    .from("rcc_competition_matches")
    .delete()
    .eq("competition_id", competition.id)
    .in("stage", ["semifinal", "final"]);

  if (deleteKnockoutError) throw deleteKnockoutError;

  const { error: resetGroupError } = await supabase
    .from("rcc_competition_matches")
    .update({
      played: false,
      home_goals: null,
      away_goals: null,
    })
    .eq("competition_id", competition.id)
    .eq("stage", "group");

  if (resetGroupError) throw resetGroupError;

  console.log(
    `Nullstilte ${competition.name}: gruppespill reset, sluttspill slettet.`
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});