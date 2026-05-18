import React from "react";
import { Image, StyleSheet, View } from "react-native";

type BrandLogoProps = {
  width?: number;
  height?: number;
};

const logoSource = require("../../assets/app-icon-nobg.png");

export function BrandLogo({ width = 142, height = 110 }: BrandLogoProps) {
  return (
    <View style={[styles.frame, { width, height }]}>
      <Image source={logoSource} style={styles.logo} resizeMode="contain" />
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: "100%",
    height: "100%",
  },
});
