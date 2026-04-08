import { Colors } from "./colors";

// ── Types ─────────────────────────────────────────────────────────────────────

export type Song = {
  id: string;
  artist: string;
  title: string;
};

export type Playlist = {
  id: string;
  name: string;
  description: string;
  iconName: string;
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

export type MusicGenre = {
  id: string;
  name: string;
  iconName: string;
  color: string;
  description: string;
  songs: Song[];
};

// ── Tela 2: Musicoterapia ─────────────────────────────────────────────────────
// Nota: arquivos de áudio serão integrados via Spotify API na próxima sprint

export const THERAPY_SECTIONS: TherapySection[] = [
  {
    id: "depressao",
    title: "Para Momentos de Tristeza",
    subtitle: "Acolhimento e elevação gradual do humor",
    description:
      "Músicas selecionadas para acompanhar e gradualmente elevar o humor em estados depressivos. Ritmos suaves que validam o sentimento e conduzem à leveza.",
    iconName: "leaf",
    accentColor: "#6C99FF",
    targetState: "depressao",
    therapyType: "Sedativa › Estimulante",
    bpm: "50–80 BPM",
    songs: [
      { id: "d1", artist: "Yiruma", title: "River Flows in You" },
      { id: "d2", artist: "Debussy", title: "Clair de Lune" },
      { id: "d3", artist: "Adele", title: "Someone Like You" },
      { id: "d4", artist: "Billie Eilish", title: "Ocean Eyes" },
      { id: "d5", artist: "Ludovico Einaudi", title: "Experience" },
      { id: "d6", artist: "Nick Drake", title: "Pink Moon" },
      { id: "d7", artist: "Coldplay", title: "The Scientist" },
    ],
  },
  {
    id: "mania",
    title: "Acalmando a Agitação",
    subtitle: "Redução de hiperatividade mental",
    description:
      "Frequências e compassos lentos comprovados para reduzir estados de mania, hiperatividade e pensamentos acelerados. Favorece o retorno ao equilíbrio.",
    iconName: "water",
    accentColor: "#A78BFA",
    targetState: "mania",
    therapyType: "Sedativa",
    bpm: "50–65 BPM",
    songs: [
      { id: "mn1", artist: "Marconi Union", title: "Weightless" },
      { id: "mn2", artist: "Sigur Rós", title: "Ára bátur" },
      { id: "mn3", artist: "Brian Eno", title: "An Ending (Ascent)" },
      { id: "mn4", artist: "Max Richter", title: "On the Nature of Daylight" },
      { id: "mn5", artist: "Ólafur Arnalds", title: "Near Light" },
      { id: "mn6", artist: "Nils Frahm", title: "Says" },
    ],
  },
  {
    id: "ansiedade",
    title: "Controle da Ansiedade",
    subtitle: "Respiração e presença no momento",
    description:
      "Composições com estrutura rítmica estável que induzem a respiração lenta e reduzem a ativação do sistema nervoso simpático.",
    iconName: "pulse",
    accentColor: "#34D399",
    targetState: "ansiedade",
    therapyType: "Meditativa",
    bpm: "60–70 BPM",
    songs: [
      { id: "an1", artist: "Satie", title: "Gymnopédie No.1" },
      {
        id: "an2",
        artist: "Explosions in the Sky",
        title: "First Breath After Coma",
      },
      { id: "an3", artist: "Lana Del Rey", title: "Video Games" },
      { id: "an4", artist: "Mazzy Star", title: "Fade Into You" },
      { id: "an5", artist: "The xx", title: "Intro" },
    ],
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
    songs: [
      { id: "eq1", artist: "Jack Johnson", title: "Better Together" },
      { id: "eq2", artist: "Ben Harper", title: "Steal My Kisses" },
      { id: "eq3", artist: "Jason Mraz", title: "I'm Yours" },
      { id: "eq4", artist: "Norah Jones", title: "Come Away With Me" },
      { id: "eq5", artist: "John Mayer", title: "Gravity" },
    ],
  },
];

// ── Tela 3: Gêneros Musicais ──────────────────────────────────────────────────

export const MUSIC_GENRES: MusicGenre[] = [
  {
    id: "pop",
    name: "Pop",
    iconName: "star",
    color: "#FF6B9D",
    description: "Os maiores hits do momento",
    songs: [
      { id: "pop1", artist: "Dua Lipa", title: "Levitating" },
      { id: "pop2", artist: "The Weeknd", title: "Blinding Lights" },
      { id: "pop3", artist: "Olivia Rodrigo", title: "good 4 u" },
      { id: "pop4", artist: "Harry Styles", title: "As It Was" },
      { id: "pop5", artist: "Taylor Swift", title: "Anti-Hero" },
    ],
  },
  {
    id: "internacional",
    name: "Internacional",
    iconName: "globe",
    color: "#4ECDC4",
    description: "Clássicos e hits globais",
    songs: [
      { id: "int1", artist: "Coldplay", title: "Yellow" },
      { id: "int2", artist: "Adele", title: "Rolling in the Deep" },
      { id: "int3", artist: "Ed Sheeran", title: "Shape of You" },
      { id: "int4", artist: "Imagine Dragons", title: "Believer" },
    ],
  },
  {
    id: "mpb",
    name: "MPB",
    iconName: "musical-notes",
    color: "#FFD93D",
    description: "Música Popular Brasileira",
    songs: [
      { id: "mpb1", artist: "Djavan", title: "Flor de Lis" },
      { id: "mpb2", artist: "Maria Bethânia", title: "Carcará" },
      { id: "mpb3", artist: "Caetano Veloso", title: "Cucurrucucú Paloma" },
      { id: "mpb4", artist: "Gilberto Gil", title: "Aquele Abraço" },
    ],
  },
  {
    id: "rock",
    name: "Rock",
    iconName: "flash",
    color: "#FF8C42",
    description: "Do clássico ao alternativo",
    songs: [
      { id: "rock1", artist: "Queen", title: "Bohemian Rhapsody" },
      { id: "rock2", artist: "Nirvana", title: "Come as You Are" },
      { id: "rock3", artist: "Radiohead", title: "Creep" },
      { id: "rock4", artist: "The Killers", title: "Mr. Brightside" },
    ],
  },
  {
    id: "jazz",
    name: "Jazz",
    iconName: "wine",
    color: "#9B59B6",
    description: "Sofisticação e improviso",
    songs: [
      { id: "jazz1", artist: "Miles Davis", title: "So What" },
      { id: "jazz2", artist: "Chet Baker", title: "Almost Blue" },
      { id: "jazz3", artist: "Norah Jones", title: "Come Away With Me" },
    ],
  },
  {
    id: "classico",
    name: "Clássico",
    iconName: "library",
    color: "#3498DB",
    description: "Grandes compositores da história",
    songs: [
      { id: "cl1", artist: "Beethoven", title: "Moonlight Sonata" },
      { id: "cl2", artist: "Mozart", title: "Lacrimosa" },
      { id: "cl3", artist: "Bach", title: "Air on the G String" },
    ],
  },
  {
    id: "lofi",
    name: "Lo-Fi",
    iconName: "cafe",
    color: "#E8C99A",
    description: "Foco, estudo e relaxamento",
    songs: [
      { id: "lo1", artist: "Idealism", title: "Eventide" },
      { id: "lo2", artist: "j'san", title: "Snowfall" },
      { id: "lo3", artist: "Kupla", title: "Flower Dance" },
    ],
  },
  {
    id: "sertanejo",
    name: "Sertanejo",
    iconName: "heart",
    color: "#E17055",
    description: "O jeito brasileiro de sentir",
    songs: [
      { id: "ser1", artist: "Ana Castela", title: "Pipoco" },
      { id: "ser2", artist: "Gusttavo Lima", title: "Buteco" },
      { id: "ser3", artist: "Zé Neto & Cristiano", title: "Largado às Traças" },
    ],
  },
  {
    id: "eletronico",
    name: "Eletrônico",
    iconName: "radio",
    color: "#A29BFE",
    description: "Batidas que movem o corpo",
    songs: [
      { id: "el1", artist: "Daft Punk", title: "Get Lucky" },
      { id: "el2", artist: "Disclosure", title: "Latch" },
      { id: "el3", artist: "Flume", title: "Never Be Like You" },
    ],
  },
  {
    id: "rnb",
    name: "R&B / Soul",
    iconName: "sparkles",
    color: "#FD79A8",
    description: "Alma, groove e emoção",
    songs: [
      { id: "rnb1", artist: "Frank Ocean", title: "Thinkin Bout You" },
      { id: "rnb2", artist: "SZA", title: "Kill Bill" },
      { id: "rnb3", artist: "H.E.R.", title: "Focus" },
    ],
  },
  {
    id: "hiphop",
    name: "Hip-Hop / Rap",
    iconName: "mic",
    color: "#FDCB6E",
    description: "Rimas, flow e identidade",
    songs: [
      { id: "hh1", artist: "Kendrick Lamar", title: "HUMBLE." },
      { id: "hh2", artist: "Drake", title: "God's Plan" },
      { id: "hh3", artist: "BK Braga", title: "Mil Grau" },
    ],
  },
  {
    id: "ambient",
    name: "Ambient",
    iconName: "cloud",
    color: "#74B9FF",
    description: "Paisagens sonoras e meditação",
    songs: [
      { id: "am1", artist: "Brian Eno", title: "Music for Airports" },
      { id: "am2", artist: "Moby", title: "Porcelain" },
      {
        id: "am3",
        artist: "Stars of the Lid",
        title: "Requiem for Dying Mothers",
      },
    ],
  },
];

// ── Player ────────────────────────────────────────────────────────────────────

export const currentTrack = {
  artist: "Yiruma",
  title: "River Flows in You",
  duration: 210,
  progress: 45,
};

export const animadasPlaylist: Playlist = {
  id: "animadas",
  name: "Playlist Animada",
  description: "Ideal para aumentar o foco e a energia de forma controlada.",
  iconName: "flash",
  songs: [
    { id: "a1", artist: "Dua Lipa", title: "Levitating" },
    { id: "a2", artist: "The Weeknd", title: "Blinding Lights" },
    { id: "a3", artist: "Lady Gaga", title: "Poker Face" },
    { id: "a4", artist: "Bruno Mars", title: "Uptown Funk" },
    { id: "a5", artist: "Olivia Rodrigo", title: "good 4 u" },
    { id: "a6", artist: "Coldplay", title: "Yellow" },
    { id: "a7", artist: "Imagine Dragons", title: "Believer" },
  ],
};

export const calmasPlaylist: Playlist = {
  id: "calmas",
  name: "Playlist para Relaxar",
  description: "Encontre a paz nos dias mais agitados.",
  iconName: "moon",
  songs: [
    { id: "c1", artist: "Lana Del Rey", title: "Video Games" },
    { id: "c2", artist: "Adele", title: "Easy On Me" },
    { id: "c3", artist: "Billie Eilish", title: "Ocean Eyes" },
    { id: "c4", artist: "Marconi Union", title: "Weightless" },
    { id: "c5", artist: "Yiruma", title: "River Flows in You" },
    { id: "c6", artist: "Sigur Rós", title: "Lullaby" },
    { id: "c7", artist: "Nick Drake", title: "Pink Moon" },
  ],
};

export const minhaPlaylist: Playlist = {
  id: "minha",
  name: "Playlist para Acalmar a Mente",
  description: "Curada para momentos de equilíbrio emocional.",
  iconName: "musical-notes",
  songs: [
    { id: "m1", artist: "Billie Eilish", title: "Ocean Eyes" },
    { id: "m2", artist: "Marconi Union", title: "Weightless" },
    { id: "m3", artist: "Yiruma", title: "River Flows in You" },
    { id: "m4", artist: "Sigur Rós", title: "Lullaby" },
    { id: "m5", artist: "Adele", title: "Easy On Me" },
  ],
};
