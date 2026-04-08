import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../constants/colors";
import { animadasPlaylist, calmasPlaylist } from "../constants/data";

const { width } = Dimensions.get("window");

type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

const CATEGORIES = [
  {
    id: "animadas",
    route: "Animadas",
    title: animadasPlaylist.name,
    description: animadasPlaylist.description,
    count: animadasPlaylist.songs.length,
    icon: "flash" as IoniconName,
    accentColor: Colors.gold,
    gradientColors: ["#1E1A00", "#2A2200"] as [string, string],
    energy: "Alta",
    energyIcon: "trending-up" as IoniconName,
    preview: animadasPlaylist.songs.slice(0, 3),
  },
  {
    id: "calmas",
    route: "Calmas",
    title: calmasPlaylist.name,
    description: calmasPlaylist.description,
    count: calmasPlaylist.songs.length,
    icon: "moon" as IoniconName,
    accentColor: "#6C99FF",
    gradientColors: ["#0A0E2A", "#0E1230"] as [string, string],
    energy: "Baixa",
    energyIcon: "trending-down" as IoniconName,
    preview: calmasPlaylist.songs.slice(0, 3),
  },
];

const MOODS: { label: string; icon: IoniconName; route: string }[] = [
  { label: "Ansioso", icon: "alert-circle-outline", route: "Calmas" },
  { label: "Energético", icon: "flash-outline", route: "Animadas" },
  { label: "Triste", icon: "rainy-outline", route: "Calmas" },
  { label: "Feliz", icon: "sunny-outline", route: "Animadas" },
  { label: "Cansado", icon: "moon-outline", route: "Calmas" },
  { label: "Motivado", icon: "rocket-outline", route: "Animadas" },
];

type Props = { navigation: any };

export function ExplorarScreen({ navigation }: Props) {
  return (
    <View style={styles.root}>
      <LinearGradient
        colors={[Colors.gradientStart, Colors.gradientMid, Colors.gradientEnd]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
      />

      <SafeAreaView style={styles.safe} edges={["top"]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
        >
          {/* Header */}
          <View style={styles.pageHeader}>
            <Text style={styles.pageTitle}>Explorar</Text>
            <Text style={styles.pageSubtitle}>
              Escolha uma categoria ou selecione como você se sente.
            </Text>
          </View>

          {/* Category cards */}
          <Text style={styles.sectionLabel}>Categorias</Text>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={styles.categoryCard}
              activeOpacity={0.85}
              onPress={() => navigation.navigate(cat.route)}
            >
              <LinearGradient
                colors={cat.gradientColors}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />

              {/* Top row */}
              <View style={styles.catTop}>
                <View
                  style={[styles.catIconBg, { borderColor: cat.accentColor }]}
                >
                  <Ionicons name={cat.icon} size={22} color={cat.accentColor} />
                </View>
                <View style={styles.catMeta}>
                  <Text style={[styles.catTitle, { color: cat.accentColor }]}>
                    {cat.title}
                  </Text>
                  <Text style={styles.catDesc} numberOfLines={2}>
                    {cat.description}
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={Colors.textMuted}
                />
              </View>

              {/* Stats */}
              <View style={styles.catStats}>
                <View style={styles.catStatItem}>
                  <Ionicons
                    name="musical-note-outline"
                    size={13}
                    color={Colors.textMuted}
                  />
                  <Text style={styles.catStatText}>{cat.count} músicas</Text>
                </View>
                <View style={styles.catStatDot} />
                <View style={styles.catStatItem}>
                  <Ionicons
                    name={cat.energyIcon}
                    size={13}
                    color={Colors.textMuted}
                  />
                  <Text style={styles.catStatText}>Energia {cat.energy}</Text>
                </View>
              </View>

              {/* Preview songs */}
              <View style={styles.catPreview}>
                {cat.preview.map((s, i) => (
                  <View key={s.id} style={styles.previewRow}>
                    <Text style={styles.previewIndex}>
                      {String(i + 1).padStart(2, "0")}
                    </Text>
                    <Text style={styles.previewSong} numberOfLines={1}>
                      {s.artist} – {s.title}
                    </Text>
                  </View>
                ))}
                <Text style={[styles.previewMore, { color: cat.accentColor }]}>
                  + {cat.count - 3} mais...
                </Text>
              </View>
            </TouchableOpacity>
          ))}

          {/* Mood section */}
          <Text style={styles.sectionLabel}>Como você está se sentindo?</Text>
          <View style={styles.moodGrid}>
            {MOODS.map((m) => (
              <TouchableOpacity
                key={m.label}
                style={styles.moodCard}
                activeOpacity={0.75}
                onPress={() => navigation.navigate(m.route)}
              >
                <Ionicons
                  name={m.icon}
                  size={24}
                  color={Colors.textSecondary}
                  style={styles.moodIcon}
                />
                <Text style={styles.moodLabel}>{m.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={{ height: 24 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const MOOD_CARD_WIDTH = (width - 56) / 3;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  safe: { flex: 1 },
  scroll: { paddingHorizontal: 20 },

  pageHeader: { paddingTop: 20, paddingBottom: 20 },
  pageTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  pageSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 19,
  },

  sectionLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 12,
    marginTop: 4,
  },

  // Category card
  categoryCard: {
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: "hidden",
  },
  catTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 14,
    gap: 12,
  },
  catIconBg: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1.5,
    backgroundColor: "rgba(255,255,255,0.04)",
    alignItems: "center",
    justifyContent: "center",
  },
  catMeta: { flex: 1 },
  catTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  catDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 17,
  },

  catStats: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    gap: 8,
  },
  catStatItem: { flexDirection: "row", alignItems: "center", gap: 5 },
  catStatText: { fontSize: 12, color: Colors.textMuted },
  catStatDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: Colors.textMuted,
  },

  catPreview: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 12,
    gap: 8,
  },
  previewRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  previewIndex: { fontSize: 11, color: Colors.textMuted, width: 20 },
  previewSong: { flex: 1, fontSize: 13, color: Colors.textPrimary },
  previewMore: { fontSize: 12, fontWeight: "600", marginTop: 4 },

  // Mood grid
  moodGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 8,
  },
  moodCard: {
    width: MOOD_CARD_WIDTH,
    backgroundColor: Colors.card,
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 8,
  },
  moodIcon: {},
  moodLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.textSecondary,
  },
});
