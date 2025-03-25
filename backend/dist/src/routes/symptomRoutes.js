"use strict";
// src/routes/symptomRoutes.ts
// symptoms(증상) 엔드포인트 라우팅
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const symptomController_1 = require("../controllers/symptomController");
const router = express_1.default.Router();
router.post('/', symptomController_1.addSymptom);
exports.default = router;
