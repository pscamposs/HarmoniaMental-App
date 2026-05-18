import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { AppState } from "react-native";
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from "expo-av";
import { Song } from "../constants/data";
import {
  addMusicNotificationActionListener,
  consumePendingMusicNotificationActions,
  ensureMusicNotificationPermission,
  hideMusicNotification,
  showMusicNotification,
} from "../services/musicNotification";
import { isExpiringPreviewUrl, resolveItunesPreviewUrl } from "../services/previewResolver";

type PlaybackTrack = Song & {
  duration: number;
};

type PlaybackContextType = {
  currentTrack: PlaybackTrack | null;
  isPlaying: boolean;
  isLoading: boolean;
  progress: number;
  elapsedSeconds: number;
  isLoadingTrack: (song: Song) => boolean;
  playSong: (song: Song, queue?: Song[]) => Promise<void>;
  togglePlayPause: () => Promise<void>;
  playNext: () => Promise<void>;
  playPrevious: () => Promise<void>;
};

const PlaybackContext = createContext<PlaybackContextType>({
  currentTrack: null,
  isPlaying: false,
  isLoading: false,
  progress: 0,
  elapsedSeconds: 0,
  isLoadingTrack: () => false,
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
  const [loadingTrackKey, setLoadingTrackKey] = useState<string | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [progress, setProgress] = useState(0);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const appStateRef = React.useRef(AppState.currentState);
  const soundRef = React.useRef<Audio.Sound | null>(null);
  const currentTrackRef = React.useRef<PlaybackTrack | null>(null);
  const isPlayingRef = React.useRef(false);
  const elapsedSecondsRef = React.useRef(0);
  const previewUrlCacheRef = React.useRef(new Map<string, string>());
  const loadRequestIdRef = React.useRef(0);
  const lastNotificationSyncMsRef = React.useRef(0);
  const lastNotificationActionDrainMsRef = React.useRef(0);
  const handleNotificationActionRef = React.useRef<(action: "previous" | "playPause" | "next") => void>(
    () => {},
  );
  const syncMusicNotificationRef = React.useRef<() => Promise<void>>(async () => {});
  const togglePlayPauseRef = React.useRef<() => Promise<void>>(async () => {});
  const playNextRef = React.useRef<() => Promise<void>>(async () => {});
  const playPreviousRef = React.useRef<() => Promise<void>>(async () => {});

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
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  useEffect(() => {
    soundRef.current = sound;
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

  useEffect(() => {
    currentTrackRef.current = currentTrack;
    isPlayingRef.current = isPlaying;
    elapsedSecondsRef.current = elapsedSeconds;
  }, [currentTrack, isPlaying, elapsedSeconds]);

  const maybeSyncBackgroundNotification = React.useCallback(() => {
    if (appStateRef.current === "active") {
      return;
    }

    const now = Date.now();
    if (now - lastNotificationSyncMsRef.current < 1000) {
      return;
    }

    lastNotificationSyncMsRef.current = now;
    syncMusicNotificationRef.current();
  }, []);

  const maybeDrainBackgroundNotificationActions = React.useCallback(() => {
    const now = Date.now();
    if (now - lastNotificationActionDrainMsRef.current < 350) {
      return;
    }

    lastNotificationActionDrainMsRef.current = now;
    consumePendingMusicNotificationActions(handleNotificationActionRef.current).catch(() => {});
  }, []);

  const resolveFreshPreviewUrl = async (song: Song) => {
    const freshUrl = await resolveItunesPreviewUrl(song);
    if (freshUrl) {
      previewUrlCacheRef.current.set(songKey(song), freshUrl);
    }
    return freshUrl;
  };

  const resolveAudioUrls = async (song: Song) => {
    const urls: string[] = [];
    const key = songKey(song);
    const cachedUrl = previewUrlCacheRef.current.get(key);
    const originalUrl = song.audioUrl;
    const shouldResolveFresh = !originalUrl || isExpiringPreviewUrl(originalUrl);

    const addUrl = (url?: string | null) => {
      if (url && !urls.includes(url)) {
        urls.push(url);
      }
    };

    addUrl(cachedUrl);

    if (!shouldResolveFresh) {
      addUrl(originalUrl);
      return urls;
    }

    try {
      addUrl(await resolveFreshPreviewUrl(song));
    } catch (error) {
      console.warn("Failed to resolve fresh preview URL", {
        title: song.title,
        artist: song.artist,
        error,
      });
    }

    addUrl(originalUrl);
    return urls;
  };

  const loadSound = async (song: Song, playOnLoad: boolean = true) => {
    const requestId = loadRequestIdRef.current + 1;
    loadRequestIdRef.current = requestId;
    setLoadingTrackKey(songKey(song));

    const activeSound = soundRef.current;
    if (activeSound) {
      await activeSound.unloadAsync();
      soundRef.current = null;
      setSound(null);
    }
    
    const track = toTrack(song);
    currentTrackRef.current = track;
    setCurrentTrack(track);
    setElapsedSeconds(0);
    setProgress(0);
    isPlayingRef.current = false;
    setIsPlaying(false);

    const audioUrls = await resolveAudioUrls(song);

    if (audioUrls.length === 0) {
      console.warn("No audio URL (preview) for track:", track.title);
      if (requestId === loadRequestIdRef.current) {
        setLoadingTrackKey(null);
      }
      return;
    }

    let lastError: unknown;
    const triedUrls = new Set<string>();

    for (const audioUrl of audioUrls) {
      triedUrls.add(audioUrl);
      try {
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: audioUrl },
          { shouldPlay: playOnLoad },
          (status) => {
            if (status.isLoaded) {
              isPlayingRef.current = status.isPlaying;
              setIsPlaying(status.isPlaying);
              elapsedSecondsRef.current = status.positionMillis / 1000;
              setElapsedSeconds(elapsedSecondsRef.current);
              if (status.durationMillis) {
                setProgress(status.positionMillis / status.durationMillis);
              }
              maybeDrainBackgroundNotificationActions();
              maybeSyncBackgroundNotification();
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

        if (requestId !== loadRequestIdRef.current) {
          await newSound.unloadAsync();
          return;
        }

        const loadedTrack = { ...track, audioUrl };
        previewUrlCacheRef.current.set(songKey(song), audioUrl);
        currentTrackRef.current = loadedTrack;
        soundRef.current = newSound;
        setCurrentTrack(loadedTrack);
        setSound(newSound);
        if (playOnLoad) {
          isPlayingRef.current = true;
          setIsPlaying(true);
        }
        setLoadingTrackKey(null);
        syncMusicNotificationRef.current();
        return;
      } catch (err) {
        lastError = err;
        console.warn("Preview URL failed, trying fallback if available", {
          title: track.title,
          artist: track.artist,
          isExpiringUrl: isExpiringPreviewUrl(audioUrl),
          error: err,
        });
      }
    }

    try {
      const refreshedUrl = await resolveFreshPreviewUrl(song);
      if (refreshedUrl && !triedUrls.has(refreshedUrl)) {
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: refreshedUrl },
          { shouldPlay: playOnLoad },
          (status) => {
            if (status.isLoaded) {
              isPlayingRef.current = status.isPlaying;
              setIsPlaying(status.isPlaying);
              elapsedSecondsRef.current = status.positionMillis / 1000;
              setElapsedSeconds(elapsedSecondsRef.current);
              if (status.durationMillis) {
                setProgress(status.positionMillis / status.durationMillis);
              }
              maybeDrainBackgroundNotificationActions();
              maybeSyncBackgroundNotification();
              if (status.didJustFinish) {
                const nextIdx = currentIndexRef.current + 1;
                if (nextIdx < queueRef.current.length) {
                  setTimeout(() => {
                    setCurrentIndex(nextIdx);
                    loadSound(queueRef.current[nextIdx], true);
                  }, 0);
                }
              }
            }
          }
        );

        if (requestId !== loadRequestIdRef.current) {
          await newSound.unloadAsync();
          return;
        }

        const loadedTrack = { ...track, audioUrl: refreshedUrl };
        currentTrackRef.current = loadedTrack;
        soundRef.current = newSound;
        setCurrentTrack(loadedTrack);
        setSound(newSound);
        if (playOnLoad) {
          isPlayingRef.current = true;
          setIsPlaying(true);
        }
        setLoadingTrackKey(null);
        syncMusicNotificationRef.current();
        return;
      }
    } catch (err) {
      lastError = err;
    }

    console.error("Failed to load sound", lastError);
    if (requestId === loadRequestIdRef.current) {
      setLoadingTrackKey(null);
    }
  };

  const isLoadingTrack = React.useCallback(
    (song: Song) => loadingTrackKey === songKey(song),
    [loadingTrackKey],
  );

  const handleNext = async () => {
    const nextIndex = currentIndexRef.current + 1;
    if (
      currentIndexRef.current < 0 ||
      nextIndex >= queueRef.current.length
    ) {
      return;
    }
    setCurrentIndex(nextIndex);
    await loadSound(queueRef.current[nextIndex], true);
  };

  const handlePrevious = async () => {
    if (currentIndexRef.current <= 0 || queueRef.current.length === 0) return;
    const prevIndex = currentIndexRef.current - 1;
    setCurrentIndex(prevIndex);
    await loadSound(queueRef.current[prevIndex], true);
  };

  const playSong = async (song: Song, nextQueue?: Song[]) => {
    const targetQueue = nextQueue && nextQueue.length > 0 ? nextQueue : [song];
    const targetIndex = targetQueue.findIndex(
      (s) => songKey(s) === songKey(song),
    );

    setQueue(targetQueue);
    setCurrentIndex(targetIndex >= 0 ? targetIndex : 0);
    ensureMusicNotificationPermission().catch(() => {});
    await loadSound(song, true);
  };

  const togglePlayPause = async () => {
    const activeSound = soundRef.current;
    if (!activeSound) {
      return;
    }

    const nextIsPlaying = !isPlayingRef.current;
    isPlayingRef.current = nextIsPlaying;
    setIsPlaying(nextIsPlaying);

    try {
      if (nextIsPlaying) {
        await activeSound.playAsync();
      } else {
        await activeSound.pauseAsync();
      }
    } catch (error) {
      isPlayingRef.current = !nextIsPlaying;
      setIsPlaying(!nextIsPlaying);
      console.error("Failed to toggle playback", error);
    }

    await syncMusicNotificationRef.current();
  };

  const syncMusicNotification = React.useCallback(async () => {
    const track = currentTrackRef.current;
    if (appStateRef.current === "active" || !track) {
      hideMusicNotification();
      return;
    }

    await showMusicNotification({
      title: track.title,
      artist: track.artist,
      isPlaying: isPlayingRef.current,
      durationSeconds: track.duration,
      elapsedSeconds: elapsedSecondsRef.current,
      canPrevious: currentIndexRef.current > 0,
      canNext:
        currentIndexRef.current >= 0 &&
        currentIndexRef.current < queueRef.current.length - 1,
    });
  }, []);

  useEffect(() => {
    syncMusicNotificationRef.current = syncMusicNotification;
  }, [syncMusicNotification]);

  useEffect(() => {
    togglePlayPauseRef.current = togglePlayPause;
    playNextRef.current = handleNext;
    playPreviousRef.current = handlePrevious;
  });

  useEffect(() => {
    handleNotificationActionRef.current = (action) => {
      if (action === "playPause") {
        togglePlayPauseRef.current();
      } else if (action === "next") {
        playNextRef.current();
      } else if (action === "previous") {
        playPreviousRef.current();
      }
    };
  });

  useEffect(() => {
    const subscription = addMusicNotificationActionListener((action) => {
      handleNotificationActionRef.current(action);
    });

    return () => {
      subscription?.remove();
    };
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextState) => {
      appStateRef.current = nextState;
      syncMusicNotification();
    });

    return () => {
      subscription.remove();
      hideMusicNotification();
    };
  }, [syncMusicNotification]);

  useEffect(() => {
    syncMusicNotification();
  }, [currentTrack, currentIndex, isPlaying, queue.length, syncMusicNotification]);

  return (
    <PlaybackContext.Provider
      value={{
        currentTrack,
        isPlaying,
        isLoading: loadingTrackKey !== null,
        progress,
        elapsedSeconds,
        isLoadingTrack,
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
