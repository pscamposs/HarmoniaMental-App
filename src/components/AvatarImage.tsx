import React from "react";
import { View, Image, StyleSheet } from "react-native";
import { AppColors } from "../constants/colors";
import { useThemeStyles } from "../context/ThemeContext";

type Props = {
  avatarUrl: string;
  size?: number;
};

export function AvatarImage({ avatarUrl, size = 100 }: Props) {
  const { styles } = useThemeStyles(createStyles);

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
      ]}
    >
      <Image
        source={{ uri: avatarUrl }}
        style={{ width: size, height: size, borderRadius: size / 2 }}
        resizeMode="cover"
      />
    </View>
  );
}

const createStyles = (Colors: AppColors) =>
  StyleSheet.create({
  container: {
    overflow: "hidden",
    borderWidth: 2,
    borderColor: Colors.gold,
    backgroundColor: Colors.card,
  },
});
