"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { VI_BASE } from "./valleyInterlockingConfig";
import { getViHeroPreloadUrl, prefetchViHeroImage } from "./valleyInterlockingHeroPreload";

const ValleyInterlockingLoadingScreen = dynamic(
  () =>
    import("./ValleyInterlockingLoadingScreen").then((module) => module.ValleyInterlockingLoadingScreen),
  { ssr: false },
);

const LOADER_SHOW_DELAY_MS = 3000;
const LOADER_MAX_MS = 10000;
const HERO_DOM_WAIT_MS = 2500;
const MAIN_CONTENT_ID = "vi-main-content";

type ViPageLoadingContextValue = {
  show: () => void;
  hide: () => void;
};

const ViPageLoadingContext = createContext<ViPageLoadingContextValue | null>(null);

function isViInternalHref(href: string, origin: string) {
  if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
    return false;
  }
  try {
    const url = new URL(href, origin);
    return url.origin === origin && url.pathname.startsWith(VI_BASE);
  } catch {
    return false;
  }
}

async function waitForImageElements(imgs: HTMLImageElement[]): Promise<void> {
  const pending = imgs.filter((img) => !img.complete);
  if (!pending.length) return;
  await Promise.all(
    pending.map(
      (img) =>
        new Promise<void>((resolve) => {
          const done = () => resolve();
          img.addEventListener("load", done, { once: true });
          img.addEventListener("error", done, { once: true });
        }),
    ),
  );
  await Promise.all(
    imgs.map((img) => img.decode?.().catch(() => undefined) ?? Promise.resolve()),
  );
}

/** Waits for hero `<img>` nodes (retries while the route segment streams in). */
async function waitForHeroContent(mainEl: HTMLElement | null, signal: AbortSignal): Promise<void> {
  const deadline = Date.now() + HERO_DOM_WAIT_MS;

  while (Date.now() < deadline) {
    if (signal.aborted) throw new DOMException("Aborted", "AbortError");

    const hero = mainEl?.querySelector(".vi-hero-under-nav");
    const heroImgs = hero ? Array.from(hero.querySelectorAll("img")) : [];

    if (heroImgs.length) {
      await waitForImageElements(heroImgs);
      return;
    }

    // Resource articles and other routes without a full-bleed hero.
    const main = mainEl?.querySelector("main");
    const firstImg = main?.querySelector("img");
    if (main && firstImg instanceof HTMLImageElement) {
      await waitForImageElements([firstImg]);
      return;
    }

    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => resolve());
    });
  }
}

async function waitForPageReady(mainEl: HTMLElement | null, signal: AbortSignal) {
  const delay = (ms: number) =>
    new Promise<void>((resolve, reject) => {
      const timer = window.setTimeout(resolve, ms);
      signal.addEventListener(
        "abort",
        () => {
          window.clearTimeout(timer);
          reject(new DOMException("Aborted", "AbortError"));
        },
        { once: true },
      );
    });

  await Promise.race([waitForHeroContent(mainEl, signal), delay(LOADER_MAX_MS)]);
}

export function useViPageLoading() {
  const context = useContext(ViPageLoadingContext);
  if (!context) {
    throw new Error("useViPageLoading must be used within ViPageLoadingProvider");
  }
  return context;
}

export function ViPageLoadingProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [overlayVisible, setOverlayVisible] = useState(false);
  const pendingNavigationRef = useRef(false);
  const hideGenerationRef = useRef(0);
  const isLoadingRef = useRef(false);
  const showDelayTimerRef = useRef<number | null>(null);

  const clearShowDelayTimer = useCallback(() => {
    if (showDelayTimerRef.current !== null) {
      window.clearTimeout(showDelayTimerRef.current);
      showDelayTimerRef.current = null;
    }
  }, []);

  const scheduleOverlayIfStillLoading = useCallback(() => {
    clearShowDelayTimer();
    showDelayTimerRef.current = window.setTimeout(() => {
      if (isLoadingRef.current) {
        setOverlayVisible(true);
      }
    }, LOADER_SHOW_DELAY_MS);
  }, [clearShowDelayTimer]);

  const beginLoading = useCallback(() => {
    isLoadingRef.current = true;
    setOverlayVisible(false);
    scheduleOverlayIfStillLoading();
  }, [scheduleOverlayIfStillLoading]);

  const endLoading = useCallback(() => {
    isLoadingRef.current = false;
    pendingNavigationRef.current = false;
    clearShowDelayTimer();
    setOverlayVisible(false);
  }, [clearShowDelayTimer]);

  const show = useCallback(() => {
    pendingNavigationRef.current = true;
    beginLoading();
  }, [beginLoading]);

  const hide = useCallback(() => {
    endLoading();
  }, [endLoading]);

  useEffect(() => {
    document.body.classList.toggle("vi-loading-active", overlayVisible);
    return () => document.body.classList.remove("vi-loading-active");
  }, [overlayVisible]);

  useEffect(() => {
    prefetchViHeroImage(pathname);
  }, [pathname]);

  useEffect(() => {
    const root = document.querySelector(".vi-root");
    if (!root) return;

    const onPointerOver = (event: Event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest("a[href]");
      if (!(anchor instanceof HTMLAnchorElement) || !root.contains(anchor)) return;
      const href = anchor.getAttribute("href");
      if (!href || !isViInternalHref(href, window.location.origin)) return;
      prefetchViHeroImage(new URL(anchor.href).pathname);
    };

    const onClick = (event: Event) => {
      if (!(event instanceof MouseEvent)) return;
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target as Element;

      const anchor = target.closest("a[href]");
      if (anchor instanceof HTMLAnchorElement && root.contains(anchor)) {
        const href = anchor.getAttribute("href");
        if (href && isViInternalHref(href, window.location.origin)) {
          const targetPath = new URL(anchor.href).pathname.replace(/\/$/, "") || "/";
          const currentPath = window.location.pathname.replace(/\/$/, "") || "/";
          if (targetPath !== currentPath) {
            prefetchViHeroImage(targetPath);
            show();
          }
        }
        return;
      }

      const button = target.closest("button");
      if (button instanceof HTMLButtonElement && root.contains(button) && button.type === "submit") {
        const form = button.form ?? button.closest("form");
        if (form instanceof HTMLFormElement) {
          show();
        }
      }
    };

    const onSubmit = (event: Event) => {
      const form = event.target;
      if (form instanceof HTMLFormElement && root.contains(form)) {
        show();
      }
    };

    const onPopState = () => show();

    root.addEventListener("pointerover", onPointerOver, true);
    root.addEventListener("click", onClick, true);
    root.addEventListener("submit", onSubmit, true);
    window.addEventListener("popstate", onPopState);
    return () => {
      root.removeEventListener("pointerover", onPointerOver, true);
      root.removeEventListener("click", onClick, true);
      root.removeEventListener("submit", onSubmit, true);
      window.removeEventListener("popstate", onPopState);
    };
  }, [show]);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);

    const heroSrc = getViHeroPreloadUrl(pathname);
    if (heroSrc) prefetchViHeroImage(pathname);

    const generation = ++hideGenerationRef.current;
    const controller = new AbortController();
    const main = document.getElementById(MAIN_CONTENT_ID);

    // Start the 3s overlay timer on first load; on link navigation it already started on click.
    if (!pendingNavigationRef.current) {
      beginLoading();
    } else {
      isLoadingRef.current = true;
    }

    void waitForPageReady(main, controller.signal)
      .catch(() => undefined)
      .finally(() => {
        if (generation !== hideGenerationRef.current) return;
        window.scrollTo(0, 0);
        endLoading();
      });

    return () => {
      controller.abort();
    };
  }, [pathname, beginLoading, endLoading]);

  return (
    <ViPageLoadingContext.Provider value={{ show, hide }}>
      {children}
      {overlayVisible ? <ValleyInterlockingLoadingScreen visible /> : null}
    </ViPageLoadingContext.Provider>
  );
}
