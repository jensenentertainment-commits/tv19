import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { simulateRccMatches } from "../lib/rcc/core/simulate-rcc-matches";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error("Mangler NEXT_PUBLIC_SUPABASE_URL i .env.local");
}

if (!serviceRoleKey) {
  throw new Error("Mangler SUPABASE_SERVICE_ROLE_KEY i .env.local");
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

const simulateAllUnplayed = process.argv.includes("--all");

async function main() {
  console.log(
    simulateAllUnplayed
      ? "Simulerer alle uspilt RCC-kamper..."
      : "Simulerer RCC-kamper som har passert kampdato..."
  );

  const matches = await simulateRccMatches(supabase, {
    season: "2026/27",
    dueOnly: !simulateAllUnplayed,
  });

  if (!matches.length) {
    console.log(
      simulateAllUnplayed
        ? "Ingen uspilt RCC-kamper funnet."
        : "Ingen forfalte RCC-kamper funnet."
    );

    return;
  }

  console.log(`\nSimulerte ${matches.length} RCC-kamper:\n`);

  for (const match of matches) {
    console.log(
      `${match.homeTeam.name} ${match.homeGoals}-${match.awayGoals} ${match.awayTeam.name} (${match.attendance.toLocaleString("no-NO")} tilskuere)`
    );

    for (const event of match.events) {
      console.log(`  ${event.minute}' ${event.playerName}`);
    }

    console.log("");
  }

  console.log("Ferdig.");
}

main().catch((error) => {
  console.error("RCC-simuleringen feilet:", error);
  process.exit(1);
});