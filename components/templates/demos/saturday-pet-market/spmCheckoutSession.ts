const SPM_SESSION_KEY = "spm-shopper-session";
const SPM_HOLD_KEY = "spm-checkout-hold";

export function getOrCreateSpmShopperSessionId(): string {
  if (typeof window === "undefined") return "";
  let sessionId = sessionStorage.getItem(SPM_SESSION_KEY);
  if (!sessionId) {
    sessionId =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `spm-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    sessionStorage.setItem(SPM_SESSION_KEY, sessionId);
  }
  return sessionId;
}

export function setSpmCheckoutHoldId(checkoutSessionId: string) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(SPM_HOLD_KEY, checkoutSessionId);
}

export function getSpmCheckoutHoldId(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(SPM_HOLD_KEY);
}

export function clearSpmCheckoutHoldId() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(SPM_HOLD_KEY);
}

export function buildSpmCheckoutHref(checkoutSessionId: string): string {
  return `/template/demo/saturday-pet-market/checkout?hold=${encodeURIComponent(checkoutSessionId)}`;
}
