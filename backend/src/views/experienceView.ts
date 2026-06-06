import type { Experiences } from "../../generated/prisma/client.ts";

//formata o formato da resposta JSON para utilizar no frontend

export function formatExperience(experience: Experiences) {
    return {
        id: experience.id,
        userName: experience.userName,
        rating: experience.rating,
        placeId: experience.placeId,
        createdAt: experience.createdAt,
    };
}

export function formatExperienceList(experiences: Experiences[]) {
    return experiences.map(formatExperience);
}