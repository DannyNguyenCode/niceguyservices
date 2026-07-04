"use client";

import { useState } from "react";
import { Check, Star } from "lucide-react";
import {
  AppointmentDateTimePicker,
  formatAppointmentDate,
} from "./AppointmentDateTimePicker";

const STEPS = [
  "Patient type",
  "Service",
  "Preferred dentist",
  "Date & time",
  "Contact info",
  "Confirmation",
] as const;

const PATIENT_TYPES = ["New Patient", "Existing Patient", "Child Patient", "Emergency Visit"] as const;
const SERVICES = [
  "Cleaning",
  "Exam",
  "Emergency",
  "Child Visit",
  "Invisalign Consultation",
  "Other",
] as const;
const DENTISTS = [
  "No Preference",
  "Dr. Maya Chen",
  "Dr. Daniel Brooks",
  "Dr. Sofia Patel",
  "Dr. Adam Rivera",
] as const;

const TILE_COLORS = ["bg-[#ef4444]", "bg-[#3b82f6]", "bg-[#eab308]", "bg-[#22c55e]"];

type FormState = {
  patientType: string;
  service: string;
  dentist: string;
  date: string;
  time: string;
  name: string;
  phone: string;
  email: string;
  notes: string;
};

const initialForm: FormState = {
  patientType: "",
  service: "",
  dentist: "",
  date: "",
  time: "",
  name: "",
  phone: "",
  email: "",
  notes: "",
};

export function PartySmileDentalAppointmentFlow() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<FormState>(initialForm);

  const update = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const canNext = () => {
    if (step === 0) return !!form.patientType;
    if (step === 1) return !!form.service;
    if (step === 2) return !!form.dentist;
    if (step === 3) return !!form.date && !!form.time;
    if (step === 4) return !!form.name && !!form.phone && !!form.email;
    return true;
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="rounded-3xl border-4 border-[#22c55e] bg-white p-8 text-center psd-tile-shadow">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#22c55e] text-white">
          <Star className="h-8 w-8 fill-current" aria-hidden />
        </div>
        <h2 className="font-black text-[#1a1a1a]">Request received!</h2>
        <p className="mt-3 text-sm leading-7 text-[#525252]">
          Thanks, {form.name}. Our team will confirm your {form.service.toLowerCase()} visit within one
          business day.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="overflow-x-auto pb-2">
        <ol className="flex min-w-max gap-2 md:min-w-0 md:grid md:grid-cols-6">
          {STEPS.map((label, index) => {
            const done = index < step;
            const active = index === step;
            const color = TILE_COLORS[index % TILE_COLORS.length];

            return (
              <li key={label}>
                <div
                  className={`flex flex-col items-center rounded-2xl border-2 border-[#1a1a1a] px-2 py-3 text-center ${
                    active ? `${color} text-white psd-tile-shadow psd-step-active` : done ? "bg-[#22c55e] text-white" : "bg-white text-[#525252]"
                  }`}
                  aria-current={active ? "step" : undefined}
                >
                  <span
                    className={`mb-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-current text-xs font-black${done ? " psd-check-pop" : ""}`}
                  >
                    {done ? <Check className="h-4 w-4" aria-hidden /> : index + 1}
                  </span>
                  <span className="text-[10px] font-bold leading-tight md:text-xs">{label}</span>
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      <div key={step} className="rounded-3xl border-2 border-[#1a1a1a] bg-white p-6 md:p-8 psd-tile-shadow psd-panel-enter">
        {step === 0 && (
          <fieldset>
            <legend className="mb-4 font-black text-[#1a1a1a]">Who is this visit for?</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {PATIENT_TYPES.map((type) => (
                <label
                  key={type}
                  className={`cursor-pointer rounded-2xl border-2 border-[#1a1a1a] px-4 py-4 font-bold ${
                    form.patientType === type ? "bg-[#3b82f6] text-white" : "bg-[#fffef8]"
                  }`}
                >
                  <input
                    type="radio"
                    name="patientType"
                    value={type}
                    checked={form.patientType === type}
                    onChange={(e) => update("patientType", e.target.value)}
                    className="sr-only"
                  />
                  {type}
                </label>
              ))}
            </div>
          </fieldset>
        )}

        {step === 1 && (
          <fieldset>
            <legend className="mb-4 font-black text-[#1a1a1a]">What service do you need?</legend>
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
              {SERVICES.map((service) => (
                <label
                  key={service}
                  className={`cursor-pointer rounded-2xl border-2 border-[#1a1a1a] px-4 py-4 text-center text-sm font-bold ${
                    form.service === service ? "bg-[#ef4444] text-white" : "bg-[#fffef8]"
                  }`}
                >
                  <input
                    type="radio"
                    name="service"
                    value={service}
                    checked={form.service === service}
                    onChange={(e) => update("service", e.target.value)}
                    className="sr-only"
                  />
                  {service}
                </label>
              ))}
            </div>
          </fieldset>
        )}

        {step === 2 && (
          <fieldset>
            <legend className="mb-4 font-black text-[#1a1a1a]">Preferred dentist</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {DENTISTS.map((dentist) => (
                <label
                  key={dentist}
                  className={`cursor-pointer rounded-2xl border-2 border-[#1a1a1a] px-4 py-4 text-sm font-bold ${
                    form.dentist === dentist ? "bg-[#eab308] text-[#1a1a1a]" : "bg-[#fffef8]"
                  }`}
                >
                  <input
                    type="radio"
                    name="dentist"
                    value={dentist}
                    checked={form.dentist === dentist}
                    onChange={(e) => update("dentist", e.target.value)}
                    className="sr-only"
                  />
                  {dentist}
                </label>
              ))}
            </div>
          </fieldset>
        )}

        {step === 3 && (
          <fieldset>
            <legend className="mb-4 font-black text-[#1a1a1a]">Set the time!</legend>
            <p className="mb-6 text-sm leading-6 text-[#525252]">
              Pick a starred day on the calendar, then choose a time slot for your visit.
            </p>
            <AppointmentDateTimePicker
              date={form.date}
              time={form.time}
              onDateChange={(value) => update("date", value)}
              onTimeChange={(value) => update("time", value)}
            />
          </fieldset>
        )}

        {step === 4 && (
          <fieldset className="flex flex-col gap-4">
            <legend className="mb-2 font-black text-[#1a1a1a]">Contact information</legend>
            <label className="flex flex-col gap-2 text-sm font-bold">
              Full name
              <input
                type="text"
                autoComplete="name"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                className="rounded-xl border-2 border-[#1a1a1a] px-4 py-3 font-normal"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-bold">
              Phone
              <input
                type="tel"
                autoComplete="tel"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                className="rounded-xl border-2 border-[#1a1a1a] px-4 py-3 font-normal"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-bold">
              Email
              <input
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                className="rounded-xl border-2 border-[#1a1a1a] px-4 py-3 font-normal"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-bold">
              Notes (optional)
              <textarea
                rows={3}
                value={form.notes}
                onChange={(e) => update("notes", e.target.value)}
                className="rounded-xl border-2 border-[#1a1a1a] px-4 py-3 font-normal"
              />
            </label>
          </fieldset>
        )}

        {step === 5 && (
          <div className="flex flex-col gap-4">
            <h2 className="font-black text-[#1a1a1a]">Review your appointment request</h2>
            <dl className="grid gap-3 text-sm md:grid-cols-2">
              {[
                ["Patient type", form.patientType],
                ["Service", form.service],
                ["Dentist", form.dentist],
                ["Date", form.date ? formatAppointmentDate(form.date) : ""],
                ["Time", form.time],
                ["Name", form.name],
                ["Phone", form.phone],
                ["Email", form.email],
                ["Notes", form.notes || "—"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl bg-[#f5f5f5] p-3">
                  <dt className="font-bold text-[#525252]">{label}</dt>
                  <dd className="font-black text-[#1a1a1a]">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between">
          <button
            type="button"
            disabled={step === 0}
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            className="rounded-xl border-2 border-[#1a1a1a] bg-white px-6 py-3 font-bold disabled:opacity-40"
          >
            Back
          </button>
          {step < 5 ? (
            <button
              type="button"
              disabled={!canNext()}
              onClick={() => setStep((s) => s + 1)}
              className="rounded-xl border-2 border-[#1a1a1a] bg-[#ef4444] px-6 py-3 font-bold text-white psd-tile-shadow disabled:opacity-40"
            >
              Next tile
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="rounded-xl border-2 border-[#1a1a1a] bg-[#22c55e] px-6 py-3 font-bold text-white psd-tile-shadow"
            >
              Submit Appointment Request
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
