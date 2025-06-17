export function getLundi(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - (day === 0 ? 6 : day - 1);
    return new Date(d.setDate(diff));
}

export function getWeekRangeFromDate(baseDate: Date): [string, string] {
    const lundi = getLundi(baseDate);
    const dimanche = new Date(lundi);
    dimanche.setDate(lundi.getDate() + 6);

    return [
        lundi.toISOString().split("T")[0],
        dimanche.toISOString().split("T")[0],
    ];
}

export function formatWeekRange(baseDate: Date): string {
    const lundi = getLundi(baseDate);
    const dimanche = new Date(lundi);
    dimanche.setDate(lundi.getDate() + 6);

    return `${lundi.toLocaleDateString("fr-FR")} → ${dimanche.toLocaleDateString("fr-FR")}`;
}
