import { useEffect } from "react";
import * as SystemUI from "expo-system-ui";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { UserProvider } from "./src/context/UserContext";
import { PlaybackProvider } from "./src/context/PlaybackContext";
import { PlaylistCatalogProvider } from "./src/context/PlaylistCatalogContext";
import { ThemeProvider, useTheme } from "./src/context/ThemeContext";
import { AppNavigator } from "./src/navigation/AppNavigator";

function AppContent() {
  const { colorScheme, colors } = useTheme();

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(colors.background);
  }, [colors.background]);

  return (
    <UserProvider>
      <PlaylistCatalogProvider>
        <PlaybackProvider>
          <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
          <AppNavigator />
        </PlaybackProvider>
      </PlaylistCatalogProvider>
    </UserProvider>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
