// 📄 src/services/medication.service.ts
// 이 파일은 '약물(Medication)' 관련 데이터 처리 및 사용자와의 관계를 다루는 서비스 계층입니다.

import prisma from "../config/prisma.service";
import publicAPI from "../utils/public-api";

/** 전체 약물 목록 조회 */
export const findAll = async () => {
  return await prisma.medication.findMany();
};

/** 특정 ID의 약물 검색 */
export const findById = async (id: string) => {
  return await prisma.medication.findUnique({ where: { id } });
};

/** userId를 기반으로 사용자의 약물 목록 조회 */
export const findByUserId = async (userId: string) => {
  const userMedications = await prisma.userMedication.findMany({
    where: { userId },
    include: {
      medication: true,
    },
  });

  return userMedications.map((um: { medication: any }) => um.medication);
};

/** 사용자에게 약물 추가 */
export const addMedicationToUser = async (userId: string, medicationId: string) => {
  const exists = await prisma.userMedication.findUnique({
    where: {
      userId_medicationId: { userId, medicationId },
    },
  });

  if (exists) return { message: "Already added" };

  return await prisma.userMedication.create({
    data: {
      userId,
      medicationId,
    },
  });
};

/** 사용자의 약물 삭제 */
export const removeMedicationFromUser = async (userId: string, medicationId: string) => {
  try {
    return await prisma.userMedication.delete({
      where: {
        userId_medicationId: { userId, medicationId },
      },
    });
  } catch (err) {
    return { message: "Not found" };
  }
};

/** 공공 API에서 약물 상세정보 가져와 DB에 저장 */
export const fetchAndSaveMedicationDetail = async (itemSeq: string) => {
  try {
    const response = await publicAPI.get("/getDrbEasyDrugList", {
      params: {
        serviceKey: process.env.MEDICATION_API_KEY,
        itemSeq,
        returnType: "json",
      },
    });

    // ✅ 디버깅 로그
    console.log("▶️ 요청 itemSeq:", itemSeq);
    console.log("🔐 인증키 앞 8자리:", process.env.MEDICATION_API_KEY?.slice(0, 8));
    console.log("📡 요청 URL:", response.request?.path);
    console.log("📦 응답 결과:", JSON.stringify(response.data, null, 2));

    const item = response.data.body?.items?.[0];
    if (!item) {
      console.warn("❌ 공공 API 응답에 항목이 없습니다.");
      return null;
    }

    const medication = await prisma.medication.upsert({
      where: { itemSeq },
      update: {
        name: item.itemName,
        entpName: item.entpName,
        efcy: item.efcyQesitm,
        useMethod: item.useMethodQesitm,
        atpnWarn: item.atpnWarnQesitm,
        atpn: item.atpnQesitm,
        intrc: item.intrcQesitm,
        se: item.seQesitm,
        depositMethod: item.depositMethodQesitm,
        openDate: item.openDe,
        updateDate: item.updateDe,
        imageUrl: item.itemImage,
      },
      create: {
        itemSeq,
        name: item.itemName,
        entpName: item.entpName,
        efcy: item.efcyQesitm,
        useMethod: item.useMethodQesitm,
        atpnWarn: item.atpnWarnQesitm,
        atpn: item.atpnQesitm,
        intrc: item.intrcQesitm,
        se: item.seQesitm,
        depositMethod: item.depositMethodQesitm,
        openDate: item.openDe,
        updateDate: item.updateDe,
        imageUrl: item.itemImage,
      },
    });

    return medication;
  } catch (error) {
    console.error("💥 공공 API 요청 실패:", (error as any).response?.data || (error as any).message);
  }
  
};
