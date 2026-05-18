import type { ColorSchemeName } from "react-native";

export const LightColors = {
  background: "#FAFAF7",
  surface: "#FFFFFF",
  surfaceSoft: "#F1F7F7",
  card: "#FFFFFF",
  cardAlt: "#F1F7F7",
  border: "#E5E0EF",

  primary: "#02C3CA",
  primaryHover: "#00AEB5",
  primarySoft: "#D9F7F8",
  secondary: "#5635AA",
  secondarySoft: "#ECE6FA",
  accent: "#E3A216",
  accentSoft: "#FFF2CC",
  success: "#6ACE9A",
  warning: "#E97C39",

  gold: "#02C3CA",
  goldLight: "#6ED8DB",
  goldDark: "#00AEB5",
  orange: "#E97C39",
  orangeDark: "#C9662D",
  cyan: "#02C3CA",
  cyanLight: "#6ED8DB",
  purple: "#5635AA",
  lavender: "#A58CD7",
  mint: "#6ACE9A",

  textPrimary: "#241F33",
  textSecondary: "#7F5E9D",
  textMuted: "#9A84B6",

  danger: "#E65349",
  dangerBg: "#FDE9E6",

  gradientStart: "#FAFAF7",
  gradientMid: "#D9F7F8",
  gradientEnd: "#ECE6FA",
  gradientBrandStart: "#02C3CA",
  gradientBrandEnd: "#5635AA",
  gradientEnergyStart: "#E3A216",
  gradientEnergyEnd: "#E97C39",
  gradientTherapyStart: "#6ACE9A",
  gradientTherapyMid: "#02C3CA",
  gradientTherapyEnd: "#A58CD7",

  playerBg: "#FFFFFF",
  tabBar: "#FFFFFF",
  tabBarBorder: "#E5E0EF",

  white: "#FFFFFF",
  overlay: "rgba(36,31,51,0.52)",
};

export const DarkColors = {
  background: "#12101E",
  surface: "#1D1930",
  surfaceSoft: "#28213F",
  card: "#1D1930",
  cardAlt: "#28213F",
  border: "#342A4F",

  primary: "#02C3CA",
  primaryHover: "#35DDE2",
  primarySoft: "#123F45",
  secondary: "#A58CD7",
  secondaryStrong: "#7B55D9",
  secondarySoft: "#28213F",
  accent: "#E3A216",
  accentSoft: "#4A3510",
  success: "#6ACE9A",
  warning: "#E97C39",

  gold: "#02C3CA",
  goldLight: "#35DDE2",
  goldDark: "#008D94",
  orange: "#E97C39",
  orangeDark: "#A84F22",
  cyan: "#02C3CA",
  cyanLight: "#35DDE2",
  purple: "#7B55D9",
  lavender: "#A58CD7",
  mint: "#6ACE9A",

  textPrimary: "#F8F5FF",
  textSecondary: "#B9A9D8",
  textMuted: "#8F7CB0",

  danger: "#E65349",
  dangerBg: "#3B1726",

  gradientStart: "#12101E",
  gradientMid: "#1D1930",
  gradientEnd: "#123F45",
  gradientBrandStart: "#02C3CA",
  gradientBrandEnd: "#5635AA",
  gradientEnergyStart: "#E3A216",
  gradientEnergyEnd: "#E97C39",
  gradientTherapyStart: "#6ACE9A",
  gradientTherapyMid: "#02C3CA",
  gradientTherapyEnd: "#A58CD7",

  playerBg: "#1D1930",
  tabBar: "#1D1930",
  tabBarBorder: "#342A4F",

  white: "#FFFFFF",
  overlay: "rgba(0,0,0,0.6)",
};

export type AppColors = typeof LightColors;

export function getColorsForScheme(colorScheme: ColorSchemeName): AppColors {
  return colorScheme === "dark" ? DarkColors : LightColors;
}

export const Colors = LightColors;
