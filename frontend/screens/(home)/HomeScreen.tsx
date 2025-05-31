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
    Animated,
    RefreshControl,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth.store";
import { fetchCurrentUser } from "@/services/user.api";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef, useState, useCallback } from "react";

const extractItemName = (raw: string): string =>
    raw.replace(/\(수출명\s*:\s*.*?\)/g, "").trim();

const { width } = Dimensions.get("window");

export default function HomeScreen() {
    const { user } = useAuthStore();
    const {
        data: profile,
        refetch,
    } = useQuery({
        queryKey: ["user", user?.id],
        queryFn: () => fetchCurrentUser(user!.id),
        enabled: !!user?.id,
    });

    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(async () => {
        try {
            setRefreshing(true);
            await refetch(); // ✅ 서버에서 유저 정보 다시 불러오기
        } catch (error) {
            console.error("새로고침 중 오류 발생:", error);
        } finally {
            setRefreshing(false);
        }
    }, [refetch]);

    // 애니메이션 값들
    const welcomeOpacity = useRef(new Animated.Value(0)).current;
    const welcomeTranslateY = useRef(new Animated.Value(30)).current;
    const nameOpacity = useRef(new Animated.Value(0)).current;
    const nameTranslateY = useRef(new Animated.Value(30)).current;
    const todayOpacity = useRef(new Animated.Value(0)).current;
    const todayTranslateY = useRef(new Animated.Value(30)).current;

    useEffect(() => {
        const animateTexts = () => {
            Animated.timing(welcomeOpacity, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }).start();
            Animated.timing(welcomeTranslateY, {
                toValue: 0,
                duration: 800,
                useNativeDriver: true,
            }).start();

            setTimeout(() => {
                Animated.timing(nameOpacity, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }).start();
                Animated.timing(nameTranslateY, {
                    toValue: 0,
                    duration: 800,
                    useNativeDriver: true,
                }).start();
            }, 300);

            setTimeout(() => {
                Animated.timing(todayOpacity, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }).start();
                Animated.timing(todayTranslateY, {
                    toValue: 0,
                    duration: 800,
                    useNativeDriver: true,
                }).start();
            }, 600);
        };

        animateTexts();
    }, []);

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
        return "#D92B4B";
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.contentContainer}
                style={styles.scrollView}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor="#D92B4B"
                        colors={["#D92B4B"]}
                    />
                }
            >
                {/* 상단 그라데이션 헤더 - 스크롤 가능 */}
                <LinearGradient
                    colors={['#D92B4B', '#FF6B8A']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.headerGradient}
                >
                    <View style={styles.headerContent}>
                        <Animated.Text 
                            style={[
                                styles.welcomeText,
                                {
                                    opacity: welcomeOpacity,
                                    transform: [{ translateY: welcomeTranslateY }]
                                }
                            ]}
                        >
                            안녕하세요!
                        </Animated.Text>
                        <Animated.Text 
                            style={[
                                styles.userNameText,
                                {
                                    opacity: nameOpacity,
                                    transform: [{ translateY: nameTranslateY }]
                                }
                            ]}
                        >
                            {profile?.name || "사용자"}님
                        </Animated.Text>
                        <Animated.Text 
                            style={[
                                styles.todayText,
                                {
                                    opacity: todayOpacity,
                                    transform: [{ translateY: todayTranslateY }]
                                }
                            ]}
                        >
                            오늘도 건강한 하루 되세요
                        </Animated.Text>
                    </View>
                </LinearGradient>

                {/* 프로필 카드 */}
                <View style={styles.profileCardContainer}>
                    <View style={styles.profileCard}>
                        <View style={styles.profileHeader}>
                            <LinearGradient
                                colors={['#D92B4B', '#FF6B8A']}
                                style={styles.avatar}
                            >
                                <Feather name="user" size={24} color="#ffffff" />
                            </LinearGradient>
                            <View style={styles.profileInfo}>
                                <Text style={styles.profileTitle}>내 건강 정보</Text>
                                <TouchableOpacity 
                                    style={styles.editButton}
                                    onPress={() => router.push("/(user)/profile-detail")}
                                >
                                    <Feather name="edit-2" size={12} color="#D92B4B" />
                                    <Text style={styles.editText}>수정</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        
                        <View style={styles.statsContainer}>
                            <View style={styles.statItem}>
                                <View style={[styles.statIcon, { backgroundColor: '#FFE8ED' }]}>
                                    <Feather name="calendar" size={16} color="#D92B4B" />
                                </View>
                                <Text style={styles.statValue}>{profile?.age || "55"}세</Text>
                                <Text style={styles.statLabel}>나이</Text>
                            </View>
                            <View style={styles.statItem}>
                                <View style={[styles.statIcon, { backgroundColor: '#E8F4FD' }]}>
                                    <FontAwesome5 name="venus-mars" size={14} color="#4A90E2" />
                                </View>
                                <Text style={styles.statValue}>{profile?.gender || "남성"}</Text>
                                <Text style={styles.statLabel}>성별</Text>
                            </View>
                            <View style={styles.statItem}>
                                <View style={[styles.statIcon, { backgroundColor: '#E8F5E8' }]}>
                                    <FontAwesome5 name="ruler-vertical" size={14} color="#4CAF50" />
                                </View>
                                <Text style={styles.statValue}>{profile?.height || "175"}cm</Text>
                                <Text style={styles.statLabel}>키</Text>
                            </View>
                            <View style={styles.statItem}>
                                <View style={[styles.statIcon, { backgroundColor: '#FFF3E0' }]}>
                                    <FontAwesome5 name="weight" size={14} color="#FF9800" />
                                </View>
                                <Text style={styles.statValue}>{profile?.weight || "70"}kg</Text>
                                <Text style={styles.statLabel}>체중</Text>
                            </View>
                        </View>
                        
                        <View style={styles.bmiContainer}>
                            <LinearGradient
                                colors={['#FFE8ED', '#FFFFFF']}
                                style={styles.bmiCard}
                            >
                                <View style={styles.bmiHeader}>
                                    <View style={styles.bmiTitleContainer}>
                                        <FontAwesome5 name="chart-line" size={16} color="#D92B4B" />
                                        <Text style={styles.bmiLabel}>BMI 지수</Text>
                                    </View>
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
                                
                                <View style={styles.bmiStatusContainer}>
                                    <View style={[styles.bmiStatusBadge, { backgroundColor: getBMIColor(profile?.bmi) + '20' }]}>
                                        <Text style={[styles.bmiStatusText, { color: getBMIColor(profile?.bmi) }]}>
                                            {getBMILabel(profile?.bmi)}
                                        </Text>
                                    </View>
                                </View>
                            </LinearGradient>
                        </View>
                        
                        <View style={styles.medicalInfo}>
                            <View style={styles.medicalSection}>
                                <View style={styles.medicalHeader}>
                                    <FontAwesome5 name="heartbeat" size={14} color="#D92B4B" />
                                    <Text style={styles.medicalTitle}>지병 정보</Text>
                                </View>
                                <View style={styles.tagList}>
                                    {(profile?.diseases?.length ? profile.diseases : [{ name: "없음" }]).map((d, idx) => (
                                        <View key={idx} style={[styles.tagBox, { borderColor: '#D92B4B' + '30' }]}>
                                            <Text style={styles.tagText}>{d.name}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                            
                            <View style={styles.medicalSection}>
                                <View style={styles.medicalHeader}>
                                    <FontAwesome5 name="pills" size={14} color="#4A90E2" />
                                    <Text style={styles.medicalTitle}>복용 약물</Text>
                                </View>
                                <View style={styles.tagList}>
                                    {(profile?.medications?.length ? profile.medications : [{ name: "없음" }]).map((m, idx) => (
                                        <View key={idx} style={[styles.tagBox, { borderColor: '#4A90E2' + '30' }]}>
                                            <Text style={styles.tagText}>{extractItemName(m.name)}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

                {/* 기능 카드 (2x2 그리드) */}
                <View style={styles.featuresContainer}>
                    <View style={styles.sectionHeaderContainer}>
                        <Text style={styles.sectionTitle}>주요 기능</Text>
                        <Text style={styles.sectionSub}>건강 관리를 위한 필수 도구들</Text>
                    </View>

                    <View style={styles.cardGrid}>
                        <TouchableOpacity
                            style={styles.featureCard}
                            onPress={() => router.push("/(record)/symptominput")}
                        >
                            <LinearGradient
                                colors={['#D92B4B', '#FF6B8A']}
                                style={styles.iconCircle}
                            >
                                <FontAwesome5 name="stethoscope" size={24} color="#FFFFFF" />
                            </LinearGradient>
                            <Text style={styles.cardLabel}>자가진단</Text>
                            <Text style={styles.cardDescription}>증상을 입력하여 가능한 질병을 확인해보세요</Text>
                            <View style={styles.cardArrow}>
                                <Feather name="arrow-right" size={16} color="#D92B4B" />
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.featureCard}
                            onPress={() => router.push("/(home)/healthstats")}
                        >
                            <LinearGradient
                                colors={['#4A90E2', '#7BB3F0']}
                                style={styles.iconCircle}
                            >
                                <Feather name="bar-chart-2" size={24} color="#FFFFFF" />
                            </LinearGradient>
                            <Text style={styles.cardLabel}>건강 통계</Text>
                            <Text style={styles.cardDescription}>건강 데이터를 차트로 확인하세요</Text>
                            <View style={styles.cardArrow}>
                                <Feather name="arrow-right" size={16} color="#4A90E2" />
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.featureCard}
                            onPress={() => router.push("/(dictionary)/disease")}
                        >
                            <LinearGradient
                                colors={['#4CAF50', '#66BB6A']}
                                style={styles.iconCircle}
                            >
                                <Feather name="book-open" size={24} color="#FFFFFF" />
                            </LinearGradient>
                            <Text style={styles.cardLabel}>질병 도감</Text>
                            <Text style={styles.cardDescription}>다양한 질병 정보를 검색하고 확인하세요</Text>
                            <View style={styles.cardArrow}>
                                <Feather name="arrow-right" size={16} color="#4CAF50" />
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.featureCard}
                            onPress={() => router.push("/(dictionary)/medication")}
                        >
                            <LinearGradient
                                colors={['#FF9800', '#FFB74D']}
                                style={styles.iconCircle}
                            >
                                <FontAwesome5 name="pills" size={24} color="#FFFFFF" />
                            </LinearGradient>
                            <Text style={styles.cardLabel}>약물 도감</Text>
                            <Text style={styles.cardDescription}>약물 정보와 부작용을 확인하세요</Text>
                            <View style={styles.cardArrow}>
                                <Feather name="arrow-right" size={16} color="#FF9800" />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                
                {/* 건강 팁 섹션 */}
                <View style={styles.tipsContainer}>
                    <LinearGradient
                        colors={['#FFF8F9', '#FFFFFF']}
                        style={styles.tipCard}
                    >
                        <View style={styles.tipHeader}>
                            <LinearGradient
                                colors={['#FFE8ED', '#FFFFFF']}
                                style={styles.tipIconContainer}
                            >
                                <FontAwesome5 name="lightbulb" size={18} color="#D92B4B" />
                            </LinearGradient>
                            <Text style={styles.tipsTitle}>오늘의 건강 팁</Text>
                        </View>
                        <Text style={styles.tipText}>
                            하루 2리터의 물을 마시는 것은 체내 독소 제거와 
                            신진대사를 원활하게 하는데 도움이 됩니다. 💧
                        </Text>
                    </LinearGradient>
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
    scrollView: {
        flex: 1,
    },
    contentContainer: {
        paddingBottom: 30,
    },    
    // 헤더 스타일 - 스크롤 가능하도록 수정
    headerGradient: {
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
        paddingBottom: 30,
        paddingHorizontal: 20,
    },
    headerContent: {
        alignItems: 'center',
    },
    welcomeText: {
        fontSize: 16,
        color: '#FFFFFF',
        opacity: 0.9,
    },
    userNameText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginVertical: 4,
    },
    todayText: {
        fontSize: 14,
        color: '#FFFFFF',
        opacity: 0.8,
    },
    
    // 프로필 카드 스타일
    profileCardContainer: {
        paddingHorizontal: 20,
        marginTop: 20,
        marginBottom: 30,
    },
    profileCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 20,
        shadowColor: '#D92B4B',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 8,
    },
    profileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
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
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: '#FFE8ED',
        borderRadius: 20,
        gap: 4,
    },
    editText: {
        fontSize: 12,
        color: '#D92B4B',
        fontWeight: '600',
    },
    
    // 신체 스탯 스타일
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    statValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: '#6B7280',
    },
    
    // BMI 스타일
    bmiContainer: {
        marginBottom: 20,
    },
    bmiCard: {
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#D92B4B' + '20',
    },
    bmiHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    bmiTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    bmiLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    bmiValue: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    bmiIndicator: {
        marginBottom: 12,
    },
    bmiProgressBg: {
        height: 8,
        backgroundColor: '#F0F0F5',
        borderRadius: 4,
        overflow: 'hidden',
    },
    bmiProgress: {
        height: '100%',
        borderRadius: 4,
    },
    bmiLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 6,
    },
    bmiRangeText: {
        fontSize: 10,
        color: '#9CA3AF',
    },
    bmiStatusContainer: {
        alignItems: 'center',
    },
    bmiStatusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    bmiStatusText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    
    // 의료 정보 스타일
    medicalInfo: {
        gap: 16,
    },
    medicalSection: {
        marginBottom: 8,
    },
    medicalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12,
    },
    medicalTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    tagList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    tagBox: {
        borderWidth: 1,
        borderRadius: 16,
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: '#FAFAFA',
    },
    tagText: {
        fontSize: 12,
        color: '#4B5563',
        fontWeight: '500',
    },
    
    // 기능 섹션 스타일
    featuresContainer: {
        paddingHorizontal: 20,
        marginBottom: 30,
    },
    sectionHeaderContainer: {
        marginBottom: 20,
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
        justifyContent: 'space-between',
        gap: 16,
    },
    featureCard: {
        width: (width - 56) / 2,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
        position: 'relative',
    },
    iconCircle: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    cardLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    cardDescription: {
        fontSize: 12,
        color: '#6B7280',
        lineHeight: 18,
        marginBottom: 12,
    },
    cardArrow: {
        position: 'absolute',
        bottom: 16,
        right: 16,
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#F8F9FC',
        justifyContent: 'center',
        alignItems: 'center',
    },
    
    // 건강 팁 스타일
    tipsContainer: {
        paddingHorizontal: 20,
    },
    tipCard: {
        borderRadius: 20,
        padding: 20,
        shadowColor: '#D92B4B',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        borderWidth: 1,
        borderColor: '#D92B4B' + '20',
    },
    tipHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    tipIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    tipsTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    tipText: {
        fontSize: 14,
        color: '#4B5563',
        lineHeight: 22,
    },
});