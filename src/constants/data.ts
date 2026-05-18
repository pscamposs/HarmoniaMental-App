import { Colors } from "./colors";
import playlistCache from "./playlistCache.json";

// ── Types ─────────────────────────────────────────────────────────────────────

export type Song = {
  id: string;
  artist: string;
  title: string;
  album?: string;
  durationSeconds?: number;
  audioUrl?: string;
  spotifyUri?: string;
  artworkUrl?: string;
  tags?: string[];
};

export type Playlist = {
  id: string;
  name: string;
  description: string;
  iconName: string;
  imageUrl?: string;
  songs: Song[];
};

export type TherapySection = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  iconName: string;
  accentColor: string;
  targetState: "depressao" | "mania" | "ansiedade" | "equilibrio";
  therapyType: string;
  bpm: string;
  songs: Song[];
};

// ── Helpers ───────────────────────────────────────────────────────────────────

type CachedTrack = {
  id: string;
  name: string;
  artist: string;
  album: string;
  albumArt: string;
  previewUrl?: string | null;
  durationMs: number;
  spotifyUri: string;
};

function cachedToSongs(key: string): Song[] {
  const tracks = (playlistCache as Record<string, CachedTrack[]>)[key] || [];
  return tracks.map((t) => ({
    id: t.id,
    title: t.name,
    artist: t.artist,
    album: t.album,
    artworkUrl: t.albumArt,
    audioUrl: t.previewUrl ?? undefined,
    durationSeconds: Math.floor(t.durationMs / 1000),
    spotifyUri: t.spotifyUri,
  }));
}

// ── Tela 2: Musicoterapia ─────────────────────────────────────────────────────
// Tracks 100% do Spotify via cache pré-resolvido

export const THERAPY_SECTIONS: TherapySection[] = [
  {
    id: "depressao",
    title: "Para Momentos de Tristeza",
    subtitle: "Acolhimento e elevação gradual do humor",
    description:
      "Músicas selecionadas para acompanhar e gradualmente elevar o humor em estados depressivos. Ritmos suaves que validam o sentimento e conduzem à leveza.",
    iconName: "leaf",
    accentColor: Colors.lavender,
    targetState: "depressao",
    therapyType: "Sedativa › Estimulante",
    bpm: "50–80 BPM",
    songs: cachedToSongs("depressao"),
  },
  {
    id: "mania",
    title: "Acalmando a Agitação",
    subtitle: "Redução de hiperatividade mental",
    description:
      "Frequências e compassos lentos comprovados para reduzir estados de mania, hiperatividade e pensamentos acelerados. Favorece o retorno ao equilíbrio.",
    iconName: "water",
    accentColor: Colors.purple,
    targetState: "mania",
    therapyType: "Sedativa",
    bpm: "50–65 BPM",
    songs: cachedToSongs("mania"),
  },
  {
    id: "ansiedade",
    title: "Controle da Ansiedade",
    subtitle: "Respiração e presença no momento",
    description:
      "Composições com estrutura rítmica estável que induzem a respiração lenta e reduzem a ativação do sistema nervoso simpático.",
    iconName: "pulse",
    accentColor: Colors.mint,
    targetState: "ansiedade",
    therapyType: "Meditativa",
    bpm: "60–70 BPM",
    songs: cachedToSongs("ansiedade"),
  },
  {
    id: "equilibrio",
    title: "Manutenção do Equilíbrio",
    subtitle: "Para dias de estabilidade",
    description:
      "Para os dias em que o humor está estável: músicas que nutrem a sensação de bem-estar e ajudam a manter o equilíbrio emocional.",
    iconName: "sunny",
    accentColor: Colors.gold,
    targetState: "equilibrio",
    therapyType: "Estimulante Suave",
    bpm: "70–90 BPM",
    songs: cachedToSongs("equilibrio"),
  },
];

// ── Playlists de exploração ──────────────────────────────────────────────────
// Construídas a partir de subconjuntos das seções terapêuticas

export const PLAYLIST_DEFINITIONS = [
  {
    id: "animadas",
    name: "Playlist Animada",
    description: "Ideal para aumentar o foco e a energia de forma controlada.",
    iconName: "flash",
    sectionKey: "depressao" as const,
  },
  {
    id: "calmas",
    name: "Playlist para Relaxar",
    description: "Encontre a paz nos dias mais agitados.",
    iconName: "moon",
    sectionKey: "mania" as const,
  },
  {
    id: "minha",
    name: "Playlist para Acalmar a Mente",
    description: "Curada para momentos de equilíbrio emocional.",
    iconName: "musical-notes",
    sectionKey: "equilibrio" as const,
  },
];
