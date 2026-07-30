"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DashboardSignOutButton() {
    const router = useRouter();
    const [pending, setPending] = useState(false);

    async function handleSignOut() {
        setPending(true);
        try {
            await fetch("/api/auth/logout", { method: "POST" });
            router.push("/login");
            router.refresh();
        } finally {
            setPending(false);
        }
    }

    return (
        <button type="button" className="btn btn-outline" onClick={handleSignOut} disabled={pending}>
            {pending ? "Signing out…" : "Sign out"}
        </button>
    );
}
