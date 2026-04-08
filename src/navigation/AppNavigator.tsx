import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Colors } from "../constants/colors";
import { useUser } from "../context/UserContext";
import { OnboardingScreen } from "../screens/OnboardingScreen";
import { PagerLayout } from "../components/PagerLayout";
import { BrandLogo } from "../components/BrandLogo";

const Stack = createNativeStackNavigator();

export function AppNavigator() {
  const { profile, isLoading } = useUser();

  if (isLoading) {
    return (
      <View style={styles.splash}>
        <BrandLogo width={120} height={120} />
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

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
    gap: 18,
  },
});
