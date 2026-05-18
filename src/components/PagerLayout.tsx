import React, { useRef, useState } from "react";
import { View, Text, StyleSheet, Dimensions, Animated } from "react-native";
import PagerView from "react-native-pager-view";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppColors } from "../constants/colors";
import { useThemeStyles } from "../context/ThemeContext";
import { TherapyScreen } from "../screens/TherapyScreen";
import { SearchScreen } from "../screens/SearchScreen";
import { SettingsScreen } from "../screens/SettingsScreen";
import { MusicPlayer } from "./MusicPlayer";

const { width } = Dimensions.get("window");

const PAGES = [
  { key: "therapy", label: "Musicoterapia" },
  { key: "search", label: "Pesquisa" },
  { key: "settings", label: "Configurações" },
];

export function PagerLayout() {
  const [activePage, setActivePage] = useState(0);
  const pagerRef = useRef<PagerView>(null);
  const { styles } = useThemeStyles(createStyles);

  return (
    <View style={styles.root}>
      {/* Page indicator tabs */}
      <SafeAreaView edges={["top"]} style={styles.topSafeArea}>
        <View style={styles.tabRow}>
          {PAGES.map((page, idx) => (
            <View key={page.key} style={styles.tabWrap}>
              <Text
                style={[
                  styles.tabLabel,
                  activePage === idx && styles.tabLabelActive,
                ]}
                onPress={() => pagerRef.current?.setPage(idx)}
              >
                {page.label}
              </Text>
              {activePage === idx && <View style={styles.tabUnderline} />}
            </View>
          ))}

          {/* Swipe hint dot indicator */}
          <View style={styles.dotRow}>
            {PAGES.map((_, idx) => (
              <View
                key={idx}
                style={[styles.dot, activePage === idx && styles.dotActive]}
              />
            ))}
          </View>
        </View>
      </SafeAreaView>

      {/* Swipeable pages */}
      <PagerView
        ref={pagerRef}
        style={styles.pager}
        initialPage={0}
        onPageSelected={(e) => setActivePage(e.nativeEvent.position)}
        overdrag
      >
        <View key="therapy" style={styles.page}>
          <TherapyScreen />
        </View>
        <View key="search" style={styles.page}>
          <SearchScreen />
        </View>
        <View key="settings" style={styles.page}>
          <SettingsScreen />
        </View>
      </PagerView>

      {/* Persistent player */}
      <MusicPlayer />
    </View>
  );
}

const createStyles = (Colors: AppColors) =>
  StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  topSafeArea: { backgroundColor: Colors.background },

  tabRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 2,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.tabBarBorder,
    gap: 0,
  },
  tabWrap: {
    marginRight: 24,
    alignItems: "center",
    paddingVertical: 10,
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textMuted,
  },
  tabLabelActive: {
    color: Colors.secondary,
  },
  tabUnderline: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    borderRadius: 1,
    backgroundColor: Colors.secondary,
  },
  dotRow: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 5,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.border,
  },
  dotActive: {
    backgroundColor: Colors.secondary,
    width: 18,
  },

  pager: { flex: 1 },
  page: { flex: 1 },
});
