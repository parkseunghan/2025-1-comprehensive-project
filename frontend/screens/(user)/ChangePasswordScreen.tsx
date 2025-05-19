import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import BackButton from "@/common/BackButton";
import { changePassword } from "@/services/auth.api";

export default function ChangePasswordScreen() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleSubmit = async () => {
    if (!current || !next || !confirm) return Alert.alert("입력 누락", "모든 항목을 입력해주세요.");
    if (next !== confirm) return Alert.alert("비밀번호 불일치", "새 비밀번호가 일치하지 않습니다.");
    if (next.length < 4) return Alert.alert("비밀번호 길이", "비밀번호는 4자 이상이어야 합니다.");

    try {
      await changePassword({ currentPassword: current, newPassword: next });
      Alert.alert("완료", "비밀번호가 변경되었습니다.");
      router.replace("/(tabs)/setting");
    } catch (e: any) {
      Alert.alert("오류", e?.response?.data?.message || "비밀번호 변경 중 오류 발생");
    }
  };

  return (
    <View style={styles.container}>
      <BackButton fallbackRoute="/(tabs)/setting" forceReplace />
      <Text style={styles.title}>비밀번호 변경</Text>

      <TextInput
        placeholder="현재 비밀번호"
        secureTextEntry
        style={styles.input}
        value={current}
        onChangeText={setCurrent}
      />
      <TextInput
        placeholder="새 비밀번호"
        secureTextEntry
        style={styles.input}
        value={next}
        onChangeText={setNext}
      />
      <TextInput
        placeholder="새 비밀번호 확인"
        secureTextEntry
        style={styles.input}
        value={confirm}
        onChangeText={setConfirm}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>변경하기</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 24 },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 6,
    padding: 12,
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#2563EB",
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 16 },
});
