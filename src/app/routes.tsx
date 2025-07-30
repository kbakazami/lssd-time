import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../ui/pages/Login";
import AdminDashboard from "../ui/pages/AdminDashboard";
import AdminTablePage from "../ui/pages/AdminTablePage";
import AdminProfilePage from "../ui/pages/AdminProfilePage";
import AgentDashboard from "../ui/pages/AgentDashboard";
import { ProtectedRoute } from "./routeGuards";

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />

                <Route
                    path="/admin/*"
                    element={
                        <ProtectedRoute allowedRoles={["admin"]}>
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<Navigate to="table" replace />} />
                    <Route path="table" element={<AdminTablePage />} />
                    <Route path="profile" element={<AdminProfilePage />} />
                </Route>

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
