import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config({ path: ".env.local" });

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type PlayerRow = {
  shirt_number: number;
  name: string;
  position: string;
  age: number;
  nationality: string;
  rating: number;
};

function normalizePosition(pos: string) {
  if (pos === "GK") return "GK";
  if (pos.includes("B") || pos === "CB" || pos === "LB" || pos === "RB") return "DEF";
  if (pos.includes("M") || pos === "DM" || pos === "CM" || pos === "AM") return "MID";
  return "ATT";
}

function parseSquadFile(content: string) {
  const lines = content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const teamName = lines[0]
  .replace(/\s+–\s+tropp$/i, "")
  .replace(/\s+-\s+tropp$/i, "")
  .trim();

  const managerIndex = lines.findIndex((line) => line.toLowerCase() === "trener");
  const playersIndex = lines.findIndex((line) => line.toLowerCase() === "spillere");

  if (managerIndex === -1 || playersIndex === -1) {
    throw new Error(`Fant ikke Trener/Spillere i ${teamName}`);
  }

  const managerLine = lines[managerIndex + 1];
  const managerParts = managerLine.split("–").map((part) => part.trim());

  const manager = {
    name: managerParts[0],
    nationality: managerParts[1] || null,
    age: managerParts[2] ? Number(managerParts[2]) : null,
    preferred_formation: lines[managerIndex + 2] || null,
    play_style: lines[managerIndex + 3] || null,
    press_style: lines[managerIndex + 4] || null,
  };

  const players: PlayerRow[] = [];

  for (let i = playersIndex + 1; i < lines.length; i++) {
    const line = lines[i];

    if (line.toLowerCase() === "nøkkelspillere") break;
    if (line.startsWith("Nr")) continue;

    const parts = line.split(/\t+/);

    if (parts.length < 6) continue;

    const [nr, name, pos, age, nationality, rating] = parts;

    players.push({
      shirt_number: Number(nr),
      name,
      position: normalizePosition(pos),
      age: Number(age),
      nationality,
      rating: Number(rating),
    });
  }

  return {
    teamName,
    manager,
    players,
  };
}

async function main() {
  const squadsDir = path.join(process.cwd(), "data", "rcc-squads");
  const files = fs.readdirSync(squadsDir).filter((file) => file.endsWith(".txt"));

  console.log(`Fant ${files.length} stallfiler.`);

  for (const file of files) {
    const fullPath = path.join(squadsDir, file);
    const content = fs.readFileSync(fullPath, "utf8");

    let squad;

try {
  squad = parseSquadFile(content);
} catch (error) {
  console.warn(`Hopper over ${file}: ${(error as Error).message}`);
  continue;
}

    const { data: team, error: teamError } = await supabaseAdmin
      .from("rcc_teams")
      .select("id, name")
      .eq("name", squad.teamName)
      .single();

    if (teamError || !team) {
      console.warn(`Fant ikke lag i databasen: ${squad.teamName}`);
      continue;
    }

    await supabaseAdmin.from("rcc_managers").upsert(
      {
        team_id: team.id,
        name: squad.manager.name,
        nationality: squad.manager.nationality,
        age: squad.manager.age,
        preferred_formation: squad.manager.preferred_formation,
        play_style: squad.manager.play_style,
        press_style: squad.manager.press_style,
      },
      { onConflict: "team_id" }
    );

    for (const player of squad.players) {
      const { error } = await supabaseAdmin.from("rcc_players").upsert(
        {
          team_id: team.id,
          name: player.name,
          position: player.position,
          shirt_number: player.shirt_number,
          age: player.age,
          nationality: player.nationality,
          rating: player.rating,
        },
        { onConflict: "team_id,shirt_number" }
      );

      if (error) {
        console.error(`Feil på ${squad.teamName} / ${player.name}:`, error.message);
      }
    }

    console.log(
      `Importert ${squad.teamName}: ${squad.players.length} spillere + trener`
    );
  }

  console.log("Ferdig.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});