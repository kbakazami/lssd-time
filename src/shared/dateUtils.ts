export function getLundi(date = new Date()): Date {
    const day = date.getDay();
    const diff = date.getDate() - (day === 0 ? 6 : day - 1);
    return new Date(date.setDate(diff));
}

export function getCurrentWeekRange(): [string, string] {
    const lundi = getLundi();
    const dimanche = new Date(lundi);
    dimanche.setDate(lundi.getDate() + 6);

    return [
        lundi.toISOString().split("T")[0],
        dimanche.toISOString().split("T")[0],
    ];
}

