// 📄 screens/(home)/HomeScreen.tsx

import {
    View,
    Text,
    Platform,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Dimensions,
    StatusBar,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth.store";
import { fetchCurrentUser } from "@/services/user.api";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

// ✅ 수출명 제거 유틸
const extractItemName = (raw: string): string =>
    raw.replace(/\(수출명\s*:\s*.*?\)/g, "").trim();

const { width } = Dimensions.get("window");

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
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <ScrollView 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.contentContainer}
            >
                {/* 프로필 카드 */}
                <View style={styles.profileCardContainer}>
                    <View style={styles.profileCard}>
                        <View style={styles.profileHeader}>
                            <View style={styles.avatar}>
                                <Feather name="user" size={24} color="#ffffff" />
                            </View>
                            <View style={styles.profileInfo}>
                                <Text style={styles.profileTitle}>안녕하세요. {profile?.name || "사용자"}님</Text>

                                <TouchableOpacity 
                                    style={styles.editButton}
                                    onPress={() => router.push("/(user)/profile-detail")}
                                >
                                    <Text style={styles.editText}>수정</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        
                        <View style={styles.divider} />
                        
                        <View style={styles.statsContainer}>
                            <View style={styles.statItem}>
                                <Text style={styles.statLabel}>나이</Text>
                                <Text style={styles.statValue}>{profile?.age || "55"}세</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statLabel}>성별</Text>
                                <Text style={styles.statValue}>{profile?.gender || "남성"}</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statLabel}>키</Text>
                                <Text style={styles.statValue}>{profile?.height || "175"}cm</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statLabel}>체중</Text>
                                <Text style={styles.statValue}>{profile?.weight || "70"}kg</Text>
                            </View>
                        </View>
                        
                        <View style={styles.bmiContainer}>
                            <View style={styles.bmiLabelContainer}>
                                <Text style={styles.bmiLabel}>BMI 지수</Text>
                                <Text style={[styles.bmiValue, { color: getBMIColor(profile?.bmi) }]}>
                                    {profile?.bmi?.toFixed(1) ?? "--"}
                                </Text>
                            </View>
                            <View style={styles.bmiIndicator}>
                                <View style={styles.bmiProgressBg}>
                                    <View 
                                        style={[
                                            styles.bmiProgress, 
                                            { 
                                                width: `${Math.min(100, (profile?.bmi || 18) / 40 * 100)}%`,
                                                backgroundColor: getBMIColor(profile?.bmi)
                                            }
                                        ]} 
                                    />
                                </View>
                                <View style={styles.bmiLabels}>
                                    <Text style={styles.bmiRangeText}>저체중</Text>
                                    <Text style={styles.bmiRangeText}>정상</Text>
                                    <Text style={styles.bmiRangeText}>과체중</Text>
                                    <Text style={styles.bmiRangeText}>비만</Text>
                                </View>
                            </View>
                            <Text style={[styles.bmiStatusText, { color: getBMIColor(profile?.bmi) }]}>
                                {getBMILabel(profile?.bmi)}
                            </Text>
                        </View>
                        
                        <View style={styles.divider} />
                        
                        <View style={styles.medicalInfo}>
                            <View style={styles.medicalSection}>
                                <Text style={styles.medicalTitle}>
                                    <FontAwesome5 name="heartbeat" size={12} color="#7F66FF" /> 지병 정보
                                </Text>
                                <View style={styles.tagList}>
                                    {(profile?.diseases?.length ? profile.diseases : [{ name: "없음" }]).map((d, idx) => (
                                        <View key={idx} style={styles.tagBox}>
                                            <Text style={styles.tagText}>{d.name}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                            
                            <View style={styles.medicalSection}>
                                <Text style={styles.medicalTitle}>
                                    <FontAwesome5 name="pills" size={12} color="#7F66FF" /> 복용 약물
                                </Text>
                                <View style={styles.tagList}>
                                    {(profile?.medications?.length ? profile.medications : [{ name: "없음" }]).map((m, idx) => (
                                        <View key={idx} style={styles.tagBox}>
                                            <Text style={styles.tagText}>{extractItemName(m.name)}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

                {/* 기능 타이틀 */}
                <View style={styles.sectionHeaderContainer}>
                    <Text style={styles.sectionTitle}>기능</Text>
                    <Text style={styles.sectionSub}>주요 기능들을 바로 확인해보세요</Text>
                </View>

                {/* 기능 카드 (2x2 그리드) */}
                <View style={styles.cardGrid}>
                    <TouchableOpacity
                        style={styles.featureCard}
                        onPress={() => router.push("/(record)/symptominput")}
                    >
                        <View style={[styles.iconCircle, { backgroundColor: '#EFE9FF' }]}>
                            <FontAwesome5 name="stethoscope" size={28} color="#7F66FF" />
                        </View>
                        <Text style={styles.cardLabel}>자가진단</Text>
                        <Text style={styles.cardDescription}>증상을 입력하여 가능한 질병을 확인해보세요</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.featureCard}
                        onPress={() => router.push("/(home)/healthstats")}
                    >
                        <View style={[styles.iconCircle, { backgroundColor: '#E6F0FF' }]}>
                            <Feather name="bar-chart-2" size={28} color="#4171F0" />
                        </View>
                        <Text style={styles.cardLabel}>건강 통계</Text>
                        <Text style={styles.cardDescription}>건강 데이터를 차트로 확인하세요</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.featureCard}
                        onPress={() => router.push("/(dictionary)/disease")}
                    >
                        <View style={[styles.iconCircle, { backgroundColor: '#E9F7EF' }]}>
                            <Feather name="book-open" size={28} color="#27AE60" />
                        </View>
                        <Text style={styles.cardLabel}>질병 도감</Text>
                        <Text style={styles.cardDescription}>다양한 질병 정보를 검색하고 확인하세요</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.featureCard}
                        onPress={() => router.push("/(dictionary)/medication")}
                    >
                        <View style={[styles.iconCircle, { backgroundColor: '#FEF5E7' }]}>
                            <FontAwesome5 name="pills" size={28} color="#F39C12" />
                        </View>
                        <Text style={styles.cardLabel}>약물 도감</Text>
                        <Text style={styles.cardDescription}>약물 정보와 부작용을 확인하세요</Text>
                    </TouchableOpacity>
                </View>
                
                {/* 건강 팁 섹션 */}
                <View style={styles.tipsContainer}>
                    <Text style={styles.tipsTitle}>오늘의 건강 팁</Text>
                    <View style={styles.tipCard}>
                        <View style={styles.tipIconContainer}>
                            <FontAwesome5 name="lightbulb" size={18} color="#7F66FF" />
                        </View>
                        <Text style={styles.tipText}>
                            하루 2리터의 물을 마시는 것은 체내 독소 제거와 
                            신진대사를 원활하게 하는데 도움이 됩니다.
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8F9FC",
    },
    contentContainer: {
        paddingTop: 20,
        paddingBottom: 30,
    },
    
    // 프로필 카드 스타일
    profileCardContainer: {
        paddingHorizontal: 20,
        marginTop: 10,
    },
    profileCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    profileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#7F66FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    profileInfo: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    profileTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    editButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: '#F3F0FF',
        borderRadius: 15,
    },
    editText: {
        fontSize: 12,
        color: '#7F66FF',
        fontWeight: '600',
    },
    divider: {
        height: 1,
        backgroundColor: '#F0F0F5',
        marginVertical: 16,
    },
    
    // 신체 스탯 스타일
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statLabel: {
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 4,
    },
    statValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    
    // BMI 스타일
    bmiContainer: {
        marginBottom: 5,
    },
    bmiLabelContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    bmiLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    bmiValue: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    bmiIndicator: {
        marginBottom: 8,
    },
    bmiProgressBg: {
        height: 6,
        backgroundColor: '#F0F0F5',
        borderRadius: 3,
        overflow: 'hidden',
    },
    bmiProgress: {
        height: '100%',
        borderRadius: 3,
    },
    bmiLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 4,
    },
    bmiRangeText: {
        fontSize: 10,
        color: '#9CA3AF',
    },
    bmiStatusText: {
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 4,
    },
    
    // 의료 정보 스타일
    medicalInfo: {
        gap: 16,
    },
    medicalSection: {
        marginBottom: 8,
    },
    medicalTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    tagList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    tagBox: {
        borderWidth: 1,
        borderColor: '#E6E6E6',
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 4,
        backgroundColor: '#FAFAFA',
    },
    tagText: {
        fontSize: 12,
        color: '#4B5563',
    },
    
    // 섹션 헤더 스타일
    sectionHeaderContainer: {
        paddingHorizontal: 20,
        marginTop: 30,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
    },
    sectionSub: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 4,
    },
    
    // 기능 카드 스타일
    cardGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 12,
        justifyContent: 'space-between',
    },
    featureCard: {
        width: (width - 60) / 2,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginHorizontal: 8,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    iconCircle: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    cardLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 6,
    },
    cardDescription: {
        fontSize: 12,
        color: '#6B7280',
        lineHeight: 16,
    },
    
    // 건강 팁 스타일
    tipsContainer: {
        paddingHorizontal: 20,
        marginTop: 20,
    },
    tipsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
    },
    tipCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    tipIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F3F0FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    tipText: {
        flex: 1,
        fontSize: 14,
        color: '#4B5563',
        lineHeight: 20,
    },
});