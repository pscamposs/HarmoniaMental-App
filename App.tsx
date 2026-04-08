import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { UserProvider } from "./src/context/UserContext";
import { PlaybackProvider } from "./src/context/PlaybackContext";
import { AppNavigator } from "./src/navigation/AppNavigator";

export default function App() {
  return (
    <SafeAreaProvider>
      <UserProvider>
        <PlaybackProvider>
          <StatusBar style="light" />
          <AppNavigator />
        </PlaybackProvider>
      </UserProvider>
    </SafeAreaProvider>
  );
}
