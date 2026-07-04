"use client";

import { useEffect } from "react";

export function useSdReveal(selector = ".sd-reveal") {
  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const nodes = document.querySelectorAll(selector);
    if (prefersReduced) {
      nodes.forEach((el) => el.classList.add("sd-reveal-visible"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("sd-reveal-visible");
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

export function useSdNavScroll() {
  useEffect(() => {
    const nav = document.querySelector<HTMLElement>(".sd-nav-pill");
    if (!nav) return;
    const onScroll = () => {
      nav.classList.toggle("sd-nav-scrolled", window.scrollY > 50);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
}

export function useSdHeroParallax(selector = ".sd-hero-parallax") {
  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;
    const hero = document.querySelector<HTMLElement>(selector);
    if (!hero) return;
    const onScroll = () => {
      hero.style.transform = `translateY(${window.scrollY * 0.1}px)`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [selector]);
}

export function useSdSkillBadgeFill() {
  useEffect(() => {
    const badges = document.querySelectorAll<HTMLElement>(".sd-skill-badge");
    const handlers: { el: HTMLElement; enter: () => void; leave: () => void }[] = [];
    badges.forEach((badge) => {
      const icon = badge.querySelector<HTMLElement>(".material-symbols-outlined");
      if (!icon) return;
      const enter = () => {
        icon.style.fontVariationSettings = "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24";
      };
      const leave = () => {
        icon.style.fontVariationSettings = "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24";
      };
      badge.addEventListener("mouseenter", enter);
      badge.addEventListener("mouseleave", leave);
      handlers.push({ el: badge, enter, leave });
    });
    return () => {
      handlers.forEach(({ el, enter, leave }) => {
        el.removeEventListener("mouseenter", enter);
        el.removeEventListener("mouseleave", leave);
      });
    };
  }, []);
}
