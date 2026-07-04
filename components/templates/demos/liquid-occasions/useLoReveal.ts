"use client";

import { useEffect } from "react";

export function useLoReveal(
  selector: string,
  visibleClass = "visible",
  options: IntersectionObserverInit = { threshold: 0.1 },
) {
  useEffect(() => {
    const nodes = document.querySelectorAll(selector);
    if (!nodes.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add(visibleClass);
        }
      });
    }, options);

    nodes.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [selector, visibleClass, options]);
}

export function useLoScrollPath(selector: string) {
  useEffect(() => {
    const path = document.querySelector<HTMLElement>(selector);
    if (!path) return;

    const onScroll = () => {
      const scrollPercent =
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      path.style.height = `${scrollPercent}%`;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [selector]);
}
