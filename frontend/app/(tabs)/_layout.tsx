// 📄 _layout.tsx
// 하단 탭 네비게이션을 구성하는 레이아웃 파일입니다.
// 디자인은 최신 스타일 기준에 맞춰 색상, 높이, 라벨 위치를 통일합니다.

import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false, // 상단 헤더 숨김
                tabBarActiveTintColor: "#D92B4B", // 활성 탭 색상
                tabBarInactiveTintColor: "#9CA3AF", // 비활성 탭 색상
                tabBarLabelStyle: { fontSize: 12 }, // 라벨 글자 크기
                tabBarLabelPosition: "below-icon", // 아이콘 아래에 라벨 배치
                tabBarStyle: {
                    backgroundColor: "#ffffff", // 배경색
                    borderTopWidth: 0.5, // 상단 구분선
                    borderTopColor: "#E5E7EB", // 상단 선 색상 (gray-200)
                    height: 55, // 탭 높이 (살짝 줄임)
                },
            }}
        >
            {/* 홈 탭 */}
            <Tabs.Screen
                name="home"
                options={{
                    title: "홈",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home-outline" size={size} color={color} />
                    ),
                }}
            />

            {/* 기록 탭 */}
            <Tabs.Screen
                name="history"
                options={{
                    title: "기록",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="document-text-outline" size={size} color={color} />
                    ),
                }}
            />

            {/* 설정 탭 */}
            <Tabs.Screen
                name="setting"
                options={{
                    title: "설정",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="settings-outline" size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
