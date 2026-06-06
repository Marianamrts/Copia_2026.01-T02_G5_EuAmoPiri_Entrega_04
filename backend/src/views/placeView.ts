import type { Place } from "../../generated/prisma/client.ts";

//formata o formato da resposta JSON para utilizar no frontend

export function formatPlace(place: Place) {
    return {
        id: place.id,
        name: place.name,
        category: place.category,
        description: place.description,
        createdAt: place.createdAt,
    };
}

export function formatPlaceList(places: Place[]) {
    return places.map(formatPlace);
}