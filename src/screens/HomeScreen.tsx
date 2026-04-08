import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../constants/colors";
import { animadasPlaylist, calmasPlaylist } from "../constants/data";
import { HelpModal } from "../components/HelpModal";

const { width } = Dimensions.get("window");

type Props = {
  navigation: any;
};

export function HomeScreen({ navigation }: Props) {
  const [helpVisible, setHelpVisible] = useState(false);

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
          <View style={styles.logoWrap}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoText}>HM</Text>
            </View>
            <Text style={styles.appName}>Harmonia Mental</Text>
          </View>
          <TouchableOpacity
            style={styles.helpBtn}
            onPress={() => setHelpVisible(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.helpBtnText}>Ajuda</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
        >
          {/* Hero */}
          <View style={styles.hero}>
            <View style={styles.heroContent}>
              <Text style={styles.heroTitle}>
                Sua música,{"\n"}seu equilíbrio.
              </Text>
              <Text style={styles.heroSubtitle}>
                A música é uma ferramenta poderosa para regular seu humor.
                Diga-nos como você se sente e criaremos uma playlist para ajudar
                a equilibrar sua mente.
              </Text>
              <TouchableOpacity style={styles.ctaBtn} activeOpacity={0.85}>
                <Text style={styles.ctaBtnText}>
                  Me diga como você se sente
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.heroIconWrap}>
              <Ionicons name="headset" size={44} color={Colors.textMuted} />
            </View>
          </View>

          {/* Featured */}
          <Text style={styles.sectionTitle}>Músicas em Destaque</Text>

          <View style={styles.cards}>
            {/* Animadas card */}
            <TouchableOpacity
              style={[styles.card, styles.cardLeft]}
              activeOpacity={0.8}
              onPress={() => navigation.navigate("Explorar")}
            >
              <View style={styles.cardIconRow}>
                <Ionicons name="flash" size={20} color={Colors.gold} />
                <Ionicons
                  name="musical-notes"
                  size={20}
                  color={Colors.gold}
                  style={{ marginLeft: 6 }}
                />
              </View>
              <Text style={styles.cardName}>Músicas para Animar</Text>
              <Text style={styles.cardDesc}>
                Para aqueles dias em que você precisa de energia.
              </Text>
              <View style={styles.cardDivider} />
              {animadasPlaylist.songs.slice(0, 2).map((s) => (
                <Text key={s.id} style={styles.cardSong}>
                  {s.artist} – {s.title}
                </Text>
              ))}
            </TouchableOpacity>

            {/* Calmas card */}
            <TouchableOpacity
              style={[styles.card, styles.cardRight]}
              activeOpacity={0.8}
              onPress={() => navigation.navigate("Explorar")}
            >
              <View style={styles.cardIconRow}>
                <Ionicons name="moon" size={20} color="#6C99FF" />
                <Ionicons
                  name="leaf"
                  size={20}
                  color="#6C99FF"
                  style={{ marginLeft: 6 }}
                />
              </View>
              <Text style={styles.cardName}>Playlist para Relaxar</Text>
              <Text style={styles.cardDesc}>
                Encontre a paz nos dias mais agitados.
              </Text>
              <View style={styles.cardDivider} />
              {calmasPlaylist.songs.slice(0, 2).map((s) => (
                <Text key={s.id} style={styles.cardSong}>
                  {s.artist} – {s.title}
                </Text>
              ))}
            </TouchableOpacity>
          </View>

          {/* Quick actions */}
          <Text style={styles.sectionTitle}>Como você está se sentindo?</Text>
          <View style={styles.moods}>
            {(
              [
                { label: "Calmo", icon: "leaf-outline" as const },
                { label: "Ansioso", icon: "alert-circle-outline" as const },
                { label: "Triste", icon: "rainy-outline" as const },
                { label: "Energético", icon: "flash-outline" as const },
                { label: "Cansado", icon: "moon-outline" as const },
                { label: "Feliz", icon: "sunny-outline" as const },
              ] as {
                label: string;
                icon: React.ComponentProps<typeof Ionicons>["name"];
              }[]
            ).map((m) => (
              <TouchableOpacity
                key={m.label}
                style={styles.moodChip}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={m.icon}
                  size={16}
                  color={Colors.textSecondary}
                />
                <Text style={styles.moodText}>{m.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.bottomSpacer} />
        </ScrollView>
      </SafeAreaView>

      <HelpModal visible={helpVisible} onClose={() => setHelpVisible(false)} />
    </View>
  );
}

const CARD_WIDTH = (width - 48) / 2;

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
  logoWrap: { flexDirection: "row", alignItems: "center", gap: 10 },
  logoCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 2,
    borderColor: Colors.gold,
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: { fontSize: 12, fontWeight: "800", color: Colors.gold },
  appName: { fontSize: 16, fontWeight: "700", color: Colors.textPrimary },
  helpBtn: {
    borderWidth: 1.5,
    borderColor: Colors.gold,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  helpBtnText: { fontSize: 13, fontWeight: "600", color: Colors.gold },
  scroll: { paddingHorizontal: 20 },
  hero: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 24,
    gap: 12,
  },
  heroContent: { flex: 1 },
  heroTitle: {
    fontSize: 30,
    fontWeight: "800",
    color: Colors.textPrimary,
    lineHeight: 36,
    marginBottom: 12,
  },
  heroSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 20,
  },
  ctaBtn: {
    backgroundColor: Colors.gold,
    borderRadius: 12,
    paddingVertical: 13,
    paddingHorizontal: 20,
    alignSelf: "flex-start",
  },
  ctaBtnText: { fontSize: 13, fontWeight: "700", color: Colors.background },
  heroIconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.card,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 16,
    marginTop: 8,
  },
  cards: { flexDirection: "row", gap: 12, marginBottom: 28 },
  card: {
    width: CARD_WIDTH,
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardLeft: { borderTopColor: Colors.gold, borderTopWidth: 2 },
  cardRight: { borderTopColor: "#6C63FF", borderTopWidth: 2 },
  cardIconRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  cardName: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.gold,
    marginBottom: 6,
  },
  cardDesc: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginBottom: 12,
    lineHeight: 16,
  },
  cardDivider: { height: 1, backgroundColor: Colors.border, marginBottom: 10 },
  cardSong: { fontSize: 11, color: Colors.textPrimary, marginBottom: 5 },
  moods: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 20 },
  moodChip: {
    backgroundColor: Colors.card,
    borderRadius: 24,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  moodText: { fontSize: 13, color: Colors.textPrimary },
  bottomSpacer: { height: 20 },
});
