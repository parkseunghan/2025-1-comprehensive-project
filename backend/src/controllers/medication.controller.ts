// 📄 controllers/medication.controller.ts
import { Request, Response } from "express";

// 하드코딩된 약물 리스트
const medicationList = ["세비카", "타이레놀", "아모잘탄", "루센티스"];

export const getAllMedications = async (req: Request, res: Response) => {
    const meds = await medicationService.getAll();
    res.json(meds);
  };

// export const getAllMedications = (req: Request, res: Response) => {
//   res.json(medicationList.map((name) => ({ name })));
// };



// 추후 e약은요 API와 연동하여 약물 정보 받아오기