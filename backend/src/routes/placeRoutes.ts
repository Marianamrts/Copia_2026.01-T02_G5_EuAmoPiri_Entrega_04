import { Router } from "express";
import * as placeController from "../controllers/placeController.ts";

const router = Router();

router.post('/', placeController.createPlace);
router.get('/', placeController.listPlaces);

export default router;