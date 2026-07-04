"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type SpmSpecialistChatContextValue = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
};

const SpmSpecialistChatContext = createContext<SpmSpecialistChatContextValue | null>(null);

export function SpmSpecialistChatProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((value) => !value), []);

  const value = useMemo(
    () => ({ isOpen, open, close, toggle }),
    [isOpen, open, close, toggle],
  );

  return (
    <SpmSpecialistChatContext.Provider value={value}>{children}</SpmSpecialistChatContext.Provider>
  );
}

export function useSpmSpecialistChat(): SpmSpecialistChatContextValue {
  const context = useContext(SpmSpecialistChatContext);
  if (!context) {
    throw new Error("useSpmSpecialistChat must be used within SpmSpecialistChatProvider");
  }
  return context;
}
