"use client";

import { SpmFab } from "./SaturdayPetMarketSidebar";
import { useSpmSpecialistChat } from "./SaturdayPetMarketSpecialistChatContext";

type SaturdayPetMarketSpecialistFabProps = {
  icon?: string;
  label?: string;
  className?: string;
  expanded?: boolean;
};

export function SaturdayPetMarketSpecialistFab({
  icon = "support_agent",
  label = "Ask a Specialist",
  className = "",
  expanded = false,
}: SaturdayPetMarketSpecialistFabProps) {
  const { open, isOpen } = useSpmSpecialistChat();

  if (isOpen) return null;

  return (
    <SpmFab
      icon={icon}
      label={label}
      className={className}
      expanded={expanded}
      onClick={open}
    />
  );
}
