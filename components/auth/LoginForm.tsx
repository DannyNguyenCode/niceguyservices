"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginForm({ defaultEmail = "" }: { defaultEmail?: string }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [email, setEmail] = useState(defaultEmail);
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [pending, setPending] = useState(false);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setPending(true);
        setError(null);

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            const data = (await response.json()) as { success?: boolean; error?: string };

            if (!response.ok || !data.success) {
                setError(data.error ?? "Unable to sign in.");
                return;
            }

            const redirectTo = searchParams.get("redirect") || "/dashboard";
            router.push(redirectTo);
            router.refresh();
        } catch {
            setError("Unable to sign in right now.");
        } finally {
            setPending(false);
        }
    }

    return (
        <form className="grid grid-cols-1 gap-4" onSubmit={handleSubmit}>
            <div>
                <label className="mb-2 block text-sm font-medium" htmlFor="login-email">
                    Email
                </label>
                <input
                    id="login-email"
                    type="email"
                    autoComplete="email"
                    className="input input-bordered w-full bg-base-100"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                />
            </div>
            <div>
                <label className="mb-2 block text-sm font-medium" htmlFor="login-password">
                    Password
                </label>
                <input
                    id="login-password"
                    type="password"
                    autoComplete="current-password"
                    className="input input-bordered w-full bg-base-100"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                />
            </div>
            {error ? <p className="text-sm text-error">{error}</p> : null}
            <button type="submit" className="btn btn-primary" disabled={pending}>
                {pending ? "Signing in…" : "Sign in"}
            </button>
        </form>
    );
}
