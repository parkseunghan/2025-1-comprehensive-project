// 📄 screens/(record)/SymptomChoiceScreen.tsx

import { View, Text, StyleSheet, TouchableOpacity, Animated } from "react-native";
import { useEffect, useRef } from "react";
import { router } from "expo-router";
import BackButton from "@/common/BackButton";
import { SafeAreaView } from "react-native-safe-area-context";

// ⚙️ 경로 상수화 관리
const ROUTES = {
    symptomTextInput: "/(record)/symptomtextinput",
    CategorySelectScreen: "/(record)/categoryselect", // 대분류
    SymptomSelectScreen: "/(record)/symptomselectscreen", // 소분류 ✅
};

export default function SymptomChoiceScreen() {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(20)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 400,
                useNativeDriver: true,
            }),
            Animated.timing(translateY, {
                toValue: 0,
                duration: 400,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const handleSelect = (type: "text" | "list") => {
        if (type === "text") {
            router.push(ROUTES.symptomTextInput);  // 텍스트 입력 화면으로 이동
        } else if (type === "list") {
            router.push(ROUTES.CategorySelectScreen);  // 리스트 선택 화면으로 이동
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <BackButton />
            </View>

            <Animated.View
                style={[styles.content, { opacity: fadeAnim, transform: [{ translateY }], pointerEvents: "auto", }]}
            >
                <Text style={styles.title}>어떤 방식으로 증상을 입력할까요?</Text>

                <TouchableOpacity style={styles.button} onPress={() => handleSelect("text")}>
                    <Text style={styles.buttonText}>텍스트로 직접 입력하기</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={() => handleSelect("list")}>
                    <Text style={styles.buttonText}>리스트에서 선택하기</Text>
                </TouchableOpacity>
            </Animated.View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffffff",
    },
    header: {
        paddingTop: 24,
        height: 60,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
    },
    content: {
        flex: 1,
        paddingHorizontal: 32,
        paddingTop: 120,
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#111827",
        textAlign: "center",
        marginBottom: 40,
    },
    button: {
        backgroundColor: "#D92B4B",
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: "center",
        marginBottom: 20,
    },
    buttonText: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "600",
    },
});
