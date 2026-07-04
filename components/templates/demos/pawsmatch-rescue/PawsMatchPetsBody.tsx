"use client";

import { useCallback, useMemo, useState } from "react";
import {
  PMR_ADOPTABLE_PETS,
  PMR_FILTER_OPTIONS,
} from "./pawsMatchRescueData";
import { PawsMatchPetCard } from "./PawsMatchPetCard";
import {
  PmrButton,
  PmrContainer,
  PmrIcon,
  PmrSectionHeading,
  PmrSectionLabel,
  pmrBody,
} from "./PawsMatchShared";

type FilterState = {
  species: string;
  age: string;
  size: string;
  temperament: string;
  location: string;
};

const INITIAL_FILTERS: FilterState = {
  species: "",
  age: "",
  size: "",
  temperament: "",
  location: "",
};

export function PawsMatchPetsBody() {
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const filteredPets = useMemo(() => {
    return PMR_ADOPTABLE_PETS.filter((pet) => {
      if (appliedFilters.species && pet.species !== appliedFilters.species) return false;
      if (appliedFilters.age) {
        const ageMatch =
          appliedFilters.age === "puppy"
            ? pet.ageCategory === "puppy" || pet.ageCategory === "kitten"
            : pet.ageCategory === appliedFilters.age;
        if (!ageMatch) return false;
      }
      if (appliedFilters.size && pet.size !== appliedFilters.size) return false;
      if (appliedFilters.temperament && !pet.temperament.includes(appliedFilters.temperament))
        return false;
      if (appliedFilters.location && pet.location !== appliedFilters.location) return false;
      return true;
    });
  }, [appliedFilters]);

  const updateFilter = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <main className="pmr-body-text bg-[var(--pmr-bg-warm)] py-12 md:py-16" style={pmrBody}>
      <PmrContainer>
        <div className="mb-10">
          <PmrSectionLabel>Discover</PmrSectionLabel>
          <PmrSectionHeading as="h1" className="text-3xl md:text-4xl">
            Find your future companion
          </PmrSectionHeading>
          <p className="mt-3 max-w-xl text-sm md:text-base">
            Browse adoptable pets, read their stories, and start an application when you feel ready.
            No pressure — the right match is worth waiting for.
          </p>
        </div>

        <div className="pmr-card mb-12 p-5 md:p-6">
          <p className="pmr-label mb-4 text-[var(--pmr-brown)]">Pet Finder</p>
          <form
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6"
            onSubmit={(e) => {
              e.preventDefault();
              setAppliedFilters({ ...filters });
            }}
          >
            {(
              [
                ["species", "Species", PMR_FILTER_OPTIONS.species],
                ["age", "Age", PMR_FILTER_OPTIONS.age],
                ["size", "Size", PMR_FILTER_OPTIONS.size],
                ["temperament", "Temperament", PMR_FILTER_OPTIONS.temperament],
                ["location", "Location", PMR_FILTER_OPTIONS.location],
              ] as const
            ).map(([key, label, options]) => (
              <div key={key} className="flex flex-col gap-1.5">
                <label htmlFor={`pmr-filter-${key}`} className="text-xs font-semibold text-[var(--pmr-brown)]">
                  {label}
                </label>
                <select
                  id={`pmr-filter-${key}`}
                  value={filters[key]}
                  onChange={(e) => updateFilter(key, e.target.value)}
                  className="pmr-input pmr-focus-ring px-3 py-2.5 text-sm"
                >
                  {options.map((opt) => (
                    <option key={opt.value || "all"} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            ))}
            <div className="flex items-end sm:col-span-2 lg:col-span-1">
              <PmrButton type="submit" className="w-full gap-2 py-2.5">
                <PmrIcon name="search" className="text-lg" />
                Search
              </PmrButton>
            </div>
          </form>
        </div>

        <p className="mb-8 text-sm text-[var(--pmr-brown-muted)]">
          {filteredPets.length} companion{filteredPets.length !== 1 ? "s" : ""} waiting for the right
          home.
        </p>

        {filteredPets.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPets.map((pet) => (
              <PawsMatchPetCard
                key={pet.id}
                pet={pet}
                isFavorite={favorites.has(pet.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        ) : (
          <div className="pmr-card py-16 text-center">
            <PmrIcon name="search_off" className="mb-3 text-4xl text-[var(--pmr-brown-light)]" />
            <p className="font-semibold text-[var(--pmr-brown)]">No matches found</p>
            <PmrButton
              variant="outline"
              className="mt-6"
              onClick={() => {
                setFilters(INITIAL_FILTERS);
                setAppliedFilters(INITIAL_FILTERS);
              }}
            >
              Clear filters
            </PmrButton>
          </div>
        )}
      </PmrContainer>
    </main>
  );
}
