import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { simulateRccMatches } from "@/lib/rcc/core/simulate-rcc-matches";
import { analyzeRccRound } from "@/lib/rcc/newsroom/analyze-rcc";
import { detectRccStories } from "@/lib/rcc/newsroom/detect-rcc-stories";
import { selectStories } from "@/lib/rcc/newsroom/select-stories";
import type { RccStoryCandidate } from "@/lib/rcc/newsroom/detect-rcc-stories";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    return NextResponse.json(
      {
        ok: false,
        error: "CRON_SECRET mangler.",
      },
      { status: 500 }
    );
  }

  const authorization = request.headers.get("authorization");

  if (authorization !== `Bearer ${cronSecret}`) {
    return NextResponse.json(
      {
        ok: false,
        error: "Ikke autorisert.",
      },
      { status: 401 }
    );
  }

  try {
    const matches = await simulateRccMatches(supabaseAdmin, {
      season: "2026/27",
      dueOnly: true,
    });

   let selectedStories: RccStoryCandidate[] = [];

    if (matches.length > 0) {
      const analysis = await analyzeRccRound({
        supabase: supabaseAdmin,
        season: "2026/27",
        simulatedMatches: matches,
      });

      const candidates = detectRccStories(analysis);

      selectedStories = selectStories(candidates, {
        minimumPriority: 75,
        maximumStories: 2,
        maximumStoriesPerMatch: 1,
      });

      console.log(
        "Sportsredaksjonen valgte:",
        selectedStories.map((story) => ({
          type: story.type,
          priority: story.priority,
          titleHint: story.titleHint,
        }))
      );
    }

    return NextResponse.json({
      ok: true,
      simulated: matches.length,

      matches: matches.map((match) => ({
        id: match.matchId,
        round: match.round,
        homeTeam: match.homeTeam.name,
        awayTeam: match.awayTeam.name,
        homeGoals: match.homeGoals,
        awayGoals: match.awayGoals,
      })),

      selectedStories: selectedStories.map((story) => ({
        type: story.type,
        priority: story.priority,
        titleHint: story.titleHint,
        matchId: story.matchId ?? null,
      })),
    });
  } catch (error) {
    console.error("RCC-cron feilet:", error);

    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Ukjent feil under RCC-simulering.",
      },
      { status: 500 }
    );
  }
}