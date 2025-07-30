export function computePrime(totalHeures: number): number {
    if (totalHeures >= 20) return 3000;
    if (totalHeures >= 10) return 1000;
    return 0;
}
