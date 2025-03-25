// src/controllers/symptomComtroller.ts
// symptom(증상) 기록 API 처리

import { Request, Response } from 'express';
import { recordSymptom } from '../models/symptomModel';

export const addSymptom = (req: Request, res: Response) => {


    // 입력 데이터 확인
    /*
    const { description, severity } = req.body;

    if(!description || !severity){
        return res.status(400).json({ message:'증상 설명과 심각도를 모두 입력해주세요.'})
    }
    */
    const { description } = req.body;
    if (!description) {
        res.status(400).json({ message: '증상 설명을 입력해주세요.' })
        return;
    }

    const newSymptom = recordSymptom(description);

    res.status(201).json({
        message: 'Symptom recorded successfully',
        symptom: newSymptom
    });
}