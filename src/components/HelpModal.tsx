import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  ScrollView,
  Linking,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppColors } from "../constants/colors";
import { useThemeStyles } from "../context/ThemeContext";

type HelpModalProps = {
  visible: boolean;
  onClose: () => void;
};

export function HelpModal({ visible, onClose }: HelpModalProps) {
  const { colors: Colors, styles } = useThemeStyles(createStyles);

  const callNumber = async (phone: string) => {
    const url = `tel:${phone}`;
    const canOpen = await Linking.canOpenURL(url);
    if (!canOpen) {
      Alert.alert("Nao foi possivel abrir o telefone", `Numero: ${phone}`);
      return;
    }
    await Linking.openURL(url);
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={() => {}}>
          <View style={styles.handle} />

          <View style={styles.header}>
            <View style={styles.headerIconWrap}>
              <Ionicons name="shield-checkmark" size={18} color={Colors.gold} />
            </View>
            <View style={styles.headerTextWrap}>
              <Text style={styles.headerTitle}>Ajuda e Apoio</Text>
              <Text style={styles.headerSubtitle}>
                Orientacao rapida em momentos de crise
              </Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeBtn}
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.content}
          >
            <Text style={styles.body}>
              Se houver risco de autoagressao, confusao intensa, agitacao
              extrema ou perda de contato com a realidade, procure ajuda
              imediatamente.
            </Text>

            <View style={styles.quickActions}>
              <TouchableOpacity
                style={[styles.callCard, styles.callCardDanger]}
                onPress={() => callNumber("192")}
                activeOpacity={0.85}
              >
                <Ionicons name="medical" size={18} color={Colors.white} />
                <View style={styles.callTextWrap}>
                  <Text style={styles.callTitle}>SAMU</Text>
                  <Text style={styles.callSubtitle}>
                    Emergencia medica imediata
                  </Text>
                </View>
                <Text style={styles.callNumber}>192</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.callCard}
                onPress={() => callNumber("188")}
                activeOpacity={0.85}
              >
                <Ionicons
                  name="chatbubble-ellipses"
                  size={18}
                  color={Colors.gold}
                />
                <View style={styles.callTextWrap}>
                  <Text style={styles.callTitle}>CVV</Text>
                  <Text style={styles.callSubtitle}>
                    Apoio emocional 24h, gratuito e sigiloso
                  </Text>
                </View>
                <Text style={styles.callNumberMuted}>188</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Sinais de alerta</Text>
              <Text style={styles.item}>
                - Fala acelerada e comportamento impulsivo fora do padrao.
              </Text>
              <Text style={styles.item}>
                - Tristeza intensa com isolamento por varios dias.
              </Text>
              <Text style={styles.item}>
                - Ideias de autoagressao ou desesperanca extrema.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>O que fazer agora</Text>
              <Text style={styles.item}>
                - Nao deixe a pessoa sozinha durante a crise.
              </Text>
              <Text style={styles.item}>
                - Afaste objetos perigosos do ambiente.
              </Text>
              <Text style={styles.item}>
                - Fale com calma e busque atendimento profissional.
              </Text>
            </View>
          </ScrollView>

          <TouchableOpacity
            style={styles.confirmBtn}
            onPress={onClose}
            activeOpacity={0.85}
          >
            <Text style={styles.confirmText}>Fechar</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const createStyles = (Colors: AppColors) =>
  StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: "flex-end",
    alignItems: "center",
    padding: 16,
  },
  sheet: {
    backgroundColor: Colors.card,
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 14,
    width: "100%",
    borderWidth: 1,
    borderColor: Colors.gold,
    shadowColor: Colors.gold,
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 6,
    maxHeight: "88%",
  },
  handle: {
    alignSelf: "center",
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
    marginBottom: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  headerIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(2,195,202,0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  headerTextWrap: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  closeBtn: {
    padding: 4,
  },
  content: {
    paddingBottom: 14,
  },
  body: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 21,
    marginBottom: 14,
  },
  quickActions: {
    gap: 10,
    marginBottom: 14,
  },
  callCard: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: Colors.surface,
  },
  callCardDanger: {
    backgroundColor: Colors.dangerBg,
    borderColor: Colors.danger,
  },
  callTextWrap: {
    flex: 1,
    marginLeft: 10,
  },
  callTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  callSubtitle: {
    marginTop: 2,
    fontSize: 12,
    color: Colors.textSecondary,
  },
  callNumber: {
    backgroundColor: Colors.danger,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    color: Colors.white,
    fontSize: 13,
    minWidth: 40,
    textAlign: "center",
    fontWeight: "700",
  },
  callNumberMuted: {
    backgroundColor: Colors.accentSoft,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    color: Colors.accent,
    fontSize: 13,
    minWidth: 40,
    textAlign: "center",
    fontWeight: "700",
  },
  section: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 12,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.gold,
    marginBottom: 8,
  },
  item: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 4,
  },
  confirmBtn: {
    backgroundColor: Colors.gold,
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: "center",
    marginTop: 6,
  },
  confirmText: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.background,
  },
  criticalHint: {
    fontSize: 12,
    textAlign: "center",
    color: Colors.textMuted,
    marginTop: 8,
  },
  emergencyBold: {
    fontWeight: "700",
    color: Colors.textPrimary,
  },
});
