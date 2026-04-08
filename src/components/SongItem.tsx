import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../constants/colors";
import { Song } from "../constants/data";

type SongItemProps = {
  song: Song;
  index: number;
  isPlaying?: boolean;
  onPress?: () => void;
};

export function SongItem({ song, index, isPlaying, onPress }: SongItemProps) {
  return (
    <TouchableOpacity
      style={[styles.container, isPlaying && styles.containerActive]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.indexBox, isPlaying && styles.indexBoxActive]}>
        {isPlaying ? (
          <View style={styles.playingDots}>
            <View style={[styles.dot, styles.dot1]} />
            <View style={[styles.dot, styles.dot2]} />
            <View style={[styles.dot, styles.dot3]} />
          </View>
        ) : (
          <Text style={styles.index}>{String(index).padStart(2, "0")}</Text>
        )}
      </View>

      <View style={styles.info}>
        <Text
          style={[styles.title, isPlaying && styles.titleActive]}
          numberOfLines={1}
        >
          {song.title}
        </Text>
        <Text style={styles.artist} numberOfLines={1}>
          {song.artist}
        </Text>
      </View>

      <View style={styles.playBtn}>
        <Ionicons
          name={isPlaying ? "pause" : "play"}
          size={16}
          color={isPlaying ? Colors.gold : Colors.textMuted}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  containerActive: {
    backgroundColor: "rgba(240,165,0,0.06)",
  },
  indexBox: {
    width: 36,
    alignItems: "center",
  },
  indexBoxActive: {},
  index: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: "600",
  },
  playingDots: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 3,
    height: 16,
  },
  dot: {
    width: 3,
    backgroundColor: Colors.gold,
    borderRadius: 2,
  },
  dot1: { height: 8 },
  dot2: { height: 14 },
  dot3: { height: 10 },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: 3,
  },
  titleActive: {
    color: Colors.gold,
  },
  artist: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  playBtn: {
    paddingLeft: 12,
  },
});
