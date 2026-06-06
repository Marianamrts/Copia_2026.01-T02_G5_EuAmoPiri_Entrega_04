import type { Request, Response } from "express";
import * as placeModel from "../model/placeModel.ts";
import {formatPlace, formatPlaceList} from "../views/placeView.ts";

export async function createPlace(req: Request, res: Response) {
    const { name, category, description } = req.body;

    try {
        const newPlace = await placeModel.createPlace({ name, category, description });
        res.status(201).json(formatPlace(newPlace));
    } catch (error) {
        res.status(500).json({ error: 'Erro ao cadastrar o local' });
    }
}

export async function listPlaces(req: Request, res: Response) {
    try {
        const places = await placeModel.findAllPlaces();
        res.status(200).json(formatPlaceList(places));
    } catch {
        res.status(500).json({ error: 'Erro ao buscar os locais' });
    }
}
