import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { AppColors } from "../constants/colors";
import { SongItem } from "../components/SongItem";
import { usePlayback } from "../context/PlaybackContext";
import { usePlaylistCatalog } from "../context/PlaylistCatalogContext";
import { useThemeStyles } from "../context/ThemeContext";

function normalizeSearchTerm(value: string) {
  return value.trim().toLocaleLowerCase();
}

export function SearchScreen() {
  const { colors: Colors, styles } = useThemeStyles(createStyles);
  const [query, setQuery] = useState("");
  const { currentTrack, isPlaying, playSong } = usePlayback();
  const { songs, isLoading, error, refresh } = usePlaylistCatalog();

  const filteredSongs = useMemo(() => {
    const term = normalizeSearchTerm(query);
    if (!term) return songs;

    return songs.filter((song) =>
      `${song.title} ${song.artist}`.toLocaleLowerCase().includes(term),
    );
  }, [query, songs]);

  const hasSongs = songs.length > 0;
  const hasResults = filteredSongs.length > 0;

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={[Colors.gradientStart, Colors.surface, Colors.gradientEnd]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
      />

      <SafeAreaView style={styles.safe} edges={["top"]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scroll}
        >
          <View style={styles.pageHeader}>
            <Text style={styles.pageTitle}>Pesquisa</Text>
            <Text style={styles.pageSubtitle}>
              Encontre músicas carregadas do catálogo do app.
            </Text>
          </View>

          <View style={styles.searchBox}>
            <Ionicons name="search-outline" size={20} color={Colors.gold} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Buscar por música ou artista"
              placeholderTextColor={Colors.textMuted}
              style={styles.searchInput}
              autoCorrect={false}
              returnKeyType="search"
            />
            {query.length > 0 && (
              <TouchableOpacity
                onPress={() => setQuery("")}
                style={styles.clearButton}
                activeOpacity={0.8}
              >
                <Ionicons
                  name="close-circle"
                  size={18}
                  color={Colors.textMuted}
                />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.sectionLabel}>
              Catálogo local
            </Text>
            <Text style={styles.songCount}>
              {filteredSongs.length} de {songs.length}
            </Text>
          </View>

          {hasResults ? (
            <View style={styles.songList}>
              {filteredSongs.map((song, idx) => (
                <SongItem
                  key={song.id}
                  song={song}
                  index={idx + 1}
                  isPlaying={
                    isPlaying &&
                    currentTrack?.id === song.id &&
                    currentTrack?.artist === song.artist &&
                    currentTrack?.title === song.title
                  }
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    playSong(song, filteredSongs);
                  }}
                />
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconWrap}>
                <Ionicons
                  name={hasSongs ? "search-outline" : "musical-notes-outline"}
                  size={34}
                  color={Colors.gold}
                />
              </View>
              <Text style={styles.emptyTitle}>
                {hasSongs
                  ? "Nenhum resultado encontrado"
                  : isLoading
                    ? "Carregando catálogo"
                    : "Nenhuma música cadastrada"}
              </Text>
              <Text style={styles.emptyText}>
                {hasSongs
                  ? "Tente buscar por outro nome de música ou artista."
                  : error ||
                    "Quando o manifesto do R2 estiver configurado, as músicas aparecerão aqui."}
              </Text>
              {error ? (
                <TouchableOpacity
                  style={styles.retryButton}
                  onPress={refresh}
                  activeOpacity={0.85}
                >
                  <Text style={styles.retryText}>Tentar novamente</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          )}

          <View style={{ height: 24 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const createStyles = (Colors: AppColors) =>
  StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  safe: { flex: 1 },
  scroll: { paddingHorizontal: 20 },

  pageHeader: { paddingTop: 20, paddingBottom: 16 },
  pageTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  pageSubtitle: { fontSize: 13, color: Colors.textSecondary, lineHeight: 19 },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    minHeight: 52,
    backgroundColor: Colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 14,
    marginBottom: 18,
  },
  searchInput: {
    flex: 1,
    minHeight: 50,
    fontSize: 15,
    color: Colors.textPrimary,
    paddingVertical: 0,
  },
  clearButton: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },

  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    gap: 12,
  },
  sectionLabel: {
    flex: 1,
    fontSize: 13,
    fontWeight: "700",
    color: Colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  songCount: { fontSize: 12, fontWeight: "600", color: Colors.textMuted },

  songList: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: "hidden",
  },

  emptyState: {
    alignItems: "center",
    backgroundColor: Colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 22,
    paddingVertical: 34,
  },
  emptyIconWrap: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: "rgba(2,195,202,0.1)",
    borderWidth: 1,
    borderColor: "rgba(2,195,202,0.28)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: Colors.textPrimary,
    textAlign: "center",
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 20,
    textAlign: "center",
  },
  retryButton: {
    marginTop: 16,
    borderRadius: 12,
    backgroundColor: Colors.gold,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  retryText: {
    color: Colors.background,
    fontSize: 13,
    fontWeight: "700",
  },
});
