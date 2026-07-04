"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SPM_PATHS } from "./saturdayPetMarketConfig";
import {
  buildSpmShopHref,
  normalizeSpmShopFilters,
  parseSpmShopFilters,
  spmBuildActiveFilterChips,
  spmShopFiltersEqual,
  spmShopHasActiveFilters,
  type SpmAvailabilityId,
  type SpmPetGroupId,
  type SpmShopFilters,
} from "./spmShopFilters";

type SpmShopFiltersContextValue = {
  filters: SpmShopFilters;
  searchQuery: string;
  hasActiveFilters: boolean;
  activeChips: ReturnType<typeof spmBuildActiveFilterChips>;
  clearFilters: () => void;
  togglePetGroup: (id: SpmPetGroupId) => void;
  toggleCategory: (value: string) => void;
  toggleBrand: (brand: string) => void;
  setPriceMax: (value?: number) => void;
  toggleAvailability: (value: SpmAvailabilityId) => void;
  setRatingMin: (value?: 3 | 4) => void;
  setSaleOnly: (value: boolean) => void;
  setVetRecommended: (value: boolean) => void;
  mobileOpen: boolean;
  openMobileDrawer: () => void;
  closeMobileDrawer: () => void;
  draftFilters: SpmShopFilters;
  setDraftFilters: (next: SpmShopFilters) => void;
  applyDraftFilters: () => void;
  clearDraftFilters: () => void;
  draftHasChanges: boolean;
};

const SpmShopFiltersContext = createContext<SpmShopFiltersContextValue | null>(null);

export function SpmShopFiltersProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isShopRoute = useMemo(() => {
    const path = pathname.replace(/\/$/, "") || "/";
    return path === SPM_PATHS.shop;
  }, [pathname]);

  const filters = useMemo(() => parseSpmShopFilters(searchParams), [searchParams]);
  const searchQuery = searchParams.get("q")?.trim() ?? "";
  const hasActiveFilters = spmShopHasActiveFilters(filters);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [draftFilters, setDraftFilters] = useState<SpmShopFilters>(filters);

  const navigate = useCallback(
    (next: SpmShopFilters) => {
      if (!isShopRoute) return;
      router.push(
        buildSpmShopHref({
          ...next,
          q: searchQuery || undefined,
        }),
      );
    },
    [isShopRoute, router, searchQuery],
  );

  const applyFilters = useCallback(
    (next: SpmShopFilters) => {
      navigate(normalizeSpmShopFilters(next));
    },
    [navigate],
  );

  const clearFilters = useCallback(() => {
    applyFilters(normalizeSpmShopFilters({}));
  }, [applyFilters]);

  const togglePetGroup = useCallback(
    (petGroup: SpmPetGroupId) => {
      applyFilters({
        ...filters,
        petGroup: filters.petGroup === petGroup ? undefined : petGroup,
      });
    },
    [applyFilters, filters],
  );

  const toggleCategory = useCallback(
    (category: string) => {
      const exists = filters.categories.some(
        (item) => item.toLowerCase() === category.toLowerCase(),
      );
      applyFilters({
        ...filters,
        categories: exists
          ? filters.categories.filter((item) => item.toLowerCase() !== category.toLowerCase())
          : [...filters.categories, category],
      });
    },
    [applyFilters, filters],
  );

  const toggleBrand = useCallback(
    (brand: string) => {
      const exists = filters.brands.some((item) => item.toLowerCase() === brand.toLowerCase());
      applyFilters({
        ...filters,
        brands: exists
          ? filters.brands.filter((item) => item.toLowerCase() !== brand.toLowerCase())
          : [...filters.brands, brand],
      });
    },
    [applyFilters, filters],
  );

  const setPriceMax = useCallback(
    (priceMax?: number) => {
      applyFilters({ ...filters, priceMax });
    },
    [applyFilters, filters],
  );

  const toggleAvailability = useCallback(
    (value: SpmAvailabilityId) => {
      const exists = filters.availability.includes(value);
      applyFilters({
        ...filters,
        availability: exists
          ? filters.availability.filter((item) => item !== value)
          : [...filters.availability, value],
      });
    },
    [applyFilters, filters],
  );

  const setRatingMin = useCallback(
    (ratingMin?: 3 | 4) => {
      applyFilters({ ...filters, ratingMin });
    },
    [applyFilters, filters],
  );

  const setSaleOnly = useCallback(
    (saleOnly: boolean) => {
      applyFilters({ ...filters, saleOnly });
    },
    [applyFilters, filters],
  );

  const setVetRecommended = useCallback(
    (vetRecommended: boolean) => {
      applyFilters({ ...filters, vetRecommended });
    },
    [applyFilters, filters],
  );

  const openMobileDrawer = useCallback(() => {
    setDraftFilters(filters);
    setMobileOpen(true);
  }, [filters]);

  const closeMobileDrawer = useCallback(() => {
    setMobileOpen(false);
  }, []);

  const applyDraftFilters = useCallback(() => {
    applyFilters(draftFilters);
    setMobileOpen(false);
  }, [applyFilters, draftFilters]);

  const clearDraftFilters = useCallback(() => {
    setDraftFilters(normalizeSpmShopFilters({}));
  }, []);

  const draftHasChanges = !spmShopFiltersEqual(draftFilters, filters);

  const activeChips = useMemo(
    () =>
      spmBuildActiveFilterChips(filters, {
        clearPetGroup: () => applyFilters({ ...filters, petGroup: undefined }),
        toggleCategory,
        toggleBrand,
        setPriceMax,
        toggleAvailability,
        setRatingMin,
        setSaleOnly,
        setVetRecommended,
      }),
    [
      filters,
      applyFilters,
      toggleCategory,
      toggleBrand,
      setPriceMax,
      toggleAvailability,
      setRatingMin,
      setSaleOnly,
      setVetRecommended,
    ],
  );

  const value = useMemo(
    () => ({
      filters,
      searchQuery,
      hasActiveFilters,
      activeChips,
      clearFilters,
      togglePetGroup,
      toggleCategory,
      toggleBrand,
      setPriceMax,
      toggleAvailability,
      setRatingMin,
      setSaleOnly,
      setVetRecommended,
      mobileOpen,
      openMobileDrawer,
      closeMobileDrawer,
      draftFilters,
      setDraftFilters,
      applyDraftFilters,
      clearDraftFilters,
      draftHasChanges,
    }),
    [
      filters,
      searchQuery,
      hasActiveFilters,
      activeChips,
      clearFilters,
      togglePetGroup,
      toggleCategory,
      toggleBrand,
      setPriceMax,
      toggleAvailability,
      setRatingMin,
      setSaleOnly,
      setVetRecommended,
      mobileOpen,
      openMobileDrawer,
      closeMobileDrawer,
      draftFilters,
      applyDraftFilters,
      clearDraftFilters,
      draftHasChanges,
    ],
  );

  return <SpmShopFiltersContext.Provider value={value}>{children}</SpmShopFiltersContext.Provider>;
}

export function useSpmShopFilters() {
  const context = useContext(SpmShopFiltersContext);
  if (!context) {
    throw new Error("useSpmShopFilters must be used within SpmShopFiltersProvider");
  }
  return context;
}
