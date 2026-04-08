import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Colors } from "../constants/colors";
import { useUser } from "../context/UserContext";
import { BrandLogo } from "../components/BrandLogo";

export function SettingsScreen() {
  const { profile, logout } = useUser();
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  const confirmLogout = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    setLogoutModalVisible(false);
    await logout();
  };

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={[Colors.gradientStart, Colors.gradientMid, Colors.gradientEnd]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
      />

      <SafeAreaView style={styles.safe} edges={["top"]}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.logoWrap}>
            <BrandLogo width={94} height={94} />
            <Text style={styles.brandTitle}>HARMONIA MENTAL</Text>
          </View>

          <View style={styles.header}>
            <Text style={styles.title}>Configurações</Text>
            <Text style={styles.subtitle}>
              Conta e preferências do aplicativo.
            </Text>
          </View>

          <View style={styles.card}>
            <View style={styles.row}>
              <Ionicons
                name="person-circle-outline"
                size={20}
                color={Colors.gold}
              />
              <View style={styles.rowText}>
                <Text style={styles.rowLabel}>Conta ativa</Text>
                <Text style={styles.rowValue}>{profile.name || "Usuário"}</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={() => setLogoutModalVisible(true)}
            activeOpacity={0.85}
          >
            <Ionicons name="log-out-outline" size={18} color={Colors.white} />
            <Text style={styles.logoutText}>Sair da conta</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>

      <Modal
        transparent
        visible={logoutModalVisible}
        animationType="slide"
        statusBarTranslucent
        onRequestClose={() => setLogoutModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setLogoutModalVisible(false)}
        >
          <Pressable style={styles.modalSheet} onPress={() => {}}>
            <View style={styles.handle} />

            <View style={styles.modalHeader}>
              <View style={styles.modalIconWrap}>
                <Ionicons
                  name="log-out-outline"
                  size={18}
                  color={Colors.gold}
                />
              </View>
              <View style={styles.modalTitleWrap}>
                <Text style={styles.modalTitle}>Sair da conta</Text>
                <Text style={styles.modalSubtitle}>
                  Você precisará entrar novamente.
                </Text>
              </View>
            </View>

            <Text style={styles.modalText}>
              Tem certeza que deseja encerrar a sessão agora?
            </Text>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setLogoutModalVisible(false)}
                activeOpacity={0.85}
              >
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmBtn}
                onPress={confirmLogout}
                activeOpacity={0.85}
              >
                <Text style={styles.confirmText}>Sair</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  safe: { flex: 1 },
  scroll: { paddingHorizontal: 20, paddingBottom: 24 },

  logoWrap: {
    alignItems: "center",
    paddingTop: 16,
    paddingBottom: 8,
  },
  brandTitle: {
    marginTop: 8,
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 0.9,
    color: "#79D2D3",
  },

  header: { paddingTop: 10, paddingBottom: 14 },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  subtitle: { fontSize: 13, color: Colors.textSecondary, lineHeight: 20 },

  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
    marginBottom: 20,
  },
  row: { flexDirection: "row", alignItems: "center", gap: 10 },
  rowText: { flex: 1 },
  rowLabel: { fontSize: 12, color: Colors.textMuted, marginBottom: 2 },
  rowValue: { fontSize: 15, fontWeight: "700", color: Colors.textPrimary },

  logoutBtn: {
    backgroundColor: "#C0392B",
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
  },
  logoutText: { color: Colors.white, fontSize: 15, fontWeight: "700" },

  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: "flex-end",
    alignItems: "center",
    padding: 16,
  },
  modalSheet: {
    width: "100%",
    backgroundColor: Colors.card,
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 16,
    borderWidth: 1,
    borderColor: Colors.gold,
  },
  handle: {
    alignSelf: "center",
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
    marginBottom: 12,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  modalIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(240,165,0,0.14)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  modalTitleWrap: { flex: 1 },
  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.textPrimary,
  },
  modalSubtitle: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  modalText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: "row",
    gap: 10,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: 12,
    alignItems: "center",
  },
  cancelText: { color: Colors.textPrimary, fontSize: 14, fontWeight: "700" },
  confirmBtn: {
    flex: 1,
    backgroundColor: "#C0392B",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  confirmText: { color: Colors.white, fontSize: 14, fontWeight: "700" },
});
