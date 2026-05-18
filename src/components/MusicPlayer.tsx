import React from "react";
import { ActivityIndicator, View, Text, TouchableOpacity, StyleSheet, Linking, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppColors } from "../constants/colors";
import { usePlayback } from "../context/PlaybackContext";
import { useThemeStyles } from "../context/ThemeContext";

export function MusicPlayer() {
  const { colors: Colors, styles } = useThemeStyles(createStyles);
  const {
    currentTrack,
    isPlaying,
    isLoading,
    progress,
    elapsedSeconds,
    togglePlayPause,
    playNext,
    playPrevious,
  } = usePlayback();

  if (!currentTrack) {
    return null;
  }

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${String(s).padStart(2, "0")}`;
  };

  const totalSeconds = currentTrack.duration;
  const currentSeconds = elapsedSeconds;

  const openSpotify = () => {
    if (currentTrack.spotifyUri) {
      Linking.openURL(currentTrack.spotifyUri).catch(() => {
        Linking.openURL(`https://open.spotify.com/track/${currentTrack.id}`);
      });
    }
  };

  const openYouTubeMusic = () => {
    const query = encodeURIComponent(`${currentTrack.title} ${currentTrack.artist}`);
    Linking.openURL(`https://music.youtube.com/search?q=${query}`);
  };

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
          {currentTrack.artworkUrl ? (
            <Image
              source={{ uri: currentTrack.artworkUrl }}
              style={styles.albumArtImage}
              resizeMode="cover"
            />
          ) : (
            <Ionicons name="musical-note" size={20} color={Colors.gold} />
          )}
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
            disabled={isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={Colors.background} />
            ) : (
              <Ionicons
                name={isPlaying ? "pause" : "play"}
                size={16}
                color={Colors.background}
              />
            )}
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

      <View style={styles.externalLinks}>
        <TouchableOpacity style={styles.linkBtn} onPress={openSpotify} activeOpacity={0.7}>
          <Ionicons name="musical-notes" size={12} color={Colors.textSecondary} />
          <Text style={styles.linkText}>Ouvir inteira no Spotify</Text>
        </TouchableOpacity>

        <View style={styles.linkDivider} />

        <TouchableOpacity style={styles.linkBtn} onPress={openYouTubeMusic} activeOpacity={0.7}>
          <Ionicons name="logo-youtube" size={12} color={Colors.textSecondary} />
          <Text style={styles.linkText}>YouTube Music</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const createStyles = (Colors: AppColors) =>
  StyleSheet.create({
  container: {
    backgroundColor: Colors.playerBg,
    borderTopWidth: 1,
    borderTopColor: Colors.tabBarBorder,
    paddingBottom: 8,
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
    overflow: 'hidden'
  },
  albumArtImage: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.surface
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
  externalLinks: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    marginTop: -2,
    gap: 12
  },
  linkBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 4
  },
  linkText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: "600"
  },
  linkDivider: {
    width: 1,
    height: 10,
    backgroundColor: Colors.border
  }
});
