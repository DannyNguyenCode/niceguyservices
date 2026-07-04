"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";
import {
  evergreenSectionIdFromHref,
  scrollToEvergreenSection,
} from "./evergreenScroll";

type EvergreenSectionLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children: ReactNode;
  onNavigate?: () => void;
};

export function EvergreenSectionLink({
  href,
  children,
  onNavigate,
  onClick,
  ...props
}: EvergreenSectionLinkProps) {
  const sectionId = evergreenSectionIdFromHref(href);

  return (
    <a
      href={href}
      {...props}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented || !sectionId) return;
        e.preventDefault();
        scrollToEvergreenSection(sectionId);
        onNavigate?.();
      }}
    >
      {children}
    </a>
  );
}
