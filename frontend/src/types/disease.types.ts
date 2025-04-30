// 📄 src/types/disease.types.ts
// 질병(Disease) 관련 타입 정의

export interface Disease {
    id: string;              // UUID
    name: string;            // 질병 이름
    description?: string;    // 질병 설명 (optional)
    tips?: string;           // 관리 팁 (optional)
  }
  