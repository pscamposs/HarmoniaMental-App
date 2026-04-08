import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Song } from "../constants/data";

type PlaybackTrack = Song & {
  duration: number;
};

type PlaybackContextType = {
  currentTrack: PlaybackTrack | null;
  isPlaying: boolean;
  progress: number;
  elapsedSeconds: number;
  playSong: (song: Song, queue?: Song[]) => void;
  togglePlayPause: () => void;
  playNext: () => void;
  playPrevious: () => void;
};

const PlaybackContext = createContext<PlaybackContextType>({
  currentTrack: null,
  isPlaying: false,
  progress: 0,
  elapsedSeconds: 0,
  playSong: () => {},
  togglePlayPause: () => {},
  playNext: () => {},
  playPrevious: () => {},
});

function toTrack(song: Song): PlaybackTrack {
  return { ...song, duration: 210 };
}

function songKey(song: Song) {
  return `${song.id}:${song.artist}:${song.title}`;
}

export function PlaybackProvider({ children }: { children: ReactNode }) {
  const [queue, setQueue] = useState<Song[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [currentTrack, setCurrentTrack] = useState<PlaybackTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (!isPlaying || !currentTrack) return;

    const timer = setInterval(() => {
      setElapsedSeconds((prev) => {
        const next = prev + 1;
        if (next >= currentTrack.duration) {
          if (currentIndex >= 0 && currentIndex < queue.length - 1) {
            const nextIndex = currentIndex + 1;
            const nextSong = queue[nextIndex];
            setCurrentIndex(nextIndex);
            setCurrentTrack(toTrack(nextSong));
            return 0;
          }
          setIsPlaying(false);
          return currentTrack.duration;
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, currentTrack, currentIndex, queue]);

  const progress = useMemo(() => {
    if (!currentTrack?.duration) return 0;
    return Math.min(1, elapsedSeconds / currentTrack.duration);
  }, [currentTrack, elapsedSeconds]);

  const playSong = (song: Song, nextQueue?: Song[]) => {
    const targetQueue = nextQueue && nextQueue.length > 0 ? nextQueue : [song];
    const targetIndex = targetQueue.findIndex(
      (s) => songKey(s) === songKey(song),
    );

    setQueue(targetQueue);
    setCurrentIndex(targetIndex >= 0 ? targetIndex : 0);
    setCurrentTrack(toTrack(song));
    setElapsedSeconds(0);
    setIsPlaying(true);
  };

  const togglePlayPause = () => {
    if (!currentTrack) return;
    setIsPlaying((prev) => !prev);
  };

  const playNext = () => {
    if (currentIndex < 0 || currentIndex >= queue.length - 1) return;
    const nextIndex = currentIndex + 1;
    setCurrentIndex(nextIndex);
    setCurrentTrack(toTrack(queue[nextIndex]));
    setElapsedSeconds(0);
    setIsPlaying(true);
  };

  const playPrevious = () => {
    if (currentIndex <= 0 || queue.length === 0) return;
    const prevIndex = currentIndex - 1;
    setCurrentIndex(prevIndex);
    setCurrentTrack(toTrack(queue[prevIndex]));
    setElapsedSeconds(0);
    setIsPlaying(true);
  };

  return (
    <PlaybackContext.Provider
      value={{
        currentTrack,
        isPlaying,
        progress,
        elapsedSeconds,
        playSong,
        togglePlayPause,
        playNext,
        playPrevious,
      }}
    >
      {children}
    </PlaybackContext.Provider>
  );
}

export function usePlayback() {
  return useContext(PlaybackContext);
}
