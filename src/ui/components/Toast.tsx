import { useEffect, useState } from "react";

export default function Toast({ message, type = "success" }: { message: string; type?: "success" | "error" }) {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setVisible(false), 3000);
        return () => clearTimeout(timer);
    }, []);

    if (!visible) return null;

    return (
        <div className="toast toast-bottom toast-end z-50">
            <div className={`alert alert-${type}`}>
                <span>{message}</span>
            </div>
        </div>
    );
}
