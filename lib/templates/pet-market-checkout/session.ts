export type PetMarketCheckoutSessionHelpers = {
  getOrCreateShopperSessionId: () => string;
  setCheckoutHoldId: (checkoutSessionId: string) => void;
  getCheckoutHoldId: () => string | null;
  clearCheckoutHoldId: () => void;
  buildCheckoutHref: (checkoutSessionId: string) => string;
};

export function createPetMarketCheckoutSessionHelpers(
  prefix: string,
  checkoutBasePath: string,
): PetMarketCheckoutSessionHelpers {
  const sessionKey = `${prefix}-shopper-session`;
  const holdKey = `${prefix}-checkout-hold`;

  function getOrCreateShopperSessionId(): string {
    if (typeof window === "undefined") return "";
    let sessionId = sessionStorage.getItem(sessionKey);
    if (!sessionId) {
      sessionId =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      sessionStorage.setItem(sessionKey, sessionId);
    }
    return sessionId;
  }

  function setCheckoutHoldId(checkoutSessionId: string) {
    if (typeof window === "undefined") return;
    sessionStorage.setItem(holdKey, checkoutSessionId);
  }

  function getCheckoutHoldId(): string | null {
    if (typeof window === "undefined") return null;
    return sessionStorage.getItem(holdKey);
  }

  function clearCheckoutHoldId() {
    if (typeof window === "undefined") return;
    sessionStorage.removeItem(holdKey);
  }

  function buildCheckoutHref(checkoutSessionId: string): string {
    return `${checkoutBasePath}?hold=${encodeURIComponent(checkoutSessionId)}`;
  }

  return {
    getOrCreateShopperSessionId,
    setCheckoutHoldId,
    getCheckoutHoldId,
    clearCheckoutHoldId,
    buildCheckoutHref,
  };
}
