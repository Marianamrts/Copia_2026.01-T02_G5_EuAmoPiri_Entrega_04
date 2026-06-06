import prisma from "../config/prisma.ts";
import type { ExperiencesUncheckedCreateInput } from "../../generated/prisma/models/Experiences.ts";


export async function createExperience(data: ExperiencesUncheckedCreateInput){
    return await prisma.experiences.create({ data });
}

export async function findAllExperiencesByPlaceId(placeId: number) {
    return await prisma.experiences.findMany({ where: { placeId } });
}
