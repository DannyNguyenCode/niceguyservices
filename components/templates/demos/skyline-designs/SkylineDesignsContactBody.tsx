"use client";

import { FormEvent, useRef, useState } from "react";
import { SD_CONTACT_LINKS, SD_PROJECT_TYPES } from "./skylineDesignsData";
import { SD_IMG } from "./skylineDesignsImages";
import { SdContainer, SdIcon, SdImg } from "./SkylineDesignsShared";
import { useSdNavScroll, useSdReveal } from "./useSdEffects";

export function SkylineDesignsContactBody() {
  const formRef = useRef<HTMLFormElement>(null);
  const [submitState, setSubmitState] = useState<"idle" | "sending" | "sent">("idle");
  useSdReveal();
  useSdNavScroll();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitState !== "idle") return;
    setSubmitState("sending");
    window.setTimeout(() => {
      setSubmitState("sent");
      window.setTimeout(() => {
        setSubmitState("idle");
        formRef.current?.reset();
      }, 3000);
    }, 1500);
  };

  const inputClass =
    "w-full rounded-full border-none bg-[color-mix(in_srgb,var(--sd-tertiary-container)_30%,transparent)] px-6 py-4 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-[var(--sd-primary-container)]";

  return (
    <main className="sd-contact-bg relative pt-32 pb-20">
      <SdContainer>
        <section className="sd-reveal mx-auto mb-16 max-w-6xl text-center">
          <h1 className="sd-display-xl mb-6 text-[var(--sd-primary)]">Let&apos;s build something ethereal.</h1>
          <p className="sd-body-lg mx-auto max-w-2xl text-[var(--sd-on-surface-variant)]">
            Whether you&apos;re a startup looking to launch or an agency needing high-end support, I&apos;m here to
            help you reach new heights.
          </p>
        </section>

        <section className="sd-reveal mx-auto grid max-w-6xl grid-cols-1 items-start gap-12 lg:grid-cols-12">
          <div className="sd-cloud-card rounded-lg bg-white/80 p-8 backdrop-blur-sm md:p-12 lg:col-span-7">
            <form ref={formRef} className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="sd-label-md ml-2 block text-[var(--sd-on-surface-variant)]">Name</label>
                  <input className={inputClass} placeholder="Alex Rivera" type="text" name="name" />
                </div>
                <div className="space-y-2">
                  <label className="sd-label-md ml-2 block text-[var(--sd-on-surface-variant)]">Email</label>
                  <input className={inputClass} placeholder="alex@company.com" type="email" name="email" />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="sd-label-md ml-2 block text-[var(--sd-on-surface-variant)]">Company</label>
                  <input className={inputClass} placeholder="Acme Inc." type="text" name="company" />
                </div>
                <div className="space-y-2">
                  <label className="sd-label-md ml-2 block text-[var(--sd-on-surface-variant)]">Project Type</label>
                  <select className={`${inputClass} appearance-none`} name="projectType" defaultValue={SD_PROJECT_TYPES[0]}>
                    {SD_PROJECT_TYPES.map((type) => (
                      <option key={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="sd-label-md ml-2 block text-[var(--sd-on-surface-variant)]">Message</label>
                <textarea
                  className="w-full resize-none rounded-xl border-none bg-[color-mix(in_srgb,var(--sd-tertiary-container)_30%,transparent)] px-6 py-4 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-[var(--sd-primary-container)]"
                  placeholder="Tell me about your vision..."
                  rows={4}
                  name="message"
                />
              </div>
              <button
                type="submit"
                disabled={submitState !== "idle"}
                className={`sd-headline-md w-full rounded-full px-12 py-4 transition-all duration-300 md:w-auto ${
                  submitState === "sent"
                    ? "bg-green-100 text-green-800"
                    : "bg-[var(--sd-primary-container)] text-[var(--sd-on-primary-container)] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[color-mix(in_srgb,var(--sd-primary-container)_20%,transparent)]"
                }`}
              >
                {submitState === "sending" ? "Sending..." : submitState === "sent" ? "Message Sent!" : "Send Message"}
              </button>
            </form>
          </div>

          <div className="space-y-8 lg:col-span-5">
            <div className="rounded-lg bg-[color-mix(in_srgb,var(--sd-surface-variant)_30%,transparent)] p-8">
              <h2 className="sd-headline-md mb-6 text-[var(--sd-primary)]">Connect with me</h2>
              <div className="space-y-4">
                {SD_CONTACT_LINKS.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="group flex items-center gap-4 rounded-full p-4 transition-all duration-300 hover:bg-white"
                  >
                    <div className={`flex h-12 w-12 items-center justify-center rounded-full ${link.bgClass}`}>
                      <SdIcon name={link.icon} />
                    </div>
                    <div>
                      <p className="sd-label-md text-[var(--sd-on-surface-variant)]">{link.label}</p>
                      <p className="sd-body-md text-[var(--sd-on-surface)]">{link.value}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-lg bg-[var(--sd-primary)] p-8 text-[var(--sd-on-primary)]">
              <div className="relative z-10 space-y-3">
                <h3 className="sd-headline-md leading-tight">
                  Helping small businesses and agencies build better websites.
                </h3>
                <p className="sd-body-md opacity-80">Based in Toronto, working globally.</p>
              </div>
              <div className="absolute -right-10 -bottom-10 opacity-10 transition-transform duration-700 group-hover:scale-110">
                <SdIcon name="cloud" className="!text-[160px]" />
              </div>
            </div>
          </div>
        </section>

        <section className="sd-reveal mx-auto mt-20 max-w-6xl">
          <div className="relative h-64 cursor-crosshair overflow-hidden rounded-lg grayscale transition-all duration-700 hover:grayscale-0 md:h-96">
            <div className="pointer-events-none absolute inset-0 z-10 bg-[color-mix(in_srgb,var(--sd-primary)_10%,transparent)]" />
            <SdImg
              src={SD_IMG.contact.map}
              alt="Stylized minimalist map of Toronto with soft blue accents"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 80vw"
            />
            <div className="absolute top-1/2 left-1/2 z-20 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full bg-white px-6 py-3 shadow-2xl">
              <span className="h-3 w-3 animate-ping rounded-full bg-[var(--sd-primary)]" />
              <span className="sd-label-md text-[var(--sd-primary)]">Located in Toronto</span>
            </div>
          </div>
        </section>
      </SdContainer>
    </main>
  );
}
