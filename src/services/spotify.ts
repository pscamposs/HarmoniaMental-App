/**
 * Spotify API Service — PLACEHOLDER
 * ───────────────────────────────────
 * Integrar com Spotify Web API usando fluxo Client Credentials para busca
 * pública de faixas e OAuth PKCE para playlists do usuário.
 *
 * Docs: https://developer.spotify.com/documentation/web-api
 *
 * Variáveis de ambiente necessárias (app.config.js / .env):
 *   EXPO_PUBLIC_SPOTIFY_CLIENT_ID
 *   EXPO_PUBLIC_SPOTIFY_CLIENT_SECRET
 */

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

export type SpotifyPlaylist = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  trackCount: number;
};

// ── Mock data ────────────────────────────────

export async function searchTracks(query: string): Promise<SpotifyTrack[]> {
  // TODO: GET https://api.spotify.com/v1/search?q={query}&type=track
  console.log("[Spotify] searchTracks:", query);
  return MOCK_TRACKS;
}

export async function getPlaylistTracks(
  playlistId: string,
): Promise<SpotifyTrack[]> {
  // TODO: GET https://api.spotify.com/v1/playlists/{playlistId}/tracks
  console.log("[Spotify] getPlaylistTracks:", playlistId);
  return MOCK_TRACKS;
}

export async function getRecommendations(
  seedTrackIds: string[],
): Promise<SpotifyTrack[]> {
  // TODO: GET https://api.spotify.com/v1/recommendations?seed_tracks={ids}
  console.log("[Spotify] getRecommendations:", seedTrackIds);
  return MOCK_TRACKS;
}

const MOCK_TRACKS: SpotifyTrack[] = [
  {
    id: "mock_1",
    name: "River Flows in You",
    artist: "Yiruma",
    album: "First Love",
    albumArt: "",
    previewUrl: null,
    durationMs: 210000,
    spotifyUri: "spotify:track:mock_1",
  },
  {
    id: "mock_2",
    name: "Weightless",
    artist: "Marconi Union",
    album: "Weightless",
    albumArt: "",
    previewUrl: null,
    durationMs: 498000,
    spotifyUri: "spotify:track:mock_2",
  },
];
