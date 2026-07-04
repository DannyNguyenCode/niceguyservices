import type { PetMarketAuthUserDTO } from "@/lib/templates/db/pet-market";

export type PetMarketShopperIdentity = {
  isGuest: boolean;
  name: string | null;
  email: string | null;
  /** Short label for cart and summaries — guest or customer name. */
  displayName: string;
};

export function getPetMarketShopperIdentity(
  user: PetMarketAuthUserDTO | null | undefined,
): PetMarketShopperIdentity {
  if (user?.name) {
    return {
      isGuest: false,
      name: user.name,
      email: user.email ?? null,
      displayName: user.name,
    };
  }

  return {
    isGuest: true,
    name: null,
    email: null,
    displayName: "Guest",
  };
}
