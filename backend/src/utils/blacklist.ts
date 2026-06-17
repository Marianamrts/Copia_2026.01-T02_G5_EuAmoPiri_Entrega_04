const BLACKLIST = [
    "idiota",
    "burro",
    "merda",
    "porra",
    "caralho",
    "fdp",
    "otario",
    "otario",
    "imbecil",
    "estupido",
    "babaca",
    "lixo",
];

function normalize(text: string): string {
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

export function containsBlacklistedWord(text: string): boolean {
    const normalized = normalize(text);
    return BLACKLIST.some((word) => {
        const pattern = new RegExp(`\\b${word}\\b`, "i");
        return pattern.test(normalized);
    });
}

export function getBlacklistWords(): readonly string[] {
    return BLACKLIST;
}
