"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Clock, Star } from "lucide-react";

const WEEKDAY_LABELS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"] as const;

export const APPOINTMENT_TIME_SLOTS = [
  "09:00 AM",
  "10:30 AM",
  "12:00 PM",
  "01:30 PM",
  "03:00 PM",
  "04:30 PM",
] as const;

type CalendarCell = {
  date: Date;
  inMonth: boolean;
};

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function toIsoDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function parseIsoDate(value: string): Date | null {
  if (!value) return null;
  const [y, m, d] = value.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

function buildCalendarMonth(view: Date): CalendarCell[] {
  const year = view.getFullYear();
  const month = view.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const startOffset = firstOfMonth.getDay();
  const gridStart = new Date(year, month, 1 - startOffset);
  const cells: CalendarCell[] = [];

  for (let i = 0; i < 42; i += 1) {
    const date = new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + i);
    cells.push({ date, inMonth: date.getMonth() === month });
  }

  return cells;
}

function isPastDate(date: Date, today: Date): boolean {
  return startOfDay(date).getTime() < startOfDay(today).getTime();
}

function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

/** Demo availability: weekday slots except every 5th day of the month. */
function hasAvailability(date: Date, today: Date): boolean {
  if (isPastDate(date, today) || isWeekend(date)) return false;
  return date.getDate() % 5 !== 0;
}

function isSelectable(date: Date, today: Date): boolean {
  return hasAvailability(date, today);
}

type AppointmentDateTimePickerProps = {
  date: string;
  time: string;
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
};

export function AppointmentDateTimePicker({
  date,
  time,
  onDateChange,
  onTimeChange,
}: AppointmentDateTimePickerProps) {
  const today = useMemo(() => startOfDay(new Date()), []);
  const selectedDate = parseIsoDate(date);
  const [viewMonth, setViewMonth] = useState(() => {
    const base = selectedDate ?? today;
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });

  const cells = useMemo(() => buildCalendarMonth(viewMonth), [viewMonth]);

  const monthLabel = viewMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const shiftMonth = (delta: number) => {
    setViewMonth((current) => new Date(current.getFullYear(), current.getMonth() + delta, 1));
  };

  const handleSelectDate = (cell: CalendarCell) => {
    if (!cell.inMonth || !isSelectable(cell.date, today)) return;
    onDateChange(toIsoDate(cell.date));
    onTimeChange("");
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <div className="lg:col-span-7 rounded-2xl border-4 border-[#1a1a1a] bg-white p-4 psd-tile-shadow md:p-6">
        <div className="mb-6 flex items-center justify-between">
          <button
            type="button"
            onClick={() => shiftMonth(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-[#1a1a1a] bg-[#fffef8] transition-colors hover:bg-[#f5f5f5]"
            aria-label="Previous month"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden />
          </button>
          <h3 className="font-black uppercase text-[#1a1a1a] text-[1.125rem] md:text-[1.25rem]">
            {monthLabel}
          </h3>
          <button
            type="button"
            onClick={() => shiftMonth(1)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-[#1a1a1a] bg-[#fffef8] transition-colors hover:bg-[#f5f5f5]"
            aria-label="Next month"
          >
            <ChevronRight className="h-5 w-5" aria-hidden />
          </button>
        </div>

        <div className="mb-3 grid grid-cols-7 gap-2 text-center">
          {WEEKDAY_LABELS.map((label) => (
            <div key={label} className="text-[10px] font-bold text-[#525252] md:text-xs">
              {label}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2" role="grid" aria-label="Appointment calendar">
          {cells.map((cell) => {
            const iso = toIsoDate(cell.date);
            const selected = date === iso;
            const available = cell.inMonth && hasAvailability(cell.date, today);
            const selectable = cell.inMonth && isSelectable(cell.date, today);
            const dimmed = cell.inMonth && !selectable && !isPastDate(cell.date, today);
            const outside = !cell.inMonth;

            return (
              <button
                key={iso + (cell.inMonth ? "" : "-pad")}
                type="button"
                disabled={!selectable}
                onClick={() => handleSelectDate(cell)}
                className={`relative flex aspect-square flex-col items-center justify-center rounded-lg border-2 text-sm font-bold transition-colors ${
                  selected
                    ? "border-[#1a1a1a] bg-[#ef4444] text-white psd-tile-shadow"
                    : selectable
                      ? "border-[#3b82f6] bg-[#eff6ff] text-[#1a1a1a] hover:bg-[#dbeafe]"
                      : dimmed
                        ? "cursor-not-allowed border-[#e5e5e5] bg-[#f5f5f5] text-[#a3a3a3] opacity-60"
                        : outside
                          ? "cursor-default border-transparent text-[#c0c0c0]"
                          : "cursor-not-allowed border-[#e5e5e5] bg-[#fafafa] text-[#a3a3a3] opacity-50"
                }`}
                aria-pressed={selected}
                aria-label={
                  cell.inMonth
                    ? `${cell.date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}${
                        selectable ? ", available" : ", unavailable"
                      }`
                    : undefined
                }
              >
                <span>{cell.date.getDate()}</span>
                {available && !selected ? (
                  <Star
                    className="absolute right-1 top-1 h-3 w-3 fill-[#eab308] text-[#eab308]"
                    aria-hidden
                  />
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      <div className="lg:col-span-5">
        <div className="rounded-2xl border-4 border-[#1a1a1a] bg-[#3b82f6] p-4 text-white psd-tile-shadow md:p-6">
          <div className="mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5" aria-hidden />
            <h4 className="text-sm font-black uppercase">Select your start time</h4>
          </div>

          {!date ? (
            <p className="rounded-xl border-2 border-white/30 bg-white/10 p-4 text-sm leading-6">
              Pick a starred day on the calendar first — then choose a time slot below.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {APPOINTMENT_TIME_SLOTS.map((slot) => {
                const active = time === slot;
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => onTimeChange(slot)}
                    className={`flex items-center justify-between rounded-lg border-2 border-[#1a1a1a] p-3 text-left text-sm font-bold transition-all ${
                      active
                        ? "bg-[#eab308] text-[#1a1a1a] psd-tile-shadow"
                        : "bg-white text-[#1a1a1a] hover:-translate-y-0.5 hover:bg-[#eff6ff]"
                    }`}
                    aria-pressed={active}
                  >
                    <span>{slot}</span>
                    <Star
                      className={`h-4 w-4 shrink-0 ${active ? "fill-[#1a1a1a] text-[#1a1a1a]" : "opacity-0"}`}
                      aria-hidden
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function formatAppointmentDate(isoDate: string): string {
  const parsed = parseIsoDate(isoDate);
  if (!parsed) return isoDate;
  return parsed.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
