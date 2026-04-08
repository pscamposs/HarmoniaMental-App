import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Colors } from "../constants/colors";
import { THERAPY_SECTIONS, TherapySection, Song } from "../constants/data";
import { SongItem } from "../components/SongItem";
import { HelpModal } from "../components/HelpModal";
import { useUser } from "../context/UserContext";
import { AvatarImage } from "../components/AvatarImage";
import { usePlayback } from "../context/PlaybackContext";

type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

const MOOD_OPTIONS: { label: string; icon: IoniconName; sectionId: string }[] =
  [
    { label: "Triste", icon: "rainy-outline", sectionId: "depressao" },
    { label: "Agitado", icon: "thunderstorm-outline", sectionId: "mania" },
    { label: "Ansioso", icon: "alert-circle-outline", sectionId: "ansiedade" },
    { label: "Estável", icon: "sunny-outline", sectionId: "equilibrio" },
  ];

type SectionDetailProps = {
  section: TherapySection;
  visible: boolean;
  onClose: () => void;
};

function SectionDetail({ section, visible, onClose }: SectionDetailProps) {
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
          {/* Handle */}
          <View style={detailStyles.handle} />

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={detailStyles.header}>
              <View
                style={[
                  detailStyles.iconBg,
                  { borderColor: section.accentColor },
                ]}
              >
                <Ionicons
                  name={section.iconName as IoniconName}
                  size={26}
                  color={section.accentColor}
                />
              </View>
              <View style={detailStyles.headerText}>
                <Text
                  style={[detailStyles.title, { color: section.accentColor }]}
                >
                  {section.title}
                </Text>
                <Text style={detailStyles.subtitle}>{section.subtitle}</Text>
              </View>
              <TouchableOpacity onPress={onClose} style={detailStyles.closeBtn}>
                <Ionicons name="close" size={22} color={Colors.textMuted} />
              </TouchableOpacity>
            </View>

            <Text style={detailStyles.description}>{section.description}</Text>

            {/* Pills */}
            <View style={detailStyles.pills}>
              <View
                style={[
                  detailStyles.pill,
                  { borderColor: section.accentColor },
                ]}
              >
                <Ionicons
                  name="pulse-outline"
                  size={12}
                  color={section.accentColor}
                />
                <Text
                  style={[
                    detailStyles.pillText,
                    { color: section.accentColor },
                  ]}
                >
                  {section.bpm}
                </Text>
              </View>
              <View
                style={[
                  detailStyles.pill,
                  { borderColor: section.accentColor },
                ]}
              >
                <Ionicons
                  name="musical-note-outline"
                  size={12}
                  color={section.accentColor}
                />
                <Text
                  style={[
                    detailStyles.pillText,
                    { color: section.accentColor },
                  ]}
                >
                  {section.therapyType}
                </Text>
              </View>
            </View>

            {/* Song list */}
            <View style={detailStyles.songList}>
              {section.songs.map((song, idx) => (
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
                  onPress={() => playSong(song, section.songs)}
                />
              ))}
            </View>

            <Text style={detailStyles.disclaimer}>
              ⚠ A musicoterapia é um complemento ao tratamento profissional, não
              um substituto.
            </Text>

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
    height: "88%",
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
    marginBottom: 16,
    gap: 12,
  },
  iconBg: {
    width: 50,
    height: 50,
    borderRadius: 14,
    borderWidth: 1.5,
    backgroundColor: "rgba(255,255,255,0.04)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: { flex: 1 },
  title: { fontSize: 17, fontWeight: "700", marginBottom: 4 },
  subtitle: { fontSize: 13, color: Colors.textSecondary },
  closeBtn: { padding: 4 },
  description: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: 16,
  },
  pills: { flexDirection: "row", gap: 10, marginBottom: 20 },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    backgroundColor: "rgba(255,255,255,0.03)",
  },
  pillText: { fontSize: 12, fontWeight: "600" },
  songList: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: "hidden",
    marginBottom: 20,
  },
  disclaimer: {
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: "center",
    lineHeight: 18,
    paddingHorizontal: 16,
  },
});

// ── Main Screen ───────────────────────────────────────────────────────────────

export function TherapyScreen() {
  const { profile } = useUser();
  const [helpVisible, setHelpVisible] = useState(false);
  const [selectedSection, setSelectedSection] = useState<TherapySection | null>(
    null,
  );
  const [activeMood, setActiveMood] = useState<string | null>(null);

  const visibleSections = activeMood
    ? THERAPY_SECTIONS.filter((s) => s.id === activeMood)
    : THERAPY_SECTIONS;

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Bom dia";
    if (h < 18) return "Boa tarde";
    return "Boa noite";
  };

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={[Colors.gradientStart, Colors.gradientMid, Colors.gradientEnd]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
      />

      <SafeAreaView style={styles.safe} edges={["top"]}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <AvatarImage avatarUrl={profile.avatar.url} size={40} />
            <View style={styles.greetWrap}>
              <Text style={styles.greetDay}>{greeting()},</Text>
              <Text style={styles.greetName} numberOfLines={1}>
                {profile.name}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.helpBtn}
            onPress={() => setHelpVisible(true)}
            activeOpacity={0.8}
          >
            <Ionicons
              name="information-circle-outline"
              size={22}
              color={Colors.gold}
            />
            <Text style={styles.helpBtnText}>Ajuda</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
        >
          {/* Hero */}
          <View style={styles.hero}>
            <View style={styles.heroTextWrap}>
              <Text style={styles.heroTitle}>Musicoterapia</Text>
              <Text style={styles.heroSubtitle}>
                Músicas selecionadas para apoiar seu bem-estar emocional —
                depressão, mania e ansiedade.
              </Text>
            </View>
            <View style={styles.heroIconWrap}>
              <Ionicons
                name="heart-circle"
                size={48}
                color={Colors.gold}
                style={{ opacity: 0.8 }}
              />
            </View>
          </View>

          {/* Mood filter */}
          <Text style={styles.sectionLabel}>Como você está hoje?</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.moodRow}
          >
            <TouchableOpacity
              style={[styles.moodChip, !activeMood && styles.moodChipActive]}
              onPress={() => setActiveMood(null)}
              activeOpacity={0.8}
            >
              <Ionicons
                name="apps-outline"
                size={16}
                color={!activeMood ? Colors.background : Colors.textSecondary}
              />
              <Text
                style={[
                  styles.moodChipText,
                  !activeMood && styles.moodChipActiveText,
                ]}
              >
                Todos
              </Text>
            </TouchableOpacity>

            {MOOD_OPTIONS.map((m) => (
              <TouchableOpacity
                key={m.sectionId}
                style={[
                  styles.moodChip,
                  activeMood === m.sectionId && styles.moodChipActive,
                ]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setActiveMood(
                    activeMood === m.sectionId ? null : m.sectionId,
                  );
                }}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={m.icon}
                  size={16}
                  color={
                    activeMood === m.sectionId
                      ? Colors.background
                      : Colors.textSecondary
                  }
                />
                <Text
                  style={[
                    styles.moodChipText,
                    activeMood === m.sectionId && styles.moodChipActiveText,
                  ]}
                >
                  {m.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Therapy sections */}
          <Text style={styles.sectionLabel}>Playlists Terapêuticas</Text>
          {visibleSections.map((section) => (
            <TouchableOpacity
              key={section.id}
              style={styles.sectionCard}
              activeOpacity={0.85}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setSelectedSection(section);
              }}
            >
              <LinearGradient
                colors={[Colors.card, Colors.surface]}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
              <View
                style={[
                  styles.cardAccentBar,
                  { backgroundColor: section.accentColor },
                ]}
              />

              <View style={styles.cardBody}>
                <View
                  style={[
                    styles.cardIconBg,
                    { borderColor: section.accentColor },
                  ]}
                >
                  <Ionicons
                    name={section.iconName as IoniconName}
                    size={22}
                    color={section.accentColor}
                  />
                </View>
                <View style={styles.cardTextWrap}>
                  <Text
                    style={[styles.cardTitle, { color: section.accentColor }]}
                  >
                    {section.title}
                  </Text>
                  <Text style={styles.cardSubtitle}>{section.subtitle}</Text>
                  <View style={styles.cardMeta}>
                    <Text style={styles.cardMetaText}>
                      {section.songs.length} músicas
                    </Text>
                    <View style={styles.metaDot} />
                    <Text style={styles.cardMetaText}>{section.bpm}</Text>
                    <View style={styles.metaDot} />
                    <Text style={styles.cardMetaText}>
                      {section.therapyType}
                    </Text>
                  </View>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={Colors.textMuted}
                />
              </View>

              {/* Preview songs */}
              <View style={styles.previewSongs}>
                {section.songs.slice(0, 2).map((s) => (
                  <Text key={s.id} style={styles.previewSong} numberOfLines={1}>
                    {s.artist} — {s.title}
                  </Text>
                ))}
              </View>
            </TouchableOpacity>
          ))}

          {/* Disclaimer */}
          <View style={styles.disclaimer}>
            <Ionicons
              name="shield-checkmark-outline"
              size={16}
              color={Colors.textMuted}
            />
            <Text style={styles.disclaimerText}>
              A musicoterapia complementa, mas não substitui, o acompanhamento
              médico e psicológico.
            </Text>
          </View>

          <View style={{ height: 20 }} />
        </ScrollView>
      </SafeAreaView>

      {selectedSection && (
        <SectionDetail
          section={selectedSection}
          visible={!!selectedSection}
          onClose={() => setSelectedSection(null)}
        />
      )}

      <HelpModal visible={helpVisible} onClose={() => setHelpVisible(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  safe: { flex: 1 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  greetWrap: {},
  greetDay: { fontSize: 11, color: Colors.textMuted },
  greetName: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.textPrimary,
    maxWidth: 160,
  },
  helpBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1.5,
    borderColor: Colors.gold,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  helpBtnText: { fontSize: 13, fontWeight: "600", color: Colors.gold },

  scroll: { paddingHorizontal: 20 },

  hero: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
    gap: 12,
  },
  heroTextWrap: { flex: 1 },
  heroTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  heroSubtitle: { fontSize: 13, color: Colors.textSecondary, lineHeight: 20 },
  heroIconWrap: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: Colors.card,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },

  sectionLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 12,
    marginTop: 8,
  },

  moodRow: { marginBottom: 20 },
  moodChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 24,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: 8,
  },
  moodChipActive: { backgroundColor: Colors.gold, borderColor: Colors.gold },
  moodChipText: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.textSecondary,
  },
  moodChipActiveText: { color: Colors.background },

  sectionCard: {
    borderRadius: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: "hidden",
  },
  cardAccentBar: { height: 3, width: "100%" },
  cardBody: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
  },
  cardIconBg: {
    width: 48,
    height: 48,
    borderRadius: 14,
    borderWidth: 1.5,
    backgroundColor: "rgba(255,255,255,0.04)",
    alignItems: "center",
    justifyContent: "center",
  },
  cardTextWrap: { flex: 1 },
  cardTitle: { fontSize: 15, fontWeight: "700", marginBottom: 3 },
  cardSubtitle: { fontSize: 12, color: Colors.textSecondary, marginBottom: 6 },
  cardMeta: { flexDirection: "row", alignItems: "center", gap: 6 },
  cardMetaText: { fontSize: 11, color: Colors.textMuted },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: Colors.textMuted,
  },

  previewSongs: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 6,
  },
  previewSong: { fontSize: 12, color: Colors.textPrimary },

  disclaimer: {
    flexDirection: "row",
    gap: 8,
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 14,
    marginTop: 4,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "flex-start",
  },
  disclaimerText: {
    flex: 1,
    fontSize: 12,
    color: Colors.textMuted,
    lineHeight: 18,
  },
});
