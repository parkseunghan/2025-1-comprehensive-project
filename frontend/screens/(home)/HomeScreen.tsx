// 📄 screens/(home)/HomeScreen.tsx

import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth.store";
import { fetchCurrentUser } from "@/services/user.api";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";

export default function HomeScreen() {
    const { user } = useAuthStore();
    const { data: profile } = useQuery({
        queryKey: ["user", user?.id],
        queryFn: () => fetchCurrentUser(user!.id),
        enabled: !!user?.id,
    });

    const getBMILabel = (bmi?: number) => {
        if (!bmi) return "정보 없음";
        if (bmi < 18.5) return "저체중";
        if (bmi < 23) return "정상";
        if (bmi < 25) return "과체중";
        return "비만";
    };

    const getBMIColor = (bmi?: number) => {
        if (!bmi) return "#9CA3AF";
        if (bmi < 18.5) return "#3B82F6";
        if (bmi < 23) return "#16A34A";
        if (bmi < 25) return "#FACC15";
        return "#EF4444";
    };

    return (
        <ScrollView style={styles.container}>
            {/* ✅ 프로필 카드 */}
            <View style={styles.profileCard}>
                <View style={styles.profileRow}>
                    <View style={styles.avatar}>
                        <Feather name="user" size={24} color="#ffffff" />
                    </View>
                    <View style={styles.profileTextContainer}>
                        <Text style={styles.profileMain}>
                            {profile?.age || "55"}세 {profile?.gender || "남성"} / {profile?.height || "175"}cm · {profile?.weight || "70"}kg · BMI {profile?.bmi?.toFixed(1) ?? "--"}{" "}
                            <Text style={{ color: getBMIColor(profile?.bmi), fontWeight: "bold" }}>
                                [{getBMILabel(profile?.bmi)}]
                            </Text>
                        </Text>

                        <View style={styles.tagGroup}>
                            <Text style={styles.profileSubLabel}>지병:</Text>
                            <View style={styles.tagList}>
                                {(profile?.diseases?.length ? profile.diseases : [{ name: "없음" }]).map((d, idx) => (
                                    <View key={idx} style={styles.tagBox}>
                                        <Text style={styles.tagText}>{d.name}</Text>
                                    </View>
                                ))}
                            </View>

                            <Text style={[styles.profileSubLabel, { marginTop: 6 }]}>약물:</Text>
                            <View style={styles.tagList}>
                                {(profile?.medications?.length ? profile.medications : [{ name: "없음" }]).map((m, idx) => (
                                    <View key={idx} style={styles.tagBox}>
                                        <Text style={styles.tagText}>{m.name}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.detailLinkContainer}
                    onPress={() => router.push("/(user)/profile-detail")}
                >
                    <Text style={styles.detailLink}>자세히 보기</Text>
                    <Text style={styles.detailArrow}>›</Text>
                </TouchableOpacity>
            </View>

            {/* ✅ 기능 타이틀 */}
            <Text style={styles.sectionTitle}>기능</Text>
            <Text style={styles.sectionSub}>주요 기능들을 바로 확인해보세요</Text>

            {/* ✅ 기능 카드 */}
            <View style={styles.cardGrid}>
                <TouchableOpacity
                    style={[styles.featureCard, styles.diagnosisCard]}
                    onPress={() => router.push("/(record)/symptominput")}
                >
                    <View style={styles.iconContainer}>
                        <View style={[styles.iconCircle, styles.diagnosisIconCircle]}>
                            <FontAwesome5 name="stethoscope" size={35} color="#7F66FF" />
                        </View>
                    </View>
                    <Text style={styles.cardLabel}>자가진단</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={[styles.featureCard, styles.statsCard]}
                    onPress={() => router.push("/(home)/healthstats")}
                >
                    <View style={styles.iconContainer}>
                        <Feather name="bar-chart-2" size={40} color="#ffffff" />
                    </View>
                    <Text style={[styles.cardLabel, styles.lightLabel]}>건강 통계</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.featureCard, styles.encyclopediaCard]}
                    onPress={() => router.push("/(dictionary)/disease")}
                >
                    <View style={styles.iconContainer}>
                        <Feather name="book-open" size={40} color="#ffffff" />
                    </View>
                    <Text style={[styles.cardLabel, styles.lightLabel]}>질병 도감</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.featureCard, styles.recordsCard]}
                    onPress={() => router.push("/(dictionary)/medication")}
                >
                    <View style={styles.iconContainer}>
                        <View style={[styles.iconCircle, styles.recordsIconCircle]}>
                            <FontAwesome5 name="pills" size={35} color="#7F66FF" />
                        </View>
                    </View>
                    <Text style={styles.cardLabel}>약물 도감</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#F4F1FF",
    },
    profileCard: {
        backgroundColor: "#ffffff",
        borderRadius: 18,
        padding: 12, // ⬅ 축소
        marginBottom: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 2,
    },
    profileRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 8,
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: "#7F66FF",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    profileTextContainer: {
        flex: 1,
    },
    profileMain: {
        fontSize: 18, // ⬇
        fontWeight: "bold",
        color: "#111827",
        marginBottom: 4,
    },
    tagGroup: {
        marginTop: 2,
    },
    profileSubLabel: {
        fontSize: 12, // ⬇
        color: "#6B7280",
        fontWeight: "600",
        marginBottom: 2,
    },
    tagList: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 6,
    },
    tagBox: {
        borderWidth: 1,
        borderColor: "#A78BFA",
        borderRadius: 5,
        paddingHorizontal: 6, // ⬇
        paddingVertical: 1,   // ⬇
        backgroundColor: "#F3F0FF",
    },
    tagText: {
        fontSize: 11, // ⬇
        color: "#4B5563",
        fontWeight: "500",
    },
    detailLinkContainer: {
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
        marginTop: 8,
    },
    detailLink: {
        color: "#4171F0",
        fontWeight: "bold",
        fontSize: 13,
    },
    detailArrow: {
        color: "#4171F0",
        fontWeight: "bold",
        fontSize: 16,
        marginLeft: 4,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#111827",
        marginBottom: 4,
    },
    sectionSub: {
        fontSize: 13,
        color: "#6B7280",
        marginBottom: 20,
    },
    cardGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        gap: 16,
    },
    featureCard: {
        width: "47%",
        aspectRatio: 1,
        borderRadius: 24,
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
    },
    diagnosisCard: {
        backgroundColor: "#FFFFFF",
    },
    statsCard: {
        backgroundColor: "#4171F0",
    },
    encyclopediaCard: {
        backgroundColor: "#4171F0",
    },
    recordsCard: {
        backgroundColor: "#FFFFFF",
    },
    iconContainer: {
        marginBottom: 16,
        justifyContent: "center",
        alignItems: "center",
    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: "center",
        alignItems: "center",
    },
    diagnosisIconCircle: {
        backgroundColor: "#EFE9FF",
    },
    recordsIconCircle: {
        backgroundColor: "#EFE9FF",
    },
    cardLabel: {
        fontSize: 18,
        fontWeight: "600",
        color: "#111827",
    },
    lightLabel: {
        color: "#FFFFFF",
    },
});
