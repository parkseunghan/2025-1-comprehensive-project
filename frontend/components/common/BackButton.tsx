// 📄 components/common/BackButton.tsx
// 뒤로가기 버튼 공통 컴포넌트입니다. 이전 화면이 없을 경우 기본 경로로 이동합니다.

import React from "react";
import { TouchableOpacity, StyleSheet, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

interface Props {
    fallbackRoute?: string; // 기본값: "/(tabs)/home"
    style?: ViewStyle;
    color?: string;
    size?: number;
}

export default function BackButton({
    fallbackRoute = "/(tabs)/home",
    style,
    color = "#111827",
    size = 24,
}: Props) {

    const goBack = () => {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace(fallbackRoute);
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
