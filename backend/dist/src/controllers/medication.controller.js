"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllMedications = void 0;
// 하드코딩된 약물 리스트
const medicationList = ["세비카", "타이레놀", "아모잘탄", "루센티스"];
const getAllMedications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const meds = yield medicationService.getAll();
    res.json(meds);
});
exports.getAllMedications = getAllMedications;
// export const getAllMedications = (req: Request, res: Response) => {
//   res.json(medicationList.map((name) => ({ name })));
// };
// 추후 e약은요 API와 연동하여 약물 정보 받아오기
