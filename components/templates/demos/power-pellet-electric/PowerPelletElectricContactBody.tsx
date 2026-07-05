"use client";

import { PPE_CONTACT } from "./powerPelletElectricSiteContent";
import { PpeContainer, PpeIcon, usePpeFormLabelFocus } from "./PowerPelletElectricShared";

export function PowerPelletElectricContactBody() {
  usePpeFormLabelFocus("ppe-contact-form");
  const { pageTitle, intro, formLabel, submitLabel, formFields, businessHours, serviceArea, processTitle, afterSubmit, emergencyNotice } =
    PPE_CONTACT;

  return (
    <main id="ppe-main-content" className="ppe-main px-[var(--ppe-margin-mobile)] pb-24 pt-32 md:px-[var(--ppe-margin-desktop)] lg:pb-12">
      <PpeContainer>
        <section className="mb-20">
          <h1 className="ppe-display mb-4 text-[var(--ppe-primary-fixed)]">{pageTitle}</h1>
          <p className="ppe-body-lg max-w-2xl text-[var(--ppe-on-surface-variant)]">{intro}</p>
        </section>

        <section className="mb-16">
          <div className="flex flex-col items-center gap-6 rounded-lg border-2 border-[var(--ppe-error)] bg-[var(--ppe-error-container)] p-6 ppe-emergency-pulse md:flex-row">
            <PpeIcon name="warning" className="text-4xl text-[var(--ppe-on-error-container)]" fill />
            <div>
              <h2 className="ppe-headline-md mb-1 uppercase text-[var(--ppe-on-error-container)]">
                {emergencyNotice.title}
              </h2>
              <p className="ppe-body-md text-[color-mix(in_srgb,var(--ppe-on-error-container)_90%,transparent)]">
                {emergencyNotice.description}
              </p>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 items-start gap-[var(--ppe-gutter)] lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="relative p-8 ppe-maze-border bg-[var(--ppe-surface-container)] shadow-xl">
              <div className="absolute -top-4 left-6 border-2 border-[var(--ppe-on-tertiary-container)] bg-[var(--ppe-background)] px-3 py-1 ppe-label-caps text-[var(--ppe-secondary)]">
                {formLabel}
              </div>
              <form id="ppe-contact-form" className="space-y-6" onSubmit={(e) => e.preventDefault()} noValidate>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {formFields.slice(0, 2).map((field) => (
                    <div key={field.id} className="flex flex-col gap-2">
                      <label htmlFor={`ppe-${field.id}`} className="ppe-label-caps text-[var(--ppe-on-surface-variant)]">
                        {field.label}
                        {field.required ? <span className="text-[var(--ppe-error)]"> *</span> : null}
                      </label>
                      <input
                        id={`ppe-${field.id}`}
                        name={field.id}
                        type={field.type}
                        placeholder={"placeholder" in field ? field.placeholder : undefined}
                        required={field.required}
                        className="ppe-input"
                        autoComplete={field.id === "email" ? "email" : field.id === "phone" ? "tel" : "name"}
                      />
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {formFields.slice(2, 4).map((field) => (
                    <div key={field.id} className="flex flex-col gap-2">
                      <label htmlFor={`ppe-${field.id}`} className="ppe-label-caps text-[var(--ppe-on-surface-variant)]">
                        {field.label}
                        {field.required ? <span className="text-[var(--ppe-error)]"> *</span> : null}
                      </label>
                      {field.type === "select" ? (
                        <select id={`ppe-${field.id}`} name={field.id} required={field.required} className="ppe-input">
                          {"options" in field && field.options
                            ? field.options.map((option) => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))
                            : null}
                        </select>
                      ) : (
                        <input
                          id={`ppe-${field.id}`}
                          name={field.id}
                          type={field.type}
                          placeholder={"placeholder" in field ? field.placeholder : undefined}
                          required={field.required}
                          className="ppe-input"
                          autoComplete="tel"
                        />
                      )}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {formFields.slice(4, 6).map((field) => (
                    <div key={field.id} className="flex flex-col gap-2">
                      <label htmlFor={`ppe-${field.id}`} className="ppe-label-caps text-[var(--ppe-on-surface-variant)]">
                        {field.label}
                        {field.required ? <span className="text-[var(--ppe-error)]"> *</span> : null}
                      </label>
                      <select id={`ppe-${field.id}`} name={field.id} required={field.required} className="ppe-input">
                        {"options" in field && field.options
                          ? field.options.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))
                          : null}
                      </select>
                    </div>
                  ))}
                </div>
                {formFields.slice(6).map((field) => (
                  <div key={field.id} className="flex flex-col gap-2">
                    <label htmlFor={`ppe-${field.id}`} className="ppe-label-caps text-[var(--ppe-on-surface-variant)]">
                      {field.label}
                      {field.required ? <span className="text-[var(--ppe-error)]"> *</span> : null}
                    </label>
                    <textarea
                      id={`ppe-${field.id}`}
                      name={field.id}
                      rows={4}
                      placeholder={"placeholder" in field ? field.placeholder : undefined}
                      required={field.required}
                      className="ppe-input resize-none"
                    />
                  </div>
                ))}
                <button
                  type="submit"
                  className="ppe-interactive flex w-full items-center justify-center gap-3 bg-[var(--ppe-primary-fixed)] py-4 uppercase tracking-widest text-[var(--ppe-on-primary-fixed)] ppe-headline-md ppe-neon-glow-yellow transition-transform hover:scale-[0.98]"
                >
                  {submitLabel}
                  <PpeIcon name="bolt" />
                </button>
              </form>
            </div>
          </div>

          <div className="space-y-[var(--ppe-gutter)] lg:col-span-5">
            <div className="grid grid-cols-1 gap-[var(--ppe-gutter)] md:grid-cols-2 lg:grid-cols-1">
              <div className="border-2 border-[var(--ppe-on-tertiary-container)] bg-[var(--ppe-surface-container-low)] p-6">
                <h3 className="ppe-label-caps mb-4 flex items-center gap-2 uppercase text-[var(--ppe-secondary)]">
                  <PpeIcon name="schedule" className="text-sm" />
                  Operating_Hours
                </h3>
                <div className="space-y-2 ppe-body-md text-[var(--ppe-on-surface-variant)]">
                  {businessHours.map((row, index) => (
                    <div
                      key={row.day}
                      className={`flex justify-between ${index < businessHours.length - 1 ? "border-b border-[var(--ppe-on-tertiary-container)] pb-1" : ""}`}
                    >
                      <span>{row.day}</span>
                      <span className="text-[var(--ppe-on-surface)]">{row.hours}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-2 border-[var(--ppe-on-tertiary-container)] bg-[var(--ppe-surface-container-low)] p-6">
                <h3 className="ppe-label-caps mb-4 flex items-center gap-2 uppercase text-[var(--ppe-secondary)]">
                  <PpeIcon name="location_on" className="text-sm" />
                  Service_Grid
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {serviceArea.map((area) => (
                    <span
                      key={area}
                      className="border border-[var(--ppe-on-tertiary-container)] bg-[var(--ppe-surface-variant)] px-3 py-1 ppe-label-caps text-[var(--ppe-on-surface)]"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative py-4 pl-12">
              <div className="ppe-level-line" aria-hidden />
              <h3 className="ppe-label-caps mb-8 ml-[-3rem] uppercase text-[var(--ppe-primary-fixed)]">
                {processTitle}
              </h3>
              <div className="space-y-12">
                {afterSubmit.map((step) => (
                  <div key={step.step} className="relative">
                    <div
                      className={`absolute -left-[54px] top-0 z-10 flex h-12 w-12 items-center justify-center rounded-sm border-2 font-bold ${
                        step.variant === "primary"
                          ? "border-[var(--ppe-on-primary-container)] bg-[var(--ppe-primary-container)] text-[var(--ppe-on-primary-container)] ppe-neon-glow-yellow"
                          : step.variant === "secondary"
                            ? "border-[var(--ppe-secondary)] bg-[var(--ppe-secondary-container)] text-[var(--ppe-secondary)] ppe-neon-glow-pink"
                            : "border-[var(--ppe-on-surface-variant)] bg-[var(--ppe-surface-variant)] text-[var(--ppe-on-surface-variant)]"
                      }`}
                    >
                      {step.step}
                    </div>
                    <div className="ml-4 border-2 border-[var(--ppe-on-tertiary-container)] bg-[var(--ppe-surface-container-high)] p-5">
                      <h4 className="ppe-headline-md mb-2 text-[var(--ppe-on-surface)]">{step.title}</h4>
                      <p className="ppe-body-md text-[var(--ppe-on-surface-variant)]">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </PpeContainer>
    </main>
  );
}
