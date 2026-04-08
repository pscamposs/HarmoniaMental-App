import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../constants/colors";
import { usePlayback } from "../context/PlaybackContext";

export function MusicPlayer() {
  const {
    currentTrack,
    isPlaying,
    progress,
    elapsedSeconds,
    togglePlayPause,
    playNext,
    playPrevious,
  } = usePlayback();

  if (!currentTrack || !isPlaying) {
    return null;
  }

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  };

  const totalSeconds = currentTrack.duration;
  const currentSeconds = elapsedSeconds;

  return (
    <View style={styles.container}>
      {/* Progress bar */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        <View
          style={[styles.progressThumb, { left: `${progress * 100}%` as any }]}
        />
      </View>

      <View style={styles.body}>
        {/* Album art */}
        <View style={styles.albumArt}>
          <Ionicons name="musical-note" size={20} color={Colors.gold} />
        </View>

        {/* Track info */}
        <View style={styles.trackInfo}>
          <Text style={styles.trackTitle} numberOfLines={1}>
            {currentTrack.title}
          </Text>
          <Text style={styles.trackArtist} numberOfLines={1}>
            {currentTrack.artist}
          </Text>
        </View>

        {/* Time */}
        <Text style={styles.timeLabel}>{formatTime(currentSeconds)}</Text>

        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity
            style={styles.controlBtn}
            activeOpacity={0.7}
            onPress={playPrevious}
          >
            <Ionicons
              name="play-skip-back"
              size={16}
              color={Colors.textSecondary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.playPauseBtn}
            onPress={togglePlayPause}
            activeOpacity={0.8}
          >
            <Ionicons
              name={isPlaying ? "pause" : "play"}
              size={16}
              color={Colors.background}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.controlBtn}
            activeOpacity={0.7}
            onPress={playNext}
          >
            <Ionicons
              name="play-skip-forward"
              size={16}
              color={Colors.textSecondary}
            />
          </TouchableOpacity>
        </View>

        {/* Total time */}
        <Text style={styles.timeLabel}>{formatTime(totalSeconds)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.playerBg,
    borderTopWidth: 1,
    borderTopColor: Colors.tabBarBorder,
    paddingBottom: 4,
  },
  progressTrack: {
    height: 3,
    backgroundColor: Colors.border,
    position: "relative",
  },
  progressFill: {
    height: "100%",
    backgroundColor: Colors.gold,
  },
  progressThumb: {
    position: "absolute",
    top: -4,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.gold,
    marginLeft: -5,
  },
  body: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  albumArt: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: Colors.card,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },

  trackInfo: {
    flex: 1,
  },
  trackTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  trackArtist: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  timeLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    minWidth: 32,
    textAlign: "center",
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  controlBtn: {
    padding: 6,
  },
  playPauseBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.gold,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 4,
  },
});
