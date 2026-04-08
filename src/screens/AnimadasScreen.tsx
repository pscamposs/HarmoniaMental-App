import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../constants/colors";
import { animadasPlaylist } from "../constants/data";
import { SongItem } from "../components/SongItem";

type Props = { navigation: any };

export function AnimadasScreen({ navigation }: Props) {
  const [activeId, setActiveId] = useState<string | null>("a1");

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={[Colors.gradientStart, Colors.gradientMid, Colors.gradientEnd]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <SafeAreaView style={styles.safe} edges={["top"]}>
        {/* Nav back */}
        <View style={styles.navBar}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
            activeOpacity={0.7}
          >
            <Ionicons
              name="chevron-back"
              size={22}
              color={Colors.textPrimary}
            />
            <Text style={styles.backLabel}>Explorar</Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Page header */}
          <View style={styles.pageHeader}>
            <View style={styles.iconCircle}>
              <Ionicons name="flash" size={36} color={Colors.gold} />
            </View>
            <Text style={styles.pageTitle}>{animadasPlaylist.name}</Text>
            <Text style={styles.pageDesc}>{animadasPlaylist.description}</Text>
          </View>

          {/* Stats row */}
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>
                {animadasPlaylist.songs.length}
              </Text>
              <Text style={styles.statLabel}>músicas</Text>
            </View>
            <View style={styles.statSep} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>~28 min</Text>
              <Text style={styles.statLabel}>duração</Text>
            </View>
            <View style={styles.statSep} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>Alta</Text>
              <Text style={styles.statLabel}>energia</Text>
            </View>
          </View>

          {/* Song list */}
          <View style={styles.listCard}>
            {animadasPlaylist.songs.map((song, idx) => (
              <SongItem
                key={song.id}
                song={song}
                index={idx + 1}
                isPlaying={activeId === song.id}
                onPress={() => setActiveId(song.id)}
              />
            ))}
          </View>

          <View style={{ height: 24 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  safe: { flex: 1 },
  navBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    padding: 4,
  },
  backLabel: {
    fontSize: 15,
    color: Colors.textPrimary,
    fontWeight: "500",
  },
  pageHeader: {
    alignItems: "center",
    paddingTop: 32,
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.card,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: Colors.textPrimary,
    textAlign: "center",
    marginBottom: 8,
  },
  pageDesc: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: Colors.card,
    borderRadius: 14,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  stat: { flex: 1, alignItems: "center" },
  statValue: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.gold,
    marginBottom: 2,
  },
  statLabel: { fontSize: 11, color: Colors.textMuted },
  statSep: { width: 1, height: 32, backgroundColor: Colors.border },
  listCard: {
    marginHorizontal: 20,
    backgroundColor: Colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: "hidden",
  },
});
