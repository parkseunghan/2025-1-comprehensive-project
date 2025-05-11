// 📄 src/types/disease.types.ts
// 질병(Disease) 관련 타입 정의

export type Disease = {
  sickCode: string;       // Prisma의 @id 필드명 그대로 사용
  name: string;
  englishName?: string;
  description?: string;
  tips?: string;
};