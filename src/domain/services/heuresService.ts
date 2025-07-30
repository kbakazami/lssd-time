export function sumHeures(heures: number[]): number {
    return heures.reduce((sum, h) => sum + h, 0);
}
