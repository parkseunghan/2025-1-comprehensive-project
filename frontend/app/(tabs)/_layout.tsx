/**
 * _layout.tsx
 * 하단 탭 네비게이션을 구성하는 레이아웃 파일입니다.
 * 이 파일은 `/tabs/*` 하위의 모든 화면에서 공유됩니다.
 */

import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false, // 상단 헤더 숨김
        tabBarActiveTintColor: "#2563eb", // 활성 탭 색상 (Tailwind: blue-600)
        tabBarLabelStyle: { fontSize: 12 },
      }}
    >
      {/* 홈 탭 */}
      <Tabs.Screen
        name="home"
        options={{
          title: "홈",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
        }}
      />

      {/* 기록 탭 */}
      <Tabs.Screen
        name="history"
        options={{
          title: "기록",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="document-text-outline" color={color} size={size} />
          ),
        }}
      />

      {/* 설정 탭 */}
      <Tabs.Screen
        name="setting"
        options={{
          title: "설정",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
