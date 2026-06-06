import type { PlaceCreateInput } from "../../generated/prisma/models/Place.ts";
import prisma from "../config/prisma.ts";

export async function createPlace(data: PlaceCreateInput){
    return await prisma.place.create({ data });
}

export async function findAllPlaces() {
    return await prisma.place.findMany();
}