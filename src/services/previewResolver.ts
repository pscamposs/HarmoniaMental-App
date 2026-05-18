import { Song } from "../constants/data";

type ItunesSearchResult = {
  previewUrl?: string;
  trackName?: string;
  artistName?: string;
};

type ItunesSearchResponse = {
  results?: ItunesSearchResult[];
};

const ITUNES_SEARCH_ENDPOINT = "https://itunes.apple.com/search";

function normalizeSearchText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\([^)]*\)|\[[^\]]*\]/g, " ")
    .replace(/\b(remaster(ed)?|live|edit|version|feat\.?|ft\.?)\b/gi, " ")
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function firstArtist(artist: string) {
  return artist.split(",")[0]?.trim() || artist;
}

function resultScore(result: ItunesSearchResult, song: Song) {
  const resultTitle = normalizeSearchText(result.trackName ?? "");
  const resultArtist = normalizeSearchText(result.artistName ?? "");
  const targetTitle = normalizeSearchText(song.title);
  const targetArtist = normalizeSearchText(firstArtist(song.artist));

  let score = 0;
  if (resultTitle === targetTitle) score += 4;
  else if (resultTitle.includes(targetTitle) || targetTitle.includes(resultTitle)) score += 2;

  if (resultArtist === targetArtist) score += 3;
  else if (resultArtist.includes(targetArtist) || targetArtist.includes(resultArtist)) score += 1;

  return score;
}

export function isExpiringPreviewUrl(url?: string) {
  return Boolean(url?.includes("cdnt-preview.dzcdn.net") || url?.includes("hdnea="));
}

export async function resolveItunesPreviewUrl(song: Song) {
  const query = `${normalizeSearchText(song.title)} ${normalizeSearchText(firstArtist(song.artist))}`;
  const url = `${ITUNES_SEARCH_ENDPOINT}?term=${encodeURIComponent(query)}&media=music&entity=song&limit=5`;

  const response = await fetch(url);
  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as ItunesSearchResponse;
  const results = (data.results ?? []).filter(
    (result) => typeof result.previewUrl === "string" && result.previewUrl.length > 0,
  );

  if (results.length === 0) {
    return null;
  }

  const [bestMatch] = results.sort((a, b) => resultScore(b, song) - resultScore(a, song));
  return bestMatch.previewUrl ?? null;
}
