import AdminWeekTable from "../components/AdminWeekTable";
import { useOutletContext } from "react-router-dom";
import type { AdminDashboardContext } from "./AdminDashboard";

export default function AdminTablePage() {
    const { agents, heures, startDate, reload } = useOutletContext<AdminDashboardContext>();
    return (
        <AdminWeekTable
            startDate={startDate}
            agents={agents}
            heures={heures}
            onReload={() => reload(startDate)}
        />
    );
}
