import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../constants/colors";
import { minhaPlaylist } from "../constants/data";
import { SongItem } from "../components/SongItem";
import { HelpModal } from "../components/HelpModal";

export function MinhaPlaylistScreen() {
  const [activeId, setActiveId] = useState<string | null>("m3");
  const [helpVisible, setHelpVisible] = useState(false);

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={[Colors.gradientStart, "#0F0E2A", "#1A1008"]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <SafeAreaView style={styles.safe} edges={["top"]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.pageHeader}>
            <Text style={styles.pageTitle}>Sua Playlist Personalizada</Text>
            <Text style={styles.pageDesc}>
              Baseada no seu estado emocional para equilibrar a mente.
            </Text>
          </View>

          {/* Personalizada card */}
          <View style={styles.playlistCard}>
            <View style={styles.playlistCardHeader}>
              <View style={styles.playlistCardIconCircle}>
                <Ionicons
                  name={minhaPlaylist.iconName as any}
                  size={22}
                  color={Colors.gold}
                />
              </View>
              <View style={styles.playlistCardInfo}>
                <Text style={styles.playlistCardName}>
                  {minhaPlaylist.name}
                </Text>
                <Text style={styles.playlistCardDesc}>
                  {minhaPlaylist.description}
                </Text>
              </View>
            </View>

            <View style={styles.listCard}>
              {minhaPlaylist.songs.map((song, idx) => (
                <SongItem
                  key={song.id}
                  song={song}
                  index={idx + 1}
                  isPlaying={activeId === song.id}
                  onPress={() => setActiveId(song.id)}
                />
              ))}
            </View>
          </View>

          {/* Refresh / regenerate */}
          <TouchableOpacity style={styles.regenBtn} activeOpacity={0.85}>
            <Ionicons
              name="refresh"
              size={16}
              color={Colors.gold}
              style={{ marginRight: 6 }}
            />
            <Text style={styles.regenBtnText}>Gerar nova playlist</Text>
          </TouchableOpacity>

          {/* Support banner */}
          <TouchableOpacity
            style={styles.supportBanner}
            onPress={() => setHelpVisible(true)}
            activeOpacity={0.85}
          >
            <Ionicons
              name="information-circle-outline"
              size={26}
              color={Colors.gold}
            />
            <View style={styles.supportText}>
              <Text style={styles.supportTitle}>Precisa de apoio?</Text>
              <Text style={styles.supportBody}>
                Informações e contatos de emergência disponíveis.
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={22}
              color={Colors.textMuted}
            />
          </TouchableOpacity>

          <View style={{ height: 24 }} />
        </ScrollView>
      </SafeAreaView>

      <HelpModal visible={helpVisible} onClose={() => setHelpVisible(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  safe: { flex: 1 },
  pageHeader: {
    paddingTop: 28,
    paddingBottom: 20,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: Colors.textPrimary,
    textAlign: "center",
    marginBottom: 8,
  },
  pageDesc: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 19,
  },
  playlistCard: {
    marginHorizontal: 20,
    backgroundColor: Colors.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: "hidden",
    marginBottom: 16,
  },
  playlistCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: 12,
  },
  playlistCardIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.cardAlt,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  playlistCardInfo: { flex: 1 },
  playlistCardName: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.gold,
    marginBottom: 4,
  },
  playlistCardDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  listCard: { overflow: "hidden" },
  regenBtn: {
    marginHorizontal: 20,
    backgroundColor: "transparent",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: Colors.gold,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "center",
  },
  regenBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.gold,
  },
  supportBanner: {
    marginHorizontal: 20,
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 12,
  },
  supportText: { flex: 1 },
  supportTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  supportBody: { fontSize: 12, color: Colors.textSecondary },
});
