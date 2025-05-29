import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { router } from "expo-router";

export default function Welcome() {
    return (
        <View style={styles.container}>
            {/* 중앙 로고 */}
            <View style={styles.logoWrapper}>
                <Image
                    source={require("@/images/AJINGA_LOGO.png")}
                    style={styles.logo}
                    resizeMode="contain"
                />
            </View>

            {/* 이메일 로그인 */}
            <TouchableOpacity
                style={styles.emailButton}
                onPress={() => router.push("/(auth)/login")}
            >
                <Text style={styles.emailButtonText}>이메일로 로그인</Text>
            </TouchableOpacity>

            {/* 하단 링크 */}
            <View style={styles.footer}>
                <TouchableOpacity onPress={() => router.push("/(auth)/signup")}>
                    <Text style={styles.footerText}>회원가입</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffffff",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 24,
    },
    logoWrapper: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    logo: {
        width: 300,
        height: 300,
        marginTop: 50,
        marginBottom: 40,
    },
    emailButton: {
        borderWidth: 1,
        borderColor: "#111827",
        borderRadius: 8,
        paddingVertical: 14,
        paddingHorizontal: 24,
        marginBottom: 24,
    },
    emailButtonText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#111827",
    },
    footer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
    },
    footerText: {
        color: "#6B7280",
        fontSize: 14,
    },
    footerDivider: {
        marginHorizontal: 8,
        color: "#9CA3AF",
    },
});