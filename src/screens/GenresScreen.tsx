import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Modal,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Colors } from "../constants/colors";
import { MUSIC_GENRES, MusicGenre } from "../constants/data";
import { SongItem } from "../components/SongItem";
import { usePlayback } from "../context/PlaybackContext";

const { width } = Dimensions.get("window");
type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

const CARD_W = (width - 56) / 2;

// ── Genre Detail Modal ────────────────────────────────────────────────────────

type GenreDetailProps = {
  genre: MusicGenre;
  visible: boolean;
  onClose: () => void;
};

function GenreDetail({ genre, visible, onClose }: GenreDetailProps) {
  const { currentTrack, isPlaying, playSong } = usePlayback();

  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={detailStyles.overlay}>
        <View style={detailStyles.sheet}>
          <LinearGradient
            colors={[Colors.surface, Colors.background]}
            style={StyleSheet.absoluteFill}
          />
          <View style={detailStyles.handle} />

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={detailStyles.header}>
              <View
                style={[
                  detailStyles.iconBg,
                  {
                    backgroundColor: genre.color + "22",
                    borderColor: genre.color,
                  },
                ]}
              >
                <Ionicons
                  name={genre.iconName as IoniconName}
                  size={26}
                  color={genre.color}
                />
              </View>
              <View style={detailStyles.headerText}>
                <Text style={[detailStyles.title, { color: genre.color }]}>
                  {genre.name}
                </Text>
                <Text style={detailStyles.subtitle}>{genre.description}</Text>
              </View>
              <TouchableOpacity onPress={onClose} style={detailStyles.closeBtn}>
                <Ionicons name="close" size={22} color={Colors.textMuted} />
              </TouchableOpacity>
            </View>

            <View style={detailStyles.metaRow}>
              <View
                style={[detailStyles.metaBadge, { borderColor: genre.color }]}
              >
                <Ionicons
                  name="musical-note-outline"
                  size={12}
                  color={genre.color}
                />
                <Text style={[detailStyles.metaText, { color: genre.color }]}>
                  {genre.songs.length} músicas
                </Text>
              </View>
              <View
                style={[detailStyles.metaBadge, { borderColor: Colors.border }]}
              >
                <Ionicons
                  name="cloud-outline"
                  size={12}
                  color={Colors.textMuted}
                />
                <Text
                  style={[detailStyles.metaText, { color: Colors.textMuted }]}
                >
                  Via Spotify
                </Text>
              </View>
            </View>

            <View style={detailStyles.songList}>
              {genre.songs.map((song, idx) => (
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
                  onPress={() => playSong(song, genre.songs)}
                />
              ))}
            </View>

            <TouchableOpacity
              style={[
                detailStyles.spotifyBtn,
                { backgroundColor: genre.color },
              ]}
              activeOpacity={0.85}
            >
              <Ionicons
                name="logo-google-playstore"
                size={18}
                color={Colors.white}
              />
              <Text style={detailStyles.spotifyBtnText}>Abrir no Spotify</Text>
            </TouchableOpacity>

            <View style={{ height: 32 }} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const detailStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  sheet: {
    height: "85%",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
    alignSelf: "center",
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 14,
    gap: 12,
  },
  iconBg: {
    width: 50,
    height: 50,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: { flex: 1 },
  title: { fontSize: 20, fontWeight: "800", marginBottom: 4 },
  subtitle: { fontSize: 13, color: Colors.textSecondary },
  closeBtn: { padding: 4 },
  metaRow: { flexDirection: "row", gap: 10, marginBottom: 18 },
  metaBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    backgroundColor: "rgba(255,255,255,0.03)",
  },
  metaText: { fontSize: 12, fontWeight: "600" },
  songList: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: "hidden",
    marginBottom: 20,
  },
  spotifyBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    borderRadius: 14,
    paddingVertical: 15,
    marginBottom: 8,
  },
  spotifyBtnText: { fontSize: 15, fontWeight: "700", color: Colors.white },
});

// ── Genres Screen ─────────────────────────────────────────────────────────────

export function GenresScreen() {
  const [selectedGenre, setSelectedGenre] = useState<MusicGenre | null>(null);

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={[Colors.gradientStart, "#0A0C1E", Colors.gradientEnd]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
      />

      <SafeAreaView style={styles.safe} edges={["top"]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
        >
          {/* Header */}
          <View style={styles.pageHeader}>
            <Text style={styles.pageTitle}>Gêneros Musicais</Text>
            <Text style={styles.pageSubtitle}>
              Entretenimento livre — escolha o estilo que mais combina com você.
            </Text>
          </View>

          {/* Swipe hint */}
          <View style={styles.swipeHint}>
            <Ionicons
              name="arrow-back-outline"
              size={14}
              color={Colors.textMuted}
            />
            <Text style={styles.swipeHintText}>
              Deslize para a esquerda para voltar à Musicoterapia
            </Text>
          </View>

          {/* Genre grid */}
          <View style={styles.grid}>
            {MUSIC_GENRES.map((genre) => (
              <TouchableOpacity
                key={genre.id}
                style={styles.genreCard}
                activeOpacity={0.82}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setSelectedGenre(genre);
                }}
              >
                {/* Color gradient top */}
                <LinearGradient
                  colors={[genre.color + "40", genre.color + "10"]}
                  style={StyleSheet.absoluteFill}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                />
                <View
                  style={[
                    styles.genreIconBg,
                    { backgroundColor: genre.color + "25" },
                  ]}
                >
                  <Ionicons
                    name={genre.iconName as IoniconName}
                    size={24}
                    color={genre.color}
                  />
                </View>
                <Text style={styles.genreName}>{genre.name}</Text>
                <Text style={styles.genreDesc} numberOfLines={2}>
                  {genre.description}
                </Text>
                <View style={styles.genreFooter}>
                  <Text style={[styles.genreCount, { color: genre.color }]}>
                    {genre.songs.length} músicas
                  </Text>
                  <Ionicons
                    name="chevron-forward"
                    size={14}
                    color={genre.color}
                  />
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <View style={{ height: 24 }} />
        </ScrollView>
      </SafeAreaView>

      {selectedGenre && (
        <GenreDetail
          genre={selectedGenre}
          visible={!!selectedGenre}
          onClose={() => setSelectedGenre(null)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  safe: { flex: 1 },
  scroll: { paddingHorizontal: 20 },

  pageHeader: { paddingTop: 20, paddingBottom: 8 },
  pageTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  pageSubtitle: { fontSize: 13, color: Colors.textSecondary, lineHeight: 19 },

  swipeHint: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 10,
    marginBottom: 8,
  },
  swipeHintText: { fontSize: 12, color: Colors.textMuted },

  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  genreCard: {
    width: CARD_W,
    backgroundColor: Colors.card,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: "hidden",
  },
  genreIconBg: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  genreName: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  genreDesc: {
    fontSize: 11,
    color: Colors.textSecondary,
    lineHeight: 16,
    marginBottom: 12,
  },
  genreFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  genreCount: { fontSize: 12, fontWeight: "600" },
});
