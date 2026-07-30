export type AdministratorSessionPayload = {
    sub: string;
    email: string;
    name: string;
    role: string;
    exp: number;
};

function toBase64Url(value: string): string {
    return Buffer.from(value, "utf8")
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/g, "");
}

function fromBase64Url(value: string): string {
    const padded = value.replace(/-/g, "+").replace(/_/g, "/");
    const padLength = (4 - (padded.length % 4)) % 4;
    return Buffer.from(padded + "=".repeat(padLength), "base64").toString("utf8");
}

async function signPayload(payload: string, secret: string): Promise<string> {
    const key = await crypto.subtle.importKey(
        "raw",
        new TextEncoder().encode(secret),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"],
    );
    const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
    return toBase64Url(
        String.fromCharCode(...new Uint8Array(signature)),
    );
}

async function verifySignature(
    payload: string,
    signature: string,
    secret: string,
): Promise<boolean> {
    const key = await crypto.subtle.importKey(
        "raw",
        new TextEncoder().encode(secret),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["verify"],
    );
    const signatureBytes = Uint8Array.from(fromBase64Url(signature), (char) => char.charCodeAt(0));
    return crypto.subtle.verify(
        "HMAC",
        key,
        signatureBytes,
        new TextEncoder().encode(payload),
    );
}

export async function createAdministratorSessionToken(
    input: Omit<AdministratorSessionPayload, "exp"> & { maxAgeSeconds?: number },
    secret: string,
): Promise<string> {
    const payload: AdministratorSessionPayload = {
        ...input,
        exp: Date.now() + (input.maxAgeSeconds ?? 60 * 60 * 24 * 7) * 1000,
    };
    const encodedPayload = toBase64Url(JSON.stringify(payload));
    const signature = await signPayload(encodedPayload, secret);
    return `${encodedPayload}.${signature}`;
}

export async function verifyAdministratorSessionToken(
    token: string,
    secret: string,
): Promise<AdministratorSessionPayload | null> {
    const [encodedPayload, signature] = token.split(".");
    if (!encodedPayload || !signature) {
        return null;
    }

    const valid = await verifySignature(encodedPayload, signature, secret);
    if (!valid) {
        return null;
    }

    try {
        const payload = JSON.parse(fromBase64Url(encodedPayload)) as AdministratorSessionPayload;
        if (!payload.sub || !payload.email || !payload.exp) {
            return null;
        }
        if (Date.now() > payload.exp) {
            return null;
        }
        return payload;
    } catch {
        return null;
    }
}
