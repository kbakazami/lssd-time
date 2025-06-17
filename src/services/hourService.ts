import type { Heure } from "../domain/models/Heure";

export const calculateTotalHeures = (heures: Heure[], agentId: string): number => {
    return heures
        .filter((h) => h.agent_id === agentId)
        .reduce((sum, h) => sum + h.heures, 0);
};

export const calculatePrimes = (totalHeures: number): number => {
    return Math.floor(totalHeures / 10);
};
