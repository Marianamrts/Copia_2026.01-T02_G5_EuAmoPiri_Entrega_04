import { Router } from "express";
import * as experienceController from "../controllers/experienceController.ts";

const router = Router();

router.post('/:placeId/experiences', experienceController.createExperience);
router.get('/:placeId/experiences', experienceController.listExperiences);

export default router;