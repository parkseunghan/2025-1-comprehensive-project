// 🔹 seed.ts
// Prisma를 통해 초기 더미 데이터를 삽입하는 스크립트입니다.

import prisma from "../src/config/prisma.service";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

async function main() {
    console.log("🌱 Seeding database...");

    // 1. 사용자 생성
    const user = await prisma.user.create({
        data: {
            id: "user-001",
            email: "test@example.com",
            password: "1234",
            name: "홍길동",
            gender: "남성",
            age: 30,
            height: 175.5,
            weight: 68.2,
            bmi: 20.2
        },
    });

    // 2. 질병 다수 등록
    await prisma.disease.createMany({
        data: [
            {
                id: "disease-001",
                name: "급성 기관지염",
                description: "기관지에 염증이 생겨 기침과 가래가 나타나는 질환입니다.",
                tips: "충분한 수분 섭취와 휴식을 취하고, 심한 경우 병원 방문이 필요합니다.",
            },
            {
                id: "disease-002",
                name: "폐렴",
                description: "폐에 염증이 생기는 감염성 질환입니다.",
                tips: "수분 섭취와 충분한 휴식을 취하고, 고열이 지속되면 병원을 방문하세요.",
            },
            {
                id: "disease-003",
                name: "위염",
                description: "위 점막에 염증이 생긴 상태입니다.",
                tips: "자극적인 음식은 피하고, 식사량을 조절하며 스트레스를 줄이세요.",
            },
            {
                id: "disease-004",
                name: "소화성 궤양",
                description: "위 또는 십이지장에 궤양이 생기는 질환입니다.",
                tips: "약물 치료가 필요하며, 금주와 금연이 중요합니다.",
            },
            {
                id: "disease-005",
                name: "급성 장염",
                description: "세균이나 바이러스 등에 의해 장에 염증이 생긴 상태입니다.",
                tips: "수분 보충이 중요하며, 설사가 심할 경우 병원을 방문하세요.",
            },
            {
                id: "disease-006",
                name: "간염",
                description: "간에 염증이 생기는 질환입니다.",
                tips: "안정이 필요하며, 정기적인 간 기능 검사가 중요합니다.",
            },
            {
                id: "disease-007",
                name: "과민성 대장증후군",
                description: "스트레스나 식습관 등으로 배변 문제가 반복되는 기능성 질환입니다.",
                tips: "섬유질을 충분히 섭취하고 스트레스를 관리하세요.",
            },
            {
                id: "disease-008",
                name: "요로감염",
                description: "요도나 방광 등에 세균이 감염되는 질환입니다.",
                tips: "수분 섭취를 늘리고, 항생제 복용이 필요할 수 있습니다.",
            },
            {
                id: "disease-009",
                name: "위식도역류질환(GERD)",
                description: "위산이 식도로 역류해 염증이 생기는 질환입니다.",
                tips: "야식과 과식을 피하고, 식후 바로 눕지 마세요.",
            },
            {
                id: "disease-010",
                name: "빈혈",
                description: "혈액 내 적혈구나 헤모글로빈 수치가 부족한 상태입니다.",
                tips: "철분이 풍부한 음식을 섭취하고 필요시 보충제를 복용하세요.",
            },
            {
                id: "disease-011",
                name: "췌장염",
                description: "췌장에 염증이 생기는 질환입니다.",
                tips: "음주를 피하고, 지방 섭취를 줄이는 것이 도움이 됩니다.",
            },
            {
                id: "disease-012",
                name: "협심증",
                description: "심장으로 가는 혈류가 줄어들어 가슴 통증이 생기는 질환입니다.",
                tips: "금연, 운동, 약물 치료로 관리하며 스트레스를 피하세요.",
            },
            {
                id: "disease-013",
                name: "심부전",
                description: "심장의 펌프 기능이 저하되어 전신에 혈액 공급이 부족한 상태입니다.",
                tips: "염분 제한, 이뇨제 복용, 체중 조절이 중요합니다.",
            },
            {
                id: "disease-014",
                name: "천식",
                description: "기도가 좁아지며 호흡이 힘들어지는 만성 질환입니다.",
                tips: "흡입제 사용, 감기 예방, 정기검진이 중요합니다.",
            },
            {
                id: "disease-015",
                name: "만성 폐쇄성 폐질환(COPD)",
                description: "호흡이 점차적으로 나빠지는 만성 폐 질환입니다.",
                tips: "금연, 폐활량 강화 운동, 규칙적인 약물 복용이 필요합니다.",
            },
            {
                id: "disease-016",
                name: "급성 비인두염 (코감기)",
                description: "감기에 의해 코와 인두에 염증이 생기는 상태입니다.",
                tips: "휴식과 수분 섭취, 온습도 유지가 도움이 됩니다.",
            },
            {
                id: "disease-017",
                name: "급성 인두염 (목감기)",
                description: "인두에 염증이 생겨 목 통증과 발열이 나타납니다.",
                tips: "따뜻한 물 마시기, 휴식, 필요시 진통제 복용이 도움이 됩니다.",
            },
            {
                id: "disease-018",
                name: "상기도 감염 (전신감기)",
                description: "코, 인두, 기관 등 상기도에 생기는 감염입니다.",
                tips: "충분한 수면, 수분 보충, 감기약 복용이 필요할 수 있습니다.",
            },
        ],
        skipDuplicates: true,
    });


    await prisma.medication.createMany({
        data: [
            {
                id: "med-001",
                name: "아스피린",
                itemSeq: "200003092",
                entpName: "한미약품(주)",
                efcy: "심근경색, 뇌경색, 협심증 등에서 혈전 생성 억제",
                useMethod: "1일 1회, 식전에 복용",
                atpnWarn: "정기적 음주자는 복용 전 의사와 상의",
                atpn: "소화성 궤양 환자, 임신 3기 여성은 금지",
                intrc: "이부프로펜, 나프록센 등과 병용 시 출혈 증가",
                se: "위장 출혈, 알레르기 반응 등",
                depositMethod: "습기를 피해 실온 보관, 어린이 손이 닿지 않도록",
                openDate: "20200901",
                updateDate: "20200905",
                imageUrl: "https://nedrug.mfds.go.kr/pbp/cmn/itemImageDownload/147426411393800107",
            },
            {
                id: "med-002",
                name: "타이레놀",
                itemSeq: "200004321",
                entpName: "존슨앤드존슨",
                efcy: "해열, 진통, 감기 증상 완화",
                useMethod: "성인 1회 1~2정, 1일 3~4회 복용",
                atpnWarn: "간 질환자 주의, 과용 금지",
                atpn: "다른 해열진통제와 병용 금지",
                intrc: "술과 병용 시 간손상 위험 증가",
                se: "간손상, 피부발진, 구역감",
                depositMethod: "건조하고 서늘한 곳에 보관",
                openDate: "20200810",
                updateDate: "20210101",
                imageUrl: "https://example.com/images/tylenol.png",
            },
            {
                id: "med-003",
                name: "이부프로펜",
                itemSeq: "200005678",
                entpName: "삼성제약",
                efcy: "소염, 진통, 해열",
                useMethod: "성인 1회 200~400mg씩, 1일 3~4회",
                atpnWarn: "위장 장애 주의, 공복 복용 금지",
                atpn: "소화성 궤양, 천식 환자 금지",
                intrc: "항응고제와 병용 시 출혈 위험 증가",
                se: "위통, 구역, 어지러움",
                depositMethod: "실온 보관, 습기 주의",
                openDate: "20200115",
                updateDate: "20210110",
                imageUrl: "https://example.com/images/ibuprofen.png",
            },
        ],
        skipDuplicates: true,
    });


    // 3. 사용자-지병 연결
    await prisma.userDisease.createMany({
        data: [
            { id: "user-disease-001", userId: user.id, diseaseId: "disease-001" },
            { id: "user-disease-002", userId: user.id, diseaseId: "disease-005" },
            { id: "user-disease-003", userId: user.id, diseaseId: "disease-009" },
        ],
        skipDuplicates: true,
    });

    // 3-1. 사용자-약물 연결
    await prisma.userMedication.createMany({
        data: [
            { id: "user-med-001", userId: user.id, medicationId: "med-001" },
            { id: "user-med-002", userId: user.id, medicationId: "med-002" },
        ],
        skipDuplicates: true,
    });

    // 4. 증상 등록
    await prisma.symptom.createMany({
        data: [
            { id: "symptom-001", name: "두통" },
            { id: "symptom-002", name: "기침" },
            { id: "symptom-003", name: "발열" },
        ],
        skipDuplicates: true,
    });

    // 5. 증상 기록 생성
    const record = await prisma.symptomRecord.create({
        data: {
            id: "record-001",
            userId: user.id,
            createdAt: new Date("2025-03-30T10:00:00Z"),
        },
    });

    // 6. 증상 기록 ↔ 증상 연결
    await prisma.symptomOnRecord.createMany({
        data: [
            { id: "sor-001", recordId: record.id, symptomId: "symptom-001", timeOfDay: "morning" }, // 두통
            { id: "sor-002", recordId: record.id, symptomId: "symptom-002", timeOfDay: "night" },   // 기침
            { id: "sor-003", recordId: record.id, symptomId: "symptom-003", timeOfDay: null },      // 발열
        ],
        skipDuplicates: true,
    });


    // 7. 예측 생성
    // 🔹 7. 예측 생성 (업데이트된 구조)
    await prisma.prediction.create({
        data: {
            id: "prediction-001",
            recordId: record.id,

            // coarse/fine 예측 관련
            coarseLabel: "감기",
            riskScore: 3.2,
            riskLevel: "보통",

            // 상위 예측 질병
            top1: "급성 비인두염",
            top1Prob: 0.6212,
            top2: "급성 인두염",
            top2Prob: 0.2211,
            top3: "상기도 감염",
            top3Prob: 0.1034,

            // 가이드 및 시간
            guideline: "전문가 상담을 권장합니다.",
            elapsedSec: 1.47,

            createdAt: new Date("2025-03-30T10:05:00Z"),
        },
    });


    console.log("✅ Seed completed.");
}

main()
    .catch((err) => {
        console.error("❌ Seed error:", err);
        process.exit(1);
    })
    .finally(() => {
        prisma.$disconnect();
    });
