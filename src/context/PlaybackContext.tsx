import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from "expo-av";
import { Song } from "../constants/data";

type PlaybackTrack = Song & {
  duration: number;
};

type PlaybackContextType = {
  currentTrack: PlaybackTrack | null;
  isPlaying: boolean;
  progress: number;
  elapsedSeconds: number;
  playSong: (song: Song, queue?: Song[]) => Promise<void>;
  togglePlayPause: () => Promise<void>;
  playNext: () => Promise<void>;
  playPrevious: () => Promise<void>;
};

const PlaybackContext = createContext<PlaybackContextType>({
  currentTrack: null,
  isPlaying: false,
  progress: 0,
  elapsedSeconds: 0,
  playSong: async () => {},
  togglePlayPause: async () => {},
  playNext: async () => {},
  playPrevious: async () => {},
});

function toTrack(song: Song): PlaybackTrack {
  return { ...song, duration: song.durationSeconds ?? 30 };
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
  const [progress, setProgress] = useState(0);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  useEffect(() => {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: true,
      interruptionModeIOS: InterruptionModeIOS.DoNotMix,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: false,
      interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
      playThroughEarpieceAndroid: false
    });
  }, []);

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  // Using a stable ref for handleNext to avoid stale closures in the onPlaybackStatusUpdate callback,
  // or better, handle it carefully. Actually, since state is updated via callback, `queue` and `currentIndex`
  // might be stale. Let's use functional state updates or refs if we hit bugs, but for now we'll stick to a simple approach.
  // Actually, handleNext needs current queue and index. Since Audio callbacks have stale closures, 
  // it's safer to store queue and currentIndex in refs, or simply emit an event.
  // Let's use refs for queue and currentIndex to avoid stale closure in status update callback.
  const queueRef = React.useRef(queue);
  const currentIndexRef = React.useRef(currentIndex);

  useEffect(() => {
    queueRef.current = queue;
    currentIndexRef.current = currentIndex;
  }, [queue, currentIndex]);

  const loadSound = async (song: Song, playOnLoad: boolean = true) => {
    if (sound) {
      await sound.unloadAsync();
      setSound(null);
    }
    
    const track = toTrack(song);
    setCurrentTrack(track);
    setElapsedSeconds(0);
    setProgress(0);
    setIsPlaying(false);

    if (!track.audioUrl) {
      console.warn("No audio URL (preview) for track:", track.title);
      return;
    }

    try {
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: track.audioUrl },
        { shouldPlay: playOnLoad },
        (status) => {
          if (status.isLoaded) {
            setIsPlaying(status.isPlaying);
            setElapsedSeconds(status.positionMillis / 1000);
            if (status.durationMillis) {
              setProgress(status.positionMillis / status.durationMillis);
            }
            if (status.didJustFinish) {
              const nextIdx = currentIndexRef.current + 1;
              if (nextIdx < queueRef.current.length) {
                // To avoid calling setState/loading inside the status callback synchronously,
                // we defer it.
                setTimeout(() => {
                  setCurrentIndex(nextIdx);
                  loadSound(queueRef.current[nextIdx], true);
                }, 0);
              }
            }
          }
        }
      );
      setSound(newSound);
      if (playOnLoad) setIsPlaying(true);
    } catch (err) {
      console.error("Failed to load sound", err);
    }
  };

  const handleNext = async () => {
    if (currentIndex < 0 || currentIndex >= queue.length - 1) return;
    const nextIndex = currentIndex + 1;
    setCurrentIndex(nextIndex);
    await loadSound(queue[nextIndex], true);
  };

  const handlePrevious = async () => {
    if (currentIndex <= 0 || queue.length === 0) return;
    const prevIndex = currentIndex - 1;
    setCurrentIndex(prevIndex);
    await loadSound(queue[prevIndex], true);
  };

  const playSong = async (song: Song, nextQueue?: Song[]) => {
    const targetQueue = nextQueue && nextQueue.length > 0 ? nextQueue : [song];
    const targetIndex = targetQueue.findIndex(
      (s) => songKey(s) === songKey(song),
    );

    setQueue(targetQueue);
    setCurrentIndex(targetIndex >= 0 ? targetIndex : 0);
    await loadSound(song, true);
  };

  const togglePlayPause = async () => {
    if (!sound) {
      return;
    }
    if (isPlaying) {
      await sound.pauseAsync();
    } else {
      await sound.playAsync();
    }
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
        playNext: handleNext,
        playPrevious: handlePrevious,
      }}
    >
      {children}
    </PlaybackContext.Provider>
  );
}

export function usePlayback() {
  return useContext(PlaybackContext);
}
