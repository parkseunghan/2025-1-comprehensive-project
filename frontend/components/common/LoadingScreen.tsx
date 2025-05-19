// 📄 components/common/LoadingScreen.tsx

import React, { useEffect, useRef } from "react";
import {
    View,
    Text,
    StyleSheet,
    Animated,
    Easing,
    SafeAreaView,
    Image,
} from "react-native";

// ✅ AJINGA 로고 경로
const logoSource = require("@/images/AJINGA_LOGO.png");

export default function LoadingScreen() {
    const logoScale = useRef(new Animated.Value(0.8)).current;
    const logoOpacity = useRef(new Animated.Value(0.4)).current;
    const loadingAnim = useRef(new Animated.Value(0)).current;
    const textOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // 로고 애니메이션
        Animated.loop(
            Animated.sequence([
                Animated.parallel([
                    Animated.timing(logoScale, {
                        toValue: 1,
                        duration: 1000,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                    Animated.timing(logoOpacity, {
                        toValue: 1,
                        duration: 1000,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                ]),
                Animated.parallel([
                    Animated.timing(logoScale, {
                        toValue: 0.8,
                        duration: 1000,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                    Animated.timing(logoOpacity, {
                        toValue: 0.4,
                        duration: 1000,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                ]),
            ])
        ).start();

        // 로딩 바 애니메이션
        Animated.loop(
            Animated.timing(loadingAnim, {
                toValue: 1,
                duration: 1500,
                easing: Easing.linear,
                useNativeDriver: false,
            })
        ).start();

        // 텍스트 페이드 인
        Animated.timing(textOpacity, {
            toValue: 1,
            duration: 800,
            delay: 400,
            useNativeDriver: true,
        }).start();
    }, []);

    const loadingWidth = loadingAnim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: ["0%", "100%", "0%"],
    });

    const loadingTranslateX = loadingAnim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: ["-100%", "0%", "100%"],
    });

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                {/* ✅ 로고 애니메이션 */}
                <View style={styles.logoSection}>
                    <Animated.View
                        style={[
                            styles.logoContainer,
                            {
                                opacity: logoOpacity,
                                transform: [{ scale: logoScale }],
                            },
                        ]}
                    >
                        <Image
                            source={logoSource}
                            style={styles.logoImage}
                            resizeMode="contain"
                        />
                    </Animated.View>
                </View>

                {/* ✅ 로딩 인디케이터 */}
                <View style={styles.loadingBarContainer}>
                    <View style={styles.loadingBarBackground}>
                        <Animated.View
                            style={[
                                styles.loadingBar,
                                {
                                    width: loadingWidth,
                                    transform: [{ translateX: loadingTranslateX }],
                                },
                            ]}
                        />
                    </View>
                </View>

                {/* ✅ 텍스트 */}
                <Animated.View style={[styles.textSection, { opacity: textOpacity }]}>
                    <Text style={styles.loadingText}>AI가 예측 중입니다</Text>
                    <Text style={styles.hintText}>잠시만 기다려 주세요</Text>
                </Animated.View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    logoSection: {
        alignItems: "center",
        marginBottom: 60,
    },
    logoContainer: {
        width: 140,
        height: 140,
        borderRadius: 30,
        backgroundColor: "#F0F4FF",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    logoImage: {
        width: 100,
        height: 100,
    },
    loadingBarContainer: {
        width: "80%",
        marginBottom: 40,
    },
    loadingBarBackground: {
        height: 4,
        backgroundColor: "#EAEEF6",
        borderRadius: 2,
        overflow: "hidden",
    },
    loadingBar: {
        height: "100%",
        backgroundColor: "#D92B4B",
        borderRadius: 2,
    },
    textSection: {
        alignItems: "center",
    },
    loadingText: {
        fontSize: 22,
        fontWeight: "600",
        color: "#333333",
        marginBottom: 8,
    },
    hintText: {
        fontSize: 14,
        color: "#8E97A9",
        fontWeight: "400",
    },
});
