"use client";

import Link from "next/link";
import { useState } from "react";
import { SPM_PATHS } from "./saturdayPetMarketConfig";
import { SPM_IMG } from "./saturdayPetMarketImages";
import { SPM_CONTACT_OPTIONS } from "./saturdayPetMarketData";
import { SpmContainer, SpmIcon, SpmImg } from "./SaturdayPetMarketShared";

export function SaturdayPetMarketContactBody() {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setShowModal(true);
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    setShowModal(false);
    document.body.style.overflow = "";
    (document.getElementById("spm-contact-form") as HTMLFormElement | null)?.reset();
  }

  return (
    <>
      <main className="px-[var(--spm-margin)] py-16">
        <SpmContainer>
          <header className="mb-16 text-center">
            <h1 className="spm-headline-xl mb-3 text-[var(--spm-primary)]">Let&apos;s Wag &amp; Chat</h1>
            <p className="spm-body-lg mx-auto max-w-2xl text-[var(--spm-on-surface-variant)]">
              Whether it&apos;s a bark, a meow, or a chirp, we&apos;re here to listen. Our team is ready to help you
              find the best treats and toys in town.
            </p>
          </header>

          <section className="mb-16">
            <h2 className="spm-headline-md mb-12 text-center">How can we help you today?</h2>
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              {SPM_CONTACT_OPTIONS.map((option) => {
                const isActive = selectedOption === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setSelectedOption(option.id)}
                    className={`group flex flex-col items-center justify-center rounded-lg border-2 p-12 transition-all duration-300 active:scale-95 ${
                      isActive
                        ? "border-[var(--spm-secondary)] bg-[var(--spm-surface)] ring-4 ring-[var(--spm-secondary-fixed)]"
                        : "border-[var(--spm-outline-variant)] bg-[var(--spm-surface-container-low)] hover:border-[var(--spm-secondary)] hover:bg-[var(--spm-surface)]"
                    }`}
                  >
                    <div
                      className={`spm-sticker-shadow mb-6 flex h-16 w-16 items-center justify-center rounded-full transition-colors ${
                        isActive ? "bg-[var(--spm-secondary)] text-white" : option.iconClass
                      } group-hover:bg-[var(--spm-secondary)] group-hover:text-white`}
                    >
                      <SpmIcon name={option.icon} className="text-4xl" />
                    </div>
                    <span className="spm-headline-md text-center text-[var(--spm-on-surface)]">{option.label}</span>
                  </button>
                );
              })}
            </div>
          </section>

          <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <div className="relative overflow-hidden rounded-lg border-2 border-[var(--spm-outline-variant)] bg-[var(--spm-surface-container)] p-12 shadow-md">
                <div className="spm-candy-stripe-subtle pointer-events-none absolute inset-0 opacity-5" />
                <form id="spm-contact-form" className="relative z-10 space-y-6" onSubmit={handleSubmit}>
                  <div>
                    <label className="spm-headline-md mb-1 block text-[var(--spm-primary)]">Your Name</label>
                    <input
                      className="w-full rounded-full border border-[var(--spm-outline-variant)] bg-[var(--spm-background)] px-6 py-3 font-body-md placeholder:text-[var(--spm-on-surface-variant)]/50 focus:border-[var(--spm-tertiary)] focus:outline-none focus:ring-4 focus:ring-[var(--spm-tertiary-container)]"
                      placeholder="Buddy Barker"
                      required
                      type="text"
                    />
                  </div>
                  <div>
                    <label className="spm-headline-md mb-1 block text-[var(--spm-primary)]">Email Address</label>
                    <input
                      className="w-full rounded-full border border-[var(--spm-outline-variant)] bg-[var(--spm-background)] px-6 py-3 font-body-md placeholder:text-[var(--spm-on-surface-variant)]/50 focus:border-[var(--spm-tertiary)] focus:outline-none focus:ring-4 focus:ring-[var(--spm-tertiary-container)]"
                      placeholder="buddy@tails.com"
                      required
                      type="email"
                    />
                  </div>
                  <div>
                    <label className="spm-headline-md mb-1 block text-[var(--spm-primary)]">Message</label>
                    <textarea
                      className="w-full rounded-lg border border-[var(--spm-outline-variant)] bg-[var(--spm-background)] px-6 py-3 font-body-md placeholder:text-[var(--spm-on-surface-variant)]/50 focus:border-[var(--spm-tertiary)] focus:outline-none focus:ring-4 focus:ring-[var(--spm-tertiary-container)]"
                      placeholder="Tell us everything!"
                      required
                      rows={4}
                    />
                  </div>
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="spm-sticker-btn spm-sticker-shadow spm-coupon-border flex items-center justify-center gap-2 rounded-full border-2 border-dashed border-white bg-[var(--spm-secondary)] px-16 py-6 font-headline-md text-white transition-all duration-200"
                    >
                      Send Message
                      <SpmIcon name="send" />
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div className="space-y-12 lg:col-span-5">
              <div className="relative rounded-lg border-2 border-[var(--spm-outline-variant)] bg-[var(--spm-surface-container-high)] p-12">
                <div className="spm-sticker-shadow absolute -right-4 -top-4 flex h-16 w-16 rotate-12 items-center justify-center rounded-full border-2 border-dashed border-white bg-[var(--spm-tertiary)] text-white">
                  <SpmIcon name="location_on" className="text-3xl" />
                </div>
                <h3 className="spm-headline-md mb-6 text-[var(--spm-secondary)]">Main Street Market</h3>
                <div className="space-y-3 text-[var(--spm-on-surface-variant)]">
                  <p className="flex items-start gap-2">
                    <SpmIcon name="map" className="text-[var(--spm-primary)]" />
                    1234 Kibble Lane, Suite 101
                    <br />
                    Pet-opolis, PA 19104
                  </p>
                  <p className="flex items-center gap-2">
                    <SpmIcon name="call" className="text-[var(--spm-primary)]" />
                    (555) BARK-CHAT
                  </p>
                  <p className="flex items-center gap-2">
                    <SpmIcon name="schedule" className="text-[var(--spm-primary)]" />
                    Mon - Sat: 8am - 8pm
                  </p>
                </div>
              </div>

              <div className="group relative h-64 overflow-hidden rounded-lg border-2 border-[var(--spm-outline-variant)] shadow-md">
                <SpmImg
                  src={SPM_IMG.contact.map}
                  alt="Whimsical neighborhood map illustration"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="400px"
                />
                <div className="absolute bottom-4 left-4 flex items-center gap-1 rounded-full border border-[var(--spm-outline-variant)] bg-white/90 px-6 py-1">
                  <SpmIcon name="explore" className="text-[var(--spm-secondary)]" />
                  <span className="spm-label-sm">Get Directions</span>
                </div>
              </div>
            </div>
          </div>
        </SpmContainer>
      </main>

      {showModal ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-[var(--spm-margin)]">
          <button
            type="button"
            className="absolute inset-0 bg-[var(--spm-on-background)]/40 backdrop-blur-sm"
            onClick={closeModal}
            aria-label="Close modal"
          />
          <div
            className="spm-sticker-shadow relative z-10 w-full max-w-md rounded-lg border-4 border-[var(--spm-secondary)] bg-[var(--spm-background)] p-8 text-center md:p-12"
            role="dialog"
            aria-labelledby="spm-contact-success-title"
            aria-modal="true"
          >
            <div className="spm-coupon-border mx-auto mb-8 flex h-24 w-24 animate-bounce items-center justify-center rounded-full border-4 border-dashed border-white bg-[var(--spm-primary-container)] text-[var(--spm-on-primary-container)]">
              <SpmIcon name="check_circle" className="text-6xl" />
            </div>
            <h2 id="spm-contact-success-title" className="spm-headline-xl mb-4 text-[var(--spm-secondary)]">
              Tail-Wagging Success!
            </h2>
            <p className="spm-body-lg mb-8 text-[var(--spm-on-surface-variant)]">
              Your message has been caught! Our team will sniff it out and get back to you within 24 business hours.
            </p>
            <Link
              href={SPM_PATHS.shop}
              onClick={closeModal}
              className="spm-sticker-shadow block w-full rounded-full bg-[var(--spm-primary)] py-4 font-headline-md text-white transition-all active:translate-y-1"
            >
              Great! Back to Shop
            </Link>
          </div>
        </div>
      ) : null}
    </>
  );
}
