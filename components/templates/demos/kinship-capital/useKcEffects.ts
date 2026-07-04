"use client";

import { useEffect } from "react";

export function useKcReveal(selector = ".kc-reveal") {
  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const nodes = document.querySelectorAll(selector);
    if (prefersReduced) {
      nodes.forEach((el) => el.classList.add("kc-reveal-visible"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("kc-reveal-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 },
    );
    nodes.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [selector]);
}

export function useKcFormLabelFocus(formId?: string) {
  useEffect(() => {
    const root = formId ? document.getElementById(formId) : document;
    if (!root) return;
    const inputs = root.querySelectorAll("input, select, textarea");
    const handlers: { el: Element; focus: () => void; blur: () => void }[] = [];
    inputs.forEach((input) => {
      const label = input.previousElementSibling;
      if (!label || label.tagName !== "LABEL") return;
      const focus = () => label.classList.add("text-[var(--kc-primary)]");
      const blur = () => label.classList.remove("text-[var(--kc-primary)]");
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

export function useKcFaqAccordion(selector = ".kc-faq-accordion") {
  useEffect(() => {
    const details = document.querySelectorAll<HTMLDetailsElement>(selector);
    const onToggle = (target: HTMLDetailsElement) => {
      if (!target.open) return;
      details.forEach((detail) => {
        if (detail !== target) detail.removeAttribute("open");
      });
    };
    details.forEach((detail) => {
      detail.addEventListener("toggle", () => onToggle(detail));
    });
    return () => {
      details.forEach((detail) => {
        detail.replaceWith(detail.cloneNode(true));
      });
    };
  }, [selector]);
}

export function useKcAnchorScroll(offset = 100) {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || href === "#") return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [offset]);
}

export function useKcSectionNav(
  sectionSelector: string,
  navLinkSelector: string,
  activeClasses: string,
  inactiveClasses: string,
  offset = 160,
) {
  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>(sectionSelector);
    const navLinks = document.querySelectorAll<HTMLAnchorElement>(navLinkSelector);
    if (!sections.length || !navLinks.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.getAttribute("id");
          navLinks.forEach((link) => {
            link.className = link.className
              .replace(activeClasses, "")
              .replace(inactiveClasses, "")
              .trim();
            if (link.getAttribute("href") === `#${id}`) {
              link.className = `${link.className} ${activeClasses}`.trim();
            } else {
              link.className = `${link.className} ${inactiveClasses}`.trim();
            }
          });
        });
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [sectionSelector, navLinkSelector, activeClasses, inactiveClasses, offset]);
}

export function useKcNavShadow() {
  useEffect(() => {
    const nav = document.querySelector<HTMLElement>(".kc-nav");
    if (!nav) return;
    const onScroll = () => {
      nav.classList.toggle("shadow-md", window.scrollY > 50);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
}
