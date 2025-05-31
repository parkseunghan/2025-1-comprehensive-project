// 📄 components/RiskGuidelineButton.tsx

import { View, Text, TouchableOpacity, StyleSheet, Modal, Pressable } from "react-native";
import { useState } from "react";

interface Props {
  riskLevel: "응급" | "높음" | "보통" | "낮음";
}

const guidelineMap = {
  응급: "심각한 증상이 의심됩니다. 즉시 119 또는 응급실로 이동하세요.",
  높음: "증상이 심각할 수 있습니다. 오늘 중 가까운 병원에 방문해 진료를 받으세요.",
  보통: "상태를 주의 깊게 관찰하세요. 증상이 1~2일 이상 지속되거나 심해지면 병원을 방문하세요.",
  낮음: "증상이 가벼운 상태입니다. 수분 섭취, 휴식 등 생활 관리를 하며 경과를 지켜보세요.",
};

const RISK_ORDER: ("응급" | "높음" | "보통" | "낮음")[] = ["응급", "높음", "보통", "낮음"];

const RiskGuidelineButton = ({ riskLevel }: Props) => {
  const [visible, setVisible] = useState(false);

  return (
    <View style={{ position: "relative" }}>
      {/* ⓘ 버튼 */}
      <TouchableOpacity style={styles.iconButton} onPress={() => setVisible(true)}>
        <Text style={styles.iconText}>ⓘ</Text>
      </TouchableOpacity>

      {/* 가이드 팝업 */}
      <Modal transparent visible={visible} animationType="fade" onRequestClose={() => setVisible(false)}>
        <Pressable style={styles.overlay} onPress={() => setVisible(false)}>
          <View style={styles.popup}>
            <Text style={styles.title}>위험도별 행동 가이드</Text>
            {RISK_ORDER.map((level) => (
              <View key={level} style={styles.guideItem}>
              <Text
                style={[
                  styles.levelText,
                  riskLevel === level && { color: "#dc2626" }, // ✅ 현재 위험 등급이면 강조
                ]}
              >
                {level}
              </Text>
              <Text style={styles.guideText}>{guidelineMap[level]}</Text>
            </View>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

export default RiskGuidelineButton;

const styles = StyleSheet.create({
    iconButton: {
        backgroundColor: "rgba(255, 255, 255, 0.1)", 
        borderRadius: 20,
        paddingHorizontal: 8,
        paddingVertical: 4,
        alignSelf: "flex-start",
      },
      
  iconText: {
    fontSize: 16,
    color: "#ffff",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.25)",
    justifyContent: "center",
    alignItems: "center",
  },
  popup: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    maxWidth: "85%",
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 12,
    color: "#222",
  },
  guideItem: {
    marginBottom: 12,
    padding: 10,
    borderRadius: 8,
  },
  highlightedItem: {
    backgroundColor: "#fee2e2", // 연한 붉은 강조
  },
  levelText: {
    fontWeight: "700",
    fontSize: 15,
    marginBottom: 4,
    color: "#333",
  },
  guideText: {
    fontSize: 14,
    color: "#444",
    lineHeight: 20,
  },
});
