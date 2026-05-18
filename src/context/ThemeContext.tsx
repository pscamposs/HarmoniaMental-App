import React, { createContext, useContext, useMemo } from "react";
import { useColorScheme } from "react-native";
import { AppColors, getColorsForScheme } from "../constants/colors";

type ThemeContextValue = {
  colorScheme: "light" | "dark";
  colors: AppColors;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const deviceScheme = useColorScheme();
  const colorScheme: ThemeContextValue["colorScheme"] =
    deviceScheme === "dark" ? "dark" : "light";

  const value = useMemo(
    () => ({
      colorScheme,
      colors: getColorsForScheme(colorScheme),
    }),
    [colorScheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const value = useContext(ThemeContext);
  if (!value) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }
  return value;
}

export function useThemeColors() {
  return useTheme().colors;
}

export function useThemeStyles<T>(factory: (colors: AppColors) => T) {
  const colors = useThemeColors();
  const styles = useMemo(() => factory(colors), [colors, factory]);
  return { colors, styles };
}
