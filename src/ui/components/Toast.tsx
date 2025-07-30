import { useEffect, useState } from "react";
import * as React from "react";

interface ToastProps {
    message: string;
    type?: "success" | "error";
    duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, type = "success", duration = 3000 }) => {
    const [visible, setVisible] = useState(true);

    // Redémarre l'affichage si `message` change
    useEffect(() => {
        setVisible(true);
        const timer = setTimeout(() => setVisible(false), duration);
        return () => clearTimeout(timer);
    }, [message, duration]);

    if (!visible) return null;

    return (
        <div className="toast toast-bottom toast-end z-50">
            <div className={`alert alert-${type}`}>
                <span>{message}</span>
            </div>
        </div>
    );
}

export default Toast;