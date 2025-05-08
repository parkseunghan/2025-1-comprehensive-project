// 📄 src/store/symptom.store.ts

import { create } from "zustand";

interface SymptomStore {
  selected: string[];                 // 선택된 증상 이름 리스트
  toggle: (symptom: string) => void; // 증상 선택/해제
  reset: () => void;                 // 전체 초기화
}

export const useSymptomStore = create<SymptomStore>((set) => ({
  selected: [],
  toggle: (symptom) =>
    set((state) => ({
      selected: state.selected.includes(symptom)
        ? state.selected.filter((s) => s !== symptom)
        : [...state.selected, symptom],
    })),
  reset: () => set({ selected: [] }),
}));
