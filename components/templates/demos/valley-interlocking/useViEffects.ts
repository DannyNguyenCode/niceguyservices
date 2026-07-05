"use client";

import { useEffect, type RefObject } from "react";

export function useViFaqReveal(selector = ".vi-faq-item") {
  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const nodes = document.querySelectorAll(selector);
    if (prefersReduced) {
      nodes.forEach((el: any) => el.classList.add("vi-reveal-visible"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry: any) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("vi-reveal-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -5% 0px" },
    );
    nodes.forEach((el: any) => observer.observe(el));
    return () => observer.disconnect();
  }, [selector]);
}

export function useViReveal(selector = ".vi-reveal") {
  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const nodes = document.querySelectorAll(selector);
    if (prefersReduced) {
      nodes.forEach((el: any) => el.classList.add("vi-reveal-visible"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry: any) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("vi-reveal-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 },
    );
    nodes.forEach((el: any) => observer.observe(el));
    return () => observer.disconnect();
  }, [selector]);
}

export function useViFormLabelFocus(formId?: string) {
  useEffect(() => {
    const root = formId ? document.getElementById(formId) : document;
    if (!root) return;
    const inputs = root.querySelectorAll("input, textarea");
    const handlers: { el: Element; focus: () => void; blur: () => void }[] = [];
    inputs.forEach((input: any) => {
      const label = input.previousElementSibling;
      if (!label || label.tagName !== "LABEL") return;
      const focus = () => label.classList.add("text-[var(--vi-primary)]");
      const blur = () => label.classList.remove("text-[var(--vi-primary)]");
      input.addEventListener("focus", focus);
      input.addEventListener("blur", blur);
      handlers.push({ el: input, focus, blur });
    });
    return () => {
      handlers.forEach(({ el, focus, blur }) => {
        el.removeEventListener("focus", focus);
        el.removeEventListener("blur", blur);
      });
    };
  }, [formId]);
}

export function useViFaqAccordion(selector = ".vi-faq-accordion") {
  useEffect(() => {
    const details = document.querySelectorAll<HTMLDetailsElement>(selector);
    const onToggle = (target: HTMLDetailsElement) => {
      if (!target.open) return;
      details.forEach((detail: any) => {
        if (detail !== target) detail.removeAttribute("open");
      });
    };
    details.forEach((detail: any) => {
      detail.addEventListener("toggle", () => onToggle(detail));
    });
    return () => {
      details.forEach((detail: any) => {
        detail.replaceWith(detail.cloneNode(true));
      });
    };
  }, [selector]);
}

export function useViNavScroll() {
  useEffect(() => {
    const nav = document.querySelector<HTMLElement>(".vi-nav");
    if (!nav) return;
    const onScroll = () => {
      if (window.scrollY > 50) {
        nav.classList.add("vi-glass-nav");
      } else {
        nav.classList.remove("vi-glass-nav");
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
}

export function useViFocusTrap(containerRef: RefObject<HTMLElement | null>, active: boolean) {
  useEffect(() => {
    if (!active || !containerRef.current) return;
    const root = containerRef.current;
    const selector =
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const getFocusable = () => Array.from(root.querySelectorAll<HTMLElement>(selector));

    getFocusable()[0]?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const focusable = getFocusable();
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    root.addEventListener("keydown", onKeyDown);
    return () => root.removeEventListener("keydown", onKeyDown);
  }, [active, containerRef]);
}

export function useViSectionReveal(selector = "main section") {
  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const nodes = document.querySelectorAll(selector);
    if (prefersReduced) {
      nodes.forEach((el: any) => el.classList.add("vi-reveal-visible"));
      return;
    }
    nodes.forEach((el: any) => el.classList.add("vi-section-reveal"));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry: any) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("vi-reveal-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 },
    );
    nodes.forEach((el: any) => observer.observe(el));
    return () => observer.disconnect();
  }, [selector]);
}
