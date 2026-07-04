"use client";

import { usePathname } from "next/navigation";
import { SaturdayPetMarketCartDrawer } from "./SaturdayPetMarketCartDrawer";
import { SaturdayPetMarketLayoutFooter } from "./SaturdayPetMarketLayoutFooter";
import { SaturdayPetMarketSpecialistChat } from "./SaturdayPetMarketSpecialistChat";
import { useSpmAuth } from "./SaturdayPetMarketAuthContext";
import { isSpmMinimalChromePath } from "./saturdayPetMarketConfig";

export function SaturdayPetMarketChrome() {
  const pathname = usePathname();
  const { isLoggedIn } = useSpmAuth();
  if (isSpmMinimalChromePath(pathname)) return null;
  return (
    <>
      <SaturdayPetMarketLayoutFooter />
      {isLoggedIn ? <SaturdayPetMarketCartDrawer /> : null}
      <SaturdayPetMarketSpecialistChat />
    </>
  );
}
