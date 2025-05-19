// 📄 components/common/BackButton.tsx

import React from "react";
import { TouchableOpacity, StyleSheet, ViewStyle, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

interface Props {
  fallbackRoute?: string;
  style?: ViewStyle;
  color?: string;
  size?: number;
  forceReplace?: boolean;
}

export default function BackButton({
  fallbackRoute = "/(tabs)/home",
  style,
  color = "#111827",
  size = 24,
  forceReplace = false,
}: Props) {
  const goBack = () => {
    const isWeb = Platform.OS === "web";
    const isShallowHistory = isWeb && typeof window !== "undefined" && window.history.length <= 2;

    const shouldReplace = forceReplace || isShallowHistory;

    if (shouldReplace) {
      router.replace(fallbackRoute);
    } else {
      router.back();
    }
  };

  return (
    <TouchableOpacity onPress={goBack} style={[styles.button, style]}>
      <Ionicons name="chevron-back" size={size} color={color} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 8,
  },
});
