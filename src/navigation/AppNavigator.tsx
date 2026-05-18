import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AppColors } from "../constants/colors";
import { useUser } from "../context/UserContext";
import { useThemeStyles } from "../context/ThemeContext";
import { OnboardingScreen } from "../screens/OnboardingScreen";
import { PagerLayout } from "../components/PagerLayout";
import { BrandLogo } from "../components/BrandLogo";

const Stack = createNativeStackNavigator();

export function AppNavigator() {
  const { profile, isLoading } = useUser();
  const { colors: Colors, styles } = useThemeStyles(createStyles);

  if (isLoading) {
    return (
      <View style={styles.splash}>
        <BrandLogo width={176} height={136} />
        <ActivityIndicator size="large" color={Colors.gold} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false, animation: "fade" }}
      >
        {!profile.onboardingDone ? (
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        ) : (
          <Stack.Screen name="Main" component={PagerLayout} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const createStyles = (Colors: AppColors) =>
  StyleSheet.create({
  splash: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
    gap: 18,
  },
});
