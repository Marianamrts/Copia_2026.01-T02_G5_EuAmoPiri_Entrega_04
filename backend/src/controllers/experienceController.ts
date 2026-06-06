import type { Request, Response } from "express";
import * as experienceModel from "../model/experienceModel.ts";
import { formatExperience, formatExperienceList } from "../views/experienceView.ts";

export async function createExperience(req: Request, res: Response) {
    const { placeId } = req.params;
    const { userName, rating } = req.body;

    try {
        const newExperience = await experienceModel.createExperience({ userName, rating: Number(rating), placeId: Number(placeId) });
        res.status(201).json(formatExperience(newExperience));
    } catch (error) {
        res.status(500).json({ error: 'Erro ao cadastrar a experiencia' });
    }
}

export async function listExperiences(req: Request, res: Response) {
    const { placeId } = req.params;
    try {
        const experiences = await experienceModel.findAllExperiencesByPlaceId(Number(placeId));
        res.status(200).json(formatExperienceList(experiences));
    } catch {
        res.status(500).json({ error: 'Erro ao buscar as experiencias' });
    }
}
