export function getWeekRangeFromSaturday(start: Date): [string, string] {
    const d1 = new Date(start);
    const d2 = new Date(start);
    d2.setDate(d2.getDate() + 6);
    return [
        d1.toISOString().split("T")[0],
        d2.toISOString().split("T")[0],
    ];
}


export function formatWeekRangeFromSaturday(start: Date): string {
    const d1 = new Date(start);
    const d2 = new Date(start);
    d2.setDate(d2.getDate() + 6);
    return `${d1.toLocaleDateString("fr-FR")} → ${d2.toLocaleDateString("fr-FR")}`;
}

export function getSaturday(date: Date = new Date()): Date {
    const d = new Date(date);
    const day = d.getDay(); // 0 = dimanche, 6 = samedi

    // Calcule le nombre de jours à soustraire pour tomber sur samedi
    const diff = (day + 1) % 7; // samedi = 6 → 0 | dimanche = 0 → 1 | lundi = 1 → 2, etc.

    d.setDate(d.getDate() - diff);
    d.setHours(0, 0, 0, 0); // Nettoyage de l'heure

    return d;
}

export const toISODate = (d: Date): string => d.toISOString().split("T")[0];


