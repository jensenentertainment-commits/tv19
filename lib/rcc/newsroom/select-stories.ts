import type { RccStoryCandidate } from "@/lib/rcc/newsroom/detect-rcc-stories";

type SelectStoriesOptions = {
  minimumPriority?: number;
  maximumStories?: number;
  maximumStoriesPerMatch?: number;
};

export function selectStories(
  candidates: RccStoryCandidate[],
  options: SelectStoriesOptions = {}
) {
  const minimumPriority = options.minimumPriority ?? 75;
  const maximumStories = options.maximumStories ?? 2;
  const maximumStoriesPerMatch =
    options.maximumStoriesPerMatch ?? 1;

  const sortedCandidates = Array.from(
    new Map(
      candidates.map((candidate) => [
        candidate.deduplicationKey,
        candidate,
      ])
    ).values()
  )
    .filter((candidate) => candidate.priority >= minimumPriority)
    .sort((a, b) => b.priority - a.priority);

  const selected: RccStoryCandidate[] = [];
  const storiesPerMatch = new Map<string, number>();

  for (const candidate of sortedCandidates) {
    if (selected.length >= maximumStories) {
      break;
    }

    if (candidate.matchId) {
      const currentCount =
        storiesPerMatch.get(candidate.matchId) ?? 0;

      if (currentCount >= maximumStoriesPerMatch) {
        continue;
      }

      storiesPerMatch.set(
        candidate.matchId,
        currentCount + 1
      );
    }

    selected.push(candidate);
  }

  return selected;
}