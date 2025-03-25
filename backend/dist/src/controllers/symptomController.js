"use strict";
// src/controllers/symptomComtroller.ts
// symptom(증상) 기록 API 처리
Object.defineProperty(exports, "__esModule", { value: true });
exports.addSymptom = void 0;
const symptomModel_1 = require("../models/symptomModel");
const addSymptom = (req, res) => {
    // 입력 데이터 확인
    /*
    const { description, severity } = req.body;

    if(!description || !severity){
        return res.status(400).json({ message:'증상 설명과 심각도를 모두 입력해주세요.'})
    }
    */
    const { description } = req.body;
    console.log('받은 요청 본문:', req.body); // 요청 본문 확인
    if (!description) {
        res.status(400).json({ message: '증상을 입력해주세요.' });
        console.log('증상을 입력해주세요.');
        return;
    }
    const newSymptom = (0, symptomModel_1.recordSymptom)(description);
    res.status(201).json({
        message: '증상 입력이 완료되었습니다.',
        symptom: newSymptom
    });
    console.log('사용자 등록이 완료되었습니다.', newSymptom);
};
exports.addSymptom = addSymptom;
