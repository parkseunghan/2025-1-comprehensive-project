"use strict";
// src/controllers/symptomComtroller.ts
// symptom(증상 기록), getUserSymptoms(증상 기록 조회) API 처리
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserSymptoms = exports.addSymptom = void 0;
const symptomModel_1 = require("../models/symptomModel");
// 더미 데이터로 증상 기록을 반환
const symptoms = [
    { userId: 1, symptom: 'fever', date: '2025-03-01' },
    { userId: 1, symptom: 'headache', date: '2025-03-02' },
    { userId: 2, symptom: 'cough', date: '2025-03-01' }
];
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
// 사용자의 증상 기록 조회
const getUserSymptoms = (req, res) => {
    const { userId } = req.params;
    const userSymptoms = symptoms.filter(s => s.userId === parseInt(userId));
    if (userSymptoms.length === 0) {
        return res.status(404).json({ message: 'No symptoms found for this user' });
    }
    return res.status(200).json(userSymptoms);
};
exports.getUserSymptoms = getUserSymptoms;
