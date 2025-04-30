// 📄 src/types/medication.types.ts
// 약물(Medication) 관련 타입 정의

export interface Medication {
    id: string;
    name: string;          // 제품명
    itemSeq: string;       // 품목기준코드
    entpName?: string;     // 업체명
    efcy?: string;         // 효능
    useMethod?: string;    // 사용법
    atpnWarn?: string;     // 주의사항(경고)
    atpn?: string;         // 일반 주의사항
    intrc?: string;        // 상호작용
    se?: string;           // 부작용
    depositMethod?: string;// 보관법
    openDate?: string;     // 공개일자
    updateDate?: string;   // 수정일자
    imageUrl?: string;     // 이미지 URL
  }
  