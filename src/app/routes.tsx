import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../ui/pages/Login";
import AdminDashboard from "../ui/pages/AdminDashboard";
import AgentDashboard from "../ui/pages/AgentDashboard";
import { ProtectedRoute } from "./routeGuards";

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />

                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute allowedRoles={["admin"]}>
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/agent"
                    element={
                        <ProtectedRoute allowedRoles={["agent"]}>
                            <AgentDashboard />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}
