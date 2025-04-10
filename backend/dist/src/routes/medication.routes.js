"use strict";
//🔹 medication.routes.ts
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const medication_controller_1 = require("../controllers/medication.controller");
const router = (0, express_1.Router)();
// [GET] /medications - 지병 검색/목록
router.get("/", medication_controller_1.getAllMedications);
exports.default = router;
