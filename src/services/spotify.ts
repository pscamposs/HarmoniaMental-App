// src/services/spotify.ts

import { getStoredSpotifyToken } from "./spotifyAuth";

export type SpotifyTrack = {
  id: string;
  name: string;
  artist: string;
  album: string;
  albumArt: string;
  previewUrl: string | null;
  durationMs: number;
  spotifyUri: string;
};

/**
 * Busca tracks no Spotify via Search API.
 * Funciona em Development Mode sem Extended Quota.
 */
export async function searchSpotifyTracks(
  query: string,
  limit: number = 10,
): Promise<SpotifyTrack[]> {
  const token = await getStoredSpotifyToken();
  if (!token) {
    console.warn("[Spotify] Sem token para busca.");
    return [];
  }

  try {
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=${limit}`,
      { headers: { Authorization: `Bearer ${token}` } },
    );

    if (!response.ok) {
      const body = await response.text().catch(() => "<no-body>");
      console.error(`[Spotify] Search failed: ${response.status} - ${body}`);
      return [];
    }

    const data = await response.json();
    return (data.tracks?.items || []).map((track: any) => ({
      id: track.id,
      name: track.name,
      artist: track.artists?.map((a: any) => a.name).join(", ") || "Unknown",
      album: track.album?.name || "",
      albumArt: track.album?.images?.[0]?.url || "",
      previewUrl: track.preview_url ?? null,
      durationMs: track.duration_ms || 0,
      spotifyUri: track.uri || "",
    }));
  } catch (error) {
    console.error("[Spotify] Search error:", error);
    return [];
  }
}

/**
 * Busca terapêutica: executa múltiplas queries e combina resultados
 * removendo duplicatas. Ideal para montar seções temáticas.
 */
export async function searchTherapyTracks(
  queries: string[],
  tracksPerQuery: number = 5,
): Promise<SpotifyTrack[]> {
  const seenIds = new Set<string>();
  const results: SpotifyTrack[] = [];

  for (const query of queries) {
    const tracks = await searchSpotifyTracks(query, tracksPerQuery);
    for (const track of tracks) {
      if (!seenIds.has(track.id)) {
        seenIds.add(track.id);
        results.push(track);
      }
    }
  }

  return results;
}

/**
 * Busca uma track específica por artist + title no Spotify.
 */
export async function searchExactTrack(
  artist: string,
  title: string,
): Promise<SpotifyTrack | null> {
  const results = await searchSpotifyTracks(
    `track:${title} artist:${artist}`,
    1,
  );
  return results[0] ?? null;
}
