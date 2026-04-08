import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { Colors } from "../constants/colors";

type BrandLogoProps = {
  width?: number;
  height?: number;
};

const logoSource = require("../../assets/brand-symbol.png");

export function BrandLogo({ width = 260, height = 180 }: BrandLogoProps) {
  return (
    <View style={[styles.frame, { width, height }]}>
      <Image source={logoSource} style={styles.logo} resizeMode="contain" />
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",

    shadowOffset: { width: 0, height: 6 },
    elevation: 7,
  },
  logo: {
    width: "100%",
    height: "100%",
  },
});
