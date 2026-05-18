import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { AppColors } from "../constants/colors";
import { useUser } from "../context/UserContext";
import { AvatarImage } from "../components/AvatarImage";
import { BrandLogo } from "../components/BrandLogo";
import { AvatarConfig, createAvatarOptions } from "../services/avatarApi";
import { useThemeStyles } from "../context/ThemeContext";

type Step = "welcome" | "name" | "avatar";

export function OnboardingScreen() {
  const { colors: Colors, styles } = useThemeStyles(createStyles);
  const { saveProfile } = useUser();
  const [step, setStep] = useState<Step>("welcome");
  const [name, setName] = useState("");
  const [nonce, setNonce] = useState(0);

  const avatarOptions = useMemo(
    () => createAvatarOptions(`${name || "harmonia"}-${nonce}`, 8),
    [name, nonce],
  );

  const [selectedAvatarId, setSelectedAvatarId] = useState<string>("");

  const selectedAvatar = useMemo<AvatarConfig | undefined>(
    () => avatarOptions.find((a) => a.id === selectedAvatarId),
    [avatarOptions, selectedAvatarId],
  );

  const nextToAvatar = () => {
    if (!name.trim()) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setStep("avatar");
    if (!selectedAvatarId && avatarOptions[0]) {
      setSelectedAvatarId(avatarOptions[0].id);
    }
  };

  const regenerateOptions = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const nextNonce = nonce + 1;
    setNonce(nextNonce);
    const nextFirst = createAvatarOptions(
      `${name || "harmonia"}-${nextNonce}`,
      8,
    )[0];
    setSelectedAvatarId(nextFirst?.id || "");
  };

  const handleFinish = async () => {
    if (!selectedAvatar) return;
    await saveProfile({
      name: name.trim() || "Usuário",
      avatar: selectedAvatar,
      onboardingDone: true,
    });
  };

  if (step === "welcome") {
    return (
      <View style={styles.root}>
        <LinearGradient
          colors={[
            Colors.gradientStart,
            Colors.gradientMid,
            Colors.gradientEnd,
          ]}
          style={StyleSheet.absoluteFill}
          start={{ x: 0.1, y: 0 }}
          end={{ x: 0.9, y: 1 }}
        />
        <SafeAreaView style={styles.centerSafe}>
          <View style={styles.welcomeWrap}>
            <BrandLogo width={176} height={136} />
            <Text style={styles.brandTitle}>PSYMPHONY</Text>
            <Text style={styles.brandTagline}>Quando a música encontra o cuidado</Text>
            <Text style={styles.welcomeTitle}>Seja bem-vindo(a)</Text>
            <Text style={styles.welcomeSubtitle}>
              Psymphony é o seu espaço para usar a música como ferramenta
              de equilíbrio emocional. Vamos criar seu perfil?
            </Text>
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                setStep("name");
              }}
              activeOpacity={0.85}
            >
              <Text style={styles.primaryBtnText}>Vamos começar</Text>
              <Ionicons
                name="arrow-forward"
                size={18}
                color={Colors.background}
                style={{ marginLeft: 8 }}
              />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  if (step === "name") {
    return (
      <View style={styles.root}>
        <LinearGradient
          colors={[
            Colors.gradientStart,
            Colors.gradientMid,
            Colors.gradientEnd,
          ]}
          style={StyleSheet.absoluteFill}
          start={{ x: 0.1, y: 0 }}
          end={{ x: 0.9, y: 1 }}
        />
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <SafeAreaView style={styles.centerSafe}>
            <View style={styles.stepWrap}>
              <Text style={styles.stepIndicator}>1 de 2</Text>
              <Text style={styles.stepTitle}>Como podemos{"\n"}te chamar?</Text>
              <Text style={styles.stepSubtitle}>
                Seu nome será usado para personalizar sua experiência.
              </Text>
              <TextInput
                style={styles.nameInput}
                placeholder="Digite seu nome..."
                placeholderTextColor={Colors.textMuted}
                value={name}
                onChangeText={setName}
                autoFocus
                maxLength={30}
                returnKeyType="next"
                onSubmitEditing={nextToAvatar}
              />
              <TouchableOpacity
                style={[
                  styles.primaryBtn,
                  !name.trim() && styles.primaryBtnDisabled,
                ]}
                onPress={nextToAvatar}
                activeOpacity={0.85}
              >
                <Text style={styles.primaryBtnText}>Próximo</Text>
                <Ionicons
                  name="arrow-forward"
                  size={18}
                  color={Colors.background}
                  style={{ marginLeft: 8 }}
                />
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={[Colors.gradientStart, Colors.gradientMid, Colors.gradientEnd]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
      />
      <SafeAreaView style={styles.safe}>
        <View style={styles.avatarHeader}>
          <TouchableOpacity
            onPress={() => setStep("name")}
            style={styles.backBtn}
          >
            <Ionicons
              name="chevron-back"
              size={22}
              color={Colors.textPrimary}
            />
          </TouchableOpacity>
          <Text style={styles.stepIndicator}>2 de 2</Text>
          <View style={{ width: 32 }} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.avatarScroll}
        >
          <Text style={styles.stepTitle}>Escolha seu avatar 2D</Text>
          <Text style={styles.stepSubtitle}>
            Avatares gerados por API. Toque para selecionar.
          </Text>

          {selectedAvatar ? (
            <View style={styles.avatarPreviewWrap}>
              <AvatarImage avatarUrl={selectedAvatar.url} size={132} />
              {name.trim() && (
                <Text style={styles.avatarName}>{name.trim()}</Text>
              )}
            </View>
          ) : null}

          <View style={styles.grid}>
            {avatarOptions.map((avatar) => {
              const isActive = selectedAvatarId === avatar.id;
              return (
                <TouchableOpacity
                  key={avatar.id}
                  style={[
                    styles.avatarCard,
                    isActive && styles.avatarCardActive,
                  ]}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setSelectedAvatarId(avatar.id);
                  }}
                  activeOpacity={0.85}
                >
                  <AvatarImage avatarUrl={avatar.url} size={76} />
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={regenerateOptions}
            activeOpacity={0.85}
          >
            <Ionicons name="refresh" size={16} color={Colors.textPrimary} />
            <Text style={styles.secondaryBtnText}>Gerar novos avatares</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.primaryBtn,
              { marginTop: 18, width: "100%" },
              !selectedAvatar && styles.primaryBtnDisabled,
            ]}
            onPress={handleFinish}
            activeOpacity={0.85}
            disabled={!selectedAvatar}
          >
            <Ionicons
              name="checkmark-circle"
              size={20}
              color={Colors.background}
              style={{ marginRight: 8 }}
            />
            <Text style={styles.primaryBtnText}>Começar a usar</Text>
          </TouchableOpacity>

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
  centerSafe: { flex: 1, justifyContent: "center" },

  welcomeWrap: { alignItems: "center", paddingHorizontal: 32 },
  brandTitle: {
    marginTop: 10,
    fontSize: 21,
    fontWeight: "900",
    letterSpacing: 1.1,
    color: Colors.cyan,
  },
  brandTagline: {
    marginTop: 2,
    marginBottom: 10,
    fontSize: 12,
    color: Colors.textSecondary,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: Colors.textPrimary,
    textAlign: "center",
    marginTop: 14,
    marginBottom: 12,
  },
  welcomeSubtitle: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 40,
  },

  stepWrap: { paddingHorizontal: 28 },
  stepIndicator: {
    fontSize: 12,
    color: Colors.gold,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
    textAlign: "center",
    marginBottom: 16,
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: Colors.textPrimary,
    lineHeight: 34,
    marginBottom: 10,
    textAlign: "center",
  },
  stepSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 21,
    marginBottom: 22,
  },
  nameInput: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingHorizontal: 18,
    paddingVertical: 16,
    fontSize: 17,
    color: Colors.textPrimary,
    marginBottom: 24,
  },

  avatarHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  backBtn: { padding: 6 },
  avatarScroll: { paddingHorizontal: 24 },
  avatarPreviewWrap: {
    alignItems: "center",
    marginVertical: 14,
  },
  avatarName: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: "700",
    color: Colors.textPrimary,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 12,
    marginTop: 4,
  },
  avatarCard: {
    width: "23%",
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.card,
  },
  avatarCardActive: {
    borderColor: Colors.gold,
    backgroundColor: "rgba(2,195,202,0.1)",
  },

  secondaryBtn: {
    marginTop: 14,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  secondaryBtnText: {
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: "600",
  },

  primaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.gold,
    borderRadius: 14,
    paddingVertical: 16,
    marginTop: 8,
  },
  primaryBtnDisabled: { opacity: 0.4 },
  primaryBtnText: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.background,
    paddingHorizontal: 8,
  },
});
