import { useEffect, useState } from "react";
import {getSaturday} from "../../shared/weekUtils.ts";

type Props = {
    onChange: (startDate: Date) => void;
};


export function WeekSelector({ onChange }: Props) {
    const [startDate, setStartDate] = useState(getSaturday(new Date()));

    useEffect(() => {
        onChange(startDate);
    }, [startDate, onChange]);

    const format = (d: Date) => d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });

    return (
        <div className="flex items-center justify-center gap-4 mb-4">
            <button
                className="btn btn-sm"
                onClick={() => setStartDate((prev) => new Date(prev.getTime() - 7 * 86400000))}
            >
                ← Semaine précédente
            </button>
            <span className="font-semibold">
        {format(startDate)} → {format(new Date(startDate.getTime() + 6 * 86400000))}
      </span>
            <button
                className="btn btn-sm"
                onClick={() => setStartDate((prev) => new Date(prev.getTime() + 7 * 86400000))}
            >
                Semaine suivante →
            </button>
        </div>
    );
}
