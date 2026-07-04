"use client";

import { useCallback, useEffect, useId, useRef } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Search,
  Shield,
  X,
} from "lucide-react";
import { PSD_PATHS } from "./partySmileDentalConfig";
import type { PsdService } from "./partySmileDentalData";

type ServiceModalProps = {
  service: PsdService | null;
  onClose: () => void;
  showViewAllServices?: boolean;
};

export function ServiceModal({ service, onClose, showViewAllServices = false }: ServiceModalProps) {
  const titleId = useId();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousOverflow = useRef("");

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!service) return;

    previousOverflow.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") handleClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow.current;
    };
  }, [service, handleClose]);

  if (!service) return null;

  const Icon = service.icon;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-[#1a1a1a]/70"
        aria-label="Close dialog"
        onClick={handleClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="psd-service-modal relative z-10 flex max-h-[min(92vh,900px)] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border-4 border-[#3b82f6] bg-white psd-tile-shadow"
      >
        <button
          ref={closeButtonRef}
          type="button"
          onClick={handleClose}
          className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#1a1a1a] bg-[#ef4444] text-white psd-tile-shadow transition-colors hover:bg-[#dc2626]"
          aria-label="Close service details"
        >
          <X className="h-5 w-5" aria-hidden />
        </button>

        <div className="overflow-y-auto px-6 pb-6 pt-10 md:px-8 md:pb-8 md:pt-12">
          <div className="flex flex-col items-center text-center">
            <div
              className={`flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-[#1a1a1a] ${service.tileColor} text-white`}
              aria-hidden
            >
              <Icon className="h-10 w-10" />
            </div>
            <h2 id={titleId} className="mt-5 font-black text-[#1a1a1a] text-[1.5rem] md:text-[2rem]">
              {service.title}
            </h2>
            <p className="mt-3 max-w-lg text-sm leading-7 text-[#525252]">{service.description}</p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="flex flex-col rounded-2xl border-2 border-[#3b82f6] bg-[#eff6ff] p-4">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl border-2 border-[#1a1a1a] bg-[#3b82f6] text-white">
                <Search className="h-5 w-5" aria-hidden />
              </div>
              <h3 className="font-black text-[#1a1a1a]">What is this?</h3>
              <p className="mt-2 flex-1 text-sm leading-6 text-[#525252]">{service.whatIsThis}</p>
            </div>

            <div className="flex flex-col rounded-2xl border-2 border-[#22c55e] bg-[#f0fdf4] p-4">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl border-2 border-[#1a1a1a] bg-[#22c55e] text-white">
                <Shield className="h-5 w-5" aria-hidden />
              </div>
              <h3 className="font-black text-[#1a1a1a]">Why it matters</h3>
              <p className="mt-2 flex-1 text-sm leading-6 text-[#525252]">{service.whyItMatters}</p>
            </div>

            <div className="flex flex-col rounded-2xl border-2 border-[#eab308] bg-[#fefce8] p-4 md:col-span-1">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl border-2 border-[#1a1a1a] bg-[#f59e0b] text-white">
                <AlertTriangle className="h-5 w-5" aria-hidden />
              </div>
              <h3 className="font-black text-[#1a1a1a]">Signs you may need it</h3>
              <p className="mt-2 flex-1 text-sm leading-6 text-[#525252]">{service.signsYouMayNeedIt}</p>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href={PSD_PATHS.book}
              onClick={handleClose}
              className="inline-flex items-center justify-center rounded-2xl border-2 border-[#1a1a1a] bg-[#ef4444] px-8 py-4 text-center font-black text-white psd-tile-shadow transition-colors hover:bg-[#dc2626]"
            >
              Book an Appointment
            </Link>
            {showViewAllServices ? (
              <Link
                href={PSD_PATHS.services}
                onClick={handleClose}
                className="inline-flex items-center justify-center rounded-2xl border-2 border-[#1a1a1a] bg-white px-8 py-4 text-center font-black text-[#1a1a1a] psd-tile-shadow transition-colors hover:bg-[#f5f5f5]"
              >
                View All Services
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
