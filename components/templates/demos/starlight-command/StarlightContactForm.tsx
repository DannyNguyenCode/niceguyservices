"use client";

import type { FormEvent } from "react";
import { useCallback, useState } from "react";

const inputClass =
  "min-h-12 w-full border-2 border-[#594238] bg-[#1c1b1b] px-3 py-3 text-base text-[#ffb595] outline-none transition-all placeholder:text-[#ffb595]/30 focus:border-[#ee671c] sm:px-4 sm:py-4";

export function StarlightContactForm() {
  const [sent, setSent] = useState(false);

  const onSubmit = useCallback((e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSent(true);
    window.setTimeout(() => setSent(false), 3200);
  }, []);

  return (
    <form className="space-y-6" onSubmit={onSubmit} noValidate>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="sc-name" className="font-['var(--font-sc-display),ui-sans-serif] text-sm font-semibold uppercase tracking-widest text-[#e0c0b2]">
            NAME / IDENTIFIER
          </label>
          <input id="sc-name" name="name" type="text" autoComplete="name" placeholder="SEC_USER_01" className={inputClass} />
        </div>
        <div className="space-y-2">
          <label htmlFor="sc-email" className="font-['var(--font-sc-display),ui-sans-serif] text-sm font-semibold uppercase tracking-widest text-[#e0c0b2]">
            COMMS CHANNEL (EMAIL)
          </label>
          <input
            id="sc-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="USER@PROTO.COL"
            className={inputClass}
          />
        </div>
      </div>
      <div className="space-y-2">
        <label htmlFor="sc-sector" className="font-['var(--font-sc-display),ui-sans-serif] text-sm font-semibold uppercase tracking-widest text-[#e0c0b2]">
          SECTOR LOCATION
        </label>
        <select id="sc-sector" name="sector" className={inputClass}>
          <option>TORONTO CENTRAL (DOWNTOWN)</option>
          <option>ETOBICOKE SECTOR</option>
          <option>SCARBOROUGH ZONE</option>
          <option>NORTH YORK QUADRANT</option>
        </select>
      </div>
      <div className="space-y-2">
        <label htmlFor="sc-msg" className="font-['var(--font-sc-display),ui-sans-serif] text-sm font-semibold uppercase tracking-widest text-[#e0c0b2]">
          MESSAGE LOG
        </label>
        <textarea
          id="sc-msg"
          name="message"
          rows={4}
          placeholder="DESCRIBE THE ELECTRICAL ANOMALY..."
          className={inputClass}
        />
      </div>
      <button
        type="submit"
        className="flex min-h-14 w-full items-center justify-center gap-3 bg-[#ee671c] px-4 py-4 font-['var(--font-sc-display),ui-sans-serif] text-base font-bold text-[#351000] shadow-[0_0_20px_rgba(238,103,28,0.4)] transition-all hover:brightness-110 sm:text-lg md:text-xl"
      >
        {sent ? "TRANSMISSION QUEUED (DEMO)" : "INITIALIZE TRANSMISSION"}
        <span className="material-symbols-outlined" aria-hidden>
          send
        </span>
      </button>
      {sent ? (
        <p className="text-center font-['var(--font-sc-body),ui-sans-serif] text-sm text-[#e0c0b2]" role="status">
          Demo only — no data was sent. Wire this form to your API or form service when you ship.
        </p>
      ) : null}
    </form>
  );
}
