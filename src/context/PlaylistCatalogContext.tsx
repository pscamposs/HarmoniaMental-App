import React, {
  createContext,
  ReactNode,
  useContext,
  useMemo,
} from "react";
import {
  Playlist,
  Song,
  THERAPY_SECTIONS,
  TherapySection,
  PLAYLIST_DEFINITIONS,
} from "../constants/data";

type PlaylistCatalogContextValue = {
  playlists: Playlist[];
  therapySections: TherapySection[];
  songs: Song[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  getPlaylistById: (id: string) => Playlist | undefined;
  getSongAudioUrl: (song: Song) => string | undefined;
  getSongArtworkUrl: (song: Song) => string | undefined;
};

// Playlists de exploração construídas a partir das seções terapêuticas
const sectionMap = new Map(THERAPY_SECTIONS.map((s) => [s.targetState, s]));

const defaultPlaylists: Playlist[] = PLAYLIST_DEFINITIONS.map((def) => {
  const section = sectionMap.get(def.sectionKey);
  return {
    id: def.id,
    name: def.name,
    description: def.description,
    iconName: def.iconName,
    songs: section?.songs || [],
  };
});

function collectSongs(playlists: Playlist[], sections: TherapySection[]): Song[] {
  const byId = new Map<string, Song>();
  for (const playlist of playlists) {
    for (const song of playlist.songs) {
      byId.set(song.id, song);
    }
  }
  for (const section of sections) {
    for (const song of section.songs) {
      byId.set(song.id, song);
    }
  }
  return [...byId.values()];
}

const defaultSongs = collectSongs(defaultPlaylists, THERAPY_SECTIONS);

const PlaylistCatalogContext =
  createContext<PlaylistCatalogContextValue | null>(null);

export function PlaylistCatalogProvider({ children }: { children: ReactNode }) {
  const playlistsById = useMemo(
    () => new Map<string, Playlist>(defaultPlaylists.map((p) => [p.id, p])),
    [],
  );

  const value = useMemo<PlaylistCatalogContextValue>(
    () => ({
      playlists: defaultPlaylists,
      therapySections: THERAPY_SECTIONS,
      songs: defaultSongs,
      isLoading: false,
      error: null,
      refresh: async () => {},
      getPlaylistById: (id) => playlistsById.get(id),
      getSongAudioUrl: (song) => song.audioUrl,
      getSongArtworkUrl: (song) => song.artworkUrl,
    }),
    [playlistsById],
  );

  return (
    <PlaylistCatalogContext.Provider value={value}>
      {children}
    </PlaylistCatalogContext.Provider>
  );
}

export function usePlaylistCatalog() {
  const value = useContext(PlaylistCatalogContext);
  if (!value) {
    throw new Error(
      "usePlaylistCatalog must be used inside PlaylistCatalogProvider",
    );
  }
  return value;
}
