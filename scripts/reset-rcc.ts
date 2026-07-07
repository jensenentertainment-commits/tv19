import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const SEASON = "2026/27";

async function main() {
  const { error: eventsError } = await supabase
    .from("rcc_match_events")
    .delete()
    .gt("id", 0);

  if (eventsError) throw eventsError;

  const { error: matchesError } = await supabase
    .from("rcc_matches")
    .update({
      played: false,
      home_goals: null,
      away_goals: null,
      attendance: null,
    })
    .eq("season", SEASON);

  if (matchesError) throw matchesError;

  console.log(`Nullstilte Royal County Championship ${SEASON}.`);
  console.log("Kamper, målscorere og tilskuertall er fjernet.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});